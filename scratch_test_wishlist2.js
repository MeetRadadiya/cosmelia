const https = require("https");

function request(path, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api-front.myfathershops.com",
      path: "/api/" + path,
      method: method,
      headers: {
        "X-Tenant": "getcosmelia",
        "x-platform": "fathershops",
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log("1. Fetching common session...");
  const commonRes = await request("common/common", "GET");
  const sessionId = commonRes.data?.session_id || "test_session_123";
  console.log("SESSION ID:", sessionId);

  console.log("\n2. Logging in with session header...");
  const loginRes = await request("account/login", "POST", {
    email: "radadiyameet366@gmail.com",
    password: "Password123!",
  }, { "x-session-id": sessionId });

  console.log("LOGIN SUCCESS:", loginRes.code || loginRes.success);
  const token = loginRes.data?.access_token || loginRes.data?.token;
  console.log("ACCESS TOKEN:", token ? token.slice(0, 20) + "..." : "NONE");

  const authHeaders = {
    "x-session-id": sessionId,
    "Authorization": `Bearer ${token}`,
  };

  console.log("\n3. Testing POST account/wishlist with session + token...");
  const addRes1 = await request("account/wishlist", "POST", { product_id: "54" }, authHeaders);
  console.log("ADD RES 1:", JSON.stringify(addRes1, null, 2));

  console.log("\n4. Testing POST account/wishlist/add with session + token...");
  const addRes2 = await request("account/wishlist/add", "POST", { product_id: "54" }, authHeaders);
  console.log("ADD RES 2:", JSON.stringify(addRes2, null, 2));

  console.log("\n5. Getting wishlist...");
  const wishlistRes = await request("account/wishlist", "GET", null, authHeaders);
  console.log("WISHLIST RES:", JSON.stringify(wishlistRes, null, 2));
}

main().catch(console.error);
