import React, { useEffect, useState, useCallback } from "react";
import MyParkingPrice from "./ParkingPrice";
import * as signalR from "@microsoft/signalr";
import config from "config";

const ParkingPrice = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("tokenAdmin");
  const user = localStorage.getItem("admin"); // Set the authentication status here
  const userData = JSON.parse(user);

  const apiUrl = config.apiUrl;
  const signalRUrl = config.signalRUrl;

  const fetchDataPrice = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const res = await fetch(
      `${apiUrl}/parking-price?ManagerId=${userData}&PageNo=1&PageSize=11`,
      requestOptions
    );

    const data = await res.json();
    console.log("data", data.data);

    setRows(data.data);
    setLoading(false);
  }, [apiUrl, token, userData]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl)
      .build();
    console.log("connection", connection);

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadParkingPrice", () => {
      fetchDataPrice();
    });

    fetchDataPrice();

    return () => {
      connection.stop();
    };
  }, [fetchDataPrice, signalRUrl]);

  return (
    <>
      <MyParkingPrice rows={rows} loading={loading} />
    </>
  );
};

export default ParkingPrice;
