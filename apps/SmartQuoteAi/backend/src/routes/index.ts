import { Router } from "express";
import { healthHandler } from "./health";
import { getPresetsHandler, postEstimateHandler } from "./estimator";
import { generateProposalHandler } from "./proposal";

const router = Router();

router.get("/health", healthHandler);

router.get("/estimator/presets", getPresetsHandler);
router.post("/estimator/estimate", postEstimateHandler);

router.post("/proposal/generate", generateProposalHandler);

export const apiRouter = router;
