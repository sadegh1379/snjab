import React from 'react';
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types';
import backTable from '../assets/images/backs.png';
import fTable from '../assets/images/next.png';
export class Pagination extends React.Component {

    componentDidMount(){
    }
    render(){

        const {totalPage,active,callBack}=this.props;
        if(active && totalPage && totalPage>1){
            let arr1=[];
            let arr2=[];
            let pages_start_at=active<5 ?1:(totalPage<active+3?(totalPage-(active))+1:active-3);
            const until=totalPage<5?totalPage:pages_start_at+4;
            if(totalPage>2){
                for(let i=pages_start_at;i<=until && i<totalPage-2;i++){
                    arr1.push(i);
                }
                for(let j=totalPage+3;j>totalPage;j--){
                    arr2.push(j-3);
                }
            }else{
                arr1=[1,2];
            }

            arr2.reverse();
            return(
                <ul className="pagination" style={{marginTop: '50px'}}>
                    {active!==1 && <li className="page-item">
                        <button  className="page-link border-0 text-success bg-transparent" aria-label="Previous" data-toggle="tooltip" data-tip="صفحه قبلی" type="button" onClick={()=>{callBack(active-1)}}>
                            <span aria-hidden="true"><img src={fTable} style={{width: '35px',top: '-8px',position: 'relative'}}></img> </span>
                            <span className="sr-only">صفحه قبلی</span>
                        </button>
                        <ReactTooltip type="dark" />
                    </li>}
                    {
                        arr1.map((page,i)=>(

                                <li className="page-item " key={i} >
                                    {active === page ?
                                        <button className="btn  btn-pages rounded-pill active iran-sans_Bold "
                                                type="button" disabled>{page}</button>
                                        :
                                        <button className="btn  btn-pages rounded-pill iran-sans_Bold "
                                                type="button" onClick={()=>{callBack(page)}}>{page}</button>
                                    }
                                </li>
                        ))
                    }
                    {until+3<totalPage && <li className="page-item " ><span>...</span></li>}
                    {
                        arr2.map((page,i)=>(
                            <li className="page-item " key={i} >
                                {active === page ?
                                    <button className="btn  btn-pages rounded-pill active iran-sans_Bold "
                                            type="button" disabled>{page}</button>
                                    :
                                    <button className="btn  btn-pages rounded-pill iran-sans_Bold "
                                            type="button" onClick={()=>{callBack(page)}}>{page}</button>
                                }
                           
                            </li>
                        ))
                    }
                    {active!==totalPage &&
                    <li className="page-item " >
                        <button data-toggle="tooltip" data-tip="صفحه بعدی" type="button" onClick={()=>{callBack(active+1)}} className="page-link border-0 text-success bg-transparent" aria-label="Next">
                            <span aria-hidden="true" > <img src={backTable} style={{width: '35px',top: '-8px',position: 'relative'}}></img></span>
                            <span className="sr-only">صفحه بعدی</span>
                        </button>
                        <ReactTooltip type="dark" />
                    </li>
                    }
                </ul>
               

            );
        }
        return (<></>)
       
    }
}
Pagination.propTypes={
    totalPage:PropTypes.number.isRequired,
    active:PropTypes.number.isRequired,
    callBack:PropTypes.func.isRequired,
}