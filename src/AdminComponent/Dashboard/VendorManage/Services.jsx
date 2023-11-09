import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AllCategory,
  UpdateServices,
  getSubCategory,
  getVendorDetails,
  getVendorServices,
  importVendorServices,
  vendorServiceStatus,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import Swal from "sweetalert2";

const Services = () => {
  const [vendorService, setVendorService] = useState();
  const [slide, setSlide] = useState("VM");
  const [sideBar, setSideBar] = useState();
  const [vendor, setVendor] = useState();
  const [dataToEdit, setDataToEdit] = useState(null);
  const [category, setCategory] = useState();
  const [selectedEnCategory, setSelectedEnCategory] = useState("");
  const [selectedArCategory, setSelectedArCategory] = useState("");
  const [selectedEnSubCategory, setSelectedEnSubCategory] = useState("");
  const [selectedArSubCategory, setSelectedArSubCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState(null);

  const [serviceNameEn, setServiceNameEn] = useState();
  const [serviceNameAr, setServiceNameAr] = useState();
  const [descriptionNameEn, setDescriptionNameEn] = useState();
  const [descriptionNameAr, setDescriptionNameAr] = useState();
  const [price, setPrice] = useState();

  const [subCat_Id, setSubCat_Id] = useState();

  let id = useParams();
  // console.log(id);
  useEffect(() => {
    GetVendorServices();
    GetVendor();
    getAllCategory();
  }, []);

  const GetVendor = async () => {
    const { data } = await getVendorDetails(id?.id, { status: "APPROVED" });
    setVendor(data?.results.vendor);
  };

  const GetVendorServices = async () => {
    const { data } = await getVendorServices(id?.id);
    console.warn(data.results.services);
    let values = data.results.services;
    setVendorService(data?.results.services);
  };
  const getAllCategory = async () => {
    const { data } = await AllCategory();
    setCategory(data?.results?.categories);
    console.log(data?.results?.categories);
  };
  const getAllSubCategory = async (categoryId) => {
    console.log(categoryId);
    const { data } = await getSubCategory({ categoryId });
    setSubCategory(data?.results?.subCategories);
    console.log(data);
    if (data?.results?.subCategories) {
      setSelectedArSubCategory(data?.results?.subCategories[0]?.name_ar || " ");
      setSubCat_Id(data?.results?.subCategories[0]?._id);
    }
  };
  const getBarClick = (val) => {
    // console.log(val);
    setSideBar(val);
  };

  const closeModal = () => {
    setDataToEdit(null);
    setModalVisible(false);
  };

  const handleEdit = async (item) => {
    let categoryId = item?.category?._id;
    if (categoryId) {
      await getAllSubCategory(categoryId);
    } else {
      setSubCategory([]);
    }

    setModalVisible(true);
    setDataToEdit(item);
    setServiceNameEn(item?.name_en);
    setServiceNameAr(item?.name_ar);
    setDescriptionNameAr(item?.description_ar);
    setDescriptionNameEn(item?.description_en);
    setPrice(item?.price);
    // setSelectedEnCategory(item?.category?.name_en);
    setSelectedEnSubCategory(item?.subCategory?.name_en || "");
    setSelectedArSubCategory(item?.subCategory?.name_ar || "");
  };

  const handleCategoryEnChange = (e) => {
    let value = e.target.value;
    const selectedCategoryId = value;
    if (category && category.length > 0) {
      const selectedCategory = category.find(
        (cat) => cat?._id === selectedCategoryId
      );

      if (selectedCategory) {
        getAllSubCategory(selectedCategory._id);
        setSelectedArCategory(selectedCategory.name_ar);
        setSelectedEnCategory(selectedCategory?.name_en);
      } else {
        setSubCategory([]);
        setSelectedEnSubCategory("");
        setSelectedArSubCategory("");
      }
    }
  };

  const handleSubCatChange = (e) => {
    let value = e.target.value;
    setSelectedEnSubCategory(value);
    let selectedSubCategory = subCategory.find(
      (subCat) => subCat?.name_en === value
    );
    console.log(selectedSubCategory);
    setSelectedArSubCategory(selectedSubCategory.name_ar || "");
    setSubCat_Id(selectedSubCategory?._id);
  };
  const changeVendorServiceStatus = async (id) => {
    console.log(id);
    const { data } = await vendorServiceStatus(id);
    GetVendorServices();
    console.log(data);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Status changed successfully",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 3000,
    });
  };

  const onFileSelection = (e, key) => {
    const selectedFile = e.target.files[0];
    // setFiles(selectedFile);
    setFiles({ ...files, [key]: selectedFile });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!files || !files.upload_file) {
      alert("Please select a file to upload.");
      return false;
    }
    console.log("Vendor id ", id?.id);
    const formData = new FormData();
    formData.append("vendorId", id?.id);
    formData.append("file", files.upload_file);

    const { data } = await importVendorServices(formData);
    console.warn(data);
    if (!data.error) {
      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      document.getElementById("reset_mass_ass_form").click()
      GetVendorServices();
    } else if (data.error) {
      console.log(data);
    }
  };

  const handleEditFinish = async (id, e) => {
    e.preventDefault();
    let category_id = category.find(
      (cat) => selectedEnCategory === cat.name_en
    );
    const formData = new FormData();
    formData.append("name_en", serviceNameEn);
    formData.append("name_ar", serviceNameAr);
    formData.append("description_en", descriptionNameEn);
    formData.append("description_ar", descriptionNameAr);
    formData.append("categoryId", category_id?._id);
    if (subCat_Id) {
      formData.append("subCategoryId", subCat_Id);
    }
    formData.append("price", price);
    let { data } = await UpdateServices(id, formData);
    if (!data.error) {
      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
    setModalVisible(false);
    GetVendorServices();
  };

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row service-management justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow mb-4 toggle_set">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Vendor Details</h2>
                  </div>
                </div>
                <div className="row">
                  <form className="row align-items-center justify-content-center form-design position-relative p-4 py-5">
                    <div className="col-5">
                      <div className="row adjust_margin">
                        <div className="form-group col-12 mb-2">
                          <div className="userinfor_box text-center">
                            <span className="user_imgg">
                              <img
                                src={
                                  vendor?.shop_cover_image
                                    ? vendor?.shop_cover_image
                                    : require("../../../assets/img/uploadImg.jfif")
                                }
                                alt=""
                              />
                            </span>
                            <strong>{vendor?.full_name}</strong>
                          </div>
                        </div>
                        {/* <div class="form-group col-12 text-center mb-0">
                                    <label class="mb-0 text-center" for="">Registration Date: 01/01/2022</label>
                                 </div> */}
                      </div>
                    </div>
                    <div className="col-5">
                      <div className="row">
                        <div className="form-group col-12">
                          <label htmlFor="">Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={vendor?.phone_number}
                            name="name"
                            id="name"
                          />
                        </div>
                        <div className="form-group col-12 mb-0">
                          <label htmlFor="">Email Id </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={vendor?.email}
                            name="name"
                            id="name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-auto" />
                  </form>
                </div>
              </div>
              <div className="col-12 design_outter_comman shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Service Details</h2>
                  </div>
                </div>
                <div className="form-group mb-0 col-12 mt-3 mx-2 choose_file position-relative">
                  <form
                    className="d-flex align-items-center justify-content-between"
                    onSubmit={(e) => handleFileSubmit(e)}
                  >
                    <div className="col-6">
                      <span className="mx-2">Add Mass Services</span>{" "}
                      <label className="mt-1 " htmlFor="upload_file">
                        <i className="fa fa-camera me-1 " />
                        Choose File
                      </label>
                      <input
                        className="form-control py-3 ms-2"
                        type="file"
                        accept=".xls, .xlsx"
                        name="upload_file"
                        id="upload_file"
                        onChange={(e) => onFileSelection(e, "upload_file")}
                      />
                    </div>
                    <div className="col-4">
                      <button className="comman_btn" type="submit">
                        Submit
                      </button>
                    </div>
                    <div className="col-4 d-none">
                      <button id="reset_mass_ass_form" type="reset">
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
                <div className="row mx-0 ">
                  {vendorService?.length ? (
                    <div className="col-12 px-4 pb-4 ">
                      {vendorService?.map((item, index) => (
                        <div
                          className="row booking_details_box mt-4 position-relative"
                          key={index}
                        >
                          <div
                            className="position-absolute top-0 text-end check_toggle pe-5"
                            key={item?._id}
                          >
                            <input
                              type="checkbox"
                              defaultChecked={item?.status}
                              name="check1"
                              id={item?._id}
                              className="d-none"
                              onClick={() => {
                                changeVendorServiceStatus(item?._id);
                              }}
                            />
                            <label for={item?._id}></label>
                          </div>
                          <div className="text-end position-absolute bottom-0 pb-2">
                            <button
                              className="comman_btn py-1 px-4"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Service Name :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Customization :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.customization ? "YES" : "NO"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Category :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.category?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-2">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Sub Category :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.subCategory?.name_en}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">SAR :</strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Price :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-6 py-1">
                            <div className="row mx-0">
                              <div className="col-6">
                                <strong className="booking_head">
                                  Description :
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="booking_head">
                                  {item?.description_en}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="col-12 px-4 pb-4">
                      <h6 className="mt-4">NO SERIVICES FOUND.... </h6>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`modal ${modalVisible ? "show d-block" : "d-none"}`}
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Service Details</h5>
                      <button
                        type="button"
                        className="close close_btn"
                        onClick={closeModal}
                      >
                        <span aria-hidden="true">
                          <i class="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                    <hr className="m-0" />
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
                            value={serviceNameEn}
                            onChange={(e) => setServiceNameEn(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-6">
                          <label htmlFor="">Service Name(Ar)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="serviceName_ar"
                            value={serviceNameAr}
                            onChange={(e) => setServiceNameAr(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-12">
                          <label htmlFor="">Description(En)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="description_en"
                            value={descriptionNameEn}
                            onChange={(e) =>
                              setDescriptionNameEn(e.target.value)
                            }
                          />
                        </div>
                        <div className="form-group col-12">
                          <label htmlFor="">Description(Ar)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="description_ar"
                            value={descriptionNameAr}
                            onChange={(e) =>
                              setDescriptionNameAr(e.target.value)
                            }
                          />
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="">Select Category (En)</label>
                          <select
                            className="form-control w-100"
                            name="category_en"
                            id="category_en"
                            defaultValue={selectedEnCategory}
                            onChange={handleCategoryEnChange}
                          >
                            {category &&
                              category
                                .filter((cat) => cat.status === true)
                                .map((cat, i) => (
                                  <option value={cat?._id}>
                                    {cat.name_en}
                                  </option>
                                ))}
                          </select>
                        </div>
                        <div className="form-group col-6">
                          <label htmlFor="">Category (Ar)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="category_ar"
                            value={
                              selectedArCategory
                                ? selectedArCategory
                                : dataToEdit?.category?.name_ar
                            }
                            disabled
                          />
                        </div>

                        {subCategory.length > 0 && (
                          <>
                            <div className="form-group col-6">
                              <label htmlFor="">Select Sub Category (En)</label>
                              <select
                                className="form-control w-100"
                                name=""
                                id="subCategory_en"
                                value={selectedEnSubCategory}
                                onChange={(e) => handleSubCatChange(e)}
                              >
                                {subCategory &&
                                  subCategory
                                    .filter((subCat) => subCat.status === true)
                                    .map((cat, i) => (
                                      <option value={cat.name_en}>
                                        {cat.name_en}
                                      </option>
                                    ))}
                              </select>
                            </div>
                            <div className="form-group col-6">
                              <label htmlFor="">Sub Category (Ar)</label>
                              <input
                                type="text"
                                className="form-control"
                                name="subCategory_ar"
                                // defaultValue={selectedArSubCategory}
                                value={selectedArSubCategory}
                                disabled
                              />
                            </div>
                          </>
                        )}
                        <div className="form-group col-6">
                          <label htmlFor="">Price</label>
                          <input
                            type="text"
                            className="form-control"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        onClick={(e) => handleEditFinish(dataToEdit?._id, e)}
                        type="button"
                        className="comman_btn"
                      >
                        Update
                      </button>
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

export default Services;
