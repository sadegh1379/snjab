import { combineReducers } from 'redux';

import { globalStorage } from './globalStorage.reducer';

const rootReducer = combineReducers({
    globalStorage,
});

export default rootReducer;