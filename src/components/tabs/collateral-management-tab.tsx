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

export default function CollateralManagementTab() {
    function handleCollateralDeletion() {
        console.log('Deleted!');
    };

    const [collateralType, setCollateralType] = useState('[Select]');
    const handleCollateralType = (value: string) => {
        setCollateralType(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Collateral Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="col-span-3 grid grid-cols-3 gap-4 mb-8">
                    <div className="col-span-1">
                        <Label>Type</Label>
                        <DropdownMenu>
                            <input required name="collateralType" value={collateralType} hidden readOnly />
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                    {collateralType}
                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleCollateralType("Equity")}>Equity</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCollateralType("Car")}>Car</DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => handleCollateralType("Something Else")}>Bullet</DropdownMenuItem> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="col-span-2">
                        <Label>Name</Label>
                        <Input name="collateralName" type="text" />
                    </div>
                    <div className="col-span-3">
                        <Label>Details</Label>
                        <Textarea name="collateralDeatail" />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
                    </div>
                </div>
                <Table>
                    <TableCaption>A list of Collaterals added.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">Details</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Car</TableCell>
                            <TableCell>Something</TableCell>
                            <TableCell className="text-center w-[250px] break-all">SomethingSomethingSomethingSomethingSomethingSomethingSomethingSomethingSomethingSomething</TableCell>
                            <TableCell className="text-right" onClick={handleCollateralDeletion}>
                                <Button className="bg-transparent text-red-800 hover:bg-gray-200"><X /></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}