import React from "react";
import "./EnableButton.scss";

const EnableButton = (props) => {
  const { onClick } = props;
  return (
    <>
      <button onClick={onClick} className="btn-enable" alt="Vô hiệu hóa">
        <i>V</i>
        <i>ô</i>
        <i>&nbsp;</i>
        <i>h</i>
        <i>i</i>
        <i>ệ</i>
        <i>u</i>
        <i>&nbsp;</i>
        <i>h</i>
        <i>ó</i>
        <i>a</i>
      </button>
    </>
  );
};

export default EnableButton;
