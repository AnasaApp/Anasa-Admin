import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/style.css";
import {
  RecentOrders,
  totalBuyers,
  totalEarning,
  totalOrders,
  totalVendors,
} from "../httpServices/dashHttpService";
import AnimatedNumber from "react-animated-number/build/AnimatedNumber";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const Dashboard = () => {
  const [slide, setSlide] = useState("Dash");
  const [sideBar, setSideBar] = useState();
  const [recentOrders, setRecentOrders] = useState([]);
  const initialValue = 0.0;

  useEffect(() => {
    getTotalData();
    getRecentOrders();
  }, []);
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

  const getRecentOrders = async () => {
    const { data } = await RecentOrders();
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.bookings;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.booking_id = list?.bookingID;
        returnData.name_buyer = list?.buyer?.full_name;
        returnData.name_vendor = list?.vendor?.full_name;
        returnData.number = list?.total;
        returnData.date = moment(list?.event_date).format("L");
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

  const getTotalData = async () => {
    const dataBuyer = await totalBuyers();
    const dataEarning = await totalEarning();
    const dataVendor = await totalVendors();
    const dataOrder = await totalOrders();
    console.log(dataEarning)
    localStorage.setItem("buyers", dataBuyer?.data?.results.buyers);
    localStorage.setItem(
      "earning",
      dataEarning?.data?.results?.total
    );
    localStorage.setItem("vendor", dataVendor?.data?.results.vendors);
    localStorage.setItem("orders", dataOrder?.data?.results.orders);
  };

  let buyers = localStorage.getItem("buyers");
  let earning = localStorage.getItem("earning");
  let vendors = localStorage.getItem("vendor");
  let orders = localStorage.getItem("orders");

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row dashboard_part justify-content-center">
          <div className="col-12">
            <div className="row ms-3 mb-5 justify-content-center">
              <div className="col d-flex align-items-stretch">
                <a href="#" className="row dashboard_box box_design me-3 w-100">
                  <div className="col-auto px-0">
                    <span className="dashboard_icon">
                      <i className="fas fa-user" />
                    </span>
                  </div>
                  <div className="col pe-0">
                    <div className="dashboard_boxcontent">
                      <h2>Total Buyers</h2>
                      <span>
                        <AnimatedNumber
                          component="text"
                          style={{
                            transition: "1s ease-out",
                            fontSize: 17,
                            transitionProperty:
                              "background-color, color, opacity",
                          }}
                          initialValue={initialValue}
                          value={buyers}
                          stepPrecision={0}
                          duration={500}
                          formatValue={(n) =>
                            Intl.NumberFormat("en-US").format(n)
                          }
                        />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col d-flex align-items-stretch">
                <a href="#" className="row dashboard_box box_design me-3 w-100">
                  <div className="col-auto px-0">
                    <span className="dashboard_icon">
                      <i class="fa fa-coins"></i>
                    </span>
                  </div>
                  <div className="col pe-0">
                    <div className="dashboard_boxcontent">
                      <h2>Total Earnings</h2>
                      <span>
                        {" "}
                        <AnimatedNumber
                          component="text"
                          style={{
                            transition: "1s ease-out",
                            fontSize: 17,
                            transitionProperty:
                              "background-color, color, opacity",
                          }}
                          initialValue={initialValue}
                          value={earning}
                          stepPrecision={0}
                          duration={500}
                          formatValue={(n) =>
                            Intl.NumberFormat("en-US").format(n)
                          }
                        />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col d-flex align-items-stretch">
                <a href="#" className="row dashboard_box box_design me-3 w-100">
                  <div className="col-auto px-0">
                    <span className="dashboard_icon">
                      <i className="fa fa-clipboard-list" />
                    </span>
                  </div>
                  <div className="col pe-0">
                    <div className="dashboard_boxcontent">
                      <h2>Total Bookings</h2>
                      <span>
                        {" "}
                        <AnimatedNumber
                          component="text"
                          style={{
                            transition: "1s ease-out",
                            fontSize: 17,
                            transitionProperty:
                              "background-color, color, opacity",
                          }}
                          initialValue={initialValue}
                          value={orders}
                          stepPrecision={0}
                          duration={500}
                          formatValue={(n) =>
                            Intl.NumberFormat("en-US").format(n)
                          }
                        />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col d-flex align-items-stretch pe-0">
                <a href="#" className="row dashboard_box box_design me-0 w-100">
                  <div className="col-auto px-0">
                    <span className="dashboard_icon">
                      <i className="fa fa-store" />
                    </span>
                  </div>
                  <div className="col pe-0">
                    <div className="dashboard_boxcontent">
                      <h2>Total Vendor</h2>
                      <span>
                        {" "}
                        <AnimatedNumber
                          component="text"
                          style={{
                            transition: "1s ease-out",
                            fontSize: 17,
                            transitionProperty:
                              "background-color, color, opacity",
                          }}
                          initialValue={initialValue}
                          value={vendors}
                          stepPrecision={0}
                          duration={500}
                          formatValue={(n) =>
                            Intl.NumberFormat("en-US").format(n)
                          }
                        />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Recent Booking</h2>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive p-0  ">
                      <MDBDataTable
                        bordered
                        displayEntries={false}
                        className="mt-0"
                        hover
                        data={allBook}
                        noBottomColumns
                        sortable
                      />
                      {/* <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Buyer Name</th>
                            <th>Email Id</th>
                            <th>Booking Date</th>
                            <th>Vendor Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        {recentOrders?.length ? (
                          <tbody>
                            {recentOrders?.map((item, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{item?.buyer?.full_name}</td>
                                <td>{item?.buyer?.email}</td>
                                <td>{item?.createdAt?.slice(0, 10)}</td>
                                <td>{item?.vendor?.full_name}</td>
                                <td>
                                  <Link
                                    className="comman_btn2 table_viewbtn"
                                    to={`/Admin/Dashboard/Booking-Management/Booking-Details/${item?._id}`}
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td>No results...</td>
                              <td>No results...</td>
                              <td>No results...</td>
                              <td>No results...</td>
                              <td>No results...</td>
                              <td>No results...</td>
                            </tr>
                          </tbody>
                        )}
                      </table> */}
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

export default Dashboard;
