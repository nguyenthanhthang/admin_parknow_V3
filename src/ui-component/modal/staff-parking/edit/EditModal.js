import React, { useState } from "react";
import { Backdrop, Box, Fade, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import ItemModal from "./ItemModal";

const EditModal = (props) => {
  const { isOpen, setIsOpen, approveParkingId } = props;
  const [length, setLength] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: length ? "62%" : "52%",
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 12,
    p: 4,
  };
  const theme = useTheme();
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{ border: "none" }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <IconButton
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 1,
                right: 1,
                color: theme.palette.grey[500],
                backgroundColor: theme.palette.grey[100],
              }}
            >
              <CloseIcon />
            </IconButton>
            <ItemModal
              setIsOpen={setIsOpen}
              setLength={setLength}
              approveParkingId={approveParkingId}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default EditModal;
