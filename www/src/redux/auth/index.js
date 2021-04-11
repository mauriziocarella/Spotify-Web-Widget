import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const auth = createSlice({
	name: 'auth',
	initialState: {},
	reducers: {
		set(state, action) {
			state.user = action.payload;
		},
		update(state, action) {
			_.each(action.payload, (v, k) => {
				state.user[k] = v;
			});
		}
	},
});

export const actions = {
	...auth.actions,
	// update: (user) => async (dispatch) => {
	// 	dispatch(auth.actions.update(user));
	// }
};
export const reducer = auth.reducer;
export default actions;
