// Vesalius-style anatomical engraving illustration of a human skull (lateral view).
// Original work — drawn as SVG paths in the spirit of 16th-c. anatomical plates.

function VesaliusSkull({ width = 800, height = 1100 }) {
  return (
    <svg
      viewBox="0 0 800 1100"
      width={width}
      height={height}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "var(--parchment, oklch(0.88 0.025 80))",
      }}
    >
      <defs>
        {/* paper / parchment texture via noise filter */}
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.10 0"/>
        </filter>

        {/* foxing / age stains */}
        <radialGradient id="foxing1" cx="20%" cy="15%" r="40%">
          <stop offset="0%" stopColor="oklch(0.62 0.07 60)" stopOpacity="0.18"/>
          <stop offset="60%" stopColor="oklch(0.62 0.07 60)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="foxing2" cx="85%" cy="85%" r="35%">
          <stop offset="0%" stopColor="oklch(0.55 0.08 50)" stopOpacity="0.22"/>
          <stop offset="60%" stopColor="oklch(0.55 0.08 50)" stopOpacity="0"/>
        </radialGradient>

        {/* hatching patterns — parallel lines for shading */}
        <pattern id="hatchA" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(60)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#1c1612" strokeWidth="0.6" strokeOpacity="0.55"/>
        </pattern>
        <pattern id="hatchB" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(140)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#1c1612" strokeWidth="0.5" strokeOpacity="0.55"/>
        </pattern>
        <pattern id="hatchDense" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(60)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#1c1612" strokeWidth="0.7" strokeOpacity="0.85"/>
        </pattern>
        {/* crosshatch for deep shadow */}
        <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0" x2="4" y2="4" stroke="#1c1612" strokeWidth="0.6"/>
          <line x1="0" y1="4" x2="4" y2="0" stroke="#1c1612" strokeWidth="0.6"/>
        </pattern>
        {/* stippling for soft shading */}
        <pattern id="stipple" patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="1.5" cy="1.5" r="0.5" fill="#1c1612" fillOpacity="0.65"/>
          <circle cx="4.5" cy="4" r="0.45" fill="#1c1612" fillOpacity="0.55"/>
          <circle cx="2" cy="5" r="0.4" fill="#1c1612" fillOpacity="0.45"/>
        </pattern>

        <clipPath id="orbitClip">
          <ellipse cx="280" cy="430" rx="76" ry="60"/>
        </clipPath>
        <clipPath id="meatusClip">
          <ellipse cx="500" cy="500" rx="20" ry="16"/>
        </clipPath>
        <clipPath id="nasalClip">
          <path d="M 245 525 C 235 540, 225 575, 230 605 L 255 615 C 265 595, 270 565, 268 540 C 265 528, 255 522, 245 525 Z"/>
        </clipPath>
      </defs>

      {/* parchment background */}
      <rect x="0" y="0" width="800" height="1100" fill="oklch(0.90 0.028 80)"/>
      <rect x="0" y="0" width="800" height="1100" fill="url(#foxing1)"/>
      <rect x="0" y="0" width="800" height="1100" fill="url(#foxing2)"/>
      <rect x="0" y="0" width="800" height="1100" fill="url(#paperGrain)" opacity="0.7"/>

      {/* engraving — lateral skull, facing LEFT */}
      <g stroke="#1c1612" fill="none" strokeLinecap="round" strokeLinejoin="round">

        {/* —— CRANIUM OUTLINE —— */}
        <path
          d="M 175 320
             C 165 240, 195 175, 250 145
             C 310 115, 380 110, 450 130
             C 530 155, 600 215, 630 305
             C 658 395, 650 485, 615 555
             C 590 605, 555 640, 520 660
             L 480 670"
          strokeWidth="2.2"
          fill="oklch(0.92 0.03 80)"
        />

        {/* mandible (lower jaw) — separate piece */}
        <path
          d="M 180 615
             C 165 640, 165 660, 178 680
             C 195 705, 220 720, 250 728
             C 305 740, 370 738, 420 725
             C 460 715, 485 695, 495 670
             C 500 658, 498 645, 488 638"
          strokeWidth="2"
          fill="oklch(0.92 0.03 80)"
        />

        {/* maxilla / upper jaw under nasal aperture */}
        <path
          d="M 200 595
             C 215 615, 250 625, 290 625
             C 340 625, 395 622, 445 615
             C 470 610, 485 605, 488 595"
          strokeWidth="1.6"
        />

        {/* zygomatic arch (cheekbone bridge) */}
        <path
          d="M 305 510
             C 340 500, 395 495, 450 500
             C 490 503, 520 510, 540 525
             C 555 537, 555 553, 540 562
             C 520 572, 490 575, 460 573"
          strokeWidth="1.8"
          fill="oklch(0.92 0.03 80)"
        />

        {/* zygomatic body (cheek) */}
        <path
          d="M 305 510
             C 285 530, 280 555, 295 575
             C 310 590, 340 600, 380 600"
          strokeWidth="1.6"
          fill="oklch(0.92 0.03 80)"
        />

        {/* —— ORBIT (eye socket) — engraving-style with hatched fill —— */}
        <ellipse cx="280" cy="430" rx="78" ry="62"
          fill="oklch(0.78 0.025 60)"
          stroke="#1c1612" strokeWidth="2"/>
        {/* parallel hatching inside */}
        <g clipPath="url(#orbitClip)">
          <g stroke="#1c1612" strokeWidth="0.8" opacity="0.7">
            {[-50, -42, -34, -26, -18, -10, -2, 6, 14, 22, 30, 38, 46].map((dy, i) => (
              <line key={i} x1={210} y1={430 + dy} x2={350} y2={430 + dy + 15}/>
            ))}
          </g>
        </g>
        {/* deep shadow patch */}
        <ellipse cx="295" cy="445" rx="32" ry="18"
          fill="#1c1612" opacity="0.4"/>
        {/* superior orbital ridge */}
        <path
          d="M 195 395
             C 220 380, 260 372, 305 372
             C 335 372, 360 380, 370 395"
          strokeWidth="1.6"
        />
        {/* orbital floor highlight */}
        <path
          d="M 220 480
             C 245 495, 290 498, 330 490"
          strokeWidth="1"
        />

        {/* —— NASAL APERTURE —— */}
        <path
          d="M 245 525
             C 235 540, 225 575, 230 605
             L 255 615
             C 265 595, 270 565, 268 540
             C 265 528, 255 522, 245 525 Z"
          fill="oklch(0.75 0.025 60)" strokeWidth="1.8"
        />
        <g clipPath="url(#nasalClip)" stroke="#1c1612" strokeWidth="0.7" opacity="0.7">
          {[535, 545, 555, 565, 575, 585, 595, 605].map((y, i) => (
            <line key={i} x1={225} y1={y} x2={272} y2={y + 2}/>
          ))}
        </g>
        {/* nasal bone bridge */}
        <path
          d="M 260 480
             L 248 525"
          strokeWidth="1.2"
        />
        <path
          d="M 280 475
             L 275 525"
          strokeWidth="1.0"
        />

        {/* —— FRONTAL BONE shading — hatching on forehead curve —— */}
        <path
          d="M 200 320
             C 230 230, 290 180, 360 170
             C 420 165, 470 175, 510 200
             C 480 200, 440 210, 400 230
             C 350 250, 290 290, 245 340
             Z"
          fill="url(#hatchA)" opacity="0.55" stroke="none"
        />

        {/* —— PARIETAL shading (top of cranium, lighter) —— */}
        <path
          d="M 380 145
             C 460 140, 540 175, 595 240
             C 635 290, 650 360, 645 420
             C 620 380, 600 350, 575 320
             C 540 280, 490 240, 440 200
             C 420 180, 400 165, 380 145 Z"
          fill="url(#hatchB)" opacity="0.35" stroke="none"
        />

        {/* —— TEMPORAL FOSSA — softer stipple —— */}
        <path
          d="M 380 380
             C 420 370, 465 365, 500 370
             C 530 375, 550 390, 550 415
             C 550 445, 530 470, 500 485
             C 470 498, 430 498, 405 488
             C 380 478, 370 455, 370 425
             C 370 405, 374 388, 380 380 Z"
          fill="url(#stipple)" opacity="0.5" stroke="none"
        />

        {/* —— SUTURES (the key feature for this thesis) —— */}
        {/* CORONAL suture — running across the frontal/parietal boundary */}
        <path
          d="M 220 215
             C 245 220, 275 215, 310 205
             C 345 195, 380 195, 415 205
             C 445 213, 470 220, 490 218"
          strokeWidth="1.4"
          opacity="0.95"
        />
        {/* zigzag detail */}
        <path
          d="M 235 212 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6
             l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6
             l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6 l 5 -3 l 3 6
             l 5 -3 l 3 6 l 5 -3 l 3 6"
          strokeWidth="0.7" opacity="0.7"
        />

        {/* SQUAMOUS suture — above the ear */}
        <path
          d="M 360 360
             C 400 350, 450 345, 500 350
             C 545 355, 580 365, 605 380"
          strokeWidth="1.4"
          opacity="0.95"
        />
        {/* LAMBDOID suture — at the back */}
        <path
          d="M 600 380
             C 620 415, 635 460, 645 510
             C 650 545, 645 580, 635 605"
          strokeWidth="1.4"
          opacity="0.95"
        />

        {/* —— EXTERNAL AUDITORY MEATUS (ear hole) —— */}
        <ellipse cx="500" cy="500" rx="22" ry="18"
          fill="oklch(0.75 0.025 60)" stroke="#1c1612" strokeWidth="1.6"/>
        <g clipPath="url(#meatusClip)" stroke="#1c1612" strokeWidth="0.7" opacity="0.7">
          {[486, 494, 502, 510, 518].map((y, i) => (
            <line key={i} x1={480} y1={y} x2={520} y2={y}/>
          ))}
        </g>

        {/* mastoid process — below ear */}
        <path
          d="M 510 540
             C 525 555, 528 575, 522 595
             C 515 610, 500 612, 488 605"
          strokeWidth="1.6"
        />

        {/* —— TEETH —— */}
        <g strokeWidth="0.9" fill="oklch(0.93 0.025 80)">
          {[230, 252, 274, 296, 318, 340, 362, 384, 406, 428, 450].map((x, i) => (
            <rect key={i} x={x} y={612} width="18" height="22" rx="2"/>
          ))}
        </g>
        <g strokeWidth="0.9" fill="oklch(0.93 0.025 80)">
          {[232, 254, 276, 298, 320, 342, 364, 386, 408, 430].map((x, i) => (
            <rect key={i} x={x} y={642} width="18" height="22" rx="2"/>
          ))}
        </g>

        {/* —— FINE DETAILS —— */}
        <path
          d="M 300 490
             C 330 510, 380 525, 430 525
             L 430 545
             C 380 545, 330 535, 295 515 Z"
          fill="url(#hatchDense)" opacity="0.5" stroke="none"
        />

        {/* chin highlight curve */}
        <path
          d="M 215 705
             C 240 725, 285 735, 330 735"
          strokeWidth="1"
        />

      </g>

      {/* —— ANATOMICAL LABELS (in the spirit of Vesalius's annotated plates) —— */}
      <g fontFamily="var(--serif, 'Instrument Serif')" fontStyle="italic"
         fill="#2a1f15" style={{pointerEvents: "none"}}>
        <g fontSize="17">
          <text x="385" y="120" textAnchor="middle">Calvaria</text>
          <text x="690" y="285" textAnchor="start">Os parietale</text>
          <text x="700" y="510" textAnchor="start">Os occipitale</text>
          <text x="110" y="430" textAnchor="end" >Orbita</text>
          <text x="115" y="560" textAnchor="end">Apertura piriformis</text>
          <text x="110" y="685" textAnchor="end">Mandibula</text>
          <text x="680" y="640" textAnchor="start">Processus mastoideus</text>
        </g>

        {/* hairline pointer lines from labels to anatomy */}
        <g stroke="#2a1f15" strokeWidth="0.6" opacity="0.7">
          <path d="M 385 128 L 385 145" fill="none"/>
          <path d="M 685 285 L 580 280" fill="none"/>
          <path d="M 695 510 L 635 510" fill="none"/>
          <path d="M 120 430 L 200 430" fill="none"/>
          <path d="M 125 560 L 225 580" fill="none"/>
          <path d="M 120 685 L 195 695" fill="none"/>
          <path d="M 675 640 L 530 600" fill="none"/>
        </g>
      </g>

      {/* —— TITLE BAR — bottom, classical plate placement —— */}
      <g fontFamily="var(--serif, 'Instrument Serif')" fill="#1c1612">
        <line x1="180" y1="855" x2="620" y2="855" stroke="#1c1612" strokeWidth="0.4"/>
        <text x="400" y="890" textAnchor="middle"
          fontSize="26" fontStyle="italic" letterSpacing="0.02em">
          Cranium humanum
        </text>
        <text x="400" y="918" textAnchor="middle"
          fontSize="14" fontStyle="italic" opacity="0.7">
          Norma lateralis sinistra
        </text>
        <line x1="280" y1="940" x2="520" y2="940" stroke="#1c1612" strokeWidth="0.4"/>
        <text x="400" y="965" textAnchor="middle"
          fontSize="11" fontFamily="var(--mono, 'JetBrains Mono')"
          letterSpacing="0.2em" opacity="0.6">
          TAB · I · MMXXVI
        </text>
      </g>
    </svg>
  );
}

Object.assign(window, { VesaliusSkull });
