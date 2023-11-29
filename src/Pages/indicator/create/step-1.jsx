import React from 'react';
import Select from 'react-select';
import {userActions} from "../../../_actions";
import {connect} from "react-redux";
import {DatePicker} from "react-advance-jalaali-datepicker";
import ContentEditable from 'react-contenteditable'
import autosize from 'autosize';
import Popover, {ArrowContainer} from 'react-tiny-popover'
import ReactTooltip from 'react-tooltip';

class Step1_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props.globalStorage.temp);
    }

    numerator = React.createRef();
    denumerator = React.createRef();

    DatePickerInput(props) {
        return <input type="text" className="form-control rounded-pill border-0 bg-white" {...props} />;
    }

    componentDidMount() {

        autosize(this.definition);
        autosize(this.logical_reasons_of_collecting);

    }

    componentDidUpdate(props, state) {
        if (props.globalStorage.temp !== this.state) {
            this.props.dispatch(userActions.setTemp({temp: this.state}))
        }
    }

    render() {
        const {ward_list, code, edit_date, creation_date, title, logical_reasons_of_collecting, definition, numerator, numerator_indicator_id, denumerator_indicator_id, numerator_help, numerator_help_popover, numerator__popover, denumerator_help_popover, denumerator__popover, denumerator_help, denumerator, multiplier, target, upper_limit, lower_limit} = this.state;
        const {wards, indicators} = this.props.globalStorage;
        return (

            <div className="first-step">

                <div className="step-content py-3">

                    <div className="row justify-content-center">
                        <div className="form-group text-right col-sm-5 col-10">
                            <label className="color-dark iran-sans_Bold my-3" style={{fontSize:'13px'}}>
                                عنـوان شـاخص

                            </label>
                            <input type="text" className="form-control rounded-pill border-0" style={{fontSize:'13px'}}
                                   name="title"
                                   value={title}
                                   onChange={userActions.handleChangeInput.bind(this)}/>
                        </div>

                        <div className="form-group text-right col-sm-5 col-10">
                            <label className="color-dark iran-sans_Bold my-3" style={{fontSize:'13px'}}>
                                کـد شـاخص

                            </label>
                            <input type="text" className="form-control rounded-pill border-0" style={{fontSize:'13px'}}
                                   name="code"
                                   value={code}
                                   onChange={userActions.handleChangeInput.bind(this)}/>
                        </div>


                        <div
                            className="d-flex flex-column justify-content-center text-right col-sm-5 col-10">
                            <label className="color-dark iran-sans_Bold my-3" htmlFor="creation_date"style={{fontSize:'13px'}}>تاریـخ
                                تدویـن</label>
                            <div className="input-group-prepend">
                                <i className="fas fa-calendar-alt color-dark"></i>
                            </div>
                            <DatePicker style={{fontSize:'13px'}}
                                preSelected={creation_date}
                                inputComponent={this.DatePickerInput}
                                placeholder="انتخاب تاریخ"
                                format="jYYYY/jMM/jDD"
                                cancelOnBackgroundClick={true}
                                onChange={(unix, formatted) => {
                                    this.setState({"creation_date": formatted})
                                }}
                                id="creation_date"
                            />
                        </div>

                        <div
                            className="d-flex flex-column justify-content-center text-right col-sm-5 col-10">
                            <label className="color-dark iran-sans_Bold my-3" htmlFor="edit_date" style={{fontSize:'13px'}}>تارـیخ بازنگــری</label>
                            <div className="input-group-prepend">
                                <i className="fas fa-calendar-alt color-dark"></i>
                            </div>
                            <DatePicker style={{fontSize:'13px'}}
                                preSelected={edit_date}
                                inputComponent={this.DatePickerInput}
                                placeholder="انتخاب تاریخ"
                                format="jYYYY/jMM/jDD"
                                cancelOnBackgroundClick={true}
                                onChange={(unix, formatted) => {
                                    this.setState({"edit_date": formatted})
                                }}
                                id="edit_date"
                            />
                        </div>

                        <div className="custom-select-box form-group text-right col-10">
                            <label className="color-dark iran-sans_Bold my-3" style={{fontSize:'13px'}}>بخش یـا واحـد</label>
                            <Select className="text-justify custom-select-2" style={{fontSize:'13px'}}
                                    value={ward_list}
                                    name="ward_list"
                                    placeholder="انتخاب بخش یا واحد"
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={wards}
                                    getOptionLabel={opt => opt.name}
                                    getOptionValue={opt => opt._id}
                            />
                        </div>

                        <div className="form-group text-right col-10">
                            <label className="color-dark iran-sans_Bold my-3" style={{fontSize:'13px'}}> تعریف شـاخص و اهمیت موضـوع در بیمـارستـان
                                </label>
                            <textarea style={{minHeight:'100px',fontSize:'13px',lineHeight:'1.8em'}}
                                className={`form-control ${definition.indexOf('\n') >= 0 ? 'rounded' : ''} border-0 `}
                                name="definition"
                                ref={c => this.definition = c}
                                value={definition}
                                rows={1}
                                onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>

                        <div className="form-group text-right col-10">
                            <label className="color-dark iran-sans_Bold my-3" style={{fontSize:'13px'}}>دلایل منطقـی جمـع آوری
                                شـاخص</label>

                            <textarea style={{minHeight:'70px',fontSize:'13px',lineHeight:'1.8em'}}
                                className={`form-control ${logical_reasons_of_collecting.indexOf('\n') >= 0 ? 'rounded' : ''} border-0 `}
                                name="logical_reasons_of_collecting"
                                ref={c => this.logical_reasons_of_collecting = c}
                                value={logical_reasons_of_collecting}
                                rows={1}
                                onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center my-5">
                        <div className="text-right col-xl-6 col-md-9 px-0">
                            <label className="color-dark iran-sans_Bold mx-2" style={{fontSize:'13px'}}>فــرمـول شـاخص (فقط از ، برای جدا کردن استفاده کنید)</label>
                            <div className="calculation d-flex flex-column align-items-center py-5">

                                <div className="row justify-content-end w-100">

                                    <input style={{fontSize:'13px'}}
                                        type="text"
                                        name="numerator"
                                        value={ numerator}
                                        style={{fontSize : '10px'}}
                                        className="rounded-pill border-0 text-center col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                        onChange={userActions.handleChangeInput.bind(this)}
                                        onKeyUp={(e)=>{
                                            if(e.target.value === ''){
                                                this.setState({numerator_indicator_id : null})
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                                e.preventDefault()
                                            }
                                        }}
                                        // readOnly={numerator_indicator_id}
                                    />
                                    {/*<ContentEditable
                                                    innerRef={this.numerator}
                                                    name="numerator"
                                                    html={numerator} // innerHTML of the editable div
                                                    disabled={false} // use true to disable edition
                                                    onChange={(e)=>userActions.maskInput.call(this,e,'numerator',{className:"iran_sans_Bold text_muted"})} // handle innerHTML change
                                                    className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                                    tagName='div'
                                                    onKeyDown={(e)=>{
                                                        if(e.keyCode==13){
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />*/}

                                    <div className="d-flex justify-content-center col-1">
                                        <Popover
                                            isOpen={numerator_help_popover}
                                            position={['top', 'right', 'left', 'bottom']} // preferred position
                                            padding={10}
                                            onClickOutside={() => this.setState({numerator_help_popover: false})}
                                            content={({position, targetRect, popoverRect}) => (
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                >
                                                    <>

                                                        <div className="bg-blue rounded p-4">
                                                            <p className="text-center pb-1 text-white iran-sans_Bold" style={{fontSize:'13px'}}>راهنمـای صورت</p>
                                                            <textarea style={{minHeight:'100px',fontSize:'13px',lineHeight:'1.8em'}}
                                                                className={`form-control ${numerator_help.indexOf('\n') >= 0 ? 'rounded' : 'rounded-pill'} border-0 `}
                                                                name="numerator_help"
                                                                value={numerator_help}
                                                                rows={numerator_help.split('\n').length || 1}
                                                                onChange={userActions.handleChangeInput.bind(this)}
                                                            />
                                                        </div>
                                                    </>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button data-tip="راهنمـا" onClick={() => {
                                                this.setState({numerator_help_popover: !numerator_help_popover})
                                            }}
                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                    style={{width: 34, height: 34}}><i
                                                className="fas fa-question text-white"></i>
                                                <ReactTooltip type="light"/>
                                            </button>
                                        </Popover>
                                    </div>
                                    <div className="d-flex justify-content-center col-1">
                                        <Popover
                                            isOpen={numerator__popover}
                                            position={['top', 'right', 'left', 'bottom']} // preferred position
                                            padding={10} containerStyle={{overflow: 'visible'}}
                                            onClickOutside={() => this.setState({numerator__popover: false})}
                                            content={({position, targetRect, popoverRect}) => (
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                >
                                                    <>

                                                        <div className="bg-blue rounded p-4 ">
                                                            <p className="text-center pb-1 text-white iran-sans_Bold" style={{fontSize:'12px',width:'350'}}>مقدار صورت از
                                                                مقادیر شاخص دیگری وارد شود </p>
                                                            <label className="py-1 mx-2 w-100 d-block"
                                                                   style={{maxWidth: 350, fontSize: '.8em'}}>
                                                                <Select className="text-justify custom-select-2"
                                                                        value={numerator_indicator_id}
                                                                        name="numerator_indicator_id"
                                                                        placeholder="شاخص مورد نظر را انتخاب کنید"
                                                                        onChange={
                                                                            (v, d) => userActions.handleChangeSelect.call(this, v, d, null, null, (data) => {
                                                                                if (data) {
                                                                                    this.setState({numerator:data.title})
                                                                                }
                                                                                else{
                                                                                    this.setState({numerator:''})
                                                                                }
                                                                            })
                                                                        }
                                                                        isClearable
                                                                        options={indicators}
                                                                        getOptionLabel={opt => opt.title}
                                                                        getOptionValue={opt => opt.id}

                                                                />
                                                            </label>
                                                        </div>
                                                    </>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button data-tip="انتخـاب از مقـادیـر شـاخص" onClick={() => {
                                                this.setState({numerator__popover: !numerator__popover})
                                            }}
                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                    style={{width: 34, height: 34}}><i
                                                className="fas fa-list text-white"></i>
                                                <ReactTooltip type="light"/>
                                            </button>
                                        </Popover>
                                    </div>
                                </div>
                                <div
                                    className="row align-items-center justify-content-center w-100 pl-sm-5">
                                    <input type="text"
                                           className="rounded-pill border-0 py-2 col-2 shadow-sm text-center"
                                           name="multiplier"
                                           value={multiplier}
                                           onChange={(e) => userActions.handleChangeInput.call(this, e, 'number')}
                                    />
                                    <div className="text-center col-1 px-0">
                                        <i className="fas fa-times"></i>
                                    </div>
                                    <div className="h-line col-7"></div>
                                </div>
                                <div className="row justify-content-end w-100">
                                    <input
                                        type="text"
                                        name="denumerator"
                                        value={denumerator}
                                        style={{fontSize : '10px'}}
                                        className="rounded-pill border-0 text-center col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                        onChange={userActions.handleChangeInput.bind(this)}
                                        onKeyUp={(e)=>{
                                            if(e.target.value === ''){
                                                this.setState({denumerator_indicator_id : null})
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                                e.preventDefault()
                                            }
                                        }}
                                        // readOnly={denumerator_indicator_id}
                                    />
                                    {/* <ContentEditable
                                                    innerRef={this.denumerator}
                                                    name="denumerator"
                                                    html={denumerator} // innerHTML of the editable div
                                                    disabled={false} // use true to disable edition
                                                    onChange={(e)=>userActions.maskInput.call(this,e,'denumerator',{className:"iran-sans_Bold text-muted"})} // handle innerHTML change
                                                    className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                                    tagName='div'
                                                    onKeyDown={(e)=>{
                                                        if(e.keyCode==13){
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />*/}
                                    <div className="d-flex justify-content-center col-1">
                                        <Popover
                                            isOpen={denumerator_help_popover}
                                            position={['bottom', 'left', 'right', 'top']} // preferred position
                                            padding={10}
                                            onClickOutside={() => this.setState({denumerator_help_popover: false})}
                                            content={({position, targetRect, popoverRect}) => (
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                ><>

                                                    <div className="bg-blue rounded p-4">
                                                        <p className="text-center pb-1 text-white iran-sans_Bold" style={{fontSize:'13px'}}>راهنمای مخرج</p>
                                                        <textarea  style={{minHeight:'100px',fontSize:'13px',lineHeight:'1.8em'}}
                                                            className={`form-control ${denumerator_help.indexOf('\n') >= 0 ? 'rounded' : 'rounded-pill'} border-0 `}
                                                            name="denumerator_help"
                                                            value={denumerator_help}
                                                            rows={denumerator_help.split('\n').length || 1}
                                                            onChange={userActions.handleChangeInput.bind(this)}
                                                        />
                                                    </div>
                                                </>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button data-tip="راهنما" onClick={() => {
                                                this.setState({denumerator_help_popover: !denumerator_help_popover})
                                            }}
                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                    style={{width: 34, height: 34}}><i
                                                className="fas fa-question text-white"></i>
                                                <ReactTooltip type="light"/>
                                            </button>
                                        </Popover>
                                    </div>
                                    <div className="d-flex justify-content-center col-1">
                                        <Popover
                                            isOpen={denumerator__popover}
                                            position={['top', 'right', 'left', 'bottom']} // preferred position
                                            padding={10} containerStyle={{overflow: 'visible'}}
                                            onClickOutside={() => this.setState({denumerator__popover: false})}
                                            content={({position, targetRect, popoverRect}) => (
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                >
                                                    <>

                                                        <div className="bg-blue rounded p-4">
                                                            <p className="text-center pb-1 text-white">مقدار مخرج از
                                                                مقادیر شاخص دیگری وارد شود </p>
                                                            <label className="py-1 mx-2 w-100 d-block"
                                                                   style={{maxWidth: 350, fontSize: '.8em'}}>
                                                                <Select className="text-justify custom-select-2"
                                                                        value={denumerator_indicator_id}
                                                                        name="denumerator_indicator_id"
                                                                        placeholder="شاخص مورد نظر را انتخاب کنید"
                                                                        onChange={
                                                                            (v, d) => userActions.handleChangeSelect.call(this, v, d, null, null, (data) => {
                                                                                if (data) {
                                                                                    this.setState({denumerator:data.title})
                                                                                }
                                                                                else{
                                                                                    this.setState({denumerator:''})
                                                                                }
                                                                            })
                                                                        }
                                                                        isClearable
                                                                        options={indicators}
                                                                        getOptionLabel={opt => opt.title}
                                                                        getOptionValue={opt => opt.id}

                                                                />
                                                            </label>
                                                        </div>
                                                    </>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button data-tip="از مقادیر شاخص..." onClick={() => {
                                                this.setState({denumerator__popover: !denumerator__popover})
                                            }}
                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                    style={{width: 34, height: 34}}><i
                                                className="fas fa-list text-white"></i>
                                                <ReactTooltip type="light"/>
                                            </button>
                                        </Popover>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="calculation-inputs row justify-content-around col-9 py-5 my-5">


                            <div
                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                <h6 className="rounded-underline text-center color-dark iran-sans_Bold w-100 pb-2">تارگت</h6>
                                <input type="text"
                                       className="text-center form-control rounded-pill border-0 my-4"
                                       name="target"
                                       value={target}
                                       onChange={(e) => userActions.handleChangeInput.call(this, e, 'number')}/>
                            </div>

                            <div
                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                <h6 className="rounded-underline text-center color-dark iran-sans_Bold w-100 pb-2">حـد
                                    بالا</h6>
                                <input type="text"
                                       className="text-center form-control rounded-pill border-0 my-4"
                                       name="upper_limit"
                                       value={upper_limit}
                                       onChange={(e) => userActions.handleChangeInput.call(this, e, 'number')}/>
                            </div>

                            <div
                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                <h6 className="rounded-underline text-center color-dark iran-sans_Bold w-100 pb-2">حـد
                                    پاییـن</h6>
                                <input type="text"
                                       className="text-center form-control rounded-pill border-0 my-4"
                                       name="lower_limit"
                                       value={lower_limit}
                                       onChange={(e) => userActions.handleChangeInput.call(this, e, 'number')}/>
                            </div>
                        </div>
                    </div>


                </div>


            </div>

        )
    }
}

const Step1 = connect((state) => ({globalStorage: state.globalStorage}))(Step1_);
export {Step1}
