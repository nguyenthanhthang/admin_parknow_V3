import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Switch, Typography } from "@mui/material";
import Menu from "ui-component/parking/parking-all/Menu";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router";
import { ImFilesEmpty } from "react-icons/im";
import { useRef } from "react";
import { useEffect } from "react";
import config from "config";

export default function MyParkingAll(props) {
  const { rows } = props;
  const dataGridRef = useRef(null);

  useEffect(() => {
    if (dataGridRef.current) {
      // get the height of the DataGrid using the ref
      const height = dataGridRef.current.clientHeight;
      // set the height of the outer div to be the same as the DataGrid height
      document.getElementById("outer-div").style.height = `${height}px`;
    }
  }, [rows]);
  // const navigate = useNavigate();

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");

  const getCellValue = (params) => {
    return params.value == null ? false : params.value;
  };

  const handleSwitchToggle = async (params, field) => {
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn thay đổi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (field === "isActive") {
            const requestOptions = {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            };
            const response = await fetch(
              `${apiUrl}/parkings/parking/${params.id}`,
              requestOptions
            );
            if (response.status === 204) {
              Swal.fire({
                icon: "success",
                text: "Cập nhật trạng thái thành công!",
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Cập nhật trạng thái thất bạij!",
              });
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const renderCellIsActive = (params) => {
    const handleChange = () => {
      handleSwitchToggle(params, "isActive");
    };

    return (
      <Switch checked={params.value} onChange={handleChange} color="primary" />
    );
  };

  const renderCellStatus = (params) => {
    if (params.value === true) {
      return (
        <Chip
          color="success"
          label="Đầy"
          sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
        />
      );
    } else {
      return (
        <Chip
          color="secondary"
          label="Còn trống"
          sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
  };
  const columns = [
    { field: "parkingId", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Tên bãi",
      description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 250,
      valueGetter: (params) => `${params.row.name || ""}`,
    },
    { field: "address", headerName: "Địa chỉ", width: 400 },
    {
      field: "carSpot",
      headerName: "Vị trí ô tô",
      // type: "number",
      width: 210,
      valueGetter: getCellValue,
    },
    {
      field: "isFull",
      headerName: "Tình trạng",
      width: 210,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderCellStatus,
    },
    {
      field: "isActive",
      headerName: "Hoạt động",
      width: 210,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderCellIsActive,
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Menu
          id={params.id}
          approveParkingStatus={params.approveParkingStatus}
        />
      ),
    },
  ];

  return (
    <>
      {rows ? (
        <div id="outer-div" style={{ marginTop: "10px" }}>
          <DataGrid
            rows={rows}
            rowHeight={70}
            autoHeight
            getRowId={(row) => row.parkingId}
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
