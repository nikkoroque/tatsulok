import { Boxes, LifeBuoy, Receipt, Send, UserCog, type LucideIcon } from "lucide-react";

// Define reusable types
export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

// Define the navigation structure type
export type Navigation = Record<string, NavItem[]>;

export const routes = {
  user: {
    name: "Nikko Roque",
    email: "nroque@tatsulok.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Boxes,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Suppliers",
          url: "/dashboard/suppliers",
        },
      ],
    },
    {
      title: "POS Transactions",
      url: "/#",
      icon: Receipt,
      items: [
        {
          title: "Transactions",
          url: "#",
        }
      ]
      
    },
    {
      title: "Management",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Users",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
