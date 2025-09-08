"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Users, PenLine, Calculator, Folders, Search, CalendarClock, Calendar, MapPinCheckInside, HousePlus, UserRoundPlus } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavManagements } from "@/components/nav-management"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"

import { useUser } from "@/context/UserProvider"

const data = {
	navMain: [
		{
			title: "Registration",
			url: "#",
			icon: PenLine,
			items: [
				{ title: "Customer", url: "/registration/customer" },
				{ title: "Guarantor", url: "/registration/guarantor" },
				{ title: "Loan", url: "/registration/loan" },
			],
		},
		{
			title: "Search",
			url: "#",
			icon: Search,
			items: [
				{ title: "Customer", url: "/search/customer" },
				{ title: "Guarantor", url: "/search/guarantor" },
				{ title: "Loan", url: "/search/loan" },
			],
		},
		{
			title: "Repayment",
			url: "#",
			icon: Calendar,
			items: [
				{ title: "Single", url: "/repayment/single" },
				{ title: "Batch", url: "/repayment/batch" },
			],
		},
		{
			title: "Overdue",
			url: "#",
			icon: CalendarClock,
			items: [
				{ title: "Registration", url: "/overdue/registration" },
				{ title: "Management", url: "/overdue/management" },
				{ title: "Search", url: "/overdue/search" },
			],
		},
	],
	menus: [
		{ name: "CP No.", url: "/cp", icon: MapPinCheckInside },
		{ name: "Report", url: "/report", icon: Folders },
		{ name: "HR", url: "/hr", icon: Users },
		{ name: "Fixed Assets", url: "/fixed-assets", icon: HousePlus },
		{ name: "Calculator", url: "/calculator", icon: Calculator },
		{ name: "User", url: "/user", icon: UserRoundPlus },
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { username, userRole } = useUser();

	const filteredNavMain = data.navMain.map(nav => {
		if (nav.title === "Overdue") {
			return {
				...nav,
				items: nav.items.filter(item =>
					userRole === 0 || item.title !== "Registration"
				),
			};
		}
		return nav;
	});

	const filteredMenus = data.menus.filter(
		menu => userRole !== 1 || !["User", "HR", "Report", "Fixed Assets"].includes(menu.name)
	);

	return (
		<Sidebar collapsible="icon" {...props}>
			<Link href="/home">
				<SidebarHeader className="pb-0">
					<Image src="/icon.png" width={35} height={40} alt="Logo" style={{ width: 40, height: "auto" }} priority />
				</SidebarHeader>
			</Link>

			<SidebarContent>
				<NavMain items={filteredNavMain} />
				<NavManagements menus={filteredMenus} />
			</SidebarContent>

			<SidebarTrigger className="ml-2.5" />
			<SidebarFooter>
				<NavUser username={username} userRole={userRole} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}