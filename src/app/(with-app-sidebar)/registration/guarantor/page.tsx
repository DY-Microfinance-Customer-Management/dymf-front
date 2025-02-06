'use client';

// React
import { useActionState, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icons
import { ChevronDown } from "lucide-react";

// Actions
import { createGuarantorAction } from "@/actions/create-guarantor.action";

export default function FormPage() {
    const [_, formAction, isPending] = useActionState(createGuarantorAction, null);

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
        <form action={formAction}>
            <div className="flex flex-col p-10 space-y-8 min-h-screen">
                <h1 className="text-3xl font-bold">Guarantor Registration</h1>

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

                <div className="flex justify-end space-x-4">
                    <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                </div>
            </div>
        </form>
    );
}