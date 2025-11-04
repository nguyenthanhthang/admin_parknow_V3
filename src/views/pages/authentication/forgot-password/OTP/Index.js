import { useEffect, useState, useCallback } from "react";
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
import BackButton from "ui-component/buttons/back-button/BackButton";
import CountTime from "./CountTime";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import config from "config";

const OTP = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [otp, setOTP] = useState();
  const [otpGenerate, setOtpGenerate] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0); // state variable to track elapsed time
  const location = useLocation();
  const { email } = location.state;

  const apiLink = config.apiUrl;

  const navigate = useNavigate();
  const handleInputOTP = (e) => {
    setOTP(e.target.value);
  };

  const generateOTP = () => {
    const length = 6;
    const chars = "0123456789";
    let result = "";
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setOtpGenerate(result);
    return result;
  };

  const sendOTPEmail = async (toEmail, otp) => {
    const requestBody = {
      email: toEmail,
      otp: otp,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    const response = await fetch(
      `${apiLink}/otp-management/send-email-otp`,
      requestOptions
    );

    const data = await response.json();

    if (data.statusCode === 201) {
    }
  };

  const sendOTP = useCallback(() => {
    const generatedOTP = generateOTP();
    sendOTPEmail(email, generatedOTP);
  }, [email, apiLink]);

  useEffect(() => {
    sendOTP();

    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [sendOTP]);

  useEffect(() => {
    if (elapsedTime === 60) {
      sendOTP();
      setElapsedTime(0);
    }
  }, [elapsedTime, sendOTP]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.trim() === otpGenerate) {
      navigate("/new-password", { state: { email: email } });
    } else {
      Swal.fire({
        icon: "error",
        text: "OTP không chính xác! Vui lòng thử lại!",
      });
      return;
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
              Nhập OTP
            </Typography>

            <Typography
              color={theme.palette.secondary.dark}
              variant={matchDownSM ? "subtitle2" : "subtitle1"}
            >
              Nhập mã OTP
            </Typography>
          </Stack>
        </Grid>

        <Grid item>
          <form>
            <Stack xs={12} justifyContent="center" spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
              >
                Nhập OTP
              </Typography>
              <TextField
                fullWidth
                required
                sx={{ width: "500px" }}
                inputProps={{ maxLength: 100 }}
                type="number                "
                name="otp"
                label="OTP"
                color="secondary"
                onChange={handleInputOTP}
              />
            </Stack>

            <Grid item xs={6} sx={{ marginTop: "3%" }}>
              <CountTime />
            </Grid>

            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
              marginTop="5%"
              marginLeft="7%"
            >
              <Grid item xs={5}>
                <BackButton />
              </Grid>
              <Grid item xs={5}>
                <NextButton onClick={handleSubmit} />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default OTP;
