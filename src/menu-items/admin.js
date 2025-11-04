// assets
import { IconUserCircle } from "@tabler/icons-react";

// constant
const icons = { IconUserCircle };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const admin = {
  id: "admin",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "admin",
      title: "Quản trị viên",
      type: "item",
      url: "/admin",
      icon: icons.IconUserCircle,
      breadcrumbs: false,
    },
  ],
};

export default admin;
