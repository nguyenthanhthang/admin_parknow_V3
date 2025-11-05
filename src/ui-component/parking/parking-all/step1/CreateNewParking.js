import {
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { useTheme } from "@mui/material/styles";
import NextButton from "ui-component/buttons/next-button/NextButton";
import UploadImageParking from "ui-component/upload-file-antd/UploadImageParking";
import AddButton from "ui-component/buttons/add-button/AddButton";
import FloorCardInput from "./FloorCardInput";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { saveState } from "utils/ParkingModalLocalStorage";
import config from "config";

const CreateNewParking = () => {
  const theme = useTheme();

  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const user = localStorage.getItem("admin"); // Set the authentication status here
  const userData = JSON.parse(user);

  const navigate = useNavigate();

  const initialState = {
    name: "",
    address: "",
    description: "",
    carSpot: 0,
    isPrepayment: false,
    isOvernight: false,
  };
  const [parking, setParking] = useState(initialState);

  const [floors, setFloors] = useState([
    {
      floor: 1,
      numCarSlots: 0,
      numCarRows: 0,
      numCarCols: 0,
      carSlots: [],
    },
  ]);

  const handleAddFloor = () => {
    const lastFloor = floors[floors.length - 1];
    if (
      lastFloor.numSlots === 0 ||
      lastFloor.numRow === 0 ||
      lastFloor.numCol === 0 ||
      lastFloor.numSlots > lastFloor.numRow * lastFloor.numCol
    ) {
      setError(true);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Số lượng chỗ đậu xe không lớn hơn tổng số chỗ trống và cả số hàng và số cột phải lớn hơn 0",
      });
      return;
    } else {
      setError(false);
    }

    const newFloor = {
      floor: floors.length + 1,
      numCarSlots: 0,
      numCarRows: 0,
      numCarCols: 0,
      carSlots: [],
    };

    setFloors([...floors, newFloor]);
  };

  const handleRemoveFloor = (index) => {
    setFloors(floors.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, inputIndex, inputValue) => {
    const updatedFloors = [...floors];
    updatedFloors[index][Object.keys(floors[index])[inputIndex - 1]] =
      inputValue;
    setFloors(updatedFloors);
  };

  const getTotalNumCarSlots = () => {
    const totalNumCarSlots = floors.reduce((sum, floor) => {
      return sum + floor.numCarSlots;
    }, 0);

    return totalNumCarSlots;
  };
  // Call the getTotalNumCarSlots function to get the sum
  const totalNumCarSlots = getTotalNumCarSlots();

  const handleNameChange = (e) => {
    setParking({ ...parking, name: e.target.value });
  };

  const handleAddressChange = (e) => {
    setParking({ ...parking, address: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setParking({ ...parking, description: e.target.value });
  };

  const handleCheckboxOvernightChange = (e) => {
    setParking({ ...parking, isOvernight: e.target.checked });
  };
  const handleCheckboxPrePaymentChange = (e) => {
    setParking({ ...parking, isPrepayment: e.target.checked });
  };

  const handleContinue = async () => {
    if (error) {
      return;
    } else {
      Swal.fire({
        title: "Xác nhận?",
        text: "Bạn có chắc chắn muốn thay đổi!",
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
          const parkingId = await handleCreateNewPark();
          if (parkingId !== "undefined" || parkingId === 0) {
            const done = await handleUploadImage(parkingId);
            if (done) {
              saveState(floors);
              localStorage.setItem("address", parking.address);
              Swal.close();

              navigate("/maps");
            } else {
              Swal.fire({
                icon: "error",
                text: "Tạo mới bãi xe thất bại! Vui lòng thử lại.",
              });
              return;
            }
          }
        }
      });
    }
  };

  const requestBody = {
    name: parking.name,
    address: parking.address,
    description: parking.description,
    carSpot: totalNumCarSlots,
    isPrepayment: parking.isPrepayment,
    isOvernight: parking.isOvernight,
    managerId: Number(userData),
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const handleCreateNewPark = async () => {
    const response = await fetch(`${apiUrl}/parkings/parking`, requestOptions);

    const data = await response.json();
    localStorage.setItem("parkingId", data.data);
    return data.data;
  };

  const handleUploadImage = async (parkingId) => {
    const imageUrls = await handleUploadAllImage();

    const uploadPromises = imageUrls.map((image, index) => {
      const request = {
        imgPath: image,
        parkingId: parkingId,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      };

      return fetch(`${apiUrl}/parking-spot-image`, requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((data) => {});
    });

    return Promise.all(uploadPromises).then(() => {
      return true;
    });
  };

  const handleUploadAllImage = () => {
    return new Promise((resolve, reject) => {
      const uploadPromises = imageList.map((file, index) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file.originFileObj, file.name);

          axios
            .post(`${apiUrl}/upload-image`, formData)
            .then((response) => {
              const { data } = response;
              resolve(data.link);
            })
            .catch((error) => {
              reject(error);
            });
        });
      });

      Promise.all(uploadPromises)
        .then((imageUrls) => {
          resolve(imageUrls); // resolve the Promise with the array of image URLs
        })
        .catch((error) => {
          reject(error); // reject the Promise
        });
    });
  };

  return (
    <>
      <MainCard title="Tạo mới bãi xe">
        <Grid container direction="row" alignItems="center" spacing={4}>
          <Grid item xs={6}>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
              sx={{ padding: "7px" }}
            >
              Tên
            </Typography>
            <TextField
              type="text"
              fullWidth
              color="secondary"
              label="Tên"
              value={parking.name}
              onChange={handleNameChange}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          spacing={15}
          sx={{ paddingTop: "5px" }}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={parking.isOvernight}
                  onChange={handleCheckboxOvernightChange}
                />
              }
              label="Gửi xe qua đêm"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontWeight: "bold",
                  fontSize: 17,
                },
              }}
            />
          </Grid>
          <Grid item sx={{ marginLeft: "33px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={parking.isPrepayment}
                  onChange={handleCheckboxPrePaymentChange}
                />
              }
              label="Có trả trước phí"
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
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Grid item xs={6}>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
              sx={{ padding: "7px" }}
            >
              Mô tả
            </Typography>
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              type="text"
              name="description"
              label="Mô tả"
              color="secondary"
              value={parking.description}
              onChange={handleDescriptionChange}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
              sx={{ padding: "7px" }}
            >
              Địa chỉ
            </Typography>
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              type="text"
              name="address"
              label="Địa chỉ(Số, đường, quận, TP Hô Chí Minh)"
              color="secondary"
              value={parking.address}
              onChange={handleAddressChange}
            />
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={7}
          sx={{ marginTop: "3px", marginLeft: "1px" }}
        >
          {floors?.map((floor, index) => (
            <Grid item xs={2.7} key={index}>
              <FloorCardInput
                index={index}
                setError={setError}
                inputValues={[
                  floor.floor,
                  floor.numSlots,
                  floor.numRow,
                  floor.numCol,
                ]}
                onInputChange={handleInputChange}
                onRemove={handleRemoveFloor}
              />
            </Grid>
          ))}
          {floors.length < 4 && (
            <Grid item sx={{ marginTop: "-2%" }}>
              <AddButton onClick={handleAddFloor} />
            </Grid>
          )}
        </Grid>

        <Grid item>
          <Typography
            color={theme.palette.secondary.dark}
            variant="subtitle1"
            sx={{ padding: "7px" }}
          >
            Chọn hình ảnh
          </Typography>
          <UploadImageParking
            imageList={imageList}
            setImageList={setImageList}
          />
        </Grid>

        <div style={{ marginLeft: "89%", marginTop: "-1%" }}>
          <NextButton onClick={handleContinue} />
        </div>
      </MainCard>
    </>
  );
};

export default CreateNewParking;
