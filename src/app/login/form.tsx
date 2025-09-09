'use client';

// React
import { useActionState, useEffect } from "react";

// UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";

// Action
import { login } from "@/actions/auth.action";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, null);
    useEffect(() => {
        if (state?.status === 200) {
            console.log('pass');
        } else {
            const message = state?.message;
            if (message != undefined) {
                toast.error(`${state?.message}`);
            }
        }
    }, [state]);

    return (
        <form action={formAction}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="id">ID</Label>
                    <Input disabled={isPending} name="id" type="id" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <PasswordInput disabled={isPending} name="password" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
            </div>
        </form>
    )
}
