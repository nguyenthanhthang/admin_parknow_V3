import {
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Layout } from "ui-component/auth/layout";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
// import NextButton from "ui-component/buttons/next-button/NextButton";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { data } from "autoprefixer";
import config from "config";

const NewPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { email } = location.state;

  const navigate = useNavigate();
  const [newMk, setNewMk] = useState();
  const [errorNewMk, setErrorNewMk] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const apiLink = config.apiUrl;

  const handleInputNewPassword = (event) => {
    const { value } = event.target;

    // Remove any spaces from the input value
    if (!value.includes(" ")) {
      setNewMk(value);
      setErrorNewMk(false);
    } else {
      setErrorNewMk(true);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setPasswordsMatch(event.target.value === newMk);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    let passwordEntity = { email: email, newPassword: newMk };
    fetch(`${apiLink}/password-management/forgot-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordEntity),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.status;
      })
      .then((data) => {
        if (data === 204) {
          Swal.fire({
            icon: "success",
            text: "Cập nhật mật khẩu thành công!",
          });
          navigate("/login");
        } else {
        }
      })
      .catch((error) => {
        // Handle errors
        Swal.fire({
          icon: "error",
          text: data.message,
        });
        console.error(error);
      });
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        marginTop="2%"
      >
        <form onSubmit={handleSubmit} method="post">
          <Grid item xs={12}>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              marginBottom="10%"
            >
              <Typography
                color={theme.palette.secondary.main}
                gutterBottom
                variant={matchDownSM ? "h2" : "h1"}
              >
                Tạo mật khẩu mới
              </Typography>
              {/* <Typography
              color={theme.palette.secondary.dark}
              variant={matchDownSM ? "subtitle2" : "subtitle2"}
            >
              Nhập Email đã đăng ký vào hệ thống của chúng tôi
            </Typography> */}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
                marginTop="8%"
              >
                Mật khẩu mới
              </Typography>
              <TextField
                fullWidth
                sx={{ width: "500px" }}
                required
                type="password"
                name="password"
                label="Mật khẩu"
                color="secondary"
                onChange={handleInputNewPassword}
                value={newMk}
                error={errorNewMk}
                helperText={
                  errorNewMk ? "Vui lòng không nhập khoảng trống" : ""
                }
              />
            </Stack>
            <Stack spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
                marginTop="8%"
              >
                Nhập lại mật khẩu
              </Typography>
              <TextField
                fullWidth
                sx={{ width: "500px" }}
                required
                type="password"
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                color="secondary"
                onChange={handleConfirmPasswordChange}
                error={!passwordsMatch}
                helperText={!passwordsMatch ? "Mật khẩu không khớp" : ""}
              />
            </Stack>

            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginTop="5%"
              spacing={3}
            >
              <Grid item xs={5}>
                <CancelButton onClick={handleCancel} />
              </Grid>
              <Grid item xs={3}>
                <SaveButton />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Layout>
  );
};

export default NewPassword;
