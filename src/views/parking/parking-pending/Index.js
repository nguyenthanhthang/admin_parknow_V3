import React, { useEffect, useState, useCallback } from "react";
import Loading from "ui-component/back-drop/Loading";
import * as signalR from "@microsoft/signalr";
import MyParkingPending from "./ParkingPending";
import config from "config";

const ParkingAll = (props) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const signalRUrl = config.signalRUrl;

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/approve-parkings/request/waiting-accept?PageNo=1&PageSize=11`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  }, [apiUrl, token]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${signalRUrl}`)
      .build();

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadApproveParkingList", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop();
    };
  }, [fetchData, signalRUrl]);

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <MyParkingPending rows={rows} />
    </>
  );
};

export default ParkingAll;
