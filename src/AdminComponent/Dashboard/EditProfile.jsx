import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/style.css";
import { updateProfile } from "../httpServices/dashHttpService";
const EditProfile = () => {
  const [slide, setSlide] = useState("Dash");
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  let Admin = JSON.parse(localStorage.getItem("token-admin-data"));
  console.log(Admin);

  const [sideBar, setSideBar] = useState();
  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };
  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", name);
    formData.append("image", files?.image);
    const { data } = await updateProfile(formData);
  };
  document
    .getElementById("profileImage")
    ?.addEventListener("change", function () {
      if (this.files[0]) {
        var picture = new FileReader();
        picture.readAsDataURL(this.files[0]);
        picture.addEventListener("load", function (event) {
          document
            .getElementById("profile")
            .setAttribute("src", event.target.result);
        });
      }
    });

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />

      <div className="admin_panel_data height_adjust">
        <div className="row">
          <div className="col-12 editprofile design_outter_comman shadow">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2>Edit Profile</h2>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form className="row form-design justify-content-center position-relative mx-0 p-4">
                  <div className="form-group col-auto">
                    <div className="account_profile position-relative">
                      <div className="circle">
                        <img
                          className="profile-pic"
                          id="profile"
                          src={
                            Admin?.image
                              ? Admin?.image
                              : require("../../assets/img/Nupload.jpg")
                          }
                        />
                      </div>

                      <div className="p-image">
                        <i className="upload-button fas fa-camera" />
                        <input
                          className="profile"
                          type="file"
                          name="image"
                          id="profileImage"
                          accept="image/*"
                          onChange={(e) => onFileSelection(e, "image")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-12">
                    <label htmlFor="">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={Admin?.name}
                      name="name"
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-12 text-center">
                    <a
                      className="comman_btn"
                      onClick={saveProfile}
                      href="javscript:;"
                    >
                      Save
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
