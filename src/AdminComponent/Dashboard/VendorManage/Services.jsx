import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getVendorDetails,
  getVendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const Services = () => {
  const [vendorService, setVendorService] = useState();
  const [slide, setSlide] = useState("VM");
  const [sideBar, setSideBar] = useState();
  const [vendor, setVendor] = useState();
  let id = useParams();
  console.log(id);
  useEffect(() => {
    GetVendorServices();
    GetVendor();
  }, []);

  const GetVendor = async () => {
    const { data } = await getVendorDetails(id?.id, { status: "APPROVED" });
    setVendor(data?.results.vendor);
  };

  const GetVendorServices = async () => {
    const { data } = await getVendorServices(id?.id);
    setVendorService(data?.results.services);
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row service-management justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow mb-4 toggle_set">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Vendor Details</h2>
                  </div>
                </div>
                <div className="row">
                  <form className="row align-items-center justify-content-center form-design position-relative p-4 py-5">
                    <div className="col-5">
                      <div className="row adjust_margin">
                        <div className="form-group col-12 mb-2">
                          <div className="userinfor_box text-center">
                            <span className="user_imgg">
                              <img
                                src={
                                  vendor?.shop_cover_image
                                    ? vendor?.shop_cover_image
                                    : require("../../../assets/img/uploadImg.jfif")
                                }
                                alt=""
                              />
                            </span>
                            <strong>{vendor?.full_name}</strong>
                          </div>
                        </div>
                        {/* <div class="form-group col-12 text-center mb-0">
                                    <label class="mb-0 text-center" for="">Registration Date: 01/01/2022</label>
                                 </div> */}
                      </div>
                    </div>
                    <div className="col-5">
                      <div className="row">
                        <div className="form-group col-12">
                          <label htmlFor="">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={vendor?.phone_number}
                            name="name"
                            id="name"
                            disabled
                          />
                        </div>
                        <div className="form-group col-12 mb-0">
                          <label htmlFor="">Email Id </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={vendor?.email}
                            name="name"
                            id="name"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-auto" />
                  </form>
                </div>
              </div>
              <div className="col-12 design_outter_comman shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Service Details</h2>
                  </div>
                </div>
                <div className="row mx-0">
                  {vendorService?.length ? (
                    <div className="col-12 px-4 pb-4">
                      {vendorService?.map((item, index) => (
                        <div
                          className="row booking_details_box mt-4"
                          key={index}
                        >
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Service Name :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Customization :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.customization ? "YES" : "NO"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Category :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.category?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-2">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Sub Category :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.subCategory?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">SAR :</strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Price :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Description :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.description_en}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="col-12 px-4 pb-4">
                      <h6 className="mt-4">NO SERIVICES FOUND.... </h6>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
