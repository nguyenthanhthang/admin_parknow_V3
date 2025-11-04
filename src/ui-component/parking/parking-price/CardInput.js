import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, TextField, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const CardInput = (props) => {
  const {
    index,
    inputValues,
    onInputChange,
    onRemove,
    isExtraFree,
    isWholeDay,
  } = props;
  const [values, setValues] = useState(inputValues);

  const theme = useTheme();

  const handleInputChange = (event, inputIndex) => {
    let newValue = event.target.value;

    if (inputIndex === 1 || inputIndex === 2) {
      newValue = formatTime(newValue);
    }

    const newValues = [...values];
    newValues[inputIndex] = newValue;
    setValues(newValues);
    onInputChange(index, inputIndex + 1, newValue);
  };

  useEffect(() => {
    if (values[1] && values[2] && values[1] >= values[2]) {
      let errorFieldName = "";
      if (values[1] >= values[2]) {
        errorFieldName = "end time";
      } else {
        errorFieldName = "start time";
      }
      Swal.fire({
        icon: "error",
        text: `Thời gian bắt đầu phải nhỏ hơn kết thúc! Vui lòng kiểm tra lại.`,
      }).then(() => {
        // clear the input value for the time field that caused the error
        const newValues = [...values];
        if (errorFieldName === "start time") {
          newValues[1] = "";
        } else {
          newValues[2] = "";
        }
        setValues(newValues);
      });
      return;
    }
  }, [values]);

  const handleReset = () => {
    setValues(inputValues);
  };

  const formatTime = (timeString) => {
    const date = new Date();
    const [hours] = timeString.split(":");
    date.setHours(hours);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
            Khung giờ {index + 1}
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
            Giá cước
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: 0 }} // Set min value to 0
            value={values[0]}
            onChange={(event) => handleInputChange(event, 0)}
            onBlur={handleReset}
            sx={{ width: "180%" }}
          />
        </Grid>
        <Grid item container direction="row" spacing={9}>
          <Grid item>
            <Typography color={theme.palette.common.black} variant="subtitle1">
              Từ
            </Typography>
            <TextField
              type="time" // Change type to "number"
              value={values[1]}
              disabled={!isExtraFree || isWholeDay}
              onChange={(event) => handleInputChange(event, 1)}
              sx={
                !isExtraFree || isWholeDay
                  ? { width: "120%", opacity: 0.5 }
                  : { width: "120%" }
              }
              InputProps={{
                inputProps: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography color={theme.palette.common.black} variant="subtitle1">
              Đến
            </Typography>
            <TextField
              type="time"
              value={values[2]}
              disabled={!isExtraFree || isWholeDay}
              onChange={(event) => handleInputChange(event, 2)}
              sx={
                !isExtraFree || isWholeDay
                  ? { width: "120%", opacity: 0.5 }
                  : { width: "120%" }
              }
              InputProps={{
                inputProps: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Typography color={theme.palette.common.black} variant="subtitle1">
            Giá phụ phí
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: 0 }} // Set min value to 0
            value={values[3]}
            disabled={!isExtraFree}
            onChange={(event) => handleInputChange(event, 3)}
            onBlur={handleReset}
            sx={
              !isExtraFree ? { width: "180%", opacity: 0.5 } : { width: "180%" }
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

CardInput.propTypes = {
  index: PropTypes.number.isRequired,
  inputValues: PropTypes.arrayOf(PropTypes.any).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CardInput;
