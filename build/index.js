#!/usr/bin/env node --harmony
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createDirectory = function () {
	var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(componentPath, parentResolve) {
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						return _context2.abrupt('return', new Promise(function (resolve, reject) {
							resolve = parentResolve || resolve;
							if (!_fs2.default.existsSync(componentPath)) {
								try {
									_fs2.default.mkdirSync(componentPath);
									resolve('GOTOVO');
								} catch (err) {
									if (err.code === 'ENOENT') {
										console.error(_chalk2.default.red("Some directory in the component folder path doesn't exist!\n" + "Please create this folders before:") + _chalk2.default.green('\'' + componentPath.split('/').slice(0, -1).join('/') + '\''));
									}
								}
							} else {
								(0, _co2.default)(_regenerator2.default.mark(function _callee() {
									var answer;
									return _regenerator2.default.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													_context.next = 2;
													return (0, _coPrompt2.default)("File is exist, are you want to change it? ['yes' for yes, 'no' from no] ['no' by default] ");

												case 2:
													answer = _context.sent;

													if (answer === 'yes') {
														console.log(componentPath);
														(0, _rimraf2.default)(componentPath, function () {
															createDirectory(componentPath, resolve);
														});
													} else {
														process.exit(0);
													}

												case 4:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, this);
								}));
							}
						}));

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function createDirectory(_x, _x2) {
		return _ref2.apply(this, arguments);
	};
}();

var initGenerator = function () {
	var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(userArg, stylesExt, functional, redux) {
		var componentPath, componentName, styleExt, dirDone, files;
		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						componentPath = (0, _index.getComponentPath)(userArg);
						componentName = (0, _index.getComponentName)(componentPath);
						styleExt = (0, _index.getStylesExt)(stylesExt);
						_context3.next = 5;
						return createDirectory(componentPath);

					case 5:
						dirDone = _context3.sent;
						_context3.next = 8;
						return createFiles(_index.createFileAction, componentPath, componentName, styleExt, (0, _index2.createComponentTmpl)(componentName, styleExt, functional, redux));

					case 8:
						files = _context3.sent;

						process.exit(0);

					case 10:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function initGenerator(_x3, _x4, _x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _coPrompt = require('co-prompt');

var _coPrompt2 = _interopRequireDefault(_coPrompt);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./utils/index');

var _index2 = require('./templates/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Init');

_commander2.default.version('0.0.1').command('comp').description('Create component').arguments('[componentPath]').option('-f, --functional', 'Make component functional').option('-r, --redux', 'Connect component to redux store').option('-s, --style [styleExt]', 'Select CSS pre or post processors').action(function (componentPath, _ref) {
	var functional = _ref.functional,
	    redux = _ref.redux;

	initGenerator(componentPath, _commander2.default.styleExt, functional, redux);
});

_commander2.default.parse(process.argv);

function createFiles(action, componentPath, componentName, styleExt, compTmpl) {
	var jsCreatePromise = new Promise(function (resolve, reject) {
		(0, _child_process.exec)(action + componentPath + '/' + componentName + '.js', function (err, stdout) {
			if (err) {
				reject(err);
			}
			_fs2.default.writeFile(componentPath + '/' + componentName + '.js', compTmpl, function (err) {
				if (err) {
					throw err;
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

	return new Promise(function (resolve) {
		Promise.all([jsCreatePromise, cssCreatePromise, pkjCreatePromise]).then(function () {
			resolve('Files created');
		});
	});
}