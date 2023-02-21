import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  useEffect(() => {
    getVendor();
  }, []);
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
  const rejectVendor = async () => {
    let id = location?.state?.id;
    const { data } = await RejectVender(id);
    if (!data.error) {
      navigate("/Admin/Dashboard/Vendor-Management", { state: { rej: "abc" } });
      Swal.fire({
        title: "Vendor Rejected!",
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
                      <img src="assets/img/profile_img1.png" alt="" />
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
                            <i
                              className="fa fa-download mx-2"
                              onClick={() => {
                                fileDownload(vendor?.trade_licence_copy);
                              }}
                            />{" "}
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
                            <i
                              className="fa fa-download mx-2"
                              onClick={() => {
                                fileDownload(vendor?.signed_contract);
                              }}
                            />{" "}
                            {vendor?.signed_contract}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 text-center mt-3">
                    <button className="comman_btn me-4" onClick={rejectVendor}>
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
    </div>
  );
};

export default PendingView;
