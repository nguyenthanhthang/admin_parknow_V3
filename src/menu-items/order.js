// assets
import { IconReportMoney } from "@tabler/icons-react";

// constant
const icons = { IconReportMoney };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
  id: "order",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "order",
      title: "Hóa đơn",
      type: "item",
      url: "/order",
      icon: icons.IconReportMoney,
      breadcrumbs: false,
    },
  ],
};

export default order;
