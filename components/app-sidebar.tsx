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


export const AppSidebar = () => {

 const dashboardURL = [
  {
    name: "Sun Summer",
    logo: SunIcon,
    url: "/dashboard/admin",
  }
]

const adminRole = [
      {
        title: "Hotel",
        url: "#",
        icon: Hotel,
        isActive: true,
        items: [
            {
              title: "Add Hotel",
              url: "/dashboard/admin/hotel/add",
            },
            {
              title: "Edit Hotel",
              url: "/dashboard/admin/hotel/edit",
            },
          {
            title: "View Hotel",
            url: "/dashboard/admin/hotel",
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
              url: "/dashboard/admin/flight/add",
            },
            {
              title: "Edit Flight",
              url: "/dashboard/admin/flight/edit",
            },
          {
            title: "View Flight",
            url: "/dashboard/admin/flight/view",
          },
        ],
      },
      {
        title: "Booking",
        url: "#",
        icon: Calendar,
        items: [

          {
            title: "View Booking",
            url: "/dashboard/admin/booking/view",
          },
            {
              title: "Add Booking",
                url: "/dashboard/admin/booking/add",
            },
            {
              title: "Edit Booking",
              url: "/dashboard/admin/booking/edit",
            },
        ],
      },
    ]
  const userRole = [
  {
    name: "Book a Hotel",
    url: "/dashboard/Hotel-Booking",
    icon: Frame,
  },
  {
    name: "book a flight",
    url: "/dashboard/flight-booking",
    icon: PieChart,
  },
  {
    name: "my Booking",
    url: "/dashboard/booked-travel",
    icon: Map,
  },
]

  return (
    <Sidebar>
      <SidebarHeader>

        <TeamSwitcher teams={dashboardURL} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminRole} />
        <NavProjects projects={userRole} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
