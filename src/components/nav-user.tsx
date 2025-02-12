"use client"

import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavUser({ username, userRole }: {
	username: string
	userRole: number
}) {
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
					<LogOut />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
