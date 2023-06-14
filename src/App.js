import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
import AdminLogin from "./AdminComponent/Login/AdminLogin";
import ForgotPassword from "./AdminComponent/Login/AdminForgotPass";
import OtpVerify from "./AdminComponent/Login/OtpVerify";
import AdminForgotPass from "./AdminComponent/Login/AdminForgotPass";
import AdminResetPass from "./AdminComponent/Login/AdminResetPass";
import Dashboard from "./AdminComponent/Dashboard/Dashboard";
import BuyerManage from "./AdminComponent/Dashboard/BuyerManagement/BuyerManage";
import BuyerDetails from "./AdminComponent/Dashboard/BuyerManagement/BuyerDetails";
import { QueryClient, QueryClientProvider } from "react-query";
import Categories from "./AdminComponent/Dashboard/Categories/Categories";
import VendorManagement from "./AdminComponent/Dashboard/VendorManage/VendorManagement";
import ApprovedView from "./AdminComponent/Dashboard/VendorManage/ApprovedView";
import PendingView from "./AdminComponent/Dashboard/VendorManage/PendingView";
import ReturnedView from "./AdminComponent/Dashboard/VendorManage/ReturnedView";
import AddUser from "./AdminComponent/Dashboard/VendorManage/AddUser";
import BookingManage from "./AdminComponent/Dashboard/bookingManage/BookingManage";
import TransactionManagement from "./AdminComponent/Dashboard/TransactionManage/TransactionManagement";
import CommissionManagement from "./AdminComponent/Dashboard/CommissionManage/CommissionManagement";
import PromoManagement from "./AdminComponent/Dashboard/PromoCode/PromoManagement";
import AdvertiseManagement from "./AdminComponent/Dashboard/AdvertiseManage/AdvertiseManagement";
import MarketingOffers from "./AdminComponent/Dashboard/MarketingOffers/MarketingOffers";
import Notification from "./AdminComponent/Dashboard/Notifications/Notification";
import HelpSupport from "./AdminComponent/Dashboard/Help&Support/HelpSupport";
import ContentManagement from "./AdminComponent/Dashboard/ContentManage/ContentManagement";
import Services from "./AdminComponent/Dashboard/VendorManage/Services";
import EditProfile from "./AdminComponent/Dashboard/EditProfile";
import UpdatePassword from "./AdminComponent/Dashboard/UpdatePassword";
import BookingDetails from "./AdminComponent/Dashboard/bookingManage/BookingDetails";
import Payout from "./AdminComponent/Dashboard/Payout";
import ServicesManage from "./AdminComponent/Dashboard/ServicesManage/Services";
import EventManagement from "./AdminComponent/Dashboard/EventManage/EventManagement";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/Admin/Login" element={<AdminLogin />} />
            {/* <Route path="*" element={<AdminLogin />} /> */}
            <Route
              path="/Admin/Forgot-password"
              element={<AdminForgotPass />}
            />
            <Route path="/Admin/OTP-verify" element={<OtpVerify />} />
            <Route path="/Admin/Reset-password" element={<AdminResetPass />} />
            <Route path="/Admin/Dashboard" element={<Dashboard />} />
            <Route
              path="/Admin/Dashboard/Edit-Profile"
              element={<EditProfile />}
            />
            <Route
              path="/Admin/Dashboard/Update-Password"
              element={<UpdatePassword />}
            />
            <Route
              path="/Admin/Dashboard/Buyer-Management"
              element={<BuyerManage />}
            />
            <Route
              path="/Admin/Dashboard/Buyer-Details"
              element={<BuyerDetails />}
            />
            <Route
              path="/Admin/Dashboard/Category-Management"
              element={<Categories />}
            />
            <Route
              path="/Admin/Dashboard/Vendor-Management"
              element={<VendorManagement />}
            />
            <Route
              path="/Admin/Dashboard/Vendor-Management/Approved"
              element={<ApprovedView />}
            />
            <Route
              path="/Admin/Dashboard/Vendor-Management/Pending"
              element={<PendingView />}
            />{" "}
            <Route
              path="/Admin/Dashboard/Vendor-Management/Returned"
              element={<ReturnedView />}
            />
            <Route
              path="/Admin/Dashboard/Vendor-Management/Add-User"
              element={<AddUser />}
            />
            <Route
              path="/Admin/Dashboard/Vendor-Management/Services/:id"
              element={<Services />}
            />
            <Route
              path="/Admin/Dashboard/Booking-Management"
              element={<BookingManage />}
            />
            <Route
              path="/Admin/Dashboard/Booking-Management/Booking-Details/:id"
              element={<BookingDetails />}
            />
            <Route
              path="/Admin/Dashboard/Transaction-Management"
              element={<TransactionManagement />}
            />
            <Route
              path="/Admin/Dashboard/Payout-Management"
              element={<Payout />}
            />
            <Route
              path="/Admin/Dashboard/Commission-Management"
              element={<CommissionManagement />}
            />
            <Route
              path="/Admin/Dashboard/Promo-Management"
              element={<PromoManagement />}
            />
            <Route
              path="/Admin/Dashboard/Event-Management"
              element={<EventManagement />}
            />
            <Route
              path="/Admin/Dashboard/Adds-Management"
              element={<AdvertiseManagement />}
            />
            <Route
              path="/Admin/Dashboard/Marketing-Offers"
              element={<MarketingOffers />}
            />
            <Route
              path="/Admin/Dashboard/Services-Management"
              element={<ServicesManage />}
            />
            <Route
              path="/Admin/Dashboard/Notifications-Management"
              element={<Notification />}
            />
            <Route
              path="/Admin/Dashboard/Help&Support-Management"
              element={<HelpSupport />}
            />
            <Route
              path="/Admin/Dashboard/Content-Management"
              element={<ContentManagement />}
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
