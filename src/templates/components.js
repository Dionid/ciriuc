
function createComponentImports(componentName, stylesExt, redux = false) {

	let res = `/* @flow */
import React, { Component } from 'react'`

	if (redux) {
		res += `
import { connect } from 'react-redux'`
	}

	res += `
import styles from './${componentName}${stylesExt}'`

	return res
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

function createComponentExport(componentName, redux = false) {
	let res = ''

	if (redux) {
		res += `

function mapStateToProps(state, ownProps) {
	return {
		
	}
}

function mapDispatchToProps(dispatch) {
	return {
		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(${componentName})
`
	} else {
		res += `
export default ${componentName}
`
	}

	return res
}

function createComponentTmpl(componentName, stylesExt, functional, redux) {
	const res = createComponentImports(componentName, stylesExt, redux) + createComponentBody(componentName, functional) + createComponentExport(componentName, redux)
	return res
}

export default createComponentTmpl
