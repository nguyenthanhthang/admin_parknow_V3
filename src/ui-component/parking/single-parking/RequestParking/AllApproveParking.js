import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Switch, Typography } from "@mui/material";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router";
import { ImFilesEmpty } from "react-icons/im";
import Menu from "ui-component/parking-pending/Menu";

export default function AllApproveParking(props) {
  const { rows, id } = props;

  const renderCellStatus = (params) => {
    if (params.value === "Chờ_duyệt") {
      return (
        <Chip
          color="primary"
          label="Chờ_duyệt"
          sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
        />
      );
    } else {
      return (
        <Chip
          color="success"
          label="Đã_duyệt"
          sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
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
        params.status === "Chờ_duyệt" ? (
          <Menu id={params.id} parkingId={id} />
        ) : (
          <></>
        ),
    },
  ];

  return (
    <>
      {rows ? (
        <div style={{ height: "400px", width: "100%", marginTop: "10px" }}>
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
            sx={{ textAlign: "center", marginTop: "15%" }}
          >
            Không tìm thấy dữ liệu
          </Typography>
          <ImFilesEmpty
            style={{ fontSize: "150px", marginTop: "5%", marginLeft: "46%" }}
          />
        </>
      )}
    </>
  );
}
