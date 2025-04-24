import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  AllCategory,
  AllOffers,
  DeleteOffer,
  editOffer,
  GetVendorByCate,
  getViewCombo,
  SearchUser,
  VendorServices,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MDBDataTable } from "mdbreact";
import ImageEdit from "../../CropImage/ImageEdit";
import HandleAddOffer from "./HandleAddOffer";

const MarketingOffers = () => {
  const [slide, setSlide] = useState("MO");
  const [sideBar, setSideBar] = useState();
  const [files, setFiles] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [allCategories, setAllCategories] = useState();
  const [categoryData, setCategoryData] = useState();
  const [offers, setAllOffers] = useState([]);
  const [offerId, setOfferId] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [croppedImage, setCroppedImage] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const [serviceImage, setServiceImage] = useState();

  const [offerData, setOfferData] = useState();
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      category: "",
      vendor: "",
      service: "",
      price: "",
    },
  ]);
  const [formValues2, setFormValues2] = useState([
    {
      category: "",
      vendor: "",
      service: "",
      price: "",
    },
  ]);
  const {
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
        label: "Image",
        field: "image",
        sort: "asc",
        width: 100,
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
    const calculatedTotal = calculateTotal();
    setTotalPrice(calculatedTotal);
  }, [formValues]);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const getAllOffers = async () => {
    const { data } = await AllOffers();
    console.log(data);
    const newRows = [];
    if (!data.error) {
      let values = data.results?.offer;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        returnData.sn = index + 1 + ".";
        returnData.name_en = list?.name_en;
        returnData.image = (
          <div className="cursor-pointer position-relative">
            <div>
              <img
                src={
                  list?.image
                    ? list?.image
                    : require("../../../assets/img/Nupload.jpg")
                }
                alt="imagse"
                className="table_img"
              />
            </div>
          </div>
        );

        returnData.name_ar = (
          <span lang="ar" dir="rtl">
            {list?.name_ar}
          </span>
        );
        returnData.category = list?.type
          .map((item) => item?.category?.name_en)
          .join(", ");
        returnData.vendor = list?.type
          .map((item) => item?.vendor?.full_name)
          .join(", ");
        returnData.number = list?.comboPrice;
        returnData.service = list?.type
          .map((item) => item?.service?.name_en)
          .join(", ");

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
            <a
              className="comman_btn2 table_viewbtn ms-1"
              onClick={() => handleDelete(list?._id)}
            >
              Delete
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

  const createOptionsServices = async (id, ind) => {
    if (id) {
      await VendorServices(id).then((res) => {
        if (!res.error) {
          setSelectedServices({ servicesSelected: [] });
          let data = res?.data.results.services;
          const optionList = data?.map((item, index) => {
            return item;
          });
          let packs = [...services];
          packs[ind] = optionList;
          setServices(packs);
          console.log(packs);
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

  const onEdit = async (data) => {
    console.log(data, "data");
    let tempData = [];
    formValues2?.map((item) => {
      tempData.push({
        category: item.category,
        vendor: item.vendor,
        service: item.service,
      });
    });
    let formData = new FormData();

    croppedImage && formData.append("image", croppedImage);
    formData.append("name_en", data?.combo_en_edit);
    formData.append("name_ar", data?.combo_ar_edit_ar);
    formData.append("comboPrice", data?.Edit_Discount);
    formData.append("validFrom", data?.dateFrom);
    formData.append("validTo", data?.dateTo);
    formData.append("type", JSON.stringify(tempData));
    formData.append("deliveryCharge", data?.free_delivery_price);

    await editOffer(offerId, formData).then((res) => {
      if (!res.data.error) {
        document.getElementById("closed").click();
        getAllOffers();
        setServiceImage("");
        setOfferData("");
        setCroppedImageUrl("");
        setModalVisible2(false);
        setFormValues2([]);
        setFormValues([]); 
        Swal.fire({
          title: "Offer Modified Successfully!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const handleDelete = async (id) => {
    const { data } = await DeleteOffer(id);
    console.log(data);
    if (!data?.error) {
      Swal.fire({
        title: "Offer deleted",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      getAllCat();
      getAllOffers();
    }
  };

  const onFileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  console.log(files);

  const handleView = async (id) => {
    setOfferId(id);
    const { data } = await getViewCombo(id);
    let date = data?.results.offer;
    setServiceImage(date?.image);
    setOfferData(date);
    document.getElementById("from").defaultValue = date?.validFrom?.slice(
      0,
      10
    );
    document.getElementById("till").defaultValue = date?.validTo?.slice(0, 10);

    reset({
      combo_en_edit: date.name_en,
      combo_ar_edit_ar: date?.name_ar,
      Edit_Discount: date?.comboPrice,
      dateFrom: date?.validFrom?.slice(0, 10),
      dateTo: date?.validTo?.slice(0, 10),
    });
    let newFormValues = [];
    date?.type?.map((item) => {
      newFormValues.push({
        category: item?.category?._id,
        vendor: item?.vendor?._id,
        vendorName: item?.vendor?.full_name,
        service: item?.service?._id,
        serviceName: item?.service?.name_en,
        price: item?.service?.price,
      });
    });

    setFormValues2(newFormValues);
  };

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };

  let handleChange2 = (i, e, price) => {
    let newFormValues = [...formValues2];
    if (e.target.name === "price") {
      newFormValues[i][e.target.name] = e.target.value;
    } else {
      newFormValues[i][e.target.name] = e.target.value;
      newFormValues[i]["price"] = price;
    }
    setFormValues2(newFormValues);
  };
  console.log(formValues2, "lll");

  const removeFormFields2 = (index) => {
    let newFormValues = [...formValues2];
    newFormValues.splice(index, 1);
    setFormValues2(newFormValues);

    let newOptions2 = [...options2];
    newOptions2.splice(index, 1);
    setOptions2(newOptions2);
    const filteredOptions = newFormValues.map((element) =>
      options2.find((option) => option?._id === element.service)
    );
    const totalPrice = filteredOptions.reduce((acc, next) => {
      return acc + parseFloat(next?.price || 0);
    }, 0);
    setTotalPrice(totalPrice);
  };

  const calculateTotal = () => {
    const total = formValues.reduce((acc, next) => {
      return acc + (next?.price ? parseFloat(next?.price) : 0);
    }, 0);
    return total;
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

                <HandleAddOffer getAllOffers={getAllOffers} />
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
                  setServiceImage("");
                  document.getElementById("ResetS").click();
                  setSelectedUsers(null);
                  setFormValues2([]);
                  setFormValues([]);
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
                        value:
                          /^(?!\s)([\u0621-\u064A\u0660-\u0669\d\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+)$/,
                        message:
                          "Spaces at the start, numbers, or non-Arabic characters are not allowed",
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
                    onInput={(e) => {
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                    name="Edit_Discount"
                  />
                  {errors2.Edit_Discount && (
                    <small className="errorText mx-1">
                      {errors2.Edit_Discount.message}
                    </small>
                  )}
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Free Delivery Price </label>
                  <input
                    type="number"
                    className={classNames("form-control", {
                      "is-invalid": errors2.free_delivery_price,
                    })}
                    {...register2("free_delivery_price", {
                      required: "*Please Enter Price",
                    })}
                    onInput={(e) => {
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }
                    }}
                    name="free_delivery_price"
                  />
                  {errors2.free_delivery_price && (
                    <small className="errorText mx-1">
                      {errors2.free_delivery_price.message}
                    </small>
                  )}
                </div>

                {offerData?.validFrom?.slice(0, 10) >
                  new Date().toISOString().slice(0, 10) && (
                  <>
                    {(formValues2 || [])?.map((element, index) => (
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
                                handleChange2(index, e);
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
                          <div className="form-group col-4">
                            <label htmlFor="">Select Vendor</label>
                            <select
                              className="form-select "
                              aria-label="Default select example"
                              id={index}
                              name="vendor"
                              value={element.vendor || ""}
                              onChange={(e) => {
                                handleChange2(index, e);
                                createOptionsServices(e.target.value, index);
                              }}
                            >
                              <option selected="" value="">
                                {element?.vendorName}
                              </option>

                              {vendors[index]?.map((item) => (
                                <option value={item?._id}>
                                  {item?.full_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div
                            className={`form-group ${
                              formValues2?.length <= 1 ? "col-4" : "col-3"
                            }`}
                          >
                            <label htmlFor="">Select Service</label>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              name="service"
                              id={index}
                              value={element.service || ""}
                              onChange={(e) => {
                                const selectedPrice =
                                  services[index]?.find(
                                    (item) => item?._id === e.target.value
                                  )?.price || 0;
                                handleChange2(index, e, selectedPrice);
                              }}
                            >
                              <option selected={true} value="">
                                {element?.serviceName}
                              </option>

                              {services[index]?.map((item) => (
                                <option value={item?._id}>
                                  {item?.name_en} - {item?.price}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group col-1  mt-4">
                            <button
                              className={`comman_btn mt-2 ${
                                formValues2?.length <= 1 ? "d-none" : "d-block"
                              }`}
                              style={{ padding: "5px 20px" }}
                              type="button"
                              disabled={formValues2?.length <= 1 ? true : false}
                              onClick={() => removeFormFields2(index)}
                            >
                              <i className="fa fa-minus mt-1 mx-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="form-group col-6">
                  <label htmlFor="">Image</label>
                  <div
                    className="cursor-pointer position-relative"
                    onClick={() => {
                      setModalVisible2(true);
                    }}
                  >
                    <div>
                      <img
                        src={croppedImageUrl || serviceImage}
                        style={{
                          width: "98%",
                          height: "8rem",
                          borderRadius: "12px",
                        }}
                        alt="image"
                        className="table_ismg"
                      />
                    </div>
                    <div
                      style={{
                        top: "-15px",
                        right: "-10px",
                        background: "#e25829",
                      }}
                      className="position-absolute rounded p-1"
                    >
                      <i
                        style={{
                          left: "2px",
                        }}
                        className="fa fa-edit me-1 text-light position-relative"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mb-0 col-12 text-center mt-3">
                  {/* <a
                    className="comman_btn mx-3 "
                    onClick={() => addFormFields2()}
                  >
                    Add more +
                  </a> */}

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

      <div
        className={`modal modal-lg ${
          modalVisible2 ? "show d-block" : "d-none"
        }`}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <ImageEdit
          setModalVisible2={setModalVisible2}
          setCroppedImage={setCroppedImage}
          setCroppedImageUrl={setCroppedImageUrl}
        />
      </div>
    </div>
  );
};

export default MarketingOffers;
