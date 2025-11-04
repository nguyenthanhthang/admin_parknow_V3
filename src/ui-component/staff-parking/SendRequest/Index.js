import React, { useEffect } from "react";
import { useState } from "react";
import Loading from "ui-component/back-drop/Loading";
import * as signalR from "@microsoft/signalr";
import SendRequest from "./SendRequest";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CreateButton from "ui-component/buttons/create-button/CreateButton";
import CreateModal from "ui-component/modal/staff-parking/create/CreateModal";
import config from "config";

const AllSendRequest = (props) => {
  const { parkingId, setIsDone, setApproveId } = props;
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const apiUrl = config.apiUrl;
  const signalRUrl = config.signalRUrl;
  const token = localStorage.getItem("tokenStaff");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`, // Replace `token` with your actual bearer token
      "Content-Type": "application/json", // Replace with the appropriate content type
    },
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/request/approve-parkings/parking-profile/${parkingId}`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  };

  const hasPendingRows = rows?.some(
    (row) => row.status === "Đã_duyệt" || row.status === "Chờ_duyệt"
  );

  const hasCreateNewApprove = rows?.some((row) => row.status === "Tạo_mới");

  useEffect(() => {
    if (hasPendingRows) {
      setIsDone(true);
    }

    if (hasCreateNewApprove) {
      setApproveId(
        rows.find((row) => row.status === "Tạo_mới").approveParkingId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginTop={10}
      >
        <Grid item>
          <Typography color={theme.palette.primary.main} variant="h2">
            Danh sách thông tin gửi duyệt
          </Typography>
        </Grid>
        {!hasPendingRows && !hasCreateNewApprove ? (
          <Grid item>
            <CreateButton onClick={handleOpenModal} />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <SendRequest rows={rows} />

      <CreateModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetchData={fetchData}
      />
    </>
  );
};

export default AllSendRequest;
