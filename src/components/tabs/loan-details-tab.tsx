'use client';

// React
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types
import { GetLoanSchema, RepaymentMethodEnum } from "@/types";

// Loan Calculation Component
export default function LoanDetailsTab({ selectedLoan }: {
    selectedLoan: GetLoanSchema;
}) {
    // Loan Schedule Handler
    const [loanSchedules, setLoanSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetchLoanSchedule = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/getOneLoan?loanId=${selectedLoan.id}&overdueStatus=0`);
            const data = await response.json();
            const loanSchedule = data.loanData;

            setLoanSchedules(loanSchedule.loan_schedules);
        } catch (error) {
            console.error("Failed to fetch loan schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPrincipal = loanSchedules.reduce((sum, row) => sum + Number(row.principal), 0);
    const totalInterest = loanSchedules.reduce((sum, row) => sum + Number(row.interest), 0);
    const totalPayment = loanSchedules.reduce((sum, row) => sum + Number(row.total), 0);

    const totalPaidPrincipal = loanSchedules.filter(row => row.loan_payment_status).reduce((sum, row) => sum + Number(row.principal), 0);
    const totalPaidInterest = loanSchedules.filter(row => row.loan_payment_status).reduce((sum, row) => sum + Number(row.interest), 0);
    const totalPaidPayment = loanSchedules.filter(row => row.loan_payment_status).reduce((sum, row) => sum + Number(row.total), 0);

    const totalRemainingPrincipal = loanSchedules.filter(row => !row.loan_payment_status).reduce((sum, row) => sum + Number(row.principal), 0);
    const totalRemainingInterest = loanSchedules.filter(row => !row.loan_payment_status).reduce((sum, row) => sum + Number(row.interest), 0);
    const totalRemainingPayment = loanSchedules.filter(row => !row.loan_payment_status).reduce((sum, row) => sum + Number(row.total), 0);

    const getStatus = (schedule: any) => {
        if (schedule.loan_payment_status) {
            return <span className="text-green-600 font-semibold">Paid</span>;
        }

        const paymentDate = new Date(schedule.payment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (paymentDate < today) {
            return <span className="text-red-600 font-semibold">Overdue</span>;
        } else {
            return <span className="text-black font-semibold">Scheduled</span>;
        }
    };

    const repaymentMethodMap: Record<RepaymentMethodEnum, string> = {
        [RepaymentMethodEnum.Equal]: "Equal",
        [RepaymentMethodEnum.Equal_Principal]: "Equal Principal",
        [RepaymentMethodEnum.Bullet]: "Bullet",
    };

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
                            <Input disabled value={selectedLoan.id.toString().padStart(8, '0')} type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Contract Date</Label>
                            <Input type="date" defaultValue={selectedLoan.contract_date.split("T")[0]} disabled />
                        </div>
                        <div className="col-span-1">
                            <Label>CP No.</Label>
                            <Input disabled value={selectedLoan.customer.cp_number.area_number} type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Loan Type</Label>
                            <Input disabled value={selectedLoan.customer.loan_type === 0 ? 'Special Loan' : 'Group Loan'} type="text" />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1">
                            <Label>Loan Officer</Label>
                            <Input disabled value={selectedLoan.loan_officer.personnel_id.name} type="text" />
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
                                <Input type="number" value={selectedLoan.loan_amount ?? ""} disabled />
                            </div>
                            <Label>MMK</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Repayment Cycle</Label>
                                <Input type="number" value={selectedLoan.repayment_cycle ?? ""} disabled />
                            </div>
                            <Label>days</Label>
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Interest Rate</Label>
                                <Input type="number" value={Math.floor(selectedLoan.interest_rate * 100)} disabled />
                            </div>
                            <Label>%</Label>
                        </div>
                        <div className="col-span-1">
                            <Label>Number of Repayment</Label>
                            <Input type="number" value={selectedLoan.number_of_repayment ?? ""} disabled />
                        </div>
                        <div className="col-span-1">
                            <Label>Repayment Method</Label>
                            <Input value={repaymentMethodMap[selectedLoan.repayment_method]} disabled />
                        </div>
                    </div>

                    <Table className="mt-8">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-center">Payment Date</TableHead>
                                <TableHead className="text-center">Principal</TableHead>
                                <TableHead className="text-center">Interest</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Remaining Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loanSchedules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
                                        <Button onClick={fetchLoanSchedule} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                                            {isLoading ? "Loading..." : "View Schedule"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {
                                        loanSchedules
                                            .sort((a, b) => a.period - b.period)
                                            .map((schedule, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[20px]">{schedule.period}</TableCell>
                                                    <TableCell className="text-center">{schedule.payment_date.split("T")[0]}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.principal).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.interest).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.total).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{getStatus(schedule)}</TableCell>
                                                    <TableCell className="text-right">{Number(schedule.remaining_balance).toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))
                                    }
                                    <TableRow className="font-bold border-t">
                                        <TableCell colSpan={2} className="text-center">Total</TableCell>
                                        <TableCell className="text-center">{totalPrincipal.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">{totalInterest.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">{totalPayment.toLocaleString()}</TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                    <TableRow className="font-bold border-t">
                                        <TableCell colSpan={2} className="text-center text-green-600">Paid</TableCell>
                                        <TableCell className="text-center text-green-600">{totalPaidPrincipal.toLocaleString()}</TableCell>
                                        <TableCell className="text-center text-green-600">{totalPaidInterest.toLocaleString()}</TableCell>
                                        <TableCell className="text-center text-green-600">{totalPaidPayment.toLocaleString()}</TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                    <TableRow className="font-bold border-t">
                                        <TableCell colSpan={2} className="text-center text-red-600">Remaining</TableCell>
                                        <TableCell className="text-center text-red-600">{totalRemainingPrincipal.toLocaleString()}</TableCell>
                                        <TableCell className="text-center text-red-600">{totalRemainingInterest.toLocaleString()}</TableCell>
                                        <TableCell className="text-center text-red-600">{totalRemainingPayment.toLocaleString()}</TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
