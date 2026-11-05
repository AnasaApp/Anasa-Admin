import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import NewFlowLayout, { Card, Pager, Spinner, confirm, done, warn } from "./NewFlowLayout";
import {
  addDistrict,
  deleteDistrict,
  editDistrict,
  getAllDistricts,
  getCategoryList,
  getCityList,
  getEventTypeList,
  getOfferList,
  setCategoryEventTypes,
  setEventTypePackages,
  setPackageDetails,
} from "../../httpServices/newFlowHttpService";

// Connects the existing catalogue to the new flow: which packages
// and categories show for each event type, package guest limits and cities,
// and the districts users pick from.
const TABS = [
  { key: "districts", label: "Districts" },
  { key: "eventTypes", label: "Event types" },
  { key: "packages", label: "Packages" },
  { key: "categories", label: "Categories" },
];


const BADGES = [
  { value: "", label: "Automatic" },
  { value: "BEST_FOR_BUDGET", label: "Best for budget" },
  { value: "BEST_VALUE", label: "Best value" },
  { value: "NONE", label: "No badge" },
];

const chosen = (options, ids = []) => options.filter((o) => ids.map(String).includes(String(o.value)));
const names = (options, ids = []) => chosen(options, ids).map((o) => o.label).join(", ");

// The pickers every tab uses, loaded once
const useLists = () => {
  const [cities, setCities] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  useEffect(() => {
    (async () => {
      const [cityRes, typeRes] = await Promise.all([getCityList(), getEventTypeList()]);
      setCities((cityRes.data?.results?.cities || []).map((c) => ({ value: c._id, label: c.city })));
      setEventTypes((typeRes.data?.results?.partyTypes || []).map((t) => ({ value: t._id, label: t.name_en })));
    })();
  }, []);
  return { cities, eventTypes };
};

const Modal = ({ title, onClose, onSave, saving, children }) => (
  <>
    <div className="modal show d-block comman_modal" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <form
              className="form-design px-3 py-2 help-support-form row"
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              {children}
              <div className="form-group mb-0 col-12 text-center mt-3">
                <button type="submit" className="comman_btn" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show" onClick={onClose} />
  </>
);

const Table = ({ loading, empty, head, children }) => (
  <div className="row">
    <div className="col-12 comman_table_design px-0">
      <div className="table-responsive p-0">
        {loading ? (
          <Spinner />
        ) : empty ? (
          <div className="text-center py-5 text-muted">Nothing here yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

// ==================== Districts ====================
const Districts = ({ cities }) => {
  const [cityId, setCityId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name_en: "", name_ar: "" });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getAllDistricts({ cityId: cityId || undefined, search, page, pageSize: 20 });
    if (data && !data.error) {
      setDistricts(data.results?.districts || []);
      setTotalPages(data.results?.totalPages || 1);
    }
    setLoading(false);
  }, [cityId, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!cityId) return warn("Choose a city first");
    if (!form.name_en.trim() || !form.name_ar.trim()) return warn("Both English and Arabic names are required");
    setSaving(true);
    const { data } = await addDistrict({ cityId, name_en: form.name_en.trim(), name_ar: form.name_ar.trim() });
    setSaving(false);
    if (data && !data.error) {
      done("District added");
      setForm({ name_en: "", name_ar: "" });
      load();
    }
  };

  const saveEdit = async () => {
    setSaving(true);
    const { data } = await editDistrict({
      districtId: editing._id,
      name_en: editing.name_en.trim(),
      name_ar: editing.name_ar.trim(),
    });
    setSaving(false);
    if (data && !data.error) {
      setEditing(null);
      done("District updated");
      load();
    }
  };

  const toggle = async (district) => {
    const { data } = await editDistrict({ districtId: district._id, status: !district.status });
    if (data && !data.error) load();
  };

  const remove = async (district) => {
    if (!(await confirm(`Delete ${district.name_en}?`, "Users can no longer pick it.", "Delete"))) return;
    const { data } = await deleteDistrict(district._id);
    if (data && !data.error) load();
  };

  const cityName = (id) => cities.find((c) => String(c.value) === String(id))?.label || "-";

  return (
    <>
      <Card title="Add District">
        <form className="form-design py-4 px-3 help-support-form row" onSubmit={add}>
          <div className="form-group col-md-4">
            <label>City</label>
            <Select
              options={cities}
              value={chosen(cities, [cityId])}
              onChange={(val) => {
                setCityId(val?.value || "");
                setPage(1);
              }}
              isClearable
              placeholder="All cities"
            />
          </div>
          <div className="form-group col-md-3">
            <label>District (En)</label>
            <input
              type="text"
              className="form-control"
              value={form.name_en}
              onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))}
            />
          </div>
          <div className="form-group col-md-3">
            <label>District (Ar)</label>
            <input
              type="text"
              className="form-control"
              dir="rtl"
              lang="ar"
              value={form.name_ar}
              onChange={(e) => setForm((p) => ({ ...p, name_ar: e.target.value }))}
            />
          </div>
          <div className="form-group col-md-2 d-flex align-items-end">
            <button type="submit" className="comman_btn w-100" disabled={saving}>
              Add
            </button>
          </div>
        </form>
      </Card>

      <Card
        title={cityId ? `Districts in ${cityName(cityId)}` : "All Districts"}
        className=""
        right={
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        }
      >
        <Table loading={loading} empty={!districts.length} head={["English", "Arabic", "City", "On", "Action"]}>
          {districts.map((district) => (
            <tr key={district._id}>
              <td>{district.name_en}</td>
              <td dir="rtl">{district.name_ar}</td>
              <td>{cityName(district.city)}</td>
              <td>
                <div className="check_toggle">
                  <input
                    type="checkbox"
                    checked={district.status !== false}
                    id={`district-${district._id}`}
                    className="d-none"
                    onChange={() => toggle(district)}
                  />
                  <label htmlFor={`district-${district._id}`} />
                </div>
              </td>
              <td>
                <button className="comman_btn table_viewbtn mx-1" type="button" onClick={() => setEditing({ ...district })}>
                  Edit
                </button>
                <button className="comman_btn bg-red table_viewbtn mx-1" type="button" onClick={() => remove(district)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!loading && <Pager page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      {editing && (
        <Modal title="Edit district" onClose={() => setEditing(null)} onSave={saveEdit} saving={saving}>
          <div className="form-group col-md-6">
            <label>District (En)</label>
            <input
              type="text"
              className="form-control"
              value={editing.name_en}
              onChange={(e) => setEditing((p) => ({ ...p, name_en: e.target.value }))}
            />
          </div>
          <div className="form-group col-md-6">
            <label>District (Ar)</label>
            <input
              type="text"
              className="form-control"
              dir="rtl"
              lang="ar"
              value={editing.name_ar}
              onChange={(e) => setEditing((p) => ({ ...p, name_ar: e.target.value }))}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

// ==================== Event types ====================
// The Ready packages the app shows for each event type. Switched-off event
// types never reach the app, so they are left out; they are switched back
// on in Occasion Management (Occasion Types).
const EventTypes = () => {
  const [types, setTypes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [typeRes, offerRes] = await Promise.all([getEventTypeList(), getOfferList()]);
    setTypes(typeRes.data?.results?.partyTypes || []);
    setPackages(
      (offerRes.data?.results?.offer || []).map((offer) => ({
        value: offer._id,
        // Packages the app hides anyway say why, so linking them is no surprise
        label: offer.hidden_reasons?.some((r) => r !== "not_linked")
          ? `${offer.name_en} (hidden: ${offer.hidden_reasons
              .filter((r) => r !== "not_linked")
              .map((r) => HIDDEN_REASONS[r]?.[0] || r)
              .join(", ")})`
          : offer.name_en,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const { data } = await setEventTypePackages({
      eventTypeId: editing._id,
      offerIds: editing.offers || [],
    });
    setSaving(false);
    if (data && !data.error) {
      setEditing(null);
      done("Packages updated");
      load();
    }
  };

  const active = types
    .filter((type) => type.status !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const hiddenCount = types.length - active.length;

  return (
    <>
      <Card title="Packages for each event type" className="">
        <p className="px-3 pt-3 text-muted mb-0">
          The app shows these packages when a user picks the event type. Guest limits and cities are set on the Packages tab.
          {hiddenCount > 0 &&
            ` ${hiddenCount} switched-off event type${hiddenCount === 1 ? " is" : "s are"} not listed: switch them on in Occasion Management.`}
        </p>
        <Table loading={loading} empty={!active.length} head={["Icon", "Event type", "Packages", "Action"]}>
          {active.map((type) => (
            <tr key={type._id}>
              <td>
                <img src={type.icon || require("../../../assets/img/Nupload.jpg")} alt="" className="table_img" />
              </td>
              <td>{type.name_en}</td>
              <td className="small">
                {names(packages, type.offers) || <span className="text-danger">None: the app shows no packages</span>}
              </td>
              <td>
                <button
                  className="comman_btn table_viewbtn"
                  type="button"
                  onClick={() => setEditing({ ...type, offers: (type.offers || []).map(String) })}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {editing && (
        <Modal title={`Packages for "${editing.name_en}"`} onClose={() => setEditing(null)} onSave={save} saving={saving}>
          <div className="form-group col-12">
            <label>Packages</label>
            <Select
              isMulti
              options={packages}
              value={chosen(packages, editing.offers)}
              onChange={(val) => setEditing((p) => ({ ...p, offers: (val || []).map((v) => v.value) }))}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

// ==================== Packages ====================
// Why the app leaves a package out, and how to fix it (shown on hover)
const HIDDEN_REASONS = {
  expired: ["Expired", "Valid Till has passed: set a later date in Marketing Offers"],
  service_off: ["Service off", "A service in it is switched off or deleted: turn it on or replace it"],
  vendor_off: ["Vendor off", "A vendor in it is inactive, blocked or deleted"],
  not_linked: ["Not linked", "Link it to an event type: Event Setup, Event types tab"],
};

const Packages = ({ cities }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getOfferList();
    if (data && !data.error) setOffers(data.results?.offer || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const guests = (value) => (value === "" || value == null ? null : Number(value));
    setSaving(true);
    const { data } = await setPackageDetails({
      offerId: editing._id,
      minGuests: guests(editing.min_guests),
      maxGuests: guests(editing.max_guests),
      cityIds: (editing.cities || []).map(String),
      badgeOverride: editing.badge_override || null,
    });
    setSaving(false);
    if (data && !data.error) {
      setEditing(null);
      done("Package updated");
      load();
    }
  };

  const guestText = (offer) =>
    offer.min_guests || offer.max_guests ? `${offer.min_guests || 1} – ${offer.max_guests || "any"}` : "Any";

  // hidden_reasons comes from the server (getAllOffer), with the app's rules
  const statusOf = (offer) => {
    if (!offer.hidden_reasons) return <span className="text-muted">-</span>;
    if (!offer.hidden_reasons.length) return <span className="badge bg-success">Shown in app</span>;
    return offer.hidden_reasons.map((reason) => {
      const [label, hint] = HIDDEN_REASONS[reason] || [reason, ""];
      return (
        <span key={reason} className="badge bg-danger me-1 mb-1" title={hint}>
          {label}
        </span>
      );
    });
  };

  return (
    <>
      <Card title="Package details for the new flow" className="">
        <p className="px-3 pt-3 text-muted mb-0">
          Packages only show for events whose guest count fits and, when cities are set, in those cities. Status says why
          the app hides one (hover a red label for the fix). The badge is worked
          out from prices unless you set one here.
        </p>
        <Table
          loading={loading}
          empty={!offers.length}
          head={["Image", "Package", "Price", "Guests", "Cities", "Badge", "Status", "Action"]}
        >
          {offers.map((offer) => (
            <tr key={offer._id}>
              <td>
                <img src={offer.image || require("../../../assets/img/Nupload.jpg")} alt="" className="table_img" />
              </td>
              <td>
                {offer.name_en}
              </td>
              <td>SAR {offer.comboPrice ?? "-"}</td>
              <td>{guestText(offer)}</td>
              <td className="small">{names(cities, offer.cities) || <span className="text-muted">All</span>}</td>
              <td className="small">{BADGES.find((b) => b.value === (offer.badge_override || ""))?.label}</td>
              <td>{statusOf(offer)}</td>
              <td>
                <button className="comman_btn table_viewbtn" type="button" onClick={() => setEditing({ ...offer })}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {editing && (
        <Modal title={`Package: ${editing.name_en}`} onClose={() => setEditing(null)} onSave={save} saving={saving}>
          <div className="form-group col-md-6">
            <label>Minimum guests (empty = no minimum)</label>
            <input
              type="number"
              min={1}
              className="form-control"
              value={editing.min_guests ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, min_guests: e.target.value }))}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Maximum guests (empty = no maximum)</label>
            <input
              type="number"
              min={1}
              className="form-control"
              value={editing.max_guests ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, max_guests: e.target.value }))}
            />
          </div>
          <div className="form-group col-md-8">
            <label>Cities (empty = all)</label>
            <Select
              isMulti
              options={cities}
              value={chosen(cities, editing.cities)}
              onChange={(val) => setEditing((p) => ({ ...p, cities: (val || []).map((v) => v.value) }))}
            />
          </div>
          <div className="form-group col-md-4">
            <label>Badge</label>
            <select
              className="form-select"
              value={editing.badge_override || ""}
              onChange={(e) => setEditing((p) => ({ ...p, badge_override: e.target.value }))}
            >
              {BADGES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </>
  );
};

// ==================== Categories ====================
const Categories = ({ eventTypes }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getCategoryList();
    if (data && !data.error) setCategories(data.results?.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const { data } = await setCategoryEventTypes({
      categoryId: editing._id,
      eventTypeIds: (editing.event_types || []).map(String),
    });
    setSaving(false);
    if (data && !data.error) {
      setEditing(null);
      done("Category updated");
      load();
    }
  };

  return (
    <>
      <Card title='Categories in "Plan it yourself"' className="">
        <p className="px-3 pt-3 text-muted mb-0">Leave event types empty to show a category for every event type.</p>
        <Table loading={loading} empty={!categories.length} head={["Image", "Category", "Event types", "Action"]}>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                <img src={category.image || require("../../../assets/img/Nupload.jpg")} alt="" className="table_img" />
              </td>
              <td>{category.name_en}</td>
              <td className="small">{names(eventTypes, category.event_types) || <span className="text-muted">All</span>}</td>
              <td>
                <button className="comman_btn table_viewbtn" type="button" onClick={() => setEditing({ ...category })}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {editing && (
        <Modal title={`Category: ${editing.name_en}`} onClose={() => setEditing(null)} onSave={save} saving={saving}>
          <div className="form-group col-12">
            <label>Event types (empty = all)</label>
            <Select
              isMulti
              options={eventTypes}
              value={chosen(eventTypes, editing.event_types)}
              onChange={(val) => setEditing((p) => ({ ...p, event_types: (val || []).map((v) => v.value) }))}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

const EventSetup = () => {
  const [tab, setTab] = useState("districts");
  const { cities, eventTypes } = useLists();

  return (
    <NewFlowLayout slide="ES" tabs={TABS} activeTab={tab} onTab={setTab}>
      {tab === "districts" && <Districts cities={cities} />}
      {tab === "eventTypes" && <EventTypes />}
      {tab === "packages" && <Packages cities={cities} />}
      {tab === "categories" && <Categories eventTypes={eventTypes} />}
    </NewFlowLayout>
  );
};

export default EventSetup;
