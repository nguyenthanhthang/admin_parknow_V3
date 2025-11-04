// assets
import { IconSettings } from "@tabler/icons-react";

// constant
const icons = { IconSettings };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const fee = {
  id: "fee",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "fee",
      title: "Thiết lập phí",
      type: "item",
      url: "/fee",
      icon: icons.IconSettings,
      breadcrumbs: false,
    },
  ],
};

export default fee;
