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

const VendorCms = () => {
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
    const buyerData = data?.results?.about?.find(
      (item) => item.type === "vendor"
    );
    console.log(buyerData);
    setAbout(buyerData);
  };
  const getTermConditions = async () => {
    const { data } = await TermCondition();
    const buyerData = data?.results?.TandC?.find(
      (item) => item.type === "vendor"
    );
    // console.log(buyerData)
    setTerm(buyerData);
  };
  const getPrivacyPolicy = async () => {
    const { data } = await PrivacyPolicy();
    const buyerData = data?.results?.privacy?.find(
      (item) => item.type === "vendor"
    );
    // console.log(buyerData)
    setPrivacy(buyerData);
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
    if (key === "description_ar") {
      const arabicRegex = /^[\u0600-\u06FF\s]+$/;

      if (!arabicRegex.test(e.target.value)) {
        e.preventDefault();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Please enter only Arabic characters for the description!",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
        });
        return false;
      } else {
        let newFormValues = [...privacyEdit];
        newFormValues[0][key] = e.target.value;
        setPrivacyEdit(newFormValues);
      }
    } else {
      let newFormValues = [...privacyEdit];
      newFormValues[0][key] = e.target.value;
      setPrivacyEdit(newFormValues);
    }
  };

  const saveAboutUs = async (e, language) => {
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
      const successMessage =
        language === "ar" ? "نبذة عنا معدلة " : "About Us Modified";
      const confirmBtn = language === "ar" ? "نعم" : "Ok";
      Swal.fire({
        title: successMessage,
        icon: "success",
        confirmButtonText: confirmBtn,
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close10").click();
      document.getElementById("reset10").click();
      document.getElementById("close12")?.click();
      document.getElementById("reset12")?.click();
    }
  };
  //   console.log(aboutEdit);

  const saveTerm = async (e, language) => {
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
      const successMessage =
        language === "ar"
          ? "تم تعديل الشروط والأحكام"
          : "Terms and Conditions Modified";
      const confirmBtn = language === "ar" ? "نعم" : "Ok";
      Swal.fire({
        title: successMessage,
        icon: "success",
        confirmButtonText: confirmBtn,
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close13").click();
      document.getElementById("reset13").click();
      document.getElementById("close14").click();
      document.getElementById("reset14").click();
    }
  };

  const savePrivacy = async (e, language) => {
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
      const successMessage =
        language == "ar"
          ? "تم تعديل سياسات الخصوصية"
          : "Privacy Policies Modified";
      const confirmBtn = language === "ar" ? "نعم" : "Ok";
      Swal.fire({
        title: successMessage,
        icon: "success",
        confirmButtonText: confirmBtn,
        confirmButtonColor: "#e25829",
      });
      document.getElementById("close15").click();
      document.getElementById("reset15").click();
      document.getElementById("close16").click();
      document.getElementById("reset16").click();
    }
  };
  const getBarClick = (val) => {
    // console.log(val);
    setSideBar(val);
  };
  return (
    <>
      <div className="col-12 px-0">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-profile4-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile4"
              type="button"
              role="tab"
              aria-controls="nav-profile4"
              aria-selected="false"
            >
              About Us
            </button>
            <button
              className="nav-link"
              id="nav-profile5-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile5"
              type="button"
              role="tab"
              aria-controls="nav-profile5"
              aria-selected="false"
            >
              Terms &amp; Conditions
            </button>
            <button
              className="nav-link"
              id="nav-profile6-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile6"
              type="button"
              role="tab"
              aria-controls="nav-profile6"
              aria-selected="false"
            >
              Privacy Policy
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-profile4"
            role="tabpanel"
            aria-labelledby="nav-profile4-tab"
          >
            <div className="row py-5 px-4 mx-0">
              <div className="col-6">
                <div className="row content_management_box">
                  <h2>ABOUT US</h2>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop10"
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
                    data-bs-target="#staticBackdrop11"
                    className="edit_content_btn comman_btn"
                    href="javscript:;"
                    dir="rtl"
                  >
                    <i className="far fa-edit ms-2" />
                    يحرر
                  </a>
                  <p dir="rtl">{about?.description_ar}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile5"
            role="tabpanel"
            aria-labelledby="nav-profile5-tab"
          >
            <div className="row py-5 px-4 mx-0">
              <div className="col-6">
                <div className="row content_management_box">
                  <h2>{term?.title}</h2>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop12"
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
                  {/* <h2>{term?.title}</h2> */}
                  <h2>تي إن سي</h2>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop13"
                    className="edit_content_btn comman_btn"
                    href="javscript:;"
                    dir="rtl"
                  >
                    <i className="far fa-edit ms-2" />
                    يحرر
                  </a>
                  <p dir="rtl">{term?.description_ar}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile6"
            role="tabpanel"
            aria-labelledby="nav-profile6-tab"
          >
            <div className="row py-5 px-4 mx-0">
              <div className="col-6">
                <div className="row content_management_box">
                  <h2>{privacy?.title}</h2>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop14"
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
                  {/* <h2>{privacy?.title}</h2> */}
                  <h2>سياسة الخصوصية</h2>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop15"
                    className="edit_content_btn comman_btn"
                    href="javscript:;"
                    dir="rtl"
                  >
                    <i className="far fa-edit ms-2" />
                    يحرر
                  </a>
                  <p dir="rtl">{privacy?.description_ar}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal  about */}
      <div
        className="modal fade comman_modal"
        id="staticBackdrop10"
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
                id="close10"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset10").click();
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
                    <button
                      className="comman_btn2"
                      onClick={(e) => saveAboutUs(e, "en")}
                    >
                      Save
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      id="reset10"
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
        id="staticBackdrop11"
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
                يحرر
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close12"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset12").click();
                }}
              />
            </div>
            <div className="modal-body">
              <div className="content_box">
                <form className="form-design p-3" action="#">
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      عنوان
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      className="form-control"
                      defaultValue="معلومات عنا"
                      name="title"
                      disabled
                      // onChange={(e) => handleChangeAbout(e, "title")}
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      محتوى
                    </label>
                    <textarea
                      className="form-control"
                      id=""
                      dir="rtl"
                      style={{ height: 150 }}
                      defaultValue={about?.description_ar}
                      name="description_ar"
                      onChange={(e) => handleChangeAbout(e, "description_ar")}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button
                      className="comman_btn2"
                      onClick={(e) => saveAboutUs(e, "ar")}
                    >
                      يحفظ
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      onClick={(e) => e.preventDefault()}
                      id="reset12"
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
        id="staticBackdrop12"
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
                id="close13"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset13").click();
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
                    <button
                      className="comman_btn2"
                      onClick={(e) => saveTerm(e, "en")}
                    >
                      Save
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="reset13"
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
        id="staticBackdrop13"
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
                يحرر
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close14"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset14").click();
                }}
              />
            </div>
            <div className="modal-body">
              <div className="content_box">
                <form className="form-design p-3" action="#">
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      عنوان
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      className="form-control"
                      defaultValue="تي إن سي"
                      disabled
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      محتوى
                    </label>
                    <textarea
                      className="form-control"
                      id=""
                      dir="rtl"
                      style={{ height: 150 }}
                      defaultValue={term?.description_ar}
                      name="description_ar"
                      onChange={(e) => handleChangeTerms(e, "description_ar")}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button
                      className="comman_btn2"
                      onClick={(e) => saveTerm(e, "ar")}
                    >
                      يحفظ
                    </button>
                  </div>
                  <button
                    className="comman_btn2 d-none"
                    type="reset"
                    id="reset14"
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
        id="staticBackdrop14"
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
                id="close15"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset15").click();
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
                      onChange={(e) => handleChangePrivacy(e, "description_en")}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button
                      className="comman_btn2"
                      onClick={(e) => savePrivacy(e, "en")}
                    >
                      Save
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="reset15"
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
        id="staticBackdrop15"
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
                يحرر
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close16"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("reset16").click();
                }}
              />
            </div>
            <div className="modal-body">
              <div className="content_box">
                <form className="form-design p-3" action="#">
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      عنوان
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      className="form-control"
                      defaultValue="خصوصية"
                      disabled
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="text-end" dir="rtl" htmlFor="">
                      محتوى
                    </label>
                    <textarea
                      className="form-control"
                      id=""
                      dir="rtl"
                      style={{ height: 150 }}
                      defaultValue={privacy?.description_ar}
                      name="description_ar"
                      onChange={(e) => handleChangePrivacy(e, "description_ar")}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button
                      dir="rtl"
                      lang="ar"
                      className="comman_btn2"
                      onClick={(e) => savePrivacy(e, "ar")}
                    >
                      يحفظ
                    </button>
                    <button
                      className="comman_btn2 d-none"
                      type="reset"
                      id="reset16"
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
  );
};

export default VendorCms;
