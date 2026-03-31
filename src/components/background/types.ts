export interface Point {
  x: number
  y: number
  vx: number
  vy: number
}

export interface Connection {
  a: Point
  b: Point
}

export interface Triangle {
  a: Point
  b: Point
  c: Point
}

export interface SceneConfig {
  pointCount: number
  connectionDistance: number
  shapeDistance: number
  speed: number
  // hex colors
  pointColor: number
  lineColor: number
  shapeColor: number
  // alpha 0–1
  pointAlpha: number
  lineAlpha: number
  shapeAlpha: number
}
