import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanCode.scss";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

const QRScanCode = () => {
  const theme = useTheme();
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [openScanner, setOpenScanner] = useState(true);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (openScanner && !html5QrCodeRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResultWebCam(decodedText);
          if (decodedText) {
            navigate(decodedText);
          }
        },
        (errorMessage) => {
          // Ignore errors
        }
      );
    }

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current.clear();
            html5QrCodeRef.current = null;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }, [openScanner, navigate]);

  const closeScanner = () => {
    setOpenScanner(false);
    navigate("/booking");
  };

  console.log("scanResultWebCam", scanResultWebCam);

  return (
    <div>
      {openScanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(0 0 0 / 74%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "30%",
              height: "50%",
              backgroundColor: "transparent",
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
            }}
          >
            <div id="qr-reader" style={{ width: "100%" }}></div>
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "4px",
                color: theme.palette.grey[500],
                backgroundColor: theme.palette.grey[100],
              }}
              onClick={closeScanner}
            >
              <CloseIcon />
            </IconButton>
            {/* <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "4px",
              }}
              onClick={closeScanner}
            >
              Close
            </button> */}
          </div>
        </div>
      )}
      {/* {scanResultWebCam && <h3>Scanned By WebCam Code: {scanResultWebCam}</h3>} */}
    </div>
  );
};

export default QRScanCode;
