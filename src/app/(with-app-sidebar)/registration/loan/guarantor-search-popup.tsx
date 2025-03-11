'use client';

// Components: UI
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// React
import { useEffect, useState } from "react";

// Types
import { GetGuarantorSchema } from "@/types";

interface GuarantorSearchPopupProps {
    onClose: () => void;
    onConfirm: (selectedGuarantors: GetGuarantorSchema[]) => void;
    existingGuarantors: GetGuarantorSchema[];
}

export default function GuarantorSearchPopup({ onClose, onConfirm, existingGuarantors }: GuarantorSearchPopupProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [guarantors, setGuarantors] = useState<GetGuarantorSchema[]>([]);
    const [selectedGuarantors, setSelectedGuarantors] = useState<GetGuarantorSchema[]>(existingGuarantors);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [remainingGuarantorCnt, setRemainingGuarantorCnt] = useState<number>(1);

    useEffect(() => {
        fetchGuarantors("");
    }, []);

    const fetchGuarantors = (cursor: string, query: string = "") => {
        setLoading(true);
        let apiUrl = `/api/getGuarantors?cursor=${cursor}`;
        if (query.trim()) {
            apiUrl += `&name=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setGuarantors([]);
                } else {
                    const fetchedGuarantors = data.guarantors;
                    const returnCursor = data.returnCursor;
                    const count = data.count;

                    setGuarantors((prev) => {
                        const existingIds = new Set(prev.map(emp => emp.id));
                        const newGuarantors = fetchedGuarantors.filter((emp: { id: number }) => !existingIds.has(emp.id));
                        return [...prev, ...newGuarantors];
                    });

                    setNextCursor(returnCursor);
                    setRemainingGuarantorCnt(count);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleSearch = () => {
        setGuarantors([]);
        fetchGuarantors('', searchQuery);
    };

    const handleSelect = (guarantor: GetGuarantorSchema) => {
        if (existingGuarantors.some((g) => g.id === guarantor.id)) {
            return;
        }

        setSelectedGuarantors((prev) =>
            prev.some((g) => g.id === guarantor.id)
                ? prev.filter((g) => g.id !== guarantor.id)
                : [...prev, guarantor]
        );
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select Guarantors</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Search by Guarantor Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>

                <ScrollArea className="h-72 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>NRC No.</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Select</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guarantors.length > 0 ? (
                                guarantors.map((guarantor) => (
                                    <TableRow
                                        key={guarantor.id}
                                        onClick={() => handleSelect(guarantor)}
                                        className={`cursor-pointer ${
                                            selectedGuarantors.some((g) => g.id === guarantor.id)
                                                ? existingGuarantors.some((g) => g.id === guarantor.id)
                                                    ? "bg-blue-100 cursor-not-allowed"
                                                    : "bg-green-100"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <TableCell>{guarantor.name}</TableCell>
                                        <TableCell>{guarantor.nrc_number}</TableCell>
                                        <TableCell>{guarantor.phone_number}</TableCell>
                                        <TableCell>
                                            {selectedGuarantors.some((g) => g.id === guarantor.id) ? (
                                                existingGuarantors.some((g) => g.id === guarantor.id) ? (
                                                    "✅"
                                                ) : (
                                                    "✅"
                                                )
                                            ) : (
                                                "⬜"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No guarantors found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <div className="flex justify-end space-x-4 mt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onConfirm(selectedGuarantors)}
                    >
                        Confirm ({selectedGuarantors.length})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}