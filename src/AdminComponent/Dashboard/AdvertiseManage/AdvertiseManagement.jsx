import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../Sidebar";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  AddAddvertise,
  AllAdvertisement,
  AllCategory,
  AllVendors,
  DeleteAddvertise,
  getServices,
} from "../../httpServices/dashHttpService";
import moment from "moment/moment";

const AdvertiseManagement = () => {
  const [slide] = useState("ADM");
  const [type, setType] = useState("TV");
  const [sideBar, setSideBar] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchKey2, setSearchKey2] = useState("");
  const [searchKey3, setSearchKey3] = useState("");
  const [searchKey4, setSearchKey4] = useState("");
  const [searchKey5, setSearchKey5] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNewVendor, setSelectedNewVendor] = useState([]);
  const [selectedNewCate, setSelectedNewCate] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCate, setSelectedCate] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsCate, setOptionsCate] = useState([]);
  const [optionsNewCate, setOptionsNewCate] = useState([]);
  const [optionsServices, setOptionsServices] = useState([]);
  const [optionsNewVendors, setOptionsNewVendors] = useState([]);
  const [allAdds, setAllAdds] = useState([]);
  const [allAddsCate, setAllAddsCate] = useState([]);
  const [vendorAdds, setAddsVendor] = useState([]);
  const [categoryAdds, setAddsCategory] = useState([]);
  const [serviceAdds, setServiceAdds] = useState([]);
  const [activeTab, setActiveTab] = useState("topVendors");

  const tabs = [
    { id: "topVendors", label: "Top Vendors", type: "vendor" },
    { id: "topCategories", label: "Top Categories", type: "category" },
    { id: "newVendors", label: "New Vendors", type: "newVendor" },
    { id: "newCategories", label: "New Categories", type: "newCategory" },
    {
      id: "recommendations",
      label: "Anasa Recommends",
      type: "Recommendation",
    },
  ];

  const fetchInitialOptions = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch vendors
      const vendorsRes = await AllVendors({ status: "APPROVED" });
      const vendorOptions = vendorsRes.data?.results?.vendors
        ?.map((item) => ({
          value: item?._id,
          label: item?.full_name || "Unnamed Vendor",
        }))
        .filter((item) => item.label.trim() !== "")
        .sort((a, b) => a.label.localeCompare(b.label));

      setOptions(vendorOptions);
      setOptionsNewVendors(vendorOptions);

      // Fetch categories
      const categoriesRes = await AllCategory();
      const categoryOptions = categoriesRes.data?.results?.categories
        ?.filter((item) => item.status)
        ?.map((item) => ({
          value: item?._id,
          label: item?.name_en,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      setOptionsCate(categoryOptions);
      setOptionsNewCate([...categoryOptions]);

      // Fetch services
      const servicesRes = await getServices();
      setOptionsServices(
        servicesRes.data?.results?.services
          ?.filter((item) => item.status)
          ?.map((item) => ({
            value: item?._id,
            label: item?.name_en,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      // Load initial tab data
      await fetchTabData("topVendors");
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        title: "Loading Failed",
        text: "Could not fetch initial data",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTabData = async (tabId) => {
    try {
      setTabLoading(true);
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return;

      const res = await AllAdvertisement({ type: tab.type });
      const data = res.data?.results?.advertisements || [];

      switch (tabId) {
        case "topVendors":
          setAllAdds(data);
          break;
        case "topCategories":
          setAllAddsCate(data);
          break;
        case "newVendors":
          setAddsVendor(data);
          break;
        case "newCategories":
          setAddsCategory(data);
          break;
        case "recommendations":
          setServiceAdds(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tabId} data:`, error);
      Swal.fire({
        title: "Loading Failed",
        text: `Could not fetch ${tabId} data`,
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    } finally {
      setTabLoading(false);
    }
  };

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    await fetchTabData(tabId);
  };

  useEffect(() => {
    fetchInitialOptions();
  }, [fetchInitialOptions]);

  const deleteAdvertisement = async (id, advType) => {
    try {
      await DeleteAddvertise({ type: advType, Id: id });
      await fetchTabData(activeTab); // Refresh current tab data
      Swal.fire({
        title: "Advertisement Deleted!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    } catch (error) {
      Swal.fire({
        title: "Deletion Failed",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const saveAdvertisement = async (e) => {
    e.preventDefault();

    // Validation
    const validations = {
      TV: selectedUsers.length < 1,
      TC: selectedCate.length < 1,
      NV: selectedNewVendor.length < 1,
      NC: selectedNewCate.length < 1,
      AR: selectedServices.length < 1,
    };

    if (validations[type]) {
      Swal.fire({
        title: `Please Select ${
          type === "AR"
            ? "Services"
            : type.includes("V")
            ? "Vendors"
            : "Categories"
        }`,
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      return;
    }

    try {
      // Prepare request data
      const requestData = {
        type:
          type === "TC"
            ? "category"
            : type === "TV"
            ? "vendor"
            : type === "NC"
            ? "newCategory"
            : type === "NV"
            ? "newVendor"
            : "Recommendation",
        [type === "AR"
          ? "service"
          : type.includes("V")
          ? "vendor"
          : "category"]:
          type === "TV"
            ? selectedUsers.map((i) => i.value)
            : type === "TC"
            ? selectedCate.map((i) => i.value)
            : type === "NV"
            ? selectedNewVendor.map((i) => i.value)
            : type === "NC"
            ? selectedNewCate.map((i) => i.value)
            : selectedServices.map((i) => i.value),
      };

      await AddAddvertise(requestData);

      // Reset selections
      setSelectedUsers([]);
      setSelectedCate([]);
      setSelectedNewCate([]);
      setSelectedNewVendor([]);
      setSelectedServices([]);

      // Switch tabs based on type and refresh data
      const tabMap = {
        TC: "topCategories",
        NV: "newVendors",
        NC: "newCategories",
        TV: "topVendors",
        AR: "recommendations",
      };
      const newTab = tabMap[type];
      setActiveTab(newTab);
      await fetchTabData(newTab);

      Swal.fire({
        title: "Advertisement Added!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    } catch (error) {
      Swal.fire({
        title: "Operation Failed",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const getBarClick = (val) => {
    setSideBar(val);
  };

  const renderTableRows = (data, columns) => {
    if (tabLoading) {
      return (
        <tr>
          <td colSpan={columns.length + 1} className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading data...</p>
          </td>
        </tr>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length + 1} className="text-center py-5">
            No advertisements found
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr className="bg-light" key={item._id}>
        {columns.map((col) => (
          <td className="text-center" key={col.key}>
            {col.render ? col.render(item, index) : item[col.key]}
          </td>
        ))}
        <td className="d-flex ">
          <button
            className="comman_btn2 table_viewbtn"
            onClick={() =>
              deleteAdvertisement(
                item._id,
                activeTab === "recommendations"
                  ? "Recommendation"
                  : activeTab === "topVendors"
                  ? "vendor"
                  : activeTab === "topCategories"
                  ? "category"
                  : activeTab === "newVendors"
                  ? "newVendor"
                  : "newCategory"
              )
            }>
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const getCurrentTableData = () => {
    switch (activeTab) {
      case "topVendors":
        return {
          data: allAdds,
          columns: [
            { key: null, render: (_, index) => index + 1 },
            {
              key: "vendor",
              render: (item) => item.vendor?.full_name || "N/A",
            },
            { key: "vendor", render: (item) => item.vendor?.email || "N/A" },
          ],
        };
      case "topCategories":
        return {
          data: allAddsCate,
          columns: [
            { key: null, render: (_, index) => index + 1 },
            {
              key: "category",
              render: (item) => item.category?.name_en || "N/A",
            },
            {
              key: "category",
              render: (item) => item.category?.name_ar || "N/A",
            },
          ],
        };
      case "newVendors":
        return {
          data: vendorAdds,
          columns: [
            { key: null, render: (_, index) => index + 1 },
            {
              key: "vendor",
              render: (item) => item.vendor?.full_name || "N/A",
            },
            { key: "vendor", render: (item) => item.vendor?.email || "N/A" },
            { key: "vendor", render: (item) => item.vendor?.vendorID || "N/A" },
          ],
        };
      case "newCategories":
        return {
          data: categoryAdds,
          columns: [
            { key: null, render: (_, index) => index + 1 },
            {
              key: "category",
              render: (item) => item.category?.name_en || "N/A",
            },
            {
              key: "category",
              render: (item) => item.category?.name_ar || "N/A",
            },
          ],
        };
      case "recommendations":
        return {
          data: serviceAdds,
          columns: [
            { key: null, render: (_, index) => index + 1 },
            {
              key: "service",
              render: (item) => item.service?.name_en || "N/A",
            },
            {
              key: "date",
              render: (item) =>
                moment(item.createdAt).format("MM/DD/YYYY") || "N/A",
            },
          ],
        };
      default:
        return { data: [], columns: [] };
    }
  };

  const { data, columns } = getCurrentTableData();

  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />
      <div className="admin_panel_data height_adjust">
        <div className="row advertisment-management justify-content-center">
          <div className="col-12">
            <div className="row">
              {/* Advertisement Form */}
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Add Advertisement</h2>
                  </div>
                </div>
                <form className="form-design py-4 px-3 help-support-form row justify-content-between">
                  <div className="form-group col-md-4">
                    <label>Select Type</label>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}>
                      <option value="TV">Top Vendors</option>
                      <option value="TC">Top Categories</option>
                      <option value="NV">New Vendor</option>
                      <option value="NC">New Category</option>
                      <option value="AR">Anasa Recommends</option>
                    </select>
                  </div>

                  {/* Dynamic Fields */}
                  {type === "TC" && (
                    <div className="form-group col">
                      <label>Select Category</label>
                      <Select
                        isMulti
                        options={optionsCate}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={setSelectedCate}
                        onInputChange={setSearchKey2}
                        value={selectedCate}
                      />
                    </div>
                  )}

                  {type === "TV" && (
                    <div className="form-group col">
                      <label>Search Vendors</label>
                      <Select
                        isMulti
                        options={options}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={setSelectedUsers}
                        onInputChange={setSearchKey}
                        value={selectedUsers}
                      />
                    </div>
                  )}

                  {type === "NV" && (
                    <div className="form-group col">
                      <label>Search New Vendors</label>
                      <Select
                        isMulti
                        options={optionsNewVendors}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={setSelectedNewVendor}
                        onInputChange={setSearchKey3}
                        value={selectedNewVendor}
                      />
                    </div>
                  )}

                  {type === "NC" && (
                    <div className="form-group col">
                      <label>Search New Category</label>
                      <Select
                        isMulti
                        options={optionsNewCate}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={setSelectedNewCate}
                        onInputChange={setSearchKey4}
                        value={selectedNewCate}
                      />
                    </div>
                  )}

                  {type === "AR" && (
                    <div className="form-group col">
                      <label>Search Services</label>
                      <Select
                        isMulti
                        options={optionsServices}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={setSelectedServices}
                        onInputChange={setSearchKey5}
                        value={selectedServices}
                      />
                    </div>
                  )}

                  <div className="form-group mb-0 col-auto mt-4">
                    <button
                      type="button"
                      className="comman_btn"
                      onClick={saveAdvertisement}>
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Advertisement Management */}
              <div className="col-12 mb-4 design_outter_comman border shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2>Advertisement Management</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 px-0">
                    <div className="nav nav-tabs  d-flex comman_tabs">
                      {tabs?.map((tab) => (
                        <button
                          key={tab.id}
                          style={{
                            width: "20%",
                          }}
                          className={`nav-link ${
                            activeTab === tab.id ? "active" : ""
                          }`}
                          onClick={() => handleTabChange(tab.id)}
                          disabled={tabLoading}>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="tab-content p-4 mx-0">
                      <div className="col-12 inner_design_comman ">
                        <div className="comman_table_design">
                          <div className="table-responsive">
                            <table className="table mb-0">
                              <thead>
                                <tr>
                                  <th>S.No.</th>
                                  {columns.slice(1).map((col, index) => (
                                    <th key={index}>
                                      {col.key === "vendor"
                                        ? index === 0
                                          ? "Vendors"
                                          : index === 1
                                          ? "Email"
                                          : "Vendor ID"
                                        : col.key === "category"
                                        ? index === 0
                                          ? "Categories(en)"
                                          : "Categories(ar)"
                                        : col.key === "service"
                                        ? "Service Name"
                                        : "Date"}
                                    </th>
                                  ))}
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>{renderTableRows(data, columns)}</tbody>
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
  );
};

export default AdvertiseManagement;
