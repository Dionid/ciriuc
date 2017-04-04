
function createComponentImports(componentName, stylesExt) {
	return(
`/* @flow */

import React, { Component, PropTypes } from 'react'
import styles from './${componentName}${stylesExt}'`
	)
}

function createComponentBody(componentName, functional = false) {
	if (functional) {
		return (
`

function ${componentName}() {
	return (
		<div></div>
	)
}

${componentName}.propTypes = {
	
}
`
		)
	} else {
		return (
`

class ${componentName} extends Component {

	static propTypes = {
		
	}

	render() {
		return (
			<div></div>
		)
	}
}
`
		)
	}
}

function createComponentExport(componentName) {
	return(
`

export default ${componentName}
`
	)
}

function createComponentTmpl(componentName, stylesExt, functional) {
	const res = createComponentImports(componentName, stylesExt) + createComponentBody(componentName, functional) + createComponentExport(componentName)
	return res
}

export default createComponentTmpl
