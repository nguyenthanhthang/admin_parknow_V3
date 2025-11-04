import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import { Chip, Skeleton, Typography } from "@mui/material";
import Loading from "ui-component/back-drop/Loading";
import { ImFilesEmpty } from "react-icons/im";
import config from "config";

const getCellValue = (params) => {
  return params.value ? params.value : "-------";
};

const renderCellStatus = (value) => {
  if (value === "Chờ_Thanh_Toán") {
    return (
      <Chip
        color="error"
        label={value}
        sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
      />
    );
  } else {
    return (
      <Chip
        color="success"
        label={value}
        sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
};

const formatDate = (time) => {
  if (time && time.length >= 10) {
    return time.slice(0, 10);
  }
  return "-------";
};

const formatPrice = (number) => {
  const formattedNumber = number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedNumber;
};

const columns = [
  { field: "billId", headerName: "ID", width: 100 },
  {
    field: "price",
    headerName: "Số tiền",
    width: 260,
    renderCell: (params) =>
      params.row.price ? formatPrice(params.row.price) : "-----",
    sortable: false,
  },
  {
    field: "businessId",
    headerName: "Mã doanh nghiệp",
    width: 200,
    valueGetter: (params) => `${params.row.businessName || ""}`,
  },
  {
    field: "businessName",
    headerName: "Tên doanh nghiệp",
    description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 400,
    valueGetter: (params) => `${params.row.businessName || ""}`,
  },
  {
    field: "time",
    headerName: "Ngày thanh toán",
    width: 320,
    valueGetter: (params) => formatDate(params.row.time),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 200,
    valueGetter: getCellValue,
    renderCell: (params) => renderCellStatus(params.row.status),
    sortable: false,
    disableColumnMenu: true,
  },
];

export default function Order() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const dataGridRef = useRef(null);

  useEffect(() => {
    if (dataGridRef.current) {
      // get the height of the DataGrid using the ref
      const height = dataGridRef.current.clientHeight;
      // set the height of the outer div to be the same as the DataGrid height
      document.getElementById("outer-div").style.height = `${height}px`;
    }
  }, [rows]);

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  useEffect(() => {
    fetchData();
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
      `${apiUrl}/bill-management?pageNo=1&pageSize=11`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  };

  if (loading) {
    // Render the Skeleton components or any other loading indicator
    return (
      <>
        <MainCard title={"Tất cả hóa đơn"}>
          <div style={{ height: "500px", width: "100%" }}>
            {/* Render the Skeleton components for the data grid */}
            <Skeleton animation="wave" height={400} />
          </div>
        </MainCard>
        <Loading loading={loading} />
      </>
    );
  }

  return (
    <>
      <MainCard title={"Tất cả hóa đơn"}>
        {rows ? (
          <div id="outer-div">
            <DataGrid
              rows={rows}
              rowHeight={70}
              autoHeight
              getRowId={(row) => row.billId}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              style={{ paddingTop: "12px" }}
            />
          </div>
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
    </>
  );
}
