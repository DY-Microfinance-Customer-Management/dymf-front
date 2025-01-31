'use client';

// UI Comonents
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">
                    Search Loan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="col-span-3 grid grid-cols-3 gap-4 mb-6">
                    <div className="col-span-1">
                        <Label>Customer Name</Label>
                        <Input type="text" />
                    </div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1 flex justify-end items-end">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Search</Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Overdue Loan No.</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>NRC No.</TableHead>
                            <TableHead>Loan Type</TableHead>
                            <TableHead className="text-right">Remaining Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}