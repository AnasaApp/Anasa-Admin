import { MDBDataTable } from "mdbreact";
import React, { useState } from "react";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  AddEventDetails,
  AllEventRequest,
  EditEventDetails,
  GetEventReqInfo,
  getServiceAmount,
  getServices,
  partyApproval,
  updateServiceAmount,
} from "../../httpServices/dashHttpService";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import DateTimePicker from "react-datetime-picker";
import dayjs from "dayjs";

const EventManagement = () => {
  const [slide, setSlide] = useState("EM");
  const [sideBar, setSideBar] = useState();
  const [eventId, setEventId] = useState();
  const [eventInfo, setEventInfo] = useState();
  const [services, setServices] = useState();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedServiceImage, setSelectedServiceImage] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(""); // for edit option
  const [selectedPackages, setSelectedPackages] = useState(""); // for edit option

  const [budgetCost, setBudgetCost] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [eventName, setEventName] = useState();

  const [startDate, setStartDateTime] = useState(new Date());
  const [endDate, setEndDateTime] = useState(new Date());

  const [serviceCharge, setServiceCharge] = useState();
  const [serviceAmount, setServiceAmount] = useState();
  const [serviceId, setServiceId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState([
    {
      service: "",
      package: "",
    },
  ]);

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset,
  } = useForm();

  useEffect(() => {
    getAllEvents();
    getServicesAmount();
  }, []);
  useEffect(() => {
    createOptionsServices();
  }, [searchKey]);

  const getBarClick = (val) => {
    // console.log(val);
    setSideBar(val);
  };

  const [events, setEvents] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        maxWidth: 50,
      },
      {
        label: "EVENT NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },

      {
        label: "EVENT LOCATION",
        field: "address",
        sort: "asc",
        width: 150,
      },
      {
        label: "DESCRIPTION",
        field: "desc",
        sort: "asc",
        width: 100,
      },
      {
        label: "BUYER NAME",
        field: "buyer",
        sort: "asc",
        width: 100,
      },
      {
        label: "STAR DATE & TIME",
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
      {
        label: "ACTION",
        field: "action",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });

  const getAllEvents = async () => {
    const { data } = await AllEventRequest({
      from: "",
      to: "",
    });
    const newRows = [];
    if (!data.error) {
      let values = data?.results?.events;
      console.log(values);
      values?.map((list, index) => {
        const returnData = {};
        let address =
          list?.event_location?.house_number +
          "," +
          list?.event_location?.building_name +
          " " +
          list?.event_location?.locality +
          " " +
          list?.event_location?.city +
          "," +
          list?.event_location?.city;
        returnData.sn = index + 1 + ".";
        returnData.name = list?.eventName;
        returnData.address = address;
        returnData.desc = list?.description;
        returnData.buyer = list?.buyer?.full_name;
        const startTime = list?.startTime;

        let formattedTime;
        if (/^\d{2}:\d{2}:\d{2}$/.test(startTime)) {
          // If the startTime is in "HH:mm:ss" format, convert it to "h:mm A"
          formattedTime = moment(startTime, "HH:mm:ss").format("h:mm A");
        } else {
          // If the startTime is already in "h:mm A" format, keep it as-is
          formattedTime = startTime;
        }
        returnData.date =
          moment(list?.startDate).format("L") + " : " + formattedTime;
        returnData.status = list?.status;
        returnData.action = (
          <>
            <Link
              className={
                list?.status === "Pending"
                  ? "green_btn"
                  : list?.status === "Paid"
                  ? " comman_btn2 table_viewbtn"
                  : list?.status === "Completed"
                  ? "comman_btn table_viewbtn"
                  : "d- none"

              }
              data-bs-toggle="modal"
              data-bs-target={
                list?.status === "Pending"
                  ? "#staticBackdrop50"
                  : list?.status === "Paid"
                  ? "#staticBackdrop49"
                  : list?.status === "Completed"
                  ? "#staticBackdrop50" : ""
              }
              onClick={() =>
                list?.status === "Pending"
                  ? manageEvent(list?._id)
                  : list?.status === "Paid"
                  ? manageEvent(list?._id)
                  : list?.status === "Completed"
                  ? manageEvent(list?._id)
                  : ''
              }
            >
              {list?.status === "Pending"
                ? "Approve"
                : list?.status === "Paid"
                ? "Add Plan"
                : list?.status === "Completed"
                ? "View Plan"
                : ""}
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setEvents({ ...events, rows: newRows });
    }
  };

  const getServicesAmount = async () => {
    let { data } = await getServiceAmount();
    setServiceId(data?.results?.service[0]?._id);
    setServiceCharge(data?.results?.service[0]?.amount);
  };

  const approveParty = async (e, id) => {
    e.preventDefault();
    console.log(id);
    const { data } = await partyApproval(id);
    if (!data.error) {
      Swal.fire({
        text: data.message,
        icon: "success",
        confirmButtonText: "Okay",
      });
      getAllEvents();
      document.getElementById("closed").click();
    }
  };

  const manageEvent = async (id) => {
    setIsLoading(true);
    setEventId(id);
    const { data } = await GetEventReqInfo(id);
    console.warn(data);
    if (!data.error) {
      // console.log(data);
      setIsLoading(false);
      let startDate = data?.results?.event?.startDate;
      let endDate = data?.results?.event?.endDate;
      let startTime = data?.results?.event?.startTime;
      let endTime = data?.results?.event?.endTime;

      console.log(moment(startDate).format("YYYY-MM-DDTHH:mm:ss"));
      setStartDateTime(moment.utc(startDate).format("YYYY-MM-DDTHH:mm:ss"));
      setEndDateTime(moment.utc(endDate).format("YYYY-MM-DDTHH:mm:ss"));

      setBudgetCost(data?.results?.event?.budget_cost);
      setTotalAmount(data?.results?.event?.totalAmount);
      setEventName(data?.results?.event?.eventName);

      setEventInfo(data?.results?.event);

      await getServices().then((res) => {
        setServices(res?.data.results?.services);
      });
    }
  };

  // console.warn(eventInfo);

  const createOptionsServices = async (id) => {
    setSelectedServices(id);
    await getServices().then((res) => {
      if (!res.error) {
        let data = res?.data.results.services;
        console.log(data);
        const optionList = data
          ?.filter((itm, idx) => itm._id === id)
          .map((item, index) => {
            return item;
          });
        let packs = [...packages];
        packs.push(optionList[0]);
        setPackages(packs);
      }
    });
  };

  // console.log(packages);

  const onEditSave = async () => {
    const { data } = await AddEventDetails(
      {
        packages: formValues,
      },
      eventId
    );

    if (!data.error) {
      getAllEvents();
      document.getElementById("closedEdits").click();
      Swal.fire({
        text: "Event-Plan Added",
        icon: "success",
        confirmButtonText: "Okay",
      });
      setFormValues([
        {
          service: "",
          package: "",
        },
      ]);
    }
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);

    let newTotalPrice = 0;
    newFormValues.forEach((item) => {
      if (item.service && item.package) {
        const selectedService = services.find(
          (service) => service._id === item.service
        );
        if (selectedService) {
          const selectedPackage = selectedService.packages.find(
            (pkg) => pkg._id === item.package
          );
          if (selectedPackage) {
            newTotalPrice += selectedPackage.price;
          }
        }
      }
    });
    setTotalPrice(newTotalPrice);
  };

  const updateSelectedServiceImage = (index, image) => {
    const newImages = [...selectedServiceImage];
    newImages[index] = image;
    setSelectedServiceImage(newImages);
  };

  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        service: "",
        package: "",
      },
    ]);
    setSelectedServiceImage([...selectedServiceImage, null]);
  };

  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    const removedItem = newFormValues[index];
    newFormValues.splice(index, 1);
    setFormValues(newFormValues);

    let newImages = [...selectedServiceImage];
    newImages.splice(index, 1);
    setSelectedServiceImage(newImages);

    let newTotalPrice = totalPrice;

    if (removedItem.service && removedItem.package) {
      const selectedService = services.find(
        (service) => service._id === removedItem.service
      );
      if (selectedService) {
        const selectedPackage = selectedService.packages.find(
          (pkg) => pkg._id === removedItem.package
        );
        if (selectedPackage) {
          newTotalPrice -= selectedPackage.price;
        }
      }
    }

    setTotalPrice(newTotalPrice);
  };

  // console.log(formValues, "jhijh");

  const generateServiceOptions = () => {
    return services
      .filter((item) => item.status === true)
      .map((item) => <option value={item._id}>{item.name_en}</option>);
  };

  const generatePackageOptions = (serviceId) => {
    const selectedService = services.find((item) => item._id === serviceId);
    if (selectedService) {
      return selectedService.packages.map((item) => (
        <option value={item._id}>
          {item.name_en} د.إ {item.price}
        </option>
      ));
    }
    return [];
  };

  const sendEventInfo = (e, dataEvent) => {
    e.preventDefault();
    setEdit(true);
  };

  // function formatDateTime(startDate, startTime, endDate, endTime) {
  //   // Convert date and time strings into moment objects
  //   console.log(startDate)
  //   // const startDateTime = dayjs(`${startDate}`, "YYYY-MM-DD HH:mm");
  //   // const endDateTime = dayjs(`${endDate}`, "YYYY-MM-DD HH:mm");

  //   setStartDateTime(startDate);
  //   setEndDateTime(endDate);
  // }

  const extractTimeFromDateTime = (dateTimeString) => {
    let time = dateTimeString.split("T")[1].split("+")[0];
    return time;
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    const id = eventInfo?._id;

    let StartTime = extractTimeFromDateTime(moment(startDate).format());
    let EndTime = extractTimeFromDateTime(moment(endDate).format());

    let eventData = {
      startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
      startTime: StartTime,
      endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss"),
      endTime: EndTime,
    };

    if (eventData.startDate > eventData.endDate) {
      Swal.fire({
        icon: "warning",
        text: "Please select valid end date",
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        toast: true,
      });
      return false;
    }

    console.log(eventData);

    const { data } = await EditEventDetails(id, eventData);
    if (!data.error) {
      Swal.fire({
        text: "Event Time Changed",
        icon: "success",
        confirmButtonText: "Okay",
      });
      document.getElementById("closed").click();
      getAllEvents();
    }
  };

  const handleServiceCharge = async (e) => {
    e.preventDefault();
    console.log(serviceAmount, serviceId);
    let { data } = await updateServiceAmount(serviceId, serviceAmount);
    console.log(data);
    if (!data.error) {
      Swal.fire({
        text: "Service Charge Updated Successfully",
        icon: "success",
        confirmButtonText: "Okay",
      });
      document.getElementById("resetServiceModal").click();
      document.getElementById("updateServiceChargeClose").click();
      await getServicesAmount();
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  //   let handleEventChange = (i, e) => {
  //     console.log(i, e.target.value);
  //     let newFormValues = { ...eventInfo };
  //     newFormValues.packages[i][e.target.name] = e.target.value;
  //     console.warn(newFormValues);
  //     setEventInfo(newFormValues);
  //   };
  // console.warn(eventInfo);

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="tab-pane fade show mb-4 w-50">
            <div className="bg-white rounded d-flex justify-content-between align-items-center px-4 py-3 position-relative">
              <p className="mb-0 pb-0 fs-5">Service Charge</p>
              <p className="mb-0 pb-0 pe-5">{serviceCharge}</p>
              <button
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                type="button"
                className="position-absolute top-0 end-0 border-0 bg-white"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <div
                class="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="staticBackdropLabel">
                        Update Service Charge
                      </h5>
                      <button
                        type="button"
                        id="updateServiceChargeClose"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <form onSubmit={handleServiceCharge}>
                        <div className="form-group col-12">
                          <label htmlFor="" className="mb-2">
                            Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter amount to withdraw"
                            defaultValue={serviceCharge}
                            onChange={(e) => setServiceAmount(e.target.value)}
                          />
                        </div>
                        <button
                          type="reset"
                          id="resetServiceModal"
                          className="d-none"
                          data-bs-dismiss="modal"
                        >
                          Reset
                        </button>
                        <button type="submit" className="comman_btn mt-3">
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row">
                  <div className="col-12 px-0">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto ">
                                <h2 className="">Events Management</h2>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <MDBDataTable
                                    bordered
                                    displayEntries={false}
                                    className="userData2"
                                    hover
                                    data={events}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop49"
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
                Add Package Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closedEdits"
                onClick={() => {
                  document.getElementById("ResetSSS").click();
                  setFormValues([
                    {
                      service: "",
                      package: "",
                    },
                  ]);
                  setSelectedServiceImage([]);
                  setTotalPrice(0);
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row  justify-content-center"
                action=""
                onSubmit={handleSubmit2(onEditSave)}
              >
                <div className="form-group col-4">
                  <label htmlFor="">Event Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amount"
                    defaultValue={eventInfo?.eventName}
                    disabled
                  />
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Buyer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amount"
                    defaultValue={eventInfo?.buyer?.full_name}
                    disabled
                  />
                </div>{" "}
                <div className="form-group col-4">
                  <label htmlFor="">Event Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    disabled
                    defaultValue={eventInfo?.event_location?.city}
                  />
                </div>
                {(formValues || [])?.map((element, index) => (
                  <div className="form-group mb-0 col-12 border-bottom">
                    <div className="row align-items-center" key={index}>
                      <div className="form-group col-4 mt-3">
                        <label htmlFor="">Select Services</label>
                        <select
                          className="form-select "
                          aria-label="Default select example"
                          name="service"
                          value={element.service || ""}
                          onChange={(e) => {
                            handleChange(index, e);
                            createOptionsServices(e.target.value);
                            const selectedService = services.find(
                              (item) => item._id === e.target.value
                            );
                            if (selectedService) {
                              updateSelectedServiceImage(
                                index,
                                selectedService.images[0]
                              );
                            }
                            console.log(services.price);
                          }}
                        >
                          <option selected="" value="">
                            Select
                          </option>
                          {services
                            ?.filter((item) => item.status === true)
                            .map((item) => (
                              <option value={item?._id}>{item?.name_en}</option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-4 mt-3">
                        <label htmlFor="">Select Package</label>
                        <select
                          className="form-select "
                          aria-label="Default select example"
                          name="package"
                          value={element.package || ""}
                          onChange={(e) => handleChange(index, e)}
                        >
                          <option selected="" value="">
                            Select
                          </option>
                          {packages
                            ?.filter(
                              (itm, idx) => itm?._id === element?.service
                            )[0]
                            ?.packages?.map((item) => (
                              <option value={item?._id}>
                                {item?.name_en} د.إ {item?.price}
                              </option>
                            ))}
                          {console.log(
                            packages?.filter(
                              (itm, idx) => itm?._id === element?.service
                            )
                          )}
                        </select>
                      </div>
                      <div style={{ height: "80px" }} className="col-2">
                        {selectedServiceImage[index] && (
                          <img
                            style={{ objectPosition: "top" }}
                            className="w-100 h-100 object-fit-cover"
                            src={selectedServiceImage[index]}
                            alt="Service"
                            height="50px"
                          />
                        )}
                      </div>
                      <div className="form-group col-2  mt-5">
                        <button
                          className={
                            formValues?.length <= 1 ? "d-none" : "comman_btn"
                          }
                          style={{ padding: "5px 20px" }}
                          type="button"
                          disabled={formValues?.length <= 1 ? true : false}
                          onClick={() => removeFormFields(index)}
                        >
                          <i className="fa fa-minus mt-1 mx-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {totalPrice !== 0 && (
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <p>Total Amount: </p>
                    <p className="fw-bold">{totalPrice}</p>
                  </div>
                )}
                <hr />
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <a
                    className="comman_btn mx-3 "
                    onClick={() => addFormFields()}
                  >
                    Add more +
                  </a>
                  <button className="comman_btn" type="submit">
                    Confirm
                  </button>
                </div>
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <button
                    className="comman_btn d-none"
                    type="reset"
                    id="ResetSSS"
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
        className="modal fade comman_modal"
        id="staticBackdrop50"
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
                View Plan Details
              </h5>
              {eventInfo?.status === "Completed" ? (
                <button
                  style={{ marginLeft: "60%" }}
                  type="button"
                  className="comman_btn border border-light py-1 px-4 ml-auto"
                  onClick={(e) => sendEventInfo(e, eventInfo)}
                >
                  Edit
                </button>
              ) : (
                ""
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closed"
                onClick={() => {
                  setEdit(false);
                  setSelectedService("");
                  setSelectedPackages("");
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row  justify-content-center"
                key={eventInfo}
                action=""
              >
                <div className="form-group col-4">
                  <label htmlFor="">Event Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amount"
                    value={eventInfo?.eventName}
                    disabled
                  />
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Buyer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amount"
                    value={eventInfo?.buyer?.full_name}
                    disabled
                  />
                </div>{" "}
                <div className="form-group col-4">
                  <label htmlFor="">Event Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    disabled
                    value={eventInfo?.event_location?.city}
                  />
                </div>
                {(eventInfo?.packages || []).map((element, index) => (
                  <div
                    className="form-group mb-0 col-12 border-bottom"
                    key={index}
                  >
                    <div className="row">
                      <div className="form-group col-6 mt-3">
                        <label htmlFor="">Service</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          disabled
                          defaultValue={element?.service?.name_en}
                        />
                      </div>
                      <div className="form-group col-6 mt-3">
                        <label htmlFor="">Package</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          disabled
                          defaultValue={element?.service?.packages?.name_en}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* <div className="form-group col-6 mt-3">
                  <label htmlFor="">Budget Price</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    disabled={!edit}
                    value={budgetCost}
                    onChange={(e) => setBudgetCost(e.target.value)}
                  />
                </div>
                <div className="form-group col-6 mt-3">
                  <label htmlFor="">Total Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    disabled={!edit}
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div> */}
                {/* TIME */}
                <div className="form-group col-6 mt-3">
                  <label htmlFor="">Start Date & Time</label>
                  <DateTimePicker
                    onChange={setStartDateTime}
                    value={startDate}
                    disabled={!edit}
                    required={true}
                    className="w-100"
                    maxDate={maxDate}
                  />
                </div>
                <div className="form-group col-6 mt-3">
                  <label htmlFor="">End Date & Time</label>
                  <DateTimePicker
                    onChange={setEndDateTime}
                    value={endDate}
                    disabled={!edit}
                    required={true}
                    className="w-100"
                    maxDate={maxDate}
                  />
                </div>
                <div className="form-group mb-0 col-12 text-center mt-3">
                  <button
                    className="comman_btn d-none"
                    type="reset"
                    id="ResetSSS"
                  >
                    Reset
                  </button>
                </div>
                {eventInfo?.status === "Pending" ? (
                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <button
                      className="comman_btn green_btn rounded-pill py-3 px-5"
                      type="button"
                      onClick={(e) => approveParty(e, eventInfo?._id)}
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {edit && (
                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <button
                      className="comman_btn"
                      type="button"
                      onClick={updateEvent}
                    >
                      Update
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
