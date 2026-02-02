import React, { useState } from "react";
import quoteTiers from "./quoteLogic";
import { materialRegistry } from "./materialRegistry";

export const QuotePreview = () => {
  const [tier, setTier] = useState("STANDARD");
  const selectedMaterial = materialRegistry.lumber_2x4_8;
  const calculatedPrice = (selectedMaterial.basePrice * quoteTiers[tier].priceMultiplier).toFixed(2);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '300px' }}>
      <h2>{quoteTiers[tier].label} Quote</h2>
      <p><b>Item:</b> {selectedMaterial.name}</p>
      <p><b>Estimated Cost:</b> ${calculatedPrice}</p>
      <div>
        {Object.keys(quoteTiers).map((t) => (
          <button key={t} onClick={() => setTier(t)} style={{ margin: '5px' }}>
            {quoteTiers[t].label}
          </button>
        ))}
      </div>
    </div>
  );
};
