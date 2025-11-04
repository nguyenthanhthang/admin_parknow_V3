import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import DataTableItem from "./DataTableItem";

const BoxContent = ({ name, value }) => {
  return (
    <Box
      sx={{
        border: "none",
        p: 2,
        background: "#2C97EB",
        width: 260,
        height: 170,
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" color="#fff" sx={{ mb: 1 }}>
        {name}
      </Typography>
      <Typography
        variant="h1"
        color="#fff"
        sx={{ textAlign: "center", marginTop: "10%", fontSize: "50px" }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const HistoryBooking = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 1",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Khởi tạo",
    },
    {
      id: 2,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Đỗ Anh Linh",
      position: "A4",
      floor: "tầng 2",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: "Nguyễn Thị Minh Khai",
      guestPhone: null,
      status: "Thành công",
    },
    {
      id: 3,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 1",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Đã duyệt",
    },
    {
      id: 4,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 1",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Vào bãi",
    },
    {
      id: 5,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 1",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Chờ thanh toán",
    },
    {
      id: 6,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 1",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Ra bãi",
    },
    {
      id: 7,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
      name: "Nguyễn Thị Minh Khai",
      position: "A4",
      floor: "tầng 2",
      startTime: "7 : 00 AM",
      totalPrice: "20,000 vnđ",
      phone: "012341234132",
      licensePlate: "60A - 12345",
      parkingName: "Hoàng Văn Thụ",
      checkInTime: "7 AM",
      checkOutTime: null,
      paymentMethod: null,
      guestName: null,
      guestPhone: null,
      status: "Hủy đơn",
    },
  ]);
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        spacing={3}
        sx={{ marginTop: "2px" }}
      >
        <Grid item xs={2.2}>
          <BoxContent name="Tổng số đơn" value="200" />
        </Grid>
        <Grid item xs={2.2}>
          <BoxContent name="Đơn thành công" value="100" />
        </Grid>
        <Grid item xs={2.2}>
          <BoxContent name="Đơn trong ngày" value="250" />
        </Grid>
        <Grid item xs={2.2}>
          <BoxContent name="Số đơn hủy" value="15" />
        </Grid>
        <Grid item xs={2.2}>
          <BoxContent name="Số đơn chờ" value="15" />
        </Grid>
      </Grid>

      <DataTableItem rows={rows} />
    </>
  );
};

export default HistoryBooking;
