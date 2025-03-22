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
import { GetLoanSchema, RepaymentMethodEnum, GetOverdueLoanScheduleSchema } from "@/types";

// Loan Calculation Component
export default function OverdueLoanManagementTab({ selectedLoan }: {
    selectedLoan: GetLoanSchema;
}) {
    // Loan Schedule Handler
    const [loanSchedules, setLoanSchedules] = useState<GetOverdueLoanScheduleSchema[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetchLoanSchedule = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/getOneLoan?loanId=${selectedLoan.id}&overdueStatus=1`);
            const data = await response.json();
            const loanSchedule = data.loanData;

            setLoanSchedules(loanSchedule.overdue_Schedules);
        } catch (error) {
            console.error("Failed to fetch loan schedule:", error);
        } finally {
            setIsLoading(false);
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
                            <Input disabled value={selectedLoan.customer.loan_type ? 'Special Loan' : 'Group Loan'} type="text" />
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
                                <TableHead>Payment Date</TableHead>
                                <TableHead className="text-center">Principal</TableHead>
                                <TableHead className="text-center">Interest</TableHead>
                                <TableHead className="text-center">Overdue Interest</TableHead>
                                <TableHead className="text-center">Received Principal</TableHead>
                                <TableHead className="text-center">Received Interest</TableHead>
                                <TableHead className="text-right">Received Overdue Interest</TableHead>
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
                                            .sort((a, b) => a.id - b.id)
                                            .map((schedule, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{schedule.payment_date.split("T")[0]}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.principal).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.interest).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.overdue_interest).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">
                                                        {schedule.overdue_transaction?.received_principal !== undefined ? (
                                                            Number(schedule.overdue_transaction?.received_principal).toLocaleString()
                                                        ) : (
                                                            <Input className="border-blue-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" placeholder="Enter Value" type="number" name="receivedPrincipal" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {schedule.overdue_transaction?.received_interest !== undefined ? (
                                                            Number(schedule.overdue_transaction?.received_interest).toLocaleString()
                                                        ) : (
                                                            <Input className="border-blue-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" placeholder="Enter Value" type="number" name="receivedInterest" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {schedule.overdue_transaction?.received_overdue_interest !== undefined ? (
                                                            Number(schedule.overdue_transaction?.received_overdue_interest).toLocaleString()
                                                        ) : (
                                                            <Input className="border-blue-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" placeholder="Enter Value" type="number" name="receivedOverdueInterest" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    }
                                </>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <input name="loanId" value={selectedLoan.id} hidden readOnly />
        </div>
    );
}
