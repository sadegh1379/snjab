import React from 'react';
import {connect} from 'react-redux';
import {BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import gaugeIcon from '../assets/images/gauge.png';
class Home extends React.Component{

    constructor(props){
        super(props);
    }
    goTo=(url)=>{
        this.props.history.push(url);
    }
    render(){

        return (<><BreadcrumbsItem icon={gaugeIcon} to="/" >
            صفحه اصلی
        </BreadcrumbsItem>
                <button onClick={this.goTo('/login')} className="btn rounded-pill btn-outline-primary d-block mx-auto my-5">ورود</button>
            </>
        );
    }
}
export default connect()(Home);