'use client';

// Components: UI
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Components: PopUp
import GuarantorSearchPopup from "@/components/pop-ups/guarantor-search-popup";

// Types
import { GetGuarantorSchema } from "@/types";

export default function GuarantorManagementTab() {
    const [guarantors, setGuarantors] = useState<GetGuarantorSchema[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    function handleGuarantorDeletion(id: number) {
        setGuarantors((prev) => {
            const updatedGuarantors = prev.filter((guarantor) => guarantor.id !== id);
            console.log(`guarantor management tab: updated: ${updatedGuarantors.length}`);
            return updatedGuarantors;
        });
    }

    function handleGuarantorsSelected(selectedGuarantors: GetGuarantorSchema[]) {
        setGuarantors((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const newGuarantors = selectedGuarantors.filter((g) => !existingIds.has(g.id));
            console.log(`guarantor management tab: new: ${newGuarantors.length}`);
            return [...prev, ...newGuarantors];
        });
        setIsPopupOpen(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">
                    <div className="flex justify-between">
                        Guarantor Management
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsPopupOpen(true)}>
                            Search
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
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
                        {guarantors.map((guarantor) => (
                            <TableRow key={guarantor.id}>
                                <TableCell className="font-medium">{guarantor.name}</TableCell>
                                <TableCell>{guarantor.nrc_number}</TableCell>
                                <TableCell>{guarantor.phone_number}</TableCell>
                                <TableCell>{guarantor.cp_number.area_number}</TableCell>
                                <TableCell className="text-right">
                                    <Button type="button" onClick={() => handleGuarantorDeletion(guarantor.id)} className="bg-transparent text-red-800 hover:bg-gray-200">
                                        <X />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {guarantors.map((guarantor) => (
                    <input key={guarantor.id} name="guarantors" value={guarantor.id} hidden readOnly />
                ))}
            </CardContent>

            {isPopupOpen && (
                <GuarantorSearchPopup onClose={() => setIsPopupOpen(false)} onConfirm={handleGuarantorsSelected} existingGuarantors={guarantors} />
            )}
        </Card>
    );
}