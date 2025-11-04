// assets
import { IconUserCircle } from "@tabler/icons-react";

// constant
const icons = { IconUserCircle };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const profile = {
  id: "profile",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "profile",
      title: "Hồ sơ",
      type: "item",
      url: "/profile",
      icon: icons.IconUserCircle,
      breadcrumbs: false,
    },
  ],
};

export default profile;
