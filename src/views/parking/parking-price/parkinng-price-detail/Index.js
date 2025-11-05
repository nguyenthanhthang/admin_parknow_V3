import React, { useEffect, useState, useCallback } from "react";
import ParkingPriceDetail from "./ParkingPriceDetail";
import { useParams } from "react-router";
import * as signalR from "@microsoft/signalr";
import config from "config";

const PriceDetail = () => {
  const { priceId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
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
      `${apiUrl}/timeline-management/${priceId}?pageNo=1&pageSize=11`,
      requestOptions
    );

    const data = await res.json();
    console.log("data", data.data);

    setRows(data.data);
    setLoading(false);
  }, [apiUrl, token, priceId]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl)
      .build();
    console.log("connection", connection);

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadTimelineInManager", () => {
      fetchDataPrice();
    });

    fetchDataPrice();

    return () => {
      connection.stop();
    };
  }, [fetchDataPrice, signalRUrl]);

  return (
    <>
      <ParkingPriceDetail rows={rows} loading={loading} />
    </>
  );
};

export default PriceDetail;
