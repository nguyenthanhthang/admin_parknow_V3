// assets
import { IconUsers } from "@tabler/icons-react";

// constant
const icons = { IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const user = {
  id: "user",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "user",
      title: "Người dùng",
      type: "item",
      url: "/user",
      icon: icons.IconUsers,
      breadcrumbs: false,
    },
  ],
};

export default user;
