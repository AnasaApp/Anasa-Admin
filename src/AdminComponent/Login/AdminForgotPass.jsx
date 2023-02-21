import React from "react";
import "../../assets/css/style.css";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { adminForgotPass } from "../httpServices/LoginHttpService";
import { useNavigate } from "react-router-dom";

const AdminForgotPass = () => {
  let navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await adminForgotPass(data);
    if (!res?.data.error) {
      navigate("/Admin/OTP-verify" , {state:{email:data}});
    }
  };

  return (
    <div>
      <section className="login_page">
        <div className="container-fluid px-0">
          <div className="row justify-content-start">
            <div className="col-4">
              <div className="login_page_form shadow">
                <div className="row">
                  <div className="col-12 formheader mb-4">
                    <div className="text-center">
                      <img src={require("../../assets/img/logo.png")} alt="" />
                    </div>
                    <h1>Forgot Password</h1>
                    <p>
                      Please enter your registered Email Address to receive the
                      OTP
                    </p>
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

export default AdminForgotPass;
