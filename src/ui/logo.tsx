type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
};

export function GreenCoinLogo({ size = "md", showText = true, className }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gc-coin-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gc-shine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="gc-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#15803d" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer coin ring */}
        <circle cx="24" cy="24" r="22" fill="url(#gc-coin-grad)" filter="url(#gc-shadow)" />

        {/* Inner coin bevel */}
        <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

        {/* Shine overlay */}
        <ellipse cx="20" cy="16" rx="10" ry="6" fill="url(#gc-shine)" />

        {/* G letter mark */}
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontWeight="800"
          fontSize="22"
          fill="white"
          letterSpacing="-1"
        >
          G
        </text>

        {/* Small leaf accent at top-right */}
        <path
          d="M36 10 C38 7, 42 8, 41 12 C40 15, 36 14, 36 10Z"
          fill="#86efac"
          opacity="0.85"
        />
      </svg>

      {showText && (
        <span
          className={`${text} font-extrabold tracking-tight leading-none`}
          style={{
            background: "linear-gradient(to right, #16a34a, #22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          GreenCoin
        </span>
      )}
    </div>
  );
}
