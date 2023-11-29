import React from 'react';
import ExcelGif from '../assets/images/excel-loading.gif';

function ExcelLoading(props) {
   
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: '0',
                right: '0',
                top: '0',
                bottom: '0',
                zIndex: '1000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor :'white',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}
            className={` mx-auto my-auto animated fadeIn`}>
            <img
                style={{
                    width: '300px',
                    height: '200px',
                    borderRadius: '20px',
                    // border:'2px solid #DEDCDD',
                    boxShadow: ' 3px 3px 10px grey',
                    cursor: 'pointer',
                    boxShadow :'5px 5px 30px gray'
                }}
                onClick={props.stop} src={ExcelGif} alt="لطفا صبر کنید ..." />
            <p
                style={{
                    color: 'black',
                    fontWeight: 'bolder',
                    fontSize: '18px',
                    marginTop: '-50px'
                }}
            >لطفا صبر کنید ...</p>
        </div>
    )
}

export default ExcelLoading
