import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/style.css";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Button } from "rsuite";
import { adminLogin } from "../httpServices/LoginHttpService";
import { useState } from "react";

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

const AdminLogin = () => {
  const [rememberCheck, setRememberCheck] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  let AdminData = JSON.parse(localStorage.getItem("AdminSave"));
  function togglePassword() {
    var x = document.getElementById("password-Input");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  const rememberMe = (data) => {
    localStorage.setItem("AdminSave", JSON.stringify(data));
  };
  // console.log(AdminData);

  const onSubmit = async (data) => {
    rememberCheck && rememberMe(data);
    const res = await adminLogin(data);
    if (!res?.data.error) {
      let AdminData = res?.data?.results?.verify;
      localStorage.setItem("token-admin", res.data?.results.token);
      if (AdminData?.access?.length > 0) {
        allModules?.map((itms) => {
          itms?.value === AdminData?.access?.[0] && navigate(itms?.path);
        });
      } else {
        navigate("/Admin/Dashboard");
      }
    }
  };

  return (
    <div>
      <section className="login_page">
        <div className="container-fluid px-0">
          <div className="row justify-content-start">
            <div className="col-lg-4 col-sm-12 col-auto">
              <div className="login_page_form shadow">
                <div className="row">
                  <div className="col-12 formheader mb-4">
                    <div className="text-center">
                      <img src={require("../../assets/img/logo.png")} alt="" />
                    </div>
                    <h1>Login for Admin Panel</h1>
                    <p>Please enter your email and password</p>
                  </div>
                  <div className="col-12">
                    <form
                      className="row form-design"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form-group col-12">
                        <label htmlFor="Email">Email Address</label>
                        <input
                          type="email"
                          className={classNames("form-control", {
                            "is-invalid": errors.email,
                          })}
                          id="Email"
                          placeholder="user@gmail.com"
                          name="email"
                          defaultValue={AdminData?.email}
                          {...register("email", {
                            required: "Please Enter Your Email",
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Invalid email address",
                            },
                          })}
                        />
                        {errors.email && (
                          <small className="errorText  ">
                            {errors.email?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-12">
                        <label htmlFor="password-Input">Password</label>
                        <input
                          type="password"
                          className={classNames("form-control", {
                            "is-invalid": errors.password,
                          })}
                          id="password-Input"
                          placeholder="Password"
                          name="password"
                          defaultValue={AdminData?.password}
                          {...register("password", {
                            required: "Please Enter Your Password",
                            // pattern: {
                            //   value:
                            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            //   message: "Invalid Password",
                            // },
                          })}
                        />
                        <div className="mt-2 mb-1 text-center">
                          <input
                            type="checkbox"
                            onClick={togglePassword}
                            className="showPassCheck"
                          />
                          <small className="showPass">Show Password</small>
                        </div>

                        {errors.password && (
                          <small className="errorText ">
                            {errors.password?.message}
                          </small>
                        )}
                      </div>
                      <div className=" mb-1 text-start">
                        <input
                          type="checkbox"
                          // onClick={togglePassword}
                          className="showPassCheck2"
                          id="remember"
                          onChange={() => setRememberCheck(!rememberCheck)}
                        />
                        <small className="showPass fw-bold">Remember me</small>
                      </div>
                      <div className="form-group col-12">
                        <Link
                          className="for_got mt-0"
                          to="/Admin/Forgot-password"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="form-group col-12">
                        <Button className="comman_btn" type="submit">
                          Submit
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
