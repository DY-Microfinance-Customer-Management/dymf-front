'use client';

// React
import { useState, useEffect } from "react";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"

// Icons
import { ChevronDown } from "lucide-react";

// Types
import { Employee } from "@/\btypes";

import SelectEmployeePage from "./history-SelectEmployeePage";
import EmployeeRegistrationPage from "./history-EmployeeRegistrationPage";

export default function Page() {
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    // const [data, setData] = useState(null)
    // const [isLoading, setLoading] = useState(true)  
    // useEffect(() => {
    //     fetch(`${process.env.SERVER_URL}/personal`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setData(data)
    //             setLoading(false)
    //         })
    //     console.log(`Data: ${data}`)
    // }, [])

    // Create Employee
    async function createEmployee(employeeData: Employee) {
        const response = await fetch(`${process.env.SERVER_URL}/personal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeData }),
        });

        if (!response.ok) {
            console.error('/HR: Error while creating Employee!');
            return;
        }

        // const data = await response.json();
        // console.log(data);
    }

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

    const goBackToSelectCustomer = () => {
        setSelectedEmployee(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {selectedEmployee && !isConfirming ? (
                <EmployeeRegistrationPage selectedEmployee={selectedEmployee} onBack={goBackToSelectCustomer} />
            ) : (
                <SelectEmployeePage onConfirm={confirmSelection} />
            )}

            {/* Confirmation Dialog */}
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