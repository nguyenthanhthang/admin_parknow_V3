import React from "react";
import MainCard from "ui-component/cards/MainCard";
import ParkingImage from "ui-component/parking/parking-images/ParkingImage";
import ParkingDetailInfo from "ui-component/parking/single-parking/DetailParkInfo/ParkingDetailInfo";
import Tabs from "ui-component/parking/single-parking/Tabs";
import FloorParking from "ui-component/parking/single-parking/PhysicalModalParking/FloorParking";
import ApproveParking from "ui-component/parking/single-parking/RequestParking/Index";

const tabs = [
  {
    label: "Thông tin bãi xe",
    component: <ParkingDetailInfo />,
  },
  {
    label: "Thông tin sa bàn",
    component: <FloorParking />,
  },
  {
    label: "Hình ảnh bãi xe",
    component: <ParkingImage />,
  },
  {
    label: "Thông tin yêu cầu duyệt",
    component: <ApproveParking />,
  },
];

const ParkingDetail = () => {
  return (
    <>
      <MainCard title="Chi tiết bãi xe">
        <div className="container mx-auto mt-4">
          <Tabs tabs={tabs} />
        </div>
      </MainCard>
    </>
  );
};

export default ParkingDetail;
