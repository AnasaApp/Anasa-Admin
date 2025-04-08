import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ slide, getBarClick, getBar }) => {
  const navigate = useNavigate();
  const [SlideState, setSlideState] = useState("");
  const width = window.innerWidth;
  const [sideBar, setSideBar] = useState(width < 768 ? false : true);
  const [signOutClicked, setSignOutClicked] = useState(false);

  useEffect(() => {
    setSlideState(slide);
  }, []);

  let token = localStorage.getItem("token-admin");
  let AdminData = JSON.parse(localStorage.getItem("token-admin-data"));
  let Admin = JSON.parse(localStorage.getItem("AdminSave"));

  console.log(AdminData?.access);

  const Logout = () => {
    localStorage.removeItem("token-admin");
    setSignOutClicked(true);
    navigate("/Admin/Login");
    window.location.reload();
  };

  useEffect(() => {
    if (token === null && !signOutClicked) {
      Swal.fire({
        title: "Please Login to Continue!",
        text: "Login Expired!",
        icon: "warning",
        confirmButtonText: "Login",
        confirmButtonColor: "#e25829",
      }).then((res) => {
        navigate("/Admin/Login");
      });
    }
  }, [token, navigate, signOutClicked]);
  console.log(width);

  console.log(slide);

  const allModules = [
    {
      label: "Dashboard",
      value: "Dashboard",
      icon: "fas fa-home",
      path: "/Admin/Dashboard",
      key: "Dash",
    },
    {
      label: "Buyers Management",
      value: "Buyers-Management",
      icon: "fas fa-luggage-cart",
      path: "/Admin/Dashboard/Buyer-Management",
      key: "BuyM",
    },
    {
      label: "Vendor Management",
      value: "Vendor-Management",
      icon: "fas fa-store",
      path: "/Admin/Dashboard/Vendor-Management",
      key: "VM",
    },
    {
      label: "Booking Management",
      value: "Booking-Management",
      icon: "fas fa-clipboard-list",
      path: "/Admin/Dashboard/Booking-Management",
      key: "BM",
    },
    {
      label: "Category Management",
      value: "Category-Management",
      icon: "fas fa-list-ol",
      path: "/Admin/Dashboard/Category-Management",
      key: "CM",
    },
    {
      label: "Delivery Management",
      value: "Category-Management",
      icon: "fas fa-shipping-fast",
      path: "/Admin/Dashboard/Delivery-Management",
      key: "DelM",
    },
    {
      label: "Transaction Management",
      value: "Transaction-Management",
      icon: "fas fa-repeat",
      path: "/Admin/Dashboard/Transaction-Management",
      key: "TM",
    },
    {
      label: "Services Management",
      value: "Services-Management",
      icon: "fa-solid fa-layer-group",
      path: "/Admin/Dashboard/Services-Management",
      key: "SM",
    },
    {
      label: "Payout Management",
      value: "Payout-Management",
      icon: "fa-solid fa-sack-dollar",
      path: "/Admin/Dashboard/Payout-Management",
      key: "PM",
    },
    {
      label: "Event-Plan Management",
      value: "Event-Plan-Management",
      icon: "fas fa-calendar",
      path: "/Admin/Dashboard/Event-Management",
      key: "EM",
    },
    {
      label: "Commission Management",
      value: "Commission-Management",
      icon: "fas fa-percent",
      path: "/Admin/Dashboard/Commission-Management",
      key: "ComM",
    },
    {
      label: "Promo Code Management",
      value: "Promocode-Management",
      icon: "fas fa-coins",
      path: "/Admin/Dashboard/Promo-Management",
      key: "PCM",
    },
    {
      label: "Advertisement Management",
      value: "Advertisement-Management",
      icon: "fas fa-ad",
      path: "/Admin/Dashboard/Adds-Management",
      key: "ADM",
    },
    {
      label: "Marketing Offers",
      value: "Marketing-Offers",
      icon: "fas fa-gift",
      path: "/Admin/Dashboard/Marketing-Offers",
      key: "MO",
    },
    {
      label: "Notification Management",
      value: "Notification-Management",
      icon: "fas fa-bell",
      path: "/Admin/Dashboard/Notifications-Management",
      key: "NM",
    },
    {
      label: "Help & Support",
      value: "Help-and-Support",
      icon: "fas fa-hands-holding",
      path: "/Admin/Dashboard/Help&Support-Management",
      key: "HS",
    },
    {
      label: "Content Management",
      value: "Content-Management",
      icon: "fas fa-user-edit",
      path: "/Admin/Dashboard/Content-Management",
      key: "ConM",
    },
  ];

  // Filtered modules based on access
  let accessibleModules = allModules;

  if (AdminData?.access?.length > 0) {
    accessibleModules = allModules?.filter((module) =>
      AdminData.access.includes(module.value)
    );
  }

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
              <NavLink to="/Admin/Dashboard">
                <img src={require("../../assets/img/logo.png")} alt="Logo" />{" "}
              </NavLink>
            </div>
            <div className="sidebar_menus">
              <ul className="list-unstyled ps-1 m-0">
                {accessibleModules?.map((module) => (
                  <li key={module.key}>
                    <Link
                      className={SlideState === module.key ? "active" : ""}
                      to={module.path}
                      onClick={() => {
                        setSlideState(module.key);
                        if (width < 768) {
                          setSideBar(!sideBar);
                        }
                      }}
                    >
                      <i className={module.icon} />
                      {module.label}
                    </Link>
                  </li>
                ))}
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
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                  className="btn btn-secondary p-2 position-relative top-0"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="position-absolute top-0 start-0 rounded-circle w-100 h-100 "
                    src={
                      AdminData?.image
                        ? AdminData?.image
                        : require("../../assets/img/Nupload.jpg")
                    }
                    alt=""
                  />
                  Logo
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <Link
                      className={
                        AdminData?.access?.length > 0
                          ? "d-none"
                          : "dropdown-item"
                      }
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
