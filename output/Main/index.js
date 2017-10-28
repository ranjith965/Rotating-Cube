"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_DOM = require("../Control.Monad.Eff.DOM");
var Control_Monad_Eff_Ref = require("../Control.Monad.Eff.Ref");
var DOM = require("../DOM");
var DOM_HTML = require("../DOM.HTML");
var DOM_HTML_Types = require("../DOM.HTML.Types");
var DOM_HTML_Window = require("../DOM.HTML.Window");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Maybe = require("../Data.Maybe");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Graphics_Canvas = require("../Graphics.Canvas");
var $$Math = require("../Math");
var Partial_Unsafe = require("../Partial.Unsafe");
var Prelude = require("../Prelude");
var Point3D = function (x) {
    return x;
};
var Point2D = function (x) {
    return x;
};
var Cube = function (x) {
    return x;
};
var Angle3D = function (x) {
    return x;
};
var withStroke = function (ctx) {
    return function (draw) {
        return Graphics_Canvas.withContext(ctx)(function __do() {
            var v = Graphics_Canvas.beginPath(ctx)();
            var v1 = draw(v)();
            var v2 = Graphics_Canvas.closePath(v1)();
            return Graphics_Canvas.stroke(v2)();
        });
    };
};
var state = {
    x: 0.0, 
    y: 0.0, 
    qx: $$Math.pi / 4.0, 
    qy: $$Math.pi / 3.0, 
    qz: $$Math.pi / 4.0, 
    loop: 0.5
};
var project = function (v) {
    return function (v1) {
        var yRotQz = v.y * $$Math.cos(v1.qz) - v.x * $$Math.sin(v1.qz);
        var yRotQzQx = yRotQz * $$Math.cos(v1.qx) + v.z * $$Math.sin(v1.qx);
        var zRotQzQx = v.z * $$Math.cos(v1.qx) - yRotQz * $$Math.sin(v1.qx);
        var xRotQz = v.x * $$Math.cos(v1.qz) + v.y * $$Math.sin(v1.qz);
        var xRotQzQxQy = xRotQz * $$Math.cos(v1.qy) + zRotQzQx * $$Math.sin(v1.qy);
        return {
            x: 300.0 + xRotQzQxQy, 
            y: 300.0 + yRotQzQx
        };
    };
};
var loopAnimation = function (window) {
    return function (ref) {
        return function (state1) {
            return function (step) {
                return Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_HTML_Window.requestAnimationFrame(function __do() {
                    loopAnimation(window)(ref)(state1)(step)();
                    var v = Control_Monad_Eff_Ref.readRef(ref)();
                    var v1 = step(v)();
                    return Control_Monad_Eff_Ref.writeRef(ref)(v1)();
                })(window));
            };
        };
    };
};
var withAnimation = function (state1) {
    return function (step) {
        return function __do() {
            var v = DOM_HTML.window();
            var v1 = Control_Monad_Eff_Ref.newRef(state1)();
            return loopAnimation(v)(v1)(state1)(step)();
        };
    };
};
var withAnimateContext = function (name) {
    return function (state1) {
        return function (draw) {
            return function __do() {
                var v = Graphics_Canvas.getCanvasElementById(name)();
                if (v instanceof Data_Maybe.Just) {
                    var v1 = Graphics_Canvas.getContext2D(v.value0)();
                    return withAnimation(state1)(function (state2) {
                        return draw(v1)(state2);
                    })();
                };
                if (v instanceof Data_Maybe.Nothing) {
                    return Data_Unit.unit;
                };
                throw new Error("Failed pattern match at Main line 127, column 3 - line 132, column 25: " + [ v.constructor.name ]);
            };
        };
    };
};
var drawBackground = function (ctx) {
    return function __do() {
        var v = Graphics_Canvas.setFillStyle("rgb(400,100,200)")(ctx)();
        return Graphics_Canvas.fillRect(v)({
            x: 60.0, 
            y: 60.0, 
            w: 500.0, 
            h: 500.0
        })();
    };
};
var addEdge = function (ctx) {
    return function (v) {
        return function (v1) {
            return function __do() {
                var v2 = Graphics_Canvas.moveTo(ctx)(v.x)(v.y)();
                return Graphics_Canvas.lineTo(v2)(v1.x)(v1.y)();
            };
        };
    };
};
var drawCube = function (ctx) {
    return function (v) {
        return function (v1) {
            var half = v.size / 2.0;
            var v11 = project({
                x: v.x - half, 
                y: v.y - half, 
                z: v.z - half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v2 = project({
                x: v.x - half, 
                y: v.y + half, 
                z: v.z - half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v3 = project({
                x: v.x - half, 
                y: v.y - half, 
                z: v.z + half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v4 = project({
                x: v.x - half, 
                y: v.y + half, 
                z: v.z + half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v5 = project({
                x: v.x + half, 
                y: v.y - half, 
                z: v.z - half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v6 = project({
                x: v.x + half, 
                y: v.y + half, 
                z: v.z - half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v7 = project({
                x: v.x + half, 
                y: v.y - half, 
                z: v.z + half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            var v8 = project({
                x: v.x + half, 
                y: v.y + half, 
                z: v.z + half
            })({
                qx: v1.qx, 
                qy: v1.qy, 
                qz: v1.qz
            });
            return withStroke(ctx)(function (ctx2) {
                return function __do() {
                    var v9 = addEdge(ctx2)(v11)(v5)();
                    var v10 = addEdge(v9)(v5)(v6)();
                    var v12 = addEdge(v10)(v6)(v2)();
                    var v13 = addEdge(v12)(v2)(v11)();
                    var v14 = addEdge(v13)(v3)(v7)();
                    var v15 = addEdge(v14)(v7)(v8)();
                    var v16 = addEdge(v15)(v8)(v4)();
                    var v17 = addEdge(v16)(v4)(v3)();
                    var v18 = addEdge(v17)(v11)(v3)();
                    var v19 = addEdge(v18)(v5)(v7)();
                    var v20 = addEdge(v19)(v6)(v8)();
                    return addEdge(v20)(v2)(v4)();
                };
            });
        };
    };
};
var startcube = (function () {
    var canvas = Graphics_Canvas.getCanvasElementById("canvas");
    return withAnimateContext("canvas")(state)(function (ctx) {
        return function (state1) {
            return function __do() {
                var v = drawBackground(ctx)();
                Data_Functor["void"](Control_Monad_Eff.functorEff)(drawCube(v)({
                    x: state1.x, 
                    y: state1.y, 
                    z: 0.0, 
                    size: 270.0
                })({
                    qx: state1.qx, 
                    qy: state1.qy, 
                    qz: state1.qz
                }))();
                var $92 = {};
                for (var $93 in state1) {
                    if ({}.hasOwnProperty.call(state1, $93)) {
                        $92[$93] = state1[$93];
                    };
                };
                $92.x = state1.x;
                $92.y = state1.y;
                $92.qx = state1.qx;
                $92.qy = state1.qy;
                $92.qz = state1.qz + state1.loop;
                $92.loop = Data_Ord.max(Data_Ord.ordNumber)(state1.loop - 4.0e-3)(0.0);
                return $92;
            };
        };
    });
})();
var stopcube = (function () {
    var canvas = Graphics_Canvas.getCanvasElementById("canvas");
    return withAnimateContext("canvas")(state)(function (ctx) {
        return function (state1) {
            return function __do() {
                var v = drawBackground(ctx)();
                Data_Functor["void"](Control_Monad_Eff.functorEff)(drawCube(v)({
                    x: state1.x, 
                    y: state1.y, 
                    z: 0.0, 
                    size: 270.0
                })({
                    qx: state1.qx, 
                    qy: state1.qy, 
                    qz: state1.qz
                }))();
                var $96 = {};
                for (var $97 in state1) {
                    if ({}.hasOwnProperty.call(state1, $97)) {
                        $96[$97] = state1[$97];
                    };
                };
                $96.x = state1.x;
                $96.y = state1.y;
                $96.qx = state1.qx;
                $96.qy = state1.qy;
                $96.qz = state1.qz;
                return $96;
            };
        };
    });
})();

// main function --
var main = Data_Functor["void"](Control_Monad_Eff.functorEff)(function __do() {
    var v = Control_Monad_Eff_Ref.newRef(0)();
    var v1 = Control_Monad_Eff_Ref.newRef(0)();
    var v2 = Graphics_Canvas.getCanvasElementById("canvas")();
    var __unused = function (dictPartial1) {
        return function ($dollar43) {
            return $dollar43;
        };
    };
    return __unused()((function () {
        if (v2 instanceof Data_Maybe.Just) {
            return function __do() {
                var v3 = Graphics_Canvas.getContext2D(v2.value0)();
                Data_Functor["void"](Control_Monad_Eff.functorEff)(drawCube(v3)({
                    x: state.x, 
                    y: state.y, 
                    z: 0.0, 
                    size: 270.0
                })({
                    qx: state.qx, 
                    qy: state.qy, 
                    qz: state.qz
                }))();
                var v4 = Control_Monad_Eff_DOM.querySelector("#canvas")();
                Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(v4)(Control_Monad_Eff_DOM.addEventListener("click")(Data_Functor["void"](Control_Monad_Eff.functorEff)(function __do() {
                    Control_Monad_Eff_Ref.modifyRef(v)(function (a) {
                        return a + 1 | 0;
                    })();
                    var v5 = Control_Monad_Eff_Ref.readRef(v)();
                    var $105 = v5 === 1;
                    if ($105) {
                        return stopcube();
                    };
                    return Control_Monad_Eff_Console.log("do nothing")();
                })))();
                Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(v4)(Control_Monad_Eff_DOM.addEventListener("mousemove")(Data_Functor["void"](Control_Monad_Eff.functorEff)(function __do() {
                    var v5 = Control_Monad_Eff_Ref.readRef(v)();
                    Control_Monad_Eff_Ref.modifyRef(v1)(function (a) {
                        return (a + 1 | 0) % 3;
                    })();
                    var v6 = Control_Monad_Eff_Ref.readRef(v1)();
                    var $108 = v5 >= 1 && v6 === 1;
                    if ($108) {
                        Control_Monad_Eff_Ref.modifyRef(v)(function (a) {
                            return 0;
                        })();
                        return startcube();
                    };
                    return Control_Monad_Eff_Console.log("do nothing")();
                })))();
                return Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableMaybe)(v4)(Control_Monad_Eff_DOM.addEventListener("mousedown")(Data_Functor["void"](Control_Monad_Eff.functorEff)(function __do() {
                    var v5 = Control_Monad_Eff_Ref.readRef(v)();
                    Control_Monad_Eff_Ref.modifyRef(v1)(function (a) {
                        return (a + 1 | 0) % 3;
                    })();
                    var v6 = Control_Monad_Eff_Ref.readRef(v1)();
                    var $111 = v5 >= 1 && v6 === 1;
                    if ($111) {
                        Control_Monad_Eff_Ref.modifyRef(v)(function (a) {
                            return 0;
                        })();
                        return startcube();
                    };
                    return Control_Monad_Eff_Console.log("do nothing")();
                })))();
            };
        };
        throw new Error("Failed pattern match at Main line 178, column 3 - line 179, column 3: " + [ v2.constructor.name ]);
    })())();
});
module.exports = {
    Angle3D: Angle3D, 
    Cube: Cube, 
    Point2D: Point2D, 
    Point3D: Point3D, 
    addEdge: addEdge, 
    drawBackground: drawBackground, 
    drawCube: drawCube, 
    loopAnimation: loopAnimation, 
    main: main, 
    project: project, 
    startcube: startcube, 
    state: state, 
    stopcube: stopcube, 
    withAnimateContext: withAnimateContext, 
    withAnimation: withAnimation, 
    withStroke: withStroke
};
