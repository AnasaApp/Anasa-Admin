import classNames from "classnames";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  changeBuyerStatus,
  getBuyers,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const BuyerManage = () => {
  const [slide, setSlide] = useState("BuyM");
  const [buyers, setBuyers] = useState([]);
  const [sideBar, setSideBar] = useState();
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  const [users, setUsers] = useState({
    
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 150,
      },
      {
        label: "Full Name",
        field: "name",
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAllBuyers();
  }, []);

  const getAllBuyers = async () => {
    const { data } = await getBuyers({ page: 1 });
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.buyers;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name = list?.full_name;
        returnData.email = list?.email;
        returnData.number = list?.phone_number;
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
                BuyerStatus(list?._id);
              }}
            />
            <label for={list?._id}></label>
          </div>
        );
        returnData.action = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to="/Admin/Dashboard/Buyer-Details"
              state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setUsers({ ...users, rows: newRows });
    }
    
  };

  const BuyerStatus = async (id) => {
    const { data } = await changeBuyerStatus(id);

    if (!data?.error) {
      getAllBuyers();
      Swal.fire({
        title: " Buyer Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  let dateSlicer = (data) => {
    return `${data?.createdAt?.slice(0, 10)}`;
  };
  const onSubmit = async (data) => {
    let formData = {
      from: data?.from,
      to: data?.to,
      page: 1,
    };
    const res = await getBuyers(formData);
    setBuyers(res.data.results?.buyers);
  };

  var today = new Date().toISOString().split("T")[0];
  document.getElementById("From")?.setAttribute("max", today);
  document.getElementById("To")?.setAttribute("max", today);
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row buyers-management justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Buyers Management</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                  action=""
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">From</label>
                    <input
                      type="date"
                      className={classNames("form-control", {
                        "is-invalid": errors.from,
                      })}
                      name="from"
                      id="From"
                      {...register("from", {
                        required: "Required",
                      })}
                    />
                  </div>
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">To</label>
                    <input
                      type="date"
                      className={classNames("form-control", {
                        "is-invalid": errors.to,
                      })}
                      name="to"
                      id="To"
                      {...register("to", {
                        required: "Required",
                      })}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button className="comman_btn2" type="submit">
                      Search
                    </button>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    {/* <DataTable
                      value={buyers}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      tableStyle={{ minWidth: "50rem" }}
                    >
                    
                      <Column
                        field="full_name"
                        header="Name"
                        style={{ width: "25%" }}
                      ></Column>
                      <Column
                        field="email"
                        header="Country"
                        style={{ width: "25%" }}
                      ></Column>
                      <Column
                        field="createdAt"
                        body={dateSlicer}
                        header="Company"
                        style={{ width: "25%" }}
                      ></Column>
                      <Column
                        field="status"
                        header="Status"
                        style={{ width: "25%" }}
                      ></Column>
                    </DataTable> */}
                    <div className="table-responsive p-2">
                      <MDBDataTable
                        bordered
                        className="mt-2"
                        hover
                        data={users}
                        noBottomColumns
                        sortable
            
                      />
                      {/* <table className="table mb-0">
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
                        {buyers?.length ? (
                          <tbody>
                            {(buyers || [])?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.full_name}</td>
                                <td>{item?.email}</td>
                                <td>{item?.createdAt?.slice(0, 10)}</td>
                                <td>
                                  <form className="table_btns d-flex align-items-center">
                                    <div
                                      className="check_toggle"
                                      key={item?._id}
                                    >
                                      <input
                                        type="checkbox"
                                        defaultChecked={item?.status}
                                        name="check1"
                                        id={index + 1}
                                        className="d-none"
                                        onClick={() => {
                                          BuyerStatus(item?._id);
                                        }}
                                      />{" "}
                                      <label htmlFor={index + 1} />{" "}
                                    </div>
                                  </form>
                                </td>
                                <td>
                                  <Link
                                    className="comman_btn2 table_viewbtn"
                                    to="/Admin/Dashboard/Buyer-Details"
                                    state={{ id: item?._id }}
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
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

export default BuyerManage;
