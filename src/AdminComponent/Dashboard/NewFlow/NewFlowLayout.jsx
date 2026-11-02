import React, { useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../Sidebar";

// The dashboard frame shared by the new-flow pages: sidebar, then a card
// with optional tabs. `tabs` is [{ key, label }].
const NewFlowLayout = ({ slide, tabs, activeTab, onTab, children }) => {
  const [sideBar, setSideBar] = useState(false);

  return (
    <div className={sideBar ? "expanded_main" : "admin_main"}>
      <Sidebar slide={slide} getBarClick={(val) => setSideBar(val === "click")} />

      <div className="admin_panel_data height_adjust">
        <div className="row buyers-details justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman shadow">
                <div className="row">
                  <div className="col-12 px-0">
                    {tabs && (
                      <ul className="nav nav-tabs comman_tabs flex-nowrap overflow-auto" role="tablist">
                        {tabs.map((tab) => (
                          <li className="nav-item" role="presentation" key={tab.key}>
                            <button
                              className={activeTab === tab.key ? "nav-link active" : "nav-link"}
                              type="button"
                              onClick={() => onTab(tab.key)}
                            >
                              {tab.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="tab-content">
                      <div className="row p-4 mx-0">{children}</div>
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

// A titled card inside the page
export const Card = ({ title, right, children, className = "mb-4" }) => (
  <div className={`col-12 inner_design_comman border ${className}`}>
    <div className="row comman_header justify-content-between align-items-center">
      <div className="col-auto">
        <h2>{title}</h2>
      </div>
      {right && <div className="col-auto">{right}</div>}
    </div>
    {children}
  </div>
);

export const Spinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const Pager = ({ page, totalPages, onPage }) =>
  totalPages > 1 ? (
    <div className="d-flex justify-content-between align-items-center px-3 py-3">
      <div className="text-muted">
        Page {page} of {totalPages}
      </div>
      <div>
        <button className="comman_btn mx-1" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        <button className="comman_btn mx-1" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  ) : null;

export const done = (title) =>
  Swal.fire({ title, icon: "success", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });

export const warn = (title) =>
  Swal.fire({ title, icon: "warning", confirmButtonText: "Okay", confirmButtonColor: "#e25829" });

export const confirm = (title, text, confirmButtonText = "Yes") =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    confirmButtonColor: "#e25829",
  }).then((result) => result.isConfirmed);

export default NewFlowLayout;
