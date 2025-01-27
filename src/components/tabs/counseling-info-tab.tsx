'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronDown, X } from 'lucide-react';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

export default function CounselingInfoTab() {
    function handleCounselingDeletion() {
        console.log('Deleted!');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Collateral Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="col-span-3 grid grid-cols-3 gap-4 mb-8">
                    <div className="col-span-1">
                        <Label>Date</Label>
                        <Input name="counselingDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-span-2">
                        <Label>Subject</Label>
                        <Input name="collateralName" type="text" />
                    </div>
                    <div className="col-span-3">
                        <Label>Details</Label>
                        <Textarea name="collateralDeatail" />
                    </div>
                    <div className="col-span-3">
                        <Label>Corrective Measure</Label>
                        <Textarea name="collateralDeatail" />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
                    </div>
                </div>
                <Table>
                    <TableCaption>A list of Counseling Info added.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-center">Details</TableHead>
                            <TableHead className="text-center">Corrective Measure</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">2025/01/27</TableCell>
                            <TableCell>Something</TableCell>
                            <TableCell className="text-center w-[250px] break-all">Something Something Something Something Something Something Something Something Something</TableCell>
                            <TableCell className="text-center w-[250px] break-all">Something Something Something Something Something Something Something Something Something</TableCell>
                            <TableCell className="text-right" onClick={handleCounselingDeletion}>
                                <Button className="bg-transparent text-red-800 hover:bg-gray-200"><X /></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}