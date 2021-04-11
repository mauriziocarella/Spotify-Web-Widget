import React from 'react';

import {Button} from 'reactstrap';

const Login = () => {
	return (
		<div className="container text-center">
			<div className="mb-2">
				<h1 className="my-4">Login</h1>
				<h5 className="my-4 font-weight-normal text-semi-muted">Login with your spotify account to link the app and get access to widget link</h5>
				<Button
					href={`${process.env.PUBLIC_URL}/api/auth/spotify`}
					color="primary"
				>
					SPOTIFY
				</Button>
			</div>

			<div className="my-4 text-muted">
				<span className="mr-1">Made with <span role="img">♥️</span> by</span>
				<a href="https://mauriziocarella.it/">
					Maurizio Carella
				</a>
			</div>
		</div>
	);
};

export default Login;
