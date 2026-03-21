// In-memory fallback database to bypass strict local Wi-Fi MongoDB firewalls
// Persist mocked DB on the Node.js global object so Next.js HMR re-compiles don't wipe it
const initialDB = {
  problems: [],
  solutions: []
};

if (!global.innoverseMockDB) {
  global.innoverseMockDB = initialDB;
}

export const mockDB = global.innoverseMockDB;
