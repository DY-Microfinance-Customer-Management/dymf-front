'use client';

// Action
import { createCheckPointAction } from "@/actions/create-checkpoint.action";

// Components: UI
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Context
import { useUser } from "@/context/UserProvider"

// React
import { useActionState, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";

// Types
import { GetCheckPointSchema, GetLoanOfficerSchema } from "@/types";

export default function Page() {
    const [cpNumbers, setCpNumbers] = useState<GetCheckPointSchema[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tempCpNumbers, setTempCpNumbers] = useState<GetCheckPointSchema[]>([]);
    const [loanOfficers, setLoanOfficers] = useState<GetLoanOfficerSchema[]>([]);
    const [expandedCP, setExpandedCP] = useState<number | null>(null);
    const [modifiedMap, setModifiedMap] = useState<{ [cpId: number]: boolean }>({});
    const [dialogOpenCP, setDialogOpenCP] = useState<number | null>(null);

    // Context
    const { username, userRole } = useUser();

    // Server Action
    const [state, formAction, isPending] = useActionState(createCheckPointAction, null);

    const fetchCpNumbers = async (nextCursor: string | null = null) => {
        if (loading || !hasMore) return;
        setLoading(true);

        const params = new URLSearchParams({
            order: "sc",
            goBack: "false",
        });

        if (nextCursor) params.append("cursor", nextCursor);

        const res = await fetch(`/api/getCpNumbers?${params.toString()}`);
        const data = await res.json();

        if (data.count === 0 || data.cpNumbers.length === 0) {
            setHasMore(false);
        } else {
            setCpNumbers(prev => {
                const merged = [...prev, ...data.cpNumbers];
                const unique = Array.from(new Map(merged.map(cp => [cp.id, cp])).values());
                return unique;
            });
            setCursor(data.nextCursor ?? null);
        }

        setLoading(false);
    };

    // Init
    useEffect(() => {
        fetchCpNumbers(); // 첫 20개
    }, []);

    useEffect(() => {
        fetch('/api/getLoanOfficers')
            .then((res) => res.json())
            .then((data) => {
                setLoanOfficers(data.loanOfficers);
            });

        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`CP No. ${state.message} is successfully registered!`);
        } else if (state?.status === 400) {
            toast.error(state?.message);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
        } else if (state?.status === 404) {
            toast.error(state?.message);
        }
    }, [state]);

    // Assign Switch Handler
    const handleSwitchChange = (cpId: number, officerId: number, checked: boolean) => {
        setCpNumbers(prev => {
            return prev.map(cp => {
                if (cp.id !== cpId) return cp;

                const updatedLoanOfficers = checked
                    ? [...cp.loan_officers, { id: officerId } as GetLoanOfficerSchema]
                    : cp.loan_officers.filter(officer => officer.id !== officerId);

                return {
                    ...cp,
                    loan_officers: updatedLoanOfficers
                };
            });
        });

        // Save Button disable Handler
        setModifiedMap(prev => {
            const updatedLoanOfficers = checked
                ? [...(cpNumbers.find(cp => cp.id === cpId)?.loan_officers || []), { id: officerId } as GetLoanOfficerSchema]
                : (cpNumbers.find(cp => cp.id === cpId)?.loan_officers.filter(officer => officer.id !== officerId) || []);

            const originalLoanOfficers = tempCpNumbers.find(cp => cp.id === cpId)?.loan_officers || [];
            const isSameAsOriginal = JSON.stringify(updatedLoanOfficers) === JSON.stringify(originalLoanOfficers);

            return {
                ...prev,
                [cpId]: !isSameAsOriginal
            };
        });
    };

    // Dialog Confirm Handler
    const handleSaveChanges = (cpId: number) => {
        setDialogOpenCP(cpId);
    };

    // Dialog Cancel Handler
    const handleCancelChanges = (cpId: number) => {
        setCpNumbers(tempCpNumbers);
        setModifiedMap(prev => ({
            ...prev,
            [cpId]: false
        }));
        setDialogOpenCP(null);
    };

    // Assign Loan Officer Handler
    const confirmSaveChanges = async (cpId: number) => {
        const updatedCP = cpNumbers.find(cp => cp.id === cpId);
        if (!updatedCP) return;

        const response = await fetch(`/api/assignLoanOfficer?cpNumber=${cpId}&data=${JSON.stringify(updatedCP?.loan_officers)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            toast.success("Changes saved successfully!");
            setModifiedMap(prev => ({
                ...prev,
                [cpId]: false
            }));
            setDialogOpenCP(null);
            setTempCpNumbers(cpNumbers);
        } else {
            toast.error("Failed to save changes.");
        }
    };

    // Scroll Handler
    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        if (!hasMore || loading) return;
        
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (Math.floor(scrollTop + clientHeight) === scrollHeight && hasMore) {
            fetchCpNumbers(cursor);
        }
    };

    return (
        <>
            <div className="flex flex-col p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Collection Point Management</h1>
                    <div className="space-x-4">
                        {userRole === 0 && (
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
                        )}
                        {/* TODO: Delete Function Update - Check if loan officer is assigned to that certain cp number and also if cp number is assigned to a Loan */}
                        {/* <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!selectedCP} onClick={handleDelete}>Delete</Button> */}
                    </div>
                </div>

                <ScrollArea className="h-[600px] w-full border rounded-md" onScrollCapture={scrollHandler}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">CP No.</TableHead>
                                <TableHead className="w-[300px] break-all max-w-[300px]">Description</TableHead>
                                <TableHead>Assigned Loan Officers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cpNumbers.map(cp => (
                                <Fragment key={`cp-${cp.id}`}>
                                    <TableRow key={`row-${cp.id}`} className="cursor-pointer hover:bg-gray-100">
                                        <TableCell>{cp.area_number}</TableCell>
                                        <TableCell className="w-[300px] break-all max-w-[300px]">{cp.description}</TableCell>
                                        <TableCell className="flex justify-between items-center">
                                            {cp.loan_officers.length > 0
                                                ? loanOfficers
                                                    .filter(officer => cp.loan_officers.some(lo => lo.id === officer.id))
                                                    .map(officer => officer.name)
                                                    .join(", ")
                                                : "Not Assigned"}
                                            {userRole === 0 && (
                                                <button onClick={() => setExpandedCP(expandedCP === cp.id ? null : cp.id)}>
                                                    {expandedCP === cp.id ? <ChevronUp /> : <ChevronDown />}
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {expandedCP === cp.id && (
                                        <TableRow className="bg-gray-50">
                                            <TableCell colSpan={3}>
                                                <div className="p-4 space-y-2">
                                                    {loanOfficers.map(officer => {
                                                        const isInitiallyAssigned = tempCpNumbers
                                                            .find(c => c.id === cp.id)
                                                            ?.loan_officers.some(lo => lo.id === officer.id) ?? false;

                                                        return (
                                                            <div key={officer.id} className="flex justify-between items-center py-2 border-b">
                                                                <span>{officer.name}</span>
                                                                <Switch checked={cp.loan_officers.some(lo => lo.id === officer.id)} onCheckedChange={checked => handleSwitchChange(cp.id, officer.id, checked)} disabled={isInitiallyAssigned} />
                                                            </div>
                                                        );
                                                    })}
                                                    <Button onClick={() => handleSaveChanges(cp.id)} disabled={!modifiedMap[cp.id]} className="bg-blue-600 hover:bg-blue-700 text-white flex justify-self-end">
                                                        Save
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    {loading && <div className="p-4 text-center">Loading...</div>}
                    {!hasMore && <div className="p-4 text-center">No more data</div>}
                </ScrollArea>
            </div>

            {dialogOpenCP !== null && (
                <Dialog open={true} onOpenChange={() => setDialogOpenCP(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Changes</DialogTitle>
                            <p>Once assigned, loan officers cannot be removed. Are you sure you want to proceed?</p>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => handleCancelChanges(dialogOpenCP)}>Cancel</Button>
                            <Button onClick={() => confirmSaveChanges(dialogOpenCP)} className="bg-blue-600 hover:bg-blue-700 text-white">Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
