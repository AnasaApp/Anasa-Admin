import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import {
  AddCity,
  downloadFiles,
  EditVendor,
  getAddedCities,
  getVendorBooking,
  getVendorDetails,
  getVendorTransactions,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import moment from "moment";
import { MDBDataTable } from "mdbreact";
import { countries } from "country-data";
import { useForm } from "react-hook-form";
import Select from "react-select";

const ApprovedView = () => {
  const [slide, setSlide] = useState("VM");
  const [vendor, setVendor] = useState();
  const [sideBar, setSideBar] = useState();
  const [values, setValues] = useState({ from: "", to: "" });
  const [countryName, setCountryName] = useState();
  const [shopAddress, setShopAddress] = useState();
  let location = useLocation();

  useEffect(() => {
    getVendor();
    GetVendorBooking();
    GetVendorTransactions();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [form1, setForm1] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedvalues, setSelectedValues] = useState();
  const [selectedOptions, setSelectedOptions] = useState();
  const [isEditing, setIsEditing] = useState(false);

  // Enable edit mode and prefill form fields
  const handleEditClick = () => {
    setIsEditing(true);
    setValue("name", vendor?.full_name);
    setValue("email", vendor?.email);
    setValue("phone_number", vendor?.phone_number);
    setValue("customer_contact_number", vendor?.customer_contact_number);
    setValue("city", vendor?.city);
    setValue("state", vendor?.state);
    setValue("shop_address", vendor?.shop_address);
    setValue("shop_name", vendor?.shop_name);
    setValue("building_name", vendor?.building_name);
    setValue("locality", vendor?.locality);
    setValue("country_code", vendor?.country_code);
    setValue("business_name", vendor?.building_name);
  };

  const handleProfileUpdate = async (info) => {
    try {
      const formData = new FormData();
      let citiess = selectedvalues?.map((itmss) => itmss?.value);

      formData?.append("full_name", info?.name);
      formData?.append("email", info?.email);
      formData?.append("phone_number", info?.phone_number);
      formData?.append(
        "customer_contact_number",
        info?.customer_contact_number
      );
      formData?.append("city", info?.city);
      formData?.append("shop_address", info?.shop_address);
      formData?.append("shop_name", info?.shop_name);
      formData?.append("building_name", info?.building_name);
      formData?.append("locality", info?.locality);
      formData?.append("country_code", info?.country_code);
      formData?.append("business_name", info?.building_name);
      formData.append("serviceableCity", JSON.stringify(citiess));

      let id = location?.state?.id;
      const { data } = await EditVendor(id, formData);
      if (!data?.error) {
        document.getElementById("resetBtn").click();
        document.getElementById("closeModal").click();
        getVendor();
        setIsEditing(false);
        Swal.fire({
          title: data?.message,
          text: "",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  console.log({ selectedvalues });

  const fetchCities = async (vendor) => {
    const filteredIds = new Set(
      vendor?.serviceableCity?.map((itms) => itms?._id)
    );

    try {
      const response = await getAddedCities();
      let tempCities = response.data?.results?.cities || [];
      setCities(tempCities);

      const preSelected = tempCities
        ?.filter((itm) => filteredIds.has(itm?._id)) // Using `Set` lookup
        .map((city) => ({
          value: city._id,
          label: city.city,
        }));

      console.log({ preSelected, tempCities });
      setSelectedValues(preSelected);
    } catch (error) {
      console.error("Error fetching cities", error);
    }
  };

  const onSubmit = async (info) => {
    try {
      if (!form1) {
        const { data } = await AddCity({
          city: info.cityEn,
          city_ar: info.cityAr,
        });
        if (!data?.error) {
          fetchCities();
          document.getElementById("city_ar").value = "";
        }
      } else {
        const formData = new FormData();
        let citiess = selectedvalues?.map((itmss) => itmss?.value);

        formData.append("serviceableCity", JSON.stringify(citiess));
        formData.append("shop_cover_image", info.image[0]);
        let id = location?.state?.id;
        const { data } = await EditVendor(id, formData);
        if (!data?.error) {
          document.getElementById("resetBtn").click();
          document.getElementById("closeModal").click();
          getVendor();
        }
      }
      setForm1(true);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const [bookings, setBookings] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        maxWidth: 50,
      },
      {
        label: "BOOKING ID",
        field: "id",
        sort: "asc",
        width: 150,
      },

      {
        label: "BOOKING DETAILS",
        field: "details",
        sort: "asc",
        width: 150,
      },
      {
        label: "AMOUNT",
        field: "number",
        sort: "asc",
        width: 100,
      },

      {
        label: "BOOKING DATE",
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
    ],
    rows: [],
  });

  const [transactionList, setTransactionList] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        maxWidth: 50,
      },
      {
        label: "TRANSACTION ID",
        field: "id",
        sort: "asc",
        width: 150,
      },

      {
        label: "TRANSACTION DATE",
        field: "date",
        sort: "asc",
        width: 150,
      },
      {
        label: "AMOUNT",
        field: "amount",
        sort: "asc",
        width: 100,
      },
      {
        label: "TYPE",
        field: "type",
        sort: "asc",
        width: 100,
      },

      {
        label: "STATUS",
        field: "status",
        sort: "asc",
        width: 100,
      },
      // {
      //   label: "ACTION",
      //   field: "action",
      //   sort: "asc",
      //   width: 100,
      // },
    ],
    rows: [],
  });

  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const getVendor = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorDetails(id, { status: "APPROVED" });
    console.log(data);
    let values = data?.results?.vendor;
    const countryCode = values?.country_code;
    setShopAddress(
      `${
        values?.shop_name +
        ", " +
        values?.building_name +
        ", " +
        values?.locality
      }`
    );
    if (countryCode) {
      const countryData = countries.all;
      const country = Object.values(countryData).find((country) => {
        return country.countryCallingCodes.includes(`+${countryCode}`);
      });
      const countryName = country ? country.name : "Country Not Found";
      setCountryName(countryName);
    }
    fetchCities(vendor);
    setVendor(values);
  };

  const GetVendorBooking = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorBooking(id);

    const newRows = [];

    if (!data.error) {
      let values = data?.results.bookings;
      console.log(values);
      let newVal = values.sort(
        (a, b) =>
          new moment(b.createdAt).format("YYYYMMDD") -
          new moment(a.createdAt).format("YYYYMMDD")
      );
      newVal?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.id = list?.bookingID;
        returnData.details = (
          <>
            <Link
              className="comman_btn2 table_viewbtn"
              to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
              // state={{ id: list?._id }}
            >
              View
            </Link>
          </>
        );
        returnData.number = list?.total;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = list?.status;
        newRows.push(returnData);
      });

      setBookings({ ...bookings, rows: newRows });
    }
  };

  const GetVendorTransactions = async () => {
    let id = location?.state?.id;
    const { data } = await getVendorTransactions(id);
    const newRows = [];
    if (!data.error) {
      let values = data?.results.transaction;
      console.log(values);
      let newVal = values.sort(
        (a, b) => new moment(b.createdAt) - new moment(a.createdAt)
      );
      newVal?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.id = list?.transactionID;
        returnData.amount = list?.amount;
        returnData.type = list?.type;
        returnData.date = moment(list?.createdAt).format("L");
        returnData.status = list?.status;
        newRows.push(returnData);
      });

      setTransactionList({ ...transactionList, rows: newRows });
    }
  };

  const onSearchBookings = async (e) => {
    let id = location?.state?.id;
    if (values?.from && values?.to) {
      e.preventDefault();
      const { data } = await getVendorBooking(id, {
        from: values?.from,
        to: values?.to,
      });
      const newRows = [];
      if (!data.error) {
        let values = data?.results.bookings;
        console.log(values);
        values?.map((list, index) => {
          const returnData = {};
          returnData.sn = index + 1 + ".";
          returnData.id = list?.bookingID;
          returnData.details = (
            <>
              <Link
                className="comman_btn2 table_viewbtn"
                to={`/Admin/Dashboard/Booking-Management/Booking-Details/${list?._id}`}
                // state={{ id: list?._id }}
              >
                View
              </Link>
            </>
          );
          returnData.number = list?.total;
          returnData.date = moment(list?.createdAt).format("L");
          returnData.status = list?.status;
          newRows.push(returnData);
        });

        setBookings({ ...bookings, rows: newRows });
      }
      setValues({ from: "", to: "" });
    } else {
      e.preventDefault();
      Swal.fire({
        title: "Please select a Date range!",
        icon: "warning",
        button: "ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const fileDownload = async (url) => {
    const { data } = await downloadFiles({ key: url });
    if (!data.error) {
      console.log(data);
      // const linkSource = `data:${contentType};base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = data.results.image;
      downloadLink.download = "doc";
      downloadLink.click();
    }
  };

  const preview = (id) => {
    document.getElementById("preview_modal").click();
    document.getElementById("preview_images").src = id;
  };

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row vendor-management justify-content-center">
          <div className="col-12 design_outter_comman recent_orders shadow mb-4">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Vendor Approved Details</h2>
              </div>
              <div className="col-auto text-end">
                <div className="Status_box">
                  Status: <strong>Active</strong>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-4">
                <div className="row py-2">
                  <div className="col-12 text-center mb-4">
                    <div className="Pending-view_img">
                      <img
                        src={
                          vendor?.shop_cover_image
                            ? vendor?.shop_cover_image
                            : require("../../../assets/img/uploadImg.jfif")
                        }
                        alt=""
                      />
                    </div>
                    <h4 className="user_name">{vendor?.full_name}</h4>
                  </div>

                  {/* Name */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Name:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("name", { required: true })}
                          />
                        ) : (
                          <strong>{vendor?.full_name}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Email:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="email"
                            className="form-control"
                            {...register("email", { required: true })}
                          />
                        ) : (
                          <strong>{vendor?.email}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Mobile Number:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("phone_number", { required: true })}
                          />
                        ) : (
                          <strong>{vendor?.phone_number}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact Number */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Customer Contact Number:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("customer_contact_number")}
                          />
                        ) : (
                          <strong>{vendor?.customer_contact_number}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Shop Address:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("shop_address")}
                          />
                        ) : (
                          <strong>{vendor?.shop_address}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shop Name */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Shop Name:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("shop_name")}
                          />
                        ) : (
                          <strong>{vendor?.shop_name}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Building Name */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Building Name:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("building_name")}
                          />
                        ) : (
                          <strong>{vendor?.building_name}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Locality */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Locality:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("locality")}
                          />
                        ) : (
                          <strong>{vendor?.locality}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>City:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            {...register("city")}
                          />
                        ) : (
                          <strong>{vendor?.city}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Country Code */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Country Code:</span>
                      <div className="col">
                        {isEditing ? (
                          <input
                            type="text"
                            disabled
                            className="form-control"
                            {...register("country_code")}
                          />
                        ) : (
                          <strong>{vendor?.country_code}</strong>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Country Name */}
                  <div className="col-md-6 mb-4 d-flex align-items-stretch">
                    <div className="row view-inner-box border mx-0 w-100">
                      <span>Serviceable cities:</span>
                      <div className="col">
                        <strong>
                          {vendor?.serviceableCity?.map(
                            (itm) => itm?.city + "/"
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  {!isEditing && (
                    <div className="col-md-6 mb-4 d-flex align-items-stretch">
                      <button
                        className="comman_btn border rounded"
                        onClick={handleEditClick}
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}

                  {/* Save & Cancel Buttons */}
                  {isEditing && (
                    <div className="col-md-12 mb-4 d-flex align-items-stretch">
                      <button
                        className="comman_btn2 me-3"
                        onClick={handleSubmit(handleProfileUpdate)}
                      >
                        Save
                      </button>
                      <button
                        className="comman_btn btn-danger"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 mb-4 d-flex align-items-stretch">
                <div className="row view-inner-box border mx-0 w-100">
                  <span>Trade Licence copy:</span>
                  <div className="col img_box_show">
                    <label htmlFor="file1">
                      <div className="licence_id">
                        {vendor?.trade_licence_copy ? (
                          <i
                            class="fa fa-eye preview_icon"
                            onClick={() => preview(vendor?.trade_licence_copy)}
                          ></i>
                        ) : null}
                        {vendor?.trade_licence_copy ? (
                          <i
                            className="fa fa-download mx-4 mt-2"
                            onClick={() => {
                              fileDownload(vendor?.trade_licence_copy);
                            }}
                          />
                        ) : (
                          <i
                            className="fa fa-upload mx-4 mt-2"
                            onClick={() => {
                              fileDownload(vendor?.trade_licence_copy);
                            }}
                          />
                        )}{" "}
                        {vendor?.trade_licence_copy}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4 d-flex align-items-stretch">
                <div className="row view-inner-box border mx-0 w-100">
                  <span>Signed Contract:</span>
                  <div className="col img_box_show">
                    <label htmlFor="file1">
                      <div className="licence_id">
                        {vendor?.signed_contract ? (
                          <i
                            class="fa fa-eye preview_icon"
                            onClick={() => preview(vendor?.signed_contract)}
                          ></i>
                        ) : null}
                        {vendor?.signed_contract ? (
                          <i
                            className="fa fa-download mx-4 mt-2"
                            onClick={() => {
                              fileDownload(vendor?.signed_contract);
                            }}
                          />
                        ) : (
                          <i
                            className="fa fa-upload mx-4 mt-2"
                            onClick={() => {
                              fileDownload(vendor?.signed_contract);
                            }}
                          />
                        )}{" "}
                        {vendor?.signed_contract}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4 d-flex align-items-stretch">
                <div className="row view-inner-box border mx-0 w-100">
                  <div className="col">
                    <Link
                      to={`/Admin/Dashboard/Vendor-Management/Services/${vendor?._id}`}
                    >
                      <strong>Go to Listed Services</strong>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4 d-flex align-items-stretch">
                <div className="row view-inner-box border mx-0 w-100">
                  <div className="col">
                    <Link
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop448"
                      onClick={() => fetchCities(vendor)}
                    >
                      <strong>Edit Cities & Image</strong>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 design_outter_comman recent_orders shadow">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Booking Details</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <form
                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                  action=""
                >
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">From</label>
                    <input
                      type="date"
                      className="form-control"
                      name="from"
                      id="appFrom"
                      value={values.from}
                      onChange={handleDate}
                    />
                  </div>
                  <div className="form-group mb-0 col-5">
                    <label htmlFor="">To</label>
                    <input
                      type="date"
                      className="form-control"
                      name="to"
                      id="appTo"
                      value={values.to}
                      onChange={handleDate}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button className="comman_btn2" onClick={onSearchBookings}>
                      Search
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="Resets"
                    >
                      Search
                    </button>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <div className="table-responsive p-0">
                        <MDBDataTable
                          bordered
                          displayEntries={false}
                          className="categoryTable"
                          hover
                          data={bookings}
                          noBottomColumns
                          sortable
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 design_outter_comman recent_orders shadow mt-4">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Transaction Details</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive p-0">
                      <MDBDataTable
                        bordered
                        displayEntries={false}
                        className="userData"
                        hover
                        data={transactionList}
                        noBottomColumns
                        sortable
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary d-none"
        id="preview_modal"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header comman_modal">
              <h5 class="modal-title">Preview</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <img
                src={vendor?.trade_licence_copy}
                className="preview_image w-100"
                id="preview_images"
              ></img>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="comman_btn2 "
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop44"
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
                Payout
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
              >
                <div className="form-group col-6">
                  <label htmlFor="">Total Payout</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="5000"
                    disabled
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Withdraw</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop44"
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
                Payout
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
              >
                <div className="form-group col-6">
                  <label htmlFor="">Total Payout</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="5000"
                    disabled
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Withdraw</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop448"
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
                Edit
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                onSubmit={handleSubmit(onSubmit)}
              >
                {form1 ? (
                  <div className="col-12 text-end mb-4">
                    <label className="fw-bold">
                      City not found?{" "}
                      <a
                        onClick={() => setForm1(false)}
                        className="comman_btn2 table_viewbtn"
                      >
                        + Add Now
                      </a>
                    </label>
                  </div>
                ) : (
                  <div className="col-12 text-end mb-4">
                    <label className="fw-bold">
                      <a
                        onClick={() => setForm1(true)}
                        className="comman_btn2 table_viewbtn"
                      >
                        Cancel
                      </a>
                    </label>
                  </div>
                )}

                {form1 ? (
                  <>
                    <div className="form-group col-6">
                      <label>Serviceable City</label>
                      <Select
                        options={cities.map((city) => ({
                          value: city._id,
                          label: city.city,
                        }))}
                        isMulti
                        value={selectedvalues}
                        onChange={(selectedOptions) =>
                          setSelectedValues(selectedOptions)
                        }
                      />
                    </div>
                    <div className="form-group col-6">
                      <label>Upload New Profile</label>
                      <input
                        type="file"
                        className="form-control"
                        {...register("image")}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group col-12 d-none">
                      <label>State</label>
                      <select className="form-select" disabled>
                        <option>Meccah</option>
                      </select>
                    </div>
                    <div className="form-group col-6">
                      <label>City Name (en)</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("cityEn", { required: true })}
                      />
                      {errors.cityEn && (
                        <p className="text-danger">
                          City Name (en) is required
                        </p>
                      )}
                    </div>
                    <div className="form-group col-6">
                      <label>City Name (ar)</label>
                      <input
                        type="text"
                        id="city_ar"
                        className="form-control"
                        {...register("cityAr", { required: true })}
                      />
                      {errors.cityAr && (
                        <p className="text-danger">
                          City Name (ar) is required
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="form-group mb-0 col-auto mt-3">
                  <button type="submit" className="comman_btn">
                    Confirm
                  </button>
                  <button type="reset" className="d-none" id="resetBtn">
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

export default ApprovedView;
