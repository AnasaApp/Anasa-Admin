import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  changeBuyerTicketStatus,
  getViewBuyerSupport,
  getViewVendorSupport,
  PenalityDeduction,
  SendMessageBuy,
  SupportList,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MessageBox } from "react-chat-elements";
import Loader from "../Loader";
import { useForm } from "react-hook-form";
import classNames from "classnames";

const HelpSupport = () => {
  const chatpartMainRef = useRef(null);
  const VchatpartMainRef = useRef(null);
  const [slide, setSlide] = useState("HS");
  const [sideBar, setSideBar] = useState();
  const [buyerSupport, setBuyerSupport] = useState([]);
  const [vendorSupport, setVendorSupport] = useState([]);
  const [chat, setChat] = useState([]);
  const [chatV, setChatV] = useState([]);
  const [mainChat, setMainChat] = useState([]);
  const [mainChatV, setMainChatV] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageV, setNewMessageV] = useState("");
  const [buyId, setBuyId] = useState();
  const [VenId, setVenId] = useState();
  const [vendorIdForDeduction, setVendorIdForDeduction] = useState();
  const [loading, setLoading] = useState(false);
  // const [deductionAmount, setDeductionAmount] = useState(0);
  // const [deductionReason, setDeductionReason] = useState("");
  // const ref = useRef(null);
  useEffect(() => {
    getBuyerSupport();
    getVendorSupport();
  }, []);
  useEffect(() => {
    scrollToBottom();
    VScrollToBottom();
  }, [chat, chatV]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const ViewBuyerSupport = async (id, status) => {
    setLoading(true);
    if (status) {
      setBuyId(id);

      // setVendorId()
      const { data } = await getViewBuyerSupport(id);
      console.warn(data);
      setVendorIdForDeduction(data?.results?.message?.vendor?._id);
      if (!data.error) {
        setLoading(false);
        setChat(data?.results.message?.reply);
        setMainChat(data?.results.message);
      }
    } else {
      Swal.fire({
        title: "Ticket Closed!",
        text: "Please open support ticket to continue.",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const VieWVendorSupport = async (id, status) => {
    setLoading(true);
    if (status) {
      setVenId(id);
      const { data } = await getViewVendorSupport(id);
      // console.log(data);
      if (!data.error) {
        setLoading(false);
        setChatV(data?.results.message?.reply);
        setMainChatV(data?.results.message);
      }
      // console.log(data)
    } else {
      Swal.fire({
        title: "Ticket Closed!",
        text: "Please open support ticket to continue.",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      return false;
    }
  };

  const scrollToBottom = async () => {
    if (chatpartMainRef.current) {
      chatpartMainRef.current.scrollTop = chatpartMainRef.current.scrollHeight;
    }
  };
  const VScrollToBottom = async () => {
    if (VchatpartMainRef.current) {
      VchatpartMainRef.current.scrollTop =
        VchatpartMainRef.current.scrollHeight;
    }
  };

  const getBuyerSupport = async () => {
    const { data } = await SupportList({ page: 1, type: "Buyer" });
    console.log(data);
    setBuyerSupport(data.results);
  };

  const getVendorSupport = async () => {
    const { data } = await SupportList({ page: 1, type: "Vendor" });
    setVendorSupport(data.results);
  };

  const handleMessage = (e) => {
    let text = e.target.value;
    // console.log(text);
    setNewMessage(text);
  };

  const sendMessage = async () => {
    if (!newMessage || newMessage === null || newMessage === "") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Message can not be empty",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
      return false;
    }
    const { data } = await SendMessageBuy({ message: newMessage }, buyId);
    setNewMessage("");
    let msg = data?.results?.reply?.reply?.slice(-1);
    setChat((chat) => [...chat, msg[0]]);
    await scrollToBottom();
  };
  const sendMessageV = async () => {
    if (!newMessageV || newMessageV === null || newMessageV === "") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Message can not be empty",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
      });
      return false;
    }
    const { data } = await SendMessageBuy({ message: newMessageV }, VenId);
    setNewMessageV("");
    await VScrollToBottom();

    let msg = data?.results?.reply?.reply?.slice(-1);
    setChatV((chatV) => [...chatV, msg[0]]);
  };

  // const scrollToBottom = () => {
  //   console.log("scrolled");
  //   ref.current.scrollIntoView({ behavior: "smooth" });
  // };

  const TicketStatus = async (id) => {
    // console.log(id)
    const { data } = await changeBuyerTicketStatus(id);
    if (!data?.error) {
      Swal.fire({
        title: "Ticket Status Changed!",
        text: data?.message,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      getBuyerSupport();
      getVendorSupport();
    }
  };

  const onSubmit = async (data) => {
    let response = await PenalityDeduction({
      amount: data?.amount,
      reason: data?.reason,
      vendorId: vendorIdForDeduction,
    });
    console.log(response)
    if(!response?.data?.error){
      Swal.fire({
        title: "Deduction Successfull",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      document.getElementById('close2').click();
      document?.getElementById("reset").click();
    }

  };

  const getBarClick = (val) => {
    // console.log(val);
    setSideBar(val);
  };

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
                    <ul
                      className="nav nav-tabs comman_tabs"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#home"
                          type="button"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true"
                        >
                          Buyers
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#profile"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                        >
                          Vendor
                        </button>
                      </li>
                    </ul>
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
                              <div className="col-auto">
                                <h2>Help &amp; Support</h2>
                              </div>
                            </div>
                            {/* <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action="">
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">From</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">To</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-auto">
                                <button className="comman_btn2">Search</button>
                              </div>
                            </form> */}
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Buyer</th>
                                        <th>E-mail</th>
                                        <th>Subject</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>

                                    {buyerSupport ? (
                                      <tbody>
                                        {(buyerSupport?.chats || [])?.map(
                                          (item, ind) => (
                                            <tr key={ind}>
                                              <td>{ind + 1}</td>
                                              <td>{item?.buyer?.full_name}</td>
                                              <td>{item?.buyer?.email}</td>
                                              <td>{item?.subject}</td>
                                              <td>{item?.concern}</td>
                                              <td>
                                                {item?.createdAt?.slice(0, 10)}
                                              </td>
                                              <td>
                                                <div className="check_toggle">
                                                  <input
                                                    defaultChecked={
                                                      item?.status
                                                    }
                                                    type="checkbox"
                                                    name="checkv1"
                                                    id={item?._id}
                                                    className="d-none"
                                                    onClick={() => {
                                                      TicketStatus(item?._id);
                                                    }}
                                                  />
                                                  <label htmlFor={item?._id} />
                                                </div>
                                              </td>
                                              <td>
                                                <a
                                                  data-bs-toggle="modal"
                                                  data-bs-target={
                                                    item?.status
                                                      ? "#staticBackdrop"
                                                      : ""
                                                  }
                                                  className="comman_btn table_viewbtn"
                                                  onClick={() => {
                                                    ViewBuyerSupport(
                                                      item?._id,
                                                      item?.status
                                                    );
                                                    scrollToBottom();
                                                  }}
                                                >
                                                  View
                                                </a>
                                                {item?.vendor ? (
                                                  <a
                                                    className="comman_btn2 ms-2 table_viewbtn bg-red"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={
                                                      item?.status
                                                        ? "#staticBackdrop11"
                                                        : ""
                                                    }
                                                    onClick={() => {
                                                      ViewBuyerSupport(
                                                        item?._id,
                                                        item?.status
                                                      );
                                                    }}
                                                  >
                                                    Deduct
                                                  </a>
                                                ) : (
                                                  ""
                                                )}
                                                {/* <a
                                                  className="comman_btn2 table_viewbtn bg-red"
                                                  href="javscript:;">
                                                  Delete
                                                </a> */}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    ) : (
                                      <tbody>
                                        <tr>
                                          <td>No results..</td>
                                          <td>No results..</td>
                                          <td>
                                            No results..
                                            <br />
                                          </td>
                                          <td>No results..</td>
                                          <td>No results..</td>
                                          <td>No results..</td>
                                          <td>No actions..</td>
                                          <td>No actions..</td>
                                        </tr>
                                      </tbody>
                                    )}
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="profile"
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row comman_header justify-content-between">
                              <div className="col-auto">
                                <h2>Help &amp; Support</h2>
                              </div>
                            </div>
                            {/* <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action="">
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">From</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-5">
                                <label htmlFor="">To</label>
                                <input type="date" className="form-control" />
                              </div>
                              <div className="form-group mb-0 col-auto">
                                <button className="comman_btn2">Search</button>
                              </div>
                            </form> */}
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Vendor</th>
                                        <th>E-mail</th>
                                        <th>Subject</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {(vendorSupport?.chats || [])?.map(
                                        (item, ind) => (
                                          <tr key={ind}>
                                            <td>{ind + 1}</td>
                                            <td>{item?.vendor?.full_name}</td>
                                            <td>{item?.vendor?.email}</td>
                                            <td>{item?.subject}</td>
                                            <td>{item?.concern}</td>
                                            <td>
                                              {item?.createdAt?.slice(0, 10)}
                                            </td>
                                            <td>
                                              <div className="check_toggle">
                                                <input
                                                  defaultChecked={item?.status}
                                                  type="checkbox"
                                                  name="checkv1"
                                                  id={item?._id}
                                                  className="d-none"
                                                  onClick={() => {
                                                    TicketStatus(item?._id);
                                                  }}
                                                />
                                                <label htmlFor={item?._id} />
                                              </div>
                                            </td>
                                            <td>
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target={
                                                  item?.status
                                                    ? "#staticBackdrop2"
                                                    : ""
                                                }
                                                className="comman_btn table_viewbtn"
                                                onClick={() => {
                                                  VieWVendorSupport(
                                                    item?._id,
                                                    item?.status
                                                  );
                                                  VScrollToBottom();
                                                }}
                                              >
                                                View
                                              </a>
                                              {/* <a
                                                className="comman_btn2 table_viewbtn bg-red"
                                                data-bs-toggle="modal"
                                                data-bs-target={
                                                  item?.status
                                                    ? "#staticBackdrop11"
                                                    : ""
                                                }
                                                onClick={() => {
                                                  VieWVendorSupport(
                                                    item?._id,
                                                    item?.status
                                                  );
                                                }}
                                              >
                                                Deduct
                                              </a> */}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
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

      <>
        {/* !-- Modal  */}
        <div
          className="modal fade reply_modal"
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
                  Buyer Chat
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center py-4">
                  <Loader />
                </div>
              ) : (
                <div className="modal-body py-4 " id="chat">
                  <div
                    className="chatpart_main "
                    id="chat2"
                    ref={chatpartMainRef}
                  >
                    <div className="row mx-0 ">
                      <div className="col-12 user_chat mb-3">
                        <div className="row">
                          <MessageBox
                            position={"left"}
                            type={"text"}
                            title={mainChat?.buyer?.full_name}
                            text={mainChat?.concern}
                            date={mainChat?.createdAt}
                          />
                        </div>
                        {mainChat?.images?.map((item) => (
                          <div className="row mt-1">
                            <MessageBox
                              position={"left"}
                              type={"photo"}
                              title={mainChat?.buyer?.full_name}
                              date={mainChat?.createdAt}
                              data={{
                                uri: item,
                                width: 50,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {(chat || [])?.map((item) => (
                        <div className="col-12 user_chat mb-3">
                          <div className="row">
                            <MessageBox
                              position={
                                item?.replyBy === "Admin" ? "right" : "left"
                              }
                              type={"text"}
                              title={item?.replyBy}
                              text={item?.message}
                              date={item?.createdAt}
                            />
                          </div>
                        </div>
                      ))}
                      {/* <div ref={ref}>_____</div> */}
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <form className="message_send row mx-0 w-100" action="">
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Message...."
                      onChange={handleMessage}
                      value={newMessage}
                    />
                  </div>

                  <div className="form-group col-auto ps-0">
                    <button
                      className="send_btn"
                      type="send"
                      onClick={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                    >
                      <i className="fab fa-telegram-plane" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade reply_modal"
          id="staticBackdrop2"
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
                  Vendor Chat
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              {loading ? (
                <div className="d-flex align-items-center justify-content-center py-4">
                  <Loader />
                </div>
              ) : (
                <div className="modal-body py-4 " id="chat">
                  <div
                    className="chatpart_main "
                    id="chat2"
                    ref={VchatpartMainRef}
                  >
                    <div className="row mx-0 ">
                      <div className="col-12 user_chat mb-3">
                        <div className="row">
                          <MessageBox
                            position={"left"}
                            type={"text"}
                            title={mainChatV?.vendor?.full_name}
                            text={mainChatV?.concern}
                            date={mainChatV?.createdAt}
                          />
                        </div>
                        {mainChatV?.images?.map((item) => (
                          <div className="row mt-1">
                            <MessageBox
                              position={"left"}
                              type={"photo"}
                              title={mainChatV?.vendor?.full_name}
                              date={mainChatV?.createdAt}
                              data={{
                                uri: item,
                                width: 50,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {(chatV || [])?.map((item) => (
                        <div className="col-12 user_chat mb-3">
                          <div className="row">
                            <MessageBox
                              position={
                                item?.replyBy === "Admin" ? "right" : "left"
                              }
                              type={"text"}
                              title={item?.replyBy}
                              text={item?.message}
                              date={item?.createdAt}
                            />
                          </div>
                        </div>
                      ))}
                      {/* <div ref={ref}></div> */}
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <form className="message_send row mx-0 w-100" action="">
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Message...."
                      onChange={(e) => setNewMessageV(e.target.value)}
                      value={newMessageV}
                    />
                  </div>

                  <div className="form-group col-auto ps-0">
                    <button
                      className="send_btn"
                      type="send"
                      onClick={(e) => {
                        e.preventDefault();
                        sendMessageV();
                      }}
                    >
                      <i className="fab fa-telegram-plane" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade Update_modal"
          id="staticBackdrop12"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body p-4">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
                <div className="row">
                  <div className="col-12 Update_modal_content py-4">
                    <h2>Update</h2>
                    <p>Are you sure, Want to update this?</p>
                    <a className="comman_btn mx-2" href="javscript:;">
                      Yes
                    </a>
                    <a className="comman_btn mx-2 bg-red" href="javscript:;">
                      NO
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Deduction Modal */}
        <div
          class="modal fade"
          id="staticBackdrop11"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  Deduction
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  id="close2"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div>
                  <form
                    className="form-design"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span>Buyer Name:</span>
                          <div className="col">
                            <strong>
                              {mainChat?.buyer
                                ? mainChat?.buyer?.full_name
                                : ""}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span>Vendor Name:</span>
                          <div className="col">
                            <strong>
                              {mainChat?.vendor
                                ? mainChat?.vendor?.full_name
                                : ""}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span>Concern:</span>
                          <div className="col">
                            <strong>{mainChat ? mainChat?.concern : ""}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-3 col-12">
                        <label htmlFor="">Deduction Amount</label>
                        <input
                          type="number"
                          className={classNames("form-control", {
                            "is-invalid": errors.amount,
                          })}
                          name="amount"
                          {...register("amount", {
                            required: "Deduction Amount is required!",
                            maxLength: {
                              value: 4,
                              message: "*Max character Length is 4",
                            },
                          })}
                          onInput={(e) => {
                            if (e.target.value.length > 4) {
                              e.target.value = e.target.value.slice(0, 4);
                            }
                          }}
                        />
                        {errors.amount && (
                          <small className="errorText mx-1">
                            *{errors.amount?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group mb-3 col-12">
                        <label htmlFor="">Deduction Reason</label>
                        <textarea
                          style={{ minHeight: "100px" }}
                          type="number"
                          className={classNames("form-control", {
                            "is-invalid": errors.reason,
                          })}
                          name="reason"
                          {...register("reason", {
                            required: "Please Enter Reason",
                          })}
                        ></textarea>
                        {errors.reason && (
                          <small className="errorText mx-1">
                            *{errors.reason?.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="comman_btn">
                      Submit
                    </button>
                    <button type="reset" id="reset" className="comman_btn d-none">
                      reset
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default HelpSupport;
