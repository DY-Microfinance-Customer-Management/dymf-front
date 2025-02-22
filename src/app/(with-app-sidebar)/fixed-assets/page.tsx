'use client';

// Actions
import { useActionState, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
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
                                    <Label>Name</Label>
                                    <Input name="name" disabled={isPending} className="w-full" type="text" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Price</Label>
                                    <PasswordInput name="password" disabled={isPending} className="w-full" />
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