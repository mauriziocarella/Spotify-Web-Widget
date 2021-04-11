import {configureStore} from '@reduxjs/toolkit';

import {reducer as auth} from './auth';

const store = configureStore({
	reducer: {
		auth,
	},
});

export default store;
