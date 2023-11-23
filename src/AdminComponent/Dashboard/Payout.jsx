import React, { useEffect, useState } from "react";
import {
  AllVendors,
  editWallet,
  GetVendorWallet,
  vendorWithdraw,
} from "../httpServices/dashHttpService";
import Sidebar from "./Sidebar";
import moment from "moment";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Payout = () => {
  const [slide, setSlide] = useState("PM");
  const [sideBar, setSideBar] = useState();
  const [values, setValues] = useState({ from: "", to: "" });
  const [vendorId, setVendorId] = useState();
  const [wallet, setWallet] = useState();
  const [value, setValue] = useState();
  const [remainingAmount, setRemainingAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();

  useEffect(() => {
    getVendors();
  }, []);

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset,
  } = useForm();

  const [approved, setApproved] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        maxWidth: 50,
      },
      {
        label: "FULL NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },

      {
        label: "EMAIL ADDRESS",
        field: "email",
        sort: "asc",
        width: 150,
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

  const [payout, setPayout] = useState({
    columns: [
      {
        label: "Date",
        field: "date",
        // sort: "asc",
        maxWidth: 50,
      },
      {
        label: "Total Amount",
        field: "amount",
        // sort: "asc",
        maxWidth: 100,
      },
      {
        label: "Remaining Amount",
        field: "remainingAmount",
        // sort: "asc",
        maxWidth: 150,
      },
      {
        label: "Total Withdrawal",
        field: "withdrawalAmount",
        // sort: "asc",
        maxWidth: 150,
      },
      {
        label: "Pending Amount",
        field: "pendingAmount",
        // sort: "asc",
        maxWidth: 50,
      },
    ],
    rows: [],
  });

  const manageVendor = async (id) => {
    setVendorId(id);
    const { data } = await GetVendorWallet(id);
    const newRows = [];
    if (!data.error) {
      console.log(data);
      let values = data?.results?.wallet;
      setWallet(data?.results.wallet);
      const returnData = {};
      returnData.date = moment(values.withdrawlDate).format("L");
      returnData.amount = values?.totalAmount;
      returnData.remainingAmount = values?.remainingBalance;
      returnData.withdrawalAmount = values?.withdrawlAmount;
      returnData.pendingAmount = values?.pendingAmount;
      setWithdrawAmount(values?.remainingBalance)
      setRemainingAmount(values?.remainingBalance)
      newRows.push(returnData);
    }
    setPayout({ ...payout, rows: newRows });
  };
  const getVendors = async () => {
    const { data } = await AllVendors({
      status: "APPROVED",
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
        returnData.date = moment(list?.createdAt).format("L");

        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop224"
              onClick={() => manageVendor(list?._id)}
            >
              Manage Payout
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setApproved({ ...approved, rows: newRows });
    }
  };
  // const onEdit = async (data) => {
  //   console.log(data);
  //   await editWallet({ amount: value, vendorId: vendorId }).then((res) => {
  //     if (!res.data.error) {
  //       document.getElementById("closedEdit").click();
  //       getVendors();
  //       setValue("");
  //       Swal.fire({
  //         title: "Updated Successfully!",
  //         icon: "success",
  //         confirmButtonText: "Okay",
  //         confirmButtonColor: "#e25829",
  //       });
  //     }
  //   });
  // };

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };

  const handleWithdraw = async (e, amount) => {
    e.preventDefault();
    console.log(withdrawAmount)
    if (withdrawAmount < 1 || withdrawAmount === null) {
      Swal.fire({
        text: "Please Enter Withdarwal Amount",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return false;
    } else if (withdrawAmount > remainingAmount) {
      Swal.fire({
        text: "Withdrawal amount is greater than available amount",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return false;
    }

    await editWallet({ amount, vendorId }).then((res) => {
      if (!res.data.error) {
        console.warn(res)
        document.getElementById("closeEdits").click();
        Swal.fire({
          title: "Updated Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        getVendors();
        setWithdrawAmount()
      }
    });
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

                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <MDBDataTable
                                    bordered
                                    displayEntries={false}
                                    className="userData2"
                                    hover
                                    data={approved}
                                    noBottomColumns
                                    sortable
                                  />
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
      <div
        className="modal fade comman_modal"
        id="staticBackdrop224"
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
                Vendor's Wallet
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closedEdit"
                onClick={() => {
                  document.getElementById("ResetSSS").click();
                  setValue("");
                }}
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 comman_table_design px-0">
                  <div className="table-responsive payout">
                    <MDBDataTable
                      bordered
                      displayEntries={false}
                      hover
                      data={payout}
                      noBottomColumns
                    />
                    {/* <div className="d-flex justify-content-center">
                      <button className="comman_btn">Withdraw Now</button>
                    </div> */}
                  </div>
                </div>
              </div>
              
            </div>
            <div class="modal-footer">
              <button
                type="button"
                className="comman_btn"
                data-bs-toggle="modal"
                data-bs-target="#open_withdraw_modal"
                data-bs-dismiss="modal"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="open_withdraw_modal"
        aria-hidden="true"
        aria-labelledby="open_withdraw_modal"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="open_withdraw_modal">
                Withdraw
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeEdits"
                onClick={() => setWithdrawAmount(0)}
              ></button>
            </div>
            <div class="modal-body">
              <form
                id="withdrawForm"
                onSubmit={(e) => handleWithdraw(e, withdrawAmount)}
              >
                <p>Available amount : {remainingAmount} </p>
                <div className="form-group col-12">
                  <label htmlFor="" className="my-2">
                    Withdraw Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-center my-3">
                  <button className="comman_btn" type="submit">
                    Withdraw
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

export default Payout;
