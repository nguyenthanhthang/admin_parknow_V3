import { Grid } from "@mui/material";
import { Button, Modal, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import config from "config";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NewImageCustom = ({ setIsOpen }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const { id } = useParams();
  console.log("id", id);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getParentContainer = () => document.querySelector(".MuiModal-root");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleSave = () => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Xác nhận?",
        text: "Bạn có chắc chắn muốn lưu hình ảnh này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác nhận!",
        customClass: {
          container: "swal-custom", // Apply the custom class to the Swal container
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const uploadPromises = fileList.map(async (file) => {
            return new Promise((resolve) => {
              const formData = new FormData();
              formData.append("file", file.originFileObj, file.name);

              axios
                .post(`${apiUrl}/upload-image`, formData)
                .then((response) => {
                  const imageUrl = response.data.link;
                  console.log(`Uploaded image: ${imageUrl}`);
                  resolve(imageUrl);
                })
                .catch((error) => {
                  console.log("Error uploading image:", error);
                  resolve(null);
                });
            });
          });

          Promise.all(uploadPromises).then((imageUrls) => {
            setLoading(false);
            // filter out null values from the imageUrls array
            const filteredImageUrls = imageUrls.filter((url) => url !== null);
            console.log("Image URLs:", filteredImageUrls);

            filteredImageUrls
              .map((url) => {
                const request = {
                  imgPath: url,
                  parkingId: id,
                };
                const requestOptions = {
                  method: "POST",
                  headers: {
                    Authorization: `bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(request),
                };
                fetch(`${apiUrl}/parking-spot-image`, requestOptions)
                  .then((response) => {
                    console.log("Create images response:", response.data);
                    Swal.fire({
                      title: "Thành công!",
                      text: "Tạo mới hình ảnh thành công.",
                      icon: "success",
                      customClass: {
                        container: "swal-custom", // Apply the custom class to the Swal container
                      },
                    });
                    resolve(); // resolve the Promise
                    setIsOpen(false);
                  })
                  .catch((error) => {
                    console.log("Error creating images:", error);
                    Swal.fire({
                      icon: "error",
                      text: error,
                    });
                    reject(error); // reject the Promise
                  });
                return false;
              })
              .catch((error) => {
                setLoading(false);
                console.log("Error uploading images:", error);
                Swal.fire({
                  // ... rest of the function ...
                });
                reject(error); // reject the Promise
              });
          });
        } else {
          reject(); // reject the Promise if the user cancels the upload
        }
      });
    });
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={handlePreview}
      >
        {fileList.length < 5 && "+ Upload"}
      </Upload>

      <Grid
        container
        direction="column"
        justifyContent="end"
        alignItems="center"
      >
        <SaveButton onClick={handleSave} />
      </Grid>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        getContainer={getParentContainer}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default NewImageCustom;
