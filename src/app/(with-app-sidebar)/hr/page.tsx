'use client';

// React
import { useActionState, useEffect, useState } from "react";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";

// Icons
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { createEmployeeAction } from "@/actions/create-personnel.action";
import { useRouter } from "next/navigation";

export default function Page() {
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [isNewEmployee, setIsNewEmployee] = useState<boolean>(false);

    const handleNewEmployee = () => {
        setSelectedEmployee(null);
        setIsNewEmployee(true);
    };

    const confirmSelection = (customer: string) => {
        setSelectedEmployee(customer);
        setIsConfirming(true);
    };

    const proceedToEmployeeRegistration = () => {
        setIsConfirming(false);
    };

    const cancelSelection = () => {
        setIsConfirming(false);
        setSelectedEmployee(null);
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

            {isConfirming && (
                <Dialog open={isConfirming}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Employee</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to select <strong>{selectedEmployee}</strong> as the employee?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={cancelSelection}>
                                Cancel
                            </Button>
                            <Button onClick={proceedToEmployeeRegistration}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

function SelectEmployeePage({ onConfirm, onNew }: { onConfirm: (employee: string) => void, onNew: () => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 5; // 한 페이지당 표시할 직원 수

    // 샘플 직원 데이터 (실제로는 API에서 불러와야 함)
    const allEmployees = [
        { name: "John Doe", nrc: "123456", dob: "1990-01-01", phone: "+123456789" },
        { name: "Jane Smith", nrc: "7891011", dob: "1985-05-15", phone: "+987654321" },
        { name: "Alice Brown", nrc: "456789", dob: "1993-07-21", phone: "+234567890" },
        { name: "Bob White", nrc: "654321", dob: "1995-09-10", phone: "+345678901" },
        { name: "Charlie Black", nrc: "987654", dob: "1992-04-25", phone: "+456789012" },
        { name: "David Green", nrc: "321789", dob: "1988-12-15", phone: "+567890123" },
    ];

    // 검색 적용 (검색어가 있을 경우 필터링)
    const filteredEmployees = searchQuery
        ? allEmployees.filter(employee =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.nrc.includes(searchQuery) ||
            employee.phone.includes(searchQuery)
        )
        : allEmployees;

    // 현재 페이지에 해당하는 직원 목록 추출
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // 페이지 변경 핸들러
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                            onClick={() => setCurrentPage(1)} // 검색 후 첫 페이지로 이동
                        >
                            Search
                        </Button>
                    </div>
                </CardContent>
                <CardContent>
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
                            {currentEmployees.map((employee, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => onConfirm(employee.name)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.nrc}</TableCell>
                                    <TableCell>{employee.dob}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                </TableRow>
                            ))}

                            {/* 항상 5개의 행이 유지되도록 빈 행 추가 */}
                            {Array.from({ length: Math.max(0, 5 - currentEmployees.length) }).map((_, index) => (
                                <TableRow key={`empty-${index}`} className="h-[53px]">
                                    <TableCell colSpan={4}></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                    {/* Pagination */}
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {[...Array(Math.ceil(filteredEmployees.length / employeesPerPage))].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredEmployees.length / employeesPerPage)))}
                                    aria-disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
                                    className={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage) ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>
        </div>
    );
}

function EmployeeRegistrationPage({ selectedEmployee, onBack }: { selectedEmployee: string | null; onBack: () => void; }) {
    // Router
    const router = useRouter();

    // Data Handler
    const [confirmData, setConfirmData] = useState({
        isLoanOfficer: false,
        name: '',
        nrcNo: '',
        dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
        phone: '',
        email: '',
        gender: "Male",
        homeAddress: '',
        homePostalCode: '',
        salary: '',
        ssb: '',
        incomeTax: '',
        bonus: '',
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
    const [state, formAction, isPending] = useActionState(createEmployeeAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`Customer ${confirmData.name} is successfully registered!`);
            setConfirmData({
                isLoanOfficer: false,
                name: '',
                nrcNo: '',
                dateOfBirth: new Date("2000-01-01").toISOString().split("T")[0],
                phone: '',
                email: '',
                gender: "Male",
                homeAddress: '',
                homePostalCode: '',
                salary: '',
                ssb: '',
                incomeTax: '',
                bonus: '',
            });
        } else if (state?.status === 400) {
            toast.error(state?.message);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.push('/login');
        }
    }, [state]);

    // Image Handler
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

    return (
        <form action={formAction}>
            <div className="flex flex-col p-10 space-y-8 min-h-screen">
                <div className="flex justify-between items-center">
                    {selectedEmployee === null ?
                        <>
                            <div>
                                <h1 className="text-3xl font-bold">Employee Registration</h1>
                            </div>
                            <div className="space-x-4">
                                <Button variant="secondary" onClick={onBack}>Back</Button>
                                <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                            </div>
                        </>
                        :
                        <>
                            <div>
                                <h1 className="text-3xl font-bold">Employee</h1>
                                <p className="text-gray-600">Selected Employee: {selectedEmployee}</p>
                                <p className="text-gray-600">Status: Working</p>
                            </div>
                            <div className="space-x-4">
                                <Button variant="secondary" onClick={onBack}>Back</Button>
                                <Button disabled={isPending} type="button" className="bg-blue-600 hover:bg-blue-700 text-white">Edit</Button>
                                <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                            </div>
                        </>
                    }
                </div>

                <Card>
                    <CardContent className="flex justify-between mt-6">
                        {/* 한번 loan officer로 등록하면 delete 할 수 없게 */}
                        <Label className="mt-1.5">Loan Officer</Label>
                        {/* <Switch checked={field.value} onCheckedChange={field.onChange} /> */}
                        <Switch />
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
                                    <Input name="phone" value={confirmData.phone} onChange={handleChange} disabled={isPending} type="text" required />
                                </div>
                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input name="email" value={confirmData.email} onChange={handleChange} disabled={isPending} type="email" required />
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
                        </div>
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
                                    <Input name="salary" value={confirmData.salary} onChange={handleChange} disabled={isPending} type="text" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>SSB</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="ssb" value={confirmData.ssb} onChange={handleChange} disabled={isPending} type="text" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>Income Tax</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="incomeTax" value={confirmData.incomeTax} onChange={handleChange} disabled={isPending} type="text" required />
                                    <Label>MMK</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Label>Bonus</Label>
                                <div className="flex items-end space-x-2">
                                    <Input name="bonus" value={confirmData.bonus} onChange={handleChange} disabled={isPending} type="text" />
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