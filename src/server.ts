import "dotenv/config";
import app from "./app";
import { initializeDatabase } from "./database/initialize";

const PORT = process.env.PORT || 3000;

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});