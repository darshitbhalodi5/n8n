"use client";

export function AwardsMentionsSection() {
  return (
    <section className="relative w-full bg-black py-24 px-8 z-30">
      {/* Main Title */}
      <div className="flex items-center justify-center mb-20">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white uppercase tracking-tight flex items-center gap-3 md:gap-6 whitespace-nowrap">
          <span className="text-5xl md:text-7xl lg:text-8xl">∞</span>
          <span>AWARDS</span>
          <span className="text-3xl md:text-5xl lg:text-6xl">▶</span>
          <span>MENTIONS</span>
        </h1>
      </div>

      {/* Awards Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16 max-w-7xl mx-auto">
        {/* 1. Collision Awards */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path
                d="M30 10 A20 20 0 0 1 30 50"
                stroke="#808080"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M30 10 A20 20 0 0 0 30 50"
                stroke="white"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-white text-lg font-medium">Collision Awards</p>
        </div>

        {/* 2. Creativepool */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="white" strokeWidth="3" fill="none" />
              <path
                d="M20 30 Q30 20 40 30 Q30 40 20 30"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-white text-lg font-medium">Creativepool</p>
        </div>

        {/* 3. The Drum Awards */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="text-white">
              <p className="text-xl font-bold leading-tight">The Drum™</p>
              <p className="text-sm font-bold">Awards</p>
            </div>
          </div>
          <div className="hidden lg:block"></div>
        </div>

        {/* 4. Hermes Creative Awards */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
              <text
                x="60"
                y="20"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                HERMES
              </text>
              <path
                d="M10 25 L20 15 M110 25 L100 15 M20 15 L30 25 M100 15 L90 25"
                stroke="white"
                strokeWidth="2"
              />
              <rect x="20" y="30" width="80" height="20" stroke="white" strokeWidth="2" fill="none" />
              <text
                x="60"
                y="45"
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
              >
                CREATIVE AWARDS
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Awards Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 max-w-7xl mx-auto">
        {/* 1. MUSE Creative Awards */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="50" height="70" viewBox="0 0 50 70" fill="none">
              <path
                d="M25 5 L40 15 L40 55 L25 65 L10 55 L10 15 Z"
                stroke="#C0C0C0"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="25" cy="30" r="8" fill="#C0C0C0" />
              <text
                x="25"
                y="50"
                textAnchor="middle"
                fill="#C0C0C0"
                fontSize="4"
                fontWeight="bold"
              >
                MUSE
              </text>
              <text
                x="25"
                y="55"
                textAnchor="middle"
                fill="#C0C0C0"
                fontSize="3"
              >
                2023 GOLD
              </text>
            </svg>
          </div>
        </div>

        {/* 2. The Drum Awards Digital Industries */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="25" stroke="white" strokeWidth="3" fill="none" />
              <path
                d="M20 20 L30 15 L40 20 L35 30 L40 40 L30 45 L20 40 L25 30 Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">
              The Drum Awards
            </p>
            <p className="text-white text-sm font-medium leading-tight">
              Digital Industries
            </p>
            <p className="text-white text-sm font-bold">WINNER 2022</p>
          </div>
        </div>

        {/* 3. Little Black Book */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect
                x="15"
                y="10"
                width="30"
                height="40"
                stroke="white"
                strokeWidth="3"
                fill="none"
                rx="2"
              />
              <text
                x="30"
                y="35"
                textAnchor="middle"
                fill="white"
                fontSize="24"
                fontWeight="bold"
              >
                B
              </text>
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">
              Little Black Book
            </p>
            <p className="text-white text-sm font-medium leading-tight">
              Celebrating Creativity
            </p>
          </div>
        </div>

        {/* 4. IDEAS AWARDS */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <svg width="50" height="70" viewBox="0 0 50 70" fill="none">
              <rect
                x="5"
                y="5"
                width="40"
                height="60"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <text
                x="25"
                y="15"
                textAnchor="middle"
                fill="white"
                fontSize="6"
                fontWeight="bold"
              >
                IDEAS AWARDS
              </text>
              <text
                x="25"
                y="22"
                textAnchor="middle"
                fill="white"
                fontSize="5"
              >
                WINNER 2018
              </text>
              <line x1="10" y1="30" x2="40" y2="30" stroke="white" strokeWidth="1" />
              <text
                x="25"
                y="50"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                APA
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
