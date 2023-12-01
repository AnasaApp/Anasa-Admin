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
import { MDBDataTable } from "mdbreact";
import moment from "moment";
import Loader from "../Loader";

const BookingManage = () => {
  const [slide, setSlide] = useState("BM");
  const [allBookings, setAllBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [values, setValues] = useState({ from: "", to: "" });
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [sideBar, setSideBar] = useState();
  const [counters, setCounters] = useState();
  const [loading, setLoading] = useState(true);

  const [allBook, setAllBook] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "BOOKING ID",
        field: "booking_id",
        sort: "asc",
        width: 100,
      },

      {
        label: "BUYER NAME",
        field: "name_buyer",
        sort: "asc",
        width: 100,
      },
      {
        label: "VENDOR NAME",
        field: "name_vendor",
        sort: "asc",
        width: 100,
      },
      {
        label: "AMOUNT",
        field: "number",
        sort: "asc",
        width: 100,
      },
      {
        label: "SCHEDULED FOR",
        field: "date",
        sort: "asc",
        width: 100,
      },
      {
        label: "ACTION",
        field: "action",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });
  const [completeBook, setCompleteBook] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "BOOKING ID",
        field: "booking_id",
        sort: "asc",
        width: 100,
      },

      {
        label: "BUYER NAME",
        field: "name_buyer",
        sort: "asc",
        width: 100,
      },
      {
        label: "VENDOR NAME",
        field: "name_vendor",
        sort: "asc",
        width: 100,
      },
      {
        label: "AMOUNT",
        field: "number",
        sort: "asc",
        width: 100,
      },
      {
        label: "Payout",
        field: "payout",
        sort: "asc",
        width: 100,
      },
      {
        label: "SCHEDULED FOR",
        field: "date",
        sort: "asc",
        width: 100,
      },
      {
        label: "ACTION",
        field: "action",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });
  const [cancelledBook, setCancelledBook] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "BOOKING ID",
        field: "booking_id",
        sort: "asc",
        width: 100,
      },

      {
        label: "BUYER NAME",
        field: "name_buyer",
        sort: "asc",
        width: 100,
      },
      {
        label: "VENDOR NAME",
        field: "name_vendor",
        sort: "asc",
        width: 100,
      },
      {
        label: "AMOUNT",
        field: "number",
        sort: "asc",
        width: 100,
      },
      {
        label: "SCHEDULED FOR",
        field: "date",
        sort: "asc",
        width: 100,
      },
      {
        label: "ACTION",
        field: "action",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });
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
    const { data } = await AllBookings({ page: 1 });
    const newRows = [];
    if (!data.error) {
      setLoading(false);
      let values = data?.results?.bookings;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.booking_id = list?.bookingID;
        returnData.name_buyer = list?.buyer?.full_name;
        returnData.name_vendor = list?.vendor?.full_name;
        returnData.number = list?.total;
        returnData.date = moment(list?.event_start_date).format("MM/DD/YYYY");
        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
              // state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setAllBook({ ...allBook, rows: newRows });
    }
  };
  const getCompletedBookings = async () => {
    const { data } = await CompletedBookings({ page: 1 });
    const newRows = [];
    if (!data.error) {
      setLoading(false);
      let values = data?.results?.bookings;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.booking_id = list?.bookingID;
        returnData.name_buyer = list?.buyer?.full_name;
        returnData.name_vendor = list?.vendor?.full_name;
        returnData.number = list?.total;
        returnData.payout = "5000";
        returnData.date = moment(list?.event_start_date).format("L");
        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
              // state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setCompleteBook({ ...completeBook, rows: newRows });
    }
  };
  const getCancelledBookings = async () => {
    const { data } = await CancelledBookings({ page: 1 });
    const newRows = [];
    if (!data.error) {
      setLoading(false);
      let values = data?.results?.bookings;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.booking_id = list?.bookingID;
        returnData.name_buyer = list?.buyer?.full_name;
        returnData.name_vendor = list?.vendor?.full_name;
        returnData.number = list?.total;
        returnData.date = moment(list?.event_start_date).format("L");
        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
              // state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setCancelledBook({ ...cancelledBook, rows: newRows });
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
      await AllBookings({
        from: values?.from,
        to: values?.to,
        page: 1,
      }).then((res) => {
        const newRows = [];
        if (!res.data?.error) {
          let values = res?.data?.results?.bookings;
          console.log(values);
          values?.map((list, index) => {
            const returnData = {};
            returnData.sn = index + 1 + ".";
            returnData.booking_id = list?.bookingID;
            returnData.name_buyer = list?.buyer?.full_name;
            returnData.name_vendor = list?.vendor?.full_name;
            returnData.number = list?.total;
            returnData.date = moment(list?.event_start_date).format("L");
            returnData.action = (
              <>
                <Link
                  className="comman_btn2 table_viewbtn"
                  to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
                  // state={{ id: list?._id }}
                >
                  View
                </Link>
              </>
            );
            newRows.push(returnData);
          });

          setAllBook({ ...allBook, rows: newRows });
        }
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
        const newRows = [];
        if (!res.data?.error) {
          let values = res?.data?.results?.bookings;
          console.log(values);
          values?.map((list, index) => {
            const returnData = {};
            returnData.sn = index + 1 + ".";
            returnData.booking_id = list?.bookingID;
            returnData.name_buyer = list?.buyer?.full_name;
            returnData.name_vendor = list?.vendor?.full_name;
            returnData.number = list?.total;
            returnData.payout = "5000";
            returnData.date = moment(list?.event_start_date).format("L");
            returnData.action = (
              <>
                <Link
                  className="comman_btn2 table_viewbtn"
                  to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
                  // state={{ id: list?._id }}
                >
                  View
                </Link>
              </>
            );
            newRows.push(returnData);
          });

          setCompleteBook({ ...completeBook, rows: newRows });
        }
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
        const newRows = [];
        if (!res.data?.error) {
          let values = res?.data?.results?.bookings;
          console.log(values);
          values?.map((list, index) => {
            const returnData = {};
            returnData.sn = index + 1 + ".";
            returnData.booking_id = list?.bookingID;
            returnData.name_buyer = list?.buyer?.full_name;
            returnData.name_vendor = list?.vendor?.full_name;
            returnData.number = list?.total;
            returnData.date = moment(list?.event_start_date).format("L");
            returnData.action = (
              <>
                <Link
                  className="comman_btn2 table_viewbtn"
                  to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
                  // state={{ id: list?._id }}
                >
                  View
                </Link>
              </>
            );
            newRows.push(returnData);
          });

          setCancelledBook({ ...cancelledBook, rows: newRows });
        }
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
                          Completed{" "}
                          <span className="circle_count">
                            {counters?.completed}
                          </span>
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                                <div className="table-responsive p-0">
                                  {loading ? (
                                    <div className="d-flex justify-content-center py-5">
                                      <Loader />
                                    </div>
                                  ) : (
                                    <MDBDataTable
                                      bordered
                                      displayEntries={false}
                                      className="userData"
                                      hover
                                      data={allBook}
                                      noBottomColumns
                                      sortable
                                    />
                                  )}
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                                <div className="table-responsive ">
                                  {loading ? (
                                    <div className="d-flex justify-content-center py-5">
                                      <Loader />
                                    </div>
                                  ) : (
                                    <MDBDataTable
                                      bordered
                                      displayEntries={false}
                                      className="userData"
                                      hover
                                      data={completeBook}
                                      noBottomColumns
                                      sortable
                                    />
                                  )}
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                              <div className="form-group mb-0 col-5 col-lg-5 col-sm-auto">
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
                                <div className="table-responsive p-0">
                                  {loading ? (
                                    <div className="d-flex justify-content-center py-5">
                                      <Loader />
                                    </div>
                                  ) : (
                                    <MDBDataTable
                                      bordered
                                      displayEntries={false}
                                      className="userData"
                                      hover
                                      data={cancelledBook}
                                      noBottomColumns
                                      sortable
                                    />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManage;
