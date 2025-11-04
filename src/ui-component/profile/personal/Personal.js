import React from "react";
import { Avatar, Grid, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Information from "./Information";
import EditButton from "ui-component/buttons/edit-button/EditButton";

const Personal = (props) => {
  const { data } = props;
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Grid container direction="row" justifyContent="space-around">
        <Grid
          item
          xs={2.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid grey",
            boxShadow: "15px 15px 30px #bebebe, -15px -15px 30px #ffffff",
            borderRadius: "8px",
          }}
        >
          <Avatar
            alt="avatar"
            src={data?.avatar}
            variant="circular"
            sx={{ width: "60%", height: "75%" }}
          />

          <Typography
            color={theme.palette.secondary.main}
            variant="h4"
            sx={{ marginTop: "10px", fontSize: "20px" }}
          >
            {data?.name}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Information data={data} />
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
        spacing={10}
        sx={{ marginTop: "2px" }}
      >
        <Grid item sx={{ height: "400px", width: "350px" }}>
          <Typography
            color={theme.palette.secondary.main}
            gutterBottom
            variant={matchDownSM ? "h4" : "h4"}
          >
            Mặt trước
          </Typography>
          <Avatar
            alt="front"
            src={data?.frontIdentification}
            variant="rounded"
            sx={{ width: "100%", height: "80%", padding: 0 }}
          />
        </Grid>
        <Grid item sx={{ height: "400px", width: "350px" }}>
          <Typography
            color={theme.palette.secondary.main}
            gutterBottom
            variant={matchDownSM ? "h4" : "h4"}
          >
            Mặt sau
          </Typography>
          <Avatar
            alt="back"
            src={data?.backIdentification}
            variant="rounded"
            sx={{ width: "100%", height: "80%" }}
          />
        </Grid>
        {data?.businessLicense ? (
          <Grid item sx={{ marginTop: "-130px" }}>
            <Typography
              color={theme.palette.secondary.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Giấy phép kinh doanh
            </Typography>
            <Avatar
              alt="bback"
              src={data?.businessLicense}
              variant="rounded"
              sx={{ width: "90%", height: "70%" }}
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

export default Personal;
