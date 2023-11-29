import React from 'react';
import { BrowserRouter  } from 'react-router-dom';
import { render  } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import './index.css';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import 'sweetalert2/src/sweetalert2.scss';
import './assets/css/animate.css';
import {userConstants} from "./_constants";
import moment from 'moment-jalaali';
import {BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import 'react-app-polyfill/ie11';

import { ActionCableProvider } from 'react-actioncable-provider';

// import ActionCable from 'actioncable';

// const cable = ActionCable.createConsumer('wss://etebarbakhshii.ir/cable');


axios.defaults.baseURL= userConstants.SERVER_URL;
moment.loadPersian({dialect:'persian-modern'});
render(
    <Provider store={store}>
        <BrowserRouter>
            <BreadcrumbsProvider>
                {/* <ActionCableProvider url={"wss://etebarbakhshii.ir/cable"}> */}
                    <App />
                {/* </ActionCableProvider>; */}
            </BreadcrumbsProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
