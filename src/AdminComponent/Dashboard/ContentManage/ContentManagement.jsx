import React, { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  AboutUs,
  EditAbout,
  EditPrivacy,
  EditTerms,
  PrivacyPolicy,
  TermCondition,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const ContentManagement = () => {
  const [slide, setSlide] = useState("ConM");
  const [sideBar, setSideBar] = useState();
  const [about, setAbout] = useState("");
  const [aboutEdit, setAboutEdit] = useState([{}]);
  const [term, setTerm] = useState("");
  const [termEdit, setTermEdit] = useState([{}]);
  const [privacy, setPrivacy] = useState("");
  const [privacyEdit, setPrivacyEdit] = useState([{}]);

  useEffect(() => {
    getAboutUs();
    getTermConditions();
    getPrivacyPolicy();
  }, []);

  const getAboutUs = async () => {
    const { data } = await AboutUs();
    setAbout(data?.results.about[0]);
  };
  const getTermConditions = async () => {
    const { data } = await TermCondition();
    setTerm(data?.results.TandC[0]);
  };
  const getPrivacyPolicy = async () => {
    const { data } = await PrivacyPolicy();
    setPrivacy(data?.results.privacy[0]);
  };

  const handleChangeAbout = (e, key) => {
    let newFormValues = [...aboutEdit];
    newFormValues[0][key] = e.target.value;
    setAboutEdit(newFormValues);
  };
  const handleChangeTerms = (e, key) => {
    let newFormValues = [...termEdit];
    newFormValues[0][key] = e.target.value;
    setTermEdit(newFormValues);
  };
  const handleChangePrivacy = (e, key) => {
    let newFormValues = [...privacyEdit];
    newFormValues[0][key] = e.target.value;
    setPrivacyEdit(newFormValues);
  };
  const saveAboutUs = async (e) => {
    e.preventDefault();
    const { data } = await EditAbout(
      {
        description_en: aboutEdit[0]?.description_en,
        description_ar: aboutEdit[0]?.description_ar,
      },
      about?._id
    );
    if (!data.error) {
      getAboutUs();
      Swal.fire({
        title: "About Us Modified!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close1").click();
      document.getElementById("reset1").click();
      document.getElementById("close2")?.click();
      document.getElementById("reset2")?.click();
    }
  };
  console.log(aboutEdit);

  const saveTerm = async (e) => {
    e.preventDefault();
    const { data } = await EditTerms(
      {
        description_en: termEdit[0]?.description_en,
        description_ar: termEdit[0]?.description_ar,
      },
      term?._id
    );
    if (!data.error) {
      getTermConditions();
      Swal.fire({
        title: "Terms and Conditions Modified!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close3").click();
      document.getElementById("reset3").click();
      document.getElementById("close4").click();
      document.getElementById("reset4").click();
    }
  };

  const savePrivacy = async (e) => {
    e.preventDefault();
    const { data } = await EditPrivacy(
      {
        description_en: privacyEdit[0]?.description_en,
        description_ar: privacyEdit[0]?.description_ar,
      },
      privacy?._id
    );
    if (!data.error) {
      getPrivacyPolicy();
      Swal.fire({
        title: "Privacy Policies Modified!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close5").click();
      document.getElementById("reset5").click();
      document.getElementById("close6").click();
      document.getElementById("reset6").click();
    }
  };
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />

      <>
        <div className="admin_panel_data height_adjust">
          <div className="row content-management justify-content-center">
            <div className="col-12 design_outter_comman recent_orders shadow">
              <div className="row">
                <div className="col-12 px-0">
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-profile1-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile1"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile1"
                        aria-selected="false"
                      >
                        About Us
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile2-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile2"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile2"
                        aria-selected="false"
                      >
                        Terms &amp; Conditions
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile3-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile3"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile3"
                        aria-selected="false"
                      >
                        Privacy Policy
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="nav-profile1"
                      role="tabpanel"
                      aria-labelledby="nav-profile1-tab"
                    >
                      <div className="row py-5 px-4 mx-0">
                        <div className="col-6">
                          <div className="row content_management_box">
                            <h2>ABOUT US</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop"
                              className="edit_content_btn"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{about?.description_en}</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="row content_management_box text-end">
                            <h2> نبذة عنا</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop4"
                              className="edit_content_btn comman_btn"
                              href="javscript:;"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{about?.description_ar}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-profile2"
                      role="tabpanel"
                      aria-labelledby="nav-profile2-tab"
                    >
                      <div className="row py-5 px-4 mx-0">
                        <div className="col-6">
                          <div className="row content_management_box">
                            <h2>{term?.title}</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop1"
                              className="edit_content_btn comman_btn"
                              href="javscript:;"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{term?.description_en}</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="row content_management_box text-end">
                            <h2>{term?.title}</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop5"
                              className="edit_content_btn comman_btn"
                              href="javscript:;"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{term?.description_ar}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-profile3"
                      role="tabpanel"
                      aria-labelledby="nav-profile3-tab"
                    >
                      <div className="row py-5 px-4 mx-0">
                        <div className="col-6">
                          <div className="row content_management_box">
                            <h2>{privacy?.title}</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop2"
                              className="edit_content_btn comman_btn"
                              href="javscript:;"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{privacy?.description_en}</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="row content_management_box text-end">
                            <h2>{privacy?.title}</h2>
                            <a
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop6"
                              className="edit_content_btn comman_btn"
                              href="javscript:;"
                            >
                              <i className="far fa-edit me-2" />
                              Edit
                            </a>
                            <p>{privacy?.description_ar}</p>
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

        {/* Modal  about */}
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
                  Edit
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset1").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="ABOUT US"
                        name="title"
                        disabled
                        // onChange={(e) => handleChangeAbout(e, "title")}
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={about?.description_en}
                        name="description_en"
                        onChange={(e) => handleChangeAbout(e, "description_en")}
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={saveAboutUs}>
                        Save
                      </button>
                      <button
                        className="comman_btn2 d-none"
                        id="reset1"
                        onClick={(e) => e.preventDefault()}
                      >
                        reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade comman_modal"
          id="staticBackdrop4"
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
                  id="close2"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset2").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="ABOUT US"
                        name="title"
                        disabled
                        // onChange={(e) => handleChangeAbout(e, "title")}
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={about?.description_ar}
                        name="description_ar"
                        onChange={(e) => handleChangeAbout(e, "description_ar")}
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={saveAboutUs}>
                        Save
                      </button>
                      <button
                        className="comman_btn2 d-none"
                        onClick={(e) => e.preventDefault()}
                        id="reset2"
                      >
                        reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal  about end */}

        {/* Modal terms n cond*/}
        <div
          className="modal fade comman_modal"
          id="staticBackdrop1"
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
                  id="close3"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset3").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Terms & Conditions"
                        disabled
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={term?.description_en}
                        name="description_en"
                        onChange={(e) => handleChangeTerms(e, "description_en")}
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={saveTerm}>
                        Save
                      </button>
                      <button
                        className="comman_btn2 d-none"
                        type="reset"
                        id="reset3"
                        onClick={(e) => e.preventDefault()}
                      >
                        reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade comman_modal"
          id="staticBackdrop5"
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
                  id="close4"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset4").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="معلومات عنا"
                        disabled
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={term?.description_ar}
                        name="description_ar"
                        onChange={(e) => handleChangeTerms(e, "description_ar")}
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={saveTerm}>
                        Save
                      </button>
                    </div>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="reset4"
                    >
                      reset
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal  privacy*/}
        <div
          className="modal fade comman_modal"
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
                  Edit
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close5"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset5").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Privacy Policy"
                        disabled
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={privacy?.description_en}
                        name="description_en"
                        onChange={(e) =>
                          handleChangePrivacy(e, "description_en")
                        }
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={savePrivacy}>
                        Save
                      </button>
                      <button
                        className="comman_btn2 d-none"
                        type="reset"
                        id="reset5"
                      >
                        reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}

        <div
          className="modal fade comman_modal"
          id="staticBackdrop6"
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
                  id="close6"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("reset6").click();
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content_box">
                  <form className="form-design p-3" action="#">
                    <div className="form-group col-12">
                      <label htmlFor="">Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="معلومات عنا"
                        disabled
                      />
                    </div>
                    <div className="form-group col-12">
                      <label htmlFor="">Content</label>
                      <textarea
                        className="form-control"
                        id=""
                        style={{ height: 150 }}
                        defaultValue={privacy?.description_ar}
                        name="description_ar"
                        onChange={(e) =>
                          handleChangePrivacy(e, "description_ar")
                        }
                      />
                    </div>
                    <div className="form-group mb-0 col-auto">
                      <button className="comman_btn2" onClick={savePrivacy}>
                        Save
                      </button>
                      <button
                        className="comman_btn2 d-none"
                        type="reset"
                        id="reset6"
                      >
                        reset
                      </button>
                    </div>
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

export default ContentManagement;
