// 'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";

export default async function Page() {
    const [cpList, setCpList] = useState<{ id: number; cpNo: string; assignedOfficers: string[] }[]>([]);
    const [newCp, setNewCp] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCp, setSelectedCp] = useState<number | null>(null);

    const loanOfficers = ["John Doe", "Jane Smith", "Michael Lee", "Sarah Kim"];

    // CP No. 추가
    const addCpNo = () => {
        if (newCp.trim() !== "") {
            setCpList([...cpList, { id: Date.now(), cpNo: newCp.trim(), assignedOfficers: [] }]);
            setNewCp("");
            setIsDialogOpen(false);
        }
    };

    // 선택된 CP No. 삭제
    const deleteSelectedCp = () => {
        if (selectedCp !== null) {
            setCpList(cpList.filter((cp) => cp.id !== selectedCp));
            setSelectedCp(null);
        }
    };

    // Loan Officer 배정
    const toggleOfficerAssignment = (cpId: number, officer: string) => {
        setCpList((prevCpList) =>
            prevCpList.map((cp) =>
                cp.id === cpId
                    ? {
                        ...cp,
                        assignedOfficers: cp.assignedOfficers.includes(officer)
                            ? cp.assignedOfficers.filter((o) => o !== officer)
                            : [...cp.assignedOfficers, officer],
                    }
                    : cp
            )
        );
    };

    return (
        <div className="flex flex-col p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Check Point Management</h1>
                <div className="space-x-4">
                    {/* Add CP No. 버튼 */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add CP No.</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Enter CP No."
                                value={newCp}
                                onChange={(e) => setNewCp(e.target.value)}
                            />
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={addCpNo}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete 버튼 (선택된 CP No.가 있을 때만 활성화) */}
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={selectedCp === null}
                        onClick={deleteSelectedCp}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-900">CP No. List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">CP No.</TableHead>
                                <TableHead className="w-1/2">Assigned Officers</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(
                                cpList.map((cp) => (
                                    <React.Fragment key={cp.id}>
                                        <TableRow className="cursor-pointer hover:bg-gray-100">
                                            <TableCell>{cp.cpNo}</TableCell>
                                            <TableCell>
                                                {cp.assignedOfficers.length > 0 ? cp.assignedOfficers.join(", ") : "None"}
                                            </TableCell>
                                            <TableCell onClick={() => setSelectedCp(selectedCp === cp.id ? null : cp.id)} className="text-center cursor-pointer">
                                                {selectedCp === cp.id ? (<ChevronUp className="w-5 h-5 text-gray-500" />) : (<ChevronDown className="w-5 h-5 text-gray-500" />)}
                                            </TableCell>
                                        </TableRow>
                                        {selectedCp === cp.id && (
                                            <TableRow className="bg-gray-50">
                                                <TableCell colSpan={3}>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-semibold mb-2">Assign Loan Officers</h3>
                                                        {loanOfficers.map((officer) => (
                                                            <div key={officer} className="flex justify-between items-center py-2 border-b">
                                                                <span>{officer}</span>
                                                                <Switch
                                                                    checked={cp.assignedOfficers.includes(officer)}
                                                                    onCheckedChange={() => toggleOfficerAssignment(cp.id, officer)} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>

                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
