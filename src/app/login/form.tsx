'use client';

// React
import { useActionState } from "react";

// UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Action
import { login } from "@/actions/auth.action";

export function LoginForm() {
    const [_, formAction, isPending] = useActionState(login, null);

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
                    <Input disabled={isPending} name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
            </div>
        </form>
    )
}
