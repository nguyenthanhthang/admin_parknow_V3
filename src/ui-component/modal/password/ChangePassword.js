import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Fade,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import config from "config";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  height: "63%",
  bgcolor: "background.paper",
  // border: "1px solid #000",
  borderRadius: "5px",
  boxShadow: 12,
  p: 4,
};

const ChangePassword = ({ isOpen, handleClose }) => {
  const theme = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("tokenStaff");
  const user = localStorage.getItem("staff"); // Set the authentication status here
  const userData = JSON.parse(user);

  const handleOldPasswordChange = (event) => {
    const { value } = event.target;

    // Remove any spaces from the input value
    if (!value.includes(" ")) {
      setOldPassword(value);
      setErrorPassword(false);
      // setPasswordsMatch(event.target.value === confirmPassword);
    } else {
      setErrorPassword(true);
    }
    // setSpaceInput(event.target.value.trim() === 0);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;

    // Remove any spaces from the input value
    if (!value.includes(" ")) {
      setPassword(value);
      setErrorPassword(false);
      setPasswordsMatch(event.target.value === confirmPassword);
    } else {
      setErrorPassword(true);
    }
    // setSpaceInput(event.target.value.trim() === 0);
  };

  const handleConfirmPasswordChange = (event) => {
    // setSpaceInput(event.target.value.trim() === 0);
    setConfirmPassword(event.target.value);
    setPasswordsMatch(event.target.value === password);
  };

  const apiUrl = config.apiUrl;

  const requestBody = {
    userId: userData?._id,
    oldPassword: oldPassword,
    newPassword: password,
  };

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      password.trim() === "" ||
      oldPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Nhập tất cả ô nhập",
        customClass: {
          container: "swal-custom", // Apply the custom class to the Swal container
        },
      });
      return;
    }

    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn thay đổi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận!",
      customClass: {
        container: "swal-custom", // Apply the custom class to the Swal container
      },
    })
      .then((result) => {
        // Handle SweetAlert2 dialog result
        if (result.isConfirmed) {
          fetch(`${apiUrl}/my-staff-account/${userData._id}`, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              //   return response.json();
            })
            .then((data) => {
              Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Mật khẩu của bạn đã được thay đổi",
                customClass: {
                  container: "swal-custom", // Apply the custom class to the Swal container
                },
              });
              setPassword("");
              setOldPassword("");
              setConfirmPassword("");
              handleClose();
            })
            .catch((error) => {
              // Handle any errors
              console.error(error);
              Swal.fire({
                icon: "error",
                title: "Lỗi xảy ra",
                text: "Mật khẩu cũ không chính xác. Vui lòng nhập lại!!!",
                customClass: {
                  container: "swal-custom", // Apply the custom class to the Swal container
                },
              });
            });
        }
      })
      .then(() => {
        // Set the z-index of the Swal container to be higher than the Modal's z-index
        const swalContainer = document.querySelector(".swal-custom");
        if (swalContainer) {
          swalContainer.style.zIndex = theme.zIndex.modal + 1;
        }
      });
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
            <Typography
              variant="h2"
              color={theme.palette.primary.main}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "3%",
              }}
            >
              Thay đổi mật khẩu
            </Typography>
            <form method="post">
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                marginTop="10px"
              >
                <Stack spacing={1} sx={{ marginTop: "3%" }}>
                  <Typography
                    color={theme.palette.secondary.dark}
                    gutterBottom
                    variant="h4"
                    marginTop="3%"
                  >
                    Mật khẩu cũ
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    name="password"
                    label="Mật khẩu cũ"
                    color="secondary"
                    error={errorPassword}
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    helperText={
                      errorPassword ? "Vui lòng không nhập khoảng trống" : ""
                    }
                    sx={{ width: "370px" }}
                  />
                </Stack>
                <Stack spacing={1} sx={{ marginTop: "3%" }}>
                  <Typography
                    color={theme.palette.secondary.dark}
                    gutterBottom
                    variant="h4"
                    marginTop="5%"
                  >
                    Mật khẩu mới
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    name="password"
                    label="Mật khẩu"
                    color="secondary"
                    error={errorPassword}
                    value={password}
                    onChange={handlePasswordChange}
                    helperText={
                      errorPassword ? "Vui lòng không nhập khoảng trống" : ""
                    }
                    sx={{ width: "370px" }}
                  />
                </Stack>
                <Stack spacing={1} sx={{ marginTop: "3%" }}>
                  <Typography
                    color={theme.palette.secondary.dark}
                    gutterBottom
                    variant="h4"
                    marginTop="5%"
                  >
                    Xác nhận mật khẩu
                  </Typography>
                  <TextField
                    required
                    type="password"
                    name="confirmPassword"
                    label="Xác nhận mậu khẩu"
                    color="secondary"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!passwordsMatch}
                    helperText={!passwordsMatch ? "Mật khẩu không khớp" : ""}
                    sx={{ width: "370px" }}
                  />
                </Stack>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                marginTop="7%"
              >
                <Grid item>
                  <CancelButton onClick={handleClose} />
                </Grid>
                <Grid item>
                  <SaveButton onClick={handleSave} />
                </Grid>
              </Grid>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ChangePassword;
