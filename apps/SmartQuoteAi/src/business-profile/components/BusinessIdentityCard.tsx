import React from 'react';
import { BusinessProfile } from '../types/businessProfile.types';

export const BusinessIdentityCard: React.FC<{ profile: BusinessProfile }> = ({ profile }) => (
  <section>
    <h2>Identity</h2>
    <p><strong>Business Name:</strong> {profile.businessName}</p>
    <p><strong>Legal Name:</strong> {profile.legalName}</p>
    <p><strong>Jurisdiction:</strong> {profile.jurisdiction}</p>
    <p><strong>Status:</strong> {profile.status}</p>
  </section>
);
