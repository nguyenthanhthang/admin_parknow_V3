import * as React from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Avatar, Chip, Grid, Skeleton } from "@mui/material";
import Menu from "ui-component/staff/Menu";
import CreateButton from "ui-component/buttons/create-button/CreateButton";
import SubCardStaff from "ui-component/cards/SubCardStaff";
import { useDispatch } from "react-redux";
import { openModal } from "store/modalReducer";
import CreateModalStaff from "ui-component/modal/staff-modal/create-modal/CreateModalStaff";
import * as signalR from "@microsoft/signalr";
import { useState } from "react";
import SubCard from "ui-component/cards/SubCard";
import Loading from "ui-component/back-drop/Loading";
import config from "config";

const renderAvatarCell = (params) => {
  return (
    <>
      {params.value ? (
        <Avatar src={params.value} alt="avatar" />
      ) : (
        <Avatar src="https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" />
      )}
    </>
  );
};

const getCellValue = (params) => {
  return params.value ? params.value : "-------";
};

const renderCellStatus = (params) => {
  if (params.value === true) {
    return (
      <Chip
        color="success"
        label="True"
        sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
  if (params.value === false) {
    return (
      <Chip
        color="secondary"
        label="False"
        sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
};

const formatDateOfBirth = (dateOfBirth) => {
  if (dateOfBirth && dateOfBirth.length >= 10) {
    return dateOfBirth.slice(0, 10);
  }
  return "-------";
};

const columns = [
  { field: "userId", headerName: "ID", width: 70 },
  {
    field: "avatar",
    headerName: "Ảnh",
    width: 80,
    renderCell: renderAvatarCell,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Tên nhân viên",
    description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 200,
    valueGetter: (params) => `${params.row.name || ""}`,
  },
  { field: "email", headerName: "Email", width: 250 },
  { field: "phone", headerName: "SĐT", width: 140 },
  {
    field: "dateOfBirth",
    headerName: "Ngày sinh",
    width: 150,
    valueGetter: (params) => formatDateOfBirth(params.row.dateOfBirth),
  },
  { field: "gender", headerName: "Giới tính", width: 160 },
  { field: "parkingName", headerName: "Thuộc bãi", width: 260 },
  {
    field: "isActive",
    headerName: "Hoạt động",
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
    align: "center",
    renderCell: (params) => <Menu value={params.value} id={params.id} />,
  },
];

export default function Staff() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");
  const user = localStorage.getItem("admin"); // Set the authentication status here
  const userData = JSON.parse(user);
  const signalRUrl = config.signalRUrl;

  const fetchData = React.useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Replace `token` with your actual bearer token
        "Content-Type": "application/json", // Replace with the appropriate content type
      },
    };
    setLoading(true);
    const response = await fetch(
      `${apiUrl}/keeper-management/manager?pageNo=1&pageSize=11&managerId=${userData}`,
      requestOptions
    );
    const data = await response.json();
    setRows(data.data);
    setLoading(false);
  }, [apiUrl, token, userData]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl)
      .build();
    console.log("connection", connection);

    connection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.error("Error: ", err));

    connection.on("LoadKeeperAccounts", () => {
      fetchData();
    });

    fetchData();

    return () => {
      connection.stop();
    };
  }, [fetchData, signalRUrl]);

  if (loading) {
    // Render the Skeleton components or any other loading indicator
    return (
      <>
        <MainCard title={"Lịch đặt"}>
          <Grid item xs={12}>
            <SubCard>
              {/* Render the Skeleton components for the search section */}
              <Skeleton animation="wave" height={40} width={200} />
            </SubCard>
          </Grid>
          <div style={{ height: "500px", width: "100%" }}>
            {/* Render the Skeleton components for the data grid */}
            <Skeleton animation="wave" height={400} />
          </div>
        </MainCard>
        <Loading loading={loading} />
      </>
    );
  }

  const handleOpenModalCreate = (modalType) => {
    dispatch(openModal(modalType));
  };

  return (
    <>
      <MainCard title={"Nhân viên"}>
        <Grid item xs={12}>
          <SubCardStaff
            startComponent={<SearchSection />}
            endComponent={
              <CreateButton
                onClick={() => handleOpenModalCreate("createModalStaff")}
              />
            }
          ></SubCardStaff>
        </Grid>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={rows}
            rowHeight={70}
            getRowId={(row) => row.userId}
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
      </MainCard>

      <CreateModalStaff modalType="createModalStaff" />
    </>
  );
}
