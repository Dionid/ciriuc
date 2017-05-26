"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function createPackageJSON(componentName) {
	return "{\n\t\"main\": \"./" + componentName + ".js\"\n}\n";
}

exports.default = createPackageJSON;