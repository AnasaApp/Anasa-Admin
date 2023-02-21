import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  AddCombo,
  AllCategory,
  AllOffers,
  getSubCategory,
  getViewCombo,
  getViewPromo,
  SearchUser,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const MarketingOffers = () => {
  const [slide, setSlide] = useState("MO");
  const [sideBar, setSideBar] = useState();
  const [files, setFiles] = useState();
  const [userTypes, setUsertypes] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [options, setOptions] = useState([]);
  const [allCategories, setAllCategories] = useState();
  const [subCategory, setSubCategory] = useState();
  const [categoryData, setCategoryData] = useState();
  const [subCategoryData, setSubCategoryData] = useState();
  const [offers, setAllOffers] = useState([]);
  const [comboId, setComboId] = useState();
  const [categoryEditId, setCategoryEditId] = useState();
  const [subEditCategory, setSubEditCategory] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState();
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

  useEffect(() => {
    getAllCat();
    getAllOffers();
  }, []);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const getAllOffers = async () => {
    const { data } = await AllOffers();
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

  const onSubmit = async (data) => {
    console.log(data);
    let formData = new FormData();
    formData.append("name_en", data?.combo_en);
    formData.append("name_ar", data?.combo_ar);
    formData.append("discount", data?.discount);
    formData.append("validFrom", data?.dateFrom);
    formData.append("validTo", data?.dateTo);
    formData.append("userType", userTypes);
    formData.append("category", categoryData);
    formData.append("subCategory", subCategoryData);
    formData.append("image", files?.upload_video);
    userTypes === "specific" &&
      formData.append(
        "selectedUsers",
        JSON.stringify(selectedUsers.usersSelected?.map((item) => item?.value))
      );
    await AddCombo(formData).then((res) => {
      // console.log(res);
      if (!res.error) {
        document.getElementById("Reset").click();
        setSelectedUsers({ usersSelected: [] });
        Swal.fire({
          title: "Combo Added!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const onEdit = (data) => {
    console.log(data);
  };
  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  const handleView = async (id) => {
    setComboId(id);
    const { data } = await getViewCombo(id);
    let date = data?.results.promocode;
    // setEditData(data?.results.promocode);
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

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };
  const subCategories = async (id) => {
    const { data } = await getSubCategory({ categoryId: id });
    setSubCategory(data?.results?.subCategories);
    setCategoryData(id);
  };

  const subCategoriesOnEdit = async (id) => {
    const { data } = await getSubCategory({ categoryId: id });
    setSubEditCategory(data?.results?.subCategories);
    setCategoryEditId(id);
  };
  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
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
                  <div className="form-group col-6">
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
                  <div className="form-group col-6">
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
                      onChange={(e) => subCategories(e.target.value)}
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

                  <div className="col-3">
                    <form className="form-design" action="">
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
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Combo name (En)</th>
                            <th>Combo name (Ar)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(offers || [])?.map((item, index) => (
                            <tr>
                              <td>{index + 1}.</td>
                              <td>Lorem ipsum</td>
                              <td>Lorem ipsum</td>
                              <td>{item?.name_en}</td>
                              <td> {item?.name_ar}</td>
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
                                <a
                                  className="comman_btn2 table_viewbtn"
                                  href="javascript:;"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                      "is-invalid": errors2.combo_ar_edit,
                    })}
                    name="combo_ar_edit"
                    defaultValue=""
                    {...register2("combo_ar_edit", {
                      required: "*Combo Name is required!",
                    })}
                  />
                  {errors2.combo_ar_edit && (
                    <small className="errorText mx-1">
                      {errors2.combo_ar_edit.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Select Category</label>
                  <select
                    aria-label="Default select example"
                    className="form-select form-control"
                    name="category"
                    onChange={(e) => subCategoriesOnEdit(e.target.value)}
                  >
                    <option selected="" value="">
                      Select Category
                    </option>
                    {allCategories?.map((item) => (
                      <option value={item?._id}>{item?.name_en}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Select Sub Category </label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    onChange={(e) => {
                      setSubCategoryId(e.target.value);
                    }}
                  >
                    <option selected="">Select Sub Category</option>
                    {subEditCategory?.map((item) => (
                      <option value={item?._id}>{item?.name_en}</option>
                    ))}
                  </select>
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
                  <label htmlFor="">Discount % </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={20}
                  />
                </div>

                <div className="form-group col-6">
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

                <div className="form-group col-6">
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
                </div>
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <button className="comman_btn">Save</button>
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
