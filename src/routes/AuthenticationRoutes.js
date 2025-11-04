import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";
import MinimalLayout from "layout/MinimalLayout";
// import { Layout } from "ui-component/auth/layout";

// login option 3 routing
// const AuthLogin = Loadable(
//   lazy(() => import("views/pages/authentication/authentication/Login"))
// );
// const AuthLogin = Loadable(
//   lazy(() => import("views/pages/authentication/authentication/Login2"))
// );
const AuthLoginAdmin = Loadable(
  lazy(() => import("views/pages/authentication/authentication/Login"))
);
// const AuthRegister = Loadable(
//   lazy(() => import("views/pages/authentication/authentication/Register"))
// );

const InputEmail = Loadable(
  lazy(() =>
    import("views/pages/authentication/forgot-password/Email/EmailInput")
  )
);

const OTP = Loadable(
  lazy(() => import("views/pages/authentication/forgot-password/OTP/Index"))
);

const NewPassword = Loadable(
  lazy(() =>
    import("views/pages/authentication/forgot-password/NewPassword/NewPassword")
  )
);

const StepRegister = Loadable(
  lazy(() => import("views/register/RegisterForBus"))
);

const QrCodeScan = Loadable(
  lazy(() => import("ui-component/qr-scan-code/QRScanCode"))
);

const Maps = Loadable(
  lazy(() => import("ui-component/parking/parking-all/step2/Index"))
);

const Modal = Loadable(
  lazy(() => import("ui-component/parking/parking-all/step3/Index"))
);

const NotFound = Loadable(
  lazy(() => import("ui-component/not-found/NotFound"))
);
// const Layout = Loadable(lazy(() => import("ui-component/auth/layout")));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const user = localStorage.getItem("user"); // Set the authentication status here
const isAuthenticated = JSON.parse(user);

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "",
      element: <AuthLoginAdmin />,
    },
    {
      path: "login",
      element: <AuthLoginAdmin />,
    },
    {
      path: "register",
      element: <StepRegister />,
    },
    {
      path: "input-email",
      element: <InputEmail />,
    },
    {
      path: "otp",
      element: <OTP />,
    },
    {
      path: "new-password",
      element: <NewPassword />,
    },
    {
      path: isAuthenticated ? "qr" : "login",
      element: <QrCodeScan />,
    },
    {
      path: isAuthenticated ? "maps" : "login",
      element: <Maps />,
    },
    {
      path: isAuthenticated ? "modal" : "login",
      element: <Modal />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};

export default AuthenticationRoutes;
