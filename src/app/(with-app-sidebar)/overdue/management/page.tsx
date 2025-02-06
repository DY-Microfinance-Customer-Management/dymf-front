"use client";

// React
import React, { useActionState, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actions
import { createLoanAction } from "@/actions/create-loan.action";
import { Label } from "@/components/ui/label";

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
    return (
        <div className="flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">Overdue Loan Management</h1>
                    <p className="text-gray-600">Selected Customer: {selectedCustomer}</p>
                </div>
                <Button variant="secondary" onClick={onBack}>Back</Button>
            </div>

            <Tabs defaultValue="repaymentSchedule">
                <TabsList className="w-full">
                    <TabsTrigger value="repaymentSchedule">Repayment Schedule</TabsTrigger>
                    <TabsTrigger value="loanInfo">Loan Info</TabsTrigger>
                </TabsList>

                <TabsContent value="repaymentSchedule" className="space-y-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-red-800">Overdue Repayment Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table className="mt-8">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Payment Date</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Interest</TableHead>
                                        <TableHead>Overdue Interest</TableHead>
                                        <TableHead>Received Principal</TableHead>
                                        <TableHead>Received Interest</TableHead>
                                        <TableHead className="text-right">Received Overdue Interest</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell className="text-right"></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardContent>
                            <div className="col-span-3 grid grid-cols-3 gap-1 mt-4">
                                <div className="col-span-1 flex items-end gap-2">
                                    <div className="flex-row">
                                        <Label>Received Principal</Label>
                                        <Input name="receivedPrincipal" type="number" />
                                    </div>
                                    <Label>MMK</Label>
                                </div>
                                <div className="col-span-1 flex items-end gap-2">
                                    <div className="flex-row">
                                        <Label>Received Interest</Label>
                                        <Input name="receivedInterest" type="number" />
                                    </div>
                                    <Label>MMK</Label>
                                </div>
                                <div className="col-span-1 flex items-end gap-2">
                                    <div className="flex-row">
                                        <Label>Received Overdue Interest</Label>
                                        <Input name="receivedOverdueInterest" type="number" />
                                    </div>
                                    <Label>MMK</Label>
                                </div>
                                <div className="col-span-3 justify-self-end mt-4">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">Calculate</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="loanInfo">
                    <div className="w-full space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-800">Overdue Loan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="col-span-3 grid grid-cols-3 gap-4 mb-8">
                                    <div className="col-span-1">
                                        <Label>Loan No.</Label>
                                        <Input disabled name="loanNumber" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Loan Type</Label>
                                        <Input disabled name="loanType" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>CP No.</Label>
                                        <Input disabled name="cpNumber" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Contract Date</Label>
                                        <Input disabled name="contractDate" type="date" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Loan Officer</Label>
                                        <Input disabled name="loanOfficer" />
                                    </div>
                                </div>
                                <div className="col-span-3 grid grid-cols-3 gap-4">
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Loan Amount</Label>
                                            <Input disabled name="loanAmount" type="number" />
                                        </div>
                                        <Label>MMK</Label>
                                    </div>
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Repayment Cycle</Label>
                                            <Input disabled name="repaymentCycle" type="number" />
                                        </div>
                                        <Label>days</Label>
                                    </div>
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Interest Rate</Label>
                                            <Input disabled name="interestRate" type="number" />
                                        </div>
                                        <Label>%</Label>
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Number of Repayment</Label>
                                        <Input disabled name="numberOfRepayment" type="number" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Repayment Method</Label>
                                        <Input disabled name="repaymentMethod" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-800 line-through">Loan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="col-span-3 grid grid-cols-3 gap-4 mb-8">
                                    <div className="col-span-1">
                                        <Label>Loan No.</Label>
                                        <Input disabled name="loanNumber" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Loan Type</Label>
                                        <Input disabled name="loanType" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>CP No.</Label>
                                        <Input disabled name="cpNumber" type="text" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Contract Date</Label>
                                        <Input disabled name="contractDate" type="date" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Loan Officer</Label>
                                        <Input disabled name="loanOfficer" />
                                    </div>
                                </div>
                                <div className="col-span-3 grid grid-cols-3 gap-4">
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Loan Amount</Label>
                                            <Input disabled name="loanAmount" type="number" />
                                        </div>
                                        <Label>MMK</Label>
                                    </div>
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Repayment Cycle</Label>
                                            <Input disabled name="repaymentCycle" type="number" />
                                        </div>
                                        <Label>days</Label>
                                    </div>
                                    <div className="col-span-1 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Interest Rate</Label>
                                            <Input disabled name="interestRate" type="number" />
                                        </div>
                                        <Label>%</Label>
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Number of Repayment</Label>
                                        <Input disabled name="numberOfRepayment" type="number" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Repayment Method</Label>
                                        <Input disabled name="repaymentMethod" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-800">
                                    Guarantors
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>A list of Guarantors</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>NRC No.</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead className="text-right">CP No.</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Something</TableCell>
                                            <TableCell>124lh12h4k1</TableCell>
                                            <TableCell>010-5555-5555</TableCell>
                                            <TableCell className="text-right">TW-5</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-800">
                                    Collaterals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>A list of Collaterals.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Car</TableCell>
                                            <TableCell>Something</TableCell>
                                            <TableCell className="text-right w-[250px] break-all">SomethingSomethingSomethingSomethingSomethingSomethingSomethingSomethingSomethingSomething</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-800">
                                    Counselings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>A list of Counseling Info added.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className="text-center">Details</TableHead>
                                            <TableHead className="text-right">Corrective Measure</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">2025/01/27</TableCell>
                                            <TableCell>Something</TableCell>
                                            <TableCell className="text-center w-[250px] break-all">Something Something Something Something Something Something Something Something Something</TableCell>
                                            <TableCell className="text-right w-[250px] break-all">Something Something Something Something Something Something Something Something Something</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}
