import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
// import CreateModalStaff from "ui-component/modal/staff-modal/create-modal/CreateModalStaff";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

const Booking = Loadable(lazy(() => import("views/booking/Index")));

const Profile = Loadable(lazy(() => import("views/profile/Profile")));
const Admin = Loadable(lazy(() => import("views/admin/Index")));
const Customer = Loadable(lazy(() => import("views/customer/Index")));
const Business = Loadable(lazy(() => import("views/business/Index")));
const Order = Loadable(lazy(() => import("views/order/Order")));
const Fee = Loadable(lazy(() => import("views/fee/Fee")));

const ParkingAll = Loadable(
  lazy(() => import("views/parking/parking-all/Index"))
);
const ParkingPending = Loadable(
  lazy(() => import("views/parking/parking-pending/Index"))
);
const ApproveParking = Loadable(
  lazy(() => import("views/parking/approve-parking/ApproveParking"))
);

const RequestedParking = Loadable(
  lazy(() => import("views/parking/request-parking/Index"))
);
const NewRequest = Loadable(
  lazy(() => import("views/parking/request-parking/send-request/NewRequest"))
);

const ImageParking = Loadable(
  lazy(() => import("views/parking/single-parking/parking-images/Index"))
);

const ParkingDetail = Loadable(
  lazy(() => import("views/parking/single-parking/Index"))
);

const ParkingPriceDetail = Loadable(
  lazy(() => import("views/parking/parking-price/parkinng-price-detail/Index"))
);

const ParkingPriceDetailParking = Loadable(
  lazy(() =>
    import(
      "views/parking/parking-price/parkinng-price-detail/ParkingPriceOfParking"
    )
  )
);
const Wallet = Loadable(lazy(() => import("views/wallet/Wallet")));

// const AuthLoginAdmin = Loadable(
//   lazy(() => import("views/pages/authentication/authentication/Login"))
// );

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "dashboard",
      element: <DashboardDefault />,
    },
    {
      path: "booking",
      element: <Booking />,
    },
    {
      path: "profile/:businessId",
      element: <Profile />,
    },
    {
      path: "admin",
      element: <Admin />,
    },
    {
      path: "user",
      element: <Customer />,
    },
    {
      path: "business",
      element: <Business />,
    },
    {
      path: "fee",
      element: <Fee />,
    },
    {
      path: "pending",
      element: <ParkingPending />,
    },
    {
      path: "request",
      element: <RequestedParking />,
    },
    {
      path: "new-request/:parkingId",
      element: <NewRequest />,
    },
    {
      path: "pending/:approveParkingId",
      element: <ApproveParking />,
    },
    {
      path: "parkings",
      element: <ParkingAll />,
    },
    {
      path: "/parking-image",
      element: <ImageParking />,
    },
    {
      path: `/parking-detail/:id`,
      element: <ParkingDetail />,
    },
    {
      path: `/price-detail/:priceId`,
      element: <ParkingPriceDetail />,
    },
    {
      path: `/price-detail-parking/:priceId`,
      element: <ParkingPriceDetailParking />,
    },
    {
      path: `/order`,
      element: <Order />,
    },
    {
      path: `/wallet`,
      element: <Wallet />,
    },
  ],
};

export default MainRoutes;
