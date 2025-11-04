import React from "react";
import "./ContinueLogin.scss";

const ContinueLogin = ({ onClick }) => {
  return (
    <>
      <button className="learn-more" onClick={onClick}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">Tiếp Tục Đăng nhập</span>
      </button>
    </>
  );
};

export default ContinueLogin;
