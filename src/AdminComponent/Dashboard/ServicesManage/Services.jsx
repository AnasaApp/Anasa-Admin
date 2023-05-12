import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";

const ServicesManage = () => {
  const [slide, setSlide] = useState("BM");
  const [sideBar, setSideBar] = useState();

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  const [services, setServices] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "SERVICE NAME(En)",
        field: "name_en",
        sort: "asc",
        width: 100,
      },

      {
        label: "SERVICES NAME(Ar)",
        field: "name_ar",
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
        label: "CREATED ON",
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
    getServices();
  }, []);

  const getServices = async () => {};
  return (
    <div>
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
                                  <h2>Sevices Management</h2>
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
                                      data={services}
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
        {/* <div
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
                <form
                  className="form-design px-3 py-2 help-support-form row  justify-content-center"
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

                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <button className="comman_btn" type="submit">
                      Withdraw
                    </button>
                  </div>
                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="ResetSSS"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ServicesManage;
