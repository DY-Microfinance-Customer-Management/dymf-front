'use client';

// Action
import { createFixedAssetAction } from "@/actions/create-fixed-asset.action";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// React
import { useActionState, useEffect, useState } from "react";

// Types
import { GetFixedAssetSchema } from "@/types";

export default function Page() {
    const [state, formAction, isPending] = useActionState(createFixedAssetAction, null);
    const [assets, setAssets] = useState<GetFixedAssetSchema[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
    const [nextCursor, setNextCursor] = useState("");
    const [remainingAssetCnt, setRemainingAssetCnt] = useState<number>(1);

    const [isDecliningBalance, setIsDecliningBalance] = useState(false);
    const [depreciationPeriod, setDepreciationPeriod] = useState('');
    const [depreciationRatio, setDepreciationRatio] = useState('');

    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success("Fixed Asset has been successfully registered!");
            fetchAssets("");
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    const handleSwitchChange = (checked: boolean) => {
        setIsDecliningBalance(checked);
    };

    const fetchAssets = (cursor: string) => {
        let apiUrl = `/api/getFixedAssets?cursor=${cursor}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data === null) return;
                const fetchedAssets = data.assets;
                const returnCursor = data.returnCursor;
                const count = data.count;

                setAssets((prev) => {
                    const existingIds = new Set(prev.map(asset => asset.id));
                    const newAssets = fetchedAssets.filter((asset: any) => !existingIds.has(asset.id));
                    return [...prev, ...newAssets];
                });

                setNextCursor(returnCursor);
                setRemainingAssetCnt(count);
            });
    };

    const handleDeleteAsset = async () => {
        if (!selectedAssetId) return;

        try {
            const res = await fetch(`/api/deleteFixedAsset?id=${selectedAssetId}`);
            if (!res.ok) throw new Error();

            toast.success("Fixed Asset deleted successfully!");
            setAssets((prev) => prev.filter(asset => asset.id !== selectedAssetId));
            setSelectedAssetId(null);
        } catch (err) {
            toast.error("Failed to delete asset.");
        }
    };

    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (Math.floor(scrollTop + clientHeight) === scrollHeight - 1 && remainingAssetCnt !== 0) {
            fetchAssets(nextCursor);
        }
    };

    useEffect(() => {
        fetchAssets("");
    }, []);

    return (
        <div className="flex flex-col p-10 space-y-8 min-h-screen">
            <h1 className="text-3xl font-bold">Fixed Asset Management</h1>

            <div className="flex justify-between space-x-8">
                <Card className="w-1/3">
                    <form action={formAction}>
                        <CardHeader>
                            <CardTitle className="text-green-800">Add Fixed Assets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label>Item Name</Label>
                                    <Input name="itemName" disabled={isPending} className="w-full" type="text" required />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Purchase Date</Label>
                                    <Input name="purchaseDate" disabled={isPending} className="w-full" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Value</Label>
                                    <Input name="value" disabled={isPending} className="w-full" type="text" required />
                                </div>
                                <div className="col-span-1 flex items-center space-x-4">
                                    <Switch name="isStraightLineMethod" checked={isDecliningBalance} onCheckedChange={handleSwitchChange} />
                                    <Label>{isDecliningBalance ? "Declining Balance method" : "Straight-Line method"}</Label>
                                </div>
                                <div className="col-span-1">
                                    <Label className="text-black">Depreciation Period</Label>
                                    <div className="flex items-end space-x-2">
                                        <Input name="depreciationPeriod" type="text" disabled={isPending} value={depreciationPeriod} onChange={(e) => setDepreciationPeriod(e.target.value)} required />
                                        <Label className="text-black">years</Label>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <Label className={isDecliningBalance ? "text-black" : "text-gray-400"}>Depreciation Ratio</Label>
                                    <div className="flex items-end space-x-2">
                                        <Input name="depreciationRatio" type="text" disabled={!isDecliningBalance || isPending} value={depreciationRatio} onChange={(e) => setDepreciationRatio(e.target.value)} />
                                        <Label className={isDecliningBalance ? "text-black" : "text-gray-400"}>%</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Confirm</Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="w-2/3">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-green-800">Fixed Asset List</CardTitle>
                            <div className="w-[150px]">
                                <Button onClick={handleDeleteAsset} disabled={!selectedAssetId} className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full">Delete Selected</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96 border rounded-md" onScrollCapture={scrollHandler}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">Select</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-center">Purchase Date</TableHead>
                                        <TableHead className="text-center">Value</TableHead>
                                        <TableHead className="text-right">Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.length > 0 ? (
                                        assets.map((asset: any) => (
                                            <TableRow key={asset.id} className="hover:bg-gray-100">
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAssetId === asset.id}
                                                        onChange={() =>
                                                            setSelectedAssetId(prev => (prev === asset.id ? null : asset.id))
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{asset.name}</TableCell>
                                                <TableCell className="text-center">
                                                    {asset.purchase_date.split("T")[0]}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {Number(asset.price).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {asset.method_status ? "Declining Balance" : "Straight-Line"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-2">
                                                No assets found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
