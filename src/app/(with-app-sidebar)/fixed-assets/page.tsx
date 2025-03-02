'use client';

// Actions
import { useActionState, useEffect, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// React
import { createUserAction } from "@/actions/create-user.action";
import { useRouter } from "next/navigation";

export default function Page() {
    // Router
    const router = useRouter();

    // Server Action
    const [state, formAction, isPending] = useActionState(createUserAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`User has been successfully registered!`);
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.push('/login');
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    // Depreciation Handler
    const [isDecliningBalance, setIsDecliningBalance] = useState(false);
    const [depreciationPeriod, setDepreciationPeriod] = useState('');
    const [depreciationRatio, setDepreciationRatio] = useState('');
    const handleSwitchChange = (checked: boolean) => {
        setIsDecliningBalance(checked);

        if (checked) {
            setDepreciationPeriod('');
        } else {
            setDepreciationRatio('');
        }
    };

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
                                    <Input name="itemName" disabled={isPending} className="w-full" type="text" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Purchase Date</Label>
                                    <Input name="purchaseDate" disabled={isPending} className="w-full" type="date" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Value</Label>
                                    <Input name="value" disabled={isPending} className="w-full" type="text" />
                                </div>
                                <div className="col-span-1 flex items-center space-x-4">
                                    <Switch checked={isDecliningBalance} onCheckedChange={handleSwitchChange} />
                                    <Label>{isDecliningBalance ? "Declining Balance method" : "Straight-Line method"}</Label>
                                </div>
                                <div className="col-span-1">
                                    <Label className={isDecliningBalance ? "text-gray-400" : "text-black"}>
                                        Depreciation Period
                                    </Label>
                                    <div className="flex items-end space-x-2">
                                        <Input name="depreciationPeriod" type="text" disabled={isDecliningBalance} value={depreciationPeriod} onChange={(e) => setDepreciationPeriod(e.target.value)} />
                                        <Label className={isDecliningBalance ? "text-gray-400" : "text-black"}>years</Label>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <Label className={!isDecliningBalance ? "text-gray-400" : "text-black"}>
                                        Depreciation Ratio
                                    </Label>
                                    <div className="flex items-end space-x-2">
                                        <Input
                                            name="depreciationRatio"
                                            type="text"
                                            disabled={!isDecliningBalance}
                                            value={depreciationRatio}
                                            onChange={(e) => setDepreciationRatio(e.target.value)}
                                        />
                                        <Label className={!isDecliningBalance ? "text-gray-400" : "text-black"}>%</Label>
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
                    <CardContent>
                        <div>Hello</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}