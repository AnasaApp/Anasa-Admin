import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  AddCombo,
  AllCategory,
  AllOffers,
  AllVendors,
  editOffer,
  getSubCategory,
  GetVendorByCate,
  getViewCombo,
  getViewPromo,
  ImageUpload,
  SearchUser,
  SearchVendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const MarketingOffers = () => {
  const [slide, setSlide] = useState("MO");
  const [sideBar, setSideBar] = useState();
  const [files, setFiles] = useState();
  const [userTypes, setUsertypes] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchKey2, setSearchKey2] = useState("");
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [allCategories, setAllCategories] = useState();
  const [subCategory, setSubCategory] = useState();
  const [categoryData, setCategoryData] = useState();
  const [subCategoryData, setSubCategoryData] = useState();
  const [offers, setAllOffers] = useState([]);
  const [offerId, setOfferId] = useState();
  const [categoryEditId, setCategoryEditId] = useState();
  const [subEditCategory, setSubEditCategory] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState();
  const [offerData, setOfferData] = useState();
  const [vendors, setVendors] = useState([]);
  const [selectVendor, setSelectVendor] = useState();
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

  const [offersList, setOffersList] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },

      {
        label: "Category",
        field: "category",
        sort: "asc",
        width: 100,
      },

      {
        label: "Vendor",
        field: "vendor",
        sort: "asc",
        width: 100,
      },

      {
        label: "Combo(En)",
        field: "name_en",
        sort: "asc",
        width: 100,
      },

      {
        label: "Combo(Ar)",
        field: "name_ar",
        sort: "asc",
        width: 100,
      },

      {
        label: "Amount",
        field: "number",
        sort: "asc",
        width: 100,
      },

      {
        label: "Users",
        field: "userType",
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
    getAllCat();
    getAllOffers();
  }, []);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const getAllOffers = async () => {
    const { data } = await AllOffers();
    const newRows = [];
    if (!data.error) {
      let values = data.results?.offer;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name_en = list?.name_en;
        returnData.name_ar = list?.name_ar;
        returnData.category = list?.category?.name_en;
        returnData.vendor = list?.vendor?.full_name;
        returnData.number = list?.discount;
        returnData.userType = list?.userType;
        returnData.action = (
          <>
            <a
              className="comman_btn table_viewbtn"
              href="javascript:;"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => handleView(list?._id)}
            >
              Edit
            </a>
          </>
        );
        newRows.push(returnData);
      });

      setOffersList({ ...offersList, rows: newRows });
    }
    setAllOffers(data?.results?.offer);
  };

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

  const createOptionsServices = async (id) => {
    setSelectVendor(id);
    setSelectedServices([]);
    if (id) {
      await SearchVendorServices(id).then((res) => {
        if (!res.error) {
          let data = res?.data.results.services;
          console.log(data);
          const optionList = data?.map((item, index) => ({
            value: item?._id,
            label: item?.name_en,
          }));
          setOptions2(optionList);
        }
      });
    }
  };

  const VendorsList = async (id) => {
    setCategoryData(id);
    await GetVendorByCate(id).then((res) => {
      if (!res.data.error) {
        let data = res.data.results.vendors;
        console.log(data);
        setVendors(data);
      }
    });
  };
  console.log(files?.upload_video);
  const onSubmit = async (data) => {
    await AddCombo({
      name_en: data?.combo_en,
      name_ar: data?.combo_ar,
      discount: data?.discount,
      validFrom: data?.dateFrom,
      validTo: data?.dateTo,
      userType: userTypes,
      category: categoryData,
      vendor: selectVendor,
      image: files,
      services: selectedServices.servicesSelected?.map((item) => item?.value),
      selectedUsers:
        userTypes === "specific" &&
        selectedUsers.usersSelected?.map((item) => item?.value),
    }).then((res) => {
      if (!res.error) {
        getAllOffers();
        document.getElementById("Reset").click();
        setSelectedServices({ selectedServices: [] });
        setSelectedUsers({ usersSelected: [] });
        Swal.fire({
          title: "New Combo Added!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const onEdit = async (data) => {
    console.log(data);
    await editOffer(offerId, {
      name_ar: data?.combo_ar_edit_ar,
      name_en: data?.combo_en_edit,
      discount: data?.Edit_Discount,
      validFrom: data?.dateFrom,
      validTo: data?.dateTo,
    }).then((res) => {
      if (!res.data.error) {
        document.getElementById("closed").click();
        getAllOffers();
        Swal.fire({
          title: "Offer Modified Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const onFileSelection = async (e, key) => {
    // setFiles({ ...files, [key]: e.target.files[0] });
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const data = await ImageUpload(formData);
    console.log(data.data?.results.obj);
    setFiles(data.data.results?.obj[0]);
  };

  const handleView = async (id) => {
    setOfferId(id);
    const { data } = await getViewCombo(id);
    let date = data?.results.offer;
    setOfferData(date);
    document.getElementById("from").defaultValue = date?.validFrom?.slice(
      0,
      10
    );
    document.getElementById("till").defaultValue = date?.validTo?.slice(0, 10);
    reset({
      combo_en_edit: date.name_en,
      combo_ar_edit_ar: date?.name_ar,
      Edit_Discount: date?.discount,
      dateFrom: date?.validFrom?.slice(0, 10),
      dateTo: date?.validFrom?.slice(0, 10),
    });
  };

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };

  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };
  const handleChange2 = (selected) => {
    setSelectedServices({
      servicesSelected: selected,
    });
  };
  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };

  const handleInputChange2 = (inputValue) => {
    setSearchKey2(inputValue);
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
            <div className="row">
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Add Combo</h2>
                  </div>
                </div>

                <form
                  className="form-design py-4 px-3 help-support-form row  justify-content-between"
                  action=""
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-group col-4">
                    <label htmlFor="">Combo Name (En)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.combo_en,
                      })}
                      name="combo_en"
                      {...register("combo_en", {
                        required: "*Combo Name is required!",
                      })}
                    />
                    {errors.combo_en && (
                      <small className="errorText mx-1">
                        {errors.combo_en.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Combo Name (Ar)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.combo_ar,
                      })}
                      name="combo_ar"
                      {...register("combo_ar", {
                        required: "*Combo Name is required!",
                      })}
                    />
                    {errors.combo_ar && (
                      <small className="errorText mx-1">
                        {errors.combo_ar.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Select Category</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => VendorsList(e.target.value)}
                    >
                      <option selected="" value="">
                        Select Category
                      </option>
                      {allCategories?.map((item) => (
                        <option value={item?._id}>{item?.name_en}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Select Vendor</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => createOptionsServices(e.target.value)}
                    >
                      <option selected="" value="">
                        Select Vendor
                      </option>
                      {vendors?.map((item) => (
                        <option value={item?._id}>{item?.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-4">
                    <label htmlFor="">Search Services</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={options2}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChange2}
                      value={selectedServices?.servicesSelected}
                      onInputChange={handleInputChange2}
                    />
                  </div>
                  {/* <div className="form-group col-4">
                    <label htmlFor="">Select Sub Category</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        setSubCategoryData(e.target.value);
                      }}
                    >
                      <option selected="">Select Sub Category</option>
                      {subCategory?.map((item) => (
                        <option value={item?._id}>{item?.name_en}</option>
                      ))}
                    </select>
                  </div> */}
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
                    <label htmlFor="">Amount</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.discount,
                      })}
                      name="discount"
                      {...register("discount", {
                        required: "*Discount % is required!",
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

                  <div className="form-group col-5">
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

                  <div className="form-group col-5">
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
                  </div>
                  <div className="form-group mb-0 mt-4 col-auto">
                    <button className="comman_btn" type="submit">
                      Save
                    </button>
                    <button
                      className="comman_btn d-none"
                      id="Reset"
                      type="reset"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Combo</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <MDBDataTable
                        bordered
                        displayEntries={false}
                        className=""
                        hover
                        data={offersList}
                        noBottomColumns
                        sortable
                      />
                      {/* <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Combo name (En)</th>
                            <th>Combo name (Ar)</th>
                            <th>Users</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(offers || [])?.map((item, index) => (
                            <tr>
                              <td>{index + 1}.</td>
                              <td>{item?.category?.name_en}</td>
                              <td>{item?.subCategory?.name_en}</td>
                              <td>{item?.name_en}</td>
                              <td> {item?.name_ar}</td>
                              <td>
                                {" "}
                                {item?.userType === "all"
                                  ? "All Users"
                                  : item?.selectedUsers?.map((item) => item)}
                              </td>
                              <td>
                                <a
                                  className="comman_btn table_viewbtn"
                                  href="javascript:;"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop"
                                  onClick={() => handleView(item?._id)}
                                >
                                  View
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
        id="staticBackdrop"
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
                Marketing View
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closed"
                onClick={() => {
                  document.getElementById("ResetS").click();
                  setSelectedUsers(null);
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
                  <label htmlFor="">Combo (En)</label>
                  <input
                    type="text"
                    className={classNames("form-control", {
                      "is-invalid": errors2.combo_en_edit,
                    })}
                    name="combo_en_edit"
                    defaultValue=""
                    {...register2("combo_en_edit", {
                      required: "*Combo Name is required!",
                    })}
                  />
                  {errors2.combo_en_edit && (
                    <small className="errorText mx-1">
                      {errors2.combo_en_edit.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Combo Name (Ar)</label>
                  <input
                    type="text"
                    className={classNames("form-control", {
                      "is-invalid": errors2.combo_ar_edit_ar,
                    })}
                    name="combo_ar_edit_ar"
                    defaultValue=""
                    {...register2("combo_ar_edit_ar", {
                      required: "*Combo Name is required!",
                    })}
                  />
                  {errors2.combo_ar_edit_ar && (
                    <small className="errorText mx-1">
                      {errors2.combo_ar_edit_ar.message}
                    </small>
                  )}
                </div>
                {/* <div className="form-group col-4">
                  <label htmlFor="">Select Category</label>
                  <select
                    aria-label="Default select example"
                    className="form-select form-control"
                    name="category"
                    onChange={(e) => VendorsList(e.target.value)}
                  >
                    <option selected="">{offerData?.category?.name_en}</option>
                    {allCategories?.map((item) => (
                      <option value={item?._id}>{item?.name_en}</option>
                    ))}
                  </select>
                </div> */}
                {/* <div className="form-group col-4">
                  <label htmlFor="">Select Vendor</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    onChange={(e) => createOptionsServices(e.target.value)}
                  >
                    <option selected="" value="">
                      Select Vendor
                    </option>
                    {vendors?.map((item) => (
                      <option value={item?._id}>{item?.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Search Services</label>
                  <Select
                    defaultValue=""
                    isMulti
                    name="users" 
                    options={options2}
                    className="basic-multi-select z-3"
                    classNamePrefix="select"
                    onChange={handleChange2}
                    value={selectedServices?.servicesSelected}
                    onInputChange={handleInputChange2}
                  />
                </div> */}
                <div className="form-group col-4">
                  <label htmlFor="">Valid From</label>
                  <input
                    type="date"
                    id="from"
                    className={classNames("form-control", {
                      "is-invalid": errors2.dateFrom,
                    })}
                    name="dateFrom"
                    {...register2("dateFrom", {
                      required: "*Please Select a Date!",
                    })}
                  />
                  {errors2.dateFrom && (
                    <small className="errorText mx-1">
                      {errors2.dateFrom.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Valid Till</label>
                  <input
                    type="date"
                    id="till"
                    className={classNames("form-control", {
                      "is-invalid": errors2.dateTo,
                    })}
                    name="dateTo"
                    {...register2("dateTo", {
                      required: "*Please Select a Date!",
                    })}
                  />
                  {errors2.dateTo && (
                    <small className="errorText mx-1">
                      {errors2.dateTo.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Discount % </label>
                  <input
                    type="number"
                    className={classNames("form-control", {
                      "is-invalid": errors2.Edit_Discount,
                    })}
                    {...register2("Edit_Discount", {
                      required: "*Please Enter Discount",
                    })}
                    name="Edit_Discount"
                  />
                  {errors2.Edit_Discount && (
                    <small className="errorText mx-1">
                      {errors2.Edit_Discount.message}
                    </small>
                  )}
                </div>

                {/* <div className="form-group col-12">
                  <label htmlFor="">Selected Users - (ALL)</label>
                  <input
                    type="text"
                    disabled
                    className={classNames("form-control", {
                      "is-invalid": errors2.users,
                    })}
                    name="users"
                  />
                </div> */}

                {/* <div className="form-group col-6">
                  <label htmlFor="">Search User</label>
                  <Select
                    defaultValue=""
                    isMulti
                    name="users"
                    options={options}
                    className="basic-multi-select z-3"
                    classNamePrefix="select"
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    isDisabled={userTypes === "specific" ? false : true}
                  />
                </div> */}
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <button className="comman_btn" type="submit">
                    Save
                  </button>
                </div>
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <button
                    className="comman_btn d-none"
                    type="reset"
                    id="ResetS"
                  >
                    Reset
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

export default MarketingOffers;
