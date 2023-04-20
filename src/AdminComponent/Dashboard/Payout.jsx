import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const Payout = () => {
  const [slide, setSlide] = useState("PM");
  const [sideBar, setSideBar] = useState();
  const [values, setValues] = useState({ from: "", to: "" });

  useEffect(() => {
    getVendorTransactions();
  }, []);

  const getVendorTransactions = async () => {
    // const { data } = await VendorTransactions({ page: 1 });
  };

  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const onSearch = async (e) => {
    // if (values?.from && values?.to) {
    //   e.preventDefault();
    //   await AllBookings({
    //     from: values?.from,
    //     to: values?.to,
    //     page: 1,
    //   }).then((res) => {
    //     setAllBookings(res?.data?.results?.bookings);
    //   });
    //   setValues({ from: "", to: "" });
    // } else {
    //   e.preventDefault();
    //   Swal.fire({
    //     title: "Please select a Date range!",
    //     icon: "warning",
    //     button: "ok",
    //     confirmButtonColor: "#e25829",
    //   });
    // }
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row">
                  <div className="col-12 px-0">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Payout Management</h2>
                              </div>
                            </div>
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
                                        <th>Customer name</th>
                                        <th>Transaction Date &amp; Time</th>
                                        <th>Vendor Name</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>
                                          No results..
                                          <br />
                                        </td>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>
                                          <a
                                            className="comman_btn table_viewbtn"
                                            // href="buyers-details.html"
                                          >
                                            View
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <div className="row Total_amt mx-0 py-3">
                              <div className="col-6">
                                <strong>Total Amount: </strong>
                              </div>
                              <div className="col-6 text-end">
                                <span>0.00</span>
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
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Transaction Management</h2>
                              </div>
                            </div>
                            <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action=""
                            >
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">From</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">To</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-auto">
                                <button className="comman_btn2">Search</button>
                              </div>
                            </form>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Transaction Date &amp; Time</th>
                                        <th>Vendor Name</th>
                                        <th>Amount</th>
                                        <th>Commission</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>
                                          No results..
                                          <br />
                                        </td>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>No results..</td>
                                        <td>No actions..</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <div className="row Total_amt mx-0 py-3">
                              <div className="col-6">
                                <strong>Total Amount: </strong>
                              </div>
                              <div className="col-6 text-end">
                                <span>0.00 SAR</span>
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

export default Payout;
