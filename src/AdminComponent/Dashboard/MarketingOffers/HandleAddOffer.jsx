import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AddCombo, AllCategory, GetVendorByCate, VendorServices } from "../../httpServices/dashHttpService";
import classNames from "classnames";

const HandleAddOffer = ({getAllOffers}) => {
    const [files, setFiles] = useState({});
    const [allCategories, setAllCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [services, setServices] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    
    // Search states for each field type
    const [categorySearch, setCategorySearch] = useState("");
    const [vendorSearch, setVendorSearch] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");
  
    const [formValues, setFormValues] = useState([
      { category: "", vendor: "", service: "", price: "" }
    ]);
  
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    // Load all categories on component mount
    useEffect(() => {
      const fetchCategories = async () => {
        const { data } = await AllCategory();
        if (!data.error) {
          setAllCategories(data.results?.categories || []);
        }
      };
      fetchCategories();
    }, []);
  
    // Calculate total price whenever form values change
    useEffect(() => {
      const calculatedTotal = formValues.reduce((total, item) => {
        return total + (parseFloat(item.price) || 0)
      }, 0);
      setTotalPrice(calculatedTotal);
    }, [formValues]);
  
    const onFileSelection = (e, key) => {
      setFiles({ ...files, [key]: e.target.files[0] });
    };
  
    const addFormFields = () => {
      setFormValues([...formValues, { category: "", vendor: "", service: "", price: "" }]);
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
        const updatedServices = [...services];
        updatedServices[index] = data.results.services || [];
        setServices(updatedServices);
      }
    };
  
    const handleChange = (index, e, price) => {
      const newFormValues = [...formValues];
      newFormValues[index] = {
        ...newFormValues[index],
        [e.target.name]: e.target.value,
        price: e.target.name === "price" ? e.target.value : price || newFormValues[index].price
      };
      setFormValues(newFormValues);
    };
  
    // Filter functions for search functionality
    const filterCategories = () => {
      return allCategories
        .filter(cat => cat.status === true)
        .filter(cat => 
          categorySearch === "" || 
          cat.name_en.toLowerCase().includes(categorySearch.toLowerCase())
        );
    };
  
    const filterVendors = (index) => {
      return vendors[index]?.filter(vendor => 
        vendorSearch === "" || 
        vendor.full_name.toLowerCase().includes(vendorSearch.toLowerCase())
      ) || [];
    };
  
    const filterServices = (index) => {
      return services[index]?.filter(service => 
        serviceSearch === "" || 
        service.name_en.toLowerCase().includes(serviceSearch.toLowerCase())
      ) || [];
    };
  
    const onSubmit = async (data) => {
      if (!formValues[0]?.category || !formValues[0]?.vendor || !formValues[0]?.service) {
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
        {formValues.map((element, index) => (
          <div className="form-group mb-0 col-12" key={index}>
            <div className="row mt-3">
              {/* Category Select with Search */}
              <div className="form-group col-4">
                <label>Select Category</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Search category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                <select
                  className="form-select"
                  name="category"
                  value={element.category || ""}
                  onChange={(e) => {
                    handleChange(index, e);
                    VendorsList(e.target.value, index);
                  }}
                >
                  <option value="">Select Category</option>
                  {filterCategories().map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Select with Search */}
              <div className="form-group col-4">
                <label>Select Vendor</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Search vendor..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  disabled={!element.category}
                />
                <select
                  className="form-select"
                  name="vendor"
                  value={element.vendor || ""}
                  onChange={(e) => {
                    handleChange(index, e);
                    createOptionsServices(e.target.value, index);
                  }}
                  disabled={!element.category}
                >
                  <option value="">Select Vendor</option>
                  {filterVendors(index).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Select with Search */}
              <div className={`form-group ${formValues.length <= 1 ? "col-4" : "col-3"}`}>
                <label>Select Service</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Search service..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  disabled={!element.vendor}
                />
                <select
                  className="form-select"
                  name="service"
                  value={element.service || ""}
                  onChange={(e) => {
                    const selectedService = services[index]?.find(
                      s => s._id === e.target.value
                    );
                    handleChange(index, e, selectedService?.price || 0);
                  }}
                  disabled={!element.vendor}
                >
                  <option value="">Select Service</option>
                  {filterServices(index).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name_en} - {item.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remove button */}
              <div className="form-group col-1 mt-4">
                {formValues.length > 1 && (
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
          </div>
        ))}

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
