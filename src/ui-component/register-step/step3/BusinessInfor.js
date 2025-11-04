/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useTheme } from "@mui/material/styles";
// import UploadBusinessLicense from "ui-component/upload-file/UploadBusinessLicense";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep, setUserData } from "store/stepReducer";
import BackButtonRegister from "ui-component/buttons/back-button/BackButtonRegister";
import ContinueButton from "ui-component/buttons/continue-button-register/ContinueButton";
import UploadBusinessLicense from "ui-component/upload-file-antd/UploadBusinessLicense";
import Swal from "sweetalert2";
import axios from "axios";
import { data } from "autoprefixer";
import config from "config";

const BusinessInfor = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.multiStep.currentStep);
  const userData = useSelector((state) => state.multiStep.userData);
  const [isChecked, setIsChecked] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [businessLicenseUrl, setBusinessLicenseUrl] = useState([]);

  const [errorBusinessName, setErrorBusinessName] = useState(false);

  const apiUrl = config.apiUrl;

  const requestBody = {
    userEntity: {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      avatar: userData.avatar,
    },
    businessProfileEntity: {
      name: userData.businessName,
      address: userData.address,
      frontIdentification: userData.frontSide,
      backIdentification: userData.backSide,
      businessLicense: userData.businessLicenseUrl
        ? userData.businessLicenseUrl
        : null,
    },
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (
      userData.businessName === undefined ||
      userData.address === undefined ||
      isAgree === false
    ) {
      Swal.fire({
        icon: "warning",
        title: "Điền tất cả ô nhập",
        text: "Bạn phải nhập thông tin và đồng ý các chính sách",
      });
    } else if (isChecked === false) {
      if (userData.businessLicenseUrl.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Vui lòng cập nhật hình ảnh giấy phép kinh doanh!",
        });
        return;
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Đang gửi yêu cầu...",
        text: "Vui lòng chờ trong giây lát!",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (businessLicenseUrl.length !== 0) {
        const url = await uploadBusinessLicenseImage();

        dispatch({ ...userData, businessLicenseUrl: url });
      }

      fetch(
        `${apiUrl}/business-manager-authentication/register`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Yêu cầu của bạn đã được gửi đi",
            showConfirmButton: false,
          });
          Swal.close();
          dispatch(setCurrentStep(currentStep + 1));
        })
        .catch((error) => {
          // Handle any errors
          Swal.close();
          Swal.fire({
            icon: "error",
            text: data.message,
          });
          console.error(error);
        });
    }
  };

  const uploadBusinessLicenseImage = () => {
    return new Promise((resolve, reject) => {
      const file = businessLicenseUrl[0]; // Assuming there is only one file
      const formData = new FormData();
      formData.append("file", file.originFileObj, file.name);

      axios
        .post(`${apiUrl}/upload-image`, formData)
        .then((response) => {
          const { data } = response;
          resolve(data.link);
        })
        .catch((error) => {
          console.log("Error uploading image:", error);
          reject(error);
        });
    });
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleInputBusinessName = (event) => {
    const { value } = event.target;

    const startsWithSpace = /^\s/.test(value);

    if (startsWithSpace) {
      setErrorBusinessName(true);
      return;
    } else {
      setErrorBusinessName(false);
      dispatch(setUserData({ ...userData, businessName: value }));
    }
  };

  const handleInputAddress = (event) => {
    const { value } = event.target;

    const startsWithSpace = /^\s/.test(value);

    if (startsWithSpace) {
      setErrorBusinessName(true);
      return;
    } else {
      setErrorBusinessName(false);
      dispatch(setUserData({ ...userData, address: value }));
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      marginTop="2%"
    >
      <Grid item xs={12}>
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1}
          marginBottom="8%"
        >
          <Typography
            color={theme.palette.secondary.main}
            gutterBottom
            variant={matchDownSM ? "h2" : "h1"}
          >
            Thông tin doanh nghiệp
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack xs={12} justifyContent="center" spacing={1}>
          <Typography
            color={theme.palette.secondary.dark}
            gutterBottom
            variant={matchDownSM ? "h5" : "h4"}
          >
            Tên doanh nghiệp
          </Typography>
          <TextField
            fullWidth
            required
            sx={{ width: "500px" }}
            type="text"
            name="businessName"
            label="Tên doanh nghiệp"
            color="secondary"
            onChange={handleInputBusinessName}
            value={userData["businessName"]}
            error={errorBusinessName}
            helperText={
              errorBusinessName ? "Không nhập bát đầu bàng khoảng trắng" : ""
            }
          />
        </Stack>
        <Stack spacing={1}>
          <Typography
            color={theme.palette.secondary.dark}
            gutterBottom
            variant={matchDownSM ? "h5" : "h4"}
            marginTop="5%"
          >
            Địa chỉ văn phòng(Optional)
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            value={userData["address"]}
            rows={3}
            type="text"
            name="address"
            onChange={handleInputAddress}
            error={errorBusinessName}
            helperText={
              errorBusinessName ? "Không nhập bát đầu bàng khoảng trắng" : ""
            }
            label="Địa chỉ(Số, đường, quận, TP Hô Chí Minh)"
            color="secondary"
          />
        </Stack>

        <Grid
          item
          container
          style={{ marginTop: "1%", marginLeft: "-6px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1}>
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </Grid>
          <Grid item xs={11}>
            <Typography
              color={theme.palette.secondary.dark}
              gutterBottom
              variant={matchDownSM ? "h6" : "h5"}
              marginTop="2%"
            >
              Hộ kinh doanh gia đình
            </Typography>
          </Grid>
        </Grid>

        <Stack
          spacing={1}
          sx={{
            background: isChecked ? "lightgray" : "none",
          }}
        >
          <Typography
            color={theme.palette.secondary.dark}
            gutterBottom
            variant={matchDownSM ? "h5" : "h4"}
            marginTop="2%"
          >
            Giấy phép kinh doanh
          </Typography>
          <UploadBusinessLicense
            businessLicenseUrl={businessLicenseUrl}
            setBusinessLicenseUrl={setBusinessLicenseUrl}
            isChecked={isChecked}
          />
        </Stack>

        <Grid
          item
          container
          style={{ marginTop: "5%" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={0.8}>
            <Checkbox
              checked={isAgree}
              onChange={(e) => setIsAgree(e.target.checked)}
            />
          </Grid>
          <Grid item xs={11}>
            <Typography
              color={theme.palette.secondary.dark}
              gutterBottom
              variant={matchDownSM ? "h6" : "h5"}
              marginTop="2%"
            >
              Tôi đã đọc và đồng ý với <a href="#">chính sách phí</a> và{" "}
              <a href="#">hợp đồng cung cấp dịch vụ</a>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={4}
        >
          <Grid item xs={6}>
            <BackButtonRegister width="100%" onClick={handleBack} />
          </Grid>
          <Grid item xs={6}>
            <ContinueButton width="100%" onClick={handleNext} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BusinessInfor;
