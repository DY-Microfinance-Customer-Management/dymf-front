"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EmployeeRegistrationPage({ selectedEmployee, onBack }: { selectedEmployee: string; onBack: () => void }) {
    const [isPending, setIsPending] = useState(false);

    return (
        <form>
            <div className="flex flex-col p-10 space-y-8 min-h-screen">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Employee Registration</h1>
                        <p className="text-gray-600">Selected Employee: {selectedEmployee}</p>
                        <p className="text-gray-600">Status: Working</p>
                    </div>
                    <div className="space-x-4">
                        <Button variant="secondary" onClick={onBack}>Back</Button>
                        <Button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-800">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input disabled={isPending} required name="name" type="text" />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input disabled={isPending} required name="phone" type="text" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
