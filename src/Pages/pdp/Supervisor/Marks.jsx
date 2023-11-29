import React, {Component} from 'react';
import {ReviewCourses} from './reviewCourses'

export class Marks extends Component {
    state = {
        renderComp: '',
        CurrentStep: 1
    }


    handleClickMark = (part, id, ev) => {
      this.setState({
          CurrentStep: id +1,
          renderComp: part.component 
        })
    }


    componentDidMount(){
        const {CurrentStep,parts}=this.props;
        this.setState({
            renderComp: parts[CurrentStep -1].component
        })
    }

    render () {
        return (
    <>
            <div className="top_arrow_menu">
                <ul className="list-unstyled">
                    {this.props.parts.map(
                        (item, index) => {
                            let isActive = this.state.CurrentStep-1 === index ? 'active' : 'not-active';
                            return (
                                <li onClick={(ev) => { this.handleClickMark(item, index) }} style={{backgroundColor: item.backgroundColor, borderColor: item.BorderColor}} key={index} className={`${isActive} `}>
                                    <i className="far fa-folder fa-2x text-center"></i>
                                    <span className="text-center">{item.title}</span>
                                </li>
                            )
                        }
                    )}
                </ul>
            </div>
            <div>
                {this.state.renderComp}
            </div>
                    {/* <ul className="list-unstyled">
                        <li className="active">
                            <i className="far fa-folder fa-2x text-center"></i>
                            <span className="text-center">بــررسی دوره های آموزشی</span>
                        </li>
                        <li className="gray not-active">
                            <i className="far fa-folder fa-2x text-center"></i>
                            <span className="text-center"></span>
                        </li>
                        <li className="orange not-active">
                            <i className="far fa-folder fa-2x text-center"></i>
                            <span className="text-center">شناسنامه اموزشی کارکنان</span>
                        </li>
                        <li className="red not-active">
                            <i className="far fa-folder fa-2x text-center"></i>
                            <span className="text-center">اثـربخشی دوره های آموزشی</span>
                        </li>
                    </ul> */}
    </>

        )
    }
}