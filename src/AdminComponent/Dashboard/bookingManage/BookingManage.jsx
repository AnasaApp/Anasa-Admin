import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AllBookings,
  BookingsCount,
  CancelledBookings,
  CompletedBookings,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const BookingManage = () => {
  const [slide, setSlide] = useState("BM");
  const [allBookings, setAllBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [values, setValues] = useState({ from: "", to: "" });
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [sideBar, setSideBar] = useState();
  const [counters, setCounters] = useState();

  useEffect(() => {
    getBookings();
    getCompletedBookings();
    getCancelledBookings();
    getCounters();
  }, []);

  const getCounters = async () => {
    const { data } = await BookingsCount();
    setCounters(data?.results);
  };
  const getBookings = async () => {
    await AllBookings({ page: 1 }).then((res) => {
      setAllBookings(res?.data?.results?.bookings);
    });
  };
  const getCompletedBookings = async () => {
    await CompletedBookings({ page: 1 }).then((res) => {
      setCompletedBookings(res?.data?.results?.bookings);
    });
  };
  const getCancelledBookings = async () => {
    await CancelledBookings({ page: 1 }).then((res) => {
      setCancelledBookings(res?.data?.results?.bookings);
    });
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
      await AllBookings({
        from: values?.from,
        to: values?.to,
        page: 1,
      }).then((res) => {
        setAllBookings(res?.data?.results?.bookings);
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
  const onSearchComplete = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      await CompletedBookings({
        from: values?.from,
        to: values?.to,
        page: 1,
      }).then((res) => {
        setCompletedBookings(res?.data?.results?.bookings);
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

  const onSearchCancelled = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await CancelledBookings({
        from: values?.from,
        to: values?.to,
        page: 1,
      }).then((res) => {
        setCancelledBookings(res?.data?.results?.bookings);
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
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row vendor-management justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Booking Management</h2>
                  </div>
                </div>
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
                          onClick={() => {
                            setValues({ from: "", to: "" });
                          }}
                        >
                          All{" "}
                          <span className="circle_count">{counters?.all}</span>
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
                          onClick={() => {
                            setValues({ from: "", to: "" });
                          }}
                        >
                          Completed <span className="circle_count">{counters?.completed}</span>
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile1-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#profile1"
                          type="button"
                          role="tab"
                          aria-controls="profile1"
                          aria-selected="false"
                          onClick={() => {
                            setValues({ from: "", to: "" });
                          }}
                        >
                          Cancelled{" "}
                          <span className="circle_count">
                            {counters?.cancelled}
                          </span>
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
                            </form>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Booking ID</th>
                                        <th>Customer Name</th>
                                        <th>Vendor Name</th>
                                        <th>Booking Amount</th>
                                        <th>Scheduled for</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(allBookings || [])?.map(
                                        (item, index) => (
                                          <tr>
                                            <td>{index + 1}</td>
                                            <td>{item?.bookingID}</td>
                                            <td>{item?.buyer?.full_name}</td>
                                            <td>{item?.vendor?.full_name}</td>
                                            <td>{item?.total}</td>
                                            <td>
                                              {item?.event_date?.slice(0, 10)}
                                            </td>
                                            <td>
                                              <Link
                                                className="comman_btn2 table_viewbtn"
                                                to={`/Admin/Dashboard/Booking-Management/Booking-Details/${item?._id}`}
                                              >
                                                View
                                              </Link>
                                            </td>
                                          </tr>
                                        )
                                      )}
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
                                <button
                                  className="comman_btn2"
                                  onClick={onSearchComplete}
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
                            </form>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Booking ID</th>
                                        <th>Customer Name</th>
                                        <th>Vendor Name</th>
                                        <th>Booking Amount</th>
                                        <th>Scheduled for</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(completedBookings || [])?.map(
                                        (item, index) => (
                                          <tr>
                                            <td>{index + 1}</td>
                                            <td>{item?.bookingID}</td>
                                            <td>{item?.buyer?.full_name}</td>
                                            <td>{item?.vendor?.full_name}</td>
                                            <td>{item?.total}</td>
                                            <td>
                                              {item?.event_date?.slice(0, 10)}
                                            </td>
                                            <td>
                                              <Link
                                                className="comman_btn2 table_viewbtn"
                                                to={`/Admin/Dashboard/Booking-Management/Booking-Details/${item?._id}`}
                                              >
                                                View
                                              </Link>
                                            </td>
                                          </tr>
                                        )
                                      )}
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
                        id="profile1"
                        role="tabpanel"
                        aria-labelledby="profile1-tab"
                      >
                        <div className="row mx-0">
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
                                <button
                                  className="comman_btn2"
                                  onClick={onSearchCancelled}
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
                            </form>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Booking ID</th>
                                        <th>Customer Name</th>
                                        <th>Vendor Name</th>
                                        <th>Booking Amount</th>
                                        <th>Scheduled for</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(cancelledBookings || [])?.map(
                                        (item, index) => (
                                          <tr>
                                            <td>{index + 1}</td>
                                            <td>{item?.bookingID}</td>
                                            <td>{item?.buyer?.full_name}</td>
                                            <td>{item?.vendor?.full_name}</td>
                                            <td>{item?.total}</td>
                                            <td>{item?.event_date}</td>
                                            <td>
                                              <Link
                                                className="comman_btn2 table_viewbtn"
                                                to={`/Admin/Dashboard/Booking-Management/Booking-Details/${item?._id}`}
                                              >
                                                View
                                              </Link>
                                            </td>
                                          </tr>
                                        )
                                      )}
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
    </div>
  );
};

export default BookingManage;
