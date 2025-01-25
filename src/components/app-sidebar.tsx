"use client"

import * as React from "react"
import {
  Users,
  PenLine,
  Calculator,
  Folders,
  Search,
  CalendarClock,
  Calendar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavManagements } from "@/components/nav-management"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
          url: "/customer",
        },
        {
          title: "Guarantor",
          url: "#",
        },
        {
          title: "Loan",
          url: "#",
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
          url: "#",
        },
        {
          title: "Loan",
          url: "#",
        },
        {
          title: "Guarantor",
          url: "#",
        },
        {
          title: "Collateral",
          url: "#",
        },
        {
          title: "Counseling",
          url: "#",
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
          url: "#",
        },
        {
          title: "Batch",
          url: "#",
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
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Management",
          url: "#",
        },
      ],
    },
  ],
  menus: [
    {
      name: "Report",
      url: "#",
      icon: Folders,
    },
    {
      name: "HR",
      url: "#",
      icon: Users,
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
      <Link href="/">
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
