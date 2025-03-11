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
import { useState } from "react";

// Types
import { PostCollateralSchema, CollateralTypeEnum } from "@/types";

interface CollateralItem extends PostCollateralSchema {
    id: number; // 별도 관리 ID
}

// 🔹 문자열을 숫자로 변환하는 매핑
const collateralTypeMap: Record<string, CollateralTypeEnum> = {
    Property: CollateralTypeEnum.Property,
    Car: CollateralTypeEnum.Car,
};

export default function CollateralManagementTab() {
    const [collaterals, setCollaterals] = useState<CollateralItem[]>([]);
    const [nextId, setNextId] = useState(1); // ID 관리
    const [collateralType, setCollateralType] = useState<string>('-');
    const [collateralName, setCollateralName] = useState('');
    const [collateralDetail, setCollateralDetail] = useState('');

    // 🔹 문자열을 Enum으로 변환하여 상태 업데이트
    const handleCollateralType = (value: string) => {
        setCollateralType(value);
    };

    function handleAddCollateral() {
        if (collateralType === '-' || !collateralName.trim() || !collateralDetail.trim()) return; // 유효성 검사

        // 🔹 문자열을 숫자로 변환 (매핑 사용)
        const enumType = collateralTypeMap[collateralType];
        if (enumType === undefined) return; // 유효하지 않으면 추가 X

        const newCollateral: CollateralItem = {
            id: nextId, // 별도 ID 관리
            type: enumType, // 숫자 기반 Enum 사용
            name: collateralName,
            detail: collateralDetail,
        };

        setCollaterals([...collaterals, newCollateral]);
        setNextId(nextId + 1); // 다음 ID 증가
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
                                    <Button 
                                        className="bg-transparent text-red-800 hover:bg-gray-200"
                                        onClick={() => handleCollateralDeletion(collateral.id)}
                                    >
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Hidden inputs for form submission */}
                {collaterals.map((collateral) => (
                    <input key={collateral.id} name="collaterals" value={JSON.stringify(collateral)} hidden readOnly />
                ))}
            </CardContent>
        </Card>
    );
}