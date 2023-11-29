import React from 'react';
import moment from 'jalali-moment';
import Select from 'react-select';
import {DatePicker} from "react-advance-jalaali-datepicker";
import {globalStorage} from "../../_reducers/globalStorage.reducer";
import 'react-times/css/material/default.css';
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import {userConstants} from "../../_constants";
import {ToggleBotton} from "../../_components";
import gozaresh_khata from '../../assets/images/gozaresh_khata.svg';
import noavaranLogo from '../../assets/images/noavaran-logo.svg';
import TimePicker from 'react-times';
import { Navbar } from './Navbar';

class ErrorReport_ extends React.Component{

    constructor(props){
        super(props);

        this.state={
            reporter_name_other:'',
            focused:'',
            toggles:[
                {
                    label:'زن',
                    value:'زن',
                    icon:'fal fa-female'
                },
                {
                    label:'مرد',
                    value:'مرد',
                    icon:'fal fa-male'
                }
            ],
            gender:'',
            shifts:[

                {
                    label:'صبـح',
                    value:'صبح',
                },
                {
                    label:'عصـر',
                    value:'عصر',
                },
                {
                    label:'شـب',
                    value:'شب',
                }
            ],
            shift:'',
            report_types:[
                {
                    label:'خــطا',
                    value:true,

                },
                {
                    label:'موارد 28 گانه',
                    value:false,
                }
            ],
            report_type:this.hideAtHospital('11')?{
                label:'خــطا',
                value:true,
            }:'',
            reporter_name:'',
            users:[],
            wards:[],
            error_ward:'',
            patient_name:'',
            patient_number:'',
            date_event:'',
            time_event:'00:00',
            job:'',
            ward:'',
            cause:'',
            category:'',
            description:'',
            actions:'',
            suggestions:'',
            event_title:'',
            other_event_title:'',
            age:'',
            service_date:'',
            error_evaluation:'',
            etiology:'',
            error_type:'',
            conditions:'',
            other_reporter_name:'',
            allCauses:['شب کاری'
                ,'شیفت‌های طولانی و پشت سرهم'
                ,'ناخوانا بودن دستورات پزشک'
                ,'نقص فنی تجهیزات',
                'شلوغی بخش',
                'عدم ارتباط صحیح با بیمار',
                'عدم گزارش به موقع به پزشک',
                'دانش ناکافی پرسنل',
                'کمبود پرسنل',
                'تشابه شکل یا نام داروها',
                'اشتباه در محاسبه دوز داروها',
                'بی توجهی در اجرای دستور پزشک',
                'عدم رعایت درست فرآیند دارودهی',
                'عدم رعایت دستورالعمل داروهای پرخطر',
                'بی توجهی به اتصالات بیمار',
                'اشکال در تاسیسات',
                'ارزیابی اولیه نامناسب',
                'عدم رعایت دستورالعمل جراحی ایمن',
                'تشابه اسمی بیمار',
                'بی دقتی و بی توجهی پرسنل',
                'مهارت بالینی ناکافی پرسنل',
                'نداشتن مهارت کافی درکار با تجهیزات',
                'نبودن تجهیزات لازم و ضروری'
                ,'نبودن خط مشی و روش اجرایی واضح',
                'بی توجهی به تداخلات دارویی',
                'دانش ناکافی پزشک',
                'سایر موارد'].map(a=>({title:a})),
            allCauses2:[
                'نظارت ناکافی پرسنل' ,
                'ساختار نامناسب' ,
                'وجود وسایل آسیب زاد در بخش / محوطه' ,
                'حضور همراه در بخش' ,
                'ارزیابی نامناسب اولیه' ,
                'سن بالا' ,
                'افت فشار خون ارتوستاتیک' ,
                'دریافت داروهای آرام بخش' ,
                'خیس بودن / سر بودن زمین',
                'قفل نبودن چرخ تخت',
                'سایر موارد'
            ].map(a=>({title:a})),
            allJobs:['پزشک','کادر پرستاری','کادر مامایی','کمک بهیار','خدمات','تاسیسات','انتظامات','کادر آزمایشگاه','کادر دارویی','کادر اداری','کادر تغذیه','کادر اتاق عمل','کادر پذیرش','کادر تجهیزات پزشکی','کادر پاراکلینیک','کادر پشتیبانی','کادر تصویربرداری','منشی','کادر توانبخشی','فراگیر/دانشجو',
                'تکنسین بیهوشی',
                'تکنسین داروخانه',
                'تکنسین رادیولوژی',
                'کادر IT',
                'کادر امور مالی',
                'سایر'].map(a=>({title:a})),
            allErrorCat : this.hideAtHospital('25')?
                [
                    {
                        label:'نزدیک به خطا (پیامدی نداشته و قبل از آسیب برطرف شده)',
                        value:'نزدیک به خطا (Near-Miss)'
                    },{
                        label:'بدون عارضه – (آسیب جزئی)',
                        value:'بدون عارضه – (No Harm Event)'
                    },{
                        label:'عارضه برگشت‌پذیر (ناتوانی گذرا)',
                        value:'عارضه برگشت‌پذیر (Adverse Event)'
                    },{
                        label:'مرگ یا عارضه پایدار (ناتوانی دائم/مرگ)',
                        value:'مرگ یا عارضه پایدار (Sentinel Event)'
                    },
                ]
                :
                userActions.generateSelectLabelValue(['نزدیک به خطا (Near-Miss)','بدون عارضه – (No Harm Event)','عارضه برگشت‌پذیر (Adverse Event)','مرگ یا عارضه پایدار (Sentinel Event)']),
            allEventTitle:[

                '1- انجام عمل جراحي به صورت اشتباه روي عضو سالم' ,
                '2- انجام عمل جراحي به صورت اشتباه روي بيمار ديگر' ,
                '3- انجام عمل جراحي با روش اشتباه بر روي بيمار' ,
                '4- جا گذاشتن هر گونه device اعم از گاز و قيچي و پنس و ... در بدن بيمار' ,
                '5- مرگ در حين عمل جراحي يا بلافاصله بعد از عمل در بيمار داراي وضعيت سلامت طبيعي' ,
                '6- تلقيح مصنوعي با دهنده (DONOR) اشتباه درزوجين نابارور' ,
                '7- مرگ يا ناتواتي جدي بيمار به دنبال هر گونه استفاده از دارو و تجهيزات آلوده ميكروبي' ,
                '8- مرگ يا ناتواني جدي بيمار به دنبال استفاده از دستگاه‌هاي آلوده ' ,
                ' 9- مرگ يا ناتواني جدي بيمار به دنبال هر گونه آمبولي',
                '10- ترخيص و تحويل نوزاد به شخص و يا اشخاص غير از ولي قانوني' ,
                '11- مفقود شدن بيمار در زمان بستري كه بيش از 4 ساعت طول بكشد' ,
                '12- خودكشي يا اقدام به خودكشي در مركز درماني',
                '13- مرگ يا ناتواني جدي بيمار به دنبال هر گونه اشتباه در تزريق نوع دارو، دوزدارو، زمان تزريق دارو',
                '14- مرگ يا ناتواني جدي مرتبط با واكنش هموليتيك به علت تزريق گروه خون اشتباه در فرآورده‌هاي خوني',
                '15- كليه موارد مرگ يا عارضه مادر و نوزاد بر اثر زايمان طبيعي و يا سزارين' ,
                '16- مرگ يا ناتواني جدي به دنبال هيپوگليسمي در مركز درماني' ,
                '17- زخم بستر درجه 3 يا 4 بعد از پذيرش بيمار',
                '18- كرنيكتروس نوزاد ناشي از تعلل در درمان' ,
                '19- مرگ يا ناتواني جدي بيمار به علت هر گونه دستكاري غير اصولي ستون فقرات' ,
                '20- مرگ يا ناتواني جدي در اعضاي تيم احياء متعاقب هر گونه شوك الكتريكي به دنبال احيا بيمار كه مي‌تواند ناشي از اشكالات فني تجهيزات باشد',
                '21- حوادث مرتبط با استفاده اشتباه گازهاي مختلف به بيمار' ,
                '22- سوختگي‌هاي به دنبال اقدامات درماني مانند الكترودهاي اطاق عمل' ,
                '23- موارد مرتبط با محافظ و نگهدانده‌هاي اطراف تخت',
                '24- سقوط بيمار ' ,
                '25- موارد مرتبط با عدم رعايت موازين اخلاق پزشكي' ,
                '26- هرگونه آسيب فيزيكي ( ضرب و شتم و ...) وارده به بيمار',
                '27- ربودن بيمار',
                '28- اصرار به تزريق داروي خاص خطر آفرين يا قطع تعمدي اقدامات درماني توسط كادر درمان',
                'سایر موارد'

            ].map(a=>({title:a})),
            otherEventTitle:[
                'آسپیراسیون',
                'سوء مصرف مواد',
                'سوء رفتار جنسی',
                'آسیب به خود',
                'آسیب در حین مهار فیزیکی',
                'آسیب به محیط و پرخاشگری'
            ].map(a=>({title:a})),
            etiologies: [
                {
                    id:0,
                    name:'تشخیصی',
                    content:['تاخیر در تشخیص','اشتباه در تشخیص','فقدان تشخیص'].map(a=>({title:a}))
                },
                {
                    id:1,
                    name:'درمانی',
                    content:['روش درمانی اشتباه','جاماندن وسیله جراحی در بدن بیمار','عمل جراحی/پروسیجر روی عضو اشتباه','عمل جراحی/پروسیجر به روش اشتباه','عمل جراحی/پروسیجر روی بیمار اشتباه','عمل جراحی/پروسیجر در محل اشتباه','عدم رعایت دستورالعمل جراحی ایمن','عدم توجه به لوله ها و اتصالات',,'روش های ارائه مراقبت و درمان'
                        ,'عدم رعایت دستورالعمل' ,
                        ' الزامات کیفی و فنی'].map(a=>({title:a}))
                },
                {
                    id:2,
                    name:'داروئی',
                    content:['بکارنبردن شکل درست دارو','دوز نامناسب','داروی اشتباه','نحوه مصرف اشتباه','بیمار اشتباه','زمان اشتباه','بی توجهی به حساسیت‌های داروئی','تاخیر/حذف/تکرار/ ادامه دارودهی','بی توجهی به تلفیق/تداخلات داروئی','عدم رعایت دستورالعمل داروهای پرخطر','عدم توجه به آماده‌سازی دارو','ثبت اشتباه',
                        'عدم ثبت',
                        'ثبت ناقص',
                        'تاخیر در ثبت',
                        'دوز اشتباه'
                    ].map(a=>({title:a}))
                },
                {
                    id:3,
                    name:'تکنیکی',
                    content:['عدم انطباق اجرا با دستورالعمل یا گایدلاین','مهارت ناکافی در کار با تجهیزات','مهارت ناکافی در اجرای فرآیندها','آموزش ناکافی پرسنل در خصوص کار با تجهیزات','خرابی ابزار و تجهیزات','ارتباطات غیر موثر بین بخش‌ها/واحدها','تکنیک نادرست جراحی'].map(a=>({title:a}))
                },
                {
                    id:4,
                    name:'ثبت و گزارش‏ نویسی',
                    content:['عدم ثبت','ثبت ناقص گزارش',' ناخوانا بودن گزارش ثبتی','تاخیر در ثبت','عدم گزارش/ثبت دستورات تلفنی','ثبت در پرونده/کاردکس/فرم اشتباه','گزارش/ثبت اشتباه','جوابدهی اشتباه پاراکلینیک'].map(a=>({title:a}))
                },
                {
                    id:5,
                    name:'سیستمیک',
                    content:['نبودن دستورالعمل/خط‌مشی/روش اجرایی یا گایدلاین شفاف','روش اجرایی شفاف','منابع و امکانات ناکافی','دستور مدیریتی اشتباه','نظارت ناکافی','عدم وجود متولی یا پاسخگو در سازمان','ارتباط غیر موثر بین بخش‎ها/ واحدها ','عدم وجود متولی یا پاسخگو در پیامد و عوارض روی سازمان'].map(a=>({title:a}))
                }
            ],
            error_type_2:'',
            falls:[
                'زمین خوردن',
                'سقوط از تخت',
            ].map(a=>({title:a})),
            suicides:[
                'موفق',
                'ناموفق',
            ].map(a=>({title:a})),
            escape:[
                'موفق',
                'ناموفق',
            ].map(a=>({title:a})),

        }
        this.myRef = React.createRef();
    }
    hideAtHospital=(...id)=>{
        return [...id].indexOf(this.props.match.params.hospital)>=0
    }
    goBack=()=>{
        this.props.history.goBack();
    }

    searchFn=(value,type)=>{

            const {hospital}=this.props.match.params;

            this.props.dispatch(userActions.API('get',`/v1/search_${type}?hospital_id=${hospital}&query=${value}`,null,false)).then(res=>{
                if(type==='user'){
                    res.data.result.push({fn:'سایر',ln:'اعضا'})
                }
                this.setState({[type+'s']:res.data.result});
            });


    }
    search=(e,type)=>{
        const {value,name}=e.target;

        this.setState({[name]:value},()=>{
            if(value.length>=2){
                this.searchFn(value,type);
            }else{
                this.setState({[type+'s']:[]});
            }

        })
    }
    focused=(focused)=>{
        console.log(focused)
        this.setState({focused})
    }
    scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop)
    focuse_to=(elem)=>{

    }
    submitError=(e)=>{
        e.preventDefault();
        const {gender,shift,report_type,reporter_name,
            reporter_name_other,
            error_ward,
            patient_name,
            patient_number,
            conditions,
            focused,
            date_event,
            time_event,
            job,
            ward,
            cause,
            category,
            description,
            actions,
            suggestions,
            event_title,
            other_event_title,
            age,
            error_type_2,
            service_date,
            error_evaluation,
            etiology,
            error_type,}=this.state;
        if(report_type && report_type.value!=null){
            if(date_event){
                if(report_type.value===false){
                    if(patient_name.length){
                        if(patient_number.length){
                            if(reporter_name || reporter_name_other){
                                if(shift && shift.value!==null){
                                   /* if(time_event){*/
                                        if(event_title && event_title.title){
                                            this.submitErrorAPI({gender,shift,report_type,reporter_name,
                                                reporter_name_other,
                                                error_ward,
                                                conditions,
                                                patient_name,
                                                patient_number,
                                                focused,
                                                date_event,
                                                time_event,
                                                error_type_2,
                                                job,
                                                ward,
                                                cause,
                                                category,
                                                description,
                                                actions,
                                                suggestions,
                                                event_title,
                                                other_event_title,
                                                age,
                                                service_date,
                                                error_evaluation,
                                                etiology,
                                                error_type,});
                                        }else{
                                            userActions.failure('لطفاً عنوان واقعه را انتخاب کنید.');
                                        }

                                   /* }else{
                                        userActions.failure('لطفاً ساعت بروز خطا/واقعه را انتخاب کنید.');
                                        this.focuse_to('#report_type');
                                    }*/
                                }else{
                                    userActions.failure('لطفاً شیفت بروز خطا/واقعه را انتخاب کنید.');
                                    this.focuse_to('#report_type');
                                }
                            }else{
                                userActions.failure('لطفاً نام گزارش دهنده را انتخاب کنید.');
                                this.focuse_to('#report_type');
                            }
                        }else{
                            userActions.failure(`لطفاً 
                             ${this.hideAtHospital('25')?
                                    ' کد کامپیوتری'
                                    :
                                    ' شماره پرونده بیمار'
                                }
                             را وارد کنید.`);
                            this.focuse_to('#report_type');
                        }
                    }else{
                        userActions.failure('لطفاً نام بیمار را وارد کنید.');
                        this.focuse_to('#report_type');
                    }
                }else{
                    if(shift && shift.value!==null){
                        this.submitErrorAPI({gender,shift,report_type,reporter_name,
                            reporter_name_other,
                            error_ward,
                            conditions,
                            patient_name,
                            patient_number,
                            error_type_2,
                            focused,
                            date_event,
                            time_event,
                            job,
                            ward,
                            cause,
                            category,
                            description,
                            actions,
                            suggestions,
                            event_title,
                            other_event_title,
                            age,
                            service_date,
                            error_evaluation,
                            etiology,
                            error_type,});
                    }else{
                        userActions.failure('لطفاً شیفت بروز خطا/واقعه را انتخاب کنید.');
                        this.focuse_to('#report_type');
                    }
                }
            }else{
                userActions.failure('لطفاً تاریخ بروز خطا/واقعه را انتخاب کنید.');
                this.focuse_to('#report_type');
            }
        }else{
            userActions.failure('لطفاً نوع گزارش را انتخاب کنید.');
            this.focuse_to('#report_type');
        }

    }
    submitErrorAPI=(params)=>{
        params.gender=params.gender?params.gender.value:null;
        params.shift=params.shift?params.shift.value:null;
        params.report_type=params.report_type.value;
        if(params.event_title){
            if(params.event_title.title.indexOf('سقوط')>=0){
                if(!params.error_type_2){
                    userActions.failure('لطفاً نوع سقوط را انتخاب کنید.');
                    return false;
                }
                if(!params.error_evaluation || !params.error_evaluation.toString().length){
                    userActions.failure('لطفاً عدد ارزیابی سقوط را وارد کنید');
                    return false;
                }
            }
            if(params.event_title.title==='سایر موارد'){
                if(params.other_event_title.title){
                    params.event_title=params.other_event_title.title;
                }else{
                    userActions.failure('لطفا یکی از سایر عناوین واقعه را انتخاب کنید.');
                    return false;
                }
            }else{
                params.event_title= params.event_title.title;
            }

        }
        if(params.reporter_name.fn==='سایر' && params.reporter_name.fn==='اعضا' && !params.reporter_name_other.length){
            userActions.failure('لطفاً نام گزارش دهنده را وارد کنید.');
            return false;
        }
        if(params.job && params.job.title!=null){
          /*  if(params.cause && params.cause.title!=null){*/
                if(params.category && params.category.value!=null){
                   if(params.description){
                       if(params.job){
                           if(!this.hideAtHospital('11') && (this.hideAtHospital('25') && params.report_type === false) && !params.cause) {
                               userActions.failure('لطفاً علت بروز خطا/واقعه را انتخاب کنید.');
                               return false;
                           }
                                       if(params.category){
                                           if(!this.hideAtHospital('11') && (this.hideAtHospital('25') && params.report_type === false) && !params.etiology) {
                                               userActions.failure('لطفاً اتیولوژی خطا/واقعه را انتخاب کنید.');
                                               return false;
                                           }
                                               if(!this.hideAtHospital('11') && (this.hideAtHospital('25') && params.report_type === false) && !params.error_type) {
                                                   userActions.failure('لطفاً نوع خطا/واقعه را انتخاب کنید.');
                                                    return false;
                                               }
                                                   params.hospital_id=this.props.match.params.hospital;
                                                   params.year=moment().jYear();
                                                   params.ward=params.ward?params.ward.name: 'بخش ناشناس';
                                                   params.reporter_name=params.reporter_name_other?params.reporter_name_other:(params.reporter_name?params.reporter_name.fn+' '+params.reporter_name.ln: 'ناشناس');
                                                   params.error_ward=params.error_ward?params.error_ward.name : 'بخش ناشناس';
                                                   params.job=params.job?params.job.title:'';
                                                   params.cause=params.cause?params.cause.title:'';
                                                   params.category=params.category?params.category.value:'';
                                                   params.error_type=params.error_type?params.error_type.title:'';
                                                   params.error_type_2=params.error_type_2?params.error_type_2.title:'';
                                                   params.etiology=params.etiology?params.etiology.name:'';
                                                   params.date_event=moment(params.date_event,'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD HH:mm:ss');
                                                   params.service_date=moment(params.service_date,'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD HH:mm:ss');
                                                   let x=this.props.match.params.hospital.indexOf('11')>=0?'خانم طلایی ':'';
                                                   this.props.dispatch(userActions.API('post','/v1/error',params)).then(res=>{
                                                       userActions.successAlert('ثبت خطا',
                                                           'گزارش ' +
                                                           (params.report_type.value===false?'واقعه':'خطا') +
                                                           ' به کارشناس هماهنگ کننده ایمنی بیمار ' +x+
                                                           'ارسال گردید.');
                                                       this.props.history.goBack();
                                                   }).catch(err=>{

                                                   })


                                       }else{
                                           userActions.failure('لطفاً دسته بندی خطا/واقعه را انتخاب کنید.');
                                       }


                       }else{
                           userActions.failure('لطفاً رده شغلی خطا کننده را انتخاب کنید.');
                       }

                   }else{
                       userActions.failure('لطفاً شرح خطا را وارد کنید.');
                   }
                }else{
                    userActions.failure('لطفاً دسته بندی خطا را انتخاب کنید.');
                }
          /*  }else{
                userActions.failure('لطفاً علت بروز خطا را انتخاب کنید.');
            }*/
        }else{
            userActions.failure('لطفاً رده شغلی گزارش دهنده را انتخاب کنید.');
        }

    }
    componentDidMount(){
        this.searchFn('','ward');
        this.searchFn('','user');
    }
    render(){
        const {gender,
            shift,
            allCauses,
            report_type,
            reporter_name,
            users,
            wards,
            error_ward,
            patient_name,
            patient_number,
            focused,
            date_event,
            time_event,
            job,
            ward,
            cause,
            category,
            description,
            actions,
            suggestions,
            event_title,
            other_event_title,
            age,
            service_date,
            reporter_name_other,
            error_type_2,
            falls,
            suicides,
            escape,
            error_evaluation,
            etiology,
            error_type,
            allCauses2,
            allJobs,
            allErrorCat,
            allEventTitle,
            otherEventTitle,etiologies,
            conditions
        }=this.state;
        return (
             <>
             <Navbar name="گزارش خطا" url={'/pwa/login'}  />
             <div className="container-fluid">
            <form onSubmit={this.submitError} className="w-100 bg-dr py-5 error_report" style={{minHeight:'100%',marginTop:'10%'}}>
                <img src={gozaresh_khata} alt="گــزارش خطا" className="d-block mx-auto"
                     width={120}/>
                <h2 className="text-center text-primary h5 mt-4"> فــرم گزارش خطای پزشکی
                    {!this.hideAtHospital('11') && ' و موارد 28 گانه '}

                </h2>
                <div className="w-100 mb-5">
                    <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp" alt="سنجاب"
                         width={60}/>
                    <div className="d-flex justify-content-center animated zoomIn">
                        <div className="lines bg-blue col-6 col-sm-10  col-md-8 col-lg-3" style={{top: -19}}/>
                    </div>

                </div>
                {!this.hideAtHospital('11') &&
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-8 col-md-4">
                            <ToggleBotton btns={this.state.report_types} onClickHandel={(data) => {
                                this.setState({report_type: data})
                            }} toggle_state={report_type} className="toggle_btn text-center d-flex align-items-center iran-sans_Bold"
                                          color="secondary"  />
                        </div>
                    </div>
                </div>
                }

                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute " style={{top:-17,right:30}}>اطلاعـات پایــه</h3>
                    <div className="row pt-5 ">
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">نام بیمار</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}
                                   name="patient_name"
                                   value={patient_name}
                                   onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>
                        {!this.hideAtHospital('11','25') &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">جنسیت بیمار</label>
                            <ToggleBotton btns={this.state.toggles} onClickHandel={(data) => {
                                this.setState({gender: data})
                            }} toggle_state={gender} className="toggle_btn text-center d-flex align-items-center"
                                          color="secondary" />

                        </div>
                        }

                        {!this.hideAtHospital('11') &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">سن</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor: '#efefef'}}
                                   name="age"
                                   value={age}
                                   onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>
                        }
                        {!this.hideAtHospital('11','25') &&
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold" htmlFor="service_date">تاریخ مراجعه</label>
                            <DatePicker
                                cancelOnBackgroundClick={true}
                                inputComponent={(props)=><input type="text" className="form-control  bg-white rounded-pill text-center shadow-sm pl-4" style={{borderColor:'#efefef'}} {...props}/>}
                                placeholder=""
                                format="jYYYY/jMM/jDD"
                                onChange={(unix, formatted)=>{this.setState({service_date:formatted})}}
                                id="service_date"
                            />

                            <i className="fal fa-calendar-alt position-absolute text-muted" style={{bottom: '1.8rem',left: '2.6rem',fontSize: '1.7em'}}/>
                        </div>
                        }

                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                {this.hideAtHospital('25')?
                                    ' کد کامپیوتری'
                                    :
                                    ' شماره پرونده بیمار'
                                }

                            </label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}
                                   name="patient_number"
                                   value={patient_number}
                                   onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">نام گـزارش دهنده</label>
                            {!this.hideAtHospital('25')?<Select className="w-100 text-justify custom-select-2"
                                    value={reporter_name}
                                    name="reporter_name"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={users}
                                    getOptionLabel={u => (u.fn+' '+u.ln+(u.post && u.post!=='-' ?' ('+u.post+')':''))}
                                    getOptionValue={u => u.fn+' '+u.ln}
                            />
                                :
                                <input type="text"
                                       className="form-control rounded-pill text-center shadow-sm"
                                       style={{borderColor: '#efefef'}}
                                       name="reporter_name_other"
                                       value={reporter_name_other}
                                       onChange={userActions.handleChangeInput.bind(this)}

                                />
                            }

                        </div>
                        {reporter_name && reporter_name.fn === 'سایر' && reporter_name.ln === 'اعضا' &&
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">سایر اعضا</label>

                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor: '#efefef'}}
                                   name="reporter_name_other"
                                   value={reporter_name_other}
                                   onChange={userActions.handleChangeInput.bind(this)}

                            />

                        </div>
                        }
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                شیفت بروز خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }
                                </label>
                            <ToggleBotton btns={this.state.shifts} onClickHandel={(data)=>{this.setState({shift:data})}} toggle_state={shift} className="toggle_btn text-center d-flex align-items-center"  color="secondary"/>

                        </div>
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold" htmlFor="date_event">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                تاریخ بروز خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <DatePicker
                                cancelOnBackgroundClick={true}
                                inputComponent={(props)=><input type="text" className="form-control bg-white  rounded-pill text-center shadow-sm pl-4" style={{borderColor:'#efefef'}} {...props}/>}
                                placeholder=""
                                format="jYYYY/jMM/jDD"
                                onChange={(unix, formatted)=>{this.setState({date_event:formatted})}}
                                id="date_event"
                            />

                            <i className="fal fa-calendar-alt position-absolute text-muted" style={{bottom: '1.8rem',left: '2.6rem',fontSize: '1.7em'}}/>
                        </div>
                        {!this.hideAtHospital('11') &&
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">ساعت بروز خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <div className="form-control rounded-pill text-center shadow-sm pl-4">
                                <TimePicker
                                    withoutIcon
                                    time={time_event}
                                    theme="material"
                                    timeMode='24'
                                    timezone="Asia/Tehran"
                                    onTimeChange={(time) => {
                                        this.setState({time_event: time.hour + ":" + time.minute})
                                    }}
                                />
                            </div>
                            <i className="fal fa-clock position-absolute text-muted"
                               style={{bottom: '1.8rem', left: '2.6rem', fontSize: '1.7em'}}/>
                        </div>
                        }
                    </div>
                </div>
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm ">
                    <h3 className="rounded-pill h5 iran-sans_Bold  px-5 bg-secondary text-white position-absolute p-2" style={{top:-15,right:30 }}>اطلاعـات تکمیلــی</h3>
                    <div className="row pt-5 ">
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                رده شغلی خطا کننده</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={job}
                                    name="job"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={allJobs}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">بخش گزارش دهنده خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={ward}
                                    name="ward"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={wards}
                                    getOptionLabel={opt => opt.name}
                                    getOptionValue={opt => opt.id}
                            />
                       {/*     <label className="text-right w-100 py-2 iran-sans_Bold">بخش گزارش دهنده خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <input type="text"
                                   name="ward"
                                   value={ward}
                                   onChange={(e)=>this.search(e,'ward')}
                                   onFocus={()=>{this.focused('ward')}}
                                   onBlur={()=>{setTimeout(()=>{this.focused('')},300)}}
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}/>
                            {focused==='ward' && <ul className="animated fadeIn list-unstyled position-absolute w-100 bg-light rounded overflow-auto" style={{bottom:45,right:0,maxHeight:300}}>
                                { wards.map((w,i)=>
                                    <li key={i}>
                                        <button type="button" className="btn w-100 text-center " onClick={()=>{this.setState({ward:w},()=>{this.focused('')})}}>{w}</button>
                                    </li>
                                )
                                }
                            </ul>}*/}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">بخش بروز خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={error_ward}
                                    name="error_ward"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={wards}
                                    getOptionLabel={opt => opt.name}
                                    getOptionValue={opt => opt.id}
                            />
                           {/* <input type="text"
                                   name="error_ward"
                                   value={error_ward}
                                   onFocus={()=>{this.focused('error_ward')}}
                                   onBlur={()=>{setTimeout(()=>{this.focused('')},300)}}
                                   onChange={(e)=>this.search(e,'ward')}
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}/>
                            {focused==='error_ward' && <ul className="animated fadeIn list-unstyled position-absolute w-100 bg-light rounded overflow-auto" style={{bottom:45,right:0,maxHeight:300}}>
                                { wards.map((w,i)=>
                                    <li key={i}>
                                        <button type="button" className="btn w-100 text-center " onClick={()=>{this.setState({error_ward:w},()=>{this.focused('')})}}>{w}</button>
                                    </li>
                                )
                                }
                            </ul>}*/}
                        </div>
                        {!this.hideAtHospital('11') && (this.hideAtHospital('25') && report_type && report_type.value===false) &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                علت بروز
                                {!this.hideAtHospital('25') &&
                                ' خطا '
                                }
                                {!this.hideAtHospital('11','25') &&
                                '/'
                                }
                                {!this.hideAtHospital('11') &&
                                ' واقعه '
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={cause}
                                    name="cause"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={report_type.value ? allCauses : allCauses2}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                دسته بندی خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={category}
                                    name="category"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={allErrorCat}
                            />
                        </div>
                        {!this.hideAtHospital('11') && (this.hideAtHospital('25') && report_type && report_type.value===false) &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                اتیولوژی
                                {!this.hideAtHospital('25') &&
                                ' خطا '
                                }
                                {!this.hideAtHospital('11','25') &&
                                '/'
                                }
                                {!this.hideAtHospital('11') &&
                                ' واقعه '
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={etiology}
                                    name="etiology"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={etiologies}
                                    getOptionLabel={opt => opt.name}
                                    getOptionValue={opt => opt.id}
                            />

                        </div>
                        }
                        {!this.hideAtHospital('11') && (this.hideAtHospital('25') && report_type && report_type.value===false) &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">
                                <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                                نوع
                                {!this.hideAtHospital('25') &&
                                ' خطا '
                                }
                                {!this.hideAtHospital('11','25') &&
                                '/'
                                }
                                {!this.hideAtHospital('11') &&
                                ' واقعه '
                                }</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={error_type}
                                    name="error_type"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={etiology ? etiology.content : []}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        {report_type && report_type.value===false ?

                            <div className="col-12 col-md-6 col-lg-4 p-4">
                                <label className="text-right w-100  iran-sans_Bold">عنوان واقعه</label>
                                <Select className="w-100 text-justify custom-select-2"
                                        value={event_title}
                                        name="event_title"
                                        placeholder=""
                                        onChange={userActions.handleChangeSelect.bind(this)}
                                        options={allEventTitle}
                                        getOptionLabel={opt => opt.title}
                                        getOptionValue={opt => opt.title}
                                />
                            </div>

                        :
                            ''
                        }
                        {event_title && event_title.title==='سایر موارد' &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">سایر عناوین واقعه</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={other_event_title}
                                    name="other_event_title"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={otherEventTitle}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        {event_title && event_title.title.indexOf(
                            'سقوط بيمار'
                        ) >= 0 &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">نوع سقوط</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={error_type_2}
                                    name="error_type_2"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={falls}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        {event_title && event_title.title.indexOf(
                            '12'
                        ) >= 0 &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">نوع خودکشی</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={error_type_2}
                                    name="error_type_2"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={suicides}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        {event_title && event_title.title.indexOf(
                            '11'
                        ) >= 0 &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">نوع فرار</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={error_type_2}
                                    name="error_type_2"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={escape}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        }
                        {
                            /*------------------------------------ فقط   عدد   وارد  شود ------------------------------------*/
                            event_title && event_title.title.indexOf(
                            'سقوط بيمار'
                        )>=0 &&
                        <div className="col-12 col-md-6 col-lg-4 p-4">
                            <label className="text-right w-100  iran-sans_Bold">ارزیابی خطر(عددی بین ۱ تا ۱۰)</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}
                                   name="error_evaluation"
                                   value={error_evaluation}
                                   onChange={(e)=>{userActions.handleChangeInput.call(this,e,'number')}}
                            />
                        </div>
                        }

                    </div>
                </div>
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm">
                    <h3 className="rounded-pill h5 iran-sans_Bold  px-5 bg-secondary text-white position-absolute p-2" style={{top:-15,right:30}}>
                        <span className=" text-danger px-2" style={{fontSize:'1.5em'}}>*</span>
                        شرح خطا
                                {!this.hideAtHospital('11') &&
                                '/واقعه'
                                } و اقدام انجام شده</h3>
                    <div className="row pt-4  ">
                        <div className="col-12  px-3">
                            <textarea
                                name="description"
                                value={description}
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm mb-4"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>
                {!this.hideAtHospital('25') &&
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm ">
                    <h3 className="rounded-pill h5 iran-sans_Bold  px-5 bg-secondary text-white position-absolute p-2" style={{top:-15,right:30}}>عوارض یا مشکلات ایجاد شده</h3>
                    <div className="row pt-4 ">
                        <div className="col-12 py-1 px-3">
                            <textarea className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm mb-4"
                                      name="actions"
                                      value={actions}
                                      onChange={userActions.handleChangeInput.bind(this)}
                                      style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>
                }
                {!this.hideAtHospital('25') &&
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm ">
                    <h3 className="rounded-pill h5 iran-sans_Bold  px-5 bg-secondary text-white position-absolute p-2" style={{top:-15,right:30}}>عوامل و شرایط ایجاد کننده خطا</h3>
                    <div className="row pt-4 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="conditions"
                                value={conditions}
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm mb-4"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>}
                {!this.hideAtHospital('25') &&
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2  infoBaseForm">
                    <h3 className="rounded-pill h5 iran-sans_Bold  px-5 bg-secondary text-white position-absolute p-2"
                        style={{top: -15, right: 30}}>پیشنهادات جهت پیشگیری از موارد مشابه</h3>
                    <div className="row pt-4  ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="suggestions"
                                value={suggestions}
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm mb-4"
                                style={{minHeight: 120, maxHeight: 120}}/>
                        </div>
                    </div>
                </div>
                }
                <div className="d-flex justify-content-center align-items-center mt-5 mb-5 ">
                    <button type="submit" className="col-5 btn btn-secondary py-2 mx-3 rounded-pill iran-sans_Bold" style={{fontSize:"0.8em"}}>ثبت گــزارش</button>
                    <button type="reset" className="col-5 btn btn-outline-secondary py-2 mx-3 rounded-pill iran-sans_Bold" style={{fontSize:"0.8em"}} onClick={this.goBack}>بازگشت</button>
                </div>
            </form>
            </div>
            </>
        )
    }
}
export const ErrorReport = connect(state => ({
    globalStorage: state.globalStorage
  }))(ErrorReport_);
