import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ slide, getBarClick, getBar }) => {
  const navigate = useNavigate();
  const [SlideState, setSlideState] = useState("");
  const width = window.innerWidth;
  const [sideBar, setSideBar] = useState(width < 768 ? false : true);

  useEffect(() => {
    setSlideState(slide);
  }, []);

  let token = localStorage.getItem("token-admin");
  let AdminData = JSON.parse(localStorage.getItem("token-admin-data"));

  console.log(AdminData);
  if (token === null) {
    Swal.fire({
      title: "PLease Login to Continue!",
      text: "Login Expired!",
      icon: "warning",
      confirmButtonText: "Login",
      confirmButtonColor: "#e25829",
    }).then((res) => {
      navigate("/Admin/Login");
    });
  }
  console.log(width);

  const Logout = () => {
    localStorage.removeItem("token-admin");
    navigate("/Admin/Login");
  };

  return (
    <div>
      <div>
        <div className={sideBar ? "siderbar_section" : " d-none"}>
          <div className="siderbar_inner">
            {width < 768 ? (
              <a
                className="sidebar_btn_resp"
                onClick={() => {
                  setSideBar(!sideBar);
                  getBarClick("close");
                }}
              >
                <i class="fa fa-close "></i>
              </a>
            ) : (
              ""
            )}
            <div className="sidebar_logo">
              <a href="javscript:;">
                <img src={require("../../assets/img/logo.png")} alt="Logo" />{" "}
              </a>
            </div>
            <div className="sidebar_menus">
              <ul className="list-unstyled ps-1 m-0">
                <li>
                  <Link
                    className={SlideState === "Dash" ? "active" : ""}
                    to="/Admin/Dashboard"
                    onClick={() => {
                      setSlideState("Dash");
                      if (width < 768) {
                        setSideBar(!sideBar);
                      }
                    }}
                  >
                    <i className="fas fa-home" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "BuyM" ? "active" : ""}
                    to="/Admin/Dashboard/Buyer-Management"
                    onClick={() => {
                      setSlideState("BuyM");
                    }}
                  >
                    <i className="fas fa-luggage-cart" />
                    Buyers Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "VM" ? "active" : ""}
                    to="/Admin/Dashboard/Vendor-Management"
                    onClick={() => {
                      setSlideState("VM");
                    }}
                  >
                    <i className="fas fa-store" />
                    Vendor Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "BM" ? "active" : ""}
                    to="/Admin/Dashboard/Booking-Management"
                    onClick={() => {
                      setSlideState("BM");
                    }}
                  >
                    <i className="fas fa-clipboard-list" />
                    Booking Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "CM" ? "active" : ""}
                    to="/Admin/Dashboard/Category-Management"
                    onClick={() => {
                      setSlideState("CM");
                    }}
                  >
                    <i className="fas fa-list-ol" />
                    Category Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "TM" ? "active" : ""}
                    to="/Admin/Dashboard/Transaction-Management"
                    onClick={() => {
                      setSlideState("TM");
                    }}
                  >
                    <i className="fas fa-repeat" />
                    Transaction Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "SM" ? "active" : ""}
                    to="/Admin/Dashboard/Services-Management"
                    onClick={() => {
                      setSlideState("SM");
                    }}
                  >
                    <i className="fas fa-repeat" />
                    Services Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "PM" ? "active" : ""}
                    to="/Admin/Dashboard/Payout-Management"
                    onClick={() => {
                      setSlideState("PM");
                    }}
                  >
                    <i className="fas fa-repeat" />
                    Payout Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "ComM" ? "active" : ""}
                    to="/Admin/Dashboard/Commission-Management"
                    onClick={() => {
                      setSlideState("ComM");
                    }}
                  >
                    <i className="fas fa-percent" />
                    Commission Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "PCM" ? "active" : ""}
                    to="/Admin/Dashboard/Promo-Management"
                    onClick={() => {
                      setSlideState("PCM");
                    }}
                  >
                    <i className="fas fa-coins" />
                    Promo Code Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "ADM" ? "active" : ""}
                    to="/Admin/Dashboard/Adds-Management"
                    onClick={() => {
                      setSlideState("ADM");
                    }}
                  >
                    <i className="fas fa-ad" />
                    Advertisment Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "MO" ? "active" : ""}
                    to="/Admin/Dashboard/Marketing-Offers"
                    onClick={() => {
                      setSlideState("MO");
                    }}
                  >
                    <i className="fas fa-gift" />
                    Marketing offers
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "NM" ? "active" : ""}
                    to="/Admin/Dashboard/Notifications-Management"
                    onClick={() => {
                      setSlideState("NM");
                    }}
                  >
                    <i className="fas fa-bell" />
                    Notification Management
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "HS" ? "active" : ""}
                    to="/Admin/Dashboard/Help&Support-Management"
                    onClick={() => {
                      setSlideState("HS");
                    }}
                  >
                    <i className="fas fa-hands-holding" />
                    Help &amp; Support
                  </Link>
                </li>
                <li>
                  <Link
                    className={SlideState === "ConM" ? "active" : ""}
                    to="/Admin/Dashboard/Content-Management"
                    onClick={() => {
                      setSlideState("ConM");
                    }}
                  >
                    <i className="fas fa-user-edit" />
                    Content Management
                  </Link>
                </li>
                <li>
                  <Link className="" onClick={Logout}>
                    <i className="fas fa-sign-out" />
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="admin_main_inner">
        <div className="admin_header shadow">
          <div className="row align-items-center mx-0 justify-content-between w-100">
            {width < 768 ? (
              <div className="col-auto ">
                {sideBar ? (
                  <a
                    className="sidebar_btn"
                    onClick={() => {
                      setSideBar(!sideBar);
                      getBarClick("close");
                    }}
                  >
                    <i class="fa fa-close "></i>
                  </a>
                ) : (
                  <a
                    className="sidebar_btn"
                    onClick={() => {
                      setSideBar(!sideBar);
                      getBarClick("click");
                    }}
                  >
                    <i class="fa fa-bars "></i>
                  </a>
                )}
              </div>
            ) : (
              <div className="col-auto ">
                {sideBar ? (
                  <a
                    className="sidebar_btn"
                    onClick={() => {
                      setSideBar(!sideBar);
                      getBarClick("click");
                    }}
                  >
                    <i class="fa fa-bars "></i>
                  </a>
                ) : (
                  <a
                    className="sidebar_btn"
                    onClick={() => {
                      setSideBar(!sideBar);
                      getBarClick("close");
                    }}
                  >
                    <i class="fa fa-close "></i>
                  </a>
                )}
              </div>
            )}

            <div className="col-auto d-flex align-items-center">
              <Link
                className="notification_icon"
                to="/Admin/Dashboard/Notifications-Management"
              >
                <i className="fas fa-bell" />
                <span>1</span>
              </Link>
              <div className="dropdown">
                <button
                  className="btn btn-secondary p-2"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    width={40}
                    src={
                      // AdminData?.image
                      //   ? AdminData?.image
                      //   :
                      require("../../assets/img/Nupload.jpg")
                    }
                    alt=""
                  />
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/Admin/Dashboard/Edit-Profile"
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/Admin/Dashboard/Update-Password"
                    >
                      Change Password
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
