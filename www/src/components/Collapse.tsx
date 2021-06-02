import React, { useMemo, useRef } from "react"

const Collapse = ({ isOpen = false, ...props }: React.HTMLProps<HTMLDivElement> & { isOpen: boolean }) => {
	const content = useRef<HTMLDivElement>(null)

	const style = useMemo(() => {
		const style: React.CSSProperties = {
			maxHeight: 0
		}
		if (isOpen) {
			if (content.current && content.current.scrollHeight) {
				style.maxHeight = content.current.scrollHeight
			}
		}

		return style
	}, [isOpen])

	return (
		<div className="transition-slow overflow-hidden" style={style}>
			<div ref={content} {...props}/>
		</div>
	)
}

export {
	Collapse
}
