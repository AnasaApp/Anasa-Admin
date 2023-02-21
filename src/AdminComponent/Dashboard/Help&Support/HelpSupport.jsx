import React, { useState } from "react";
import { useEffect } from "react";
import {
  getViewBuyerSupport,
  SendMessageBuy,
  SupportList,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const HelpSupport = () => {
  const [slide, setSlide] = useState("HS");
  const [sideBar, setSideBar] = useState();
  const [buyerSupport, setBuyerSupport] = useState([]);
  const [vendorSupport, setVendorSupport] = useState([]);
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [buyId, setBuyId] = useState();

  useEffect(() => {
    getBuyerSupport();
    getVendorSupport();
  }, []);
  const ViewBuyerSupport = async (id) => {
    setBuyId(id);
    const { data } = await getViewBuyerSupport(id);
    setChat(data?.results.message?.reply);
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
    setNewMessage("");
    if (!data.error) {
      let eld = document.getElementById("chat2");
      eld.scrollTop = eld.scrollHeight;
    }
  };

  console.log(chat);
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
                            <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action=""
                            >
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
                            </form>
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
                                                  type="checkbox"
                                                  name="checkv1"
                                                  id="checkv1"
                                                  className="d-none"
                                                />
                                                <label
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#staticBackdrop12"
                                                  htmlFor="checkv1"
                                                />
                                              </div>
                                            </td>
                                            <td>
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target="#staticBackdrop"
                                                className="comman_btn table_viewbtn"
                                                onClick={() =>
                                                  ViewBuyerSupport(item?._id)
                                                }
                                              >
                                                View
                                              </a>
                                              <a
                                                className="comman_btn2 table_viewbtn bg-red"
                                                href="javscript:;"
                                              >
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
                            <form
                              className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                              action=""
                            >
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
                            </form>
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
                                      <tr>
                                        <td>1</td>
                                        <td>Ajay Sharma</td>
                                        <td>xyz@gmail.com</td>
                                        <td>Lorem ipsum</td>
                                        <td>Lorem ipsum dolor sit amet</td>
                                        <td>March 28,2022</td>
                                        <td>
                                          <div className="check_toggle">
                                            <input
                                              type="checkbox"
                                              name="checkv1"
                                              id="checkv1"
                                              className="d-none"
                                            />
                                            <label
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop12"
                                              htmlFor="checkv1"
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            className="comman_btn table_viewbtn"
                                            href="javscript:;"
                                          >
                                            View
                                          </a>
                                          <a
                                            className="comman_btn2 table_viewbtn bg-red"
                                            href="javscript:;"
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td>Ajay Sharma</td>
                                        <td>xyz@gmail.com</td>
                                        <td>Lorem ipsum</td>
                                        <td>Lorem ipsum dolor sit amet</td>
                                        <td>March 28,2022</td>
                                        <td>
                                          <div className="check_toggle">
                                            <input
                                              type="checkbox"
                                              name="checkv2"
                                              id="checkv2"
                                              className="d-none"
                                            />
                                            <label
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop12"
                                              htmlFor="checkv2"
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            className="comman_btn table_viewbtn"
                                            href="javscript:;"
                                          >
                                            View
                                          </a>
                                          <a
                                            className="comman_btn2 table_viewbtn bg-red"
                                            href="javscript:;"
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td>Ajay Sharma</td>
                                        <td>xyz@gmail.com</td>
                                        <td>Lorem ipsum</td>
                                        <td>Lorem ipsum dolor sit amet</td>
                                        <td>March 28,2022</td>
                                        <td>
                                          <div className="check_toggle">
                                            <input
                                              type="checkbox"
                                              name="checkv3"
                                              id="checkv3"
                                              className="d-none"
                                            />
                                            <label
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop12"
                                              htmlFor="checkv3"
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            className="comman_btn table_viewbtn"
                                            href="javscript:;"
                                          >
                                            View
                                          </a>
                                          <a
                                            className="comman_btn2 table_viewbtn bg-red"
                                            href="javscript:;"
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td>Ajay Sharma</td>
                                        <td>xyz@gmail.com</td>
                                        <td>Lorem ipsum</td>
                                        <td>Lorem ipsum dolor sit amet</td>
                                        <td>March 28,2022</td>
                                        <td>
                                          <div className="check_toggle">
                                            <input
                                              type="checkbox"
                                              name="checkv4"
                                              id="checkv4"
                                              className="d-none"
                                            />
                                            <label
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop12"
                                              htmlFor="checkv4"
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            className="comman_btn table_viewbtn"
                                            href="javscript:;"
                                          >
                                            View
                                          </a>
                                          <a
                                            className="comman_btn2 table_viewbtn bg-red"
                                            href="javscript:;"
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>5</td>
                                        <td>Ajay Sharma</td>
                                        <td>xyz@gmail.com</td>
                                        <td>Lorem ipsum</td>
                                        <td>Lorem ipsum dolor sit amet</td>
                                        <td>March 28,2022</td>
                                        <td>
                                          <div className="check_toggle">
                                            <input
                                              type="checkbox"
                                              name="checkv5"
                                              id="checkv5"
                                              className="d-none"
                                            />
                                            <label
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop12"
                                              htmlFor="checkv5"
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            className="comman_btn table_viewbtn"
                                            href="javscript:;"
                                          >
                                            View
                                          </a>
                                          <a
                                            className="comman_btn2 table_viewbtn bg-red"
                                            href="javscript:;"
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
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
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Chat
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
                    {(chat || [])?.map((item) => (
                      <div className="col-12 user_chat mb-3">
                        <div className="row">
                          <div className="col text-end">
                            <div className="user_chat_box">{item?.message}</div>
                            <span className="time_chat">Jan 14th, 7:19 pm</span>
                          </div>
                        </div>
                        <div className="col-12 admin_chat mb-3">
                          <div className="row">
                            <div className="col text-start">
                              <div className="admin_chat_box">
                                {item?.replyBy}
                              </div>
                              <span className="time_chat">
                                Jan 14th, 7:20 pm
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                        let el = document.getElementById("chat");
                        el.scrollTop = el.scrollHeight;
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
      </>
    </div>
  );
};

export default HelpSupport;
