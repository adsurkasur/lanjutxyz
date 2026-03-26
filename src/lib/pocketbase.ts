import PocketBase from "pocketbase";

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://pb.adsurkasur.my.id";

export const pb = new PocketBase(pbUrl);

// Optional: Enable auto-cancellation for all requests
pb.autoCancellation(false);

// Add Cloudflare Access Service Token headers if available
// Note: These will only be available on the server side unless prefixed with NEXT_PUBLIC_
const clientId = process.env.CF_ACCESS_CLIENT_ID || process.env.NEXT_PUBLIC_CF_ACCESS_CLIENT_ID;
const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET || process.env.NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET;

if (clientId && clientSecret) {
  pb.beforeSend = function (url, options) {
    options.headers = {
      ...options.headers,
      "CF-Access-Client-Id": clientId,
      "CF-Access-Client-Secret": clientSecret,
    };
    return { url, options };
  };
}
