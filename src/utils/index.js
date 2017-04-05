let createFileAction;

// Detecting if platform is Windows, OSX, or Linux
// for creating files
switch (process.platform) {
	case 'darwin':
	case 'linux':
		createFileAction = 'touch ';
		break;
	case 'win32':
		createFileAction = 'echo > ';
		break;
	default:
		throw new Error('Unsupported platform: ' + process.platform);
}

function getComponentPath(componentPath) {
	let res = ''

	if (componentPath.indexOf('.') !== 0) {
		if (componentPath.indexOf('/') !== 0) {
			res += './'
		} else {
			res += '.'
		}
	}

	const componentPathArr = componentPath.split('/')
	let compName = componentPathArr[componentPathArr.length - 1]
	const compPath = componentPathArr.slice(0,-1).join('/')

	compName = compName.charAt(0).toUpperCase() + compName.slice(1)

	res += compPath + '/' + compName

	return res
}

function getComponentName(componentPath) {
	const componentPathArr = componentPath.split('/')
	const componentName = componentPathArr[componentPathArr.length - 1]

	return componentName
}

function getStylesExt(userStylesExt) {
	let res = '.'

	if (userStylesExt) {
		res += userStylesExt
	} else {
		res += 'scss'
	}

	return res
}

export {
	getComponentPath,
	getComponentName,
	getStylesExt,
	createFileAction
}
