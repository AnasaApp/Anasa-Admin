import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { saveAs } from "file-saver";
import {
  ApproveVender,
  getVendorDetails,
  RejectVender,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const PendingView = () => {
  const [slide, setSlide] = useState("VM");
  const [sideBar, setSideBar] = useState();
  const [vendor, setVendor] = useState();
  const navigate = useNavigate();
  let location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    getVendor();
  }, []);

  const onSubmit = async (info) => {
    let id = location?.state?.id;

    const { data } = await RejectVender(id, {
      trade_licence_copy: info?.tradeLicenceCopy,
      signed_contract: info?.signedContract,
      locality: info?.locality,
      shop_address: info?.shopAddress,
      shop_name: info?.shopName,
      city: info?.city,
      country: info?.Country,
      service_radius: info?.serviceableRadius,
      reason: info?.reason,
      customer_contact_number: info?.customerContactNumber,
      phone_number: info?.phoneNumber,
    });
    if (!data.error) {
      navigate("/Admin/Dashboard/Vendor-Management", { state: { rej: "abc" } });
      document?.getElementById("modal-close").click();
      Swal.fire({
        title: "Vendor Rejected!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };
  const getVendor = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorDetails(id, { status: "PENDING" });
    setVendor(data?.results.vendor);
  };
  const approveVendor = async () => {
    let id = location?.state?.id;
    const { data } = await ApproveVender(id);
    if (!data.error) {
      navigate("/Admin/Dashboard/Vendor-Management");
      Swal.fire({
        title: "Vendor Approved!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };
  const fileDownload = (url) => {
    saveAs(url);
  };
  const preview = (id) => {
    document.getElementById("preview_modal").click();
    document.getElementById("preview_images").src = id;
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
          <div className="col-12 design_outter_comman recent_orders shadow mb-4">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Vendor Pending Details</h2>
              </div>
              <div className="col-auto text-end">
                <div className="Status_box">
                  Status: <strong>Pending</strong>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-4 ">
                <div className="row py-2">
                  <div className="col-12 text-center mb-4">
                    <div className="Pending-view_img">
                      <img
                        src={
                          vendor?.shop_cover_image
                            ? vendor?.shop_cover_image
                            : require("../../../assets/img/uploadImg.jfif")
                        }
                        alt=""
                      />
                    </div>
                    <h4 className="user_name">{vendor?.full_name}</h4>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Mobile Number:</span>
                      <div className="col">
                        <strong>{vendor?.phone_number}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Shop Name:</span>
                      <div className="col">
                        <strong>{vendor?.shop_name}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Email Id:</span>
                      <div className="col">
                        <strong>{vendor?.email}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Customer Contact Number:</span>
                      <div className="col">
                        <strong>{vendor?.customer_contact_number}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Shop Address:</span>
                      <div className="col">
                        <strong>{vendor?.shop_address}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Building Name:</span>
                      <div className="col">
                        <strong>{vendor?.building_name}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Locality:</span>
                      <div className="col">
                        <strong>{vendor?.locality}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>City:</span>
                      <div className="col">
                        <strong>{vendor?.city}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Country:</span>
                      <div className="col">
                        <strong>{vendor?.country}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Serviceable Radius:</span>
                      <div className="col">
                        <strong>{vendor?.service_radius}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Trade Licence copy:</span>
                      <div className="col img_box_show">
                        <label htmlFor="file1">
                          <div className="licence_id">
                            {vendor?.trade_licence_copy ? (
                              <i
                                class="fa fa-eye preview_icon"
                                onClick={() =>
                                  preview(vendor?.trade_licence_copy)
                                }
                              ></i>
                            ) : null}
                            {vendor?.trade_licence_copy ? (
                              <i
                                className="fa fa-download mx-4 mt-2"
                                onClick={() => {
                                  fileDownload(vendor?.trade_licence_copy);
                                }}
                              />
                            ) : (
                              <i
                                className="fa fa-upload mx-4 mt-2"
                                onClick={() => {
                                  fileDownload(vendor?.trade_licence_copy);
                                }}
                              />
                            )}{" "}
                            {vendor?.trade_licence_copy}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Signed Contract:</span>
                      <div className="col img_box_show">
                        <label htmlFor="file1 ">
                          <div className="licence_id">
                            {vendor?.signed_contract ? (
                              <i
                                class="fa fa-eye preview_icon"
                                onClick={() => preview(vendor?.signed_contract)}
                              ></i>
                            ) : null}
                            {vendor?.signed_contract ? (
                              <i
                                className="fa fa-download mx-4 mt-2"
                                onClick={() => {
                                  fileDownload(vendor?.signed_contract);
                                }}
                              />
                            ) : (
                              <i
                                className="fa fa-upload mx-4 mt-2"
                                onClick={() => {
                                  fileDownload(vendor?.signed_contract);
                                }}
                              />
                            )}{" "}
                            {vendor?.signed_contract}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 text-center mt-3">
                    <button
                      className="comman_btn me-4"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop21"
                    >
                      Return
                    </button>
                    <button className="comman_btn2" onClick={approveVendor}>
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary d-none"
        id="preview_modal"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header comman_modal">
              <h5 class="modal-title">Preview</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <img
                src={vendor?.trade_licence_copy}
                className="preview_image"
                id="preview_images"
              ></img>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop21"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Return Reason
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-close"
              />
            </div>
            <div className="modal-body bg-light border rounded">
              <div className="container ">
                <div className="row justify-content-center ">
                  <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="fw-bold">Enter Reason :</h5>

                    <textarea
                      className="w-100 fs-6 p-2"
                      style={{ height: "8rem" }}
                      name="reason"
                      {...register("reason")}
                    />

                    <div className="row text-start mt-3 return_Reason">
                      <h6 className="mb-2">Choose Invalid Fields :</h6>
                      <div className="col-md-6">
                        <ul className="list-group ">
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="vendorName"
                                {...register("vendorName")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Vendor Name
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="shopName"
                                {...register("shopName")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Shop Name
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="shopAddress"
                                {...register("shopAddress")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Shop Address
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="city"
                                {...register("city")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                htmlFor="flexCheckDefault"
                              >
                                City
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="phoneNumber"
                                {...register("phoneNumber")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Mobile Number
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="locality"
                                {...register("locality")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Locality
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-group">
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="Country"
                                {...register("Country")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Country
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="serviceableRadius"
                                {...register("serviceableRadius")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Serviceable Radius
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="tradeLicenceCopy"
                                {...register("tradeLicenceCopy")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                htmlFor="flexCheckDefault"
                              >
                                Trade Licence Copy
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="signedContract"
                                {...register("signedContract")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Signed Contract
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="customerContactNumber"
                                {...register("CustomerContactNumber")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault"
                              >
                                Customer Contact Number
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-12 text-center mt-4">
                        <button className="comman_btn2 rounded" type="submit">
                          Send To Email
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingView;
