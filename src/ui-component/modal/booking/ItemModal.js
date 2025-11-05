import { Avatar, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "store/modalReducer";
import GridItem from "./GridItem";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import Swal from "sweetalert2";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const ItemModal = ({ modalType }) => {
  const theme = useTheme();
  const { bookingId } = useSelector((state) => state.modal);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/booking-management/${bookingId}`,
      requestOptions
    );
    const data = await response.json();

    if (data.data) {
      setData(data.data);
      setLoading(false);
    } else {
      Swal.fire({
        icon: "error",
        text: data.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseModal = () => {
    dispatch(closeModal(modalType));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    return timeString;
  };

  const formatStartEndTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const timeStringStart = start.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeStringEnd = end.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${timeStringStart} - ${timeStringEnd}`;
  };

  const formatDate = (date) => {
    if (date && date.length >= 10) {
      return date.slice(0, 10);
    }
    return "-------";
  };

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
      <Grid container direction="row">
        <Grid
          item
          container
          xs={5}
          direction="column"
          spacing={2}
          justifyContent="center"
          sx={{ marginLeft: "1%" }}
        >
          <Grid item sx={{ textAlign: "center" }}>
            <Typography color={theme.palette.primary.main} variant="h2">
              Thông tin chi tiết
            </Typography>
          </Grid>
          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Mã đơn" value={data?.bookingId} />
          </Grid>

          <Grid item sx={{ marginTop: "2%" }}>
            <Typography color={theme.palette.primary.secondary} variant="h3">
              Hồ sơ
            </Typography>
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Người đặt" value={data?.customerName} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="SĐT" value={data?.customerPhone} />
          </Grid>

          <Grid item sx={{ marginTop: "2%" }}>
            <Typography color={theme.palette.primary.secondary} variant="h3">
              Người được đặt hộ
            </Typography>
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Tên KH"
              value={data?.guestName ? data?.guestName : "Không có"}
            />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="SĐT"
              value={data?.guestPhone ? data?.guestPhone : "Không có"}
            />
          </Grid>

          <Grid item sx={{ marginTop: "2%" }}>
            <Typography color={theme.palette.primary.secondary} variant="h3">
              Thông tin xe
            </Typography>
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Phương tiện" value={data?.vehicleName} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Biển số xe" value={data?.licensePlate} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Loại xe"
              value={data?.trafficName ? data?.trafficName : "Chưa có"}
            />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Màu xe" value={data?.color} />
          </Grid>

          <Grid
            item
            container
            direction="row"
            justifyContent="space-between"
            sx={{ marginTop: "6%" }}
          >
            <Grid item>
              <Typography
                color={theme.palette.common.black}
                variant="h3"
                sx={{ fontSize: "25px" }}
              >
                Số tiền
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color={theme.palette.common.black}
                variant="h3"
                sx={{ fontSize: "25px" }}
              >
                {data?.totalPrice
                  ? formatPrice(data?.totalPrice)
                  : "Chưa tính tiền"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          xs={5}
          alignItems="center"
          sx={{ marginLeft: "10%", marginTop: "1%" }}
          spacing={2}
        >
          <Grid item>
            <Avatar
              alt="avatar"
              src={
                data?.customerAvatar
                  ? data?.customerAvatar
                  : "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
              }
              variant="rounded"
              sx={{
                width: "200px",
                height: "190px",
                marginTop: "2%",
                borderRadius: "20px",
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              color={theme.palette.primary.secondary}
              variant="h3"
              sx={{ paddingTop: "7px", paddingBottom: "7px" }}
            >
              Thông tin đơn
            </Typography>
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Bãi xe" value={data?.parkingName} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Ngày đặt" value={formatDate(data?.startTime)} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Thời gian đặt"
              value={formatStartEndTime(data?.startTime, data?.endTime)}
            />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Giờ vào"
              value={
                data?.checkinTime ? formatTime(data?.checkinTime) : "Chưa vào"
              }
            />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Giờ ra"
              value={
                data?.checkoutTime ? formatTime(data?.checkoutTime) : "Chưa ra"
              }
            />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Vị trí" value={data?.parkingSlotName} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem title="Tầng" value={data?.floorName} />
          </Grid>

          <Grid item container direction="row" justifyContent="space-between">
            <GridItem
              title="Tiền chưa thanh toán"
              value={formatPrice(data?.unPaidMoney)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: "5%" }}
      >
        <Grid item>
          <CancelButton onClick={handleCloseModal} />
        </Grid>
        {/* <Grid item>
          {accept === true && (
            <AcceptButton value="Chấp nhận" onClick={handleOpenDialog} />
          )}
          {checkIn === true && (
            <AcceptButton value="Check in" onClick={handleOpenDialog} />
          )}
          {checkOut === true && (
            <AcceptButton value="Check out" onClick={handleOpenDialog} />
          )}
          {cancel === true && (
            <AcceptButton value="Hủy đơn" onClick={handleOpenDialog} />
          )}
        </Grid> */}
      </Grid>
    </>
  );
};

export default ItemModal;
