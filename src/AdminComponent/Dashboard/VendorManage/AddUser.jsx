import classNames from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddVendor } from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const AddUser = () => {
  const [slide, setSlide] = useState("VM");
  const [sideBar, setSideBar] = useState();
  const [files, setFiles] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onFileSelection = (e, key) => {
    console.log(e);
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const onSave = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("shop_cover_image", files?.shop_cover_image);
    formData.append("full_name", data?.full_name.trim());
    formData.append("shop_name", data?.shop_name.trim());
    formData.append("shop_address", data?.shop_address.trim());
    formData.append("phone_number", data?.phone_number);
    formData.append("customer_contact_number", data?.customer_contact_number);
    formData.append("city", data?.city.trim());
    formData.append("building_name", data?.building_name?.trim());
    formData.append("country_code", data?.country_code);
    formData.append("locality", data?.locality.trim());
    formData.append("service_radius", data?.service_radius.trim());
    formData.append("email", data?.email.trim());
    formData.append("signed_contract", files?.signed_contract);
    formData.append("trade_licence_copy", files?.trade_licence_copy);
    await AddVendor(formData).then((res) => {
      console.log(res.data);
      if (res.data.message === "Vendor Created Successfully") {
        Swal.fire({
          title: "Vendor Created Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
        navigate("/Admin/Dashboard/Vendor-Management");
      }
    });
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row vendor-management justify-content-center">
          <div className="col-12 design_outter_comman recent_orders shadow">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Add Vendor User</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-4 Pending-view-main">
                <form
                  className="row py-2 form-design "
                  onSubmit={handleSubmit(onSave)}
                >
                  <div className="form-group col-4 mb-4 choose_file position-relative">
                    <span>Upload Image</span>{" "}
                    <label htmlFor="upload_video">
                      <i className="fal fa-camera me-1" />
                      Choose File
                    </label>
                    <input
                      type="file"
                      className={classNames("form-control", {
                        "is-invalid": errors.shop_cover_image,
                      })}
                      accept="image/*"
                      name="shop_cover_image"
                      id="upload_video"
                      {...register("shop_cover_image", {
                        required: "*Please Upload Image!",
                      })}
                      onChange={(e) => onFileSelection(e, "shop_cover_image")}
                    />
                    {errors.shop_cover_image && (
                      <small className="errorText text-start">
                        {errors.shop_cover_image?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Vendor's Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.full_name,
                      })}
                      name="full_name"
                      id="name"
                      {...register("full_name", {
                        required: "*Vendor Name is Required!",
                        pattern: {
                          value: /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/, 
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "maximium 20 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in Vendor Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.full_name && (
                      <small className="errorText mx-1">
                        {errors.full_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Mobile Number</label>
                    <input
                      type="number"
                      className={classNames("form-control ", {
                        "is-invalid": errors.phone_number,
                      })}
                      name="phone_number"
                      id="name"
                      {...register("phone_number", {
                        required: "*Phone Number is Required!",

                        maxLength: {
                          value: 12,
                          message: "maximium 12 Characters",
                        },
                        minLength: 10,
                      })}
                    />
                    {errors.phone_number && (
                      <small className="errorText mx-1 ">
                        {errors.phone_number?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Shop Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.shop_name,
                      })}
                      name="shop_name"
                      id="name"
                      {...register("shop_name", {
                        required: "*Shop Name is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 20,
                          message: "maximium 20 Characters",
                        },
                        minLength: {
                          value: 5,
                          message: "Minimium 4 letters Should be in Shop Name", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.shop_name && (
                      <small className="errorText mx-1 ">
                        {errors.shop_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Email Id</label>
                    <input
                      type="email"
                      className={classNames("form-control ", {
                        "is-invalid": errors.email,
                      })}
                      name="email"
                      id="name"
                      {...register("email", {
                        required: "*Email is Required!",
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid email address!",
                        },
                        maxLength: {
                          value: 30,
                          message: "maximium 30 Characters",
                        },
                      })}
                    />
                    {errors.email && (
                      <small className="errorText mx-1 ">
                        {errors.email?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Customer Contact Number</label>
                    <input
                      type="number"
                      className={classNames("form-control ", {
                        "is-invalid": errors.customer_contact_number,
                      })}
                      name="customer_contact_number"
                      id="name"
                      {...register("customer_contact_number", {
                        required: "*Contact Number is Required!",

                        maxLength: {
                          value: 12,
                          message: "maximium 12 Characters",
                        },
                        minLength: 10,
                      })}
                    />
                    {errors.customer_contact_number && (
                      <small className="errorText mx-1 ">
                        {errors.customer_contact_number?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Shop Address</label>
                    <input
                      type="text"
                      className={classNames("form-control ", {
                        "is-invalid": errors.shop_address,
                      })}
                      name="shop_address"
                      id="name"
                      {...register("shop_address", {
                        required: "*Shop Address is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character not allowed!",
                        },
                        maxLength: {
                          value: 80,
                          message: "maximium 80 Characters",
                        },
                        minLength: {
                          value: 6,
                          message: "Minimium 6 letters Should be in Address!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.shop_address && (
                      <small className="errorText mx-1">
                        {errors.shop_address?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Building Name</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.building_name,
                      })}
                      name="building_name"
                      id="name"
                      {...register("building_name", {
                        required: "*Building Name is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 50,
                          message: "maximium 50 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in building Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.building_name && (
                      <small className="errorText mx-1 ">
                        {errors.building_name?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Locality</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.locality,
                      })}
                      name="locality"
                      id="name"
                      {...register("locality", {
                        required: "*Locality is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "*Special Character not allowed!",
                        },
                        maxLength: {
                          value: 50,
                          message: "maximium 50 Characters",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Minimium 3 letters Should be in locality Name!", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    />
                    {errors.locality && (
                      <small className="errorText mx-1 ">
                        {errors.locality?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">City</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.city,
                      })}
                      name="city"
                      id="name"
                      {...register("city", {
                        required: "*City is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 30,
                          message: "maximium 30 Characters",
                        },
                      })}
                    />
                    {errors.city && (
                      <small className="errorText mx-1 ">
                        {errors.city?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Country</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.country,
                      })}
                      name="country"
                      id="name"
                      {...register("country", {
                        required: "*Country is Required!",
                        pattern: {
                          value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                          message: "Special Character is not allowed!",
                        },
                        maxLength: {
                          value: 30,
                          message: "maximium 30 Characters",
                        },
                      })}
                    />
                    {errors.country && (
                      <small className="errorText mx-1 ">
                        {errors.country?.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 mb-4">
                    <label htmlFor="">Serviceable Radius</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.service_radius,
                      })}
                      name="service_radius"
                      id="name"
                      {...register("service_radius", {
                        required: "*Radius is Required!",
                        maxLength: {
                          value: 3,
                          message: "Maximium 2 Characters!",
                        },
                      })}
                    />
                    {errors.service_radius && (
                      <small className="errorText mx-1 ">
                        {errors.service_radius?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div
                      className={
                        errors.trade_licence_copy
                          ? "row view-inner-box border mx-0 w-100 border border-danger"
                          : "row view-inner-box border mx-0 w-100"
                      }
                    >
                      <span>Trade Licence Copy:</span>
                      <div className="col img_box_show">
                        {errors.trade_licence_copy && (
                          <small className="errorText mx-1 ">
                            {errors.trade_licence_copy?.message}
                          </small>
                        )}
                        <input
                          className="d-none"
                          type="file"
                          id="file1"
                          name="trade_licence_copy"
                          {...register("trade_licence_copy", {
                            required: "*Licence is Required!",
                          })}
                          onChange={(e) =>
                            onFileSelection(e, "trade_licence_copy")
                          }
                        />

                        <label htmlFor="file1">
                          <div className="">
                            {files.trade_licence_copy ? (
                              <p>
                                <i class="fa-solid fa-square-check" />
                                {files.trade_licence_copy?.name}
                              </p>
                            ) : (
                              <p>
                                <i className="fa fa-download" /> Upload File
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div
                      className={
                        errors.signed_contract
                          ? "row view-inner-box border mx-0 w-100 border border-danger"
                          : "row view-inner-box border mx-0 w-100"
                      }
                    >
                      <span>Signed Contract:</span>
                      <div className="col img_box_show">
                        {errors.signed_contract && (
                          <small className="errorText mx-1 ">
                            {errors.signed_contract?.message}
                          </small>
                        )}
                        <input
                          className="d-none"
                          type="file"
                          id="file2"
                          name="signed_contract"
                          {...register("signed_contract", {
                            required: "*Licence is Required!",
                          })}
                          onChange={(e) =>
                            onFileSelection(e, "signed_contract")
                          }
                        />
                        <label htmlFor="file2">
                          <div className="">
                            {files.signed_contract ? (
                              <p>
                                <i class="fa-solid fa-square-check" />
                                {files.signed_contract?.name}
                              </p>
                            ) : (
                              <p>
                                <i className="fa fa-download" /> Upload File
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button className="comman_btn2" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
