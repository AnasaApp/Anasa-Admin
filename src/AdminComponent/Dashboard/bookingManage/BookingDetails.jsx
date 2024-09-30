import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  changeBuyerStatus,
  getBuyerBookingDetails,
  getBuyersDetails,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import Loader from "../Loader";

const BookingDetails = () => {
  const [slide, setSlide] = useState("BM");
  const [buyerDetails, setBuyerDetails] = useState([]);
  const [booking, setBookings] = useState([]);
  const [sideBar, setSideBar] = useState();
  const [loading, setLoading] = useState(true);
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  let id = useParams();

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    await getBuyerBookingDetails(id?.id).then((res) => {
      if (!res?.data?.error) {
        setLoading(false);
      }
      getBuyersDetails(res?.data?.results?.booking?.buyer?._id).then((data) => {
        setBuyerDetails(data?.data.results?.buyer);
      });
      console.log(res);
      setBookings(res?.data?.results?.booking);
    });
  };

  const BuyerStatus = async (id) => {
    const { data } = await changeBuyerStatus(id);
    if (!data?.error) {
      Swal.fire({
        title: " Buyer Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow mb-4 toggle_set">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Buyer's Information</h2>
                  </div>
                </div>
                <div className="row">
                  <form className="row align-items-center justify-content-center form-design position-relative p-4 py-5">
                    <div className="check_toggle">
                      <input
                        type="checkbox"
                        defaultChecked={buyerDetails?.status}
                        name="check1"
                        id="check1"
                        className="d-none"
                        onClick={() => {
                          BuyerStatus(buyerDetails?._id);
                        }}
                      />
                      <label htmlFor="check1" />
                    </div>
                    <div className="col-5">
                      <div className="row adjust_margin">
                        <div className="form-group col-12 mb-2">
                          <div className="userinfor_box text-center">
                            <span className="user_imgg">
                              <img
                                src={
                                  buyerDetails?.profile_image
                                    ? buyerDetails?.profile_image
                                    : require("../../../assets/img/uploadImg.jfif")
                                }
                                alt=""
                              />
                            </span>
                            <strong>{buyerDetails?.full_name}</strong>
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
                            defaultValue={buyerDetails?.phone_number}
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
                            defaultValue={buyerDetails?.email}
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
                <div className="row">
                  <div className="col-12 px-0">
                    <ul
                      className="nav nav-tabs comman_tabs"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item w-100" role="presentation">
                        <button
                          className="nav-link active"
                          id="home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#home"
                          type="button"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true"
                        >
                          Booking Details
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        {loading ? (
                          <div className="d-flex justify-content-center py-5">
                            <Loader />
                          </div>
                        ) : (
                          <div className="row mx-0">
                            <div className="col-12 px-5 pb-4">
                              <div className="row booking_details_box mt-4">
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Booking Id:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.bookingID}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Booking Status:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Date &amp; Time:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.event_start_date?.slice(
                                          0,
                                          10
                                        )}{" "}
                                        at {booking?.event_start_time}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="col-6 py-1">
                              <div className="row mx-0">
                                <div className="col-6">
                                  <strong className="booking_head">
                                    Payment Status:
                                  </strong>
                                </div>
                                <div className="col-6">
                                  <span className="booking_head">
                                    Successful
                                  </span>
                                </div>
                              </div>
                            </div> */}

                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Event Name:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.event_name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Event Location:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        New Delhi
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        SAR:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.total}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Vendor Name:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.vendor?.full_name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 py-1">
                                  <div className="row mx-0">
                                    <div className="col-6">
                                      <strong className="booking_head">
                                        Vendor Contact Number:
                                      </strong>
                                    </div>
                                    <div className="col-6">
                                      <span className="booking_head">
                                        {booking?.vendor?.phone_number}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="">
                                  {booking?.services?.map((item, index) => (
                                    <div className=" border row">
                                      <div className="col-12 py-1">
                                        <div className="row mx-0 justify-content-between">
                                          <div className="col-6">
                                            <strong className="booking_head">
                                              Quantity:
                                            </strong>
                                          </div>
                                          <div className="col-6">
                                            <span className="booking_head">
                                              {item.service ? item?.quantity : '0'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-6 py-1">
                                        <div className="row mx-0">
                                          <div className="col-6">
                                            <strong className="booking_head">
                                              Service Name:
                                            </strong>
                                          </div>
                                          <div className="col-6">
                                            <span className="booking_head">
                                              {item?.service?.name_en}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-6 py-1">
                                        <div className="row mx-0">
                                          <div className="col-6">
                                            <strong className="booking_head">
                                              Service Description :
                                            </strong>
                                          </div>
                                          <div className="col-6">
                                            <span className="booking_head">
                                              {item?.service?.description_en}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* Modal */}
        <div
          className="modal fade reply_modal"
          id="staticBackdrop"
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
                  Chat
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body py-4">
                <div className="chatpart_main">
                  <div className="row mx-0">
                    <div className="col-12 user_chat mb-3">
                      <div className="row">
                        <div className="col text-end">
                          <div className="user_chat_box">Hello Sir</div>
                          <span className="time_chat">Jan 14th, 7:19 pm</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 admin_chat mb-3">
                      <div className="row">
                        <div className="col text-start">
                          <div className="admin_chat_box">
                            Hello Vishnu we are working on it.
                          </div>
                          <span className="time_chat">Jan 14th, 7:20 pm</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 user_chat mb-3">
                      <div className="row">
                        <div className="col text-end">
                          <div className="user_chat_box">
                            I'm Facing problem on my reservations
                          </div>
                          <span className="time_chat">Jan 14th, 7:20 pm</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 admin_chat mb-3">
                      <div className="row">
                        <div className="col text-start">
                          <div className="admin_chat_box">
                            Wait for some time we will provide solution you
                            shortly
                          </div>
                          <span className="time_chat">Jan 14th, 7:21 pm</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 user_chat mb-3">
                      <div className="row">
                        <div className="col text-end">
                          <div className="user_chat_box">Okay, Thanks</div>
                          <span className="time_chat">Jan 14th, 7:22 pm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <form className="message_send row mx-0 w-100" action="">
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Message...."
                    />
                  </div>
                  <div className="form-group col-auto ps-0">
                    <button className="send_btn" type="send">
                      <i className="fab fa-telegram-plane" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade Update_modal"
          id="staticBackdrop12"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body p-4">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
                <div className="row">
                  <div className="col-12 Update_modal_content py-4">
                    <h2>Update</h2>
                    <p>Are you sure, Want to update this?</p>
                    <a className="comman_btn mx-2" href="javscript:;">
                      Yes
                    </a>
                    <a className="comman_btn mx-2 bg-red" href="javscript:;">
                      NO
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default BookingDetails;
