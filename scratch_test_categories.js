const https = require("https");

const options = {
  hostname: "api-front.myfathershops.com",
  path: "/api/product/category",
  method: "GET",
  headers: {
    "X-Tenant": "getcosmelia",
    "x-platform": "fathershops",
    "Content-Type": "application/json",
  },
};

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("STATUS:", res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log("RESPONSE DATA:", JSON.stringify(parsed, null, 2).slice(0, 3000));
    } catch (e) {
      console.log("RAW BODY:", data.slice(0, 1000));
    }
  });
});

req.on("error", (e) => {
  console.error("ERROR:", e);
});

req.end();
