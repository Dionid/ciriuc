'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var createFileAction = void 0;

// Detecting if platform is Windows, OSX, or Linux
// for creating files
switch (process.platform) {
	case 'darwin':
	case 'linux':
		exports.createFileAction = createFileAction = 'touch ';
		break;
	case 'win32':
		exports.createFileAction = createFileAction = 'echo > ';
		break;
	default:
		throw new Error('Unsupported platform: ' + process.platform);
}

function getComponentPath(componentPath) {
	var res = '';

	if (componentPath.indexOf('.') !== 0) {
		if (componentPath.indexOf('/') !== 0) {
			res += './';
		} else {
			res += '.';
		}
	}

	res += componentPath;

	return res;
}

function getComponentName(componentPath) {
	var componentPathArr = componentPath.split('/');
	var componentName = componentPathArr[componentPathArr.length - 1];

	return componentName;
}

function getStylesExt(userStylesExt) {
	var res = '.';

	if (userStylesExt) {
		res += userStylesExt;
	} else {
		res += 'scss';
	}

	return res;
}

exports.getComponentPath = getComponentPath;
exports.getComponentName = getComponentName;
exports.getStylesExt = getStylesExt;
exports.createFileAction = createFileAction;