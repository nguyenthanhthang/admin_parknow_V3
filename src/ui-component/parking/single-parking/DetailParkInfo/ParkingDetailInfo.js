import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import LeftItem from "./LeftItem";
import RightItem from "./RightItem";
import { useNavigate, useParams } from "react-router";
import Loading from "ui-component/back-drop/Loading";
import Swal from "sweetalert2";
import config from "config";

const ParkingDetailInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/parkings/${id}`, requestOptions);

    const data = await response.json();
    if (data.data) {
      setData(data.data.parkingEntity);
      setLoading(false);
    } else {
      // setLoading(false);
      Swal.fire({
        icon: "error",
        text: data.message,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/parkings");
        }
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        spacing={5}
        sx={{ padding: "10px", marginLeft: "2px" }}
      >
        <Grid item xs={6}>
          <LeftItem data={data} />
        </Grid>
        <Grid item xs={6}>
          <RightItem data={data} />
        </Grid>
      </Grid>
    </>
  );
};

export default ParkingDetailInfo;
