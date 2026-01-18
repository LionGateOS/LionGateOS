
import React from "react";

export default function ShellBackground({ image }: { image: string }) {
  return (
    <div
      className="shell-background"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
}
