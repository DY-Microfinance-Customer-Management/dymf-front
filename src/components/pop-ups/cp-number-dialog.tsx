// React
import { useEffect, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CpNumberDialog({ open, onClose, onSelect }: { open: boolean, onClose: () => void, onSelect: (cpNo: string) => void }) {
    const [cpNumbers, setCpNumbers] = useState<string[]>([]);
    const [filteredCpNumbers, setFilteredCpNumbers] = useState<string[]>([]);
    const [cpNo, setCpNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ Dialog가 열릴 때 모든 CP 번호 가져오기
    useEffect(() => {
        if (open) {
            fetchCpNumbers();
        }
    }, [open]);

    const fetchCpNumbers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/cp`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch CP Numbers.");

            const data = await response.json();
            setCpNumbers(data);
            setFilteredCpNumbers(data);
        } catch (err) {
            setError("Failed to fetch CP Numbers.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ 입력값에 따라 CP 번호 필터링
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
                        {/* <Label htmlFor="cpNo" className="text-right">
                            CP No.
                        </Label> */}
                        <Input
                            id="cpNo"
                            value={cpNo}
                            onChange={(e) => setCpNo(e.target.value)}
                            className="col-span-4"
                            placeholder="Search CP Number..."
                        />
                    </div>

                    {/* ✅ 로딩 상태 */}
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* ✅ CP 번호 리스트 출력 */}
                    {!loading && filteredCpNumbers.length > 0 && (
                        <div className="border p-3 rounded-md max-h-60 overflow-auto space-y-2">
                            {filteredCpNumbers.map((num, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full flex justify-between"
                                    onClick={() => {
                                        onSelect(num); // 부모 컴포넌트에 선택된 값 전달
                                        onClose(); // Dialog 닫기
                                    }}
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* ✅ 검색 결과 없음 */}
                    {/* {!loading && filteredCpNumbers.length === 0 && <p className="text-gray-500">No CP Numbers found.</p>} */}
                </div>
            </DialogContent>
        </Dialog>
    );
}