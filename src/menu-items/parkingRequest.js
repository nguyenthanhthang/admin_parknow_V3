// assets
import { MdRequestQuote } from "react-icons/md";

// constant
const icons = { MdRequestQuote };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const parkingRequest = {
  id: "parkingRequest",
  // title: "Dashboard",
  type: "group",
  children: [
    {
      id: "parkingRequest",
      title: "Yêu cầu duyệt",
      type: "item",
      url: "/request",
      icon: icons.MdRequestQuote,
      breadcrumbs: false,
    },
  ],
};

export default parkingRequest;
