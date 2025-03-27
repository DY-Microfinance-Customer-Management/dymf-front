'use client';

// Action
import { changeScheduleStatusAction } from "@/actions/change-schedule-status.action";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

// Types
import { LoanScheduleSchema } from "@/types";

// React
import { useActionState, useEffect, useState } from "react";

export default function Page() {
    const [state, formAction, isPending] = useActionState(changeScheduleStatusAction, null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [schedules, setSchedules] = useState<LoanScheduleSchema[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

    useEffect(() => {
        if (state === null) return;
        if (state?.status === 200) {
            toast.success(state?.message);
            fetchSchedules(currentPage);
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    const fetchSchedules = async (page = 1) => {
        setIsLoading(true);
        setSchedules([]);
        try {
            const response = await fetch(`/api/getSchedules?start_date=${startDate}&end_date=${endDate}&page=${page}`);
            const data = await response.json();
            if (data && data.schedules) {
                setSchedules(data.schedules);
                setTotalPages(data.totalPages);
                setCurrentPage(page);
            } else {
                setSchedules([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Failed to fetch repayment schedules:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (rowId: number) => {
        setSelectedScheduleId(selectedScheduleId === rowId ? null : rowId);
    };

    const renderPagination = () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => currentPage > 1 && fetchSchedules(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={i + 1 === currentPage} onClick={() => fetchSchedules(i + 1)}>
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext href="#" onClick={() => currentPage < totalPages && fetchSchedules(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );

    return (
        <div className="flex flex-col p-6 space-y-6">
            <form action={formAction}>
                <div className="flex justify-between w-full max-w-3xl mb-8">
                    <h1 className="text-3xl font-bold">Repayment (Batch)</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Search Repayment Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <Label>Start Date</Label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="col-span-1">
                                <Label>End Date</Label>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className="col-span-1 flex justify-end items-end">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => fetchSchedules(1)} disabled={isLoading}>
                                    {isLoading ? "Searching..." : "Search"}
                                </Button>
                            </div>
                            <div className="col-span-3 flex justify-end items-end mt-8 mb-2">
                                <ScheduleActionButton selectedSchedule={schedules.find(s => s.id === selectedScheduleId) || null} isPending={isPending} />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Loan No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>NRC No.</TableHead>
                                    <TableHead>CP No.</TableHead>
                                    <TableHead>Principal</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-center">Select</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-4">Loading...</TableCell>
                                    </TableRow>
                                ) : schedules.length > 0 ? (
                                    schedules.map((schedule, index) => {
                                        const today = new Date().toISOString().split("T")[0];
                                        const paymentDate = schedule.payment_date.split("T")[0];
                                        const isPastDate = paymentDate < today;
                                        const isToday = paymentDate === today;
                                        const isPaid = schedule.loan_payment_status;
                                        const isScheduled = !isPastDate && !isPaid;

                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{paymentDate}</TableCell>
                                                <TableCell>{schedule.loan.id.toString().padStart(8, '0')}</TableCell>
                                                <TableCell>{schedule.loan.customer.name}</TableCell>
                                                <TableCell>{schedule.loan.customer.nrc_number}</TableCell>
                                                <TableCell>{schedule.loan.customer.cp_number.area_number}</TableCell>
                                                <TableCell>{Number(schedule.principal).toLocaleString()}</TableCell>
                                                <TableCell>{Number(schedule.interest).toLocaleString()}</TableCell>
                                                <TableCell>{Number(schedule.total).toLocaleString()}</TableCell>
                                                <TableCell className="text-right">
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
                                                        <Checkbox checked={selectedScheduleId === schedule.id} onCheckedChange={() => handleCheckboxChange(schedule.id)} />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-4">No records found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {totalPages > 1 && <div className="mt-6 flex justify-center">{renderPagination()}</div>}
                        <input name="selectedSchedule" value={selectedScheduleId ? JSON.stringify({ id: selectedScheduleId, status: schedules.find(s => s.id === selectedScheduleId)?.loan_payment_status }) : ""} hidden readOnly />
                    </CardContent>
                </Card>
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
        <Button type="submit" disabled={isDisabled || isPending} className={`${buttonClass} w-full py-2`}>
            {isPending ? "Processing..." : buttonText}
        </Button>
    );
};
