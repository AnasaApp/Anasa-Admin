import classNames from "classnames";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  AddCategory,
  AllCategory,
  editCategoryData,
  getViewCategory,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import SubCategories from "./SubCategories";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const Categories = () => {
  const [slide, setSlide] = useState("CM");
  const [files, setFiles] = useState([]);
  const [editedCategories, setEditedCategories] = useState([]);
  const [CatId, setCatId] = useState();
  const [editCatEn, setEditCatEn] = useState("");
  const [editCatAr, setEditCatAr] = useState("");
  const [sideBar, setSideBar] = useState();
  const [cate, setCate] = useState(false);
  const [category, setCategory] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 150,
      },
      {
        label: "IMAGE",
        field: "image",
        sort: "asc",
        width: 150,
      },
      {
        label: "CATEGORY (EN)",
        field: "name_en",
        sort: "asc",
        width: 150,
      },

      {
        label: "CATEGORY (AR)",
        field: "name_ar",
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

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAllCat();
  }, []);

  const getAllCat = async () => {
    const { data } = await AllCategory();
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.categories;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.image = (
          <img src={list.image} alt="image" className="table_img" />
        );
        returnData.name_en = list?.name_en;
        returnData.name_ar = list?.name_ar;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.action = (
          <>
            <a
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              className=" table_viewbtn"
              style={{ color: "#fff", background: "#4f73af" }}
              // href="javascript:;"
              onClick={() => editCategory(list._id)}
            >
              Edit
            </a>
          </>
        );
        newRows.push(returnData);
      });

      setCategory({ ...category, rows: newRows });
    }
    // setAllCategories(data?.results?.categories);
  };

  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name_en", data?.Category_name?.trim());
    formData.append("name_ar", data?.Category_name_ar?.trim());
    formData.append("image", files?.upload_video);
    const res = await AddCategory(formData);
    console.log(res);
    if (!res.data.error) {
      getAllCat();
      setFiles([]);
      document?.getElementById("Reset").click();
      Swal.fire({
        title: "New Category Added!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const editCategory = async (id) => {
    setCatId(id);
    const { data } = await getViewCategory(id);
    setEditedCategories(data?.results.categories);
  };
  console.log(files);

  const saveCategories = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name_en", editCatEn);
    formData.append("name_ar", editCatAr);
    formData.append("image", files?.upload_video2);
    console.log(formData);
    const { data } = await editCategoryData(CatId, formData);
    console.log(data);
    if (!data.error) {
      document.getElementById("modal").click();
      getAllCat();
      Swal.fire({
        title: "Category Modified Successfully!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
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
                          className="nav-link active "
                          id="home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#home"
                          type="button"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true"
                        >
                          Category
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
                          onClick={() => {
                            getAllCat();
                            setCate(!cate);
                          }}
                        >
                          Sub Category
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
                          <div className="col-12 mb-4 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto ">
                                <h2 className="fw-bolder">Add New Category</h2>
                              </div>
                            </div>
                            <form
                              className="form-design py-4 px-3 help-support-form row  justify-content-between"
                              action=""
                              onSubmit={handleSubmit(onSubmit)}
                            >
                              <div className="form-group mb-0 col">
                                <label htmlFor="">Category Name (En)</label>
                                <input
                                  type="text"
                                  className={classNames("form-control", {
                                    "is-invalid": errors.Category_name,
                                  })}
                                  name="Category_name"
                                  {...register("Category_name", {
                                    required: "Category Name is required!",
                                    pattern: {
                                      value:
                                        /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/,
                                      message: "Special Character not allowed!",
                                    },
                                    maxLength: {
                                      value: 30,
                                      message: "Max length is 30 characters!",
                                    },
                                    minLength: {
                                      value: 2,
                                      message: "Min length is 2 characters!",
                                    },
                                  })}
                                />
                                {errors.Category_name && (
                                  <small className="errorText mx-1">
                                    *{errors.Category_name?.message}
                                  </small>
                                )}
                              </div>
                              <div className="form-group mb-0 col">
                                <label htmlFor="">Category Name (Ar)</label>
                                <input
                                  type="text"
                                  lang="ar"
                                  dir="rtl"
                                  className={classNames("form-control", {
                                    "is-invalid": errors.Category_name_ar,
                                  })}
                                  name="Category_name_ar"
                                  {...register("Category_name_ar", {
                                    required: "Category Name is required!",
                                    pattern: {
                                      value: /^[\u0621-\u064A\u0660-\u0669 ]+$/,
                                      message:
                                        "Only Arabic Characters are allowed!",
                                    },
                                    maxLength: {
                                      value: 30,
                                      message: "Max length is 30 characters!",
                                    },
                                    minLength: {
                                      value: 2,
                                      message: "Min length is 2 characters!",
                                    },
                                  })}
                                />

                                {errors.Category_name_ar && (
                                  <small className="errorText mx-1">
                                    *{errors.Category_name_ar?.message}
                                  </small>
                                )}
                              </div>
                              <div className="form-group mb-0 col choose_file position-relative">
                                <span>Category Image </span>{" "}
                                <label htmlFor="upload_video">
                                  <i className="fa fa-camera me-1" />
                                  Choose File
                                </label>{" "}
                                <input
                                  type="file"
                                  className="form-control"
                                  defaultValue=""
                                  accept="image/*"
                                  name="upload_video"
                                  id="upload_video"
                                  onChange={(e) =>
                                    onFileSelection(e, "upload_video")
                                  }
                                />
                              </div>
                              <div className="form-group mt-4 col-1">
                                <button
                                  className="comman_btn mt-2"
                                  type="submit"
                                >
                                  Save
                                </button>
                              </div>
                              <div className="form-group mb-0 col-auto">
                                <button
                                  className="comman_btn d-none"
                                  type="reset"
                                  id="Reset"
                                >
                                  reset
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2 className="fw-bolder">Categories</h2>
                              </div>
                              <div className="col-3"></div>
                            </div>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive p-0">
                                  <MDBDataTable
                                    bordered
                                    displayEntries={false}
                                    className="categoryTable"
                                    hover
                                    data={category}
                                    noBottomColumns
                                    sortable
                                  />
                                  {/* <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Image</th>
                                        <th>Category (En)</th>
                                        <th>Category (Ar)</th>
                                        <th>Added On</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(allCategories || [])?.map(
                                        (item, index) => (
                                          <tr key={index}>
                                            <td>{index + 1}.</td>
                                            <td>
                                              <img
                                                src={
                                                  item?.image
                                                    ? item?.image
                                                    : require("../../../assets/img/Nupload.jpg")
                                                }
                                                className="table_img"
                                                alt=""
                                              />
                                            </td>
                                            <td>{item?.name_en}</td>
                                            <td>{item?.name_ar}</td>
                                            <td>
                                              {item?.createdAt?.slice(0, 10)}
                                            </td>
                                            <td>
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target="#staticBackdrop"
                                                className="comman_btn table_viewbtn"
                                                href="javascript:;"
                                                onClick={() =>
                                                  editCategory(item._id)
                                                }
                                              >
                                                Edit
                                              </a>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table> */}
                                </div>
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
                        <SubCategories cate={cate} />
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
                Edit Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="modal"
                aria-label="Close"
                onClick={() => {
                  document.getElementById("modalReset").click();
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
              >
                <div className="form-group col-6 choose_file position-relative">
                  <span>Category Image </span>{" "}
                  <label htmlFor="upload_video">
                    <i className="fa fa-camera me-1" />
                    Choose File
                  </label>{" "}
                  <input
                    type="file"
                    className="form-control"
                    defaultValue=""
                    name="upload_video2"
                    id="upload_video2"
                    onChange={(e) => onFileSelection(e, "upload_video2")}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Category Name (En)</label>
                  <input
                    type="text"
                    defaultValue={
                      editedCategories?.name_en ? editedCategories?.name_en : ""
                    }
                    className="form-control"
                    onChange={(e) => setEditCatEn(e.target.value)}
                  />
                </div>
                <div className="form-group col-12">
                  <label htmlFor="">Category Name (Ar)</label>
                  <input
                    type="text"
                    defaultValue={editedCategories?.name_ar}
                    className="form-control"
                    onChange={(e) => setEditCatAr(e.target.value)}
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn" onClick={saveCategories}>
                    Save
                  </button>
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button
                    className="comman_btn d-none"
                    id="modalReset"
                    type="reset"
                  ></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
