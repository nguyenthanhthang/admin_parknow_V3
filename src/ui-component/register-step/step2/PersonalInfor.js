import React, { useState } from "react";
import { setCurrentStep, setUserData } from "store/stepReducer";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import ContinueButton from "ui-component/buttons/continue-button-register/ContinueButton";
import BackButtonRegister from "ui-component/buttons/back-button/BackButtonRegister";
import UploadCCCD from "ui-component/upload-file-antd/UploadCCCD";
import UploadAvatar from "ui-component/upload-file-antd/UploadAvatar";
import Swal from "sweetalert2";
import axios from "axios";
import config from "config";

const PersonalInfor = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.multiStep.currentStep);
  const userData = useSelector((state) => state.multiStep.userData);

  const [errorNumberLength, setErrorNumberLength] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [cccdFile, setCccdFile] = useState([]);
  const [avatarFile, setAvatarFile] = useState([]);
  // const [loading, setLoading] = useState(false);

  const apiUpload = config.apiUrl;

  const urlAPICheck = "https://api-uat.unicloud.ai/ekyc/kyc-documents-sides";
  const username = "sst-tester";
  const password = "be0b966de533";
  const data = {
    image1: fileList[0]?.base64,
    name1: "CCCD front",
    image2: fileList[1]?.base64,
    name2: "CCCD back",
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (
      userData.name === undefined ||
      userData.phone === undefined ||
      fileList.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Điền tất cả",
        text: "Bạn phải nhập và tuyền vào tất cả các ô nhập và hình ảnh CCCD",
      });
    } else {
      Swal.fire({
        icon: "question",
        title: "Đang kiểm tra thông tin...",
        text: "Vui lòng chờ trong giây lát!",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch(urlAPICheck, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();

        if (
          responseData.recognized_data.document !== "CMND" &&
          responseData.recognized_data.document !== "CCCD" &&
          responseData.recognized_data.document !== "CHIP ID"
        ) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Hình ảnh CCCD không hợp lệ. Vui lòng kiểm tra lại hoặc chụp lại hình khác rõ hơn.",
          });
        } else {
          const avatarUrl = await handleUploadAvatar();
          const imageUrls = await handleUploadCCCD();

          dispatch(
            setUserData({
              ...userData,
              avatar: avatarUrl.link,
              frontSide: imageUrls[0],
              backSide: imageUrls[1],
            })
          );
          Swal.close();
          dispatch(setCurrentStep(currentStep + 1));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleUploadCCCD = () => {
    return new Promise((resolve, reject) => {
      const uploadPromises = cccdFile.map((file, index) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file.originFileObj, file.name);

          axios
            .post(`${apiUpload}/upload-image`, formData)
            .then((response) => {
              const { data } = response;
              resolve(data.link);
            })
            .catch((error) => {
              console.log("Error uploading image:", error);
              reject(error);
            });
        });
      });

      Promise.all(uploadPromises)
        .then((imageUrls) => {
          resolve(imageUrls); // resolve the Promise with the array of image URLs
        })
        .catch((error) => {
          console.log("Error uploading images:", error);
          reject(error); // reject the Promise
        });
    });
  };

  const handleUploadAvatar = () => {
    return new Promise((resolve, reject) => {
      const file = avatarFile[0]; // Assuming there is only one file
      const formData = new FormData();
      formData.append("file", file.originFileObj, file.name);

      axios
        .post(`${apiUpload}/upload-image`, formData)
        .then((response) => {
          const { data } = response;
          resolve(data);
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

  const handleInputName = (event) => {
    const { value } = event.target;

    const startsWithSpace = /^\s/.test(value);

    if (startsWithSpace) {
      setErrorName(true);
      return;
    } else {
      setErrorName(false);
      dispatch(setUserData({ ...userData, name: value }));
    }
  };

  const handleInputPhone = (event) => {
    const { value } = event.target;
    setErrorNumberLength(value.length < 10 || value.length > 10);
    if (!isNaN(value)) {
      dispatch(setUserData({ ...userData, phone: value }));
    }
  };

  return (
    <>
      <form method="post">
        <Grid container direction="row" alignContent="center">
          <Grid item xs={12} sx={{ marginTop: "2%" }}>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              marginBottom="3%"
            >
              <Typography
                color={theme.palette.secondary.main}
                gutterBottom
                variant={matchDownSM ? "h2" : "h1"}
              >
                Thông tin chủ doanh nghiệp
              </Typography>
            </Stack>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Grid
              item
              container
              direction="column"
              spacing={1}
              xs={5}
              justifyContent="center"
            >
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={5}>
                  <Typography
                    color={theme.palette.secondary.dark}
                    gutterBottom
                    variant={matchDownSM ? "h5" : "h4"}
                    marginBottom="3%"
                  >
                    Họ và tên
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    sx={{ width: "520px" }}
                    type="text"
                    name="name"
                    inputProps={{ maxLength: 100 }}
                    label="Họ và tên"
                    color="secondary"
                    value={userData["name"]}
                    onChange={handleInputName}
                    error={errorName}
                    helperText={
                      errorName ? "Không nhập bắt đâu bàng khoảng trống" : ""
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography
                    color={theme.palette.secondary.dark}
                    gutterBottom
                    variant={matchDownSM ? "h5" : "h4"}
                    marginTop="5%"
                    marginBottom="3%"
                  >
                    Số điện thoại
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    sx={{ width: "520px" }}
                    type="number"
                    maxLength={10}
                    name="phoneNumber"
                    label="Số điện thoại"
                    color="secondary"
                    value={userData["phone"]}
                    onChange={handleInputPhone}
                    error={errorNumberLength}
                    helperText={
                      errorNumberLength && "Số điện thoại không vượt quá 10 số"
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  color={theme.palette.secondary.dark}
                  gutterBottom
                  variant={matchDownSM ? "h5" : "h4"}
                  marginLeft="17%"
                  marginTop="3%"
                >
                  Mặt trước và sau CCCD
                </Typography>
              </Grid>
              <Grid item container direction="row" justifyContent="center">
                <Grid item>
                  <UploadCCCD
                    fileList={fileList}
                    setFileList={setFileList}
                    setCccdFile={setCccdFile}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="baseline"
              xs={5}
              sx={{ marginTop: "-5%" }}
            >
              <Grid item sx={{ marginLeft: "-30%" }}>
                <Typography
                  color={theme.palette.secondary.dark}
                  gutterBottom
                  variant={matchDownSM ? "h5" : "h4"}
                >
                  Ảnh đại diện
                </Typography>
              </Grid>
              <Grid item sx={{ marginRight: "30%" }}>
                <UploadAvatar
                  avatarFile={avatarFile}
                  setAvatarFile={setAvatarFile}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            direction="row"
            spacing={4}
            style={{ marginLeft: "7%", marginTop: "20px" }}
            xs={10}
          >
            <Grid item xs={3}>
              <BackButtonRegister width="100%" onClick={handleBack} />
            </Grid>
            <Grid item xs={3}>
              <ContinueButton width="100%" onClick={handleNext} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default PersonalInfor;
