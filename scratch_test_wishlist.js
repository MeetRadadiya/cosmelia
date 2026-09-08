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
  console.log("1. Logging in...");
  const loginRes = await request("account/login", "POST", {
    email: "radadiyameet366@gmail.com",
    password: "Password123!",
  });

  console.log("LOGIN RESPONSE:", loginRes);

  const token = loginRes.data?.access_token || loginRes.data?.token;
  if (!token) {
    console.log("No token returned, trying login with email only or checking session...");
  }

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  console.log("\n2. Getting current wishlist...");
  const wishlistRes = await request("account/wishlist", "GET", null, authHeader);
  console.log("WISHLIST RES:", JSON.stringify(wishlistRes, null, 2));

  console.log("\n3. Testing POST account/wishlist with JSON { product_id: '54' }...");
  const addRes1 = await request("account/wishlist", "POST", { product_id: "54" }, authHeader);
  console.log("ADD RES 1 (JSON):", JSON.stringify(addRes1, null, 2));

  console.log("\n4. Testing POST account/wishlist with query string /account/wishlist?product_id=54...");
  const addRes2 = await request("account/wishlist?product_id=54", "POST", null, authHeader);
  console.log("ADD RES 2 (QUERY):", JSON.stringify(addRes2, null, 2));

  console.log("\n5. Testing POST account/wishlist/add with product_id=54...");
  const addRes3 = await request("account/wishlist/add", "POST", { product_id: "54" }, authHeader);
  console.log("ADD RES 3 (ADD ENDPOINT):", JSON.stringify(addRes3, null, 2));

  console.log("\n6. Getting wishlist after add tests...");
  const wishlistRes2 = await request("account/wishlist", "GET", null, authHeader);
  console.log("WISHLIST AFTER:", JSON.stringify(wishlistRes2, null, 2));
}

main().catch(console.error);
