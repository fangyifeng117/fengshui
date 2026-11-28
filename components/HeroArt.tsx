export function HeroArt({ label = "Sample" }: { label?: string }) {
  return (
    <figure className="hero-art">
      <svg viewBox="0 0 640 760" role="img" aria-labelledby="heroArtTitle heroArtDesc">
        <title id="heroArtTitle">{label === "Sample" ? "Sample still life" : "样品静物"}</title>
        <desc id="heroArtDesc">
          {label === "Sample"
            ? "Original illustration of a cord bracelet, a beaded bracelet, and a small vessel."
            : "原创图稿：一条绳编手串、一条珠串和一件小器物。"}
        </desc>
        <rect width="640" height="760" fill="#f7f4fb" />
        <rect x="36" y="36" width="568" height="688" fill="none" stroke="#2e1144" strokeOpacity="0.18" />
        <ellipse cx="320" cy="560" rx="180" ry="22" fill="#ede6f4" />
        <path d="M210 430c40-150 180-150 220 0" fill="none" stroke="#4c1d6e" strokeWidth="16" strokeLinecap="round" />
        <circle cx="318" cy="300" r="12" fill="#2e1144" />
        <path d="M250 455c30 36 90 36 120 0" fill="none" stroke="#4c1d6e" strokeWidth="8" />
        <g transform="translate(120 470)">
          {Array.from({ length: 9 }).map((_, index) => (
            <circle
              key={index}
              cx={18 + index * 28}
              cy={index % 2 === 0 ? 18 : 28}
              r={index % 3 === 0 ? 12 : 9}
              fill={index % 3 === 0 ? "#4c1d6e" : index % 3 === 1 ? "#f7f4fb" : "#2e1144"}
              stroke="#2e1144"
              strokeWidth="2"
            />
          ))}
        </g>
        <path d="M400 360h120c8 70 8 120 0 180h-120c-8-60-8-110 0-180z" fill="#f7f4fb" stroke="#2e1144" strokeWidth="3" />
        <path d="M412 390h96" stroke="#4c1d6e" strokeWidth="8" />
        <rect x="430" y="530" width="60" height="16" fill="#2e1144" />
        <text x="56" y="690" fill="#2e1144" fontFamily="Georgia, serif" fontSize="26">
          {label}
        </text>
      </svg>
    </figure>
  );
}
