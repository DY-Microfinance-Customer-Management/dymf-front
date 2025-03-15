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
import { GetCustomerSchema, GetLoanSchema, RepaymentMethodEnum } from "@/types";

// Loan Calculation Component
export default function LoanDetailsTab({ selectedLoan, selectedCustomer, loanOfficer }:
    {
        selectedLoan: GetLoanSchema;
        selectedCustomer: GetCustomerSchema;
        loanOfficer: string;
    }) {

    const repaymentMethodMap: Record<RepaymentMethodEnum, string> = {
        [RepaymentMethodEnum.Equal]: "Equal",
        [RepaymentMethodEnum.Equal_Principal]: "Equal Principal",
        [RepaymentMethodEnum.Bullet]: "Bullet",
    };

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
                            <Input disabled value={selectedLoan.id.toString().padStart(8, '0')} type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Contract Date</Label>
                            <Input type="date" defaultValue={selectedLoan.contract_date.split("T")[0]} disabled />
                        </div>
                        <div className="col-span-1">
                            <Label>CP No.</Label>
                            <Input disabled value={selectedCustomer.cp_number.area_number} type="text" />
                        </div>
                        <div className="col-span-1">
                            <Label>Loan Type</Label>
                            <Input disabled value={selectedLoan.customer.loan_type ? 'Special Loan' : 'Group Loan'} type="text" />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1">
                            <Label>Loan Officer</Label>
                            <Input disabled value={loanOfficer} type="text" />
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
                                <Input
                                    type="number"
                                    value={selectedLoan.loan_amount ?? ""}
                                    disabled
                                />
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
                        {/* <div className="col-span-1 flex items-end justify-self-end">
                            <Button type="button" disabled={isCalculateDisabled} onClick={calculateSchedule} className="bg-blue-600 text-white hover:bg-blue-700">Calculate</Button>
                        </div> */}
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
                        {/* {schedule.length > 0 && (
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
                        )} */}
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
