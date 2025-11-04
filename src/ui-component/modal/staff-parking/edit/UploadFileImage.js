import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";

const getParentContainer = () => document.querySelector(".MuiModal-root");

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadFileImage = (props) => {
  const { imageList, setImageList, setLength, images } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // const [defaultImageList, setDefaultImageList] = useState([]);

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
        if (file.status === "uploading") {
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

  const handleRemove = async (file) => {
    if (file.url && images.some((img) => img.url === file.url)) {
      // If it's an image from props, remove it with API method DELETE
      try {
        // Make a DELETE request to the API endpoint with the image URL as a parameter
        // await fetch(`/api/images?filename=${encodeURIComponent(file.url)}`, {
        //   method: "DELETE",
        // });
      } catch (error) {
        console.error("Error removing image:", error);
      }
    } else {
      // If it's an image from imageList, remove it normally
      const index = imageList.indexOf(file);
      const newFileList = imageList.slice();
      newFileList.splice(index, 1);
      setImageList(newFileList);
    }
  };

  useEffect(() => {
    const changeHeight = () => {
      if (imageList?.length >= 5) {
        setLength(true);
      }
    };

    changeHeight();
  }, [imageList]);

  const uploadButton = (
    <div>
      <LuUpload
        style={{
          fontSize: "20px",
          marginLeft: "20px",
        }}
      />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={imageList} // Use imageList instead of defaultImageList
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        multiple
      >
        {/* {images?.map((url, index) => (
          <div key={index}>
            <img src={url} alt="" style={{ width: "100%" }} />
          </div>
        ))} */}
        {imageList?.length >= 6 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        getContainer={getParentContainer}
        zIndex={10000}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadFileImage;
