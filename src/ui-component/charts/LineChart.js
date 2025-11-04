import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Card, CardHeader, Box } from "@mui/material";
import { useChart } from "ui-component/pie-chart";
// components
// import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

LineChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function LineChart({ title, subheader, chartData, ...other }) {
  const formattedData = chartData?.map((item) => {
    const date = new Date(item.date);
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    return {
      x: `${month}-${day}`,
      y: item.revenueOfTheDate,
    };
  });

  // const chartLabels = chartData.map((item) => {
  //   const date = new Date(item.date);
  //   const day = String(date.getDate()).padStart(2, "0").toString(); // Convert day to string
  //   const month = String(date.getMonth() + 1)
  //     .padStart(2, "0")
  //     .toString(); // Convert month to string
  //   return `${day}-${month}`;
  // });

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: "solid" },
    xaxis: {
      type: "datetime",
      // labels: {
      //   datetimeFormatter: {
      //     year: "short",
      //     month: "numeric",
      //     day: "numeric",
      //   },
      // },
      // categories: chartLabels, // Assign chartLabels to categories
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={[{ data: formattedData }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
