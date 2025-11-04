import React from "react";
import "./Debt.scss";

const Debt = (props) => {
  const { data } = props;

  return (
    <div className="card__debt">
      <div className="card__debt-img">
        <div className="card__debt-save">
          <svg
            className="svg"
            width="683"
            height="683"
            viewBox="0 0 683 683"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_993_25)">
              <mask
                id="mask0_993_25"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="683"
                height="683"
              >
                <path
                  d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z"
                  fill="white"
                ></path>
              </mask>
              <g mask="url(#mask0_993_25)">
                <path
                  d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z"
                  stroke="#CED8DE"
                  strokeWidth="40"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </g>
            <defs>
              <clipPath id="clip0_993_25">
                <rect width="682.667" height="682.667" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className="card__debt-text">
        <p className="h3"> SỐ NỢ </p>
        <p className="p"> {data?.debt} đ </p>
        <svg
          className="svg"
          // xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="23 29 78 60"
          height="60px"
          width="78px"
        >
          <defs></defs>
          <g
            transform="translate(23.000000, 29.500000)"
            fillRule="evenodd"
            fill="none"
            strokeWidth="1"
            stroke="none"
            id="icon"
          >
            <rect
              rx="4.70247832"
              height="21.8788565"
              width="9.40495664"
              y="26.0333433"
              x="67.8357511"
              fill="#AC8BE9"
              id="Rectangle-3"
            ></rect>
            <rect
              rx="4.70247832"
              height="10.962961"
              width="9.40495664"
              y="38.776399"
              x="67.8357511"
              fill="#6A5297"
              id="Rectangle-3"
            ></rect>
            <polygon
              points="57.3086772 0 67.1649301 26.3776902 14.4413177 45.0699507 4.58506484 18.6922605"
              fill="#6A5297"
              id="Rectangle-2"
            ></polygon>
            <path
              fill="#8B6FC0"
              id="Rectangle"
              d="M0,19.6104296 C0,16.2921718 2.68622235,13.6021923 5.99495032,13.6021923 L67.6438591,13.6021923 C70.9547788,13.6021923 73.6388095,16.2865506 73.6388095,19.6104296 L73.6388095,52.6639057 C73.6388095,55.9821635 70.9525871,58.672143 67.6438591,58.672143 L5.99495032,58.672143 C2.68403068,58.672143 0,55.9877847 0,52.6639057 L0,19.6104296 Z"
            ></path>
            <path
              fill="#F6F1FF"
              id="Fill-12"
              d="M47.5173769,27.0835169 C45.0052827,24.5377699 40.9347162,24.5377699 38.422622,27.0835169 L36.9065677,28.6198808 L35.3905134,27.0835169 C32.8799903,24.5377699 28.8078527,24.5377699 26.2957585,27.0835169 C23.7852354,29.6292639 23.7852354,33.7559532 26.2957585,36.3001081 L36.9065677,47.0530632 L47.5173769,36.3001081 C50.029471,33.7559532 50.029471,29.6292639 47.5173769,27.0835169"
            ></path>
            <rect
              height="12.863158"
              width="15.6082259"
              y="26.1162588"
              x="58.0305835"
              fill="#AC8BE9"
              id="Rectangle-4"
            ></rect>
            <ellipse
              ry="2.23319575"
              rx="2.20116007"
              cy="33.0919007"
              cx="65.8346965"
              fill="#FFFFFF"
              id="Oval"
            ></ellipse>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Debt;
