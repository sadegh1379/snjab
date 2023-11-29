

const search = window.location.search;
const params = new URLSearchParams(search);
const hospital = params.get('hospital');

let hospitalz = hospital;



var hospitals = [
    {
      name: 'فوق تخصصی کیهان',
      id: 10,
      logo: {
        url: '/uploads/hospital/logo/10/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان ساسان',
      id: 11,
      logo: {
        url: '/uploads/hospital/logo/11/logo.png',
      },
    },
    {
      name: 'بیمارستان محب کوثر',
      id: 14,
      logo: {
        url: '/uploads/hospital/logo/14/logo.png',
      },
    },
    {
      name: 'بیمارستان روزبه',
      id: 16,
      logo: {
        url: '/uploads/hospital/logo/16/logo.png',
      },
    },
    {
      name: 'بیمارستان آل جلیل آق قلا',
      id: 21,
      logo: {
        url: '/uploads/hospital/logo/21/logo.png',
      },
    },
    {
      name: 'بیمارستان فوق تخصصی قلب شفا',
      id: 22,
      logo: {
        url: '/uploads/hospital/logo/22/logo.png',
      },
    },
    {
      name: 'بیمارستان دی',
      id: 23,
      logo: {
        url: '/uploads/hospital/logo/23/logo.png',
      },
    },
    {
      name: 'بیمارستان آتیه',
      id: 26,
      logo: {
        url: '/uploads/hospital/logo/26/logo.png',
      },
    },
    {
      name: 'بیمارستان شهدای یافت آباد',
      id: 28,
      logo: {
        url: '/uploads/hospital/logo/28/logo.png',
      },
    },
    {
      name: 'مرکز قلب',
      id: 30,
      logo: {
        url: '/uploads/hospital/logo/30/logo.png',
      },
    },
    {
      name: 'بیمارستان شهداء بندرگز',
      id: 31,
      logo: {
        url: '/uploads/hospital/logo/31/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان 5 آذر گرگان',
      id: 32,
      logo: {
        url: '/uploads/hospital/logo/32/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان حضرت رسول کلاله',
      id: 33,
      logo: {
        url: '/uploads/hospital/logo/33/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان شهید صیاد شیرازی',
      id: 34,
      logo: {
        url: '/uploads/hospital/logo/34/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان امام رضا (ع) خانببین',
      id: 35,
      logo: {
        url: '/uploads/hospital/logo/35/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان مطهری گنبد کاووس',
      id: 36,
      logo: {
        url: '/uploads/hospital/logo/36/logo.jpeg',
      },
    },
    {
      name: 'امام خمینی بندر ترکمن',
      id: 37,
      logo: {
        url: '/uploads/hospital/logo/37/logo.png',
      },
    },
    {
      name: 'فاطمه الزهراء مینودشت',
      id: 38,
      logo: {
        url: '/uploads/hospital/logo/38/logo.png',
      },
    },
    {
      name: 'بیمارستان شهداء گنبد کاووس',
      id: 39,
      logo: {
        url: '/uploads/hospital/logo/39/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان کودکان طالقانی گرگان',
      id: 40,
      logo: {
        url: '/uploads/hospital/logo/40/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان پیامبر اعظم گنبد',
      id: 41,
      logo: {
        url: '/uploads/hospital/logo/41/logo.png',
      },
    },
    {
      name: 'بیمارستان بقیه الله الاعظم علی آباد',
      id: 42,
      logo: {
        url: '/uploads/hospital/logo/42/logo.png',
      },
    },
    {
      name: 'بیمارستان طالقانی گنبد کاووس',
      id: 43,
      logo: {
        url: '/uploads/hospital/logo/43/logo.png',
      },
    },
    {
      name: 'بیمارستان خانواده اصفهان',
      id: 44,
      logo: {
        url: '/uploads/hospital/logo/44/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان امیرالمومنین کردکوی',
      id: 45,
      logo: {
        url: '/uploads/hospital/logo/45/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان حضرت معصومه (س)',
      id: 46,
      logo: {
        url: '/uploads/hospital/logo/46/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان امام رضا (ع) سیرجان',
      id: 47,
      logo: {
        url: '/uploads/hospital/logo/47/logo.png',
      },
    },
    {
      name: 'مجتمع بیمارستانی امیر اعلم',
      id: 48,
      logo: {
        url: '/uploads/hospital/logo/48/logo.jpeg',
      },
    },
    {
      name: 'بیمارستان پوست رازی',
      id: 49,
      logo: {
        url: '/uploads/hospital/logo/49/logo.jpeg',
      },
    },
  ];

  let hospital_logo=null;
  let hospital_name=null;
  hospitals.forEach(element => {
      if(hospitalz == element.id){
        hospital_logo = element.logo.url;
        hospital_name = element.name;
      }
    
  });





export default { hospitalz , hospital_logo , hospital_name };