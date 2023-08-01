import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  changeBuyerTicketStatus,
  getViewBuyerSupport,
  getViewVendorSupport,
  SendMessageBuy,
  SupportList,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";
import { MessageBox } from "react-chat-elements";

const HelpSupport = () => {
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
  const ref = useRef(null);
  useEffect(() => {
    getBuyerSupport();
    getVendorSupport();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const ViewBuyerSupport = async (id, status) => {
    if (status) {
      setBuyId(id);
      const { data } = await getViewBuyerSupport(id);
      setChat(data?.results.message?.reply);
      setMainChat(data?.results.message);
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

  const VieWVendorSupport = async (id,status) => {
    setVenId(id);
    if (status) {
    setVenId(id);
      const { data } = await getViewVendorSupport(id);
        setChatV(data?.results.message?.reply);
      setMainChatV(data?.results.message);
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

  const getBuyerSupport = async () => {
    const { data } = await SupportList({ page: 1, type: "Buyer" });
    setBuyerSupport(data.results);
  };

  const getVendorSupport = async () => {
    const { data } = await SupportList({ page: 1, type: "Vendor" });
    setVendorSupport(data.results);
  };

  const handleMessage = (e) => {
    let text = e.target.value;
    console.log(text);
    setNewMessage(text);
  };

  const sendMessage = async () => {
    const { data } = await SendMessageBuy({ message: newMessage }, buyId);
    let msg = data?.results?.reply?.reply?.slice(-1);
    setChat((chat) => [...chat, msg[0]]);
    setNewMessage();
    scrollToBottom();
  };
  const sendMessageV = async () => {
    const { data } = await SendMessageBuy({ message: newMessageV },VenId);
    let msg = data?.results?.reply?.reply?.slice(-1);
    setChatV((chatV) => [...chatV, msg[0]]);
    setNewMessageV();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  console.log(chat);

  const TicketStatus = async (id) => {
    const { data } = await changeBuyerTicketStatus(id);
    if (!data?.error) {
      Swal.fire({
        title: "Ticket Status Changed!",
        text: data?.message,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
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
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row">
                  <div className="col-12 px-0">
                    <ul
                      className="nav nav-tabs comman_tabs"
                      id="myTab"
                      role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#home"
                          type="button"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true">
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
                          aria-selected="false">
                          Vendor
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab">
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
                                                  }}>
                                                  View
                                                </a>
                                                <a
                                                  className="comman_btn2 table_viewbtn bg-red"
                                                  href="javscript:;">
                                                  Delete
                                                </a>
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
                        aria-labelledby="profile-tab">
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
                                                  data-bs-target="#staticBackdrop2"
                                                  className="comman_btn table_viewbtn"
                                                  onClick={() =>
                                                    VieWVendorSupport(item?._id,item?.status)
                                                  }>
                                                  View
                                                </a>
                                                <a
                                                  className="comman_btn2 table_viewbtn bg-red"
                                                  href="javscript:;">
                                                  Delete
                                                </a>
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
        !-- Modal --&gt;
        <div
          className="modal fade reply_modal"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
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

              <div className="modal-body py-4 " id="chat">
                <div className="chatpart_main " id="chat2">
                  <div className="row mx-0 ">
                    <div className="col-12 user_chat mb-3">
                      <div className="row">
                        <MessageBox
                          position={"right"}
                          type={"text"}
                          title={mainChat?.buyer?.full_name}
                          
                          text={mainChat?.concern}
                          date={mainChat?.createdAt}
                        />
                      </div>
                      {mainChat?.images?.map((item) => (
                        <div className="row mt-1">
                          <MessageBox
                            position={"right"}
                            type={"photo"}
                          title={mainChat?.buyer?.full_name}
                            
                            date={mainChat?.createdAt}
                            data={{
                              uri: item,
                              width:50
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
                              item?.replyBy === "Buyer" ? "right" : "left"
                            }
                            type={"text"}
                            title={item?.replyBy}
                            text={item?.message}
                            date={item?.createdAt}
                          />
                        </div>
                      </div>
                    ))}
                    <div ref={ref}></div>
                  </div>
                </div>
              </div>



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
                      }}>
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
          aria-hidden="true">
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

              <div className="modal-body py-4 " id="chat">
                <div className="chatpart_main " id="chat2">
                  <div className="row mx-0 ">
                    <div className="col-12 user_chat mb-3">
                      <div className="row">
                        <MessageBox
                          position={"right"}
                          type={"text"}
                          title={mainChatV?.vendor?.full_name}
                          text={mainChatV?.concern}
                          date={mainChatV?.createdAt}
                        />
                      </div>
                      {mainChatV?.images?.map((item) => (
                        <div className="row mt-1">
                          <MessageBox
                            position={"right"}
                            type={"photo"}
                            title={mainChatV?.vendor?.full_name}
                          
                            date={mainChatV?.createdAt}
                            data={{
                              uri: item,
                              width:50
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
                              item?.replyBy === "Buyer" ? "right" : "left"
                            }
                            type={"text"}
                            title={item?.replyBy}
                            text={item?.message}
                            date={item?.createdAt}
                          />
                        </div>
                      </div>
                    ))}
                    <div ref={ref}></div>
                  </div>
                </div>
              </div>



              <div className="modal-footer">
                <form className="message_send row mx-0 w-100" action="">
                  <div className="form-group col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Message...."
                      onChange={(e)=>setNewMessageV(e.target.value)}
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
                      }}>
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
          aria-hidden="true">
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
      </>
    </div>
  );
};

export default HelpSupport;
