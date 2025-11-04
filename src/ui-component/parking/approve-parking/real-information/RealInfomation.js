import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Chip, Grid, Typography } from "@mui/material";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const RealInformation = (props) => {
  const { approveParkingId } = props;
  const theme = useTheme();
  const [data, setData] = useState(null);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const [loading, setLoading] = useState(false);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/request/approve-parkings/approve-parking-detail/${approveParkingId}`,
      requestOptions
    );

    const data = await response.json();
    setData(data.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }
  return (
    <>
      <Typography
        color={theme.palette.primary.dark}
        variant="h2"
        sx={{ marginTop: "15px" }}
      >
        Chi tiết yêu cầu duyệt
      </Typography>

      <Typography
        color={theme.palette.primary.dark}
        variant="h3"
        sx={{ marginTop: "15px" }}
      >
        Thông tin nhân viên thực địa
      </Typography>
      <Grid
        container
        direction="column"
        spacing={5}
        justifyContent="flex-start"
        marginTop={1}
      >
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          xs={12}
        >
          <Grid item xs={2}>
            <Typography color={theme.palette.common.dark} variant="h4">
              Mã nhân viên
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography color={theme.palette.common.dark} variant="subtitle1">
              {data?.staffId}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={2}>
            <Typography color={theme.palette.common.dark} variant="h4">
              Họ và tên
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography color={theme.palette.common.dark} variant="subtitle1">
              {data?.staffName}
            </Typography>
          </Grid>
        </Grid>

        <Typography
          color={theme.palette.primary.dark}
          variant="h2"
          sx={{ marginLeft: "37px", marginTop: "15px" }}
        >
          Thông tin yêu cầu
        </Typography>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={2}>
            <Typography color={theme.palette.common.dark} variant="h4">
              Trạng thái
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Chip
              color="primary"
              label={data?.status}
              sx={{ fontWeight: 600, fontSize: "15px" }}
            />
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={2}>
            <Typography color={theme.palette.common.dark} variant="h4">
              Ghi chú
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography color={theme.palette.common.dark} variant="subtitle1">
              {data?.note}
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Typography color={theme.palette.secondary.dark} variant="h4">
            Hình ảnh
          </Typography>
        </Grid>
        <Grid item container direction="row" spacing={3}>
          {data?.images.map((image, index) => {
            return (
              <Grid item key={index}>
                <img
                  src={image.url}
                  style={{
                    borderRadius: "10px",
                    width: "300px",
                    height: "180px",
                  }}
                  alt=""
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default RealInformation;
