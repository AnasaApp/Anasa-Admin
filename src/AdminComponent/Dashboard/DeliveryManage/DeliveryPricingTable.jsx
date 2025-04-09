import React, { useEffect, useState } from "react";
import {
  AddDelivery,
  DeleteDelivery,
  DeliveriesData,
  EditDelivery,
  ViewDeliveriesData,
} from "../../httpServices/dashHttpService";
import Swal from "sweetalert2";

const saudiCities = [
  "Dammam",
  "Al Qatif",
  "Al Jubail",
  "Ras Tanura",
  "Jubail",
  "Khobar",
];

const DeliveryPricingTable = () => {
  const [loading1, setLoading1] = useState(true);
  const [fromCity, setFromCity] = useState("");
  const [toCities, setToCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Track which row is being edited

  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10); // You can adjust this
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    GetAllDeliveries();
  }, [currentPage]); // Fetch data when page changes

  const GetAllDeliveries = async () => {
    setLoading1(true);
    try {
      const { data } = await DeliveriesData({
        page: currentPage,
        per_page: itemsPerPage,
      });

      if (!data.error) {
        const newRows = [];
        let values = data?.results?.delivery;

        values?.map((list, index) => {
          const returnData = {
            from: list?._id,
            to: list?.cities?.map((itm) => itm?.toCity),
            prices: list?.cities?.map((itm) => ({
              normal: itm?.normal === 0 ? "" : itm?.normal,
              cold: itm?.cold === 0 ? "" : itm?.cold,
              truck: itm?.truck === 0 ? "" : itm?.truck,
              id: itm?._id,
            })),
          };
          newRows.push(returnData);
        });

        setData(newRows);
        setTotalPages(data?.results?.totalPages || 1);
        setTotalItems(data?.results?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      Swal.fire({
        title: "Error loading data",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
    } finally {
      setLoading1(false);
    }
  };

  const ViewDelivery = async (fromCity) => {
    setFromCity(fromCity);
    const cityData = data?.find((item) => item.from === fromCity);

    console.log(cityData);

    if (cityData) {
      setToCities(cityData?.to);
    }
  };

  const HandleAddDeliveries = async () => {
    if (toCities?.length > 0 && fromCity) {
      const { data } = await AddDelivery({
        fromCity: fromCity,
        toCities: toCities,
      });

      if (!data.error) {
        Swal.fire({
          title: data.message,
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#e25829",
        });
        setToCities([]);
        setFromCity("");
        window.location.reload();
      }
    } else {
      Swal.fire({
        title: "Please select a Date range!",
        icon: "warning",
        button: "ok",
        confirmButtonColor: "#e25829",
      });
    }
  };

  const HandleUpdateDeliveries = (() => {
    let timeoutId;

    return async (id, key, value) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const updateData = {};
        console.log(key);

        if (key === "truck") {
          updateData.truck = value;
        } else if (key === "cold") {
          updateData.cold = value;
        } else if (key === "normal") {
          updateData.normal = value;
        }
        if (fromCity) {
          updateData.fromCity = fromCity;
        }
        if (toCities?.length > 0) {
          updateData.toCities = toCities;
        }

        try {
          const { data } = await EditDelivery(updateData, id);

          if (!data.error) {
            GetAllDeliveries();
          } else {
            Swal.fire({
              title: data.message,
              icon: "warning",
              button: "ok",
              confirmButtonColor: "#e25829",
            });
          }
        } catch (error) {
          console.error("Error updating deliveries:", error);
          Swal.fire({
            title: "An error occurred",
            icon: "error",
            button: "ok",
            confirmButtonColor: "#e25829",
          });
        }
      }, 500); 
    };
  })();

  const HandleDeleteDeliveries = async (id) => {
    const { data } = await DeleteDelivery(id);

    if (!data.error) {
      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#e25829",
      });
      setToCities([]);
      setFromCity("");
      GetAllDeliveries();
    } else {
    }
  };

  const handleEditClick = (fromCity, index) => {
    setEditingIndex(index);
    ViewDelivery(fromCity);
    setActiveId();
  };

  const handlePriceChange = (fromIndex, toIndex, type, value, id) => {
    const updatedData = [...data];
    updatedData[fromIndex].prices[toIndex][type] = value;
    setData(updatedData);
    HandleUpdateDeliveries(id, type, value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const PaginationControls = () => (
    <div className="d-flex justify-content-between align-items-center mt-3 px-2">
      <div>
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <li
                key={pageNum}
                className={`page-item ${
                  currentPage === pageNum ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th rowSpan="2">From</th>
            <th rowSpan="2">To</th>
            <th colSpan="3" className="text-center">
              Delivery
            </th>
            <th rowSpan="2">Action</th>
          </tr>
          <tr>
            <th>Normal</th>
            <th>Cold</th>
            <th>Truck</th>
          </tr>
        </thead>
        {console.log(data)}
        <tbody>
          {data?.map((row, fromIndex) =>
            row?.to?.map((toCity, toIndex) => (
              <tr key={`${fromIndex}-${toIndex}`}>
                {toIndex === 0 && (
                  <td rowSpan={row.to.length} className="align-middle">
                    {row.from}
                  </td>
                )}
                <td>{toCity}</td>
                <td>
                  <input
                    type="text"
                    value={row.prices[toIndex].normal}
                    onChange={(e) =>
                      handlePriceChange(
                        fromIndex,
                        toIndex,
                        "normal",
                        e.target.value,
                        row.prices[toIndex].id
                      )
                    }
                    className="form-control"
                    placeholder="Enter Price"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.prices[toIndex].cold}
                    onChange={(e) =>
                      handlePriceChange(
                        fromIndex,
                        toIndex,
                        "cold",
                        e.target.value,
                        row.prices[toIndex].id
                      )
                    }
                    className="form-control"
                    placeholder="Enter Price"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.prices[toIndex].truck}
                    onChange={(e) =>
                      handlePriceChange(
                        fromIndex,
                        toIndex,
                        "truck",
                        e.target.value,
                        row.prices[toIndex].id
                      )
                    }
                    className="form-control"
                    placeholder="Enter Price"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger rounded "
                    onClick={() => {
                      setActiveId(row.prices[toIndex].id);
                      HandleDeleteDeliveries(row.prices[toIndex].id);
                    }}
                  >
                    Delete
                  </button>
                </td>

                {toIndex === 0 && (
                  <td rowSpan={row.to.length} className="align-middle">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#addDeliveryPricing"
                      className="comman_btn"
                      onClick={() => {
                        handleEditClick(row.from, fromIndex);
                      }}
                    >
                      Edit Cities
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!loading1 && data.length > 0 && <PaginationControls />}

      <div
        className="modal fade"
        id="addDeliveryPricing"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="addDeliveryPricingLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addDeliveryPricingLabel">
                {editingIndex !== null ? "Edit" : "Add"} Delivery Pricing
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="DeliveryPricingClose"
                onClick={() => {
                  setFromCity("");
                  setToCities([]);
                  setEditingIndex(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">From City</label>
                    <select
                      onChange={(e) => {
                        setFromCity(e.target.value);
                      }}
                      className="form-select"
                      required
                      value={fromCity}
                      disabled={editingIndex !== null}
                    >
                      <option value="">Select City</option>
                      {saudiCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">To Cities</label>
                  <div className="row">
                    {saudiCities?.map((city) => {
                      // Get the initial toCities when the modal opens (for editing)
                      const initialToCities =
                        editingIndex !== null ? data[editingIndex]?.to : [];
                      const isInitiallyChecked =
                        initialToCities?.includes(city);
                      const isChecked = toCities.includes(city);

                      return (
                        <div key={city} className="col-md-4 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`city-${city}`}
                              value={city}
                              checked={isChecked}
                              onChange={(e) => {
                                const selectedCity = e.target.value;
                                // Only prevent unchecking if it was initially checked
                                if (isInitiallyChecked && isChecked) return;

                                setToCities((prev) =>
                                  prev.includes(selectedCity)
                                    ? prev.filter((c) => c !== selectedCity)
                                    : [...prev, selectedCity]
                                );
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`city-${city}`}
                            >
                              {city}
                              {isInitiallyChecked && isChecked && (
                                <span className="text-muted ms-1">
                                  (required)
                                </span>
                              )}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  setFromCity("");
                  setToCities([]);
                  setEditingIndex(null);
                }}
              >
                Close
              </button>
              <button
                onClick={(e) => HandleAddDeliveries()}
                type="button"
                className="btn comman_btn"
              >
                {editingIndex !== null ? "Update" : "Save"} Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPricingTable;
