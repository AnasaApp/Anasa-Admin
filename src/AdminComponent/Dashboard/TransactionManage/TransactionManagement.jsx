import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BuyerTransactions,
  editOffer,
  GetVendorWallet,
  UpdateTransactions,
  VendorTransactions,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import moment from "moment";
import { MDBDataTable } from "mdbreact";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import classNames from "classnames";

const TransactionManagement = () => {
  const [slide, setSlide] = useState("TM");
  const [sideBar, setSideBar] = useState();
  const [values, setValues] = useState({ from: "", to: "" });
  const [trans, setTrans] = useState([]);
  const [status, setStatus] = useState();
  const [vendorId, setVendorId] = useState();
  const [wallet, setWallet] = useState();
  const [value, setValue] = useState();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset,
  } = useForm();

  useEffect(() => {
    getVendorTransactions();
    getBuyerTransactions();
  }, []);

  const [vendorTcs, setVendorTcs] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },

      {
        label: "TRANSACTION DATE & TIME",
        field: "date",
        sort: "asc",
        width: 100,
      },
      {
        label: "VENDOR NAME",
        field: "name_vendor",
        sort: "asc",
        width: 150,
      },

      {
        label: "AMOUNT",
        field: "amount",
        sort: "asc",
        width: 100,
      },
      {
        label: "STATUS",
        field: "status",
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

  const [buyerTcs, setBuyerTcs] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },

      {
        label: "TRANSACTION DATE & TIME",
        field: "date",
        sort: "asc",
        width: 100,
      },
      {
        label: "BUYER NAME",
        field: "name_vendor",
        sort: "asc",
        width: 150,
      },

      {
        label: "AMOUNT",
        field: "amount",
        sort: "asc",
        width: 100,
      },
      {
        label: "STATUS",
        field: "status",
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

  const getVendorTransactions = async () => {
    const { data } = await VendorTransactions({ page: 1 });
    const newRows = [];
    if (!data.error) {
      let values = data?.results.transactions;
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name_vendor = list?.vendor.full_name;
        returnData.amount = list?.withdrawl || list?.deposit;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = list?.status;

        returnData.action = (
          <>
            <Link
              to="/Admin/Dashboard/Vendor-Management/Approved"
              state={{ id: list?.vendor?._id }}
              className="comman_btn table_viewbtn mx-1"
            >
              View
            </Link>
            <Link
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop44"
              className="comman_btn table_viewbtn mx-1"
              onClick={() => {
                setVendorId(list?._id);
                manageVendor(list?._id);
                setTrans({
                  status: list?.status,
                  amount: list?.deposit || list?.withdrawl,
                });
              }}
            >
              Manage
            </Link>
          </>
        );
        newRows.push(returnData);
      });
    }
    setVendorTcs({ ...vendorTcs, rows: newRows });
  };

  const getBuyerTransactions = async () => {
    const { data } = await BuyerTransactions({ page: 1 });
    const newRows = [];
    if (!data.error) {
      let values = data?.results.transactions;
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name_vendor = list?.vendor.full_name;
        returnData.amount = list?.withdrawl || list?.deposit;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = list?.status;
        returnData.action = (
          <>
            <Link
              to="/Admin/Dashboard/Vendor-Management/Approved"
              state={{ id: list?.vendor?._id }}
              className="comman_btn table_viewbtn mx-1"
            >
              View
            </Link>
            <Link
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop44"
              onClick={() => {
                setTrans({
                  status: list?.status,
                  amount: list?.deposit || list?.withdrawl,
                });
              }}
              className="comman_btn table_viewbtn mx-1"
            >
              Manage
            </Link>
          </>
        );
        newRows.push(returnData);
      });
    }
    setBuyerTcs({ ...buyerTcs, rows: newRows });
  };

  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };
  console.log(trans);

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

  const onUpdate = async (e) => {
    e.preventDefault();
    const { data } = await UpdateTransactions(vendorId, {
      status: e.target.value,
    });
    if (!data.error) {
      getVendorTransactions();
      Swal.fire({
        title: "Status Updated Successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    }
  };
  const onEdit = async (data) => {
    console.log(data);
    await editOffer(vendorId, {}).then((res) => {
      if (!res.data.error) {
        document.getElementById("transClose").click();
        getVendorTransactions();
        Swal.fire({
          title: "Updated Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const manageVendor = async (id) => {
    const { data } = await GetVendorWallet(id);
    if (!data.error) {
      console.log(data);
      setWallet(data?.results.wallet);
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
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
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
                          Buyers
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
                          Vendor
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
                                  <MDBDataTable
                                    bordered
                                    displayEntries={false}
                                    className=""
                                    hover
                                    data={buyerTcs}
                                    noBottomColumns
                                    sortable
                                  />
                                  {/* <table className="table mb-0">
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
                                  </table> */}
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
                                <div className="table-responsive p-1">
                                  <MDBDataTable
                                    bordered
                                    displayEntries={false}
                                    className=""
                                    hover
                                    data={vendorTcs}
                                    noBottomColumns
                                    sortable
                                  />
                                  {/* <table className="table mb-0">
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
                                  </table> */}
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
      <div
        className="modal fade comman_modal"
        id="staticBackdrop44"
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
                Manage Transaction
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="transClose"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
                onSubmit={handleSubmit2(onEdit)}
              >
                <div className="form-group col-6">
                  <label htmlFor="">Total Amount (En)</label>
                  <input
                    type="text"
                    className={classNames("form-control", {
                      "is-invalid": errors2.combo_en_edit,
                    })}
                    name="amount"
                    defaultValue={wallet?.totalAmount}
                    disabled
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Pending Amount (En)</label>
                  <input
                    type="text"
                    className={classNames("form-control", {
                      "is-invalid": errors2.combo_en_edit,
                    })}
                    name="amount"
                    defaultValue={wallet?.pendingAmount}
                    disabled
                  />
                </div>

                <div className="form-group col-6">
                  <label htmlFor="">Request Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={trans.amount}
                    disabled
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Mark as</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    name="category"
                    onChange={(e) => onUpdate(e)}
                  >
                    <option selected="">{trans.status}</option>
                    <option value="Paid">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Withdrawl Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="combo_ar_edit_ar"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (e.target.value > wallet?.totalAmount) {
                        Swal.fire({
                          title: "Warning!",
                          text: "Withdrawl Amount Should be less than Total Amount",
                          icon: "warning",
                          confirmButtonText: "Okay",
                        });
                        setValue(wallet?.totalAmount);
                      }
                    }}
                  />
                  {errors2.combo_ar_edit_ar && (
                    <small className="errorText mx-1">
                      {errors2.combo_ar_edit_ar.message}
                    </small>
                  )}
                </div>
                <div className="form-group mb-0 col-auto ">
                  <button className="comman_btn" type="submit">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;
