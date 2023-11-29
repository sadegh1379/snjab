import React from 'react'
import Select from 'react-select';
// import '../../assets/sass/_supervisor.scss'
import img1 from '../../assets/images/doctor.png';
import img2 from '../../assets/images/library.png';
import {HospitalTable} from "../../_components";
import { Marks, ReviewCourses, EducationalHistory, EducationalCalendar, Effectiveness } from './Supervisor/';

// 3) 
export class Supervisor extends React.Component {

    state = {
        CurrentStep: 1,
        parts: [
            {
                title: 'بــررسی دوره های آموزشی',
                icon: '',
                backgroundColor: '',
                BorderColor: '',
                component: <ReviewCourses />,
                styles: {},
            },
            {
                title: 'بـرنامه ریزی آموزشی',
                icon: '',
                backgroundColor: '',
                BorderColor: '',
                component: <EducationalCalendar />,
                styles: {},
            },
            {
                title: 'شناسنامه اموزشی کارکنان',
                icon: '',
                backgroundColor: '',
                BorderColor: '',
                component: <EducationalHistory />,
                styles: {},
            },
            {
                title: 'اثـربخشی دوره های آموزشی',
                icon: '',
                backgroundColor: '',
                BorderColor: '',
                component: <Effectiveness />,
                styles: {},
            },
        ]
    }


    render() {
        const {CurrentStep, parts} = this.state;
        return (
            <div className={'supervisor'}>
                <Marks parts={parts} CurrentStep={CurrentStep}/>    
            </div>

        )
    }
}