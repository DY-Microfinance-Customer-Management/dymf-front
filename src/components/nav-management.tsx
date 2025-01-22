"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
  Moon, Sun
} from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavManagements({
  menus,
}: {
  menus: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const { setTheme } = useTheme()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        <br />
        
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between text-sm text-sidebar-foreground/100 rounded-md px-2 py-2 hover:bg-sidebar-hover transition">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 dark:hidden" />
                  <Moon className="h-4 w-4 hidden dark:block" />
                  <span>Theme</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full bg-sidebar-background rounded-md shadow-md" style={{ minWidth: '16rem' }}>
              <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-hover" onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-hover" onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-hover" onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>

      </SidebarMenu>

    </SidebarGroup>
  )
}
