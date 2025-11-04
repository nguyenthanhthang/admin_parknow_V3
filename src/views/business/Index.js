import React, { useEffect, useState, useCallback } from "react";
import MyBusiness from "./Business";
import * as signalR from "@microsoft/signalr";
import config from "config";

const Business = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const signalRUrl = config.signalRUrl;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/business-profile-management?pageNo=1&pageSize=11`,
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
    console.log("connection", connection);

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadBusinessProfileInAdmin", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop();
    };
  }, [fetchData, signalRUrl]);
  return <MyBusiness rows={rows} loading={loading} />;
};

export default Business;
