import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Calendar,
  Package,
  Users,
} from "lucide-react";
import { ROUTES } from "./routes";
import { UserRole, UserRoleType } from "./roles";
import { AUTHORIZED_ROLES } from "./navigation-groups";

export interface NavigationChild {
  title: string;
  href: string;
  roles: UserRoleType[];
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRoleType[];
  children?: NavigationChild[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Thống kê",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    roles: AUTHORIZED_ROLES,
  },
  {
    title: "Quản lý MMTB",
    href: ROUTES.MACHINES.LIST,
    icon: Wrench,
    roles: AUTHORIZED_ROLES,
    children: [
      {
        title: "Danh sách MMTB",
        href: ROUTES.MACHINES.LIST,
        roles: AUTHORIZED_ROLES,
      },
      {
        title: "Đăng ký mới",
        href: ROUTES.MACHINES.NEW,
        roles: [
          UserRole.ASSET_MANAGER,
          UserRole.MAINTENANCE_MANAGER,
          UserRole.ADMIN,
        ],
      },
    ],
  },
  {
    title: "Repair Tickets",
    href: ROUTES.TICKETS.LIST,
    icon: FileText,
    roles: AUTHORIZED_ROLES,
    children: [
      {
        title: "Repair Tickets",
        href: `${ROUTES.TICKETS.LIST}?type=REPAIR`,
        roles: AUTHORIZED_ROLES,
      },
      {
        title: "Maintenance Tickets",
        href: `${ROUTES.TICKETS.LIST}?type=MAINTENANCE`,
        roles: AUTHORIZED_ROLES,
      },
      {
        title: "Create Ticket",
        href: ROUTES.TICKETS.NEW,
        roles: [
          UserRole.WORKER,
          UserRole.TEAM_LEADER,
          UserRole.ASSET_MANAGER,
          UserRole.MAINTENANCE_MANAGER,
          UserRole.ADMIN,
        ],
      },
    ],
  },
  {
    title: "Schedules",
    href: ROUTES.SCHEDULES.LIST,
    icon: Calendar,
    roles: [
      UserRole.TECHNICIAN,
      UserRole.TEAM_LEADER,
      UserRole.ASSET_MANAGER,
      UserRole.MAINTENANCE_MANAGER,
      UserRole.ADMIN,
    ],
    children: [
      {
        title: "Schedule List",
        href: ROUTES.SCHEDULES.LIST,
        roles: [
          UserRole.TECHNICIAN,
          UserRole.TEAM_LEADER,
          UserRole.ASSET_MANAGER,
          UserRole.MAINTENANCE_MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        title: "Create Schedule",
        href: ROUTES.SCHEDULES.NEW,
        roles: [
          UserRole.TEAM_LEADER,
          UserRole.ASSET_MANAGER,
          UserRole.MAINTENANCE_MANAGER,
          UserRole.ADMIN,
        ],
      },
    ],
  },
  {
    title: "Tools & Parts",
    href: ROUTES.TOOLS.LIST,
    icon: Package,
    roles: AUTHORIZED_ROLES,
    children: [
      {
        title: "Tool List",
        href: ROUTES.TOOLS.LIST,
        roles: AUTHORIZED_ROLES,
      },
      {
        title: "Register Tool",
        href: ROUTES.TOOLS.NEW,
        roles: [
          UserRole.ASSET_MANAGER,
          UserRole.MAINTENANCE_MANAGER,
          UserRole.ADMIN,
        ],
      },
    ],
  },
  {
    title: "User Management",
    href: ROUTES.USERS.LIST,
    icon: Users,
    roles: [UserRole.TEAM_LEADER, UserRole.MAINTENANCE_MANAGER, UserRole.ADMIN],
  },
];
