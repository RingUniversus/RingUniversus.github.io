import { FaDiscord, FaGithub, FaTelegram, FaXTwitter } from "react-icons/fa6";
import styled from "styled-components";

/**
 Allow for tweaking the size of an icon based on the context.
 Biome & Spacetype Notifications should fill the notification box
 Others should be 3/4's the size and centered
*/
interface AlertIcon {
  height?: string;
  width?: string;
}

export const Generic = ({ height, width }: AlertIcon) => {
  return (
    <img
      height={height}
      width={width}
      src="/public/icons/alerts/generic/generic.svg"
    />
  );
};

export const HomepageLink = () => {
  return (
    <Link>
      <a href="https://x.com/RUniversus">
        <FaXTwitter />
      </a>
      <a href="https://t.me/+MrydeChnHPBiOTkx">
        <FaTelegram />
      </a>
      <a href="https://github.com/RingUniversus">
        <FaGithub />
      </a>
      <a href="https://discord.gg/ppV5fPY5rP">
        <FaDiscord />
      </a>
    </Link>
  );
};

const Link = styled.div`
  width: 270px;
  display: inline-flex;
  font-size: 35px;
  justify-content: space-evenly;
`;

export const HomepageLogo = () => {
  return (
    <Logo>
      <p style={{ marginBottom: -0.7 + "em" }}>Ring</p>
      <p>Universus</p>
    </Logo>
  );
};

const Logo = styled.div`
  width: 270px;
  text-align: left;
  font-size: 50px;
  font-weight: 1000;
  letter-spacing: 9px;
`;

export const TxDeclined = ({ height, width }: AlertIcon) => {
  return (
    <img
      height={height}
      width={width}
      src="/assets/images/icons/alerts/transactions/declined.svg"
    />
  );
};
