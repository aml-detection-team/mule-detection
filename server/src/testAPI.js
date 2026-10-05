const port = Number(process.env.PORT) || 8000;
const apiUrl = process.env.API_URL || `http://localhost:${port}/api/detect`;

// The backend loads transactions from MongoDB when no request body is sent.
const response = await fetch(apiUrl, {
  method: "POST",
});

const result = await response.json();

console.log("API result:");
console.dir(result, { depth: null });

if (!response.ok) {
  console.error(`Detection request failed with status ${response.status}`);
  process.exitCode = 1;
}
