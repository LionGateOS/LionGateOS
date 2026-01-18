import React from 'react';
import { BusinessProfile } from '../types/businessProfile.types';

export const BusinessMetadataSection: React.FC<{ profile: BusinessProfile }> = ({ profile }) => (
  <section>
    <h2>Metadata</h2>
    <p><strong>Industry:</strong> {profile.industry ?? '—'}</p>
    <p><strong>Size:</strong> {profile.size ?? '—'}</p>
    {profile.flags && profile.flags.length > 0 && (
      <ul>
        {profile.flags.map((flag) => (
          <li key={flag}>{flag}</li>
        ))}
      </ul>
    )}
  </section>
);
