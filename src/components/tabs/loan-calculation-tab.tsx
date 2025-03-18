'use client';

// React
import { useEffect, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Icons
import { ChevronDown } from "lucide-react";

// Types
import { GetCustomerSchema } from "@/types";

// Loan Calculation Component
export default function LoanCalculationTab({ selectedCustomer, setIsCalculated, confirmData, setConfirmData }: {
    selectedCustomer: GetCustomerSchema;
    setIsCalculated: (value: boolean) => void;
    confirmData: {
        contractDate: string;
        loanAmount: number | null;
        repaymentCycle: number | null;
        interestRate: number;
        numberOfRepayment: number | null;
        repaymentMethod: string;
        loanOfficer: string;
    };
    setConfirmData: (data: any) => void;
}) {
    const [schedule, setSchedule] = useState<{ date: string; principal: number; interest: number; total: number; balance: number }[]>([]);
    const [loanOfficer, setLoanOfficer] = useState('-');
    const [assignedLoanOfficer, setAssignedLoanOfficer] = useState<number | null>(null);

    // Calculate Button Handler
    const isCalculateDisabled =
        confirmData.loanAmount === null ||
        confirmData.repaymentCycle === null ||
        confirmData.interestRate === null ||
        confirmData.numberOfRepayment === null ||
        confirmData.repaymentMethod === "";

    useEffect(() => {
        setIsCalculated(false);
    }, [confirmData]);

    // Loan Officer Data Handler
    const [availableLoanOfficers, setAvailableLoanOfficers] = useState<{ id: number, name: string }[]>([]);
    useEffect(() => {
        fetch(`/api/getAvailableLoanOfficers?cpNumber=${selectedCustomer.cp_number.id}`)
            .then((res) => res.json())
            .then((data) => {
                setAvailableLoanOfficers(data.availableLoanOfficers);
            });
    }, []);

    const handleRepaymentMethod = (value: string) => {
        setConfirmData({ ...confirmData, repaymentMethod: value });
    };

    const handleLoanOfficer = (id: number, name: string) => {
        setLoanOfficer(name);
        setAssignedLoanOfficer(id);
        setConfirmData((prev: any) => ({ ...prev, loanOfficer: name }));
    };

    const calculateSchedule = () => {
        if (
            confirmData.loanAmount === null ||
            confirmData.repaymentCycle === null ||
            confirmData.numberOfRepayment === null ||
            confirmData.interestRate === null
        ) return;

        const result = [];
        const loanAmount = confirmData.loanAmount;
        const numberOfRepayment = confirmData.numberOfRepayment;
        const interestRate = confirmData.interestRate;
        const repaymentCycle = confirmData.repaymentCycle;

        if (loanAmount <= 0 || numberOfRepayment <= 0 || interestRate <= 0 || repaymentCycle <= 0) return;

        const monthlyPrincipal = Math.floor(loanAmount / numberOfRepayment);
        let remainingBalance = loanAmount;

        for (let i = 1; i <= numberOfRepayment; i++) {
            const interest = Math.floor((remainingBalance * (interestRate / 100)) / 12);
            const totalPayment = monthlyPrincipal + interest;
            remainingBalance -= monthlyPrincipal;

            result.push({
                date: calculateDate(new Date(), repaymentCycle, i),
                principal: monthlyPrincipal,
                interest: interest,
                total: totalPayment,
                balance: remainingBalance,
            });
        }

        setSchedule(result);
        setIsCalculated(true);
    };

    const calculateDate = (startDate: Date, cycle: number, index: number) => {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + cycle * index);
        return nextDate.toISOString().split("T")[0];
    };

    const calculateTotals = () => {
        const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
        const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
        const totalPayment = schedule.reduce((sum, row) => sum + row.total, 0);

        return { totalPrincipal, totalInterest, totalPayment };
    };

    const totals = calculateTotals();

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Loan Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <Label>Loan No.</Label>
                            <Input disabled name="loanNumber" type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Contract Date</Label>
                            <Input name="contractDate" type="date" value={confirmData.contractDate} onChange={(e) => setConfirmData({ ...confirmData, contractDate: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                            <Label>CP No.</Label>
                            <Input disabled name="cpNumber" value={selectedCustomer.cp_number.area_number} type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Loan Type</Label>
                            <Input disabled name="loanType" value={selectedCustomer.loan_type ? 'Special Loan' : 'Group Loan'} type="text" />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1">
                            <Label>Loan Officer</Label>
                            <DropdownMenu>
                                <input required name="loanOfficer" value={assignedLoanOfficer ? assignedLoanOfficer : ''} hidden readOnly />
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                        {loanOfficer}
                                        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {availableLoanOfficers.map((officer) => (
                                        <DropdownMenuItem key={officer.id} onClick={() => handleLoanOfficer(officer.id, officer.name)}>
                                            {officer.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Loan Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Loan Amount</Label>
                                <Input type="number" name="loanAmount" value={confirmData.loanAmount ?? ""} onChange={(e) => setConfirmData({ ...confirmData, loanAmount: e.target.value ? Number(e.target.value) : null })} />
                            </div>
                            <Label>MMK</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Repayment Cycle</Label>
                                <Input type="number" name="repaymentCycle" value={confirmData.repaymentCycle ?? ""} onChange={(e) => setConfirmData({ ...confirmData, repaymentCycle: e.target.value ? Number(e.target.value) : null })} />
                            </div>
                            <Label>days</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Interest Rate</Label>
                                <Input type="number" name="interestRate" value={confirmData.interestRate} onChange={(e) => setConfirmData({ ...confirmData, interestRate: Number(e.target.value) })} />
                            </div>
                            <Label>%</Label>
                        </div>
                        <div className="col-span-1">
                            <Label>Number of Repayment</Label>
                            <Input type="number" name="numberOfRepayment" value={confirmData.numberOfRepayment ?? ""} onChange={(e) => setConfirmData({ ...confirmData, numberOfRepayment: e.target.value ? Number(e.target.value) : null })} />
                        </div>
                        <div className="col-span-1">
                            <Label>Repayment Method</Label>
                            <DropdownMenu>
                                <input required name="repaymentMethod" value={confirmData.repaymentMethod} hidden readOnly />
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                        {confirmData.repaymentMethod}
                                        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleRepaymentMethod("Equal")}>Equal</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRepaymentMethod("Equal Principal")}>Equal Principal</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRepaymentMethod("Bullet")}>Bullet</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="col-span-1 flex items-end justify-self-end">
                            <Button type="button" disabled={isCalculateDisabled} onClick={calculateSchedule} className="bg-blue-600 text-white hover:bg-blue-700">Calculate</Button>
                        </div>
                    </div>

                    <Table className="mt-8">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Principal</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Remaining Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        {schedule.length > 0 && (
                            <TableBody>
                                {schedule.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell className="text-right">
                                            {row.principal.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {row.interest.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {row.total.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {row.balance.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {schedule.length > 0 && (
                                    <TableRow className="bg-gray-100 font-bold">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">
                                            {totals.totalPrincipal.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {totals.totalInterest.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {totals.totalPayment.toLocaleString()}
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
