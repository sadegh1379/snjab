import React, { Component } from 'react';

import HopitalTable from './doc/HopitalTable';
import FormHeader from './doc/FormHeader';

class DocumentsCopm extends Component {
    state = {
        parts: [
            {
                title: 'اطلاعـات اولیه شاخص',
                background: 'bg-navy-blue',
                icon:' <i class="fas fa-home fa-4x"></i>',
                component:'firstInformation'
            },
            {
                title: 'اطلاعات تکمیلی',
                background: 'bg-purple',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'زمان تحویل شاخص',
                background: 'bg-pink',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'سوالات شاخص',
                background: 'bg-dark-orange',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'بخش ها و مسئول پایش',
                background: 'bg-light-green',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
        ],
    }
    render() {
        return (
        <>
            <HopitalTable />
            <FormHeader parts={this.state.parts} />
        </>
        )
    }
}


export default DocumentsCopm;