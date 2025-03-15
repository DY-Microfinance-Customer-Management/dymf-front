'use client';

// Components: UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

// Components: Icon
import { X } from "lucide-react";

// React
import { useEffect, useState } from "react";

export default function ConsultingInfoTab({ setInfoData, }: {
    setInfoData: (data: any) => void; 
}) {
    const [consultingInfos, setConsultingInfos] = useState<{ id: number; detail: string }[]>([]);
    const [detailInput, setDetailInput] = useState("");

    useEffect(() => {
        setInfoData((prev: any) => ({ ...prev, consultingInfosCnt: consultingInfos.length, }));
    }, [consultingInfos, setInfoData]);

    function handleAddConsultingInfo() {
        if (!detailInput.trim()) return;

        const newConsultingInfo = {
            id: consultingInfos.length > 0 ? consultingInfos[consultingInfos.length - 1].id + 1 : 1,
            detail: detailInput,
        };

        setConsultingInfos([...consultingInfos, newConsultingInfo]);
        setDetailInput("");
    }

    function handleCounselingDeletion(id: number) {
        setConsultingInfos((prev) => prev.filter((info) => info.id !== id));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Consulting Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="col-span-3 grid grid-cols-3 gap-4 mb-8">
                    <div className="col-span-3">
                        <Label>Details</Label>
                        <Textarea value={detailInput} onChange={(e) => setDetailInput(e.target.value)} />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddConsultingInfo}>
                            Add
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consultingInfos.map((consultingInfo, index) => (
                            <TableRow key={consultingInfo.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="break-all">{consultingInfo.detail}</TableCell>
                                <TableCell className="text-right">
                                    <Button type="button" className="bg-transparent text-red-800 hover:bg-gray-200" onClick={() => handleCounselingDeletion(consultingInfo.id)}>
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {consultingInfos.map((consultingInfo) => (
                    <input key={consultingInfo.id} name="consultingInfos" value={consultingInfo.detail} hidden readOnly />
                ))}
            </CardContent>
        </Card>
    );
}