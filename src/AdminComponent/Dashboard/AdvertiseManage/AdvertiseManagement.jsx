import React, { useState } from "react";
import Sidebar from "../Sidebar";
// import { useForm } from "react-hook-form";
import Select from "react-select";
import {
  AddAddvertise,
  AllAdvertisement,
  AllCategory,
  AllVendors,
  DeleteAddvertise,
  SearchVendor,
} from "../../httpServices/dashHttpService";
import { useEffect } from "react";
import Swal from "sweetalert2";

const AdvertiseManagement = () => {
  const [slide, setSlide] = useState("ADM");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNewVendor, setSelectedNewVendor] = useState([]);
  const [selectedNewCate, setSelectedNewCate] = useState([]);
  const [selectedCate, setSelectedCate] = useState([]);
  const [type, setType] = useState("TV");
  const [allAdds, setAllAdds] = useState([]);
  const [allAddsCate, setAllAddsCate] = useState([]);
  const [sideBar, setSideBar] = useState();
  const [options, setOptions] = useState([]);
  const [optionsCate, setOptionsCate] = useState([]);
  const [optionsNewCate, setOptionsNewCate] = useState([]);
  const [optionsNewVendors, setOptionsNewVendors] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchKey2, setSearchKey2] = useState("");
  const [searchKey3, setSearchKey3] = useState("");
  const [searchKey4, setSearchKey4] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [vendorAdds, setAddsVendor] = useState([]);
  const [categoryAdds, setAddsCategory] = useState([]);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  useEffect(() => {
    createOptionsCate();
  }, [searchKey2]);
  useEffect(() => {
    createOptionsNewCate();
  }, [searchKey4]);
  useEffect(() => {
    createOptionsVendor();
  }, [searchKey3]);

  useEffect(() => {
    GetAllAdds();
    GetAddscate();
    GetAddsNewCategory();
    GetAddsNewVendor();
    getAllCat();
    getAllVendors();
  }, []);

  const getAllVendors = async () => {
    const { data } = await AllVendors({
      status: "APPROVED",
    });
    let options = data?.results?.vendors;
    let optionList = options?.map((item, index) => ({
      value: item?._id,
      label: item?.full_name,
    }));
    optionList = optionList.filter((item) => item.label.trim() !== "");
    optionList.sort((a, b) => a.label.localeCompare(b.label));
    setOptionsNewVendors(optionList);
    setOptions(optionList);
  };
  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };

  const createOptions = async () => {
    await SearchVendor({ search: searchKey }).then((res) => {
      if (!res.error) {
        let data = res?.data.results?.vendor;
        const optionList = data?.map((item, index) => ({
          value: item?._id._id,
          label: item?._id.full_name,
        }));
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        // setOptions(optionList);
      }
    });
  };

  const createOptionsVendor = async () => {
    await SearchVendor({ search: searchKey3 }).then((res) => {
      if (!res.error) {
        let data = res?.data.results?.vendor;
        const optionList = data
          ?.filter((item) => item.status === true)
          ?.map((item, index) => ({
            value: item?._id._id,
            label: item?._id.full_name,
          }));
        console.log(optionList);
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        setOptionsNewVendors(optionList);
      }
    });
  };

  const createOptionsCate = async () => {
    await AllCategory().then((res) => {
      if (!res.error) {
        let data = res?.data.results?.categories;
        console.log(data);
        const optionList = data
          ?.filter((item) => item.status === true)
          ?.map((item, index) => ({
            value: item?._id,
            label: item?.name_en,
          }));
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        setOptionsCate(optionList);
      }
    });
  };
  const createOptionsNewCate = async () => {
    await AllCategory().then((res) => {
      if (!res.error) {
        let data = res?.data.results?.categories;
        console.log(data);
        const optionList = data
          ?.filter((item) => item.status === true)
          ?.map((item, index) => ({
            value: item?._id,
            label: item?.name_en,
          }));
        optionList.sort((a, b) => a.label.localeCompare(b.label));
        setOptionsNewCate(optionList);
      }
    });
  };

  const DeleteAdd = async (id, typ) => {
    console.log(id);
    const { data } = await DeleteAddvertise({
      type: typ,
      Id: id,
    });
    if (!data.error) {
      GetAllAdds();
      GetAddscate();
      GetAddsNewCategory();
      GetAddsNewVendor();
      Swal.fire({
        title: "Addvertisement Deleted!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };

  useEffect(() => {
    setSelectedUsers({
      usersSelected: [],
    });
    setSelectedNewVendor({
      newVendorSelected: [],
    });
    setSelectedNewCate({
      newCateSelected: [],
    });
    setSelectedCate({
      cateSelected: [],
    });
  }, [type])
  const handleChange = (selected) => {
    setSelectedUsers({
      usersSelected: selected,
    });
  };
  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };
  const handleChangeNewVendor = (selected) => {
    setSelectedNewVendor({
      newVendorSelected: selected,
    });
  };
  const handleInputChangeNewVendor = (inputValue) => {
    setSearchKey3(inputValue);
  };
  const handleChangeNewCategory = (selected) => {
    setSelectedNewCate({
      newCateSelected: selected,
    });
  };
  const handleInputChangeNewCategory = (inputValue) => {
    setSearchKey4(inputValue);
  };
  const handleChangeCate = (selected) => {
    setSelectedCate({
      cateSelected: selected,
    });
  };
  const handleInputChangeCate = (inputValue) => {
    setSearchKey2(inputValue);
  };

  const GetAllAdds = async () => {
    await AllAdvertisement({ type: "vendor" }).then((res) => {
      setAllAdds(res?.data.results.advertisements);
    });
  };
  const GetAddscate = async () => {
    await AllAdvertisement({ type: "category" }).then((res) => {
      setAllAddsCate(res?.data.results.advertisements);
    });
  };
  const GetAddsNewVendor = async () => {
    await AllAdvertisement({ type: "newVendor" }).then((res) => {
      setAddsVendor(res?.data.results.advertisements);
    });
  };
  const GetAddsNewCategory = async () => {
    await AllAdvertisement({ type: "newCategory" }).then((res) => {
      setAddsCategory(res?.data.results.advertisements);
    });
  };
  const saveAdd = async (e) => {
    e.preventDefault();
    // console.log(selectedCate?.cateSelected?.map((item) => item?.value));
    console.log(selectedUsers);
    console.log(selectedNewVendor);
    console.log(selectedCate);
    console.log(selectedNewCate.newCateSelected.length);
    console.log(type);
    if (
      (type === "TC" && selectedCate.cateSelected.length < 1) ||
      (type === "NC" && selectedNewCate.newCateSelected.length < 1)
    ) {
      Swal.fire({
        title: "Please Select Category",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      return false;
    } else if (
      (type === "TV" && selectedUsers.usersSelected.length < 1) ||
      (type === "NV" && selectedNewVendor.newVendorSelected.length < 1)
    ) {
      console.log(selectedUsers);
      console.log(selectedNewVendor);
      Swal.fire({
        title: "Please Select Vendors",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      return false;
    }
    await AddAddvertise({
      vendor:
        (type === "TV" &&
          selectedUsers?.usersSelected?.map((item) => item?.value)) ||
        (type === "NV" &&
          selectedNewVendor?.newVendorSelected?.map((item) => item?.value)),
      category:
        (type === "TC" &&
          selectedCate?.cateSelected?.map((item) => item?.value)) ||
        (type === "NC" &&
          selectedNewCate?.newCateSelected?.map((item) => item?.value)),

      type:
        (type === "TC" && "category") ||
        (type === "TV" && "vendor") ||
        (type === "NC" && "newCategory") ||
        (type === "NV" && "newVendor"),
    }).then((res) => {
      if (!res.data.error) {
        setSelectedUsers({
          usersSelected: [],
        });
        setSelectedCate({
          cateSelected: [],
        });
        setSelectedNewCate({
          newCateSelected: [],
        });
        setSelectedNewVendor({
          newVendorSelected: [],
        });
        GetAllAdds();
        GetAddscate();
        GetAddsNewCategory();
        GetAddsNewVendor();
        type === "TC" && document.getElementById("profile-tab").click();
        type === "NV" && document.getElementById("profile-tab2").click();
        type === "NC" && document.getElementById("profile-tab3").click();
        Swal.fire({
          title: "Advertise Added!",
          icon: "success",
          confirmButtonText: "Okay",
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
                      <option value="NV">New Vendor</option>
                      <option value="NC">New Category</option>
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
                      value={selectedCate?.cateSelected}
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
                      value={selectedUsers?.usersSelected}
                    />
                  </div>
                  <div className={type === "NV" ? "form-group col" : "d-none"}>
                    <label htmlFor="">Search New Vendors</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={optionsNewVendors}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChangeNewVendor}
                      onInputChange={handleInputChangeNewVendor}
                      value={selectedNewVendor?.newVendorSelected}
                    />
                  </div>
                  <div className={type === "NC" ? "form-group col" : "d-none"}>
                    <label htmlFor="">Search New Category</label>
                    <Select
                      defaultValue=""
                      isMulti
                      name="users"
                      options={optionsNewCate}
                      className="basic-multi-select z-3"
                      classNamePrefix="select"
                      onChange={handleChangeNewCategory}
                      onInputChange={handleInputChangeNewCategory}
                      value={selectedNewCate?.newCateSelected}
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
                    {/* <form className="form-design" action="">
                      <div className="form-group mb-0 position-relative icons_set">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          name="name"
                          id="name"
                          onChange={(e) => {
                            onSearch(e);
                          }}
                        />
                        <i className="far fa-search" />
                      </div>
                    </form> */}
                  </div>
                </div>
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
                          Top Vendors
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
                          Top Categories
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab2"
                          data-bs-toggle="tab"
                          data-bs-target="#profile2"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                        >
                          New Vendors
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab3"
                          data-bs-toggle="tab"
                          data-bs-target="#profile3"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                        >
                          New Categories
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
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Vendors</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {allAdds[0]?.vendor?.map((item, ind) => (
                                        <tr>
                                          <td>{ind + 1}.</td>
                                          <td>
                                            <li>
                                              {item?.full_name
                                                ? item?.full_name
                                                : "No results"}
                                            </li>
                                          </td>
                                          <td>
                                            <li>
                                              {item?.email
                                                ? item?.email
                                                : "No results"}
                                            </li>
                                          </td>
                                          <td>
                                            <a
                                              className="comman_btn2 table_viewbtn"
                                              href="javascript:;"
                                              onClick={() =>
                                                DeleteAdd(item?._id, "vendor")
                                              }
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
                      <div
                        className="tab-pane fade"
                        id="profile"
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Categories(en)</th>
                                        <th>Categories(ar)</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {allAddsCate[0]?.category?.map(
                                        (item, ind) => (
                                          <tr>
                                            <td>{ind + 1}</td>
                                            <td>
                                              <li>{item?.name_en}</li>
                                            </td>
                                            <td>
                                              <li>{item?.name_ar}</li>
                                            </td>
                                            <td>
                                              <a
                                                className="comman_btn2 table_viewbtn"
                                                onClick={() =>
                                                  DeleteAdd(
                                                    item?._id,
                                                    "category"
                                                  )
                                                }
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
                        id="profile2"
                        role="tabpanel"
                        aria-labelledby="profile-tab2"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Vendor Name(en)</th>
                                        <th>Email Address</th>
                                        <th>Vendor Id</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vendorAdds[0]?.vendor?.map(
                                        (item, ind) => (
                                          <tr>
                                            <td>{ind + 1}</td>
                                            <td>
                                              <li>{item?.full_name}</li>
                                            </td>
                                            <td>
                                              <li>{item?.email}</li>
                                            </td>
                                            <td>
                                              <li>{item?.vendorID}</li>
                                            </td>
                                            <td>
                                              <a
                                                className="comman_btn2 table_viewbtn"
                                                onClick={() =>
                                                  DeleteAdd(
                                                    item?._id,
                                                    "newVendor"
                                                  )
                                                }
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
                        id="profile3"
                        role="tabpanel"
                        aria-labelledby="profile-tab3"
                      >
                        <div className="row p-4 mx-0">
                          <div className="col-12 inner_design_comman border">
                            <div className="row">
                              <div className="col-12 comman_table_design px-0">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Categories(en)</th>
                                        <th>Categories(ar)</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {categoryAdds[0]?.category?.map(
                                        (item, ind) => (
                                          <tr>
                                            <td>{ind + 1}</td>
                                            <td>
                                              <li>{item?.name_en}</li>
                                            </td>
                                            <td>
                                              <li>{item?.name_ar}</li>
                                            </td>
                                            <td>
                                              <a
                                                className="comman_btn2 table_viewbtn"
                                                onClick={() =>
                                                  DeleteAdd(
                                                    item?._id,
                                                    "newCategory"
                                                  )
                                                }
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
