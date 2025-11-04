import { useEffect, useState } from "react";
import axios from "axios";
import FolderIcon from "../assets/FolderIcon.png";
import CloseIcon from "../assets/CloseIcon.svg";
import { BoxUpload, ImagePreview } from "../upload-staff/style";
import Spinner from "ui-component/back-drop/Spinner";
import config from "config";

const UploadAvatar = (props) => {
  const { avatar } = props;
  const [image, setImage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;

  useEffect(() => {
    if (avatar) {
      setImage(avatar);
      setIsUploaded(true);
    }
  }, [avatar]);

  async function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();

      reader.onload = async function (e) {
        setImage(e.target.result);
        setIsUploaded(true);
        const blob = await fetch(e.target.result).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "filename.png");
        setLoading(true);
        await axios
          .post(`${apiUrl}/upload-image`, formData)
          .then((response) => {
            // console.log("link hình mặt trước", response.data.link);
            setLoading(false);
          });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  if (loading) {
    return (
      <>
        <BoxUpload>
          <Spinner />
        </BoxUpload>
      </>
    );
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
                  width={"70px"}
                  height={"70px"}
                />
                <p style={{ color: "#444" }}>Tải ảnh lên</p>
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
              {avatar ? (
                <></>
              ) : (
                <img
                  className="close-icon"
                  src={CloseIcon}
                  alt="CloseIcon"
                  onClick={() => {
                    setIsUploaded(false);
                    setImage(null);
                  }}
                  style={{ top: "-6px", right: "-2px" }}
                />
              )}
              <div
                style={{
                  width: "160px",
                  height: "140px",
                  objectFit: "cover",
                }}
              >
                <img
                  src={image}
                  alt="uploaded-img"
                  width={"100%"}
                  style={{ borderRadius: "20px", height: "100%" }}
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
export default UploadAvatar;
