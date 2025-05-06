import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AddDelivery,
  AllVendors,
  deleteVendorSoft,
  importVendorServices,
  UpdateVendorDelivery,
  VendorsCount,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import moment from "moment";
import Loader from "../Loader";
import DeliveryPricingTable from "./DeliveryPricingTable";

const saudiCities = [
  "Dammam",
  "Al Qatif",
  "Al Jubail",
  "Ras Tanura",
  "Khobar",
  "Dhahran",
];

const DeliveryManagement = () => {
  const [slide, setSlide] = useState("DelM");
  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState();
  const [counters, setCounters] = useState();
  const [vendordetails, setVendorDetails] = useState();
  const [vendorId, setVendorId] = useState();
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [values, setValues] = useState({ from: "", to: "" });
  let location = useLocation();
  const [fromCity, setFromCity] = useState("");
  const [toCities, setToCities] = useState([]);
  const [approved, setApproved] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        maxWidth: 50,
      },
      {
        label: "VENDOR NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },

      {
        label: "DELIVERY NORMAL",
        field: "dev_normal",
        sort: "asc",
        width: 150,
      },
      {
        label: "DELIVERY COLD",
        field: "dev_cold",
        sort: "asc",
        width: 100,
      },

      {
        label: "DELIVERY TRUCK",
        field: "dev_truck",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });
  const [activeTab, setActiveTab] = useState("vendor");

  const [rejected, setRejected] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 150,
      },
      {
        label: "FULL NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },
      {
        label: "SHOP NAME",
        field: "name_shop",
        sort: "asc",
        width: 150,
      },
      {
        label: "EMAIL ADDRESS",
        field: "email",
        sort: "asc",
        width: 100,
      },
      {
        label: "PHONE NUMBER",
        field: "number",
        sort: "asc",
        width: 100,
      },
      {
        label: "ADDED ON",
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
    getAllVendors();
    getCancelledRequest();
    getCounters();
    location?.state?.rej && document.getElementById("profile1-tab").click();
  }, []);

  const getCounters = async () => {
    const { data } = await VendorsCount({});
    setCounters(data?.results);
  };

  const getAllVendors = async () => {
    const { data } = await AllVendors({
      from: "",
      to: "",
      status: "APPROVED",
      page: 1,
    });
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.vendors;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name = list?.full_name;
        returnData.email = list?.email;
        returnData.number = list?.phone_number;
        // returnData.payout = "5000";
        returnData.date = moment(list?.createdAt).format("L");
        returnData.dev_normal = (
          <div className="check_toggle" key={list?._id}>
            <input
              type="checkbox"
              defaultChecked={list?.normalDelivery}
              name="check1"
              id={list?._id + "normal"}
              className="d-none"
              onClick={(e) => {
                VendorStatus(list?._id, "normalDelivery", e.target.checked);
              }}
            />
            <label for={list?._id + "normal"}></label>
          </div>
        );
        returnData.dev_cold = (
          <div className="check_toggle" key={list?._id}>
            <input
              type="checkbox"
              defaultChecked={list?.coldDelivery}
              name="check2"
              id={list?._id + "cold"}
              className="d-none"
              onClick={(e) => {
                VendorStatus(list?._id, "coldDelivery", e.target.checked);
              }}
            />
            <label for={list?._id + "cold"}></label>
          </div>
        );
        returnData.dev_truck = (
          <div className="check_toggle" key={list?._id}>
            <input
              type="checkbox"
              defaultChecked={list?.truckDelivery}
              name="check3"
              id={list?._id + "truck"}
              className="d-none"
              onClick={(e) => {
                VendorStatus(list?._id, "truckDelivery", e.target.checked);
              }}
            />
            <label for={list?._id + "truck"}></label>
          </div>
        );

        newRows.push(returnData);
      });

      setApproved({ ...approved, rows: newRows });
      setLoading1(false);
    }
  };

  const getCancelledRequest = async () => {
    const { data } = await AllVendors({
      from: "",
      to: "",
      status: "RETURNED",
      page: 1,
    });
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.vendors;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name = list?.full_name;
        returnData.name_shop = list?.shop_name;
        returnData.email = list?.email;
        returnData.number = list?.phone_number;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to="/Admin/Dashboard/Vendor-Management/Returned"
              state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setRejected({ ...rejected, rows: newRows });
    }
  };

  const deleteVendor = async () => {
    const { data } = await deleteVendorSoft(vendorId);
    if (!data?.error) {
      setVendorId();
      Swal.fire({
        title: "Vendor Deleted!",
        text: "",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
        timer: 500,
      });
      document.getElementById("close2").click();
    }
  };

  const onFileSelection = (e, key) => {
    const selectedFile = e.target.files[0];
    setFiles({ ...files, [key]: selectedFile });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!files || !files.upload_file) {
        Swal.fire({
          icon: "error",
          title: "Please choose a file",
          position: "top-end",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
          toast: true,
        });
        return false;
      }
      const formData = new FormData();
      formData.append("vendorId", vendorId);
      formData.append("file", files.upload_file);

      const { data } = await importVendorServices(formData);
      if (!data.error) {
        Swal.fire({
          title: data.message,
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        document.getElementById("close").click();
        navigate(`/Admin/Dashboard/Vendor-Management/Services/${vendorId}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      document.getElementById("reset_mass_add_form").click();
      setFiles(null);
    }
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
      const newRows = [];
      if (!data.error) {
        let values = data?.results?.vendors;
        console.log(values);
        values?.map((list, index) => {
          const returnData = {};
          returnData.sn = index + 1 + ".";
          returnData.name = list?.full_name;
          returnData.email = list?.email;
          returnData.number = list?.phone_number;
          returnData.payout = "8550";
          returnData.date = moment(list?.createdAt).format("L");
          returnData.status = (
            <div className="check_toggle" key={list?._id}>
              <input
                type="checkbox"
                defaultChecked={list?.active_status}
                name="check1"
                id={list?._id}
                className="d-none"
                onClick={() => {
                  VendorStatus(list?._id);
                }}
              />
              <label for={list?._id}></label>
            </div>
          );
          returnData.action = (
            <>
              <Link
                className="comman_btn2 table_viewbtn"
                to="/Admin/Dashboard/Vendor-Management/Approved"
                state={{ id: list?._id }}
              >
                View
              </Link>
            </>
          );
          newRows.push(returnData);
        });

        setApproved({ ...approved, rows: newRows });
      }
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

  const HandleAddDeliveries = async () => {
    if (toCities?.length > 0 && fromCity) {
      const { data } = await AddDelivery({
        fromCity: fromCity,
        toCities: toCities,
      });

      if (!data.error) {
        Swal.fire({
          title: data.message,
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        setToCities([]);
        setFromCity("");
        window.location.reload();
      }
    } else {
      Swal.fire({
        title: "Please select a Date range!",
        icon: "warning",
        button: "ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const VendorStatus = async (id, key, value) => {
    const updateData = {};

    if (key === "truckDelivery") {
      updateData.truckDelivery = value === true ? "TRUE" : "FALSE";
    } else if (key === "coldDelivery") {
      updateData.coldDelivery = value === true ? "TRUE" : "FALSE";
    } else if (key === "normalDelivery") {
      updateData.normalDelivery = value === true ? "TRUE" : "FALSE";
    }

    const { data } = await UpdateVendorDelivery(id, updateData);
    if (data.results && !data.error) {
      getAllVendors();
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
            {/* {activeTab === "delivery" && ( */}
              <div className="col-12 text-end mb-4">
                <Link
                  className="comman_btn2 ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addDeliveryPricings"
                >
                  + Add New
                </Link>
              </div>
            {/* )} */}
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Delivery Management</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 px-0">
                      {/* <ul
                        className="nav nav-tabs comman_tabs"
                        id="myTab"
                        role="tablist"
                      >
                        <li className="nav-item w-50" role="presentation">
                          <button
                            className="nav-link active"
                            id="home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#home"
                            type="button"
                            role="tab"
                            aria-controls="home"
                            onClick={() => setActiveTab("vendor")}
                            aria-selected="true"
                          >
                            Vendors{" "}
                          </button>
                        </li>
                        <li className="nav-item w-50" role="presentation">
                          <button
                            className="nav-link"
                            id="profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#profile"
                            type="button"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                            onClick={() => setActiveTab("delivery")}
                          >
                            Delivery Prices{" "}
                          </button>
                        </li>
                      </ul> */}

                      {/* <div
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
                                    {loading1 ? (
                                      <div className="d-flex justify-content-center py-5">
                                        <Loader />
                                      </div>
                                    ) : (
                                      <MDBDataTable
                                        bordered
                                        displayEntries={false}
                                        className="userData"
                                        hover
                                        data={approved}
                                        noBottomColumns
                                        sortable
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      {/* <div
                          className="tab-pane fade"
                          id="profile"
                          role="tabpanel"
                          aria-labelledby="profile-tab"
                        > */}
                      <div className="row mx-0">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 comman_table_design px-0">
                              <div className="table-responsive p-0">
                                <DeliveryPricingTable />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="importServices"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Import Mass Services
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close"
                onClick={() => setFiles(null)}
              ></button>
            </div>
            <div class="modal-body">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <Loader />
                </div>
              ) : (
                vendordetails
              )}
              <div className="form-group mb-0 col-12 mt-3 choose_file position-relative">
                <form className="row" onSubmit={(e) => handleFileSubmit(e)}>
                  <div className="col-12">
                    <span>Add Mass Services</span>
                    <label className="mt-1" htmlFor="upload_file">
                      <i className="fa fa-camera me-1 " />
                      Choose File
                    </label>
                    <input
                      className="form-control py-3 ps-4"
                      type="file"
                      accept=".xls, .xlsx"
                      name="upload_file"
                      id="upload_file"
                      onChange={(e) => onFileSelection(e, "upload_file")}
                    />
                  </div>

                  <div className="col-4 d-none">
                    <button id="reset_mass_add_form" type="reset">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="modal-footer">
              <button
                onClick={(e) => handleFileSubmit(e, vendordetails?._id)}
                type="submit"
                class="btn comman_btn rounded-pill"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="deleteVendor"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Delete Vendor
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close2"
                onClick={() => setVendorId()}
              ></button>
            </div>
            <div class="modal-body">
              <h4>Are you Sure?</h4>
            </div>
            <div class="modal-footer">
              <button
                onClick={() => document.getElementById("close2").click()}
                class="btn comman_btn rounded-pill"
              >
                Cancel
              </button>

              <button
                class="btn comman_btn rounded-pill"
                onClick={() => deleteVendor()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="addDeliveryPricings"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="addDeliveryPricingLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addDeliveryPricingLabel">
                Add Delivery Pricing
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="DeliveryPricingClose"
                onClick={() => {
                  setFromCity("");
                  setToCities([]);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">From City</label>
                    <select
                      onChange={(e) => {
                        setFromCity(e.target.value);
                      }}
                      className="form-select"
                      required
                    >
                      <option value="">Select City</option>
                      {saudiCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">To Cities</label>
                  <div className="row">
                    {saudiCities?.map((city) => (
                      <div key={city} className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`city-${city}`}
                            value={city}
                            onChange={(e) => {
                              const selectedCity = e.target.value;
                              setToCities((prev) =>
                                prev.includes(selectedCity)
                                  ? prev.filter((c) => c !== selectedCity)
                                  : [...prev, selectedCity]
                              );
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`city-${city}`}
                          >
                            {city}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <a
                onClick={(e) => HandleAddDeliveries(e)}
                type="button"
                className="btn comman_btn"
              >
                Save Cities
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;
