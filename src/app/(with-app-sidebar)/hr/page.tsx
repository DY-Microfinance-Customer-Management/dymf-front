'use client';

// Actions
import { createEmployeeAction } from "@/actions/employee.action";

// Components: UI
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Icons
import { ChevronDown } from "lucide-react";

// React
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
import { GetEmployeeSchema } from "@/types";

// Util
import { delay } from "@/util/delay";

export default function Page() {
    const [selectedEmployee, setSelectedEmployee] = useState<GetEmployeeSchema | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(true);
    const [isNewEmployee, setIsNewEmployee] = useState<boolean>(false);

    const handleNewEmployee = () => {
        setSelectedEmployee(null);
        setIsNewEmployee(true);
    };

    const confirmSelection = (employee: GetEmployeeSchema) => {
        setSelectedEmployee(employee);
        setIsConfirming(false);
    };

    const goBackToSelectEmployee = () => {
        setSelectedEmployee(null);
        setIsNewEmployee(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {selectedEmployee && !isConfirming ? (
                <EmployeeRegistrationPage selectedEmployee={selectedEmployee} onBack={goBackToSelectEmployee} />
            ) : isNewEmployee ? (
                <EmployeeRegistrationPage selectedEmployee={null} onBack={goBackToSelectEmployee} />
            ) : (
                <SelectEmployeePage onConfirm={confirmSelection} onNew={handleNewEmployee} />
            )}
        </div>
    );
}

export function SelectEmployeePage({ onConfirm, onNew }: { onConfirm: (employee: GetEmployeeSchema) => void, onNew: () => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState<GetEmployeeSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState("");
    const [remainingEmployeeCnt, setRemainingEmployeeCnt] = useState<number>(1);

    const fetchEmployee = (cursor: string, query: string = "") => {
        setLoading(true);
        let apiUrl = `/api/getPersonnels?cursor=${cursor}`;
        if (query.trim()) {
            apiUrl += `&name=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setEmployees([]);
                } else {
                    const fetchedEmployees = data.employees;
                    const returnCursor = data.returnCursor;
                    const count = data.count;
    
                    setEmployees((prev) => {
                        const existingIds = new Set(prev.map(emp => emp.id));
                        const newEmployees = fetchedEmployees.filter((emp: { id: number }) => !existingIds.has(emp.id));
                        return [...prev, ...newEmployees];
                    });
    
                    setNextCursor(returnCursor);
                    setRemainingEmployeeCnt(count);
                }
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchEmployee('');
        setLoading(false);
    }, []);

    const handleSearch = () => {
        setEmployees([]);
        fetchEmployee('', searchQuery);
    };

    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop + clientHeight === scrollHeight && remainingEmployeeCnt !== 0) {
            fetchEmployee(nextCursor);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <div className="flex justify-between w-full max-w-3xl mt-4">
                <h1 className="text-3xl font-bold">Employee Registration</h1>
                <Button onClick={onNew} className="bg-green-600 hover:bg-green-700 text-white">New</Button>
            </div>
            <Card className="w-full max-w-3xl">
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            className="w-full mt-6"
                            placeholder="Search by Employee Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSearch}
                            disabled={loading}
                        >
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
                                {employees.length > 0 ? (
                                    employees.map((employee) => (
                                        <TableRow key={employee.id} onClick={() => onConfirm(employee)} className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{employee.name}</TableCell>
                                            <TableCell>{employee.nrc_number}</TableCell>
                                            <TableCell>{employee.birth}</TableCell>
                                            <TableCell>{employee.phone_number}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No employees found.
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

function EmployeeRegistrationPage({ selectedEmployee, onBack }: { selectedEmployee: GetEmployeeSchema | null; onBack: () => void; }) {
    // Router
    const router = useRouter();

    // Data Handler
    const loanOfficerId = JSON.stringify(selectedEmployee?.loan_officer?.id)
    const [hasChanges, setHasChanges] = useState(false);
    const [confirmData, setConfirmData] = useState({
        isLoanOfficer: loanOfficerId === undefined ? false : true,
        name: selectedEmployee?.name ?? '',
        nrcNo: selectedEmployee?.nrc_number ?? '',
        dateOfBirth: selectedEmployee?.birth ?? new Date("2000-01-01").toISOString().split("T")[0],
        phone: selectedEmployee?.phone_number ?? '',
        email: selectedEmployee?.email ?? '',
        gender: selectedEmployee?.gender === 1 ? "Female" : "Male",
        address: selectedEmployee?.address ?? '',
        salary: selectedEmployee?.salary ?? '',
        ssb: selectedEmployee?.ssb ?? '',
        incomeTax: selectedEmployee?.income_tax ?? '',
        bonus: selectedEmployee?.bonus ?? '',
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
    // Switch Value Handler
    const handleSwitchChange = () => {
        setConfirmData(prev => ({
            ...prev,
            isLoanOfficer: !prev.isLoanOfficer
        }));
    };

    // Server Action
    const [state, formAction, isPending] = useActionState(createEmployeeAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`Employee ${confirmData.name} is successfully registered!`);
            setConfirmData({
                isLoanOfficer: false,
                name: '',
                nrcNo: '',
                dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
                phone: '',
                email: '',
                gender: "Male",
                address: '',
                salary: '',
                ssb: '',
                incomeTax: '',
                bonus: '',
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
            router.push('/login');
        }
    }, [state]);

    // Image Handler
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    useEffect(() => {
        if (selectedEmployee !== null) {
            const imgSrc = selectedEmployee?.image;
            const extractedImageName = imgSrc?.substring(imgSrc?.lastIndexOf("/") + 1);
    
            if (extractedImageName === 'empty') {
                setUploadedImage(null);
            } else {
                setUploadedImage(imgSrc ?? null);
            }
        }
    }, [selectedEmployee]);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 1024 * 1024) {
                toast.warning('File size exceeds 1MB. Please retry after compressing the image.');
                delay(2500);
                setUploadedImage(selectedEmployee?.image ?? null);
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
    const [isEditing, setIsEditing] = useState(selectedEmployee === null);
    const onEdit = () => {
        setIsEditing(true);
    }

    return (
        <form id="employeeForm" action={formAction}>
            <div className="flex flex-col p-10 space-y-8 min-h-screen">
                <div className="flex justify-between items-center">
                    {selectedEmployee === null ?
                        <>
                            <h1 className="text-3xl font-bold">Employee Registration</h1>
                            <div className="space-x-4">
                                <Button variant="secondary" type="button" onClick={onBack}>Back</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button disabled={isPending || !isEditing} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Message</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Register <strong>{confirmData.name}</strong> as Employee?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button type="submit" form="employeeForm">Confirm</Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </>
                        :
                        <>
                            <div>
                                <h1 className="text-3xl font-bold">Employee</h1>
                                <p className="text-gray-600">Selected Employee: {selectedEmployee.name}</p>
                                <p className="text-gray-600">Status: Working</p>
                                <input name="id" value={selectedEmployee.id} readOnly hidden />
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
                                                Register <strong>{confirmData.name}</strong> as Employee?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button type="submit" form="employeeForm">Confirm</Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </>}
                </div>

                <Card>
                    <CardContent className="flex justify-between mt-6">
                        <Label className="mt-1.5">Loan Officer</Label> <Switch name="isLoanOfficer" onClick={handleSwitchChange} checked={confirmData.isLoanOfficer} disabled={loanOfficerId !== undefined && confirmData.isLoanOfficer} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 flex flex-col items-center justify-center border rounded-lg bg-gray-100 dark:bg-black h-70 relative">
                                <label htmlFor="image-upload" className="w-full h-full">
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Employee" className="h-full w-full object-cover rounded-lg cursor-pointer" />
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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Address Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label>Home Address</Label>
                        <Input name="address" value={confirmData.address} onChange={handleChange} disabled={isPending || !isEditing} type="text" required />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <Label>Salary</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="salary" value={confirmData.salary} onChange={handleChange} disabled={isPending || !isEditing} type="number" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>SSB</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="ssb" value={confirmData.ssb} onChange={handleChange} disabled={isPending || !isEditing} type="number" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>Income Tax</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="incomeTax" value={confirmData.incomeTax} onChange={handleChange} disabled={isPending || !isEditing} type="number" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>Bonus</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="bonus" value={confirmData.bonus} onChange={handleChange} disabled={isPending || !isEditing} type="number" />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}