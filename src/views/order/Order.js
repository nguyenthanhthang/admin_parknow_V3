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
  { 
    field: "billId", 
    headerName: "ID", 
    width: 100,
    valueGetter: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.billId || params.row.id || "-------";
    },
    renderCell: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.billId || params.row.id || "-------";
    },
  },
  {
    field: "price",
    headerName: "Số tiền",
    width: 260,
    renderCell: (params) => {
      if (!params || !params.row) return "-----";
      return params.row.price ? formatPrice(params.row.price) : "-----";
    },
    sortable: false,
  },
  {
    field: "businessId",
    headerName: "Mã doanh nghiệp",
    width: 200,
    valueGetter: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.businessId || params.row.id || "-------";
    },
    renderCell: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.businessId || params.row.id || "-------";
    },
  },
  {
    field: "businessName",
    headerName: "Tên doanh nghiệp",
    description: "This column has a value getter and is not sortable.",
    width: 400,
    valueGetter: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.businessName || "-------";
    },
    renderCell: (params) => {
      if (!params || !params.row) return "-------";
      return params.row.businessName || "-------";
    },
  },
  {
    field: "time",
    headerName: "Ngày thanh toán",
    width: 320,
    valueGetter: (params) => {
      if (!params || !params.row) return "-------";
      return formatDate(params.row.time);
    },
    renderCell: (params) => {
      if (!params || !params.row) return "-------";
      return formatDate(params.row.time);
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 200,
    valueGetter: getCellValue,
    renderCell: (params) => {
      if (!params || !params.row) return "-------";
      return renderCellStatus(params.row.status);
    },
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

  const fetchData = React.useCallback(async () => {
    // Kiểm tra token trước khi gọi API
    if (!token) {
      setLoading(false);
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/bill-management?pageNo=1&pageSize=11`,
        requestOptions
      );
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("admin");
        window.location.href = "/login";
        return;
      }

      // Tạm thời bỏ qua lỗi 500 - Internal Server Error
      if (response.status === 500) {
        setRows([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setRows([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Filter out null/undefined rows và đảm bảo có billId
        const validRows = data.data.filter((row) => row && (row.billId || row.id));
        setRows(validRows);
      } else {
        setRows([]);
      }
    } catch (error) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
              getRowId={(row) => row?.billId || row?.id || `row-${Math.random()}`}
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
