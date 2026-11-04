import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import NewFlowLayout, { Card, Pager, Spinner, confirm, done } from "./NewFlowLayout";
import { getEventOrders, setEventOrderStatus } from "../../httpServices/newFlowHttpService";

// Orders from the new event flow. Until providers confirm in their own app
// (Option B), the Anasa team moves each order on for them from here; every
// change notifies the buyer.
const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "SUBMITTED", label: "Waiting for providers" },
  { key: "PROVIDERS_ACCEPTED", label: "Providers accepted" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "COMPLETED", label: "Completed" },
  { key: "AWAITING_DEPOSIT", label: "Awaiting deposit" },
  { key: "CANCELLED", label: "Cancelled" },
];

const STATUS_LABELS = {
  AWAITING_DEPOSIT: ["Awaiting deposit", "bg-secondary"],
  SUBMITTED: ["Waiting for providers", "bg-warning text-dark"],
  PROVIDERS_ACCEPTED: ["Providers accepted", "bg-info text-dark"],
  CONFIRMED: ["Confirmed", "bg-primary"],
  COMPLETED: ["Completed", "bg-success"],
  CANCELLED: ["Cancelled", "bg-danger"],
};

// The next step for each status (helpers/orderStatus.js NEXT on the server)
const NEXT_STEP = {
  SUBMITTED: { status: "PROVIDERS_ACCEPTED", label: "Providers accepted" },
  PROVIDERS_ACCEPTED: { status: "CONFIRMED", label: "Confirm booking" },
  CONFIRMED: { status: "COMPLETED", label: "Mark completed" },
};
const CAN_CANCEL = ["AWAITING_DEPOSIT", "SUBMITTED", "PROVIDERS_ACCEPTED", "CONFIRMED"];

const GUESTS = { UNDER_20: "Under 20", "20_50": "20–50", "50_100": "50–100", "100_PLUS": "100+" };

const sar = (amount) =>
  amount == null ? "-" : `SAR ${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const phone = (buyer) =>
  buyer ? `+${String(buyer.country_code || "966").replace("+", "")} ${buyer.phone_number}` : "";

const StatusBadge = ({ status }) => {
  const [label, tone] = STATUS_LABELS[status] || [status, "bg-secondary"];
  return <span className={`badge ${tone}`}>{label}</span>;
};

const EventOrders = () => {
  const [status, setStatus] = useState("SUBMITTED");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getEventOrders({ status: status || undefined, page, pageSize: 20 });
    if (data && !data.error) {
      setOrders(data.results?.orders || []);
      setTotal(data.results?.total || 0);
      setTotalPages(data.results?.totalPages || 1);
    }
    setLoading(false);
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const move = async (order, next) => {
    const cancelling = next === "CANCELLED";
    const paid = order.deposit?.status === "PAID";
    const ok = await confirm(
      cancelling ? `Cancel order ${order.order_number}?` : `Move order ${order.order_number} on?`,
      cancelling
        ? paid
          ? `The deposit of ${sar(order.deposit.amount)} will be refunded to the buyer.`
          : "The buyer has not paid a deposit, so there is nothing to refund."
        : `New status: ${STATUS_LABELS[next][0]}. The buyer gets a notification.`,
      cancelling ? "Cancel order" : "Yes, move it"
    );
    if (!ok) return;
    setBusyId(order._id);
    const { data } = await setEventOrderStatus({ orderId: order._id, status: next });
    setBusyId(null);
    if (data && !data.error) {
      done(data.results?.refunded ? "Order cancelled and deposit refunded" : "Order updated");
      setViewing(null);
      load();
    }
  };

  // The details modal reuses these, without its own View button
  const actions = (order, inModal = false) => {
    const next = NEXT_STEP[order.status];
    const busy = busyId === order._id;
    return (
      <div className="d-flex flex-wrap gap-1">
        {!inModal && (
          <button className="comman_btn table_viewbtn" type="button" onClick={() => setViewing(order)}>
            View
          </button>
        )}
        {next && (
          <button className="comman_btn table_viewbtn" type="button" disabled={busy} onClick={() => move(order, next.status)}>
            {next.label}
          </button>
        )}
        {CAN_CANCEL.includes(order.status) && (
          <button className="comman_btn bg-red table_viewbtn" type="button" disabled={busy} onClick={() => move(order, "CANCELLED")}>
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <NewFlowLayout
      slide="NFO"
      tabs={STATUS_TABS}
      activeTab={status}
      onTab={(key) => {
        setStatus(key);
        setPage(1);
      }}
    >
      <Card title="New-Flow Orders" right={<span className="text-muted">Total: {total}</span>} className="">
        <div className="row">
          <div className="col-12 comman_table_design px-0">
            <div className="table-responsive p-0">
              {loading ? (
                <Spinner />
              ) : orders.length === 0 ? (
                <div className="text-center py-5 text-muted">No orders here.</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Buyer</th>
                      <th>Event</th>
                      <th>Total</th>
                      <th>Deposit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>{order.order_number}</strong>
                          <div className="text-muted small">
                            {order.ordered_at ? moment(order.ordered_at).format("DD MMM YYYY, hh:mm A") : ""}
                          </div>
                        </td>
                        <td>
                          {order.buyer?.full_name || "-"}
                          <div className="text-muted small">
                            {phone(order.buyer)}
                          </div>
                        </td>
                        <td>
                          {order.event?.type?.name_en || "-"}
                          <div className="text-muted small">
                            {order.event?.event_date} · {order.event?.city?.city} ·{" "}
                            {GUESTS[order.event?.guest_range] || order.event?.guest_range} guests
                          </div>
                        </td>
                        <td>{sar(order.quote?.total)}</td>
                        <td>
                          {sar(order.deposit?.amount ?? order.quote?.deposit_due)}
                          <div className="text-muted small">{order.deposit?.status || "Not paid"}</div>
                        </td>
                        <td>
                          <StatusBadge status={order.status} />
                        </td>
                        <td>{actions(order)}</td>
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

      {viewing && <OrderDetails order={viewing} actions={actions(viewing, true)} onClose={() => setViewing(null)} />}
    </NewFlowLayout>
  );
};

const Row = ({ label, children }) => (
  <div className="d-flex justify-content-between border-bottom py-2">
    <span className="text-muted">{label}</span>
    <span className="text-end">{children}</span>
  </div>
);

const OrderDetails = ({ order, actions, onClose }) => {
  const { event = {}, quote = {}, deposit = {} } = order;
  return (
    <>
      <div className="modal show d-block comman_modal" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title">
                Order {order.order_number} <StatusBadge status={order.status} />
              </h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body px-4">
              <h6 className="mt-2">Buyer</h6>
              <Row label="Name">{order.buyer?.full_name || "-"}</Row>
              <Row label="Phone">{phone(order.buyer) || "-"}</Row>

              <h6 className="mt-4">Event</h6>
              <Row label="Type">
                {event.type?.name_en} {event.age_group ? `(${event.age_group})` : ""}
              </Row>
              <Row label="Date">{event.event_date}</Row>
              <Row label="City">{event.city?.city}</Row>
              <Row label="Guests">{GUESTS[event.guest_range] || event.guest_range}</Row>
              {event.description && <Row label="Notes">{event.description}</Row>}

              <h6 className="mt-4">What they ordered</h6>
              {(quote.lines || []).map((line, index) => (
                <div key={index} className="border-bottom py-2">
                  <div className="d-flex justify-content-between">
                    <strong>{line.type === "delivery" ? "Delivery" : line.name}</strong>
                    <span>{sar(line.price)}</span>
                  </div>
                  {line.provider && <div className="text-muted small">Provider: {line.provider}</div>}
                  {(line.items || []).map((item) => (
                    <div key={item.serviceId} className="text-muted small">
                      • {item.name} — {item.provider}
                    </div>
                  ))}
                  {(line.options || []).map((option, i) => (
                    <div key={i} className="text-muted small">
                      • {option.group}: {option.option} ({sar(option.price)})
                    </div>
                  ))}
                </div>
              ))}
              <Row label="Total">{sar(quote.total)}</Row>
              <Row label={`Deposit (${quote.deposit_percent ?? "-"}%)`}>{sar(quote.deposit_due)}</Row>
              <Row label="Remaining before the event">{sar(quote.remaining_before_event)}</Row>

              <h6 className="mt-4">Deposit payment</h6>
              <Row label="Status">{deposit.status || "Not paid"}</Row>
              {deposit.reference && <Row label="Reference">{deposit.reference}</Row>}
              {deposit.payment_id && <Row label="DineroPay id">{deposit.payment_id}</Row>}
              {deposit.paid_at && <Row label="Paid">{moment(deposit.paid_at).format("DD MMM YYYY, hh:mm A")}</Row>}
              {deposit.refunded_at && <Row label="Refunded">{moment(deposit.refunded_at).format("DD MMM YYYY, hh:mm A")}</Row>}
              {order.cancelled_at && (
                <Row label="Cancelled">
                  {moment(order.cancelled_at).format("DD MMM YYYY, hh:mm A")} by {order.cancelled_by}
                </Row>
              )}
            </div>
            <div className="modal-footer">{actions}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
};

export default EventOrders;
