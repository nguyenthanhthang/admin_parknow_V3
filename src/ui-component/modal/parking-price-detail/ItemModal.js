import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const ItemModal = (props) => {
  const { setIsOpen, parkingPriceId } = props;
  const theme = useTheme();

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const tokenStaff = localStorage.getItem("tokenStaff");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token ? token : tokenStaff}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/timeline-management/${parkingPriceId}?pageNo=1&pageSize=11`,
      requestOptions
    );
    const data = await response.json();
    if (data) {
      setData(data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (number) => {
    const formattedNumber = number?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formattedNumber;
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        paddingBottom={2}
      >
        <Grid item xs={4}>
          <Typography variant="h3" color={theme.palette.common.black}>
            Khung giờ
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h3" color={theme.palette.common.black}>
            Giá tiền({data.parkingPriceRes?.startingTime}h đầu)
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h3" color={theme.palette.common.black}>
            Phụ phí({data.parkingPriceRes?.extraTimeStep}h tiếp theo)
          </Typography>
        </Grid>
      </Grid>
      {data.lstTimeLineRes?.map((time, index) => (
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          key={index}
        >
          <Grid item xs={5}>
            <Typography
              variant="subtitle1"
              color={theme.palette.common.black}
              sx={{ fontSize: "16px" }}
            >
              {time?.startTime.substring(0, 5)} -{" "}
              {time?.endTime.substring(0, 5)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="subtitle1"
              color={theme.palette.common.black}
              sx={{ fontSize: "16px" }}
            >
              {formatPrice(time?.price)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              color={theme.palette.common.black}
              sx={{ fontSize: "16px" }}
            >
              {formatPrice(time?.extraFee)}
            </Typography>
          </Grid>
        </Grid>
      ))}
      <Grid container direction="row" paddingTop={2}>
        <Grid item>
          <Typography variant="h3" color={theme.palette.common.black}>
            Giá phạt:
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle1"
            sx={{ color: "red", marginLeft: "5px", fontSize: "16px" }}
          >
            {formatPrice(data.parkingPriceRes?.penaltyPrice)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle1"
            color={theme.palette.common.black}
            sx={{ fontSize: "16px" }}
          >
            , sau mỗi {data.parkingPriceRes?.penaltyPriceStepTime}h
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
