import { useState } from "react";
import axios from "axios";
// import { CloudinaryContext, Image } from "cloudinary-react";
import "./UploadFront.scss";
import { BoxUpload, ImagePreview } from "./style";
import FolderIcon from "./assets/FolderIcon.png";
import CloseIcon from "./assets/CloseIcon.svg";
import config from "config";

const UploadBackSide = () => {
  const [image, setImage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  // const clientId = "053414b7c8fa0c7";
  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();

      reader.onload = async function (e) {
        setImage(e.target.result);
        setIsUploaded(true);
        const blob = await fetch(e.target.result).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "filename.png");
        console.log(formData);
        axios
          .post(`${config.apiUrl}/upload-image`, formData)
          .then((response) => {
            console.log("link hinh mặt sau", response.data.link);
          });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <>
      <BoxUpload>
        <div className="image-upload">
          {!isUploaded ? (
            <>
              <label htmlFor="upload-input">
                <img
                  src={FolderIcon}
                  draggable={"false"}
                  alt="placeholder"
                  width={"100px"}
                  height={"100px"}
                />
                <p style={{ color: "#444" }}>Tải ảnh mặt sau</p>
              </label>
              <input
                id="upload-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
            </>
          ) : (
            <ImagePreview>
              <img
                className="close-icon"
                src={CloseIcon}
                alt="CloseIcon"
                onClick={() => {
                  setIsUploaded(false);
                  setImage(null);
                }}
              />
              <div
                style={{
                  width: "220px",
                  height: "200px",
                  objectFit: "cover",
                }}
              >
                <img
                  src={image}
                  alt="uploaded-img"
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "20px" }}
                  draggable={false}
                />
              </div>
            </ImagePreview>
          )}
        </div>
      </BoxUpload>
    </>
  );
};
export default UploadBackSide;
