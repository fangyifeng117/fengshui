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
        <rect width="640" height="760" fill="#f7f1e6" />
        <rect x="36" y="36" width="568" height="688" fill="none" stroke="#241f1c" strokeOpacity="0.18" />
        <ellipse cx="320" cy="560" rx="180" ry="22" fill="#e4d8c4" />
        <path d="M210 430c40-150 180-150 220 0" fill="none" stroke="#8e2a22" strokeWidth="16" strokeLinecap="round" />
        <circle cx="318" cy="300" r="12" fill="#241f1c" />
        <path d="M250 455c30 36 90 36 120 0" fill="none" stroke="#8e2a22" strokeWidth="8" />
        <g transform="translate(120 470)">
          {Array.from({ length: 9 }).map((_, index) => (
            <circle
              key={index}
              cx={18 + index * 28}
              cy={index % 2 === 0 ? 18 : 28}
              r={index % 3 === 0 ? 12 : 9}
              fill={index % 3 === 0 ? "#8e2a22" : index % 3 === 1 ? "#fbf7f0" : "#241f1c"}
              stroke="#241f1c"
              strokeWidth="2"
            />
          ))}
        </g>
        <path d="M400 360h120c8 70 8 120 0 180h-120c-8-60-8-110 0-180z" fill="#fbf7f0" stroke="#241f1c" strokeWidth="3" />
        <path d="M412 390h96" stroke="#8e2a22" strokeWidth="8" />
        <rect x="430" y="530" width="60" height="16" fill="#241f1c" />
        <text x="56" y="690" fill="#241f1c" fontFamily="Georgia, serif" fontSize="26">
          {label}
        </text>
      </svg>
    </figure>
  );
}
