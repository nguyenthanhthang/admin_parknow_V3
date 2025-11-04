import React from "react";
import "./ContinueButton.scss";

const ContinueButton = (props) => {
  const { width, onClick } = props;
  return (
    <div>
      <button
        type="submit"
        style={{ width: width }}
        onClick={onClick}
        className="btn-continue-register"
      >
        <span>Tiếp theo</span>
      </button>
    </div>
  );
};

export default ContinueButton;
