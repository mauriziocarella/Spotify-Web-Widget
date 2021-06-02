import React, { useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"

export interface ModalProps {
	isOpen?: boolean,
	toggle?: () => void
}
export interface ModalHeaderProps {
	title?: string,
	toggle?: () => void
}

export const ModalHeader = ({ title, toggle, className, children, ...props }: React.HTMLProps<HTMLDivElement> & ModalHeaderProps) => (
	<div className={classNames("modal-header", className)} {...props}>
		<h5 className="modal-title">{title}</h5>
		{toggle && (
			<button type="button" className="btn-close" aria-label="Close" onClick={toggle}/>
		)}
	</div>
)
export const ModalBody = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
	<div className={classNames("modal-body", className)} {...props}/>
)
export const ModalFooter = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
	<div className={classNames("modal-footer", className)} {...props}/>
)

export const Modal = ({ isOpen = false, toggle, children, ...props }: React.HTMLProps<HTMLDivElement> & ModalProps) => {
	const dialog = useRef<HTMLDivElement>(null)
	const [classes, setClasses] = useState<string>()

	const onBackdropClick = useCallback((e) => {
		if (e.target.contains(dialog.current)) {
			if (typeof toggle === "function") toggle()
		}
	}, [toggle])

	useEffect(() => {
		if (isOpen) {
			setClasses("d-block")
			setTimeout(() => setClasses("d-block show"), 0)
		} else {
			setClasses("d-block")
			setTimeout(() => setClasses(""), 200)
		}
	}, [isOpen])

	return (
		<div className={classNames("modal fade", classes)} onClick={onBackdropClick}>
			<div ref={dialog} className="modal-dialog">
				<div className="modal-content" {...props}>
					{children}
				</div>
			</div>
		</div>
	)
}
