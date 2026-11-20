/**
 * Feature flags derived from environment variables. Integrations that are not
 * configured are reported as unavailable — the UI must never pretend they work.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
};

export const isSupabaseConfigured = () => Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);

/** Server-only checks. Never import the values into client components. */
export const serverEnv = {
  get serviceRoleKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  },
  get razorpayKeySecret() {
    return process.env.RAZORPAY_KEY_SECRET || "";
  },
  get razorpayWebhookSecret() {
    return process.env.RAZORPAY_WEBHOOK_SECRET || "";
  },
  get ipHashSalt() {
    return process.env.IP_HASH_SALT || "";
  },
};

export const isServiceRoleConfigured = () => isSupabaseConfigured() && Boolean(serverEnv.serviceRoleKey);

export const isPaymentsConfigured = () =>
  Boolean(publicEnv.razorpayKeyId && serverEnv.razorpayKeySecret && serverEnv.razorpayWebhookSecret) &&
  isServiceRoleConfigured() &&
  process.env.PAYMENTS_ENABLED === "true";
