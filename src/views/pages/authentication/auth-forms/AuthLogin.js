import { useState } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  // useMediaQuery,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extend/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateTokenAdmin, updateTokenStaff } from "store/tokenSlice";
import { useNavigate } from "react-router";
import config from "config";

// import Google from "assets/images/icons/social-google.svg";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [showPassword, setShowPassword] = useState(false);

  const apiUrl = config.apiUrl;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (requestBody) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    Swal.fire({
      icon: "info",
      title: "Đang xử lý thông tin...",
      text: "Vui lòng chờ trong giây lát!",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      fetch(`${apiUrl}/admin-authentication`, requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const res = data;

          if (res.data === null) {
            Swal.close();

            Swal.fire({
              icon: "error",
              title: "Đăng nhập thất bại",
              text: res.message,
            });
          } else {
            const parts = data.data.token.split(".");
            const payload = parts[1];
            const urlDecodedPayload = decodeURIComponent(payload);
            const decodedPayload = atob(urlDecodedPayload);

            const user = JSON.parse(decodedPayload);

            if (user.role === "Admin") {
              localStorage.setItem("tokenAdmin", data.data.token);
              localStorage.setItem("admin", JSON.stringify(user));
              localStorage.removeItem("tokenStaff");
              localStorage.removeItem("staff");
              dispatch(updateTokenAdmin(data.data.token));
              Swal.close();
              navigate("/dashboard");
            } else {
              localStorage.removeItem("tokenAdmin");
              localStorage.removeItem("admin");
              localStorage.setItem("tokenStaff", data.data.token);
              localStorage.setItem("staff", JSON.stringify(user));
              dispatch(updateTokenStaff(data.data.token));
              Swal.close();
              navigate("/request");
              window.location.reload();
            }
          }
          // console.log("res", res);
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error,
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Đăng nhập với Email</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Vui lòng nhập Email hợp lệ")
            .max(255)
            .required("Vui lòng nhập Email"),
          password: Yup.string().max(255).required("Vui lòng nhập Password"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const requestBody = {
              email: values.email,
              password: values.password,
            };
            await handleLogin(requestBody);
            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Mật khẩu
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Typography
                variant="subtitle1"
                color="secondary"
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                Quên mật khẩu?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  // sx={{ borderRadius: "10px" }}
                >
                  Đăng nhập
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
