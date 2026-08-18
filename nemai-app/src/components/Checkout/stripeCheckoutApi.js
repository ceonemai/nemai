const customerApiUrl = "https://customer-api.nemai.io";

const SILVER_PUFF_PRIO_PAYMENT_LINK = "https://buy.stripe.com/test_3cI9ASfNybAp7Qc6le4Ja00";
const GOLDEN_PUFF_PRIO_PAYMENT_LINK = "https://buy.stripe.com/test_3cIfZg7h2cEt7QceRK4Ja01";
const GOLDEN_PUFF_PRIO_UPGRADE_PAYMENT_LINK = "https://buy.stripe.com/test_cNicN4dFqbAp2vS4d64Ja02";

const PAYMENT_LINKS_BY_PLAN = {
  plus: SILVER_PUFF_PRIO_PAYMENT_LINK,
  pro: GOLDEN_PUFF_PRIO_PAYMENT_LINK,
  silver: SILVER_PUFF_PRIO_PAYMENT_LINK,
  golden: GOLDEN_PUFF_PRIO_PAYMENT_LINK
};

export const getStripePaymentLinkForPlan = (planCode) => {
  return PAYMENT_LINKS_BY_PLAN[planCode] || "";
};

export const getStripePaymentLinkForUpgrade = (planCode) => {
  return planCode === "pro" ? GOLDEN_PUFF_PRIO_UPGRADE_PAYMENT_LINK : "";
};

export const updatePuffSubscription = async ({
  getAccessToken,
  userId,
  planCode,
  startsAt,
  endsAt,
  note,
  idempotencyKey,
  isUpgrade = false
}) => {
  if (typeof getAccessToken !== "function") {
    throw new Error("Missing getAccessToken function.");
  }

  if (!userId) {
    throw new Error("Missing user id for subscription update.");
  }

  if (!planCode) {
    throw new Error("Missing membership plan code.");
  }

  const token = await getAccessToken();
  const endpoint = `${customerApiUrl}/api/v1/admin/puff/subscriptions`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  if (idempotencyKey) {
    headers["X-Idempotency-Key"] = idempotencyKey;
  }

  const response = await fetch(endpoint, {
    method: isUpgrade ? "PATCH" : "POST",
    headers,
    body: JSON.stringify({
      starts_at: startsAt,
      ends_at: endsAt,
      note,
      plan_code: planCode,
      user_id: userId
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update subscription (status ${response.status}).`);
  }

  return response.json().catch(() => ({}));
};
