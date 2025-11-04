import { IconButton, List, ListItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useDispatch } from "react-redux";
import { openModal, setBookingId, setStaffId } from "store/modalReducer";
import EditModalStaff from "ui-component/modal/staff-modal/edit-modal/EditModalStaff";
import DetailModalStaff from "ui-component/modal/staff-modal/detail-modal/DetailModalStaff";
import DeleteModalStaff from "ui-component/modal/staff-modal/delete-modal/DeleteModalStaff";

const Menu = ({ value, id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // dispatch(openModal());
  };

  const handleOpenModalEdit = (modalType) => {
    dispatch(setStaffId(id));
    dispatch(openModal(modalType));
  };

  const handleOpenModalDetail = (modalType) => {
    dispatch(setStaffId(id));
    dispatch(openModal(modalType));
  };

  const handleOpenModalDelete = (modalType) => {
    dispatch(setStaffId(id));
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
          <ListItem onClick={() => handleOpenModalEdit("modalStaffEdit")}>
            <EditIcon sx={{ marginRight: "3%", color: "#2196f3" }} />
            <Typography color="primary" variant="subtitle1">
              Chỉnh sửa
            </Typography>
          </ListItem>
          <ListItem onClick={() => handleOpenModalDetail("modalStaffDetail")}>
            <RemoveRedEyeIcon sx={{ marginRight: "3%", color: "#673ab7" }} />
            <Typography color="secondary" variant="subtitle1">
              Chi tiết
            </Typography>
          </ListItem>
          <ListItem onClick={() => handleOpenModalDelete("modalStaffDelete")}>
            <DeleteIcon sx={{ marginRight: "3%", color: "#f44336" }} />
            <Typography color="error" variant="subtitle1">
              Xóa
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
