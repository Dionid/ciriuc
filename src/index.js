#!/usr/bin/env node --harmony

import program from 'commander'
import co from 'co'
import chalk from 'chalk'
import prompt from 'co-prompt'
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

async function createDirectory(componentPath, parentResolve) {
	return new Promise((resolve, reject) => {
		resolve = parentResolve || resolve
		if (!fs.existsSync(componentPath)) {
			try {
				fs.mkdirSync(componentPath)
				resolve('GOTOVO')
			} catch (err) {
				if (err.code === 'ENOENT') {
					console.error(
						chalk.red("Some directory in the component folder path doesn't exist!\n Please create this folders before:")
						+ chalk.green(" mkdir " + componentPath.split('/').slice(0, -1).join('/'))
					)
				}
			}
		} else {
			co(function *() {
				const answer = yield prompt("File is exist, are you want to change it? ['yes' for yes, 'no' from no] ['no' by default] ")
				if (answer === 'yes') {
					console.log(componentPath)
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
	const jsCreatePromise = new Promise((resolve, reject) => {
		exec(action + componentPath + '/' + componentName + '.js', (err, stdout) => {
			if (err) {
				reject(err)
			}
			fs.writeFile(componentPath + '/' + componentName + '.js', compTmpl, (err) => {
				if (err) { throw err }
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

	const pkjCreatePromise = new Promise((resolve, reject) => {
		exec(action + componentPath + '/package.json', (err, stdout) => {
			if (err) { reject(err) }
			fs.writeFile(componentPath + '/package.json', createPackageJSON(componentName), (err) => {
				if (err) { reject(err) }
				resolve('Package created!')
			})
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

async function initGenerator(userArg, stylesExt, functional, redux){
	const componentPath = getComponentPath(userArg)
	const componentName = getComponentName(componentPath)
	const styleExt = getStylesExt(stylesExt)

	const dirDone = await createDirectory(componentPath)
	const files = await createFiles(createFileAction, componentPath, componentName, styleExt, createComponentTmpl(componentName, styleExt, functional, redux))
	process.exit(0);
}