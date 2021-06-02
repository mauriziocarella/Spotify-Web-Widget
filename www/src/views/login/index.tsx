import React from "react"

import Container from "../../components/Container"

const Login = () => {
	return (
		<Container className="container text-center">
			<div className="mb-2">
				<h1 className="my-4">Login</h1>
				<h5 className="my-4 font-weight-normal text-semi-muted">Login with your spotify account to link the app and get access to widget link</h5>
				<a href={`${process.env.PUBLIC_URL}/api/auth/spotify`}>
					<button className="btn btn-primary">
						SPOTIFY
					</button>
				</a>
			</div>

			<div className="my-4 text-muted">
				<span className="me-1">Made with <span role="img">♥️</span> by</span>
				<a className="link-inherit text-decoration-none" href="https://mauriziocarella.it/">
					Maurizio Carella
				</a>
			</div>
		</Container>
	)
}

export default Login
