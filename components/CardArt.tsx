type CardVariant = "sapphire" | "freedom";

const VARIANTS: Record<CardVariant, { label: string; gradient: string; diagonalLines?: boolean; showVisa?: boolean }> = {
  sapphire: {
    label: "Sapphire Preferred",
    gradient: "from-[#0c1c33] via-[#153a63] to-[#2f6ea7]",
    diagonalLines: true,
    showVisa: true,
  },
  freedom: {
    label: "Freedom Flex",
    gradient: "from-[#5a9bdb] to-[#8cc4ec]",
  },
};

export function CardArt({
  size = "lg",
  variant = "sapphire",
}: {
  size?: "sm" | "lg";
  variant?: CardVariant;
}) {
  const isSmall = size === "sm";
  const { label, gradient, diagonalLines, showVisa } = VARIANTS[variant];

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${gradient} ${
        isSmall ? "h-14 w-20" : "aspect-[1.586] w-full"
      }`}
    >
      {diagonalLines && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent, transparent 14px, rgba(255,255,255,0.18) 14px, rgba(255,255,255,0.18) 16px)",
          }}
        />
      )}
      <div className={`relative flex h-full flex-col justify-between ${isSmall ? "p-2" : "p-4"}`}>
        <p
          className={`font-bold uppercase tracking-wide text-white ${
            isSmall ? "text-[10px] leading-tight" : "text-sm"
          }`}
        >
          {label}
        </p>
        {!isSmall && showVisa && (
          <p className="self-end text-xs font-semibold italic text-white/80">VISA Signature</p>
        )}
      </div>
    </div>
  );
}
