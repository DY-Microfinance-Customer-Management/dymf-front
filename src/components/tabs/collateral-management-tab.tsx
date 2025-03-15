'use client';

// Components: UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

// Components: Icon
import { ChevronDown, X } from 'lucide-react';

// React
import { useState, useEffect } from "react";

// Types
import { CollateralTypeEnum, GetCollateralSchema } from "@/types";
const collateralTypeMap: Record<string, CollateralTypeEnum> = {
    Property: CollateralTypeEnum.Property,
    Car: CollateralTypeEnum.Car,
};

export default function CollateralManagementTab({ setInfoData }: {
    setInfoData: (data: any) => void;
}) {
    const [collaterals, setCollaterals] = useState<GetCollateralSchema[]>([]);
    const [nextId, setNextId] = useState(1);
    const [collateralType, setCollateralType] = useState<string>('-');
    const [collateralName, setCollateralName] = useState('');
    const [collateralDetail, setCollateralDetail] = useState('');

    useEffect(() => {
        setInfoData((prev: any) => ({ ...prev, collateralsCnt: collaterals.length }));
    }, [collaterals, setInfoData]);

    const handleCollateralType = (value: string) => {
        setCollateralType(value);
    };

    function handleAddCollateral() {
        if (collateralType === '-' || !collateralName.trim() || !collateralDetail.trim()) return;

        const enumType = collateralTypeMap[collateralType];
        if (enumType === undefined) return;

        const newCollateral: GetCollateralSchema = {
            id: nextId,
            type: enumType,
            name: collateralName,
            detail: collateralDetail,
        };

        setCollaterals([...collaterals, newCollateral]);
        setNextId(nextId + 1);
        setCollateralType('-');
        setCollateralName('');
        setCollateralDetail('');
    }

    function handleCollateralDeletion(id: number) {
        setCollaterals((prev) => prev.filter((collateral) => collateral.id !== id));
    }

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
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                                    {collateralType}
                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleCollateralType("Property")}>Property</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCollateralType("Car")}>Car</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="col-span-2">
                        <Label>Name</Label>
                        <Input type="text" value={collateralName} onChange={(e) => setCollateralName(e.target.value)} />
                    </div>
                    <div className="col-span-3">
                        <Label>Details</Label>
                        <Textarea value={collateralDetail} onChange={(e) => setCollateralDetail(e.target.value)} />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddCollateral}>
                            Add
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">Details</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collaterals.map((collateral) => (
                            <TableRow key={collateral.id}>
                                <TableCell className="font-medium">{CollateralTypeEnum[collateral.type]}</TableCell>
                                <TableCell>{collateral.name}</TableCell>
                                <TableCell className="text-center w-[250px] break-all">{collateral.detail}</TableCell>
                                <TableCell className="text-right">
                                    <Button className="bg-transparent text-red-800 hover:bg-gray-200" onClick={() => handleCollateralDeletion(collateral.id)}>
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {collaterals.map((collateral) => (
                    <input key={collateral.id} name="collaterals" value={JSON.stringify(collateral)} hidden readOnly />
                ))}
            </CardContent>
        </Card>
    );
}