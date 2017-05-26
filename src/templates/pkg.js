function createPackageJSON(componentName) {
	return (
		`{
	"main": "./${componentName}.js"
}
`
	)
}

export default createPackageJSON