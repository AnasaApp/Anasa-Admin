import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getVendorDetails } from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const ReturnedView = () => {
  const [slide, setSlide] = useState("VM");
  const [vendor, setVendor] = useState();
  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState();
  let location = useLocation();

  useEffect(() => {
    getVendor();
  }, []);

  const getVendor = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorDetails(id, { status: "RETURNED" });
    setVendor(data?.results.vendor);
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
                <h2>Vendor Returned Details</h2>
              </div>
              <div className="col-auto text-end">
                <div className="Status_box">
                  Status: <strong>Returned</strong>
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
                      <span>Signed Contract:</span>
                      <div className="col img_box_show">
                        <input
                          className="d-none"
                          type="file"
                          id="file1"
                          name="file"
                        />
                        <label htmlFor="file1">
                          <div className="licence_id">
                            <i className="fa fa-download" />{" "}
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
                        <input
                          className="d-none"
                          type="file"
                          id="file1"
                          name="file"
                        />
                        <label htmlFor="file1">
                          <div className="licence_id">
                            <i className="fa fa-download" />{" "}
                            {vendor?.signed_contract}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-12 text-center mt-3">
                    <button className="comman_btn me-4">Return</button>
                    <button className="comman_btn2">Approve</button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnedView;
