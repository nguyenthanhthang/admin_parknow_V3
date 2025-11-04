import React, { useRef } from "react";
import { IconButton } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function FloatingButton({ handleOpenScanner }) {
  const buttonRef = useRef(null);

  const handleMouseDown = (event) => {
    event.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const button = buttonRef.current;
    button.style.position = "absolute";
    button.style.left = `${event.pageX}px`;
    button.style.top = `${event.pageY}px`;
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <IconButton
      onClick={handleOpenScanner}
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      style={{ position: "fixed" }}
    >
      <QrCodeScannerIcon
        sx={{ width: "60px", height: "60px", color: "#000" }}
      />
    </IconButton>
  );
}
