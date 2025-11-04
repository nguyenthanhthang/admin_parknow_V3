import React, { forwardRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
// import { useTheme } from "@mui/material/styles";
import ItemModal from "./ItemModal";
import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";

const Fade = forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "41%",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const iconStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
};

export default function DeleteModalCustomer(props) {
  const { isOpenDelete, setIsOpenDelete, id, value } = props;
  // const theme = useTheme();

  const handleClose = () => {
    setIsOpenDelete(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={isOpenDelete}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={isOpenDelete}>
          <Box sx={style}>
            <div style={iconStyle}>
              <CloseIcon
                onClick={handleClose}
                sx={{
                  "&:hover": { cursor: "pointer", background: "lightgray" },
                }}
              />
              {/* Replace IconName with the desired icon component */}
            </div>
            <ItemModal
              setIsOpenDelete={setIsOpenDelete}
              id={id}
              value={value}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
