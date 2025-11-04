import React from "react";
import "./AddButton.scss";

const AddButton = ({ onClick }) => {
  return (
    <>
      <button onClick={onClick} className="icon-btn add-btn">
        <div className="add-icon"></div>
        <div className="btn-txt">Thêm mới</div>
      </button>
    </>
  );
};

export default AddButton;
