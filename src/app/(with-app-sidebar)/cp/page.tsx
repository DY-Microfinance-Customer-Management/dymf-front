'use client';

// Actions
import { createCheckPointAction } from "@/actions/create-checkpoint.action";

// Components: UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// React
import { useActionState, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";

// Types
import { FetchedCheckPoint } from "@/types";

export default function Page() {
    const [cpNumbers, setCpNumbers] = useState<FetchedCheckPoint[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [loanOfficers, setLoanOfficers] = useState<string[]>([]);

    // Server Action
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createCheckPointAction, null);
    useEffect(() => {
        // Fetch all registered CP No.s
        fetch('/api/cpNumbers')
            .then((res) => res.json())
            .then((data) => {
                setCpNumbers(data.cpNumbers);
            });

        // Fetch all Loan Officers
        fetch('/api/loanOfficers')
            .then((res) => res.json())
            .then((data) => {
                setLoanOfficers(data);
            });

        setLoading(false);

        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`CP No. ${state.message} is successfully registered!`);
        } else if (state?.status === 400) {
            toast.error(state?.message);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.push('/login');
        } else if (state?.status === 404) {
            toast.error(state?.message);
        }
    }, [state]);

    // // Delete Handler (TODO: Delete Function 추후 업데이트)
    // const [selectedCP, setSelectedCP] = useState<number | null>(null);
    // const handleCheckboxChange = (cpId: number) => {
    //     setSelectedCP((prevSelected) => (prevSelected === cpId ? null : cpId));
    //     console.log(`selectedCP: ${selectedCP}`);
    // };
    // const handleDelete = async () => {
    //     if (!selectedCP) return;

    //     const remainingCPs = cpNumbers.filter((cp) => cp.id !== selectedCP);
    //     setCpNumbers(remainingCPs);
    //     setSelectedCP(null);

    //     toast.success(`CP No. ${selectedCP} deleted successfully!`);
    // };

    // Loan Officer Assign Handler
    const [expandedCP, setExpandedCP] = useState<number | null>(null); // 선택된 CP No.
    const [assignedLoanOfficer, setAssignedLoanOfficer] = useState<{ [key: number]: string[] }>({}); // 각 CP별 Loan Officer 정보
    const fetchLoanOfficers = async (cpId: number) => {
        if (assignedLoanOfficer[cpId]) {
            setExpandedCP(expandedCP === cpId ? null : cpId); // 이미 있으면 toggle
            return;
        }

        try {
            fetch(`/api/cpNumbers/loanOfficer?id=${cpId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setAssignedLoanOfficer((prev) => ({ ...prev, [cpId]: data.loanOfficers }));
                    setExpandedCP(cpId);
                });
        } catch (error) {
            console.error(`Error fetching Loan Officers for CP ${cpId}:`, error);
        }
    };
    const toggleOfficerAssignment = (cpId: number, officer: string) => {
        setAssignedLoanOfficer((prev) => {
            const updatedList = prev[cpId]?.includes(officer)
                ? prev[cpId].filter((o) => o !== officer)
                : [...(prev[cpId] || []), officer];

            return { ...prev, [cpId]: updatedList };
        });
    };

    return (
        <>
            <div className="flex flex-col p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Check Point Management</h1>
                    <div className="space-x-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add CP No.</DialogTitle>
                                </DialogHeader>
                                <form id="createCheckPointForm" action={formAction}>
                                    <div className="space-y-2">
                                        <Input name="area_number" disabled={isPending} type="text" placeholder="Enter CP No." required />
                                        <Input name="description" disabled={isPending} type="text" placeholder="Enter Description" required />
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button type="submit" form="createCheckPointForm">Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {/* TODO: Delete Function 추후 업데이트 */}
                        {/* <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!selectedCP} onClick={handleDelete}>Delete</Button> */}
                    </div>
                </div>
                {
                    isLoading ?
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">CP No.</TableHead>
                                        <TableHead className="w-[150px]">Description</TableHead>
                                        <TableHead className="text-right">Loan Officers</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        </>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[50px]"></TableHead> */}
                                    <TableHead className="w-[100px]">CP No.</TableHead>
                                    <TableHead className="w-[150px]">Description</TableHead>
                                    <TableHead className="text-right">Loan Officers</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cpNumbers.map((cp, index) => (
                                    <Fragment key={cp.id}>
                                        <TableRow className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{cp.area_number}</TableCell>
                                            <TableCell>{cp.description}</TableCell>
                                            <TableCell
                                                className="text-right cursor-pointer flex justify-between items-center"
                                                onClick={() => fetchLoanOfficers(cp.id)}
                                            >
                                                {assignedLoanOfficer[cp.id]?.length ? assignedLoanOfficer[cp.id].join(", ") : "Not Assigned"}
                                                {expandedCP === cp.id ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedCP === cp.id && (
                                            <TableRow className="bg-gray-50">
                                                <TableCell colSpan={3}>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-semibold mb-2">Assign Loan Officers</h3>
                                                        {assignedLoanOfficer[cp.id]?.map((officer) => (
                                                            <div key={officer} className="flex justify-between items-center py-2 border-b">
                                                                <span>{officer}</span>
                                                                <Switch
                                                                    checked={assignedLoanOfficer[cp.id]?.includes(officer)}
                                                                    onCheckedChange={() => toggleOfficerAssignment(cp.id, officer)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>


                                    // <Fragment key={cp.id}>
                                    //     <TableRow key={cp.id ?? `cp-${index}`}>
                                    //         {/* TODO: Delete Function 추후 업데이트 */}
                                    //         {/* <TableCell>
                                    //         <Checkbox checked={selectedCP === cp.id} onCheckedChange={() => handleCheckboxChange(cp.id)} />
                                    //     </TableCell> */}
                                    //         <TableCell>{cp.area_number}</TableCell>
                                    //         <TableCell>{cp.description}</TableCell>
                                    //         <TableCell className="text-right">
                                    //             {
                                    //                 cp.loan_officers === undefined ?
                                    //                     "Not Assigned" :
                                    //                     cp.loan_officers
                                    //             }
                                    //         </TableCell>
                                    //     </TableRow>
                                    // </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                }
            </div>
        </>
    );
}