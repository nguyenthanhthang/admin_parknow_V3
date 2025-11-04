import React, { useState, useEffect } from "react";
import { Tabs, Tab, Grid } from "@mui/material";
import ParkingModal from "./ParkingModal";
import { useDispatch, useSelector } from "react-redux";
import { initializeFloors } from "store/parkingModalSlice";
import { loadState, saveState } from "utils/localStorageParkingModal";
import SaveButton from "ui-component/buttons/save-button/SaveButton";

const ParkingModalInFloor = () => {
  const [currentFloor, setCurrentFloor] = useState(0);

  const dispatch = useDispatch();
  const [floors, setFloors] = useState(() => {
    const initialState = [
      {
        floor: 1,
        numCarSlots: 10,
        numMotorbikeSlots: 5,
        numMotorbikeRows: 1,
        numMotorbikeColumns: 6,
        numCarRows: 2,
        numCarColumns: 6,
        carSlots: [],
        motorbikeSlots: [],
      },
      {
        floor: 2,
        numCarSlots: 15,
        numMotorbikeSlots: 8,
        numMotorbikeRows: 2,
        numMotorbikeColumns: 6,
        numCarRows: 3,
        numCarColumns: 6,
        carSlots: [],
        motorbikeSlots: [],
      },
      {
        floor: 3,
        numCarSlots: 20,
        numMotorbikeSlots: 10,
        numMotorbikeRows: 2,
        numMotorbikeColumns: 6,
        numCarRows: 3,
        numCarColumns: 7,
        carSlots: [],
        motorbikeSlots: [],
      },
    ];
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

  const data = useSelector((state) => state.parkingModal);

  const handleSave = () => {
    data.forEach((floor) => {
      console.log("floor", floor);
      floor.carSlots.forEach((slot) => {
        const body = {
          name: slot.name,
          rowIndex: slot.row,
          columnIndex: slot.column,
          trafficId: slot.trafficId,
          floorId: floor.floor,
        };
        return body;
      });
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
        {floors.map((floor, index) => (
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
