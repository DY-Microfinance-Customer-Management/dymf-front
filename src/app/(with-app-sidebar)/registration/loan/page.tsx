'use client';

// Actions
import { createLoanAction } from "@/actions/create-loan.action";

// Components: Tabs
import LoanCalculationTab from "@/components/tabs/loan-calculation-tab";
import GuarantorManagementTab from "@/components/tabs/guarantor-management-tab";
import CollateralManagementTab from "@/components/tabs/collateral-management-tab";
import ConsultingInfoTab from "@/components/tabs/counseling-info-tab";

// Components: UI
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";

// React
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
import { GetCustomerSchema } from "@/types";

export default function Page() {
    const [selectedCustomer, setSelectedCustomer] = useState<GetCustomerSchema | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(true);

    const confirmSelection = (customer: GetCustomerSchema) => {
        setSelectedCustomer(customer);
        setIsConfirming(false);
    };

    const goBackToSelectCustomer = () => {
        setSelectedCustomer(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {selectedCustomer && !isConfirming ? (
                <LoanManagementPage selectedCustomer={selectedCustomer} onBack={goBackToSelectCustomer} />
            ) : (
                <SelectCustomerPage onConfirm={confirmSelection} />
            )}
        </div>
    );
}

// Select Customer Page
function SelectCustomerPage({ onConfirm }: { onConfirm: (customer: GetCustomerSchema) => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState<GetCustomerSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState("");
    const [remainingCustomerCnt, setRemainingCustomerCnt] = useState<number>(1);

    const fetchCustomer = (cursor: string, query: string = "") => {
        setLoading(true);
        let apiUrl = `/api/getCustomers?cursor=${cursor}`;
        if (query.trim()) {
            apiUrl += `&name=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setCustomers([]);
                } else {
                    const fetchedCustomers = data.customers;
                    const returnCursor = data.returnCursor;
                    const count = data.count;

                    setCustomers((prev) => {
                        const existingIds = new Set(prev.map(emp => emp.id));
                        const newCustomers = fetchedCustomers.filter((emp: { id: number }) => !existingIds.has(emp.id));
                        return [...prev, ...newCustomers];
                    });

                    setNextCursor(returnCursor);
                    setRemainingCustomerCnt(count);
                }
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchCustomer('');
        setLoading(false);
    }, []);

    const handleSearch = () => {
        setCustomers([]);
        fetchCustomer('', searchQuery);
    };

    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop + clientHeight === scrollHeight && remainingCustomerCnt !== 0) {
            fetchCustomer(nextCursor);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <div className="flex justify-between w-full max-w-3xl mt-4">
                <h1 className="text-3xl font-bold">Loan Registration</h1>
            </div>
            <Card className="w-full max-w-3xl">
                <CardContent>
                    <div className="space-y-4">
                        <Input className="w-full mt-6" placeholder="Search by Customer Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>NRC No.</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Phone No.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id} onClick={() => onConfirm(customer)} className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell>{customer.nrc_number}</TableCell>
                                            <TableCell>{customer.birth}</TableCell>
                                            <TableCell>{customer.phone_number}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No customers found.
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

// Loan Management Page
function LoanManagementPage({ selectedCustomer, onBack }: { selectedCustomer: GetCustomerSchema; onBack: () => void; }) {
    // Data Handler
    const [confirmData, setConfirmData] = useState({
        loanAmount: null,
        repaymentCycle: null,
        interestRate: 28,
        numberOfRepayment: null,
        repaymentMethod: 'Equal',
    });

    // Actions
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createLoanAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(state?.message);
            setConfirmData({
                loanAmount: null,
                repaymentCycle: null,
                interestRate: 28,
                numberOfRepayment: null,
                repaymentMethod: 'Equal',
            });
            onBack();
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    // Tab Handler
    const [activeTab, setActiveTab] = useState("loanCalculation");

    // Loan Calculation 완료 여부 상태
    const [isCalculated, setIsCalculated] = useState(false);

    return (
        <div className="flex flex-col p-6 space-y-6">
            <form action={formAction}>
                <input name="customerId" value={selectedCustomer.id} type="text" readOnly hidden />
                <div className="flex justify-between items-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-green-800">Loan Registration</h1>
                        <p className="text-gray-600">Selected Customer: {selectedCustomer.name}</p>
                        <p className="text-gray-600">NRC No.: {selectedCustomer.nrc_number}</p>
                    </div>
                    <div className="space-x-4">
                        <Button
                            disabled={isPending || !isCalculated}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
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
                        <LoanCalculationTab selectedCustomer={selectedCustomer} setIsCalculated={setIsCalculated} confirmData={confirmData} setConfirmData={setConfirmData} />
                    </TabsContent>
                    <TabsContent forceMount={true} value="guarantorManagement" hidden={"guarantorManagement" !== activeTab}>
                        <GuarantorManagementTab />
                    </TabsContent>
                    <TabsContent forceMount={true} value="collateralManagement" hidden={"collateralManagement" !== activeTab}>
                        <CollateralManagementTab />
                    </TabsContent>
                    <TabsContent forceMount={true} value="consultingInfo" hidden={"consultingInfo" !== activeTab}>
                        <ConsultingInfoTab />
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}