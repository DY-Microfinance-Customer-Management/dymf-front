'use client';

// Components: UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// React
import { useEffect, useState } from "react";

// Types
import { CollateralTypeEnum, GetCollateralSchema } from "@/types";

export default function CollateralDetailsTab({ presetCollaterals }: {
    presetCollaterals: GetCollateralSchema[] | null;
}) {
    const [collaterals, setCollaterals] = useState<GetCollateralSchema[]>([]);

    useEffect(() => {
        if (presetCollaterals && presetCollaterals.length > 0) {
            const formattedCollaterals = presetCollaterals.map((collateral) => ({
                id: collateral.id,
                type: collateral.type,
                name: collateral.name,
                detail: collateral.detail,
            }));

            setCollaterals(formattedCollaterals);
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Collateral Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px]">Type</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collaterals.map((collateral) => (
                            <TableRow key={collateral.id}>
                                <TableCell className="font-medium">{CollateralTypeEnum[collateral.type]}</TableCell>
                                <TableCell className="text-center">{collateral.name}</TableCell>
                                <TableCell className="break-all">{collateral.detail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}