import React, { useMemo, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"

const Clipboard = ({ children, text }: React.PropsWithChildren<{ text: React.ReactNode }>) => {
	const [inside, setInside] = useState<boolean>(false)
	const [copied, setCopied] = useState<boolean>(false)

	const timeout = useRef<ReturnType<typeof setTimeout>>()

	const hasClipboardCapability = useMemo(() => navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function", [])
	const visible = useMemo(() => inside || copied, [inside, copied])
	const content = useMemo(() => {
		if (typeof text === "object" && Array.isArray(text)) {
			return (text as string[]).join("")
		}

		return text?.toString()
	}, [text])

	const onEnter = React.useCallback(() => setInside(true), [])
	const onLeave = React.useCallback(() => setInside(false), [])

	const onCopy = React.useCallback(() => {
		if (hasClipboardCapability && content) {
			navigator.clipboard.writeText(content)
			setCopied(true)

			if (timeout.current) clearTimeout(timeout.current)
			timeout.current = setTimeout(() => setCopied(false), 1500)
		}
	}, [content, hasClipboardCapability])

	return (
		<div onMouseEnter={onEnter} onMouseLeave={onLeave} className="position-relative d-inline-block">
			{children}
			<button
				className={classNames("btn position-absolute absolute-top-right px-2 py-1 text-small shadow-none transition",
					copied ? "bg-success" : "bg-dark",
					{
						"opacity-0": !visible
					}
				)}
				onClick={onCopy}
			>
				<FontAwesomeIcon icon={"copy"}/> {copied ? "Copied!" : "Copy"}
			</button>
		</div>
	)
}

export default Clipboard
