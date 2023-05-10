import classNames from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { useEffect } from "react";
import {
  AddPromoCode,
  AllPromocodes,
  changePromocodeStatus,
  editPromocode,
  getViewPromo,
  ImageUpload,
  SearchUser,
} from "../../httpServices/dashHttpService";
import Swal from "sweetalert2";
import moment from "moment";
import { MDBDataTable } from "mdbreact";

const PromoManagement = () => {
  const [files, setFiles] = useState();
  const [slide, setSlide] = useState("PCM");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [userTypes, setUsertypes] = useState();
  const [promoCodes, setPromoCodes] = useState();
  const [sideBar, setSideBar] = useState();
  const [editData, setEditData] = useState([]);
  const [newData, setNewData] = useState([
    { name_en: "", name_ar: "", discount: "", validFrom: "", validTo: "" },
  ]);
  const [promoId, setPromoId] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset,
  } = useForm();

  const [options, setOptions] = useState([]);
  const [promos, setPromos] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "PROMO(En)",
        field: "name_en",
        sort: "asc",
        width: 100,
      },
      {
        label: "PROMO(Ar)",
        field: "name_ar",
        sort: "asc",
        width: 100,
      },
      {
        label: "IMAGE",
        field: "image",
        sort: "asc",
        width: 150,
      },

      {
        label: "DISCOUNT-%",
        field: "number",
        sort: "asc",
        width: 100,
      },
      {
        label: "VALID FROM",
        field: "date_from",
        sort: "asc",
        width: 100,
      },
      {
        label: "VALID TILL",
        field: "date_till",
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
  useEffect(() => {
    createOptions();
  }, [searchKey]);

  useEffect(() => {
    GetPromocodes();
  }, []);

  const createOptions = async () => {
    await SearchUser({ search: searchKey }).then((res) => {
      if (!res.error) {
        let data = res?.data.results?.buyers;
        const optionList = data?.map((item, index) => ({
          value: item?._id,
          label: item?.full_name,
        }));
        setOptions(optionList);
      }
    });
  };

  const GetPromocodes = async () => {
    await AllPromocodes().then((res) => {
      const newRows = [];
      if (!res.data.error) {
        let values = res.data.results?.promocodes;
        console.log(values);
        values?.map((list, index) => {
          const returnData = {};
          returnData.sn = index + 1 + ".";
          returnData.name_en = list?.name_en;
          returnData.name_ar = list?.name_ar;
          returnData.sub_cate_name = list?.subCategory?.name_en;
          returnData.number = list?.discount;
          returnData.date_from = moment(list?.validFrom).format("L");
          returnData.date_till = moment(list?.validTo).format("L");
          returnData.status = (
            <div className="check_toggle">
              <input
                type="checkbox"
                defaultChecked={list?.status}
                name="checkv4"
                id={list?._id}
                className="d-none"
                onClick={() => {
                  PromoCodeStatus(list?._id);
                }}
              />
              <label
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop12"
                htmlFor={list?._id}
              />
            </div>
          );
          returnData.image = (
            <img
              className="table_img"
              width={70}
              height={60}
              src={
                list?.image
                  ? list?.image
                  : require("../../../assets/img/Nupload.jpg")
              }
              alt=""
            />
          );
          returnData.action = (
            <>
              <a
                className="comman_btn table_viewbtn mx-1"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop22"
                onClick={() => handleView(list?._id)}
              >
                Edit
              </a>
              {/* <a className="comman_btn2 table_viewbtn" onClick={DeleteCode}>
                Delete
              </a> */}
            </>
          );
          newRows.push(returnData);
        });

        setPromos({ ...promos, rows: newRows });
      }
      setPromoCodes(res.data.results?.promocodes);
    });
  };

  const onSubmit = async (data) => {
    await AddPromoCode({
      name_en: data?.promo_code_en,
      name_ar: data?.promo_code_ar,
      discount: data?.discount,
      validFrom: data?.dateFrom,
      validTo: data?.dateTo,
      userType: userTypes,
      image: files[0],
      selectedUsers:
        userTypes === "specific" &&
        selectedUsers.usersSelected?.map((item) => item?.value),
    }).then((res) => {
      document.getElementById("ResetPromo").click();
      GetPromocodes();
      if (!res.data.error) {
        Swal.fire({
          title: "Promo Code Added!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const onEdit = async (data) => {
    let formData = new FormData();
    formData.append("name_en", data?.promo_code_en_edit);
    formData.append("name_ar", data?.promo_code_ar_edit);
    formData.append("discount", data?.EditDiscount);
    formData.append("validFrom", data?.dateFrom);
    formData.append("validTo", data?.dateTo);
    formData.append("image", files);

    await editPromocode(promoId, formData).then((res) => {
      if (!res.data.error) {
        document.getElementById("modal").click();
        GetPromocodes();
        Swal.fire({
          title: "Promocode Modified Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const DeleteCode = async () => {};
  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };
  const handleView = async (id) => {
    setPromoId(id);
    const { data } = await getViewPromo(id);
    let date = data?.results.promocode;
    setEditData(data?.results.promocode);
    document.getElementById("from").defaultValue = date?.validFrom?.slice(
      0,
      10
    );
    document.getElementById("till").defaultValue = date?.validTo?.slice(0, 10);
    reset({
      promo_code_en_edit: date.name_en,
      promo_code_ar_edit: date?.name_ar,
      EditDiscount: date?.discount,
      validFrom: date?.validFrom?.slice(0, 10),
      validTo: date?.validFrom?.slice(0, 10),
    });
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };
  const onFileSelection = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const data = await ImageUpload(formData);
    console.log(data.data?.results.obj);
    setFiles(data.data.results?.obj);
  };

  console.log(files);
  const PromoCodeStatus = async (id) => {
    const { data } = await changePromocodeStatus(id);
    if (!data?.error) {
      GetPromocodes();
      Swal.fire({
        title: "Code Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("dateTo")[0]?.setAttribute("min", today);
  document.getElementsByName("dateFrom")[0]?.setAttribute("min", today);
  document.getElementsByName("dateToEdit")[0]?.setAttribute("min", today);
  document.getElementsByName("dateFromEdit")[0]?.setAttribute("min", today);
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
                    <h2>Add Promo Code</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row  justify-content-between"
                  action=""
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-group col-4">
                    <label htmlFor="">Promo Code (En)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.promo_code_en,
                      })}
                      name="promo_code_en"
                      {...register("promo_code_en", {
                        required: "*Promo code is required!",
                      })}
                    />
                    {errors.promo_code_en && (
                      <small className="errorText mx-1">
                        {errors.promo_code_en.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Promo Code (Ar)</label>
                    <input
                      type="text"
                      lang="ar"
                      dir="rtl"
                      className={classNames("form-control", {
                        "is-invalid": errors.promo_code_ar,
                      })}
                      name="promo_code_ar"
                      {...register("promo_code_ar", {
                        required: "*Promo code is required!",
                      })}
                    />
                    {errors.promo_code_ar && (
                      <small className="errorText mx-1">
                        {errors.promo_code_ar.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4 choose_file position-relative">
                    <span>Upload Image </span>{" "}
                    <label htmlFor="upload_video">
                      <i className="fa fa-camera me-1" />
                      Choose File
                    </label>{" "}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      name="upload_video"
                      id="upload_video"
                      onChange={(e) => onFileSelection(e, "upload_video")}
                    />
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Discount %</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.discount,
                      })}
                      name="discount"
                      {...register("discount", {
                        required: "*Discount % is required!",
                        maxLength: {
                          value: 4,
                          message: "Maximium 4 characters!",
                        },
                      })}
                    />
                    {errors.discount && (
                      <small className="errorText mx-1">
                        {errors.discount.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Valid From</label>
                    <input
                      type="date"
                      className={classNames("form-control", {
                        "is-invalid": errors.dateFrom,
                      })}
                      name="dateFrom"
                      {...register("dateFrom", {
                        required: "*Please Select a Date!",
                      })}
                    />
                    {errors.dateFrom && (
                      <small className="errorText mx-1">
                        {errors.dateFrom.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Valid Till</label>
                    <input
                      type="date"
                      className={classNames("form-control", {
                        "is-invalid": errors.dateTo,
                      })}
                      name="dateTo"
                      {...register("dateTo", {
                        required: "*Please Select a Date!",
                      })}
                    />
                    {errors.dateTo && (
                      <small className="errorText mx-1">
                        {errors.dateTo.message}
                      </small>
                    )}
                  </div>

                  {/* <div className="form-group mb-0 col Select">
                    <label htmlFor="">Select Users</label>
                    <select
                      aria-label="Default select example"
                      className="form-select"
                      name="select_user"
                      onChange={(e) => setUsertypes(e.target.value)}
                    >
                      <option selected="">Select Users</option>
                      <option value="all">All</option>
                      <option value="specific">Specific User</option>
                    </select>
                  </div>

                  <div className="form-group mb-0 col">
                    <label htmlFor="">Search User</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={options}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChange}
                      value={selectedUsers?.usersSelected}
                      onInputChange={handleInputChange}
                      isDisabled={userTypes === "specific" ? false : true}
                    />
                  </div> */}
                  <div className="form-group mb-0 mt-4 col-12 text-center">
                    <button className="comman_btn" type="submit">
                      Save
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="ResetPromo"
                      onClick={() => setSelectedUsers({ usersSelected: [] })}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Promo Code Management</h2>
                  </div>
                  <div className="col-3">
                    {/* <form className="form-design" action="">
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
                    </form> */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive p-1">
                      <MDBDataTable
                        bordered
                        displayEntries={false}
                        className=""
                        hover
                        data={promos}
                        noBottomColumns
                        sortable
                      />
                      {/* <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Promo Code (En)</th>
                            <th>Promo Code (Ar)</th>
                            <th>Image</th>
                            <th>Discount %</th>
                            <th>Valid From</th>
                            <th>Valid Till</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(promoCodes || [])?.map((item, ind) => (
                            <tr>
                              <td>{ind + 1}</td>
                              <td>{item?.name_en}</td>
                              <td>{item?.name_ar}</td>
                              <td>
                                <img
                                  className="table_img"
                                  width={70}
                                  height={60}
                                  src={
                                    item?.images
                                      ? item?.images
                                      : require("../../../assets/img/Nupload.jpg")
                                  }
                                  alt=""
                                />
                              </td>
                              <td>{item?.discount}</td>
                              <td>{item?.validFrom?.slice(0, 10)}</td>
                              <td>{item?.validTo?.slice(0, 10)}</td>
                              <td>
                                <div className="check_toggle">
                                  <input
                                    type="checkbox"
                                    defaultChecked={item?.status}
                                    name="checkv4"
                                    id={ind}
                                    className="d-none"
                                    onClick={() => {
                                      PromoCodeStatus(item?._id);
                                    }}
                                  />
                                  <label
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop12"
                                    htmlFor={ind}
                                  />
                                </div>
                              </td>
                              <td>
                                <a
                                  className="comman_btn table_viewbtn mx-1"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop22"
                                  onClick={() => handleView(item._id)}
                                >
                                  Edit
                                </a>
                                <a
                                  className="comman_btn2 table_viewbtn"
                                  onClick={DeleteCode}
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table> */}
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
        id="staticBackdrop22"
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
                Edit Promo Code
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="modal"
                aria-label="Close"
                onClick={() => {
                  document.getElementById("resetModal").click();
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row  justify-content-center"
                action=""
                onSubmit={handleSubmit2(onEdit)}
              >
                <div className="form-group col-6 choose_file position-relative">
                  <span>Promo Code Image </span>{" "}
                  <label htmlFor="upload_video_1">
                    <i className="fa fa-camera me-1" />
                    Choose File
                  </label>{" "}
                  <input
                    type="file"
                    className="form-control"
                    name="upload_video_1"
                    id="upload_video_1"
                    onChange={(e) => onFileSelection(e)}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Promo Code(En)</label>
                  <input
                    type="text"
                    // defaultValue={
                    //   editedCategories?.name_en ? editedCategories?.name_en : ""
                    // }
                    className={classNames("form-control", {
                      "is-invalid": errors2.promo_code_en_edit,
                    })}
                    name="promo_code_en_edit"
                    defaultValue={editData?.name_en}
                    {...register2("promo_code_en_edit", {
                      required: "*Promo code is required!",
                    })}
                  />
                  {errors2.promo_code_en_edit && (
                    <small className="errorText mx-1">
                      {errors2.promo_code_en_edit.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Promo Code(Ar)</label>
                  <input
                    type="text"
                    defaultValue={editData?.name_ar}
                    className={classNames("form-control", {
                      "is-invalid": errors2.promo_code_ar_edit,
                    })}
                    name="promo_code_ar_edit"
                    {...register2("promo_code_ar_edit", {
                      required: "*Promo code is required!",
                    })}
                  />
                  {errors2.promo_code_ar_edit && (
                    <small className="errorText mx-1">
                      {errors2.promo_code_ar_edit.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Discount%</label>
                  <input
                    type="text"
                    defaultValue={editData?.discount}
                    className={classNames("form-control", {
                      "is-invalid": errors2.EditDiscount,
                    })}
                    name="EditDiscount"
                    {...register2("EditDiscount", {
                      required: "*Please Enter Discount!",
                    })}
                  />
                  {errors2.EditDiscount && (
                    <small className="errorText mx-1">
                      {errors2.EditDiscount.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Valid From</label>
                  <input
                    type="date"
                    id="from"
                    className={classNames("form-control", {
                      "is-invalid": errors2.dateFrom,
                    })}
                    name="dateFromEdit"
                    {...register2("dateFromEdit", {
                      required: "*Please Select a Date!",
                    })}
                  />
                  {errors2.dateFrom && (
                    <small className="errorText mx-1">
                      {errors2.dateFrom.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Valid Till</label>
                  <input
                    type="date"
                    id="till"
                    className={classNames("form-control", {
                      "is-invalid": errors2.dateTo,
                    })}
                    name="dateToEdit"
                    {...register2("dateToEdit", {
                      required: "*Please Select a Date!",
                    })}
                  />
                  {errors2.dateTo && (
                    <small className="errorText mx-1">
                      {errors2.dateTo.message}
                    </small>
                  )}
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn" type="submit">
                    Save
                  </button>
                  <button
                    className="comman_btn d-none"
                    type="reset"
                    id="resetModal"
                  >
                    reset
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

export default PromoManagement;
