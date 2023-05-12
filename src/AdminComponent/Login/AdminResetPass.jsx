import React from "react";
import { useForm } from "react-hook-form";
import "../../assets/css/style.css";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adminResetPassword } from "../httpServices/LoginHttpService";

const AdminResetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let location = useLocation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    if (
      data?.ConfirmPassword !== data?.NewPassword &&
      data?.NewPassword !== data?.ConfirmPassword
    ) {
      Swal.fire({
        title: "Error",
        text: "Confirm password should be same as New password",
        icon: "warning",
        button: "ok",
        confirmButtonColor: "#e25829",
      });
    }
    if (
      data?.ConfirmPassword === data?.NewPassword &&
      data?.NewPassword === data?.ConfirmPassword
    ) {
      let formData = {
        email: location?.state?.email,
        password: data?.ConfirmPassword,
      };
      const res = await adminResetPassword(formData);
      if (!res?.data.error) {
        navigate("/Admin/Login");
      }
    }
  };

  function togglePassword() {
    var x = document.getElementById("password-Input");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  function togglePassword2() {
    var x = document.getElementById("password-Input2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
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
                    <h1>Reset Password</h1>
                  </div>
                  <div className="col-12">
                    <form
                      className="row form-design"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form-group col-12">
                        <label htmlFor="password-Input">New Password</label>
                        <input
                          type="password"
                          className={classNames("form-control", {
                            "is-invalid": errors.NewPassword,
                          })}
                          id="password-Input"
                          placeholder="*********"
                          name="NewPassword"
                          {...register("NewPassword", {
                            required: "Please Enter New Password",
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message:
                                "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (example:anasa123@)",
                            },
                          })}
                        />
                        <input
                          type="checkbox"
                          onClick={togglePassword}
                          className="showPassCheck"
                        />
                        <small className=" showPass">Show Password</small>
                        <br />
                        {errors.NewPassword && (
                          <small className="errorText ">
                            {errors.NewPassword?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-12">
                        <label htmlFor="password-Input2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className={classNames("form-control", {
                            "is-invalid": errors.ConfirmPassword,
                          })}
                          id="password-Input2"
                          placeholder="*********"
                          name="ConfirmPassword"
                          {...register("ConfirmPassword", {
                            required: "Please Enter Confirm Password",
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message:
                                "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (example:anasa123@)",
                            },
                          })}
                        />
                        <input
                          type="checkbox"
                          onClick={togglePassword2}
                          className="showPassCheck"
                        />
                        <small className=" showPass">Show Password</small>
                        <br />
                        {errors.ConfirmPassword && (
                          <small className="errorText ">
                            {errors.ConfirmPassword?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-12">
                        <button className="comman_btn" type="submit">
                          Submit
                        </button>
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

export default AdminResetPass;
