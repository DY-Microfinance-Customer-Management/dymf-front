"use client"

// Components: UI
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

// Components: Icon
import { LogOut } from "lucide-react"

// React
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NavUser({ username, userRole }: {
	username: string;
	userRole: number;
}) {
	// Router
	const router = useRouter();

	// Dialog Handler
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	
	// Logout Handler
	const handleLogout = async () => {
		try {
			fetch('/api/auth/logout');
            router.push('/login');
        } catch (error) {
			console.error("Logout failed:", error);
        }
    };
	
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					{userRole === 0 ?
						<Avatar className="h-8 w-[60px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-[#CD5C5C] text-white">
								Admin
							</AvatarFallback>
						</Avatar> :
						<Avatar className="h-8 w-[50px] rounded-lg">
							<AvatarFallback className="rounded-lg bg-[#0067A3] text-white">
								User
							</AvatarFallback>
						</Avatar>
					}
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{username}</span>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <LogOut type="button" className="cursor-pointer" onClick={() => setIsDialogOpen(true)} />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Logout</DialogTitle>
                                <p>Are you sure you want to log out?</p>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
