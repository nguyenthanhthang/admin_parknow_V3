// import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";
import Swal from "sweetalert2";
import config from "config";

const getParentContainer = () => document.querySelector(".MuiModal-root");

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UploadFileImage = (props) => {
  const { imageList, setImageList, setLength, images, fetchData } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewOpen(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenStaff");

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
  const handleChange = ({ fileList: newFileList }) => {
    const uploadedFiles = imageList.filter((file) => file.url || file.preview);
    const newFiles = newFileList.filter((file) => !file.url && !file.preview);

    Promise.all(
      newFiles.map(async (file) => {
        const base64 = await getBase64(file.originFileObj).then(
          (result) => result?.split(",")[1]
        );

        return { ...file, base64 };
      })
    ).then((newFileListWithBase64) => {
      const updatedFileList = [
        ...uploadedFiles,
        ...newFileListWithBase64.filter((file) => file.base64 !== null),
      ];

      // Update the status of each file in the updatedFileList
      const updatedFileListWithStatus = updatedFileList.map((file) => {
        if (file.status === "uploading" || file.status === "error") {
          // If the file is still uploading, set its status to "done"
          return { ...file, status: "done" };
        } else {
          // Otherwise, leave the status unchanged
          return file;
        }
      });

      setImageList(updatedFileListWithStatus);
    });
  };

  useEffect(() => {
    const changeHeight = () => {
      if (imageList?.length >= 4) {
        setLength(true);
      }
    };

    changeHeight();
  }, [imageList]);

  const handleRemove = async (file) => {
    if (file.url && images.some((img) => img.url === file.url)) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hình ảnh sẽ bị mất khi xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token}`,
            },
          };
          // Make a DELETE request to the API endpoint with the image URL as a parameter
          const response = await fetch(
            `${apiUrl}/field-work-parking-img/${file.fieldWorkParkingImgId}`,
            requestOptions
          );

          if (response.status === 204) {
            setImageList(imageList.filter((image) => image.uid !== file.uid));
            fetchData();
          } else {
            Swal.fire({
              icon: "error",
              text: response.message,
            });
          }
        } catch (error) {
          console.error("Error removing image:", error);
        }
      }
    } else {
      // If it's an image from imageList, remove it normally
      const index = imageList.indexOf(file);
      const newFileList = imageList.slice();
      newFileList.splice(index, 1);
      setImageList(newFileList);
    }
  };

  const uploadButton = (
    <div>
      <LuUpload style={{ fontSize: "20px", marginLeft: "25px" }} />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh lên
      </div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        onPreview={handlePreview}
        onChange={handleChange}
        fileList={imageList}
        onRemove={handleRemove}
        multiple
      >
        {imageList?.length >= 6 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        getContainer={getParentContainer}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default UploadFileImage;
