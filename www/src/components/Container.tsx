import React from "react"

const Container = ({ ...props }) => {
	React.useEffect(() => {
		document.body.classList.add("bg-body")

		return () => {
			document.body.classList.remove("bg-body")
		}
	}, [])

	return (
		<div {...props}/>
	)
}

export default Container
