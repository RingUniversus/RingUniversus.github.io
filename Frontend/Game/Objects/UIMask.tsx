import ReactDOM from "react-dom/client";
import styled from "styled-components";

const TopMask = styled.div`
  position: absolute;
  width: 100%;
  height: 5em; /* Adjust the height as needed */
  background: linear-gradient(to bottom, black 30%, transparent 100%);
  top: -0.05em;
`;

const BottomMask = styled.div`
  position: absolute;
  width: 100%;
  height: 5em; /* Adjust the height as needed */
  background: linear-gradient(to top, black 30%, transparent 100%);
  bottom: -1em;
`;

export function UIMaskComponent() {
  return (
    <>
      <TopMask />
      <BottomMask />
    </>
  );
}

export default class UIMask extends Phaser.GameObjects.DOMElement {
  dom: HTMLDivElement;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.dom = document.createElement("div");
    this.dom.style.top = "-1em";
    this.dom.style.left = "0em";
    this.dom.style.width = "100%";
    this.dom.style.height = "101%";

    this.setElement(this.dom);

    const root = ReactDOM.createRoot(this.dom);
    root.render(<UIMaskComponent />);
  }
}
