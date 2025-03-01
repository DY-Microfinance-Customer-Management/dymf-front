// React
import { useEffect, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GetCheckPointSchema } from "@/types";

export function CpNumberDialog({ open, onClose, onSelect }: { open: boolean, onClose: () => void, onSelect: (cpNo: string) => void }) {
    const [cpNumbers, setCpNumbers] = useState<string[]>([]);
    const [filteredCpNumbers, setFilteredCpNumbers] = useState<string[]>([]);
    const [cpNo, setCpNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            fetchCpNumbers();
        }
    }, [open]);

    const fetchCpNumbers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/getCpNumbers', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            const cpNumbers: GetCheckPointSchema[] = data.cpNumbers;
            const areaNames = cpNumbers.map(cp => cp.area_number)
            setCpNumbers(areaNames);
            setFilteredCpNumbers(data);
        } catch (err) {
            setError("Failed to fetch CP Numbers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cpNo) {
            setFilteredCpNumbers(cpNumbers);
        } else {
            setFilteredCpNumbers(cpNumbers.filter((num) => num.includes(cpNo)));
        }
    }, [cpNo, cpNumbers]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select CP Number</DialogTitle>
                    <DialogDescription>Choose a CP number from the list or search for one.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="cpNo"
                            value={cpNo}
                            onChange={(e) => setCpNo(e.target.value)}
                            className="col-span-4"
                            placeholder="Search CP Number..."
                        />
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && filteredCpNumbers.length > 0 && (
                        <div className="border p-3 rounded-md max-h-60 overflow-auto space-y-2">
                            {filteredCpNumbers.map((num, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full flex justify-between"
                                    onClick={() => {
                                        onSelect(num);
                                        onClose();
                                    }}
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                    )}

                    {!loading && filteredCpNumbers.length === 0 && <p className="text-gray-500">No CP Numbers found.<br/>Please register Check Point first.</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}