'use client';

// Actions
import { createCustomerAction } from "@/actions/create-customer.action";

// Componenets: Dialog
import { CpNumberDialog } from "@/components/pop-ups/cp-number-dialog";

// Components: UI
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Icons
import { ChevronDown } from "lucide-react";

// React
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Util
import { delay } from "@/util/delay";

export default function FormPage() {
    // Data Handler
    const [confirmData, setConfirmData] = useState({
        name: '',
        nrcNo: '',
        dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
        phone: '',
        email: '',
        gender: "Male",
        cpNo: '',
        loanType: "Special Loan",
        homeAddress: '',
        homePostalCode: '',
        officeAddress: '',
        officePostalCode: '',
        info1: '',
        info2: '',
        info3: '',
        info4: '',
        info5: '',
    });
    // Input Value Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmData({ ...confirmData, [e.target.name]: e.target.value });
    };
    // Dropdown Value Handler
    const handleDropdownChange = (key: "gender" | "loanType", value: string) => {
        setConfirmData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Server Action
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createCustomerAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`Customer ${confirmData.name} is successfully registered!`);
            setConfirmData({
                name: '',
                nrcNo: '',
                dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
                phone: '',
                email: '',
                gender: "Male",
                cpNo: '',
                loanType: "Special Loan",
                homeAddress: '',
                homePostalCode: '',
                officeAddress: '',
                officePostalCode: '',
                info1: '',
                info2: '',
                info3: '',
                info4: '',
                info5: '',
            });
            setUploadedImage(null);
        } else if (state?.status === 400) {
            toast.error(state?.message);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.refresh();
        } else if (state?.status === 404) {
            toast.error(state?.message);
        }
    }, [state]);

    // Image Handler
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 1024 * 1024) {
                toast.warning('File size exceeds 1MB. Please retry after compressing the image.')
                delay(2500)
                setUploadedImage(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Dialog Handler
    const [isCpNumberDialogOpen, setIsCpNumberDialogOpen] = useState(false);

    // Phone No. Input Handler
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        setConfirmData(prev => ({ ...prev, phone: value }));
    };

    return (
        <>
            <form id="customerForm" action={formAction}>
                <div className="flex flex-col p-10 space-y-8 min-h-screen">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Customer Registration</h1>
                        <div className="space-x-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Message</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Register <strong>{confirmData.name}</strong> as Customer?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button type="submit" form="customerForm">Confirm</Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
                                        <Input name="name" value={confirmData.name} onChange={handleChange} disabled={isPending} type="text" required />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>NRC No.</Label>
                                        <Input name="nrcNo" value={confirmData.nrcNo} onChange={handleChange} disabled={isPending} type="text" required />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Date of Birth</Label>
                                        <Input name="dateOfBirth" value={confirmData.dateOfBirth} onChange={handleChange} disabled={isPending} type="date" required />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" value={confirmData.phone} onChange={handlePhoneChange} disabled={isPending} type="text" size={11} required />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Email</Label>
                                        <Input name="email" value={confirmData.email} onChange={handleChange} disabled={isPending} type="email" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Gender</Label>
                                        <DropdownMenu>
                                            <input name="gender" value={confirmData.gender} hidden readOnly />
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                                    {confirmData.gender}
                                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleDropdownChange("gender", "Male")}>Male</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDropdownChange("gender", "Female")}>Female</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="col-span-2 flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>CP No.</Label>
                                            <Input name="cpNo" value={confirmData.cpNo} onClick={() => setIsCpNumberDialogOpen(true)} readOnly />
                                        </div>
                                        {/* <CpNumberDialog
                                            open={isCpNumberDialogOpen}
                                            onClose={() => setIsCpNumberDialogOpen(false)}
                                            onSelect={(cpNo) => setConfirmData(prev => ({ ...prev, cpNo }))}
                                        /> */}
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Loan Type</Label>
                                        <DropdownMenu>
                                            <input name="loanType" value={confirmData.loanType} hidden readOnly />
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                                    {confirmData.loanType}
                                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleDropdownChange("loanType", "Special Loan")}>Special Loan</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDropdownChange("loanType", "Group Loan")}>Group Loan</DropdownMenuItem>
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
                                    <Input name="homeAddress" value={confirmData.homeAddress} onChange={handleChange} disabled={isPending} type="text" required />
                                </div>
                                <div className="col-span-1">
                                    <Label>Home Postal Code</Label>
                                    <Input name="homePostalCode" value={confirmData.homePostalCode} onChange={handleChange} disabled={isPending} type="text" required />
                                </div>
                                <div className="col-span-3">
                                    <Label>Office Address</Label>
                                    <Input name="officeAddress" value={confirmData.officeAddress} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                                <div className="col-span-1">
                                    <Label>Office Postal Code</Label>
                                    <Input name="officePostalCode" value={confirmData.officePostalCode} onChange={handleChange} disabled={isPending} type="text" />
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
                                    <Input name="info1" value={confirmData.info1} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Info 2</Label>
                                    <Input name="info2" value={confirmData.info2} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Info 3</Label>
                                    <Input name="info3" value={confirmData.info3} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Info 4</Label>
                                    <Input name="info4" value={confirmData.info4} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                                <div className="col-span-2">
                                    <Label>Info 5</Label>
                                    <Input name="info5" value={confirmData.info5} onChange={handleChange} disabled={isPending} type="text" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </>
    );
}