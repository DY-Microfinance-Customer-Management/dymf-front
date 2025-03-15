'use client';

// Actions
import { deleteLoanAction } from "@/actions/delete-loan.action";

// Components: Tabs
import LoanDetailsTab from "@/components/tabs/loan-details-tab";
import GuarantorDetailsTab from "@/components/tabs/guarantor-details-tab";
import CollateralDetailsTab from "@/components/tabs/collateral-details-tab";
import ConsultingDetailsTab from "@/components/tabs/counseling-details-tab";

// Components: UI
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// React
import { useActionState, useEffect, useState } from "react";

// Types
import { GetCustomerSchema, GetLoanSchema } from "@/types";

export default function Page() {
    const [selectedLoan, setSelectedLoan] = useState<GetLoanSchema | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(true);

    const confirmSelection = (loan: GetLoanSchema) => {
        setSelectedLoan(loan);
        setIsConfirming(false);
    };

    const goBackToSelectLoan = () => {
        setSelectedLoan(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {selectedLoan && !isConfirming ? (
                <LoanDetailsPage selectedLoan={selectedLoan} onBack={goBackToSelectLoan} />
            ) : (
                <SelectLoanPage onConfirm={confirmSelection} />
            )}
        </div>
    );
}

// Select Loan Page
function SelectLoanPage({ onConfirm }: { onConfirm: (loan: GetLoanSchema) => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loans, setLoans] = useState<GetLoanSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState("");
    const [remainingLoanCnt, setRemainingLoanCnt] = useState<number>(1);

    const fetchLoan = (cursor: string, query: string = "") => {
        setLoading(true);
        let apiUrl = `/api/getLoans?cursor=${cursor}`;
        if (query.trim()) {
            apiUrl += `&name=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setLoans([]);
                } else {
                    const fetchedLoans = data.loans;
                    const returnCursor = data.returnCursor;
                    const count = data.count;

                    setLoans((prev) => {
                        const existingIds = new Set(prev.map(emp => emp.id));
                        const newLoans = fetchedLoans.filter((emp: { id: number }) => !existingIds.has(emp.id));
                        return [...prev, ...newLoans];
                    });

                    setNextCursor(returnCursor);
                    setRemainingLoanCnt(count);
                }
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchLoan('');
        setLoading(false);
    }, []);

    const handleSearch = () => {
        setLoans([]);
        fetchLoan('', searchQuery);
    };

    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop + clientHeight === scrollHeight && remainingLoanCnt !== 0) {
            fetchLoan(nextCursor);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <div className="flex justify-between w-full max-w-3xl mt-4">
                <h1 className="text-3xl font-bold">Loan Search</h1>
            </div>
            <Card className="w-full max-w-3xl">
                <CardContent>
                    <div className="space-y-4">
                        <Input className="w-full mt-6" placeholder="Search by loan Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearch} disabled={loading}>
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </CardContent>
                <CardContent>
                    <ScrollArea className="h-72 rounded-md border" onScrollCapture={scrollHandler}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Loan No.</TableHead>
                                    <TableHead className="text-center">Contract Date</TableHead>
                                    <TableHead className="text-center">Name</TableHead>
                                    <TableHead className="text-right">NRC No.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans.length > 0 ? (
                                    loans.map((loan) => (
                                        <TableRow key={loan.id} onClick={() => onConfirm(loan)} className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{loan.id.toString().padStart(8, '0')}</TableCell>
                                            <TableCell className="text-center">{loan.contract_date.split("T")[0]}</TableCell>
                                            <TableCell className="text-center">{loan.customer.name}</TableCell>
                                            <TableCell className="text-right">{loan.customer.nrc_number}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No Loans found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

function LoanDetailsPage({ selectedLoan, onBack }: { selectedLoan: GetLoanSchema; onBack: () => void; }) {
    // Tab Handler
    const [activeTab, setActiveTab] = useState("loanCalculation");

    // Actions
    const [state, formAction, isPending] = useActionState(deleteLoanAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(state?.message);
            onBack();
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    // Data Handler
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<GetCustomerSchema>({} as GetCustomerSchema);
    const [loanOfficer, setLoanOfficer] = useState('-');
    useEffect(() => {
        Promise.all([
            fetch(`/api/getOneCustomer?customerId=${selectedLoan.customer.id}`)
                .then(res => res.json())
                .then(data => setSelectedCustomer(data.customerData)),

            fetch(`/api/getOneLoanOfficer?loanOfficerId=${selectedLoan.loan_officer.id}`)
                .then(res => res.json())
                .then(data => setLoanOfficer(data.loanOfficer.name))
        ]).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 space-y-6">
            <form id="loanForm" action={formAction}>
                <input name="loanId" value={selectedLoan.id} type="text" readOnly hidden />
                <div className="flex justify-between items-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-green-800">Loan Search</h1>
                        <p className="text-gray-600">Selected Customer: {selectedLoan.customer.name}</p>
                        <p className="text-gray-600">NRC No.: {selectedLoan.customer.nrc_number}</p>
                        <p className="text-gray-600">CP No.: {selectedCustomer.cp_number.area_number}</p>
                    </div>
                    <div className="space-x-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this loan? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button form="loanForm" type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">Confirm</Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button variant="secondary" onClick={onBack}>Back</Button>
                    </div>
                </div>

                <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                        <TabsTrigger value="loanCalculation">Loan Calculation</TabsTrigger>
                        <TabsTrigger value="guarantorManagement">Guarantor Management</TabsTrigger>
                        <TabsTrigger value="collateralManagement">Collateral Management</TabsTrigger>
                        <TabsTrigger value="consultingInfo">Consulting Info</TabsTrigger>
                    </TabsList>
                    <TabsContent forceMount={true} value="loanCalculation" hidden={"loanCalculation" !== activeTab}>
                        <LoanDetailsTab selectedLoan={selectedLoan} selectedCustomer={selectedCustomer} loanOfficer={loanOfficer} />
                    </TabsContent>
                    <TabsContent forceMount={true} value="guarantorManagement" hidden={"guarantorManagement" !== activeTab}>
                        <GuarantorDetailsTab presetGuarantorIds={selectedLoan.guarantees} />
                    </TabsContent>
                    <TabsContent forceMount={true} value="collateralManagement" hidden={"collateralManagement" !== activeTab}>
                        <CollateralDetailsTab presetCollaterals={selectedLoan.collaterals} />
                    </TabsContent>
                    <TabsContent forceMount={true} value="consultingInfo" hidden={"consultingInfo" !== activeTab}>
                        <ConsultingDetailsTab presetConsultingInfos={selectedLoan.consulting_info} />
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}