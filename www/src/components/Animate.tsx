import React from "react"
import classNames from "classnames"

const Zoom = ({ active = false, className, ...props }: React.HTMLProps<HTMLDivElement> & {active: boolean}) => {
	return (
		<div className={classNames("zoom", { active }, className)} {...props}/>
	)
}

const Grow = ({ active = false, className, ...props }: React.HTMLProps<HTMLDivElement> & {active: boolean}) => {
	return (
		<div className={classNames("grow", { active }, className)} {...props}/>
	)
}

export {
	Zoom,
	Grow
}
