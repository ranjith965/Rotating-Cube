// Generated by purs version 0.11.6
"use strict";
var Prelude = require("../Prelude");
var MonadGen = function (Monad0, chooseBool, chooseFloat, chooseInt, resize, sized) {
    this.Monad0 = Monad0;
    this.chooseBool = chooseBool;
    this.chooseFloat = chooseFloat;
    this.chooseInt = chooseInt;
    this.resize = resize;
    this.sized = sized;
};
var sized = function (dict) {
    return dict.sized;
};
var resize = function (dict) {
    return dict.resize;
};
var chooseInt = function (dict) {
    return dict.chooseInt;
};
var chooseFloat = function (dict) {
    return dict.chooseFloat;
};
var chooseBool = function (dict) {
    return dict.chooseBool;
};
module.exports = {
    MonadGen: MonadGen, 
    chooseBool: chooseBool, 
    chooseFloat: chooseFloat, 
    chooseInt: chooseInt, 
    resize: resize, 
    sized: sized
};