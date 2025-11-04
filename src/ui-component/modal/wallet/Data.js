import React from "react";
import "./Data.scss";

const Data = () => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="title">SỐ DƯ</p>
          <p>10,000,00 VNĐ</p>
        </div>
        <div className="flip-card-back">
          <p className="title">SỐ NỢ</p>
          <p>5,000,000</p>
        </div>
      </div>
    </div>
  );
};

export default Data;
