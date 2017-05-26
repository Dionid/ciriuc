
function createComponentImports(componentName, stylesExt, redux = false) {

	let res = `/* @flow */
import React, { Component } from 'react'
import classnamesBind from 'classnames/bind'`

	if (redux) {
		res += `
import { connect } from 'react-redux'`
	}

	res += `
import styles from './${componentName}${stylesExt}'
const cx = classnamesBind.bind(styles)

type ${componentName}Props = {

}`

	return res
}

function createComponentBody(componentName, functional = false) {
	if (functional) {
		return (
`

function ${componentName}(props:${componentName}Props) {
	return (
		<div></div>
	)
}
`
		)
	} else {
		return (
`

class ${componentName} extends Component {
	props: ${componentName}Props

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
