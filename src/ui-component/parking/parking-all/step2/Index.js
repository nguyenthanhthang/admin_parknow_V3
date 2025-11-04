import React, { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import MapParking from "./MapParking";
import MainCard from "ui-component/cards/MainCard";
import "./Index.scss";
import NextButton from "ui-component/buttons/next-button/NextButton";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import config from "config";

const Maps = () => {
  const [searchResult, setSearchResult] = useState();
  const [markerPosition, setMarkerPosition] = useState(null);

  const formattedLatitude = markerPosition
    ? parseFloat(markerPosition[0]).toFixed(6)
    : null;
  const formattedLongitude = markerPosition
    ? parseFloat(markerPosition[1]).toFixed(6)
    : null;

  const navigate = useNavigate();

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");
  const parkingId = localStorage.getItem("parkingId");

  const handleNextButton = async () => {
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn thay đổi!",
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
      }
      const request = {
        parkingId: parkingId,
        latitude: formattedLatitude,
        longitude: formattedLongitude,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(request),
      };

      try {
        const response = await fetch(
          `${apiUrl}/parkings/parking/location/${parkingId}`,
          requestOptions
        );

        if (response.status === 204) {
          Swal.fire({
            icon: "success",
            text: "Cập nhật vị trí bãi xe thành công",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
              navigate("/modal");
              localStorage.removeItem("address");
            }
          });
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleClickNextButton = () => {
    if (markerPosition) {
      handleNextButton();
    }
  };

  return (
    <>
      <MainCard title="Chọn vị trí bãi xe">
        <div
          style={{
            display: "flex",
            width: "97vw",
            height: "75vh",
            position: "relative",
          }}
        >
          <div style={{ flex: "1", position: "relative" }}>
            <MapParking
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "300px",
              transform: "translateX(-50%)",
              zIndex: 999,
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              padding: "5px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <SearchBox setSearchResult={setSearchResult} />
          </div>
        </div>
      </MainCard>
      {markerPosition && (
        <div
          style={{
            display: "flex",
            marginRight: "20px",
            marginTop: "20px",
            justifyContent: "end",
          }}
        >
          <NextButton onClick={handleClickNextButton} />
        </div>
      )}
    </>
  );
};

export default Maps;
