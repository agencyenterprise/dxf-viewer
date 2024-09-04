import THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** See TextRenderer.DefaultOptions for default values and documentation. */
export type TextRendererOptions = {
  curveSubdivision: number;
  fallbackChar: string;
};

/** See DxfScene.DefaultOptions for default values and documentation. */
export type DxfSceneOptions = {
  arcTessellationAngle: number;
  minArcTessellationSubdivisions: number;
  wireframeMesh: boolean;
  suppressPaperSpace: boolean;
  textOptions: TextRendererOptions;
};

/** See DxfViewer.DefaultOptions for default values and documentation. */
export type DxfViewerOptions = {
  canvasWidth: number;
  canvasHeight: number;
  autoResize: boolean;
  clearColor: THREE.Color;
  clearAlpha: number;
  canvasAlpha: boolean;
  canvasPremultipliedAlpha: boolean;
  antialias: boolean;
  colorCorrection: boolean;
  blackWhiteInversion: boolean;
  pointSize: number;
  sceneOptions: DxfSceneOptions;
  retainParsedDxf: boolean;
  preserveDrawingBuffer: boolean;
  fileEncoding: string;
};

export type DxfViewerLoadParams = {
  url: string;
  fonts: string[] | null;
  progressCbk:
    | ((
        phase: 'font' | 'fetch' | 'parse' | 'prepare',
        processedSize: number,
        totalSize: number
      ) => void)
    | null;
  workerFactory: (() => Worker) | null;
};

export type LayerInfo = {
  name: string;
  displayName: string;
  color: number;
};

export type EventName =
  | 'loaded'
  | 'cleared'
  | 'destroyed'
  | 'resized'
  | 'pointerdown'
  | 'pointerup'
  | 'viewChanged'
  | 'message';

export declare class DxfViewer {
  static DefaultOptions: DxfViewerOptions;
  constructor(domContainer: HTMLElement, options: DxfViewerOptions | null);
  CanvasToSceneCoord(x: number, y: number): THREE.Vector2;
  Clear(): void;
  Destroy(): void;
  FitView(minX: number, maxX: number, minY: number, maxY: number, padding: number): void;
  GetCamera(): THREE.OrthographicCamera;
  GetCanvas(): HTMLCanvasElement;
  GetControls(): OrbitControls | null;
  GetLayers(): Iterable<LayerInfo>;
  GetOrigin(): THREE.Vector2;
  GetBounds(): { maxX: number; maxY: number; minX: number; minY: number } | null;
  GetRenderer(): THREE.WebGLRenderer | null;
  GetScene(): THREE.Scene;
  GetObjects(): Map<string, THREE.Object3D[]>;
  GetObjectByName(name: string): THREE.Object3D[];
  GetBlockByName(name: string): Block | null;
  GetElementPosition(name: string): THREE.Vector3 | null;
  GetBlockEntities(name: string): {
    offset: THREE.Vector2;
    position: THREE.Vector3;
    rotation: number;
    xScale: number;
    yScale: number;
  }[];
  GetTexts(): {
    endPoint: THREE.Vector3;
    ownerHandle: string;
    startPoint: THREE.Vector3;
    text: string;
  }[];
  HasRenderer(): boolean;
  Load(params: DxfViewerLoadParams): Promise<void>;
  Render(): void;
  SetSize(width: number, height: number): void;
  SetView(center: THREE.Vector3, width: number): void;
  ShowLayer(name: string, show: boolean): void;
  Subscribe(eventName: EventName, eventHandler: (event: any) => void): void;
  Unsubscribe(eventName: EventName, eventHandler: (event: any) => void): void;
}

export declare namespace DxfViewer {
  export function SetupWorker(): void;
}

export type PatternLineDef = {
  angle: number;
  base?: THREE.Vector2;
  offset: THREE.Vector2;
  dashes?: number[];
};

export class Pattern {
  constructor(lines: PatternLineDef[], name: string | null);

  static ParsePatFile(content: String): Pattern;
}

export function RegisterPattern(pattern: Pattern, isMetric: boolean): void;

/** @return {?Pattern} */
export function LookupPattern(name: string, isMetric: boolean): Pattern | null;

export type Block = {
  batches: RenderBatch[];
  bounds: {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
  }
  data: {
    entities: RenderEntity[];
    handle: string;
    layer: string;
    name: string;
    name2: string;
    ownerHandle: string;
    position: THREE.Vector3;
    xrefPath: string;
  }
  flatten: boolean;
  nestedTransform: THREE.Matrix3;
  nestedUseCount: number;
  offset: THREE.Vector2;
  transform: THREE.Matrix3;
  useCount: number;
  verticesCount: number;
}

export type RenderBatch = {
  key: BatchingKey;
  insertName: string;
  position: RenderEntity[]
}

export type RenderEntity = {
  handle: string;
  layer: string;
  ownerHandle: string;
  type: string;
  vertices: THREE.Vector3[];
}

export type BatchingKey = {
  blockName: string;
  color: number;
  geometryType: number;
  insertName: string;
  layerName: string;
  lineType: number;
}
