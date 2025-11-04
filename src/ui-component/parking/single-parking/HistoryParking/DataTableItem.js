import { Avatar, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import Menu from "ui-component/booking/Menu";
import MainCard from "ui-component/cards/MainCard";

const renderAvatarCell = (params) => {
  return <Avatar src={params.value} alt="avatar" />;
};

const getCellValue = (params) => {
  return params.value ? params.value : "-------";
};

const renderCellStatus = (params) => {
  const statusMap = {
    "Khởi tạo": { color: "#fff", bgColor: "gray" },
    "Thành công": { color: "#fff", bgColor: "#4caf50" },
    "Đã duyệt": { color: "#fff", bgColor: "#1976d2" },
    "Vào bãi": { color: "#fff", bgColor: "#f44336" },
    "Ra bãi": { color: "#000", bgColor: "#ff9800" },
    "Chờ thanh toán": { color: "#fff", bgColor: "#2196f3" },
    "Hủy đơn": { color: "#fff", bgColor: "#f44336" },
  };

  const { value } = params;
  const statusStyle = statusMap[value] || {
    color: "inherit",
    bgColor: "gray",
  };

  return (
    <Chip
      label={value}
      sx={{
        backgroundColor: statusStyle.bgColor,
        color: statusStyle.color,
        padding: "5px",
      }}
    />
  );
};

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "avatar",
    headerName: "Ảnh",
    width: 80,
    renderCell: renderAvatarCell,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Tên khách hàng",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 170,
    valueGetter: (params) => `${params.row.name || ""}`,
  },
  { field: "position", headerName: "Vị trí", width: 100 },
  { field: "floor", headerName: "Tầng", width: 120 },
  { field: "startTime", headerName: "Thời gian", width: 100 },
  {
    field: "totalPrice",
    headerName: "Giá",
    // type: "number",
    width: 100,
  },
  { field: "phone", headerName: "Số điện thoại", width: 130 },
  { field: "licensePlate", headerName: "Biển số xe", width: 110 },
  { field: "parkingName", headerName: "Bãi xe", width: 130 },
  {
    field: "checkInTime",
    headerName: "Giờ vào",
    width: 120,
    valueGetter: getCellValue,
  },
  {
    field: "checkOutTime",
    headerName: "Giờ ra",
    width: 120,
    valueGetter: getCellValue,
  },
  {
    field: "paymentMethod",
    headerName: "Thanh toán",
    width: 130,
    valueGetter: getCellValue,
  },
  {
    field: "guestName",
    headerName: "Người đặt hộ",
    width: 170,
    valueGetter: getCellValue,
  },
  {
    field: "guestPhone",
    headerName: "SĐT đặt hộ",
    width: 130,
    valueGetter: getCellValue,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    valueGetter: getCellValue,
    renderCell: renderCellStatus,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "",
    width: 70,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <Menu value={params.value} id={params.id} />,
  },
];

const DataTableItem = (props) => {
  const { rows } = props;

  return (
    <>
      <div style={{ height: "500px", width: "100%", marginTop: "15px" }}>
        <DataGrid
          rows={rows}
          rowHeight={70}
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
    </>
  );
};

export default DataTableItem;
