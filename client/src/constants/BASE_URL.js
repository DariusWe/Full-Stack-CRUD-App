export default process.env.REACT_APP_ENVIRONMENT === "local"
  ? "http://localhost:3001"
  : "https://full-stack-crud-app-production.up.railway.app";
