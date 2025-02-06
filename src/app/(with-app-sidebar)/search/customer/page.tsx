"use client";

// React
import React, { useActionState, useState } from "react";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icons
import { ChevronDown } from "lucide-react";

// Actions
import { createLoanAction } from "@/actions/create-loan.action";

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

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const [gender, setGender] = useState('Male');
    const handleGender = (value: string) => {
        setGender(value);
    };

    const [loanType, setLoanType] = useState('Special Loan');
    const handleLoanType = (value: string) => {
        setLoanType(value);
    };

    return (
        <div className="flex flex-col p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Customer Search</h1>
                    <p className="text-gray-600">Selected Customer: {selectedCustomer}</p>
                </div>
                <div className="space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Edit</Button>
                    <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    <Button variant="secondary" onClick={onBack}>Back</Button>
                </div>
            </div>

            <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 flex flex-col items-center justify-center border rounded-lg bg-gray-100 dark:bg-black h-70 relative">
                                <label htmlFor="image-upload" className="w-full h-full">
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Uploaded" className="h-full w-full object-cover rounded-lg cursor-pointer" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-gray-400 mb-4">Click here</span>
                                            <span className="text-gray-400 mb-4">to upload image</span>
                                        </div>
                                    )}
                                </label>
                                <Input name="image" disabled={isPending} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                            </div>
                            <div className="col-span-3 grid grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <Label>Name</Label>
                                    <Input disabled={isPending} required name="name" type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>NRC No.</Label>
                                    <Input disabled={isPending} required name="nrcNo" type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Date of Birth</Label>
                                    <Input disabled={isPending} required name="dateOfBirth" type="date" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Phone</Label>
                                    <Input disabled={isPending} required name="phone" type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input disabled={isPending} required name="email" type="email" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Gender</Label>
                                    <DropdownMenu>
                                        <input required name="gender" value={gender} hidden readOnly />
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                                {gender}
                                                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleGender("Male")}>Male</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleGender("Female")}>Female</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="col-span-2 flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label>CP No.</Label>
                                        <Input name="cpNo" />
                                    </div>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">Search</Button>
                                </div>
                                <div className="col-span-2">
                                    <Label>Loan Type</Label>
                                    <DropdownMenu>
                                        <input required name="loanType" value={loanType} hidden readOnly />
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                                {loanType}
                                                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleLoanType("Special Loan")}>Special Loan</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleLoanType("Group Loan")}>Group Loan</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Address Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <Label>Home Address</Label>
                                <Input name="homeAddress" type="text" required disabled={isPending} />
                            </div>
                            <div className="col-span-1">
                                <Label>Home Postal Code</Label>
                                <Input name="homePostalCode" type="text" required disabled={isPending} />
                            </div>
                            <div className="col-span-3">
                                <Label>Office Address</Label>
                                <Input name="officeAddress" type="text" disabled={isPending} />
                            </div>
                            <div className="col-span-1">
                                <Label>Office Postal Code</Label>
                                <Input name="officePostalCode" type="text" disabled={isPending} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Info 1</Label>
                                <Input name="info1" type="text" disabled={isPending} />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 2</Label>
                                <Input name="info2" type="text" disabled={isPending} />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 3</Label>
                                <Input name="info3" type="text" disabled={isPending} />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 4</Label>
                                <Input name="info4" type="text" disabled={isPending} />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 5</Label>
                                <Input name="info5" type="text" disabled={isPending} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

        </div >
    );
}
