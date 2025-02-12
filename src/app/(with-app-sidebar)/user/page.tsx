'use client';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
    return (
        <div className="flex flex-col p-10 space-y-8 min-h-screen">
            <h1 className="text-3xl font-bold">User Management</h1>

            <div className="flex justify-between space-x-8">
                <Card className="w-1/3">
                    <CardHeader>
                        <CardTitle className="text-green-800">Add Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-1">
                                <Label>Principal</Label>
                                <Input className="w-full" type="number" />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label>Interest Rate (%)</Label>
                                <Input className="w-full" type="number" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                    </CardFooter>
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