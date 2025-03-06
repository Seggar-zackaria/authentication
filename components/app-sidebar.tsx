"use client";

import * as React from "react";
import {
  SunIcon,
  Frame,
  Map,
  PieChart,
  Plane,
  Hotel,
  Calendar,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  
  teams: [
    {
      name: "Sun Summer",
      logo: SunIcon,
    }
  ],
  navMain: [
    {
      title: "Hotel",
      url: "#",
      icon: Hotel,
      isActive: true,
      items: [
        {
          title: "Add Hotel",
          url: "/dashboard/hotel/add",
        },
        {
          title: "Edit Hotel",
          url: "/dashboard/hotel/edit",
        },
        {
          title: "View Hotel",
          url: "/dashboard/hotel/view",
        }
      ],
    },
    {
      title: "Flight",
      url: "#",
      icon: Plane,
      items: [
        {
          title: "Add Flight",
          url: "/dashboard/flight/add",
        },
        {
          title: "Edit Flight",
          url: "/dashboard/flight/edit",
        },
        {
          title: "View Flight",
          url: "/dashboard/flight/view",
        },
      ],
    },
    {
      title: "Booking",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Booking",
          url: "/dashboard/booking",
        },
        {
          title: "Add Booking",
          url: "/dashboard/booking/add",
        },
        {
          title: "Edit Booking",
          url: "/dashboard/booking/edit",
        },
        {
          title: "View Booking",
          url: "/dashboard/booking/view",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/dashboard/design-engineering",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/dashboard/sales-marketing",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/dashboard/travel",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
  
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
