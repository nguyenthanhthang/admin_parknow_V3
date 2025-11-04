// assets
import { IconParking } from "@tabler/icons-react";

// constant
const icons = {
  IconParking,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const parking = {
  id: "parking",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "parking",
      title: "Bãi xe",
      type: "item",
      url: "/parkings",
      icon: icons.IconParking,
      breadcrumbs: false,
    },
  ],
};

export default parking;
