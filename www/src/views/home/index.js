import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Collapse, FormGroup, Input, Label, Modal, ModalBody} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik} from 'formik';
import axios from 'axios';

import auth from '../../redux/auth';

import Code from '../../components/Code/Code';
import Container from '../../components/Container';

const Advanced = () => {
	const user = useSelector(({auth}) => auth.user);
	const [open, setOpen] = useState(false);

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), []);

	return (
		<div>
			<Button color="link" className="mb-2 text-muted text-small" onClick={toggleOpen}>
				Advanced <FontAwesomeIcon icon={open ? 'chevron-up' : 'chevron-down'}/>
			</Button>

			<Collapse isOpen={open}>
				<div className="mb-3">
					<h6>Use the following link to fetch current song details for your chat bot/moderator</h6>
					<Code>
						{window.location.origin}{process.env.PUBLIC_URL}/api/widget/{user.id}/text
					</Code>
				</div>

				<div className="mb-2" style={{fontSize: 12}}>
					<div className="mb-1"><a href="https://nightbot.tv" rel="noreferrer" target="_blank">Nightbot</a></div>
					<Code>
						/me Current playing: $(urlfetch {window.location.origin}{process.env.PUBLIC_URL}/api/widget/{user.id}/text)
					</Code>
				</div>
			</Collapse>
		</div>
	);
};

const Settings = () => {
	const user = useSelector(({auth}) => auth.user);
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);

	const toggleOpen = React.useCallback(() => setOpen((open) => !open), []);

	return (
		<>
			<Button onClick={toggleOpen}>
				<FontAwesomeIcon icon={'cog'}/>
			</Button>

			<Formik
				initialValues={{
					animation: '',
					...user.settings,
				}}
				enableReinitialize={true}
				onSubmit={(values, {setSubmitting}) => {
					axios.post('/api/settings', values)
						.then(({data: settings}) => {
							dispatch(auth.update({settings}));
							setOpen(false);
						})
						.finally(() => {
							setSubmitting(false);
						});
				}}
			>
				{({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, ...formik}) => (
					<form onSubmit={handleSubmit}>
						<Modal isOpen={open} toggle={toggleOpen}>
							<ModalBody>
								<FormGroup>
									<Label>Animation</Label>
									<Input
										type="select"
										name="animation"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.animation}
										invalid={errors.animation && touched.animation}
									>
										<option value=""/>
										<option value="slideDown">Slide Down</option>
										<option value="slideUp">Slide Up</option>
										<option value="slideRight">Slide Right</option>
										<option value="slideLeft">Slide Left</option>
									</Input>
								</FormGroup>

								{/*<pre>{JSON.stringify({*/}
								{/*	values,*/}
								{/*	dirty: formik.dirty,*/}
								{/*	isValid: formik.isValid,*/}
								{/*	errors,*/}
								{/*}, null, 4)}</pre>*/}

								<div className="text-center">
									<Button color="primary" type="submit" onClick={handleSubmit} disabled={isSubmitting || !formik.dirty || !formik.isValid}>
										Submit
									</Button>
								</div>
							</ModalBody>
						</Modal>
					</form>
				)}
			</Formik>
		</>
	);
};

const Home = () => {
	const user = useSelector(({auth}) => auth.user);

	return (
		<Container className="container text-center">
			<div className="my-4">
				<h1 className="d-inline-block mr-2">Welcome back</h1><h1 className="d-inline-block font-weight-normal">{user.displayName}</h1>
			</div>

			<div className="mb-4">
				<h4>To use your widget create a new browser source with this URL</h4>
				<Code>
					{window.location.origin}{process.env.PUBLIC_URL}/widget/{user.id}
				</Code>
				<div className="text-small text-semi-muted font-italic">Set height of canvas as 20% of width (ex. 1000x200)</div>
			</div>

			<div className="">
				<Button
					href={`${window.location.origin}${process.env.PUBLIC_URL}/widget/${user.id}`}
					target={'_blank'}
					color="primary"
				>
					Go to widget
				</Button>
			</div>

			<div className="my-2">
				<Settings/>
			</div>

			<div className="my-4">
				<Advanced/>
			</div>
		</Container>
	);
};

export default Home;
