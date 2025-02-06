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
                    Repayment (Batch)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="col-span-3 grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <Label>Start Date</Label>
                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-span-1">
                        <Label>End Date</Label>
                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-span-1 flex justify-end items-end">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Search</Button>
                    </div>
                    <div className="col-span-3 flex justify-end items-end mt-8 mb-2">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Paid</Button>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 ml-2">Cancel Payment</Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700 ml-2">Overdue</Button>
                    </div>
                </div>
                <Table>
                    <TableCaption>A list of Repayments from start date to end date.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Loan No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">2025/01/28</TableCell>
                            <TableCell>124lh12h4k1</TableCell>
                            <TableCell>Someone</TableCell>
                            <TableCell>1000000</TableCell>
                            <TableCell>10000</TableCell>
                            <TableCell>1010000</TableCell>
                            <TableCell className="text-right">
                                <p className="text-green-900 font-extrabold">Paid</p>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}