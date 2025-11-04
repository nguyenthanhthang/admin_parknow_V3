// assets
import { IconBrandDingtalk } from "@tabler/icons-react";

// constant
const icons = { IconBrandDingtalk };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const business = {
  id: "business",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "business",
      title: "Doanh nghiệp",
      type: "item",
      url: "/business",
      icon: icons.IconBrandDingtalk,
      breadcrumbs: false,
    },
  ],
};

export default business;
