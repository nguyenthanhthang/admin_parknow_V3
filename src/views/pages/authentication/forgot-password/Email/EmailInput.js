import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { Layout } from "ui-component/auth/layout";
import NextButton from "ui-component/buttons/next-button/NextButton";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import Swal from "sweetalert2";
import config from "config";
// import "./Email.scss";

const EmailInput = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState();
  const [errorEmail, setErrorEmail] = useState(false);

  const navigate = useNavigate();

  const apiLink = config.apiUrl;

  const handleInputEmail = (event) => {
    const { value } = event.target;

    const startsWithSpace = /^\s/.test(value);
    // Remove any spaces from the input value
    if (!startsWithSpace) {
      setEmail(value);
      setErrorEmail(!validator.isEmail(value));
    } else {
      setErrorEmail(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${apiLink}/verify-email?email=${email}`);

    const data = await response.json();

    if (data.message !== "Thành công") {
      Swal.fire({
        icon: "error",
        title: "Không tìm thấy",
        text: "Email của bạn chưa đăng ký hoặc sai Email! Vui long kiểm tra lại!",
      });
    } else {
      navigate("/otp", { state: { email: email } });
    }
  };

  return (
    <Layout>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        marginTop="5%"
      >
        <Grid item xs={12}>
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            marginBottom="15%"
          >
            <Typography
              color={theme.palette.secondary.main}
              gutterBottom
              variant={matchDownSM ? "h2" : "h1"}
            >
              Nhập Email
            </Typography>
            <Typography
              color={theme.palette.secondary.dark}
              variant={matchDownSM ? "subtitle2" : "subtitle2"}
            >
              Nhập Email đã đăng ký vào hệ thống của chúng tôi
            </Typography>
          </Stack>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid item>
            <Stack justifyContent="center" spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
              >
                Nhập Email
              </Typography>
              <TextField
                fullWidth
                required
                sx={{ width: "500px" }}
                inputProps={{ maxLength: 100 }}
                type="email"
                name="email"
                value={email}
                label="Email"
                color="secondary"
                onChange={handleInputEmail}
                error={errorEmail}
                helperText={errorEmail ? "Vui lòng nhập đúng email" : ""}
              />
            </Stack>
          </Grid>
          <Grid
            item
            justifyContent="center"
            sx={{ marginTop: "8%", marginLeft: "33%" }}
          >
            <NextButton onClick={handleSubmit} />
          </Grid>
        </form>

        {/* <div id="swal-container"></div> */}
      </Grid>
    </Layout>
  );
};

export default EmailInput;
