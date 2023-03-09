import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { useForm } from "react-hook-form";
import Select from "react-select";
import {
  AddAddvertise,
  AllAdvertisement,
  AllCategory,
  SearchVendor,
} from "../../httpServices/dashHttpService";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { CategoryRounded } from "@mui/icons-material";

const AdvertiseManagement = () => {
  const [slide, setSlide] = useState("ADM");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCate, setSelectedCate] = useState([]);
  const [type, setType] = useState("TV");
  const [allAdds, setAllAdds] = useState([]);
  const [sideBar, setSideBar] = useState();
  const [options, setOptions] = useState([]);
  const [optionsCate, setOptionsCate] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchKey2, setSearchKey2] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  useEffect(() => {
    createOptionsCate();
  }, [searchKey2]);

  useEffect(() => {
    GetAllAdds();
    getAllCat();
  }, []);

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };
  
  const createOptions = async () => {
    await SearchVendor({ search: searchKey }).then((res) => {
      if (!res.error) {
        let data = res?.data.results?.vendor;
        const optionList = data?.map((item, index) => ({
          value: item?._id,
          label: item?.full_name,
        }));
        setOptions(optionList);
      }
    });
  };

  const createOptionsCate = async () => {
    await AllCategory().then((res) => {
      if (!res.error) {
        let data = res?.data.results?.categories;
        console.log(data);
        const optionList = data?.map((item, index) => ({
          value: item?._id,
          label: item?.name_en,
        }));
        setOptionsCate(optionList);
      }
    });
  };

  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };

  const handleChangeCate = (selected) => {
    setSelectedCate({
      cateSelected: selected,
    });
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };
  const handleInputChangeCate = (inputValue) => {
    setSearchKey2(inputValue);
  };
  const GetAllAdds = async () => {
    await AllAdvertisement().then((res) => {
      setAllAdds(res?.data.results.advertisements);
    });
  };

  const saveAdd = async (e) => {
    e.preventDefault();
    await AddAddvertise({
      selectedUsers: selectedUsers?.usersSelected,
      subCategory: selectedCate?.usersSelected,
      userType: type === "TC" ? "category" : "vendor",
    }).then((res) => {
      if (!res.data.error) {
        Swal.fire({
          title: "Advertise Added!",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#e25829",
        });
      }
    });
  };

  const getBarClick = (val) => {
    console.log(val);
    setSideBar(val);
  };

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row advertisment-management justify-content-center">
          <div className="col-12">
            <div className="row">
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Add Advertisment</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row  justify-content-between"
                  action=""
                >
                  <div className="form-group col-md-4">
                    <label htmlFor="">Select Type</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option selected="" value="TV">
                        Top Vendors
                      </option>
                      <option value="TC">Top Categories</option>
                    </select>
                  </div>

                  <div className={type === "TC" ? "form-group col" : "d-none"}>
                    <label htmlFor="">Select Category</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={optionsCate}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChangeCate}
                      onInputChange={handleInputChangeCate}
                    />
                  </div>

                  <div className={type === "TV" ? "form-group col" : "d-none"}>
                    <label htmlFor="">Search Vendors</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={options}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChange}
                      onInputChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto mt-4">
                    <button className="comman_btn" onClick={saveAdd}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Advertisment Management</h2>
                  </div>
                  <div className="col-3">
                    <form className="form-design" action="">
                      <div className="form-group mb-0 position-relative icons_set">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          name="name"
                          id="name"
                        />
                        <i className="far fa-search" />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Advertisment</th>
                            <th>Vendor</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allAdds?.map((item, ind) => (
                            <tr>
                              <td>{ind + 1}</td>
                              <td>Top Vendor</td>
                              <td>Name</td>
                              <td>
                                <a
                                  className="comman_btn table_viewbtn"
                                  href="javascript:;"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop"
                                >
                                  View
                                </a>
                                <a
                                  className="comman_btn2 table_viewbtn"
                                  href="javascript:;"
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          ))}
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
                Advertisment Management View
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
              >
                <div className="form-group col-4">
                  <label htmlFor="">Select Vendor</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                  >
                    <option selected="">lorem</option>
                    <option value={1}>lorem</option>
                  </select>
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Select Category</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                  >
                    <option selected="">lorem</option>
                    <option value={1}>lorem</option>
                  </select>
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Select Sub Category </label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                  >
                    <option selected="">lorem</option>
                    <option value={1}>lorem</option>
                  </select>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Select Users</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                  >
                    <option selected="">2</option>
                    <option value={1}>lorem</option>
                  </select>
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Search User</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="lorem"
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiseManagement;
