module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Eff.DOM (addEventListener, querySelector)
import Control.Monad.Eff.Ref (REF, newRef, readRef, writeRef, modifyRef, Ref)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (Window)
import DOM.HTML.Window (requestAnimationFrame)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Graphics.Canvas (CANVAS, Context2D, getCanvasElementById, getContext2D, setFillStyle, fillRect, moveTo, lineTo, withContext, setStrokeStyle, beginPath, closePath, stroke)
import Math (pi, cos, sin)
import Partial.Unsafe (unsafePartial)

newtype Point3D = Point3D
  { x :: Number
  , y :: Number
  , z :: Number
  }

newtype Point2D = Point2D
  { x :: Number
  , y :: Number
  }

newtype Angle3D = Angle3D
  { qx :: Number
  , qy :: Number
  , qz :: Number
  }

newtype Cube = Cube
  { x :: Number
  , y :: Number
  , z :: Number
  , size :: Number
  }

project :: Point3D -> Angle3D -> Point2D
project (Point3D { x, y, z }) (Angle3D { qx, qy, qz }) =
  let xRotQz = x * (cos qz) + y * (sin qz)
      yRotQz = y * (cos qz) - x * (sin qz)
      yRotQzQx = yRotQz * (cos qx) + z * (sin qx)
      zRotQzQx = z * (cos qx) - yRotQz * (sin qx)
      xRotQzQxQy = xRotQz * (cos qy) + zRotQzQx * (sin qy)
  in
    Point2D { x: 300.0 + xRotQzQxQy, y: 300.0 + yRotQzQx }


withStroke :: forall e.
  Context2D ->
  (Context2D -> Eff (canvas :: CANVAS | e) Context2D) ->
  Eff (canvas :: CANVAS | e) Context2D
withStroke ctx draw = withContext ctx do
  ctx <- beginPath ctx
  ctx <- draw ctx
  ctx <- closePath ctx
  stroke ctx

addEdge :: forall e. Context2D -> Point2D -> Point2D -> Eff (canvas :: CANVAS | e) Context2D
addEdge ctx (Point2D from) (Point2D to) = do
  ctx <- moveTo ctx from.x from.y
  lineTo ctx to.x to.y

drawCube :: forall e. Context2D -> Cube -> Angle3D -> Eff (canvas :: CANVAS | e) Context2D
drawCube ctx (Cube { x, y, z, size }) (Angle3D { qx, qy, qz })= do
  let half = size / 2.0
  let v1 = project (Point3D { x: x - half, y: y - half, z: z - half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v2 = project (Point3D { x: x - half, y: y + half, z: z - half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v3 = project (Point3D { x: x - half, y: y - half, z: z + half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v4 = project (Point3D { x: x - half, y: y + half, z: z + half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v5 = project (Point3D { x: x + half, y: y - half, z: z - half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v6 = project (Point3D { x: x + half, y: y + half, z: z - half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v7 = project (Point3D { x: x + half, y: y - half, z: z + half }) (Angle3D {qx: qx, qy: qy, qz: qz})
  let v8 = project (Point3D { x: x + half, y: y + half, z: z + half }) (Angle3D {qx: qx, qy: qy, qz: qz})

  withStroke ctx \ctx -> do

    ctx <- addEdge ctx v1 v5
    ctx <- addEdge ctx v5 v6
    ctx <- addEdge ctx v6 v2
    ctx <- addEdge ctx v2 v1
    ctx <- addEdge ctx v3 v7
    ctx <- addEdge ctx v7 v8
    ctx <- addEdge ctx v8 v4
    ctx <- addEdge ctx v4 v3
    ctx <- addEdge ctx v1 v3
    ctx <- addEdge ctx v5 v7
    ctx <- addEdge ctx v6 v8
    addEdge ctx v2 v4

loopAnimation :: forall e state.
  Window ->
  Ref state ->
  state ->
  (state -> Eff (ref :: REF, dom :: DOM | e) state) ->
  Eff (ref :: REF, dom :: DOM | e) Unit
loopAnimation window ref state step =
  void $ requestAnimationFrame
    do loopAnimation window ref state step
       state <- readRef ref
       state <- step state
       writeRef ref state
    window


withAnimation :: forall e state.
  state ->
  (state -> Eff (ref :: REF, dom :: DOM | e) state) ->
  Eff (ref :: REF, dom :: DOM | e) Unit
withAnimation state step = do
  window <- window
  ref <- newRef state
  loopAnimation window ref state step


withAnimateContext :: forall e state.
  String ->
  state ->
  (Context2D -> state -> Eff (dom :: DOM, ref :: REF, canvas :: CANVAS | e) state) ->
  Eff (dom :: DOM, ref :: REF, canvas :: CANVAS | e) Unit
withAnimateContext name state draw = do
  canvas <- getCanvasElementById name
  case canvas of
    Just canvas -> do
      ctx <- getContext2D canvas
      withAnimation state \state -> do
        draw ctx state
    Nothing -> pure unit

drawBackground :: forall e. Context2D -> Eff (canvas :: CANVAS | e) Context2D
drawBackground ctx = do
  ctx <- setFillStyle "rgb(400,100,200)" ctx
  fillRect ctx { x: 60.0, y: 60.0, w: 500.0, h: 500.0 }

state = { x: 0.0
        , y: 0.0
        , qx: pi / 4.0
        , qy: pi / 3.0
        , qz: pi / 4.0
        , loop : 0.5
        }

stopcube :: forall e.  Eff (dom :: DOM, ref :: REF, canvas :: CANVAS | e) Unit
stopcube =
  let
    canvas = getCanvasElementById "canvas"
  in
    withAnimateContext "canvas" state \ctx state -> do
        ctx <- drawBackground ctx
        void $ drawCube ctx (Cube { x: state.x, y: state.y, z: 0.0, size: 270.0 }) (Angle3D { qx: state.qx, qy: state.qy, qz: state.qz})
        pure $ state { x = state.x, y = state.y, qx = state.qx, qy = state.qy, qz = state.qz}


startcube :: forall e.  Eff (dom :: DOM, ref :: REF, canvas :: CANVAS | e) Unit
startcube =
  let
    canvas = getCanvasElementById "canvas"
  in
    withAnimateContext "canvas" state \ctx state -> do
        ctx <- drawBackground ctx
        void $ drawCube ctx (Cube { x: state.x, y: state.y, z: 0.0, size: 270.0 }) (Angle3D { qx: state.qx, qy: state.qy, qz: state.qz})
        pure $ state { x = state.x, y = state.y, qx = state.qx, qy = state.qy, qz = state.qz + state.loop, loop = max (state.loop - 0.004) 0.000}


-- main function --
main :: Eff ( canvas :: CANVAS
            , ref :: REF
            , dom :: DOM
            , console :: CONSOLE
            ) Unit
main = void $ unsafePartial do
  myFlag <- newRef 0
  count <- newRef 0
  Just canvas <- getCanvasElementById "canvas"
  ctx <- getContext2D canvas

  void $ drawCube ctx (Cube { x: state.x, y: state.y, z: 0.0, size: 270.0 }) (Angle3D { qx: state.qx, qy: state.qy, qz: state.qz})
  node <- querySelector "#canvas"

  for_ node $ addEventListener "click" $ void do
    modifyRef myFlag \a -> a + 1
    a <- readRef myFlag
    if a == 1
      then stopcube
      else log "do nothing"


  for_ node $ addEventListener "mousemove" $ void do
    b <- readRef myFlag
    modifyRef count \a -> mod (a + 1) 3
    c <- readRef count

    if b >= 1 && c == 1
      then do
        modifyRef myFlag \a -> 0
        startcube
      else log "do nothing"

  for_ node $ addEventListener "mousedown" $ void do
    b <- readRef myFlag
    modifyRef count \a -> mod (a + 1) 3
    c <- readRef count

    if b >= 1 && c == 1
      then do
        modifyRef myFlag \a -> 0
        startcube
      else log "do nothing"
