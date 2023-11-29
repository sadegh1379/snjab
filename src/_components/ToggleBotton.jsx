import React from 'react';
import PropTypes from 'prop-types'

export class ToggleBotton extends React.Component {

    constructor(props){
        super(props);
        this.state={
            COLOR:props.color || 'primary',
        }
    }
    componentDidUpdate(lastProps){
        if(lastProps.color!==this.props.color){
            const color=this.props.color;
            this.setState({COLOR:color});
        }
    }
    render() {
        let {btns, toggle_state} = this.props;
        const {COLOR}=this.state;

        return (
            <div className={this.props.className || 'toggle_btn'} style={this.props.style}>

                {btns.map((btn, i) =>
                    <button key={i} type="button"
                            className={`btn btn-outline-${COLOR} rounded-pill p-1 w-50  ${toggle_state && toggle_state.value == btn.value ? 'active' : ''}`}
                            onClick={() => {

                                this.props.onClickHandel(btn)
                            }} style={{lineHeight: '1.8em',fontSize:'0.8em'}}>
                        <span> {btn.label} </span>
                        {btn.icon &&
                        <span className={`rounded-circle  icon_wrapper  d-inline-block  ${btns.length===2 && i===0?'float-right':(i===1 && btns.length===2?'float-left':'')} ${toggle_state == btn ? 'bg-light text-'+COLOR : ' text-white bg-' +COLOR}`}
                              style={{width: 30, height: 30, lineHeight: '30px'}}>
                                            <i className={btn.icon}
                                               style={{fontSize: '1.3em', lineHeight: '1.7em'}}/>
                                            </span>
                        }
                    </button>
                )}
            </div>
        );
    }
}
ToggleBotton.propTypes={
    className:PropTypes.string,
    style:PropTypes.object,
    color:PropTypes.string,
    btns:PropTypes.arrayOf(PropTypes.shape({
        label:PropTypes.string,
        value:PropTypes.any,
    })),
    toggle_state:PropTypes.any
}