

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const auto = params.get('auto');
    const idd = params.get('_id');
 
    let hide = 0;
    let id_d = 0;


    if(auto==1){
        hide = 1;
        id_d = idd;

    }


export default { hide, id_d };