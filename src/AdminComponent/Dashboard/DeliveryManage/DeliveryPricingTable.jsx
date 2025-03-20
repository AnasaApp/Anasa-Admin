import React, { useState } from "react";

const cities = ["Dammam", "Dharan", "Khobar", "Qatif", "Jubail", "Ras Tanura"];

const DeliveryPricingTable = () => {
  const [data, setData] = useState([
    {
      from: "Dammam",
      to: cities,
      prices: cities.map(() => ({ normal: "", cold: "", truck: "" })),
    },
    {
      from: "Dharan",
      to: cities,
      prices: cities.map(() => ({ normal: "", cold: "", truck: "" })),
    },
  ]);

  const handlePriceChange = (fromIndex, toIndex, type, value) => {
    const updatedData = [...data];
    updatedData[fromIndex].prices[toIndex][type] = value;
    setData(updatedData);
  };

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
                        e.target.value
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
                        e.target.value
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
                        e.target.value
                      )
                    }
                    className="form-control"
                    placeholder="Enter Price"
                  />
                </td>
                <td>
                  <button className="comman_btn">Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryPricingTable;
