import logoPrimary from "../../assets/logo-primary.png";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const height = size === "lg" ? "h-30" : size === "sm" ? "h-16" : "h-20";
  return (
    <img
      src={logoPrimary}
      alt="FlyBidesh"
      className={`${height} w-auto object-contain`}
    />
  );
}

