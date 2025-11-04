import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { setCurrentStep, setUserData } from "store/stepReducer";
import validator from "validator";
import ContinueButton from "ui-component/buttons/continue-button-register/ContinueButton";
import Swal from "sweetalert2";

const AccountInfor = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.multiStep.currentStep);
  const userData = useSelector((state) => state.multiStep.userData);

  const [errorEmail, setErrorEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleNext = () => {
    if (
      userData.email === undefined ||
      userData.password === undefined ||
      userData.confirmPassword === undefined
    ) {
      Swal.fire({
        icon: "warning",
        title: "Nhập tất cả",
        text: "Bạn phải nhập hết tất cả các ô nhập",
      });
    } else {
      dispatch(setCurrentStep(currentStep + 1));
    }

    dispatch(setCurrentStep(currentStep + 1));
  };

  const handleInputEmail = (event) => {
    const { value } = event.target;

    const startsWithSpace = /^\s/.test(value);
    // Remove any spaces from the input value
    if (!startsWithSpace) {
      dispatch(setUserData({ ...userData, email: value }));
      setErrorEmail(!validator.isEmail(value));
    } else {
      setErrorEmail(true);
    }
    // setSpaceInput(newEmail.trim().length === 0);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;

    // Remove any spaces from the input value
    if (!value.includes(" ")) {
      setPassword(value);
      setErrorPassword(false);
      dispatch(setUserData({ ...userData, password: value }));
      // setPasswordsMatch(event.target.value === confirmPassword);
    } else {
      setErrorPassword(true);
    }
    // setSpaceInput(event.target.value.trim() === 0);
  };

  const handleConfirmPasswordChange = (event) => {
    // setSpaceInput(event.target.value.trim() === 0);
    // setConfirmPassword(event.target.value);
    dispatch(setUserData({ ...userData, confirmPassword: event.target.value }));
    setPasswordsMatch(event.target.value === password);
  };

  return (
    <>
      <form style={{ marginTop: "5%" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          // marginTop="8%"
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
                Thông tin tài khoản
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack xs={12} justifyContent="center" spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                required
                sx={{ width: "500px" }}
                // inputProps={{ maxLength: 100 }}
                type="email"
                name="email"
                value={userData["email"]}
                label="Email"
                color="secondary"
                onChange={handleInputEmail}
                error={errorEmail}
                helperText={errorEmail ? "Vui lòng nhập đúng email" : ""}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography
                color={theme.palette.secondary.dark}
                gutterBottom
                variant={matchDownSM ? "h5" : "h4"}
                marginTop="8%"
              >
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                required
                type="password"
                name="password"
                label="Mật khẩu"
                color="secondary"
                error={errorPassword}
                value={userData["password"]}
                onChange={handlePasswordChange}
                helperText={
                  errorPassword ? "Vui lòng không nhập khoảng trống" : ""
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
                Xác nhận mật khẩu
              </Typography>
              <TextField
                fullWidth
                required
                type="password"
                name="confirmPassword"
                label="Xác nhận mậu khẩu"
                color="secondary"
                value={userData["confirmPassword"]}
                onChange={handleConfirmPasswordChange}
                error={!passwordsMatch}
                helperText={!passwordsMatch ? "Mật khẩu không khớp" : ""}
              />
            </Stack>
            <Stack sx={{ marginTop: "8%" }}>
              {/* <Button
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  borderRadius: "10px",
                  backgroundColor: "#063970",
                  ":is(:hover, :focus)": {
                    backgroundColor: "#478be9",
                    outline: "3px solid #478be9",
                    outlineOffset: "1px",
                  },
                }}
                type="submit"
                variant="contained"
                onClick={handleNext}
                disabled={
                  userData.email === undefined ||
                  userData.password === undefined ||
                  userData.confirmPassword === undefined
                }
              >
                Tiếp theo
              </Button> */}
              <ContinueButton
                width="100%"
                disable="true"
                onClick={handleNext}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AccountInfor;
