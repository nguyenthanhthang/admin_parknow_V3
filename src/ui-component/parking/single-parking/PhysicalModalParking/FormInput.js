/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, OutlinedInput, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setNumCarColumns, setNumCarRows } from "store/parkingModalSlice";
import Swal from "sweetalert2";

const FormInput = ({ floorIndex }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // const storedParkingModal = localStorage.getItem("parkingModalState");
  // const parsedParkingModal = JSON.parse(storedParkingModal);

  // const initialParkingModal = parsedParkingModal ? parsedParkingModal : {};
  // console.log("initialParkingModal", initialParkingModal);

  // const { numCarRows, numCarCols, carSlots } = useSelector(
  //   (state) => state.parkingModal[floorIndex]
  // );
  const data = useSelector((state) => state.parkingModal[floorIndex]);
  console.log("data", data);

  //   console.log("carSlots", carSlots.row);

  const handleNumCarRowsChange = (e) => {
    const newNumCarRows = Number(e.target.value);

    // console.log("largestCarRow", largestCarRow);

    // Ensure the new number of car rows is greater than or equal to 1
    if (newNumCarRows < 1) {
      return;
    }

    // if (newNumCarRows < numCarRows) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Sai giá trị",
    //     text: "Số hàng xe hơi không thể nhỏ hơn và đè lên vị trí",
    //   });
    //   return;
    // }

    // Check if the new number of car rows exceeds the number of car slots

    // localStorage.setItem("parkingModalState", {
    //   ...initialParkingModal[floorIndex],
    //   numCarRows: newNumCarRows,
    // });
  };

  const handleNumCarColumnsChange = (e) => {
    const newNumCarColumns = Number(e.target.value);

    // if (newNumCarColumns < numCarCols) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Sai giá trị",
    //     text: "Số cột xe hơi không thể nhỏ hơn và bị mất vị trí",
    //   });
    //   return;
    // }

    // Ensure the new number of car rows is greater than or equal to 1
    if (newNumCarColumns < 1) {
      return;
    }
    // Check if the new number of car rows exceeds the number of car slot

    // localStorage.setItem("parkingModalState", {
    //   ...initialParkingModal[floorIndex],
    //   numCarCols: newNumCarColumns,
    // });
  };

  // const saveParkingModalState = () => {
  //   const updatedParkingModal = {
  //     ...initialParkingModal,
  //     [floorIndex]: {
  //       floor: floorIndex,
  //       numCarRows,
  //       numCarCols,
  //     },
  //   };
  //   // Store the updatedParkingModal in localStorage
  //   localStorage.setItem(
  //     "parkingModalState",
  //     JSON.stringify(updatedParkingModal)
  //   );
  // };

  // useEffect(() => {
  //   saveParkingModalState();
  // }, [floorIndex, numCarRows, numCarCols]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ padding: "20px" }}
      >
        <Grid>
          <label>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
            >
              Hàng xe hơi:
            </Typography>
            <OutlinedInput
              type="number"
              // value={numCarRows}
              onChange={handleNumCarRowsChange}
            />
          </label>
        </Grid>
        <Grid>
          <label>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
            >
              Cột xe hơi:
            </Typography>
            <OutlinedInput
              type="number"
              // value={numCarCols}
              onChange={handleNumCarColumnsChange}
            />
          </label>
        </Grid>
      </Grid>
    </>
  );
};

export default FormInput;
