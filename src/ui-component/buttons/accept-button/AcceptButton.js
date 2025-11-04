import React from "react";
import "./AcceptButton.scss";

const AcceptButton = (props) => {
  const { onClick, value } = props;
  return (
    <>
      <button className="btn-acp" onClick={onClick}>
        {value}
      </button>
    </>
  );
};

export default AcceptButton;
