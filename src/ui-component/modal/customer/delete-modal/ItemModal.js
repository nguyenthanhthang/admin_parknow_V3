import { Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useState } from "react";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import UploadAvatar from "ui-component/upload-file/customer/UploadAvatar";
import Swal from "sweetalert2";
import Loading from "ui-component/back-drop/Loading";
import EnableButton from "ui-component/buttons/enable-button/EnableButton";
import User from "../../../../assets/images/avatar.png";
import ActiveButton from "../../../buttons/active-button/ActiveButton";
import config from "config";

const ItemModal = (props) => {
  const { setIsOpenDelete, id, value } = props;
  const theme = useTheme();
  // const staffId = useSelector((state) => state.modal.staffId);

  // const dispatch = useDispatch();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

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
      `${apiUrl}/accounts/customer/${id}`,
      requestOptions
    );

    const data = await response.json();
    if (data) {
      setData(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setIsOpenDelete(false);
  };

  const handleDeleteStaff = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Xác nhận?",
      text: value
        ? "Bạn có chắc chắn muốn vô hiệu hóa người dùng này!"
        : "Bạn có chắc chắn muốn kích hoạt người dùng này!",
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

        const requestOps = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Replace with the appropriate content type
          },
        };

        const response = await fetch(`${apiUrl}/accounts/${id}`, requestOps);
        if (response.status === 204) {
          setIsOpenDelete(false);
          Swal.fire({
            icon: "success",
            text: value ? "Vô hiệu hóa thành công!" : "Kích hoạt thành công!",
          });
          return response.json();
        } else {
          Swal.fire({
            icon: "error",
            text: response.message,
          });
          throw new Error("Request failed");
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
          Vô hiệu hóa người dùng
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
              Tên người dùng
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
              SĐT
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
            <UploadAvatar avatar={data?.avatar ? data?.avatar : User} />
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
          {value ? (
            <Grid item>
              <EnableButton onClick={handleDeleteStaff} />
            </Grid>
          ) : (
            <Grid item>
              <ActiveButton onClick={handleDeleteStaff} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
