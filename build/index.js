#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./utils/index');

var _index2 = require('./templates/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.1').command('comp').description('Create component').arguments('[componentPath]').option('-f, --functional', 'Make component functional').option('-r, --redux', 'Connect component to redux store').option('-s, --style [styleExt]', 'Select CSS pre or post processors').action(function (componentPath, _ref) {
	var functional = _ref.functional,
	    redux = _ref.redux;

	initGenerator(componentPath, _commander2.default.styleExt, functional, redux);
});

_commander2.default.parse(process.argv);

function createDirectory(componentPath, parentResolve) {
	return new Promise(function (resolve, reject) {
		resolve = parentResolve || resolve;
		if (!_fs2.default.existsSync(componentPath)) {
			(0, _mkdirp2.default)(componentPath, function (err) {
				if (err) console.error(_chalk2.default.red(err));
				resolve('GOTOVO');
			});
		} else {
			_prompt2.default.start();
			_prompt2.default.get([{
				name: 'change',
				type: 'string',
				description: "File is exist, are you want to change it? ['yes' for yes, 'no' from no] ['no' by default] "
			}], function (err, answer) {
				if (answer.change === 'yes') {
					(0, _rimraf2.default)(componentPath, function () {
						createDirectory(componentPath, resolve);
					});
				} else {
					process.exit(0);
				}
			});
		}
	});
}

function createFiles(action, componentPath, componentName, styleExt, compTmpl) {
	var pkjCreatePromise = new Promise(function (resolve, reject) {
		(0, _child_process.exec)(action + componentPath + '/package.json', function (err, stdout) {
			if (err) {
				reject(err);
			}
			_fs2.default.writeFile(componentPath + '/package.json', (0, _index2.createPackageJSON)(componentName), function (err) {
				if (err) {
					reject(err);
				}
				resolve('Package created!');
			});
		});
	});

	var jsCreatePromise = new Promise(function (resolve, reject) {
		(0, _child_process.exec)(action + componentPath + '/' + componentName + '.js', function (err, stdout) {
			if (err) {
				if (err) console.error(_chalk2.default.red(err));
				reject(err);
			}
			_fs2.default.writeFile(componentPath + '/' + componentName + '.js', compTmpl, function (err) {
				if (err) {
					if (err) console.error(_chalk2.default.red(err));
				}
				resolve('Js created');
			});
		});
	});

	var cssCreatePromise = new Promise(function (resolve, reject) {
		(0, _child_process.exec)(action + componentPath + '/' + componentName + styleExt, function (err, stdout) {
			if (err) {
				reject(err);
			}
			resolve('Styles created!');
		});
	});

	return new Promise(function (resolve) {
		Promise.all([jsCreatePromise, cssCreatePromise, pkjCreatePromise]).then(function () {
			resolve('Files created');
		});
	});
}

function initGenerator(userArg, stylesExt, functional, redux) {
	var componentPath = (0, _index.getComponentPath)(userArg);
	var componentName = (0, _index.getComponentName)(componentPath);
	var styleExt = (0, _index.getStylesExt)(stylesExt);

	createDirectory(componentPath).then(function () {
		createFiles(_index.createFileAction, componentPath, componentName, styleExt, (0, _index2.createComponentTmpl)(componentName, styleExt, functional, redux)).then(function () {
			process.exit(0);
		});
	});
}