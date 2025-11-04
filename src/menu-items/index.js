import { useSelector } from "react-redux";
import dashboard from "./dashboard";
import parking from "./parking";
import booking from "./booking";
import admin from "./admin";
import user from "./user";
import business from "./business";
import order from "./order";
import fee from "./feeSetting";
import parkingPending from "./parkingPending";
import parkingRequest from "./parkingRequest";
import wallet from "./wallet";

const Menu = () => {
  const tokenAdmin = useSelector((state) => state.token.tokenAdmin);
  const tokenStaff = useSelector((state) => state.token.tokenStaff);

  const menuItems = {
    items: tokenAdmin
      ? [
          dashboard,
          admin,
          user,
          business,
          parking,
          parkingPending,
          booking,
          order,
          fee,
          wallet,
        ]
      : tokenStaff
      ? [parkingRequest]
      : null,
  };
  return menuItems;
  // render the menu using the `menuItems` object...
};

export default Menu;
