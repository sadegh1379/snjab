import React, { Component } from 'react'
import {Collapse} from 'react-collapse';
import PropTypes from 'prop-types'

export class CollapseComp extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSelected: this.props.isOpenedByDefault,
            isOpen: props.isOpenByDefault
        }
    }

    titleClick = (e) => {
        e.preventDefault();
        console.log('clicked')
    }
    componentDidUpdate(props,state){
        if(props.isOpenedByDefault!==this.props.isOpenedByDefault){
            this.setState({isSelected:this.props.isOpenedByDefault})
        }
    }
    handleCheckClick = (e) => {
        e.preventDefault();
        this.setState({
            isSelected: !this.state.isSelected
        },()=>{
            if(this.props.onChange!==undefined){
                this.props.onChange(this.state.isSelected)
            }
        })
    } 

    render() {
        return (
            <>  
            <button  onClick={this.handleCheckClick} className={`btn rounded checkListHeader w-100 ${this.props.className}`}>
                <div className="d-flex justify-content-between align-items-center  py-2">
                    <label htmlFor="" className={'align-items-center d-flex justify-content-center text-white '} >
                        <span><i className={`fa${this.state.isSelected !== true ? 'r' : '' } fa-square fa-2x px-3 text-white `}></i></span>
                        <span className='text-white'>
                            {this.props.title}
                        </span>

                    </label>
                    <span className={'btn bg-transparent text-white'}>
                            <i className={`${this.state.isSelected !== false ? 'fas fa-window-minimize' : 'fas fa-plus 2-px'} `}/>
                        </span>
                </div>
            </button>
            <Collapse isOpened={this.state.isSelected}>
                {this.props.children}
            </Collapse>
            </>
        )
    }
}


CollapseComp.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    isOpenedByDefault: PropTypes.bool,
    onChange:PropTypes.func
    
}

CollapseComp.defaultProps = {
    className: 'btn-primary',
    isOpenedByDefault: false
}