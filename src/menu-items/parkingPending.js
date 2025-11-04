// assets
import { MdPendingActions } from "react-icons/md";

// constant
const icons = { MdPendingActions };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const parkingPending = {
  id: "parkingPending",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "parkingPending",
      title: "Bãi xe chờ duyệt",
      type: "item",
      url: "/pending",
      icon: icons.MdPendingActions,
      breadcrumbs: false,
    },
  ],
};

export default parkingPending;
