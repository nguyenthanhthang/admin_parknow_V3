import React, { useEffect, useState } from "react";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CountTime = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeRemaining]);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleHello() {
    console.log("Hello world");
  }

  return (
    <div>
      <div>
        {timeRemaining <= 0 ? (
          <Typography
            component="a"
            href="#"
            color={theme.palette.secondary.dark}
            variant={matchDownSM ? "subtitle2" : "subtitle2"}
            onClick={handleHello}
          >
            Gửi lại
          </Typography>
        ) : (
          <Typography
            color={theme.palette.secondary.dark}
            variant={matchDownSM ? "subtitle2" : "subtitle2"}
          >
            Gửi lại({formatTime(timeRemaining)}s)
          </Typography>
        )}
      </div>
    </div>
  );
};

export default CountTime;
