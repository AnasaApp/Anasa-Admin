import classNames from "classnames";
import React, { useState, useEffect, useCallback } from "react";
import { set, useForm } from "react-hook-form";
import Sidebar from "../Sidebar";
import {
  AddOccassion,
  AllOccassions,
  AllOffers,
  changeOccassionStatus,
  changePromocodeStatus,
  editOccassion,
  editPromocode,
  getViewOccassion,
  SearchUser,
} from "../../httpServices/dashHttpService";
import Swal from "sweetalert2";
import moment from "moment";
import { MDBDataTable } from "mdbreact";
import ImageEdit from "../../CropImage/ImageEdit";
import Select from "react-select";

const OccasionManagement = () => {
  // State declarations
  const [files, setFiles] = useState(null);
  const [slide, setSlide] = useState("PCM");
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedOffersEdit, setSelectedOffersEdit] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [sideBar, setSideBar] = useState(false);
  const [editData, setEditData] = useState(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [occasionId, setOccasionId] = useState("");
  const [allOffers, setAllOffers] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form hooks
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetAddForm,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEditForm,
    setValue,
  } = useForm();

  // Data table configuration
  const [occasions, setOccasions] = useState({
    columns: [
      { label: "S.NO.", field: "sn", sort: "asc", width: 50 },
      { label: "Name (En)", field: "name_en", sort: "asc", width: 100 },
      { label: "Name (Ar)", field: "name_ar", sort: "asc", width: 100 },
      { label: "IMAGE", field: "image", sort: "asc", width: 150 },
      { label: "STATUS", field: "status", sort: "asc", width: 100 },
      { label: "ACTION", field: "action", sort: "asc", width: 100 },
    ],
    rows: [],
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchOffers();
    fetchOccasions();
  }, []);

  // Fetch offers data
  const fetchOffers = async () => {
    try {
      const { data } = await AllOffers({ status: "APPROVED" });
      if (!data.error) {
        setAllOffers(data.results?.offer || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  // Fetch occasions data
  const fetchOccasions = async () => {
    setIsLoading(true);
    try {
      const { data } = await AllOccassions();
      if (!data?.error) {
        const occasionsData = data?.results?.occasions || [];
        const formattedRows = occasionsData.map((occasion, index) =>
          formatOccasionRow(occasion, index)
        );
        setOccasions((prev) => ({ ...prev, rows: formattedRows }));
      }
    } catch (error) {
      console.error("Error fetching occasions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format occasion row for table
  const formatOccasionRow = (occasion, index) => ({
    sn: `${index + 1}.`,
    name_en: occasion?.name_en,
    name_ar: occasion?.name_ar,
    image: (
      <div className="cursor-pointer position-relative">
        <img
          src={occasion?.image || require("../../../assets/img/Nupload.jpg")}
          alt="occasion"
          className="table_img"
        />
      </div>
    ),
    status: (
      <div className="check_toggle">
        <input
          type="checkbox"
          defaultChecked={occasion?.status}
          id={`status-${occasion?._id}`}
          className="d-none"
          onChange={() => handleStatusChange(occasion?._id)}
        />
        <label htmlFor={`status-${occasion?._id}`} />
      </div>
    ),
    action: (
      <>
        <button
          className="comman_btn table_viewbtn mx-1"
          data-bs-toggle="modal"
          data-bs-target="#editOccasionModal"
          onClick={() => handleEditClick(occasion?._id)}>
          Edit
        </button>
      </>
    ),
  });

  // Handle form submission for adding new occasion
  const handleAddOccasion = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("name_en", formData.name_en);
      payload.append("name_ar", formData.name_ar);
      payload.append("image", files?.upload_video);
      payload.append(
        "offers",
        JSON.stringify(selectedOffers?.map((offer) => offer.value))
      );

      const { data } = await AddOccassion(payload);

      if (!data?.error) {
        Swal.fire({
          title: "Occasion Added!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        resetAddForm();
        setFiles(null);
        setSelectedOffers([]);
        fetchOccasions();
      }
    } catch (error) {
      console.error("Error adding occasion:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add occasion",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  // Handle form submission for editing occasion
  const handleEditOccasion = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("name_en", formData.name_en);
      payload.append("name_ar", formData.name_ar);
      if (croppedImage) {
        payload.append("image", croppedImage);
      }
      payload.append(
        "offers",
        JSON.stringify(selectedOffersEdit?.map((offer) => offer.value))
      );
      payload.append("occasionId", occasionId);

      const res = await editOccassion(payload);

      if (!res.error) {
        document.getElementById("closeEditModal").click();
        fetchOccasions();
        setCroppedImage(null);
        setCroppedImageUrl("");
        Swal.fire({
          title: "Occasion Updated Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    } catch (error) {
      console.error("Error updating occasion:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update occasion",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  // Handle occasion status change
  const handleStatusChange = async (id) => {
    try {
      const { data } = await changeOccassionStatus(id);
      if (!data?.error) {
        Swal.fire({
          title: "Status Changed!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
        fetchOccasions();
      }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleEditClick = async (id) => {
    setOccasionId(id);
    try {
      const { data } = await getViewOccassion(id);
      const occasion = data?.results.occasion;
      console.log(data);

      setEditData(occasion);

      setValue("name_en", occasion.name_en);
      setValue("name_ar", occasion.name_ar);

      setSelectedOffersEdit(
        occasion.offers.map((offer) => ({
          value: offer._id,
          label: offer.name_en,
        }))
      );
      if (occasion.image) {
        setCroppedImageUrl(occasion.image);
      }
    } catch (error) {
      console.error("Error fetching occasion details:", error);
    }
  };

  const handleFileSelection = (e, key) => {
    setFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
  };

  const handleOfferSelect = (selectedOptions) => {
    setSelectedOffers(selectedOptions || []);
  };

  const handleOfferSelectEdit = (selectedOptions) => {
    setSelectedOffersEdit(selectedOptions || []);
  };
  // Set minimum dates for date inputs
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach((input) => {
      input.setAttribute("min", today);
    });
  }, []);

  return (
    <div className={sideBar ? "expanded_main" : "admin_main"}>
      <Sidebar
        slide={slide}
        getBarClick={(val) => setSideBar(val === "click")}
      />

      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row">
              {/* Add Occasion Form */}
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Add Occasion</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row justify-content-between"
                  onSubmit={handleSubmit(handleAddOccasion)}>
                  <div className="form-group col-4">
                    <label>Occasion (En)</label>
                    <input
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.name_en,
                      })}
                      {...register("name_en", {
                        required: "*Occasion is required!",
                        pattern: {
                          value: /^(?!\s+$).+/,
                          message: "Only space is not allowed",
                        },
                      })}
                    />
                    {errors.name_en && (
                      <small className="errorText mx-1">
                        {errors.name_en.message}
                      </small>
                    )}
                  </div>

                  <div className="form-group col-4">
                    <label>Occasion (Ar)</label>
                    <input
                      type="text"
                      lang="ar"
                      dir="rtl"
                      className={classNames("form-control", {
                        "is-invalid": errors.name_ar,
                      })}
                      {...register("name_ar", {
                        required: "*Occasion is required!",
                        pattern: {
                          value:
                            /^(?!^\s+$)([\u0621-\u064A\u0660-\u0669\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+)$/,
                          message: "Only Arabic Characters are allowed!",
                        },
                      })}
                    />
                    {errors.name_ar && (
                      <small className="errorText mx-1">
                        {errors.name_ar.message}
                      </small>
                    )}
                  </div>

                  <div className="form-group col-4 choose_file position-relative">
                    <span>Upload Image </span>
                    <label htmlFor="upload_video">
                      <i className="fa fa-camera me-1" />
                      Choose File
                    </label>
                    <input
                      type="file"
                      className="form-control ms-2 w-100 ps-4"
                      accept="image/*"
                      id="upload_video"
                      onChange={(e) => handleFileSelection(e, "upload_video")}
                    />
                  </div>

                  <div className="form-group col-4">
                    <label>Select Offers</label>
                    <Select
                      options={allOffers?.map((offer) => ({
                        value: offer._id,
                        label: offer.name_en,
                      }))}
                      value={selectedOffers}
                      onChange={handleOfferSelect}
                      isMulti
                      isClearable
                    />
                  </div>

                  <div className="form-group mb-0 mt-4 col-12 text-center">
                    <button
                      className="comman_btn"
                      type="submit"
                      disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="resetAddForm"
                      onClick={() => setSelectedOffers([])}>
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              {/* Occasions List */}
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Occasion Management</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive p-1">
                      {isLoading ? (
                        <div className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <MDBDataTable
                          bordered
                          displayEntries={false}
                          className=""
                          hover
                          data={occasions}
                          noBottomColumns
                          sortable
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Occasion Modal */}
      <div
        className="modal fade comman_modal"
        id="editOccasionModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="editOccasionModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="editOccasionModalLabel">
                Edit Occasion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeEditModal"
                aria-label="Close"
                onClick={() => {
                  resetEditForm();
                  setCroppedImageUrl("");
                  setCroppedImage(null);
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row justify-content-center"
                onSubmit={handleSubmitEdit(handleEditOccasion)}
                noValidate>
                <div className="form-group col-6 choose_file position-relative">
                  <span>Occasion Image </span>
                  <div>
                    <img
                      src={croppedImageUrl}
                      alt="occasion"
                      className="img-fluid"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalVisible2(true)}
                    className="comman_btn mt-2">
                    Upload New Image
                  </button>
                </div>

                <div className="form-group col-6">
                  <label>Occasion (En)</label>
                  <input
                    type="text"
                    className={classNames("form-control", {
                      "is-invalid": errorsEdit.name_en,
                    })}
                    {...registerEdit("name_en", {
                      required: "*Occasion is required!",
                      pattern: {
                        value: /^(?!\s+$).+/,
                        message: "Only space is not allowed",
                      },
                    })}
                  />
                  {errorsEdit.name_en && (
                    <small className="errorText mx-1">
                      {errorsEdit.name_en.message}
                    </small>
                  )}
                </div>

                <div className="form-group col-6">
                  <label>Occasion (Ar)</label>
                  <input
                    type="text"
                    dir="rtl"
                    className={classNames("form-control", {
                      "is-invalid": errorsEdit.name_ar,
                    })}
                    {...registerEdit("name_ar", {
                      required: "*Occasion is required!",
                      pattern: {
                        value:
                          /^(?!^\s+$)([\u0621-\u064A\u0660-\u0669\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+)$/,
                        message: "Only Arabic Characters are allowed!",
                      },
                    })}
                  />
                  {errorsEdit.name_ar && (
                    <small className="errorText mx-1">
                      {errorsEdit.name_ar.message}
                    </small>
                  )}
                </div>

                <div className="form-group col-6">
                  <label>Select Offers</label>
                  <Select
                    options={allOffers?.map((offer) => ({
                      value: offer._id,
                      label: offer.name_en,
                    }))}
                    value={selectedOffersEdit}
                    onChange={handleOfferSelectEdit}
                    isMulti
                    isClearable
                  />
                </div>

                <div className="form-group mb-0 col-auto mt-3">
                  <button
                    className="comman_btn"
                    type="submit"
                    disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Image Edit Modal */}
      {modalVisible2 && (
        <div
          className="modal modal-lg show d-block"
          tabIndex="-1"
          role="dialog">
          <ImageEdit
            setModalVisible2={setModalVisible2}
            setCroppedImage={setCroppedImage}
            setCroppedImageUrl={setCroppedImageUrl}
          />
        </div>
      )}
    </div>
  );
};

export default OccasionManagement;
