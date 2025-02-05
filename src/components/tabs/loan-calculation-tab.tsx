'use client';

// React
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Icons
import { ChevronDown } from "lucide-react";

// Loan Calculation Component
export default function LoanCalculationTab() {
    const [schedule, setSchedule] = useState<{ date: string; principal: number; interest: number; total: number; balance: number }[]>([]);
    const [loanAmount, setLoanAmount] = useState<number>(0);
    const [repaymentCycle, setRepaymentCycle] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(28);
    const [numberOfRepayment, setNumberOfRepayment] = useState<number>(0);
    const [repaymentMethod, setRepaymentMethod] = useState('Equal');
    const [loanOfficer, setLoanOfficer] = useState('-');
    // const [totalPrincipal, setTotalPrincipal] = useState(0);
    // const [totalInterest, setTotalInterest] = useState(0);

    const handleRepaymentMethod = (value: string) => {
        setRepaymentMethod(value);
    };

    const handleLoanOfficer = (value: string) => {
        setLoanOfficer(value)
    };

    const calculateSchedule = () => {
        const result = [];
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
        <div className="space-y-8">
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
                            <Label>Loan Type</Label>
                            <Input disabled name="loanType" type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>CP No.</Label>
                            <Input disabled name="cpNumber" type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Contract Date</Label>
                            <Input name="contractDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1">
                            <Label>Loan Officer</Label>
                            <DropdownMenu>
                                <input required name="repaymentMethod" value={repaymentMethod} hidden readOnly />
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                        {loanOfficer}
                                        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {['John Doe', 'Hun', 'Young'].map((officer) => (
                                        <DropdownMenuItem key={officer} onClick={() => handleLoanOfficer(officer)}>
                                            {officer}
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
                                <Input name="loanAmount" type="number" onChange={(e) => setLoanAmount(Number(e.target.value))} />
                            </div>
                            <Label>MMK</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Repayment Cycle</Label>
                                <Input name="repaymentCycle" type="number" onChange={(e) => setRepaymentCycle(Number(e.target.value))} />
                            </div>
                            <Label>days</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Interest Rate</Label>
                                <Input name="interestRate" type="number" defaultValue={28} onChange={(e) => setInterestRate(Number(e.target.value))} />
                            </div>
                            <Label>%</Label>
                        </div>
                        <div className="col-span-1">
                            <Label>Number of Repayment</Label>
                            <Input name="numberOfRepayment" type="number" onChange={(e) => setNumberOfRepayment(Number(e.target.value))} />
                        </div>
                        <div className="col-span-1">
                            <Label>Repayment Method</Label>
                            <DropdownMenu>
                                <input required name="repaymentMethod" value={repaymentMethod} hidden readOnly />
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                        {repaymentMethod}
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
                            <Button type="button" onClick={calculateSchedule} className="bg-blue-600 text-white hover:bg-blue-700">Calculate</Button>
                        </div>
                    </div>

                    {/* Table Headers Always Visible */}
                    <Table className="mt-8">
                        <TableCaption>Enter details to calculate the repayment schedule</TableCaption>
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
                                {/* Totals Row */}
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
