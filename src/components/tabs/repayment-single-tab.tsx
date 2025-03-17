'use client';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types
import { GetCustomerSchema, GetLoanSchema, RepaymentMethodEnum } from "@/types";
import { changeScheduleStatusAction } from "@/actions/change-schedule-status.action";
import { toast } from "sonner";

// React
import { useActionState, useEffect, useState } from "react";

// Loan Calculation Component
export default function RepaymentSingleTab({ selectedLoan, selectedCustomer, loanOfficer, onBack }: {
    selectedLoan: GetLoanSchema;
    selectedCustomer: GetCustomerSchema;
    loanOfficer: string;
    onBack: () => void;
}) {
    // Loan Schedule Handler
    const [loanSchedules, setLoanSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetchLoanSchedule = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/getOneLoan?loanId=${selectedLoan.id}`);
            const data = await response.json();
            const loanSchedule = data.loanData;

            setLoanSchedules(loanSchedule.loan_schedules);
        } catch (error) {
            console.error("Failed to fetch loan schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Action
    const [state, formAction, isPending] = useActionState(changeScheduleStatusAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(state?.message);
            fetchLoanSchedule();
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    // Input Text Handler
    const repaymentMethodMap: Record<RepaymentMethodEnum, string> = {
        [RepaymentMethodEnum.Equal]: "Equal",
        [RepaymentMethodEnum.Equal_Principal]: "Equal Principal",
        [RepaymentMethodEnum.Bullet]: "Bullet",
    };

    // Checkbox Handler
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
    const handleCheckboxChange = (rowId: number) => {
        setSelectedScheduleId(selectedScheduleId === rowId ? null : rowId);
    };

    return (
        <div className="space-y-8">
            <form action={formAction}>
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

                <Card className="mt-2">
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
                            <div className="col-span-1 flex items-end justify-self-end">
                                <ScheduleActionButton selectedSchedule={loanSchedules.find(s => s.id === selectedScheduleId) || null} isPending={isPending} />
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
                                    <TableHead className="text-right">Select</TableHead>
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
                                    loanSchedules
                                        .sort((a, b) => a.period - b.period)
                                        .map((schedule, index) => {
                                            const today = new Date().toISOString().split("T")[0];
                                            const paymentDate = schedule.payment_date.split("T")[0];

                                            const isPastDate = paymentDate < today;
                                            const isToday = paymentDate === today;
                                            const isPaid = schedule.loan_payment_status;
                                            const isScheduled = !isPastDate && !isPaid;

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[20px]">{schedule.period}</TableCell>
                                                    <TableCell className="text-center">{paymentDate}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.principal).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.interest).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">{Number(schedule.total).toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">
                                                        {isPaid ? (
                                                            <span className="text-green-600 font-bold">Paid</span>
                                                        ) : isPastDate ? (
                                                            <span className="text-red-600 font-bold">Overdue</span>
                                                        ) : (
                                                            <span className="text-gray-800">Scheduled</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {(!isScheduled || isToday) && (
                                                            <Checkbox
                                                                checked={selectedScheduleId === schedule.id}
                                                                onCheckedChange={() => handleCheckboxChange(schedule.id)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <input name="selectedSchedule" value={selectedScheduleId ? JSON.stringify({ id: selectedScheduleId, status: loanSchedules.find(s => s.id === selectedScheduleId)?.loan_payment_status }) : ""} hidden readOnly />
            </form>
        </div>
    );
}

const ScheduleActionButton = ({ selectedSchedule, isPending }: {
    selectedSchedule: any | null;
    isPending: boolean;
}) => {
    let buttonText = "Please Select a Schedule";
    let buttonClass = "bg-gray-700 text-white cursor-not-allowed";
    let isDisabled = true;

    if (selectedSchedule) {
        const today = new Date().toISOString().split("T")[0];
        const paymentDate = selectedSchedule.payment_date.split("T")[0];
        const isToday = paymentDate === today;
        const isPastDate = new Date(paymentDate) <= new Date();

        if (selectedSchedule.loan_payment_status) {
            if (isToday) {
                buttonText = "Mark as Scheduled";
                buttonClass = "bg-gray-700 hover:bg-gray-800 text-white";
                isDisabled = false;
            } else {
                buttonText = "Mark as Overdue";
                buttonClass = "bg-red-600 hover:bg-red-700 text-white";
                isDisabled = false;
            }
        } else {
            if (isPastDate) {
                buttonText = "Mark as Paid";
                buttonClass = "bg-green-600 hover:bg-green-700 text-white";
                isDisabled = false;
            }
        }
    }

    return (
        <Button type="submit" disabled={isDisabled || isPending} className={`${buttonClass} w-full py-2`} >
            {isPending ? "Processing..." : buttonText}
        </Button>
    );
};
