import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import { Formik } from "formik"
import axios from "axios"

import { RootState } from "../../redux"
import auth from "../../redux/auth"

import Code from "../../components/Code/Code"
import Container from "../../components/Container"
import { Collapse } from "../../components/Collapse"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal"

const Advanced = () => {
	const user = useSelector(({ auth }: RootState) => auth.user)
	const [open, setOpen] = useState(false)

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), [])

	return (
		<div>
			<button className="btn btn-link mb-2 text-muted text-small text-decoration-none" onClick={toggleOpen}>
				Advanced <FontAwesomeIcon icon={open ? "chevron-up" : "chevron-down"}/>
			</button>

			<Collapse isOpen={open}>
				<div className="mb-3">
					<h6>Use the following link to fetch current song details for your chat bot/moderator</h6>
					<Code>
						{window.location.origin}{process.env.PUBLIC_URL}/api/widget/{user.id}/text
					</Code>
				</div>

				<div className="mb-2" style={{ fontSize: 12 }}>
					<div className="mb-1"><a href="https://nightbot.tv" rel="noreferrer" target="_blank">Nightbot</a></div>
					<Code>
						/me Current playing: $(urlfetch {window.location.origin}{process.env.PUBLIC_URL}/api/widget/{user.id}/text)
					</Code>
				</div>
			</Collapse>
		</div>
	)
}

const Settings = () => {
	const user = useSelector(({ auth }: RootState) => auth.user)
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), [])

	return (
		<>
			<button className="btn btn-secondary" onClick={toggleOpen}>
				<FontAwesomeIcon icon={"cog"}/>
			</button>

			<Formik
				initialValues={{
					animation: "",
					...user.settings
				}}
				enableReinitialize={true}
				onSubmit={(values, { setSubmitting }) => {
					axios.post("/api/settings", values)
						.then(({ data: settings }) => {
							dispatch(auth.update({ settings }))
							setOpen(false)
						})
						.finally(() => {
							setSubmitting(false)
						})
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, ...formik }) => (
					<Modal isOpen={open} toggle={toggleOpen}>
						<form onSubmit={handleSubmit}>
							<ModalHeader title="Settings" toggle={toggleOpen}/>
							<ModalBody>
								<div className="form-group">
									<label>Animation</label>
									<select
										name="animation"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.animation}
										className={classNames("form-control", {
											"is-invalid": !!errors.animation && !!touched.animation
										})}
									>
										<option value=""/>
										<option value="slideDown">Slide Down</option>
										<option value="slideUp">Slide Up</option>
										<option value="slideRight">Slide Right</option>
										<option value="slideLeft">Slide Left</option>
									</select>
								</div>
							</ModalBody>
							<ModalFooter>
								<button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting || !formik.dirty || !formik.isValid}>
									Save
								</button>
								<button type="button" className="btn btn-secondary btn-sm" onClick={toggleOpen}>
									Close
								</button>
							</ModalFooter>
						</form>
					</Modal>
				)}
			</Formik>
		</>
	)
}

const Home = () => {
	const user = useSelector(({ auth }: RootState) => auth.user)

	return (
		<Container className="container text-center">
			<div className="my-4">
				<h1 className="d-inline-block me-2">Welcome back</h1><h1 className="d-inline-block font-weight-normal">{user.displayName}</h1>
			</div>

			<div className="mb-4">
				<h4>To use your widget create a new browser source with this URL</h4>
				<Code>
					{window.location.origin}{process.env.PUBLIC_URL}/widget/{user.id}
				</Code>
				<div className="text-small text-semi-muted font-italic">Set height of canvas as 20% of width (ex. 1000x200)</div>
			</div>

			<div className="">
				<a
					href={`${window.location.origin}${process.env.PUBLIC_URL}/widget/${user.id}`}
					rel="noreferrer"
					target={"_blank"}
				>
					<button className="btn btn-primary">
						Go to widget
					</button>
				</a>
			</div>

			<div className="my-2">
				<Settings/>
			</div>

			<div className="my-4">
				<Advanced/>
			</div>
		</Container>
	)
}

export default Home
