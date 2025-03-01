"use client"

import * as React from "react"
import { useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link"

import { jwtDecode } from "jwt-decode";

import { Users, PenLine, Calculator, Folders, Search, CalendarClock, Calendar, MapPinCheckInside, HousePlus, UserRoundPlus } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavManagements } from "@/components/nav-management"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"

import { JwtData } from "@/types";

const data = {
	navMain: [
		{
			title: "Registration",
			url: "#",
			icon: PenLine,
			// isActive: true, // Always Open 
			items: [
				{
					title: "Customer",
					url: "/registration/customer",
				},
				{
					title: "Guarantor",
					url: "/registration/guarantor",
				},
				{
					title: "Loan",
					url: "/registration/loan",
				},
			],
		},
		{
			title: "Search",
			url: "#",
			icon: Search,
			items: [
				{
					title: "Customer",
					url: "/search/customer",
				},
				{
					title: "Guarantor",
					url: "/search/guarantor",
				},
				{
					title: "Loan",
					url: "/search/loan",
				},
				{
					title: "Guarantors",
					url: "/search/guarantors",
				},
				{
					title: "Collateral",
					url: "/search/collateral",
				},
				{
					title: "Counseling",
					url: "/search/counseling",
				},
			],
		},
		{
			title: "Repayment",
			url: "#",
			icon: Calendar,
			items: [
				{
					title: "Single",
					url: "/repayment/single",
				},
				{
					title: "Batch",
					url: "/repayment/batch",
				},
			],
		},
		{
			title: "Overdue",
			url: "#",
			icon: CalendarClock,
			items: [
				{
					title: "Registration",
					url: "/overdue/registration",
				},
				{
					title: "Search",
					url: "/overdue/search",
				},
				{
					title: "Management",
					url: "/overdue/management",
				},
			],
		},
	],
	menus: [
		{
			name: "Check Point",
			url: "/cp",
			icon: MapPinCheckInside,
		},
		{
			name: "Report",
			url: "/report",
			icon: Folders,
		},
		{
			name: "HR",
			url: "/hr",
			icon: Users,
		},
		{
			name: "Fixed Assets",
			url: "/fixed-assets",
			icon: HousePlus,
		},
		{
			name: "Calculator",
			url: "/calculator",
			icon: Calculator,
		},
		{
			name: "User",
			url: "/user",
			icon: UserRoundPlus,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [username, setUsername] = useState<string>('');
	const [userRole, setUserRole] = useState<number>(0);

	useEffect(() => {
		async function fetchToken() {
			try {
				const response = await fetch('/api/auth/accessToken');
				const data = await response.json();
				if (data.token) {
					const decoded: JwtData = jwtDecode(data.token);
					console.log(`App Sidebar Console: ${JSON.stringify(decoded)}`)
					setUsername(decoded.username);
					setUserRole(decoded.role);
				}
			} catch (error) {
				console.error("Failed to fetch token:", error);
			}
		}

		fetchToken();
	}, []);

	return (
		<Sidebar collapsible="icon" {...props}>
			<Link href="/home">
				<SidebarHeader className="pb-0">
					<Image src="/icon.png" priority={true} width={35} height={40} alt="Logo" style={{ width: 40, height: "auto" }} />
				</SidebarHeader>
			</Link>

			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavManagements menus={data.menus} />
			</SidebarContent>

			<SidebarTrigger className="ml-2.5" />
			<SidebarFooter>
				<NavUser username={username} userRole={userRole} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}
