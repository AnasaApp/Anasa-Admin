import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { MDBDataTable } from "mdbreact";
import Select from "react-select";
import Sidebar from "../Sidebar";
import ImageEdit from "../../CropImage/ImageEdit";
import {
  AddOccassion,
  AllOccassions,
  AllOffers,
  changeOccassionStatus,
  editOccassion,
  getViewOccassion,
  changePartyTypeStatus,
  createPartyType,
  deletePartyType,
  editPartyType,
  getAllPartyTypes,
} from "../../httpServices/dashHttpService";

const initialTypeForm = { name_en: "", name_ar: "" };

const PartyTypesManagement = () => {
  const [slide] = useState("OccM");
  const [sideBar, setSideBar] = useState(false);
  const [activeTab, setActiveTab] = useState("anasa");

  // ==================== TAB 1: Anasa Occasions ====================
  const [anasaFiles, setAnasaFiles] = useState(null);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedOffersEdit, setSelectedOffersEdit] = useState([]);
  const [anasaLoading, setAnasaLoading] = useState(false);
  const [allOffers, setAllOffers] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [occasionId, setOccasionId] = useState("");

  const [anasaOccasions, setAnasaOccasions] = useState({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetAddOccForm,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEditOccForm,
    setValue,
  } = useForm();

  const fetchOffers = async () => {
    try {
      const { data } = await AllOffers({ status: "APPROVED" });
      if (!data.error) setAllOffers(data.results?.offer || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const fetchAnasaOccasions = async () => {
    setAnasaLoading(true);
    try {
      const { data } = await AllOccassions();
      if (!data?.error) {
        const rows = (data?.results?.occasions || []).map((occ, index) => ({
          sn: `${index + 1}.`,
          name_en: occ?.name_en,
          name_ar: occ?.name_ar,
          image: (
            <div className="cursor-pointer position-relative">
              <img
                src={occ?.image || require("../../../assets/img/Nupload.jpg")}
                alt="occasion"
                className="table_img"
              />
            </div>
          ),
          status: (
            <div className="check_toggle">
              <input
                type="checkbox"
                defaultChecked={occ?.status}
                id={`occ-status-${occ?._id}`}
                className="d-none"
                onChange={() => handleAnasaStatusChange(occ?._id)}
              />
              <label htmlFor={`occ-status-${occ?._id}`} />
            </div>
          ),
          action: (
            <button
              className="comman_btn table_viewbtn mx-1"
              data-bs-toggle="modal"
              data-bs-target="#editAnasaOccasionModal"
              onClick={() => handleAnasaEditClick(occ?._id)}
            >
              Edit
            </button>
          ),
        }));
        setAnasaOccasions((prev) => ({ ...prev, rows }));
      }
    } catch (error) {
      console.error("Error fetching occasions:", error);
    } finally {
      setAnasaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "anasa") {
      fetchOffers();
      fetchAnasaOccasions();
    }
  }, [activeTab]);

  const handleAnasaStatusChange = async (id) => {
    try {
      const { data } = await changeOccassionStatus(id);
      if (!data?.error) {
        Swal.fire({ title: "Status Changed!", icon: "success", confirmButtonText: "Ok", confirmButtonColor: "#e25829" });
        fetchAnasaOccasions();
      }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleAnasaEditClick = async (id) => {
    setOccasionId(id);
    try {
      const { data } = await getViewOccassion(id);
      const occ = data?.results.occasion;
      setValue("name_en", occ.name_en);
      setValue("name_ar", occ.name_ar);
      setSelectedOffersEdit(
        occ.offers.map((offer) => ({ value: offer._id, label: offer.name_en }))
      );
      if (occ.image) setCroppedImageUrl(occ.image);
    } catch (error) {
      console.error("Error fetching occasion details:", error);
    }
  };

  const handleAddOccasion = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("name_en", formData.name_en);
      payload.append("name_ar", formData.name_ar);
      payload.append("image", anasaFiles?.upload_video);
      payload.append("offers", JSON.stringify(selectedOffers?.map((o) => o.value)));
      const { data } = await AddOccassion(payload);
      if (!data?.error) {
        Swal.fire({ title: "Occasion Added!", icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });
        resetAddOccForm();
        setAnasaFiles(null);
        setSelectedOffers([]);
        fetchAnasaOccasions();
      }
    } catch (error) {
      console.error("Error adding occasion:", error);
    }
  };

  const handleEditOccasion = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("name_en", formData.name_en);
      payload.append("name_ar", formData.name_ar);
      if (croppedImage) payload.append("image", croppedImage);
      payload.append("offers", JSON.stringify(selectedOffersEdit?.map((o) => o.value)));
      payload.append("occasionId", occasionId);
      const res = await editOccassion(payload);
      if (!res.error) {
        document.getElementById("closeAnasaEditModal").click();
        fetchAnasaOccasions();
        setCroppedImage(null);
        setCroppedImageUrl("");
        Swal.fire({ title: "Occasion Updated Successfully!", icon: "success", confirmButtonText: "Ok", confirmButtonColor: "#e25829" });
      }
    } catch (error) {
      console.error("Error updating occasion:", error);
    }
  };

  // ==================== TAB 2: Occasion Types ====================
  const [occasionTypes, setOccasionTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [typesPage, setTypesPage] = useState(1);
  const [typesPageSize] = useState(10);
  const [typesSearch, setTypesSearch] = useState("");
  const [typesTotal, setTypesTotal] = useState(0);
  const [typesTotalPages, setTypesTotalPages] = useState(1);
  const [addTypeForm, setAddTypeForm] = useState(initialTypeForm);
  const [editTypeForm, setEditTypeForm] = useState(initialTypeForm);
  const [editingTypeId, setEditingTypeId] = useState(null);

  const loadOccasionTypes = useCallback(
    async (currentPage = typesPage, keyword = typesSearch) => {
      setTypesLoading(true);
      try {
        const { data } = await getAllPartyTypes({
          page: currentPage,
          pageSize: typesPageSize,
          search: keyword,
        });
        if (data && !data.error) {
          setOccasionTypes(data?.results?.partyTypes || []);
          setTypesTotal(data?.results?.total || 0);
          setTypesTotalPages(data?.results?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching occasion types:", error);
      } finally {
        setTypesLoading(false);
      }
    },
    [typesPage, typesPageSize, typesSearch]
  );

  useEffect(() => {
    if (activeTab === "types") {
      loadOccasionTypes(typesPage, typesSearch);
    }
  }, [loadOccasionTypes, typesPage, typesSearch, activeTab]);

  const handleAddType = async (e) => {
    e.preventDefault();
    if (!addTypeForm.name_en?.trim() || !addTypeForm.name_ar?.trim()) {
      Swal.fire({ title: "Both English and Arabic names are required", icon: "warning", confirmButtonText: "Okay" });
      return;
    }
    setTypesLoading(true);
    try {
      const { data } = await createPartyType({
        name_en: addTypeForm.name_en.trim(),
        name_ar: addTypeForm.name_ar.trim(),
      });
      if (data && !data.error) {
        Swal.fire({ title: "Occasion type added!", icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });
        setAddTypeForm(initialTypeForm);
        setTypesPage(1);
        loadOccasionTypes(1, typesSearch);
      }
    } catch (error) {
      console.error("Error adding occasion type:", error);
    } finally {
      setTypesLoading(false);
    }
  };

  const handleTypeEditClick = (item) => {
    setEditingTypeId(item._id);
    setEditTypeForm({ name_en: item.name_en || "", name_ar: item.name_ar || "" });
    document.getElementById("openEditTypeModal").click();
  };

  const handleTypeEditSave = async (e) => {
    e.preventDefault();
    if (!editTypeForm.name_en?.trim() || !editTypeForm.name_ar?.trim()) {
      Swal.fire({ title: "Both English and Arabic names are required", icon: "warning", confirmButtonText: "Okay" });
      return;
    }
    setTypesLoading(true);
    try {
      const { data } = await editPartyType({
        partyTypeId: editingTypeId,
        name_en: editTypeForm.name_en.trim(),
        name_ar: editTypeForm.name_ar.trim(),
      });
      if (data && !data.error) {
        document.getElementById("closeEditTypeModal").click();
        Swal.fire({ title: "Occasion type updated!", icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });
        loadOccasionTypes(typesPage, typesSearch);
      }
    } catch (error) {
      console.error("Error updating occasion type:", error);
    } finally {
      setTypesLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    const result = await Swal.fire({
      title: "Delete this occasion type?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e25829",
    });
    if (!result.isConfirmed) return;
    setTypesLoading(true);
    try {
      const { data } = await deletePartyType(id);
      if (data && !data.error) {
        Swal.fire({ title: "Occasion type deleted", icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });
        loadOccasionTypes(typesPage, typesSearch);
      }
    } catch (error) {
      console.error("Error deleting occasion type:", error);
    } finally {
      setTypesLoading(false);
    }
  };

  const handleTypeStatusToggle = async (id) => {
    setTypesLoading(true);
    try {
      const { data } = await changePartyTypeStatus(id);
      if (data && !data.error) {
        Swal.fire({ title: "Status updated!", icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });
        loadOccasionTypes(typesPage, typesSearch);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setTypesLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className={sideBar ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={(val) => setSideBar(val === "click")} />

      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row">
                  <div className="col-12 px-0">

                    {/* ===== Tabs ===== */}
                    <ul className="nav nav-tabs comman_tabs flex-nowrap" id="occasionTabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={activeTab === "anasa" ? "nav-link active" : "nav-link"}
                          type="button"
                          onClick={() => setActiveTab("anasa")}
                        >
                          Anasa Occasions
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={activeTab === "types" ? "nav-link active" : "nav-link"}
                          type="button"
                          onClick={() => setActiveTab("types")}
                        >
                          Occasion Types
                        </button>
                      </li>
                    </ul>

                    {/* ===== TAB 1: Anasa Occasions ===== */}
                    {activeTab === "anasa" && (
                      <div className="tab-content">
                        <div className="row p-4 mx-0">

                          {/* Add Occasion Form */}
                          <div className="col-12 mb-4 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Add Occasion</h2>
                              </div>
                            </div>
                            <form
                              className="form-design py-4 px-3 help-support-form row justify-content-between"
                              onSubmit={handleSubmit(handleAddOccasion)}
                            >
                              <div className="form-group col-4">
                                <label>Occasion (En)</label>
                                <input
                                  type="text"
                                  className={classNames("form-control", { "is-invalid": errors.name_en })}
                                  {...register("name_en", {
                                    required: "*Occasion is required!",
                                    pattern: { value: /^(?!\s+$).+/, message: "Only space is not allowed" },
                                  })}
                                />
                                {errors.name_en && <small className="errorText mx-1">{errors.name_en.message}</small>}
                              </div>

                              <div className="form-group col-4">
                                <label>Occasion (Ar)</label>
                                <input
                                  type="text"
                                  lang="ar"
                                  dir="rtl"
                                  className={classNames("form-control", { "is-invalid": errors.name_ar })}
                                  {...register("name_ar", {
                                    required: "*Occasion is required!",
                                    pattern: {
                                      value: /^(?!^\s+$)([ء-ي٠-٩\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+)$/,
                                      message: "Only Arabic Characters are allowed!",
                                    },
                                  })}
                                />
                                {errors.name_ar && <small className="errorText mx-1">{errors.name_ar.message}</small>}
                              </div>

                              <div className="form-group col-4 choose_file position-relative">
                                <span>Upload Image</span>
                                <label htmlFor="occ_upload_image">
                                  <i className="fa fa-camera me-1" />
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  className="form-control ms-2 w-100 ps-4"
                                  accept="image/*"
                                  id="occ_upload_image"
                                  onChange={(e) => setAnasaFiles((prev) => ({ ...prev, upload_video: e.target.files[0] }))}
                                />
                              </div>

                              <div className="form-group col-4">
                                <label>Select Offers</label>
                                <Select
                                  options={allOffers?.map((o) => ({ value: o._id, label: o.name_en }))}
                                  value={selectedOffers}
                                  onChange={(val) => setSelectedOffers(val || [])}
                                  isMulti
                                  isClearable
                                />
                              </div>

                              <div className="form-group mb-0 mt-4 col-12 text-center">
                                <button className="comman_btn" type="submit" disabled={anasaLoading}>
                                  {anasaLoading ? "Saving..." : "Save"}
                                </button>
                                <button className="comman_btn d-none" type="reset" id="resetAnasaAddForm" onClick={() => setSelectedOffers([])} />
                              </div>
                            </form>
                          </div>

                          {/* Occasions List */}
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Occasion Management</h2>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive p-1">
                                  {anasaLoading ? (
                                    <div className="text-center py-4">
                                      <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <MDBDataTable
                                      bordered
                                      displayEntries={false}
                                      hover
                                      data={anasaOccasions}
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
                    )}

                    {/* ===== TAB 2: Occasion Types ===== */}
                    {activeTab === "types" && (
                      <div className="tab-content">
                        <div className="row p-4 mx-0">

                          {/* Add Occasion Type */}
                          <div className="col-12 mb-4 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Add Occasion Type</h2>
                              </div>
                            </div>
                            <form
                              className="form-design py-4 px-3 help-support-form row justify-content-between"
                              onSubmit={handleAddType}
                            >
                              <div className="form-group col-md-5">
                                <label>Occasion Type (En)</label>
                                <input
                                  type="text"
                                  name="name_en"
                                  className="form-control"
                                  placeholder="e.g. Birthday"
                                  value={addTypeForm.name_en}
                                  onChange={(e) => setAddTypeForm((p) => ({ ...p, name_en: e.target.value }))}
                                />
                              </div>
                              <div className="form-group col-md-5">
                                <label>Occasion Type (Ar)</label>
                                <input
                                  type="text"
                                  name="name_ar"
                                  className="form-control"
                                  dir="rtl"
                                  lang="ar"
                                  placeholder="عيد ميلاد"
                                  value={addTypeForm.name_ar}
                                  onChange={(e) => setAddTypeForm((p) => ({ ...p, name_ar: e.target.value }))}
                                />
                              </div>
                              <div className="form-group col-md-2 d-flex align-items-end">
                                <button type="submit" className="comman_btn w-100" disabled={typesLoading}>
                                  {typesLoading ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </form>
                          </div>

                          {/* Occasion Types List */}
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Occasion Types</h2>
                              </div>
                            </div>

                            <div className="row px-3 py-3 align-items-center">
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search by English or Arabic name"
                                  value={typesSearch}
                                  onChange={(e) => { setTypesSearch(e.target.value); setTypesPage(1); }}
                                />
                              </div>
                              <div className="col-md-7 text-end text-muted">
                                Total: {typesTotal}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive p-0">
                                  {typesLoading ? (
                                    <div className="text-center py-5">
                                      <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    </div>
                                  ) : occasionTypes.length === 0 ? (
                                    <div className="text-center py-5 text-muted">No occasion types found.</div>
                                  ) : (
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>S.NO.</th>
                                          <th>English Name</th>
                                          <th>Arabic Name</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {occasionTypes.map((item, index) => (
                                          <tr key={item._id}>
                                            <td>{(typesPage - 1) * typesPageSize + index + 1}.</td>
                                            <td>{item.name_en}</td>
                                            <td dir="rtl" lang="ar">{item.name_ar}</td>
                                            <td>
                                              <div className="check_toggle">
                                                <input
                                                  type="checkbox"
                                                  checked={Boolean(item.status)}
                                                  id={`type-status-${item._id}`}
                                                  className="d-none"
                                                  onChange={() => handleTypeStatusToggle(item._id)}
                                                />
                                                <label htmlFor={`type-status-${item._id}`} />
                                              </div>
                                            </td>
                                            <td>
                                              <button className="comman_btn table_viewbtn mx-1" type="button" onClick={() => handleTypeEditClick(item)}>Edit</button>
                                              <button className="comman_btn bg-red table_viewbtn mx-1" type="button" onClick={() => handleDeleteType(item._id)}>Delete</button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>

                                {!typesLoading && occasionTypes.length > 0 && (
                                  <div className="d-flex justify-content-between align-items-center px-3 py-3">
                                    <div className="text-muted">Page {typesPage} of {typesTotalPages}</div>
                                    <div>
                                      <button className="comman_btn mx-1" disabled={typesPage <= 1} onClick={() => setTypesPage((p) => Math.max(1, p - 1))}>Previous</button>
                                      <button className="comman_btn mx-1" disabled={typesPage >= typesTotalPages} onClick={() => setTypesPage((p) => p + 1)}>Next</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden trigger for Edit Occasion Type modal */}
      <button id="openEditTypeModal" className="d-none" data-bs-toggle="modal" data-bs-target="#editOccasionTypeModal" />

      {/* Edit Anasa Occasion Modal */}
      <div className="modal fade comman_modal" id="editAnasaOccasionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title">Edit Occasion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeAnasaEditModal"
                aria-label="Close"
                onClick={() => { resetEditOccForm(); setCroppedImageUrl(""); setCroppedImage(null); }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row justify-content-center"
                onSubmit={handleSubmitEdit(handleEditOccasion)}
                noValidate
              >
                <div className="form-group col-6 choose_file position-relative">
                  <span>Occasion Image</span>
                  <div><img src={croppedImageUrl} alt="occasion" className="img-fluid" /></div>
                  <button type="button" onClick={() => setModalVisible2(true)} className="comman_btn mt-2">
                    Upload New Image
                  </button>
                </div>

                <div className="form-group col-6">
                  <label>Occasion (En)</label>
                  <input
                    type="text"
                    className={classNames("form-control", { "is-invalid": errorsEdit.name_en })}
                    {...registerEdit("name_en", {
                      required: "*Occasion is required!",
                      pattern: { value: /^(?!\s+$).+/, message: "Only space is not allowed" },
                    })}
                  />
                  {errorsEdit.name_en && <small className="errorText mx-1">{errorsEdit.name_en.message}</small>}
                </div>

                <div className="form-group col-6">
                  <label>Occasion (Ar)</label>
                  <input
                    type="text"
                    dir="rtl"
                    className={classNames("form-control", { "is-invalid": errorsEdit.name_ar })}
                    {...registerEdit("name_ar", {
                      required: "*Occasion is required!",
                      pattern: {
                        value: /^(?!^\s+$)([ء-ي٠-٩\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+)$/,
                        message: "Only Arabic Characters are allowed!",
                      },
                    })}
                  />
                  {errorsEdit.name_ar && <small className="errorText mx-1">{errorsEdit.name_ar.message}</small>}
                </div>

                <div className="form-group col-6">
                  <label>Select Offers</label>
                  <Select
                    options={allOffers?.map((o) => ({ value: o._id, label: o.name_en }))}
                    value={selectedOffersEdit}
                    onChange={(val) => setSelectedOffersEdit(val || [])}
                    isMulti
                    isClearable
                  />
                </div>

                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn" type="submit" disabled={anasaLoading}>
                    {anasaLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Occasion Type Modal */}
      <div className="modal fade comman_modal" id="editOccasionTypeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title">Edit Occasion Type</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeEditTypeModal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form className="form-design px-3 py-2 help-support-form row justify-content-center" onSubmit={handleTypeEditSave}>
                <div className="form-group col-12">
                  <label>Occasion Type (En)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editTypeForm.name_en}
                    onChange={(e) => setEditTypeForm((p) => ({ ...p, name_en: e.target.value }))}
                  />
                </div>
                <div className="form-group col-12">
                  <label>Occasion Type (Ar)</label>
                  <input
                    type="text"
                    className="form-control"
                    dir="rtl"
                    lang="ar"
                    value={editTypeForm.name_ar}
                    onChange={(e) => setEditTypeForm((p) => ({ ...p, name_ar: e.target.value }))}
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button type="submit" className="comman_btn" disabled={typesLoading}>
                    {typesLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Image Crop Modal (Anasa Occasions edit) */}
      {modalVisible2 && (
        <div className="modal modal-lg show d-block" tabIndex="-1" role="dialog">
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

export default PartyTypesManagement;
