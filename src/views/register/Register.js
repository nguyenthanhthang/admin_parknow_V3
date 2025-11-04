import React from "react";
import { useSelector } from "react-redux";
import PersonalInfor from "ui-component/register-step/step2/PersonalInfor";
import AccountInfor from "ui-component/register-step/step1/AccountInfor";
import BusinessInfor from "ui-component/register-step/step3/BusinessInfor";

import Stepper from "@mui/material/Stepper";

const StepRegister = () => {
  const currentStep = useSelector((state) => state.multiStep.currentStep);

  function showStep(step) {
    switch (step) {
      case 1:
        return <AccountInfor />;
      case 2:
        return <PersonalInfor />;
      case 3:
        return <BusinessInfor />;
      default:
        return;
    }
  }
  return (
    <>
      <Stepper
        style={{ width: "18%", marginLeft: "40%" }}
        activeStep={currentStep - 1}
        orientation="horizontal"
      ></Stepper>
      {showStep(currentStep)}
    </>
  );
};

export default StepRegister;
