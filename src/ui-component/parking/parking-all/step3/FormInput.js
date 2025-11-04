import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, OutlinedInput, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setNumCarColumns, setNumCarRows } from "store/parkingModalSlice";
import Swal from "sweetalert2";

const FormInput = ({ floorIndex }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const storedParkingModal = localStorage.getItem("parkingModalState");
  const parsedParkingModal = JSON.parse(storedParkingModal);

  const initialParkingModal = parsedParkingModal ? parsedParkingModal : {};

  const { numCarRows, numCarCols, carSlots } = useSelector(
    (state) => state.parkingModal[floorIndex]
  );

  const handleNumCarRowsChange = (e) => {
    const newNumCarRows = Number(e.target.value);
    const largestCarRow = Math.max(...carSlots.map((slot) => slot.row));

    // Ensure the new number of car rows is greater than or equal to 1
    if (newNumCarRows < 1) {
      return;
    }

    if (newNumCarRows < largestCarRow + 1) {
      Swal.fire({
        icon: "error",
        title: "Sai giá trị",
        text: "Số hàng xe hơi không thể nhỏ hơn và bị mất vị trí",
      });
      return;
    }

    // Check if the new number of car rows exceeds the number of car slots
    if (newNumCarRows > carSlots.length) {
      Swal.fire({
        icon: "error",
        title: "Sai giá trị",
        text: "Số hàng xe hơi không thể lớn hơn số slot xe hơi",
      });
      return;
    }

    dispatch(
      setNumCarRows({
        floorIndex: floorIndex,
        numCarRows: newNumCarRows,
      })
    );
  };

  const handleNumCarColumnsChange = (e) => {
    const newNumCarColumns = Number(e.target.value);
    const largestCarColumn = Math.max(...carSlots.map((slot) => slot.column));

    if (newNumCarColumns < largestCarColumn + 1) {
      Swal.fire({
        icon: "error",
        title: "Sai giá trị",
        text: "Số cột xe hơi không thể nhỏ hơn và bị mất vị trí",
      });
      return;
    }

    // Ensure the new number of car rows is greater than or equal to 1
    if (newNumCarColumns < 1) {
      return;
    }
    // Check if the new number of car rows exceeds the number of car slots
    if (newNumCarColumns > carSlots.length) {
      Swal.fire({
        icon: "error",
        title: "Sai giá trị",
        text: "Số cột xe hơi không thể lớn hơn số slot xe hơi",
      });
      return;
    }

    dispatch(
      setNumCarColumns({
        floorIndex: floorIndex,
        numCarCols: newNumCarColumns,
      })
    );
  };

  const saveParkingModalState = () => {
    const updatedParkingModal = {
      ...initialParkingModal,
      [floorIndex]: {
        floor: floorIndex + 1,
        numCarRows,
        numCarCols,
      },
    };
    // Store the updatedParkingModal in localStorage
    localStorage.setItem(
      "parkingModalState",
      JSON.stringify(updatedParkingModal)
    );
  };

  useEffect(() => {
    saveParkingModalState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorIndex, numCarRows, numCarCols]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ padding: "20px" }}
      >
        <Grid item>
          <label>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
            >
              Hàng xe hơi:
            </Typography>
            <OutlinedInput
              type="number"
              value={numCarRows}
              onChange={handleNumCarRowsChange}
            />
          </label>
        </Grid>
        <Grid item>
          <label>
            <Typography
              color={theme.palette.secondary.dark}
              variant="subtitle1"
            >
              Cột xe hơi:
            </Typography>
            <OutlinedInput
              type="number"
              value={numCarCols}
              onChange={handleNumCarColumnsChange}
            />
          </label>
        </Grid>
      </Grid>
    </>
  );
};

export default FormInput;
