import * as React from "react";
import { useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Chip, Grid, Switch, Typography } from "@mui/material";
import Menu from "ui-component/parking/parking-all/Menu";
import Swal from "sweetalert2";
import { ImFilesEmpty } from "react-icons/im";
import SubCard from "ui-component/cards/SubCard";
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

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("token");

  const getCellValue = (params) => {
    if (!params || params.value === null || params.value === undefined) {
      return "-------";
    }
    return params.value;
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
    if (!params || !params.row) {
      return null;
    }
    const handleChange = () => {
      handleSwitchToggle(params, "isActive");
    };

    return (
      <Switch checked={params.value} onChange={handleChange} color="primary" />
    );
  };

  const renderCellStatus = (params) => {
    if (!params) {
      return null;
    }
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
    {
      field: "parkingId",
      headerName: "ID",
      width: 80,
      valueFormatter: (value) => {
        return value || "-------";
      },
      renderCell: (params) => {
        if (!params || !params.row) {
          return <div>-------</div>;
        }
        const id = params.row?.parkingId || params.value || "-------";
        return <div>{id}</div>;
      },
    },
    {
      field: "name",
      headerName: "Tên bãi",
      description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 280,
      valueFormatter: (value) => {
        return value || "-------";
      },
      renderCell: (params) => {
        if (!params || !params.row) {
          return <div>-------</div>;
        }
        const name = params.row?.name || params.value || "-------";
        return <div>{name}</div>;
      },
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 400,
      valueFormatter: (value) => {
        return value || "-------";
      },
      renderCell: (params) => {
        if (!params || !params.row) {
          return <div>-------</div>;
        }
        const address = params.row?.address || params.value || "-------";
        return <div>{address}</div>;
      },
    },
    {
      field: "carSpot",
      headerName: "Tổng số vị trí",
      // type: "number",
      width: 210,
      valueFormatter: (value) => {
        return value !== null && value !== undefined ? value : "-------";
      },
      renderCell: (params) => {
        if (!params || !params.row) {
          return <div>-------</div>;
        }
        const carSpot = params.row?.carSpot !== null && params.row?.carSpot !== undefined 
          ? params.row.carSpot 
          : (params.value !== null && params.value !== undefined ? params.value : "-------");
        return <div>{carSpot}</div>;
      },
    },
    {
      field: "isFull",
      headerName: "Tình trạng",
      width: 190,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderCellStatus,
    },
    {
      field: "isActive",
      headerName: "Hoạt động",
      width: 190,
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
      align: "center",
      renderCell: (params) => {
        if (!params || !params.row) {
          return null;
        }
        return <Menu value={params.value} id={params.id} />;
      },
    },
  ];

  return (
    <>
      <MainCard title={"Tất cả bãi"}>
        <Grid item xs={12}>
          <SubCard>
            <SearchSection />
          </SubCard>
        </Grid>

        {rows && Array.isArray(rows) && rows.length > 0 ? (
          <div id="outer-div">
            <DataGrid
              rows={rows.filter((row) => row && (row.parkingId || row.id))} // Filter out null/undefined rows
              rowHeight={70}
              autoHeight
              getRowId={(row) => {
                if (!row) return `row-${Math.random()}`;
                return row.parkingId || row.id || `row-${Math.random()}`;
              }}
              columns={columns}
              disableRowSelectionOnClick
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
      </MainCard>
    </>
  );
}
