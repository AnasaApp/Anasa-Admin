import React, { useState } from "react";
import Sidebar from "../Sidebar";

const Notification = () => {
  const [slide, setSlide] = useState("NM");
  const [sideBar, setSideBar] = useState();

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
            <div className="row">
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Send Push Notification Messages</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                  action=""
                >
                  <div className="form-group col-12">
                    <label htmlFor="">Write a message</label>
                    <textarea
                      className="form-control"
                      name=""
                      id=""
                      style={{ height: 110 }}
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-group mb-0 col">
                    <label htmlFor="">Select Users</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                    >
                      <option selected="">Select Users</option>
                      <option value={1}>All</option>
                      <option value={2}>Specific User</option>
                      <option value={3}>3</option>
                      <option value={3}>4</option>
                      <option value={3}>5</option>
                    </select>
                  </div>
                  <div className="form-group mb-0 col">
                    <label htmlFor="">Search User</label>
                    <input type="search" className="form-control" />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button className="comman_btn">Send</button>
                  </div>
                </form>
              </div>
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Combo</h2>
                  </div>
                  <div className="col-3">
                    <form className="form-design" action="">
                      <div className="form-group mb-0 position-relative icons_set">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          name="name"
                          id="name"
                        />
                        <i className="far fa-search" />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Message Sent</th>
                            <th>To Users</th>
                            <th>Message Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>All</td>
                            <td>Sent</td>
                            <td>01/01/20</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>All</td>
                            <td>Sent</td>
                            <td>01/01/20</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>Specific</td>
                            <td>Sent</td>
                            <td>01/01/20</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>All</td>
                            <td>Sent</td>
                            <td>01/01/20</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>Specific</td>
                            <td>Sent</td>
                            <td>01/01/20</td>
                          </tr>
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
  );
};

export default Notification;
