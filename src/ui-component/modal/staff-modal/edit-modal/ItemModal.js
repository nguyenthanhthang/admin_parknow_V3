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
import UploadAvatar from "ui-component/upload-file/upload-staff/UploadAvatar";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "store/modalReducer";
import Swal from "sweetalert2";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const ItemModal = ({ modalType }) => {
  const theme = useTheme();

  const staffId = useSelector((state) => state.modal.staffId);

  const dispatch = useDispatch();

  const defaultData = {
    name: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    avatar: "",
  };

  const [data, setData] = useState(defaultData);
  const [avatar, setAvatar] = useState("");
  const edit = true;
  const [loading, setLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

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
    setLoading(true);
    if (staffId) {
      const response = await fetch(
        `${apiUrl}/staff-account-management/${staffId}`,
        requestOptions
      );

      const responseData = await response.json();
      if (responseData) {
        setData(responseData.data);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (avatar) {
      setData((prevData) => ({
        ...prevData,
        avatar: avatar,
      }));

      setIsDataChanged(true);
    }
  }, [avatar]);

  const handleInputPhone = (event) => {
    const { value } = event.target;
    const phoneNumber = value.replace(/\D/g, ""); // Remove non-digit characters

    if (phoneNumber.length > 0 && phoneNumber[0] === "0") {
      setData((prevData) => ({
        ...prevData,
        phone: phoneNumber.substring(0, 10),
      }));
      setIsDataChanged(true);
    }
  };

  const handleDateOfBirthChange = (event) => {
    const { value } = event.target;
    // Check if the value is non-empty before setting it in the state
    const newDateOfBirth = value || ""; // If value is falsy, set it to an empty string

    setData((prevData) => ({
      ...prevData,
      dateOfBirth: newDateOfBirth,
    }));

    setIsDataChanged(true);
  };

  const handleChangeName = (event) => {
    const { value } = event.target;
    setData((prevData) => ({
      ...prevData,
      name: value,
    }));
    setIsDataChanged(true);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setData((prevData) => ({
      ...prevData,
      gender: value,
    }));
    setIsDataChanged(true);
  };

  const handleCloseModal = () => {
    dispatch(closeModal(modalType));
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSubmit = async () => {
    if (!isDataChanged) {
      dispatch(closeModal(modalType)); // Close modal if no changes
      return;
    }
    if (data.avatar.length === 0) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng tải hình đại diện!",
      });
    }

    const age = calculateAge(data.dateOfBirth);
    if (age < 18) {
      Swal.fire({
        icon: "warning",
        text: "Bạn phải ít nhất 18 tuổi để đăng ký nhân viên.",
      });
      return;
    }

    if (
      data.name.length === 0 ||
      data.email.length === 0 ||
      data.phone.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng điền tất cả các ô dữ liệu!",
      });
    }

    if (!data.dateOfBirth) {
      // Check if dateOfBirth is empty
      Swal.fire({
        icon: "warning",
        text: "Vui lòng chọn ngày sinh!",
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

        try {
          const response = await fetch(`${apiUrl}/staff-account-management`, {
            ...requestOptions,
            method: "PUT",
            body: JSON.stringify(data),
          });
          // const dataRes = await response.json();
          if (response.status === 204) {
            handleCloseModal();
            Swal.fire({
              icon: "success",
              text: "Cập nhật thông tin nhân viên thành công!",
            });
          } else {
            Swal.fire({
              icon: "error",
              text: response.message,
            });
          }
        } catch (error) {
          // Handle network errors here
          console.error("Error:", error);
        }
      }
    });
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <Grid
        item
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Typography variant="h2" color={theme.palette.primary.main}>
          Chỉnh sửa nhân viên
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
              Tên nhân viên
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              label="Nhân viên"
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
              Ngày-tháng-năm sinh
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="date"
              value={data.dateOfBirth.substring(0, 10)}
              onChange={handleDateOfBirthChange}
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
              Email
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={data.email}
              InputProps={{
                readOnly: true,
              }}
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
              Số điện thoại
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="text"
              label="Số điện thoại"
              value={data.phone}
              onChange={handleInputPhone}
              InputProps={{
                readOnly: true,
              }}
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
              Giới tính
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.gender}
                label="gender"
                onChange={handleChange}
                defaultValue={data.gender}
              >
                <MenuItem fullWidth value="Nam" sx={{ width: "100%" }}>
                  Nam
                </MenuItem>
                <br />
                <MenuItem fullWidth value="Nữ" sx={{ width: "100%" }}>
                  Nữ
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
              Ảnh đại diện
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <UploadAvatar
              avatar={data.avatar}
              setAvatar={setAvatar}
              edit={edit}
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
          <Grid item>
            <SaveButton onClick={handleSubmit} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
