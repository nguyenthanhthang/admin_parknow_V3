import { Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom/dist";
import ContinueLogin from "ui-component/buttons/continue-login/ContinueLogin";
import Lottie from "lottie-react";
import animationData from "../../../assets/json/88860-success-animation.json";

const Done = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const handleOnclick = () => {
    navigate("/login");
  };
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ height: 400, width: 400 }}
          />
        </Grid>
        <Grid item>
          <Typography color={theme.palette.primary.main} variant="h1">
            Hoàn Thành
          </Typography>
        </Grid>
        <Grid item>
          <Typography color={theme.palette.secondary.dark} variant="h2">
            Yêu cầu của bạn đang chờ duyệt!
          </Typography>
        </Grid>
        <Grid item>
          <Typography color={theme.palette.secondary.dark} variant="h2">
            Vui lòng kiểm tra Email để nhận thông báo
          </Typography>
        </Grid>
        <Stack sx={{ marginTop: "6px" }}>
          <ContinueLogin onClick={handleOnclick} />
        </Stack>
      </Grid>
    </>
  );
};

export default Done;
