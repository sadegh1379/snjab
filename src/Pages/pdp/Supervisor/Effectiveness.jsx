import React, { Component } from 'react'

import YadGiriimg from "../../../assets/images/asarbakhshiYadgiri.png"
import Vakoneshiimg from "../../../assets/images/asarBakhshiVakoneshi.png"

function yadGiri() {
  return (
    <div>
      <img src={{YadGiriimg}} className='w-100 h-100'></img>
    </div>
  )
}


export class Effectiveness extends Component {
    state = {
        renderComp: undefined,
    }
    
    handleClick = (Comp) => {
        this.setState({
            renderComp: Comp
        })
    }
    
    render() {
        return (
          <>
            <div>
              <div className="d-flex flex-column align-items-center">
                <p className="iran-sans_Bold">اثربخشــــی</p>
                <p className="text-center text-justify iran-sans_Bold ">
                  توجه داشته باشید ،مطابق استاندارد 3 ماه پس از برگذاری دوره های
                  آموزشی کارکنان باید اثر بخشی آنان مورد ارزیابی قرار بگیرد
                </p>
              </div>
              <div className=" d-flex justify-content-center mb-5 mt-2">
                <div className="btn-group btn-group-sm iran-sans_Bold  ">
                  <button
                    onClick={() => {
                      this.handleClick(<><div className="d-flex justify-content-center">
                      <img src={Vakoneshiimg} className='w-50 mb-5 ' />
                    </div></>);
                    }}
                    type="button"Vakoneshiimg
                    className="btn btn-outline-blue  px-5  rounded-right"
                  >
                    سطح واکنشی
                  </button>
                  <button
                    onClick={() => {
                      this.handleClick(<><div className="d-flex justify-content-center">
                        <img src={YadGiriimg} className='w-50 mb-5 ' />
                      </div></>);
                    }}
                    type="button"
                    className="btn  btn-outline-blue  px-4 rounded-0"
                  >
                    {" "}
                    سطح یادگیــری
                  </button>
                  <button
                    onClick={() => {
                      this.handleClick(<br />);
                    }}
                    type="button"
                    className="btn btn-outline-blue  active-btn-group px-4  rounded-left"
                  >
                    {" "}
                    سطح رفتــاری
                  </button>
                </div>
              </div>
            </div>


            {this.state.renderComp}
          </>
        );
    }
}
