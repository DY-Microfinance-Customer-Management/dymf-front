'use client';

// Components: UI
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Types
import { GetGuarantorSchema } from "@/types";

export default function GuarantorDetailsTab({ presetGuarantorIds }: {
    presetGuarantorIds: { id: number, guarantor: { id: number } }[] | null;
}) {
    const [guarantors, setGuarantors] = useState<GetGuarantorSchema[]>([]);

    useEffect(() => {
        if (presetGuarantorIds && presetGuarantorIds.length > 0) {
            const guarantorIds: string[] = presetGuarantorIds.map(g => String(g.guarantor.id));
            fetch(`/api/getOneGuarantor?guarantors=${guarantorIds}`)
                .then(res => res.json())
                .then(data => {
                    const presetGuarantorsData = data.guarantorsData;
                    console.log(presetGuarantorsData)
                    setGuarantors(presetGuarantorsData);
                });
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">
                    <div className="flex justify-between">
                        Guarantor Management
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>CP No.</TableHead>
                            <TableHead>NRC No.</TableHead>
                            <TableHead>Phone</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guarantors.map((guarantor) => (
                            <TableRow key={guarantor.id}>
                                <TableCell>{guarantor.name}</TableCell>
                                <TableCell>{guarantor.cp_number.area_number}</TableCell>
                                <TableCell>{guarantor.nrc_number}</TableCell>
                                <TableCell>{guarantor.phone_number}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}