import React, { useEffect } from "react";
import { useState } from "react";
import Loading from "ui-component/back-drop/Loading";
import * as signalR from "@microsoft/signalr";
// import MyParkingPending from "./ParkingPending";
import { useParams } from "react-router";
import AllApproveParking from "./AllApproveParking";
import config from "config";

const ApproveParking = () => {
  const { id } = useParams();
  // console.log("businessId", businessId);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  useEffect(() => {
    fetchData();
  }, []);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/approve-parkings/all-field-information/${id}`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <AllApproveParking rows={rows} id={id} />
    </>
  );
};

export default ApproveParking;
