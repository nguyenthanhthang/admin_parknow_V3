import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "ui-component/cards/MainCard";
import SearchSection from "ui-component/search-section";
import { Chip, Grid, Typography } from "@mui/material";
import Menu from "ui-component/parking/parking-price/Menu";
import CreateButton from "ui-component/buttons/create-button/CreateButton";
import SubCardStaff from "ui-component/cards/SubCardStaff";
import { useNavigate } from "react-router";
import Loading from "ui-component/back-drop/Loading";
import { ImFilesEmpty } from "react-icons/im";
import ApplyParking from "ui-component/modal/parking-price-apply/ApplyParking";

export default function MyParkingPrice(props) {
  const { rows, loading } = props;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [priceId, setPriceId] = useState();
  const [priceName, setPriceName] = useState();

  const handleCreate = () => {
    navigate("/create-new-price");
  };

  const getCellValue = (params) => {
    return params.value ? params.value : "-------";
  };

  const renderCellStatus = (params) => {
    if (params.value === true) {
      return (
        <Chip
          color="success"
          label="true"
          sx={{ padding: "0 5px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
    if (params.value === false) {
      return (
        <Chip
          color="secondary"
          label="false"
          sx={{ padding: "5px", color: "#fff", fontWeight: "bold" }}
        />
      );
    }
  };

  const handleApply = (params) => {
    setIsOpen(true);
    setPriceId(params.row.parkingPriceId);
    setPriceName(params.row.parkingPriceName);
  };

  const renderCellApply = (params) => {
    return (
      <button
        onClick={() => handleApply(params)}
        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
      >
        Áp dụng
      </button>
    );
  };

  const columns = [
    { field: "parkingPriceId", headerName: "ID", width: 70 },
    {
      field: "parkingPriceName",
      headerName: "Tên gói",
      description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 300,
      valueGetter: (params) => `${params.row.parkingPriceName || ""}`,
    },
    {
      field: "isActive",
      headerName: "Hoạt động",
      width: 120,
      renderCell: renderCellStatus,
      valueGetter: getCellValue,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "",
      width: 70,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <Menu id={params.row.parkingPriceId} />,
    },
    {
      field: "apply",
      headerName: "",
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      renderCell: renderCellApply,
    },
  ];

  return (
    <>
      {loading ? (
        <>
          <Loading loading={loading} />
        </>
      ) : (
        <MainCard title={"Bảng giá gói cước"}>
          <Grid item xs={12}>
            <SubCardStaff
              startComponent={<SearchSection />}
              endComponent={<CreateButton onClick={handleCreate} />}
            />
          </Grid>

          {rows ? (
            <div style={{ height: "500px", width: "100%" }}>
              <DataGrid
                rows={rows}
                rowHeight={70}
                getRowId={(row) => row.parkingPriceId}
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
                sx={{ textAlign: "center", marginTop: "5%" }}
              >
                Không tìm thấy dữ liệu
              </Typography>
              <ImFilesEmpty
                style={{
                  fontSize: "150px",
                  marginTop: "5%",
                  marginLeft: "46%",
                }}
              />{" "}
            </>
          )}
        </MainCard>
      )}

      <ApplyParking
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        priceId={priceId}
        priceName={priceName}
      />
    </>
  );
}
