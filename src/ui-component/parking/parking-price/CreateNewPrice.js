import React, { useEffect, useState } from "react";
import CardInput from "./CardInput";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useTheme } from "@mui/material/styles";
import MainCard from "ui-component/cards/MainCard";
import AddButton from "ui-component/buttons/add-button/AddButton";
// import NextButton from "ui-component/buttons/next-button/NextButton";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import config from "config";

const CreateNewPrice = () => {
  const theme = useTheme();

  const token = localStorage.getItem("tokenAdmin");
  const user = localStorage.getItem("admin"); // Set the authentication status here
  const userData = JSON.parse(user);

  const navigate = useNavigate();

  const [cards, setCards] = useState([
    {
      price: 0,
      startTime: "",
      endTime: "",
      extraFree: 0,
    },
  ]);

  console.log("cards", cards);

  const initialState = {
    name: "",
    vehicleType: 1,
    isWholeDay: false,
    isExtraFree: false,
    startingTime: 0,
    timeStep: 0,
    isPenaltyChecked: false,
    penaltyPrice: 0,
    penaltyPriceStep: 0,
  };
  const [parkingPrice, setParkingPrice] = useState(initialState);

  const handleAddCard = () => {
    setCards([
      ...cards,
      {
        price: 0,
        startTime: "",
        endTime: "",
        extraFree: 0,
      },
    ]);
  };

  const apiUrl = config.apiUrl;

  const requestBody = {
    parkingPriceName: parkingPrice.name,
    managerId: userData,
    trafficId: parkingPrice.vehicleType,
    isWholeDay: parkingPrice.isWholeDay,
    startingTime: parkingPrice.startingTime ? parkingPrice.startingTime : null,
    hasPenaltyPrice: parkingPrice.isPenaltyChecked,
    penaltyPrice: parkingPrice.penaltyPrice ? parkingPrice.penaltyPrice : null,
    penaltyPriceStepTime: parkingPrice.penaltyPriceStepTime
      ? parkingPrice.penaltyPriceStepTime
      : null,
    isExtrafee: parkingPrice.isExtraFree,
    extraTimeStep: parkingPrice.timeStep,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const handleSave = () => {
    if (
      parkingPrice.name === "" ||
      (parkingPrice.isWholeDay === false && parkingPrice.isExtraFree === false)
    ) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng nhập tên gói cước và chọn gói cước!",
      });
      return;
    }
    if (
      parkingPrice.isPenaltyChecked === false ||
      parkingPrice.penaltyPrice === 0
    ) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng chọn phạt quá giờ và phí phạt!",
      });
      return;
    }
    const isValid = cards.every((card, index) => {
      if (index > 0) {
        const prevEndTime = cards[index - 1].endTime;
        const currStartTime = card.startTime;
        if (currStartTime < prevEndTime) {
          Swal.fire({
            icon: "error",
            text: `Thời gian bắt đầu của khung giờ ${
              index + 1
            } phải lớn hơn thời gian kết thúc của khung giờ ${index}`,
          });
          return false;
        }
      }
      return true;
    });

    if (isValid) {
      Swal.fire({
        title: "Xác nhận?",
        text: "Bạn có chắc chắn muốn thay đổi!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác nhận!",
      }).then((result) => {
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
          apiSaveData();
        }
      });
      // apiSaveData();
    }
  };

  const apiSaveData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/parking-price/create`,
        requestOptions
      );

      if (!response.ok) {
        Swal.close();
        const errorData = await response.json();
        const errorMessage =
          errorData?.message || "An error occurred during the request.";
        Swal.fire({
          icon: "error",
          title: "Có lỗi xảy ra",
          text: errorMessage,
        });

        console.log("response", response.json());
      }
      const data = await response.json();

      if (data !== null) {
        cards.map((card, index) => {
          const timeRequest = {
            name: `Khung giờ ${index + 1}`,
            price: card.price,
            description: `Khung giờ ${index + 1}`,
            startTime: card.startTime ? card.startTime : "",
            endTime: card.endTime ? card.endTime : "",
            extraFee: card.extraFree ? card.extraFree : null,
            parkingPriceId: data.data,
          };

          const requestOptionsTime = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token}`,
            },
            body: JSON.stringify(timeRequest),
          };

          fetch(`${apiUrl}/timeline-management`, requestOptionsTime)
            .then((response) => {
              if (!response.ok) {
                console.log("response", response);
              }
              return response.json();
            })
            .then((data) => {
              console.log("data", data);
              Swal.close();
              Swal.fire({
                icon: "success",
                text: "Tạo mới giá và khung giờ cho giá thành công!",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/prices");
                }
              });
            });
          return data;
        });
      }
      // console.log("Response data:", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemoveCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, inputIndex, inputValue) => {
    const updatedCards = [...cards];
    updatedCards[index][Object.keys(cards[index])[inputIndex - 1]] = inputValue;
    setCards(updatedCards);
  };

  const handleNameChange = (e) => {
    setParkingPrice({ ...parkingPrice, name: e.target.value });
  };

  const handleVehicleTypeChange = (event) => {
    const value = parseInt(event.target.value);
    setParkingPrice({ ...parkingPrice, vehicleType: value });
  };

  const handleCheckboxChange = (event) => {
    setParkingPrice({ ...parkingPrice, isExtraFree: event.target.checked });
  };

  const handleCheckboxWholeChange = (event) => {
    setParkingPrice({ ...parkingPrice, isWholeDay: event.target.checked });
  };

  const handleStartingTimeChange = (e) => {
    setParkingPrice({ ...parkingPrice, startingTime: Number(e.target.value) });
  };

  const handleTimeStepChange = (e) => {
    setParkingPrice({ ...parkingPrice, timeStep: Number(e.target.value) });
  };

  const handlePenaltyCheck = (event) => {
    setParkingPrice({
      ...parkingPrice,
      isPenaltyChecked: event.target.checked,
    });
  };

  const handlePenaltyPrice = (e) => {
    setParkingPrice({ ...parkingPrice, penaltyPrice: Number(e.target.value) });
  };

  const handlePenaltyPriceStep = (e) => {
    setParkingPrice({
      ...parkingPrice,
      penaltyPriceStep: Number(e.target.value),
    });
  };

  return (
    <MainCard title="Tạo mới cước phí">
      <Grid container direction="row" justifyContent="space-around">
        <Grid item xs={5.5}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Tên cước phí
          </Typography>
          <TextField
            type="text"
            value={parkingPrice.name}
            onChange={handleNameChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={5.5}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Loại xe
          </Typography>
          <Select
            value={parkingPrice.vehicleType}
            onChange={handleVehicleTypeChange}
            sx={{ width: "100%" }}
          >
            <MenuItem value={1}>Xe hơi</MenuItem>
            <MenuItem value={2}>Xe máy</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        spacing={10}
        sx={{ padding: "5px" }}
      >
        <Grid item sx={{ marginLeft: "33px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={parkingPrice.isWholeDay}
                onChange={handleCheckboxWholeChange}
              />
            }
            label="Cùng giá cho cả ngày"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold",
                fontSize: 17,
              },
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={parkingPrice.isExtraFree}
                onChange={handleCheckboxChange}
              />
            }
            label="Phụ phí"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: "bold",
                fontSize: 17,
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        marginTop="2px"
      >
        <Grid item xs={5.5}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Số giờ bắt đầu tính phí
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            value={parkingPrice.startingTime}
            onChange={handleStartingTimeChange}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={5.5}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Bước thời gian
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            value={parkingPrice.timeStep}
            onChange={handleTimeStepChange}
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={6}
        sx={{ marginTop: "3px", marginLeft: "1px" }}
      >
        {cards.map((card, index) => (
          <Grid item xs={3.5} key={index}>
            <CardInput
              index={index}
              isExtraFree={parkingPrice.isExtraFree}
              isWholeDay={parkingPrice.isWholeDay}
              inputValues={[
                card.price,
                card.startTime,
                card.endTime,
                card.extraFree,
              ]}
              onInputChange={handleInputChange}
              onRemove={handleRemoveCard}
            />
          </Grid>
        ))}
        {cards.length < 5 && !parkingPrice.isWholeDay && (
          <Grid item>
            <AddButton onClick={handleAddCard} />
          </Grid>
        )}
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={parkingPrice.isPenaltyChecked}
            onChange={handlePenaltyCheck}
          />
        }
        label="Phạt qua giờ"
        sx={{
          marginLeft: "20px",
          "& .MuiFormControlLabel-label": {
            fontWeight: "bold",
            fontSize: 17,
          },
        }}
      />
      {parkingPrice.isPenaltyChecked && (
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          sx={{
            border: "1px dashed gray",
            borderRadius: "7px",
            width: "97%",
            padding: "10px 10px 30px 10px",
            marginLeft: "23px",
          }}
        >
          <Grid item xs={5.5}>
            <Typography color={theme.palette.common.black} variant="subtitle1">
              Giá tiền phạt
            </Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              value={parkingPrice.penaltyPrice}
              onChange={handlePenaltyPrice}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={5.5}>
            <Typography color={theme.palette.common.black} variant="subtitle1">
              Bước thời gian
            </Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              value={parkingPrice.penaltyPriceStep}
              onChange={handlePenaltyPriceStep}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      )}
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ marginTop: "14px" }}
      >
        <SaveButton onClick={handleSave} />
      </Grid>
    </MainCard>
  );
};

export default CreateNewPrice;
