import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  addCommission,
  AllCategory,
  AllCommision,
  EditCommission,
  getSubCategory,
  getViewCommission,
} from "../../httpServices/dashHttpService";
import Sidebar from "../Sidebar";

const CommissionManagement = () => {
  const [slide, setSlide] = useState("ComM");
  const [sideBar, setSideBar] = useState();
  const [allCategories, setAllCategories] = useState();
  const [subCategory, setSubCategory] = useState();
  const [allCommissions, setAllCommissions] = useState([]);
  const [commission, setCommission] = useState([]);
  const [Id, setID] = useState();
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    commission: "",
  });
  const [formEditData, setFormEditData] = useState({
    category: "",
    subCategory: "",
    commission: "",
  });

  useEffect(() => {
    getAllCat();
    getCommissions();
  }, []);

  const getAllCat = async () => {
    const { data } = await AllCategory();
    setAllCategories(data?.results?.categories);
  };
  const getCommissions = async () => {
    const { data } = await AllCommision();
    setAllCommissions(data?.results?.commissions);
  };
  const subCategories = async (id) => {
    const { data } = await getSubCategory({ categoryId: id });
    setSubCategory(data?.results?.subCategories);
    let newData = { ...formData };
    newData.category = id;
    setFormData(newData);
  };
  console.log(formData);

  const viewCommission = async (id) => {
    setID(id);
    const { data } = await getViewCommission(id);
    setCommission(data?.results?.commission);
  };

  const EditSubCategories = async (id) => {
    const { data } = await getSubCategory({ categoryId: id });
    setSubCategory(data?.results?.subCategories);
    let newData = { ...formEditData };
    newData.category = id;
    setFormEditData(newData);
  };

  const AddCommision = async (e) => {
    e.preventDefault();

    const { data } = await addCommission({
      category: formData?.category,
      subCategory: formData?.subCategory,
      commissionPrice: formData?.commission,
    });
    if (!data.error) {
      getCommissions();
      setFormData(null);
      document.getElementById("Reset").click();
      Swal.fire({
        title: "New Commission Added!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const saveCommission = async (e) => {
    e.preventDefault();

    const { data } = await EditCommission(
      {
        category: formEditData?.category,
        subCategory: formEditData?.subCategory,
        commissionPrice: formEditData?.commission,
      },
      Id
    );
    if (!data.error) {
      getCommissions();
      document.getElementById("ResetEdit").click();
      Swal.fire({
        title: "Commission Modified!",
        icon: "success",
        confirmButtonText: "Ok",
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
            <div className="row">
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Add Commission</h2>
                  </div>
                </div>
                <form
                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                  action=""
                >
                  <div className="form-group col mb-0">
                    <label htmlFor="">Category</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => subCategories(e.target.value)}
                    >
                      <option selected="">Select Category</option>
                      {allCategories?.map((item) => (
                        <option value={item?._id}>{item?.name_en}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col mb-0">
                    <label htmlFor="">Sub Category</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        let newData = { ...formData };
                        newData.subCategory = e.target.value;
                        setFormData(newData);
                      }}
                    >
                      <option selected="">Select Sub Category</option>
                      {subCategory?.map((item) => (
                        <option value={item?._id}>{item?.name_en}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-0 col">
                    <label htmlFor="">Add Commission</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        let newData = { ...formData };
                        newData.commission = e.target.value;
                        setFormData(newData);
                      }}
                    />
                  </div>
                  <div className="form-group mb-0 col-auto">
                    <button className="comman_btn" onClick={AddCommision}>
                      Add
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="Reset"
                    >
                      reset
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Commission</h2>
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
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Commission</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allCommissions?.map((item, index) => (
                            <tr>
                              <td>{index + 1}.</td>
                              <td>{item?.category?.name_en}</td>
                              <td>{item?.subCategory?.name_en}</td>
                              <td>{item?.commissionPrice}</td>
                              <td>
                                <a
                                  className="comman_btn table_viewbtn"
                                  href="javascript:;"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop"
                                  onClick={() => viewCommission(item?._id)}
                                >
                                  View
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
                View Commission
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeM"
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
              >
                <div className="form-group col-4">
                  <label htmlFor="">Category</label>
                  <select
                    className="form-select form-control"
                    onChange={(e) => EditSubCategories(e.target.value)}
                    aria-label="Default select example"
                  >
                    <option selected="" value={commission?.category?._id}>
                      {commission?.category?.name_en}
                    </option>
                    {allCategories?.map((item) => (
                      <option value={item?._id}>{item?.name_en}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-4">
                  <label htmlFor="">Sub Category</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    onChange={(e) => {
                      let newData = { ...formEditData };
                      newData.subCategory = e.target.value;
                      setFormEditData(newData);
                    }}
                  >
                    <option selected="" value={commission?.subCategory?._id}>
                      {commission?.subCategory?.name_en}
                    </option>
                    {subCategory?.map((item) => (
                      <option value={item?._id}>{item?.name_en}</option>
                    ))}
                  </select>
                </div>
                <div
                  className="form-group col-4"
                  key={commission?.commissionPrice}
                >
                  <label htmlFor="">Add Commission</label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={
                      commission?.commissionPrice
                        ? commission?.commissionPrice
                        : ""
                    }
                    onChange={(e) => {
                      let newData = { ...formEditData };
                      newData.commission = e.target.value;
                      setFormEditData(newData);
                    }}
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <button className="comman_btn" onClick={saveCommission}>
                    Save
                  </button>
                  <button
                    className="comman_btn d-none"
                    type="reset"
                    id="ResetEdit"
                    onClick={() => {
                      document.getElementById("closeM").click();
                      setFormEditData({ commission: "" });
                    }}
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
  );
};

export default CommissionManagement;
