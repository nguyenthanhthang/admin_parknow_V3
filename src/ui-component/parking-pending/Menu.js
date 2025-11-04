import { IconButton, List, ListItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useNavigate } from "react-router";

const Menu = ({ id, parkingId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // dispatch(openModal());
  };

  const handleApprove = () => {
    navigate(`/pending/${id}`, { state: { parkingId: parkingId } });
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
          <ListItem onClick={handleApprove}>
            <AssignmentTurnedInIcon
              sx={{ marginRight: "3%", color: "#673ab7" }}
            />
            <Typography color="secondary" variant="subtitle1">
              Duyệt bãi
            </Typography>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default Menu;
