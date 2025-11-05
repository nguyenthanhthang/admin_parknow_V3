import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { useLocation, useNavigate, useParams } from "react-router";
import { Grid } from "@mui/material";
import SaveButton from "ui-component/buttons/save-button/SaveButton";
import ApproveParkingDetail from "ui-component/parking/approve-parking/parking-detail/ApproveParkingDetail";
import FloorParking from "ui-component/parking/approve-parking/physical-modal-parking/FloorParking";
import RealInformation from "ui-component/parking/approve-parking/real-information/RealInfomation";
// import Tabs from "ui-component/parking/approve-parking/Tabs";
import Swal from "sweetalert2";
import TabRequest from "ui-component/Tabs/TabRequest";
import config from "config";

const ApproveParking = () => {
  const { approveParkingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { parkingId } = location.state;

  const [activeTab, setActiveTab] = useState("tabs-home3");

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
      label: "Thông tin thực địa",
      id: "tabs-messages3",
      component: <RealInformation approveParkingId={approveParkingId} />,
    },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const apiUrl = config.apiUrl;
  const token = localStorage.getItem("tokenAdmin");

  const handleSave = async () => {
    Swal.fire({
      title: selectedOption === "approve" ? "Duyệt" : "Từ chối",
      input: "textarea",
      inputPlaceholder: "Nhập ghi chú",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: selectedOption === "approve" ? "Duyệt" : "Từ chối",
      confirmButtonColor: selectedOption === "approve" ? "#7066e0" : "#eb0c38",
      cancelButtonText: "Hủy",
      preConfirm: (inputText) => {
        if (!inputText) {
          Swal.showValidationMessage("Vui lòng nhập ghi chú");
        }
        return inputText;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = result;

        const body = {
          approveParkingId: approveParkingId,
          noteForAdmin: text,
        };

        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        };

        Swal.fire({
          icon: "info",
          title: "Đang xử lý thông tin...",
          text: "Vui lòng chờ trong giây lát!",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        let response;

        if (selectedOption === "approve") {
          response = await fetch(
            `${apiUrl}/approve-parkings/request/accept`,
            requestOptions
          );
        } else {
          response = await fetch(
            `${apiUrl}/approve-parkings/request/decline`,
            requestOptions
          );
        }

        if (response.status === 204) {
          Swal.fire({
            icon: "success",
            text: "Thành công",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/pending");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "Bãi xe đã được duyệt/từ chối",
          });
        }
      }
    });
  };

  return (
    <>
      <MainCard title="Duyệt bãi xe">
        <div>
          <TabRequest
            tabs={tabs}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          />
        </div>
        <div>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={tab.id}
              className={activeTab === tab.id ? "" : "hidden opacity-0"}
            >
              {tab.component}
            </div>
          ))}
        </div>
      </MainCard>

      <Grid
        container
        sx={{
          backgroundColor: "#fff",
          marginTop: "15px",
          borderRadius: "12px",
          padding: "10px",
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <div className="radio-check">
            <form>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value="approve"
                  checked={selectedOption === "approve"}
                  onChange={handleRadioChange}
                />
                <span>Duyệt</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value="reject"
                  checked={selectedOption === "reject"}
                  onChange={handleRadioChange}
                />
                <span>Từ chối</span>
              </label>
            </form>
          </div>
        </Grid>
        <Grid item>
          <SaveButton onClick={handleSave} />
        </Grid>
      </Grid>
    </>
  );
};

export default ApproveParking;
