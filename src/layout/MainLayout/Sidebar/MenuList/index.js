// MenuList.js
import React from "react";
import { Typography } from "@mui/material";
import NavGroup from "./NavGroup";
import Menu from "menu-items"; // Import the Menu component

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const menuItems = Menu(); // Call the Menu component to get the menuItems

  if (!menuItems) {
    return null; // or some default value if the menuItems are null
  }

  const navItems = menuItems.items.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
