export const WIDTH = 1800;
export const HEIGHT = 1080;

const c = {
  ink: '#292c30', gold: '#d4ad50', paleGold: '#efd68b', ochre: '#ad7c33',
  teal: '#287a78', lightTeal: '#4b9990', blue: '#194c84', navy: '#173355',
  ivory: '#e2dfc8', white: '#f1e9d2', silver: '#bfc7c5', red: '#9a3d3c',
  skin: '#b48852', darkSkin: '#775536', hair: '#453a2a',
};

const path = (d, fill, stroke = c.ink, width = 4, extra = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const rect = (x, y, w, h, fill, stroke = 'none', width = 3, radius = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const circle = (x, y, r, fill, stroke = 'none', width = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const ellipse = (x, y, rx, ry, fill, stroke = c.ink, width = 3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const line = (x, y, x2, y2, stroke, width = 4) => `<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
const text = (value, x, y, size = 27, color = c.ink, spacing = 3) => `<text x="${x}" y="${y}" fill="${color}" font-family="Georgia,Times New Roman,serif" font-size="${size}" font-weight="600" text-anchor="middle" letter-spacing="${spacing}">${value}</text>`;
const group = (content, transform) => `<g transform="${transform}">${content}</g>`;

const beadBorder = (x, y, w, h) => {
  let s = rect(x, y, w, h, 'none', c.ink, 8, 4) + rect(x + 8, y + 8, w - 16, h - 16, 'none', c.red, 4, 2);
  for (let i = 20; i < w - 10; i += 30) {
    s += circle(x + i, y + 2, 5, c.ivory, c.ink, 2) + circle(x + i, y + h - 2, 5, c.ivory, c.ink, 2);
  }
  return s;
};

const column = (x) => {
  let s = rect(x, 18, 90, 1034, c.ink) + rect(x + 12, 60, 66, 914, c.ivory);
  for (let y = 70; y < 930; y += 115) {
    s += path(`M${x + 12} ${y + 85}L${x + 78} ${y + 20}V${y + 60}L${x + 12} ${y + 125}Z`, c.teal, c.ink, 4);
    s += line(x + 14, y + 97, x + 77, y + 35, c.paleGold, 5);
  }
  s += path(`M${x + 2} 20H${x + 88}L${x + 72} 73H${x + 18}Z`, c.gold, c.ink, 5);
  s += path(`M${x + 18} 973H${x + 72}L${x + 86} 1038H${x + 4}Z`, c.ivory, c.ink, 5);
  return s + rect(x - 6, 1030, 102, 25, c.teal, c.ink, 5);
};

const palm = (x, y, scale = 1) => {
  let s = path('M-10 0L-5 -310H10L18 0Z', c.ochre, c.ink, 3);
  for (let i = 0; i < 11; i++) {
    const angle = -82 + i * 16.4;
    s += group(path('M0 0Q-45 -85 4 -230Q48 -112 0 0Z', i % 2 ? c.lightTeal : c.teal, c.ink, 3) + line(0, 0, 4, -210, c.paleGold, 2), `translate(0 -295) rotate(${angle}) scale(.48 .95)`);
  }
  s += circle(-12, -287, 15, c.red, c.ink, 3) + circle(10, -282, 12, c.red, c.ink, 3);
  for (let yy = -280; yy < -15; yy += 20) s += line(-7, yy, 14, yy + 5, c.ink, 3);
  s += path('M-70 0Q-105 -90 -62 -138L-17 -8Q-42 -122 -10 -172L7 -14Q25 -130 72 -157L24 0Z', c.teal, c.ink, 4);
  return group(s, `translate(${x} ${y}) scale(${scale})`);
};

const foliage = (x, y, width = 280) => {
  let s = '';
  for (let i = 0; i < 10; i++) {
    const xx = x + (i / 9) * width;
    s += path(`M${xx} ${y}Q${xx - 18} ${y - 180} ${xx + 12} ${y - 360}`, 'none', c.teal, 7);
    for (let j = 0; j < 5; j++) {
      const yy = y - 60 - j * 60;
      s += path(`M${xx + 3} ${yy}Q${xx - 65} ${yy - 55} ${xx - 25} ${yy - 75}Q${xx + 12} ${yy - 40} ${xx + 3} ${yy}Z`, c.teal, c.ink, 2);
      s += path(`M${xx + 3} ${yy - 15}Q${xx + 75} ${yy - 70} ${xx + 50} ${yy - 90}Q${xx + 15} ${yy - 50} ${xx + 3} ${yy - 15}Z`, c.lightTeal, c.ink, 2);
      if (j % 2 === 0) s += circle(xx + 5, yy - 20, 12, c.red, c.ink, 2);
    }
  }
  return s;
};

const face = (skin = c.skin, hair = c.hair, female = false) => {
  let s = path('M-27 -72Q-50 -102 -36 -140Q-15 -174 24 -157Q45 -149 44 -124L45 -109L57 -90L40 -86Q46 -58 14 -57L14 -29L-28 -29Z', skin, c.ink, 4);
  s += path(female ? 'M-39 -79Q-74 -76 -61 -128Q-50 -185 14 -172Q63 -170 45 -121Q18 -131 15 -146Q-12 -151 -23 -124L-17 -84L-30 -62Z' : 'M-39 -100Q-63 -158 -28 -176Q21 -196 45 -150L45 -125Q16 -136 12 -153Q-26 -137 -28 -102Z', hair, c.ink, 4);
  s += path('M16 -110Q28 -119 39 -111M18 -99L33 -100M34 -80L44 -80', 'none', c.ink, 3);
  s += circle(29, -108, 3, c.ink) + path('M-29 -102Q-43 -119 -40 -91Q-36 -80 -28 -91', 'none', c.ink, 3);
  s += path('M-26 -62Q-2 -43 15 -58', 'none', c.ochre, 3);
  return s;
};

const standingTraveler = (x, y, scale = 1, pose = 'waiting') => {
  let s = path('M-59 28L-46 234L-63 436L-12 436L15 234L41 435H90L65 205L52 33Z', c.navy, c.ink, 5);
  s += path('M-65 433Q-95 443 -80 460H-7V431M38 434Q28 453 48 461H110Q116 446 81 436', c.ivory, c.ink, 4);
  s += path('M-30 -30L-91 -3L-103 129L-78 165L-38 153L-16 31L25 148L74 152L92 128L70 -1L18 -30Z', c.ivory, c.ink, 5);
  s += path('M-30 -29L-7 28L17 -29L41 14L21 50L42 139M-7 28L-28 147M-81 28L-64 133M60 27L68 127', 'none', c.ink, 3);
  s += path('M-79 161L-81 229Q-53 261 -46 232L-55 152Z', c.skin, c.ink, 4);
  s += pose === 'glass'
    ? path('M66 130L113 137L142 71L133 59L119 64L96 103L74 93Z', c.skin, c.ink, 4) + wineGlass(139, 45, .55)
    : path('M66 127L106 143L140 103L146 115L125 166Q116 184 97 181L57 156Z', c.skin, c.ink, 4);
  s += face();
  s += rect(-150, 261, 67, 188, c.silver, c.ink, 5, 9) + path('M-140 261V226Q-116 214 -93 226V261', 'none', c.ink, 5);
  s += line(-138, 274, -138, 432, c.ivory, 4) + line(-96, 274, -96, 432, c.ink, 3);
  s += circle(-134, 452, 7, c.ink) + circle(-100, 452, 7, c.ink);
  return group(s, `translate(${x} ${y}) scale(${scale})`);
};

const guard = (x, y, scale = 1) => {
  let s = path('M-48 50L-55 218L-42 419L-2 419L12 230L55 420H91L65 208L54 52Z', c.ivory, c.ink, 5);
  s += path('M-55 419L-69 455H-3L-2 419M54 420L58 455H117L90 419', c.skin, c.ink, 5);
  s += path('M-35 -28L-86 -1L-92 113L-59 160L-24 141L-6 31L37 142L87 152L99 121L70 0L12 -28Z', c.silver, c.ink, 5);
  for (let y = 25; y < 139; y += 20) s += path(`M-22 ${y}Q19 ${y + 20} 55 ${y}`, 'none', c.ink, 3);
  s += path('M34 27L68 185L105 206L116 369L79 353L54 206L-8 31Z', c.red, c.ink, 4);
  s += face(c.skin, '#807f73');
  s += path('M-43 -115Q-39 -178 13 -176Q55 -166 49 -119L-24 -119L-28 -60H-53Z', c.silver, c.ink, 4);
  s += path('M-49 -150Q-20 -212 47 -178L40 -166Q-16 -187 -38 -133Z', c.red, c.ink, 4);
  s += path('M-93 153L-110 200L-83 209L-64 151M90 148L121 180L138 167L114 126', c.skin, c.ink, 4);
  s += line(137, -181, 137, 450, c.ochre, 8) + path('M137 -229L120 -183L137 -170L154 -183Z', c.silver, c.ink, 4);
  return group(s, `translate(${x} ${y}) scale(${scale})`);
};

const portrait = () => {
  let s = circle(900, 462, 410, c.teal, c.ink, 9) + circle(900, 462, 388, c.ivory, c.ink, 4) + circle(900, 462, 366, c.blue, c.ink, 6);
  for (let i = 0; i < 48; i++) {
    const a = i * Math.PI / 24;
    s += circle(900 + Math.cos(a) * 398, 462 + Math.sin(a) * 398, 8, i % 3 ? c.paleGold : c.red, c.ink, 2);
  }
  s += path('M618 782Q667 653 781 622L822 553L928 563L951 628Q1081 661 1162 782Q917 934 618 782Z', c.ivory, c.ink, 7);
  s += path('M681 737Q859 800 1092 732M698 706Q855 754 1009 697M755 656Q811 713 949 734M737 671Q771 774 768 841M982 664Q927 744 870 864', 'none', c.ink, 5);
  s += path('M813 525L815 617Q856 676 951 628L935 554L956 527Q973 518 968 490L975 478L965 464L984 452L966 413L948 382L945 328Q900 249 815 288Q736 326 748 415L769 491Z', c.skin, c.ink, 6);
  s += path('M814 534Q873 581 935 555L927 611Q864 624 819 585Z', c.ochre, 'none');
  s += path('M865 395Q904 374 944 391L918 413Q891 415 865 395Z', c.ivory, c.ink, 5) + circle(917, 397, 8, c.ink);
  s += path('M861 377Q907 356 950 378M943 393L949 433L939 451M945 478L966 481M953 495L967 495', 'none', c.ink, 5);
  s += path('M745 437Q729 396 757 321Q796 232 907 257Q956 271 966 311L951 339Q846 298 793 376L799 457L828 491L798 541L745 521Z', c.silver, c.ink, 7);
  s += path('M744 344Q843 252 967 302L978 331Q853 284 762 370Z', c.ivory, c.ink, 5);
  s += path('M752 323Q814 180 944 235L961 287Q859 224 758 345Z', c.red, c.ink, 6);
  for (let i = 0; i < 22; i++) s += line(771 + i * 8, 298 - Math.sin(i / 21 * Math.PI) * 42, 769 + i * 8, 250 - Math.sin(i / 21 * Math.PI) * 30, c.ink, 3);
  s += path('M794 432Q831 434 819 467L803 480Q825 495 818 520L805 553L781 548Q797 516 782 495L766 462Z', c.ivory, c.ink, 5);
  s += circle(803, 456, 10, c.ochre, c.ink, 4) + circle(803, 512, 7, c.ochre, c.ink, 3);
  s += path('M722 366Q697 320 666 329Q676 368 735 391M724 380Q678 361 663 385Q697 410 731 401', c.ivory, c.ink, 4);
  return s;
};

const portraitSketch = () => {
  let s = circle(900, 462, 410, 'none', c.ochre, 5);
  s += path('M813 525L815 617Q856 676 951 628L935 554L956 527Q973 518 968 490L975 478L965 464L984 452L966 413L948 382L945 328Q900 249 815 288Q736 326 748 415L769 491ZM865 395Q904 374 944 391L918 413Q891 415 865 395ZM618 782Q667 653 781 622L822 553M951 628Q1081 661 1162 782M744 344Q843 252 967 302L978 331Q853 284 762 370ZM752 323Q814 180 944 235L961 287', 'none', '#9e6242', 6);
  return s;
};

const gate = (open) => {
  let s = path('M768 864V348Q768 119 995 119Q1222 119 1222 348V864Z', open ? c.navy : c.ochre, c.ink, 7);
  s += path('M790 862V350Q790 143 995 143Q1201 143 1201 350V862', 'none', c.paleGold, 11);
  const leaf = (mirror, spread) => {
    let p = path('M0 525V10Q0 -166 205 -166V525Z', 'none', c.ink, 8);
    for (let x = 18; x < 205; x += 24) {
      p += line(x, -110 + (205 - x) * .45, x, 525, c.ink, 6);
      for (let y = 40; y < 525; y += 87) p += path(`M${x} ${y}Q${x + 30} ${y - 40} ${x + 25} ${y + 5}Q${x + 17} ${y + 22} ${x} ${y + 30}`, 'none', c.paleGold, 4);
    }
    for (let y = 10; y < 525; y += 130) p += line(0, y, 205, y, c.ink, 6);
    return group(p, `translate(${mirror ? 1201 : 790} 338) scale(${mirror ? -spread : spread} 1)`);
  };
  if (open) {
    s += path('M843 810V516Q843 377 958 377Q1048 378 1048 505V788Z', c.ivory, c.ink, 6);
    s += path('M871 529Q895 443 967 473L1007 554L1007 727H872Z', c.teal, c.ink, 6);
    s += rect(916, 736, 196, 64, c.teal, c.ink, 5, 18) + rect(850, 682, 45, 136, c.ivory, c.ink, 5, 14);
    s += line(938, 800, 929, 846, c.ink, 9) + line(1084, 800, 1092, 846, c.ink, 9);
    s += circle(996, 270, 50, c.teal, c.paleGold, 8) + path('M972 273L989 291L1023 247', 'none', c.paleGold, 8);
  }
  s += leaf(false, open ? .21 : 1) + leaf(true, open ? .21 : 1);
  return s;
};

const lounge = (open) => {
  let s = foliage(1260, 894, 220) + palm(412, 888, 1.35) + palm(1459, 886, .75);
  s += gate(open);
  s += standingTraveler(580, 389, 1.03, open ? 'glass' : 'waiting') + guard(1341, 395, 1.02);
  return s;
};

const wineGlass = (x, y, scale = 1) => group(path('M-18 -39H18L15 -11Q0 6 -15 -11ZM0 1V32M-17 33H17', c.ivory, c.ink, 3) + path('M-13 -22H13Q11 -4 0 -3Q-11 -4 -13 -22Z', c.paleGold, 'none'), `translate(${x} ${y}) scale(${scale})`);

const stars = () => {
  let s = '';
  for (let i = 0; i < 78; i++) {
    const x = 246 + ((i * 193 + i * i * 7) % 1290);
    const y = 80 + ((i * 137 + i * i * 9) % 705);
    s += path(`M${x} ${y - 5}L${x + 5} ${y}L${x} ${y + 5}L${x - 5} ${y}Z`, c.paleGold, c.ochre, 1);
  }
  return s;
};

const plane = () => group(path('M-8 -140Q0 -164 8 -140L19 -26L138 47L137 62L17 29L12 105L52 139L51 150L0 129L-51 150L-52 139L-12 105L-17 29L-137 62L-138 47L-19 -26Z', c.gold, c.ink, 5) + line(0, -113, 0, 124, c.paleGold, 5), 'translate(1311 258) rotate(-42) scale(.86)');

const flight = (reclined) => {
  let s = stars() + plane();
  s += path('M457 847V361Q457 224 561 225Q684 219 719 323L756 781L715 850Z', c.ivory, c.ink, 7);
  s += path('M469 390Q561 408 708 368M485 321Q547 265 653 302M477 457L497 803L671 816', 'none', c.ochre, 4);
  s += rect(458, 784, reclined ? 855 : 405, 65, c.ivory, c.ink, 6, 15);
  s += path('M498 753L501 621Q542 589 586 621V753Z', c.ivory, c.ink, 5);
  s += rect(809, 691, 270, 51, c.ivory, c.ink, 5, 13) + rect(1029, 741, 38, 115, c.ivory, c.ink, 5, 4);
  s += path('M879 625V464Q879 392 947 392Q1015 392 1015 464V625Q1015 687 947 687Q879 687 879 625Z', c.ivory, c.ink, 6);
  s += path('M897 622V464Q897 411 947 411Q997 411 997 464V622Q997 668 947 668Q897 668 897 622Z', c.blue, c.ink, 5);
  s += wineGlass(967, 689, .65);
  if (reclined) {
    s += path('M627 645Q732 643 807 700L1269 742Q1315 754 1307 790Q1270 813 1209 800L774 780L644 732Z', c.navy, c.ink, 7);
    s += path('M624 638Q691 629 745 658L836 694L802 736L729 708L703 737L625 717L590 684Z', c.ivory, c.ink, 6);
    s += group(face(), 'translate(636 649) rotate(-59) scale(.83)');
    s += path('M719 683L814 708L881 706L890 721L811 738L699 712Z', c.skin, c.ink, 5);
    s += path('M1238 742Q1272 717 1301 746L1330 769L1306 790L1270 777Z', c.ivory, c.ink, 5);
    s += path('M771 754Q984 751 1207 780M791 719Q1018 729 1205 756', 'none', c.blue, 4);
  } else {
    s += path('M656 544L759 532L831 721L799 849H748L764 745L655 670L622 574Z', c.navy, c.ink, 6);
    s += path('M652 576L702 633L768 741L738 852L694 853L708 749L623 689L595 612Z', c.navy, c.ink, 6);
    s += path('M695 844L674 867Q688 892 743 875L741 849M747 844L729 865Q749 883 806 870L799 842', c.ivory, c.ink, 5);
    s += path('M619 383L561 429L576 600L615 648L680 607L736 584L744 475L721 404L673 387Z', c.ivory, c.ink, 6);
    s += path('M619 396L647 449L674 391M647 449L639 607M579 445L600 586M684 430L704 546', 'none', c.ink, 4);
    s += path('M690 476L740 512L801 452L798 416L813 399L831 410L839 449L766 552L716 548Z', c.skin, c.ink, 4);
    s += path('M577 594L633 618L676 635L671 659L628 649L568 624Z', c.skin, c.ink, 4);
    s += wineGlass(819, 379, .7) + group(face(), 'translate(650 407) scale(.95)');
  }
  s += line(239, 902, 1555, 902, c.teal, 28);
  return s;
};

const arch = (x, width = 350) => path(`M${x} 887V301Q${x} 122 ${x + width / 2} 122Q${x + width} 122 ${x + width} 301V887Z`, c.ivory, c.ink, 9) + path(`M${x + 20} 887V301Q${x + 20} 145 ${x + width / 2} 145Q${x + width - 20} 145 ${x + width - 20} 301V887`, 'none', c.gold, 11);

const curtain = (x, opened) => {
  const w = 340;
  let s = '';
  for (const side of [-1, 1]) {
    const xx = side < 0 ? x + 23 : x + w - 23;
    const center = x + w / 2;
    const near = opened ? xx + side * -38 : center;
    const d = side < 0
      ? `M${xx} 307Q${xx + 5} 188 ${center} 167L${center} 187Q${opened ? xx + 62 : center + 5} 312 ${near} 517L${xx + 69} 879H${xx}Z`
      : `M${xx} 307Q${xx - 5} 188 ${center} 167L${center} 187Q${opened ? xx - 62 : center - 5} 312 ${near} 517L${xx - 69} 879H${xx}Z`;
    s += path(d, c.ivory, c.ink, 4);
    s += path(`M${xx + side * -20} 306Q${opened ? xx + side * -35 : center} 420 ${near} 517L${xx + side * -35} 835`, 'none', '#aba998', 4);
    s += path(`M${near - 12} 498L${near + 14} 516L${near + 6} 537L${near - 20} 519Z`, c.gold, c.ink, 3);
  }
  return s;
};

const suite = (opened) => {
  let s = arch(334) + arch(729) + arch(1124);
  s += rect(361, 316, 298, 564, '#698e99') + rect(756, 316, 298, 564, '#c8b99a') + rect(1151, 316, 298, 564, '#719aa5');
  s += rect(362, 567, 296, 73, c.teal) + rect(362, 632, 296, 248, c.ivory);
  s += rect(362, 667, 297, 61, c.navy, c.ink, 5) + path('M367 726L645 726L640 830L367 854Z', c.blue, c.ink, 5);
  s += rect(386, 664, 94, 45, c.ivory, c.ink, 4, 10) + rect(495, 664, 94, 45, c.ivory, c.ink, 4, 10);
  s += rect(377, 462, 135, 89, c.ink, c.gold, 7) + rect(390, 475, 108, 64, c.blue);
  s += rect(1185, 632, 220, 212, c.ivory, c.ink, 4) + line(1186, 632, 1405, 632, c.teal, 21);
  s += path('M1161 557L1444 557M1188 441L1188 557M1241 405L1241 557M1295 407L1295 557M1349 435L1349 557M1403 422L1403 557', 'none', c.ivory, 5);
  s += path('M1282 484L1324 397L1366 484Z', c.white, c.ink, 4) + line(1324, 484, 1324, 544, c.ink, 5);
  s += circle(910, 389, 18, c.paleGold, c.ink, 4) + line(910, 332, 910, 376, c.ink, 4);
  for (let x = 789; x < 1040; x += 65) s += line(x, 490, x, 880, '#a29276', 2);
  s += curtain(334, opened) + curtain(729, opened) + curtain(1124, opened);
  s += standingTraveler(897, 426, .94, opened ? 'glass' : 'waiting');
  return s + palm(1552, 904, .92);
};

const seatedGuest = (x, y, shirt, skin, female, toast, direction) => {
  let s = path('M-28 -29L-78 2L-87 140L-64 216H76L91 140L64 1L18 -29Z', shirt, c.ink, 5);
  s += path('M-26 -26L-5 28L17 -28M-6 28L-6 205M-62 39L-51 138M51 41L64 142', 'none', c.ink, 3);
  s += direction < 0 ? group(face(skin, c.hair, female), 'scale(-1 1)') : face(skin, c.hair, female);
  if (toast) {
    s += path(direction > 0 ? 'M58 66L91 84L140 -7L141 -27L128 -34L119 -12L84 44L58 37Z' : 'M-59 66L-96 86L-143 -7L-144 -28L-129 -35L-120 -12L-87 44L-57 37Z', skin, c.ink, 4);
    s += wineGlass(direction > 0 ? 140 : -140, -53, .8);
  } else {
    s += path(direction > 0 ? 'M58 73L97 141L152 159L146 180L77 165L39 98Z' : 'M-58 73L-97 141L-151 159L-146 180L-77 165L-39 98Z', skin, c.ink, 4);
    s += wineGlass(direction > 0 ? 146 : -146, 113, .8);
  }
  s += path(direction > 0 ? 'M-77 139L-45 183L9 196L4 218L-57 202L-93 162Z' : 'M77 139L45 183L-9 196L-4 218L57 202L93 162Z', skin, c.ink, 4);
  return group(s, `translate(${x} ${y})`);
};

const dinner = (toast) => {
  let s = foliage(1320, 887, 235) + palm(364, 896, 1.2);
  s += seatedGuest(588, 416, c.ochre, c.darkSkin, false, toast, 1);
  s += seatedGuest(831, 416, c.ivory, c.skin, false, toast, 1);
  s += seatedGuest(1085, 416, c.teal, '#c4976b', true, toast, -1);
  s += seatedGuest(1320, 416, c.blue, c.skin, false, toast, -1);
  s += path('M387 645H1456L1560 865H305Z', c.ivory, c.ink, 6);
  s += path('M305 865H1560V936H305Z', c.white, c.ink, 6);
  for (let x = 370; x < 1530; x += 140) s += path(`M${x} 692L${x - 18} 865V934`, 'none', '#a5a294', 3);
  for (let i = 0; i < 4; i++) {
    const x = 524 + i * 270;
    s += ellipse(x, 747, 97, 31, c.silver, c.ink, 4) + ellipse(x, 747, 74, 21, c.navy, c.ink, 3);
    s += ellipse(x, 747, 48, 13, c.ochre, c.ink, 3) + ellipse(x + 13, 740, 18, 9, c.teal, c.ink, 2);
    s += line(x - 104, 710, x - 104, 780, c.ink, 4) + line(x + 111, 710, x + 111, 780, c.ink, 4);
    s += wineGlass(x + 77, 683, .58);
    s += ellipse(x - 36, 683, 24, 8, c.ivory, c.ink, 3);
  }
  s += rect(924, 577, 45, 132, c.ivory, c.ink, 4, 9);
  for (let i = 0; i < 7; i++) {
    const x = 908 + i * 12;
    s += line(947, 600, x, 550 - (i % 3) * 18, c.teal, 5) + circle(x, 546 - (i % 3) * 18, 13, i % 2 ? c.red : c.paleGold, c.ink, 2);
  }
  return s;
};

const card = () => {
  let s = rect(270, 323, 293, 293, c.blue, c.paleGold, 7);
  s += text('AURELIA', 416, 453, 44, c.ivory, 2) + text('JOURNEYS', 416, 504, 29, c.ivory, 2);
  s += line(313, 416, 522, 416, c.ivory, 3) + line(313, 526, 522, 526, c.ivory, 3);
  s += rect(636, 174, 904, 565, c.silver, c.ink, 8, 23) + rect(654, 191, 868, 529, 'none', c.ivory, 5, 15);
  s += path('M665 699L1510 210M677 717L1515 236', 'none', '#ccd3ce', 33);
  s += text('AURELIA', 1092, 276, 53, c.ink, 7) + text('THE VOYAGER', 1092, 318, 23, c.ink, 5);
  s += rect(707, 437, 109, 77, c.gold, c.ink, 4, 13);
  s += line(707, 459, 816, 459, c.ochre, 4) + line(707, 488, 816, 488, c.ochre, 4) + line(742, 438, 742, 514, c.ochre, 4) + line(782, 438, 782, 514, c.ochre, 4);
  s += group(portrait(), 'translate(677 320) scale(.45)');
  s += text('A WORLD OF POSSIBILITY', 1092, 663, 20, c.ink, 3);
  return s;
};

const panel = (interior, label, background = c.gold) => {
  let s = rect(0, 0, WIDTH, HEIGHT, c.gold);
  s += rect(182, 36, 1445, 914, background, c.ink, 9);
  s += rect(193, 48, 1423, 891, 'none', c.paleGold, 6);
  s += interior;
  s += rect(175, 950, 1460, 99, c.gold, c.ink, 5) + line(206, 974, 1602, 974, c.ochre, 3);
  s += text(label, 906, 1008, 26, c.ink, 3);
  s += text('A U R E L I A   ·   T H E   A R T   O F   T R A V E L', 906, 1034, 13, c.ochre, 1);
  s += column(55) + column(1670);
  s += beadBorder(3, 7, 1794, 1058);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${s}</svg>`;
};

export const artwork = [
  {id: 'portrait', before: panel(portraitSketch(), 'THE JOURNEY BEGINS', '#c3b394'), after: panel(portrait(), 'THE JOURNEY BEGINS')},
  {id: 'lounge', before: panel(lounge(false), 'THE PRIVATE LOUNGE'), after: panel(lounge(true), 'THE PRIVATE LOUNGE')},
  {id: 'flight', before: panel(flight(false), 'ABOVE THE EVERYDAY', c.blue), after: panel(flight(true), 'ABOVE THE EVERYDAY', c.blue)},
  {id: 'suite', before: panel(suite(false), 'A ROOM OF YOUR OWN'), after: panel(suite(true), 'A ROOM OF YOUR OWN')},
  {id: 'dinner', before: panel(dinner(false), 'THE MOMENTS WE SHARE'), after: panel(dinner(true), 'THE MOMENTS WE SHARE')},
  {id: 'card', before: panel(dinner(true), 'THE MOMENTS WE SHARE'), after: panel(card(), 'THE VOYAGER CARD')},
];
