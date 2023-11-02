import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import Select from "react-select";
import {
  Buyers,
  SearchUser,
  SearchVendor,
  SendPushNotify,
  getPushNotify,
} from "../../httpServices/dashHttpService";
import Swal from "sweetalert2";
import moment from "moment";
import { MDBDataTable } from "mdbreact";
import { message } from "antd";

const Notification = () => {
  const [slide, setSlide] = useState("NM");
  const [sideBar, setSideBar] = useState();
  const [userTypes, setUsertypes] = useState("");
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchVendorKey, setSearchVendorKey] = useState("");
  const [notification, setNotifications] = useState([]);

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  useEffect(() => {
    createOptions();
  }, [searchKey]);

  useEffect(() => {
    createVendorOptions();
  }, [searchVendorKey]);

  useEffect(() => {
    GetNotifications();
    getAllBuyers();
  }, [userTypes]);

  const [notifyList, setNotifyList] = useState({
    columns: [
      {
        label: "S.NO.",
        field: "sn",
        sort: "asc",
        width: 50,
      },
      {
        label: "MESSAGE SENT",
        field: "message_sent",
        sort: "asc",
        width: 100,
      },
      {
        label: "TO USERS",
        field: "user",
        sort: "asc",
        width: 100,
      },
      {
        label: "MESSAGE STATUS",
        field: "status",
        sort: "asc",
        width: 150,
      },

      {
        label: "DATE",
        field: "date",
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

  const GetNotifications = async () => {
    await getPushNotify().then((res) => {
      const newRows = [];
      if (!res.data.error) {
        let values = res.data.results?.notifications;
        console.log(values);
        values?.map((list, index) => {
          const returnData = {};
          returnData.sn = index + 1 + ".";
          returnData.message_sent = list?.message;
          returnData.user = list?.userType;
          returnData.status = "Sent";
          returnData.date = moment(list?.updatedAt).format("L");
          newRows.push(returnData);
        });
        setNotifyList({ ...notifyList, rows: newRows });
      }
      setNotifications(res.data.results?.notifications);
    });
  };

  const createOptions = async () => {
    await SearchUser({ search: searchKey }).then((res) => {
      console.warn(res);
      if (!res.error) {
        let data = res?.data.results?.buyers;
        const optionList = data?.map((item, index) => ({
          value: item?._id,
          label: item?.full_name,
        }));
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        setBuyerOptions(optionList);
      }
    });
  };

  const createVendorOptions = async () => {
    await SearchVendor({ search: searchVendorKey }).then((res) => {
      if (!res.error) {
        let data = res?.data.results?.vendor;
        console.log(data);
        const optionList = data?.map((item, index) => ({
          value: item?._id?._id,
          label: item?._id?.full_name,
        }));
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        setVendorOptions(optionList);
      }
    });
  };

  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };

  const getAllBuyers = async () => {
    let { data } = await Buyers();
  };

  const onSubmit = async (data) => {
    if (userTypes) {
      if (
        selectedUsers.usersSelected &&
        selectedUsers.usersSelected.length > 0
      ) {
        await SendPushNotify({
          message: data?.message,
          userType: userTypes,
          selectedUsers: selectedUsers.usersSelected.map((item) => item?.value),
        }).then((res) => {
          document.getElementById("resetForm").click();
          GetNotifications();
          setSelectedUsers({ usersSelected: [] });
          if (!res.data.error) {
            Swal.fire({
              title: "Notification Sent!",
              icon: "success",
              confirmButtonText: "Okay",
              confirmButtonColor: "#e25829",
            });
          }
        });
      } else {
        const allUsersOfType =
          userTypes === "Vendor" ? vendorOptions : buyerOptions;
        const selectedUserIds = allUsersOfType.map((item) => item.value);

        await SendPushNotify({
          message: data?.message,
          userType: userTypes,
          selectedUsers: selectedUserIds,
        }).then((res) => {
          document.getElementById("resetForm").click();
          GetNotifications();
          setSelectedUsers({ usersSelected: [] });
          if (!res.data.error) {
            Swal.fire({
              title: "Notification Sent to All " + userTypes + "s!",
              icon: "success",
              confirmButtonText: "Okay",
              confirmButtonColor: "#e25829",
            });
          }
        });
      }
    } else {
      message.error("Please select a user type.");
    }
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
                    <h2>Send Push Notification Messages</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row  justify-content-between"
                  action=""
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-group col-12">
                    <label htmlFor="">Write a message</label>
                    <textarea
                      type="text"
                      className={classNames("form-control", {
                        "is-invalid": errors.message,
                      })}
                      name="message"
                      {...register("message", {
                        required: "*Message is required!",
                      })}
                      style={{ height: "110px" }}
                    />
                    {errors.message && (
                      <small className="errorText mx-1">
                        {errors.message.message}
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-0 col Select">
                    <label htmlFor="">Select Vendor/Buyer</label>
                    <select
                      // aria-label="Default select example"
                      className={classNames("form-select", {
                        "is-invalid": errors.userType,
                      })}
                      name="userType"
                      {...register("userType", {
                        required: "*Required!",
                        onChange: (e) => {
                          setUsertypes(e.target.value);
                        },
                      })}
                    >
                      <option value="">Select Type</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Buyer">Buyer</option>
                    </select>
                    {errors.userType && (
                      <small className="errorText mx-1">
                        {errors.userType.message}
                      </small>
                    )}
                  </div>

                  <div className="form-group mb-0 col">
                    <label htmlFor="">Search User</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      // options={options}
                      options={
                        userTypes === "Vendor" ? vendorOptions : buyerOptions
                      }
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChange}
                      value={selectedUsers?.usersSelected}
                      onInputChange={handleInputChange}
                      isDisabled={userTypes === "" ? true : false}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto mt-3">
                    <button className="comman_btn" type="submit">
                      Send
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="resetForm"
                    >
                      reset
                    </button>
                  </div>
                </form>
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
                        data={notifyList}
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
  );
};

export default Notification;
