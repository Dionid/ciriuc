'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function createComponentImports(componentName, stylesExt) {
	var redux = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


	var res = '/* @flow */\nimport React, { Component } from \'react\'\nimport classnamesBind from \'classnames/bind\'';

	if (redux) {
		res += '\nimport { connect } from \'react-redux\'';
	}

	res += '\nimport styles from \'./' + componentName + stylesExt + '\'\nconst cx = classnamesBind.bind(styles)\n\ntype ' + componentName + 'Props = {\n\n}';

	return res;
}

function createComponentBody(componentName) {
	var functional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (functional) {
		return '\n\nfunction ' + componentName + '(props:' + componentName + 'Props) {\n\treturn (\n\t\t<div></div>\n\t)\n}\n';
	} else {
		return '\n\nclass ' + componentName + ' extends Component {\n\tprops: ' + componentName + 'Props\n\n\trender() {\n\t\treturn (\n\t\t\t<div></div>\n\t\t)\n\t}\n}\n';
	}
}

function createComponentExport(componentName) {
	var redux = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	var res = '';

	if (redux) {
		res += '\n\nfunction mapStateToProps(state, ownProps) {\n\treturn {\n\t\t\n\t}\n}\n\nfunction mapDispatchToProps(dispatch) {\n\treturn {\n\t\t\n\t}\n}\n\nexport default connect(mapStateToProps, mapDispatchToProps)(' + componentName + ')\n';
	} else {
		res += '\nexport default ' + componentName + '\n';
	}

	return res;
}

function createComponentTmpl(componentName, stylesExt, functional, redux) {
	var res = createComponentImports(componentName, stylesExt, redux) + createComponentBody(componentName, functional) + createComponentExport(componentName, redux);
	return res;
}

exports.default = createComponentTmpl;