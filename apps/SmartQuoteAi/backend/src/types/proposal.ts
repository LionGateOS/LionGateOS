import type { EstimateResponse } from "./estimator";

export interface ProposalSection {
  id: string;
  title: string;
  body: string;
}

export interface ProposalMeta {
  clientName: string;
  projectName: string;
  version: string;
  createdAt: string;
  preparedBy: string;
}

export interface ProposalDocument {
  meta: ProposalMeta;
  estimate: EstimateResponse;
  sections: ProposalSection[];
}

export interface ProposalRequestPayload {
  clientName: string;
  projectName: string;
  summary: string;
  risks?: string;
  assumptions?: string;
  preparedBy?: string;
  estimate: EstimateResponse;
}
