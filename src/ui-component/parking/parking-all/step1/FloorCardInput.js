import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const FloorCardInput = (props) => {
  const { index, inputValues, onInputChange, onRemove, setError } = props;
  const theme = useTheme();
  const [values, setValues] = useState(inputValues);

  const handleInputChange = (event, inputIndex) => {
    const newValue = Number(event.target.value);

    if (inputIndex === 0) {
      onInputChange(index, inputIndex + 1, `Tầng ${index + 1}`);
    }

    const newValues = [...values];
    newValues[inputIndex] = newValue;
    setValues(newValues);
    onInputChange(index, inputIndex + 1, newValue);
  };

  useEffect(() => {
    if (values[2] > values[1]) {
      setError(true);
      Swal.fire({
        icon: "error",
        text: "Số hàng không được vượt quá số vị trí",
      }).then(() => {
        // Clear the input value for the row field
        const newValues = [...values];
        newValues[2] = 0;
        setValues(newValues);
      });
    } else {
      setError(false);
    }

    if (values[3] > values[1]) {
      setError(true);
      Swal.fire({
        icon: "error",
        text: "Số cột không được vượt quá số vị trí",
      }).then(() => {
        // Clear the input value for the column field
        const newValues = [...values];
        newValues[3] = 0;
        setValues(newValues);
      });
    } else {
      setError(false);
    }

    // if (
    //   values[1] &&
    //   values[2] &&
    //   values[3] &&
    //   values[1] > values[2] * values[3]
    // ) {
    //   setError(true);
    //   Swal.fire({
    //     icon: "error",
    //     text: "Tích số cột và hàng không thể nhỏ hơn số vị trí! Vui lòng kiểm tra lại",
    //   });
    // }
  }, [values]);

  const handleReset = () => {
    setValues(inputValues);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        spacing={2}
        sx={{
          border: "1px dashed gray",
          borderRadius: "7px",
          padding: "0px 0px 30px 5px",
          marginBottom: "15px",
        }}
      >
        <Grid item>
          <Typography color={theme.palette.secondary.dark} variant="h3">
            Tầng {index + 1}
          </Typography>
        </Grid>
        {index !== 0 && (
          <Grid item sx={{ marginLeft: "auto", marginTop: "-52px" }}>
            <IconButton onClick={() => onRemove(index)}>
              <CloseIcon
                sx={{
                  background: "#262525",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </IconButton>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Số vị trí
          </Typography>
          <TextField
            type="number"
            fullWidth
            inputProps={{ min: 0 }} // Set min value to 0
            value={values[1]}
            onChange={(event) => handleInputChange(event, 1)}
            onBlur={handleReset}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Số hàng
          </Typography>
          <TextField
            type="number"
            fullWidth
            inputProps={{ min: 0 }} // Set min value to 0
            value={values[2]}
            onChange={(event) => handleInputChange(event, 2)}
            onBlur={handleReset}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Số cột
          </Typography>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0 }} // Set min value to 0
            value={values[3]}
            onChange={(event) => handleInputChange(event, 3)}
            onBlur={handleReset}
          />
        </Grid>
      </Grid>
    </>
  );
};

FloorCardInput.propTypes = {
  index: PropTypes.number.isRequired,
  inputValues: PropTypes.arrayOf(PropTypes.any).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FloorCardInput;
