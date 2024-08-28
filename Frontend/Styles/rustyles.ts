import color from "color";
import { css } from "styled-components";

const text = color("#bbb").hex();
const textLight = color(text).lighten(0.3).hex();
const subtext = color(text).darken(0.3).hex();
const subbertext = color(text).darken(0.5).hex();
const subbesttext = color(text).darken(0.8).hex();

const background = "#151515";
const backgrounddark = "#252525";
const backgroundlight = color(background).lighten(0.5).hex();
const backgroundlighter = color(backgroundlight).lighten(0.3).hex();

const border = "#777";
const borderDark = color(border).darken(0.2).hex();
const borderDarker = color(borderDark).darken(0.2).hex();
const borderDarkest = color(borderDarker).darken(0.5).hex();

const rublue = "#00ADE1";
const rugreen = "#00DC82";
const rugreendark = color(rugreen).darken(0.7).hex();
const rugreenlight = color(rugreen).lighten(0.1).hex();
const rured = "#FF6492";
const ruyellow = "#e8e228";
const rupurple = "#9189d9";
const ruwhite = "#ffffff";
const ruorange = "rgb(196, 101, 0)";

const rustyles = {
  colors: {
    text,
    textLight,
    subtext,
    subbertext,
    subbesttext,

    background,
    backgrounddark,
    backgroundlight,
    backgroundlighter,

    border,
    borderDark,
    borderDarker,
    borderDarkest,

    rublue,
    rugreen,
    rugreendark,
    rugreenlight,
    rured,
    ruyellow,
    rupurple,
    ruwhite,
    ruorange,

    icons: {
      twitter: "#1DA1F2",
      github: "#8e65db",
      discord: "#7289da",
      email: "#D44638",
      blog: "#ffcb1f",
    },
  },

  borderRadius: "3px",

  fontSize: "16pt",
  fontSizeS: "12pt",
  fontSizeXS: "10pt",
  fontH1: "42pt",
  fontH1S: "36pt",
  fontH2: "24pt",

  titleFont: "perfect_dos_vga_437regular",

  screenSizeS: "660px",

  game: {
    terminalWidth: "240pt",
    fontSize: "12pt",
    terminalFontSize: "10pt",
  },
};

const RECOMMENDED_MODAL_WIDTH = "400px" as const;

export const snips = {
  bigPadding: css`
    padding: 2px 12px;
  `,
  defaultModalWidth: css`
    width: ${RECOMMENDED_MODAL_WIDTH};
    max-width: ${RECOMMENDED_MODAL_WIDTH};
  `,
  defaultBackground: `background: ${rustyles.colors.background};`,
  roundedBorders: `border-radius:${rustyles.borderRadius};`,
  roundedBordersWithEdge: css`
    border-radius: 3px;
    border: 1px solid ${rustyles.colors.borderDark};
  `,
  absoluteTopLeft: css`
    position: absolute;
    top: 0;
    left: 0;
  `,
  pane: ``,
  // It is unclear where this should go in this file
  destroyedBackground: {
    backgroundImage: 'url("/public/img/destroyedbg.png")',
    backgroundSize: "150px",
    backgroundPosition: "right bottom",
    backgroundRepeat: "no-repeat",
  } as CSSStyleDeclaration & React.CSSProperties,
};

export default rustyles;
