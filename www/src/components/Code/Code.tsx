import React from "react"
import classNames from "classnames"

import Clipboard from "../Clipboard/Clipboard"

import styles from "./Code.module.scss"

const Code = ({ className, children, ...props }: React.HTMLProps<HTMLPreElement>) => {
	return (
		<Clipboard text={children}>
			<pre
				className={classNames(styles.container, className)}
				{...props}
			>
				{children}
			</pre>
		</Clipboard>
	)
}

export default Code
