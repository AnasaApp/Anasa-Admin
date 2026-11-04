import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import NewFlowLayout, { Card, Pager, Spinner, confirm, done, warn } from "./NewFlowLayout";
import {
  changePopupStatus,
  createPopup,
  deletePopup,
  editPopup,
  getAllPopups,
  getCityList,
  getEventTypeList,
  uploadImage,
} from "../../httpServices/newFlowHttpService";

// In-app pop-ups for the new flow. The app shows at most one per app open,
// the highest priority first, and applies the frequency itself.
const SCREENS = [
  { value: "home", label: "Home" },
  { value: "results", label: "Results" },
  { value: "order_summary", label: "Order summary" },
  { value: "my_events", label: "My events" },
];
const FREQUENCIES = [
  { value: "ONCE", label: "Once per user" },
  { value: "ONCE_PER_DAY", label: "Once a day" },
  { value: "EVERY_LAUNCH", label: "Every app open" },
];
const AUDIENCES = [
  { value: "ALL", label: "Everyone" },
  { value: "GUESTS", label: "Guests (not signed in)" },
  { value: "SIGNED_IN", label: "Signed-in users" },
  { value: "DRAFT_OWNERS", label: "Users with an unfinished event" },
];

const emptyForm = {
  title_en: "",
  title_ar: "",
  body_en: "",
  body_ar: "",
  image: "",
  cta_text_en: "",
  cta_text_ar: "",
  cta_link: "",
  screens: ["home"],
  frequency: "ONCE",
  priority: 0,
  audience: "ALL",
  cityIds: [],
  eventTypeIds: [],
  startsAt: "",
  endsAt: "",
};

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time
const toInput = (date) => (date ? moment(date).format("YYYY-MM-DDTHH:mm") : "");

const fromPopup = (popup) => ({
  title_en: popup.title_en || "",
  title_ar: popup.title_ar || "",
  body_en: popup.body_en || "",
  body_ar: popup.body_ar || "",
  image: popup.image || "",
  cta_text_en: popup.cta_text_en || "",
  cta_text_ar: popup.cta_text_ar || "",
  cta_link: popup.cta_link || "",
  screens: popup.screens?.length ? popup.screens : ["home"],
  frequency: popup.frequency || "ONCE",
  priority: popup.priority ?? 0,
  audience: popup.audience || "ALL",
  cityIds: (popup.cities || []).map(String),
  eventTypeIds: (popup.event_types || []).map(String),
  startsAt: toInput(popup.starts_at),
  endsAt: toInput(popup.ends_at),
});

const toBody = (form) => ({
  ...form,
  priority: Number(form.priority) || 0,
  startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
  endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
});

const isLive = (popup) => {
  const now = Date.now();
  if (!popup.status) return "Off";
  if (popup.starts_at && new Date(popup.starts_at) > now) return "Scheduled";
  if (popup.ends_at && new Date(popup.ends_at) < now) return "Ended";
  return "Live";
};

const percent = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : "-");

const PopupsManagement = () => {
  const [popups, setPopups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null, "new" or a popup
  const [cities, setCities] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getAllPopups({ page, pageSize: 20 });
    if (data && !data.error) {
      setPopups(data.results?.popups || []);
      setTotalPages(data.results?.totalPages || 1);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      const [cityRes, typeRes] = await Promise.all([getCityList(), getEventTypeList()]);
      setCities((cityRes.data?.results?.cities || []).map((c) => ({ value: c._id, label: c.city })));
      setEventTypes((typeRes.data?.results?.partyTypes || []).map((t) => ({ value: t._id, label: t.name_en })));
    })();
  }, []);

  const toggle = async (popup) => {
    const { data } = await changePopupStatus({ popupId: popup._id, status: !popup.status });
    if (data && !data.error) load();
  };

  const remove = async (popup) => {
    if (!(await confirm(`Delete "${popup.title_en}"?`, "This can't be undone.", "Delete"))) return;
    const { data } = await deletePopup(popup._id);
    if (data && !data.error) {
      done("Pop-up deleted");
      load();
    }
  };

  return (
    <NewFlowLayout slide="PU">
      <Card
        title="Pop-ups"
        className=""
        right={
          <button className="comman_btn" type="button" onClick={() => setEditing("new")}>
            + New pop-up
          </button>
        }
      >
        <div className="row">
          <div className="col-12 comman_table_design px-0">
            <div className="table-responsive p-0">
              {loading ? (
                <Spinner />
              ) : popups.length === 0 ? (
                <div className="text-center py-5 text-muted">No pop-ups yet.</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Where / who</th>
                      <th>Dates</th>
                      <th>Priority</th>
                      <th>Shown / clicked / closed</th>
                      <th>On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popups.map((popup) => (
                      <tr key={popup._id}>
                        <td>
                          <img
                            src={popup.image || require("../../../assets/img/Nupload.jpg")}
                            alt=""
                            className="table_img"
                          />
                        </td>
                        <td>
                          {popup.title_en}
                          <div className="text-muted small" dir="rtl">
                            {popup.title_ar}
                          </div>
                        </td>
                        <td className="small">
                          {(popup.screens || []).map((s) => SCREENS.find((x) => x.value === s)?.label || s).join(", ")}
                          <div className="text-muted">
                            {AUDIENCES.find((a) => a.value === popup.audience)?.label} ·{" "}
                            {FREQUENCIES.find((f) => f.value === popup.frequency)?.label}
                          </div>
                        </td>
                        <td className="small">
                          {popup.starts_at ? moment(popup.starts_at).format("DD MMM YYYY") : "Now"} –{" "}
                          {popup.ends_at ? moment(popup.ends_at).format("DD MMM YYYY") : "No end"}
                          <div>
                            <span className={`badge ${isLive(popup) === "Live" ? "bg-success" : "bg-secondary"}`}>
                              {isLive(popup)}
                            </span>
                          </div>
                        </td>
                        <td>{popup.priority}</td>
                        <td className="small">
                          {popup.shown_count} / {popup.clicked_count} / {popup.dismissed_count}
                          <div className="text-muted">Click rate {percent(popup.clicked_count, popup.shown_count)}</div>
                        </td>
                        <td>
                          <div className="check_toggle">
                            <input
                              type="checkbox"
                              checked={Boolean(popup.status)}
                              id={`popup-status-${popup._id}`}
                              className="d-none"
                              onChange={() => toggle(popup)}
                            />
                            <label htmlFor={`popup-status-${popup._id}`} />
                          </div>
                        </td>
                        <td>
                          <button className="comman_btn table_viewbtn mx-1" type="button" onClick={() => setEditing(popup)}>
                            Edit
                          </button>
                          <button className="comman_btn bg-red table_viewbtn mx-1" type="button" onClick={() => remove(popup)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {!loading && <Pager page={page} totalPages={totalPages} onPage={setPage} />}
          </div>
        </div>
      </Card>

      {editing && (
        <PopupForm
          popup={editing === "new" ? null : editing}
          cities={cities}
          eventTypes={eventTypes}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </NewFlowLayout>
  );
};

const PopupForm = ({ popup, cities, eventTypes, onClose, onSaved }) => {
  const [form, setForm] = useState(popup ? fromPopup(popup) : emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setValue = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const chosen = (options, ids) => options.filter((o) => ids.includes(String(o.value)));

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) setValue("image", url);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title_en.trim() || !form.title_ar.trim()) return warn("Title in English and Arabic is required");
    if (!form.screens.length) return warn("Choose at least one screen");
    setSaving(true);
    const { data } = popup
      ? await editPopup({ popupId: popup._id, ...toBody(form) })
      : await createPopup(toBody(form));
    setSaving(false);
    if (data && !data.error) {
      done(popup ? "Pop-up updated" : "Pop-up created");
      onSaved();
    }
  };

  return (
    <>
      <div className="modal show d-block comman_modal" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title">{popup ? "Edit pop-up" : "New pop-up"}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <form id="popupForm" className="form-design px-3 py-2 help-support-form row" onSubmit={save}>
                <div className="form-group col-md-6">
                  <label>Title (En) *</label>
                  <input type="text" className="form-control" value={form.title_en} onChange={set("title_en")} />
                </div>
                <div className="form-group col-md-6">
                  <label>Title (Ar) *</label>
                  <input type="text" className="form-control" dir="rtl" lang="ar" value={form.title_ar} onChange={set("title_ar")} />
                </div>
                <div className="form-group col-md-6">
                  <label>Text (En)</label>
                  <textarea className="form-control" rows={3} value={form.body_en} onChange={set("body_en")} />
                </div>
                <div className="form-group col-md-6">
                  <label>Text (Ar)</label>
                  <textarea className="form-control" rows={3} dir="rtl" lang="ar" value={form.body_ar} onChange={set("body_ar")} />
                </div>

                <div className="form-group col-md-6">
                  <label>Image (square, up to 1080×1080)</label>
                  <div className="d-flex align-items-center gap-3">
                    {form.image && <img src={form.image} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />}
                    <input type="file" accept="image/png,image/jpeg" className="form-control" onChange={pickImage} />
                    {form.image && (
                      <button type="button" className="comman_btn bg-red table_viewbtn" onClick={() => setValue("image", "")}>
                        Remove
                      </button>
                    )}
                  </div>
                  {uploading && <small className="text-muted">Uploading...</small>}
                </div>
                <div className="form-group col-md-6">
                  <label>Button link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://anasa.site/open?packageId=..."
                    value={form.cta_link}
                    onChange={set("cta_link")}
                  />
                  <small className="text-muted">Leave empty for a pop-up with only a close button.</small>
                </div>
                <div className="form-group col-md-6">
                  <label>Button text (En)</label>
                  <input type="text" className="form-control" placeholder="See offer" value={form.cta_text_en} onChange={set("cta_text_en")} />
                </div>
                <div className="form-group col-md-6">
                  <label>Button text (Ar)</label>
                  <input type="text" className="form-control" dir="rtl" lang="ar" value={form.cta_text_ar} onChange={set("cta_text_ar")} />
                </div>

                <div className="form-group col-md-6">
                  <label>Show on screens</label>
                  <Select
                    isMulti
                    options={SCREENS}
                    value={chosen(SCREENS, form.screens)}
                    onChange={(val) => setValue("screens", (val || []).map((v) => v.value))}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label>How often</label>
                  <select className="form-select" value={form.frequency} onChange={set("frequency")}>
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label>Priority (higher shows first)</label>
                  <input type="number" className="form-control" value={form.priority} onChange={set("priority")} />
                </div>

                <div className="form-group col-md-4">
                  <label>Who sees it</label>
                  <select className="form-select" value={form.audience} onChange={set("audience")}>
                    {AUDIENCES.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label>Only in cities (empty = all)</label>
                  <Select
                    isMulti
                    options={cities}
                    value={chosen(cities, form.cityIds)}
                    onChange={(val) => setValue("cityIds", (val || []).map((v) => v.value))}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Only for event types (empty = all)</label>
                  <Select
                    isMulti
                    options={eventTypes}
                    value={chosen(eventTypes, form.eventTypeIds)}
                    onChange={(val) => setValue("eventTypeIds", (val || []).map((v) => v.value))}
                  />
                </div>

                <div className="form-group col-md-6">
                  <label>Starts (empty = now)</label>
                  <input type="datetime-local" className="form-control" value={form.startsAt} onChange={set("startsAt")} />
                </div>
                <div className="form-group col-md-6">
                  <label>Ends (empty = no end)</label>
                  <input type="datetime-local" className="form-control" value={form.endsAt} onChange={set("endsAt")} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="submit" form="popupForm" className="comman_btn" disabled={saving || uploading}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};

export default PopupsManagement;
