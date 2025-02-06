"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Employee } from "@/\btypes";
import { fetchEmployees } from "@/lib/load-employees";

export default function SelectEmployeePage({ onConfirm }: { onConfirm: (employee: string) => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const employeesPerPage = 5;

    useEffect(() => {
        async function loadEmployees() {
            const { employees, totalPages } = await fetchEmployees(currentPage, searchQuery);
            setEmployees(employees);
            setTotalPages(totalPages);
        }
        loadEmployees();
    }, [currentPage, searchQuery]);

    return (
        <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
            <h1 className="text-2xl font-bold">Select Employee</h1>
            <Card className="w-full max-w-3xl">
                <CardContent>
                    <Input
                        className="w-full mt-6"
                        placeholder="Search by Employee Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" onClick={() => setCurrentPage(1)}>
                        Search
                    </Button>
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
                            {employees.map((employee, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => onConfirm(employee.name)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.nrcNo}</TableCell>
                                    <TableCell>{employee.dob}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
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
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>
        </div>
    );
}
