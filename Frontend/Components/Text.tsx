import styled from "styled-components";
import rustyles from "../Styles/rustyles";

export const LongDash = () => (
  <span style={{ transform: "scale(1.5, 1)", display: "inline-block" }}>-</span>
);

export const Green = styled.span`
  color: ${rustyles.colors.rugreen};
`;
export const Sub = styled.span`
  color: ${rustyles.colors.subtext};
`;
export const Subber = styled.span`
  color: ${rustyles.colors.subbertext};
`;
export const Text = styled.span`
  color: ${rustyles.colors.text};
`;
export const White = styled.span`
  color: ${rustyles.colors.ruwhite};
`;
export const Red = styled.span`
  color: ${rustyles.colors.rured};
`;
export const Gold = styled.span`
  color: ${rustyles.colors.ruyellow};
`;
