import React,{ Component } from 'react';
import Marquee from "react-smooth-marquee";
import PropTypes from 'prop-types';

export class AdminMessage extends Component{

    render(){
        return(
            <div className="iran-sans_Bold fa-rotate-180 overflow-hidden position-relative" style={{padding:'23px',borderRadius:'10px',background:'#104c82',color:'#ffffff',fontSize:'14px'}}>
                <Marquee>
                    <div className="fa-rotate-180">
                        {this.props.text}
                    </div>
                </Marquee>
            </div>
        )
    }
}
AdminMessage.defaultProps={
    text:'همـراه همیشگـی سنجـاب، لطفـاً برای بازگشت به صفحه' +
    ' اصلـی از دکمـه بازگشت استفاده' +
    ' کنیـد (استفـاده از بازگشت مرورگـر مجـاز نمی باشـد)'
}
AdminMessage.propTypes={
    text: PropTypes.string
}