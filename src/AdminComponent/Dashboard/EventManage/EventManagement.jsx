import { MDBDataTable } from "mdbreact";
import React, { useState } from "react";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  AddEventDetails,
  AllEventRequest,
  GetEventReqInfo,
  getServices,
} from "../../httpServices/dashHttpService";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
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

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [budgetCost, setBudgetCost] = useState();
  const [totalAmount, setTotalAmount] = useState();

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
  }, []);
  useEffect(() => {
    createOptionsServices();
  }, [searchKey]);

  const getBarClick = (val) => {
    console.log(val);
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
        returnData.date =
          moment(list?.startDate).format("L") + ":" + list?.startTime;
        returnData.status = list?.status;
        returnData.action = (
          <>
            <Link
              className={
                list?.status === "Completed"
                  ? " comman_btn table_viewbtn"
                  : "comman_btn2 table_viewbtn"
              }
              data-bs-toggle="modal"
              data-bs-target={
                list?.status === "Completed"
                  ? "#staticBackdrop50"
                  : "#staticBackdrop49"
              }
              onClick={() =>
                list?.status === "Completed"
                  ? manageEvent(list?._id)
                  : manageEvent(list?._id)
              }
            >
              {list?.status === "Completed" ? "View Plan" : "Add Plan"}
            </Link>
          </>
        );
        newRows.push(returnData);
      });

      setEvents({ ...events, rows: newRows });
    }
  };

  const manageEvent = async (id) => {
    setEventId(id);
    const { data } = await GetEventReqInfo(id);
    if (!data.error) {
      console.log(data);
      let startDate = data?.results?.event.startDate;
      let endDate = data?.results?.event.endDate;
      let startTime = data?.results?.event.startTime;
      let endTime = data?.results?.event.endTime;
      formatDateTime(startDate, startTime, endDate, endTime);

      setBudgetCost(data?.results?.event?.budget_cost);
      setTotalAmount(data?.results?.event?.totalAmount);

      setEventInfo(data?.results?.event);

      await getServices().then((res) => {
        setServices(res?.data.results?.services);
      });
    }
  };

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

  console.log(packages);

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

  function formatDateTime(startDate, startTime, endDate, endTime) {
    console.log(startDate, endDate, endTime);
    let startDateTime = dayjs(startDate);
    let startTimeParsed = dayjs(startTime, "hh:mm A");
    startDateTime = startDateTime.set("hour", startTimeParsed.hour());
    startDateTime = startDateTime.set("minute", startTimeParsed.minute());

    let endDateTime = dayjs(endDate);
    let endTimeParsed = dayjs(endTime, "hh:mm A");
    endDateTime = endDateTime.set("hour", endTimeParsed.hour());
    endDateTime = endDateTime.set("minute", endTimeParsed.minute());

    let formattedStartDateTime = startDateTime.format("YYYY-MM-DDTHH:mm");
    let formattedEndDateTime = endDateTime.format("YYYY-MM-DDTHH:mm");

    setStartDateTime(formattedStartDateTime);
    setEndDateTime(formattedEndDateTime);
  }

  const updateEvent = (data) => {
    console.log("event", data);
  };

  // console.warn(eventInfo);

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
                          className="comman_btn "
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
              <button
                style={{ marginLeft: "60%" }}
                type="button"
                className="comman_btn border border-light py-1 px-4 ml-auto"
                onClick={(e) => sendEventInfo(e, eventInfo)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closed"
                onClick={() => setEdit(false)}
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
                    defaultValue={eventInfo?.eventName}
                    disabled={!edit}
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
                    disabled={!edit}
                    defaultValue={eventInfo?.event_location?.city}
                  />
                </div>
                {(eventInfo?.packages || [])?.map((element, index) => (
                  <div className="form-group mb-0 col-12 border-bottom">
                    <div className="row" key={index}>
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
                <div className="form-group col-6 mt-3">
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
                </div>
                {/* TIME */}
                <div className="form-group col-6 mt-3">
                  <label htmlFor="">Select Start Date & Time</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        value={dayjs(startDateTime)}
                        onChange={(newValue) => setStartDateTime(newValue)}
                        disabled={!edit}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div className="form-group col-6 mt-3">
                  <label htmlFor="">Select End Date & Time</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        value={dayjs(endDateTime)}
                        onChange={(newValue) => setEndDateTime(newValue)}
                        disabled={!edit}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
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
                {edit ? (
                  <div className="form-group mb-0 col-12 text-center mt-3">
                    <button
                      className="comman_btn"
                      type="button"
                      onClick={() => updateEvent(eventInfo)}
                    >
                      Update
                    </button>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
