import { IconButton, List, ListItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import DetailModalCustomer from "ui-component/modal/customer/detail-modal/DetailModaCustomer";
import DeleteModalCustomer from "ui-component/modal/customer/delete-modal/DeleteModalCustomer";

const Menu = ({ value, id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // dispatch(openModal());
  };

  const handleOpenModalDetail = () => {
    setIsOpenDetail(true);
  };

  const handleOpenModalDelete = () => {
    setIsOpenDelete(true);
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
        <List sx={{ width: "140px" }}>
          <ListItem onClick={handleOpenModalDetail}>
            <RemoveRedEyeIcon sx={{ marginRight: "3%", color: "#673ab7" }} />
            <Typography color="secondary" variant="subtitle1">
              Chi tiết
            </Typography>
          </ListItem>
          <ListItem onClick={handleOpenModalDelete}>
            {value ? (
              <>
                <DeleteIcon sx={{ marginRight: "3%", color: "#f44336" }} />
                <Typography color="error" variant="subtitle1">
                  Vô hiệu hóa
                </Typography>
              </>
            ) : (
              <>
                <LibraryAddCheckIcon
                  sx={{ marginRight: "3%", color: "#f44336" }}
                />
                <Typography color="error" variant="subtitle1">
                  Kích hoạt
                </Typography>
              </>
            )}
          </ListItem>
        </List>
      </Popover>

      <DetailModalCustomer
        isOpenDetail={isOpenDetail}
        setIsOpenDetail={setIsOpenDetail}
        id={id}
      />
      {/* <DetailModalStaff modalType="modalStaffDetail" /> */}
      <DeleteModalCustomer
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        id={id}
        value={value}
      />
    </>
  );
};

export default Menu;
