import { Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useState } from "react";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import config from "config";

const ItemModal = (props) => {
  const { setIsOpen } = props;
  const { priceId } = useParams();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [extraFee, setExtraFee] = useState(0);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleInputPrice = (event) => {
    const { value } = event.target;
    setPrice(value);
  };

  const handleInputExtrafee = (e) => {
    setExtraFee(e.target.value);
  };

  const handleInputStartTime = (e) => {
    setStartTime(formatTime(e.target.value));
  };

  const handleInputEndTime = (e) => {
    setEndTime(formatTime(e.target.value));
  };

  const formatTime = (timeString) => {
    const date = new Date();
    const [hours] = timeString.split(":");
    date.setHours(hours);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCreateTimeLine = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn lưu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
        const request = {
          name: name,
          price: price,
          description: name,
          startTime: startTime,
          endTime: endTime,
          extraFee: extraFee,
          parkingPriceId: priceId,
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        };

        const response = await fetch(
          `${apiUrl}/timeline-management`,
          requestOptions
        );

        const data = await response.json();

        if (data.statusCode === 201) {
          setIsOpen(false);

          Swal.fire({
            icon: "success",
            text: "Tạo mới khung giờ thành công",
          }).then((result) => {
            if (result.isConfirmed) {
              setName("");
              setPrice(0);
              setExtraFee(0);
              setStartTime();
              setEndTime();
              setIsOpen(false);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: data.message,
          });
        }
      }
    });
  };

  return (
    <>
      <Grid
        item
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Typography variant="h2" color={theme.palette.primary.main}>
          Tạo mới khung thời gian
        </Typography>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ marginTop: "5%" }}
      >
        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Tên khung giờ
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              label="Tên khung giờ"
              type="text"
              value={name}
              onChange={handleChangeName}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Giá khung giờ
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="number"
              value={price}
              onChange={handleInputPrice}
              // inputProps={{ step: 1 }}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Giá phụ phí
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="number"
              value={extraFee}
              onChange={handleInputExtrafee}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Từ
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="time"
              value={startTime}
              onChange={handleInputStartTime}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Đến
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="time"
              value={endTime}
              onChange={handleInputEndTime}
            />
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={3}
          sx={{ marginTop: "3%" }}
        >
          <Grid item>
            <CancelButton onClick={handleCloseModal} />
          </Grid>
          <Grid item>
            <SaveButton onClick={handleCreateTimeLine} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
