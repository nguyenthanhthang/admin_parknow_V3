import React from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Information = (props) => {
  const { data } = props;
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid container direction="row" justifyContent="space-between">
      <Grid item container direction="column" xs={5}>
        <Grid item>
          <Typography
            color={theme.palette.primary.main}
            variant="h2"
            sx={{ padding: "5px 0 20px 0" }}
          >
            Thông tin chủ doanh nghiệp
          </Typography>
        </Grid>
        {/* <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Tên
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.name}
            </Typography>
          </Grid>
        </Grid> */}

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Chức vụ
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              Chủ doanh nghiệp
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Email
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.email}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Số điện thoại
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.phone}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Ngày sinh
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.dateOfBirth ? data?.dateOfBirth : "Không xác định"}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Giới tính
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.gender ? data?.gender : "Không xác định"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={0.5} sx={{ borderRight: "1px solid grey" }}></Grid>

      <Grid item container direction="column" xs={5}>
        <Typography
          color={theme.palette.primary.main}
          variant="h2"
          sx={{ padding: "5px 0 20px 0" }}
        >
          Thông tin doanh nghiệp
        </Typography>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Tên doanh nghiệp
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.businessProfileName}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "15px" }}
        >
          <Grid item>
            <Typography
              color={theme.palette.common.main}
              gutterBottom
              variant={matchDownSM ? "h4" : "h4"}
            >
              Địa chỉ
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.common.black}
              gutterBottom
              variant={matchDownSM ? "subtitle1" : "subtitle1"}
            >
              {data?.address}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Information;
