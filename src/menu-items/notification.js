// assets
import { IconBellRinging } from "@tabler/icons-react";

// constant
const icons = { IconBellRinging };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const notification = {
  id: "traffic",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "notification",
      title: "Thông báo",
      type: "item",
      url: "/dashboard/default",
      icon: icons.IconBellRinging,
      breadcrumbs: false,
    },
  ],
};

export default notification;
