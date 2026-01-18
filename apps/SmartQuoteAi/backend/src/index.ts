import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  })
);
app.use(express.json());
app.use(requestLogger);

// API routes
app.use("/api", apiRouter);

// Static demo UI (estimator console)
const publicDir = path.join(__dirname, "..", "public");
app.use("/", express.static(publicDir));

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[SmartQuoteAI Pro Backend] Listening on port ${env.port} (${env.nodeEnv})`);
  console.log(`Estimator demo UI available at http://localhost:${env.port}/estimator-demo.html`);
});
