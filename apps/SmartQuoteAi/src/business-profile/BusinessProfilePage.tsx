import React from "react";
import { BusinessIdentityCard } from "./components/BusinessIdentityCard";
import { BusinessMetadataSection } from "./components/BusinessMetadataSection";
import { useLionGateOSBusinessIdentity } from "./hooks/useLionGateOSBusinessIdentity";

export const BusinessProfilePage: React.FC = () => {
  const identity = useLionGateOSBusinessIdentity();

  if (!identity) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Business Profile</h1>
        <p>No business identity available.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Business Profile</h1>
      <BusinessIdentityCard profile={identity} />
      <BusinessMetadataSection profile={identity} />
    </div>
  );
};
