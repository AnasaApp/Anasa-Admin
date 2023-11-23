import classNames from "classnames";
import { MDBDataTable } from "mdbreact";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  changeServiceStatus,
  getServices,
  getVendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import Swal from "sweetalert2";

const ServicesManage = () => {
  const [slide, setSlide] = useState("SM");
  const [sideBar, setSideBar] = useState();
  const [newData, setNewData] = useState([
    { name_en: "", name_ar: "", price: "" },
  ]);
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset,
  } = useForm();

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
        label: "PRICE",
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
        label: "Status",
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

  useEffect(() => {
    getAllServices();
  }, []);

  const getAllServices = async () => {
    const { data } = await getServices();
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.services;
      // console.log(values);
      values.sort((a, b) => (a.status === true ? -1 : b.status === true ? 1:0))
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name_en = list?.name_en;
        returnData.name_ar = list?.name_ar;
        returnData.name_vendor = list?.vendor?.full_name;
        returnData.number = list?.price;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = (
          <div className="check_toggle" key={list?._id}>
            <input
              type="checkbox"
              defaultChecked={list?.status}
              name="check1"
              id={list?._id}
              className="d-none"
              onClick={() => {
                ServiceStatus(list?._id);
              }}
            />
            <label for={list?._id}></label>
          </div>
        );
        returnData.action = (
          <>
            <Link
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop447"
              className="comman_btn2 table_viewbtn"
              onClick={() => handleView(list)}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setServices({ ...services, rows: newRows });
    }
  };

  const ServiceStatus = async (id) => {
    const { data } = await changeServiceStatus(id);
    if (!data?.error) {
      getAllServices();
      Swal.fire({
        title: "Service Status Changed!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const onEdit = async (data) => {
    let formData = new FormData();
    formData.append("name_en", data?.promo_code_en_edit);
    formData.append("name_ar", data?.promo_code_ar_edit);
    formData.append("discount", data?.EditDiscount);
    formData.append("validFrom", data?.dateFrom);
    formData.append("validTo", data?.dateTo);
  };

  const handleView = async (data) => {
    setNewData(data);
  };
  console.log(newData);
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
                                      selectable={true}
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
          id="staticBackdrop447"
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
                  Edit Services
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("resetModal45").click();
                    setNewData([]);
                  }}
                />
              </div>
              <div className="modal-body">
                <form
                  className="form-design px-3 py-2 help-support-form row  justify-content-center"
                  action=""
                >
                  <div className="form-group col-6">
                    <label htmlFor="">Service Name(En)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName_en"
                      defaultValue={newData?.name_en}
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label htmlFor="">Service Name(Ar)</label>
                    <input
                      type="text"
                      dir="rtl"
                      className="form-control"
                      name="serviceName_en"
                      defaultValue={newData?.name_ar}
                      disabled
                    />
                  </div>

                  <div className="form-group col-12">
                    <label htmlFor="">Description(En)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName_en"
                      defaultValue={newData?.description_en}
                      disabled
                    />
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="">Price</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName_en"
                      defaultValue={newData?.price}
                      disabled
                    />
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="">Vendor Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName_en"
                      defaultValue={newData?.vendor?.full_name}
                      disabled
                    />
                  </div>
                  {newData?.packages?.map((item) => (
                    <div>
                      <h3 className="fs-5 fw-bold  ">Packages</h3>

                      <div className="form-group col-6">
                        <label htmlFor="">Price</label>
                        <input
                          type="text"
                          className="form-control"
                          name="serviceName_en"
                          defaultValue={newData?.price}
                          disabled
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="">Vendor Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="serviceName_en"
                          defaultValue={newData?.vendor?.full_name}
                          disabled
                        />
                      </div>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesManage;
