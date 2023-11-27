import React, { useState } from "react";
import Sidebar from "../Sidebar";
import BuyerCms from "./BuyerCms";
import VendorCms from "./VendorCms";

const CMS = () => {
  const [slide, setSlide] = useState("ConM");
  const [sideBar, setSideBar] = useState();

  const getBarClick = (val) => {
    // console.log(val);
    setSideBar(val);
  };
  return (
    <div className={sideBar === "click" ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={getBarClick} />

      <>
        <div className="admin_panel_data height_adjust">
          <div className="row content-management justify-content-center">
            <ul className="nav nav-tabs nav-justified p-0 rounded" id="ex1" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active border-0"
                  id="ex3-tab-1"
                  data-bs-toggle="tab"
                  href="#ex3-tabs-1"
                  role="tab"
                  aria-controls="ex3-tabs-1"
                  aria-selected="true"
                >
                  Buyer
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link border-0"
                  id="ex3-tab-2"
                  data-bs-toggle="tab"
                  href="#ex3-tabs-2"
                  role="tab"
                  aria-controls="ex3-tabs-2"
                  aria-selected="false"
                >
                  Vendor
                </a>
              </li>
            </ul>
            <div className="col-12 design_outter_comman recent_orders shadow mt-5">
              <div className="row">
                <div className="col-12 px-0">
                  <div className="tab-content" id="ex2-content">
                    <div
                      className="tab-pane fade show active"
                      id="ex3-tabs-1"
                      role="tabpanel"
                      aria-labelledby="ex3-tab-1"
                    >
                      <BuyerCms />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="ex3-tabs-2"
                      role="tabpanel"
                      aria-labelledby="ex3-tab-2"
                    >
                      <VendorCms />
                    </div>
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

export default CMS;
