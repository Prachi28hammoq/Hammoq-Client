import React from "react";

export default function SubscriptionDetails({
  subscriptions,
  handleCancelSubscription,
  showSubscriptionModal,
}) {
  return (
    <div
      className="my-2 p-2 py-3"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.125)",
        borderRadius: "4px 4px 0 0",
        boxShadow:
          "0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        className="row col-12 m-0 my-1"
        style={{ borderBottom: "1px #eff0f2 solid" }}
      >
        <h2>Subscription details</h2>
      </div>
      {subscriptions.length > 0 ? (
        subscriptions.map(
          ({
            created,
            current_period_end,
            current_period_start,
            cancel_at_period_end,
            id,
            subscription: { amount },
          }) => {
            return (
              <div
                className="row m-0 my-1"
                style={{ borderBottom: "1px #eff0f2 solid" }}
              >
                <div className="col-4">Started : </div>
                <div className="col-8">{created}</div>
                <div className="col-4">Current period : </div>
                <div className="col-8">
                  {current_period_start} to {current_period_end}
                </div>
                <div className="col-4">Amount : </div>
                <div className="col-8">${amount / 100}</div>
                <div className="col-12">
                  {cancel_at_period_end ? (
                    <p className="m-0">
                      This subscription will be inactive on {current_period_end}.
                    </p>
                  ) : (
                    <>
                      <p className="m-0">
                        This subscription will automatically renew on {current_period_end}.
                      </p>
                      <small className="m-0">
                        You can cancel you subscription by clicking{" "}
                        <span
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontStyle: "italic",
                          }}
                          onClick={() => handleCancelSubscription(id)}
                        >
                          here
                        </span>
                        .
                      </small>
                    </>
                  )}
                </div>
              </div>
            );
          }
        )
      ) : (
        <>
          <p className="m-0">You do not have any active subscriptions.</p>
          <button onClick={showSubscriptionModal} className="btn btn-primary">
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}
