import React, { useEffect, useState, useCallback } from "react";
import Loading from "ui-component/back-drop/Loading";
import * as signalR from "@microsoft/signalr";
import MyRequestedParking from "./MyRequestedParking";
import config from "config";

const RequestedParking = (props) => {
  // const { businessId } = props;
  // console.log("businessId", businessId);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const signalRUrl = config.signalRUrl;
  const token = localStorage.getItem("tokenStaff");
  // const staff = localStorage.getItem("staff"); // Set the authentication status here
  // const staffData = JSON.parse(staff);

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/request/approve-parkings/new-parkings/do-not-have-approve?PageNo=1&PageSize=11`,
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
      <MyRequestedParking rows={rows} />
    </>
  );
};

export default RequestedParking;
