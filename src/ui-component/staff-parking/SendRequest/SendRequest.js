import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Typography } from "@mui/material";
import { ImFilesEmpty } from "react-icons/im";
import Menu from "./Menu";

export default function SendRequest(props) {
  const { rows } = props;

  const renderCellStatus = (params) => {
    if (params.row.status === "Chờ_duyệt") {
      return (
        <Chip
          color="secondary"
          label="Chờ_duyệt"
          sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
        />
      );
    } else if (params.row.status === "Đã_duyệt") {
      return (
        <Chip
          color="success"
          label="Đã_duyệt"
          sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
    if (params.row.status === "Tạo_mới") {
      return (
        <Chip
          color="primary"
          label="Tạo_mới"
          sx={{ padding: "7px", color: "#fff", fontWeight: "bold" }}
        />
      );
    } else {
      return (
        <Chip
          color="error"
          label="Từ_chối"
          sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
  };

  const formatDate = (createdDate) => {
    if (createdDate && createdDate.length >= 10) {
      return createdDate.slice(0, 10);
    }
    return "-------";
  };

  const columns = [
    { field: "approveParkingId", headerName: "ID", width: 70 },
    {
      field: "staffId",
      headerName: "Mã nhân viên",
      //   description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 100,
      //   valueGetter: (params) => `${params.row.name || ""}`,
    },
    { field: "staffName", headerName: "Tên nhân viên", width: 350 },
    { field: "note", headerName: "Phản hồi", width: 350 },
    {
      field: "createdDate",
      headerName: "Ngày gửi",
      width: 300,
      valueGetter: (params) => formatDate(params.row.createdDate),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 170,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderCellStatus,
    },
    {
      field: "action",
      headerName: "",
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        !["Chờ_duyệt", "Đã_duyệt"].includes(params.row.status) ? (
          <Menu approveParkingId={params.id} />
        ) : (
          <></>
        ),
    },
  ];

  return (
    <>
      {rows ? (
        <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
          <DataGrid
            rows={rows}
            rowHeight={70}
            getRowId={(row) => row.approveParkingId}
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
            sx={{ textAlign: "center", marginTop: "8%" }}
          >
            Chưa yêu cầu nào được gửi
          </Typography>
          <ImFilesEmpty
            style={{ fontSize: "150px", marginTop: "5%", marginLeft: "46%" }}
          />
        </>
      )}
    </>
  );
}
