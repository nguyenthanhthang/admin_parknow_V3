// assets
import { IconWallet } from "@tabler/icons-react";

// constant
const icons = { IconWallet };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const wallet = {
  id: "wallet",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "wallet",
      title: "Ví",
      type: "item",
      url: "/wallet",
      icon: icons.IconWallet,
      breadcrumbs: false,
    },
  ],
};

export default wallet;
