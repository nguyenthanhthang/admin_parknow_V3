import { IconButton, List, ListItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useDispatch } from "react-redux";
import { openModal, setBookingId } from "store/modalReducer";
import ModalBooking from "ui-component/modal/booking/ModalBooking";

const Menu = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(setBookingId(id));
  };

  const handleClose = () => {
    setAnchorEl(null);
    // dispatch(openModal());
  };

  const handleOpenModalAccept = (modalType) => {
    dispatch(openModal(modalType));
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List sx={{ width: "130px" }}>
          <ListItem onClick={() => handleOpenModalAccept("modalBooking")}>
            <RemoveRedEyeIcon sx={{ marginRight: "3%", color: "#2196f3" }} />
            <Typography color="primary" variant="subtitle1">
              Chi tiết
            </Typography>
          </ListItem>
        </List>
      </Popover>

      <ModalBooking modalType="modalBooking" />
    </>
  );
};

export default Menu;
