import React from "react";
import MainCard from "ui-component/cards/MainCard";
import ParkingImage from "ui-component/parking/parking-images/ParkingImage";

const SingleParkingImage = () => {
  return (
    <>
      <MainCard title={"Hình ảnh bãi xe"}>
        <ParkingImage />
      </MainCard>
    </>
  );
};

export default SingleParkingImage;
