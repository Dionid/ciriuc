#!/usr/bin/env node --harmony

import program from 'commander'
import co from 'co'
import mkdirp from 'mkdirp'
import chalk from 'chalk'
// import prompt from 'co-prompt'
import prompt from 'prompt'
import rimraf from 'rimraf'
import { exec } from 'child_process'
import fs from 'fs'
import {getComponentPath, getComponentName, createFileAction, getStylesExt} from './utils/index'
import { createPackageJSON, createComponentTmpl } from './templates/index'

console.log('Init')

program
	.version('0.0.1')
	.command('comp')
	.description('Create component')
	.arguments('[componentPath]')
	.option('-f, --functional', 'Make component functional')
	.option('-r, --redux', 'Connect component to redux store')
	.option('-s, --style [styleExt]', 'Select CSS pre or post processors')
	.action((componentPath, {functional, redux}) => {
		initGenerator(componentPath, program.styleExt, functional, redux)
	})

program.parse(process.argv)

function createDirectory(componentPath, parentResolve) {
	return new Promise((resolve, reject) => {
		resolve = parentResolve || resolve
		if (!fs.existsSync(componentPath)) {
			mkdirp(componentPath, function (err) {
				if (err) console.error(chalk.red(err))
				resolve('GOTOVO')
			})
		} else {
			prompt.start()
			prompt.get([{
				name: 'change',
				type: 'string',
				description: "File is exist, are you want to change it? ['yes' for yes, 'no' from no] ['no' by default] "
			}], function (err, answer) {
				if (answer.change === 'yes') {
					rimraf(componentPath, () => {
						createDirectory(componentPath, resolve)
					})
				} else {
					process.exit(0);
				}
			})
		}
	})
}

function createFiles(action, componentPath, componentName, styleExt, compTmpl) {
	const pkjCreatePromise = new Promise((resolve, reject) => {
		exec(action + componentPath + '/package.json', (err, stdout) => {
			if (err) { reject(err) }
			fs.writeFile(componentPath + '/package.json', createPackageJSON(componentName), (err) => {
				if (err) { reject(err) }
				resolve('Package created!')
			})
		})
	})

	const jsCreatePromise = new Promise((resolve, reject) => {
		exec(action + componentPath + '/' + componentName + '.js', (err, stdout) => {
			if (err) {
				if (err) console.error(chalk.red(err))
				reject(err)
			}
			fs.writeFile(componentPath + '/' + componentName + '.js', compTmpl, (err) => {
				if (err) { if (err) console.error(chalk.red(err)) }
				resolve('Js created')
			})
		})
	})

	const cssCreatePromise = new Promise((resolve, reject) => {
		exec(action + componentPath + '/' + componentName + styleExt, (err, stdout) => {
			if (err) { reject(err) }
			resolve('Styles created!')
		})
	})

	return new Promise((resolve) => {
		Promise.all([
			jsCreatePromise,
			cssCreatePromise,
			pkjCreatePromise
		]).then(() => {
			resolve('Files created')
		})
	})
}

function initGenerator(userArg, stylesExt, functional, redux){
	const componentPath = getComponentPath(userArg)
	const componentName = getComponentName(componentPath)
	const styleExt = getStylesExt(stylesExt)

	createDirectory(componentPath).then(() => {
		createFiles(createFileAction, componentPath, componentName, styleExt, createComponentTmpl(componentName, styleExt, functional, redux)).then(() => {
			process.exit(0);
		})
	})
}