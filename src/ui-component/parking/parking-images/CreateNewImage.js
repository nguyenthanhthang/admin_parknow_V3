import { Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useTheme } from "@mui/material/styles";
import MainCard from "ui-component/cards/MainCard";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const CreateNewImage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const theme = useTheme();

  const handleFiles = (event) => {
    const fileList = event.target.files;
    displayImages(fileList);
  };

  function handleImageChange() {
    const uploadPromises = selectedFiles.map(async (file) => {
      return new Promise((resolve) => {
        let reader = new FileReader();

        reader.onload = async function (e) {
          const image = e.target.result;
          const blob = await fetch(image).then((res) => res.blob());
          const formData = new FormData();
          formData.append("file", blob, file.name);

          axios
            .post(
              `${config.apiUrl}/upload-image`,
              formData
            )
            .then((response) => {
              setLoading(true);
              const imageUrl = response.data.link;
              console.log(`Uploaded image: ${imageUrl}`);
              resolve();

              // Call the API to store the link
              //   axios
              //     .post("https://example.com/store-image", { imageUrl })
              //     .then((storeResponse) => {
              //       console.log("Stored image link:", storeResponse.data);
              //       resolve();
              //     })
              //     .catch((storeError) => {
              //       console.log("Error storing image link:", storeError);
              //       resolve();
              //     });
            })
            .catch((error) => {
              console.log("Error uploading image:", error);
              resolve();
            });
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises).then(() => {
      setLoading(false);
      console.log("All images uploaded");
    });
  }

  const handleDragOver = (event) => {
    event.preventDefault();
    dropZoneRef.current.classList.add("border-blue-500");
    dropZoneRef.current.classList.add("text-blue-500");
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dropZoneRef.current.classList.remove("border-blue-500");
    dropZoneRef.current.classList.remove("text-blue-500");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    displayImages(fileList);
    dropZoneRef.current.classList.remove("border-blue-500");
    dropZoneRef.current.classList.remove("text-blue-500");
  };

  const displayImages = (fileList) => {
    setSelectedFiles([...selectedFiles, ...fileList]);
  };

  const removeImage = (index) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((_, i) => i !== index)
    );
    setSelectedImageIndex(null);
  };

  const updateSelectedFilesCount = () => {
    const count = selectedFiles.length;
    return count > 0 ? `${count} ảnh${count === 1 ? "" : "s"} được chọn` : "";
  };

  const dropZoneRef = useRef();

  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const handleSave = () => {
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
        const uploadPromises = selectedFiles.map(async (file) => {
          return new Promise((resolve) => {
            let reader = new FileReader();

            reader.onload = async function (e) {
              const image = e.target.result;
              const blob = await fetch(image).then((res) => res.blob());
              const formData = new FormData();
              formData.append("file", blob, file.name);

              axios
                .post(
                  `${config.apiUrl}/upload-image`,
                  formData
                )
                .then((response) => {
                  const imageUrl = response.data.link;
                  console.log(`Uploaded image: ${imageUrl}`);
                  resolve();
                })
                .catch((error) => {
                  console.log("Error uploading image:", error);
                  resolve();
                });
            };

            reader.readAsDataURL(file);
          });
        });

        Promise.all(uploadPromises).then(() => {
          setLoading(false);
          Swal.fire({
            title: "Thành công!",
            text: "Trạng thái cập nhật thành công.",
            icon: "success",
            customClass: {
              container: "swal-custom", // Apply the custom class to the Swal container
            },
          });
        });
      }
    });
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <MainCard title="Thêm mới ảnh cho bãi xe">
      <div className="p-4">
        <label className="mb-2 font-medium flex justify-between items-center">
          <Typography color={theme.palette.secondary.main} variant="h3">
            Chọn ảnh
          </Typography>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
            onClick={() => fileInputRef.current.click()}
          >
            Chọn
          </button>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <div className="flex mb-4 flex-col">
          <div
            ref={dropZoneRef}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center text-gray-400 text-lg"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span>Kéo hoặc thả hình ảnh tại đây</span>
          </div>
          <div className="text-gray-500 text-sm font-medium">
            {updateSelectedFilesCount()}
          </div>
          <div className="flex flex-wrap -mx-2 mt-6">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative mx-2 mb-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-40 h-40 object-cover rounded-lg cursor-pointer"
                  onClick={() => openModal(index)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-6 w-6 bg-gray-700 text-white text-xs rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
                >
                  <AiFillCloseCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end items-center">
          {selectedFiles.length > 0 && <SaveButton onClick={handleSave} />}
        </div>
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="max-w-full max-h-full overflow-auto">
              <img
                src={URL.createObjectURL(selectedFiles[selectedImageIndex])}
                alt={`Preview ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </MainCard>
  );
};

export default CreateNewImage;
