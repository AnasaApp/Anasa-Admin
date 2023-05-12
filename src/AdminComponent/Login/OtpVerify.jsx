import React, { useEffect, useState } from "react";
import "../../assets/css/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { adminVerifyOtp } from "../httpServices/LoginHttpService";
import OtpInput from "react-otp-input";

const OtpVerify = () => {
  const [value, setValue] = useState("");
  const [counter, setCounter] = useState(0);
  let location = useLocation();
  let navigate = useNavigate();
  console.log(location?.state?.email);
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const VerifyOtp = async (e) => {
    e.preventDefault();
    const formData = {
      email: location?.state?.email?.email,
      otp: value,
    };
    const res = await adminVerifyOtp(formData);
    if (!res?.data.error) {
      navigate("/Admin/Reset-password", {
        state: { email: location?.state?.email?.email },
      });
    }
  };
  const ResendOtp = async (e) => {
    setCounter(60);
    e.preventDefault();
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
                    <h1>Verification</h1>
                    <p>Please enter the OTP received on your Email Address </p>
                  </div>
                  <div className="col-12">
                    <form className="row form-design otp__content " action="">
                      <div className=" form-group col-12 d-flex justify-content-center mt-2 mb-1">
                        <div>
                          <OtpInput
                            value={value}
                            onChange={setValue}
                            numInputs={4}
                            onChangeRegex={/^([0-9]{0,})$/}
                            separator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                            isInputNum
                            inputStyle="otp-field__input "
                            containerStyle="form-group "
                          />
                        </div>
                      </div>
                      <div className="form-group col-12 text-center">
                        {counter ? (
                          <span className="count_Sec"> 00:{counter}</span>
                        ) : null}
                      </div>
                      <div className="form-group col-12 text-center">
                        <label className="text-center" htmlFor="">
                          Didn't received the OTP?
                          {counter ? (
                            <span
                              className="otp-sec mx-1 text-dark"
                              id="resendOTP"
                              onClick={ResendOtp}
                            >
                              Check Your Email.
                            </span>
                          ) : (
                            <span
                              className="otp-sec mx-1 text-primary"
                              id="resendOTP"
                              onClick={ResendOtp}
                              style={{ cursor: "pointer" }}
                            >
                              Request again
                            </span>
                          )}
                        </label>
                      </div>
                      <div className="form-group col-12 text-center">
                        <button className="comman_btn" onClick={VerifyOtp}>
                          Verify
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

export default OtpVerify;
