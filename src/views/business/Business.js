import React, { useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Grid, Skeleton, Typography } from "@mui/material";
import SubCard from "ui-component/cards/SubCard";
import Loading from "ui-component/back-drop/Loading";
import { ImFilesEmpty } from "react-icons/im";
import Menu from "ui-component/business/Menu";

const getCellValue = (params) => {
  if (!params || params.value === null || params.value === undefined) {
    return "-------";
  }
  return params.value;
};

const columns = [
  {
    field: "businessProfileId",
    headerName: "ID",
    width: 170,
    valueFormatter: (value) => {
      return value || "-------";
    },
    renderCell: (params) => {
      if (!params || !params.row) {
        return <div>-------</div>;
      }
      const id = params.row?.businessProfileId || params.value || "-------";
      return <div>{id}</div>;
    },
  },
  {
    field: "name",
    headerName: "Tên doanh nghiệp",
    description: "This column has a value getter and is not sortable.",
    // sortable: false,
    width: 400,
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
    width: 800,
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
    field: "action",
    headerName: "",
    width: 120,
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

export default function MyBusiness(props) {
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
        <MainCard title={"Doanh nghiệp"}>
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
      <MainCard title={"Doanh nghiệp"}>
        <Grid item xs={12}>
          <SubCard>
            <SearchSection />
          </SubCard>
        </Grid>
        {rows && Array.isArray(rows) && rows.length > 0 ? (
          <div id="outer-div">
            <DataGrid
              rows={rows.filter((row) => row && (row.businessProfileId || row.id))} // Filter out null/undefined rows
              rowHeight={70}
              autoHeight
              getRowId={(row) => {
                if (!row) return `row-${Math.random()}`;
                return row.businessProfileId || row.id || `row-${Math.random()}`;
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
