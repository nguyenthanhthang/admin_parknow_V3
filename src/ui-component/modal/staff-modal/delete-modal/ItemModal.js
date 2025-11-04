import { Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState, useCallback } from "react";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import UploadAvatar from "ui-component/upload-file/upload-staff/UploadAvatar";
import DeleteButton from "ui-component/buttons/delete-button/DeleteButton";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "store/modalReducer";
import Swal from "sweetalert2";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const ItemModal = ({ modalType }) => {
  const theme = useTheme();
  const staffId = useSelector((state) => state.modal.staffId);

  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/staff-account-management/${staffId}`,
      requestOptions
    );

    const data = await response.json();
    if (data) {
      setData(data.data);
    }
    setLoading(false);
  }, [apiUrl, token, staffId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCloseModal = () => {
    dispatch(closeModal(modalType));
  };

  const handleDeleteStaff = (e) => {
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

        const requestOps = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Replace with the appropriate content type
          },
        };

        fetch(`${apiUrl}/staff-account-management/${staffId}`, requestOps)
          .then((response) => {
            if (response.ok) {
              dispatch(closeModal(modalType));
              Swal.fire({
                icon: "success",
                text: "Xóa nhân viên thành công!",
              });
              return response.json();
            } else {
              Swal.fire({
                icon: "error",
                text: "Xảy ra lỗi khi xóa nhân viên!",
              });
              throw new Error("Request failed");
            }
          })
          .then((data) => {
            // Handle response data
            return data;
          })
          .catch((error) => {
            // Handle error
            console.error(error);
          });
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
          Xóa nhân viên
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
              type="text"
              value={data?.name}
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
              Ngày-tháng-năm sinh
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="date"
              value={data?.dateOfBirth.substring(0, 10)}
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
              Email
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              fullWidth
              type="email"
              value={data?.email}
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
              value={data?.phone}
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
            <TextField
              fullWidth
              value={data?.gender}
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
              Ảnh đại diện
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <UploadAvatar avatar={data?.avatar} />
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
            <DeleteButton onClick={handleDeleteStaff} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
