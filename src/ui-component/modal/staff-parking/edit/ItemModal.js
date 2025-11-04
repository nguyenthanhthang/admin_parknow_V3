import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TextareaAutosize from "@mui/base/TextareaAutosize";
// import UploadFileImage from "./UploadFileImage";
import CancelButton from "ui-component/buttons/cancel-button/CancelButton";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import Swal from "sweetalert2";
import UploadFileImage from "./UploadFileImage";
import config from "config";

const ItemModal = (props) => {
  const { setIsOpen, setLength, approveParkingId } = props;
  const theme = useTheme();
  // const [note, setNote] = useState("");
  const defaultData = {
    note: "",
    images: [],
  };
  const [data, setData] = useState(defaultData);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenStaff");

  const fetchData = async () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    };

    const response = await fetch(
      `${apiUrl}/request/approve-parkings/approve-parking-detail/${approveParkingId}`,
      requestOptions
    );

    const data = await response.json();
    if (data.data) {
      setData(data.data);
      setImageList(data.data.images);
      setLoading(false);
    } else {
      Swal.fire({
        icon: "error",
        text: data.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeNote = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      note: value,
    }));
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSave = async (e) => {
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
        const imageUrls = await handleUploadAllImage();
        const body = {
          note: data.note,
          images: imageUrls,
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(
          `${apiUrl}/request/approve-parkings/parking`,
          requestOptions
        );
        const dataRes = await response.json();
        if (dataRes.data) {
          localStorage.setItem("newApproveId", dataRes.data);
          Swal.fire({
            icon: "success",
            text: "Đơn tạo thành công!",
          }).then((result) => {
            if (result.isConfirmed) {
              setImageList([]);
              // setNote("");
              setIsOpen(false);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: data.message + "!Vui lòng thử lại!",
          });
        }
      }
    });
  };

  const handleUploadAllImage = () => {
    return new Promise((resolve, reject) => {
      const uploadPromises = imageList
        .filter((file) => !file.url)
        .map((file, index) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file.originFileObj, file.name);
            // axios
            //   .post(`${apiUrl}/upload-image`, formData)
            //   .then((response) => {
            //     const { data } = response;
            //     resolve(data.link);
            //   })
            //   .catch((error) => {
            //     console.log("Error uploading image:", error);
            //     reject(error);
            //   });
          });
        });

      // Promise.all(uploadPromises)
      //   .then((imageUrls) => {
      //     resolve(imageUrls); // resolve the Promise with the array of image URLs
      //   })
      //   .catch((error) => {
      //     console.log("Error uploading images:", error);
      //     reject(error); // reject the Promise
      //   });
    });
  };

  return (
    <>
      <Typography
        sx={{ textAlign: "center", paddingBottom: "17px" }}
        color={theme.palette.primary.dark}
        variant="h2"
      >
        Tạo yêu cầu xác thực
      </Typography>
      <Grid item>
        <Typography
          color={theme.palette.common.dark}
          variant="h3"
          sx={{ paddingBottom: "7px" }}
        >
          Ghi chú
        </Typography>
        <TextareaAutosize
          minRows={2}
          value={data.note}
          onChange={handleChangeNote}
          placeholder="Nhập ghi chú"
          maxLength={255}
          style={{
            border: "1px solid gray",
            borderRadius: "5px",
            width: "96%",
            height: "90px",
            maxHeight: "120px",
            minHeight: "70px",
            fontSize: "15px",
            padding: "6px",
          }}
        />
      </Grid>

      <Grid item>
        <Typography
          color={theme.palette.common.dark}
          variant="h3"
          sx={{ padding: "20px 0 10px 0" }}
        >
          Hình ảnh và chừng từ liên quan
        </Typography>
      </Grid>
      <Grid item>
        <UploadFileImage
          imageList={imageList}
          setImageList={setImageList}
          setLength={setLength}
          images={data.images}
        />
      </Grid>

      <Grid
        item
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={3}
        sx={{ paddingTop: "30px" }}
      >
        <Grid item>
          <CancelButton onClick={handleCancel} />
        </Grid>
        <Grid item>
          <SaveButton onClick={handleSave} />
        </Grid>
      </Grid>
    </>
  );
};

export default ItemModal;
