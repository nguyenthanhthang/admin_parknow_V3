import React from "react";
import "./CancelButton.scss";

const CancelButton = (props) => {
  const { onClick } = props;
  return (
    <div>
      <button className="btn-simple-cancel" onClick={onClick}>
        Hủy
      </button>
    </div>
  );
};

export default CancelButton;
