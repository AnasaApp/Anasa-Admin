import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  AddCombo,
  AllCategory,
  AllVendors,
  getServices,
  GetVendorByCate,
  VendorServices,
} from "../../httpServices/dashHttpService";
import classNames from "classnames";
import Select from "react-select";

const mapOptions = (items, labelKey = "name_en") =>
  items.map((item) => ({ value: item._id, label: item[labelKey], data: item }));

const HandleAddOffer = ({ getAllOffers }) => {
  const [files, setFiles] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [allVendors, setAllVendors] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [formValues, setFormValues] = useState([
    { category: "", vendor: "", service: "", price: "" },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    
    const fetchCategories = async () => {
      const { data } = await AllCategory();
      if (!data.error) {
        setAllCategories(data.results?.categories || []);
      }
    };

    const fetchVendors = async () => {
      const { data } = await AllVendors({
        status: "APPROVED",
      });
      if (!data.error) {
        setAllVendors(data.results?.vendors || []);
      }
    };

    const fetchServices = async () => {
      const { data } = await getServices();
      if (!data.error) {
        setAllServices(data.results?.services || []);
      }
    };

    fetchServices();
    fetchCategories();
    fetchVendors();
  }, []);

  useEffect(() => {
    const calculatedTotal = formValues.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0);
    }, 0);
    setTotalPrice(calculatedTotal);
  }, [formValues]);

  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      { category: "", vendor: "", service: "", price: "" },
    ]);
    setVendors([...vendors, []]);
    setServices([...services, []]);
  };

  const removeFormFields = (index) => {
    const newFormValues = formValues.filter((_, i) => i !== index);
    setFormValues(newFormValues);
  };

  const VendorsList = async (categoryId, index) => {
    if (!categoryId) {
      const updatedVendors = [...vendors];
      updatedVendors[index] = [];
      setVendors(updatedVendors);
      return;
    }

    const { data } = await GetVendorByCate(categoryId);
    if (!data.error) {
      const updatedVendors = [...vendors];
      updatedVendors[index] = data.results.vendors || [];
      setVendors(updatedVendors);
    }
  };

  const createOptionsServices = async (vendorId, index) => {
    if (!vendorId) {
      const updatedServices = [...services];
      updatedServices[index] = [];
      setServices(updatedServices);
      return;
    }

    const { data } = await VendorServices(vendorId);
    if (!data.error) {
      setAllServices(data?.results?.services || []);
    }
  };

  const handleChange = (index, e, price, dataItm) => {
    const newFormValues = [...formValues];
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    let updatedCategory = newFormValues[index].category;
    let updatedVendor = newFormValues[index].vendor;

    if (fieldName === "service" && dataItm?.[0]?.data) {
      const selectedService = dataItm[0].data;

      updatedCategory = selectedService?.category?._id || updatedCategory;
      updatedVendor = selectedService?.vendor?._id || updatedVendor;

      VendorsList(updatedCategory, index);
      createOptionsServices(updatedVendor, index);
    }

    newFormValues[index] = {
      ...newFormValues[index],
      [fieldName]: fieldValue,
      category: updatedCategory,
      vendor: updatedVendor,
      price:
        fieldName === "price"
          ? fieldValue
          : price || newFormValues[index].price,
    };

    setFormValues(newFormValues);
  };

  const onSubmit = async (data) => {
    if (
      !formValues[0]?.category ||
      !formValues[0]?.vendor ||
      !formValues[0]?.service
    ) {
      Swal.fire({
        title: "Error!",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
        text: "Category, Vendor or Service are empty, Please choose",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", files?.upload_video);
    formData.append("name_en", data.combo_en);
    formData.append("name_ar", data.combo_ar);
    formData.append("comboPrice", data.discount);
    formData.append("validFrom", data.dateFrom);
    formData.append("validTo", data.dateTo);
    formData.append("type", JSON.stringify(formValues));

    try {
      const res = await AddCombo(formData);
      if (!res.error) {
        Swal.fire({
          title: "New Combo Added!",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        getAllOffers();
        setFormValues([{ category: "", vendor: "", service: "" }]);
        document.getElementById("Reset").click();
      } else if (res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSelectChange = async (
    index,
    field,
    selectedOption,
    dataItm = null
  ) => {
    const newFormValues = [...formValues];
    const newValue = selectedOption?.value || "";

    let updatedEntry = { ...newFormValues[index], [field]: newValue };

    // 🟢 When selecting a service, auto-fill related category, vendor, price
    if (field === "service" && dataItm?.[0]?.data) {
      const selectedService = dataItm[0].data;
      updatedEntry.category = selectedService?.category?._id || "";
      updatedEntry.vendor = selectedService?.vendor?._id || "";
      updatedEntry.price = selectedService?.price || "";

      VendorsList(selectedService?.category?._id, index);
      createOptionsServices(selectedService?.vendor?._id, index);
    }

    if (field === "category") {
      if (newValue) {
        const { data } = await GetVendorByCate(newValue);
        if (!data?.error) {
          const filteredVendors = data.results.vendors || [];
          setAllVendors(filteredVendors);
        }
      }

      if (!newValue) {
        updatedEntry.vendor = "";
        updatedEntry.service = "";
        updatedEntry.price = "";
      }
    }

    if (field === "vendor") {
      if (newValue) {
        createOptionsServices(newValue, index);
      }

      if (!newValue) {
        updatedEntry.service = "";
        updatedEntry.price = "";
      }
    }

    newFormValues[index] = updatedEntry;
    setFormValues(newFormValues);
  };

  return (
    <div>
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
            <small className="errorText mx-1">{errors.combo_en.message}</small>
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
            <small className="errorText mx-1">{errors.combo_ar.message}</small>
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
          <label htmlFor="">Package Price</label>
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
                message: "*Max character Length is 5",
              },
            })}
            onInput={(e) => {
              if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
              }
            }}
          />
          {errors.discount && (
            <small className="errorText mx-1">{errors.discount.message}</small>
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
            <small className="errorText mx-1">{errors.dateFrom.message}</small>
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
            <small className="errorText mx-1">{errors.dateTo.message}</small>
          )}
        </div>
        {formValues?.map((element, index) => {
          const categoryOptions = mapOptions(allCategories || [], "name_en");
          const vendorOptions = mapOptions(allVendors || [], "full_name");
          const serviceOptions = mapOptions(allServices || [], "name_en");

          return (
            <div className="row mt-3" key={index}>
              {/* Category */}
              <div className="form-group col-4">
                <label>Select Category</label>
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (opt) => opt.value === element.category
                  )}
                  onChange={(selected) =>
                    handleSelectChange(index, "category", selected)
                  }
                  isClearable
                />
              </div>

              {/* Vendor */}
              <div className="form-group col-4">
                <label>Select Vendor</label>
                <Select
                  options={vendorOptions}
                  value={vendorOptions.find(
                    (opt) => opt.value === element.vendor
                  )}
                  onChange={(selected) =>
                    handleSelectChange(index, "vendor", selected)
                  }
                  isClearable
                />
              </div>

              {/* Service */}
              <div
                className={`form-group ${
                  formValues.length <= 1 ? "col-4" : "col-3"
                }`}
              >
                <label>Select Service</label>
                <Select
                  options={serviceOptions.map((opt) => ({
                    ...opt,
                    label: `${opt.label} - ${opt.data.price}`,
                  }))}
                  value={serviceOptions.find(
                    (opt) => opt.value === element.service
                  )}
                  onChange={(selected) => {
                    handleChange(
                      index,
                      { target: { name: "service", value: selected?.value } },
                      selected?.data?.price,
                      serviceOptions?.filter(
                        (itm) => itm.value === selected?.value
                      )
                    );
                  }}
                  isClearable
                />
              </div>

              <div className="form-group col-1 mt-4">
                {formValues?.length > 1 && (
                  <button
                    className="comman_btn mt-2"
                    style={{ padding: "5px 20px" }}
                    type="button"
                    onClick={() => removeFormFields(index)}
                  >
                    <i className="fa fa-minus mt-1 mx-1" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <hr />
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <p>Total Price:</p>
            <p className="fw-bold">{totalPrice}</p>
          </div>
        </div>
        <hr />

        <div className="form-group mb-0 col-12 text-center mt-3">
          <a className="comman_btn mx-3 " onClick={() => addFormFields()}>
            Add more +
          </a>
          <button className="comman_btn" type="submit">
            Save
          </button>
          <button className="comman_btn d-none" id="Reset" type="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default HandleAddOffer;
