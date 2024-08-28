import ReactDOM from "react-dom/client";
import styled from "styled-components";

const StyledCoordsPane = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 0.5em;

  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  width: 16em;
  height: 4em;
`;

export function CoordsPaneComponent(props: {
  x: number;
  y: number;
  ringText: string;
}) {
  return (
    <StyledCoordsPane>
      <span>
        ({props.x.toFixed(2)}, {props.y.toFixed(2)})
      </span>
      <span>{props.ringText}</span>
    </StyledCoordsPane>
  );
}

export default class CoordsPane extends Phaser.GameObjects.DOMElement {
  dom: HTMLDivElement;
  root: ReactDOM.Root;
  distance: number;
  nextId: number;

  constructor(scene: Phaser.Scene, distance: number, nextId: number) {
    super(scene, 0, 0);
    this.distance = distance;
    this.nextId = nextId;

    this.dom = document.createElement("div");
    // this.dom.style.transformOrigin = "bottom right";
    this.dom.style.bottom = "0em";
    this.dom.style.right = "0em";
    this.setElement(this.dom);

    this.root = ReactDOM.createRoot(this.dom);
  }

  public render(x: number, y: number) {
    const distanceOrigin = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const ringId = Math.floor(distanceOrigin / this.distance);
    const ringNo = ringId.toString().padStart(4, "0");

    let suff = `(RING No.${ringNo})`;
    if (ringId >= this.nextId) {
      suff = `(RING No.${ringNo} UNKNOW)`;
    }
    this.root.render(<CoordsPaneComponent x={x} y={y} ringText={suff} />);
  }
}
