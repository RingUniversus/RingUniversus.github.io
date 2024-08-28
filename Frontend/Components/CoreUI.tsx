import styled, { css } from "styled-components";
import rustyles from "../Styles/rustyles";
import colors from "color";

const LinkImpl = styled.a`
  cursor: pointer;

  ${({ color }: { color?: string }) => css`
    text-decoration: underline;
    color: ${color || rustyles.colors.rublue};
  }

    &:hover {
      color: ${colors(color || rustyles.colors.rublue)
        .lighten(0.3)
        .hex()};
    }
  `}
`;

/**
 * This is the link that all core ui in Ring Universus should use.
 */
export function Link(
  props: {
    to?: string;
    color?: string;
    openInThisTab?: boolean;
    children: React.ReactNode;
  } & React.HtmlHTMLAttributes<HTMLAnchorElement>
) {
  const { to, color, openInThisTab, children } = props;

  return (
    <LinkImpl
      {...props}
      href={to}
      color={color}
      target={openInThisTab ? undefined : "_blank"}
    >
      {children}
    </LinkImpl>
  );
}

// export const Spacer = styled.div`
//   ${({ width, height }: { width?: number; height?: number }) => css`
//     width: 1px;
//     height: 1px;
//     ${width && !height ? "display: inline-block;" : ""}
//     ${width ? `width: ${width}px;` : ""}
//     ${height ? `height: ${height}px;min-height:${height}px;` : ""}
//   `}
// `;

export const Spacer = styled.div<{ $width?: number; $height: number }>`
  ${(props) => (props.$width && !props.$height ? "display: inline-block;" : "")}
  ${(props) => (props.$width ? `width: ${props.$width}px;` : "width: 1px")}
  ${(props) =>
    props.$height
      ? `height: ${props.$height}px; min-height: ${props.$height}px`
      : "height: 1px"}
`;
