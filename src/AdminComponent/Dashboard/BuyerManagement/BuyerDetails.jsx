import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AllBookings,
  changeBuyerStatus,
  getBuyerBookings,
  getBuyersDetails,
  getBuyerSupport,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
const BuyerDetails = () => {
  const [slide, setSlide] = useState("BuyM");
  const [values, setValues] = useState({ from: "", to: "" });
  const [buyerDetails, setBuyerDetails] = useState([]);
  const [booking, setBookings] = useState([]);
  let location = useLocation();
  const [sideBar, setSideBar] = useState();
  const [support, setSupport] = useState();

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  console.log(location.state?.id);
  useEffect(() => {
    getBuyer();
    getBookings();
    getChatSupport();
  }, []);

  const getBuyer = async () => {
    let id = location.state?.id;
    const { data } = await getBuyersDetails(id);

    setBuyerDetails(data?.results?.buyer);
  };
  const getChatSupport = async () => {
    let id = location.state?.id;
    await getBuyerSupport(id).then((res) => {
      setSupport(res?.data?.results.support);
    });
  };
  const getBookings = async () => {
    let id = location.state?.id;
    const { data } = await getBuyerBookings(id);
    setBookings(data?.results?.bookings);
  };
  const BuyerStatus = async (id) => {
    const { data } = await changeBuyerStatus(id);
    if (!data?.error) {
      getBuyer();
      Swal.fire({
        title: " Buyer Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };
  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const onSearch = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await AllBookings({
        from: values?.from,
        to: values?.to,
        page: 1,
      });
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

  const onSearchSupport = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await getBuyerSupport({
        from: values?.from,
        to: values?.to,
        page: 1,
      });
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
                      <li className="nav-item" role="presentation">
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
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#profile"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                        >
                          Help &amp; Support
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
                        <div className="row mx-0">
                          <div className="col-12">
                            {/* <form
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
                                <button
                                  className="comman_btn2"
                                  onClick={onSearch}
                                >
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
                            </form> */}
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
                                      {(booking || [])?.map((item, index) => (
                                        <tr key={index}>
                                          <td>{index + 1}.</td>
                                          <td>{item?.bookingID}</td>
                                          <td>
                                            <Link
                                              className="comman_btn2 table_viewbtn"
                                              to={`/Admin/Dashboard/Booking-Management/Booking-Details/${item?._id}`}
                                            >
                                              View
                                            </Link>
                                          </td>
                                          <td>{item?.total} /- </td>
                                          <td>
                                            {item?.createdAt?.slice(0, 10)}
                                          </td>
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
                      <div
                        className="tab-pane fade"
                        id="profile"
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                      >
                        <div className="row mx-0">
                          <div className="col-12">
                            {/* <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action=""
                            >
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">From</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="from"
                                  id="chatFrom"
                                  value={values.from}
                                  onChange={handleDate}
                                />
                              </div>
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">To</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="chatTo"
                                  value={values.to}
                                  onChange={handleDate}
                                />
                              </div>
                              <div className="form-group mb-0 col-auto">
                                <button
                                  className="comman_btn2"
                                  onClick={onSearchSupport}
                                >
                                  Search
                                </button>
                              </div>
                            </form> */}
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>E-mail</th>
                                        <th>Subject</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(support || [])?.map((item, index) => (
                                        <tr>
                                          <td>{index + 1}</td>
                                          <td>{item?.email}</td>
                                          <td>{item?.subject}</td>
                                          <td>Lorem ipsum dolor sit amet</td>
                                          <td>March 28,2022</td>
                                          <td>
                                            <div className="check_toggle">
                                              <input
                                                type="checkbox"
                                                name="checkv1"
                                                id="checkv1"
                                                className="d-none"
                                              />
                                              <label
                                                data-bs-toggle="modal"
                                                data-bs-target="#staticBackdrop12"
                                                htmlFor="checkv1"
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop"
                                              className="comman_btn table_viewbtn"
                                              href="javscript:;"
                                            >
                                              View
                                            </a>
                                            <a
                                              className="comman_btn2 table_viewbtn bg-red"
                                              href="javscript:;"
                                            >
                                              Delete
                                            </a>
                                          </td>
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

export default BuyerDetails;
