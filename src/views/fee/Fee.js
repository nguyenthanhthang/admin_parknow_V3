import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { ImFilesEmpty } from "react-icons/im";
import CreateButton from "ui-component/buttons/create-button/CreateButton";
import FeeCardBus from "ui-component/cards/Fee/FeeCardBus";
import FeeCardPerson from "ui-component/cards/Fee/FeeCardPerson";
import MainCard from "ui-component/cards/MainCard";
import FeeModal from "ui-component/modal/fee-setting/FeeModal";
import * as signalR from "@microsoft/signalr";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const Fee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);
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
    const response = await fetch(`${apiUrl}/fee-management`, requestOptions);

    const data = await response.json();
    setData(data.data);
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

    connection.on("LoadFee", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop();
    };
  }, [fetchData, signalRUrl]);

  const handleOpenModal = () => {
    setIsOpen(true);
    setEdit(false);
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  console.log("data", data);

  return (
    <>
      <MainCard title="Cước phí">
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ paddingBottom: "30px" }}
        >
          <CreateButton onClick={handleOpenModal} />
        </Grid>
        {data ? (
          <Grid
            container
            direction="row"
            spacing={15}
            justifyContent="center"
            alignItems="center"
            padding={5}
          >
            <Grid item>
              <FeeCardBus
                setEdit={setEdit}
                setIsOpen={setIsOpen}
                bus={data[0]}
                setId={setId}
              />
            </Grid>
            <Grid item sx={{ marginLeft: "10px" }}>
              <FeeCardPerson
                setEdit={setEdit}
                setIsOpen={setIsOpen}
                setId={setId}
                person={data[1]}
              />
            </Grid>
          </Grid>
        ) : (
          <>
            <Typography
              variant="h1"
              color="#21130d"
              sx={{ textAlign: "center", marginTop: "5%" }}
            >
              Không tìm thấy dữ liệu
            </Typography>
            <ImFilesEmpty
              style={{
                fontSize: "150px",
                marginTop: "5%",
                marginLeft: "46%",
              }}
            />
          </>
        )}
      </MainCard>

      <FeeModal isOpen={isOpen} setIsOpen={setIsOpen} edit={edit} id={id} />
    </>
  );
};

export default Fee;
