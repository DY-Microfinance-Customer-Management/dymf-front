'use client';

// Actions
import { updateCustomerAction } from "@/actions/update-customer.action";

// Componenets: Dialog
import { CpNumberDialog } from "@/components/pop-ups/cp-number-dialog";

// Components: UI
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner";

// Icons
import { ChevronDown } from "lucide-react";

// React
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
import { GetCustomerSchema } from "@/types";

// Util
import { delay } from "@/util/delay";

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
                <CustomerEditPage selectedCustomer={selectedCustomer} onBack={goBackToSelectCustomer} />
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

        if (Math.floor(scrollTop + clientHeight) === scrollHeight && remainingCustomerCnt !== 0) {
            fetchCustomer(nextCursor);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <div className="flex justify-between w-full max-w-3xl mt-4">
                <h1 className="text-3xl font-bold">Customer Search</h1>
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
                                    <TableHead className="text-center">NRC No.</TableHead>
                                    <TableHead className="text-center">Date of Birth</TableHead>
                                    <TableHead className="text-right">Phone No.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id} onClick={() => onConfirm(customer)} className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell className="text-center">{customer.nrc_number}</TableCell>
                                            <TableCell className="text-center">{customer.birth}</TableCell>
                                            <TableCell className="text-right">{customer.phone_number}</TableCell>
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

function CustomerEditPage({ selectedCustomer, onBack }: { selectedCustomer: GetCustomerSchema; onBack: () => void; }) {
    // Router
    const router = useRouter();

    // Data Handler
    const [hasChanges, setHasChanges] = useState(false);
    const [confirmData, setConfirmData] = useState({
        name: selectedCustomer?.name ?? '',
        nrcNo: selectedCustomer?.nrc_number ?? '',
        dateOfBirth: selectedCustomer?.birth ?? new Date("2000-01-01").toISOString().split("T")[0],
        phone: selectedCustomer?.phone_number ?? '',
        email: selectedCustomer?.email ?? '',
        gender: selectedCustomer?.gender === 1 ? "Female" : "Male",
        cpNo: selectedCustomer?.cp_number.area_number ?? '',
        loanType: selectedCustomer?.loan_type === 1 ? "Group Loan" : "Special Loan",
        homeAddress: selectedCustomer?.home_address ?? '',
        homePostalCode: selectedCustomer?.home_postal_code ?? '',
        officeAddress: selectedCustomer?.office_address ?? '',
        officePostalCode: selectedCustomer?.office_postal_code ?? '',
        info1: (selectedCustomer?.details ?? [])[0] ?? '',
        info2: (selectedCustomer?.details ?? [])[1] ?? '',
        info3: (selectedCustomer?.details ?? [])[2] ?? '',
        info4: (selectedCustomer?.details ?? [])[3] ?? '',
        info5: (selectedCustomer?.details ?? [])[4] ?? '',
    });
    // Input Value Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmData({ ...confirmData, [e.target.name]: e.target.value });
        setHasChanges(true);
    };
    // Dropdown Value Handler
    const handleDropdownChange = (key: "gender" | "loanType", value: string) => {
        setConfirmData(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    // Server Action
    const [state, formAction, isPending] = useActionState(updateCustomerAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`Customer ${confirmData.name} has successfully been updated!`);
            setConfirmData({
                name: '',
                nrcNo: '',
                dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
                phone: '',
                email: '',
                gender: 'Male',
                cpNo: '',
                loanType: 'Special Loan',
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
            setIsEditing(false);
            onBack();
        } else if (state?.status === 400) {
            toast.error(state?.message);
        } else if (state?.status === 409) {
            toast.error(state?.message);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.refresh();
        }
    }, [state]);

    // Dialog Handler
    const [isCpNumberDialogOpen, setIsCpNumberDialogOpen] = useState(false);

    // Image Handler
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    useEffect(() => {
        if (selectedCustomer !== null) {
            const imgSrc = selectedCustomer?.image;
            const extractedImageName = imgSrc?.substring(imgSrc?.lastIndexOf("/") + 1);

            if (extractedImageName === 'empty' || 'localhost.dev.com') {
                setUploadedImage(null);
            } else {
                setUploadedImage(imgSrc ?? null);
            }
        }
    }, [selectedCustomer]);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 1024 * 1024) {
                toast.warning('File size exceeds 1MB. Please retry after compressing the image.');
                delay(2500);
                setUploadedImage(selectedCustomer?.image ?? null);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Edit Button Handler
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = () => {
        setIsEditing(true);
    }

    return (
        <form id="customerForm" action={formAction}>
            <div className="flex flex-col p-10 space-y-8 min-h-screen">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Customer</h1>
                        <p className="text-gray-600">Selected Customer: {selectedCustomer.name}</p>
                        <input name="id" value={selectedCustomer.id} readOnly hidden />
                    </div>
                    <div className="space-x-4">
                        <Button variant="secondary" onClick={onBack}>Back</Button>
                        <Button onClick={onEdit} disabled={isPending} type="button" className="bg-blue-600 hover:bg-blue-700 text-white">Edit</Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={isPending || !isEditing || !hasChanges} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Message</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Update Customer: <strong>{confirmData.name}</strong>?
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
                                        <img src={uploadedImage} alt="Customer" className="h-full w-full object-cover rounded-lg cursor-pointer" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-gray-400 mb-4">Click here</span>
                                            <span className="text-gray-400 mb-4">to upload image</span>
                                        </div>
                                    )}
                                </label>
                                <Input name="image" disabled={isPending || !isEditing} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />

                            </div>
                            <div className="col-span-3 grid grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <Label>Name</Label>
                                    <Input name="name" value={confirmData.name} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>NRC No.</Label>
                                    <Input name="nrcNo" value={confirmData.nrcNo} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>Date of Birth</Label>
                                    <Input name="dateOfBirth" value={confirmData.dateOfBirth} onChange={handleChange} disabled={isPending || !isEditing} type="date" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>Phone</Label>
                                    <Input name="phone" value={confirmData.phone} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input name="email" value={confirmData.email} onChange={handleChange} disabled={isPending || !isEditing} type="email" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>Gender</Label>
                                    <DropdownMenu>
                                        <input name="gender" value={confirmData.gender} hidden readOnly />
                                        <DropdownMenuTrigger asChild disabled={isPending || !isEditing}>
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
                                        <Input name="cpNo" value={confirmData.cpNo} onClick={() => setIsCpNumberDialogOpen(true)} disabled={isPending || !isEditing} readOnly />
                                    </div>
                                    <CpNumberDialog
                                        open={isCpNumberDialogOpen}
                                        onClose={() => setIsCpNumberDialogOpen(false)}
                                        onSelect={(cpNo) => setConfirmData(prev => ({ ...prev, cpNo }))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Loan Type</Label>
                                    <DropdownMenu>
                                        <input name="loanType" value={confirmData.loanType} hidden readOnly />
                                        <DropdownMenuTrigger asChild disabled={isPending || !isEditing}>
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
                                <Input name="homeAddress" value={confirmData.homeAddress} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                            </div>
                            <div className="col-span-1">
                                <Label>Home Postal Code</Label>
                                <Input name="homePostalCode" value={confirmData.homePostalCode} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                            </div>
                            <div className="col-span-3">
                                <Label>Office Address</Label>
                                <Input name="officeAddress" value={confirmData.officeAddress} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                            <div className="col-span-1">
                                <Label>Office Postal Code</Label>
                                <Input name="officePostalCode" value={confirmData.officePostalCode} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
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
                                <Input name="info1" value={confirmData.info1} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 2</Label>
                                <Input name="info2" value={confirmData.info2} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 3</Label>
                                <Input name="info3" value={confirmData.info3} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 4</Label>
                                <Input name="info4" value={confirmData.info4} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                            <div className="col-span-2">
                                <Label>Info 5</Label>
                                <Input name="info5" value={confirmData.info5} onChange={handleChange} disabled={isPending || !isEditing} type="text" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}