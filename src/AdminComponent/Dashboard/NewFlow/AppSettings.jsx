import React, { useEffect, useState } from "react";
import NewFlowLayout, { Card, Spinner, confirm, done } from "./NewFlowLayout";
import { updateAppConfig, viewAppConfig } from "../../httpServices/newFlowHttpService";

// App-wide settings for the new flow: who sees it, the deposit and the
// cancellation policy shown on Order summary
const FIELDS = [
  "new_flow_rollout_percent",
  "new_flow_kill_switch",
  "min_supported_version",
  "latest_version",
  "deposit_percent",
  "cancellation_policy_en",
  "cancellation_policy_ar",
];

const pick = (config) =>
  Object.fromEntries(
    FIELDS.map((field) => [field, config?.[field] ?? (field === "new_flow_kill_switch" ? false : "")])
  );

const AppSettings = () => {
  const [form, setForm] = useState(pick());
  const [saved, setSaved] = useState(pick());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await viewAppConfig();
      if (data && !data.error) {
        setForm(pick(data.results?.config));
        setSaved(pick(data.results?.config));
      }
      setLoading(false);
    })();
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const save = async (e) => {
    e.preventDefault();
    // Only send what changed
    const changes = Object.fromEntries(FIELDS.filter((f) => form[f] !== saved[f]).map((f) => [f, form[f]]));
    if (!Object.keys(changes).length) return done("Nothing to save");
    if (changes.new_flow_kill_switch === true) {
      const ok = await confirm(
        "Turn the new flow off for everyone?",
        "Every user goes back to the old home screen until you turn this off again.",
        "Turn it off"
      );
      if (!ok) return;
    }
    setSaving(true);
    const { data } = await updateAppConfig(changes);
    setSaving(false);
    if (data && !data.error) {
      setForm(pick(data.results?.config));
      setSaved(pick(data.results?.config));
      done("Settings saved");
    }
  };

  const percent = Number(form.new_flow_rollout_percent) || 0;

  return (
    <NewFlowLayout slide="AS">
      {loading ? (
        <Spinner />
      ) : (
        <form className="col-12 p-0" onSubmit={save}>
          <Card title="New Flow Rollout">
            <div className="form-design py-4 px-3 help-support-form row">
              <div className="form-group col-md-6">
                <label>Users who get the new flow: {percent}%</label>
                <input
                  type="range"
                  className="form-range"
                  min={0}
                  max={100}
                  step={5}
                  value={percent}
                  onChange={set("new_flow_rollout_percent")}
                />
                <small className="text-muted">
                  0% = nobody, 100% = everyone. A user stays in the same group every time they open the app.
                </small>
              </div>
              <div className="form-group col-md-6">
                <label>Emergency switch</label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="killSwitch"
                    checked={Boolean(form.new_flow_kill_switch)}
                    onChange={set("new_flow_kill_switch")}
                  />
                  <label className="form-check-label" htmlFor="killSwitch">
                    {form.new_flow_kill_switch ? "New flow is OFF for everyone" : "Off (rollout % applies)"}
                  </label>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Minimum supported app version</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2.0.0"
                  value={form.min_supported_version}
                  onChange={set("min_supported_version")}
                />
                <small className="text-muted">Older apps are asked to update. Leave empty for no minimum.</small>
              </div>
              <div className="form-group col-md-6">
                <label>Latest app version</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2.0.1"
                  value={form.latest_version}
                  onChange={set("latest_version")}
                />
              </div>
            </div>
          </Card>

          <Card title="Deposit & Cancellation">
            <div className="form-design py-4 px-3 help-support-form row">
              <div className="form-group col-md-4">
                <label>Deposit (% of the order total)</label>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  max={100}
                  step={1}
                  value={form.deposit_percent}
                  onChange={set("deposit_percent")}
                />
                <small className="text-muted">Applies to new quotes, not to orders already placed.</small>
              </div>
              <div className="form-group col-md-8" />
              <div className="form-group col-md-6">
                <label>Cancellation policy (En)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.cancellation_policy_en}
                  onChange={set("cancellation_policy_en")}
                />
              </div>
              <div className="form-group col-md-6">
                <label>Cancellation policy (Ar)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  dir="rtl"
                  lang="ar"
                  value={form.cancellation_policy_ar}
                  onChange={set("cancellation_policy_ar")}
                />
              </div>
            </div>
          </Card>

          <div className="text-center">
            <button className="comman_btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </NewFlowLayout>
  );
};

export default AppSettings;
