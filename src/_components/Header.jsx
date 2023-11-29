import React,{ useState,useEffect } from 'react';
import {Breadcrumbs,BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import { NavLink } from "react-router-dom";
import conceptIcon from '../assets/images/concept.png';
import gaugeIcon from '../assets/images/gauge.png';
import addIcon from '../assets/images/add.png';
import archiveCourse from "../assets/images/archive-course.png";
import reportIcon from '../assets/images/report.png';
import polling from "../assets/images/nazarsanji.svg";
import back from "../assets/images/back.png";
import dashListIcon from "../assets/images/dashindicator.png";
let history={};
function Links(props) {
    if(!props.icon){
        return '';
    }
    return(
        props.final?
            <span className="btn  title" >
                <img className="" src={props.icon} width="40px" height="40px"/>
                <span className="iran-sans_Bold h6 mx-2  " style={{fontSize:'13px'}}> {props.children}</span>
            </span>
            :
            <NavLink className="btn  title" to={props.to}>
                <img className="" src={props.icon} width="40px" height="40px"/>
                <span className="iran-sans_Bold h6 mx-2 showOnHover" > {props.children}</span>
            </NavLink>
    )
}
function container(props) {

    const goBack=()=>{
        props.children.length>1? history.goBack():window.history.back();
    }
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light header-Sec">
            <div className="container-fluid">
                <div className=" d-flex flex-wrap align-items-center justify-content-start"> {props.children}</div>
                <button onClick={goBack} className="btn  px-5">
                    <img
                    src={back}
                    alt="بازگشت"
                    className="d-block mx-auto"
                    width={40}
                /><div className="iran-sans_Bold" style={{fontSize:'11px',paddingTop:'5px'}}>بازگشت</div></button>

            </div>
        </nav>
    )
}
export function Header (props){

    useEffect(() => {
        history=props.history;
    });

    return(
        <Breadcrumbs
            hideIfEmpty={true}
            separator={<b/>}
            item={Links}
            finalItem={Links}
            finalProps={{
                final:true
            }}
            container={container}
        />

    )

}
export function Routes(props) {
    /*const [navigation]=useState(null);
    const [navigations]=useState([]);*/

    const self={};
    const forPrint=[];
    const printBreadcrumbsItem=(title,path,icon)=>{
        return (
            <BreadcrumbsItem icon={icon} to={path} key={Math.random(100,999)}>
                {title}
            </BreadcrumbsItem>

        )
    }

    const render=(_routes,index=0,path='')=>{
        const r=_routes.find(itm=>{

            return self.page && itm &&  itm.path==='/'+self.page[index]
        });

        if(r){

            if(r.childes && self.page.length>index+1){

                r.path=path+r.path;
                forPrint.push(r);
                return render(r.childes,index+1,r.path);

            }
        }
        r.path=path+r.path;
        forPrint.push(r);

        return r.path;
    }

    const routes=[
        {
        title:'شاخص های بیمارستان',
        icon:gaugeIcon,
        path:'/indicator',
        childes:[
            {
                title:'فهرست شاخص ها',
                icon:conceptIcon,
                path:'/list',
                childes:[
                    {
                        title:' ویرایش شاخص',
                        icon:addIcon,
                        path:'/edit',
                        /*childes:[
                            {path:/[a-zA-Z0-9]+/g}
                        ]*/
                    },
                    {
                        title:' افــزودن شاخص',
                        icon:addIcon,
                        path:'/create',
                    },
                    {
                        title:' جزئیات شاخص',
                        icon:addIcon,
                        path:'/detail',
                    },
                    {
                        title:'مشاهده چک لیست/پرسشنامه',
                        icon:addIcon,
                        path:'/checklist',
                    }

                ]
            },
            {
                title: 'داشبورد شاخص',
                icon: reportIcon,
                path: '/dashboard'
            },
            {
                title:'شاخص های بیمارستان در یک نگاه',
                icon:dashListIcon,
                path:'/compact',
                childes:[]
            },
        ]
    },
        {
            title:'شاخص هـا',
            icon:dashListIcon,
            path:'/collector',
            childes:[]
        },

        {
            title:'پایش شاخص',
            icon:conceptIcon,
            path:'/monitor',
            childes:[]
        },
        {
            title:'چک لیست ها',
            icon:conceptIcon,
            path:'/checklist',
            childes: [
                {
                    title:'جزئیات چک لیست',
                    icon:addIcon,
                    path:'/detail'
                },
                {
                    title:'تدوین چک لیست',
                    icon:addIcon,
                    path:'/create'
                },
                {
                    title:'داشبـورد چک لیست',
                    icon:gaugeIcon,
                    path:'/dashboard'
                },
            ]
        },
        {
            title:'چک لیست های ارزیابی',
            icon:conceptIcon,
            path:'/checklist_page'
        },
        {
            title:'مشاهده وضعیت چک لیست ارزیابی',
            icon:conceptIcon,
            path:'/checkliststate'
        },
        {
            path:'/pdp',
            // childes: []
            childes:[
                {
                    title:'برنامه توسعه فردی',
                    icon:gaugeIcon,
                    path:'/dashboard',
                },
                {
                    title:'برنامه توسعه فردی',
                    icon:gaugeIcon,
                    path:'/checking',
                    childes: [
                        {
                            title:'ارشیو',
                            icon:archiveCourse,
                            path:'/archives'
                        }
                    ]
                },
            ]
        }

    ]
    if(props.page){
        self.page=props.page.split('/');

        render([...routes]);

        return forPrint.reverse().map(r=>printBreadcrumbsItem(r.title,r.path,r.icon))
    }
    return '';



}
