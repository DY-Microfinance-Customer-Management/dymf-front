'use client';

// Actions
import { useActionState, useEffect, useState } from "react";

// UI Components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// React
import { createUserAction } from "@/actions/create-user.action";
import { useRouter } from "next/navigation";

export default function Page() {
    // Router
    const router = useRouter();

    // Variables
    const [users, setUsers] = useState<{ id: number; userName: string; role: number; }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState("");
    const [remainingUserCnt, setRemainingUserCnt] = useState<number>(1);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    // Server Action
    const [state, formAction, isPending] = useActionState(createUserAction, null);
    useEffect(() => {
        if (state === null) return;

        if (state?.status === 200) {
            toast.success(`User has been successfully registered!`);
            fetchUsers(""); // 사용자 목록 다시 불러오기
        } else if (state?.status === 401 || 403) {
            toast.error(state?.message);
            router.push('/login');
        } else {
            toast.error(state?.message);
        }
    }, [state]);

    // Data Handler
    const fetchUsers = (cursor: string, query: string = "") => {
        setLoading(true);
        let apiUrl = `/api/getUsers?cursor=${cursor}`;
        if (query.trim()) {
            apiUrl += `&name=${encodeURIComponent(query)}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setUsers([]);
                } else {
                    const fetchedUsers = data.users;
                    const returnCursor = data.returnCursor;
                    const count = data.count;

                    setUsers((prev) => {
                        const existingIds = new Set(prev.map(user => user.id));
                        const newUsers = fetchedUsers.filter((user: { id: number }) => !existingIds.has(user.id));
                        return [...prev, ...newUsers];
                    });

                    setNextCursor(returnCursor);
                    setRemainingUserCnt(count);
                }
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchUsers("");
    }, []);
    const handleSearch = () => {
        setUsers([]);
        fetchUsers("", searchQuery);
    };
    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop + clientHeight === scrollHeight && remainingUserCnt !== 0) {
            fetchUsers(nextCursor);
        }
    };

    // Delete Handler
    const handleUserSelect = (userId: number) => {
        setSelectedUser(prev => (prev === userId ? null : userId));
    };
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const res = await fetch(`/api/deleteUser?id=${selectedUser}`);

            if (!res.ok) throw new Error("Failed to delete user");

            toast.success("User deleted successfully!");
            setUsers(users.filter(user => user.id !== selectedUser));
            setSelectedUser(null);
        } catch (error) {
            toast.error("Failed to delete user.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col p-10 space-y-8 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button disabled={!selectedUser} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this account
                                and remove this data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex justify-between space-x-8">
                <Card className="w-1/3">
                    <form action={formAction}>
                        <CardHeader>
                            <CardTitle className="text-green-800">Add Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <Label>Username</Label>
                                    <Input name="username" disabled={isPending} className="w-full" type="text" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label>Password</Label>
                                    <PasswordInput name="password" disabled={isPending} className="w-full" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {isPending ? "Processing..." : "Confirm"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="w-2/3">
                    <CardHeader>
                        <CardTitle className="text-green-800">User List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input className="w-full mt-2" placeholder="Search by Username" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSearch} disabled={loading}>
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        <ScrollArea className="h-72 rounded-md border" onScrollCapture={scrollHandler}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Checkbox checked={selectedUser === user.id} onCheckedChange={() => handleUserSelect(user.id)} />
                                                </TableCell>
                                                <TableCell>{user.userName}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                No users found.
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