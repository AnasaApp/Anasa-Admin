import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import {
  getVendorBooking,
  getVendorDetails,
  getVendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const ApprovedView = () => {
  const [slide, setSlide] = useState("VM");
  const [vendor, setVendor] = useState();
  const [sideBar, setSideBar] = useState();
  const [vendorBooking, setVendorBooking] = useState();
  const [values, setValues] = useState({ from: "", to: "" });
  const navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    getVendor();
    GetVendorBooking();
  }, []);
  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };
  const getVendor = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorDetails(id, { status: "APPROVED" });
    setVendor(data?.results.vendor);
  };
  const GetVendorBooking = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorBooking(id);
    setVendorBooking(data?.results.bookings);
  };
  

  const onSearchBookings = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await getVendorBooking({
        from: values?.from,
        to: values?.to,
        status: "APPROVED",
        page: 1,
      });
      setVendorBooking(data?.results.vendor);

      setValues({ from: "", to: "" });
    } else {
      e.preventDefault();
      Swal.fire({
        title: "Please select a Date range!",
        icon: "warning",
        button: "ok",
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
                <h2>Vendor Approved Details</h2>
              </div>
              <div className="col-auto text-end">
                <div className="Status_box">
                  Status: <strong>Active</strong>
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
                        <label htmlFor="file1">
                          <div className="licence_id">
                            {vendor?.signed_contract ? (
                              <i
                                class="fa fa-eye preview_icon"
                                onClick={() => preview(vendor?.signed_contract)}
                              ></i>
                            ) : null}
                            <i
                              className="fa fa-download mx-4"
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
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <div className="col">
                        <Link
                          to={`/Admin/Dashboard/Vendor-Management/Services/${vendor?._id}`}
                        >
                          <strong>Go to Listed Services</strong>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 design_outter_comman recent_orders shadow">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Booking Details</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <form
                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                  action=""
                >
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">From</label>
                    <input
                      type="date"
                      className="form-control"
                      name="from"
                      id="appFrom"
                      value={values.from}
                      onChange={handleDate}
                    />
                  </div>
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">To</label>
                    <input
                      type="date"
                      className="form-control"
                      name="to"
                      id="appTo"
                      value={values.to}
                      onChange={handleDate}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button className="comman_btn2" onClick={onSearchBookings}>
                      Search
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="Resets"
                    >
                      Search
                    </button>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Booking Id</th>
                            <th>Booking Details</th>
                            <th>Amount</th>
                            <th>Booking Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorBooking?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item?.bookingID}</td>
                              <td>
                                <a
                                  className="comman_btn2 table_viewbtn"
                                  href="booking-details.html"
                                >
                                  View
                                </a>
                              </td>
                              <td>{item?.total} /- </td>
                              <td>{item?.createdAt?.slice(0, 10)}</td>
                              <td>{item?.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default ApprovedView;
