import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
// import Tabs from "ui-component/parking/single-parking/Tabs";
import { useNavigate, useParams } from "react-router";
import { Grid } from "@mui/material";
import ApproveParkingDetail from "ui-component/parking/approve-parking/parking-detail/ApproveParkingDetail";
import FloorParking from "ui-component/parking/approve-parking/physical-modal-parking/FloorParking";
// import Tabs from "ui-component/parking/approve-parking/Tabs";
import Swal from "sweetalert2";
import SendApproveButton from "ui-component/buttons/send-approve/SendApproveButton";
import AllSendRequest from "ui-component/staff-parking/SendRequest/Index";
import TabRequest from "ui-component/Tabs/TabRequest";
import config from "config";

const NewRequest = () => {
  const { parkingId } = useParams();
  const [isDone, setIsDone] = useState(false);
  const [approveId, setApproveId] = useState(0);
  const [activeTab, setActiveTab] = useState("tabs-home3");

  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    {
      label: "Thông tin bãi",
      id: "tabs-home3",
      component: <ApproveParkingDetail parkingId={parkingId} />,
    },
    {
      label: "Thông tin sa bàn",
      id: "tabs-profile3",
      component: <FloorParking parkingId={parkingId} />,
    },
    {
      label: "Yêu cầu gửi duyệt",
      id: "tabs-messages3",
      component: (
        <AllSendRequest
          parkingId={parkingId}
          setIsDone={setIsDone}
          setApproveId={setApproveId}
        />
      ),
    },
  ];

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenStaff");

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  };

  const handleSave = () => {
    if (approveId === 0) {
      Swal.fire({
        icon: "error",
        text: "Chưa có yêu cầu nào để gửi! Vui lòng tạo yêu cầu!",
      });
      return;
    }

    Swal.fire({
      title: "Xác nhận gửi?",
      text: "Bạn có chắc chắn muốn gửi yêu cầu này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `${apiUrl}/request/approve-parkings/parking/send-request/${approveId}`,
          requestOptions
        );

        if (response.status === 204) {
          Swal.fire({
            icon: "success",
            text: "Gửi yêu cầu đã được gửi duyệt!",
            confirmButtonText: "Trở lại",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/request");
            }
          });
        }
        if (response.status === 404) {
          Swal.fire({
            icon: "error",
            text: "Bãi chưa áp dụng gói cước nên không thể gửi duyệt! Vui lòng áp dụng giá để thử lại!",
          });
          return;
        }
      }
    });
  };

  return (
    <>
      <MainCard title="Tạo yêu cầu duyệt bãi xe">
        <div>
          <TabRequest
            tabs={tabs}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          />
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={tab.id}
            className={activeTab === tab.id ? "" : "hidden"}
          >
            {tab.component}
          </div>
        ))}
      </MainCard>

      {!isDone && approveId > 0 ? (
        <Grid
          container
          sx={{
            backgroundColor: "#fff",
            marginTop: "15px",
            borderRadius: "12px",
            padding: "10px",
          }}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item>
            <SendApproveButton onClick={handleSave} />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};

export default NewRequest;
