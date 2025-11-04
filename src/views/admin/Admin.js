import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Avatar, Chip, Grid, Skeleton, Typography } from "@mui/material";
import Menu from "ui-component/staff/Menu";
import CreateButton from "ui-component/buttons/create-button/CreateButton";
import SubCardStaff from "ui-component/cards/SubCardStaff";
import { useDispatch } from "react-redux";
import { openModal } from "store/modalReducer";
import CreateModalStaff from "ui-component/modal/staff-modal/create-modal/CreateModalStaff";
import SubCard from "ui-component/cards/SubCard";
import Loading from "ui-component/back-drop/Loading";
import { ImFilesEmpty } from "react-icons/im";
import { useRef } from "react";
import { useEffect } from "react";

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
  { field: "userId", headerName: "ID", width: 100 },
  {
    field: "avatar",
    headerName: "Ảnh",
    width: 100,
    renderCell: renderAvatarCell,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Tên nhân viên",
    description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 320,
    valueGetter: (params) => `${params.row.name || ""}`,
  },
  { field: "email", headerName: "Email", width: 360 },
  {
    field: "dateOfBirth",
    headerName: "Ngày sinh",
    width: 280,
    valueGetter: (params) => formatDateOfBirth(params.row.dateOfBirth),
  },
  {
    field: "isActive",
    headerName: "Hoạt động",
    width: 200,
    valueGetter: getCellValue,
    renderCell: renderCellStatus,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "",
    width: 100,
    sortable: false,
    disableColumnMenu: true,
    align: "center",
    renderCell: (params) => <Menu id={params.id} />,
  },
];

export default function MyAdmin(props) {
  const { rows, loading } = props;
  const dataGridRef = useRef(null);

  useEffect(() => {
    if (dataGridRef.current) {
      // get the height of the DataGrid using the ref
      const height = dataGridRef.current.clientHeight;
      // set the height of the outer div to be the same as the DataGrid height
      document.getElementById("outer-div").style.height = `${height}px`;
    }
  }, [rows]);

  const dispatch = useDispatch();

  if (loading) {
    // Render the Skeleton components or any other loading indicator
    return (
      <>
        <MainCard title={"Quản trị viên"}>
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
      <MainCard title={"Quản trị viên"}>
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
        {rows ? (
          <div id="outer-div">
            <DataGrid
              rows={rows}
              rowHeight={70}
              autoHeight
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

      <CreateModalStaff modalType="createModalStaff" />
    </>
  );
}
