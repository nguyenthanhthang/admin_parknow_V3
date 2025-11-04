import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Grid, useMediaQuery } from "@mui/material";

import Personal from "ui-component/profile/personal/Personal";
import "./Profile.scss";
import Business from "ui-component/profile/business/Business";
import { useParams } from "react-router";
import ParkingAll from "views/parking/all-parking-business/Index";
import Swal from "sweetalert2";
import { useEffect } from "react";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Profile() {
  const { businessId } = useParams();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const [value, setValue] = useState(0);
  // console.log("businessId", businessId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("tokenAdmin");
  const apiUrl = config.apiUrl;

  const fetchData = React.useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/business-profile/business-profile/${businessId}`,
      requestOptions
    );

    const data = await response.json();

    if (data) {
      setData(data.data);
      setLoading(false);
    } else {
      Swal.fire({
        icon: "error",
        text: data.message,
      });
    }
  }, [apiUrl, token, businessId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <Grid
      container
      direction="row"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "10px",
        height: "90%",
      }}
    >
      <Typography
        color={theme.palette.secondary.main}
        gutterBottom
        variant={matchDownSM ? "h3" : "h2"}
        sx={{ padding: "1%" }}
      >
        Hồ sơ doanh nghiệp
      </Typography>
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
      >
        <AppBar
          position="static"
          sx={{
            borderRadius: "10px",
            backgroundColor: "background.paper",
            boxShadow: "none",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            //   textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              color: "#00000",
              backgroundColor: "#ffff",
              fontSize: "20px",
              borderRadius: "10px",
            }}
          >
            <Tab
              label="Thông tin doanh nghiệp"
              {...a11yProps(0)}
              // sx={{ borderRight: "1px solid grey" }}
            />
            {/* <Tab label="Doanh nghiệp" {...a11yProps(1)} /> */}
            <Tab label="Bãi xe" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          style={{}}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Personal businessId={businessId} data={data} />
          </TabPanel>
          {/* <TabPanel value={value} index={1} dir={theme.direction}>
            <Business businessId={businessId} />
          </TabPanel> */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ParkingAll businessId={businessId} />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </Grid>
  );
}
