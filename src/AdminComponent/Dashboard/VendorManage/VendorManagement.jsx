import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AllVendors,
  changeVendorStatus,
  VendorsCount,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const VendorManagement = () => {
  const [slide, setSlide] = useState("VM");
  const navigate = useNavigate();
  const [penVendors, setPenVendors] = useState();
  const [AppVendors, setAppVendors] = useState();
  const [sideBar, setSideBar] = useState();
  const [retVendors, setRetVendors] = useState();
  const [counters, setCounters] = useState();
  const [values, setValues] = useState({ from: "", to: "" });
  let location = useLocation();

  useEffect(() => {
    getPendingVendors();
    getApprovedVendors();
    getReturnedVendors();
    getCounters();
    location?.state?.rej && document.getElementById("profile1-tab").click();
  }, []);

  const getCounters = async () => {
    const { data } = await VendorsCount({});
    setCounters(data?.results);
  };

  const getPendingVendors = async () => {
    const { data } = await AllVendors({
      from: "",
      to: "",
      status: "PENDING",
      page: 1,
    });
    console.log(data);
    setPenVendors(data?.results.vendors);
  };

  const getApprovedVendors = async () => {
    const { data } = await AllVendors({
      from: "",
      to: "",
      status: "APPROVED",
      page: 1,
    });
    console.log(data);
    setAppVendors(data?.results.vendors);
  };

  const getReturnedVendors = async () => {
    const { data } = await AllVendors({
      from: "",
      to: "",
      status: "RETURNED",
      page: 1,
    });
    console.log(data);
    setRetVendors(data?.results.vendors);
  };
  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };
  const onSearchApp = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      console.log(values);
      const { data } = await AllVendors({
        from: values?.from,
        to: values?.to,
        status: "APPROVED",
        page: 1,
      });
      setAppVendors(data?.results.vendors);
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
  const onSearchPen = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await AllVendors({
        from: values?.from,
        to: values?.to,
        status: "PENDING",
        page: 1,
      });
      setPenVendors(data?.results.vendors);
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
  const onSearchRet = async (e) => {
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await AllVendors({
        from: values?.from,
        to: values?.to,
        status: "RETURNED",
        page: 1,
      });
      if (!data.error) {
        setRetVendors(data?.results.vendors);
        setValues({ from: "", to: "" });
      }
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
  const VendorStatus = async (id) => {
    const { data } = await changeVendorStatus(id);
    if (!data?.error) {
      getApprovedVendors();
      Swal.fire({
        title: "Vendor Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("appFrom")?.setAttribute("max", today);
  document.getElementById("appTo")?.setAttribute("max", today);
  document.getElementById("penFrom")?.setAttribute("max", today);
  document.getElementById("penTo")?.setAttribute("max", today);
  document.getElementById("retFrom")?.setAttribute("max", today);
  document.getElementById("retTo")?.setAttribute("max", today);
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div>
        <div className="admin_panel_data height_adjust">
          <div className="row vendor-management justify-content-center">
            <div className="col-12 text-end mb-4">
              <Link
                to="/Admin/Dashboard/Vendor-Management/Add-User"
                className="comman_btn2 ms-2"
              >
                Add Vendor
              </Link>
            </div>
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Vendor Management</h2>
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
                          >
                            Approved{" "}
                            <span className="circle_count">
                              {counters?.approved}
                            </span>
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
                            Pending{" "}
                            <span className="circle_count">
                              {counters?.pending}
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
                          >
                            Returned{" "}
                            <span className="circle_count">
                              {counters?.rejected}
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
                                    onClick={onSearchApp}
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
                                          <th>Full Name</th>
                                          <th>Email Id</th>
                                          <th>Registration Date</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      {AppVendors?.length ? (
                                        <tbody>
                                          {(AppVendors || [])?.map(
                                            (item, index) => (
                                              <tr>
                                                <td>{index + 1}.</td>
                                                <td>{item?.full_name}</td>
                                                <td>{item?.email}</td>
                                                <td>
                                                  {item?.createdAt?.slice(
                                                    0,
                                                    10
                                                  )}
                                                </td>
                                                <td>
                                                  <form className="table_btns d-flex align-items-center">
                                                    <div className="check_toggle">
                                                      {" "}
                                                      <input
                                                        type="checkbox"
                                                        defaultChecked={
                                                          item?.active_status
                                                        }
                                                        name="check1"
                                                        id={index}
                                                        className="d-none"
                                                        onClick={() => {
                                                          VendorStatus(
                                                            item?._id
                                                          );
                                                        }}
                                                      />{" "}
                                                      <label htmlFor={index} />{" "}
                                                    </div>
                                                  </form>
                                                </td>
                                                <td>
                                                  <Link
                                                    className="comman_btn2 table_viewbtn"
                                                    to="/Admin/Dashboard/Vendor-Management/Approved"
                                                    state={{ id: item?._id }}
                                                  >
                                                    View
                                                  </Link>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      ) : (
                                        <tbody className="justify-content-center">
                                          <tr className="text-center p-3">
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                          </tr>
                                        </tbody>
                                      )}
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
                                    id="penFrom"
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
                                    id="penTo"
                                    value={values.to}
                                    onChange={handleDate}
                                  />
                                </div>
                                <div className="form-group mb-0 col-auto">
                                  <button
                                    className="comman_btn2"
                                    onClick={onSearchPen}
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
                                          <th>Full Name</th>
                                          <th>Shop Name</th>
                                          <th>Email Id</th>
                                          <th>Registration Date</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      {penVendors?.length ? (
                                        <tbody>
                                          {(penVendors || [])?.map(
                                            (item, index) => (
                                              <tr>
                                                <td>{index + 1}.</td>
                                                <td>{item?.full_name}</td>
                                                <td>{item?.shop_name}</td>
                                                <td>{item?.email}</td>
                                                <td>
                                                  {item?.createdAt?.slice(
                                                    0,
                                                    10
                                                  )}
                                                </td>

                                                <td>
                                                  <Link
                                                    className="comman_btn2 table_viewbtn"
                                                    to="/Admin/Dashboard/Vendor-Management/Pending"
                                                    state={{ id: item?._id }}
                                                  >
                                                    View
                                                  </Link>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      ) : (
                                        <tbody className="justify-content-center">
                                          <tr className="text-center p-3">
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                          </tr>
                                        </tbody>
                                      )}
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
                                    id="retFrom"
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
                                    id="retTo"
                                    value={values.to}
                                    onChange={handleDate}
                                  />
                                </div>
                                <div className="form-group mb-0 col-auto">
                                  <button
                                    className="comman_btn2"
                                    onClick={onSearchRet}
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
                                          <th>Full Name</th>
                                          <th>Shop Name</th>
                                          <th>Email Id</th>
                                          <th>Registration Date</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      {retVendors?.length ? (
                                        <tbody>
                                          {(retVendors || [])?.map(
                                            (item, index) => (
                                              <tr>
                                                <td>{index + 1}.</td>
                                                <td>{item?.full_name}</td>
                                                <td>{item?.shop_name}</td>
                                                <td>{item?.email}</td>
                                                <td>
                                                  {item?.createdAt?.slice(
                                                    0,
                                                    10
                                                  )}
                                                </td>
                                                <td>
                                                  <Link
                                                    className="comman_btn2 table_viewbtn"
                                                    to="/Admin/Dashboard/Vendor-Management/Returned"
                                                    state={{ id: item?._id }}
                                                  >
                                                    View
                                                  </Link>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      ) : (
                                        <tbody className="justify-content-center">
                                          <tr className="text-center p-3">
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                            <td>NO RESULTS</td>
                                          </tr>
                                        </tbody>
                                      )}
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
    </div>
  );
};

export default VendorManagement;
