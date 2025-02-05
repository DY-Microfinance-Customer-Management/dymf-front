"use client";

// React
import React, { useActionState, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actions
import { createLoanAction } from "@/actions/create-loan.action";

// Tabs
import LoanCalculationTab from "@/components/tabs/loan-calculation-tab";
import CollateralManagementTab from "@/components/tabs/collateral-management-tab";
import GuarantorManagementTab from "@/components/tabs/gurantor-management-tab"
import CounselingInfoTab from "@/components/tabs/counseling-info-tab";

// Main Component
export default function LoanManagementApp() {
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    const confirmSelection = (customer: string) => {
        setSelectedCustomer(customer);
        setIsConfirming(true);
    };

    const proceedToLoanManagement = () => {
        setIsConfirming(false);
    };

    const cancelSelection = () => {
        setIsConfirming(false);
        setSelectedCustomer(null);
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

            {/* Confirmation Dialog */}
            {isConfirming && (
                <Dialog open={isConfirming}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Customer</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to select <strong>{selectedCustomer}</strong> as the customer?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={cancelSelection}>
                                Cancel
                            </Button>
                            <Button onClick={proceedToLoanManagement}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

// Select Customer Page
function SelectCustomerPage({ onConfirm }: { onConfirm: (customer: string) => void }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <h1 className="text-2xl font-bold">Select Customer</h1>
            <Card className="w-full max-w-3xl">
                <CardContent>
                    <div className="space-y-4">
                        <Input className="w-full mt-6" placeholder="Enter customer name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                    </div>
                </CardContent>
                <CardContent>
                    <Table>
                        <TableCaption>Search Results</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>NRC No.</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Phone No.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Sample Data */}
                            <TableRow onClick={() => onConfirm("John Doe")} className="cursor-pointer hover:bg-gray-100">
                                <TableCell>John Doe</TableCell>
                                <TableCell>123456</TableCell>
                                <TableCell>1990-01-01</TableCell>
                                <TableCell>+123456789</TableCell>
                            </TableRow>
                            <TableRow onClick={() => onConfirm("Jane Smith")} className="cursor-pointer hover:bg-gray-100" >
                                <TableCell>Jane Smith</TableCell>
                                <TableCell>7891011</TableCell>
                                <TableCell>1985-05-15</TableCell>
                                <TableCell>+987654321</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// Loan Management Page
function LoanManagementPage({ selectedCustomer, onBack }: {
    selectedCustomer: string;
    onBack: () => void;
}) {
    const [_, formAction, isPending] = useActionState(createLoanAction, null);

    return (
        <div className="flex flex-col p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">Loan Registration</h1>
                    <p className="text-gray-600">Selected Customer: {selectedCustomer}</p>
                </div>
                <div className="space-x-4">
                    <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Save
                    </Button>
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                </div>
            </div>


            <Tabs defaultValue="loanCalculation" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="loanCalculation">Loan Calculation</TabsTrigger>
                    <TabsTrigger value="guarantorManagement">Guarantor Management</TabsTrigger>
                    <TabsTrigger value="collateralManagement">Collateral Management</TabsTrigger>
                    <TabsTrigger value="counselingInfo">Counseling Info</TabsTrigger>
                </TabsList>
                <form action={formAction}>
                    <TabsContent value="loanCalculation">
                        <LoanCalculationTab />
                    </TabsContent>
                    <TabsContent value="guarantorManagement">
                        <GuarantorManagementTab />
                    </TabsContent>
                    <TabsContent value="collateralManagement">
                        <CollateralManagementTab />
                    </TabsContent>
                    <TabsContent value="counselingInfo">
                        <CounselingInfoTab />
                    </TabsContent>
                </form>
            </Tabs>
        </div >
    );
}
