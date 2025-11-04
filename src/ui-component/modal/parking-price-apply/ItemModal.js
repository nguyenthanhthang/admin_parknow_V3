import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useState } from "react";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import Swal from "sweetalert2";
import config from "config";

const ItemModal = ({ setIsOpen, priceId, priceName, isDetail }) => {
  const theme = useTheme();

  const [parkingId, setParkingId] = useState();
  const [parkingOfPrice, setParkingOfPrice] = useState([]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  // const user = localStorage.getItem("user"); // Set the authentication status here
  // const userData = JSON.parse(user);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchDataParkingOfPrice = async () => {
    const response = await fetch(
      `${apiUrl}/parkings/parking-price/${priceId}`,
      requestOptions
    );

    const data = await response.json();
    setParkingOfPrice(data.data);
  };

  useEffect(() => {
    // fetchDataParking();
    fetchDataParkingOfPrice();
  }, []);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleChangeParking = (e) => {
    setParkingId(e.target.value);
  };

  const handleRegisterStaff = async (e) => {
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
          parkingId: parkingId,
          parkingPriceId: priceId,
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify(request),
        };

        const response = await fetch(
          `${apiUrl}/parkingHasPrice`,
          requestOptions
        );

        const data = await response.json();

        if (data.statusCode === 201) {
          setIsOpen(false);

          Swal.fire({
            icon: "success",
            text: "Áp dụng gói cước cho bãi xe thành công",
          }).then((result) => {
            if (result.isConfirmed) {
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
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "5%",
        }}
      >
        <Typography variant="h2" color={theme.palette.primary.main}>
          Tạo mới gói cước cho bãi xe
        </Typography>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={10}
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
          {!isDetail && (
            <>
              <Grid item xs={5}>
                <Typography color={theme.palette.secondary.main} variant="h4">
                  Gói cước
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  type="text"
                  value={priceName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Grid
          item
          container
          xs={9}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          sx={!isDetail ? {} : { marginTop: "-7%" }}
        >
          <Grid item xs={5}>
            <Typography color={theme.palette.secondary.main} variant="h4">
              Bãi xe
            </Typography>
          </Grid>
          {/* <Grid item xs={7}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Bãi xe</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={parkingId}
                label="Bãi xe"
                onChange={handleChangeParking}
              >
                {parkings
                  .filter((parking) => {
                    const parkingIds = parkingOfPrice?.map(
                      (item) => item.parkingId
                    );
                    return !parkingIds?.includes(parking.parkingId);
                  })
                  .map((parking, index) => (
                    <MenuItem
                      key={index}
                      sx={{ width: "100%" }}
                      value={parking.parkingId}
                    >
                      {parking.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={5}
        sx={!isDetail ? { marginTop: "7%" } : { marginTop: "25%" }}
      >
        <Grid item>
          <CancelButton onClick={handleCloseModal} />
        </Grid>
        <Grid item>
          <SaveButton onClick={handleRegisterStaff} />
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
