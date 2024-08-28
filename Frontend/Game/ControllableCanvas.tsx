import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useUIManager } from "../Utils/AppHooks";
import UIEmitter, { UIEmitterEvent } from "../Utils/UIEmitter";
import Container from "./Container";

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;

  position: relative;

  canvas {
    width: 100%;
    height: 100%;

    position: absolute;

    &#buffer {
      width: auto;
      height: auto;
      display: none;
    }
  }
  // TODO put this into a global style
  canvas,
  img {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
`;

export default function ControllableCanvas() {
  // html canvas element width and height. viewport dimensions are tracked by viewport obj
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const glRef = useRef<HTMLCanvasElement | null>(null);
  // const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameDomContainerRef = useRef<HTMLDivElement>(null);

  // const evtRef = canvasRef;

  const gameUIManager = useUIManager();

  const modalManager = gameUIManager.getModalManager();
  const [targeting, setTargeting] = useState<boolean>(false);

  // useEffect(() => {
  //   const updateTargeting = (newstate: CursorState) => {
  //     setTargeting(newstate === CursorState.TargetingExplorer);
  //   };
  //   // modalManager.on(ModalManagerEvent.StateChanged, updateTargeting);
  //   return () => {
  //     modalManager.removeListener(
  //       ModalManagerEvent.StateChanged,
  //       updateTargeting
  //     );
  //   };
  // }, [modalManager]);

  // const doResize = useCallback(() => {
  //   const uiEmitter: UIEmitter = UIEmitter.getInstance();
  //   if (canvasRef.current) {
  //     setWidth(canvasRef.current.clientWidth);
  //     setHeight(canvasRef.current.clientHeight);
  //     uiEmitter.emit(UIEmitterEvent.WindowResize);
  //   }
  // }, [canvasRef]);

  // TODO fix this
  // useLayoutEffect(() => {
  //   if (canvasRef.current) doResize();
  // }, [
  //   // dep array gives eslint issues, but it's fine i tested it i swear - Alan
  //   canvasRef,
  //   doResize,
  //   /* eslint-disable react-hooks/exhaustive-deps */
  //   canvasRef.current?.offsetWidth,
  //   canvasRef.current?.offsetHeight,
  //   /* eslint-enable react-hooks/exhaustive-deps */
  // ]);

  useEffect(() => {
    if (!gameUIManager) return;

    //   const uiEmitter: UIEmitter = UIEmitter.getInstance();

    //   function onResize() {
    //     doResize();
    //     uiEmitter.emit(UIEmitterEvent.WindowResize);
    //   }

    // const onWheel = (e: WheelEvent): void => {
    //   e.preventDefault();
    //   const { deltaY } = e;
    //   uiEmitter.emit(UIEmitterEvent.CanvasScroll, deltaY);
    // };

    // const canvas = evtRef.current;
    // if (!canvas || !canvasRef.current || !glRef.current || !bufferRef.current)
    //   return;
    console.log("gameContainerRef: ", gameContainerRef);
    // if (!canvas || !canvasRef.current || !gameContainerRef.current) return;
    if (!gameContainerRef.current && !gameDomContainerRef.current) return;

    // This zooms your home world in really close to show the awesome details
    // TODO: Store this as it changes and re-initialize to that if stored
    const defaultWorldUnits = 4;
    // Viewport.initialize(gameUIManager, defaultWorldUnits, canvas);
    // Renderer.initialize(
    //   canvasRef.current,
    //   // glRef.current,
    //   // bufferRef.current,
    //   Viewport.getInstance(),
    //   gameUIManager
    // );
    // const config: Phaser.Types.Core.GameConfig = {
    //   type: Phaser.WEBGL,
    //   canvas: canvasRef.current,
    //   dom: {
    //     createContainer: false,
    //   },
    //   width: width,
    //   height: height,
    //   // scale: {
    //   //   mode: Phaser.Scale.FIT,
    //   //   // autoCenter: Phaser.Scale.CENTER_BOTH,
    //   // },
    //   scene: [scenes.Main, scenes.UI],
    //   parent: gameContainerRef.current,
    // };

    // const game = new Phaser.Game(config);
    Container.initialize(gameContainerRef.current!, gameUIManager);

    console.log("Renderer initialize.");
    // We can't attach the wheel event onto the canvas due to:
    // https://www.chromestatus.com/features/6662647093133312
    // canvas.addEventListener("wheel", onWheel);
    // window.addEventListener("resize", onResize);

    // uiEmitter.on(UIEmitterEvent.UIChange, doResize);

    return () => {
      // Viewport.destroyInstance();
      Container.destroy();
      // window.removeEventListener("resize", onResize);
      // uiEmitter.removeListener(UIEmitterEvent.UIChange, doResize);
    };
  }, []);
  // }, [gameUIManager, doResize, canvasRef, glRef, bufferRef, evtRef]);

  return (
    <CanvasWrapper
      style={{ cursor: targeting ? "crosshair" : undefined }}
      ref={gameContainerRef}
    >
      {/* <canvas ref={glRef} width={width} height={height} /> */}
      {/* <canvas ref={canvasRef} width={width} height={height} /> */}
      {/* <canvas ref={bufferRef} id="buffer" /> */}
    </CanvasWrapper>
  );
}
