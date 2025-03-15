'use client';

// Components: UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// React
import { useEffect, useState } from "react";

export default function ConsultingDetailsTab({ presetConsultingInfos }: {
    presetConsultingInfos: string[] | null;
}) {
    const [consultingInfos, setConsultingInfos] = useState<{ id: number; detail: string }[]>([]);

    useEffect(() => {
        if (presetConsultingInfos && presetConsultingInfos.length > 0) {
            const formattedConsultingInfos = presetConsultingInfos.map((detail, index) => ({
                id: index + 1,
                detail
            }));
            setConsultingInfos(formattedConsultingInfos);
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Consulting Info</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead className="text-left">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consultingInfos.map((consultingInfo, index) => (
                            <TableRow key={consultingInfo.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="break-all text-left">{consultingInfo.detail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}