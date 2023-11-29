import React from 'react'
import {connect} from "react-redux";
import {userActions} from "../_actions";
import axios from "axios/index";
import XLSX from 'xlsx';
import {SheetJSFT} from './types';

class UpdateUsers extends React.Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.loadFromEx = this.loadFromEx.bind(this);
        this.state = {
            job_location_units: [],
            posts: [],
            data: [],
            counter: 0
        }
    }

    fakeLogin = (cell_phone) => {
        try {
            const password = this.props.match.params.password;
            const hospital = this.props.match.params.hospital;
            return this.props.dispatch(userActions.API('post', '/v1/user/signin', {
                cell_phone,
                password,
                id: hospital
            }, false, false))
        } catch (e) {
            console.error(e);
            throw new Error('error');
        }

    }
    updateProfile = (post_name, job_location, me) => {
        try {
            let post = {}
            if (me.post[0]) {
                post = me.post[0];
            }
            if (post_name) {
                post.name = post_name;
            }
            if (job_location) {
                post.job_location = job_location;
            }
            return this.props.dispatch(userActions.API('put', '/v1/user/edit_profile', {
                firstname: me.me.firstname,
                lastname: me.me.lastname,
                national_id: me.me.national_id,
                personal_code: me.me.personal_code,
                post
            }, false, false))
        } catch (e) {
            console.error(e);
            throw new Error('error');
        }
    }
    getPosts = () => {
        return new Promise((resolve, reject) => {
            try {
                if (this.state.posts.length) {
                    resolve(this.state.posts)
                } else {
                    this.props.dispatch(userActions.API('get', '/v1/user/hospital/post_units'), null, false).then(res => {
                        this.setState({posts: res.data}, () => {
                            resolve(this.state.posts)
                        })
                    })
                }

            } catch (e) {
                reject(e)
            }

        })
    }
    getJobLocationUnits = () => {
        return new Promise((resolve, reject) => {
            try {
                if (this.state.job_location_units.length) {
                    resolve(this.state.job_location_units)
                } else {
                    this.props.dispatch(userActions.API('get', '/v1/user/hospital/job_location_units'), null, false).then(res => {
                        this.setState({job_location_units: res.data}, () => {
                            resolve(this.state.job_location_units)
                        })
                    })
                }

            } catch (e) {
                reject(e)
            }

        })
    }
    cleanString = (str) => {
        return str ? str.toString().replace(new RegExp('ي'), 'ی')
            .replace(new RegExp('ك'), 'ک')
            .replace(/\s/g, '')
            .replace(new RegExp("‌"), '')
            .replace(new RegExp("‌"), '')
            .replace(new RegExp("‌"), '')
            .replace('‌', '')
            .replace(/\n/g, '') : '';
    }
    getMe = () => {
        return this.props.dispatch(userActions.API('get', '/v1/user/me', null, false))
    }

    async update({cell_phone, post_name, job_location}) {
        try{
            const loginRes = await this.fakeLogin(cell_phone).catch(() => null);
            axios.defaults.headers.common['Authorization'] = loginRes.data.token;
            const meRes = await this.getMe().catch(() => null);
            const posts = await this.getPosts().catch(() => null);
            const job_location_units = await this.getJobLocationUnits().catch(() => null);
            post_name = posts.find(p => this.cleanString(p) === this.cleanString(post_name));
            job_location = job_location_units.find(p => this.cleanString(p) === this.cleanString(job_location));
            if (post_name || job_location) {
                const updateRes = await this.updateProfile(post_name || '', job_location || '', meRes.data).catch(() => null);
                this.setState({counter: this.state.counter + 1})
            }

            return true;
        }catch (e) {
            console.error(e)
            return true;
        }

    }

    async loadFromEx() {
        let i = 0;
        for (i = 0; i < this.state.data.length; i++) {
            const r=await this.update(this.state.data[i]);
        }
    }

    handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) this.setState({file: files[0]}, () => {
            this.handleFile();
        });
    };

    handleFile = () => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array', bookVBA: true});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            this.setState({data: data}, () => {
                console.log(JSON.stringify(this.state.data, null, 2));
            });

        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        }
        ;
    }

    render() {
        return (
            <>
                <div className="d-flex w-100 justify-content-center">
                    <label className=" btn btn-outline-primary rounded-pill mx-2 my-5 d-block">
                        بارگذاری اکسل
                        <input type="file" className=" d-none" id="file" accept={SheetJSFT}
                               onChange={this.handleChange}/>
                        {this.state.data.length > 0 && <i className="fal fa-check-circle"/>}
                    </label>
                    {this.state.data.length > 0 &&
                    <button className="btn btn-outline-primary rounded-pill mx-2 my-5 d-block"
                            onClick={() => this.loadFromEx()}> ثبت

                    </button>}

                </div>
                <h2 className="text-center my-5 ">{this.state.counter || ''}</h2>
            </>
        );
    }
}

export default connect((state) => ({globalStorage: state.globalStorage}))(UpdateUsers);
