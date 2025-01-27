'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

import { X } from 'lucide-react';

export default function GuarantorManagementTab() {
    function handleGuarantorDeletion() {
        console.log('Deleted!');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">
                    <div className="flex justify-between">
                        Guarantor Management
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of Guarantors selected.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>NRC No.</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>CP No.</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Something</TableCell>
                            <TableCell>124lh12h4k1</TableCell>
                            <TableCell>010-5555-5555</TableCell>
                            <TableCell>TW-5</TableCell>
                            <TableCell className="text-right">
                                <Button type="button" onClick={handleGuarantorDeletion} className="bg-transparent text-red-800 hover:bg-gray-200"><X /></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}