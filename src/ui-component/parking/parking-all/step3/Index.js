import React, { useState, useEffect } from "react";
import { Tabs, Tab, Grid } from "@mui/material";
import ParkingModal from "./ParkingModal";
import { useDispatch } from "react-redux";
import { initializeFloors } from "store/parkingModalSlice";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { loadState, saveState } from "utils/ParkingModalLocalStorage";
import config from "config";

const ParkingModalInFloor = () => {
  const [currentFloor, setCurrentFloor] = useState(0);

  const navigate = useNavigate();

  const initialFloorsObj = loadState();

  const initialFloorsArr = Object.values(initialFloorsObj);

  const dispatch = useDispatch();
  const [floors, setFloors] = useState(() => {
    const initialState = initialFloorsArr;
    dispatch(initializeFloors(initialState));
    return initialState;
  });

  useEffect(() => {
    saveState(floors);
  }, [floors]);

  const handleTabChange = (event, newValue) => {
    event.preventDefault();

    setCurrentFloor(newValue);
  };

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");
  const parkingId = localStorage.getItem("parkingId");
  console.log("parkingId", parkingId);

  const handleSave = async () => {
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
        try {
          // Create floors
          const floorIds = [];
          for (const floor of initialFloorsArr) {
            const body = {
              floorName: `Tầng ${floor.floor}`,
              parkingId: parkingId,
            };
            const response = await fetch(`${apiUrl}/floors/floor`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            });
            if (!response.ok) {
              throw new Error("Failed to create floor"); // Throw an error if the response is not OK
            }
            const data = await response.json();

            floorIds.push(data.data);
            console.log("floorIds", floorIds);
          }

          // Create carSlots for each floor
          const promises = [];
          initialFloorsArr.forEach((floor, i) => {
            floor.carSlots.forEach((slot) => {
              const body = {
                name: slot.name,
                isAvailable: true,
                rowIndex: slot.row,
                columnIndex: slot.column,
                trafficId: 1,
                floorId: floorIds[i],
                parkingId: parkingId,
              };
              console.log("body", body);
              const promise = fetch(`${apiUrl}/parkingSlot/create`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
              }).then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to create car slot"); // Throw an error if the response is not OK
                }
                return response.json();
              });
              promises.push(promise);
            });
          });
          const results = await Promise.all(promises);
          console.log("result", results);
          Swal.close();

          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Yêu cầu của bạn đã được gửi! Vui lòng chờ được duyệt!",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/parkings");
              localStorage.removeItem("parkingModalState");
              localStorage.removeItem("parkingId");
            }
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Tạo sa bàn thất bại!",
            text: error.message,
          });
        }
      }
    });
  };

  return (
    <div>
      <Tabs
        value={currentFloor}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="Parking Floors"
      >
        {floors?.map((floor, index) => (
          <Tab key={index} label={`Tầng ${floor.floor}`} />
        ))}
      </Tabs>
      <ParkingModal floorIndex={currentFloor} />
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        xs={11.7}
        sx={{ marginTop: "25px" }}
      >
        <SaveButton onClick={handleSave} />
      </Grid>
    </div>
  );
};

export default ParkingModalInFloor;
