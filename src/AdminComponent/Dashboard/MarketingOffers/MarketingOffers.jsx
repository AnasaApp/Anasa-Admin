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
  VendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const MarketingOffers = () => {
  const [slide, setSlide] = useState("MO");
  const [sideBar, setSideBar] = useState();
  const [files, setFiles] = useState();
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

  const [offerData, setOfferData] = useState();
  const [vendors, setVendors] = useState([]);
  const [selectVendor, setSelectVendor] = useState();
  const [formValues, setFormValues] = useState([
    {
      category: "",
      vendor: "",
      service: "",
    },
  ]);
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
        label: "Service",
        field: "service",
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
        returnData.name_ar = (
          <span lang="ar" dir="rtl">
            {list?.name_ar}
          </span>
        );
        returnData.category = list?.type[0].category?.name_en;
        returnData.vendor = list?.type[0].vendor?.full_name;
        returnData.number = list?.comboPrice;
        returnData.service = list?.type[0].service?.name_en;
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
    if (id) {
      await VendorServices(id).then((res) => {
        if (!res.error) {
          setSelectedServices({ servicesSelected: [] });
          let data = res?.data.results.services;
          const optionList = data
            ?.filter((itm, idx) => itm.vendor === id)
            .map((item, index) => {
              return item;
            });
          let packs = [...options2];
          packs.push(optionList[0]);
          console.log(packs, "jkj");
          setOptions2(packs);
        }
      });
    }
  };

  const VendorsList = async (id, ind) => {
    setCategoryData(id);
    await GetVendorByCate(id).then((res) => {
      if (!res.data.error) {
        let data = res.data.results.vendors;
        const optionList = data?.map((item, index) => {
          return item;
        });
        let packs = [...vendors];
        packs[ind] = optionList;
        setVendors(packs);
      }
    });
  };
  console.log(formValues, "f");

  const onSubmit = async (data) => {
    console.log(data);
    if(!formValues[0]?.category || !formValues[0]?.vendor || !formValues[0]?.service){
      Swal.fire({
        title: "Error!",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
        text:"Category, Vendor or Service are empty, Please choose",
      })
      return false;
    }
    await AddCombo({
      name_en: data?.combo_en,
      name_ar: data?.combo_ar,
      comboPrice: data?.discount,
      validFrom: data?.dateFrom,
      validTo: data?.dateTo,
      image: files,
      type: formValues,
    }).then((res) => {
      if (!res.error) {
        console.log(res);
        setSelectedServices({ servicesSelected: [] });
        getAllOffers();
        setFormValues([
          {
            category: "",
            vendor: "",
            service: "",
          },
        ]);
        document.getElementById("Reset").click();
        Swal.fire({
          title: "New Combo Added!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
      }
      if (res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "error",
          confirmButtonText: "Okay",
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

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    newFormValues?.splice(index, 1);
    setFormValues(newFormValues);
  };
  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        service: "",
        package: "",
      },
    ]);
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
                      lang="ar"
                      dir="rtl"
                      className={classNames("form-control", {
                        "is-invalid": errors.combo_ar,
                      })}
                      name="combo_ar"
                      {...register("combo_ar", {
                        required: "*Combo Name is required!",
                        pattern: {
                          // value: /^[\u0600-\u06FF,\u0600-\u06FF, ]*$/,
                          value:
                            /^[،\u0621-\u064A\u0660-\u06690-9\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/u,
                          message: "Only Arabic Characters are allowed!",
                        },
                      })}
                    />
                    {errors.combo_ar && (
                      <small className="errorText mx-1">
                        {errors.combo_ar.message}
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
                      className="form-control ms-3"
                      accept="image/*"
                      name="upload_video"
                      id="upload_video"
                      onChange={(e) => onFileSelection(e, "upload_video")}
                    />
                  </div>

                  <div className="form-group col-4">
                    <label htmlFor="">Discount</label>
                    <input
                      type="number"
                      className={classNames("form-control", {
                        "is-invalid": errors.discount,
                      })}
                      name="discount"
                      {...register("discount", {
                        required: "*Discount % is required!",
                        maxLength: {
                          value: 5,
                          message: "*Max character Length is 5",
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
                  {(formValues || [])?.map((element, index) => (
                    <div className="form-group mb-0 col-12 ">
                      <div className="row mt-3" key={index}>
                        <div className="form-group col-4">
                          <label htmlFor="">Select Category</label>
                          <select
                            className="form-select "
                            aria-label="Default select example"
                            name="category"
                            value={element.category || ""}
                            onChange={(e) => {
                              handleChange(index, e);
                              VendorsList(e.target.value, index);
                            }}
                          >
                            <option selected="" value="">
                              Select Category
                            </option>
                            {allCategories
                              ?.filter((cat) => cat.status === true)
                              ?.map((item) => (
                                <option value={item?._id}>
                                  {item?.name_en}
                                </option>
                              ))}
                          </select>
                        </div>
                        {console.log(formValues)}
                        <div className="form-group col-4">
                          <label htmlFor="">Select Vendor</label>
                          <select
                            className="form-select "
                            aria-label="Default select example"
                            id={index}
                            name="vendor"
                            value={element.vendor || ""}
                            onChange={(e) => {
                              handleChange(index, e);
                              createOptionsServices(e.target.value);
                            }}
                          >
                            <option selected="" value="">
                              Select Vendor
                            </option>

                            {vendors[index]?.map((item) => (
                              <option value={item?._id}>
                                {item?.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-3">
                          <label htmlFor="">Select Service</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            name="service"
                            value={element.service || ""}
                            onChange={(e) => {
                              handleChange(index, e);
                            }}
                          >
                            <option selected="" value="">
                              Select Service
                            </option>
                            {options2
                              ?.filter(
                                (itm, id) => itm?.vendor === element?.vendor
                              )
                              .map((item) => (
                                <option value={item?._id}>
                                  {item?.name_en}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* <div className="form-group col-3">
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

                        <div className="form-group col-1  mt-4">
                          <button
                            className="comman_btn mt-2"
                            style={{ padding: "5px 20px" }}
                            type="button"
                            disabled={formValues?.length <= 1 ? true : false}
                            onClick={() => removeFormFields(index)}
                          >
                            <i className="fa fa-minus mt-1 mx-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <a
                      className="comman_btn mx-3 "
                      onClick={() => addFormFields()}
                    >
                      Add more +
                    </a>
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
                    dir="rtl"
                    className={classNames("form-control", {
                      "is-invalid": errors2.combo_ar_edit_ar,
                    })}
                    name="combo_ar_edit_ar"
                    defaultValue=""
                    {...register2("combo_ar_edit_ar", {
                      required: "*Combo Name is required!",
                      pattern: {
                        value: /^[\u0621-\u064A\u0660-\u0669, ]+$/,
                        message: "Only Arabic Characters are allowed!",
                      },
                    })}
                  />
                  {errors2.combo_ar_edit_ar && (
                    <small className="errorText mx-1">
                      {errors2.combo_ar_edit_ar.message}
                    </small>
                  )}
                </div>

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
                  <label htmlFor="">Amount </label>
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
