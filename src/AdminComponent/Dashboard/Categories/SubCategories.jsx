import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  AddSubCategory,
  AllCategory,
  AllSubCategory,
  changeSubCateStatus,
  editSubCategoryData,
  getViewSubCategory,
} from "../../httpServices/dashHttpService";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const SubCategories = ({ cate, croppedImage }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [files, setFiles] = useState();
  const [editedSubCategories, setEditedSubCategories] = useState([]);
  const [CatId, setCatId] = useState();
  const [editSubCatEn, setEditSubCatEn] = useState("");
  const [editCatEn, setEditCatEn] = useState("");
  const [editSubCatAr, setEditSubCatAr] = useState("");
  const [editedImg, setEditedImg] = useState();
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
        label: "CATEGORY",
        field: "name_cate",
        sort: "asc",
        width: 150,
      },
      {
        label: "SUB CATEGORY (EN)",
        field: "name_en",
        sort: "asc",
        width: 150,
      },

      {
        label: "SUB CATEGORY (AR)",
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAllCat();
    getAllSubCat();
  }, [cate]);

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };
  const getAllSubCat = async () => {
    const { data } = await AllSubCategory();
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.subCategories;
      values.sort((a, b) => (a.status === true ? -1 : b.status === true ? 1 : 0));
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.image = (
          <img
            src={
              list?.image
                ? list?.image
                : require("../../../assets/img/Nupload.jpg")
            }
            alt="image"
            className="table_img"
          />
        );
        returnData.name_cate = list?.category?.name_en;
        returnData.name_en = list?.name_en;
        returnData.name_ar = list?.name_ar;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = (
          <>
            <div className="check_toggle" key={list?._id}>
              <input
                type="checkbox"
                defaultChecked={list?.status}
                name="check1"
                id={list?._id}
                className="d-none"
                onClick={() => {
                  SubCateStatus(list?._id);
                }}
              />
              <label for={list?._id}></label>
            </div>
          </>
        );
        returnData.action = (
          <>
            <a
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop1"
              className="comman_btn table_viewbtn mx-1"
              href="javascript:;"
              onClick={() => editSubCategory(list?._id)}>
              Edit
            </a>
          </>
        );
        newRows.push(returnData);
      });

      setCategory({ ...category, rows: newRows });
    }
  };

  const SubCateStatus = async (id) => {
    const { data } = await changeSubCateStatus(id);

    if (!data?.error) {
      getAllSubCat();
      Swal.fire({
        title: "Sub-Category Status Changed!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };
  
  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name_en", data?.sub_category?.trim());
    formData.append("name_ar", data?.sub_category_ar?.trim());
    formData.append("category", data?.category);
    // formData.append("image", files?.upload_video);
    formData.append("image", croppedImage );
    const res = await AddSubCategory(formData);
    console.log(croppedImage)
    // let res = true
    console.log(res);
    if (!res.data.error) {
      getAllSubCat();
      document.getElementById("ResetSub").click();
      Swal.fire({
        title: "New Sub-Category Added!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
      setFiles([]);
    }
  };

  const editSubCategory = async (id) => {
    setCatId(id);
    const { data } = await getViewSubCategory(id);
    setEditedSubCategories(data?.results.subCategories);
  };

  const saveSubCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", editCatEn);
    formData.append("name_ar", editSubCatAr);
    formData.append("name_en", editSubCatEn);
    // formData.append("image", files?.subCateImg);
    formData.append("image", croppedImage);
    const { data } = await editSubCategoryData(CatId, formData);
    if (!data.error) {
      document.getElementById("modal2").click();
      getAllSubCat();
      setEditedImg();
      Swal.fire({
        title: "Sub Category Modified Successfully!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
      setFiles([]);
    }
  };

  return (
    <div className="">
      <div className="row p-4 mx-0">
        <div className="col-12 mb-4 inner_design_comman border">
          <div className="row comman_header justify-content-between">
            <div className="col-auto">
              <h2>Add New Sub Category</h2>
            </div>
          </div>
          <form
            className="form-design py-4 px-3 help-support-form row  justify-content-between"
            action=""
            onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-6">
              <label htmlFor="">Category</label>
              <select
                className={classNames("form-select form-control", {
                  "is-invalid": errors.category,
                })}
                aria-label="Default select example"
                name="category"
                {...register("category", {
                  required: "Category is required!",
                })}>
                <option selected="">Select Category</option>
                {(allCategories || [])?.map((item, index) => (
                  <option key={index} value={item?._id}>
                    {item?.name_en}
                  </option>
                ))}
              </select>
              {errors.category && (
                <small className="errorText mx-1">
                  *{errors.category?.message}
                </small>
              )}
            </div>
            <div className="form-group col-6">
              <label htmlFor="">Sub Category Name (En)</label>
              <input
                type="text"
                className={classNames("form-control", {
                  "is-invalid": errors.sub_category,
                })}
                name="sub_category"
                {...register("sub_category", {
                  required: "Sub Category Name is required!",

                  maxLength: {
                    value: 50,
                    message: "Max length is 50 characters!",
                  },
                  minLength: {
                    value: 2,
                    message: "Min length is 2 characters!",
                  },
                })}
              />
              {errors.sub_category && (
                <small className="errorText mx-1">
                  *{errors.sub_category?.message}
                </small>
              )}
            </div>
            <div className="form-group mb-0 col-6 ">
              <label htmlFor="">Sub Category Name (Ar)</label>
              <input
                type="text"
                lang="ar"
                dir="rtl"
                className={classNames("form-control", {
                  "is-invalid": errors.sub_category_ar,
                })}
                name="sub_category_ar"
                {...register("sub_category_ar", {
                  required: "Sub Category(ar) Name is required!",
                  pattern: {
                    value: /^[\u0621-\u064A\u0660-\u0669,{.'"!_-} ]+$/,
                    message: "Only Arabic Characters are allowed!",
                  },
                  maxLength: {
                    value: 50,
                    message: "Max length is 50 characters!",
                  },

                  minLength: {
                    value: 2,
                    message: "Min length is 2 characters!",
                  },
                })}
              />
              {errors.sub_category_ar && (
                <small className="errorText mx-1">
                  *{errors.sub_category_ar?.message}
                </small>
              )}
            </div>
            <div className="form-group mb-0 col-auto choose_file position-relative">
              <span>Sub Category Image </span>{" "}
              <label htmlFor="upload_video">
                <i className="fa fa-camera me-1" />
                Choose File
              </label>{" "}
              <input
                type="file"
                className="form-control mx-2"
                defaultValue=""
                name="upload_video"
                accept="image/*"
                id="upload_video"
                onChange={(e) => onFileSelection(e, "upload_video")}
              />
            </div>
            <div className="form-group mt-4 col-auto">
              <button className="comman_btn mt-1">Save</button>
            </div>
            <div className="form-group mt-4 col-auto">
              <button
                className="comman_btn mt-1 d-none"
                type="reset"
                id="ResetSub">
                reset
              </button>
            </div>
          </form>
        </div>
        <div className="col-12 inner_design_comman border">
          <div className="row comman_header justify-content-between">
            <div className="col-auto">
              <h2>Sub Categories</h2>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade comman_modal"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Sub Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal2"
                onClick={() => {
                  document.getElementById("modalSubReset").click();
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row  justify-content-center"
                action="">
                <div className="form-group col-6 ">
                  <label htmlFor="">Sub-Category Image</label>

                  <input
                    type="file"
                    className="form-control mx-2"
                    defaultValue=""
                    accept="image/*"
                    name="subCateImg"
                    id="subCateImgEdit"
                    onChange={(e) => onFileSelection(e, "subCateImg")}
                  />
                </div>

                <div className="form-group col-6">
                  <label htmlFor="">Category Name</label>
                  <select
                    aria-label="Default select example"
                    name="category"
                    className="form-control"
                    onChange={(e) => setEditCatEn(e.target.value)}>
                    <option
                      selected=""
                      value={editedSubCategories?.category?._id}>
                      {editedSubCategories?.category?.name_en}
                    </option>
                    {(allCategories || [])?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item?.name_en}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <small className="errorText mx-1">
                      *{errors.category?.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Sub Category Name (En)</label>
                  <input
                    type="text"
                    defaultValue={editedSubCategories?.name_en}
                    className="form-control"
                    onChange={(e) => setEditSubCatEn(e.target.value)}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Sub Category Name (Ar)</label>
                  <input
                    type="text"
                    lang="ar"
                    dir="rtl"
                    defaultValue={editedSubCategories?.name_ar}
                    className="form-control"
                    onChange={(e) => setEditSubCatAr(e.target.value)}
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn" onClick={saveSubCategory}>
                    Save
                  </button>
                </div>
                <button
                  className="comman_btn d-none"
                  id="modalSubReset"
                  type="reset"></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategories;
