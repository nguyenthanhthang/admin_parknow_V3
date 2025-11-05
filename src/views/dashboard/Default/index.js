import { useEffect, useState, useCallback } from "react";

// material-ui
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project imports
import { gridSpacing } from "store/constant";
import AppWidgetSummary from "ui-component/charts/AppWidgetSummary";
import LineChart from "ui-component/charts/LineChart";
import PieDoneCancel from "ui-component/charts/PieDoneCancel";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();

  const [isLoading, setLoading] = useState(true);
  const [totalAccount, setTotalAccount] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [user, setUser] = useState([]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

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
      `${apiUrl}/admin/chart/business/total`,
      requestOptions
    );
    const dataTotal = await response.json();
    if (dataTotal) {
      setTotalAccount(dataTotal.data);
    }

    const responseCus = await fetch(
      `${apiUrl}/admin/chart/customer/total`,
      requestOptions
    );
    const dataCus = await responseCus.json();
    if (dataCus) {
      setUser(dataCus.data);
    }

    const responseRevenue = await fetch(
      `${apiUrl}/admin/chart/line/bill/month-revenue`,
      requestOptions
    );
    const dataRevenue = await responseRevenue.json();
    if (dataRevenue) {
      setRevenueData(dataRevenue.data);
    }

    setLoading(false);
  }, [apiUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} lg={4} sm={6} md={3}>
        <AppWidgetSummary
          title="Tổng tài khoản doanh nghiệp"
          total={totalAccount?.numberOfBusinessAccount}
          icon={"ic:sharp-business-center"}
        />
      </Grid>

      <Grid item xs={12} lg={4} sm={6} md={3}>
        <AppWidgetSummary
          title="Tổng tài khoản dùng app"
          total={totalAccount?.numberOfAccountUsingApp}
          color="info"
          icon={"mdi:account-circle"}
        />
      </Grid>

      <Grid item xs={12} lg={4} sm={6} md={3}>
        <AppWidgetSummary
          title="Bãi xe đang hoạt động"
          total={totalAccount?.numberOfParkingActive}
          color="warning"
          icon={"mingcute:parking-fill"}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <LineChart
          title="Doanh thu"
          subheader="Theo tháng"
          chartData={revenueData}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <PieDoneCancel
          title="Người dùng"
          chartData={[
            {
              label: "Khách hàng",
              value: user?.numberOfCustomer,
            },
            {
              label: "Doanh nghiệp",
              value: totalAccount?.numberOfBusinessAccount,
            },
            // { label: "Europe", value: 1443 },
            {
              label: "Bảo vệ",
              value:
                totalAccount?.numberOfAccountUsingApp - user?.numberOfCustomer,
            },
          ]}
          chartColors={[
            theme.palette.primary.main,
            theme.palette.info.main,
            // theme.palette.warning.main,
            theme.palette.error.main,
          ]}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
