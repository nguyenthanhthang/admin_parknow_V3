import { IconButton, List, ListItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useDispatch } from "react-redux";
import { setBookingId } from "store/modalReducer";
import EditModalStaff from "ui-component/modal/staff-modal/edit-modal/EditModalStaff";
import DetailModalStaff from "ui-component/modal/staff-modal/detail-modal/DetailModalStaff";
import DeleteModalStaff from "ui-component/modal/staff-modal/delete-modal/DeleteModalStaff";
import { useNavigate } from "react-router";

const Menu = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(setBookingId(id));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDetail = () => {
    navigate(`/parking-detail/${id}`);
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
          <ListItem onClick={handleDetail}>
            <RemoveRedEyeIcon sx={{ marginRight: "3%", color: "#673ab7" }} />
            <Typography color="secondary" variant="subtitle1">
              Chi tiết
            </Typography>
          </ListItem>
        </List>
      </Popover>

      <EditModalStaff modalType="modalStaffEdit" />
      <DetailModalStaff modalType="modalStaffDetail" />
      <DeleteModalStaff modalType="modalStaffDelete" />
    </>
  );
};

export default Menu;
