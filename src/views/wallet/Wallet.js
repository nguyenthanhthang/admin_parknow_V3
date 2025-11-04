import { Grid } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import Loading from "ui-component/back-drop/Loading";
// import RechargeButton from "ui-component/buttons/recharge-button/RechargeButton";
import MainCard from "ui-component/cards/MainCard";
import Balance from "ui-component/cards/Wallet/Balance/Balance";
import Debt from "ui-component/cards/Wallet/Debt/Debt";
import config from "config";

const Wallet = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const fetchData = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    };
    setLoading(true);
    const response = await fetch(`${apiUrl}/admin-wallet`, requestOptions);
    const data = await response.json();
    setData(data.data);
    setLoading(false);
  }, [apiUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    <Loading loading={loading} />;
  }

  return (
    <>
      <MainCard title="Ví của bạn">
        {/* <Grid
          container
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <RechargeButton onClick={handleOpenModal} />
        </Grid> */}
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          padding={5}
        >
          <Grid item xs={3}>
            <Balance data={data} />
          </Grid>
          <Grid item xs={3}>
            <Debt data={data} />
          </Grid>
        </Grid>
      </MainCard>

      {/* <RechargeModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
};

export default Wallet;
