import { Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "store/modalReducer";
import Loading from "ui-component/back-drop/Loading";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import UploadAvatar from "ui-component/upload-file/upload-staff/UploadAvatar";
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
          Chi tiết nhân viên
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
            <UploadAvatar
              avatar={
                data?.avatar
                  ? data.avatar
                  : "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
              }
            />
          </Grid>
        </Grid>

        <Grid item>
          <CancelButton onClick={handleCloseModal} />
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
