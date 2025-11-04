import React, { useEffect } from "react";
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
import { useState } from "react";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import Swal from "sweetalert2";
import DeleteButton from "ui-component/buttons/delete-button/DeleteButton";
import config from "config";

const ItemModal = (props) => {
  const { setIsOpen, edit, id } = props;
  const theme = useTheme();

  const defaultData = {
    name: "",
    businessType: "",
    price: 0,
    numberOfParking: "",
  };

  const [data, setData] = useState(defaultData);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    const response = await fetch(
      `${apiUrl}/fee-management/${id}`,
      requestOptions
    );

    const data = await response.json();
    setData(data.data);
  };

  useEffect(() => {
    if (edit) {
      fetchData();
    }
  }, []);
  const handleInputPrice = (event) => {
    const { value } = event.target;
    setData((prevData) => ({
      ...prevData,
      price: value,
    }));
  };

  const handleChangeName = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      name: value,
    }));
  };

  const handleChangeNumOfParking = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      numberOfParking: value,
    }));
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      businessType: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      data.name.length === 0 ||
      data.price === 0 ||
      data.numberOfParking.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng nhập tên phí, giá phí và số lượng bãi xe có thể có!",
      });
      return;
    }

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
          name: data.name,
          businessType: data.businessType,
          price: data.price,
          numberOfParking: data.numberOfParking,
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
          `${apiUrl}/fee-management`,
          requestOptions
        );

        const dataRes = await response.json();

        if (dataRes.statusCode === 201) {
          Swal.fire({
            icon: "success",
            text: "Tạo mới cước phí thành công",
          }).then((result) => {
            if (result.isConfirmed) {
              setData((prevData) => ({
                ...prevData,
                name: "",
              }));
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: dataRes.message,
          });
        }

        if (edit) {
          const requestOptionsEdit = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token}`,
            },
            body: JSON.stringify(request),
          };

          const responseEdit = await fetch(
            `${apiUrl}/fee-management`,
            requestOptionsEdit
          );
          if (responseEdit.status === 204) {
            Swal.fire({
              icon: "success",
              text: "Cập nhật dữ liệu thành công!",
            });
          } else {
            Swal.fire({
              icon: "error",
              text: responseEdit.message,
            });
          }
        }
      }
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn xóa!",
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
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        };

        const response = await fetch(
          `${apiUrl}/fee-management/${id}`,
          requestOptions
        );

        if (response.statusCode === 204) {
          Swal.fire({
            icon: "success",
            text: "Xóa cước phí thành công",
          });
        } else {
          Swal.fire({
            icon: "error",
            text: response.message,
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
          {edit ? "Chỉnh sửa phí" : "Tạo mới phí"}
        </Typography>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ marginTop: "3%" }}
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
              Tên phí
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              required
              fullWidth
              label="Tên phí"
              type="text"
              value={data.name}
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
              Loại hinh doanh nghiệp
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Loại hình</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.businessType}
                label="typeBusiness"
                onChange={handleChange}
                defaultValue={data?.businessType}
              >
                <MenuItem fullWidth value="Doanh nghiệp" sx={{ width: "100%" }}>
                  Doanh nghiệp
                </MenuItem>
                <MenuItem fullWidth value="Tư nhân" sx={{ width: "100%" }}>
                  Tư nhân
                </MenuItem>
              </Select>
            </FormControl>
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
              Giá phí
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              required
              label="Giá phí"
              type="number"
              value={data.price}
              inputProps={{
                min: 1,
              }}
              onChange={handleInputPrice}
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
              Số lượng bãi xe
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              required
              label="Số bãi xe"
              type="text"
              value={data.numberOfParking}
              inputProps={{
                maxLength: 100,
              }}
              onChange={handleChangeNumOfParking}
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
        >
          <Grid item>
            <CancelButton onClick={handleCloseModal} />
          </Grid>
          {edit && (
            <Grid item>
              <DeleteButton onClick={handleDelete} />
            </Grid>
          )}
          <Grid item>
            <SaveButton onClick={handleSave} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
