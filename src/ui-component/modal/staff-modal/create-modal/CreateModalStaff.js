import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "store/modalReducer";
import ItemModal from "./ItemModal";
import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close"; // Import the desired icon

const Fade = React.forwardRef(function Fade(props, ref) {
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
  width: " 40%",
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

export default function CreateModalStaff({ modalType }) {
  const isOpen = useSelector((state) => state.modal.modals.includes(modalType));
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal(modalType));
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={isOpen}>
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
            <ItemModal modalType={modalType} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
