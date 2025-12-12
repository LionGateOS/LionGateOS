import React from "react";

type Variant = "primary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...rest
}) => {
  const base: React.CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.7)",
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
    background:
      variant === "primary"
        ? "radial-gradient(circle at top, rgba(34,197,94,0.96), rgba(22,163,74,0.96))"
        : "radial-gradient(circle at top, rgba(15,23,42,0.94), rgba(15,23,42,0.98))",
    color: variant === "primary" ? "#ecfdf5" : "#e5e7eb",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    boxShadow: "0 8px 18px rgba(15,23,42,0.45)",
  };

  const hover: React.CSSProperties = {
    transform: "translateY(-1px)",
    boxShadow: "0 12px 24px rgba(15,23,42,0.6)",
  };

  const [isHover, setIsHover] = React.useState(false);

  return (
    <button
      style={{ ...base, ...(isHover ? hover : {}) }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...rest}
    >
      {children}
    </button>
  );
};
