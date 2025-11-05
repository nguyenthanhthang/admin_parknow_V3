import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Avatar, Chip, Grid, Skeleton, Typography } from "@mui/material";
import Menu from "ui-component/customer/Menu";
import CreateModalStaff from "ui-component/modal/staff-modal/create-modal/CreateModalStaff";
import SubCard from "ui-component/cards/SubCard";
import Loading from "ui-component/back-drop/Loading";
import { ImFilesEmpty } from "react-icons/im";
import { useRef } from "react";
import { useEffect } from "react";
import User from "../../assets/images/avatar.png";

const renderAvatarCell = (params) => {
  if (!params) {
    return <Avatar src={User} />;
  }
  return (
    <>
      {params.value ? (
        <Avatar src={params.value} alt="avatar" />
      ) : (
        <Avatar src={User} />
      )}
    </>
  );
};

// Removed unused getCellValue function

const renderCellStatus = (params) => {
  if (!params || !params.row) {
    return (
      <Chip
        color="secondary"
        label="-------"
        sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
  const isActive = params.row.isActive;
  if (isActive === true) {
    return (
      <Chip
        color="success"
        label="Đang hoạt động"
        sx={{ padding: "10px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
  if (isActive === false) {
    return (
      <Chip
        color="secondary"
        label="Không hoạt động"
        sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
      />
    );
  }
  return (
    <Chip
      color="secondary"
      label="-------"
      sx={{ padding: "8px", color: "#fff", fontWeight: "bold" }}
    />
  );
};

const formatDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return "-------";
  }
  // Xử lý cả string ISO date và Date object
  if (typeof dateOfBirth === "string") {
    // Format: "2000-01-01T00:00:00" -> "2000-01-01"
    if (dateOfBirth.length >= 10) {
      return dateOfBirth.slice(0, 10);
    }
    return dateOfBirth;
  }
  // Nếu là Date object
  if (dateOfBirth instanceof Date) {
    return dateOfBirth.toISOString().slice(0, 10);
  }
  return "-------";
};

const columns = [
  { field: "userId", headerName: "ID", width: 100 },
  {
    field: "avatar",
    headerName: "Ảnh",
    width: 90,
    renderCell: renderAvatarCell,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Tên người dùng",
    description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 320,
    valueFormatter: (value) => {
      return value || "-------";
    },
    renderCell: (params) => {
      const name = params.row?.name || params.value || "-------";
      return <div>{name}</div>;
    },
  },
  { field: "phone", headerName: "SĐT", width: 180 },
  {
    field: "dateOfBirth",
    headerName: "Ngày sinh",
    width: 270,
    valueFormatter: (value, row) => {
      return formatDateOfBirth(value || row?.dateOfBirth);
    },
    renderCell: (params) => {
      const dateOfBirth = params.row?.dateOfBirth || params.value;
      const formattedDate = formatDateOfBirth(dateOfBirth);
      return <div>{formattedDate}</div>;
    },
  },
  { field: "gender", headerName: "Giới tính", width: 210 },
  {
    field: "isActive",
    headerName: "Hoạt động",
    width: 180,
    valueGetter: (params) => {
      if (!params || !params.row) return null;
      return params.row.isActive;
    },
    renderCell: renderCellStatus,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "",
    width: 80,
    sortable: false,
    disableColumnMenu: true,
    align: "center",
    renderCell: (params) => {
      if (!params || !params.row) {
        return null;
      }
      return <Menu value={params.row.isActive} id={params.id} />;
    },
  },
];

export default function MyCustomer(props) {
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

  if (loading) {
    // Render the Skeleton components or any other loading indicator
    return (
      <>
        <MainCard title={"Tất cả người dùng"}>
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

  return (
    <>
      <MainCard title={"Người dùng app"}>
        <Grid item xs={12}>
          <SubCard>
            <SearchSection />
          </SubCard>
        </Grid>
        {rows && Array.isArray(rows) && rows.length > 0 ? (
          <div id="outer-div">
            <DataGrid
              rows={rows.filter((row) => row && (row.userId || row.id))} // Filter out null/undefined rows
              rowHeight={70}
              autoHeight
              getRowId={(row) => {
                if (!row) return `row-${Math.random()}`;
                return row.userId || row.id || `row-${Math.random()}`;
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

      <CreateModalStaff modalType="createModalStaff" />
    </>
  );
}
