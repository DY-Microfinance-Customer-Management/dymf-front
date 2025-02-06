"use client"

import * as React from "react"
import { Users, PenLine, Calculator, Folders, Search, CalendarClock, Calendar, MapPinCheckInside, HousePlus } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavManagements } from "@/components/nav-management"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Registration",
      url: "#",
      icon: PenLine,
      isActive: true,
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
          title: "Loan",
          url: "/search/loan",
        },
        {
          title: "Guarantor",
          url: "/search/guarantor",
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Link href="/home">
        <SidebarHeader>
            <Image src="/icon.png" width={35} height={40} alt="Logo" />
        </SidebarHeader>
      </Link>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagements menus={data.menus} />
      </SidebarContent>

      <SidebarTrigger className="ml-2.5" />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
