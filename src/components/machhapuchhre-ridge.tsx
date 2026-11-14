/**
 * Machhapuchhre (the fishtail, 6,993 m) and the Annapurna range as they stand
 * above Pokhara, traced from a single-weight line drawing of the view made from
 * a photograph taken in Pokhara. Nothing here is invented geometry.
 *
 * 1200 x 134 viewBox, scaled uniformly with the container so the proportions
 * hold at every width (the last 14 units are breathing room for the caption).
 * The summit carries its twin tip and notch (the fishtail), read from the photo.
 * The fishtail is stroked in the accent colour; everything
 * else stays a hairline. It closes the masthead, and it is the only place on the
 * site where the place itself shows up.
 */
const RIDGE =
  "M0 73 L4 72 L7 73 L9 74 L13 74 L18 73 L22 73 L25 73 L29 73 L34 71 L41 69 L45 66 L51 61 L56 59 L61 58 L64 58 L69 59 L76 60 L80 63 L87 65 L91 65 L97 62 L99 62 L101 63 L107 64 L115 67 L119 67 L122 66 L130 66 L134 65 L137 65 L142 69 L151 73 L158 78 L166 81 L177 81 L183 83 L190 86 L203 94 L209 97 L217 97 L231 98 L243 99 L245 98 L254 97 L261 95 L265 95 L268 96 L274 98 L279 99 L285 99 L292 97 L299 97 L302 98 L313 102 L322 101 L328 101 L333 101 L342 105 L348 104 L358 105 L363 104 L366 104 L368 105 L369 105 L371 104 L376 103 L383 103 L384 103 L387 100 L389 99 L393 99 L398 100 L409 94 L413 94 L416 95 L418 95 L422 92 L425 92 L427 94 L431 94 L434 92 L440 93 L446 90 L450 90 L457 94 L462 94 L462 93 L463 92 L469 92 L474 91 L479 88 L483 88 L486 90 L489 90 L491 88 L495 88 L501 90 L503 90 L507 85 L513 86 L515 84 L517 84 L524 86 L526 86 L527 85 L530 83 L537 80 L538 77 L541 74 L551 63 L556 52 L561 45 L563 43 L581 30 L592 18 L596 15 L600 11 L604 6 L607 3 L610 7 L613 5 L616 9 L620 14 L624 18 L628 22 L632 24 L641 38 L647 43 L652 47 L659 54 L667 65 L675 71 L677 74 L683 83 L686 86 L689 87 L695 87 L700 89 L705 89 L709 92 L715 94 L717 94 L720 92 L722 92 L729 99 L731 101 L734 101 L743 103 L752 108 L756 108 L762 106 L764 106 L767 108 L769 108 L771 107 L774 106 L780 108 L782 110 L785 114 L786 114 L788 114 L789 113 L796 113 L799 112 L807 117 L811 118 L820 115 L831 114 L835 111 L841 108 L843 107 L844 104 L846 102 L859 99 L865 95 L865 98 L868 98 L869 95 L880 102 L884 105 L887 109 L896 114 L903 115 L908 116 L921 116 L926 118 L932 118 L935 117 L938 114 L942 112 L954 112 L957 111 L961 106 L966 99 L969 95 L983 87 L987 85 L995 75 L1004 70 L1008 69 L1013 69 L1023 73 L1031 77 L1036 79 L1049 79 L1053 77 L1069 78 L1073 79 L1082 79 L1096 83 L1100 84 L1108 85 L1116 86 L1129 90 L1139 91 L1147 93 L1152 93 L1157 94 L1162 96 L1171 98 L1176 104 L1181 107 L1185 111 L1190 118 L1190 115 L1200 120"

const FISHTAIL =
  "M530 83 L537 80 L538 77 L541 74 L551 63 L556 52 L561 45 L563 43 L581 30 L592 18 L596 15 L600 11 L604 6 L607 3 L610 7 L613 5 L616 9 L620 14 L624 18 L628 22 L632 24 L641 38 L647 43 L652 47 L659 54 L667 65 L675 71 L677 74 L683 83"

export function MachhapuchhreRidge() {
  return (
    <svg
      viewBox="0 0 1200 134"
      className="ridge h-auto w-full"
      role="img"
      aria-label="Line drawing of Machhapuchhre, 6,993 m, and the Annapurna range seen from Pokhara"
    >
      <path
        d={RIDGE}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-foreground/30 transition-colors duration-200 group-hover:text-foreground/45"
      />
      <path
        d={FISHTAIL}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-brand"
      />
    </svg>
  )
}
