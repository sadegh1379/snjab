// JavaScript Document
var app = angular.module('app', ["template", "app_config", 'angularjs-gauge', "angularjs-autogrow", 'naif.base64', 'ngProgress', 'ngImgCrop', 'ncy-angular-breadcrumb', 'angular-carousel-3d', 'color.picker', 'chart.js', 'ngJsonExportExcel', 'ui.bootstrap.progresscircle']);
app.controller('main', function (waiting, $scope, $location, localStorageService, $http, Server_URL, BASE, factory1, $uibModal, $window, $rootScope, $routeParams, $interval, $q, $sce, ngProgressFactory, shared_scopes, ActionCableChannel, ActionCableSocketWrangler, ActionCableConfig, $state, $route, queryHeaders, $route) {
    $scope = shared_scopes.reset($scope);
    var MyToken = localStorageService.get('user_token');
    $scope.queryHeaders = queryHeaders;
    $scope.queryHeaders.Authorization = MyToken;
    $scope.safty_categorys = [];
    $scope.MyToken = localStorageService.get('user_token');
    $scope.wards = [];
    $scope.show = false;

    hospital_id = localStorageService.get('hospital_id');
    $scope.state__title = "";
    $scope.state__icon = "";
    $scope.question_changed = function (msg, header_msg, changes) {
        $scope.changes = changes;
        $scope.q_result = $scope.open_modal('lg', BASE + '/asset/directives/changed_edit.htm', 'question_alert_Ctrl', {
            message: function () {
                return msg;
            }, header: function () {
                return header_msg;
            }
        }, 'blue_modal', null, true);

    };

    $scope.question_sms = function (msg) {

        $scope.q_result = $scope.open_modal('sm', BASE + '/asset/directives/question_sms_alert.htm', 'question_sms_Ctrl', {
            message: function () {
                return msg;
            }
        }, 'blue_modal', $scope, true);

    };


    $scope.closeAlert = function (index) {
        $scope.show = false;
    };


    function setStandardObject(ncyBreadcrumb) {

        if (ncyBreadcrumb.parent === "/") {
            $scope.state__title = ncyBreadcrumb.label;
            $scope.state__icon = ncyBreadcrumb.icon;
        } else {
            setStandardObject($state.get(ncyBreadcrumb.parent).ncyBreadcrumb)
        }
    }

    $rootScope.$on('$stateChangeSuccess', function (n, current) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (current.ncyBreadcrumb && current.ncyBreadcrumb.parent) {
            setStandardObject(current.ncyBreadcrumb);
        }
    });
    /*    $scope.$watch('MyToken',function (oldVal,newVal) {
        if(oldVal!==newVal && $scope.MyToken===null){
            queryHeaders.Authorization="";
            $scope.queryHeaders.Authorization='';
            window.location.href=BASE;
        }
    });*/


    $scope.get_sum = function (arr, obj) {
        var sum = 0;
        if (arr && angular.isArray(arr)) {
            if (obj) {
                arr.map(function (itm) {
                    if (itm[obj]) {
                        var value = 0;
                        if (typeof itm[obj] !== 'number') {
                            value = parseInt(itm[obj]);
                        } else {
                            value = itm[obj];
                        }
                        sum = sum + value;
                    }
                });
            }
        }
        return sum;
    };
    $scope.signature_open = function () {
        $scope.open_modal('lg', BASE + '/asset/directives/signature_modal.html', 'signature_modal_Ctrl', null, 'blue_modal', $scope, true);
    };
    $scope.uncheck = function (chacked, level) {

        return chacked ? null : level;

    };
    $scope.send_to = function (url, users, selected_users, msg, scope, variable, id,filter) {
        if (users) {
            var arr = [];
            arr = angular.copy(users);

            if (selected_users) {
                selected_users = angular.isArray(selected_users) ? selected_users : $scope.to_array([], selected_users, '-').filter(function (itm) {
                    return itm;
                });
                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        selected_users.forEach(function (p) {
                            if (obj.id == p.id || obj.id == p) {
                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
            var selected_users_copy=angular.copy(selected_users);
            var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
                users: function () {
                    return arr;
                }
            }, 'blue_modal');
            result.result.then(function (r) {
                if (r) {

                    selected_users = r;
                    if (selected_users.length) {
                        var send_to=selected_users.map(function (itm) {
                            return itm.id
                        });
                        if(filter){
                            send_to=filter(send_to,selected_users_copy);
                        }
                        var parameter = JSON.stringify({
                            id: id,
                            send_to:send_to,
                            year: $rootScope.year
                        });
                        $http.put(Server_URL + url, parameter, {headers: $scope.queryHeaders})
                            .success(function (data, status, headers) {
                                console.log(data);
                                if (scope) {
                                    scope[variable] = data;
                                }
                                $scope.success_alert(msg, 'اطلاع رسانی');
                            }).error(function (data, status, headers) {
                            console.log(data);
                            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                        });
                    } else {
                        return false;
                    }


                }
            });
        }
    };
    $scope.get_horizontal_bar = function (arr, categorys, key, level, count) {
        var result = new Array(count).fill(0);
        if (arr.length) {
            for (var i = 0; i < count; i++) {
                var arr_counts = [];
                categorys.forEach(function (obj) {
                    var c = 0;
                    arr.forEach(function (itm) {
                        if (itm[key].indexOf(obj) !== -1) {
                            if (i === itm[level]) {
                                c++;
                            }

                        }
                    });
                    arr_counts.push(c);
                });
                result[i] = arr_counts;
            }


        }
        return result;
    };
    $scope.get_frequency = function (arr, categorys, key, level, count) {
        var result = [];
        if (arr.length) {
            categorys.forEach(function (obj) {
                var cat = [];
                arr.forEach(function (itm) {
                    if (itm[key].indexOf(obj) !== -1) {
                        cat.push(itm);
                    }
                });
                result.push(cat);
            });


        }
        return result;
    };

    var callback = function (message) {
        var notify = angular.isString(message.notification) ? JSON.parse(message.notification) : message.notification;
        console.log(message, notify);
        if ($scope.desktopNotification.currentPermission() != 'granted') {
            $scope.desktopNotification.requestPermission().then(function (permission) {
                // User allowed the notification
                /*   $scope.desktopNotification.show('Hello', {
				 body: 'I am an HTML5 notification',
				 onClick: function () {
				 // Handle click event
				 }
				 });*/
            }, function (permission) {
                // User denied the notification
            });
        }
        if (notify.record_type != 'chat_users') {


            $scope.realtime.push(notify);

        } else {
            $scope.online_users = notify.object.online;
            $scope.offline_users = notify.object.offline;
            $scope.busy_users = notify.object.busy;

        }

    };
    $scope.run_realtime_channel = function (status) {
        if (status && status.connected) {
            if ($scope.f_connected) {

                $scope.f_connected = false;
                // connect to ActionCable
                var consumer = new ActionCableChannel("EopChannel", {id: $scope.me.id});

                /*consumer.subscribe(function (message) {
				 console.log(message);
				 });*/
                consumer.subscribe(callback).then(function () {

                    $scope.$on("$destroy", function () {
                        consumer.unsubscribe().then(function () {

                            console.log('$destroy');
                        });

                    });
                    /*  console.log(callback);*/
                });
                consumer.onConfirmSubscription(function () {
                    console.log('subscribed');
                    consumer.send({month: $scope.get_month(), year: moment().jYear()}, 'i_am_online');
                });

            }

        }


    };
    if ($scope.MyToken) {
        $scope.access = localStorageService.get('access');
        $scope.me = localStorageService.get('me');
    } else {
        $rootScope.$broadcast("unauthorized");
    }
    factory1.get_ward_list().then(function (data) {
        $scope.wards = data;

    });
    $scope.back_to_parent = function (_this) {
        if (_this.hasOwnProperty('is_parent')) {
            _this.template.url = '';
            _this.is_parent = true;
        } else {
            _this.$parent.$parent.template.url = '';
            _this.$parent.$parent.is_parent = true;
        }
        if (angular.isFunction(_this.backBtn)) {
            _this.backBtn();
        }

    };
    $rootScope.$watch('year', function (newVal, oldVal) {
        if (newVal !== oldVal && oldVal != undefined) {

            $state.reload();
        }

    });
    $rootScope.$watch('Menus', function (newVal, oldVal) {

        $rootScope.CurrentMenu = $rootScope.Menus.filter(function (menu) {

            return menu.name === 'مدیریت و رهبری';
        })[0];

    });
    $scope.$watch('users', function (oldVal, newVal) {
        if (oldVal !== newVal && $scope.users && $scope.users.length) {
            var users = [];
            $scope.AllUsers = [];
            $scope.AllUsers = $scope.users.map(function (itm) {
                itm.users = itm.users.filter(function (usr) {
                    if (users.indexOf(usr.id) === -1) {
                        users.push(usr.id);
                        return true;
                    }
                    return false;
                });
                return itm;
            });
        }
    });
    factory1.get_users().then(function (data) {
        data.map(function (itm) {
            itm.committee_name = itm.committee_name === 'ندارد' ? 'سایر اعضا' : itm.committee_name;
        });
        $scope.all_users = data;
        $rootScope.all_users = data;
        $scope.users = data;
    }, function (data) {
        console.log(data);
        return false;
    });
    $scope.pdfOption = {
        pdf: true
    };
    $scope.$watch('realtime', function (newVal, oldVal) {
        if (newVal !== oldVal && $rootScope.onprinting) {
            console.log(newVal)
            var i = newVal.findIndex(function (itm) {
                return itm.record_type === 'psuc_excel' || itm.record_type === 'psuc_compact_excel'
            });
            if (i >= 0) {
                $scope.download_file($scope.Server_URL + newVal[i].url);
                $rootScope.onprinting = false;
                newVal.splice(i, 1);
            }
        }
    }, true)
});

app.controller('evaluation_of_the_risk_Ctrl', function ($scope, factory1, localStorageService, $rootScope) {

    $scope.get_safty = function () {
        factory1.getUserApi('/v1/user/hospital/safty/categories')
            .then(function (data) {
                $scope.safty_categorys = data;
            });
    };
    $scope.get_safty();
});

app.controller('general_information_hospital_Ctrl', function ($scope, factory1, localStorageService, $http, Server_URL, BASE, $q) {


    $scope.active_view = -1;
    $scope.buildings = [];
    $scope.emergency_departments = [];
    $scope.operating_rooms = [];
    $scope.intensive_care_departments = [];
    $scope.surgery_departments = [];
    $scope.medical_departments = [];
    $scope.non_clinical_services = [];
    $scope.crisis_and_disaster_operations = [];
    $scope.expandible_areas = [];
    $scope.hospital_info = [];
    $scope.editable_info = false;
    $scope.current_hospital_info = null;
    $scope.current_building = null;
    $scope.current_building_index = null;
    $scope.current_ward = null;
    $scope.current_ward_index = null;
    $scope.current_expandible_area = null;
    $scope.current_expandible_area_index = null;
    $scope.options_print = {
        breaker: 'breaker',
        reject: ['.btn_wrapper', '.btn .btn-blue .center-block']
    }
    /*------------------------hospital_info------------------------*/
    $scope.edit_hospital_info = function () {
        $scope.current_hospital_info = angular.copy($scope.hospital_info);
        $scope.editable_info = true;
    };
    $scope.update_hospital_info = function () {
        var index = 0;
        var successes = [];
        var errors = [];
        var sends = [];
        // list of all promises
        var promises = [];

        $scope.hospital_info.forEach(function (itm) {
            if (itm.value !== $scope.current_hospital_info[index].value) {
                var deferred = $q.defer();
                var parameter = JSON.stringify({
                    id: itm.id,
                    value: itm.value
                });

                sends.push(itm);

                factory1.putUserApi('/v1/user/hospital/profile/propertise', parameter).then(function (data) {
                    successes.push(itm);
                    deferred.resolve(data);

                }, function (data) {
                    errors.push(itm);
                    deferred.reject(data);
                });
                // add to the list of promises
                promises.push(deferred.promise);
            }
            index++;
        });
        $q.all(promises).then(
            // success
            // results: an array of data objects from each deferred.resolve(data) call
            function (results) {
                if (sends.length === successes.length) {
                    $scope.success_alert('اطلاعات بیمارستان با موفقیت به روزرسانی شد.', 'به روزرسانی اطلاعات بیمارستان');
                    $scope.current_hospital_info = null;
                    $scope.editable_info = false;
                }
            },
            // error
            function (response) {
                if (sends.length === errors.length) {
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                } else {
                    $scope.warning('ثبت برخی از اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                }
            }
        );


    };
    $scope.cancel_edit_hospital_info = function () {
        $scope.question('آیا مایل به انصراف از تغییرات هستید؟', 'انصراف از تغییرات');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.hospital_info = angular.copy($scope.current_hospital_info);
                $scope.current_hospital_info = null;
                $scope.editable_info = false;
            }
        });

    };
    factory1.getUserApi('/v1/user/hospital/profile/propertises').then(function (data) {
        $scope.hospital_info = data;
    });
    /*------------------------hospital_info------------------------*/
    /*------------------------building------------------------*/
    $scope.edit_building = function (row) {
        $scope.current_building = angular.copy(row);

        $scope.current_ward_index = $scope.buildings.indexOf(row);
        row.editable = true;
        $scope.buildings[$scope.current_ward_index] = row;

    };
    $scope.update_building = function (row) {
        var parameter = JSON.stringify({
            id: row.id,
            name: row.name,
            floor_count: row.floor_count,
            underground: row.underground,
            area: row.area,
            ageing: row.ageing,
            building_type: row.building_type
        });

        $http.put(Server_URL + '/v1/user/hospital/building', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = $scope.buildings.indexOf(row);
                row.editable = false;
                $scope.buildings[index] = row;
                console.log(data);
                $scope.current_building = null;
                $scope.success_alert('اطلاعات ساختمان بیمارستان با موفقیت به روزرسانی شد.', 'به روزرسانی اطلاعات ساختمان بیمارستان');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.cancel_edit_building = function (row) {
        if ($scope.current_building === 'new') {
            var index0 = $scope.buildings.indexOf(row);

            $scope.buildings.splice(index0, 1);
        } else {
            console.log($scope.current_building);

            $scope.buildings[$scope.current_ward_index] = angular.copy($scope.current_building);
        }

        $scope.current_building = null;
    };
    $scope.create_building = function (row) {
        var parameter = JSON.stringify({
            name: row.name,
            floor_count: row.floor_count,
            underground: row.underground,
            area: row.area,
            ageing: row.ageing,
            building_type: row.building_type
        });

        $http.post(Server_URL + '/v1/user/hospital/building', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = $scope.buildings.indexOf(row);
                row.editable = false;
                $scope.buildings[index] = data;
                $scope.current_building = null;
                console.log(data);
                $scope.success_alert('اطلاعات ساختمان بیمارستان با موفقیت افزوده شد.', 'افزودن ساختمان بیمارستان');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.delete_building = function (row) {
        $scope.question('آیا از حذف ساختمان مورد نظر مطمئن هستید؟', 'حذف ساختمان ');
        $scope.q_result.result.then(function (r) {

            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/building/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        var index = $scope.buildings.indexOf(row);

                        $scope.buildings.splice(index, 1);
                        $scope.current_building = null;
                        console.log(data);
                        $scope.success_alert('ساختمان مورد نظر با موفقیت حذف شد.', 'حذف ساختمان بیمارستان');

                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.add_building = function () {
        $scope.buildings.push({editable: true});
        $scope.current_building = 'new';
    };
    factory1.getUserApi('/v1/user/hospital/buildings').then(function (data) {
        $scope.buildings = data;
        console.log(data);

    });
    /*------------------------building------------------------*/
    /*------------------------wards------------------------*/
    $scope.edit_ward = function (row, arr) {
        $scope.current_ward = angular.copy(row);
        $scope.current_ward_index = arr.indexOf(row);
        row.editable = true;
        arr[$scope.current_ward_index] = row;

    };
    $scope.update_ward = function (row, arr) {
        var parameter = JSON.stringify({
            id: row.id,
            name: row.name,
            anticipated_staff: row.anticipated_staff,
            available_staff: row.available_staff,
            ward_type: row.ward_type,
            description: row.description,
            approved_beds: row.approved_beds,
            expandible_beds: row.expandible_beds,
            isolated_beds: row.isolated_beds,
            type_of_surgery: row.type_of_surgery,
            surgery_beds: row.surgery_beds
        });
        $http.put(Server_URL + '/v1/user/hospital/ward', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = arr.indexOf(row);
                row.editable = false;
                arr[index] = row;
                console.log(data);
                $scope.current_ward = null;
                $scope.success_alert('اطلاعات بخش موردنظر با موفقیت به روزرسانی شد.', 'به روزرسانی بخش بیمارستان');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.cancel_edit_ward = function (row, arr) {
        if ($scope.current_ward === 'new') {
            var index0 = arr.indexOf(row);

            arr.splice(index0, 1);
        } else {
            $scope.current_ward.editable = false;
            arr[$scope.current_ward_index] = angular.copy($scope.current_ward);
        }

        $scope.current_ward = null;
    };
    $scope.create_ward = function (row, arr) {
        var parameter = JSON.stringify({
            name: row.name ? row.name : '',
            anticipated_staff: row.anticipated_staff,
            available_staff: row.available_staff,
            ward_type: row.ward_type,
            description: row.description,
            approved_beds: row.approved_beds,
            expandible_beds: row.expandible_beds,
            isolated_beds: row.isolated_beds,
            type_of_surgery: row.type_of_surgery,
            surgery_beds: row.surgery_beds
        });
        $http.post(Server_URL + '/v1/user/hospital/ward', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = arr.indexOf(row);
                row.editable = false;
                arr[index] = data;
                $scope.current_ward = null;
                console.log(data);
                $scope.success_alert('اطلاعات بخش بیمارستان با موفقیت افزوده شد.', 'افزودن بخش بیمارستان');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.delete_ward = function (row, arr) {
        $scope.question('آیا از حذف بخش مورد نظر مطمئن هستید؟', 'حذف بخش ');
        $scope.q_result.result.then(function (r) {

            if (r) {

                $http.delete(Server_URL + '/v1/user/hospital/ward/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        var index = arr.indexOf(row);

                        arr.splice(index, 1);
                        $scope.current_ward = null;
                        console.log(data);
                        $scope.success_alert('بخش مورد نظر با موفقیت حذف شد.', 'حذف بخش بیمارستان');

                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.add_ward = function (arr, ward_type) {
        arr.push({editable: true, ward_type: ward_type});
        $scope.current_ward = 'new';
    };
    $scope.no_ward = function (arr, ward_type) {
        console.log(arr, $scope.current_ward);
        if (arr.length) {
            if ($scope.current_ward === 'new' && arr.length == 1) {
                $scope.current_ward = null;
                return [];
            } else {
                $scope.warning('شما نمی توانید بیمارستان را فاقد این بخش بدانید چون بخش یا سرویسی در این قسمت تعریف شده است.');
            }


            return arr;
        } else {
            arr.push({editable: true, ward_type: ward_type});
            $scope.current_ward = 'new';
            return arr;
        }
    };
    factory1.getUserApi('/v1/user/hospital/wards').then(function (data) {
        console.log(data);
        data.forEach(function (itm) {
            if (itm.ward_type === 'بخش‌های اورژانسی') {
                $scope.emergency_departments.push(itm);
            } else if (itm.ward_type === 'اتاق‌های عمل جراحی') {
                $scope.operating_rooms.push(itm);
            } else if (itm.ward_type === 'بخش‌های طبی') {
                $scope.medical_departments.push(itm);
            } else if (itm.ward_type === 'بخش مراقبت‌های ویژه') {
                $scope.intensive_care_departments.push(itm);
            } else if (itm.ward_type === 'بخش‌های جراحی') {
                $scope.surgery_departments.push(itm);
            } else if (itm.ward_type === 'سرویس های بالینی و غیر بالینی') {
                $scope.non_clinical_services.push(itm);
            } else if (itm.ward_type === 'عملیات بحران و بلایا') {
                $scope.crisis_and_disaster_operations.push(itm);
            }
        })

    });
    /*------------------------wards------------------------*/
    /*------------------------expandible_areas------------------------*/
    $scope.edit_expandible_areas = function (row) {
        $scope.current_expandible_area = angular.copy(row);
        $scope.current_expandible_area_index = $scope.expandible_areas.indexOf(row);
        row.editable = true;
        $scope.expandible_areas[$scope.current_expandible_area_index] = row;

    };
    $scope.update_expandible_areas = function (row) {
        var parameter = JSON.stringify({
            id: row.id,
            name: row.name,
            description: row.description,
            building_type: row.building_type,
            compatibility: row.compatibility,
            area: row.area,
            tell: row.tell,
            water: row.water,
            electricity: row.electricity,
            heat: row.heat,
            cold: row.cold
        });
        $http.put(Server_URL + '/v1/user/hospital/expandible_area', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = $scope.expandible_areas.indexOf(row);
                row.editable = false;
                $scope.expandible_areas[index] = row;
                console.log(data);
                $scope.current_expandible_area = null;
                $scope.success_alert('اطلاعات  مکان مورد نظر با موفقیت به روزرسانی شد.', 'به روزرسانی مکان محتمل بر افزایش');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.cancel_edit_expandible_areas = function (row) {
        if ($scope.current_expandible_area === 'new') {
            var index0 = $scope.expandible_areas.indexOf(row);

            $scope.expandible_areas.splice(index0, 1);
        } else {
            $scope.current_expandible_area.editable = false;
            $scope.expandible_areas[$scope.current_expandible_area_index] = angular.copy($scope.current_expandible_area);
        }

        $scope.current_expandible_area = null;
    };
    $scope.create_expandible_areas = function (row) {
        var parameter = JSON.stringify({
            name: row.name ? row.name : '',
            description: row.description,
            building_type: row.building_type,
            compatibility: row.compatibility,
            area: row.area,
            tell: row.tell,
            water: row.water,
            electricity: row.electricity,
            heat: row.heat,
            cold: row.cold
        });
        $http.post(Server_URL + '/v1/user/hospital/expandible_area', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var index = $scope.expandible_areas.indexOf(row);
                row.editable = false;
                $scope.expandible_areas[index] = data;
                $scope.current_expandible_area = null;
                console.log(data);
                $scope.success_alert('اطلاعات مکان محتمل بر افزایش بیمارستان با موفقیت افزوده شد.', 'افزودن مکان محتمل بر افزایش بیمارستان');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.delete_expandible_areasd = function (row) {
        $scope.question('آیا از حذف مکان مورد نظر مطمئن هستید؟', 'حذف مکان ');
        $scope.q_result.result.then(function (r) {

            if (r) {

                $http.delete(Server_URL + '/v1/user/hospital/expandible_area/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        var index = $scope.expandible_areas.indexOf(row);
                        $scope.expandible_areas.splice(index, 1);
                        $scope.current_expandible_area = null;
                        console.log(data);
                        $scope.success_alert('مکان مورد نظر با موفقیت حذف شد.', 'حذف مکان بیمارستان');

                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.add_expandible_areas = function () {
        $scope.expandible_areas.push({
            editable: true,
            heat: true,
            cold: true,
            tell: true,
            water: true,
            electricity: true
        });
        $scope.current_expandible_area = 'new';
    };
    factory1.getUserApi('/v1/user/hospital/expandible_areas').then(function (data) {
        $scope.expandible_areas = data;
        console.log(data);

    });
    /*------------------------expandible_areas------------------------*/
    $scope.print_this_view = function () {
        return $scope.active_view === 0 ? '#hospital_info' : ($scope.active_view === 1 ? '#buildings' : ($scope.active_view === 2 ? '#hospital_capacity' : '#expandible_areas'));
    };


});

app.controller('access_manager_Ctrl', function ($scope, localStorageService, $http, Server_URL, BASE, factory1, $uibModalInstance, queryHeaders) {

    $scope.accesses = [
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا', code: '21'},
        {title: 'ارزیابی و اولویت‌بندی خطر حوادث و بلایا > اطلاعات کلی بیمارستان', code: '221'},
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا > شناخت مخاطرات', code: '222'},
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا > ارزیابی ایمنی عملکردی', code: '223'},
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا > ارزیابی ایمنی غیرسازه‌ای', code: '224'},
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا > ارزیابی ایمنی سازه‌ای', code: '225'},
        {title: 'تشکیل کمیته مدیریت خطر حوادث و بلایا > تمرین‌های شبیه‌سازی شده', code: '226'},
        {title: 'اقدامات پیشگیری و کنترل آتش سوزی > روش اجرایی “ایمنی در مقابل آتش سوزی”', code: '231'},
        {title: 'اقدامات پیشگیری و کنترل آتش سوزی > شناسایی مکان‌های خطر آفرین', code: '232'},
        {title: 'اقدامات پیشگیری و کنترل آتش سوزی > ایمنی موتورخانه ', code: '233'},
        {title: 'اقدامات پیشگیری و کنترل آتش سوزی > تیم رابط آتش نشانی', code: '234'}
    ];
    $scope.code = {
        n1: '',
        n2: '',
        n3: '',
        n4: '',
        n5: '',
        n6: ''
    };
    $scope.person = {post: ''};
    $scope.access_all = function () {
        var checked = [];
        $scope.accesses.forEach(function (itm) {
            if (itm.checked) {
                checked.push(itm);
            }
        });

        $scope.accesses.map(function (itm) {
            itm.checked = checked.length !== $scope.accesses.length;
        });
    };
    $scope.generate_code = function () {

        var codes = [];
        $scope.accesses.map(function (itm) {
            if (itm.checked) {
                codes.push(itm.code);
            }
        });
        /*if(codes.length){*/
        var parameter = JSON.stringify({
            post: $scope.person.post
        });
        var MyToken = localStorageService.get('user_token');
        $scope.queryHeaders = queryHeaders;
        $scope.queryHeaders.Authorization = MyToken;
        $http.post(Server_URL + '/v1/generate_access', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.success_alert('کد را به شخص مورد نظر بدهید و از او بخواهید آن را در پنل کاربری خودش وارد کند. ', 'کد دسترسی');
                $scope.code.n1 = data.code[0];
                $scope.code.n2 = data.code[1];
                $scope.code.n3 = data.code[2];
                $scope.code.n4 = data.code[3];
                $scope.code.n5 = data.code[4];
                $scope.code.n6 = data.code[5];
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
        /*}else{
            $scope.warning('حداقل یکی از دسترسی ها را می بایست انتخاب کنید.');
        }*/

    };
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('last_sessions_Crl', function ($scope, $uibModalInstance, localStorageService, $http, Server_URL, BASE, factory1, detail) {

    $scope.detail = detail;
    $scope.nodes = [];
    if (!detail.explain)
        factory1.get_event_explain($scope.detail.id).then(function (data) {

            $scope.nodes = data;
        });
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.show_this_actions = function (row) {
        console.log(row);
        if (row.actions && row.actions.length) {
            var msg = '';
            row.actions.forEach(function (itm) {
                if (itm.action_description.length) {
                    msg = msg + '-' + itm.action_description + ' (' + $scope.get_date(itm.updated_at, 'full_date') + ') ' + '<br>';
                }
            });
            $scope.success_alert(msg, 'اقدامات انجام شده');
        } else {
            $scope.warning('برای این برنامه اقداماتی ثبت نشده است.');
        }

    };
});

app.controller('instructon_Ctrl', function ($scope, factory1, localStorageService, $rootScope, $http, Server_URL, BASE, $state) {
    $scope.sa = {
        type: $scope.instruction_type && ($scope.instruction_type == 0 || $scope.instruction_type == 2) ? 'روش اجرایی' : 'دستورالعمل',
        goal: '',
        domain: '',
        requirement_law: '',
        defination: '',
        resource: '',
        personnel: '',
        approach: '',
        related_documents: '',
        doc_code: '',
        title: '',
        create_doc_at: '',
        revise_at: '',
        refer_at: '',
        file: '',
        file_b64: '',
        Notification_notic: '',
        Notification_notice_b64: '',
        id: null,
        file_url: '',
        responsible: '',
        how_to_monitor: '',
    };

    $scope.members = [];
    $scope.guidances = [];
    $scope.selected_users = [];
    $scope.files = [];
    $scope.get_user = function (id) {
        var usrer = {};

        if (id) {

            $scope.users.forEach(function (itm) {
                itm.users.forEach(function (usr) {
                    if (usr.id == id) {
                        usrer = usr;
                    }
                });
            });
        }
        return usrer;
    };
    $scope.get_instruction = function () {
        if ($rootScope.year && $scope.instruction_title) {
            $scope.sa = {
                type: $scope.instruction_type && ($scope.instruction_type == 0 || $scope.instruction_type == 2) ? 'روش اجرایی' : 'دستورالعمل',
                goal: '',
                domain: '',
                requirement_law: '',
                defination: '',
                resource: '',
                personnel: '',
                approach: '',
                related_documents: '',
                doc_code: '',
                title: '',
                create_doc_at: '',
                revise_at: '',
                refer_at: '',
                file: '',
                file_b64: '',
                Notification_notic: '',
                Notification_notice_b64: '',
                id: null,
                file_url: '',
                responsible: '',
                how_to_monitor: ''
            };

            $scope.members = [];
            $scope.guidances = [];
            $scope.selected_users = [];
            factory1.getUserApi('/v1/user/hospital/instruction', '&title=' + $scope.instruction_title).then(function (data) {
                if (data) {
                    if (data.files) {
                        $scope.files = data.files;
                    }
                    $scope.sa.id = data.id;
                    if (data.file && data.file.file.url) {
                        $scope.sa.file_url = data.file.file.url;
                    }
                    if (data.documention) {
                        $scope.sa.goal = data.documention.goal || '';
                        $scope.sa.domain = data.documention.domain || '';
                        $scope.sa.requirement_law = data.documention.requirement_law || '';
                        $scope.sa.defination = data.documention.defination || '';
                        $scope.sa.resource = data.documention.resource || '';
                        $scope.sa.personnel = data.documention.personnel || '';
                        $scope.sa.approach = data.documention.approach || '';
                        $scope.sa.related_documents = data.documention.related_documents || '';
                        $scope.sa.responsible = data.documention.responsible || '';
                        $scope.sa.how_to_monitor = data.documention.how_to_monitor || '';
                    }

                    $scope.sa.Notification_notic = data.notification_notic || '';
                    $scope.sa.doc_code = data.doc_code || '';
                    $scope.sa.create_doc_at = $scope.get_date(data.create_doc_at) || '';
                    $scope.sa.revise_at = $scope.get_date(data.revise_at) || '';
                    $scope.sa.refer_at = $scope.get_date(data.refer_at) || '';
                    if (data.users)
                        data.users.forEach(function (itm) {
                            if (itm.guider) {
                                $scope.guidances.push({first_name: itm.firstname});
                            } else {

                                $scope.members.push({
                                    first_name: itm.firstname,
                                    producers: itm.director,
                                    verifiers: itm.verifier,
                                    communicator: itm.commenicator,
                                    u_selected: itm.user_id,
                                    user_selected: itm.user.firstname + ' ' + itm.user.lastname,
                                    user: itm.user
                                });
                                console.log($scope.members);
                            }
                        });


                }
            });
        }

    };
    $scope.$watch('instruction_title', function (newVal, oldVal) {

        $scope.get_instruction();

    });
    $scope.$watch('instruction_type', function (newVal, oldVal) {
        $scope.sa.type = $scope.instruction_type && ($scope.instruction_type == 0 || $scope.instruction_type == 2) ? 'روش اجرایی' : 'دستورالعمل'

    });
    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.is_parent = $state.$current.self.name === "functional_safety_assessment";
    });
    $scope.is_parent = $state.$current.self.name !== "instruction_history";
    $scope.showFiles = function () {
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);

    };
    $scope.file_uploaded = function (file) {
        if ($scope.sa.id) {
            factory1.upload_file($scope, file, 20000000,
                ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
                false, '/v1/user/hospital/instruction/' + $scope.sa.id + '/file?file_name=' + file.filename, 'rectangle').then(function (data) {
                /* row.b64_file = data;
                 row.file_name = file.filename;*/
                $scope.files.push(data);
            });
        } else {
            $scope.warning('لطفاً ابتدا '
                + $scope.sa.type +
                ' را ثبت نمایید. سپس مستندات را بارگذاری کنید.'
            )
        }

    };
    $scope.send_to = function () {
        if ($scope.sa.id) {
            var arr = [];
            arr = angular.copy($scope.users);
            if ($scope.selected_users) {

                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        $scope.selected_users.forEach(function (p) {
                            if (obj.id === p.id) {

                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
            var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
                users: function () {
                    return arr;
                }
            }, 'blue_modal');
            result.result.then(function (r) {
                if (r) {

                    $scope.selected_users = r;

                    var parameter = JSON.stringify({
                        send_to: $scope.selected_users ? $scope.selected_users.map(function (itm) {
                            return itm.id
                        }) : null,
                        id: $scope.sa.id,
                        year: $rootScope.year
                    });
                    $http.put(Server_URL + '/v1/user/hospital/instruction/send_to', parameter, {headers: $scope.queryHeaders})
                        .success(function (data, status, headers) {
                            console.log(data);
                            $scope.success_alert(
                                $scope.sa.type + '\“' + $scope.instruction_title + '\”' +
                                ' با موفقیت به اشخاص مورد نظر ارسال شد.', 'ثبت اطلاعات');
                        }).error(function (data, status, headers) {
                        console.log(data);
                        $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                    });


                }
            });
        } else {
            $scope.warning('لطفاً اطلاعات را ثبت و سپس اقدام به ارسال آنها نمایید.');
        }
    };
    $scope.user_change = function (usr, row) {
        row.user_id = usr.id;
        row.user = angular.isString(usr) ? JSON.parse(usr) : usr;
    };
    $scope.get_instruction_users = function () {
        var arr = [];
        if ($scope.members.length) {
            $scope.members.forEach(function (itm) {
                console.log(itm);
                if (itm.user)
                    arr.push({
                        user_id: itm.user.id,
                        director: itm.producers,
                        guider: false,
                        commenicator: itm.communicator,
                        verifier: itm.verifiers
                    });
            });
        }
        if ($scope.guidances.length) {
            $scope.guidances.forEach(function (itm) {
                console.log(itm);
                if (itm.first_name.length > 2) {
                    arr.push({
                        user_id: null,
                        director: false,
                        guider: true,
                        commenicator: false,
                        verifier: false,
                        firstname: itm.first_name
                    });
                }
            });
        }

        return arr;

    };
    $scope.save = function () {
        console.log($scope.sa.id);
        var parameter = JSON.stringify({
            committee_name: $scope.state__title, committee_icon: $scope.state__icon,
            hasfile: $scope.sa.file_b64.length > 0,
            file: $scope.sa.file_b64.length > 0 ? $scope.sa.file_b64 : null,
            instruction: $scope.sa.type === 'دستورالعمل',
            title: $scope.instruction_title,
            doc_code: $scope.sa.doc_code,
            create_doc_at: $scope.sa.create_doc_at ? $scope.get_miladi_date($scope.sa.create_doc_at) : '',
            revise_at: $scope.sa.revise_at ? $scope.get_miladi_date($scope.sa.revise_at) : '',
            refer_at: $scope.sa.refer_at ? $scope.get_miladi_date($scope.sa.refer_at) : '',
            instruction_users: $scope.get_instruction_users(),
            goal: $scope.sa.goal,
            domain: $scope.sa.domain,
            requirement_law: $scope.sa.requirement_law,
            defination: $scope.sa.defination,
            resource: $scope.sa.resource,
            personnel: $scope.sa.personnel,
            approach: $scope.sa.approach,
            related_documents: $scope.sa.related_documents,
            Notification_notic: $scope.sa.Notification_notic,
            how_to_monitor: $scope.sa.how_to_monitor,
            responsible: $scope.sa.responsible,
            id: $scope.sa.id,
            year: $rootScope.year

        });
        $http.post(Server_URL + '/v1/user/hospital/instruction/create', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.sa.file_url = data.file.file.url;
                $scope.sa.id = data.id;
                $scope.success_alert(
                    $scope.sa.type + '\“' + $scope.instruction_title + '\”' +
                    ' با موفقیت ثبت شد. چنانچه قصد ارسال آن را دارید، برروی دکمه ارسال به کلیک کنید. ', 'ثبت اطلاعات');
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    /*   $scope.Notification_notice_upload=function () {
     factory1.upload_file($scope,$scope.sa.Notification_notice,20000000,['image/jpeg','image/jpg','image/png','application/pdf','application/msword','application/docx'],false,false).then(function (data) {

     $scope.sa.Notification_notice_b64= data;
     });
     scope.instruction_type=attrs['instructionType'];
     scope.instruction_title=attrs['instruction'];
     };*/
    $scope.deleteFile = function (row) {
        $scope.question('آیا از حذف فایل مطمئن هستید؟').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/instruction/files/' + row.id).then(function () {
                    $scope.success_alert('فایل مورد نظر با موفقیت حذف شد.');
                    $scope.files.splice($scope.files.indexOf(row), 1);
                })
            }
        });
    }
    $scope.add_member = function () {
        if ($scope.members.length) {
            if (!$scope.members[$scope.members.length - 1].user_selected || (!$scope.members[$scope.members.length - 1].producers && !$scope.members[$scope.members.length - 1].verifiers && !$scope.members[$scope.members.length - 1].communicator)) {
                $scope.warning('لطفاً مشخصات افراد مسئول در تدوین روش اجرایی را به درستی وارد کنید.');
                return false;
            }
        }
        $scope.members.push({producers: false, verifiers: false, communicator: false});
    };
    $scope.instruction_file_upload = function () {
        factory1.upload_file($scope, $scope.sa.file, 20000000,
            ['application/x-7z-compressed', 'application/zip', 'application/x-rar-compressed', 'audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            false, false).then(function (data) {

            $scope.sa.file_b64 = data;
            /* var parameter = JSON.stringify({
                 hasfile: $scope.sa.file_b64.length > 0,
                 file: $scope.sa.file_b64.length > 0 ? $scope.sa.file_b64 : null,
                 instruction: $scope.sa.type === 'دستورالعمل',
                 title: $scope.instruction_title,
                 id: $scope.sa.id,
                 year: $rootScope.year

             });
             $http.post(Server_URL + '/v1/user/hospital/instruction/create', parameter, {headers: $scope.queryHeaders})
                 .success(function (data, status, headers) {
                     console.log(data);
                     $scope.sa.id = data.id;
                     $scope.sa.file_url = data.file.file.url;
                   //  $scope.send_to();
                 }).error(function (data, status, headers) {
                 console.log(data);
                 $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
             });*/

        });
    };
    $scope.history = function () {
        $state.go('instruction_history', {
            instruction_type: $scope.instruction_type,
            instruction_title: $scope.instruction_title,
            parent: $state.current.name
        });
    };
    $scope.deleteMember=function (row){
        $scope.members.splice($scope.members.indexOf(row),1)
    }
    $scope.get_instruction();
});

app.controller('instruction_history_Ctrl', function ($scope, factory1, localStorageService, $rootScope, $http, Server_URL, BASE, $state, $stateParams) {
    $state.current.ncyBreadcrumb.parent = $stateParams.parent;
    $scope.ihistory = [];

    $scope.sa = {};
    $scope.members = [];
    $scope.guidances = [];
    $scope.selected_users = [];
    $scope.edits_chart = {
        labels_chart: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        data_set: {
            pointBackgroundColor: ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC'],
            borderColor: '#1c94e0'
        },
        options: {
            tooltips: {
                titleFontSize: 10,
                bodyFontSize: 10
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'زمـــــان',
                        fontSize: 11
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        min: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'تعــــداد دفعات مراجعات',
                        fontSize: 11
                    }
                }]

            }
        }
    };
    $scope.template = {url: ''};
    $scope.is_parent = true;
    $scope.object_type = $stateParams.instruction_type == '1' ? 'دستورالعمل' : 'روش اجرایی';
    $scope.instruction_type = $stateParams.instruction_type;
    $scope.instruction_title = $stateParams.instruction_title;
    factory1.getUserApi('/v1/user/hospital/history', '&title=' + $stateParams.instruction_title + '&object_type=' + 'instruction').then(function (data) {
        $scope.ihistory = data;

        data.forEach(function (itm) {
            var month = moment(itm.created_at).jMonth();
            $scope.edits_chart.data_chart[month]++;
        });

    });

    $scope.get_edited_records = function (row) {
        if (!row.old_object) {
            return row.new_object.sent_to_at ? 'اطلاع رسانی ' + $scope.object_type + ' ' + $stateParams.instruction_title : 'ثبت ' + $scope.object_type + ' ' + $stateParams.instruction_title;
        } else {

            return row.new_object.files ? 'بارگذاری ' + $scope.object_type + ' ' + $stateParams.instruction_title : 'ویرایش ' + $scope.object_type + ' ' + $stateParams.instruction_title;
        }

    };
    $scope.show_last_version = function (row) {

        console.log(row);

        var data = row.new_object;
        var data_old = row.old_object;

        $scope.sa = {};
        $scope.sa_old = {};
        $scope.members = [];
        $scope.members_old = [];
        $scope.guidances = [];
        $scope.guidances_old = [];
        $scope.selected_users = [];
        $scope.sa.id = data.id;
        $scope.sa.type = $stateParams.instruction_type == '1' ? 'دستورالعمل' : 'روش اجرایی';
        if (data.files && data.files.length) {
            $scope.sa.file_url = data.files[data.files.length - 1].file.url;

        }
        /* if(data.file && data.file.url){

            $scope.sa.file_url=data.file.url;
        }*/
        if (data.instruction_documention) {
            $scope.sa.goal = data.instruction_documention.goal;

            $scope.sa.domain = data.instruction_documention.domain;
            $scope.sa.requirement_law = data.instruction_documention.requirement_law;
            $scope.sa.defination = data.instruction_documention.defination;
            $scope.sa.resource = data.instruction_documention.resource;
            $scope.sa.personnel = data.instruction_documention.personnel;
            $scope.sa.approach = data.instruction_documention.approach;
            $scope.sa.related_documents = data.instruction_documention.related_documents;
            $scope.sa.Notification_notic = data.notification_notic;
            $scope.sa.doc_code = data.doc_code;
            $scope.sa.create_doc_at = $scope.get_date(data.create_doc_at);
            $scope.sa.revise_at = $scope.get_date(data.revise_at);
            $scope.sa.refer_at = $scope.get_date(data.refer_at);

        }
        if (data.instruction_users) {
            data.instruction_users.forEach(function (itm) {
                if (itm.guider) {
                    $scope.guidances.push({first_name: itm.firstname});
                } else {

                    $scope.members.push({
                        first_name: itm.firstname,
                        producers: itm.director,
                        verifiers: itm.verifier,
                        communicator: itm.commenicator,
                        u_selected: itm.user_id,
                        user_selected: $scope.get_person(itm.user_id, $scope.users),
                        user: $scope.get_user(itm.user_id, $scope.users)
                    });

                }
            });
        }
        if (data_old) {
            if (data_old.files && data_old.files.length) {

                var f = data_old.files[data_old.files.length - 1].file.url;
                if (f !== $scope.sa.file_url) {
                    $scope.sa_old.file_url = f;
                }
            }
            if (data_old.instruction_documention) {
                $scope.sa_old.goal = data.instruction_documention.goal != data_old.instruction_documention.goal ? data_old.instruction_documention.goal : null;
                $scope.sa_old.domain = data.instruction_documention.domain != data_old.instruction_documention.domain ? data_old.instruction_documention.domain : null;
                $scope.sa_old.requirement_law = data.instruction_documention.requirement_law != data_old.instruction_documention.requirement_law ? data_old.instruction_documention.requirement_law : null;
                $scope.sa_old.defination = data.instruction_documention.defination != data_old.instruction_documention.defination ? data_old.instruction_documention.defination : null;
                $scope.sa_old.resource = data.instruction_documention.resource != data_old.instruction_documention.resource ? data_old.instruction_documention.resource : null;
                $scope.sa_old.personnel = data.instruction_documention.personnel != data_old.instruction_documention.personnel ? data_old.instruction_documention.personnel : null;
                $scope.sa_old.approach = data.instruction_documention.approach != data_old.instruction_documention.approach ? data_old.instruction_documention.approach : null;
                $scope.sa_old.related_documents = data.instruction_documention.related_documents != data_old.instruction_documention.related_documents ? data_old.instruction_documention.related_documents : null;
                $scope.sa_old.Notification_notic = data.instruction_documention.Notification_notic != data_old.notification_notic ? data_old.notification_notic : null;
                $scope.sa_old.doc_code = data.instruction_documention.doc_code != data_old.doc_code ? data_old.doc_code : null;
                $scope.sa_old.create_doc_at = data.create_doc_at && data_old.create_doc_at && data.create_doc_at.substring(0, 10) != data_old.create_doc_at.substring(0, 10) ? $scope.get_date(data_old.create_doc_at) : null;
                $scope.sa_old.revise_at = data.revise_at && data_old.revise_at && data.revise_at.substring(0, 10) != data_old.revise_at.substring(0, 10) ? $scope.get_date(data_old.revise_at) : null;
                $scope.sa_old.refer_at = data.refer_at && data_old.refer_at && data.refer_at.substring(0, 10) != data_old.refer_at.substring(0, 10) ? $scope.get_date(data_old.refer_at) : null;

            }
            if (data_old.instruction_users) {
                if (!angular.isArray(data_old.instruction_users)) {
                    data_old.instruction_users = [data_old.instruction_users];
                }
                data_old.instruction_users.forEach(function (itm) {
                    if (itm.guider) {
                        var g = {first_name: itm.firstname};
                        if ($scope.guidances.indexOf(g) === -1) {
                            $scope.guidances_old.push(g);
                        }
                    } else {
                        var m = {
                            first_name: itm.firstname,
                            producers: itm.director,
                            verifiers: itm.verifier,
                            communicator: itm.commenicator,
                            u_selected: itm.user_id,
                            user_selected: $scope.get_person(itm.user_id, $scope.users),
                            user: $scope.get_user(itm.user_id, $scope.users)
                        };
                        if ($scope.members.indexOf(m) === -1) {
                            $scope.members_old.push(m);
                        }

                    }
                });
            }
        }

        $scope.template.url = BASE + '/asset/directives/instruction.htm';
        $scope.is_parent = false;
    };

});

app.controller('evaluation_Ctrl', function ($scope, $state, factory1, localStorageService, $http, Server_URL, $rootScope, $location, $stateParams, $filter) {

    $scope.state_icon = 'icon';
    $scope.state_category = $stateParams.category ? $stateParams.category : '';
    $scope.level_type = $stateParams.type === 'understanding_the_risks' ? 'risk_level' : 'level';
    $scope.risk_excel_style = {
        sheetid: 'شناخت مخاطرات',
        headers: true,
        caption: {
            title: 'شناخت مخاطرات',
            style: 'font-size: 50px' // Sorry, styles do not works
        },
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:20px;background:#f00;text-align:center'
        },
        columns: [
            {
                columnid: 'title', title: 'نوع مخاطره'

            },
            {
                columnid: 'risk_level', title:
                'سطح مخاطره ' + '\r\n' +
                '"عدم وقوع = 0 ' + '\r\n' +
                ' پایین = 1 ' + '\r\n' +
                ' متوسط = 2 ' + '\r\n' +
                ' بالا = 3"'
                , width: 150,
                cell: {
                    value: function (value) {
                        return value != null ? value : '';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'description', title: 'توضیحات', width: 150,
                cell: {
                    value: function (value) {
                        return value ? value : '';
                    },

                    style: function (value, a, b) {

                        return b.category ? '' : 'width:30px';
                    }

                }
            }, {
                columnid: 'category', title: ''
            }

            /*{
             columnid:'name',
             title: 'Number of letters in name',
             width: '300px',
             cell: {
             value: function(value){return value.length}
             }
             2:{
             style:'text-align:center'
             }
             },*/
        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff');
            }
        },
        rows: {

            /* 4:{cell:{style:'background:#d6edff'}}*/
        },
        cells: {
            /* 2:{
             2:{
             style: 'font-size:45px;background:pink',
             value: function(value){return value.substr(1,3);}
             }
             }*/
        },
        alignment: {readingOrder: 2}
    };
    $scope.safty_excel_style = {
        sheetid: 'ایمنی',
        headers: true,
        caption: {
            title: 'ایمنی',
            style: 'font-size: 50px' // Sorry, styles do not works
        },
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:20px;background:#f00;text-align:center'
        },
        columns: [
            {
                columnid: 'question', title: 'شرح سوال'

            },
            {
                columnid: 'level', title:
                'سطح ایمنی ' + '\r\n' +
                '"بالا = 2' + '\r\n' +
                'متوسط = 1' + '\r\n' +
                'پایین = 0"'
                , width: 150,
                cell: {
                    value: function (value) {
                        return value != null ? value : '';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'description', title: 'توضیحات', width: 150,
                cell: {
                    value: function (value) {
                        return value ? value : '';
                    },

                    style: function (value, a, b) {

                        return b.subcategory ? '' : 'width:30px';
                    }

                }
            }, {
                columnid: 'subcategory', title: ''
            }

            /*{
             columnid:'name',
             title: 'Number of letters in name',
             width: '300px',
             cell: {
             value: function(value){return value.length}
             }
             2:{
             style:'text-align:center'
             }
             },*/
        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff');
            }
        },
        rows: {

            /* 4:{cell:{style:'background:#d6edff'}}*/
        },
        cells: {
            /* 2:{
             2:{
             style: 'font-size:45px;background:pink',
             value: function(value){return value.substr(1,3);}
             }
             }*/
        },
        alignment: {readingOrder: 2}
    };


    $scope.pie_chart = {
        labels_chart: ['زمین شناختی', 'آب و هوایی', 'پدیده های اجتماعی', 'زیستی', 'فناورزاد و انسان ساخت'],
        colors_chart: ['#2f9693', '#c93253', '#ffbb18', '#2b6072', '#ea8b47'],
        data_chart: [],
        options: {
            tooltips: {
                bodyFontSize: 18
            }
        }
    };
    $scope.edits_chart = {
        labels_chart: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [5, 10, 10, 15, 0, 0, 0, 0, 0, 0, 0, 0],
        data_set: {
            pointBackgroundColor: ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC'],
            borderColor: '#1c94e0'
        },
        options: {
            tooltips: {
                titleFontSize: 10,
                bodyFontSize: 10
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'زمـــــان',
                        fontSize: 11
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        min: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'تعــــداد دفعات مراجعات',
                        fontSize: 11
                    }
                }]

            }
        }
    };
    $scope.data_info = {};
    $scope.data_info_copy = {};
    $scope.data_info_copy_2 = {};
    $scope.is_parent = false;
    $scope.results = [];
    $scope.edited = false;
    $scope.total_frequency = [];
    $scope.total_pie_chart = 0;
    $scope.total_q_chart = {
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{

                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    },
                    /* scaleLabel: {
                     display: true,
                     labelString: 'ماه',
                     fontSize: 11
                     }*/
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },
                    /* scaleLabel: {
                     display: true,
                     labelString: 'درصد',
                     fontSize: 11
                     }*/
                }]

            }
        },
        data_set: [],
        data_chart: [],
        labels_chart: [],
        colors_chart: [],
        series: [],
        frequency: []
    };
    $scope.radar = {
        data_chart: [],
        labels_chart: [],
        colors_chart: ['#ff0000'],
        series: [],
        data_set: {
            fill: false,
            borderColor: '#ff0000'

        },
        options: {
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scale: {
                ticks: {
                    fontSize: 8,
                    fontColor: '#ff0000',
                    beginAtZero: true,
                    suggestedMin: 31,
                    min: 0,
                    stepSize: 20,
                },
            }


        }
    };
    $scope.pie_chart = {
        labels_chart: [],
        colors_chart: ['#2f9693', '#c93253', '#ffbb18', '#2b6072', '#ea8b47', '#C62BFC', '#0FA707', '#157DC1', '#F70264'],
        data_chart: [],
        options: {
            tooltips: {
                bodyFontSize: 18
            }
        }
    };
    $scope.edits_chart = {
        labels_chart: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [5, 10, 10, 15, 0, 0, 0, 0, 0, 0, 0, 0],
        data_set: {
            pointBackgroundColor: ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC'],
            borderColor: '#1c94e0'
        },
        options: {
            tooltips: {
                titleFontSize: 10,
                bodyFontSize: 10
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'زمـــــان',
                        fontSize: 11
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        min: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'تعــــداد دفعات مراجعات',
                        fontSize: 11
                    }
                }]

            }
        }
    };
    $scope.ihistory = [];
    $scope.exportOptions = {
        width_image: 400,
        fileName: $stateParams.type === 'understanding_the_risks' ? 'وقوع هر یک از انواع مخاطرات در بیمارستان' : 'ایمنی هر یک از انواع ایمنی ها در بیمارستان'
    }

    $scope.get_edited_records = function (row) {
        /*  if(!row.old_object){
         return 'اطلاع رسانی '+$scope.object_type+' '+$stateParams.instruction_title;
         }else{
         return 'ویرایش '+$scope.object_type+' '+$stateParams.instruction_title;
         }*/

    };
    $scope.set_charts = function () {
        var is_risk = $stateParams.type === 'understanding_the_risks';
        var keys = [];
        var max = 0;
        var all_data = is_risk ? $scope.data_info : $scope.data_info_copy;
        var data_chart = [];
        var multi = is_risk ? 3 : 2;
        $scope.total_pie_chart = 0;
        for (var key in all_data) {
            if (all_data.hasOwnProperty(key)) {
                keys.push(key);
                var total_level = 0;
                all_data[key].forEach(function (itm) {
                    total_level += parseInt(itm[$scope.level_type]);
                });
                var d = ((total_level * 100) / (all_data[key].length * multi)).toFixed(2);
                data_chart.push(d);
                $scope.total_pie_chart += parseFloat(d);
            }
        }

        $scope.total_q_chart.labels_chart = keys;
        $scope.radar.labels_chart = keys;
        $scope.pie_chart.labels_chart = keys;
        $scope.total_q_chart.series = is_risk ? ['عدم وقوع', 'پایین', 'متوسط', 'بالا'] : ['پایین', 'متوسط', 'بالا'];
        $scope.total_q_chart.colors_chart = is_risk ? ['#0fa707', '#fbd300', '#ff7200', '#ff0000'] : ['#ff0000', '#ff7200', '#0fa707'];
        $scope.total_q_chart.data_set = is_risk ? [{
            borderWidth: 0,
            backgroundColor: '#0fa707'
        }, {
            borderWidth: 0,
            backgroundColor: '#fbd300'
        }, {
            borderWidth: 0,
            backgroundColor: '#ff7200'
        }, {
            borderWidth: 0,
            backgroundColor: '#ff0000'
        }] : [{
            borderWidth: 0,
            backgroundColor: '#ff0000'
        }, {
            borderWidth: 0,
            backgroundColor: '#ff7200'
        }, {
            borderWidth: 0,
            backgroundColor: '#0fa707'
        }];
        $scope.total_q_chart.data_chart = $scope.get_horizontal_bar($scope.results, keys, is_risk ? 'category' : 'subcategory', is_risk ? 'risk_level' : 'level', is_risk ? 4 : 3);
        $scope.total_q_chart.frequency = $scope.get_frequency($scope.results, keys, is_risk ? 'category' : 'subcategory', is_risk ? 'risk_level' : 'level', is_risk ? 4 : 3);
        $scope.total_q_chart.frequency.forEach(function (itm) {
            if (itm.length > max) {
                max = itm.length;
            }
        });
        $scope.total_frequency = $scope.new_Array(max);
        $scope.radar.series = $rootScope.year;
        $scope.radar.data_chart = data_chart;
        $scope.total_pie_chart /= keys.length;
        $scope.pie_chart.data_chart = data_chart;
        if (data_chart.length > 9) {
            for (var i = 10; i <= data_chart.length; i++) {
                $scope.pie_chart.colors_chart.push($scope.set_color(i, $scope.pie_chart.colors_chart));
            }
        }

    };

    $scope.get_risks = function () {
        Array.prototype.sortBy = function (p) {
            return this.slice(0).sort(function (a, b) {
                return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
            });
        };
        factory1.getUserApi('/v1/user/hospital/risks').then(function (data) {
            $scope.excel_filename = $scope.state_title + ' ' + $rootScope.year;
            $scope.first_evaluation = data.every(function (itm) {
                if (itm.risk_level === null && (!itm.description || !itm.description.length)) {
                    return true;
                }
            });
            $scope.data_info_copy = angular.copy(data);
            $scope.data_info_copy_2 = angular.copy(data);
            $scope.data_info = $filter('groupBy')($scope.data_info_copy, 'category');
            $scope.results = angular.copy($scope.data_info_copy_2);
            $scope.excel_outPut = [];
            for (var key in $scope.data_info) {
                if ($scope.data_info.hasOwnProperty(key)) {
                    $scope.excel_outPut.push({category: key.toString()});
                    $scope.excel_outPut = $scope.excel_outPut.concat([], $scope.data_info[key].map(function (itm) {
                        return {title: itm.title, risk_level: itm.risk_level, description: itm.description}
                    }));
                }
            }
            $scope.set_charts();

        });

    };
    $scope.save_risk = function (arr, next_url) {
        $scope.edited = false;

        if (arr.length) {
            var parameter = JSON.stringify({
                risks: arr
            });
            $http.put(Server_URL + '/v1/user/hospital/risk/submit', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.first_evaluation = false;
                    $scope.success_alert('ارزیابی مخاطرات با موفقیت ثبت شد.', 'ثبت مخاطرات');

                    $scope.data_info_copy_2 = angular.copy($scope.data_info_copy);
                    $scope.results = angular.copy($scope.data_info_copy_2);
                    $scope.edited = false;

                    $location.path(next_url);


                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        } else {
            $scope.results = angular.copy($scope.data_info_copy_2);
            $location.path(next_url);
        }


    };
    $scope.risk_submit = function (next) {

        var arr = [];
        arr = $scope.data_info_copy.filter(function (itm) {
            if (itm.risk_level !== null || (itm.description && itm.description.length)) {
                return angular.copy(itm);
            }
        });

        if (arr.length > 0 && arr.length !== $scope.data_info_copy.length) {
            $scope.warning('لطفاً همه سوالات را بدرستی پاسخ دهید.');
            return false;
        }
        if (arr.length > 0) {
            if ($scope.first_evaluation) {
                $scope.save_risk(arr, next.url);
            } else if (angular.equals(arr, $scope.data_info_copy_2)) {

                $scope.results = arr;
                $scope.edited = false;

                $location.path(next.url);

            } else {

                var changes = [];
                arr.map(function (itm, i) {

                    if (itm.risk_level !== $scope.data_info_copy_2[i].risk_level || itm.description !== $scope.data_info_copy_2[i].description) {
                        itm.checked = true;
                        changes.push(itm)
                    }
                });
                if (!changes.length) {

                    $scope.results = arr;
                    $scope.edited = false;

                    $location.path(next.url);

                } else {
                    $scope.question_changed('برخی از مقادیر تغییر کرده است، آیا تمایل به بروزرسانی اطلاعات دارید؟', 'راستی آزمایی تغییرات', changes);
                    $scope.q_result.result.then(function (r) {

                        if (r) {

                            r = r.filter(function (itm, i) {
                                if (itm.checked) {
                                    return itm;
                                } else {
                                    $scope.data_info_copy[i] = angular.copy($scope.data_info_copy_2[i]);
                                }
                            });
                            $scope.save_risk(r, next.url);


                        } else {
                            return false;
                        }
                    });
                }


            }
        } else {
            $scope.edited = false;
            $location.path(next.url);
        }
    };

    $scope.get_safties = function () {
        factory1.getUserApi('/v1/user/hospital/safties', '&category=' + $stateParams.category).then(function (data) {
            $scope.excel_filename = $scope.state_title + ' ' + $rootScope.year;
            data.map(function (itm) {
                if (itm.subcategory.indexOf('*') >= 0) {
                    var sub = itm.subcategory.split('*');
                    itm.subcategory = sub[0];
                    itm.nested_category = sub[1];
                }
            });

            $scope.data_info_copy = $filter('groupBy')(data, 'subcategory');

            if ($scope.state_category) {

                $scope.data_info = angular.copy($scope.data_info_copy[$scope.state_category]);
            }
            $scope.results = data;
            $scope.set_charts();
            $scope.excel_outPut = [];
            for (var key in $scope.data_info_copy) {
                if ($scope.data_info_copy.hasOwnProperty(key)) {
                    $scope.excel_outPut.push({subcategory: key.toString()});
                    $scope.excel_outPut = $scope.excel_outPut.concat([], $scope.data_info_copy[key].map(function (itm) {
                        return {question: itm.question, level: itm.level, description: itm.description}
                    }));
                }
            }
        });
    };
    $scope.save_safty = function (arr, path) {
        var parameter = JSON.stringify({
            safties: arr
        });
        $http.put(Server_URL + '/v1/user/hospital/safty/submit', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.success_alert($scope.state_title +
                    ' با موفقیت ثبت شد.', 'ثبت ارزیابی');
                /*arr.map($scope.set_new);*/
                /* $scope.check_first();*/
                $scope.data_info_copy[$scope.state_category] = angular.copy($scope.data_info);
                $location.path(path);
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.safty_submit = function (is_next) {
        var has_null = false;
        var answer = [];
        var changed_answer = [];
        var path = '';
        var keys = Object.keys($scope.data_info_copy);
        var current_key = keys.indexOf($scope.state_category);
        path = current_key === keys.length - 1 || current_key === 0 ? 'evaluation/safty/' + $scope.state_title : '';
        if (is_next) {
            path = current_key === keys.length - 1 ? 'evaluation/safty/' + $scope.state_title : '';
        } else {
            path = current_key === 0 ? 'evaluation/safty/' + $scope.state_title : '';
        }
        if (!path.length) {
            path = 'evaluation/safty/' + $scope.state_title + '/category/';
            path += (is_next ? keys[current_key + 1] : keys[current_key - 1]);
        }
        has_null = $scope.data_info.some(function (itm) {
            if (itm.level === null && itm.description === null) {
                return true;
            } else {
                var changed_value = $scope.is_changed($scope.data_info_copy[$scope.state_category], 'id', itm.id, 'level', itm.level) || $scope.is_changed($scope.data_info_copy[$scope.state_category], 'id', itm.id, 'description', itm.description);
                answer.push(changed_value ? false : itm);
                if (changed_value && (changed_value.level !== null || changed_value.description !== null)) {
                    itm.checked = true;
                    changed_answer.push(angular.copy(itm));
                }

            }
        });
        if (has_null) {
            $scope.warning('به تمام سوالات پاسخ دهید.');
        } else if (angular.equals(answer, $scope.data_info)) {
            $location.path(path);
        } else if (changed_answer.length) {
            $scope.question_changed('برخی از مقادیر تغییر کرده است، آیا تمایل به بروزرسانی اطلاعات دارید؟', 'راستی آزمایی تغییرات', changed_answer);
            $scope.q_result.result.then(function (r) {
                if (r) {
                    var changed_arr = r.filter(function (itm) {
                        if (itm.checked) {
                            return itm;
                        }
                        /*else{
                            $scope.data_info.map(function (obj) {
                                if(itm.id===obj.id){

                                    var obj_copy=angular.copy($scope.is_changed($scope.data_info,'id',itm.id,null,null,true));
                                    obj.level=obj_copy.level;
                                    obj.description=obj_copy.description;
                                }
                            });
                        }*/
                    });
                    if (changed_arr.length) {
                        $scope.save_safty(changed_arr, path);
                    } else {
                        $location.path(path);
                    }

                } else {
                    return false;
                }
            });
        } else {
            $scope.save_safty($scope.data_info, path);
        }
    };
    $scope.result = function (flag) {
        var arr = [];
        for (var key in $scope.data_info_copy) {
            arr = [].concat(arr, $scope.data_info_copy[key]);
        }
        var is_answered_all = arr.every(function (itm) {
            if (itm.level !== null || (itm.description && itm.description.length)) {
                return true;
            }
        });
        if (is_answered_all) {

            $scope.results = angular.copy(arr);
            if (flag) {
                var all_has_eop = $scope.results.some(function (itm) {
                    if (itm.has_eop) {
                        return true;
                    }
                });
                if (all_has_eop) {
                    $location.path('evaluation/safty/' + $scope.state_title + '/re_result');
                } else {
                    $scope.warning('پس از ارزیابی و ثبت اقدام مداخله ای می توانید ارزیابی مجدد انجام دهید.');
                }
            } else {
                $location.path('evaluation/safty/' + $scope.state_title + '/result');
            }
        } else {
            $scope.warning('ابتدا می بایست به تمامی سوالات این بخش پاسخ دهید.');
        }

    };
    $scope.init_data = function () {
        if ($stateParams.type === 'understanding_the_risks') {
            $scope.state_title = 'شناخت مخاطرات';
            $scope.state_icon = 'icon-understanding_the_risks';
            $scope.radar_title = 'احتمال رویداد هر یک از گروه های مخاطرات در بیمارستان';
            if ($rootScope.year) {
                $scope.get_risks();
            }
            $scope.filter = {
                sort: '-risk_level'
            };
            $scope.filter_3 = true;
            $scope.filter_2 = true;
            $scope.filter_1 = true;
            $scope.filter_0 = true;
            $scope.filter_array = [$scope.filter_0, $scope.filter_1, $scope.filter_2, $scope.filter_3];
            $scope.filter_selected = function (point) {
                if (point == 3) {
                    $scope.filter_3 = !$scope.filter_3;
                } else if (point == 2) {
                    $scope.filter_2 = !$scope.filter_2;
                } else if (point == 1) {
                    $scope.filter_1 = !$scope.filter_1;
                } else if (point == 0) {
                    $scope.filter_0 = !$scope.filter_0;
                }
                $scope.filter_array = [$scope.filter_0, $scope.filter_1, $scope.filter_2, $scope.filter_3];
            };
        } else if ($stateParams.type === 'safty') {
            $scope.state_title = $stateParams.category;
            $scope.state_icon = $scope.getCookie('safty__icon');
            $scope.get_safties();
            $scope.filter = {
                sort: '-level'
            };
            $scope.filter_2 = true;
            $scope.filter_1 = true;
            $scope.filter_0 = true;
            $scope.filter_selected = function (point) {
                if (point == 2) {
                    $scope.filter_2 = !$scope.filter_2;
                } else if (point == 1) {
                    $scope.filter_1 = !$scope.filter_1;
                } else if (point == 0) {
                    $scope.filter_0 = !$scope.filter_0;
                }
                $scope.filter_array = [$scope.filter_0, $scope.filter_1, $scope.filter_2];
            };
        }
    };
    $scope.get_safty_excel_style = function () {
        $scope.safty_excel_style.sheetid = $scope.state_title;
        $scope.safty_excel_style.caption.title = $scope.state_title;
        return $scope.safty_excel_style;
    };
    $scope.statechaned = function () {
        $scope.is_parent = $state.$current.self.name === "evaluation";
        $scope.init_data();
        if (!$scope.is_parent) {
            if ($stateParams.type === 'safty') {
                $scope.radar_title = ' ' +
                    '' + $stateParams.category +
                    ' در بیمارستان';
                $scope.state_category = $state.params.subcategory;
                /*
                 localStorageService.remove('safty__icon');*/
                $scope.state_category_icon = angular.copy($scope.getCookie('safty_category_icon'));

                $scope.state_icon = $scope.getCookie('safty__icon');
                if ($scope.state_category_icon) {
                    localStorageService.remove('safty_category_icon');
                    $state.current.ncyBreadcrumb.icon = $scope.state_category_icon;
                }

            }
            if ($state.$current.self.name === "evaluation.history")
                factory1.getUserApi('/v1/user/hospital/history', '&title=' + $stateParams.type + '&object_type=' + ($stateParams.type === 'understanding_the_risks' ? 'risk' : 'safty')).then(function (data) {
                    $scope.ihistory = data;

                });
        } else {

            $state.current.ncyBreadcrumb.icon = $scope.state_icon;
        }

    };
    $scope.$watch(function () {
        return $state.$current.name
    }, function (newVal, oldVal) {
        var name = newVal.split('.');
        if (name[0] === 'evaluation')
            $scope.statechaned();
    });
    $scope.$watch(function () {
        return $state.params.subcategory
    }, function (newVal, oldVal) {
        if (newVal != undefined) {
            angular.forEach($scope.data_info_copy, function (value, key) {
                if (key == newVal) {
                    $scope.setCookie('safty_category_icon', value[0].icon);
                }
            });

            var name = $state.$current.name.split('.');
            if (name[0] === 'evaluation')
                $scope.statechaned();
        }

    });
    $scope.$watch('data_info_copy', function (newVal, oldVal) {
        if (newVal !== oldVal && $scope.data_info_copy_2.length) {
            $scope.edited = !angular.equals($scope.data_info_copy, $scope.data_info_copy_2);
        }
    }, true);


});

app.controller('Periodic_visits_to_the_building_Ctrl', function ($scope, $state, factory1, localStorageService, $http, Server_URL, $rootScope, $filter, $timeout) {

    var record_card_instanc = {
        date: '',
        description: '',
        corrective: false,
        emergency: false,
        replacement: '',
        spare_code: '',
        spare_count: '',
        consideration: ''

    };
    var model_1_instance = {
        category: '',
        device_name: '',
        location: '',
        manufacturer_specifications: '',
        manufacturer_address: '',
        manufacturer_cell_phone: '',
        seller_profile: '',
        seller_address: '',
        seller_cell_phone: '',
        make_year: '',
        installation_date: '',
        water: '',
        electricity: '',
        oil: '',
        fuel: '',
        attachments: [],
        electro_motors: [],
        year: $rootScope.year
    };
    var electro_motors_instance = {
        amper: '',
        volt: '',
        kw: '',
        country: '',
        name: '',
        rpm: '',
        description: ''
    }
    var attachments_instance = {
        title: '',
        location: '',
        _file: '',
        file: ''
    }

    $scope.categories = [
        'آسانسورها',
        'برج خنک کننده',
        'هواساز',
        'دیگ بخار',
        'دیگ آب گرم',
        'سختی گیر',
        'پمپ زمینی',
        'ژنراتور',
        'آشپزخانه',
        'پیجر',
        'تابلو برق',
        'UPS',
        'آیفون',
        'تجهیزات آشپزخانه',
        'سردخانه',
        'درب‌های اتومات',
        'اکسیژن ساز',
        'فنکوئل سقفی',
        'فنکوئل زمینی',
        'اگزو فن',
        'کولر آبی',
        'چیلر',
        'یخچال',
        'مبدل حرارتی',
        'پمپ خطی',
        'منبع انبساط',
        'پمپ خطی',
        'دستگاه اسپلیت',
        'سیستم کنترل سطح آب منبع',
        'کنترلرهای هواساز',
    ]
    $scope.visit = {
        type: 'بازدید دستگاه',
        type_file: '',
        selected_checklist: null,
        is_have_ward: false,
        is_have_component: false,
        name: '',
        periods: '',
        components: [{checklist: [], name: ''}],
        wards: [{checklist: []}],
        simple: {
            periods: 'هفتگی',
            repetitions: '',
            checklist: []
        },
        copy: '',
        carousel_slides: [], options: {
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 0,
            dir: 'ltr',
            width: 200,
            height: 200,
            space: 130,
            loop: true,
            controls: true
        },
        selected_slide: null,
        file: '',
        b64_file: ''

    };
    $scope.monthly = [
        {num: 1, name: 'فروردین', period: []},
        {num: 2, name: 'اردیبهشت', period: []},
        {num: 3, name: 'خرداد', period: []},
        {num: 4, name: 'تیر', period: []},
        {num: 5, name: 'مرداد', period: []},
        {num: 6, name: 'شهریور', period: []},
        {num: 7, name: 'مهر', period: []},
        {num: 8, name: 'آبان', period: []},
        {num: 9, name: 'آذر', period: []},
        {num: 10, name: 'دی', period: []},
        {num: 11, name: 'بهمن', period: []},
        {num: 12, name: 'اسفند', period: []}

    ];
    $scope.days = [];
    $scope.data_recordes = [];
    $scope.active_month = '';
    $scope.search = {
        keyword: '',
        type: '',
        periods1: '',
        periods2: '',
        device_name:'',
        category:''
    };
    $scope.system_visits = [];
    $scope.system_visit_copy = null;
    $scope.visits = [];
    $scope.active_view = -1;
    $scope.color = ['#4d4cba', '#c03b64', '#629cbd', '#9abe4b', '#b39239', '#16bb92', '#bb6f16', '#7b16bb', '#0fe81e', '#0fe81e', '#e823c1'];
    $scope.reset_steps();
    $scope.view = {
        create: false,
        periods: 'هفتگی',
        speriods: 'هفتگی'
    };
    $scope.form_values = [];
    $scope.current_visit_model = null;
    $scope.events = [
        {month: 'فروردین', data: [], month_num: 1, days: []}, {
            month: 'اردیبهشت',
            data: [],
            month_num: 2,
            days: []
        }, {month: 'خرداد', data: [], month_num: 3, days: []},

        {month: 'تیر', data: [], month_num: 4, days: []}, {
            month: 'مرداد',
            data: [],
            month_num: 5,
            days: []
        }, {month: 'شهریور', data: [], month_num: 6, days: []},

        {month: 'مهر', data: [], month_num: 7, days: []}, {
            month: 'آبان',
            data: [],
            month_num: 8,
            days: []
        }, {month: 'آذر', data: [], month_num: 9, days: []},

        {month: 'دی', data: [], month_num: 10, days: []}, {
            month: 'بهمن',
            data: [],
            month_num: 11,
            days: []
        }, {month: 'اسفند', data: [], month_num: 12, days: []}
    ];
    $scope.visit_types = [
        'روزانه',
        'هفتگی',
        'ماهانه',
    ];

    function set_days_of_month() {
        $scope.months = [
            {month: 'فروردین', data: [], month_num: 1}, {month: 'اردیبهشت', data: [], month_num: 2}, {
                month: 'خرداد',
                data: [],
                month_num: 3
            },

            {month: 'تیر', data: [], month_num: 4}, {month: 'مرداد', data: [], month_num: 5}, {
                month: 'شهریور',
                data: [],
                month_num: 6
            },

            {month: 'مهر', data: [], month_num: 7}, {month: 'آبان', data: [], month_num: 8}, {
                month: 'آذر',
                data: [],
                month_num: 9
            },

            {month: 'دی', data: [], month_num: 10}, {month: 'بهمن', data: [], month_num: 11}, {
                month: 'اسفند',
                data: [],
                month_num: 12
            }
        ];
        $scope.months.forEach(function (e, i) {
            var days = [];
            $scope.get_day_of_month(e.month_num, $rootScope.year).forEach(function (day) {
                $scope.has_checklists($scope.months[i].data, $rootScope.year, e.month_num, day);

                days.push({day: day, className: false});
            });
            $scope.months[i].days = angular.copy(days);


        });
    };
    function getData(page) {
        $scope.data_recordes=[];
        $scope.perofilePage = page;
        var q='';
        if($scope.search.device_name){
            q+='&device_name='+$scope.search.device_name;
        }
        if($scope.search.category && $scope.search.category!='All'){
            q+='&category='+$scope.search.category;
        }
        $rootScope.loading_in_app=true;
        factory1.getUserApi('/v1/user/hospital/visit_profiles', '&per=24&page=' + page+q).then(function (data) {
            $rootScope.loading_in_app=false;
            $scope.data_recordes = data.result;
            $scope.meta_data_recordes = data.meta;
            $scope.meta_data_recordes.all_count_page = Math.ceil(data.meta.all_count / 24);
        })
    }
    function deleteRecordCard(id) {
        return factory1.deleteUserApi('/v1/user/hospital/visit_profile/record_card/' + id)
    }
    function has_visit(data, date) {
        return data.filter(function (d) {

            return moment(d.date).isSame(date, 'day');
        });
    }
    function set_class(row, d, i, j) {
        if (!d.className) {
            var day = d.day;
            var l = has_visit(row.data, moment($scope.get_miladi_date($rootScope.year + '/' + row.month_num + '/' + day)));
            /*$scope.has_session(row.data,$rootScope.year,row.month_num,day);*/

            d.className = (l.length ? (l.length === 1 ? (l[0].has_report && l[0].send_kartabl ? 'active' : (l[0].expire ? 'fail' : 'bordered')) :
                (l.every(function (itm) {
                    if (itm.has_report && itm.send_kartabl) {
                        return true;
                    }
                }) ? 'notify active' : (l.every(function (itm) {
                    if (itm.expire) {
                        return true;
                    }
                }) ? 'notify fail' : 'notify bordered'))) : 'notset');

            $scope.events[i].days[j].len = l.length;
        }


        return d.className;
    }
    function setEvents(data) {
        $scope.events.map(function (itm) {
            itm.data = [];
        });
        data.forEach(function (itm) {
            if (itm.date) {
                switch (moment(itm.date).jMonth()) {
                    case 0:
                        $scope.events[0].data.push(itm);
                        break;
                    case 1:
                        $scope.events[1].data.push(itm);
                        break;
                    case 2:
                        $scope.events[2].data.push(itm);
                        break;
                    case 3:
                        $scope.events[3].data.push(itm);
                        break;
                    case 4:
                        $scope.events[4].data.push(itm);
                        break;
                    case 5:
                        $scope.events[5].data.push(itm);
                        break;
                    case 6:
                        $scope.events[6].data.push(itm);
                        break;
                    case 7:
                        $scope.events[7].data.push(itm);
                        break;
                    case 8:
                        $scope.events[8].data.push(itm);
                        break;
                    case 9:
                        $scope.events[9].data.push(itm);
                        break;
                    case 10:
                        $scope.events[10].data.push(itm);
                        break;
                    case 11:
                        $scope.events[11].data.push(itm);
                        break;

                }
            }

        });
        $scope.events.map(function (e, i) {
            var days = [];
            $scope.get_day_of_month(e.month_num, $rootScope.year).forEach(function (day) {
                days.push({day: day, className: false});
            });
            Object.assign(e.days, angular.copy(days));
            e.days.map(function (itm, j) {
                itm.className = set_class(e, itm, i, j);

            })
        });
    }
    function set_days_of_events() {
        var url = 'visit_calendars';

        $scope.events.map(function (itm) {
            itm.data = [];
        });
        factory1.getUserApi('/v1/user/hospital/' + url).then(function (data) {

            setEvents(data)
        }, function () {
            setEvents([])
        });
    }
    function getDevices() {
        $scope.devices_list = [];

        factory1.getUserApi('/v1/user/hospital/visit_profiles/compact').then(function (data) {
            $scope.devices_list = data;
        })
    }

    $scope.searchDevice=function(){

        delay.call($scope,function () {
            getData(1);
        },500);

    };
    $scope.toggle_config = function () {

        if (!$scope.view.create) {
            $scope.view.create = true;
            $scope.reset_steps();
            $scope.visit = {
                type: 'بازدید دستگاه',
                type_file: '',
                selected_checklist: null,
                is_have_ward: false,
                is_have_component: false,
                name: '',
                periods: '',
                components: [{checklist: [], name: ''}],
                wards: [{checklist: []}],
                simple: {
                    periods: 'هفتگی',
                    repetitions: '',
                    checklist: []
                },
                copy: '',
                carousel_slides: [], options: {
                    visible: 5,
                    perspective: 35,
                    startSlide: 0,
                    border: 0,
                    dir: 'ltr',
                    width: 200,
                    height: 200,
                    space: 130,
                    loop: true,
                    controls: true
                },
                selected_slide: null,
                file: '',
                b64_file: ''

            };
        } else {
            $scope.view.create = false;
        }
    };
    $scope.has_checklists = function (arr, year, month, day, week) {

        if (!angular.isArray(arr)) {
            arr = [];
        }

        if ($scope.current_visit_model.period === 'روزانه' || $scope.current_visit_model.period === 'ماهانه') {
            $scope.form_values.forEach(function (fv) {

                var fv_date = moment(fv[0]);

                var this_date = moment(moment(year + '/' + month + '/' + day, 'jYYYY/jM/jD').format('YYYY-MM-DD'));
                if (fv_date.isSame(this_date, 'days')) {
                    arr[day] = fv[1];
                }
            });

        } else {
            week.forEach(function (d, i) {
                $scope.form_values.forEach(function (fv) {

                    var fv_date = moment(fv[0]).hour(5);
                    if (d.isSame(fv_date, 'days')) {
                        arr[i] = fv[1];
                    }
                });
            });

        }
        return arr;
    };
    $scope.set_class = function (row, d, type) {
        if (!d.className) {
            var l = row.data;
            if (type === 'daily' || type === 'monthly') {
                var i = $scope.months.indexOf(row);
                var j = row.days.indexOf(d);
                var day = d.day;

                d.className = $scope.is_holidy($rootScope.year, row.month_num, day) ? 'text-warning ' : '';
                if (type === 'daily') {
                    l = l[d.day] ? l[d.day] : [];
                    if (l.length && l.length !== $scope.total_check_list) {
                        $scope.months[i].days[j].len = ($scope.total_check_list - l.length) / $scope.current_visit_model.visit_forms.length;
                        d.className += ' notify';
                    }
                } else {
                    if (l && l.length) {
                        var sum_in_month = 0;
                        var flag = false;
                        l.forEach(function (itm, i) {
                            if (itm.length) {
                                sum_in_month += itm.length;
                                if (i === day) {
                                    flag = true;
                                }
                            }

                        });
                        if (flag) {

                            l = $scope.new_Array(sum_in_month);
                        } else {
                            l = [];
                        }
                    } else {
                        l = [];
                    }
                }


            } else {
                i = $scope.weekly.indexOf(row);
                j = row.days.indexOf(d);
                /*l=l[j]?l[j]:[];*/
                if (l[j] && l[j].length) {
                    var sum = 0;
                    l.forEach(function (itm) {
                        sum += itm.length;
                    });
                    l = $scope.new_Array(sum);
                } else {
                    l = [];
                }
                d.Jdate = d.format('jYYYY/jM/jD');

                d.className = 'text-orange2';
            }
            if (l.length) {

                if (l.length === $scope.total_check_list) {
                    d.className += ' active';
                    if (type === 'weekly') {
                        d.className += ' orange_bg text-white';
                    }
                } else {
                    d.className += ' bordered';
                }
            } else {
                d.className += ' notset';
            }
            if (type === 'daily' || type === 'monthly') {
                $scope.months[i].days[j].className = d.className;
            } else {
                $scope.weekly[i].days[j].className = d.className;
            }


        }
        return d.className;
    };
    $scope.next = function (step) {
        if (step === 1) {
            if (!$scope.visit.name.length) {
                $scope.warning('لطفاً عنوان بازدید را وارد کنید.');
                return false;
            }
        } else if (step === 2) {
            console.log($scope.visit);
            if ($scope.visit.is_have_ward) {

                var errors = $scope.visit.wards.filter(function (itm) {
                    if (!itm.name || !itm.periods || !itm.repetitions || !itm.name.length || !itm.periods.length || !itm.repetitions.length) {
                        return itm;
                    }
                });
                if (errors.length) {
                    $scope.warning('لطفاً اطلاعات بخش های مورد نظر را بدرستی وارد کنید.');
                    return false;
                }
            }
            if ($scope.visit.is_have_component) {
                var errors2 = $scope.visit.components.filter(function (itm) {
                    if (!itm.name || !itm.periods || !itm.repetitions || !itm.name.length || !itm.periods.length || !itm.repetitions.length) {
                        return itm;
                    }
                });

                if (errors2.length) {
                    console.log(errors2);
                    $scope.warning('لطفاً اطلاعات اجزای مورد نظر را بدرستی وارد کنید.');
                    return false;
                }
            }
            if (!$scope.visit.is_have_ward && !$scope.visit.is_have_component && !$scope.visit.simple.repetitions.length) {
                $scope.warning('لطفاً تعداد دفعات تکرار را وارد کنید.');
                return false;
            }
            if ($scope.visit.simple.repetitions.length) {
                $scope.visit.simple.name = $scope.visit.name;
                $scope.visit.selected_checklist = $scope.visit.simple;
            } else {
                $scope.visit.selected_checklist = null;
            }
        } else if (step === 3) {

            var c = 0;
            var not_complate_checklist = [];
            $scope.visit.carousel_slides = [];
            $scope.visit.components.forEach(function (itm) {
                if (itm.name && itm.name.length) {
                    if (itm.checklist && itm.checklist.length > 0 && itm.format && itm.format.length) {
                        itm.type = 2;
                        itm.color = $scope.color[c];
                        c++;
                        $scope.visit.carousel_slides.push(itm);
                    } else {
                        not_complate_checklist.push(itm);
                    }
                }
            });
            $scope.visit.wards.forEach(function (itm) {
                if (itm.name && itm.name.length) {
                    if (itm.checklist && itm.checklist.length > 0 && itm.format && itm.format.length) {
                        itm.type = 1;
                        itm.color = $scope.color[c];
                        c++;
                        $scope.visit.carousel_slides.push(itm);
                    } else {
                        not_complate_checklist.push(itm);
                    }
                }

            });
            if ($scope.visit.simple.checklist && $scope.visit.simple.checklist.length > 0) {

                $scope.visit.simple.color = $scope.color[c];
                c++;
                $scope.visit.carousel_slides.push($scope.visit.simple);
            }
            if (not_complate_checklist.length) {
                console.log(not_complate_checklist);
                var e_not_complate_checklist = not_complate_checklist.map(function (itm) {
                    return itm.name;
                });
                var str_txt0 = e_not_complate_checklist.join('،');
                $scope.warning('لطفاً تمامی اطلاعات چک لیست ' +
                    str_txt0.substring(0, str_txt0.length) +
                    ' را تدوین نمایید.');
                return false;
            }
            if ($scope.visit.carousel_slides.length) {
                var error_3 = [], error_4 = [];
                $scope.visit.carousel_slides.map(function (itm) {
                    var arr = [];
                    console.log(itm);
                    if (itm.format && itm.format.length) {
                        itm.checklist.forEach(function (obj) {

                            if (obj.checked && obj.checked === true) {
                                if (obj.text && obj.text.length) {
                                    obj.value = $scope.new_Array(itm.repetitions);
                                    arr.push(obj);
                                } else {
                                    error_4.push(itm);
                                }

                            }
                        });
                        itm.checklist = arr;
                    } else {
                        error_3.push(itm);
                    }


                });

                if (error_3.length) {
                    var e_forms = error_3.map(function (itm) {
                        return itm.name;
                    });
                    var str = e_forms.join('،');
                    $scope.warning('لطفاً فرمت شماره فرم ' +
                        str.substring(0, str.length) +
                        ' را بدرستی تکمیل نمایید.');
                    return false;
                }
                if (error_4.length) {
                    var e_forms_text = error_4.map(function (itm) {
                        return itm.name;
                    });
                    var str_txt = e_forms_text.join('،');
                    $scope.warning('لطفاً متن سوالات چک لیست ' +
                        str_txt.substring(0, str_txt.length) +
                        ' را بدرستی تکمیل نمایید.');
                    return false;
                }
                var is_all_checklist_complated = $scope.visit.carousel_slides.every(function (itm) {
                    if (itm.checklist.length) {
                        return true;
                    }
                });
                if (!$scope.visit.carousel_slides.length || !is_all_checklist_complated) {
                    $scope.warning('لطفاً چک لیست مورد نظر را تدوین نمایید.');
                    return false;
                } else {
                    $scope.visit.selected_slide = $scope.visit.carousel_slides[0];
                }

            } else {
                $scope.warning('لطفاً چک لیست مورد نظر را تدوین نمایید.');
                return false;
            }

        }
        $scope.steps.push(step);

    };
    $scope.cancel = function () {
        $scope.reset_steps();
        $scope.view.create = false;
        $scope.config_set = false;
        $scope.visit = {
            type: 'بازدید دستگاه',
            selected_checklist: null,
            is_have_ward: false,
            is_have_component: false,
            name: '',
            components: [{checklist: [], name: ''}],
            wards: [{checklist: []}],
            simple: {
                periods: 'هفتگی',
                repetitions: ''
            },
            copy: '',
            carousel_slides: [], options: {
                visible: 5,
                perspective: 35,
                startSlide: 0,
                border: 0,
                dir: 'ltr',
                width: 200,
                height: 200,
                space: 130,
                loop: true,
                controls: true
            },
            selected_slide: null

        };
    };
    $scope.last = function (step) {
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
    $scope.copy_checklist = function () {
        var c = JSON.parse($scope.visit.copy);
        $scope.visit.selected_checklist.checklist = c.checklist;
    };
    $scope.visit_model = function () {
        return $scope.visit.carousel_slides.map(function (obj) {

            return {
                title: obj.name,
                recurring: obj.repetitions,
                period: obj.periods,
                visit_type: obj.type ? obj.type : 0,
                operator_name: obj.first_date,
                form_prefix: obj.format,
                id: obj.id,
                visit_form: obj.checklist.map(function (itm) {
                    return {
                        id: itm.id,
                        key: itm.text,
                        value: itm.value,
                        description: itm.description

                    };
                })
            };
        });
    };
    $scope.save = function () {
        var parameter = JSON.stringify({

            title: $scope.visit.name,
            visit_type: $scope.visit.type,
            has_form_pic: false,
            visit_model: $scope.visit_model(),
            id: $scope.visit.id,
            year: $rootScope.year
        });
        $http.post(Server_URL + '/v1/user/hospital/visit', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                console.log(data);
                if ($scope.visit.id) {

                    $scope.system_visits.map(function (v, i) {
                        if (v.id === $scope.visit.id) {
                            $scope.system_visits[i] = data;
                        }
                    });
                    $scope.visit.id = null;
                    $scope.success_alert('فرم بازدید با موفقیت به روزرسانی شد.', 'به روزرسانی فرم چک لیست');
                } else {
                    $scope.system_visits.push(data);
                    $scope.success_alert('فرم بازدید با موفقیت ثبت شد.', 'ثبت فرم چک لیست');
                }

                $scope.cancel();
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.save_upload_config = function () {
        if ($scope.visit.name.length) {
            if ($scope.visit.b64_file.length > 1 || $scope.visit.id) {
                if ($scope.visit.type_file.length) {
                    if ($scope.visit.periods.length) {
                        var parameter = JSON.stringify({
                            title: $scope.visit.name,
                            visit_type: $scope.visit.type_file,
                            period: $scope.visit.periods,
                            has_form_pic: true,
                            file: $scope.visit.b64_file,
                            file_name: $scope.visit.file_name,
                            id: $scope.visit.id,
                            year: $rootScope.year
                        });
                        $http.post(Server_URL + '/v1/user/hospital/visit', parameter, {headers: $scope.queryHeaders})
                            .success(function (data, status, headers) {
                                console.log(data);
                                $scope.success_alert('اطلاعات چک لیست ' + $scope.visit.name + ' ' +
                                    'با موفقیت ثبت شد.', 'ثبت اطلاعات چک لیست');
                                $scope.config_set = false;
                                if ($scope.visit.id) {
                                    $scope.visits[$scope.visits._index] = data;
                                } else {
                                    $scope.visits.push(data);
                                }
                                $scope.visit.name = '';
                                $scope.visit.b64_file = '';
                                $scope.visit.periods = '';
                                $scope.visit.type_file = '';
                                $scope.visit.id = null;
                            }).error(function (data, status, headers) {
                            console.log(data);
                            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                        });
                    } else {
                        $scope.warning('لطفاً نوع تواتر پایش را مشخص کنید.');
                    }
                } else {
                    $scope.warning('لطفاً نوع بازدید را مشخص کنید.');
                }
            } else {
                $scope.warning('لطفاً فایل چک لیست را بارگذاری نمایید.');
            }
        } else {
            $scope.warning('لطفاً عنوان بازدید را واردکنید.');
        }

    };
    $scope.upload_checklist = function (chk) {
        factory1.upload_file($scope, chk, 20000000, ['application/pdf', 'application/msword', 'application/docx'], false, false, null).then(function (data) {
            $scope.visit.b64_file = data;
            $scope.visit.created_at_file = $scope.get_miladi_date();
            $scope.visit.file_name = chk.filename;
        });
    };
    $scope.slideChanged = function (index) {
        console.log($scope.visit.carousel_slides[index]);

        $scope.visit.selected_slide = $scope.visit.carousel_slides[index];
    };
    $scope.edit_system_visit = function (row) {
        console.log(row);
        $scope.toggle_config();
        $scope.visit.name = angular.copy(row.title);
        $scope.visit.id = angular.copy(row.id);
        $scope.visit.type = angular.copy(row.visit_type);
        $scope.visit.components = [];
        $scope.visit.wards = [];
        $scope.visit.is_have_component = false;
        $scope.visit.is_have_component = false;
        $scope.visit.simple.repetitions = '';
        row.visit_model.forEach(function (vm) {
            var model_ = {
                name: vm.title,
                periods: vm.period,
                repetitions: angular.copy(vm.recurring).toString(),
                id: vm.id,
                first_date: angular.copy(vm.operator_name),
                format: angular.copy(vm.form_prefix),
                checklist: vm.visit_forms.map(function (vf) {
                    return {
                        id: angular.copy(vf.id),
                        text: angular.copy(vf.key),
                        value: vf.value ? (angular.isArray(vf.value) ? angular.copy(vf.value) : angular.copy(vf.value.split('-'))) : [],
                        description: angular.copy(vf.description),
                        checked: true
                    };
                })
            };
            if (vm.visit_type === 2) {
                model_.type = 2;
                $scope.visit.is_have_component = true;
                $scope.visit.components.push(angular.copy(model_));
            } else if (vm.visit_type === 1) {
                model_.type = 1;
                $scope.visit.is_have_ward = true;
                $scope.visit.wards.push(angular.copy(model_));
            } else {

                $scope.visit.simple.periods = angular.copy(vm.period);
                $scope.visit.simple.id = angular.copy(vm.id);
                $scope.visit.simple.repetitions = angular.copy(vm.recurring).toString();
                $scope.visit.simple.name = angular.copy(vm.title);
                $scope.visit.simple.checklist = vm.visit_forms.map(function (vf) {
                    return {
                        id: angular.copy(vf.id),
                        text: angular.copy(vf.key),
                        value: vf.value ? (angular.isArray(vf.value) ? angular.copy(vf.value) : angular.copy(vf.value.split('-'))) : [],
                        description: angular.copy(vf.description),
                        checked: true
                    };
                });
                $scope.visit.selected_checklist = $scope.visit.simple;
                $scope.visit.selected_checklist.format = angular.copy(vm.form_prefix);
                $scope.visit.selected_checklist.first_date = angular.copy(vm.operator_name);

            }
            if (!$scope.visit.simple.repetitions.length) {
                $scope.visit.selected_checklist = null;
            }
        });

    };
    $scope.edit_visit = function (row) {
        console.log(row);
        $scope.visits._index = $scope.visits.indexOf(row);
        $scope.visit.name = angular.copy(row.title);
        $scope.visit.type_file = angular.copy(row.visit_type);
        $scope.visit.file_name = angular.copy(row.file_name);
        $scope.visit.periods = angular.copy(row.period);
        $scope.visit.id = angular.copy(row.id);
        $scope.config_set = !$scope.config_set;
    };
    $scope.delete_system_visit = function (row) {
        $scope.question(' آیا از حذف بازدید ' +
            row.title +
            ' مطمئن هستید؟', 'حذف بازدید از ' + row.title);
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/visit/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('حذف بازدید ' +
                            row.title +
                            ' با موفقیت انجام شد.',
                            'حذف بازدید از ' + row.title);
                        if (row.has_form_pic) {
                            $scope.visits.splice($scope.visits.indexOf(row), 1);
                        } else {
                            $scope.system_visits.splice($scope.system_visits.indexOf(row), 1);
                        }
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.sort_system_checklists = function (search_periods, active_view) {
        switch (search_periods) {
            case 'روزانه':
                if (active_view) {
                    $scope.get_system_visits('روزانه');
                } else {
                    $scope.get_visits('روزانه');
                }

                break;
            case 'هفتگی':
                if (active_view) {
                    $scope.get_system_visits('هفتگی');
                } else {
                    $scope.get_visits('هفتگی');
                }
                break;
            case 'ماهانه':
                if (active_view) {
                    $scope.get_system_visits('ماهانه');
                } else {
                    $scope.get_visits('ماهانه');
                }
                break;
            case 'all':
                if (active_view) {
                    $scope.get_system_visits();
                } else {
                    $scope.get_visits();
                }
                break;
        }
    };
    $scope.completing_checklist = function (row, visit) {

        $scope.current_visit_model = row;
        $scope.current_visit_ = visit;

        $scope.setCookie('current_visit_model', row);
        $scope.setCookie('current_visit_', visit);
        $scope.get_form_valus();
        switch (row.period) {
            case 'روزانه':
                $state.go('Periodic_visits_to_the_building.completing_daily');
                break;
            case 'هفتگی':
                $state.go('Periodic_visits_to_the_building.completing_weekly');
                break;
            case 'ماهانه':
                $state.go('Periodic_visits_to_the_building.completing_monthly');
                break;
        }

    };
    $scope.open_compliting_visit_modal = function (data) {
        $scope.selected_Date_id = 0;
        var l = $scope.current_visit_model.visit_forms.length;
        $scope.current_visit_model.visit_forms.map(function (itm, i) {
            itm.values_array = $scope.new_Array($scope.current_visit_model.recurring, {
                value: '',
                id: null,
                description: ''
            });
            if (data && data.length) {

                /*$scope.dates_array[]*/
                /*for(var z=0;z<$scope.current_visit_model.recurring;z++){
                    for(var x=i;x<$scope.total_check_list;x+=l){
                        if(data[x] && z*i===x){
                            itm.values_array[z]=data[x];
                        }
                    }
                }*/
                itm.values_array = itm.values_array.map(function (val_arr, j) {
                    return data[j * l + i] ? data[j * l + i] : {value: '', id: null, description: ''};
                });
            }
            itm.values_array.map(function (v, z) {
                    v.__id = angular.copy($scope.dates_array[z].__id);
                }
            )
        });
        /*if(data && data.length) {
            for (var i = 0; i< $scope.total_check_list; i++) {
                for (var j = 0; j < l; j++) {
                    $scope.current_visit_model.visit_forms[j].values_array[i/$scope.current_visit_model.recurring]=data[i];
                }
            }
        }*/

        $scope.compliting_visit_modal = $scope.open_modal('lg', 'compliting_visit_modal.html', 'system_visit_modal_Ctrl', {
            detail: function () {
                return data;
            }
        }, 'blue_modal full_width', $scope, true);
        $scope.compliting_visit_modal.result.then(function (r) {
            if (r) {
                $scope.get_form_valus();
            }
        });
    };
    $scope.complate_daily = function (date, data) {
        var date_ = $scope.get_miladi_date(date.year + '/' + date.month + '/' + date.day);
        $scope.current_day = $scope.get_date(date_, 'full_date');
        var current_day_ = $scope.get_date(date_);

        $scope.dates_array = [];
        for (var i = 0; i < $scope.current_visit_model.recurring; i++) {
            $scope.dates_array.push(angular.copy({
                date: angular.copy(current_day_),
                time: '',
                passed: false,
                __id: Math.random(1000, 9999)
            }))
        }

        if (data[date.day] && data[date.day].length) {
            data[date.day] = $filter('orderObjectBy')(data[date.day], 'date');
            var j = 0;
            for (var i = 0; i < data[date.day].length; i += parseInt($scope.current_visit_model.visit_forms.length)) {
                console.log(data[date.day], date, i)
                $scope.dates_array[j].time = data[date.day][i] ? data[date.day][i].date : '';
                $scope.dates_array[j].passed = data[date.day][i] !== null;
                $scope.dates_array[j].operator = data[date.day][i] ? data[date.day][i].operator : '';
                $scope.dates_array[j].device = data[date.day][i] ? data[date.day][i].device : '';
                j++;
            }
        }

        $scope.open_compliting_visit_modal(data[date.day]);

    };
    $scope.complate_monthly = function (date, data) {
        var date_ = $scope.get_miladi_date(date.year + '/' + date.month + '/' + date.day);
        $scope.current_day = $scope.get_date(date_, 'full_date');
        var current_day_ = $scope.get_date(date_);

        $scope.dates_array = [];
        for (var i = 0; i < $scope.current_visit_model.recurring; i++) {
            $scope.dates_array.push(angular.copy({
                date: '',
                time: '00:00',
                passed: false,
                __id: Math.random(1000, 9999)
            }))
        }

        var arr = [];
        var j = 0;
        for (var k = 1; k <= moment.jDaysInMonth(date.year, date.month - 1); k++) {
            if (data[k] && data[k].length) {
                data[k] = $filter('orderObjectBy')(data[k], 'date');
                for (var i = 0; i < data[k].length; i += parseInt($scope.current_visit_model.visit_forms.length)) {
                    $scope.dates_array[j].date = data[k][i] ? $scope.get_date(data[k][i].date) : '';
                    $scope.dates_array[j].operator = data[k][i] ? data[k][i].operator : '';
                    $scope.dates_array[j].passed = data[k][i] !== null;
                    arr = [].concat(arr, data[k]);
                    j++;
                }
            }
        }
        var checked_in_this_month = $scope.dates_array.filter(function (itm) {
            if (moment(itm.date, 'jYYYY/jM/jD').isSame(moment(current_day_, 'jYYYY/jM/jD'))) {
                return itm;
            }
        });
        if (!checked_in_this_month.length && j < $scope.current_visit_model.recurring) {
            $scope.dates_array[j].date = current_day_;
            $scope.dates_array[j].passed = false;
        }
        $scope.open_compliting_visit_modal(arr);

    };
    $scope.complate_weekly = function (date, data, index) {
        $scope.current_day = date.format('jYYYY/jM/jD');
        $scope.dates_array = [];
        for (var i = 0; i < $scope.current_visit_model.recurring; i++) {
            $scope.dates_array.push(angular.copy({
                date: '',
                time: '00:00',
                passed: false,
                __id: Math.random(1000, 9999)
            }))
        }

        var j = 0;
        var arr = [];
        for (var k = 0; k < 7; k++) {
            if (data[k] && data[k].length) {
                data[k] = $filter('orderObjectBy')(data[k], 'date')
                for (var i = 0; i < data[k].length; i += parseInt($scope.current_visit_model.visit_forms.length)) {
                    $scope.dates_array[j].date = data[k][i] ? $scope.get_date(data[k][i].date) : '';
                    $scope.dates_array[j].operator = data[k][i] ? data[k][i].operator : '';
                    $scope.dates_array[j].passed = data[k][i] !== null;
                    arr = [].concat(arr, data[k]);
                    j++;
                }
            }
        }

        var checked_in_this_week = $scope.dates_array.filter(function (itm) {
            if (moment(itm.date, 'jYYYY/jM/jD').isSame(moment($scope.current_day, 'jYYYY/jM/jD'))) {
                return itm;
            }
        });
        if (!checked_in_this_week.length && j < $scope.current_visit_model.recurring) {
            $scope.dates_array[j].date = $scope.current_day;
            $scope.dates_array[j].passed = false;
        }


        $scope.open_compliting_visit_modal(arr);
    };
    $scope.show_chart = function (type) {
        if (type === 'visits') {
            factory1.getUserApi('/v1/user/hospital/visits_with_file').then(function (data) {
                $scope.open_modal('lg', 'chart_visit_modal.html', 'system_visit_modal_Ctrl', {
                    detail: function () {
                        return data;
                    }
                }, 'blue_modal', $scope, false);
            });
        } else {
            factory1.getUserApi('/v1/user/hospital/visits').then(function (data) {
                $scope.open_modal('lg', 'chart_visit_modal.html', 'system_visit_modal_Ctrl', {
                    detail: function () {
                        return data;
                    }
                }, 'blue_modal', $scope, false);
            });
        }

    };
    $scope.get_padding_top = function (i) {
        if (i) {
            if (typeof i !== "number") {
                i = parseInt(i);
            }
            var plus = 2.5;
            if (i % 2 === 0) {
                plus = 5 * (i / 2);
            } else {
                plus = i === 1 ? plus : plus * (i - 1);
            }
            return (50 * (i - 1)) + plus;
        } else {
            return 2;
        }

    };
    $scope.get_height = function (i) {
        if (i) {
            if (typeof i !== "number") {
                i = parseInt(i);
            }
            return i * 102;
        } else {
            return 102;
        }
    };
    $scope.get_visits = function (priod) {
        factory1.getUserApi('/v1/user/hospital/visits_with_file', priod ? '&period=' + priod : '').then(function (data) {
            $scope.visits = data;
        });
    };
    $scope.get_system_visits = function (priod) {
        var q = priod ? '&period=' + priod : '';
        q += '&certificate=';
        factory1.getUserApi('/v1/user/hospital/visits', q).then(function (data) {
            $scope.system_visits = data;
        });
    };
    $scope.get_form_valus = function () {
        $scope.total_check_list = $scope.current_visit_model.recurring * $scope.current_visit_model.visit_forms.length;
        factory1.getUserApi('/v1/user/hospital/visit/get_pretty', '&id=' + $scope.current_visit_model.id).then(function (data) {
            $scope.form_values = data;
            if ($scope.current_visit_model.period !== 'هفتگی') {
                set_days_of_month();
            } else {
                $scope.weekly = $scope.new_Array(52, {data: []});
                $scope.weekly.map(function (week, i) {
                    week.days = [];
                    week.data = [];
                    var date = moment().hour(0).minute(0).day("Saturday").jYear($rootScope.year).jWeek(i);

                    /*var y=moment().jYear($rootScope.year).jWeek(i).jYear();
                    var m=parseInt(moment().jYear($rootScope.year).jWeek(i).jMonth())+1;*/
                    for (var x = 0; x < 7; x++) {
                        /*var z=moment(moment(date).add(x,'days'));
                       week.days[x]=moment(z.year()+'-'+z.month()+'-'+z.date(),'YYYY-MM-DD');*/
                        week.days[x] = moment(moment(date).add(x, 'days'));
                        week.days[x].className = false;
                    }
                    week.data = $scope.has_checklists(week.data, 0, 0, 0, week.days);
                });

            }
        });
    };
    $scope.showMore = function (row, type, index) {
        $scope.selected_profile = angular.copy(row);
        $scope.selected_profile.type = type;
        $scope.save_profile_more = function () {
            delete  $scope.selected_profile.type;
            $scope.data_recordes[index] = angular.copy($scope.selected_profile);
            $scope.close_modal();
        }
        $scope.open_modal('lg', 'showMore.html', null, null, 'blue_modal', $scope)
    }
    $scope.save_visit_profile = function (row, index) {
        var params = angular.copy(row);
        if (params.attachments) {
            params.attachments = params.attachments.map(function (a) {
                if (a.file) {
                    a.file = angular.isString(a.file) ? a.file : '';
                }
                return a;
            })
        }
        factory1.postUserApi('/v1/user/hospital/visit_profile', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.');
            $scope.data_recordes[index] = data;

        })

    }
    $scope.showRecordCard = function (row) {
        $scope.selected_profile = angular.copy(row);
        if (!row.record_cards) {
            $scope.selected_profile.record_cards = [];
        }
        $scope.open_modal('lg', 'recordCard.html', null, null, 'blue_modal full_width', $scope, true);
    }
    $scope.add_to_record_cards = function () {
        $scope.selected_profile.record_cards.push(angular.copy(record_card_instanc));
    }
    $scope.save_record_card = function (row) {
        if (!row.visit_profile_id) {
            row.visit_profile_id = $scope.selected_profile.id;
        }

        factory1.postUserApi('/v1/user/hospital/visit_profile/record_card', JSON.stringify(row)).then(function (data) {
            if (row.id) {
                deleteRecordCard(row.id).then(function () {

                });
            }
            var index = $scope.data_recordes.findIndex(function (item) {
                return item.id === $scope.selected_profile.id;
            })
            $scope.selected_profile.record_cards[$scope.selected_profile.record_cards.indexOf(row)] = data;
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.');
            $scope.data_recordes[index].record_cards = $scope.selected_profile.record_cards;
        })
    }
    $scope.delete_record_card = function (row) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                var index = $scope.data_recordes.findIndex(function (item) {
                    return item.id === $scope.selected_profile.id;
                })
                var rIndex = $scope.selected_profile.record_cards.indexOf(row);

                if (row.id) {
                    deleteRecordCard(row.id).then(function () {
                        $scope.selected_profile.record_cards.splice(rIndex, 1);
                        $scope.data_recordes[index].record_cards = $scope.selected_profile.record_cards;
                    });
                } else {
                    $scope.selected_profile.record_cards.splice(rIndex, 1);
                    $scope.data_recordes[index].record_cards = $scope.selected_profile.record_cards;
                }
            }
        });
    }
    $scope.add_to_data_recordes = function () {
        if (!$scope.data_recordes.length || $scope.data_recordes.every(function (value) {
            return value.id
        })) {
            $scope.data_recordes.push(angular.copy(model_1_instance));
        } else {
            $scope.warning('لطفاً ابتدا رکورد جدید را ثبت نمایید.')
        }

    }
    $scope.deleteData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if (row.id) {
                    factory1.deleteUserApi('/v1/user/hospital/visit_profile/' + row.id).then(function () {
                        $scope.data_recordes.splice(index, 1);
                    })
                } else {
                    $scope.data_recordes.splice(index, 1);
                }

            }
        });
    }
    $scope.selectDate = function (row) {
        console.log(row)
        $scope.selected_Date_id = 0;
        $timeout(function () {
            $scope.selected_Date_id = angular.copy(row.__id);
        }, 100)

    }
    $scope.has_view = function (data, date) {
        return has_visit(data, $scope.get_miladi_date(date));
    };
    $scope.set_view = function (year, month, day, data, event) {

        console.log(data)
        $scope.selected_date = {
            data: data || []
        }
        $scope.send_invitation = false;
        $scope.viewDetail = {};
        $scope.visit_mialdi_date = $scope.get_miladi_date(year + '/' + month + '/' + day, '00:00:00');
        $scope.viewDetail.year = year;
        $scope.viewDetail.month = month;
        $scope.viewDetail.day = day;
        if (data.length) {
            var first_color = angular.element(event.currentTarget).css('background-color');
            $scope.first_color = first_color !== 'rgba(0, 0, 0, 0)' ? first_color : angular.element(event.currentTarget).parent().parent().css('color');

            $scope.thisDayVisits = angular.copy(data);
            $scope.open_modal('lg', 'choose_or_new.html', null, null, 'blue_modal', $scope, true);

        } else {

            $scope.res = $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal full_width', $scope, true);
        }

    };
    $scope.new_visit = function () {
        $scope.close_modal();
        $scope.res = $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal full_width', $scope, true);
    };
    $scope.deleteCalenderData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if (row.id) {
                    factory1.deleteUserApi('/v1/user/hospital/visit_calendar/' + row.id)
                        .then(function (data) {
                            $scope.selected_date.data.splice(index, 1)
                        });
                } else {

                    $scope.selected_date.data.splice(index, 1)
                }

            }
        })
    }
    $scope.add_to_selected_date_data = function () {
        if (!$scope.selected_date.data) {
            $scope.selected_date.data = [];
        }
        $scope.selected_date.data.push({
            visit_type: '',
            category: '',
            device_name: '',
            operator: '',
            year: $rootScope.year,
            date: angular.copy($scope.visit_mialdi_date)
        })
    }
    $scope.submit_viewDetail = function () {
        if ($scope.selected_date.data && $scope.selected_date.data.length) {
            factory1.postUserApi('/v1/user/hospital/visit_calendar', JSON.stringify({visit_calendars: $scope.selected_date.data})).then(function (data) {
                set_days_of_events();
                $scope.close_modal();
                $scope.success_alert("اطلاعات با موفقیت ثبت شد.")
            })
        } else {
            $scope.warning('لطفاً اطلاعات بازدید را وارد کنید.')
        }

    }
    $scope.add_to_selected_profile_electro_motors = function () {
        if (!$scope.selected_profile.electro_motors) {
            $scope.selected_profile.electro_motors = [];
        }
        $scope.selected_profile.electro_motors.push(angular.copy(electro_motors_instance));
    }
    $scope.delete_profile_electro_motors = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {

                $scope.selected_profile.electro_motors.splice(index, 1)
            }
        });
    }
    $scope.delete_attachments = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if (row.id) {
                    factory1.deleteUserApi('/v1/user/hospital/visit_profile/attachment/' + row.id)
                        .then(function (data) {
                            $scope.selected_profile.attachments.splice(index, 1)
                        });
                } else {

                    $scope.selected_profile.attachments.splice(index, 1)
                }
            }
        });
    }
    $scope.add_to_selected_profile_attachments = function () {
        if (!$scope.selected_profile.attachments) {
            $scope.selected_profile.attachments = [];
        }
        $scope.selected_profile.attachments.push(angular.copy(attachments_instance));
    }
    $scope.upload__file = function (row, index) {
        var types = {
            voice: ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg'],
            image: ['image/png', 'image/jpeg', 'image/jpg'],
            video: ['video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp'],
            text: ['application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            getType: function (type) {
                var self = this;
                return Object.keys(self).find(function (key) {
                    return self.hasOwnProperty(key) && self[key].indexOf(type) >= 0;
                })
            }
        }
        var t = Object.keys(types).reduce(function (arr, key) {
            return arr.concat(Array.isArray(types[key]) ? types[key] : []);
        }, []);
        /*   console.log(t);*/
        factory1.upload_file($scope, row._file, 20000000, t, false, false).then(function (data) {
            /*    console.log($scope.session._file,data)*/
            row.file = angular.copy(data);
            $scope.selected_profile.attachments[index] = angular.copy(row);
        });
    };
    $scope.nextProfiles = function () {
        $scope.perofilePage++;
        getData($scope.perofilePage);
    }
    $scope.preProfiles = function () {
        if ($scope.perofilePage) {
            $scope.perofilePage--;
            getData($scope.perofilePage);
        }

    }

    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.is_parent = $state.$current.self.name === "Periodic_visits_to_the_building";
        if ($scope.is_parent) {
            $scope.get_visits($scope.search.periods1 !== 'all' ? $scope.search.periods1 : null);
            $scope.get_system_visits($scope.search.periods2 !== 'all' ? $scope.search.periods2 : null);
        }

    });
    set_days_of_events();
    $scope.is_parent = $state.$current.self.name === "Periodic_visits_to_the_building";
    if ($scope.is_parent) {
        $scope.get_visits();
        $scope.get_system_visits();
    } else {
        $scope.current_visit_model = $scope.getCookie('current_visit_model');
        $scope.current_visit_ = $scope.getCookie('current_visit_');
        console.log($scope.current_visit_, $scope.current_visit_model);
        if (!$scope.current_visit_model) {
            window.history.back();
        }

        $scope.get_form_valus();
    }
    getDevices();
    getData(1);
});

app.controller('system_visit_modal_Ctrl', function ($scope, factory1, localStorageService, $http, Server_URL, BASE, $uibModalInstance, detail, queryHeaders) {

    $scope.detail = angular.copy(detail);


    if (angular.isArray($scope.detail)) {
        $scope.periodic_chart = {
            labels_chart: ['بازدید های روزانه', 'بازدید های هفتگی', 'بازدید های ماهانه'],
            /*series:['انجام نشده','منتفی شده','دردست اقدام','تکمیل شده'],*/
            colors_chart: ['#355da2', '#05bcfe', '#7937aa'],
            data_chart: [0, 0, 0],
            data_set: [{
                borderWidth: 0,
                backgroundColor: '#355da2'
            }, {
                borderWidth: 0,
                backgroundColor: '#05bcfe'
            }, {
                borderWidth: 0,
                backgroundColor: '#7937aa'
            }],
            options: {
                layout: {
                    padding: {
                        left: 40,
                        right: 40,
                        top: 10,
                        bottom: 10
                    }
                },
                tooltips: {
                    titleFontSize: 14,
                    bodyFontSize: 15
                },
                scaleShowGridLines: false,
                elements: {line: {tension: 0, fill: false}}, scales: {
                    xAxes: [{

                        ticks: {
                            fontSize: 10,
                            beginAtZero: false
                        },
                        /*  scaleLabel: {
                            display: true,
                            labelString: 'ماه',
                            fontSize: 11
                        }*/
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: 9,
                            suggestedMin: 100,
                            min: 0,
                            beginAtZero: false,
                            maxTicksLimit: 15
                        },
                        /* scaleLabel: {
                            display: true,
                            labelString: 'درصد',
                            fontSize: 11
                        }*/
                    }]

                }
            }
        };
        $scope.pie_chart = {
            labels_chart: ['بازدید از محل', 'بازدید از دستگاه'],
            colors_chart: ['#528034', '#bd8d00'],
            data_chart: [0, 0],
            options: {
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                },
                tooltips: {
                    titleFontSize: 14,
                    bodyFontSize: 15
                },
                scaleShowGridLines: false
            }
        };
        $scope.detail.forEach(function (itm) {
            if (itm.visit_type === 'بازدید محل') {
                $scope.pie_chart.data_chart[0]++;

            } else {
                $scope.pie_chart.data_chart[1]++;
            }
            if (itm.visit_model) {
                itm.visit_model.forEach(function (v) {
                    if (v.period === 'روزانه') {
                        $scope.periodic_chart.data_chart[0]++;
                    } else if (v.period === 'هفتگی') {
                        $scope.periodic_chart.data_chart[1]++;
                    } else if (v.period === 'ماهانه') {
                        $scope.periodic_chart.data_chart[2]++;
                    }
                });
            } else {

                if (itm.period === 'روزانه') {
                    $scope.periodic_chart.data_chart[0]++;
                } else if (itm.period === 'هفتگی') {
                    $scope.periodic_chart.data_chart[1]++;
                } else if (itm.period === 'ماهانه') {
                    $scope.periodic_chart.data_chart[2]++;
                }

            }

        });
    }
    $scope.save_complate = function () {
        var err_date = [];
        var err_value = [];
        var vf = angular.copy($scope.current_visit_model).visit_forms.map(function (form) {
            return {
                id: form.id,
                description: form.description,
                form_value: form.values_array.map(function (itm, index) {

                    if ($scope.dates_array[index].date && $scope.dates_array[index].time.toString().length) {
                        if (itm.value !== null && itm.value !== undefined) {
                            var time = $scope.dates_array[index].time !== '00:00' ? moment($scope.dates_array[index].time).format('HH:mm') : '00:00';
                            itm.date = angular.copy($scope.get_miladi_date($scope.dates_array[index].date, time));
                            itm.operator = angular.copy($scope.dates_array[index].operator);
                            itm.device = angular.copy($scope.dates_array[index].device);
                            return itm;
                        } else {
                            err_value.push(index);
                        }

                    } else {
                        if (itm.value !== null && itm.value !== undefined) {
                            err_date.push(index);
                        }
                    }
                })
            }
        });
        if (err_date.length) {
            $scope.warning('لطفاً زمان بازدید را مشخص نمایید.');
            return false;
        }
        if (err_value.length) {
            $scope.warning('لطفاً مقادیر بازدید را مشخص نمایید.');
            return false;
        }
        var parameter = JSON.stringify({

            visit_form: vf
        });
        var MyToken = localStorageService.get('user_token');
        $scope.queryHeaders = queryHeaders;
        $scope.queryHeaders.Authorization = MyToken;
        $http.put(Server_URL + '/v1/user/hospital/visit', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {

                $scope.success_alert('اطلاعات چک لیست با موفقیت به ثبت شد.', 'ثبت چک لیست');
                $uibModalInstance.close(data);
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('simulated_exercises_ctrl', function ($scope, factory1, localStorageService, $http, Server_URL, BASE, $rootScope) {

    $scope.config = {
        type: 'all',
        subject: '',
        /*number:' ۱۸/ص/۱۳۲۲۴۳',*/
        audio_file: '',
        image_file: '',
        video_file: ''
    };
    $scope.index = null;
    $scope.report = {
        description: ''
    };
    $scope.editable = false;
    $scope.simulated_exercises = [];
    $scope.documents = [];
    $scope.positive_points = [];
    $scope.negative_points = [];
    $scope.responsible = [];
    $scope.positive_points_index = -1;
    $scope.negative_points_index = -1;
    $scope.positive_points_copy = null;
    $scope.negative_points_copy = null;
    $scope.add_config = function () {
        if ($scope.config.subject.length < 2) {
            $scope.warning('لطفاً موضوع تمرین را مشخص کنید.');
            return false;
        } else {
            var cat = $scope.config.type === 'عملیاتی' ? 1 : ($scope.config.type === 'دور میزی' ? 2 : ($scope.config.type === 'safety_assessment_instruments' ? 3 : 123));
            var parameter = JSON.stringify({
                safty_category: cat,
                subject: $scope.config.subject,
                year: $rootScope.year
                /* drile_number:$scope.config.number*/
            });
            $http.post(Server_URL + '/v1/user/hospital/drile/submit', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.config.subject = '';
                    $scope.config.type = 'all';
                    $scope.simulated_exercises.push(data);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        }

    };
    $scope.edit_config = function (row) {
        $scope.config.type = row.safty_category === 123 ? 'all' : (row.safty_category === 1 ? 'عملیاتی' : (row.safty_category === 2 ? 'دور میزی' : 'safety_assessment_instruments'));
        $scope.config.subject = row.subject;
        $scope.editable = row;
        $scope.simulated_exercises[$scope.simulated_exercises.indexOf(row)].editable = true;
    };
    $scope.update = function () {
        if ($scope.config.subject.length < 2) {
            $scope.warning('لطفاً موضوع تمرین را مشخص کنید.');
            return false;
        } else {
            var cat = $scope.config.type === 'عملیاتی' ? 1 : ($scope.config.type === 'دور میزی' ? 2 : ($scope.config.type === 'safety_assessment_instruments' ? 3 : 123));
            var parameter = JSON.stringify({
                safty_category: cat,
                subject: $scope.config.subject,
                id: $scope.editable.id
            });
            $http.put(Server_URL + '/v1/user/hospital/drile/explanation', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.simulated_exercises[$scope.simulated_exercises.indexOf($scope.editable)] = data;
                    $scope.config.subject = '';
                    $scope.config.type = 'all';
                    $scope.editable = false;
                    $scope.success_alert('شرح تمرین با موفقیت ثبت شد.', 'به روزرسانی تمرین');
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        }
    };
    $scope.delete_config = function (row) {
        $scope.question('آیا از حذف تمرین مورد نظر مطمئن هستید؟', 'حذف تمرین شبیه سازی شده');
        $scope.q_result.result.then(function (r) {

            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/drile/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        var index = $scope.simulated_exercises.indexOf(row);
                        $scope.simulated_exercises.splice(index, 1);
                        $scope.success_alert('تمرین مورد نظر با موفقیت حذف شد.', 'حذف تمرین شبیه سازی شده');

                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.cancel = function () {
        $scope.config.subject = '';
        $scope.config.type = 'all';
        $scope.simulated_exercises[$scope.simulated_exercises.indexOf($scope.editable)].editable = false;
        $scope.editable = false;
    };
    $scope.description_of_practice = function (row) {
        console.log(row);
        $scope.detail = angular.copy(row);
        $scope.index = $scope.simulated_exercises.indexOf(row);
        $scope.detail.submit_at = $scope.get_date(row.submit_at);
        $scope.detail.created_at = $scope.get_date(row.created_at);
        $scope.detail.start_time = $scope.detail.start_time ? moment.parseZone($scope.detail.start_time).format('l LT') : '';
        $scope.detail.end_time = $scope.detail.end_time ? moment.parseZone($scope.detail.end_time).format('l LT') : '';
        $scope.uibModalInstance = $scope.open_modal('lg', 'description_of_practice_modal.html', null, null, 'blue_modal', $scope, true);

    };
    $scope.maneuver_report = function (row) {
        console.log(row);
        $scope.positive_points_index = -1;
        $scope.negative_points_index = -1;
        $scope.detail = row;
        $scope.index = $scope.simulated_exercises.indexOf(row);
        $scope.documents = [];
        $scope.positive_points = [];
        $scope.negative_points = [];
        $scope.responsible = [];
        $scope.report.description = '';
        $scope.diff_minuts = parseInt($scope.get_time($scope.detail.end_time).substring(3, 5)) - parseInt($scope.get_time($scope.detail.start_time).substring(3, 5));
        $scope.diff_minuts = $scope.diff_minuts > 9 ? $scope.diff_minuts : '0' + $scope.diff_minuts;
        $scope.diff_hours = parseInt($scope.get_time($scope.detail.end_time).substring(0, 2)) - parseInt($scope.get_time($scope.detail.start_time).substring(0, 2));
        $scope.diff_hours = $scope.diff_hours > 9 ? $scope.diff_hours : '0' + $scope.diff_hours;
        factory1.getUserApi('/v1/user/hospital/drile', '&id=' + row.id).then(function (data) {
            console.log(data);
            if (data[0].report) {
                $scope.report = data[0].report;
                data[0].report.strengths = data[0].report.strengths ? data[0].report.strengths.substring(0, data[0].report.strengths.length - 1) : '';
                if (data[0].report.strengths.length) {
                    var arr = $scope.to_array([], data[0].report.strengths, '-');
                    $scope.positive_points = arr.map(function (itm) {
                        if (itm.length) {
                            return {description: itm};
                        }
                    });
                }

                console.log($scope.positive_points);
                $scope.negative_points = data[0].weak_points;
                $scope.documents = data[0].attachment;
            }

            $scope.uibModalInstance = $scope.open_modal('lg', 'maneuver_report_modal.html', null, null, 'blue_modal full_width', $scope, true);
        });


    };

    $scope.edit_positive_points = function (row) {
        $scope.positive_points_index = $scope.positive_points.indexOf(row);
        $scope.positive_points_copy = angular.copy(row);
        row.editable = true;
    };
    $scope.delete_positive_points = function (row) {
        $scope.question('آیا از حذف نقطه قوت مورد نظر مطمئن هستید؟', 'حذف ');
        $scope.q_result.result.then(function (r) {

            if (r) {
                $scope.positive_points.splice($scope.positive_points.indexOf(row), 1);
            }
        });
    };
    $scope.update_positive_points = function (row) {
        row.editable = false;
        $scope.positive_points_copy = null;
    };
    $scope.cancel_edit_positive_points = function (row) {
        if ($scope.positive_points_copy) {
            $scope.positive_points[$scope.positive_points_index] = angular.copy($scope.positive_points_copy);
            $scope.positive_points_copy = null;
        }

        row.editable = false;

    };

    $scope.edit_negative_points = function (row) {
        $scope.negative_points_index = $scope.negative_points.indexOf(row);
        $scope.negative_points_copy = angular.copy(row);
        row.editable = true;
    };
    $scope.delete_negative_points = function (row) {
        $scope.question('آیا از حذف نقطه ضعف مورد نظر مطمئن هستید؟', 'حذف ');
        $scope.q_result.result.then(function (r) {

            if (r) {
                $scope.negative_points.splice($scope.negative_points.indexOf(row), 1);
            }
        });
    };
    $scope.update_negative_points = function (row) {
        row.editable = false;
        $scope.negative_points_copy = null;
    };
    $scope.cancel_edit_negative_points = function (row) {
        if ($scope.negative_points_copy) {
            $scope.negative_points[$scope.negative_points_index] = angular.copy($scope.negative_points_copy);
            $scope.negative_points_copy = null;
        }

        row.editable = false;

    };

    $scope.corrective_action = function (row) {
        $scope.detail = row;
        $scope.documents = [];
        $scope.positive_points = [];
        $scope.negative_points = [];
        $scope.responsible = [];
        $scope.report.description = '';
        factory1.getUserApi('/v1/user/hospital/drile', '&id=' + row.id).then(function (data) {

            if (data[0].report) {
                $scope.report = data[0].report;
                $scope.negative_points = data[0].weak_points;
            }
            $scope.uibModalInstance = $scope.open_modal('lg', 'Corrective_action.html', null, null, 'blue_modal', $scope, true);
        });
    };
    $scope.upload_audio_file = function () {
        factory1.upload_file($scope, $scope.config.audio_file, 50000000, ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg'], false, false).then(function (data) {

            $scope.documents.push({
                file_type: 'voice',
                name: $scope.config.audio_file.filename,
                created_at: $scope.get_miladi_date(),
                description: '',
                b64: data
            })
        });
    };
    $scope.upload_image_file = function () {
        factory1.upload_file($scope, $scope.config.image_file, 20000000, ['image/png', 'image/jpeg', 'image/jpg'], false, false).then(function (data) {

            $scope.documents.push({
                file_type: 'image',
                name: $scope.config.image_file.filename,
                created_at: $scope.get_miladi_date(),
                description: '',
                b64: data
            })
        });
    };
    $scope.upload_video_file = function () {
        factory1.upload_file($scope, $scope.config.video_file, 100000000, ['video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp'], false, false).then(function (data) {

            $scope.documents.push({
                file_type: 'video',
                name: $scope.config.video_file.filename,
                created_at: $scope.get_miladi_date(),
                description: '',
                b64: data
            })
        });
    };
    $scope.upload_text_file = function () {
        factory1.upload_file($scope, $scope.config.text_file, 10000000, ['application/pdf', 'application/msword', 'application/docx'], false, false).then(function (data) {

            $scope.documents.push({
                file_type: 'video',
                name: $scope.config.text_file.filename,
                created_at: $scope.get_miladi_date(),
                description: '',
                b64: data
            })
        });
    };
    $scope.choose_partners = function (partners) {
        console.log(partners);
        var arr = [];
        arr = angular.copy($scope.users);

        if (partners) {
            if (partners.length) {

                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        partners.forEach(function (p) {
                            if (obj.id == p.id || obj.id == p) {

                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
        } else {
            if ($scope.responsible.length) {

                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        $scope.responsible.forEach(function (p) {
                            if (obj.id === p.id) {

                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
        }

        $scope.result_users = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        $scope.result_users.result.then(function (r) {
            if (r) {

                if (partners) {
                    $scope.detail.partners = r;
                    console.log($scope.detail.partners);
                } else {
                    $scope.responsible = r;
                }
            }
        });
    };
    $scope.get_partners = function (users) {
        var arr = [];
        if (users.length) {
            users.forEach(function (itm) {
                if (itm.id) {
                    arr.push(itm.id);
                } else {
                    arr.push(itm);
                }
            });
        }
        return arr;
    };
    $scope.save_summary = function () {
        if (!$scope.detail.location || $scope.detail.location.length < 2) {
            $scope.warning('لطفاً مکان برگزاری تمرین را مشخص کنید.');
            return false;
        } else if (!$scope.detail.created_at || $scope.detail.created_at.length < 2) {
            $scope.warning('لطفاً تاریخ تنظیم تمرین را مشخص کنید.');
            return false;
        } else if (!$scope.detail.submit_at || $scope.detail.submit_at.length < 2) {
            $scope.warning('لطفاً تاریخ انجام تمرین را مشخص کنید.');
            return false;
        } else if ($scope.detail.start_time.length < 2) {
            $scope.warning('لطفاً زمان شروع تمرین را مشخص کنید.');
            return false;
        } else if ($scope.detail.end_time.length < 2) {
            $scope.warning('لطفاً زمان اتمام تمرین را مشخص کنید.');
            return false;
        } else if (!$scope.detail.summary || $scope.detail.summary.length < 2) {
            $scope.warning('لطفاً عنوان تمرین را مشخص کنید.');
            return false;
        } else if ($scope.detail.partners == null || $scope.detail.partners.length === 0) {
            $scope.warning('لطفاً اعضای حاضر در تمرین را مشخص کنید.');
            return false;
        } else {
            var s = $scope.detail.start_time.toString();
            s = s.substring(16, 21);
            var e = $scope.detail.end_time.toString();
            e = e.substring(16, 21);
            var parameter = JSON.stringify({
                id: $scope.detail.id,
                submit_at: $scope.get_miladi_date($scope.detail.submit_at),
                created_at: $scope.get_miladi_date($scope.detail.created_at),
                start_time: $scope.get_miladi_date($scope.detail.submit_at, s),
                end_time: $scope.get_miladi_date($scope.detail.submit_at, e),
                cause: $scope.detail.cause,
                summary: $scope.detail.summary,
                description: $scope.detail.description,
                partners: $scope.get_partners($scope.detail.partners),
                location: $scope.detail.location,
                year: $rootScope.year

            });
            $http.put(Server_URL + '/v1/user/hospital/drile/explanation', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {

                    $scope.simulated_exercises[$scope.index] = data;
                    $scope.success_alert('شرح تمرین با موفقیت ثبت شد.', 'ثبت شرح تمرین');
                    setTimeout(function () {
                        $scope.close();
                    }, 300);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        }
    };
    $scope.save_report = function () {


        var parameter = JSON.stringify({
            id: $scope.detail.id,
            description: $scope.report.description,
            strengths: $scope.to_string($scope.positive_points, 'description', '-'),
            weak_points: $scope.negative_points.map(function (itm) {
                return itm.description;
            }),
            files: $scope.documents.map(function (itm) {
                return {
                    name: itm.name,
                    description: itm.description,
                    file_type: itm.file_type,
                    file: itm.b64
                };
            }),
            year: $rootScope.year
        });
        $http.post(Server_URL + '/v1/user/hospital/drile/report', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.success_alert('گزارش مانور با موفقیت ثبت شد.', 'ثبت گزارش مانور');
                $scope.documents = [];
                $scope.positive_points = [];
                $scope.negative_points = [];
                setTimeout(function () {
                    $scope.close();
                }, 300);
                /*$scope.simulated_exercises[$scope.simulated_exercises.indexOf($scope.detail)] = data;*/

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.toggle_config_set = function () {
        $scope.config_set = !$scope.config_set;

    };
    $scope.close = function () {
        $scope.uibModalInstance.dismiss('cancel');
    };
    $scope.get_driles = function () {
        factory1.getUserApi('/v1/user/hospital/driles').then(function (data) {
            $scope.simulated_exercises = data;

        });
    };
    $scope.get_driles();
});

app.controller('Compilation_of_early_warning_system_before_incident_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, ngCanvasDesignService, $rootScope) {
    $scope.abi = {
        file: '',
        b64_file: '',
        abi_model: []/*{x_cordination :'',y_cordination :'',propertise :'{stringify}',pin  :''}*/
        , type: ''
    };
    $scope.abis = [];
    $scope.contex = {
        text_select: false,
        objects: [],
        selected: false
    };
    $scope.text_box_popover = {
        templateUrl: 'text_box_popover.html',
        isOpen: false,
        font_size: '8',
        align: 'right',
        bold: false,
        text: '',
        color: '#424242',
        direction: 'rtl',
        lineHeight: '1.5',
        verticalAlign: 'top',
        justify: false
    };
    $scope.canvase = {
        width: 700,
        height: 700
    };
    $scope.abi_selected = {
        model: []
    };
    $scope.color_picker_options = {
        pos: 'top right',
        format: 'hexString',
        swatch: false,
        swatchOnly: true,
        hide: {
            blur: true
        }

    };
    $scope.zoom = 0;
    $scope.key = {
        ctrl: false,
        shift: false,
        alt: false
    };
    $scope.eventApi = {
        onOpen: function () {
            $scope.choose_color = true;
        },
        onClose: function () {
            $scope.choose_color = false;
        },
        onBlur: function () {
            console.log('blurred');
        },
        onDestroy: function () {
            console.log('destroyed');
        },
        onChange: function (event, color) {
            console.log('changed', color);
        }
    };
    $scope.paper = '700*700';
    var element = null;
    $scope.zoomIn = function () {
        if ($scope.zoom < 10) {
            $scope.zoom++;
        }
    };
    $scope.zoomOut = function () {
        if ($scope.zoom > -10) {
            $scope.zoom--;
        }

    };
    $scope.upload_abi = function () {
        factory1.upload_file($scope, $scope.abi.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, false, null).then(function (data) {
            $scope.abi.b64_file = data;
            $scope.submit_abi('file');
        });
    };
    $scope.save_abi = function () {
        $scope.submit_abi('online');
    };
    $scope.cancel = function () {
        $scope.abi.type = '';
        $scope.abi_selected.model = angular.copy([{}]);
        setTimeout(function () {
            $scope.abi_selected.model = [];
        }, 300);
    };
    $scope.show_abi = function (row) {
        $scope.abi.type = 'online';
        $scope.abi_selected.model = row.abi_model.map(function (itm) {
            return JSON.parse(itm.propertise);
        });
    };
    $scope.request_abi = function () {
        factory1.upload_file($scope, $scope.abi.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, false, null).then(function (data) {
            $scope.abi.b64_file = data;
            $scope.submit_abi('request');
        });
    };
    $scope.submit_abi = function (type) {
        var msg = type === 'file' ? 'فایل سامانه هشدار با موفقیت بارگذاری شد.' : (type === 'request' ? 'درخواست شما با موفقیت ثبت شد.' : 'سامانه تدوین شده با موفقیت ثبت شد.');
        var parameter = JSON.stringify({
            abi_type: type,
            file: $scope.abi.b64_file,
            abi_model: $scope.abi.abi_model.map(function (itm) {
                return {propertise: JSON.stringify(itm)}
            }),
            year: $rootScope.year
        });
        $http.post(Server_URL + '/v1/user/hospital/abi', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                console.log(data);
                $scope.success_alert(msg, 'ثبت سامانه هشدار');
                if (data.abi) {
                    $scope.abis.push(data);
                } else {
                    $scope.abis.push({abi: data});
                }
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.open_contex = function (data) {
        if (data) {
            $scope.contex.text_select = true;
            $scope.contex.objects = data.selected;

            var mouseX = data.mouse.x;
            var mouseY = data.mouse.y;
            element = angular.element(data.mouse.e.currentTarget);
            var height = element.parent().find('.context_menu')[0].height;
            var width = element.parent().find('.context_menu')[0].width;
            var deltaX = $scope.canvase.width - width;
            var deltaY = $scope.canvase.height - height;
            element.parent().find('.context_menu')[0].style.top = (mouseY + 20) + 'px';
            element.parent().find('.context_menu')[0].style.left = (mouseX + 20) + 'px';
            if (mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top left';
            }
            if (mouseY > deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom right';
            }
            if (mouseY > deltaY && mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom left';
            }
            if (mouseY < deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top right';
            }

            if (mouseY > deltaY) {
                element.parent().find('.context_menu')[0].style.top = (mouseY - deltaY) + 'px';

            }
            if (mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.left = (mouseX - deltaX) + 'px';
            }

        } else {
            $scope.contex.text_select = false;
            $scope.contex.objects = [];
            $scope.contex.selected = null;
        }

    };
    $scope.delete = function (row) {
        $scope.question('آیا از حذف سامانه هشدار مورد نظر مطمئن هستید؟', 'حذف سامانه هشدار');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/abi/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('اطلاعات سامانه هشدار با موفقیت حذف شد.', 'حذف سامانه هشدار');
                        $scope.abis.splice($scope.abis.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });

    };
    $scope.paper_change = function () {
        if ($scope.paper === 'A3') {
            $scope.canvase.width = 3508;
            $scope.canvase.height = 4961;
        } else if ($scope.paper === 'A4') {
            $scope.canvase.width = 2480;
            $scope.canvase.height = 3508;
        } else if ($scope.paper === 'A5') {
            $scope.canvase.width = 1748;
            $scope.canvase.height = 2480;
        } else if ($scope.paper === 'A6') {
            $scope.canvase.width = 1240;
            $scope.canvase.height = 1748;
        } else {
            $scope.canvase.width = 700;
            $scope.canvase.height = 700;
        }
    };
    factory1.getUserApi('/v1/user/hospital/abis').then(function (data) {
        $scope.abis = data;
    });
    angular.element(document).ready(function () {
        element = angular.element('.abi_btn_wrapper canvas');
        angular.element(document).on('click', element, function (event) {
            var isClickedElementChildOfPopup = element.parent()
                .find(event.target)
                .length > 0;
            if (isClickedElementChildOfPopup)
                return;
            if ($scope.contex.text_select) {
                $scope.contex.text_select = false;
                $scope.contex.selected = null;
            }
            $scope.$apply();
            /*$scope.$apply(function(){

            });*/
        });

    });

    /* $(document).bind('click', function(event){
        var isClickedElementChildOfPopup = element.parent()
                .find(event.target)
                .length > 0;

        if (isClickedElementChildOfPopup)
            return;
        //console.log(isClickedElementChildOfPopup);
        $scope.$apply(function(){
            $scope.contex.text_select=false;
        });
    });*/
});

app.controller('identify_hazardous_places_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $rootScope) {

    $scope.config = {
        name: '',
        map: '',
        map_file: ''
    };
    $scope.places = [
        /*	{
    		id:1,
			name:'دیالیز',
			map:{url:'http:'+BASE+'/asset/images/map_plan.jpg'},
			pins:[
	{"id":"1","x":1009,"y":233,"flag":true,"count":2,'pin_id':10001},{"id":"1","x":235,"y":220,"flag":false,"count":1,'pin_id':10002},{"id":"3","x":952,"y":501,"flag":false,"count":2},{"id":"3","x":140,"y":44,"flag":false,"count":1},{"id":"5","x":433,"y":272,"flag":false,"count":1},{"id":"4","x":772,"y":274,"flag":false,"count":1},{"id":"2","x":315,"y":230,"flag":false,"count":1},{"id":"2","x":796,"y":228,"flag":false,"count":1},{"id":"2","x":1185,"y":235,"flag":false,"count":1},{"id":"2","x":806,"y":410,"flag":false,"count":1},{"id":"2","x":367,"y":478,"flag":false,"count":1},{"id":"2","x":1023,"y":455,"flag":false,"count":1},{"id":"2","x":1255,"y":402,"flag":false,"count":1},{"id":"2","x":95,"y":462,"flag":false,"count":1},{"id":"2","x":37,"y":334,"flag":false,"count":1},{"id":"2","x":1220,"y":115,"flag":false,"count":1},{"id":"2","x":855,"y":115,"flag":false,"count":1},{"id":"2","x":435,"y":106,"flag":false,"count":1},{"id":"6","x":13,"y":434,"flag":false,"count":1},{"id":"12","x":255,"y":37,"flag":false,"count":1},{"id":"12","x":1071,"y":242,"flag":false,"count":1},{"id":"12","x":587,"y":241,"flag":false,"count":1},{"id":"11","x":250,"y":518,"flag":false,"count":1},{"id":"11","x":1299,"y":236,"flag":false,"count":1},{"id":"10","x":954,"y":236,"flag":false,"count":1},{"id":"10","x":434,"y":481,"flag":false,"count":1},{"id":"10","x":699,"y":474,"flag":false,"count":1},{"id":"9","x":1180,"y":372,"flag":false,"count":1},{"id":"9","x":36,"y":512,"flag":false,"count":1},{"id":"8","x":37,"y":403,"flag":false,"count":1},{"id":"7","x":819,"y":338,"flag":false,"count":1}
				]
		}*/

    ];
    $scope.selected = {};
    $scope.sub_menu = false;
    $scope.manual_extinguishers_sub_menu = false;
    $scope.safe_discharge_paths_sub_menu = false;
    $scope.detectors_sub_menu = false;
    $scope.base_url = BASE + '/asset/images/icons_map/';
    $scope.icon = [
        '',
        {x: 420, y: 0},
        {x: 0, y: 0},
        {x: 600, y: 0},
        {x: 480, y: 0},
        {x: 660, y: 0},
        {x: 540, y: 0},
        {x: 360, y: 0},
        {x: 300, y: 0},
        {x: 240, y: 0},
        {x: 180, y: 0},
        {x: 120, y: 0},
        {x: 60, y: 0},
        {x: 720, y: 0},
        {x: 780, y: 0}
    ];
    $scope.selected_pin = {};
    $scope.zoom = 1;
    $scope.id = 0;
    $scope.open = {contex: false};

    $scope.pins = [];

    $scope.add_config = function () {
        if ($scope.config.map.length > 0) {
            var parameter = JSON.stringify({
                map: $scope.config.map,
                name: $scope.config.name,
                year: $rootScope.year
            });
            $http.post(Server_URL + '/v1/user/hospital/fire_prevention/fire_ward', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    console.log(data);
                    $scope.config = {

                        name: '',
                        map: ''
                    };
                    $scope.places.push(data);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        } else {
            $scope.warning('نقشه محل مورد نظر را انتخاب کنید.');
        }
    };
    $scope.map_uploaded = function (row) {
        factory1.upload_file($scope, row ? row.map_file : $scope.config.map_file, 20000000, ['image/jpeg', 'image/jpg', 'image/png'], true, false, 'rectangle').then(function (data) {

            if (row) {

                row.map_url = data;
            } else {
                $scope.config.map = data;
            }
        });
    };
    $scope.current_map = null;
    $scope.edit_config = function (row) {
        $scope.current_map = angular.copy(row);
        row.editable = true;
    };
    $scope.update_config = function (row) {
        var parameter = JSON.stringify({
            map: row.map_url,
            name: row.name,
            id: row.id
        });
        $http.put(Server_URL + '/v1/user/hospital/fire_prevention/fire_ward', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.current_map = null;
                row.map.url = data.map.url;
                row.editable = false;
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.cancel_config = function (row) {
        $scope.places[$scope.places.indexOf(row)] = angular.copy($scope.current_map);
        $scope.current_map = null;
    };
    $scope.map_select = function (row) {
        $scope.reset();
        $scope.id = 0;
        $scope.selected_pin = {};
        $scope.pins = [];
        $scope.selected = row;
        if (row.points && row.points.length) {
            $scope.pins = row.points.map(function (itm) {
                var obj = angular.copy(itm);
                obj.x = parseInt(obj.x_cordination);
                obj.y = parseInt(obj.y_cordination);
                obj.pin_id = parseInt(itm.pin);
                return obj;
            });
        }
    };
    $scope.reset = function () {
        $scope.move = false;

        $scope.hazardous_places = false;
        $scope.manual_extinguishers = false;
        $scope.detectors = false;
        $scope.safe_discharge_paths = false;

        $scope.detectors_1 = false;
        $scope.detectors_0 = false;
        $scope.detectors_2 = false;

        $scope.firebox = false;
        $scope.water_and_gas = false;
        $scope.carbon_dioxide = false;
        $scope.powder_and_gas = false;

        $scope.to_up = false;
        $scope.to_down = false;
        $scope.to_left = false;
        $scope.to_right = false;
        $scope.emergency_safe_stairs = false;
        $scope.to_exit_door = false;
    };
    $scope.delete_pin = function (pin) {
        $http.delete(Server_URL + '/v1/user/hospital/fire_prevention/delete_point/' + pin.id, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var i = 0;
                $scope.pins.forEach(function (itm) {
                    if (itm.id === pin.id) {
                        $scope.pins.splice(i, 1);
                        $scope.open.contex = false;
                    }
                    i++;
                });
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.delete_config = function (row) {
        $scope.question('آیا تمایل دارید نقشه و اطلاعات ثبت شده آن را حذف کنید؟', 'حذف نقشه');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/fire_prevention/fire_ward/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.places.splice($scope.places.indexOf(row), 1);
                        if ($scope.selected == row) {
                            $scope.reset();
                            $scope.id = 0;
                            $scope.selected_pin = {};
                            $scope.pins = [];
                            $scope.selected = {};
                        }
                        $scope.success_alert('اطلاعات مکان خطر آفرین با موفقیت حذف شد.', 'حذف نقشه');
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });

    };
    $scope.reset();
    $scope.zoomIn = function () {
        if ($scope.zoom < 3)
            $scope.zoom = $scope.zoom + .1;

    };
    $scope.zoomOut = function () {
        if ($scope.zoom > .5)
            $scope.zoom = $scope.zoom - .1;
    };
    $scope.move_canvas = function () {
        var m = angular.copy($scope.move);
        $scope.reset();
        $scope.id = 0;
        $scope.move = !m;
    };
    $scope.hazardous_places_selected = function () {
        $scope.sub_menu = false;
        $scope.reset();
        $scope.id = 1;
        $scope.hazardous_places = true;
    };
    $scope.manual_extinguishers_selected = function () {
        $scope.sub_menu = true;
        $scope.manual_extinguishers_sub_menu = true;
        $scope.safe_discharge_paths_sub_menu = false;
        $scope.detectors_sub_menu = false;
        $scope.reset();
        $scope.id = 0;
        $scope.manual_extinguishers = true;

    };
    $scope.detectors_selected = function () {
        $scope.sub_menu = true;
        $scope.manual_extinguishers_sub_menu = false;
        $scope.safe_discharge_paths_sub_menu = false;
        $scope.detectors_sub_menu = true;
        $scope.reset();
        $scope.id = 0;
        $scope.detectors = true;

    };
    $scope.safe_discharge_paths_selected = function () {
        $scope.sub_menu = true;
        $scope.manual_extinguishers_sub_menu = false;
        $scope.safe_discharge_paths_sub_menu = true;
        $scope.detectors_sub_menu = false;
        $scope.reset();
        $scope.id = 0;
        $scope.safe_discharge_paths = true;
    };
    $scope.detectors_0_selected = function () {
        $scope.reset();
        $scope.id = 2;
        $scope.detectors = true;
        $scope.detectors_0 = true;

    };
    $scope.detectors_1_selected = function () {
        $scope.reset();
        $scope.id = 13;
        $scope.detectors = true;
        $scope.detectors_1 = true;

    };
    $scope.detectors_2_selected = function () {
        $scope.reset();
        $scope.id = 14;
        $scope.detectors = true;
        $scope.detectors_2 = true;

    };
    $scope.firebox_selected = function () {
        $scope.reset();
        $scope.id = 3;
        $scope.manual_extinguishers = true;
        $scope.firebox = true;

    };
    $scope.water_and_gas_selected = function () {
        $scope.reset();
        $scope.id = 4;
        $scope.manual_extinguishers = true;
        $scope.water_and_gas = true;

    };
    $scope.carbon_dioxide_selected = function () {
        $scope.reset();
        $scope.id = 5;
        $scope.manual_extinguishers = true;
        $scope.carbon_dioxide = true;
    };
    $scope.powder_and_gas_selected = function () {
        $scope.reset();
        $scope.id = 6;
        $scope.manual_extinguishers = true;
        $scope.powder_and_gas = true;
    };
    $scope.to_up_selected = function () {
        $scope.reset();
        $scope.id = 7;
        $scope.safe_discharge_paths = true;
        $scope.to_up = true;
    };
    $scope.to_down_selected = function () {
        $scope.reset();
        $scope.id = 8;
        $scope.safe_discharge_paths = true;
        $scope.to_down = true;
    };
    $scope.to_left_selected = function () {
        $scope.reset();
        $scope.id = 9;
        $scope.safe_discharge_paths = true;
        $scope.to_left = true;
    };
    $scope.to_right_selected = function () {
        $scope.reset();
        $scope.id = 10;
        $scope.safe_discharge_paths = true;
        $scope.to_right = true;
    };
    $scope.emergency_safe_stairs_selected = function () {
        $scope.reset();
        $scope.id = 11;
        $scope.safe_discharge_paths = true;
        $scope.emergency_safe_stairs = true;
    };
    $scope.to_exit_door_selected = function () {
        $scope.reset();
        $scope.id = 12;
        $scope.safe_discharge_paths = true;
        $scope.to_exit_door = true;
    };
    $scope.preventive_measures = function (row) {
        console.log(row);
        $scope.pins_need_eop = [];
        $scope.pins_need_eop = row.points.filter(function (itm) {
            if (itm.pin == 1) {
                return itm;
            }
        });
        $scope.preventive_measures_modal = $scope.open_modal('lg', 'preventive_measures.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.close = function () {
        $scope.preventive_measures_modal.dismiss('cancel');
    };
    $scope.get_pins_count = function (id) {
        var count = 0;
        $scope.pins.forEach(function (itm) {
            if (itm.pin_id === id) {
                count += parseInt(itm.count);
            }
        });
        return count;
    };
    $scope.submit_eop = function (pin) {
        $scope.open_eop_modal(
            ' ثبت اقدامات پیشگیرانه'
            ,
            'اقدامات پیشگیرانه برای مکان خطرآفرین با کد:' + pin.id
            ,
            null
            ,
            'موضوع '
            ,
            pin
            ,
            false
            ,
            pin.prefix);
    };
    $scope.showPlaceInfoModal = function (place) {
        console.log(place)
        $scope.currentPlace = angular.copy(place);
        $scope.open_modal('md', 'showPlaceInfoModal.html', null, null, 'blue_modal', $scope, true);
    }
    $scope.savePlaceInfo = function (e) {
        e.preventDefault();
        var params = {
            reason: $scope.currentPlace.reason,
            risk_level: $scope.currentPlace.risk_level,
            id: $scope.currentPlace.id
        }
        factory1.putUserApi('/v1/user/hospital/fire_prevention/place_info', JSON.stringify(params)).then(function (data) {
            $scope.close_modal();
            $scope.pins.map(function (p) {
                if (p.id == $scope.currentPlace.id) {
                    p.reason = $scope.currentPlace.reason;
                    p.risk_level = $scope.currentPlace.risk_level;
                }
            })
        })
    }
    $scope.toggle_config_set = function () {
        $scope.config_set = !$scope.config_set;

    };
    factory1.getUserApi('/v1/user/hospital/fire_prevention/fire_wards').then(function (data) {
        data.forEach(function (itm) {
            if (itm.fire) {
                itm.fire.points = itm.points;
                $scope.places.push(itm.fire);
            }
        });

    });

    $scope.$watch('selected_pin', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            selected_pin = $scope.selected_pin;
        }
    });
    $scope.$watch('selected_pin.count', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.pins.forEach(function (itm) {
                if (itm.id == selected_pin.id && itm.count !== newVal) {
                    var parameter = JSON.stringify({id: $scope.selected_pin.id});
                    var url = '';
                    if (newVal > itm.count) {
                        url = '/v1/user/hospital/fire_prevention/point/increase_count';
                        $scope.pins[$scope.pins.indexOf(itm)].count++;

                    } else {
                        url = '/v1/user/hospital/fire_prevention/point/decrease_count';
                        $scope.pins[$scope.pins.indexOf(itm)].count--;

                    }
                    $http.put(Server_URL + url, parameter, {headers: $scope.queryHeaders})
                        .success(function (data, status, headers) {

                        }).error(function (data, status, headers) {
                        $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً کمی بعد مجدداً تلاش کنید.');
                        console.log(data);

                    });
                }
            });


        }
    })
});

app.controller('interface_team_of_fire_stations_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $rootScope) {
    $scope.interface_team_of_fire_stations = [];
    $scope.copy_team = null;
    $scope.index = -1;
    $scope.duty = {
        file: '',
        file2: '',
        file3: '',
        file_uploaded: '',
        file2_uploaded: '',
        file3_uploaded: '',
    };
    $scope.file = {
        src: ''
    };
    $scope.file2 = {
        src: ''
    };
    $scope.shift_files = [];
    $scope.selected_users = [];
    $scope.dutis = [];
    $scope.new_interface = function () {

        var l = $scope.interface_team_of_fire_stations.length;
        if (l) {
            if (!$scope.interface_team_of_fire_stations[l - 1].fullname.length) {
                $scope.warning('لطفاً نام و نام خانوادگی را وارد کنید.');
                return false;
            } else if (!$scope.interface_team_of_fire_stations[l - 1].post.length) {
                $scope.warning('لطفاً سمت را وارد کنید.');
                return false;
            } else if (!$scope.interface_team_of_fire_stations[l - 1].ward_name.length) {
                $scope.warning('لطفاً رابط بخش را مشخص کنید.');
                return false;
            } else if ($scope.interface_team_of_fire_stations[l - 1].cell_phone.length < 11 || $scope.interface_team_of_fire_stations[l - 1].cell_phone.indexOf('0') !== 0 || $scope.interface_team_of_fire_stations[l - 1].cell_phone.indexOf('9') !== 1) {
                $scope.warning('لطفاً شماره تلفن همراه  11 رقمی را به صورت *********09 وارد کنید.');
                return false;
            } else if (!$scope.interface_team_of_fire_stations[l - 1].duty.length) {
                $scope.warning('لطفاً شرح وظایف را وارد کنید.');
                return false;
            }
        }
        $scope.interface_team_of_fire_stations.push({
            editable: true,
            duty: '',
            cell_phone: '',
            ward_name: '',
            post: '',
            fullname: '',
            year: $rootScope.year
        });
    };
    $scope.upload_duty = function () {

        factory1.upload_file($scope, $scope.duty.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx', 'application/x-zip-compressed', 'application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.sealed-xls'], false, '/v1/user/hospital/fire_team/duty', null).then(function (data) {
            console.log(data);
            $scope.duty.file_uploaded = data;

        });


    };
    $scope.upload_duty2 = function () {

        factory1.upload_file($scope, $scope.duty.file2, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx', 'application/x-zip-compressed', 'application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.sealed-xls'], false, '/v1/user/hospital/fire_team/duty2', null).then(function (data) {
            console.log(data);
            $scope.duty.file2_uploaded = data;

        });


    };
    $scope.upload_duty3 = function () {

        factory1.upload_file($scope, $scope.duty.file3, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx', 'application/x-zip-compressed', 'application/zip', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.sealed-xls'], false, '/v1/user/hospital/fire_team/duty3', null).then(function (data) {
            console.log(data);
            $scope.duty.file3_uploaded = data;

        });


    };
    $scope.detailMultiFile = function (data) {
        $scope.detail_recordes = data;
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);
    }
    $scope.deleteFile = function (row) {
        $scope.question('آیا از حذف پیوست مورد نظر مطمئن هستید؟', 'حذف پیوست').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/fire_team/file/' + row.id).then(function (data) {
                    $scope.detail_recordes.files.splice($scope.detail_recordes.files.indexOf(row), 1);
                    $scope.success_alert('فایل با موفقیت حذف شد!', 'حذف پیوست');
                })

            }
        });
    }
    $scope.deleteDutiFile = function (row) {
        $scope.question('آیا از حذف پیوست مورد نظر مطمئن هستید؟', 'حذف پیوست').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/fire_team/duty/' + row.id + '?type=' + ($scope.duty_type || 1)).then(function (data) {
                    $scope.dutis.splice($scope.dutis.indexOf(row), 1);
                    $scope.success_alert('فایل با موفقیت حذف شد!', 'حذف پیوست');
                })

            }
        });
    }
    $scope.uploadFiles = function () {
        factory1.upload_file($scope, $scope.file.src, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, '/v1/user/hospital/fire_team/shift_file?file_name=' + $scope.file.src.filename + '&id=' + $scope.detail_recordes.id, null).then(function (data) {
            console.log(data);
            if (!$scope.detail_recordes.shift_files) {
                $scope.detail_recordes.shift_files = []
            }
            $scope.detail_recordes.shift_files.push(data);

        });
    };
    $scope.uploadFiles__files = function () {
        factory1.upload_file($scope, $scope.file2.src, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, '/v1/user/hospital/fire_team/duty' + $scope.duty_type + '?file_name=' + $scope.file2.src.filename, null).then(function (data) {
            $scope.dutis.push(data);

        });
    };
    $scope.show_documents = function (type) {
        $scope.duty_type = type;
        factory1.getUserApi('/v1/user/hospital/fire_team/duty_by_type', '&type=' + (type || 1)).then(function (data) {
            $scope.dutis = data;
            $scope.open_modal('lg', 'multiFile2.html', null, null, 'blue_modal', $scope, true);

        })
    }
    $scope.create = function () {
        var l = $scope.interface_team_of_fire_stations.length;
        if (!$scope.interface_team_of_fire_stations[l - 1].fullname.length) {
            $scope.warning('لطفاً نام و نام خانوادگی را وارد کنید.');
            return false;
        } else if (!$scope.interface_team_of_fire_stations[l - 1].post.length) {
            $scope.warning('لطفاً سمت را وارد کنید.');
            return false;
        } else if (!$scope.interface_team_of_fire_stations[l - 1].ward_name.length) {
            $scope.warning('لطفاً رابط بخش را مشخص کنید.');
            return false;
        } else if ($scope.interface_team_of_fire_stations[l - 1].cell_phone.length < 11 || $scope.interface_team_of_fire_stations[l - 1].cell_phone.indexOf('0') !== 0 || $scope.interface_team_of_fire_stations[l - 1].cell_phone.indexOf('9') !== 1) {
            $scope.warning('لطفاً شماره تلفن همراه  11 رقمی را به صورت *********09 وارد کنید.');
            return false;
        } else if (!$scope.interface_team_of_fire_stations[l - 1].duty.length) {
            $scope.warning('لطفاً شرح وظایف را وارد کنید.');
            return false;
        }
        var arr = $scope.interface_team_of_fire_stations.filter(function (itm) {
            if (!itm.id && itm.cell_phone) {
                return itm;
            }
        });
        if (arr.length) {
            var parameter = JSON.stringify({
                fire_teams: arr,
                year: $rootScope.year
            });
            $http.post(Server_URL + '/v1/user/hospital/fire_team', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('تیم رابط آتش نشانی با موفقیت ثبت شد.', 'ثبت تیم رابط آتش نشانی');
                    $scope.interface_team_of_fire_stations = data;
                    /*data.forEach(function (itm) {
                        $scope.interface_team_of_fire_stations.map(function (obj) {
							if(obj.cell_phone===itm.cell_phone){
								obj.id=itm.id;
                                obj.editable=false;
                            }
                        })
                    });*/

                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        } else {
            $scope.warning('لطفاً ابتدا افراد مورد نظر را به جدول اضافه کنید.');
        }

    };
    $scope.edit = function (row) {
        $scope.copy_team = angular.copy(row);
        $scope.index = $scope.interface_team_of_fire_stations.indexOf(row);
        $scope.interface_team_of_fire_stations[$scope.index].editable = true;
    };
    $scope.delete = function (row) {

        if (row.id) {
            $scope.question('آیا از حذف شخص مورد نظر مطمئن هستید؟', 'حذف اعضا تیم رابط آتش نشانی');
            $scope.q_result.result.then(function (r) {
                if (r) {
                    $http.delete(Server_URL + '/v1/user/hospital/fire_team/' + row.id, {headers: $scope.queryHeaders})
                        .success(function (data, status, headers) {
                            $scope.success_alert('شخص مورد نظر با موفقیت از تیم رابط آتش نشانی حذف شد.', 'حذف اعضا تیم رابط آتش نشانی');
                            $scope.interface_team_of_fire_stations.splice($scope.interface_team_of_fire_stations.indexOf(row), 1);
                        }).error(function (data, status, headers) {
                        console.log(data);
                        $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                    });
                }
            });

        } else {
            $scope.interface_team_of_fire_stations.splice($scope.interface_team_of_fire_stations.indexOf(row), 1);
        }
    };
    $scope.cancel = function (row) {
        $scope.interface_team_of_fire_stations[$scope.index] = angular.copy($scope.copy_team);
        $scope.copy_team = null;
        $scope.index = -1;
    };
    $scope.update = function (row) {
        if (row.id) {
            if (!row.fullname.length) {
                $scope.warning('لطفاً نام و نام خانوادگی را وارد کنید.');
                return false;
            } else if (!row.post.length) {
                $scope.warning('لطفاً سمت را وارد کنید.');
                return false;
            } else if (!row.ward_name.length) {
                $scope.warning('لطفاً رابط بخش را مشخص کنید.');
                return false;
            } else if (row.cell_phone.length < 11 || row.cell_phone.indexOf('0') !== 0 || row.cell_phone.indexOf('9') !== 1) {
                $scope.warning('لطفاً شماره تلفن همراه  11 رقمی را به صورت *********09 وارد کنید.');
                return false;
            } else if (!row.duty.length) {
                $scope.warning('لطفاً شرح وظایف را وارد کنید.');
                return false;
            }
            var parameter = JSON.stringify(row);
            $http.put(Server_URL + '/v1/user/hospital/fire_team', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('تیم رابط آتش نشانی با موفقیت به روزرسانی شد.', 'به روزرسانی تیم رابط آتش نشانی');
                    $scope.interface_team_of_fire_stations[$scope.index].editable = false;
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        } else {
            $scope.interface_team_of_fire_stations[$scope.index].editable = false;
        }

    };
    $scope.fire_send_to = function (selected_users) {
        var arr = [];
        arr = angular.copy($scope.users);
        if (selected_users) {

            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    selected_users.forEach(function (p) {
                        if (obj.id == p.id || obj.id == p) {
                            itm.users[itm.users.indexOf(obj)].checked = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal');
        result.result.then(function (r) {
            if (r) {

                selected_users = r;
                if (selected_users.length) {
                    var parameter = JSON.stringify({
                        partners: selected_users.map(function (itm) {
                            return itm.id
                        }),
                        year: $rootScope.year
                    });
                    $http.put(Server_URL + '/v1/user/hospital/fire_team/send_to', parameter, {headers: $scope.queryHeaders})
                        .success(function (data, status, headers) {
                            console.log(data);
                            $scope.success_alert('لیست تیم رابط آتش نشانی به افراد مورد نظر ارسال شد.', 'اطلاع رسانی');
                        }).error(function (data, status, headers) {
                        console.log(data);
                        $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                    });
                } else {
                    return false;
                }


            }
        });


    };
    factory1.getUserApi('/v1/user/hospital/fire_teams').then(function (data) {
        $scope.interface_team_of_fire_stations = data;


    });
    // factory1.getUserApi('/v1/user/hospital/fire_teams/duty').then(function (data) {
    //     $scope.duty.file_uploaded = data;
    // });
    // factory1.getUserApi('/v1/user/hospital/fire_teams/duty2').then(function (data) {
    //     $scope.duty.file2_uploaded = data;
    // });
    // factory1.getUserApi('/v1/user/hospital/fire_teams/duty3').then(function (data) {
    //     $scope.duty.file3_uploaded = data;
    // });
    /*  factory1.getUserApi('/v1/user/hospital/fire_teams/shift_files').then(function (data) {
          $scope.shift_files = data;
      });*/

});

app.controller('safety_of_the_engine_room_Ctrl', function ($scope) {
    $scope.eop_of_engine_home = [{}];
});

app.controller('report_accident_Ctrl', function ($scope, $state, factory1, localStorageService, $http, Server_URL, $rootScope, $location) {
    $scope.excel_filename = 'حوادث گزارش شده ' + $rootScope.year;
    var excelStyleInstans = {
        sheetid: 'حوادث گزارش شده',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {
                columnid: 'acc_date', title: 'تاریخ بروز حادثه', width: 150, cell: {
                    value: function (value) {
                        return value ? $scope.get_date(value) : '';
                    }
                }
            },
            {
                columnid: 'acc_time', title: 'ساعت بروز حادثه', width: 150, cell: {
                    value: function (value) {
                        return value ? $scope.get_time(value) : '';
                    }
                }
            },
            {
                columnid: 'shift', title: 'شیفت بروز حادثه', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'location_name', title: 'محل حادثه', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'report_name', title: 'عنوان حادثه', width: 300, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'cause', title: 'علت حادثه', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'acc_type', title: 'نوع حادثه', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_name', title: 'نام فرد حادثه دیده', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_family', title: 'نام خانوادگی فرد حادثه دیده', width: 200, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_age', title: 'سن فرد حادثه دیده', width: 150, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_education', title: 'میزان تحصیلات فرد حادثه دیده', width: 200, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_experience', title: 'سابقه کار فرد حادثه دیده', width: 200, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_job', title: 'شغل فرد حادثه دیده', width: 200, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'person_working', title: 'کاری که حین انجام آن فرد آسیب دیده', width: 300, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'report_description', title: 'گزارش حادثه', width: 500, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },
            {
                columnid: 'after_accident', title: 'اقدامات انجام شده بعد از حادثه', width: 500, cell: {
                    value: function (value) {
                        return value || '-';
                    },
                }
            },

        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }
    $scope.excel_style = excelStyleInstans;
    $scope.excel_outPut = [];
    $scope.witnesses = [];
    $scope.accident = {
        type: '',
        report_date: '',
        form_number: '',
        location: '',
        cause: '',
        shift: 'عصر',
        date: '',
        time: '',
        status_0: true,
        status_1: false
    };
    $scope.hurts = [
        'ضربه و کوفتگی',
        'بریدگی',
        'شکستگی و دررفتگی',
        'فرورفتن اجسام نوک تیز در دست',
        'مسمومیت',
        'برق گرفتگی',
        'سایر'
    ];
    $scope.arr1 = [{}, {}, {}, {}, {}];
    $scope.details_accident = null;
    $scope.location_chart = {
        labels_chart: [],
        /*series:['انجام نشده','منتفی شده','دردست اقدام','تکمیل شده'],*/
        colors_chart: [],
        data_chart: [],
        data_set: [
            /*{
            borderWidth:0,
            backgroundColor:'#355da2'
            }*/
        ],
        options: {
            layout: {
                padding: {
                    left: 40,
                    right: 40,
                    top: 10,
                    bottom: 10
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{

                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    },
                    /*  scaleLabel: {
                     display: true,
                     labelString: 'ماه',
                     fontSize: 11
                     }*/
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },
                    /* scaleLabel: {
                     display: true,
                     labelString: 'درصد',
                     fontSize: 11
                     }*/
                }]

            }
        }
    };
    $scope.cause_chart = {
        labels_chart: [],
        colors_chart: [],
        data_chart: [],
        data_set: [],
        options: {
            layout: {
                padding: {
                    left: 40,
                    right: 40,
                    top: 10,
                    bottom: 10
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{

                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    },
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },
                }]

            }
        }
    };
    $scope.details_accident = $scope.getCookie('details_accident');
    if ($scope.details_accident)
        $scope.exportOptions = {
            width_image: 400,
            fileName: 'گزارش ' + $scope.details_accident.report_name
        };
    $scope.reports = [];
    $scope.type_pie_chart = {
        labels_chart: ['محیط', 'پرسنل'],
        colors_chart: ['#78b84e', '#f15342'],
        data_chart: [0, 0],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        }
    };
    $scope.shift_pie_chart = {
        labels_chart: ['صبح', 'عصر', 'شب'],
        colors_chart: ['#55ade0', '#f89939', '#7f72b4'],
        data_chart: [0, 0, 0],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        }
    };
    $scope.is_resualt = $state.$current.self.name !== "report_accident";
    if ($scope.is_resualt && !$scope.details_accident) {
        window.history.back();
    }
    $rootScope.$on('$stateChangeSuccess', function () {
        $scope.is_resualt = $state.$current.self.name !== "report_accident";
    });

    $scope.confirm_hse = function (accident) {
        if (!accident.hse_confirm) {
            var parameter = JSON.stringify({
                description: '',
                id: accident._id,
                year: $rootScope.year
            });
            $http.put(Server_URL + '/v1/user/hospital/confirm_accident_report', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('گزارش توسط شما تأیید شد.', 'تأیید گزارش');
                    $scope.details_accident.hse_confirm = true;
                    $scope.details_accident.hse_confirm_by = $scope.me.id;
                    $scope.setCookie('details_accident', accident);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
        }

    };
    $scope.details_accident_report = function (row) {
        $scope.details_accident = row;
        $scope.setCookie('details_accident', row);
        $state.go('report_accident.details_accident_report');
    };

    factory1.getUserApi('/v1/user/hospital/accidents').then(function (data) {
        $scope.reports = data;
        var selected_color = [];
        var type_pie_chart_data_chart = [0, 0];
        var shift_pie_chart_data_chart = [0, 0, 0];
        $scope.reports.map(function (itm, index) {
            if (itm.acc_type === 'محیط') {
                type_pie_chart_data_chart[0]++;
            } else {
                type_pie_chart_data_chart[1]++;
            }
            if (itm.shift === 'صبح') {
                shift_pie_chart_data_chart[0]++;
            } else if (itm.shift === 'عصر') {
                shift_pie_chart_data_chart[1]++;
            } else {
                shift_pie_chart_data_chart[2]++;
            }
            if ($scope.location_chart.labels_chart.indexOf(itm.location_name) === -1) {

                $scope.location_chart.labels_chart.push(itm.location_name);
                $scope.location_chart.data_chart.push(1);
                $scope.location_chart.colors_chart.push($scope.Colors[index + 1]);
                $scope.location_chart.data_set.push({
                    borderWidth: 0,
                    backgroundColor: $scope.Colors[index + 1]
                });

            } else {
                $scope.location_chart.data_chart[$scope.location_chart.labels_chart.indexOf(itm.location_name)]++;
            }
            if ($scope.cause_chart.labels_chart.indexOf(itm.cause) === -1) {

                $scope.cause_chart.labels_chart.push(itm.cause);
                $scope.cause_chart.data_chart.push(1);
                $scope.cause_chart.colors_chart.push($scope.Colors[index + 1]);
                $scope.cause_chart.data_set.push({
                    borderWidth: 0,
                    backgroundColor: $scope.Colors[index + 1]
                });

            } else {
                $scope.cause_chart.data_chart[$scope.cause_chart.labels_chart.indexOf(itm.cause)]++;
            }
        });
        $scope.type_pie_chart.data_chart[0] = ((type_pie_chart_data_chart[0] * 100) / $scope.reports.length).toFixed(2);
        $scope.type_pie_chart.data_chart[1] = ((type_pie_chart_data_chart[1] * 100) / $scope.reports.length).toFixed(2);
        $scope.shift_pie_chart.data_chart[0] = ((shift_pie_chart_data_chart[0] * 100) / $scope.reports.length).toFixed(2);
        $scope.shift_pie_chart.data_chart[1] = ((shift_pie_chart_data_chart[1] * 100) / $scope.reports.length).toFixed(2);
        $scope.shift_pie_chart.data_chart[2] = ((shift_pie_chart_data_chart[2] * 100) / $scope.reports.length).toFixed(2);
        $scope.excel_outPut = data;
    });
    $scope.report_chart = function () {

        $scope.chart_report_accident_modal = $scope.open_modal('lg', 'chart_report_accident_modal.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.close = function () {
        $scope.chart_report_accident_modal.dismiss();
    };


});

app.controller('Formation_of_Hospital_Accident_Command_System_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope) {

    $scope.acs = {
        file: '',
        duties_file: '',
        b64: '',
        duties_b64: '',
        has_file: false,
        acs_users: [], /*pin , user_id , post_in_acs , file , user_duty[] (record payin) Ex. {"user_id":"68","post_in_acs":"مدیر","successor_id":"","successor":"",added:true}*/
        user_duty: null/*id , description*/
    };
    $scope.abi = {
        file: '',
        b64_file: '',
        abi_model: []/*{x_cordination :'',y_cordination :'',propertise :'{stringify}',pin  :''}*/
        , type: '',
        shape: 'move',
        paper: '700*700'
    };
    $scope.abis = [];
    $scope.contex = {
        text_select: false,
        objects: [],
        selected: false
    };
    $scope.text_box_popover = {
        templateUrl: 'text_box_popover.html',
        isOpen: false,
        font_size: '8',
        align: 'right',
        bold: false,
        text: '',
        color: '#424242',
        direction: 'rtl',
        lineHeight: '1.5',
        verticalAlign: 'top',
        justify: false
    };
    $scope.canvase = {
        width: 700,
        height: 700
    };
    $scope.abi_selected = {
        model: []
    };
    $scope.color_picker_options = {
        pos: 'top right',
        format: 'hexString',
        swatch: false,
        swatchOnly: true,
        hide: {
            blur: true
        }

    };
    $scope.zoom = 0;
    $scope.key = {
        ctrl: false,
        shift: false,
        alt: false
    };
    $scope.all_dutys = [];
    $scope.acs_model = [];
    $scope.acs_model_result = {model: []};
    $scope.user_index = -1;
    var element = null;
    /*var users=[];*/
    var model = [];
    var arr_color = [];

    function setACS(data) {
        $scope.acs.created_at = data.updated_at;
        $scope.acs.has_file = data.has_file;
        $scope.acs.file_url = data.string ? data.string.url : null;
        $scope.acs.duties_file_url = data.duties ? data.duties.url : null;
        $scope.acs.sent_to_at = data.sent_to_at;
        $scope.acs.send_to = data.send_to ? data.send_to : [];
        $scope.acs.string_send_at = data.string_send_at;
        $scope.acs.duties_send_at = data.duties_send_at;
        $scope.acs.id = data.id;
        $scope.acs_model_result.model = $scope.acs.acs_model = data.flowchart ? JSON.parse(data.flowchart) : [];
        $scope.acs.acs_users = [];
        data.users.forEach(function (itm) {
            $scope.acs.acs_users.push(itm);
        });
    }

    $scope.zoomIn = function () {
        if ($scope.zoom < 10) {
            $scope.zoom++;
        }
    };
    $scope.zoomOut = function () {
        if ($scope.zoom > -10) {
            $scope.zoom--;
        }

    };
    $scope.upload_file_doc = function () {

        factory1.upload_file($scope, $scope.acs.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/x-zip-compressed', 'application/zip', 'application/docx'], false, null, null).then(function (data) {
            console.log(data);
            $scope.acs.b64 = data;
            $scope.acs.created_at = $scope.get_miladi_date();

        });

    };
    $scope.paper_change = function () {
        if ($scope.abi.paper === 'A3') {
            $scope.canvase.width = 3508;
            $scope.canvase.height = 4961;
        } else if ($scope.abi.paper === 'A4') {
            $scope.canvase.width = 2480;
            $scope.canvase.height = 3508;
        } else if ($scope.abi.paper === 'A5') {
            $scope.canvase.width = 1748;
            $scope.canvase.height = 2480;
        } else if ($scope.abi.paper === 'A6') {
            $scope.canvase.width = 1240;
            $scope.canvase.height = 1748;
        } else {
            $scope.canvase.width = 700;
            $scope.canvase.height = 700;
        }
    };
    $scope.open_contex = function (data) {
        if (data) {
            $scope.contex.text_select = true;
            $scope.contex.objects = data.selected;

            var mouseX = data.mouse.x;
            var mouseY = data.mouse.y;
            element = angular.element(data.mouse.e.currentTarget);
            var height = element.parent().find('.context_menu')[0].height;
            var width = element.parent().find('.context_menu')[0].width;
            var deltaX = $scope.canvase.width - width;
            var deltaY = $scope.canvase.height - height;
            element.parent().find('.context_menu')[0].style.top = (mouseY + 20) + 'px';
            element.parent().find('.context_menu')[0].style.left = (mouseX + 20) + 'px';
            if (mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top left';
            }
            if (mouseY > deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom right';
            }
            if (mouseY > deltaY && mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom left';
            }
            if (mouseY < deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top right';
            }

            if (mouseY > deltaY) {
                element.parent().find('.context_menu')[0].style.top = (mouseY - deltaY) + 'px';

            }
            if (mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.left = (mouseX - deltaX) + 'px';
            }

        } else {
            $scope.contex.text_select = false;
            $scope.contex.objects = [];
            $scope.contex.selected = null;
        }

    };
    $scope.upload_file_duty = function () {

        factory1.upload_file($scope, $scope.acs.duties_file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx', 'application/x-zip-compressed', 'application/zip'], false, null, null).then(function (data) {
            console.log(data);
            $scope.acs.duties_b64 = data;
            $scope.acs.duties_send_at = $scope.get_miladi_date();

        });


    };
    $scope.add_users = function () {
        var l = $scope.acs.acs_users.length;
        if (l) {
            if (!$scope.acs.acs_users[l - 1].user_id || !$scope.acs.acs_users[l - 1].post_in_acs || !$scope.acs.acs_users[l - 1].post_in_acs.length) {
                $scope.warning('لطفاً مشخصات فرد مورد نظر را بدرستی وارد کنید.');
                return false;
            }
        }

        $scope.acs.acs_users.push({});
    };
    $scope.save_acs_file = function () {
        var parameter = JSON.stringify({
            id: $scope.acs.id,
            has_file: $scope.acs.b64.length > 0 || $scope.acs.duties_b64.length > 0,
            file: $scope.acs.b64.length > 0 ? $scope.acs.b64 : null,
            duties: $scope.acs.duties_b64.length > 0 ? $scope.acs.duties_b64 : null,
            acs_users: $scope.acs.acs_users.map(function (itm) {
                /* itm.file=itm.b64;*/
                /* itm.has_file=itm.b64.length>0;*/
                if (itm.user_duty) {
                    itm.pin = 0;
                    itm.user_duty = [];
                    itm.file_ = null;
                }

                /*itm.b64='';*/
                return itm;
            }),
            year: $rootScope.year
        });
        $http.post(Server_URL + '/v1/user/hospital/acs', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.success_alert('سامانه فرماندهی حادثه با موفقیت ثبت شد.', 'ثبت سامانه فرماندهی حادثه');
                $scope.acs.b64 = '';
                $scope.acs.duties_b64 = '';
                setACS(data);

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.save_acs = function () {
        var users = [];
        $scope.acs.acs_users.map(function (itm) {
            if (itm.duty && itm.duty.length) {
                users.push({
                    duty: itm.duty,
                    ac_id: itm.ac_id,
                    has_file: false,
                    id: itm.id,
                    cell_phone: itm.cell_phone,
                    address: itm.address,
                    post_in_acs: itm.post_in_acs,
                    subsets: itm.subsets,
                    user_id: itm.user_id
                });
            }

        });
        if (users.length === $scope.acs.acs_users.length) {
            /*if ($scope.acs_model_result.model && $scope.acs_model_result.model.length) {*/
            var parameter = JSON.stringify({
                has_file: false,
                acs_users: users,
                flowchart: $scope.acs_model_result.model && $scope.acs_model_result.model.length ? JSON.stringify($scope.acs_model_result.model) : null,
                year: $rootScope.year,
                id: $scope.acs.id
            });
            $http.post(Server_URL + '/v1/user/hospital/acs', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('سامانه فرماندهی حادثه با موفقیت ثبت شد.', 'ثبت سامانه فرماندهی حادثه');
                    setACS(data);
                    $scope.get_model($scope.acs.acs_users);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });
            /* } else {
                 $scope.warning('لطفاً سامانه فرماندهی را تدوین نمایید.');
             }*/
        } else {
            $scope.warning('لطفاً شرح وظایف افراد را بدرستی وارد کنید.');
        }


    };
    $scope.get_model = function (Tusers, reset) {

        model = reset ? [] : angular.copy($scope.acs_model_result.model);
        Tusers.forEach(function (user, index) {
            var new_user = user;
            if (!reset)
                model.map(function (m) {
                    if (m.shape == 'acs' && user.user_id == m.user.user_id) {

                        new_user = null;
                        m.user = user;
                        m.user._user = $scope.get_user(user.user_id, $scope.users);
                    }
                });
            if (new_user) {
                var res = {user: user};
                res.user._user = $scope.get_user(user.user_id, $scope.users);
                var color = $scope.set_color(index, arr_color);
                var i = index + 1;
                arr_color.push(color);
                res.x1 = (i * 10) + 10;
                res.y1 = (i * 10) + 10;
                res.x2 = (i * 10) + 210;
                res.y2 = (i * 10) + 110;
                res.width = 200;
                res.height = 100;
                res.back_color = color;
                res.color = color;
                res.font = '13px iransans';
                res.shape = 'acs';
                res.clickX = [];
                res.clickY = [];
                res.clickX.push(res.x1);
                res.clickX.push(res.x2);
                res.clickY.push(res.y1);
                res.clickY.push(res.y2);
                res.gravity = {x: 0, y: 0};
                model.push(res);
            }

        });
        $scope.acs_model = model;


    };
    $scope.open_successor = function (e) {
        if (e.selected && e.selected[0].user) {
            $scope.acs.acs_users.forEach(function (usr) {
                if (usr.user_id === e.selected[0].user.user_id) {

                    setTimeout(function () {
                        $scope.open_description(usr);
                    }, 300);
                }
            });

        }
        e.mouse.e.preventDefault();
        return false;
    };
    $scope.open_description = function (row) {
        var l = $scope.acs.acs_users.indexOf(row);
        $scope.user_index = l;
        if (!$scope.acs.acs_users[l].user_id || !$scope.acs.acs_users[l].post_in_acs || !$scope.acs.acs_users[l].post_in_acs.length) {
            $scope.warning('لطفاً مشخصات فرد مورد نظر را بدرستی وارد کنید.');
            return false;
        }
        $scope.detail = angular.copy(row);
        $scope.this_duty = {
            title: '',
            description: '',
            id: null
        };
        if (!row.duty || !row.duty.length) {
            $scope.detail.duty = [];
            for (var i = 0; i < $scope.all_dutys.length; i++) {

                $scope.detail.duty.push({title: $scope.all_dutys[i].title, id: $scope.all_dutys[i]._id});
            }
            $scope.this_duty.title = $scope.all_dutys[0].title;
            $scope.this_duty.id = $scope.all_dutys[0]._id;
        } else {
            $scope.this_duty = row.duty[0];
        }

        $scope.open_description_modal = $scope.open_modal('lg', 'duty.html', null, null, 'blue_modal', $scope, true);

    };
    $scope.choose_this_duty = function (row) {

        $scope.detail.duty.map(function (d, i) {
            if (d.title === $scope.this_duty.title) {
                d.description = angular.copy($scope.this_duty.description);
                d.id = angular.copy($scope.this_duty.id);
            }
        });
        $scope.this_duty.title = row.title;
        $scope.this_duty.description = '';
        console.log(row)
        $scope.this_duty.id = row._id;
        if ($scope.detail.duty && $scope.detail.duty.length) {
            $scope.detail.duty.forEach(function (d) {
                if (d.title === row.title) {
                    $scope.this_duty.description = angular.copy(d.description);
                    $scope.this_duty.id = angular.copy(d.id);
                }

            });

        }
    };
    $scope.next_duty = function () {
        if ($scope.this_duty.description !== '') {
            $scope.detail.duty.map(function (d, i) {
                if (d.title === $scope.this_duty.title) {
                    d.description = angular.copy($scope.this_duty.description);
                    d.id = angular.copy($scope.this_duty.id);
                    if (i < $scope.detail.duty.length - 1)
                        $scope.choose_this_duty($scope.detail.duty[i + 1]);


                }
            });

        } else {
            $scope.warning('لطفاً شرح مسئولیت را وارد کنید.');
        }
    };
    $scope.save_dutys = function () {
        $scope.next_duty();
        var all = $scope.detail.duty.every(function (itm) {
            if (itm.description && itm.description.length) {
                return true;
            }
        });
        if (all) {

            $scope.acs.acs_users[$scope.user_index].duty = $scope.detail.duty;
            $scope.close();

        } else {
            $scope.warning('لطفاً تمام وظایف را مشخص نمایید.');
        }

    };
    $scope.add_acs_user_to_chart = function () {

        $scope.save_acs();
    };
    $scope.delete_acs_user = function (row) {
        $scope.question('آیا از حذف شخص مورد نظر از لیست سامانه فرماندهی حادثه مطمئن هستید؟', 'حذف ');
        $scope.q_result.result.then(function (r) {

            if (r) {
                $scope.acs.acs_users.splice($scope.acs.acs_users.indexOf(row), 1);
                $scope.get_model($scope.acs.acs_users, true);
                $scope.save_acs_file();
            }
        });
    };
    $scope.close = function () {
        $scope.open_description_modal.dismiss();
    };
    $scope.delete_acs_file = function () {
        $scope.acs.file = '';
        $scope.acs.b64 = '';
        $scope.acs.has_file = false;
    };
    factory1.getUserApi('/v1/user/hospital/duty_defaults').then(function (data) {
        $scope.all_dutys = data;
    });
    factory1.getUserApi('/v1/user/hospital/acs').then(function (data) {
        setACS(data);
    });
    angular.element(document).ready(function () {
        element = angular.element('.abi_btn_wrapper canvas');
        angular.element(document).on('click', element, function (event) {
            var isClickedElementChildOfPopup = element.parent()
                .find(event.target)
                .length > 0;
            if (isClickedElementChildOfPopup)
                return;
            if ($scope.contex.text_select) {
                $scope.contex.text_select = false;
                $scope.contex.selected = null;
            }
            $scope.$apply();
            /*$scope.$apply(function(){

             });*/
        });

    });
});

app.controller('meter_and_enerators_and_UPS_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope) {

    $scope.sa = {
        file1: '',
        file2: ''
    };
    $scope.posts = [{text: ''}, {text: ''}];
    $scope.generators = [];
    $scope.generator = {
        name: '',
        fuel_type: '',
        output_power: '',
        nominal_power: '',
        amp: '',
        image: '',
        file: '',
        id: '',
        index: -1
    };
    $scope.ups = {
        ward_name: '',
        normal_outlet: 0,
        ups_outlet: 0,
        emergency_outlet: 0,
        editable: null

    };
    $scope.post = {
        file: '',
        b64: ''
    };
    $scope.power_stations = {};

    $scope.outlate = [];
    $scope.o_index = -1;

    $scope.selected_users = [];
    $scope.drow_post = true;
    $scope.map = {
        file: '',
        b64_file: '',
        model: [],
        paper: '700*700',
        options: {
            shape: 'circle',
            fill: '#f00'

        },
        init: []
    };
    $scope.contex = {
        text_select: false,
        objects: [],
        selected: false
    };
    $scope.canvase = {
        width: 700,
        height: 700
    };
    $scope.zoom = 0;
    $scope.generator_show = false;
    $scope.config_set3 = false;
    $scope.config_set = false;
    $scope.toggle_config_set = function () {
        $scope.config_set = !$scope.config_set
    };
    $scope.toggle_generator_show = function () {
        if ($scope.generator_show) {
            $scope.cancel();
        } else {
            $scope.generator_show = true;
        }

    };
    $scope.toggle_config_set3 = function () {
        if ($scope.config_set3) {
            $scope.cancel_edit_ups();
        } else {
            $scope.config_set3 = true;
        }


    };
    $scope.right_click_on_map = function (e) {
        console.log(e);
    };
    $scope.point_drow = function (flag) {

        $scope.map.options.shape = 'circle';
        $scope.drow_post = flag;
        $scope.map.options.fill = flag ? '#f00' : '#fff';

    };
    $scope.paper_change = function () {
        if ($scope.map.paper === 'A3') {
            $scope.canvase.width = 3508;
            $scope.canvase.height = 4961;
        } else if ($scope.map.paper === 'A4') {
            $scope.canvase.width = 2480;
            $scope.canvase.height = 3508;
        } else if ($scope.map.paper === 'A5') {
            $scope.canvase.width = 1748;
            $scope.canvase.height = 2480;
        } else if ($scope.map.paper === 'A6') {
            $scope.canvase.width = 1240;
            $scope.canvase.height = 1748;
        } else {
            $scope.canvase.width = 700;
            $scope.canvase.height = 700;
        }
    };
    $scope.zoomIn = function () {
        if ($scope.zoom < 10) {
            $scope.zoom++;
        }
    };
    $scope.zoomOut = function () {
        if ($scope.zoom > -10) {
            $scope.zoom--;
        }
    };
    $scope.open_contex = function (data) {
        if (data) {
            $scope.contex.text_select = true;
            $scope.contex.objects = data.selected;

            var mouseX = data.mouse.x;
            var mouseY = data.mouse.y;
            element = angular.element(data.mouse.e.currentTarget);
            var height = element.parent().find('.context_menu')[0].height;
            var width = element.parent().find('.context_menu')[0].width;
            var deltaX = $scope.canvase.width - width;
            var deltaY = $scope.canvase.height - height;
            element.parent().find('.context_menu')[0].style.top = (mouseY + 20) + 'px';
            element.parent().find('.context_menu')[0].style.left = (mouseX + 20) + 'px';
            if (mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top left';
            }
            if (mouseY > deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom right';
            }
            if (mouseY > deltaY && mouseX < deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'bottom left';
            }
            if (mouseY < deltaY && mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.transformOrigin = 'top right';
            }

            if (mouseY > deltaY) {
                element.parent().find('.context_menu')[0].style.top = (mouseY - deltaY) + 'px';

            }
            if (mouseX > deltaX) {
                element.parent().find('.context_menu')[0].style.left = (mouseX - deltaX) + 'px';
            }

        } else {
            $scope.contex.text_select = false;
            $scope.contex.objects = [];
            $scope.contex.selected = null;
        }

    };
    $scope.generator_file_upload = function () {
        factory1.upload_file($scope, $scope.generator.file, 20000000, ['image/png', 'image/jpeg', 'image/jpg'], true, false, 'rectangle').then(function (data) {
            $scope.generator.image = data;
        });
    };
    $scope.save_generator = function () {
        if ($scope.generator.name.length) {
            if ($scope.generator.fuel_type.length) {
                var parameter = JSON.stringify({
                    name: $scope.generator.name,
                    fuel_type: $scope.generator.fuel_type,
                    output_power: $scope.generator.output_power,
                    nominal_power: $scope.generator.nominal_power,
                    amp: $scope.generator.amp,
                    image: $scope.generator.image,
                    year: $rootScope.year
                });
                $http.post(Server_URL + '/v1/user/hospital/electrical/generator', parameter, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('اطلاعات ژنراتور با موفقیت افزوده شد.', 'ثبت ژنراتور');
                        $scope.generators.push(data);
                        $scope.cancel();
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            } else {
                $scope.warning('لطفاً نوع سوخت ژنراتور را وارد کنید.');
            }
        } else {
            $scope.warning('لطفاً نام ژنراتور را وارد کنید.');
        }

    };
    $scope.update_generator = function () {
        var parameter = JSON.stringify({
            name: $scope.generator.name,
            fuel_type: $scope.generator.fuel_type,
            output_power: $scope.generator.output_power,
            nominal_power: $scope.generator.nominal_power,
            amp: $scope.generator.amp,
            image: $scope.generator.image,
            id: $scope.generator.id
        });
        $http.put(Server_URL + '/v1/user/hospital/electrical/generator', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                console.log(data);
                $scope.success_alert('اطلاعات ژنراتور با موفقیت به روزرسانی شد.', 'به روزرسانی ژنراتور');
                $scope.generators[$scope.generator.index] = data;
                $scope.cancel();
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.delete_generator = function (row) {
        $scope.question('آیا از حذف ژنراتور مورد نظر مطمئن هستید؟', 'حذف ژنراتور');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/electrical/generator/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('اطلاعات ژنراتور با موفقیت حذف شد.', 'حذف ژنراتور');
                        $scope.generators.splice($scope.generators.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });

    };
    $scope.edit_generator = function (e) {
        var row = angular.copy(e);
        $scope.generator.index = $scope.generators.indexOf(e);
        $scope.generator.name = row.name;
        $scope.generator.fuel_type = row.fuel_type;
        $scope.generator.output_power = row.output_power;
        $scope.generator.nominal_power = row.nominal_power;
        $scope.generator.amp = row.amp;
        $scope.generator.image = null;
        $scope.generator.file = '';
        $scope.generator.id = row.id;
        $scope.generator_show = true;
        $scope.generator_edit = true;
    };
    $scope.cancel = function () {
        $scope.generator.name = '';
        $scope.generator.fuel_type = '';
        $scope.generator.output_power = '';
        $scope.generator.nominal_power = '';
        $scope.generator.amp = '';
        $scope.generator.image = '';
        $scope.generator.file = '';
        if ($scope.generator_show)
            $scope.generator_show = false;
        $scope.generator_edit = false;
    };
    $scope.show_day_of_month = function (name) {
        $scope.days = [];
        var i = 1;
        $scope.active_month = name;
        if (name === 'فروردین' || name === 'اردیبهشت' || name === 'خرداد' || name === 'تیر' || name === 'مرداد' || name === 'شهریور') {
            for (i = 1; i <= 31; i++) {
                $scope.days.push(i);
            }
        } else {
            if (name === 'اسفند' && !moment.jIsLeapYear(moment().jYear())) {
                for (i = 1; i <= 29; i++) {
                    $scope.days.push(i);
                }
            } else {
                for (var i = 1; i <= 30; i++) {
                    $scope.days.push(i);
                }
            }
        }
    };
    $scope.upload_file_doc = function (type) {
        if (type === '1') {
            factory1.upload_file($scope, $scope.sa.file1, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, '/v1/user/hospital/confirmation1', null).then(function (data) {
                console.log(data);
                $scope.confirmation = data;
            });
        } else {
            factory1.upload_file($scope, $scope.sa.file2, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, '/v1/user/hospital/confirmation2', null).then(function (data) {
                console.log(data);
                $scope.confirmation = data;
            });
        }
    };
    $scope.add_post = function () {
        var l = $scope.posts.length;
        console.log($scope.posts);
        if ($scope.posts[l - 1].text.length && $scope.posts[l - 2].text.length) {
            $scope.posts.push({text: ''});
        } else {
            $scope.warning('لطفاً اطلاعات پست ها را وارد کنید.');
        }
    };
    $scope.save_post = function () {
        var temp = $scope.posts.filter(function (itm) {
            if (itm.text.length) {
                return itm.text;
            }
        });
        if (temp.length >= 2) {
            if ($scope.post.b64.length) {

                var parameter = JSON.stringify({
                    post_name: temp,
                    file: $scope.post.b64,
                    year: $rootScope.year
                });
                $http.post(Server_URL + '/v1/user/hospital/power_station', parameter, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('اطلاعات شبکه انتقال برق شهری با موفقیت افزوده شد.', 'ثبت اطلاعات شبکه انتقال برق شهری');
                        $scope.power_stations = data;
                        $scope.map.options.background_image = Server_URL + $scope.power_stations.map;
                        $scope.toggle_config_set();
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });

            } else {
                $scope.warning('لطفاً تصویر نقشه را انتخاب کنید.');
            }
        } else {
            $scope.warning('لطفاً حداقل دو پست را وارد کنید.');
        }

    };
    $scope.post_file_upload = function () {
        factory1.upload_file($scope, $scope.post.file, 20000000, ['image/png', 'image/jpeg', 'image/jpg'], true, false, 'rectangle').then(function (data) {
            $scope.post.b64 = data;
        });
    };
    $scope.save_power_station = function () {
        var parameter = JSON.stringify({
            id: $scope.power_stations.id,
            roadmap: JSON.stringify($scope.map.model),
            year: $rootScope.year
        });
        $http.put(Server_URL + '/v1/user/hospital/power_station', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                console.log(data);
                $scope.success_alert('نقشه شبکه انتقال برق شهری با موفقیت ثبت شد.', 'ثبت نقشه شبکه انتقال برق شهری');

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.select_ward = function (ward_name) {
        $scope.outlate.forEach(function (ward) {
            if (ward.ward_name == ward_name) {
                $scope.edit_outlate(ward);
            }
        });
    };
    $scope.edit_outlate = function (row) {
        $scope.o_index = $scope.outlate.indexOf(row);
        $scope.ups.editable = angular.copy(row);
        $scope.ups.ward_name = row.ward_name;
        $scope.ups.normal_outlet = row.normal_outlet;
        $scope.ups.ups_outlet = row.ups_outlet;
        $scope.ups.emergency_outlet = row.emergency_outlet;
        $scope.config_set3 = true;
    };
    $scope.update_ups = function () {
        var parameter = JSON.stringify({
            id: $scope.ups.editable.id,
            ward_name: $scope.ups.ward_name,
            normal_outlet: $scope.ups.normal_outlet,
            ups_outlet: $scope.ups.ups_outlet,
            emergency_outlet: $scope.ups.emergency_outlet
        });
        $http.put(Server_URL + '/v1/user/hospital/outlate', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                console.log(data);
                $scope.success_alert('اطلاعات مربوط پریز‌های برق اضطراری با موفقیت به روزرسانی شد.', 'به روزرسانی اطلاعات مربوط پریز‌های برق اضطراری');
                $scope.outlate[$scope.o_index] = data;
                $scope.o_index = -1;
                $scope.ups.ward_name = '';
                $scope.ups.normal_outlet = 0;
                $scope.ups.ups_outlet = 0;
                $scope.ups.emergency_outlet = 0;
                $scope.config_set3 = false;
                $scope.ups.editable = false;

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.cancel_edit_ups = function () {
        $scope.outlate[$scope.o_index] = $scope.ups.editable;
        $scope.o_index = -1;
        $scope.ups.ward_name = '';
        $scope.ups.normal_outlet = 0;
        $scope.ups.ups_outlet = 0;
        $scope.ups.emergency_outlet = 0;
        if ($scope.config_set3)
            $scope.config_set3 = false;
    };
    $scope.delete_outlate = function (row) {
        $scope.question('آیا از حذف اطلاعات مربوط پریز‌های برق اضطراری بخش مورد نظر مطمئن هستید؟', 'حذف اطلاعات مربوط پریز‌های برق اضطراری');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/outlate/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.success_alert('اطلاعات مربوط پریز‌های برق اضطراری با موفقیت حذف شد.', 'حذف اطلاعات مربوط پریز‌های برق اضطراری');
                        $scope.outlate.splice($scope.outlate.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.save_ups = function () {
        if ($scope.ups.ward_name.length) {

            var parameter = JSON.stringify({
                ward_name: $scope.ups.ward_name,
                normal_outlet: $scope.ups.normal_outlet,
                ups_outlet: $scope.ups.ups_outlet,
                emergency_outlet: $scope.ups.emergency_outlet,
                year: $rootScope.year
            });
            $http.post(Server_URL + '/v1/user/hospital/outlate', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    console.log(data);
                    $scope.success_alert('اطلاعات مربوط پریز‌های برق اضطراری با موفقیت افزوده شد.', 'ثبت اطلاعات مربوط پریز‌های برق اضطراری');
                    $scope.outlate.push(data);
                    $scope.ups = {
                        ward_name: '',
                        normal_outlet: 0,
                        ups_outlet: 0,
                        emergency_outlet: 0

                    };
                    $scope.config_set3 = false;
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });

        } else {
            $scope.warning('لطفاً نام بخش را انتخاب کنید.');
        }
    };
    if ($state.$current.self.name === "Electric_power_distribution_system_control")
        factory1.getUserApi('/v1/user/hospital/confirmations').then(function (data) {
            $scope.confirmation = data;
        });
    if ($state.$current.self.name === "meter_and_enerators_and_UPS") {
        factory1.getUserApi('/v1/user/hospital/electrical/generators').then(function (data) {
            $scope.generators = data;
        });

        factory1.getUserApi('/v1/user/hospital/outlates').then(function (data) {
            $scope.outlate = data;
        });
        factory1.getUserApi('/v1/user/hospital/power_station').then(function (data) {
            $scope.power_stations = data;
            $scope.map.options.background_image = Server_URL + $scope.power_stations.map;

            if (data.roadmap) {
                $scope.map.init = JSON.parse(data.roadmap);
            }
        });

    }


});

app.controller('medical_gases_Ctrl', function ($scope, factory1) {
    $scope.sa = {
        file1: '',
        file2: ''
    };
    $scope.upload_file_doc = function (type) {
        if (type === '1') {
            factory1.upload_file($scope, $scope.sa.file1, 200000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, '/v1/user/hospital/gas/file1', null).then(function (data) {
                console.log(data);
                $scope.gass = data;
            });
        } else {
            factory1.upload_file($scope, $scope.sa.file2, 200000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, '/v1/user/hospital/gas/file2', null).then(function (data) {
                console.log(data);
                $scope.gass = data;
            });
        }
    };

    $scope.selected_users = [];
    factory1.getUserApi('/v1/user/hospital/gases').then(function (data) {
        $scope.gass = data[0];
    });

});

app.controller('Monitoring_and_control_of_central_oxygen_in_hospitals_Ctrl', function ($scope, $rootScope) {
    $scope.header = false;
    $scope.compressor_visit = [{
        text: 'نقطه شبنم', checked: false
    }, {
        text: 'میزان روغن', checked: false
    }, {
        text: 'فشار تانک هوا', checked: false
    }, {
        text: 'دمای کمپرسور', checked: false
    }, {
        text: 'تخلیه درین دستی (15 ثانیه)', checked: false
    }];
    $scope.oxygen_generator = [
        {text: 'فشار اکسیژن خروجی', checked: false},
        {text: 'کنترل فشار گیج‌های مولد', checked: false},
        {text: 'نظافت روزانه  اتاق', checked: false},
        {text: 'تخلیه درین دستی (15 ثانیه)', checked: false}

    ];
    $scope.oxygen_machine_maker = [
        {text: 'حداکثر فشار (PSI)', checked: false},
        {text: 'ساعت کارکرد (Hrs)', checked: false},
        {text: 'استارت موتور', checked: false},
        {text: 'فشار خروجی کمپرسور (Psi)', checked: false},
        {text: 'درصد خلوص اکسیژن (%)', checked: false},
        {text: 'دمای خروجی (C`)', checked: false},
        {text: 'دمای محیط (C`)', checked: false},
        {text: 'جریان مصرفی (A)', checked: false}

    ];
    $scope.central_oxygen = [{
        name: '',
        checklists: ['بازدید کمپرسور', 'بازدید مولد اکسیژن', 'بازدید دستگاه اکسیژن ساز']
    }];
});

app.controller('continuous_management_of_hospital_processes_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope, $filter, $timeout) {

    $scope.template = {url: ''};
    $scope.config_set = false;
    $scope.check_list = {
        title: "",
        number: "",
        goal: "",
        rating_type: "",
        rate_guide: "",
        status: "",
        wards: [
            {
                ward_name: "",
                operator: "",
                delivery_type: ""
            }
        ],
        checklists: [
            {
                checked: true,
                key: ""
            }
        ],
        how_rate: [
            {
                rating_type: "",
                guides: [
                    {
                        guide: "",
                        value: ""
                    }
                ]
            }
        ],
    };
    $scope.is_parent = true;
    $scope.reset_steps();
    $scope.processes = [];
    $scope.indicators = [];
    $scope.process = {
        title: '',
        registration_date: '',
        revise_date: '',
        indicators: [],
        process_type: '',
        process_number: ''
    };
    $scope.req = {
        file: ''
    };
    $scope.config_set = false;
    $scope.flowchart = {
        file: '',
        file_b64: '',
        file_name: ''
    };
    $scope.flowcharts = [];
    $scope.filter = {
        process_type: '',
        indicator_type: '',
        C_to: '',
        C_from: '',
        keyword: ''
    };
    $scope.upload = null;

    $scope.page=1;
    function setStatus(row) {
        if (row.send_kartabl && !row.hospital_process_answers) {
            return '3';
        } else if (!row.send_kartabl) {
            return '1';
        } else {
            return '5';
        }
    }

    function set_checklist_forms() {
        if ($scope.selected_prosess.hospital_process_form) {
            $scope.selected_prosess.hospital_process_form.forEach(function (itm) {
                itm.form_id = itm._id;
                if (itm.hospital_process_form_wards) {
                    itm.hospital_process_form_wards.forEach(function (ward) {
                        $scope.hospital_process_form.push(angular.merge(angular.copy(itm), ward));
                    });
                } else {
                    $scope.hospital_process_form.push(itm);
                }


            });
            $scope.hospital_process_form.map(function (itm) {
                itm.status = setStatus(itm);
                //itm.status=itm.send_kartabl && !itm.answer?'3':(!itm.send_kartabl?'1':'5');

            });
        }

    }

    function set_calender() {

        var answers = $scope.indicator_answer_details ? $scope.indicator_answer_details : [];
        if (answers.length) {
            answers.map(function (itm) {
                if (itm.hospital_process_answer_details) {
                    itm.value = 0;
                    itm.hospital_process_answer_details.map(function (d) {
                        itm.value = $scope.operator["+"](itm.value, d.value);
                    });
                    itm.value = (itm.value / itm.hospital_process_answer_details.length).toFixed(2);
                }

            });
        }
        var calender_type = $scope.hospital_process_form_ward.delivery_type;
        $scope.calenders = [];
        var repeat_count = 0;
        if (calender_type === 'روزانه') {
            repeat_count = 12;
        } else if (calender_type === 'هفتگی') {
            repeat_count = 52;
        } else if (calender_type === 'ماهانه') {
            repeat_count = 12;
        } else if (calender_type === 'سه ماه یکبار') {
            repeat_count = 4;
        } else if (calender_type === 'شش ماه یکبار') {
            repeat_count = 2;
        } else if (calender_type === 'سالانه') {
            repeat_count = 1;
        }
        $scope.calenders = $scope.new_Array(repeat_count, {});

        $scope.calenders.map(function (itm, i) {

            if (calender_type === 'روزانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at_month = i + 1;
                itm.header_type = 'ماه';
                itm.days = $scope.get_day_of_month(i + 1, $rootScope.year);

            } else if (calender_type === 'هفتگی') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'هفته';
            } else if (calender_type === 'ماهانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at = i + 1;
                itm.header_type = 'ماه';

            } else if (calender_type === 'سه ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'سه ماهه';
            } else if (calender_type === 'شش ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'شش ماهه';
            } else if (calender_type === 'سالانه') {
                itm.header = $rootScope.year;
                itm.submitted_at = $rootScope.year;
                itm.header_type = 'سال';
            }

            if (calender_type !== 'روزانه') {
                answers.map(function (a) {
                    if (a.submitted_at == i + 1 || a.submitted_at == itm.submitted_at) {
                        itm.answer = a;
                        a.value = parseFloat(a.value);

                        itm.status_class = i && $scope.calenders[i - 1].answer ? (a.value < $scope.calenders[i - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes') : '';
                    }
                });
            } else {
                itm.days_object = [];
                for (var d = 0; d < itm.days.length; d++) {
                    itm.days_object.push({submitted_at: moment($rootScope.year + '/' + itm.submitted_at_month + '/' + itm.days[d], 'jYYYY/jM/jD').jDayOfYear()})
                }

                answers.map(function (a) {
                    itm.days_object.map(function (day, d) {

                        if (a.submitted_at == day.submitted_at) {
                            day.answer = a;
                            a.value = parseFloat(a.value);

                            if (d && itm.days_object[d - 1].answer) {
                                day.status_class = a.value < itm.days_object[d - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                            } else {
                                if (day.submitted_at > 1) {
                                    var last_month = $scope.calenders[i - 1].days_object;
                                    if (last_month[last_month.length - 1].answer)
                                        day.status_class = a.value < last_month[last_month.length - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                                }

                            }

                        }
                    });

                });

            }
        });
    }

    $scope.upload_flowchart = function () {
        factory1.upload_file($scope, $scope.flowchart.file, 20000000, ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/docx'], false, null, false).then(function (data) {
            var parameter = JSON.stringify({
                id: $scope.selected_prosess._id,
                file: data,
                file_name: $scope.flowchart.file.filename
            });
            $http.post(Server_URL + '/v1/user/hospital/process/upload_flowchart', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('فلوچارت فرآیند' +
                        ' ' + $scope.selected_prosess.title +
                        ' با موفقیت بارگذاری شد.', 'ثبت فلوچارت فرآیند');
                    $scope.flowcharts.push(data);
                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });

        });
    };
    $scope.delete_flowchart = function (row) {
        $scope.question('آیا از حذف فلوچارت فرآیند مورد نظر مطمئن هستید؟', 'حذف فلوچارت فرآیند');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/process/flowchart/' + row.id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.success_alert('فلوچارت فرآیند مورد نظر با موفقیت حذف شد.', 'حذف فلوچارت فرآیند');
                        $scope.flowcharts.splice($scope.flowcharts.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.delete_checklist = function (row) {
        $scope.question('آیا از حذف چک لیست فرآیند مورد نظر مطمئن هستید؟', 'حذف چک لیست فرآیند');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/process/checklist/' + row._id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.success_alert('چک لیست فرآیند مورد نظر با موفقیت حذف شد.', 'حذف چک لیست فرآیند');
                        $scope.hospital_process_form.splice($scope.hospital_process_form.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });
    };
    $scope.next = function (step) {

        if (step === 1) {
            if ($scope.check_list.title.length) {
                if ($scope.check_list.number.length) {
                    if ($scope.check_list.goal.length) {
                        console.log($scope.check_list);
                    } else {
                        $scope.warning('لطفاً هدف چک لیست را وارد کنید.');
                        return false;
                    }
                } else {
                    $scope.warning('لطفاً شماره چک لیست را وارد کنید.');
                    return false;
                }
            } else {
                $scope.warning('لطفاً عنوان چک لیست را وارد کنید.');
                return false;
            }
        } else if (step === 2) {
            var q = [];
            q = $scope.check_list.checklists.filter(function (itm) {
                if (itm.checked && itm.key && itm.key.length) {
                    return itm;
                }
            });
            if (q.length) {
                $scope.check_list.checklists = angular.copy(q);
            } else {
                $scope.warning('لطفاً سوالات چک لیست را وارد کنید.');
                return false;
            }
        } else if (step === 3) {
            if ($scope.check_list.how_rate && $scope.check_list.how_rate[0].rating_type && $scope.check_list.how_rate[0].rating_type.length) {
                var guids = [];
                guids = $scope.check_list.how_rate[0].guides.filter(function (itm) {
                    if (itm.value && itm.value.length) {
                        return itm;
                    }
                });
                if (guids.length) {
                    console.log($scope.check_list.how_rate);
                } else {
                    $scope.warning('لطفاً مقادیر امتیازات را به درستی وارد کنید.');
                    return false;
                }
            } else {
                $scope.warning('لطفاً نوع امتیازدهی به سوالات چک لیست را مشخص کنید.');
                return false;
            }
        }
        $scope.steps.push(step);

    };
    $scope.cancel = function () {
        $scope.reset_steps();
    };
    $scope.last = function (step) {
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
    $scope.open_indicators = function () {
        $scope.indicator_filter = {
            keyword: '',
        }
        $scope.indicators.map(function (itm) {

            itm.selected = false;

        });
        if ($scope.process.indicators)
            $scope.process.indicators.forEach(function (indicator) {
                $scope.indicators.map(function (itm) {
                    if ((itm.id && itm.id === indicator.id) || itm.id === indicator) {
                        itm.selected = true;
                    }
                });

            });

        $scope.open_modal('lg', 'process_indicators.html', null, null, 'blue_modal full_width', $scope, true);
    };
    $scope.choose_indicators = function () {
        $scope.process.indicators = [];
        $scope.indicators.forEach(function (itm) {
            if (itm.selected) {
                $scope.process.indicators.push(itm);
            }
        });
        $scope.close();
    };
    /*  $scope.open_process = function () {
          $scope.indicators.map(function (itm) {

              itm.selected = false;

          });
          $scope.process.indicators.forEach(function (indicator) {
              $scope.indicators.map(function (itm) {
                  if (itm._id === indicator._id || (itm.id && itm.id === indicator.id) || itm._id === indicator || itm.id === indicator) {
                      itm.selected = true;
                  }
              });

          });
          $scope.indicators_copy = angular.copy($scope.indicators);
          $scope.process_indicators = $scope.open_modal('lg', 'process_indicators.html', null, null, 'blue_modal full_width', $scope, true);
      };
      $scope.choose_indicators = function () {
          $scope.process.indicators = [];
          $scope.indicators.forEach(function (itm) {
              if (itm.selected) {
                  $scope.process.indicators.push(itm._id || itm.id);
              }
          });
          $scope.close();
      };*/
    $scope.close = function (flag) {
        $scope.close_modal();
        if (flag) {
            $scope.indicators = angular.copy($scope.indicators_copy);
        }

    };
    $scope.config_process = function () {
        if ($scope.config_set) {

            $scope.reset_params($scope.process);
            $scope.config_set = false;

        } else {
            $scope.config_set = true;
        }
    };
    $scope.show_detail = function (row) {
        $scope.flowcharts = [];
        var res = factory1.getUserApi('/v1/user/hospital/process/flowcharts', '&id=' + row._id);
        res.then(function (data) {
            $scope.selected_prosess = row;
            $scope.flowcharts = data;
            $scope.hospital_process_form = [];
            $scope.reset_params($scope.check_list);
            $scope.compilation_checklist = false;
            $scope.reset_steps();
            set_checklist_forms();


            $scope.template.url = 'views/improve_quality/continuous_management_of_hospital_processes/view_process_details.htm';
            $scope.is_parent = false;
        });
        return res;
    };
    $scope.show_flowchart = function (row) {
        $scope.flowcharts = [];
        factory1.getUserApi('/v1/user/hospital/process/flowcharts', '&id=' + row._id).then(function (data) {
            $scope.upload = true;
            $scope.selected_prosess = row;
            $scope.flowcharts = data;
            $scope.hospital_process_form = [];
            $scope.reset_params($scope.check_list);
            $scope.compilation_checklist = false;
            $scope.reset_steps();
            set_checklist_forms();


            $scope.template.url = 'views/improve_quality/continuous_management_of_hospital_processes/view_process_details.htm';
            $scope.is_parent = false;
            $timeout(function () {
                var a = angular.element('#flowchart');
                if (a) {
                    $("html, body").animate({scrollTop: a.prop('scrollHeight') + 800}, "slow");
                    // window.scrollTo( 0,a.prop('scrollHeight') + 800);
                }
            }, 500)
        });

    };
    $scope.show_indicators = function (row) {
        $scope.selected_prosess = {
            indicators: angular.copy(row.indicators)
        }
        $scope.open_modal('lg', 'process_indicators_show.html', null, null, 'blue_modal full_width', $scope, true);
    }
    $scope.edit_process = function (row) {
        $scope.show_detail(row).then(function () {
            $scope.selected_prosess = angular.copy(row);
            $scope.selected_prosess_copy = angular.copy($scope.selected_prosess);
            $scope.process.title = $scope.selected_prosess.title;
            $scope.process.indicators = $scope.selected_prosess.indicators;
            $scope.process.process_type = $scope.selected_prosess.process_type;
            $scope.process.registration_date = $scope.get_date($scope.selected_prosess.registration_date);
            $scope.process.revise_date = $scope.get_date($scope.selected_prosess.revise_date);
            $scope.process.id = $scope.selected_prosess._id;
            $scope.template.url = 'views/improve_quality/continuous_management_of_hospital_processes/edit_process.htm';

        })

    };
    $scope.cancel_save_process = function () {
        $scope.selected_prosess = angular.copy($scope.selected_prosess_copy);
        $scope.template.url = 'views/improve_quality/continuous_management_of_hospital_processes/view_process_details.htm';
    };
    $scope.update_process = function () {
        var parameter = JSON.stringify({
            title: $scope.process.title,
            id: $scope.process.id,
            registration_date: $scope.get_miladi_date($scope.process.registration_date),
            revise_date: $scope.get_miladi_date($scope.process.revise_date),
            indicators: $scope.process.indicators.map(function (value) {
                return value.id
            }),
            process_type: $scope.process.process_type
        });
        $http.put(Server_URL + '/v1/user/hospital/process', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                var inds = [];
                data.indicators.map(function (itm) {
                    $scope.indicators.map(function (ind) {
                        if (ind._id === itm) {
                            inds.push(ind);
                        }
                    })
                });
                data.indicators = inds;
                $scope.selected_prosess = data;
                $scope.success_alert('فرآیند' +
                    ' ' + $scope.process.title +
                    ' با موفقیت به روزرسانی شد.', 'به روزرسانی فرآیند');

                $scope.get_process($scope.page);
                $scope.$parent.back_to_parent($scope)
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.change_rating_type = function () {
        if ($scope.check_list.how_rate[0].rating_type === 'دو سطحی') {
            $scope.check_list.how_rate[0].guides = [
                {value: '', guide: ''},
                {value: '', guide: ''}
            ];
        } else {
            $scope.check_list.how_rate[0].guides = [
                {value: '', guide: ''}
            ];
        }
    };
    $scope.save_check_list = function (flag) {
        var wards = [];
        var all_ward = $scope.check_list.wards.every(function (itm) {

            if (itm.ward_name.length && itm.operator !== '' && itm.delivery_type && itm.delivery_type !== '') {

                wards.push(itm);
                return true;
            }
        });
        if (!all_ward) {
            if (flag) {
                $scope.warning('لطفاً اطلاعات مورد نیاز را بدرستی تکمیل نمایید.');
                return false;
            } else {
                $scope.check_list.wards = wards;
            }

        }

        var parameter = JSON.stringify({
            save: !flag,
            process_id: $scope.selected_prosess._id,
            title: $scope.check_list.title,
            goal: $scope.check_list.goal,
            number: $scope.check_list.number,
            rating_type: $scope.check_list.how_rate[0].rating_type,
            wards: wards,
            checklists: $scope.check_list.checklists.filter(function (itm) {
                if (itm.checked)
                    return itm;
            }),
            how_rate: $scope.check_list.how_rate,
            id: $scope.check_list.id && $scope.check_list.id.length ? $scope.check_list.id : null,
            year: $rootScope.year
        });
        $http.put(Server_URL + '/v1/user/hospital/process/checklist', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {

                $scope.selected_prosess.hospital_process_form = data.hospital_process_form;
                $scope.hospital_process_form = [];
                set_checklist_forms();


                $scope.success_alert('چک لیست فرآیند ' +
                    '' + $scope.selected_prosess.title +
                    ' با موفقیت افزوده شد.', 'ثبت چک لیست فرآیند');
                $scope.toggle_compilation_checklist();

            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.add_question = function () {
        $scope.check_list.checklists.push({key: '', checked: true});
    };
    $scope.add_guid = function () {

        $scope.check_list.how_rate[0].guides.push({value: '', guide: ''});

    };
    $scope.add_ward = function () {
        $scope.check_list.wards.push({
                ward_name: "",
                operator: "",
                delivery_type: ""
            }
        );
    };
    $scope.toggle_compilation_checklist = function () {
        if ($scope.compilation_checklist) {
            $scope.compilation_checklist = false;
            $scope.reset_steps();
            $scope.reset_params($scope.check_list);
            $scope.check_list.checklists = [];

        } else {
            $scope.compilation_checklist = true;
        }
    };
    $scope.get_indicators = function () {
        factory1.getUserApi('/v2/indicator/compact').then(function (data) {
            $scope.indicators = data;
        });

    };
    $scope.get_process = function (page) {
        $scope.page=page;
        factory1.getUserApi('/v1/user/hospital/process','&page='+page).then(function (data) {
            $scope.processes = data;
        });
    };
   /* $scope.filterSentTo=function(send_to,old_selected){
        console.log(send_to,old_selected)
        return send_to.filter(function (id) {
            return old_selected.indexOf(id.toString())===-1;
        });
    };*/
    $scope.save_process = function () {
        var parameter = JSON.stringify({
            title: $scope.process.title,
            registration_date: $scope.get_miladi_date($scope.process.registration_date),
            revise_date: $scope.get_miladi_date($scope.process.revise_date),
            indicators: $scope.process.indicators.map(function (value) {
                return value.id
            }),
            process_type: $scope.process.process_type,
            year: $rootScope.year
        });
        $http.post(Server_URL + '/v1/user/hospital/process', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.success_alert('فرآیند' +
                    ' ' + $scope.process.title +
                    ' با موفقیت افزوده شد.', 'ثبت فرآیند');
                $scope.config_process();
                $scope.process = {
                    title: '',
                    registration_date: '',
                    revise_date: '',
                    indicators: [],
                    process_type: '',
                    process_number: ''
                };
                $scope.get_process($scope.page);
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.request_flowchart = function () {
        factory1.upload_file($scope, $scope.req.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, false, null).then(function (data) {
            $scope.req.b64_file = data;
            var parameter = JSON.stringify({
                id: $scope.selected_prosess._id,
                file: $scope.req.b64_file
            });
            $http.post(Server_URL + '/v1/user/hospital/process/help', parameter, {headers: $scope.queryHeaders})
                .success(function (data, status, headers) {
                    $scope.success_alert('فرآیند' +
                        ' ' + $scope.process.title +
                        ' با موفقیت درخواست رسم فلوچارت ثبت شد.', 'ثبت درخواست فلوچارت فرآیند');

                }).error(function (data, status, headers) {
                console.log(data);
                $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
            });

        });
    };
    $scope.edit_checklist = function (row) {
        $scope.selected_checklist = angular.copy(row);
        console.log(row);
        $scope.toggle_compilation_checklist();
        $scope.check_list.title = $scope.selected_checklist.title;
        $scope.check_list.number = $scope.selected_checklist.number;
        $scope.check_list.goal = $scope.selected_checklist.goal;
        $scope.check_list.rating_type = $scope.selected_checklist.rating_type;
        $scope.check_list.how_rate = $scope.selected_checklist.hospital_process_form_guides ? $scope.selected_checklist.hospital_process_form_guides.map(function (itm) {
            itm.guides = itm.hospital_process_form_guide_rates;
            return itm;
        }) : [{
            rating_type: "",
            guides: [
                {
                    guide: "",
                    value: ""
                }
            ]
        }];
        $scope.check_list.checklists = $scope.selected_checklist.hospital_process_form_checklists ? $scope.selected_checklist.hospital_process_form_checklists.map(function (itm) {
            itm.checked = true;
            return itm;
        }) : [{
            checked: true,
            key: ""
        }];
        if ($scope.selected_checklist.hospital_process_form_wards) {
            var this_ward = $scope.selected_checklist.hospital_process_form_wards.filter(function (itm) {
                if (itm._id === row._id) {
                    return itm;
                }
            });
            $scope.check_list.wards = this_ward.map(function (itm) {
                itm.ward_name = itm.ward_id;
                return itm;
            });
        } else {
            $scope.check_list.wards = [{
                ward_name: "",
                operator: "",
                delivery_date: ""
            }];
        }
        $scope.check_list.how_rate[0].rating_type = $scope.selected_checklist.rating_type;

        $scope.check_list.id = row.form_id;
        /*   $scope.check_list= {
            title: "",
            number: "",
            goal: "",
            rating_type: "",
            rate_guide: "",
            status: "",
            wards: [
                {
                    ward_name :"",
                    operator :"",
                    delivery_date: ""
                }
            ],
            checklists: [
                {
                    checked:true,
                    key: ""
                }
            ],
            how_rate: [
                {
                    rating_type: "",
                    guides: [
                        {
                            guide: "",
                            value: ""
                        }
                    ]
                }
            ]
        };*/

    };
    $scope.show_amar = function (row, day) {
        var row_copy = angular.copy(row);
        var answers = [];
        if ($scope.hospital_process_form_ward.delivery_type === 'روزانه') {

            row_copy.submitted_at = row.days_object[day].submitted_at;
            row_copy.day = $filter('persianNum')(day + 1, true);
            row_copy.answer = row.days_object[day].answer;
            row_copy.status_class = row.days_object[day].status_class;
            row_copy.className = row.days_object[day].className;
        }

        $scope.indicator_answer_details.map(function (itm, i) {
            console.log(itm, row_copy);
            if (itm.submitted_at == row_copy.submitted_at) {
                $scope.index_of_submitted = i;
                answers = itm.hospital_process_answer_details;
            }
        });

        $scope.answer_chart.data_chart = [];
        $scope.answer_chart.labels_chart = [];
        var all_questions = [];
        var questions = [];
        answers.map(function (itm) {
            if (itm.hospital_process_answer_detail_records)
                itm.hospital_process_answer_detail_records.map(function (record) {
                    record.user_name = itm.name;

                    all_questions.push(record);


                    record.user_type = itm.user_type;
                });
        });
        var uniqued = $filter('unique')(all_questions, 'question');

        $scope.answer_chart.labels_chart = uniqued.map(function (itm, i) {
            var j = i + 1;
            $scope.answer_chart.data_chart[i] = 0;
            var count = 0;
            questions[i] = [];
            all_questions.map(function (answer) {
                if (answer.question === itm.question) {
                    count++;
                    questions[i].push(answer);
                    $scope.answer_chart.data_chart[i] = $scope.operator['+']($scope.answer_chart.data_chart[i], answer.value.replace(/[^-0-9\.]/g, '') == answer.value && parseFloat(answer.value) != undefined ? answer.value : answer.v);

                }
            });
            $scope.answer_chart.data_chart[i] = ($scope.answer_chart.data_chart[i] / count).toFixed(2);
            return 'سوال' + j;
        });
        $scope.answer_chart.options.tooltips.custom = function (tooltipModel) {
            var title = [];
            if (tooltipModel.dataPoints && tooltipModel.dataPoints.length) {
                var q = questions[tooltipModel.dataPoints[0].index];
                if (q && q.length) {
                    title = q.map(function (itm) {
                        return itm.user_name + (itm.user_type ? '(' + itm.user_type + ')' : '') + ': ' + itm.value;
                    });
                }

            }
            tooltipModel.title = title.length ? title : ['پاسخی برای این سوال ثبت نشده است.'];

            if (tooltipModel.xAlign === 'right') {
                tooltipModel.x = title[0] === 'پاسخی برای این سوال ثبت نشده است.' ? tooltipModel.x - ((480 - tooltipModel.width) / 2) : tooltipModel.x - ((260 - tooltipModel.width) / 2);
            }

            tooltipModel.width = title[0] === 'پاسخی برای این سوال ثبت نشده است.' ? 260 : 150;
            if (tooltipModel.yAlign === 'center' && title.length > 1) {
                tooltipModel.y = tooltipModel.y - ((title.length - 1) * 5);
            }
            tooltipModel.height = tooltipModel.height + ((title.length - 1) * 15);

        }
        $scope.amar_view = true;
    };
    $scope.back_amar_view = function () {
        $scope.amar_view = false;
    };
    $scope.show_detail_checklist = function (row) {
        $scope.answer_chart = {
            labels_chart: [],
            colors_chart: [
                {
                    fill: true,
                    fillColor: '#b2f1e4',
                    pointBackgroundColor: '#97d1c5',
                    pointHoverBackgroundColor: '#5f857b',
                    pointBorderColor: '#a9e6d9',
                    backgroundColor: "#fff",
                    pointHoverBorderColor: "#fff",
                    borderColor: '#7cb8a2'
                }],
            data_chart: [],
            data_set: {
                borderColor: '#104c82',
                pointRadius: 6,
                pointHoverRadius: 11
            },
            options: {
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                },
                tooltips: {
                    titleFontSize: 14,
                    bodyFontSize: 15,

                    /*  custom: function(tooltipModel) {
                     var title=[];
                     if(tooltipModel.dataPoints && tooltipModel.dataPoints.length){
                     if($scope.all_held_sessions.length && tooltipModel.dataPoints[0].yLabel){
                     $scope.all_held_sessions.forEach(function (itm) {
                     if(moment(itm.date).jMonth()===tooltipModel.dataPoints[0].index)
                     title.push($scope.get_day(itm.date)+' '+$scope.get_date(itm.date,'full_date').replace($rootScope.year,''));

                     });
                     }else{
                     title=['در این ماه هیچ جلسه‌ای برگذار نشده است.'];
                     }
                     }
                     tooltipModel.title=title.length?title:['در این ماه هیچ جلسه‌ای برگذار نشده است.'];

                     if(tooltipModel.xAlign==='right'){
                     tooltipModel.x=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?tooltipModel.x-((480-tooltipModel.width)/2):tooltipModel.x-((260-tooltipModel.width)/2);
                     }

                     tooltipModel.width=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?260:150;
                     if(tooltipModel.yAlign==='center' && title.length>1){
                     tooltipModel.y=tooltipModel.y - ((title.length-1)*5);
                     }
                     tooltipModel.height=tooltipModel.height+((title.length-1)*15);

                     }*/
                },

                scaleShowGridLines: false,
                elements: {line: {tension: 0, fill: false}}, scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 10,
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'سوالات',
                            fontSize: 11
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: 9,
                            suggestedMin: 31,
                            min: 0,
                            stepSize: 1,
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'میانگین نظرات',
                            fontSize: 11
                        }
                    }]

                }
            }
        };
        $scope.amar_view = false;
        $scope.indicator_answer_details = angular.copy(row.hospital_process_answers);
        $scope.hospital_process_form_ward = angular.copy(row);
        console.log($scope.indicator_answer_details, row);
        set_calender();
        /* $scope.show_amar($scope.indicator_answer_details[0].hospital_process_answer_details);*/
        $scope.gozaresh_amari_ = $scope.open_modal('lg', 'gozaresh.html', null, null, 'blue_modal full_width', $scope);
    };
    $scope.show_detail_of_answer = function (row) {
        $scope.indicator_answer_detail_records = row.hospital_process_answer_detail_records;
        $scope.indicator_answer_details_ = $scope.open_modal('lg', 'indicator_answer_details.html', null, null, 'full_width only_content', $scope);
    };
    $scope.close_gozaresh = function () {
        $scope.gozaresh_amari_.dismiss();
    };
    $scope.showDetailIndicator = function (row) {
        if (row._id) {
            $scope.selected_indicator = row;

            $scope.open_modal('lg', 'indicatorsDetail.html', 'indicator-identity-card_Ctrl', null, 'full_width blue_modal', $scope);
        } else {
            $scope.goto($scope.APP_BASE + '/indicator/dashboard?Token=' + $scope.MyToken + '&Year=' + $rootScope + '&id=' + row.id)
        }

    };
    $scope.get_indicators();
    $scope.get_process(1);
    $scope.nextPage = function () {
        $scope.get_process($scope.page + 1);
    }
    $scope.previousPage = function () {
        $scope.get_process($scope.page - 1);
    }

});

app.controller('indicator-identity-card_Ctrl', function ($scope, $location, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope, $filter, $timeout, $q) {
    $scope.wardsIndicator = true;
    $scope.show_all_of_detail = false;
    $scope.active_view = -1;
    $scope.per_page = 5;
    $scope.page = 1;
    $scope.indicator = {
        name: '',
        code: '',
        create_date: '',
        revise_date: '',
        definition: '',
        reasons: '',
        formul: [],
        basis: '',
        aspect: '',
        source: '',
        other_source: '',
        indicator_type: '',
        quality_dimension: '',
        desirability: '',
        uom: '',
        other_uom: '',
        report_type: '',
        other_report_type: '',
        measure_interval: '',
        scorecard: '',
        forje: '',
        timeline: '',
        delivery_time: '',
        delivery_day: '',
        delivery_day0: '',
        see_bsc: '',
        bsc_weight: '',
        is_relate_to_safty: '',
        wards: []
    };
    $scope.formul = {
        factor: '',
        up_: '',
        bottom_: '',
        manual1: '',
        manual2: ''
    };
    $scope.number_piker = {
        opt1: {
            min: 0,
            max: 7,
            hasZero: false
        }, opt2: {
            min: 0,
            max: 30,
            hasZero: false
        }, opt3: {
            min: 0,
            max: 365,
            hasZero: false
        }
    };
    $scope.basises = ['عملکردی', 'فرآیندهای اصلی', 'برنامه ای', 'عملکردی-فرآیندهای اصلی', 'عملکردی-برنامه ای', 'برنامه ای-فرآیندهای اصلی', 'مقطعی',
        'برنامه استراتژیک'
        ,
        'برنامه بهبود کیفیت'
        ,
        'مطالبات سازمان‌های بالا دستی'
        ,
        'مطالبات مدیریتی و فرآیندهای اصلی'
    ];
    $scope.aspects = ['بالینی', 'غیربالینی', 'مدیریتی'];
    $scope.sources = ['الزامی (دانشگاه)', 'اختیاری (بیمارستان)', 'سایر موارد'];
    $scope.indicator_types = ['پیامدی', 'ساختاری', 'فرآیندی'];
    $scope.quality_dimensions = ['ایمنی', 'به موقع بودن خدمات', 'اثربخشی', 'کارایی', 'عدالت', 'بیمار محوری'];
    $scope.units = [
        'متر',
        'لیتر',
        'دقیقه',
        'درصد',
        'ساعت',
        'دفعه',
        'روز',
        'تعداد',
        'کیلوگرم',
        'تومان',
        'در هزار',
        'سایر موارد'];
    $scope.report_types = [
        'چک لیست',
        'پرسشنامه',
        'HIS',
        'سایر موارد'
    ];
    $scope.scorecards = ['جامعه و عرضه خدمات', 'مالی', 'فرآیندهای داخلی', 'رشد و یادگیری'];
    $scope.timelines = ['روزانه', 'هفتگی', 'ماهانه', 'سه ماه یکبار', 'شش ماه یکبار', 'سالانه'];
    $scope.config_set = false;
    $scope.template = {url: ''};
    $scope.reset_steps();
    $scope.is_parent = true;
    $scope.indicators = [];
    $scope.indicators_copy = [];
    $scope.detail_of_indicator = {};
    $scope.filter = {
        keyword: '',
        basis: '',
        aspect: '',
        indicator_type: '',
        quality_dimension: '',
        scorecard: '',
        desirability: '',
        ekhtiary: false,
        ejbar: false,
        status: '',
        ward: '',
        is_related_safty: false,
        name: null
    };
    $scope.check_list = {
        title: '',
        number: '',
        goal: '',
        question: [{text: '', checked: true}],
        rating_type: '',
        guide: [],
        components: [],
        has_component: false
    };
    $scope.questionnaire = {
        title: '',
        number: '',
        description: '',
        questions: [{key: '', point_type: '', checked: true}],
        question_points: [{point_type: '', determine: [''], guide: ['']}],
        guide: [],
        components: [],
        has_component: false
    };
    $scope.currentComponent = {
        selected: ''
    };
    $scope.point_type = {
        selected: null,
        max: []
    };
    $scope.calenders = [];
    $scope.formul_result = '';
    $scope.pie_chart = {
        labels_chart: ['نیاز به کنترل', ' قابل ارتقاء ', 'مطلوب'],
        colors_chart: ['#fb0202', '#ffbb18', '#0fa707'],
        data_chart1: [0, 0, 0],
        data_chart2: [0, 0, 0],
        data_chart3: [0, 0, 0],
        percent_data_chart: function (arr) {
            if (arr && angular.isArray(arr) && arr[0] >= 0 && arr[1] >= 0 && arr[2] >= 0) {
                var total = arr.reduce(function (a, b) {
                    return $scope.operator["+"](a, b);
                }, 0);

                return arr.map(function (itm) {
                    return ((itm * 100) / total).toFixed(2);
                })
            } else {
                return [0, 0, 0];
            }

        },
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        }
    };
    $scope.education_levels = [
        'دیپلم و پایین تر',
        'فوق دیپلم',
        'لیسانس',
        'کارشناسی و بالاتر',
    ];
    $scope.marital_statuses = [
        '5 سال و کمتر',
        '6 تا 10 سال',
        '11 تا 15 سال',
        'بیشتر از 15 سال',
    ];
    $scope.ages = [
        '20-25',
        '26-30',
        '31-35',
        '35 به بالا'
    ];
    $scope.user_types = [
        'رسمی',
        'پیمانی',
        'رسمی - آزمایشی',
        'قراردادی',
        'شرکتی',
        'طرحی',
        'ماده 88',
        'سایر موارد',

    ];
    $scope.jobs = [
        'پرستاری',
        'پزشکی',
        'اداری - پشتیبانی',
        'پاراکلینیک',
        'روانشناسی/ مددکاری/کادر درمان',
        'خدمات/ نگهبان'

    ];
    $scope.joblist = [
        'کارمند',
        'آزاد',
        'بازنشسته',
    ];
    $scope.ins = [
        'آزاد',
        'تکمیلی'
    ];
    $scope.question_types = [
        'حضوری',
        'تلفنی',
        'صندوق'
    ];
    $scope.charts = {
        reason_choose: '',
        chartInfo: [],
        uniqData: [
            {
                title: 'سن',
                key: 'age',
                labels: angular.copy($scope.ages)
            },
            {
                title: 'میزان تحصیلات',
                key: 'education_level',
                labels: angular.copy($scope.education_levels)
            },
            {
                title: 'جنسیت',
                key: 'gender',
                labels: ['زن', 'مرد']
            },
        ],
        personnelData: [
            {
                title: 'سابقه خدمت',
                key: 'marital_status',
                labels: angular.copy($scope.marital_statuses)
            },
            {
                title: 'نوع استخدام',
                key: 'user_type',
                labels: angular.copy($scope.user_types)
            },
            {
                title: 'پست سازمانی',
                key: 'job',
                labels: angular.copy($scope.jobs)
            }
        ],
        patientData: [
            {
                title: 'شغل',
                key: 'marital_status',
                labels: angular.copy($scope.joblist)
            },
            {
                title: 'بخش/ واحد مربوطه',
                key: 'user_type',
                labels: []
            },
            {
                title: 'نوع بیمه',
                key: 'job',
                labels: angular.copy($scope.ins)
            },
            {
                title: 'نوع پرسش',
                key: 'question_type',
                labels: angular.copy($scope.question_types)
            }
        ],
        chartsDependency: function (type) {
            return type === 'پرسنل' ? this.uniqData.concat(this.personnelData) : this.uniqData.concat(this.patientData);
        },
        data_set: [],
        options: {
            maintainAspectRatio: false,
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
            layout: {
                padding: {
                    left: 5,
                    right: 10,
                    top: 50,
                    bottom: 5
                }
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        suggestedMin: 31,
                        min: 0,
                        beginAtZero: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '',
                        fontSize: 11
                    }
                }]

            }
        }
    }
    $scope.bar_chart = {
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'میانگین نظرات',
                        fontSize: 11
                    }

                }]

            },
            plugins: {
                p1: false
            },
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
        },
        data_chart: [],
        labels: {},
        data_series: {}
    };
    $scope.dates = [];
    var colors = ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC', '#b210fc'];
    var timelines_count = {
        'روزانه': function () {
            return moment.jIsLeapYear($rootScope.year) ? 366 : 365;
        },
        'هفتگی': function () {
            return 52;
        },
        'ماهانه': function () {
            return 12;
        },
        'سه ماه یکبار': function () {
            return 4;
        },
        'شش ماه یکبار': function () {
            return 2;
        },
        'سالانه': function () {
            return 1;
        }
    };
    var labels = {
        days: [],
        'روزانه': function () {
            this.days = [];
            /* var c=moment.jIsLeapYear($rootScope.year)?366:365;*/
            var m = moment().jYear($rootScope.year);
            for (var i = 1; i <= 12; i++) {
                for (var j = 1; j <= $scope.get_day_of_month(i, $rootScope.year).length; j++)
                    this.days.push(j + ' ' + $filter('persianMonth')(i, true));
            }
            return this.days;
        },
        'هفتگی': function () {
            this.days = [];
            for (var i = 1; i <= 52; i++) {
                this.days.push('هفته ' + $filter('persianNum')(i, true));
            }
            return this.days;
        },
        'ماهانه': function () {
            this.days = [];
            for (var i = 1; i <= 12; i++) {
                this.days.push($filter('persianMonth')(i, true));
            }
            return this.days;
        },
        'سه ماه یکبار': function () {
            this.days = [];
            for (var i = 1; i <= 4; i++) {
                this.days.push('سه ماهه ' + $filter('persianNum')(i, true));
            }
            return this.days;
        },
        'شش ماه یکبار': function () {
            this.days = [];
            for (var i = 1; i <= 2; i++) {
                this.days.push('شش ماهه ' + $filter('persianNum')(i, true));
            }
            return this.days;
        },
        'سالانه': function () {
            return $rootScope.year;
        }
    };
    var colors_chart = {
        colors: [],
        'روزانه': function () {
            this.colors = [];
            var c = moment.jIsLeapYear($rootScope.year) ? 366 : 365;
            for (var i = 0; i < c; i++) {
                this.colors.push(colors[Math.floor(i / 30)]);
            }
            return this.colors;
        },
        'هفتگی': function () {
            this.colors = [];
            for (var i = 1; i <= 52; i++) {
                this.colors.push(colors[Math.floor(i / 4)]);
            }
            return this.colors;
        },
        'ماهانه': function () {

            return colors;
        },
        'سه ماه یکبار': function () {
            this.colors = [];
            for (var i = 0; i < 12; i += 3) {
                this.colors.push(colors[i]);
            }
            return this.colors;
        },
        'شش ماه یکبار': function () {

            return ['#29929c', '#ff83ff'];
        },
        'سالانه': function () {
            return ['#189C2C'];
        }
    };
    $scope.indicator_chart = {
        labels_chart: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [],
        data_set: [{
            pointBackgroundColor: colors,
            borderColor: '#1c94e0',
            pointRadius: 6,
            pointHoverRadius: 11
        }, {
            pointBackgroundColor: colors,
            borderColor: '#e094de',
            pointRadius: 6,
            pointHoverRadius: 11
        }],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            }, tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15,
            },
            scaleShowGridLines: false,
            annotation: null,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    }
                }],
                yAxes: [{
                    id: 'y-axis-0',
                    ticks: {
                        suggestedMin: 100,
                        fontSize: 9,
                        /* suggestedMin:31,*/
                        min: 0,
                        beginAtZero: true,

                    },
                    scaleLabel: {
                        display: true,
                        labelString: '',
                        fontSize: 11
                    }
                }]

            }
        },
        series: []
    };
    $scope.answer_chart = {
        labels_chart: [],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [],
        data_set: {
            borderColor: '#1c94e0',
            pointRadius: 3,
            pointHoverRadius: 6
        },
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltipEvents: ["click"],
            tooltips: {
                enabled: false,
                titleFontSize: 10,
                bodyFontSize: 10,
                mode: 'index',
                position: 'nearest',
                /*  custom: function(tooltipModel) {
                      var title=[];
                      if(tooltipModel.dataPoints && tooltipModel.dataPoints.length){
                          if($scope.all_held_sessions.length && tooltipModel.dataPoints[0].yLabel){
                              $scope.all_held_sessions.forEach(function (itm) {
                                  if(moment(itm.date).jMonth()===tooltipModel.dataPoints[0].index)
                                      title.push($scope.get_day(itm.date)+' '+$scope.get_date(itm.date,'full_date').replace($rootScope.year,''));

                              });
                          }else{
                              title=['در این ماه هیچ جلسه‌ای برگذار نشده است.'];
                          }
                      }
                      tooltipModel.title=title.length?title:['در این ماه هیچ جلسه‌ای برگذار نشده است.'];

                      if(tooltipModel.xAlign==='right'){
                          tooltipModel.x=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?tooltipModel.x-((480-tooltipModel.width)/2):tooltipModel.x-((260-tooltipModel.width)/2);
                      }

                      tooltipModel.width=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?260:150;
                      if(tooltipModel.yAlign==='center' && title.length>1){
                          tooltipModel.y=tooltipModel.y - ((title.length-1)*5);
                      }
                      tooltipModel.height=tooltipModel.height+((title.length-1)*15);

                  }*/
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false,
                        autoSkip: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'سوالات',
                        fontSize: 11
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        suggestedMin: 31,
                        min: 0,
                        beginAtZero: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'میانگین نظرات',
                        fontSize: 11
                    }
                }]

            }
        }
    };
    $scope.currentWard = {};
    $scope.basis_has_changed = false;
    $scope.selected_wards = [];

    function customTooltips(tooltip) {

        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            this._chart.canvas.parentNode.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
            tooltipEl.classList.add(tooltip.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // Set Text
        if (tooltip.body) {
            var titleLines = tooltip.title || [];
            var bodyLines = tooltip.body.map(getBody);

            var innerHtml = '<thead>';
            var wards = tooltip.wards ? tooltip.wards : [];
            titleLines.forEach(function (title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function (body, i) {
                var ward = wards.length ? wards[i] : '';
                var colors = tooltip.labelColors[i];
                var style = 'background:' + colors.backgroundColor;
                style += '; border-color:' + colors.borderColor;
                style += '; border-width: 2px';
                var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + '<span style="padding: 0 10px">' + ward + ": " + body + '</span>' + '</td></tr>';
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
        }

        var positionY = this._chart.canvas.offsetTop;
        var positionX = this._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
        tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
        tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    }

    function set_calender() {
        var answers = $scope.selected_indicator.indicator.ward.indicator_answers ? $scope.selected_indicator.indicator.ward.indicator_answers : [];
        var has_eop_answers = $scope.selected_indicator.indicator.answers ? $scope.selected_indicator.indicator.answers : [];
        if (answers.length && has_eop_answers.length) {


            answers.map(function (a) {
                has_eop_answers.map(function (e) {
                    if (a._id === e._id) {
                        a.eop = e.eop;
                        a.has_eop = e.has_eop;
                    }
                });
            });
        }
        var war_target = $scope.selected_indicator.indicator.ward.target;
        var up_line = $scope.selected_indicator.indicator.ward.up_line;
        var bottom_line = $scope.selected_indicator.indicator.ward.bottom_line;
        $scope.calenders = [];
        var repeat_count = 0;
        if ($scope.selected_indicator.indicator.timeline === 'روزانه') {
            repeat_count = 12;
        } else if ($scope.selected_indicator.indicator.timeline === 'هفتگی') {
            repeat_count = 52;
        } else if ($scope.selected_indicator.indicator.timeline === 'ماهانه') {
            repeat_count = 12;
        } else if ($scope.selected_indicator.indicator.timeline === 'سه ماه یکبار') {
            repeat_count = 4;
        } else if ($scope.selected_indicator.indicator.timeline === 'شش ماه یکبار') {
            repeat_count = 2;
        } else if ($scope.selected_indicator.indicator.timeline === 'سالانه') {
            repeat_count = 1;
        }
        $scope.calenders = $scope.new_Array(repeat_count, {});
        $scope.detail_of_indicator.total = 0;
        $scope.detail_of_indicator.total_value = 0;
        $scope.calenders.map(function (itm, i) {

            if ($scope.selected_indicator.indicator.timeline === 'روزانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at_month = i + 1;
                itm.header_type = 'ماه';
                itm.days = $scope.get_day_of_month(i + 1, $rootScope.year);

            } else if ($scope.selected_indicator.indicator.timeline === 'هفتگی') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'هفته';
            } else if ($scope.selected_indicator.indicator.timeline === 'ماهانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at = i + 1;
                itm.header_type = 'ماه';

            } else if ($scope.selected_indicator.indicator.timeline === 'سه ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'سه ماهه';
            } else if ($scope.selected_indicator.indicator.timeline === 'شش ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'شش ماهه';
            } else if ($scope.selected_indicator.indicator.timeline === 'سالانه') {
                itm.header = $rootScope.year;
                itm.submitted_at = $rootScope.year;
                itm.header_type = 'سال';
            }

            if ($scope.selected_indicator.indicator.timeline !== 'روزانه') {
                answers.map(function (a) {
                    if (a.submitted_at == i + 1 || a.submitted_at == itm.submitted_at) {
                        itm.answer = a;
                        a.value = parseFloat(a.value);
                        $scope.detail_of_indicator.total += a.value;
                        $scope.detail_of_indicator.total_value++;
                        if (bottom_line != '' && up_line != '') {
                            if ($scope.selected_indicator.indicator.desirability === 'افزاینده') {
                                itm.className = a.value <= bottom_line ? 'red' : (a.value >= up_line ? 'green' : 'yellow');
                            } else {
                                itm.className = a.value > bottom_line && a.value < up_line ? 'yellow' : (a.value >= up_line ? 'red' : 'green');
                            }
                        }

                        /*   itm.className=a.value<bottom_line?'red':(a.value>up_line?'green':'yellow');*/
                        itm.status_class = i && $scope.calenders[i - 1].answer ? (a.value < $scope.calenders[i - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes') : '';
                    }
                });
            } else {
                itm.days_object = [];
                for (var d = 0; d < itm.days.length; d++) {
                    itm.days_object.push({submitted_at: moment($rootScope.year + '/' + itm.submitted_at_month + '/' + itm.days[d], 'jYYYY/jM/jD').jDayOfYear()})
                }
                /* itm.days.map(function (day) {
                 var day_of_year = moment($rootScope.year + '/' + itm.submitted_at + '/' + day, 'jYYYY/jM/jD').jDayOfYear();
                 day.submitted_at = day_of_year;
                 });*/
                answers.map(function (a) {
                    itm.days_object.map(function (day, d) {

                        if (a.submitted_at == day.submitted_at) {
                            day.answer = a;
                            a.value = parseFloat(a.value);
                            $scope.detail_of_indicator.total += a.value;
                            $scope.detail_of_indicator.total_value++;
                            if (bottom_line != '' && up_line != '') {
                                if ($scope.detail_of_indicator.desirability === 'افزاینده') {
                                    day.className = a.value <= bottom_line ? 'red' : (a.value >= up_line ? 'green' : 'yellow');
                                } else {
                                    day.className = a.value <= bottom_line ? 'green' : (a.value >= up_line ? 'red' : 'yellow');
                                }
                            }
                            /*day.className=a.value<bottom_line?'red':(a.value>up_line?'green':'yellow');*/
                            if (d && itm.days_object[d - 1].answer) {
                                day.status_class = a.value < itm.days_object[d - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                            } else {
                                if (day.submitted_at > 1) {
                                    var last_month = $scope.calenders[i - 1].days_object;
                                    if (last_month[last_month.length - 1].answer)
                                        day.status_class = a.value < last_month[last_month.length - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                                }

                            }

                        }
                    });

                });

            }
        });
    }

    function set_pie_chart_data(itm, data_chart, date_from, date_to) {
        /*    if(itm.indicator_ward){
            itm.indicator_ward.forEach(function (ward) {

                if(ward.indicator_answers){
                    var total_answer=0;
                    if(ward.indicator_answers.length){
                        ward.indicator_answers.forEach(function (answer) {
                            var v=answer.value?parseFloat(answer.value):0;
                            total_answer=$scope.operator["+"](v,total_answer);

                        }) ;

                        total_answer=total_answer/ward.indicator_answers.length;
                        if(itm.desirability==='افزاینده'){
                            if(total_answer<=ward.bottom_line){
                                $scope.pie_chart[data_chart][0]++;
                            }else if(total_answer>=ward.up_line){
                                $scope.pie_chart[data_chart][2]++;
                            }else{
                                $scope.pie_chart[data_chart][1]++;
                            }
                        }else{
                            if(total_answer<=ward.bottom_line){
                                $scope.pie_chart[data_chart][2]++;
                            }else if(total_answer>=ward.up_line){
                                $scope.pie_chart[data_chart][0]++;
                            }else{
                                $scope.pie_chart[data_chart][1]++;
                            }
                        }
                    }


                }
            });
        }
*/
    }

    function set_indicators_group() {
        var inds = $filter('unique')($scope.indicators, 'name');
        $scope.indicators_group = inds;
    }

    function set_indicator_chart(n, array_of_value) {
        var avgArray = [];
        for (var i = 0; i < array_of_value.length; i++) {
            if (n !== -1 && n !== i) {
                continue;
            }
            if (array_of_value[i])
                for (var j = 0; j < array_of_value[i].length; j++) {
                    avgArray[j] = avgArray[j] ? avgArray[j] : [0, 0];
                    if (array_of_value[i][j] !== null) {
                        avgArray[j][0] = $scope.operator['+'](avgArray[j][0], array_of_value[i][j]);
                        avgArray[j][1]++;
                    }
                }

        }

        var r = avgArray.map(function (avg, i) {
            return (avg[0] / avg[1]).toFixed(2);
        });

        return r;
    }

    function setCharts(data, dependency) {
        /*  var labels_=dependency.labels || dependency.labels_chart;
        var res={
            title:dependency.title,
            labels_chart:labels_,
            data_chart:$scope.new_Array(labels_.length,0),
            wards:angular.copy($scope.wards),
            key:dependency.key
        };
        if(data && data.length){
            var dataGroup=$filter('groupBy')(data,dependency.key);
            for(var d in dataGroup){
                if(dataGroup.hasOwnProperty(d)){

                    var sum=0;
                    dataGroup[d].map(function (itm) {
                        sum=$scope.operator['+'](sum,itm.value);
                    });
                    var i=labels_.indexOf(d.toString());
                    var avg=sum/dataGroup[d].length;
                    res.data_chart[i]=avg.toFixed(2);

                }
            }
        }

        return res;*/

        var res = {
            title: dependency.title,
            labels_chart: dependency.labels ? dependency.labels : dependency.labels_chart,
            data_chart: $scope.new_Array(dependency.labels_chart ? dependency.labels_chart.length : dependency.labels.length, 0),
            wards: dependency.wards && dependency.wards.length ? dependency.wards : angular.copy($scope.wards),
            key: dependency.key
        };
        if (data && data.length) {
            var dataGroup = $filter('groupBy')(data, dependency.key);
            for (var d in dataGroup) {
                if (dataGroup.hasOwnProperty(d)) {

                    var sum = 0;
                    var count = dataGroup[d].length;
                    dataGroup[d].map(function (itm) {
                        sum = $scope.operator['+'](sum, itm.value);
                    });
                    var i = res.labels_chart.indexOf(d.toString());
                    var avg = sum / dataGroup[d].length;
                    res.data_chart[i] = avg.toFixed(2);

                }
            }
        }
        return res;

    }

    function get_period_name(period, year, timeline) {
        if (timeline === 'روزانه') {

            return moment(year + '/01/01', 'jYYYY/jMM/jDD').jDayOfYear(period).format('jDD jMMMM jYYYY');
        } else if (timeline === 'هفتگی') {

            return ' هفته ' + $filter('persianNum')(period, true);
        } else if (timeline === 'ماهانه') {
            return ' ماه ' + $filter('persianMonth')(period, true);

        } else if (timeline === 'سه ماه یکبار') {
            return ' سه ماهه ' + $filter('persianNum')(period, true);
        } else if (timeline === 'شش ماه یکبار') {
            return ' شش ماهه ' + $filter('persianNum')(period, true);
        } else if ($scope.selected_indicator.indicator.timeline === 'سالانه') {
            return ' سال ' + period;
        }
        return period;
    }

    function set_line_chart(indicators_arr, filter_name) {
        $scope.summery_answers = [];
        var indicators = [];
        var uom = '', timeline = '', desirability = true;
        $scope.indicator_chart.series = [];
        $scope.indicator_chart.options.scales.yAxes[0].scaleLabel.labelString = 'واحد اندازه گیری';
        $scope.indicator_chart.data_chart = [[], []];
        if (!indicators_arr.length) {
            return false;
        }
        if (filter_name) {
            indicators_arr.map(function (itm) {
                if ($scope.filter.name === itm.name) {
                    if (!uom.length) {
                        uom = angular.copy(itm.uom);
                        timeline = angular.copy(itm.timeline)
                        desirability = itm.desirability !== 'کاهنده';
                    }
                    indicators = indicators.concat.apply(angular.copy(itm.indicator_ward));
                }
            })
        } else {
            if (!uom.length) {
                uom = angular.copy(indicators_arr[0].uom);
                timeline = angular.copy(indicators_arr[0].timeline)
                desirability = indicators_arr[0].desirability !== 'کاهنده';
            }
            indicators = indicators.concat.apply(angular.copy(indicators_arr[0].indicator_ward));
        }


        if (indicators.length) {
            $scope.indicator_chart.options.scales.yAxes[0].scaleLabel.labelString = angular.copy(uom);
            $scope.indicator_chart.data_set[0].pointBackgroundColor = colors_chart[timeline]();
            $scope.indicator_chart.data_set[1].pointBackgroundColor = $scope.indicator_chart.data_set[0].pointBackgroundColor;
            if (timeline === 'روزانه') {
                $scope.indicator_chart.data_set[0].pointRadius = 2;
                $scope.indicator_chart.data_set[1].pointRadius = 2;
            } else {
                $scope.indicator_chart.data_set[0].pointRadius = 6;
                $scope.indicator_chart.data_set[1].pointRadius = 6;
            }
            $scope.indicator_chart.labels_chart = labels[timeline]();
            var count = timelines_count[timeline]();
            var new_arr = $scope.new_Array(count, null);
            var new_arr2 = $scope.new_Array(count, 0);
            indicators = $filter('groupBy')(indicators, 'ward_id');
            var wards = $scope.wards.filter(function (itm) {
                return itm.checked;
            });

            /*   if(filter_ward){
                   $scope.indicator_chart.data_chart=[new_arr2,new_arr2];

               }else{
                   $scope.selected_wards=[];
                   $scope.indicator_chart.data_chart=[new_arr2];
                   $scope.wards_2=[];

               }
   */
            var array_of_value = [];
            var array_of_value2 = [];
            var index = 0;
            var ward_aray = [];
            var chart = [];
            var bottom_line = 0;
            var up_line = 0;
            var target = 0;
            var counter = 0;
            $scope.indicator_chart.series = ['میانگین تمام بخش ها'];
            var summery_answers = [];
            for (var ward in indicators) {
                if (indicators.hasOwnProperty(ward)) {
                    var is_ward_selected = null;
                    if (wards.length) {
                        $scope.indicator_chart.options.annotation = null;
                        is_ward_selected = wards.find(function (w) {
                            return w._id === ward;
                        });

                        if (is_ward_selected) {
                            var s = $scope.indicator_chart.series[1] ? $scope.indicator_chart.series[1] + ' و ' : '';
                            $scope.indicator_chart.series[1] = s + $scope.get_ward_name(ward, $scope.wards);
                        }

                        /*  if(filter_ward.length===1) {
                              if(filter_ward[0]==ward)
                                  $scope.indicator_chart.series = ['میانگین تمام بخش ها', ward_name];
                          }else {
                              if(filter_ward[0]==ward)
                                  $scope.indicator_chart.series[0]=ward_name;
                              else{
                                  $scope.indicator_chart.series[1]=ward_name;
                              }

                          }*/
                    } else {

                        bottom_line += parseInt(indicators[ward][0].bottom_line);
                        up_line += parseInt(indicators[ward][0].up_line);
                        target += parseInt(indicators[ward][0].target);
                        counter++;
                    }

                    var indicator_answers = indicators[ward][0].indicator_answers;
                    console.log(indicator_answers)
                    if (indicator_answers) {

                        array_of_value[index] = angular.copy(new_arr);
                        if (is_ward_selected) {
                            array_of_value2[index] = angular.copy(new_arr);
                        }
                        indicator_answers.map(function (answer, i) {
                            summery_answers.push({
                                count: answer.indicator_answer_details ? answer.indicator_answer_details.length : 1,
                                period_name: get_period_name(answer.submitted_at, answer.year, timeline),
                                color: colors_chart[timeline]()[answer.submitted_at - 1],
                                ward: wards.length ? $scope.get_ward_name(ward, $scope.wards) : '',
                                wards: wards,
                                is_ward_selected: is_ward_selected
                            });
                            array_of_value[index][parseInt(answer.submitted_at) - 1] = answer.value;
                            if (is_ward_selected) {
                                array_of_value2[index][parseInt(answer.submitted_at) - 1] = answer.value;
                                /* $scope.summery_answers[ $scope.summery_answers.length-1].ward=angular.copy($scope.get_ward_name(ward,$scope.wards));*/
                            }
                        });

                    }
                }
                ward_aray[index] = ward.toString();
                index++;
            }
            $scope.summery_answers = [];
            summery_answers.map(function (ans) {
                if (ans.wards.length) {
                    if (ans.is_ward_selected) {
                        $scope.summery_answers.push(ans)
                    }
                }
            })
            if (!$scope.summery_answers.length) {
                var g = $filter('groupBy')(summery_answers, 'period_name');
                for (var key in g) {
                    if (g.hasOwnProperty(key)) {
                        var new_summery_answer = g[key][0];
                        new_summery_answer.count = g[key].map(function (itm) {
                            return itm.count;
                        }).reduce(function (total, next) {
                            return $scope.operator['+'](total, next);
                        });
                        $scope.summery_answers.push(angular.copy(new_summery_answer));
                    }
                }
            }

        }
        chart[0] = set_indicator_chart(-1, array_of_value);
        chart[1] = set_indicator_chart(-1, array_of_value2);
        if (counter) {
            var m_target = (target / counter).toFixed(2);
            var m_up_line = (up_line / counter).toFixed(2);
            var m_bottom_line = (bottom_line / counter).toFixed(2);
            $scope.indicator_chart.options.annotation = {
                annotations: [
                    {
                        type: 'line',
                        borderColor: 'green',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        value: m_target,
                        borderWidth: 2,
                        borderDash: [2, 2],
                        borderDashOffset: 5,
                        label: {
                            position: "center",
                            content: "تارگت: " + m_target,
                            enabled: true,
                        }
                    },
                    {
                        type: 'box',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        yMin: desirability ? m_up_line : 0,
                        yMax: desirability ? null : m_bottom_line,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        label: {
                            position: "center",
                            content: "مطلوب ",
                            enabled: true,
                        }
                    },
                    {
                        type: 'box',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        yMin: desirability ? m_bottom_line : m_up_line,
                        yMax: desirability ? m_up_line : m_bottom_line,
                        backgroundColor: 'rgba(255, 187, 24, 0.1)',
                        label: {
                            position: "center",
                            content: "قابل ارتقاء",
                            enabled: true,
                        }
                    },
                    {
                        type: 'box',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        yMin: desirability ? 0 : m_up_line,
                        yMax: desirability ? m_bottom_line : null,
                        backgroundColor: 'rgba(251, 2, 2, 0.1)',
                        label: {
                            position: "center",
                            content: "نیاز به کنترل",
                            enabled: true,
                        }
                    }
                ]
            }
        }

        $scope.indicator_chart.data_chart = angular.copy(chart);
    }

    var all_questions_2 = [];

    function setAnswerChart(indicator, indicator_answer_details) {
        $scope.multiComponent = false;
        $scope.current_indicator = angular.copy(indicator);
        $scope.answer_chart.data_chart = [];
        $scope.answer_chart.labels_chart = [];
        $scope.isAll2Level = false;
        $scope.bar_chart_questioner = null;
        var all_questions = [];
        all_questions_2 = [];
        var questions = [];
        var answers = [];
        var max = {};
        var queries = [];

        if (indicator.indicator_queries) {
            queries = angular.copy(indicator.indicator_queries);
            if (queries && queries.length) {
                queries.reverse();
                var query_questions = queries[0].indicator_query_questions;

                var query_questions_group = $filter('groupBy')(query_questions, 'point_type');
                Object.keys(query_questions_group).map(function (point_type) {
                    var p = queries[0].indicator_query_points.find(function (itm) {
                        return itm.point_type === point_type.toString();
                    });
                    if (p.determine) {
                        var rev = angular.copy(p.determine);
                        rev.reverse();
                    }
                    max[point_type] = p ? (point_type.toString() === "کیفی" ? p.determine.length : (point_type.toString() === "دوسطحی" ? 1 : rev[0])) : 0;


                })
            }
        }
        if (indicator.indicator_checklist) {
            //  console.log(angular.copy($scope.selected_indicator.indicator.indicator_checklist))
            queries = angular.copy(indicator.indicator_checklist);
            if (queries && queries.length) {
                queries.reverse();
                $scope.multiComponent = queries[0].has_component;
                if (queries[0].indicator_checklist_guides) {
                    var guids = angular.copy(queries[0].indicator_checklist_guides);
                    guids.reverse();
                }
                max[queries[0].rating_type] = queries[0].rating_type === "کیفی" ? queries[0].indicator_checklist_guides.length : (queries[0].rating_type === "دوسطحی" ? 1 : guids[0].value);

            }
        }
        if (indicator_answer_details) {
            indicator_answer_details.map(function (itm) {
                $scope.isAll2Level = itm.indicator_answer_detail_records && itm.indicator_answer_detail_records.every(function (record) {
                    return record.point_type === 'دوسطحی' || record.point_type === 'دو سطحی';
                });
                if (itm.indicator_answer_detail_records) {
                    itm.indicator_answer_detail_records.map(function (record) {
                        record.user_name = itm.name;
                        if (indicator.report_type === 'پرسشنامه') {
                            if ((record.point_type && record.point_type !== 'سوال باز' && record.point_type !== 'دوسطحی' && record.point_type !== 'دو سطحی') || $scope.isAll2Level) {
                                all_questions.push(record);
                            } else {
                                if (record.point_type && record.point_type === 'دوسطحی')
                                    all_questions_2.push(record);
                            }
                        } else {
                            all_questions.push(record);
                        }

                        record.user_type = itm.user_type;
                        record.reason_choose = itm.reason_choose;
                    });
                }
            });
        } else {
            indicator.indicator_ward.map(function (ward) {
                if (ward.indicator_answers)
                    ward.indicator_answers.map(function (answer) {
                        answer.indicator_answer_details.map(function (itm) {
                            $scope.isAll2Level = itm.indicator_answer_detail_records && itm.indicator_answer_detail_records.every(function (record) {
                                return record.point_type === 'دوسطحی' || record.point_type === 'دو سطحی';
                            });
                            if (itm.indicator_answer_detail_records) {
                                itm.indicator_answer_detail_records.map(function (record) {
                                    record.user_name = itm.name;
                                    if (indicator.report_type === 'پرسشنامه') {
                                        if ((record.point_type && record.point_type !== 'سوال باز' && record.point_type !== 'دوسطحی' && record.point_type !== 'دو سطحی') || $scope.isAll2Level) {
                                            all_questions.push(record);
                                        } else {
                                            if (record.point_type && record.point_type === 'دوسطحی')
                                                all_questions_2.push(record);
                                        }
                                    } else {
                                        all_questions.push(record);
                                    }

                                    record.user_type = itm.user_type;
                                    record.reason_choose = itm.reason_choose;
                                });
                            }
                        });
                    });
            });
        }

        var uniqued = $filter('unique')(all_questions, 'question');
        var components = null;
        var components_name = [];
        if ($scope.multiComponent) {
            components = $filter('groupBy')(queries[0].indicator_checklist_questions, 'component');
            $scope.components = angular.copy(components);
            $scope.components.answers = {};
            components_name = angular.copy(Object.keys(components));
            $scope.bar_chart.labels = [];
            $scope.bar_chart.data_chart = [];

        }

        $scope.answer_chart.labels_chart = uniqued.map(function (itm, i) {
            var j = i + 1;
            var data_chart = [];
            var data_set = $scope.answer_chart.data_set;
            var data_sets = [];
            var index = 0;
            questions[i] = {};
            var sum_y_avg = 0;
            var d = angular.copy(data_set);
            var group_answer_by_ward;
            var this_question = $filter('filter_by')(all_questions, 'question', itm.question);

            if (indicator.report_type === 'پرسشنامه') {
                if (!$scope.bar_chart_questioner) {
                    $scope.bar_chart_questioner = {}
                }
                $scope.bar_chart_questioner[itm.question] = {
                    wards: [],
                    avg: 0,

                }
                group_answer_by_ward = $filter('groupBy')(this_question, 'user_type');
                if (group_answer_by_ward[""]) {
                    group_answer_by_ward["نامشخص"] = group_answer_by_ward[""];
                    delete group_answer_by_ward[""];
                }
                for (var ward in group_answer_by_ward) {
                    if (group_answer_by_ward.hasOwnProperty(ward)) {
                        var ward_info = {
                            ward: ward,
                            answers: [],
                            avg: 0
                        }
                        var q = group_answer_by_ward[ward];
                        questions[i][ward] = q;
                        var group_answer = $filter('groupBy')(q, 'value');
                        var sum_y = 0;
                        for (var key in group_answer) {
                            if (group_answer.hasOwnProperty(key)) {
                                var first = group_answer[key][0];
                                var w = key.toString().replace(/[^-0-9\.]/g, '') === key.toString() && parseFloat(key) != undefined ? key : (first ? first.v : 0);
                                var y = group_answer[key].length * w;
                                sum_y += y;
                            }
                        }
                        var avg = ((sum_y / (q.length * max[q[0].point_type])) * 100).toFixed(2);

                        sum_y_avg = $scope.operator["+"](sum_y_avg, avg);
                        data_chart.push(avg);

                        //  d.borderColor=$scope.set_color(index,data_sets.map(function (value) { return value.borderColor; }));
                        index++;
                        ward_info.answers = q;
                        ward_info.avg = avg;
                        $scope.bar_chart_questioner[itm.question].wards.push(angular.copy(ward_info));

                    }
                }
                questions[i]['تمام بخش ها'] = angular.copy(this_question);
                var total_avg = (sum_y_avg / index).toFixed(2);
                $scope.bar_chart_questioner[itm.question].avg = total_avg;
                $scope.answer_chart.data_chart[i] = angular.copy(total_avg);
            } else {
                questions[i]['question'] = itm.question;
                var group_answer = $filter('groupBy')(angular.copy(this_question), 'value');
                var sum_y = 0;
                for (var key in group_answer) {
                    if (group_answer.hasOwnProperty(key)) {

                        var first = group_answer[key][0];
                        var w = key.toString().replace(/[^-0-9\.]/g, '') === key.toString() && parseFloat(key) != undefined ? key : (first ? first.v : 0);

                        var y = group_answer[key].length * w;
                        sum_y += y;
                    }
                }

                this_question.map(function (q) {
                    questions[i][q.user_name] = q.value;
                })
                var avg = sum_y / (this_question.length * max[this_question[0].point_type]);
                data_chart = (avg * 100).toFixed(2);

                d.name = 'میانگین پاسخ ها';
                data_sets.push(angular.copy(d));
                if (components) {
                    components_name.map(function (component) {

                        components[component].map(function (q) {
                            if (q.text === this_question[0].question) {
                                q.value = angular.copy(avg);
                                if (!$scope.components.answers[component]) {
                                    $scope.components.answers[component] = [];
                                }
                                $scope.components.answers[component].push((avg * 100).toFixed(2));
                            }
                        })
                    })
                }
                $scope.answer_chart.data_chart[i] = angular.copy(data_chart);
            }
            return 'سوال' + j;
        });
        if (components) {
            var sum_component_values = {};
            components_name.map(function (component) {
                sum_component_values[component] = 0
                components[component].map(function (q) {
                    sum_component_values[component] = $scope.operator["+"](q.value, sum_component_values[component]);

                });
                if ($scope.bar_chart.labels.indexOf(component) === -1) {
                    $scope.bar_chart.labels.push(component);
                }
                $scope.bar_chart.data_chart.push(((sum_component_values[component] / components[component].length) * 100).toFixed(2));
            });

        }
        $scope.answer_chart.options.tooltips.custom = function (tooltipModel) {
            var q = [];
            var title = '';
            tooltipModel.title = [];
            if (!this.__tooltip) {
                this.__tooltip = {};
            }
            if (tooltipModel.dataPoints && tooltipModel.dataPoints.length) {
                if (indicator.report_type === 'پرسشنامه') {
                    var qs = questions[tooltipModel.dataPoints[0].index];

                    tooltipModel.wards = ['میانگین نظرات تمام بخش ها'];
                    for (var ward in qs) {
                        if (qs.hasOwnProperty(ward)) {
                            q = qs[ward];
                            if (q && q.length) {
                                tooltipModel.title = [q[0].question];
                                this.__tooltip = q[0].question;
                            }
                        }
                    }

                } else {
                    tooltipModel.wards = ['میانگین نظرات']
                    q = angular.copy(questions[tooltipModel.dataPoints[0].index]);
                    tooltipModel.title = [q['question']];
                    delete q.question;
                    title = Object.keys(q).map(function (key) {

                        return key + ':' + q[key];
                    });
                    this.__tooltip['پاسخ ها'] = title;

                }
            }


            /* tooltipModel.title=title.length?title:['پاسخی برای این سوال ثبت نشده است.'];*/
            return customTooltips.bind(this)(tooltipModel);
        }

    }

    $scope.reloadAnswerValue = function (answer, result) {
        var value = 0;
        var promises = [];
        if (answer.indicator_answer_details) {
            answer.indicator_answer_details.map(function (indicator_answer_detail, i) {
                if (indicator_answer_detail) {

                    value = $scope.reloadAnswerDetailValue(answer._id, indicator_answer_detail._id, indicator_answer_detail.indicator_answer_detail_records, $scope.selected_indicator.indicator)
                    promises.push(value);


                }
            });
            $q.all(promises).then(function (success) {
                console.log(success)
                var sum = 0;
                success.map(function (itm) {
                    sum = $scope.operator['+'](itm.value, sum);
                })
                value = (sum / success.length).toFixed(2);
                factory1.putUserApi('/v1/user/hospital/update_indicator_answer', JSON.stringify({
                    id: answer._id,
                    value: value
                })).then(function (data) {
                    $scope.formul_result = value;
                    console.log(data);
                });
            }, function (error) {

            });
        } else {
            var soorat = 0;
            var makhraj = 0;
            var result = 0;
            var arr_soorat = [];
            var arr_makhraj = [];
            $scope.soorat.map(function (itm, i) {

                if (itm.operator) {
                    arr_soorat.push(itm.operator);
                } else {
                    arr_soorat.push(itm.value ? itm.value.replace(/[^-0-9\.]/g, '') : 0);
                }
            });
            $scope.makhraj.map(function (itm, i) {
                if (itm.operator) {
                    arr_makhraj.push(itm.operator);
                } else {
                    arr_makhraj.push(itm.value ? itm.value.replace(/[^-0-9\.]/g, '') : 0);
                }
            });

            soorat = arr_soorat.length >= 1 ? $scope.math_map(arr_soorat) : 1;
            makhraj = arr_makhraj.length >= 1 ? $scope.math_map(arr_makhraj) : 1;

            result = ($scope.operator['/'](soorat, makhraj ? makhraj : 1) * $scope.selected_indicator.indicator.formul[2]);
            factory1.putUserApi('/v1/user/hospital/update_indicator_answer', JSON.stringify({
                id: answer._id,
                value: result
            })).then(function (data) {
                $scope.formul_result = result;
                console.log(data);
            });
        }


    }
    $scope.reloadAnswerDetailValue = function (ans_id, id, records, indicator, index) {

        var defer = $q.defer();
        $timeout(function () {
            var isAll2level = records.every(function (r) {
                return r.point_type === 'دوسطحی';
            });
            var max_score = 0;
            var max_score_obj = {}
            var queries = [];
            if (indicator.indicator_queries) {
                queries = angular.copy(indicator.indicator_queries);
                if (queries && queries.length) {
                    queries.reverse();
                    var query_questions = queries[0].indicator_query_questions;

                    var query_questions_group = $filter('groupBy')(query_questions, 'point_type');
                    Object.keys(query_questions_group).map(function (point_type) {
                        var p = queries[0].indicator_query_points.find(function (itm) {
                            return itm.point_type === point_type.toString();
                        });
                        if (p.determine) {
                            var rev = angular.copy(p.determine);
                            rev.reverse();
                        }
                        max_score_obj[point_type] = p ? (point_type.toString() === "کیفی" ? p.determine.length : (point_type.toString() === "دوسطحی" ? 1 : rev[0])) : 0;


                    })
                }
            }
            if (indicator.indicator_checklist) {
                //  console.log(angular.copy($scope.selected_indicator.indicator.indicator_checklist))
                queries = angular.copy(indicator.indicator_checklist);
                if (queries && queries.length) {
                    queries.reverse();
                    if (queries[0].indicator_checklist_guides) {
                        var guids = angular.copy(queries[0].indicator_checklist_guides);
                        guids.reverse();
                    }
                    max_score_obj[queries[0].rating_type] = queries[0].rating_type === "کیفی" ? queries[0].indicator_checklist_guides.length : (queries[0].rating_type === "دوسطحی" ? 1 : guids[0].value);

                }
            }
            var makhraj = 0;
            var score = 0;

            records.map(function (record) {
                if (record.v !== undefined && record.v !== null && record.v !== '') {
                    if (record.point_type !== 'سوال باز') {
                        if (record.point_type !== 'دوسطحی' || isAll2level) {
                            score = $scope.operator['+'](score, record.v);

                            max_score = max_score_obj[record.point_type];
                            makhraj++;
                        }
                    }
                }
            });
            makhraj = makhraj * max_score;
            var z = indicator.formul ? indicator.formul[2] : 1;
            var value = ($scope.operator['/'](score, makhraj ? makhraj : 1) * z).toFixed(2);
            factory1.putUserApi('/v1/user/hospital/update_indicator_answer_detail', JSON.stringify({
                id: id,
                value: value.toString(),
                ans_id: ans_id
            })).then(function (data) {
                if (index !== undefined) {
                    $scope.indicator_answer_details[index].value = angular.copy(value);
                }

                console.log(data);
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });
        }, 1000)

        return defer.promise;
    }
    $scope.deleteIndicatorWard = function (index) {
        $scope.question('آیا از حذف شاخص مورد نظر مطمئن هستید؟', 'حذف شاخص');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.indicator.wards.splice(index, 1);
            }
        });
    }
    /*$scope.set_line_chart_wards=function (id,status) {
        var wards=[];
       if(status){
           $scope.selected_wards.push(id);
       }else{
           $scope.selected_wards.splice($scope.selected_wards.indexOf(id),1);
       }

        if($scope.selected_wards.length>2){
            $scope.selected_wards.splice(0,1);

            $scope.wards_2.forEach(function (ward) {
               if($scope.selected_wards.indexOf(ward.id)===-1){
                   ward.checked=false;
               }
            });
        }
        wards=angular.copy($scope.selected_wards);
        if(wards.length){
            $scope.set_line_chart(wards);
        }else{
            $scope.set_line_chart();
        }
    };
    */
    $scope.set_line_chart = function () {
        /*  var indicators=[];
        var uom='',timeline='',desirability=true;
        /!*desirability means افزاینده*!/
        $scope.indicator_chart.series=[];
        $scope.indicator_chart.options.scales.yAxes[0].scaleLabel.labelString='واحد اندازه گیری';

        $scope.indicator_chart.data_chart=[[],[]];
*/
        /*$scope.indicators_copy.forEach(function (itm) {

            if($scope.filter.name===itm.name ){
                if(!uom.length){
                    uom=angular.copy(itm.uom);
                    timeline=angular.copy(itm.timeline)
                    desirability=itm.desirability!=='کاهنده';
                }
                indicators=indicators.concat.apply(angular.copy(itm.indicator_ward));
            }
        });*/
        set_line_chart($scope.indicators_copy, $scope.filter.name);

        /*      if(indicators.length){
            $scope.indicator_chart.options.scales.yAxes[0].scaleLabel.labelString=angular.copy(uom);
            $scope.indicator_chart.data_set[0].pointBackgroundColor=colors_chart[timeline]();
            $scope.indicator_chart.data_set[1].pointBackgroundColor=$scope.indicator_chart.data_set[0].pointBackgroundColor;
            if(timeline==='روزانه'){
                $scope.indicator_chart.data_set[0].pointRadius=2;
                $scope.indicator_chart.data_set[1].pointRadius=2;
            }else{
                $scope.indicator_chart.data_set[0].pointRadius=6;
                $scope.indicator_chart.data_set[1].pointRadius=6;
            }
            $scope.indicator_chart.labels_chart=labels[timeline]();
            var count=timelines_count[timeline]();
            var new_arr=$scope.new_Array(count,null);
            var new_arr2=$scope.new_Array(count,0);
            indicators=$filter('groupBy')(indicators,'ward_id');
           var wards= $scope.wards.filter(function (itm) {
                return itm.checked;
            });

         /!*   if(filter_ward){
                $scope.indicator_chart.data_chart=[new_arr2,new_arr2];

            }else{
                $scope.selected_wards=[];
                $scope.indicator_chart.data_chart=[new_arr2];
                $scope.wards_2=[];

            }
*!/
            var array_of_value=[];
            var array_of_value2=[];
            var index=0;
            var ward_aray=[];
            var chart=[];
            var bottom_line=0;
            var up_line=0;
            var target=0;
            var counter=0;
            $scope.indicator_chart.series = ['میانگین تمام بخش ها'];
            for(var ward in indicators){
                if(indicators.hasOwnProperty(ward)){
                    var is_ward_selected=null;
                    if(wards.length){
                        $scope.indicator_chart.options.annotation=null;
                        is_ward_selected=wards.find(function (w) {
                            return w._id===ward;
                        });

                        if(is_ward_selected){
                            var s=$scope.indicator_chart.series[1]?$scope.indicator_chart.series[1]+' و ':'';
                            $scope.indicator_chart.series[1]=s+$scope.get_ward_name(ward,$scope.wards);
                        }

                      /!*  if(filter_ward.length===1) {
                            if(filter_ward[0]==ward)
                                $scope.indicator_chart.series = ['میانگین تمام بخش ها', ward_name];
                        }else {
                            if(filter_ward[0]==ward)
                                $scope.indicator_chart.series[0]=ward_name;
                            else{
                                $scope.indicator_chart.series[1]=ward_name;
                            }

                        }*!/
                    }else{

                        bottom_line+=parseInt(indicators[ward][0].bottom_line);
                        up_line+=parseInt(indicators[ward][0].up_line);
                        target+=parseInt(indicators[ward][0].target);
                        counter++;
                    }

                    var indicator_answers=indicators[ward][0].indicator_answers;
                    if(indicator_answers){

                        array_of_value[index]=angular.copy(new_arr);
                        if(is_ward_selected){
                            array_of_value2[index]=angular.copy(new_arr);
                        }
                        indicator_answers.map(function (answer,i) {
                            array_of_value[index][parseInt(answer.submitted_at)-1]=answer.value;
                            if(is_ward_selected){
                                array_of_value2[index][parseInt(answer.submitted_at)-1]=answer.value;
                            }
                        });

                    }
                }
                ward_aray[index]=ward.toString();
                index++;
            }
           /!* var chart=[];
            if(filter_ward){
                if(filter_ward.length===1) {
                    chart[0]=set_indicator_chart(-1,array_of_value);
                    chart[1]= set_indicator_chart(ward_aray.indexOf(filter_ward[0]),array_of_value);

                }else{
                    chart[0]= set_indicator_chart(ward_aray.indexOf(filter_ward[0]),array_of_value);
                    chart[1]= set_indicator_chart(ward_aray.indexOf(filter_ward[1]),array_of_value);
                }
            }else{
                chart[0]= set_indicator_chart(-1,array_of_value);
            }
            $scope.indicator_chart.data_chart=angular.copy(chart);*!/

        }*/
        /*    chart[0]= set_indicator_chart(-1,array_of_value);
        chart[1]= set_indicator_chart(-1,array_of_value2);*/
        /*  if(counter){
            var m_target=(target/counter).toFixed(2);
            var m_up_line=(up_line/counter).toFixed(2);
            var m_bottom_line=(bottom_line/counter).toFixed(2);
            $scope.indicator_chart.options.annotation={annotations: [
                    {
                        type: 'line',
                        borderColor: 'green',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        value:m_target,
                        borderWidth: 2,
                        borderDash: [2, 2],
                        borderDashOffset: 5,
                        label:{
                            position:"center",
                            content:"تارگت: "+m_target,
                            enabled: true,
                        }
                    },
                    {
                        type: 'box',
                        drawTime: 'beforeDatasetsDraw',
                        yScaleID: 'y-axis-0',
                        yMin: desirability?m_up_line:0,
                        yMax: desirability?null:m_bottom_line,
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        label:{
                            position:"center",
                            content:"مطلوب ",
                            enabled: true,
                        }
                    },
                     {
                         type: 'box',
                         drawTime: 'beforeDatasetsDraw',
                         yScaleID: 'y-axis-0',
                         yMin: desirability?m_bottom_line:m_up_line,
                         yMax: desirability?m_up_line:m_bottom_line,
                         backgroundColor: 'rgba(255, 187, 24, 0.1)',
                         label:{
                             position:"center",
                             content:"قابل ارتقاء",
                             enabled: true,
                         }
                     },
                     {
                         type: 'box',
                         drawTime: 'beforeDatasetsDraw',
                         yScaleID: 'y-axis-0',
                         yMin: desirability?0:m_up_line,
                         yMax: desirability?m_bottom_line:null,
                         backgroundColor: 'rgba(251, 2, 2, 0.1)',
                         label:{
                             position:"center",
                             content:"نیاز به کنترل",
                             enabled: true,
                         }
                     }
                ]}
        }*/

        //  $scope.indicator_chart.data_chart=angular.copy(chart);
    }
    $scope.toggle_config_set = function () {
        if ($scope.config_set) {
            $scope.formul = {
                factor: '',
                up_: '',
                bottom_: '',
                manual1: '',
                manual2: ''
            };
            $scope.reset_params($scope.indicator);
            $scope.config_set = false;

        } else {
            $scope.reset_steps();
            $scope.config_set = true;
        }
    };
    $scope.rating_type_select = function () {
        $scope.check_list.guide = [];
        if ($scope.check_list.rating_type == 'دوسطحی') {
            $scope.check_list.guide = [
                {value: '', guide: ''},
                {value: '', guide: ''}
            ];
        }
    };
    $scope.add_guid = function (is_question) {
        if (is_question) {
            is_question.determine.push('');
            is_question.guide.push('');
        } else {
            $scope.check_list.guide.push({value: '', guide: ''});
        }
    };
    $scope.add_ch_q = function (flag, components) {
        if (flag) {
            $scope.questionnaire.questions.push({key: '', point_type: '', component: components, checked: true})
        } else {
            $scope.check_list.question.push({text: '', point_type: '', component: components, checked: true});
        }
    };
    $scope.addComponet = function () {
        $scope.questionnaire.components.push({title: ""});
    };
    $scope.addComponet_check_list = function () {
        $scope.check_list.components.push({title: ""});
    };
    $scope.save_check_list = function (flag) {
        var q = [];
        q = $scope.check_list.question.filter(function (itm) {
            return itm.checked && itm.text && itm.text.length;
        });
        var parameter = JSON.stringify({
            save_temp: flag,
            indicator_id: $scope.selected_indicator._id,
            title: $scope.check_list.title,
            goal: $scope.check_list.goal,
            has_component: $scope.check_list.has_component,
            number: $scope.check_list.number,
            rating_type: $scope.check_list.rating_type,
            guide: $scope.check_list.guide,
            questions: q,
            id: $scope.check_list._id && $scope.check_list._id.length ? $scope.check_list._id : null,
            year: $rootScope.year
        });
        $http.put(Server_URL + '/v1/user/hospital/indicator/tadvin_checklist', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.selected_indicator = null;
                $scope.get_indicators('');

                $scope.success_alert('چک لیست شاخص با موفقیت ثبت شد.', 'ثبت چک لیست شاخص');
                $scope.back_to_parent($scope);
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.save_questionnaire = function (flag) {
        var q = [];
        q = $scope.questionnaire.questions.filter(function (itm) {
            if (itm.checked && itm.key && itm.key.length) {
                if ($scope.questionnaire.has_component && !itm.component) {
                    return false;
                }
                return itm;
            }
        });
        var parameter = JSON.stringify({
            save_temp: flag,
            indicator_id: $scope.selected_indicator._id,
            title: $scope.questionnaire.title,
            description: $scope.questionnaire.description,
            number: $scope.questionnaire.number,
            has_component: $scope.questionnaire.has_component,
            question_points: $scope.questionnaire.question_points.map(function (itm) {

                return {
                    point_type: itm.point_type,
                    determine: itm.determine,
                    guide: itm.guide
                };
            }),
            questions: q.map(function (itm) {
                /*key - point_type*/
                return {
                    key: itm.key,
                    point_type: itm.point_type,
                    component: itm.component
                };
            }),
            id: $scope.questionnaire._id && $scope.questionnaire._id.length ? $scope.questionnaire._id : null,
            year: $rootScope.year
        });
        $http.put(Server_URL + '/v1/user/hospital/indicator/tadvin_questionnaire', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.selected_indicator = null;
                $scope.get_indicators('');
                $scope.success_alert('پرسشنامه شاخص با موفقیت ثبت شد.', 'ثبت پرسشنامه شاخص');
                $scope.back_to_parent($scope);
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });

    };
    $scope.source_change = function (e) {
        if (e === 'اختیاری (بیمارستان)') {
            $scope.filter.ekhtiary = !$scope.filter.ekhtiary;

            /*  filter_by:'indicator.source':(filter.ekhtiary?'اختیاری (بیمارستان)':'')| filter_by:'indicator.source':(filter.ejbar?'الزامی (دانشگاه)':'')*/
        } else {
            $scope.filter.ejbar = !$scope.filter.ejbar;

        }
        if ($scope.filter.ejbar || $scope.filter.ekhtiary) {
            var arr1 = [];
            var arr2 = [];
            if ($scope.filter.ejbar)
                arr1 = $filter('filter_by')($scope.indicators_copy, 'indicator.source', 'الزامی (دانشگاه)');
            if ($scope.filter.ekhtiary)
                arr2 = $filter('filter_by')($scope.indicators_copy, 'indicator.source', 'اختیاری (بیمارستان)');

            $scope.indicators = [].concat(arr1, arr2);
        } else {
            $scope.indicators = angular.copy($scope.indicators_copy);
        }
    };
    $scope.formul_set = function () {
        if ($scope.indicator.formul.length) {
            $scope.formul.up_ = $scope.indicator.formul[0];
            $scope.formul.bottom_ = $scope.indicator.formul[1];
            $scope.formul.factor = $scope.indicator.formul[2];
            $scope.formul.manual1 = $scope.indicator.formul[3];
            $scope.formul.manual2 = $scope.indicator.formul[4];
        }
        $scope.formul_modal = $scope.open_modal('md', 'set_formul.html', null, null, 'blue_modal', $scope, true);
        $scope.formul_modal.result.then(function (r) {
            if (r) {
                if (r.up_.length || r.bottom_.length)
                    $scope.indicator.formul = [r.up_.length ? r.up_ : '1', r.bottom_.length ? r.bottom_ : '1', r.factor ? r.factor : '1', r.manual1, r.manual2];
            }
        });
    };
    $scope.close = function () {
        $scope.formul_modal.dismiss();
    };
    $scope.save_formul = function () {
        $scope.formul_modal.close($scope.formul);
    };
    $scope.add_indicator_ward = function () {

        $scope.indicator.wards.push(angular.copy({id: ""}));
    };
    $scope.add_new_ward = function () {
        $scope.new_indicator_wards.push({});
    };
    $scope.cancel_edite_indicator = function () {
        $scope.template.url = '';
        $scope.is_parent = true;
    };
    $scope.update_indicator_ward = function () {
        $scope.question('آیا از ثبت تغییرات مورد نظر مطمئن هستید؟', 'ثبت تغییرات');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var parameter = JSON.stringify({
                    wards: $scope.new_indicator_wards,
                    id: $scope.selected_indicator._id,
                    save: false
                });
                $http.put(Server_URL + '/v1/user/hospital/indicator', parameter, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.get_indicators('');
                        $scope.success_alert('اطلاعات شاخص با موفقیت به روزرسانی شد.', 'ثبت شاخص');
                        $scope.cancel_edite_indicator();


                    }).error(function (data, status, headers) {
                    console.log(data);
                    if (status == 422) {

                        $scope.warning('لطفاً ابتدا ' +
                            $scope.selected_indicator.report_type +
                            ' را تدوین سپس اقدام به ارسال آن نمایید.');
                    } else {

                        $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                    }
                });
            }
        });
    };
    $scope.edit_current_indicator = function (row) {
        $scope.toggle_config_set();
        /* $scope.$parent.back_to_parent($scope);*/
        var indicator = angular.copy(row.indicator);
        $scope.indicator.name = indicator.name;
        $scope.indicator.id = indicator._id;
        for (var key in indicator) {
            if (indicator.hasOwnProperty(key) && $scope.indicator.hasOwnProperty(key)) {
                /*  console.log(key,'=====>',indicator[key])*/
                if (key == 'create_date' || key == 'revise_date') {
                    $scope.indicator[key] = $scope.get_date(indicator[key]);
                } else if (key == 'forje' && indicator[key]) {
                    if (indicator.timeline === 'روزانه') {
                        $scope.indicator.delivery_time = moment(indicator[key]);
                    } else if (indicator.timeline == 'سالانه') {
                        $scope.indicator.delivery_day = indicator[key];
                    } else {
                        $scope.indicator.delivery_day0 = indicator[key];
                    }
                } else {
                    $scope.indicator[key] = indicator[key];
                    if (key == 'uom') {
                        if ($scope.units.indexOf(indicator[key]) === -1) {
                            $scope.indicator[key] = 'سایر موارد';
                            $scope.indicator.other_uom = indicator[key];
                        }
                    } else if (key == 'source') {
                        if ($scope.sources.indexOf(indicator[key]) === -1) {
                            $scope.indicator[key] = 'سایر موارد';
                            $scope.indicator.other_source = indicator[key];
                        }
                    } else if (key == 'report_type') {
                        if ($scope.report_types.indexOf(indicator[key]) === -1) {
                            $scope.indicator[key] = 'سایر موارد';
                            $scope.indicator.other_report_type = indicator[key];
                        }
                    }
                }

            } else if (key == 'indicator_ward') {
                $scope.indicator.wards = indicator[key].map(function (ward) {
                    ward.id = ward.ward_id;
                    return angular.copy(ward);
                });
            } else if (key == 'is_related_safty') {
                $scope.indicator.is_relate_to_safty = indicator[key];
            }
        }
    };
    $scope.getStyleThis = function (id) {

        var element = angular.element("#" + id);
        var parent = element.parent();
        var h = parent.css('height');
        var hh = h.replace("px", '');
        element.css({'width': h, 'right': -((hh / 2) - 32.5) + "px"});
    };
    $scope.next = function (step) {
        if (step !== 'finish') {
            if ($scope.config_set) {
                if (step === 1) {
                    if ($scope.indicator.name.length) {
                        if ($scope.indicator.create_date.length) {
                            if ($scope.indicator.revise_date.length) {
                                if ($scope.indicator.definition.length) {
                                    if ($scope.indicator.formul.length) {
                                        console.log($scope.indicator);
                                    } else {
                                        $scope.warning('لطفاً  فرمول شاخص  را وارد کنید.');
                                        return false;
                                    }
                                } else {
                                    $scope.warning('لطفاً تعریف شاخص و اهمیت موضوع را وارد کنید.');
                                    return false;
                                }
                            } else {
                                $scope.warning('لطفاً تاریخ بازنگری را وارد کنید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً تاریخ تدوین را وارد کنید.');
                            return false;
                        }
                    } else {
                        $scope.warning('لطفاً نام شاخص را وارد کنید.');
                        return false;
                    }
                } else if (step === 2) {
                    if ($scope.indicator.basis.length) {

                        var source = $scope.indicator.source !== 'سایر موارد' ? $scope.indicator.source : $scope.indicator.other_source;
                        if (source.length) {
                            /*  if($scope.indicator.indicator_type.length){*/

                            if ($scope.indicator.desirability.length) {
                                var uom = $scope.indicator.uom !== 'سایر موارد' ? $scope.indicator.uom : $scope.indicator.other_uom;
                                if (uom.length) {
                                    var report_type = $scope.indicator.report_type !== 'سایر موارد' ? $scope.indicator.report_type : $scope.indicator.other_report_type;
                                    if (report_type.length) {
                                        console.log($scope.indicator);
                                    } else {
                                        $scope.warning('لطفاً  نحوه گزارش دهی  را وارد کنید.');
                                        return false;
                                    }
                                } else {
                                    $scope.warning('لطفاً  واحد اندازه گیری شاخص  را وارد کنید.');
                                    return false;
                                }
                            } else {
                                $scope.warning('لطفاً  مطلوبیت شاخص  را وارد کنید.');
                                return false;
                            }

                            /* }else{
                                    $scope.warning('لطفاً  نوع شاخص  را وارد کنید.');
                                    return false;
                                }*/
                        } else {
                            $scope.warning('لطفاً  منبع شاخص  را وارد کنید.');
                            return false;
                        }

                    } else {
                        $scope.warning('لطفاً  مبنای شاخص  را وارد کنید.');
                        return false;
                    }
                } else if (step === 3) {
                    if ($scope.indicator.timeline.length) {
                        console.log($scope.indicator);
                    } else {
                        $scope.warning('لطفاً  دوره تناوب اندازه گیری  را وارد کنید.');
                        return false;
                    }
                } else if (step === 4) {
                    if ($scope.indicator.is_relate_to_safty !== '') {
                        console.log($scope.indicator);
                    } else {
                        $scope.warning('لطفاً سوال مربوط به ایمنی بیمار بودن را پاسخ دهید.');
                        return false;
                    }
                }

            } else if ($scope.selected_indicator) {
                if (step === 1) {
                    if ($scope.selected_indicator.report_type === 'چک لیست') {
                        if ($scope.check_list.title.length) {
                            if ($scope.check_list.number.length) {
                                if ($scope.check_list.goal.length) {
                                    if ($scope.check_list.has_components && !$scope.check_list.components.length) {
                                        $scope.warning('لطفاً اجزای چک لیست را وارد کنید.');
                                        return false;
                                    } else {
                                        if (!$scope.check_list.components.length) {
                                            $scope.addComponet_check_list();
                                        }
                                    }
                                } else {
                                    $scope.warning('لطفاً هدف چک لیست را وارد کنید.');
                                    return false;
                                }
                            } else {
                                $scope.warning('لطفاً شماره چک لیست را وارد کنید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً عنوان چک لیست را وارد کنید.');
                            return false;
                        }
                    } else {
                        if ($scope.questionnaire.title.length) {
                            if ($scope.questionnaire.number.length) {
                                if ($scope.questionnaire.has_components && !$scope.questionnaire.components.length) {
                                    $scope.warning('لطفاً اجزای پرسشنامه را وارد کنید.');
                                    return false;
                                } else {
                                    if (!$scope.questionnaire.components.length) {
                                        $scope.addComponet();
                                    }
                                    $scope.questionnaire.components = $filter('unique')($scope.questionnaire.components, 'title')
                                    console.log($scope.questionnaire);
                                }


                            } else {
                                $scope.warning('لطفاً شماره پرسشنامه را وارد کنید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً عنوان پرسشنامه را وارد کنید.');
                            return false;
                        }
                    }
                } else if (step === 2) {
                    if ($scope.selected_indicator.report_type === 'چک لیست') {
                        var ch = [], ch_keys = [];
                        ch = $scope.check_list.question.filter(function (q) {
                            if (q.checked && q.text && q.text.length) {
                                return q;
                            } else if (q.checked) {
                                if (!q.text || !q.text.length) {
                                    ch_keys.push(q);
                                }
                            }
                        });
                        if (!ch.length) {
                            $scope.warning('لطفاً سوالات چک لیست را وارد نمایید.');
                            return false;
                        }
                        if (ch_keys.length) {
                            $scope.warning('لطفاً متن تمامی سوالات چک لیست را وارد نمایید.');
                            return false;
                        }
                        $scope.check_list.question = angular.copy(ch);

                    } else {
                        var qus = [];
                        var keys = [], point_type = [];
                        /*  var open_questions=[];*/
                        qus = $scope.questionnaire.questions.filter(function (q) {
                            if (q.checked && q.key && q.key.length && q.point_type && q.point_type.length) {
                                /* if(q.point_type==='سوال باز'){
                                   open_questions.push(true);
                               }*/
                                return q;
                            } else if (q.checked) {
                                if (!q.key || !q.key.length) {
                                    keys.push(q);
                                }
                                if (!q.point_type || !q.point_type.length) {
                                    point_type.push(q);
                                }
                            }
                        });
                        if (!qus.length) {
                            $scope.warning('لطفاً سوالات پرسشنامه را وارد نمایید.');
                            return false;
                        }
                        if (keys.length) {
                            $scope.warning('لطفاً متن تمامی سوالات انتخابی پرسشنامه را وارد نمایید.');
                            return false;
                        }
                        if (point_type.length) {
                            $scope.warning('لطفاً نوع پاسخ دهی تمامی سوالات پرسشنامه را انتخاب نمایید.');
                            return false;
                        }


                        $scope.questionnaire.questions = angular.copy(qus);
                        var question_points = $filter('groupBy')($scope.questionnaire.questions, 'point_type');

                        /* $scope.questionnaire.question_points=$scope.questionnaire.id?$scope.questionnaire.question_points:[];*/
                        $scope.questionnaire.question_points = $scope.questionnaire.question_points.filter(function (itm) {
                            if (question_points.hasOwnProperty(itm.point_type)) {
                                return itm;
                            }
                        });
                        for (var key in question_points) {
                            if (question_points.hasOwnProperty(key)) {
                                var has_this_key = $scope.questionnaire.question_points.some(function (itm) {

                                    if (itm.point_type == key) {
                                        return true;
                                    }
                                });
                                if (!has_this_key) {
                                    $scope.questionnaire.question_points.push({
                                        point_type: key,
                                        determine: key == 'دوسطحی' ? ['', ''] : [''],
                                        guide: ['']
                                    });
                                }
                            }
                        }
                        $scope.questionnaire.question_points = $scope.questionnaire.question_points.filter(function (itm) {

                            if (itm.point_type && itm.point_type.length && question_points.hasOwnProperty(itm.point_type)) {
                                return itm;
                            }
                        });
                        if ($scope.questionnaire.question_points.length === 1 && $scope.questionnaire.question_points[0].point_type === 'سوال باز') {
                            $scope.next(3);
                        }
                    }
                } else if (step === 3) {
                    if ($scope.selected_indicator.report_type === 'چک لیست') {
                        if ($scope.check_list.rating_type && $scope.check_list.rating_type.length) {
                            var guids = [];
                            guids = $scope.check_list.guide.filter(function (itm) {
                                if (itm.value && itm.value.length) {
                                    return itm;
                                }
                            });
                            if (guids.length) {
                                console.log(guids);
                            } else {
                                $scope.warning('لطفاً مقادیر امتیاز سوالات چک لیست را تعیین نمایید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً نوع امتیاز دهی به سوالات چک لیست را انتخاب نمایید.');
                            return false;
                        }
                    } else {
                        var all_compalte = false;

                        if ($scope.questionnaire.question_points.length) {
                            all_compalte = $scope.questionnaire.question_points.every(function (itm) {

                                if (itm.determine.length && itm.determine.indexOf('') === -1 || itm.point_type === 'سوال باز') {

                                    return true;
                                }
                            });
                            if (!all_compalte) {
                                $scope.warning('لطفاً پاسخ سوالات پرسشنامه را وارد نمایید.');
                                return false;
                            }
                            $scope.point_type.max = [];
                            $scope.questionnaire.question_points.forEach(function (q) {
                                if (q.determine.length > $scope.point_type.max.length) {
                                    $scope.point_type.max = $scope.new_Array(q.determine.length);
                                }
                            });

                        }
                    }

                }
            }
            $scope.steps.push(step);

        } else {
            var valid_ward = $scope.indicator.wards && $scope.indicator.wards.length ? $scope.indicator.wards.every(function (ward) {
                console.log(ward);
                if (ward.id && ward.responsible_collector && ward.responsible_monitor && ward.target !== undefined && ward.target.length && ward.up_line !== undefined && ward.up_line.length && ward.bottom_line !== undefined && ward.bottom_line.length) {
                    return true;
                }
            }) : false;
            if (valid_ward) {
                var parameter = JSON.stringify({
                    name: $scope.indicator.name,
                    code: $scope.indicator.code,
                    create_date: $scope.get_miladi_date($scope.indicator.create_date, '00:00'),
                    revise_date: $scope.get_miladi_date($scope.indicator.revise_date, '00:00'),
                    definition: $scope.indicator.definition,
                    reasons: $scope.indicator.reasons,
                    formul: $scope.indicator.formul,
                    basis: $scope.indicator.basis,
                    aspect: $scope.indicator.aspect,
                    source: $scope.indicator.source !== 'سایر موارد' ? $scope.indicator.source : $scope.indicator.other_source,
                    indicator_type: $scope.indicator.indicator_type,
                    quality_dimension: $scope.indicator.quality_dimension,
                    desirability: $scope.indicator.desirability,
                    uom: $scope.indicator.uom !== 'سایر موارد' ? $scope.indicator.uom : $scope.indicator.other_uom,
                    report_type: $scope.indicator.report_type !== 'سایر موارد' ? $scope.indicator.report_type : $scope.indicator.other_report_type,
                    measure_interval: $scope.indicator.measure_interval,
                    scorecard: $scope.indicator.scorecard,
                    forje: $scope.indicator.timeline === 'روزانه' ? $scope.indicator.delivery_time.toString().substring(16, 21) : ($scope.indicator.timeline === 'سالانه' ? $scope.indicator.delivery_day : $scope.indicator.delivery_day0),
                    timeline: $scope.indicator.timeline,
                    see_bsc: $scope.indicator.see_bsc,
                    bsc_weight: $scope.indicator.see_bsc ? $scope.indicator.bsc_weight : 0,
                    is_related_safty: $scope.indicator.is_relate_to_safty,
                    wards: $scope.indicator.wards,
                    year: $rootScope.year,
                    save: true,
                    id: $scope.indicator.id
                });
                $http.post(Server_URL + '/v1/user/hospital/indicator', parameter, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.get_indicators('');
                        $scope.success_alert('اطلاعات شاخص با موفقیت افزوده شد.', 'ثبت شاخص');
                        $scope.toggle_config_set();
                        $scope.indicator.id = null;

                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            } else {
                $scope.warning('لطفاً اطلاعات هر بخش را بدرستی وارد کنید.');
            }
        }

    };
    $scope.cancel = function () {

        $scope.reset_steps();
        $scope.cancel_edite_indicator();
    };
    $scope.last = function (step) {
        if ($scope.indicator.name.length) {
            if (step === 2) {
                $scope.indicator.delivery_day0 = angular.copy($scope.indicator.delivery_day);
            }
        }
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
    $scope.show_detail = function (row) {
        $scope.selected_indicator = row;
        $scope.soorat = [];
        $scope.makhraj = [];
        $scope.all_answer = [];

        if ($scope.selected_indicator.indicator.formul) {

            var soorat = $scope.selected_indicator.indicator.formul[0];
            var makhraj = $scope.selected_indicator.indicator.formul[1];
            var up = $scope.to_array([], soorat, /[*/%+-]+/g);
            var down = $scope.to_array([], makhraj, /[*/%+-]+/g);
            var operators = [];
            var operators2 = [];
            for (var i = 0; i < soorat.length; i++) {
                var this_char = soorat.substring(i, i + 1);
                if (this_char.match(/[*/%+-]+/g)) {
                    operators.push(this_char);
                }
            }

            var z = 0, v = 0;
            for (var j = 0; j <= up.length; j++) {
                if (j !== 0 && operators[z] !== undefined) {
                    $scope.soorat.push({operator: operators[z]});
                    z++;
                }
                if (up[j] !== undefined) {
                    v = '';
                    $scope.soorat.push({value: v, placeholder: up[j]});
                }
            }

            for (i = 0; i < makhraj.length; i++) {
                this_char = makhraj.substring(i, i + 1);
                if (this_char.match(/[*/%+-]+/g)) {
                    operators2.push(this_char);
                }
            }
            z = 0;
            for (j = 0; j <= down.length; j++) {
                if (j !== 0 && operators2[z] !== undefined) {
                    $scope.makhraj.push({operator: operators2[z]});
                    z++;
                }
                if (down[j] !== undefined) {
                    v = '';
                    $scope.makhraj.push({value: v, placeholder: down[j]});
                }
            }
        }

        $scope.selected_indicator.indicator.ward = $filter('filter_by')(row.indicator.indicator_ward, 'ward_id', row._id)[0];
        set_calender();

        $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/show_status_of_indicator.htm';
        $scope.is_parent = false;
    };
    $scope.show_detail_of_status = function (row, day) {
        console.log(row);
        var row_copy = angular.copy(row);

        if ($scope.selected_indicator.indicator.timeline === 'روزانه') {
            row_copy.submitted_at = row.days_object[day].submitted_at;
            row_copy.day = $filter('persianNum')(day + 1, true);
            row_copy.answer = row.days_object[day].answer;
            row_copy.status_class = row.days_object[day].status_class;
            row_copy.className = row.days_object[day].className;
        }


        $scope.formul_result = row_copy.answer && row_copy.answer.value != null ? row_copy.answer.value : '';
        $scope.detail_of_status = row_copy;
        $scope.detail_of_status_copy = row_copy;
        $scope.soorat = [];
        $scope.makhraj = [];
        $scope.all_answer = [];
        var formul = row_copy.answer.formul.map(function (itm) {

            return JSON.parse(itm);
        });
        if ($scope.selected_indicator.indicator.formul) {

            var soorat = $scope.selected_indicator.indicator.formul[0];
            var makhraj = $scope.selected_indicator.indicator.formul[1];
            var up = $scope.to_array([], soorat, /[*/%+-]+/g);
            var down = $scope.to_array([], makhraj, /[*/%+-]+/g);
            var operators = [];
            var operators2 = [];
            for (var i = 0; i < soorat.length; i++) {
                var this_char = soorat.substring(i, i + 1);
                if (this_char.match(/[*/%+-]+/g)) {
                    operators.push(this_char);
                }
            }

            var z = 0, v = 0;
            for (var j = 0; j <= up.length; j++) {
                if (j !== 0 && operators[z] !== undefined) {
                    $scope.soorat.push({operator: operators[z]});
                    z++;
                }
                if (up[j] !== undefined) {
                    v = formul[0][j].value !== undefined && formul[0][j].value !== '' ? formul[0][j].value : formul[0][j + z].value;
                    $scope.soorat.push({value: v, placeholder: up[j]});
                }
            }

            for (i = 0; i < makhraj.length; i++) {
                this_char = makhraj.substring(i, i + 1);
                if (this_char.match(/[*/%+-]+/g)) {
                    operators2.push(this_char);
                }
            }
            z = 0;
            for (j = 0; j <= down.length; j++) {
                if (j !== 0 && operators2[z] !== undefined) {
                    $scope.makhraj.push({operator: operators2[z]});
                    z++;
                }
                if (down[j] !== undefined) {
                    v = formul[1][j].value !== undefined && formul[1][j].value !== '' ? formul[1][j].value : formul[1][j + z].value;
                    $scope.makhraj.push({value: v, placeholder: down[j]});
                }
            }
        }

        $timeout(function () {
            $scope.detail_of_status_modal = $scope.open_modal('lg', 'detail_of_status.html', null, null, 'blue_modal', $scope);
        }, 100);

    };
    $scope.get_indicator_answer_eop = function (answer) {

        var result = answer;
        if ($scope.selected_indicator.indicator.answers && $scope.selected_indicator.indicator.answers.length) {
            $scope.selected_indicator.indicator.answers.map(function (itm) {
                if (itm._id == answer._id) {
                    result = itm;
                }
            })
        }
        return result;
    };
    $scope.close_details = function () {
        $scope.detail_of_status_modal.dismiss();
    };
    $scope.edit_indicator = function (row) {
        $scope.selected_indicator = row.indicator;
        $scope.new_indicator_wards = [];

        $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/edit_indicator.htm';
        $scope.is_parent = false;
    };

    $scope.config_checklist = function (row) {
        console.log(row)
        $scope.is_parent = false;

        $scope.reset_steps();

        if (row) {
            $scope.check_list._id = null;
            $scope.questionnaire._id = null;
            $scope.reset_params($scope.check_list);
            $scope.reset_params($scope.questionnaire);
            $scope.currentComponent.selected = '';
            $scope.questionnaire.questions = [{key: '', point_type: '', checked: true}];
            $scope.questionnaire.question_points = [{point_type: '', determine: [''], guide: ['']}];

            $scope.point_type.selected = null;
            if (row.indicator.indicator_checklist && row.indicator.indicator_checklist.length) {
                var c = angular.copy(row.indicator.indicator_checklist[row.indicator.indicator_checklist.length - 1]);
                $scope.check_list = {
                    id: c._id,
                    title: c.title,
                    number: c.number,
                    goal: c.goal,
                    question: c.indicator_checklist_questions ? c.indicator_checklist_questions.map(function (itm) {
                        return {text: itm.text, checked: true, component: itm.component}
                    }) : [],
                    rating_type: c.rating_type,
                    guide: c.indicator_checklist_guides,
                    components: c.indicator_checklist_questions ? Object.keys($filter('groupBy')(c.indicator_checklist_questions, 'component')).map(function (itm) {
                        return {
                            title: itm
                        }
                    }) : [],
                    has_component: c.has_component
                };
            } else if (row.indicator.indicator_queries && row.indicator.indicator_queries.length) {
                var q = angular.copy(row.indicator.indicator_queries[row.indicator.indicator_queries.length - 1]);


                $scope.questionnaire = {
                    id: q._id,
                    title: q.title,
                    number: q.number,
                    description: q.description,
                    questions: q.indicator_query_questions ? q.indicator_query_questions.map(function (itm) {
                        itm.checked = true;
                        return itm;
                    }) : [],
                    question_points: q.indicator_query_points ? q.indicator_query_points : [],
                    has_component: q.has_component,
                    components: []
                };
                if ($scope.questionnaire.questions.length) {
                    var components = $filter("groupBy")($scope.questionnaire.questions, "component");
                    for (var key in components) {
                        if (components.hasOwnProperty(key)) {
                            $scope.questionnaire.components.push({title: key && key !== "null" && key !== "" ? key.toString() : ''});
                        }
                    }
                }

            }
            $scope.selected_indicator = row.indicator;
            if (row.indicator.save_temp) {
                if (row.indicator.report_type === 'چک لیست') {

                    $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/view_checklist.htm';
                } else {
                    var row_number = 0;
                    $scope.questionnaire.question_points.map(function (q) {
                        $scope.questionnaire.questions.forEach(function (itm) {
                            if (itm.point_type === q.point_type) {
                                if (!angular.isArray(q.questions)) {
                                    q.questions = [];
                                }
                                row_number++;
                                itm.row_number = angular.copy(row_number);

                                q.questions.push(itm);
                            }
                        });
                    });

                    $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/view_questionnaire.htm';
                }
                return false;
            }


        }
        if ($scope.selected_indicator.report_type === 'چک لیست') {

            $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/config_checklist.htm';
        } else {
            $scope.template.url = 'views/improve_quality/indicators/indicator-identity-card/config_questionnaire.htm';
        }


    };
    $scope.back_to_parent_fn = function () {
        $scope.selected_indicator = null;
    };

    $scope.basis_changed = function () {
        $scope.basis_has_changed = true;
        $scope.selected_wards = [];
        $timeout(function () {
            $scope.basis_has_changed = false;
        }, 300);
    };
    $scope.chartReload = function () {

        $scope.charts.chartInfo = [];
        var data = $scope.detail_of_status_copy.answer.indicator_answer_details.filter(function (itm) {
            return itm.reason_choose === $scope.charts.reason_choose;
        });
        var dependencies = angular.copy($scope.charts.chartsDependency($scope.charts.reason_choose));

        dependencies.map(function (d) {
            if (d.key === "user_type" && $scope.charts.reason_choose === "بیمار/ همراه بیمار") {
                var submitted_wards = $filter('groupBy')(data, 'user_type');
                d.labels = Object.keys(submitted_wards);
            }
            $scope.charts.chartInfo.push(setCharts(angular.copy(data), d));
        })
    }

    $scope.chartReload2 = function (chart, ward) {
        /*    console.log(chart,ward);*/
        var data = [];
        if (chart) {
            var index = $scope.charts.chartInfo.indexOf(chart);

            var total_data = $scope.charts.chartInfo[index].total_data;
            var selected_wards = $scope.charts.chartInfo[index].selected_wards || [];
            var data_chart = $scope.charts.chartInfo[index].data_chart;
            if (ward.checked) {
                selected_wards.push(ward);
            } else {
                selected_wards.splice(selected_wards.indexOf(ward), 1);
            }
            $scope.charts.chartInfo[index].selected_wards = selected_wards;
            if (!total_data) {
                $scope.charts.chartInfo[index].total_data = angular.copy(data_chart);
                data_chart = [data_chart, []]
            }
            if (selected_wards.length) {
                data = $scope.detail_of_status_copy.filter(function (itm) {
                    var isWards = selected_wards.some(function (w) {
                        return w._id === itm.indicator_ward.ward_id
                    });
                    return itm.reason_choose === $scope.charts.reason_choose && isWards;
                });
                console.log(data, chart);
                data_chart[1] = setCharts(angular.copy(data), chart).data_chart;
                $scope.charts.chartInfo[index].data_chart = data_chart;
            } else {
                $scope.charts.chartInfo[index].data_chart = total_data;
                delete $scope.charts.chartInfo[index].total_data;
            }


        } else {
            $scope.charts.chartInfo = [];
            data = $scope.detail_of_status_copy.filter(function (itm) {

                return itm.reason_choose === $scope.charts.reason_choose;
            });
            var dependencies = angular.copy($scope.charts.chartsDependency($scope.charts.reason_choose));

            dependencies.map(function (d) {
                if (d.key === "user_type" && $scope.charts.reason_choose === "بیمار/ همراه بیمار") {
                    var submitted_wards = $filter('groupBy')(data, 'user_type');
                    d.labels = Object.keys(submitted_wards);
                }
                $scope.charts.chartInfo.push(setCharts(angular.copy(data), d));
            })
        }

    }
    $scope.filteredByDate = function (date, chart_data, chart_labels) {

        $scope.chart_type = date.replace("یکبار", "");
        var fiteredData = labels[date]();
        if (!angular.isArray(fiteredData)) {
            fiteredData = [fiteredData];
        }
        var totalDataGrouped = [];
        var dataGrouped = [];
        var fl = fiteredData.length;
        var cl = chart_data[0].length;
        var c = angular.copy(chart_data);
        var countInGroup = cl / fl;
        var sliced = [];

        for (var i = 0; i < fl; i++) {
            sliced = [];
            c[0].slice(i * countInGroup, (i + 1) * countInGroup).map(function (s) {
                if (s === "NaN" || s === undefined || s === null) {

                } else {
                    sliced.push(parseFloat(s))
                }
            });
            if (sliced.length) {
                totalDataGrouped.push(sliced.reduce($scope.operator["+"]) / sliced.length);
                /*Total*/
            } else {
                totalDataGrouped.push(0)
            }

            if (chart_data[1].length) {

                sliced = [];
                c[1].slice(i * countInGroup, (i + 1) * countInGroup).map(function (s) {
                    if (s === "NaN" || s === undefined || s === null) {

                    } else {
                        sliced.push(parseFloat(s))
                    }
                });
                if (sliced.length) {
                    dataGrouped.push(sliced.reduce($scope.operator["+"]) / sliced.length);
                    /*middle wards*/
                } else {
                    dataGrouped.push(0)
                }
            }

        }

        $scope.fiteredData_data = [[], []];
        $scope.fiteredData_labels = [];
        fiteredData.map(function (d, i) {

            $scope.fiteredData_labels.push(d);
            $scope.fiteredData_data[0].push((totalDataGrouped[i]).toFixed(2));

            if (dataGrouped.length)
                $scope.fiteredData_data[1].push((dataGrouped[i]).toFixed(2));

        })
        $scope.open_modal('lg', 'chartModal.html', null, null, 'blue_modal', $scope);

    }
    $scope.show_amar = function (flag) {

        $scope.detail_of_status_copy = angular.copy($scope.detail_of_status);
        if (flag) {
            $scope.pie_chart = {
                options: {
                    layout: {
                        padding: {
                            left: 50,
                            right: 50,
                            top: 50,
                            bottom: 50
                        }
                    },
                    tooltips: {
                        titleFontSize: 9,
                        bodyFontSize: 10
                    },
                    scaleShowGridLines: false,
                    elements: {line: {tension: 0, fill: false}},
                    scales: {
                        xAxes: [{

                            ticks: {
                                fontSize: 1,
                                beginAtZero: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontSize: 12,
                                suggestedMin: 100,
                                min: 0,
                                beginAtZero: false,
                                maxTicksLimit: 15
                            }
                        }]

                    }
                },
                data_set: [],
                data_chart: [],
                labels_chart: [],
                colors_chart: [],
                series: [],
                /*  labels_chart:[],
                 data_chart:[],
                 options:{
                 layout: {
                 padding: {
                 left: 2,
                 right: 2,
                 top:10,
                 bottom: 10
                 }
                 },
                 tooltips: {
                 titleFontSize:10,
                 bodyFontSize:9,
                 },
                 scaleShowGridLines: false
                 }*/
            };
            $scope.pie_chart.data_chart = [0, 0];
            $scope.pie_chart.labels_chart = [];
            /*$scope.answer_chart.data_chart=[];
            $scope.answer_chart.labels_chart=[];
            var all_questions=[];
            var all_questions_2=[];
            var questions=[];
            var answers=[];
            var max={};
            var queries=[];*/
            /* if($scope.selected_indicator.indicator.indicator_queries){
                queries=angular.copy($scope.selected_indicator.indicator.indicator_queries);
                if(queries  && queries.length){
                    queries.reverse();
                    var query_questions=queries[0].indicator_query_questions;
                    var query_questions_group=$filter('groupBy')(query_questions,'point_type');
                    Object.keys(query_questions_group).map(function (point_type) {
                        var p=queries[0].indicator_query_points.find(function (itm) {
                            return itm.point_type===point_type.toString();
                        });
                        if(p.determine){
                            var rev=angular.copy(p.determine);
                            rev.reverse();
                        }
                        max[point_type]=p?(point_type.toString()==="کیفی"?p.determine.length:(point_type.toString()==="دوسطحی"?1:rev[0])):0;


                    })
                }
            }
            if($scope.selected_indicator.indicator.indicator_checklist){
                //  console.log(angular.copy($scope.selected_indicator.indicator.indicator_checklist))
                queries=angular.copy($scope.selected_indicator.indicator.indicator_checklist);
                if(queries  && queries.length){
                    queries.reverse();
                    $scope.multiComponent=queries[0].has_component;
                    if(queries[0].indicator_checklist_guides){
                        var guids=angular.copy(queries[0].indicator_checklist_guides);
                        guids.reverse();
                    }
                    max[queries[0].rating_type]=queries[0].rating_type==="کیفی"?queries[0].indicator_checklist_guides.length:(queries[0].rating_type==="دوسطحی"?1:guids[0].value);

                }
            }*/
            set_line_chart([$scope.selected_indicator.indicator]);
            if ($scope.detail_of_status_copy.answer.indicator_answer_details) {
                setAnswerChart($scope.selected_indicator.indicator, $scope.detail_of_status_copy.answer.indicator_answer_details)
                /* $scope.detail_of_status_copy.answer.indicator_answer_details.map(function (itm) {

                    $scope.isAll2Level=itm.indicator_answer_detail_records && itm.indicator_answer_detail_records.every(function (record) {
                        return record.point_type==='دوسطحی' || record.point_type==='دو سطحی';
                    });
                    if(itm.indicator_answer_detail_records){
                        itm.indicator_answer_detail_records.map(function (record) {
                            record.user_name=itm.name;
                            if($scope.selected_indicator.indicator.report_type==='پرسشنامه'){
                                if((record.point_type && record.point_type!=='سوال باز' && record.point_type!=='دوسطحی' && record.point_type!=='دو سطحی') || $scope.isAll2Level){
                                    all_questions.push(record);
                                }else{
                                    if(record.point_type && record.point_type==='دوسطحی')
                                        all_questions_2.push(record);
                                }
                            }else{
                                all_questions.push(record);
                            }

                            record.user_type=itm.user_type;
                            record.reason_choose=itm.reason_choose;
                        });
                    }
                });
                var uniqued= $filter('unique')(all_questions,'question');
                var components=null;
                var components_name=[];*/
                /*    if($scope.multiComponent){
                    components= $filter('groupBy')(queries[0].indicator_checklist_questions,'component');
                    $scope.components=angular.copy(components);
                    $scope.components.answers={};
                    components_name=angular.copy(Object.keys(components));
                    $scope.bar_chart.labels=[];
                    $scope.bar_chart.data_chart=[];

                }*/
                if ($scope.selected_indicator.indicator.report_type === 'پرسشنامه' && !$scope.isAll2Level) {
                    var q = $scope.selected_indicator.indicator.indicator_queries;

                    q[q.length - 1].indicator_query_points.map(function (itm) {
                        if (itm.point_type === 'دوسطحی') {
                            $scope.pie_chart.series = itm.determine;
                        }
                    });

                    var T = [];
                    var F = [];
                    if (all_questions_2 && all_questions_2.length) {

                        var uniqued2 = $filter('unique')(all_questions_2, 'question');
                        $scope.pie_chart.labels_chart = uniqued2.map(function (itm) {
                            return itm.question;
                        });
                        $scope.pie_chart.series.map(function (itm, i) {
                            var T_count = 0, F_count = 0;
                            all_questions_2.map(function (q) {

                                if (q.v == '0') {
                                    F_count++;
                                } else {
                                    T_count++;
                                }


                            });
                            var sum = T_count + F_count;
                            T.push(((T_count * 100) / sum).toFixed(2));
                            F.push(((F_count * 100) / sum).toFixed(2));

                        });
                        $scope.pie_chart.data_chart = [F, T];

                    }

                }
                /* $scope.answer_chart.labels_chart=uniqued.map(function (itm,i) {
                    var j=i+1;
                    var data_chart=[];
                    var data_set=$scope.answer_chart.data_set;
                    var data_sets=[];
                    var index=1;
                    questions[i]={};
                    var sum_y_avg=0;
                    var d=angular.copy(data_set);
                    var group_answer_by_ward;
                    var this_question=$filter('filter_by')(all_questions,'question',itm.question);

                    if($scope.selected_indicator.indicator.report_type==='پرسشنامه'){
                        group_answer_by_ward=$filter('groupBy')(this_question,'user_type');
                        if(group_answer_by_ward[""]){
                            group_answer_by_ward["نامشخص"]=group_answer_by_ward[""];
                            delete group_answer_by_ward[""];
                        }
                        for(var ward in group_answer_by_ward){
                            if(group_answer_by_ward.hasOwnProperty(ward)){

                                var q=group_answer_by_ward[ward];
                                questions[i][ward]=q;
                                var group_answer=$filter('groupBy')(q,'value');
                                var sum_y=0;
                                for(var key in group_answer){
                                    if(group_answer.hasOwnProperty(key)){
                                        var first=group_answer[key][0];
                                        var w=key.toString().replace(/[^-0-9\.]/g, '')===key.toString() && parseFloat(key)!=undefined?key:(first?first.v:0);
                                        var y=group_answer[key].length*w;
                                        sum_y+=y;
                                    }
                                }
                                var avg=(sum_y/(q.length*max[q[0].point_type])).toFixed(2);

                                sum_y_avg=$scope.operator["+"](sum_y_avg,avg);
                                data_chart.push(avg);

                                //  d.borderColor=$scope.set_color(index,data_sets.map(function (value) { return value.borderColor; }));
                                index++;
                                d.name=ward;
                                data_sets.push(angular.copy(d));
                            }
                        }
                        questions[i]['تمام بخش ها']=angular.copy(this_question);
                        var count=data_chart.length;

                        data_chart.push((sum_y_avg/count).toFixed(2));
                        d.name='تمام بخش ها';
                        data_sets.push(angular.copy(d));
                    }else{
                        questions[i]['question']=itm.question;
                        var group_answer=$filter('groupBy')(angular.copy(this_question),'value');
                        var sum_y=0;
                        for(var key in group_answer){
                            if(group_answer.hasOwnProperty(key)){

                                var first=group_answer[key][0];
                                var w=key.toString().replace(/[^-0-9\.]/g, '')===key.toString() && parseFloat(key)!=undefined?key:(first?first.v:0);

                                var y=group_answer[key].length*w;
                                sum_y+=y;
                            }
                        }

                        this_question.map(function (q) {
                            questions[i][q.user_name]=q.value;
                        })
                        var avg=sum_y/(this_question.length*max[this_question[0].point_type]);
                        data_chart=(avg*100).toFixed(2);

                        d.name='میانگین پاسخ ها';
                        data_sets.push(angular.copy(d));
                        if(components){
                            components_name.map(function (component) {

                                components[component].map(function (q) {
                                    if(q.text===this_question[0].question){
                                        q.value=angular.copy(avg);
                                        if(!$scope.components.answers[component]){
                                            $scope.components.answers[component]=[];
                                        }
                                        $scope.components.answers[component].push((avg*100).toFixed(2));
                                    }
                                })
                            })
                        }
                    }
                    $scope.answer_chart.data_chart[i]=angular.copy(data_chart);
                    return 'سوال'+j;
                });
                if(components){
                    var sum_component_values={};
                    components_name.map(function (component) {
                        sum_component_values[component]=0
                        components[component].map(function (q) {
                            sum_component_values[component]=$scope.operator["+"](q.value,sum_component_values[component]);

                        });
                        if($scope.bar_chart.labels.indexOf(component)===-1){
                            $scope.bar_chart.labels.push(component);
                        }
                        $scope.bar_chart.data_chart.push(((sum_component_values[component]/components[component].length)*100).toFixed(2));
                    });

                }
                $scope.answer_chart.options.tooltips.custom=function (tooltipModel){
                    var q=[];
                    var title='';
                    tooltipModel.title=[];
                    if(!this.__tooltip){
                        this.__tooltip={};
                    }
                    if(tooltipModel.dataPoints && tooltipModel.dataPoints.length){
                        if($scope.selected_indicator.indicator.report_type==='پرسشنامه') {
                            var qs = questions[tooltipModel.dataPoints[0].index];
                            tooltipModel.wards = Object.keys(qs);
                            for (var ward in qs) {
                                if (qs.hasOwnProperty(ward)) {
                                    q = qs[ward];
                                    title = [];
                                    if (q && q.length) {
                                        tooltipModel.title = [q[0].question];

                                        title = q.map(function (itm) {
                                            var r = '';
                                            r = itm.reason_choose ? itm.reason_choose + ' ' : '';
                                            return r + itm.value;
                                        });


                                    }
                                    this.__tooltip[ward] = title;
                                }
                            }

                        }else{
                            tooltipModel.wards=['میانگین نظرات']
                            q = angular.copy(questions[tooltipModel.dataPoints[0].index]);
                            tooltipModel.title=[q['question']];
                            delete q.question;
                            title = Object.keys(q).map(function (key) {

                                return key+':'+q[key];
                            });
                            this.__tooltip['پاسخ ها'] = title;

                        }
                    }


                    /!* tooltipModel.title=title.length?title:['پاسخی برای این سوال ثبت نشده است.'];*!/
                    return customTooltips.bind(this)(tooltipModel);
                }*/
            }

        }


    };
    $scope.onClickAnserChart = function (e) {
        /*  $scope.answer_chart_data={};
          e.map(function (itm) {
              $scope.answer_chart_data[
          })*/
        if (e[0]) {
            $scope.answer_chart_data = angular.copy(e[0]._chart.tooltip.__tooltip);
            $scope.open_modal('lg', 'answer_chart_data.html', null, null, 'blue_modal', $scope);
        }


    }

    $scope.onClickAnswerChart = function (e) {
        /*  $scope.answer_chart_data={};
        e.map(function (itm) {
            $scope.answer_chart_data[
        })*/
        $scope.answer_chart_data = [];
        if (e[0]) {
            var component = e[0]._model.label;
            if ($scope.current_indicator.report_type === 'پرسشنامه') {
                $scope.currentQuestion = {
                    name: e[0]._chart.tooltip.__tooltip,
                    data_chart: [],
                    labels_chart: [],

                }
                var q = $scope.bar_chart_questioner[$scope.currentQuestion.name];
                q.wards.map(function (d) {
                    $scope.currentQuestion.data_chart.push(d.avg);
                    $scope.currentQuestion.labels_chart.push(d.ward);
                    $scope.currentQuestion[d.ward] = angular.copy(d.answers.map(function (value) {
                        return value.reason_choose + ": " + value.value
                    }));
                })

                $scope.open_modal('lg', 'answer_chart_of_question.html', null, null, 'blue_modal', $scope);
            } else {

                $scope.answer_chart_data = angular.copy(e[0]._chart.tooltip.__tooltip);
                $scope.open_modal('lg', 'answer_chart_data.html', null, null, 'blue_modal', $scope);
            }
        }


    }
    $scope.onClickAnswerQChart = function (e) {
        if (e[0]) {
            $scope.currentWard.name = e[0]._model.label;
            $scope.currentWard.answer_chart_data = $scope.currentQuestion[$scope.currentWard.name] || [];
            $scope.open_modal('lg', 'answer_chart_data2.html', null, null, 'blue_modal', $scope);
        }
    }
    $scope.onClickComponentChart = function (e) {
        if (e[0]) {
            var component = e[0]._model.label;
            $scope.currentComponent = {
                questions: [], data: $scope.components.answers[component], name: component
            };
            var c = $scope.components[component];
            c.map(function (itm) {
                $scope.currentComponent.questions.push(itm.text);
            })
            $scope.open_modal('lg', 'answer_chart_data_currentComponent.html', null, null, 'blue_modal', $scope);
        }


    }

    function getDatesOptions(timeline) {
        var timelines = [
            'روزانه',
            'هفتگی',
            'ماهانه',
            'سه ماه یکبار',
            'شش ماه یکبار',
            'سالانه',
        ];
        return timelines.splice(timelines.indexOf(timeline) + 1, 5);
    }

    $scope.selectIndicator = function () {
        $scope.filter.questioner = false;
        $scope.wards.map(function (w) {
            w.checked = false;
        })
        $scope.set_line_chart();

        $scope.indicators.map(function (i) {
            if (i.name == $scope.filter.name) {
                if (i.report_type == 'پرسشنامه' || i.report_type == 'چک لیست') {

                    setAnswerChart(i);
                }
                $scope.dates = getDatesOptions(i.timeline);
                if (i.report_type == 'پرسشنامه') {
                    $scope.filter.questioner = true;

                    $scope.detail_of_status_copy = [];
                    i.indicator_ward.map(function (w) {
                        if (w.indicator_answers) {
                            w.indicator_answers.map(function (a) {
                                if (a.indicator_answer_details) {
                                    a.indicator_answer_details.forEach(function (d) {
                                        d.indicator_ward = w;
                                        $scope.detail_of_status_copy.push(d);
                                    })
                                }


                            })
                        }

                    })
                }
            }
        })
    };
    $scope.gozaresh_amari = function () {

        $scope.show_amar(false);
        $scope.indicator_answer_details = $scope.detail_of_status.answer.indicator_answer_details;
        $scope.gozaresh_amari_ = $scope.open_modal('lg', 'gozaresh.html', null, null, 'blue_modal full_width', $scope);
    };
    $scope.gozaresh_chart = function () {

        $scope.show_amar(true);
        $scope.indicator_answer_details = $scope.detail_of_status.answer.indicator_answer_details;
        $scope.gozaresh_amari_ = $scope.open_modal('lg', 'chart.html', null, null, 'blue_modal full_width', $scope);
    };
    $scope.close_gozaresh = function () {
        $scope.gozaresh_amari_.dismiss();
    };
    $scope.show_detail_of_answer = function (row) {
        $scope.detail_questions_of_responser = row;
        $scope.indicator_answer_detail_records = row.indicator_answer_detail_records;
        $scope.indicator_answer_details_ = $scope.open_modal('lg', 'indicator_answer_details.html', null, null, 'full_width only_content', $scope);
    };
    $scope.indicator_answer_details_close = function () {
        $scope.indicator_answer_details_.dismiss();
    };
    $scope.choose_partners = function (partners, array_, param) {

        var arr = [];
        arr = angular.copy($scope.users);

        if (partners) {
            partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    partners.forEach(function (p) {
                        if (obj.id == p) {

                            itm.users[itm.users.indexOf(obj)].checked = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                array_[param] = r.map(function (itm) {
                    return itm.id;
                });
            }
        });

    };

    $scope.get_indicators = function (ward) {
        var q = ward.length ? '&ward=' + ward : '';
        if (location.indexOf('PatientSafetyIndicators') !== -1) {
            q += '&is_related_safty=true';
        }
        factory1.getUserApi('/v1/user/hospital/indicators', q).then(function (data) {

            if (ward.length) {
                $scope.wardsIndicator = false;
                if ($rootScope.only_is_related_safty) {
                    data = data.filter(function (d) {
                        return d.is_related_safty;
                    })
                }
                var result = data;
                $scope.indicators = angular.copy(result);
                if (location.indexOf('IndicatorProcessing') !== -1 || $scope.selected_indicator) {
                    set_indicators_group();
                    $scope.indicators_copy = angular.copy(result);
                    $scope.pie_chart.data_chart1 = [0, 0, 0];
                    $scope.pie_chart.data_chart2 = [0, 0, 0];
                    $scope.pie_chart.data_chart3 = [0, 0, 0];
                    result.forEach(function (itm) {
                        if (itm.basis.indexOf('عملکردی') >= 0) {
                            set_pie_chart_data(itm, 'data_chart1');

                        } else if (itm.basis.indexOf('فرآیندی') >= 0) {
                            set_pie_chart_data(itm, 'data_chart2');

                        } else {
                            set_pie_chart_data(itm, 'data_chart3');

                        }
                    });

                    $scope.pie_chart.data_chart1 = $scope.pie_chart.percent_data_chart($scope.pie_chart.data_chart1);
                    $scope.pie_chart.data_chart2 = $scope.pie_chart.percent_data_chart($scope.pie_chart.data_chart2);
                    $scope.pie_chart.data_chart3 = $scope.pie_chart.percent_data_chart($scope.pie_chart.data_chart3);

                    if ($scope.selected_indicator) {
                        $scope.filter.name = $scope.selected_indicator.name;
                        $scope.set_line_chart();
                        $scope.selected_wards = [];
                    }
                }
            } else {
                $scope.wardsOfIndicators = data;
                $scope.wardsIndicator = true;
            }

        });
    };
    $scope.show_indicator_of_ward = function (row) {
        $scope.get_indicators(row._id);
    };
    $scope.ShowWardsIndicator = function () {
        $scope.wardsIndicator = true;
        $scope.indicators = [];
    }
    var location = $location.path();
    if (location.indexOf('IndicatorProcessing') !== -1 || $scope.selected_indicator) {
        $scope.get_indicators('0');

    } else {
        $scope.get_indicators('');
    }

    $scope.$watch('wards', function (newVal, oldVal) {
        if (oldVal !== newVal) {
            $scope.charts.patientData.map(function (p) {
                if (p.title === 'بخش/ واحد مربوطه') {
                    p.labels = angular.copy($scope.wards.map(function (w) {
                        return w.name;
                    }));
                }
            })
        }
    });
});

app.controller('programs_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope, $filter, $timeout) {

    $scope.template = {url: ''};
    $scope.is_parent = true;
    $scope.all_programs = [];
    $scope.choose_program_type = null;
    $scope.survey_started = false;
    $scope.survey = {
        user_id: '',
        rate: null
    };
    $scope.surveies = [];
    $scope.rate_1 = [];
    $scope.rate_2 = [];
    $scope.rate_3 = [];
    $scope.rate_4 = [];
    $scope.rate_5 = [];
    $scope.str = {
        resalat: '',
        cheshm_andaz: '',
        arzesh_bonyadi: [{text: ''}],
        beneficiaries: [{
            name: '',
            internal: '',
            external: '',
            description: ''
        }], /*name , internal , external , description )*/
        factors: [], /*factor_type  , weight  ,score , description*/
        defines: []/*factors[] , description */

    };
    $scope.factor = {
        type: '',
        description: '',
        index: -1
    };
    $scope.all_strategies = [];
    $scope.result_rate = null;
    $scope.result_status = null;
    $scope.filter = {
        ward: '',
        indicator: '',
        status: 'All',
        strategic_goal: '',
        strategy: '',
        need_money: '',
        relate_patient_safty: '',
        programStatus: []
    };
    $scope.total_s_w = 0;
    $scope.total_o_t = 0;
    $scope.total_score_o_t = 0;
    $scope.total_score_s_w = 0;
    $scope.total_weight_score_o_t = 0;
    $scope.total_weight_score_s_w = 0;
    $scope.config_strategic = false;
    $scope.only_this_strategic = '';
    $scope.Eopstep = {
        need_money: false,
        partners: [],
        responsible_person: '',
        end_time: '',
        _end_time: '',
        start_time: '',
        _start_time: '',
        description: ''
    };
    $scope.months = [];
    $scope.ProgramPercent2 = 0;
    $scope.ProgramPercent1 = 0;
    $scope.ProgramPercent0 = 0;
    $scope.ProgramPercentNaN = 0;
    $scope.strategic_goal_List = [];
    $scope.strategy_List = [];
    $scope.active_view = -1;
    $scope.pie_chart = {
        labels_chart: ['انجام نشده', 'دردست اقدام', 'تکمیل شده'],
        colors_chart: ['#8064a2', '#4f81bd', '#c0504d'],
        data_chart: [0, 0, 0],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        }
    };
    $scope.reset_steps();
    $scope.source_types = [
        "منابع انسانی",
        " مواد/ وسایل / ابزار",
        " فضای فیزیکی",
        "منابع اطلاعاتی"
    ];
    $scope.strategic_goal_List = [];
    $scope.strategy_List = [];
    $scope.strategy_List2 = [];
    $scope.strategic_goal_List_copy = [];
    $scope.source_types = [
        "منابع انسانی",
        " مواد/ وسایل / ابزار",
        " فضای فیزیکی",
        "منابع اطلاعاتی"
    ];
    $scope.page = 1;
    $scope.finished_repeator = false;
    $scope.has_programs = true;
    var stepInstans = {
        need_money: false,
        partners: [],
        responsible_person: '',
        end_time: '',
        _end_time: '',
        start_time: '',
        _start_time: '',
        description: '',
        source_type: '',
        cost: '',
        unit_count: '',
        unit_cost: ''
    };
    var GaugeConfigInstans = {
        size: 150,
        type: 'semi',
        thick: 10,
        min: 0,
        max: 100,
        value: 0,
        label: 'تعداد ',
        foregroundColor: '#1c94e0',
        backgroundColor: '#d6edff',
        append: '%'
    }

    function indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }

    /* function rating_set() {
     $scope.rate_1=[];
     $scope.rate_2=[];
     $scope.rate_3=[];
     $scope.rate_4=[];
     $scope.rate_5=[];
     var rate_arr=[0,0,0,0,0];
     $timeout(function () {
     $scope.surveies.forEach(function (itm) {
     if(itm.rate===1){
     $scope.rate_1.push(itm);
     rate_arr[0]++;
     }else if(itm.rate===2){
     $scope.rate_2.push(itm);
     rate_arr[1]++;
     }else if(itm.rate===3){
     $scope.rate_3.push(itm);
     rate_arr[2]++;
     }else if(itm.rate===4){
     $scope.rate_4.push(itm);
     rate_arr[3]++;
     }else if(itm.rate===5){
     $scope.rate_5.push(itm);
     rate_arr[4]++;
     }
     });
     var i=indexOfMax(rate_arr);
     $scope.result_rate=i!==0?(i!==1?(i!==2?(i!==3?rate_arr[4]:rate_arr[3]):rate_arr[2]):rate_arr[1]):rate_arr[0];
     $scope.result_status=i!==0?(i!==1?(i!==2?(i!==3?'کاملاً موافق':'موافق'):'ممتنع'):'مخالف'):'کاملاً مخالف';
     },100);

     }*/
    function rating_set() {
        $scope.rate_1 = [];

        $scope.rate_3 = [];

        $scope.rate_5 = [];
        var rate_arr = [0, 0, 0, 0, 0];
        var statusArr = [
            'مخالف',
            '',
            'ممتنع',
            '',
            'موافق'
        ];
        var status = null;
        $timeout(function () {
            $scope.surveies.forEach(function (itm) {
                if (itm.rate === 1) {
                    $scope.rate_1.push(itm);
                    rate_arr[0]++;
                } else if (itm.rate === 3) {
                    $scope.rate_3.push(itm);
                    rate_arr[2]++;
                } else if (itm.rate === 5) {
                    $scope.rate_5.push(itm);
                    rate_arr[4]++;
                }
            });
            var max_rate = Math.max.apply(null, rate_arr);
            if (max_rate && rate_arr.filter(function (x) {
                return x === max_rate
            }).length == 1) {
                status = rate_arr.indexOf(max_rate);
            }
            if (status !== null) {
                $scope.result_rate = rate_arr[status];
                $scope.result_status = statusArr[status];
            }

        }, 100);

    }

    function update_program(parameter, callback) {
        if (typeof parameter === 'string') {
            parameter = JSON.parse(parameter);
            parameter.year = angular.copy($rootScope.year);
            parameter = JSON.stringify(parameter);

        } else {
            parameter.year = angular.copy($rootScope.year);
            parameter = JSON.stringify(parameter);
        }

        $http.put(Server_URL + '/v1/user/hospital/program', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                $scope.all_programs[$scope.program_selected_index] = data;
                setProgramChart($scope.all_programs);
                $scope.all_programs_copy = angular.copy($scope.all_programs);
                $scope.close_choose_program_type();
                if (callback && angular.isFunction(callback)) {
                    callback();
                }
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    }

    function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
        return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
    }

    function set_program_selected(row) {

        var percent = 0;
        $scope.program_selected = angular.copy(row);
        $scope.program_selected.steps = $scope.program_selected.hospital_program_step ? $scope.program_selected.hospital_program_step.map(function (itm) {
            percent = $scope.operator["+"](itm.complete_percent, percent);
            itm._start_time = angular.copy(itm.start_time);
            itm._end_time = angular.copy(itm.end_time);
            itm.start_time = $scope.get_date(itm.start_time);
            itm.end_time = $scope.get_date(itm.end_time);
            itm.responsible_person = itm.responsible_person ? itm.responsible_person.toString() : '';
            return itm;
        }) : ($scope.program_selected.steps ? $scope.program_selected.steps.map(function (itm) {

            return {description: itm};

        }) : []);
        if ($scope.program_selected.steps)
            $scope.program_selected.complete_percent = $scope.program_selected.steps.length ? (percent / $scope.program_selected.steps.length).toFixed(2) : 0;
        $scope.program_selected_index = $scope.all_programs.indexOf(row);
    }

    function getProgramPercent(status, data) {
        if (data.length) {
            var programs = data.filter(function (itm) {
                if (status >= 0)
                    return itm.status == status;
                else
                    return itm.status === null || itm.status === undefined;
            });
            return (programs.length * 100) / $scope.all_programs.length;
        }
        return 0;

    }

    function setPieChart(data) {
        var programs = data.filter(function (itm) {
            return itm.approvalist_verify;
        });
        var steps = programs.map(function (itm) {
            if (itm.hospital_program_step && itm.hospital_program_step.length) {
                return itm.hospital_program_step;
            }
        });
        var complate = 0;
        var inWork = 0;
        var notStart = 0;
        steps.forEach(function (s) {
            if (s.complete_percent === 100) {
                complate++;
            } else if (!s.complete_percent) {
                notStart++;
            } else {
                inWork++;
            }
        });
        $scope.pie_chart.data_chart[0] = ((notStart * 100) / programs.length).toFixed(2);
        $scope.pie_chart.data_chart[1] = ((inWork * 100) / programs.length).toFixed(2);
        $scope.pie_chart.data_chart[2] = ((complate * 100) / programs.length).toFixed(2);
    }

    function setProgramChart(data) {
        var program_type = $scope.active_view == 1 ? 'برنامه عملیاتی' : 'برنامه بهبود';
        data = data.filter(function (itm) {
            return itm.program_type === program_type;
        });
        $scope.months = [];
        for (var i = 0; i < 12; i++) {
            $scope.months.push({
                programs: data.filter(function (itm) {
                    return moment(itm.created_at).jMonth() === i;
                }),
                name: $scope.months_name[i]
            })
        }
        $scope.ProgramPercent2 = getProgramPercent(2, data);
        $scope.ProgramPercent1 = getProgramPercent(1, data);
        $scope.ProgramPercent0 = getProgramPercent(0, data);
        $scope.ProgramPercentNaN = getProgramPercent(null, data);
        setPieChart(data);
    }

    function filterPrograms() {
        $scope.all_programs = $scope.all_programs_copy.filter(function (p) {
            if (p.hasOwnProperty('status') && p.status !== '') {
                return $scope.filter.programStatus.indexOf(p.status) >= 0;
            } else {
                return $scope.filter.programStatus.indexOf(null) >= 0;
            }
        });
    }

    $scope.finished = function () {
        $scope.finished_repeator = true;
    }
    $scope.add_suggestion = function () {
        $scope.detail_of_suggestion = {};
        $scope.suggestion = {
            title: '',
            need_money: false,
            ward: '',
            relate_patient_safty: false,
            description: '',
            special_goal: '',
            strategy: '',
            strategic_goal: ''
        };
        $scope.steps = [];
        $scope.open_modal('lg', 'add_suggestion.html', null, null, 'blue_modal full_width', $scope, true)
    };
    $scope.saveStep2 = function (index) {
        $scope.step.editable = false;
        $scope.step._start_time = $scope.get_miladi_date($scope.step.start_time);
        $scope.step._end_time = $scope.get_miladi_date($scope.step.end_time);

        $scope.steps[index] = angular.copy($scope.step);

        $scope.reset_params($scope.step);

    }
    $scope.editStep2 = function (step) {
        var copy_step = angular.copy(step);
        var index = $scope.steps.indexOf(step);
        $scope.steps[index].responsible_person = '$reset';

        $timeout(function () {
            $scope.steps[index] = copy_step;
            $scope.step = copy_step;
            $scope.steps[index].editable = true;
        }, 20);
    };
    $scope.deleteStep2 = function (row) {
        $scope.question('آیا از حذف گام مورد نظر مطمئن هستید؟', 'حذف گام برنامه');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var i = $scope.steps.indexOf(row);
                $scope.steps.splice(i, 1);

            }
        });
    };
    $scope.addStep2 = function () {
        if ($scope.steps.some(function (itm) {
            return itm.editable;
        })) {

            $scope.warning('ابتدا گام فعلی را ثبت کنید.');
            return false;
        }
        $scope.step = angular.copy(stepInstans);
        $scope.step.editable = true;
        $scope.steps.push($scope.step);
    };
    $scope.deleteIndicator = function (row) {
        $scope.question('آیا از حذف شاخص مورد نظر مطمئن هستید؟', 'حذف شاخص').result.then(function (r) {
            if (r) {
                $scope.program_selected.indicators.splice($scope.program_selected.indicators.indexOf(row), 1)
            }
        });
    }
    $scope.filter_programStatus = function (status) {

        if ($scope.filter.programStatus.indexOf(status) === -1) {

            $scope.filter.programStatus.push(status);
            filterPrograms();

        } else {
            $scope.filter.programStatus.splice($scope.filter.programStatus.indexOf(status), 1);
            if ($scope.filter.programStatus.length) {
                filterPrograms()
            } else {
                $scope.all_programs = angular.copy($scope.all_programs_copy);
            }
        }

    };
    $scope.getCountVote = function (votes, status) {
        if (votes) {
            var vote = status == 2 ? 5 : (status == 1 ? 3 : 1);
            return votes.filter(function (itm) {
                return itm.value == vote;
            }).length;
        }


    };
    $scope.show_action = function (info) {
        var msg = '';
console.log(info)
        if (info.action_descriptions)
            info.action_descriptions.map(function (action) {
                msg = msg + '- ' + action.description;
                msg += '\n';
            });
        if (msg.length) {
            $scope.success_alert(msg, 'اقدامات انجام شده');
        } else {
            $scope.warning('برای این گام اقداماتی انجام نشده است.');
        }
    };
    $scope.toggleConfig_strategic = function () {
        if ($scope.config_strategic) {
            $scope.config_strategic = false;
            $scope.reset_params($scope.str);
            $scope.reset_params($scope.factor);
            $scope.str.arzesh_bonyadi = [{text: ''}];
            $scope.str.beneficiaries = [{name: '', internal: '', external: '', description: ''}];
            $scope.total_s_w = 0;
            $scope.total_o_t = 0;
            $scope.total_score_o_t = 0;
            $scope.total_score_s_w = 0;
            $scope.total_weight_score_o_t = 0;
            $scope.total_weight_score_s_w = 0;
            $scope.reset_steps();
        } else {
            $scope.config_strategic = true;
        }
    };
    $scope.add_arzesh = function () {
        $scope.str.arzesh_bonyadi.push({text: ''});
    };
    $scope.add_zinafe = function () {
        $scope.str.beneficiaries.push({name: '', internal: '', external: '', description: ''});
    };
    $scope.add_factor = function (type) {
        $scope.factor.type = type;
        $scope.factor.index = -1;
    };
    $scope.close_add_factor = function () {
        $scope.factor.type = '';
        $scope.factor.description = '';
        $scope.factor.index = -1;
    };
    $scope.add_new_factor = function () {
        if ($scope.factor.description.length) {
            if ($scope.factor.index !== -1) {
                $scope.str.factors[$scope.factor.index].description = angular.copy($scope.factor.description);
                $scope.factor.index = -1;
            } else {

                $scope.str.factors.push({
                    factor_type: angular.copy($scope.factor.type),
                    description: angular.copy($scope.factor.description),
                    weight: 0,
                    score: 0
                });
            }
        }
        $scope.factor.description = '';
    };
    $scope.edit_factor = function (row) {
        $scope.factor.type = angular.copy(row.factor_type);
        $scope.factor.description = angular.copy(row.description);
        $scope.factor.index = angular.copy($scope.str.factors.indexOf(row));
    };
    $scope.delete_factor = function (row) {
        $scope.str.factors.splice($scope.str.factors.indexOf(row), 1);
        $scope.factor.index = -1;
    };
    $scope.total_factor = function (f1, f2, type) {
        var total_w = 0;
        var total_s = 0;
        var total_w_s = 0;
        if (angular.isArray(f1)) {
            f1.map(function (itm) {
                if (itm.weight) {
                    total_w = $scope.operator['+'](total_w, itm.weight);
                }
                if (itm.score) {
                    total_s = $scope.operator['+'](total_s, itm.score);
                }
                if (itm.weight_score) {
                    total_w_s = $scope.operator['+'](total_w_s, itm.weight_score);
                }
            });
        }
        if (angular.isArray(f2)) {
            f2.map(function (itm) {
                if (itm.weight) {
                    total_w = $scope.operator['+'](total_w, itm.weight);
                }
                if (itm.score) {
                    total_s = $scope.operator['+'](total_s, itm.score);
                }
                if (itm.weight_score) {
                    total_w_s = $scope.operator['+'](total_w_s, itm.weight_score);
                }
            });
        }
        if (type === 's_w') {
            $scope.total_score_s_w = angular.copy(total_s).toFixed(2);
            $scope.total_weight_score_s_w = angular.copy(total_w_s).toFixed(2);
            $scope.total_s_w = angular.copy(total_w).toFixed(2);
        } else {
            $scope.total_score_o_t = angular.copy(total_s).toFixed(2);
            $scope.total_weight_score_o_t = angular.copy(total_w_s).toFixed(2);
            $scope.total_o_t = angular.copy(total_w).toFixed(2);
        }


        return total_w.toFixed(2);
    };
    $scope.define_strategics = function (type) {
        var str_name = {
            'SO': 'تهاجمی',
            'WO': 'محافظ کارانه',
            'ST': 'رقابتی',
            'WT': 'تدافعی'
        };
        $scope.selected_strategic = {
            name: str_name[type],
            description: '',
            defstr_type: type
        };
        $scope.define_strategics_modal = $scope.open_modal('md', 'define_strategics.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.close_define_strategic = function (selected_strategic) {
        if (selected_strategic) {
            if (selected_strategic.description.length) {
                var a = selected_strategic.defstr_type.substring(0, 1);
                var b = selected_strategic.defstr_type.substring(1, 2);

                if (!selected_strategic[a] || !selected_strategic[a].length) {
                    if (a === 'S') {
                        $scope.warning('لطفاً برای استراتژی مورد نظر نقاط قوت را انتخاب کنید.');
                    } else {
                        $scope.warning('لطفاً برای استراتژی مورد نظر نقاط ضعف را انتخاب کنید.');
                    }

                    return false;
                }
                if (!selected_strategic[b] || !selected_strategic[b].length) {
                    if (b === 'O') {
                        $scope.warning('لطفاً برای استراتژی مورد نظر فرصت ها را انتخاب کنید.');
                    } else {
                        $scope.warning('لطفاً برای استراتژی مورد نظر تهدیدها را انتخاب کنید.');
                    }

                    return false;
                }
            } else {
                $scope.warning('لطفاً توضیحات استراتژی مورد نظر را وارد کنید.');
                return false;
            }
            var factors = [];
            factors = [].concat(factors, selected_strategic[a], selected_strategic[b]);

            $scope.str.defines.push({
                strategic: angular.copy(selected_strategic.defstr_type),
                description: angular.copy(selected_strategic.description),
                factors: factors
            });
            $scope.selected_strategic.description = '';
        }
        $scope.define_strategics_modal.dismiss();
    };
    $scope.open_factors_modal = function (type) {
        $scope.only_this_factor = type;
        $scope.factors_modal = $scope.open_modal('md', 'factors.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.close_factors_modal = function (arr) {
        if (arr) {
            $scope.selected_strategic[$scope.only_this_factor] = [];
            arr.map(function (itm, i) {
                if (itm.checked) {
                    $scope.selected_strategic[$scope.only_this_factor].push({
                        type: angular.copy($scope.only_this_factor),
                        index: i + 1,
                        selected: angular.copy(itm)
                    });
                    itm.checked = false;
                }
            });
        }
        $scope.factors_modal.dismiss();
    };
    $scope.assign_program_type = function (row) {
        $scope.program_type = '';
        $scope.program_selected = row;
        $scope.program_selected_index = $scope.all_programs.indexOf(row);

        $scope.choose_program_type = $scope.open_modal('lg', 'assign_program_type.html', null, null, 'full_width only_content ', $scope);

    };
    $scope.update_program = function (program_type) {
        var parameter;
        if (program_type) {
            parameter = JSON.stringify({
                program_type: program_type,
                id: $scope.program_selected._id

            });

        } else {
            parameter = JSON.stringify({
                special_goal: $scope.program_selected.special_goal,
                strategy: $scope.program_selected.strategy,
                strategic_goal: $scope.program_selected.strategic_goal,
                id: $scope.program_selected._id,
                steps: $scope.program_selected.steps.map(function (itm) {
                    return {
                        _id: itm._id && itm._id.length ? itm._id : null,
                        description: itm.description,
                        start_time: itm._start_time,
                        end_time: itm._end_time,
                        responsible_person: itm.responsible_person,
                        partners: itm.partners,
                        need_money: itm.need_money || false,
                        source_type: itm.source_type,
                        cost: itm.cost,
                        unit_count: itm.unit_count,
                        unit_cost: itm.unit_cost
                    };
                }) || [],
            });
        }
        update_program(parameter, function () {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.', 'ثبت اطلاعات');
            $scope.$parent.back_to_parent($scope);
        });
    };
    $scope.save_suggestion = function () {
        if ($scope.suggestion.ward) {
            if ($scope.suggestion.title.length) {
                if ($scope.steps && $scope.steps.length) {
                    var parameter = JSON.stringify({
                        title: $scope.suggestion.title,
                        need_money: $scope.suggestion.need_money,
                        relate_patient_safty: $scope.suggestion.relate_patient_safty,
                        description: $scope.suggestion.description,
                        steps: $scope.steps.map(function (step) {
                            var s = step;
                            s.start_time = step._start_time;
                            s.end_time = step._end_time;
                            return s;
                        }),
                        indicators: $scope.suggestion.indicators,
                        special_goal: $scope.suggestion.special_goal,
                        strategy: $scope.suggestion.strategy,
                        strategic_goal: $scope.suggestion.strategic_goal,
                        ward: $scope.suggestion.ward,
                        year: $rootScope.year

                    });
                    factory1.postUserApi('/v1/user/hospital/program', parameter).then(function () {
                        $scope.close_modal();
                        $scope.success_alert(' برنامه پیشنهادی با موفقیت ثبت شد.', 'ثبت برنامه پیشنهادی');
                        $scope.getPrograms($scope.active_view, $scope.page);
                    });
                } else {
                    $scope.warning("لطفاً گام های پیشنهادی را وارد کنید.");
                }

            } else {
                $scope.warning('لطفاً عنوان برنامه پیشنهادی را وارد کنید.');
            }
        } else {
            $scope.warning('لطفاً بخش را انتخاب کنید.');
        }


    };
    $scope.close_choose_program_type = function () {
        if ($scope.choose_program_type)
            $scope.choose_program_type.dismiss();
    };
    $scope.program_priority = function (row) {
        $scope.result_rate = null;
        $scope.survey_started = false;
        $scope.survey = {
            user_id: '',
            rate: null
        };
        $scope.surveies = row.hospital_program_vote ? row.hospital_program_vote.map(function (itm) {
            return {
                user_id: itm.user_id,
                rate: itm.value
            }
        }) : [];
        if (row.hospital_program_vote) {
            $scope.start_survey();
            rating_set();
        }

        set_program_selected(row);
        $scope.program_selected_index = $scope.all_programs.indexOf(row);
        $scope.template.url = 'views/improve_quality/programs/program_priority.htm';
        $scope.is_parent = false;
    };
    $scope.choose_partners = function (partners, step) {
        if (step.responsible_person) {
            var arr = [];
            arr = angular.copy($scope.users);
            arr.map(function (itm) {
                itm.users.forEach(function (obj) {
                    if (obj.id == step.responsible_person) {
                        itm.users[itm.users.indexOf(obj)].readonly = true;
                    }
                });
            });
            if (partners) {
                partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        partners.forEach(function (p) {
                            if (obj.id == p) {

                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
            var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
                users: function () {
                    return arr;
                }
            }, 'blue_modal', $scope, true);
            result.result.then(function (r) {
                if (r) {
                    step.partners = r.map(function (itm) {
                        return itm.id;
                    });
                }
            });
        } else {
            $scope.warning('لطفاً ابتدا مسئول انجام این برنامه را مشخص نمایید.');
        }

    };
    $scope.choose_producers = function () {
        $scope.choose_user($scope.program_selected.producers).then(function (r) {
            $scope.program_selected.producers = r;
        });
    };
    $scope.choose_verifiers = function () {
        $scope.choose_user($scope.program_selected.verifiers).then(function (r) {
            $scope.program_selected.verifiers = r;
        });
    };
    $scope.uploadDocs=function(data){
        $scope.file = {
            src: ''
        };
        $scope.detail_recordes = data;
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);
    }
    $scope.uploadFiles = function () {
        factory1.upload_file($scope, $scope.file.src, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, '/v1/user/hospital/strategy/doc_file?file_name=' + $scope.file.src.filename + '&id=' + $scope.detail_recordes._id, null).then(function (data) {
            console.log(data);
            if (!$scope.detail_recordes.strategy_doc_files) {
                $scope.detail_recordes.strategy_doc_files = []
            }
            $scope.detail_recordes.strategy_doc_files.push(data);
            $scope.all_strategies.map(function (st) {
                if(st._id===$scope.detail_recordes._id){
                    st.strategy_doc_files= $scope.detail_recordes.strategy_doc_files;
                }
            })

        });
    };
    $scope.deleteFile = function (row) {
        $scope.question('آیا از حذف پیوست مورد نظر مطمئن هستید؟', 'حذف پیوست').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/strategy/doc_file/' + row.id).then(function (data) {
                    $scope.detail_recordes.strategy_doc_files.splice($scope.detail_recordes.strategy_doc_files.indexOf(row), 1);
                    $scope.success_alert('فایل با موفقیت حذف شد!', 'حذف پیوست');
                    $scope.all_strategies.map(function (st) {
                        if(st._id===$scope.detail_recordes._id){
                            st.strategy_doc_files= $scope.detail_recordes.strategy_doc_files;
                        }
                    })
                })

            }
        });
    }
    /* $scope.save_step=function () {
        if($scope.Eopstep.description && $scope.Eopstep.description.length>2){
            if($scope.Eopstep.start_time && $scope.Eopstep.start_time.length>2){
                if($scope.Eopstep.end_time && $scope.Eopstep.end_time.length>2){
                    if($scope.Eopstep.responsible_person){
                        $scope.Eopstep._start_time=$scope.get_miladi_date($scope.Eopstep.start_time);
                        $scope.Eopstep._end_time=$scope.get_miladi_date($scope.Eopstep.end_time);

                        if($scope.Eopstep_editing){
                            $scope.Eopstep_editing=false;
                            $scope.program_selected.steps[$scope.Eopstep_index]=angular.copy($scope.Eopstep);
                        }else {
                            if(!angular.isArray($scope.program_selected.steps)){
                                $scope.program_selected.steps=[];
                            }

                            $scope.program_selected.steps.push(angular.copy($scope.Eopstep));

                        }
                        $scope.reset_params($scope.Eopstep);
                    }else{
                        $scope.warning('لطفاً مسئول انجام گام را مشخص کنید.');
                    }
                }else{
                    $scope.warning('لطفاً تاریخ پایان را انتخاب کنید.');
                }
            }else{
                $scope.warning('لطفاً تاریخ شروع را انتخاب کنید.');
            }
        }else{
            $scope.warning('لطفاً شرح گام اجرایی را وارد کنید.');
        }

    };*/
    /*   $scope.cancel_Eopstep=function () {
        $scope.reset_params($scope.Eopstep);
        $scope.Eopstep_editing=false;
    };
    $scope.edit_Eopstep=function (row) {
        $scope.Eopstep.responsible_person='$reset';

        $timeout(function () {
            $scope.Eopstep=angular.copy(row);
            $scope.Eopstep_index=$scope.program_selected.steps.indexOf(row);
            $scope.Eopstep_editing=true;
        },20);
    };
    $scope.delete_Eopstep=function (row) {
        $scope.question('آیا از حذف گام مورد نظر مطمئن هستید؟','حذف گام برنامه');
        $scope.q_result.result.then(function (r) {
            if (r) {
               var i= $scope.program_selected.steps.indexOf(row);
                $scope.program_selected.steps.splice(i,1);

            }
        });
    };*/
    $scope.start_survey = function () {
        $scope.survey_started = true;
    };
    $scope.set_rate = function (r) {
        $scope.survey.rate = r;
    };
    $scope.save_survey = function (flag) {
        if (flag) {
            var status = null;
            var rate = [0, 0, 0];
            var votes = $scope.surveies.map(function (itm) {
                if (itm.rate === 1) {
                    rate[0]++;
                } else if (itm.rate === 3) {
                    rate[1]++;
                } else if (itm.rate === 5) {
                    rate[2]++;
                }
                return {
                    user_id: itm.user_id,
                    value: itm.rate
                }
            });

            var max_rate = Math.max.apply(null, rate);
            if (max_rate && rate.filter(function (x) {
                return x === max_rate
            }).length == 1) {
                status = rate.indexOf(max_rate);
            }
            if (status === null) {
                $scope.warning('حداقل یک شخص دیگر می بایست به این برنامه نظر دهد.');
            } else {
                var parameter = JSON.stringify({
                    votes: votes,
                    id: $scope.program_selected._id,
                    year: $rootScope.year,
                    status: status

                });
                update_program(parameter, function () {
                    $scope.success_alert('اطلاعات با موفقیت ثبت شد.', 'ثبت اطلاعات');
                    $scope.$parent.back_to_parent($scope);
                });
            }


        } else {
            if ($scope.survey.user_id.length) {
                if ($scope.survey.rate) {
                    $scope.surveies.push(angular.copy($scope.survey));
                    $scope.survey.user_id = '';
                    $scope.survey.rate = null;
                    rating_set();
                } else {
                    $scope.warning('لطفاً رای مورد نظر را انتخاب کنید.');
                    return false;
                }
            } else {
                $scope.warning('لطفاً تصمیم گیرنده را انتخاب کنید.');
                return false;
            }
        }


    };
    $scope.sum_tas = function (this_define, factor, type) {

        var sum = 0;
        var factor_type = type.split("");
        var tas = 0;
        $scope.str.factors.map(function (fac) {

            if (fac.factor_type === factor_type[0] || fac.factor_type === factor_type[1]) {
                fac.defines.map(function (def) {
                    if (def.description === this_define.description) {
                        tas = (parseFloat(fac.weight) * def.as).toFixed(2);
                    }
                })
                sum = $scope.operator['+'](tas, sum);

            }
        });
        $scope.str.defines.map(function (def) {
            if (def.title === this_define.title) {
                if (type === "OT") {
                    def.sum_tas_O_T = sum.toFixed(2);
                } else {
                    def.sum_tas_S_W = sum.toFixed(2);
                }
                def.sum_tas = $scope.operator['+'](def.sum_tas_O_T, def.sum_tas_S_W).toFixed(2);
            }
        });

        $scope.set_only_this_strategic($scope.only_this_strategic,$scope.this_defines);


    };
    $scope.develop_operational_plan = function (row) {
        $scope.reset_steps();
        set_program_selected(row);
        $scope.template.url = 'views/improve_quality/programs/develop_operational_plan.htm';
        $scope.is_parent = false;
    };
    $scope.view_programs = function (row) {
        console.log(row);
        $scope.gauges = [];
        if (row.hospital_program_step.length) {
            var darsad_tahaghogh = angular.copy(GaugeConfigInstans);
            darsad_tahaghogh.value = row.hospital_program_step.reduce(function (a, b) {
                return {complete_percent: operator['+'](a['complete_percent'], b['complete_percent'])}
            }, 0)['complete_percent'] / row.hospital_program_step.length;
            darsad_tahaghogh.label = 'درصد تحقق برنامه'
            $scope.gauges.push(darsad_tahaghogh);
        }
        row.indicators.map(function (indi) {
            factory1.postUserApi('/v2/indicator/average_by_ward_chart?id=' + indi.id, JSON.stringify({wards: []})).then(function (data) {
                var indicator = angular.copy(GaugeConfigInstans);
                indicator.value = data.hospital || 0;
                indicator.label = ' درصد تحقق ' + indi.title;
                $scope.gauges.push(indicator);
            })
        })


        set_program_selected(row);
        $scope.template.url = 'views/improve_quality/programs/view_programs.htm';
        $scope.is_parent = false;
    };
    $scope.show_status_of_program = function (row) {
        $scope.program_selected = angular.copy(row);
        $scope.program_selected_index = $scope.all_programs.indexOf(row);
        $scope.template.url = 'views/improve_quality/programs/show_status_of_program.htm';
        $scope.is_parent = false;
    };
    $scope.open_indicators = function () {
        $scope.indicator_filter = {
            keyword: '',
        }
        $scope.indicators.map(function (itm) {

            itm.selected = false;

        });
        if ($scope.program_selected.indicators)
            $scope.program_selected.indicators.forEach(function (indicator) {
                $scope.indicators.map(function (itm) {
                    if ((itm.id && itm.id === indicator.id) || itm.id === indicator) {
                        itm.selected = true;
                    }
                });

            });

        $scope.process_indicators = $scope.open_modal('lg', 'program_indicators.html', null, null, 'blue_modal full_width', $scope, true);
    };
    $scope.choose_indicators = function () {
        $scope.program_selected.indicators = [];
        $scope.indicators.forEach(function (itm) {
            if (itm.selected) {
                $scope.program_selected.indicators.push(itm);
            }
        });
        $scope.close();
    };
    $scope.close = function (flag) {
        $scope.process_indicators.dismiss();
        if (flag) {
            $scope.indicators = angular.copy($scope.indicators_copy);
        }

    };
    $scope.next = function (step) {
        if ($scope.active_view === 0) {
            if (step === 3) {
                if (!$scope.str.factors.length) {
                    $scope.warning('لطفاً عوامل داخلی و خارج را تعریف کنید.');
                    return false;
                }
            } else if (step === 4) {
                if ($scope.total_s_w != 1) {
                    $scope.warning('مجموع وزنی نقاط ضعف و قوت می بایست برابر یک شود. لطفاً مقادیر را بررسی نمایید.');
                    return false;
                }
            } else if (step === 5) {
                if ($scope.total_o_t != 1) {
                    $scope.warning('مجموع وزنی فرصتها و تهدیدها می بایست برابر یک شود. لطفاً مقادیر را بررسی نمایید.');
                    return false;
                }
                var element = document.getElementById('EFE_IFE');
                var max_x = 1103;
                var max_y = 772;
                var x = scaleBetween($scope.total_weight_score_s_w, 0, max_x, 1, 4);
                var y = 772 - (scaleBetween($scope.total_weight_score_o_t, 0, max_y, 1, 4));
                /*x-=(1103/6);
               y+=(772/6);*/
                var context = element.getContext('2d');
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.mozImageSmoothingEnabled = true;
                context.webkitImageSmoothingEnabled = true;
                context.msImageSmoothingEnabled = true;
                context.imageSmoothingEnabled = true;
                context.font = "20px iransans";
                context.textAlign = 'center';
                context.fillText("(" + $scope.total_weight_score_s_w + "," + $scope.total_weight_score_o_t + ")", x, y + 20);
                var img = new Image();
                img.onload = function () {
                    context.drawImage(img, x - 10, y - 150, 150, 150);
                };
                img.src = BASE + "/asset/images/flag.png";
            } else if (step === 7) {
                $scope.str.factors.map(function (f) {

                    if (f.strategy_factor_an) {
                        var index_as = -1;
                        f.defines = $scope.str.defines.map(function (d, index) {
                            var _factor = '';
                            d.factors.map(function (_f, i) {
                                _factor = _factor + (_f.type + _f.index);
                                if (d.factors.length - 1 > i) {
                                    _factor += '-';
                                }
                            });
                            _factor = _factor + '#' + d.strategic + $scope.operator['+'](index, 1);

                            index_as = f.strategy_factor_an[0].factors ? f.strategy_factor_an[0].factors.indexOf(_factor) : -1;

                            d.as = index_as !== -1 ? f.strategy_factor_an[0].as[index_as] : 0;
                            return angular.copy(d);
                        });
                        /* f.strategy_factor_an.factors.map(function (an) {
                            if(an===)
                        });*/
                    } else {
                        if (!f.defines || $scope.str.defines !== f.defines)
                            f.defines = $scope.str.defines.map(function (d) {
                                d.as = 0;
                                return angular.copy(d);
                            });
                    }

                });
            }
        }
        if ($scope.active_view !== 0) {
            if (step === 1) {
                if ($scope.program_selected.title && $scope.program_selected.title.length) {
                    if ($scope.program_selected.strategic_goal && $scope.program_selected.strategic_goal.length) {
                        if ($scope.program_selected.strategy && $scope.program_selected.strategy.length) {
                            if ($scope.program_selected.special_goal && $scope.program_selected.special_goal.length) {

                            } else {
                                $scope.warning('لطفاً هدف اختصاصی را وارد کنید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً استراتژی را وارد کنید.');
                            return false;
                        }
                    } else {
                        $scope.warning('لطفاً هدف استراتژیک را وارد کنید.');
                        return false;
                    }
                } else {
                    $scope.warning('لطفاً عنوان برنامه را وارد کنید.');
                    return false;
                }
            } else if (step === 2) {
                if ($scope.program_selected.indicators && $scope.program_selected.indicators.length) {

                } else {
                    $scope.warning('لطفاً شاخص های مربوط به این برنامه را انتخاب کنید.');
                    return false;
                }

            } else if (step === 3) {
                if ($scope.program_selected.steps && $scope.program_selected.steps.length) {
                    var is_all_step_valid = $scope.program_selected.steps.every(function (itm) {
                        if (itm.description && itm.description.length &&
                            itm._start_time && itm._end_time && itm.responsible_person
                        ) {
                            return true;
                        }
                    });
                    if (is_all_step_valid) {

                    } else {
                        $scope.warning('لطفاً گام های برنامه را بطور کامل تدوین کنید.');
                        return false;
                    }

                } else {
                    $scope.warning('لطفاً گام های مربوط به این برنامه را تدوین کنید.');
                    return false;
                }

            } else if (step === 4) {
                if ($scope.program_selected.producers && $scope.program_selected.producers.length) {
                    if ($scope.program_selected.money_manager) {
                        if ($scope.program_selected.verifiers && $scope.program_selected.verifiers.length) {
                            if ($scope.program_selected.approvalists) {

                            } else {
                                $scope.warning('لطفاً تصویب کننده را انتخاب کنید.');
                                return false;
                            }
                        } else {
                            $scope.warning('لطفاً تأیید کننده را انتخاب کنید.');
                            return false;
                        }
                    } else {
                        $scope.warning('لطفاً مسئول مالی را انتخاب کنید.');
                        return false;
                    }
                } else {
                    $scope.warning('لطفاً تهیه کننده / تهیه کنندگان را انتخاب کنید.');
                    return false;
                }
            }
        }
        $scope.steps.push(step);
    };
    $scope.cancel = function () {
        $scope.reset_steps();
    };
    $scope.last = function (step) {
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
    $scope.save_strategic = function (flag) {
        var bf = $scope.str.beneficiaries.filter(function (itm) {
            if (itm.name && itm.name.length) {
                return itm;
            }
        });
        if (flag) {

        }
        var index_so = 0;
        var index_wo = 0;
        var index_st = 0;
        var index_wt = 0;
        var parameter = JSON.stringify({
            resalat: $scope.str.resalat,
            cheshm_andaz: $scope.str.cheshm_andaz,
            arzesh_bonyadi: $scope.str.arzesh_bonyadi ? $scope.str.arzesh_bonyadi.map(function (itm) {
                return itm.text;
            }) : [],
            beneficiaries: bf.length ? bf : null,
            factors: $scope.str.factors ? $scope.str.factors.map(function (factor) {
                var f = {
                    defines: {
                        factors: [],
                        as: [],
                        tas: []
                    },
                    description: factor.description,
                    factor_type: factor.factor_type,
                    score: factor.score,
                    weight: factor.weight
                };
                if (factor.defines)
                    factor.defines.forEach(function (def, i) {
                        var facs = def.factors.map(function (fac) {
                            return fac.type + fac.index;
                        });
                        f.defines.factors.push(facs.join('-') + '#' + def.strategic + $scope.operator['+'](i, 1));
                        f.defines.as.push(def.as);
                        f.defines.tas.push((def.as * factor.weight).toFixed(2));
                    });
                return f;
            }) : [],
            defines: $scope.str.defines ? $scope.str.defines.map(function (define) {
                var title = define.strategic;
                if (define.strategic === 'SO') {
                    index_so++;
                    title += index_so;
                } else if (define.strategic === 'WO') {
                    index_wo++;
                    title += index_wo;
                } else if (define.strategic === 'ST') {
                    index_st++;
                    title += index_st;
                } else {
                    index_wt++;
                    title += index_wt;
                }

                return {
                    factors: define.factors.map(function (fac) {
                        return fac.type + fac.index;
                    }),
                    description: define.description,
                    strategic: define.strategic,
                    title: title,
                    sum_tas: define.sum_tas,
                    sum_tas_O_T: define.sum_tas_O_T,
                    sum_tas_S_W: define.sum_tas_S_W

                };
            }) : [],
            total_ws: $scope.total_weight_score_s_w,
            total_ot: $scope.total_weight_score_o_t,
            year: $rootScope.year,
            id: $scope.str.id
        });
        $http.post(Server_URL + '/v1/user/hospital/strategy', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {
                if ($scope.str.id) {
                    $scope.all_strategies.splice($scope.selected_strategic_index, 1);
                }
                $scope.all_strategies.push(data);
                $scope.str.id = null;
                $scope.toggleConfig_strategic();
            }).error(function (data, status, headers) {
            console.log(data);
            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.edit_strategic = function (row) {
        $scope.selected_strategic_index = $scope.all_strategies.indexOf(row);
        $scope.toggleConfig_strategic();

        var str = angular.copy(row);
        $scope.str.id = str._id;
        $scope.str.resalat = str.resalat;
        $scope.str.cheshm_andaz = str.cheshm_andaz;
        $scope.str.arzesh_bonyadi = str.arzesh_bonyadi.map(function (itm) {
            return {text: itm};
        });
        $scope.str.beneficiaries = str.strategy_benefs || [];
        $scope.str.factors = str.strategy_factors ? str.strategy_factors.map(function (fac) {
            /*if(fac.strategy_factor_an){
              fac.define=[];
              fac.strategy_factor_an.map(function (itm) {
                  fac.define.push(
                      {
                          as:itm.as
                      }
                  )
              });
          }*/
            return fac;
        }) : [];
        $scope.str.defines = str.strategy_defines ? str.strategy_defines.map(function (def) {
            def.factors = def.factors.map(function (fac) {
                return {type: fac.substring(0, 1), index: fac.substring(1, 2)};
            });
            return def;
        }) : [];
        $scope.str.factors.map(function (f) {

            if (f.strategy_factor_an) {
                var index_as = -1;
                f.defines = $scope.str.defines.map(function (d, index) {
                    var _factor = '';
                    d.factors.map(function (_f, i) {
                        _factor = _factor + (_f.type + _f.index);
                        if (d.factors.length - 1 > i) {
                            _factor += '-';
                        }
                    });
                    _factor = _factor + '#' + d.strategic + $scope.operator['+'](index, 1);

                    index_as = f.strategy_factor_an[0].factors ? f.strategy_factor_an[0].factors.indexOf(_factor) : -1;

                    d.as = index_as !== -1 ? f.strategy_factor_an[0].as[index_as] : 0;
                    return angular.copy(d);
                });
                /* f.strategy_factor_an.factors.map(function (an) {
                     if(an===)
                 });*/
            } else {
                if (!f.defines || $scope.str.defines !== f.defines)
                    f.defines = $scope.str.defines.map(function (d) {
                        d.as = 0;
                        return angular.copy(d);
                    });
            }

        });
    };
    $scope.priority_strategic = function (row, check_arr) {
        $scope.priorities = [];
        var defines = angular.copy(row.strategy_defines);
        if (defines && defines.length) {
            defines.map(function (itm) {
                if (itm.strategic) {
                    itm.checked = false;
                    if (check_arr) {
                        itm.checked = check_arr.some(function (obj) {
                            if (obj._id === itm._id || obj === itm._id) {
                                return true;
                            }
                        });
                    }
                    $scope.priorities.push(itm);
                }
            });
            $scope.checkbox_changed();
        }
        if ($scope.priorities.length) {

            return $scope.open_modal('lg', 'priority_modal.html', null, null, 'full_width blue_modal', $scope);
        } else {
            $scope.warning('استراتژی ها برای این برنامه اولویت بندی نشده است.');
        }
    };
    $scope.set_only_this_strategic = function (only_this_strategic,this_defines) {
        $scope.only_this_strategic = only_this_strategic;
        $scope.this_defines=this_defines || null;
        $timeout(function () {
            $scope.this_defines = $filter('filter_by')($scope.str.defines, 'strategic', only_this_strategic);
        },300)
    };
    $scope.delete_strategic = function (row) {

        $scope.question('آیا از حذف برنامه استراتژیک مورد نظر مطمئن هستید؟', 'حذف برنامه استراتژیک');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $http.delete(Server_URL + '/v1/user/hospital/strategy/' + row._id, {headers: $scope.queryHeaders})
                    .success(function (data, status, headers) {
                        $scope.success_alert('برنامه استراتژیک مورد نظر با موفقیت حذف شد.', 'حذف برنامه استراتژیک');
                        $scope.all_strategies.splice($scope.all_strategies.indexOf(row), 1);
                    }).error(function (data, status, headers) {
                    console.log(data);
                    $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
                });
            }
        });

    };
    $scope.save_plane = function (flag) {
        var parameter = {
            id: $scope.program_selected._id,
            title: $scope.program_selected.title || '',
            strategic_goal: $scope.program_selected.strategic_goal || '',
            strategy: $scope.program_selected.strategy || '',
            special_goal: $scope.program_selected.special_goal || '',
            indicators: $scope.program_selected.indicators.map(function (itm) {
                return itm._id || itm.id;
            }) || [],
            steps: $scope.program_selected.steps.map(function (itm) {
                return {
                    _id: itm._id && itm._id.length ? itm._id : null,
                    description: itm.description,
                    start_time: itm._start_time,
                    end_time: itm._end_time,
                    responsible_person: itm.responsible_person,
                    partners: itm.partners,
                    need_money: itm.need_money || false,
                    source_type: itm.source_type,
                    cost: itm.cost,
                    unit_count: itm.unit_count,
                    unit_cost: itm.unit_cost
                };
            }) || [],
            producers: $scope.program_selected.producers || [],
            money_manager: $scope.program_selected.money_manager || '',
            verifiers: $scope.program_selected.verifiers || '',
            approvalists: $scope.program_selected.approvalists || '',
            save: flag == true,
            year: $rootScope.year
        };
        update_program(JSON.stringify(parameter), function () {
            $scope.$parent.back_to_parent($scope);
        });
    };
    $scope.config_goals = function (row) {
        $scope.selected_strategic = angular.copy(row);
        $scope.selected_strategic_index = $scope.all_strategies.indexOf(row);

        if (!angular.isArray($scope.selected_strategic.strategy_goals)) {
            $scope.selected_strategic.goals = [{description: '', strategic: []}];
        } else {
            $scope.selected_strategic.goals = angular.copy($scope.selected_strategic.strategy_goals);
        }
        $scope.open_modal('lg', 'config_goals.html', null, null, 'blue_modal full_width', $scope, true);
    };
    $scope.add_goals = function () {

        $scope.selected_strategic.goals.push({description: '', strategic: []});
    };
    $scope.related_strategic = function (row) {
        var check_arr = [];
        if (row.strategic && row.strategic.length) {
            check_arr = row.strategic.map(function (itm) {
                itm.checked = false;
                return angular.copy(itm)
            });
        }
        $scope.pri_modal = $scope.priority_strategic($scope.selected_strategic, check_arr);
        if ($scope.pri_modal)
            $scope.pri_modal.result.then(function (r) {
                if (r) {
                    row.strategic = angular.copy(r);
                }
            });
    };
    $scope.save_goals = function () {
        var goals = $scope.selected_strategic.goals.map(function (itm) {
            return {
                description: itm.description,
                strategic: itm.strategic.map(function (str) {

                    return str._id || str;
                })
            };
        });
        factory1.putUserApi('/v1/user/hospital/strategy/goal', JSON.stringify({
            goals: goals,
            id: $scope.selected_strategic._id
        })).then(function (data) {
            $scope.close_modal($scope.unselect_strategic());
            $scope.success_alert('اهداف استراتژیک با موفقیت ثبت شد.', 'ثبت اهداف استراتژیک');
            $scope.all_strategies[$scope.selected_strategic_index] = angular.copy(data);
        });

    };
    $scope.select_all = function (arr) {
        $scope.checked_all(arr, 'checked', function (status) {
            $scope.Selectall = status;
        });
    };
    $scope.checkbox_changed = function () {
        $scope.Selectall = $scope.is_all_checked($scope.priorities, 'checked');
    };
    $scope.use_this_starategic = function () {
        $scope.pri_modal.close($scope.priorities.filter(function (itm) {
            if (itm.checked) {
                return itm;
            }
        }));
    };
    $scope.unselect_strategic = function () {
        $scope.selected_strategic = null;
    };
    $scope.strategic_goal_changed = function () {
        /*  var arr=[];
        console.log($scope.program_selected.strategic_goal);
        $scope.strategic_goal_List_copy.forEach(function (itm) {
            arr.push(itm.strategic.map(function (str) {
                console.log(str);
                var a=$filter('filter_by')($scope.strategy_List_copy,'_id',str);
                console.log(a);
               return a[0];
            })[0]);
        });
        $scope.strategy_List=arr;*/

        /*$scope.strategy_List=$filter('filter_by')($scope.strategic_goal_List_copy,'',$scope.program_selected.strategic_goal);*/
    };
    $scope.getPrograms = function (n, page) {
        $scope.page = page || 1;
        $scope.active_view = n;

        var program_type = '';
        if (n == 1) {
            program_type = 'برنامه عملیاتی';
            $scope.active_view_name = 'برنامه بهبود';
        } else if (n == 2) {
            program_type = 'برنامه بهبود';
            $scope.active_view_name = 'برنامه عملیاتی';
        }
        if ($scope.page == 1){
            $scope.summer = {
                total: 0,
                amaliati: 0,
                behbood: 0,
                safty: 0,
                send_kartabl: 0
            }
        }
        if ($scope.page == 1){
            factory1.getUserApi('/v1/user/hospital/program/dashboard', '&program_type=' + program_type).then(function (data) {
                $scope.summer = data;
                $scope.summer.totalPages=Math.ceil(operator['+'](data.all_programs,program_type==='برنامه عملیاتی'?data.type_not_set:0)/24);
            });
        }

        if (n != 3) {
            factory1.getUserApi('/v1/user/hospital/programs', '&program_type=' + program_type + '&per_page=24&page=' + $scope.page).then(function (data) {

                $scope.has_programs = data.length;
                $scope.all_programs = data;
                $scope.all_programs_copy = data;


                //setProgramChart(data);
            });
        }


    };
    $scope.getStrategics = function () {
        $scope.active_view = 0;
        factory1.getUserApi('/v1/user/hospital/strategies').then(function (data) {

            $scope.all_strategies = data;
        });
    };
    $scope.showDetailIndicator = function (row) {
        if (row._id) {
            $scope.selected_indicator = row;

            $scope.open_modal('lg', 'indicatorsDetail.html', 'indicator-identity-card_Ctrl', null, 'full_width blue_modal', $scope);
        } else {
            $scope.goto($scope.APP_BASE + '/indicator/dashboard?Token=' + $scope.MyToken + '&Year=' + $rootScope + '&id=' + row.id)
        }

    };
    $scope.showWardsOfIndicator = function (row) {
        $scope.selected_indicator = row;
        $scope.open_modal('lg', 'wards.html', null, null, 'only_content', $scope);
    };
    $scope.showCost = function (row) {
        $scope.selectedStep = row;
        $scope.open_modal('lg', 'sorces.html', null, null, 'only_content', $scope);
    }
    $scope.addStep = function () {
        $scope.step = angular.copy(stepInstans);
        $scope.step.editable = true;
        $scope.program_selected.steps.push($scope.step);
    };
    $scope.showVotes = function (row) {
        $scope.surveies = angular.copy(row.hospital_program_vote).map(function (v) {
            v.rate = v.value;
            return v;
        });
        rating_set();
        $scope.open_modal('lg', 'votes.html', null, null, 'only_content full_width', $scope);
    }
    $scope.editStep = function (step) {
        var copy_step = angular.copy(step);
        var index = $scope.program_selected.steps.indexOf(step);
        $scope.program_selected.steps[index].responsible_person = '$reset';

        $timeout(function () {
            $scope.program_selected.steps[index] = copy_step;
            $scope.step = copy_step;
            $scope.program_selected.steps[index].editable = true;
        }, 20);
    };
    $scope.saveStep = function (index) {
        $scope.step.editable = false;
        $scope.step._start_time = $scope.get_miladi_date($scope.step.start_time);
        $scope.step._end_time = $scope.get_miladi_date($scope.step.end_time);

        $scope.program_selected.steps[index] = angular.copy($scope.step);

        $scope.reset_params($scope.step);

    };
    $scope.deleteStep = function (row) {
        $scope.question('آیا از حذف گام مورد نظر مطمئن هستید؟', 'حذف گام برنامه');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var i = $scope.program_selected.steps.indexOf(row);
                $scope.program_selected.steps.splice(i, 1);

            }
        });
    };
    $scope.showCost = function (row) {
        $scope.selectedStepIndex = $scope.steps.indexOf(row);
        $scope.selectedStep = row;
        $scope.open_modal('lg', 'sorces.html', null, null, 'only_content', $scope);
    };
    $scope.saveCost = function () {

        $scope.selectedStep.need_money = $scope.selectedStep.source_type && $scope.selectedStep.source_type != 'false';
        $scope.step = angular.copy($scope.selectedStep);

        $scope.close_modal();
    };
    $scope.nextPage = function () {
        $scope.getPrograms($scope.active_view, $scope.page + 1)
    }
    $scope.previousPage = function () {

        $scope.getPrograms($scope.active_view, $scope.page - 1)
    }
    factory1.getUserApi('/v1/user/hospital/strategies').then(function (data) {

        data.forEach(function (itm) {
            if (itm.strategy_goals) {
                $scope.strategic_goal_List = $scope.strategic_goal_List.concat([], itm.strategy_goals.map(function (g) {
                    return g;
                }));
                /*$scope.strategic_goal_List_copy=$scope.strategic_goal_List_copy.concat([],itm.strategy_goals.map(function (g) {
                 return g;
                 }));*/
            }
            if (itm.strategy_defines) {
                $scope.strategy_List = $scope.strategy_List.concat([], itm.strategy_defines.map(function (g) {
                    return g;
                }));

            }
        });
        $scope.strategy_List_copy = angular.copy($scope.strategy_List);
        $scope.strategic_goal_List_copy = angular.copy($scope.strategic_goal_List);


    });
    /*factory1.getUserApi('/v1/user/hospital/indicators', '&ward=0').then(function (data) {
        $scope.indicators = data;
    });*/
    factory1.getUserApi('/v2/indicator/compact').then(function (data) {
        $scope.indicators = data;
    });

});

app.controller('self_assessment_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state) {

    $scope.active_view = -1;
    $scope.template = {url: ''};
    $scope.is_parent = true;
    $scope.config_self_assessment = function () {
        $scope.config_set = !$scope.config_set;
        $scope.template.url = 'views/improve_quality/self_assessment/config_self_assessment.htm';
        $scope.is_parent = !$scope.is_parent;
    };
    $scope.edit_checklist = function (row) {
        $scope.template.url = 'views/improve_quality/self_assessment/edit_checklist.htm';
        $scope.is_parent = false;
    };
    $scope.result_self_assessment = function (row) {
        $scope.template.url = 'views/improve_quality/self_assessment/result_self_assessment.htm';
        $scope.is_parent = false;
    };

    $scope.reset_steps();


    $scope.next = function (step) {

        $scope.steps.push(step);

    };
    $scope.cancel = function () {
        $scope.reset_steps();

    };
    $scope.last = function (step) {
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
});

app.controller('IntroducingPatientSafetyUnitCtrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope) {
    $scope.psd = {
        expert_coordinator_b64: '',
        expert_coordinator_file: '',
        expert_coordinator: '',
        coordinator_verdict_b64: '',
        coordinator_verdict_file: '',
        coordinator_verdict: '',
        coordinator_duty: '',
        responsible_safety_b64: '',
        responsible_safety_file: '',
        responsible_safety: '',
        responsible_verdict_b64: '',
        responsible_verdict_file: '',
        responsible_verdict: '',
        responsible_duty: ''
    };
    $scope.submitPSD = function () {
        var psd = {
            responsible_safety: $scope.psd.responsible_safety_b64,
            expert_coordinator: $scope.psd.expert_coordinator_b64,
            responsible_verdict: $scope.psd.responsible_verdict_b64,
            coordinator_verdict: $scope.psd.coordinator_verdict_b64,
            coordinator_duty: $scope.psd.coordinator_duty,
            responsible_duty: $scope.psd.responsible_duty,
            year: $rootScope.year,
            committee_name: 'مدیریت خطا',
            committee_icon: 'icon icon-fault_management'
        };
        factory1.postUserApi('/v1/user/hospital/psd', JSON.stringify(psd)).then(function (data) {
            $scope.success_alert('اطلاعات واحد ایمنی بیمار با موفقیت ثبت شد.', 'ثبت اطلاعات');
        });
    };
    $scope.upload_file = function (file, key) {
        factory1.upload_file($scope, file, 20000000, ['application/pdf', 'application/doc', 'application/docx', 'image/png', 'image/jpeg', 'image/jpg'], false, false).then(function (data) {

            $scope.psd[key] = data;
        });
    };
    factory1.getUserApi('/v1/user/hospital/psd').then(function (data) {
        $scope.psd = angular.merge($scope.psd, data);
    })
})

app.controller('PatientSafetyVisitsCtrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $state, $rootScope, $filter) {
    $scope.events = [
        {month: 'فروردین', data: [], month_num: 1, days: []}, {
            month: 'اردیبهشت',
            data: [],
            month_num: 2,
            days: []
        }, {month: 'خرداد', data: [], month_num: 3, days: []},

        {month: 'تیر', data: [], month_num: 4, days: []}, {
            month: 'مرداد',
            data: [],
            month_num: 5,
            days: []
        }, {month: 'شهریور', data: [], month_num: 6, days: []},

        {month: 'مهر', data: [], month_num: 7, days: []}, {
            month: 'آبان',
            data: [],
            month_num: 8,
            days: []
        }, {month: 'آذر', data: [], month_num: 9, days: []},

        {month: 'دی', data: [], month_num: 10, days: []}, {
            month: 'بهمن',
            data: [],
            month_num: 11,
            days: []
        }, {month: 'اسفند', data: [], month_num: 12, days: []}
    ];
    $scope.bar_chart = {
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    }
                }]

            },
            series: ['فرآیندی', 'زیرساختی']
        },

        data_chart1: [],
        data_chart2: [],
        data_chart3: [],
        data_color5: [],
        data_set: [],
        data_color1: "#722f98",
        data_color2: "#c70065"
    };
    $scope.events_copy = angular.copy($scope.events);
    $scope.template = {url: ''};
    $scope.is_parent = true;
    $scope.active_view = $state.current.name==="PatientSafetyVisits_manager"?0:1;
    $scope.is_parent = true;
    $scope.selected_users = [];
    $scope.viewDetail = {
        text: "",
        location: "",
        start_time: "",
        end_time: ""

    };
    $scope.VisitsUsers = [];
    $scope.visits = [];
    $scope.allThreadTypes = ['زیرساختی - کمبود منابع انسانی',
        'زیرساختی - ضعف عملکردی منابع انسانی',
        'زیرساختی - کمبود تجهیزات',
        'زیرساختی - نقص فنی تجهیزات',
        'فرآیندی - عدم رعایت دستورالعمل‌های روش‌های مراقبت و درمان',
        'فرآیندی - الزامات کیفی و فنی روش‌های مراقبت و درمان'];
    $scope.selectedVisit = null;
    $scope.PSU = {
        members: [],
        year: $rootScope.year
    };
    $scope.delete = false;
    $scope.psvc_Report = {
        file: {
            image1: null,
            image2: null,
            image3: null
        },
        questions: [],
        threat_factors: []
    };
    $scope.CurrentQuestion = null;
    $scope.CurrentAnswer = {
        user_id: '',
        value: ''
    };
    $scope.CurrentThreatFactors = {
        description: '',
        planner: '',
        factor_type: ''
    }
    $scope.CurrentQuestionForAnswer = null;
    $scope.indexOfQ = -1;
    $scope.CurrentQuestionForAnswerIndex = -1;
    $scope.threat_factors_index = -1;
    $scope.direction = 1;
    $scope.CurrentStep = 0;
    $scope.MehvarView = null;
    $scope.config_set = false;
    $scope.onlyThisReport = 'all';
    $scope.expire_causes = [
        'عدم پیگیری دبیر کمیته',
        'به حد نصاب نرسیدن اعضاء کمیته',
        'عدم حضور رئیس کمیته',
        'عدم وقت دهی به علت تداخل با جلسات برنامه ریزی نشده',
        'سایر موارد'
    ];
    $scope.allQuestions = [
        'با در نظر گرفتن چند روز گذشته آیا شما می‌توانید مورد، مشکل و یا موضوعی را بیان نمایید که موجب طولانی شدن مدت بستری بیماری شده است؟',
        'با در نظر گرفتن چند روز گذشته آيا شما مي‌توانيد اتفاق نزديك به وقوعي را به ياد آوريد كه در صورت وقوع مي‌توانست به آسيب به بيمار شود؟',
        'آيا اخيرا شما متوجه اتفاقي كه به بيمار آسيب رسانيده است، شده‌ايد؟',
        'كدام يك از جوانب محيطي مي‌تواند به بيمار آسيب بزند؟',
        'آيا ما مي‌توانيم از آسيب بعدي به بيمار پيشگيري نماييم؟',
        'از نظر شما كدام يك از عوامل سيستمي و يا محيطي سبب افزايش ميزان خطر بروز اشتباهات مي‌شوند؟',
        'چه مداخله‌اي از سوي مديران ارشد سبب ايمن تر شدن ارائه خدمات شما مي‌شود؟',
        'به چه صورت مي‌توان بازديدهای مديريتی ايمنی را اثر بخش‌تر نمود؟',
    ]
    $scope.psuc = {
        checklist: {
            components: [],
            mehvar: '',
            title: '',
            has_components: false,
            guides: [],
            score_type: '',
            questions: [],
            wards: []
        },
        selectedComponentForQ: ''
    };
    $scope.questiosOfCheckList = {};
    $scope.mehvarha = [
        "ایمنی بیمار",
        " هموویژلانس",
        " تجهیزات پزشکی",
        " آموزش به بیمار",
        " بهبود کیفیت",
        " کنترل عفونت",
        " آموزش",
        " بهداشت محیط",
        " بهداشت حرفه ای",
        " مدیریت پرستاری",
        "مدیریت خطر حوادث و بلایا",
        "مدیریت دارویی",
		"تغذیه",
		"تاسیسات",
    ];
    $scope.chekLists = [];
    $scope.selectedVisit={
        mehvar:null,
        options: {
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 0,
            dir: 'ltr',
            width: 200,
            height: 200,
            space: 130,
            loop: true,
            controls: true
        },
        mehvars:[
            {
                title:'بهبود کیفیت',

                checklists:[
                    {
                        component:{
                            title:'',
                            questions:[
                                {
                                    body:'',
                                    average:5,
                                    has_eop:false,
                                    committees:[]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
    $scope.axies=[]
    $scope.choosedView=null;

    $scope.bar_chart = {

        options: {
            detail_of_chart: {},
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },

                }]

            },
            plugins: {
                p1: false
            },
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
        },
        data_chart: {
            by_mehvar_chart:[]
        },
        labels: {
            by_mehvar_chart:[]
        },
    };
    function has_visit(data, date) {
        return data.filter(function (d) {

            return moment(d.date).isSame(date, 'day');
        });
    }

    function set_class(row, d, i, j) {
        if (!d.className) {
            var day = d.day;
            var l = has_visit(row.data, moment($scope.get_miladi_date($rootScope.year + '/' + row.month_num + '/' + day)));
            /*$scope.has_session(row.data,$rootScope.year,row.month_num,day);*/

            d.className = $scope.is_holidy($rootScope.year, row.month_num, day) ? 'text-warning disabled' : (l.length ? (l.length === 1 ? (l[0].has_report && l[0].send_kartabl ? 'active' : (l[0].expire ? 'fail' : 'bordered')) :
                (l.every(function (itm) {
                    if (itm.has_report && itm.send_kartabl) {
                        return true;
                    }
                }) ? 'notify active' : (l.every(function (itm) {
                    if (itm.expire) {
                        return true;
                    }
                }) ? 'notify fail' : 'notify bordered'))) : 'notset');

            $scope.events[i].days[j].len = l.length;
        }


        return d.className;
    }

    function setEvents(data) {
        $scope.events.map(function (itm) {
            itm.data = [];
        });
        data.forEach(function (itm) {
            if (itm.date) {
                switch (moment(itm.date).jMonth()) {
                    case 0:
                        $scope.events[0].data.push(itm);
                        break;
                    case 1:
                        $scope.events[1].data.push(itm);
                        break;
                    case 2:
                        $scope.events[2].data.push(itm);
                        break;
                    case 3:
                        $scope.events[3].data.push(itm);
                        break;
                    case 4:
                        $scope.events[4].data.push(itm);
                        break;
                    case 5:
                        $scope.events[5].data.push(itm);
                        break;
                    case 6:
                        $scope.events[6].data.push(itm);
                        break;
                    case 7:
                        $scope.events[7].data.push(itm);
                        break;
                    case 8:
                        $scope.events[8].data.push(itm);
                        break;
                    case 9:
                        $scope.events[9].data.push(itm);
                        break;
                    case 10:
                        $scope.events[10].data.push(itm);
                        break;
                    case 11:
                        $scope.events[11].data.push(itm);
                        break;

                }
            }

        });
        $scope.events.map(function (e, i) {
            var days = [];
            $scope.get_day_of_month(e.month_num, $rootScope.year).forEach(function (day) {
                days.push({day: day, className: false});
            });
            Object.assign(e.days, angular.copy(days));
            e.days.map(function (itm, j) {
                itm.className = set_class(e, itm, i, j);

            })
        });
    }

    function set_days_of_events(noCash) {
        var url = $scope.active_view === 0 ? 'psvc' : 'psuc';
        $scope.visits = [];
        $scope.events.map(function (itm) {
            itm.data = [];
        });
        factory1.getUserApi('/v1/user/hospital/' + url).then(function (data) {
            $scope.visits = angular.copy(data);
            setEvents(data)
        });
    }

    function showInvite() {
        $scope.send_invitation = true;
        $scope.viewDetail.text = 'با سلام و احترام' + '\n' +
            'به استحضار می‌رساند بازدید از ' +
            $scope.viewDetail.location + ' ' +
            'در مورخه' + ' ' +
            $scope.viewDetail.year + '/' + $scope.viewDetail.month + '/' + $scope.viewDetail.day + ' ' +
            'از ساعت' + ' ' +
            $scope.get_time($scope.viewDetail.start_time.toString()) + ' ' +
            'الی' + ' ' +
            $scope.get_time($scope.viewDetail.end_time.toString()) + ' ' +

            'برگزار می‌گردد. لذا از جنابعالی دعوت می گردد تا در این بازدید حضور بهم رسانید.' + '\n' +
            'با تشکر'
        ;
        $scope.selected_users = angular.copy($scope.VisitsUsers);
    }

    function getMembers(psu_type, callback) {
        $scope.PSU = {};
        factory1.getUserApi('/v1/user/hospital/psu', '&psu_type=' + psu_type).then(function (data) {
            if (data)
                $scope.PSU = data;
            if (callback) {
                callback();
            }
        });
    }

    function setDir(step) {
        $scope.direction = step > $scope.CurrentStep ? 1 : 0;

    }

    function saveAnswer() {
        $scope.psvc_Report.questions[$scope.CurrentQuestionForAnswerIndex] = angular.copy($scope.CurrentQuestionForAnswer);
        $scope.cancelAnswer();
    }

    function getChecklists(fn) {
        $scope.chekLists = [];
        factory1.getUserApi('/v1/user/hospital/psuc/checklist').then(function (data) {
            $scope.chekLists = data;

            if (fn) {
                fn(data);
            }
        });
    }

    function getReportChecklist(psuc_id){
        factory1.getUserApi('/v1/user/hospital/psuc/'+psuc_id+'/report').then(function (data) {
            $scope.reportChecklist=data;
            $scope.bar_chart.labels.by_mehvar_chart=data.by_mehvar_chart.map(function (m) {
                return m.mehvar
            });
            $scope.bar_chart.data_chart.by_mehvar_chart=data.by_mehvar_chart.map(function (m) {
                return m.value.toFixed(2);
            });

        })
    }
    $scope.export_excel_all_psuc=function(){
        factory1.getUserApi('/v1/user/hospital/psuc/excel/general').then(function (data) {
           $rootScope.onprinting=true;
            $scope.success_alert('درخواست شما برای دریافت خروجی اکسل ثبت شد لطفاً تا آماده شدن فایل صفحه را تغییر ندهید و از به روزرسانی صفحه خودداری کنید.', 'دریافت خروجی');        })
    }
    $scope.export_excel_compact_psuc=function(){
        factory1.getUserApi('/v1/user/hospital/psuc/excel/compact','&psuc_id='+$scope.selected_psuc.id).then(function (data) {
           $rootScope.onprinting=true;
            $scope.success_alert('درخواست شما برای دریافت خروجی اکسل ثبت شد لطفاً تا آماده شدن فایل صفحه را تغییر ندهید و از به روزرسانی صفحه خودداری کنید.', 'دریافت خروجی');        })
    }
    $scope.slideChanged = function (index) {

        $scope.selectedVisit.mehvar = $scope.selectedVisit.mehvars[index];
    };
    $scope.toggle_config_set = function () {
        $scope.config_set = !$scope.config_set;
        $scope.CurrentStep = 0;
        if ($scope.config_set) {
            $scope.reset_params($scope.psuc.checklist);
            $scope.psuc.checklist.components = [];
            $scope.psuc.checklist.guides = [];
            if ($scope.psuc.checklist.id) {
                delete $scope.psuc.checklist.id;
            }
            $scope.questiosOfCheckList = {};
            $scope.addComponet();
            $scope.addGuide();

        }
    };
    $scope.setMehvar = function (row) {

        $scope.MehvarView = angular.copy(row);

        factory1.getUserApi('/v1/user/hospital/psuc/axis?ward_id='+row.location+'&year='+$rootScope.year).then(function (data) {
            $scope.axies=data.result.map(function (itm) {
                return ({
                    user_id:'',
                    checked:true,
                    mehvar:itm,
                })
            });

            $scope.open_modal('lg', 'mehvar.html', null, null, 'blue_modal', $scope, true);
        })


    };
    $scope.addComponet = function () {
        $scope.psuc.checklist.components.push({rates: [], description: '', rate_type: '', questions: []})
    };
    $scope.setRates = function (row) {
        $scope.selectedComponent = angular.copy(row);
        $scope.selectedComponentIndex = $scope.psuc.checklist.components.indexOf(row);

        if (!$scope.selectedComponent.rates.length) {
            $scope.addRate();
            if ($scope.selectedComponent.rate_type === 'دوسطحی') {
                $scope.addRate();
            }
        }


        $scope.open_modal('lg', 'setRate.html', null, null, 'blue_modal', $scope, false);
    };
    $scope.addRate = function () {
        $scope.selectedComponent.rates.push({guide: '', value: ''})
    };
    $scope.setRate = function () {
        $scope.psuc.checklist.components[$scope.selectedComponentIndex].rates = $scope.selectedComponent.rates;
        $scope.close_modal();
    };
    $scope.addGuide = function () {
        $scope.psuc.checklist.guides.push({guide: '', value: ''});
    };
    $scope.changeScoreType = function () {
        $scope.psuc.checklist.guides = [];
        $scope.addGuide();
        if ($scope.psuc.checklist.score_type === 'دوسطحی') {
            $scope.addGuide();
        }
    };
    $scope.SelectThisComponent = function () {

        $scope.psuc.checklist.components.map(function (itm) {
            if (itm.description === $scope.psuc.selectedComponentForQ) {
                $scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ] = itm.questions;
                if (!$scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ].length)
                    $scope.addQuestionToCh();
            }
        })
    }
    $scope.saveChackList = function (save) {
        var checklist = angular.copy($scope.psuc.checklist);

        var params = {
            year: $rootScope.year,
            title: checklist.title,
            mehvar: checklist.mehvar,
            wards: checklist.wards || [],
            has_components: checklist.has_components,
            save: save
        };
        if ($scope.psuc.checklist.id) {
            params.id = $scope.psuc.checklist.id;
        }
        if (params.has_components) {
            params.components = checklist.components.map(function (comp) {
                /*comp.scores=[];
                comp.rates=comp.rates.map(function (rate) {
                    comp.scores.push(rate.guide);
                    return rate.value;
                });*/
                comp.guides = comp.rates;
                comp.questions = $scope.questiosOfCheckList[comp.description];
                return comp;
            });
        } else {
            params.score_type = checklist.score_type;
            params.guides = checklist.guides;
            params.questions = $scope.questiosOfCheckList['NoComponent'];
        /*    params.components=[
                {
                    guides:checklist.guides,
                    questions:$scope.questiosOfCheckList['NoComponent'],
                    rate_type:checklist.score_type

                }
            ]*/
        }
        factory1.postUserApi('/v1/user/hospital/psuc/checklist', params).then(function (data) {
            $scope.success_alert('ثبت اطلاعات با موفقیت انجام شد.', 'ثبت چک لیست');
            if ($scope.psuc.checklist.id) {
                delete $scope.psuc.checklist.id;
                $scope.chekLists[$scope.indexOfCheckList] = data;
                $scope.indexOfCheckList = -1;
            } else {
                $scope.chekLists.push(data);
            }
            $scope.toggle_config_set();


        })
    };
    $scope.deleteCheckList=function(row){
        $scope.question('آیا از حذف چک لیست مورد نظر مطمئن هستید؟', 'حذف چک لیست');
        $scope.q_result.result.then(function (r) {
            if (r) {
                factory1.postUserApi('/v1/user/hospital/psuc/checklist', JSON.stringify({id:row.id,is_archive:true})).then(function (data) {
                    $scope.success_alert(' اطلاعات با موفقیت حذف شد.', 'حذف چک لیست');
                    $scope.chekLists.splice($scope.chekLists.indexOf(row),1)
                });
            }
        });
    }
    $scope.editCheckList = function (row) {

        $scope.indexOfCheckList = $scope.chekLists.indexOf(row);
        $scope.toggle_config_set();
        for (var key in $scope.psuc.checklist) {
            if ($scope.psuc.checklist.hasOwnProperty(key)) {
                if (row.hasOwnProperty(key)) {
                    $scope.psuc.checklist[key] = row[key];
                    if (key.toString() === 'components') {
                        $scope.psuc.checklist.components.map(function (comp) {
                            if (comp.questions && comp.questions.length) {
                                $scope.questiosOfCheckList[comp.description] = comp.questions.map(function (q) {

                                    q.checked = true;
                                    return q;
                                });
                            }

                            comp.rates = comp.guides;
                        })
                        // $scope.selectedComponent.rates
                    }
                    if (key.toString() === 'questions') {
                        if (!row.has_components) {
                            $scope.psuc.checklist.questions = row.questions.map(function (q) {
                                q.checked = true;
                                return q;
                            });
                            $scope.psuc.selectedComponentForQ = 'NoComponent';
                            $scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ] = $scope.psuc.checklist.questions;
                        }
                    }
                }
            }
        }
        $scope.psuc.checklist.id = row.id;
    };
    $scope.addQuestionToCh = function () {
        $scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ].push({checked: true, body: ''})
    };
    $scope.deleteVisit = function (row) {
        $scope.question('آیا از حذف بازدید مورد نظر مطمئن هستید؟', 'حذف بازدید');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var url = $scope.active_view === 0 ? 'psvc' : 'psuc';
                factory1.deleteUserApi('/v1/user/hospital/' + url + '/' + row.id).then(function (data) {
                    $scope.success_alert('حذف بازدید با موفقیت انجام شد', 'حذف بازدید');
                    $scope.visits.splice($scope.visits.indexOf(row), 1);
                    setEvents($scope.visits);
                })
            }
        });
    };
    $scope.expireIt = function () {
        if ($scope.selectedVisit.expire_cause && $scope.selectedVisit.expire_cause.length) {
            $scope.close_modal();
            $scope.question('آیا از منتفی کردن بازدید مورد نظر مطمئن هستید؟', 'منتفی کردن بازدید');
            $scope.q_result.result.then(function (r) {
                if (r) {

                    factory1.putUserApi('/v1/user/hospital/psvc/expire', JSON.stringify({
                        id: $scope.selectedVisit.id,
                        expire_cause: $scope.selectedVisit.expire_cause_other || $scope.selectedVisit.expire_cause
                    })).then(function (data) {
                        $scope.success_alert(' بازدید با موفقیت منتفی شد', 'منتفی کردن بازدید');
                        $scope.visits[$scope.selectedVisitIndex].expire = true;
                        $scope.visits[$scope.selectedVisitIndex].expire_cause = $scope.selectedVisit.expire_cause_other || $scope.selectedVisit.expire_cause;
                        setEvents($scope.visits);
                    })
                }
            });
        } else {
            $scope.warning('لطفاً دلیل  منتفی کردن را مشخص کنید.');
        }

    };
    $scope.expireVisit = function (row) {
        $scope.selectedVisit = angular.merge($scope.selectedVisit ,angular.copy(row));
        $scope.selectedVisit.expire_cause_other = '';
        $scope.selectedVisitIndex = $scope.visits.indexOf(row);
        $scope.open_modal('md', 'expire.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.shoeVisitDetail = function (row) {
        $scope.selectedVisit={
            mehvar:null,
            options: {
                visible: 5,
                perspective: 35,
                startSlide: 0,
                border: 0,
                dir: 'ltr',
                width: 200,
                height: 200,
                space: 130,
                loop: true,
                controls: true
            },
            mehvars:[
                {
                    title:'بهبود کیفیت',

                    checklists:[
                        {
                            component:{
                                title:'',
                                questions:[
                                    {
                                        body:'',
                                        average:5,
                                        has_eop:false,
                                        committees:[]
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
        $scope.selectedVisit = angular.merge($scope.selectedVisit || {} ,angular.copy(row));
        $scope.CurrentStep = 0;
        $scope.members = $scope.to_array([], $scope.selectedVisit.sent_to.substring(1, $scope.selectedVisit.sent_to.length - 1), '-').map(function (m) {
            return {user_id: m, present: row.report && row.report.presenters.indexOf(m) !== -1}
        });
        $scope.guestes = [];
        if (!row.report) {
            $scope.addGuest();
        } else {
            $scope.psvc_Report = angular.copy(row.report);
            if (row.report.presenters) {
                var p = angular.isArray(row.report.presenters) ? row.report.presenters : $scope.to_array([], row.report.presenters, '-');
                p.forEach(function (itm) {
                    $scope.members.map(function (m) {
                        if (m.user_id == itm) {
                            m.checked = true;
                        }
                    })
                })
            }
            if (row.report.guests) {
                $scope.guestes = angular.copy(row.report.guests)
            }

        }
    };
    $scope.addGuest = function () {
        $scope.guestes.push({name: '', post: '', description: '', cell_phone: ''})
    };
    $scope.cancelThreatFactors = function () {
        $scope.reset_params($scope.CurrentThreatFactors);
    };
    $scope.saveThreatFactors = function () {
        if ($scope.threat_factors_index >= 0) {
            $scope.psvc_Report.threat_factors[$scope.threat_factors_index] = angular.copy($scope.CurrentThreatFactors);
        } else {
            $scope.psvc_Report.threat_factors.push(angular.copy($scope.CurrentThreatFactors));
        }
        $scope.cancelThreatFactors();
        $scope.threat_factors_index = -1;
    };
    $scope.editThreatFactor = function (row) {
        $scope.CurrentThreatFactors = angular.copy(row);
        $scope.threat_factors_index = $scope.psvc_Report.threat_factors.indexOf(row);
    };
    $scope.deleteThreatFactor = function (row) {
        $scope.question('آیا از حذف مورد تهدید کننده مورد نظر مطمئن هستید؟', 'حذف مورد تهدید کننده');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.psvc_Report.threat_factors.splice($scope.psvc_Report.threat_factors.indexOf(row), 1)
            }
        });

    };
    $scope.upload_file = function (file, key) {
        factory1.upload_file($scope, file, 20000000, ['image/png', 'image/jpeg', 'image/jpg'], true, null).then(function (data) {

            $scope.psvc_Report[key] = data;
        });
    };
    $scope.upload_verdict = function (row) {
        factory1.upload_file($scope, row.file, 20000000, ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/docx'], false, null).then(function (data) {

            $scope.PSU.members[$scope.PSU.members.indexOf(row)].verdict = data;
        });
    };
    $scope.delete_user = function (row) {
        $scope.PSU.members = $scope.PSU.members.map(function (m) {
            if (m.user_id === row.user_id) {
                m.deleted = true;
            }
            return m;
        });

    };
    $scope.addMember = function () {
        var arr = [];
        $scope.header = 'انتخاب اعضا';
        arr = angular.copy($scope.users);

        if ($scope.PSU.members && $scope.PSU.members.length) {
            arr.map(function (itm) {
                /* if(itm.com_id==$scope.access[0].committee_id){
                 itm.no_select_all=true;
                 }*/
                itm.users.map(function (obj) {
                    $scope.PSU.members.forEach(function (user) {
                        if (user.user_id === obj.id) {
                            obj.verdict = user.verdict;
                            obj.psu_id = user.id;
                            obj.file = user.file;
                            obj.votable = user.votable;
                            obj.readonly = true;
                            obj.checked = true;
                        }
                    });
                });
            });
        }

        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {

                $scope.PSU.members = r.map(function (usr) {
                    return {
                        user_id: usr.id,
                        verdict: usr.verdict,
                        file: usr.file,
                        votable: usr.votable,
                        id: usr.psu_id
                    };
                })

            }
        });
    };
    $scope.savePSU = function () {
        $scope.PSU.psu_type = $scope.active_view == 0 ? 'modiriat' : 'team';
        $scope.PSU.members.map(function (m) {
            delete m.file;
            m.votable = m.votable ? m.votable : false;
        })
        $scope.PSU.year = $rootScope.year;
        factory1.putUserApi('/v1/user/hospital/psu', JSON.stringify($scope.PSU)).then(function (data) {
            $scope.success_alert('شناسنامه بازدیدها با موفقیت ثبت شد.', 'ثبت شناسنامه');
            $scope.PSU = data;
        })
    };
    $scope.choose_mehvar = function () {
        var selectedAxis=$scope.axies.filter(function (itm) {
            return itm.checked;
        });
        if(selectedAxis.length){

            factory1.putUserApi('/v1/user/hospital/psuc/checklist/evaluationers',{
                evaluationers:selectedAxis,
                psuc_id:$scope.MehvarView.id,
                year:$rootScope.year
            }).then(function () {
                $scope.close_modal()
                $scope.success_alert('محور ارزیابی با موفقیت ثبت شد.');
                set_days_of_events();

            })
        }else{
            $scope.warning('لطفاً محورهای ارزیابی را انتخاب کنید')
        }
    }
    $scope.get_popover_content = function (arr, is_all) {

        var l = '';

        arr.forEach(function (itm) {
            if (itm.expire) {
                l = l + '<p class="text-red">' +
                    ' <b>بازدید</b> ' +
                    $scope.get_ward_name(itm.location, $scope.wards) + ' '
                    +
                    $scope.get_time(itm.start_time) +
                    ' الی ' +
                    $scope.get_time(itm.end_time) +
                    '<br/>' +
                    ' به دلیل ' +
                    itm.expire_cause +
                    ' منتفی شده.' +
                    '</p>';
            } else {
                if (itm.has_report) {
                    if (!itm.send_kartabl) {
                        l = l + '<p class="text-light-green">' +
                            ' <b>بازدید</b> ' +
                            $scope.get_ward_name(itm.location, $scope.wards) + ' '
                            +
                            $scope.get_time(itm.start_time) +
                            ' الی ' +
                            $scope.get_time(itm.end_time) +
                            ' گزارش، کامل ثبت نشده.' +
                            '</p>';
                    } else {
                        l = l + '<p class="text-green">' +
                            ' <b>بازدید</b> ' +
                            $scope.get_ward_name(itm.location, $scope.wards) + ' '
                            +
                            $scope.get_time(itm.start_time) +
                            ' الی ' +
                            $scope.get_time(itm.end_time) +
                            ' گزارش، کامل ثبت شده.' +
                            '</p>';
                    }
                } else {
                    l = l + '<p class="text-warning">' +
                        ' <b>بازدید</b> ' +
                        $scope.get_ward_name(itm.location, $scope.wards) + ' '
                        +
                        $scope.get_time(itm.start_time) +
                        ' الی ' +
                        $scope.get_time(itm.end_time) +
                        ' گزارش ثبت نشده.' +
                        '</p>';
                }

            }


        });
        return $scope.get_trust('<div class="text-center" style="font-size: .75em;">' + l + '</div>');
    };
    $scope.has_view = function (data, date) {
        return has_visit(data, $scope.get_miladi_date(date));
    };
    $scope.choose_view = function (view) {
        $scope.template.url = 'views/fault_management/EvaluationErrorManagement/PatientSafetyVisits/' + view + '.htm';
        $scope.is_parent = false;
        $scope.onlyThisReport = 'all';
        $scope.choosedView={view:angular.copy(view)};
        if (view.indexOf('report') !== -1) {
            $scope.selectedVisit=null;
        }
        if (view.indexOf('profile') !== -1) {
            getMembers($scope.active_view == 0 ? 'modiriat' : 'team');
        } else {
            set_days_of_events();
            $scope.send_invitation = false;
            if (view.indexOf('checklist') >= 0) {
                getChecklists();
            }
        }
    };
    $scope.saveVisitDetail = function (save) {
        var params = {
            id: $scope.selectedVisit.id,
            presenters: $scope.members.filter(function (m) {
                return m.present
            }).map(function (m) {
                return m.user_id;
            }),
            questions: $scope.psvc_Report.questions,
            threat_factors: $scope.psvc_Report.threat_factors,
            guestes: $scope.guestes,
            save: save

        };
        if ($scope.psvc_Report.image1 && typeof $scope.psvc_Report.image1 === 'string' && $scope.psvc_Report.image1.length) {
            params.image1 = $scope.psvc_Report.image1;
        }
        if ($scope.psvc_Report.image2 && typeof $scope.psvc_Report.image2 === 'string' && $scope.psvc_Report.image2.length) {
            params.image2 = $scope.psvc_Report.image2;
        }
        if ($scope.psvc_Report.image3 && typeof $scope.psvc_Report.image3 === 'string' && $scope.psvc_Report.image3.length) {
            params.image3 = $scope.psvc_Report.image3;
        }
        factory1.putUserApi('/v1/user/hospital/psvc/report', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('گزارش بازدید با موفقیت ثبت شد.', 'ثبت گزارش');
            set_days_of_events();
            $scope.closeConfig();
        })
    };
    $scope.closeConfig = function () {
        $scope.selectedVisit = null;
    };
    $scope.send_viewDetail = function () {
        var parameter = JSON.stringify({
            id: $scope.viewDetail.id,
            users: $scope.selected_users.map(function (usr) {
                return usr.id;
            }),
            message: $scope.viewDetail.text

        });
        factory1.putUserApi('/v1/user/hospital/psvc/sent', parameter).then(function (data) {
            $scope.success_alert('ارسال دعوت نامه با موفقیت انجام شد.', 'ارسال دعوتنامه');
            $scope.close_modal();
            set_days_of_events(true);
        });

    };
    $scope.select_this_user = function () {
        var arr = [];
        var new_users = [];
        $scope.header = 'انتخاب اعضا';
        arr = angular.copy($scope.users);
        console.log( $scope.selected_users);
        arr.map(function (itm) {

            itm.users.map(function (obj) {
                $scope.selected_users.forEach(function (user) {

                    if (user.id && user.id === obj.id) {
                        obj.checked = true;
                    }
                });
            });
        });
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                new_users = r.filter(function (usr) {
                    if (usr.checked) {
                        return usr;
                    }
                });
                $scope.selected_users = $filter('unique')(new_users, 'id');

            }
        });
    };
    $scope.new_visit = function () {
        $scope.close_modal();
        $scope.res = $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.select_this_visit = function (row) {
        console.log(row);
        if ($scope.active_view == 0) {
            $scope.choose_view('report');
            $scope.onlyThisReport = row.id;
            $scope.close_modal();
        } else {
            
            $scope.close_modal();
            $scope.selected_psuc=angular.copy(row);
            getReportChecklist(row.id);
            factory1.getUserApi('/v1/user/hospital/psuc/'+row.id+'/checklists').then(function (data) {
                $scope.psuc_checklist=data;
            })
            $scope.open_modal('lg','checklistDetail.html',null,null,'full_width only_content',$scope,true)
        }
    }
    $scope.show_detail_checklist=function(data){
        factory1.getUserApi('/v1/user/hospital/psuc/'+$scope.selected_psuc.id+'/checklists/'+data.id).then(function (data) {
            console.log(data)
            $scope.detail_checklist=data;
            $scope.open_modal('lg','detailChecklistRecords.html',null,null,'blue_modal',$scope)
        })
    }
    $scope.set_view = function (year, month, day, data, event) {
       /* if ($scope.is_holidy(year, month, day)) {
            return false;
        } else {*/
       console.log(data)
            $scope.send_invitation = false;
            $scope.viewDetail = {};
            $scope.viewDetail.year = year;
            $scope.viewDetail.month = month;
            $scope.viewDetail.day = day;
            if (data.length) {
                var first_color = angular.element(event.currentTarget).css('background-color');
                $scope.first_color = first_color !== 'rgba(0, 0, 0, 0)' ? first_color : angular.element(event.currentTarget).parent().parent().css('color');

                $scope.thisDayVisits = $filter('filter_by')(angular.copy(data), 'expire', true,true);
                $scope.open_modal('lg', 'choose_or_new.html', null, null, 'blue_modal', $scope, true);

            } else {

                $scope.res = $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal', $scope, true);
            }

/*
        }*/
    };

    function initSelectedUsers() {
        $scope.selected_users = [];
        if ($scope.PSU.members) {
            $scope.selected_users = $scope.PSU.members.map(function (itm) {
                return $scope.get_user(itm.user_id, $scope.users);
            })
        }
    }

    $scope.send_to_kartabl = function (row) {
        console.log(row, $scope.selected_users, $scope.PSU.members);

            getMembers($scope.active_view == 0 ? 'modiriat' : 'team', initSelectedUsers);

        $scope.viewDetail = angular.copy(row);
        $scope.viewDetail.location = $scope.get_ward_name($scope.viewDetail.location, $scope.wards);
        $scope.viewDetail.year = $scope.get_year(row.date);
        $scope.viewDetail.month = $scope.get_month(row.date, true);
        $scope.viewDetail.day = $scope.get_day(row.date, true);
        $scope.res = $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal', $scope, true);
        showInvite();
    };
    $scope.submit_viewDetail = function () {
        var st = $scope.viewDetail.start_time ? $scope.viewDetail.start_time.toString() : '';
        var et = $scope.viewDetail.end_time ? $scope.viewDetail.end_time.toString() : '';

        if (st.length > 0) {
            if (et.length > 0) {
                if ($scope.viewDetail.location && $scope.viewDetail.location.length > 0) {
                    var p = {
                        year: $rootScope.year,
                        location: $scope.viewDetail.location,
                        date: $scope.get_miladi_date($scope.viewDetail.year + '/' + $scope.viewDetail.month + '/' + $scope.viewDetail.day, '00:00'),
                        start_time: st.substring(16, 21),
                        end_time: et.substring(16, 21)

                    };
                    $scope.PSU.psu_type = $scope.active_view == 1 ? 'psuc' : 'psvc';
                    factory1.postUserApi('/v1/user/hospital/' + $scope.PSU.psu_type, JSON.stringify(p)).then(function (data) {
                        $scope.visits.push(data);
                        setEvents($scope.visits);
                        $scope.viewDetail.id = data.id;
                        showInvite();
                        $scope.close_modal();
                    }, function (error) {
                        console.error(error)
                    });
                } else {
                    $scope.warning('لطفاً زمان شروع بازدید را انتخاب کنید.');
                }
            } else {
                $scope.warning('لطفاً زمان شروع بازدید را انتخاب کنید.');
            }
        } else {
            $scope.warning('لطفاً زمان شروع بازدید را انتخاب کنید.');
        }

    };
    $scope.addQuestion = function () {
        if ($scope.psvc_Report.questions.length) {
            if ($scope.psvc_Report.questions[$scope.psvc_Report.questions.length - 1].editable) {
                return false;
            }
        }
        $scope.CurrentQuestion = {question: '', answers: [], editable: true};

    };
    $scope.saveQuestion = function () {
        $scope.CurrentQuestion.editable = false;
        $scope.psvc_Report.questions.push(angular.copy($scope.CurrentQuestion));
        $scope.cancelUpdateQuestion();
    };
    $scope.deleteQuestion = function (row) {
        $scope.question('آیا از حذف سوال مورد نظر مطمئن هستید؟', 'حذف سوال');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.psvc_Report.questions.splice($scope.psvc_Report.questions.indexOf(row), 1);
            }
        });
    };
    $scope.editQuestion = function (row) {
        $scope.indexOfQ = $scope.psvc_Report.questions.indexOf(row);
        $scope.CurrentQuestion = angular.copy(row);
    };
    $scope.updateQuestion = function () {
        $scope.psvc_Report.questions[$scope.indexOfQ] = angular.copy($scope.CurrentQuestion);
        $scope.cancelUpdateQuestion();
    };
    $scope.cancelUpdateQuestion = function () {
        $scope.CurrentQuestion = null;
        $scope.indexOfQ = -1;
    };
    $scope.answerQuestion = function (row) {
        $scope.CurrentQuestionForAnswer = angular.copy(row);
        $scope.CurrentQuestionForAnswerIndex = $scope.psvc_Report.questions.indexOf(row);
        $scope.open_modal('lg', 'Answer.html', null, null, '', $scope, true);

    };
    $scope.addAnswer = function (fn) {

        if ($scope.CurrentAnswer.user_id != '') {
            if ($scope.CurrentAnswer.value.length) {
                $scope.CurrentQuestionForAnswer.answers.push(angular.copy($scope.CurrentAnswer));
                $scope.reset_params($scope.CurrentAnswer);
                if (fn) {
                    fn();
                }
            } else {
                $scope.warning('لطفاً پاسخ سوال را وارد کنید.')
            }
        } else {
            $scope.warning('لطفاً پاسخ دهنده سوال را انتخاب کنید.')
        }
    };
    $scope.deleteAnswer = function (row) {
        $scope.question('آیا از حذف پاسخ مورد نظر مطمئن هستید؟', 'حذف پاسخ');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.CurrentQuestionForAnswer.answers.splice($scope.CurrentQuestionForAnswer.answers.indexOf(row), 1);
            }
        });
    };

    function setChart(month) {

    }

    $scope.set_chart_by_month = function (Num, months) {
        var selected_months = [];
        months.map(function (itm, i) {
            if (itm.checked && selected_months.length < 2) {
                selected_months.push(itm);
            } else {
                itm.checked = false;
            }
        })
    }
    $scope.showChart = function () {
        $scope.months = $scope.events.map(function (m) {
            return {name: m.month, checked: false};
        });
        $scope.month_1 = angular.copy($scope.months);
        var wardChart={}
        $scope.errorWards = $scope.wards.map(function (itm, i) {
            var all_user = [];
            var presenters = 0;
            $scope.visits.forEach(function (v) {
                if (v.location === itm._id) {
                    if (v.has_report) {
                        console.log(v)
                        if(!wardChart[itm.name]){
                            wardChart[itm.name]=0
                        }
                        wardChart[itm.name]++;/*
                        if(!$scope.bar_chart.data_chart1){
                            $scope.bar_chart.data_chart1=[];

                        }
                        if(!$scope.bar_chart.data_chart1[i]){
                            $scope.bar_chart.data_chart1[i]=0;
                        }
                        $scope.bar_chart.data_chart1[i]++;*/

                    }
                    /* if(v.has_report){
                        $scope.bar_chart.data_chart1[i]++
                    }*/
                    if (v.sent_to)
                        all_user = all_user.concat.apply([], $scope.to_array([], v.sent_to.substring(1, v.sent_to.length - 1), '-'))
                }

            });
            all_user = all_user.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
            if (presenters)
                $scope.bar_chart.data_chart3[i] = ((presenters * 100) / all_user.length).toFixed(2);
            return itm.name;
        });
        $scope.bar_chart.data_chart1=[];
        $scope.bar_chart.label_chart1=[];
        Object.keys(wardChart).map(function (w) {
            $scope.bar_chart.label_chart1.push(w);
            $scope.bar_chart.data_chart1.push(wardChart[w])
        })
        $scope.template.url = 'views/fault_management/EvaluationErrorManagement/PatientSafetyVisits/chart.htm';
    }
    $scope.saveAnswers = function () {
        if ($scope.CurrentAnswer.user_id != '' || $scope.CurrentAnswer.value.length) {
            $scope.addAnswer(saveAnswer);
        } else {
            saveAnswer();
        }


    };
    $scope.cancelAnswer = function () {
        $scope.CurrentQuestionForAnswer = null;
        $scope.reset_params($scope.CurrentAnswer);
        $scope.close_modal();
    };
    $scope.next = function () {
        if ($scope.active_view == 1) {
            if ($scope.CurrentStep == 0) {
                if ($scope.psuc.checklist.title && $scope.psuc.checklist.title.length) {
                    if ($scope.psuc.checklist.mehvar && $scope.psuc.checklist.mehvar.length) {
                        if ($scope.psuc.checklist.has_components) {
                            if ($scope.psuc.checklist.components && $scope.psuc.checklist.components.length) {
                                if ($scope.psuc.checklist.components.every(function (itm) {
                                    return itm.description != null && itm.description != '' && itm.rate_type != null && itm.rate_type != '' && itm.rates.length && itm.rates.every(function (rate) {
                                        return rate.value != null && rate.value != ''
                                    })
                                })) {

                                } else {
                                    $scope.warning('لطفاً اجزای چک لیست را بدرستی وارد کنید.');
                                    return false;
                                }
                            } else {
                                $scope.warning('لطفاً اجزای چک لیست را مشخص کنید.');
                                return false;
                            }
                        } else {
                            if ($scope.psuc.checklist.score_type && $scope.psuc.checklist.score_type.length) {
                                if ($scope.psuc.checklist.guides && $scope.psuc.checklist.guides.length && $scope.psuc.checklist.guides.every(function (itm) {
                                    return itm.value != null && itm.value != ""
                                })) {

                                } else {
                                    $scope.warning('لطفاً مقادیر امتیاز را وارد کنید.');
                                    return false;
                                }
                            } else {
                                $scope.warning('لطفاً نوع امتیازدهی را انتخاب کنید.');
                                return false;
                            }
                        }
                    } else {
                        $scope.warning('لطفاً محور ارزیابی چک لیست را انتخاب کنید.');
                        return false;
                    }
                } else {
                    $scope.warning('لطفاً عنوان چک لیست را وارد کنید.');
                    return false;
                }
                if (!$scope.psuc.checklist.has_components) {
                    $scope.psuc.selectedComponentForQ = 'NoComponent';
                    $scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ] = $scope.psuc.checklist.questions;
                    if (!$scope.questiosOfCheckList[$scope.psuc.selectedComponentForQ].length)
                        $scope.addQuestionToCh();
                }

            } else if ($scope.CurrentStep == 1) {
                if ($scope.questiosOfCheckList) {
                    var err = false;
                    for (var comp in $scope.questiosOfCheckList) {
                        if ($scope.questiosOfCheckList.hasOwnProperty(comp)) {
                            $scope.questiosOfCheckList[comp] = $scope.questiosOfCheckList[comp].filter(function (q) {
                                return q.checked;
                            });
                            if ($scope.questiosOfCheckList[comp].length) {
                                var isAllHaveBody = $scope.questiosOfCheckList[comp].every(function (q) {
                                    return q.body && q.body.length;
                                });
                                if (isAllHaveBody) {

                                } else {
                                    $scope.warning('لطفاً سوالات انتخابی را کامل وارد کنید.');
                                    err = true;
                                    break;
                                }
                            } else {
                                $scope.warning('لطفاً سوالات را مشخص کنید.');
                                err = true;
                                break;
                            }

                        }
                    }
                    if (err) {
                        return false;
                    }

                } else {
                    $scope.warning('لطفاً سوالات را مشخص کنید.');
                    return false;
                }
            }
        }
        var step = angular.copy($scope.CurrentStep);
        $scope.CurrentStep++;
        setDir(step);

    };
    $scope.cancel = function () {
        $scope.reset_steps();
    };
    $scope.last = function (step) {
        if ($scope.CurrentStep) {
            var step = angular.copy($scope.CurrentStep);
            $scope.CurrentStep--;
            setDir(step);
        }
    };
    $scope.ThreadsShow = function (row) {
        console.log(row);
        $scope.Threads = angular.copy(row.report.threat_factors);
        $scope.open_modal('lg', 'Threads.html', null, null, 'blue_modal', $scope);
    }


});

app.controller('Analysis_reported_errors_Ctrl', function ($scope, $rootScope, BASE, factory1, $timeout, $http, Server_URL, $filter, $location) {
    $scope.excel_filename = 'خطا\/وقایع گزارش شده ' + $rootScope.year;
    var columns = [
        {columnid: 'shift', title: 'شیفت'},
        {columnid: 'Jdate_event', title: 'تاریخ بروزخطا'},
        {columnid: 'error_ward', title: 'بخش خطا کننده'},
        {columnid: 'ward', title: 'بخش گزارش دهنده خطا'},
        {columnid: 'job', title: 'رده شغلی خطا کننده'},
        {columnid: 'etiology', title: 'اتیولوژی خطا', width: 250,},
        {columnid: 'error_type', title: 'نوع خطا', width: 250,},
        {columnid: 'category', title: 'دسته بندی خطا', width: 250,},
        {columnid: 'complications', title: 'عوارض و پیامد خطا', width: 250,},
        {columnid: 'description', title: 'شرح خطا', width: 500,},
        {columnid: 'cause', title: 'علت بروز خطا', width: 300,},
        {columnid: 'dabir_suggestion', title: 'نظرات و پیشنهادات دبیر', width: 300}

    ];
    var error_excel_style_obj = {
        sheetid: 'خطا های گزارش شده',
        headers: true,
        caption: {
            title: 'خطا های گزارش شده',
            style: 'font-size: 50px' // Sorry, styles do not works
        },
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {columnid: 'shift', title: 'شیفت'},

            {columnid: 'Jdate_event', title: 'تاریخ بروزخطا'},
            {columnid: 'error_ward', title: 'بخش خطا کننده'},
            {columnid: 'ward', title: 'بخش گزارش دهنده خطا'},
            {columnid: 'job', title: 'رده شغلی خطا کننده'},
            {columnid: 'etiology', title: 'اتیولوژی خطا', width: 250,},
            {columnid: 'error_type', title: 'نوع خطا', width: 250,},
            {columnid: 'category', title: 'دسته بندی خطا', width: 250,},
            {columnid: 'complications', title: 'عوارض و پیامد خطا', width: 250,},
            {columnid: 'description', title: 'شرح خطا', width: 500,},
            {columnid: 'cause', title: 'علت بروز خطا', width: 300,},
            {columnid: 'dabir_suggestion', title: 'نظرات و پیشنهادات دبیر', width: 300}

        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    };
    var error_excel_style_obj_2 = angular.copy(error_excel_style_obj);
    error_excel_style_obj_2.sheetid = 'وقایع گزارش شده';
    $scope.error_excel_style = [error_excel_style_obj, error_excel_style_obj_2];
    /*  Chart.plugins.register({
        afterDatasetsDraw : function(chartInstance, easing) {
            // To only draw at the end of animation, check for easing === 1
            var ctx = chartInstance.chart.ctx;
            chartInstance.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.getDatasetMeta(i);
                if (!meta.hidden) {
                    meta.data.forEach(function(element, index) {
                        // Draw the text in black, with the specified font


                        var fontSize = 15;
                        var fontStyle = 'bold';
                        var f='iransansBold';

                        // Just naively convert to string for now
                        var dataString = dataset.data[index].toString();
                        // Make sure alignment settings are correct
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        var padding = 5;
                        var position = element.tooltipPosition();
                        ctx.font = Chart.helpers.fontString(fontSize, fontStyle,f);


                        ctx.fillStyle = '#555';
                        ctx.fillText(dataString + '%', position.x+2, position.y - (fontSize / 2) - padding);
                        ctx.fillStyle = '#fff';
                        ctx.fillText(dataString + '%', position.x, position.y - (fontSize / 2) - padding-2);
                    });
                }
            });
        }
    });*/
    $scope.pie_chart = {
        ward: [],
        labels_chart1: ['نیاز به RCA', 'عدم نیاز به RCA'],
        labels_chart2: [' قابل ارزیابی', ' غیرقابل ارزیابی'],
        labels_chart3: ['شیفت شب', 'شیفت عصر', ' شیفت صبح'],
        colors_chart1: ['#92c020', '#32b7a3'],
        colors_chart2: ['#0fa707', '#fb0202'],
        colors_chart3: ['#c62bfc', '#ea8b47', '#1c94e0'],
        data_chart1: [0, 0],
        data_chart2: [0, 0],
        data_chart3: [0, 0, 0],

        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (element, index) {
                            // Draw the text in black, with the specified font


                            var fontSize = 15;
                            var fontStyle = 'bold';
                            var f = 'iransansBold';

                            // Just naively convert to string for now
                            var dataString = dataset.data[index].toString();
                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            var padding = 5;
                            var position = element.tooltipPosition();
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, f);


                            ctx.fillStyle = '#555';
                            ctx.fillText(dataString + '%', position.x + 2, position.y - (fontSize / 2) - padding);
                            ctx.fillStyle = '#fff';
                            ctx.fillText(dataString + '%', position.x, position.y - (fontSize / 2) - padding - 2);
                        });
                    });
                }
            },
            scaleShowGridLines: false,

        }
    };
    $scope.report = {
        report_type: null
    }
    $scope.bar_chart = {

        options: {
            detail_of_chart: {},
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    },

                }]

            },
            plugins: {
                p1: false
            },
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
        },
        data_chart: {
            category: [],
            cause: [],
            job: [],
            complications: [],
            error_type: [],
            event_title: [],
            ward: [],
            reporter_name: [],
            error_ward: [],
            event_title2: [],
            month: []
        },
        ward: {},
        labels: {
            month: angular.copy($scope.months_name),
        },
        data_color: {
            month: ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC']
        },
        errorKind: [],
        data_series: {},
        data_set: {
            ward3: [{
                borderWidth: 0,
                backgroundColor: '#4f81bd'
            }, {
                borderWidth: 0,
                backgroundColor: '#c0504d'
            }]
        },
        onClick: function (chart, e) {
            console.log(chart, e);
        }
    };
    $scope.template = {url: ''};
    $scope.is_parent = true;
    $scope.active_view = -1;
    $scope.search = {Key: "", ward: ""};
    $scope.is_parent = true;
    $scope.allCommittees = $scope.committees;
    $scope.allconsequences = ['بدون پیامد و عوارض',
        'پیامد و عوارض روی کارکنان',
        'پیامد و عوارض روی بیماران',
        'پیامد و عوارض روی کارکنان و بیماران',
        'پیامد و عوارض روی سازمان'];
    $scope.falls = [
        'زمین خوردن',
        'سقوط از تخت',
    ];
    $scope.suicides = [
        'موفق',
        'ناموفق',

    ]
    $scope.allSorces = ['گزارش کارکنان', 'بازدیدهای میدانی ایمنی بیمار', 'بازدیدهای مدیریتی ایمنی بیمار',
        'تلفنی/شفاهی',
        'شکایات بیمار', 'کمیته مرتبط', 'سایر موارد'];
    $scope.allJobs = ['پزشک', 'کادر پرستاری', 'کادر مامایی', 'کمک بهیار', 'خدمات', 'تاسیسات', 'انتظامات', 'کادر آزمایشگاه', 'کادر دارویی', 'کادر اداری', 'کادر تغذیه', 'کادر اتاق عمل', 'کادر پذیرش', 'کادر تجهیزات پزشکی', 'کادر پاراکلینیک', 'کادر پشتیبانی', 'کادر تصویربرداری', 'منشی', 'کادر توانبخشی', 'فراگیر/دانشجو',
        'تکنسین بیهوشی',
        'تکنسین داروخانه',
        'تکنسین رادیولوژی',
        'کادر IT',
        'کادر امور مالی',
        'روانشناس',
        'مددکار',
        'سایر'];
    $scope.allErrorCat = ['نزدیک به خطا (Near-Miss)', 'بدون عارضه – (No Harm Event)', 'عارضه برگشت‌پذیر (Adverse Event)', 'مرگ یا عارضه پایدار (Sentinel Event)'];
    $scope.allCauses = ['شب کاری', 'شیفت‌های طولانی و پشت سرهم', 'ناخوانا بودن دستورات پزشک', 'نقص فنی تجهیزات', 'شلوغی بخش', 'عدم ارتباط صحیح با بیمار', 'عدم گزارش به موقع به پزشک', 'دانش ناکافی پرسنل',
        'کمبود پرسنل', 'تشابه شکل یا نام داروها', 'اشتباه در محاسبه دوز داروها', 'بی توجهی در اجرای دستور پزشک', 'عدم رعایت درست فرآیند دارودهی', ' عدم رعایت دستورالعمل داروهای پرخطر', 'بی توجهی به اتصالات بیمار',
        'اشکال در تاسیسات', 'ارزیابی اولیه نامناسب', 'عدم رعایت دستورالعمل جراحی ایمن', 'تشابه اسمی بیمار', 'بی دقتی و بی توجهی پرسنل', 'مهارت بالینی ناکافی پرسنل', 'نداشتن مهارت کافی درکار با تجهیزات', 'نبودن تجهیزات لازم و ضروری'
        , 'نبودن خط مشی و روش اجرایی واضح', 'بی توجهی به تداخلات دارویی', 'دانش ناکافی پزشک','عدم شناسایی صحیح بیمار','عدم ارتباط موثر در زمان تحویل', 'سایر موارد'];
    $scope.allCauses2 = [
        'نظارت ناکافی پرسنل',
        'ساختار نامناسب',
        'وجود وسایل آسیب زاد در بخش / محوطه',
        'حضور همراه در بخش',
        'ارزیابی نامناسب اولیه',
        'سن بالا',
        'افت فشار خون ارتوستاتیک',
        'دریافت داروهای آرام بخش',
        'خیس بودن / سر بودن زمین',
        'قفل نبودن چرخ تخت',
        'تمارض',
        'سایر موارد'
    ];
    $scope.allEventTitle = [

        '1- انجام عمل جراحي به صورت اشتباه روي عضو سالم',
        '2- انجام عمل جراحي به صورت اشتباه روي بيمار ديگر',
        '3- انجام عمل جراحي با روش اشتباه بر روي بيمار',
        '4- جا گذاشتن هر گونه device اعم از گاز و قيچي و پنس و ... در بدن بيمار',
        '5- مرگ در حين عمل جراحي يا بلافاصله بعد از عمل در بيمار داراي وضعيت سلامت طبيعي',
        '6- تلقيح مصنوعي با دهنده (DONOR) اشتباه درزوجين نابارور',
        '7- مرگ يا ناتواتي جدي بيمار به دنبال هر گونه استفاده از دارو و تجهيزات آلوده ميكروبي',
        '8- مرگ يا ناتواني جدي بيمار به دنبال استفاده از دستگاه‌هاي آلوده ',
        ' 9- مرگ يا ناتواني جدي بيمار به دنبال هر گونه آمبولي',
        '10- ترخيص و تحويل نوزاد به شخص و يا اشخاص غير از ولي قانوني',
        '11- مفقود شدن بيمار در زمان بستري كه بيش از 4 ساعت طول بكشد',
        '12- خودكشي يا اقدام به خودكشي در مركز درماني',
        '13- مرگ يا ناتواني جدي بيمار به دنبال هر گونه اشتباه در تزريق نوع دارو، دوزدارو، زمان تزريق دارو',
        '14- مرگ يا ناتواني جدي مرتبط با واكنش هموليتيك به علت تزريق گروه خون اشتباه در فرآورده‌هاي خوني',
        '15- كليه موارد مرگ يا عارضه مادر و نوزاد بر اثر زايمان طبيعي و يا سزارين',
        '16- مرگ يا ناتواني جدي به دنبال هيپوگليسمي در مركز درماني',
        '17- زخم بستر درجه 3 يا 4 بعد از پذيرش بيمار',
        '18- كرنيكتروس نوزاد ناشي از تعلل در درمان',
        '19- مرگ يا ناتواني جدي بيمار به علت هر گونه دستكاري غير اصولي ستون فقرات',
        '20- مرگ يا ناتواني جدي در اعضاي تيم احياء متعاقب هر گونه شوك الكتريكي به دنبال احيا بيمار كه مي‌تواند ناشي از اشكالات فني تجهيزات باشد',
        '21- حوادث مرتبط با استفاده اشتباه گازهاي مختلف به بيمار',
        '22- سوختگي‌هاي به دنبال اقدامات درماني مانند الكترودهاي اطاق عمل',
        '23- موارد مرتبط با محافظ و نگهدانده‌هاي اطراف تخت',
        '24- سقوط بيمار ',
        '25- موارد مرتبط با عدم رعايت موازين اخلاق پزشكي',
        '26- هرگونه آسيب فيزيكي ( ضرب و شتم و ...) وارده به بيمار',
        '27- ربودن بيمار',
        '28- اصرار به تزريق داروي خاص خطر آفرين يا قطع تعمدي اقدامات درماني توسط كادر درمان',
        'آسپیراسیون',
        'سوء مصرف مواد',
        'سوء رفتار جنسی',
        'آسیب به خود',
        'آسیب در حین مهار فیزیکی',
        'آسیب به محیط و پرخاشگری',
        'فوت به دلیل نامشخص',
        'عوارض بیهوشی (گازگرفتگی زبان)'

    ];
    $scope.search_data = {
        nameOfEveryError: '',
        date_from: '',
        date_to: '',
        sorce: '',
        komite: '',
        causeOfError: '',
        causeOfError2: '',
        jobs: '',
        etiology: '',
        kind: '',
        category: '',
        complications: '',
        shift: ['صبح', 'عصر', 'شب'],
        arzyabi: '',
        rca: '',
        behbud: '',
        edit_eghdam: '',
        eventTitle: '',
        errors: true,
        events: true
    };
    $scope.related_committe = {
        subject: '',
        body: '',
        committees: [],
        uesers: []
    };
    $scope.filteredData = [];
    $scope.reportWardList = [];
    $scope.reportedWrads = [];
    $scope.toggle_active = [0, 1];
    $scope.showFinalInfoReport = false;
    $scope.RCAStarted = false;
    $scope.shifts = [
        'صبح', 'عصر', 'شب'
    ];
    $scope.allComplications = [
        'بدون پیامد و عوارض',
        'پیامد و عوارض روی کارکنان',
        'پیامد و عوارض روی بیماران',
        'پیامد و عوارض روی کارکنان و بیماران',
        'پیامد و عوارض روی سازمان'
    ];
    $scope.eopList = [{}];
    $scope.eteology = [
        {
            id: 0,
            name: 'تشخیصی',
            content: ['تاخیر در تشخیص', 'اشتباه در تشخیص', 'فقدان تشخیص']
        },
        {
            id: 1,
            name: 'درمانی',
            content: ['روش درمانی اشتباه', 'جاماندن وسیله جراحی در بدن بیمار', 'عمل جراحی/پروسیجر روی عضو اشتباه', 'عمل جراحی/پروسیجر به روش اشتباه', 'عمل جراحی/پروسیجر روی بیمار اشتباه', 'عمل جراحی/پروسیجر در محل اشتباه', 'عدم رعایت دستورالعمل جراحی ایمن', 'عدم توجه به لوله ها و اتصالات'
                , 'روش های ارائه مراقبت و درمان'
                , 'عدم رعایت دستورالعمل ',
                'الزامات کیفی و فنی'
            ]
        },
        {
            id: 2,
            name: 'داروئی',
            content: [

                'بکارنبردن شکل درست دارو'
                , 'دوز نامناسب',
                'داروی اشتباه', 'نحوه مصرف اشتباه', 'بیمار اشتباه', 'زمان اشتباه', 'بی توجهی به حساسیت‌های داروئی', 'تاخیر/حذف/تکرار/ ادامه دارودهی', 'بی توجهی به تلفیق/تداخلات داروئی', 'عدم رعایت دستورالعمل داروهای پرخطر', 'عدم توجه به آماده‌سازی دارو', 'ثبت اشتباه',
                'عدم ثبت',
                'ثبت ناقص',
                'تاخیر در ثبت', 'دوز اشتباه','ندادن دارو به علت فراموشی پرستار','ندادن دارو به علت وارد نشدن از پرونده به کاردکس']
        },
        {
            id: 3,
            name: 'تکنیکی',
            content: ['عدم انطباق اجرا با دستورالعمل یا گایدلاین', 'مهارت ناکافی در کار با تجهیزات', 'مهارت ناکافی در اجرای فرآیندها', 'آموزش ناکافی پرسنل در خصوص کار با تجهیزات', 'خرابی ابزار و تجهیزات', 'ارتباطات غیر موثر بین بخش‌ها/واحدها', 'تکنیک نادرست جراحی']
        },
        {
            id: 4,
            name: 'ثبت و گزارش‏ نویسی',
            content: ['عدم ثبت', 'ثبت ناقص گزارش', ' ناخوانا بودن گزارش ثبتی', 'تاخیر در ثبت', 'عدم گزارش/ثبت دستورات تلفنی', 'ثبت در پرونده/کاردکس/فرم اشتباه', 'گزارش/ثبت اشتباه', 'جوابدهی اشتباه پاراکلینیک']
        },
        {
            id: 5,
            name: 'سیستمیک',
            content: ['نبودن دستورالعمل/خط‌مشی/روش اجرایی یا گایدلاین شفاف', 'روش اجرایی شفاف', 'منابع و امکانات ناکافی', 'دستور مدیریتی اشتباه', 'نظارت ناکافی', 'عدم وجود متولی یا پاسخگو در سازمان', 'ارتباط غیر موثر بین بخش‎ها/ واحدها ', 'عدم وجود متولی یا پاسخگو در پیامد و عوارض روی سازمان']
        }
    ];
    $scope.jobs = ['پزشک', 'کادر پرستاری', 'کادر مامایی', 'کمک بهیار', 'خدمات', 'تاسیسات', 'انتظامات', 'کادر آزمایشگاه', 'کادر دارویی', 'کادر اداری', 'کادر تغذیه', 'کادر اتاق عمل', 'کادر پذیرش', 'کادر تجهیزات پزشکی', 'کادر پاراکلینیک', 'کادر پشتیبانی', 'کادر تصویربرداری', 'منشی', 'سایر'];
    $scope.jobsNames = [];
    $scope.rca = {
        event_type:'',
        charts: [],
        senario: '',
        story_steps: [],
        questions: [],
        staffs: [],
        cdp: [],
        sdp: [],
        title: '',
        error_id: '',
        wherefore: [],
        fish_bones: [],
        define_problem: '',
        causes: [],
        obstacles: [],
        invites: [],
        view: '',
        fish_head: ''
    };
    $scope.headOfFish = false;
    $scope.direction = 1;
    $scope.CurrentStep = 0;
    $scope.filter = {
        etiology: '',
        Ex_from: '',
        Ex_to: '',
        Ex_ward: '',
        eventTitle: '',
        all_to: '',
        all_from: '',
        all_wards: ''
    };
    $scope.session = {
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        current_rule: '',
        members: []

    }
    $scope.escape = [
        'موفق',
        'ناموفق',

    ]
    $scope.excel_outPut_2 = [];
    $scope.lastDataOfCharts = {};
    $scope.finished_repeator = false;
    $scope.total={
        errors:0
    }
    var filterList = [];

    function setDir(step) {
        $scope.direction = step > $scope.CurrentStep ? 1 : 0;

    }

    function getErrorsReports(ward, filter_, from, to) {
        var filter = angular.copy(filter_);
        var reports = angular.copy($scope.reportWardList.map(function (e) {
            var ee = angular.copy(e);
            ee.errors = $filter('filter_by')(ee.errors, 'report_type', $scope.report.report_type);
            return ee;
        }));
        if (from && to) {
            reports.map(function (itm) {
                itm.errors = $filter('datefilter')(itm.errors, 'date_event', from, to);

            })
        }
        if (ward) {
            reports = reports.filter(function (itm) {
                return itm.ward === ward;
            })
        }
        var errors = [];
        if (filter === 'ward3') {
            filter = 'ward';
        }
        if (filter === 'is_self_declaration') {
            filter = 'month';
        }

        reports.map(function (report) {
            if (report.errors) {
                report.errors.map(function (itm) {
                    if (itm[filter] === null)
                        itm[filter] = false;
                    else if (itm[filter] === undefined) {
                        itm[filter] = 0;
                    }
                    if (filter === 'month' ) {

                        itm['month'] = $scope.get_month(itm.date_event)
                        console.log(itm.date_event,itm['month'])
                    }
                })
                errors = errors.concat.apply(errors, report.errors);
            }

        });

        if (filter === 'error_type') {

            if ($scope.filter.etiology && $scope.filter.etiology != 'all') {
                errors = errors.filter(function (itm) {
                    return itm.etiology === $scope.filter.etiology;
                });
            } else {
                filter = 'etiology';
            }
        }
        if (filter === 'event_title2') {
            filter = 'event_title';
            if ($scope.filter.eventTitle && $scope.filter.eventTitle != 'all') {
                errors = errors.filter(function (itm) {
                    return itm.event_title === $scope.filter.eventTitle;
                });
            } else {
                return [];
            }
        }

        var g = $filter('groupBy')(errors, filter);
        if (filter === 'month' ) {
            var gg = {}
            var monthes = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
            monthes.map(function (month) {
                if (g[month]) {
                    gg[month] = angular.copy(g[month]);
                } else {
                    gg[month] = [];
                }
            });
            g = angular.copy(gg);
            console.log(g)
        }
        return {data: g, count: errors.length};
    }

    function setPiechart(ward, filter, from, to) {
        var errorReports = getErrorsReports(ward && ward !== 'all' ? ward : null, filter, from, to);
        var reports = errorReports.data;

        if (filter === 'rca') {

            $scope.pie_chart.data_chart1[0] = reports['true'] ? ((reports['true'].length * 100) / errorReports.count).toFixed(2) : 0;
            $scope.pie_chart.data_chart1[1] = reports['false'] ? ((reports['false'].length * 100) / errorReports.count).toFixed(2) : 0;
        } else if (filter === 'eval') {
            $scope.pie_chart.data_chart2[0] = reports['true'] ? ((reports['true'].length * 100) / errorReports.count).toFixed(2) : 0;
            $scope.pie_chart.data_chart2[1] = reports['false'] ? ((reports['false'].length * 100) / errorReports.count).toFixed(2) : 0;
        } else if (filter === 'shift') {
            $scope.pie_chart.data_chart3[0] = reports['شب'] ? ((reports['شب'].length * 100) / errorReports.count).toFixed(2) : 0;
            $scope.pie_chart.data_chart3[1] = reports['عصر'] ? ((reports['عصر'].length * 100) / errorReports.count).toFixed(2) : 0;
            $scope.pie_chart.data_chart3[2] = reports['صبح'] ? ((reports['صبح'].length * 100) / errorReports.count).toFixed(2) : 0;
        }


    }

    function setBarchart(ward, filter, labels, from, to) {

        var errorReports = getErrorsReports(ward && ward !== 'all' ? ward : null, filter, from, to);
        var reports = errorReports.data;

        var count = errorReports.count;
        $scope.bar_chart.options.detail_of_chart[filter] = angular.copy(reports)
        if (!labels.length) {
            labels = Object.keys(reports);

            labels = labels.map(function (value) {
                if (!value) {
                    value = filter === 'reporter_name' ? 'ناشناس' : 'نامشخص';
                    reports[value] = angular.copy(reports[""]);
                    delete reports[""];
                }
                return value;
            })
             if (filter === 'month') {
                $scope.bar_chart.data_color[filter] = ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC'];
            } else
            if (filter === 'ward3' || filter === 'is_self_declaration') {
                $scope.bar_chart.data_color[filter] = [
                    {
                        color: '#4f81bd',
                        title: 'خوداظهاری'
                    },
                    {
                        color: '#c0504d',
                        title: 'دگراظهاری'
                    }
                ];
            }  else {
                $scope.bar_chart.data_color[filter] = $scope.new_Array(labels.length, $scope.Colors[Math.floor(Math.random() * $scope.Colors.length)]);

            }
            $scope.bar_chart.labels[filter] = angular.copy(labels);


        }
        if (!labels.length) {
            $scope.bar_chart.data_chart[filter] = [];
        } else {
            if (filter === 'ward3' || filter === 'is_self_declaration' ) {
                $scope.bar_chart.data_chart[filter] = [[], []]

            } else {
                $scope.bar_chart.data_chart[filter] = [];
            }
            labels.forEach(function (label, i) {
                if ($scope.bar_chart.data_chart[filter] === undefined) {
                    $scope.bar_chart.data_chart[filter] = [];
                }
                if (filter === 'ward3' || filter === 'is_self_declaration') {
                    if (!$scope.bar_chart.data_chart[filter][0]) {
                        $scope.bar_chart.data_chart[filter][0] = [];
                        $scope.bar_chart.data_chart[filter][1] = [];
                    }
                    if (reports[label]) {
                        var wCount = (reports[label].filter(function (e) {
                            if (filter === 'ward3') {
                                return e.error_ward === label
                            }else if(filter==='is_self_declaration'){
                                return e.is_self_declaration
                            } /*else if (filter === 'month') {
                                return e.eval
                            }*/
                        }).length);

                        $scope.bar_chart.data_chart[filter][0].push(wCount);
                        $scope.bar_chart.data_chart[filter][1].push(reports[label].length - wCount);
                    } else {
                        $scope.bar_chart.data_chart[filter][0].push(0);
                        $scope.bar_chart.data_chart[filter][1].push(0);
                    }

                } else {
                    if (filter === 'event_title2') {
                        if (reports && reports[$scope.filter.eventTitle]) {
                            var _from = moment($rootScope.year + '/' + label + '/' + '01', 'jYYYY/jMMM/jDD');
                            var _to = moment($rootScope.year + '/' + label + '/' + (moment.jDaysInMonth($rootScope.year, i)), 'jYYYY/jMMM/jDD');
                            var a = $filter('datefilter')(reports[$scope.filter.eventTitle], 'date_event', _from.format('YYYY/MM/DD'), _to.format('YYYY/MM/DD'));

                            $scope.bar_chart.data_chart[filter][i] = a.length;
                        }
                        // $scope.bar_chart.data_chart[filter][i]=reports[label]?(reports[label].length).toFixed(2):0
                    } else {
                        $scope.bar_chart.data_chart[filter][i] = reports[label] ? (reports[label].length) : 0
                    }
                }
            });
        }

        if (!$scope.bar_chart.labels[filter]) {
            $scope.bar_chart.labels[filter] = angular.copy(labels);
        }
        if (filter !== 'month' && filter !== 'ward3' && filter !== 'is_self_declaration' && filter !== 'event_title2') {
            var arrayLabel = angular.copy($scope.bar_chart.labels[filter]);
            var arrayData = angular.copy($scope.bar_chart.data_chart[filter]);
            //console.log($scope.bar_chart.labels[filter],$scope.bar_chart.data_chart[filter])
            var arrayOfObj = arrayLabel.map(function (d, i) {
                return {
                    label: d,
                    data: arrayData[i] || 0
                };
            });

            var sortedArrayOfObj = arrayOfObj.sort(function (a, b) {
                return b.data - a.data;
            });

            var newArrayLabel = [];
            var newArrayData = [];
            sortedArrayOfObj.forEach(function (d) {
                newArrayLabel.push(d.label);
                newArrayData.push(d.data);
            });
            //console.log(newArrayLabel,newArrayData)
            $scope.bar_chart.labels[filter] = angular.copy(newArrayLabel);
            $scope.bar_chart.data_chart[filter] = angular.copy(newArrayData);
        }

    }

    function getExcel_outPut(data) {
        var result = [];
        if (data.length) {
            var unordered = $filter('groupBy')(data, 'report_type')
            var obj = {};
            Object.keys(unordered).sort().reverse().forEach(function (key) {
                obj[key] = unordered[key];
            });
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result.push(obj[key].map(function (itm) {
                        var r = {}
                        columns.map(function (column) {
                            if (itm.hasOwnProperty(column.columnid)) {
                                r[column.title] = itm[column.columnid];
                            }
                        });
                        if (key.toString() === 'false') {
                            r["عنوان واقعه"] = itm["event_title"];
                        }
                        return r;
                    }));
                }
            }
        }
        return result;
    }

    function filterErrors(array_of_filter) {
        if (array_of_filter && angular.isArray(array_of_filter)) {
            var obj = {};
            if (array_of_filter.length > 1) {
                obj = array_of_filter.pop(1);
                return $filter(obj.filterName)(filterErrors(array_of_filter), obj.p1, obj.p2, obj.p3, obj.p4);
            } else {
                obj = array_of_filter[0];
                return $filter(obj.filterName)(obj.lastList, obj.p1, obj.p2, obj.p3, obj.p4);
            }
        }

    }

    function saveRollcall(callBack) {
        if (!$scope.active_users) {
            $scope.active_users = [];
        }
        var peresenters = $scope.active_users.filter(function (u) {
            return u.is_peresent;
        });
        if ($scope.rca.invites && $scope.rca.invites.length) {
            $scope.rca.invites[0].presenters = peresenters.map(function (itm) {
                return itm.id;
            })
        }

        var rca = {
            invites: $scope.rca.invites,
            error_id: $scope.selected_Erorr._id,
            save: true
        }
        if ($scope.rca.id) {
            rca.id = $scope.rca.id;
        }
        factory1.postUserApi('/v1/user/hospital/error/rca', JSON.stringify(rca)).then(function (data) {
            callBack()
        });
    }

    function setSummer(data) {
        var total_steps = 0;
        var total_complete_percent = 0;
        var total_in_processeing = 0;
        var total_undone = 0;
        var members = {}
        var presenters = {}
        data.map(function (d) {
            if (d.rca_object && d.rca_object.has_eop && d.rca_object.eop) {
                total_steps += d.rca_object.eop.steps.length;
                total_complete_percent = $scope.operator['+'](total_complete_percent, d.rca_object.eop.complete_percent);
                d.rca_object.eop.steps.map(function (s) {
                    if (s.complete_percent == 0) {
                        total_undone++;
                    } else if (s.complete_percent != 100) {
                        total_in_processeing++;
                    }
                })
            }
            if (d.rca_object && d.rca_object.invites && d.rca_object.invites.length) {
                var invite = d.rca_object.invites[0];
                if (invite.members)
                    invite.members.map(function (m) {
                        if (!members[m]) {
                            members[m] = 0;
                        }
                        members[m]++;
                    })
                if (invite.presenters)
                    invite.presenters.map(function (p) {
                        if (!presenters[p]) {
                            presenters[p] = 0;
                        }

                        presenters[p]++;
                    })
            }
        })
        var members_count = 0;
        var presenters_count = 0;
        Object.keys(members).map(function (m) {
            var present_count = presenters[m] || 0;
            members_count = $scope.operator['+'](members_count, members[m]);
            presenters_count = $scope.operator['+'](presenters_count, present_count);
        });


        $scope.summer = {
            total: data.length,
            total_steps: total_steps,
            middle_present: members_count ? ((presenters_count / members_count) * 100).toFixed(2) : 0,
            realization_steps: total_steps ? (total_complete_percent / total_steps).toFixed(2) : 0,
            total_in_processeing: total_in_processeing,
            total_undone: total_undone

        }
    }

    function setRCA(selected_Erorr) {
        $scope.selected_Erorr = selected_Erorr;
        if ($scope.selected_Erorr.rca_object) {
            var current_rca = $scope.selected_Erorr.rca_object;
            for (var key in $scope.rca) {
                if ($scope.rca.hasOwnProperty(key)) {
                    if (current_rca.hasOwnProperty(key)) {
                        $scope.rca[key] = current_rca[key];
                    } else if (current_rca.hasOwnProperty("rca_" + key)) {
                        $scope.rca[key] = current_rca["rca_" + key];
                    }
                    if (angular.isArray($scope.rca[key])) {
                        if (!$scope.rca[key].length || $scope.rca[key][0] === "" || $scope.rca[key][0] === null) {
                            $scope.rca[key] = [];
                            switch (key.toString()) {
                                case 'sdp':
                                    $scope.addSDP();
                                    break;
                                case 'cdp':
                                    $scope.addCDP();
                                    break;
                                case 'fish_bones':
                                    $scope.addBones();
                                    break;
                                case 'causes':
                                    $scope.addCausess();
                                    break;
                                case 'question':
                                    $scope.addQuestion();
                                    break;
                                case 'staffs':
                                    $scope.addStaff();
                                    break;
                                case 'charts':
                                    $scope.addAnalyses();
                                    break;
                                case 'story_steps':
                                    $scope.addStorySteps();
                                    break;
                                default:
                                    $scope.addObstacles(true);
                                    $scope.addObstacles(false);
                                    break;
                            }
                        } else {
                            if (angular.isString($scope.rca[key][0]) && key !== 'wherefore') {
                                $scope.rca[key] = $scope.rca[key].map(function (itm) {
                                    return {text: itm}
                                })
                            } else {

                                $scope.rca[key] = $scope.rca[key].map(function (itm) {

                                    var obj = itm;
                                    if (obj.date) {
                                        if (angular.isArray(obj.date)) {
                                            obj.jdate = obj.date.map(function (d) {

                                                return {
                                                    text: new Date(d),
                                                    date: $scope.get_date(d)
                                                }
                                            })
                                        } else {
                                            obj.jdate = $scope.get_date(obj.date);
                                            obj.time = new Date(obj.date);
                                        }


                                    }
                                    if (obj.date2) {

                                        obj.jdate2 = $scope.get_date(obj.date2);
                                        obj.time2 = new Date(obj.date2);


                                    }
                                    if (obj.value && angular.isArray(obj.value)) {
                                        obj.value = obj.value.map(function (v) {

                                            return angular.isString(v) ? {text: v} : v;
                                        })
                                    }
                                    if (obj.razors || obj.rca_fish_bone_razors) {
                                        obj.razors = obj.razors ? obj.razors.map(function (r) {
                                            return {text: r.value}
                                        }) : obj.rca_fish_bone_razors.map(function (r) {
                                            return {text: r.value}
                                        })
                                    }
                                    return obj;
                                })
                            }
                        }
                    }
                }
            }
            $scope.rca.id = $scope.selected_Erorr.rca_object._id;

        } else {
            $scope.addQuestion();
            $scope.addStorySteps();
            $scope.addStaff();
            $scope.addStaffDate();
            $scope.addCDP();
            $scope.addSDP();
            $scope.addBones();
            $scope.addAnalyses();
            $scope.addCausess();
        }
    }


    $scope.finished = function () {
        $scope.finished_repeator = true;
    }
    $scope.toggleShowPercent = function (obj) {

        var result = {};
        if ($scope.lastDataOfCharts[obj]) {
            result = $scope.lastDataOfCharts[obj];
            delete $scope.lastDataOfCharts[obj];
        } else {
            var spilted = resolve.call(this, obj);
            $scope.lastDataOfCharts[obj] = spilted;
            /*get Percent of data*/
            result = [];
            if (spilted && spilted.length) {
                if (typeof spilted[0] === 'object') {
                    var total = 0;
                    spilted.map(function (s) {
                        total_ = s.reduce(function (a, b) {
                            return operator['+'](a, b)
                        }, 0);
                        total = operator['+'](total, total_)

                    })
                    spilted.map(function (s) {
                        result.push(s.map(function (data) {
                            return ((data * 100) / total).toFixed(2);
                        }));
                    });

                } else {
                    var total = spilted.reduce(function (a, b) {
                        return operator['+'](a, b)
                    }, 0);
                    result = spilted.map(function (data) {
                        return ((data * 100) / total).toFixed(2);
                    });
                }
            }


        }
        setObject.call(this, obj, result)
        //console.log(spilted,obj,total)
    };
    $scope.toggleHeadOfFish = function () {
        $scope.headOfFish = !$scope.headOfFish;
    }
    $scope.excel_report = function () {
        if ($scope.filter.Ex_from) {
            if ($scope.filter.Ex_to) {

                var params = {
                    st: $scope.get_miladi_date($scope.filter.Ex_from),
                    et: $scope.get_miladi_date($scope.filter.Ex_to)
                }
                if ($scope.filter.Ex_ward && $scope.filter.Ex_ward !== 'all') {
                    params.ward_id = $scope.filter.Ex_ward;
                }
                factory1.postUserApi('/v1/user/hospital/export_full_errors', params).then(function (data) {
                    $scope.download_file($scope.Server_URL + data.url)
                });
            } else {
                $scope.warning('لطفاً تاریخ پایان گزارش را وارد کنید.');
            }
        } else {
            $scope.warning('لطفاً تاریخ شروع گزارش را وارد کنید.');
        }

    }
    $scope.setAllFilter = function () {
        if ($scope.filter.all_wards) {
            $scope.pie_chart.ward[0] = $scope.filter.all_wards;
            $scope.pie_chart.ward[1] = $scope.filter.all_wards;
            $scope.pie_chart.ward[2] = $scope.filter.all_wards;
            $scope.bar_chart.ward.category = $scope.filter.all_wards;
            $scope.bar_chart.ward.cause = $scope.filter.all_wards;
            $scope.bar_chart.ward.job = $scope.filter.all_wards;
            $scope.bar_chart.ward.source = $scope.filter.all_wards;
            $scope.bar_chart.ward.complications = $scope.filter.all_wards;
            $scope.bar_chart.ward.error_type = $scope.filter.all_wards;
            $scope.bar_chart.ward.reporter_name = $scope.filter.all_wards;
            $scope.bar_chart.ward.event_title = $scope.filter.all_wards;
            $scope.bar_chart.ward.event_title2 = $scope.filter.all_wards;
            $scope.bar_chart.ward.month = $scope.filter.all_wards;
            $scope.changeWard('event_title2', $scope.bar_chart.ward.event_title2, 'bar', $scope.bar_chart.labels.month);
            $scope.changeWard('event_title', $scope.bar_chart.ward.event_title, 'bar', []);
            $scope.changeWard('reporter_name', $scope.bar_chart.ward.reporter_name, 'bar', []);
            $scope.changeWard('source', $scope.bar_chart.ward.source, 'bar', []);
            $scope.changeWard('error_type', $scope.bar_chart.ward.error_type, 'bar', $scope.bar_chart.labels.error_type);
            $scope.changeWard('complications', $scope.bar_chart.ward.complications, 'bar', $scope.bar_chart.labels.complications);
            $scope.changeWard('job', $scope.bar_chart.ward.job, 'bar', $scope.bar_chart.labels.job);
            $scope.changeWard('cause', $scope.bar_chart.ward.cause, 'bar', $scope.bar_chart.labels.cause);
            $scope.changeWard('category', $scope.bar_chart.ward.category, 'bar', $scope.bar_chart.labels.category);
            $scope.changeWard('month', $scope.bar_chart.ward.month, 'bar', $scope.bar_chart.labels.month);
            $scope.changeWard('shift', $scope.pie_chart.ward[2], 'pie');
            $scope.changeWard('eval', $scope.pie_chart.ward[1], 'pie');
            $scope.changeWard('rca', $scope.pie_chart.ward[0], 'pie');
        }
        if ($scope.filter.all_from && $scope.filter.all_to) {
            $scope.filter.bar_chart_data_chart_event_title_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_reporter_name_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_error_type_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_complications_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_category_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_job_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_source_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_cause_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_error_ward_from = $scope.filter.all_from;
            $scope.filter.pie_chart_data_chart3_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_ward_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_ward3_from = $scope.filter.all_from;
            $scope.filter.pie_chart_data_chart1_from = $scope.filter.all_from;
            $scope.filter.pie_chart_data_chart2_from = $scope.filter.all_from;
            $scope.filter.bar_chart_data_chart_event_title_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_reporter_name_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_error_type_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_complications_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_job_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_source_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_cause_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_category_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_error_ward_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_ward_to = $scope.filter.all_to;
            $scope.filter.bar_chart_data_chart_ward3_to = $scope.filter.all_to;
            $scope.filter.pie_chart_data_chart3_to = $scope.filter.all_to;
            $scope.filter.pie_chart_data_chart2_to = $scope.filter.all_to;
            $scope.filter.pie_chart_data_chart1_to = $scope.filter.all_to;
            $scope.limitReport('bar_chart.data_chart.event_title', $scope.bar_chart.ward.event_title);
            $scope.limitReport('bar_chart.data_chart.reporter_name', $scope.bar_chart.ward.reporter_name);
            $scope.limitReport('bar_chart.data_chart.error_type', $scope.bar_chart.ward.error_type);
            $scope.limitReport('bar_chart.data_chart.complications', $scope.bar_chart.ward.complications);
            $scope.limitReport('bar_chart.data_chart.job', $scope.bar_chart.ward.job);
            $scope.limitReport('bar_chart.data_chart.source', $scope.bar_chart.ward.source);
            $scope.limitReport('bar_chart.data_chart.cause', $scope.bar_chart.ward.cause);
            $scope.limitReport('bar_chart.data_chart.category', $scope.bar_chart.ward.category)
            $scope.limitReport('bar_chart.data_chart.error_ward');
            $scope.limitReport('bar_chart.data_chart.ward');
            $scope.limitReport('bar_chart.data_chart.ward3');
            $scope.limitReport('pie_chart.data_chart3', $scope.pie_chart.ward[2]);
            $scope.limitReport('pie_chart.data_chart2', $scope.pie_chart.ward[1]);
            $scope.limitReport('pie_chart.data_chart1', $scope.pie_chart.ward[0]);
        }

        var r = angular.copy($scope.report.report_type);
        $scope.report.report_type = null;
        $timeout(function () {

            $scope.report.report_type = angular.copy(r);


        }, 100)
    }
    $scope.etiologyChange = function () {
        if ($scope.filter.etiology && $scope.filter.etiology != 'all') {
            $scope.bar_chart.labels.error_type = $scope.eteology.filter(function (itm) {
                return itm.name === $scope.filter.etiology;
            })[0].content;
            $scope.bar_chart.data_color5 = $scope.new_Array($scope.bar_chart.labels.error_type.length, '#ae7315');
            /*$scope.bar_chart.labels.error_type*/
            setBarchart($scope.onlyThisWard || $scope.bar_chart.ward.error_type, 'error_type', []);
        } else {
            setBarchart($scope.onlyThisWard || $scope.bar_chart.ward.error_type, 'error_type', []);

        }
    };
    $scope.eventTitleChange = function () {
        if ($scope.filter.eventTitle && $scope.filter.eventTitle != 'all') {

            $scope.bar_chart.data_color5 = $scope.new_Array($scope.bar_chart.labels.error_type.length, '#ae7315');
            setBarchart($scope.bar_chart.ward.event_title2, 'event_title2', $scope.bar_chart.labels.month);
        } else {
            setBarchart($scope.bar_chart.ward.event_title2, 'event_title2', []);

        }
    };
    $scope.changeWard = function (filter, ward, type, labels) {

        if (type === 'pie') {
            setPiechart(ward, filter);
        } else if (type === 'bar') {
            if (filter === 'job') {
                labels = labels.map(function (j) {
                    return j.name;
                })
            }
            setBarchart(ward, filter, labels);
        }
    };
    $scope.reportFn = function (row) {
        $scope.report.report_type = null;
        $scope.onlyThisWard = null;
        $scope.jobsNames = angular.copy($scope.jobs);

        $scope.bar_chart.data_color1 = $scope.new_Array($scope.allErrorCat.length, '#8dc51a');

        $scope.bar_chart.data_color3 = $scope.new_Array($scope.jobs.length, '#d6c40f');
        $scope.bar_chart.data_color4 = $scope.new_Array($scope.allComplications.length, '#12b6a4');
        if (row) {
            $scope.pie_chart.ward = $scope.new_Array(8, row);
            $scope.onlyThisWard = row;
        } else {
            $scope.pie_chart.ward = $scope.new_Array(8, '');
        }

        if($scope.hospital_id===11){
            $scope.report.report_type=true;
            $scope.showReport();
        }
        $scope.template.url = 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors/chart_report.htm';
        $scope.is_parent = false;
    };
    $scope.showReport = function () {
        delete $scope.bar_chart.labels.cause;
        $scope.total.errors=0;
        $scope.reportWardList.map(function (e) {
           if(e.errors){
               var errors=$filter('filter_by')(e.errors, 'report_type', $scope.report.report_type);
               if($scope.onlyThisWard){
                   $scope.total.errors+=$filter('filter_by')(errors, 'ward', $scope.onlyThisWard).length;
               }else{
                   $scope.total.errors+=errors.length;
               }
           }
        })
        setPiechart($scope.onlyThisWard, 'rca');
        setPiechart($scope.onlyThisWard, 'eval');
        setPiechart($scope.onlyThisWard, 'shift');
        setBarchart($scope.onlyThisWard, 'category', $scope.allErrorCat);
        setBarchart($scope.onlyThisWard, 'reporter_name', []);
        setBarchart($scope.onlyThisWard, 'error_type', []);
        setBarchart($scope.onlyThisWard, 'ward', []);
        setBarchart($scope.onlyThisWard, 'ward3', []);
        setBarchart($scope.onlyThisWard, 'cause', $scope.report.report_type ? $scope.allCauses : $scope.allCauses2);
        setBarchart($scope.onlyThisWard, 'job', $scope.jobs);
        setBarchart($scope.onlyThisWard, 'source', []);
        setBarchart($scope.onlyThisWard, 'complications', $scope.allComplications);
        setBarchart($scope.onlyThisWard, 'event_title', []);
        setBarchart($scope.onlyThisWard, 'error_ward', []);
        setBarchart($scope.onlyThisWard, 'month', []);
        setBarchart($scope.onlyThisWard, 'is_self_declaration',$scope.bar_chart.labels.month);
        $scope.bar_chart.data_color2 = $scope.new_Array($scope.report.report_type ? $scope.allCauses.length : $scope.allCauses2.length, '#c5460a');
    }
    $scope.changeShifyFilter = function (s) {
        var i = $scope.search_data.shift.indexOf(s);
        if (i >= 0) {
            $scope.search_data.shift.splice(i, 1);
        } else {
            $scope.search_data.shift.push(s);
        }
        $scope.filter_Errors('filter_by_array', 'shift', $scope.search_data.shift, $scope.shifts);
    };
    $scope.eghdam_this = function (row) {
        $scope.allErrors = row.errors;
        $scope.template.url = 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors/eghdam.htm';
        $scope.is_parent = false;
    };
    $scope.changeToggleActive = function (e) {
        var i = $scope.toggle_active.indexOf(e);
        if (i !== -1) {
            $scope.toggle_active.splice(i, 1);
        } else {
            $scope.toggle_active.push(e);
        }
    };
    $scope.detail_this = function (item) {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
        $scope.current_ward = item.ward;
        $scope.closeDetail();
        filterList = [];
        $scope.filtredErrors_copy = [];
        $scope.allErrors = angular.copy(item.errors).map(function (err) {
            err.seen = !moment(err.created_at).isSame(moment(err.updated_at), 'minute');
            return err;
        });
        $scope.allErrors_copy = angular.copy(item.errors);
        $scope.is_parent = false;
        $scope.RCAStarted = false;
        $scope.reset_params($scope.search_data, {errors: true, events: true});

        $scope.search_data.shift = ['صبح', 'عصر', 'شب'];
        if ('/ControllingMedicalErrors/RCA' === $location.path()) {
            $scope.template.url = 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors/details_RCA.htm';
        } else {
            $scope.template.url = 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors/details.htm';
        }
    };
    $scope.filter_Errors = function (filterName, p1, p2, p3, p4) {
        var error_object = {
            lastList: $scope.allErrors,
            filterName: filterName,
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4
        };
        var hasThisObject = false;
        var lastList = [];
        var index = -1;
        filterList.map(function (itm, i) {
            if (itm.filterName === filterName && itm.p1 === p1) {
                hasThisObject = true;
                lastList = itm.lastList;
                index = i;
            }
        });
        if (hasThisObject) {
            //$scope.allErrors=angular.copy(lastList);
            filterList.splice(index, 1);
            error_object.lastList = lastList;
        }
        filterList.push(error_object);
        $scope.allErrors = filterErrors(angular.copy(filterList));

    };
    $scope.setEtogoly = function (etiology) {

        if ((!etiology || etiology === '') && $scope.showFinalInfoReport) {
            etiology = $scope.showFinalInfoReport.etiology;
        }
        var e = $scope.eteology.filter(function (itm) {
            return itm.name === etiology;
        })[0];
        if (e)
            $scope.errorKind = e.content;
    };
    $scope.send_to_committes = function (row) {
        $scope.reset_params($scope.related_committe);
        if (row.related_committe)
            $scope.related_committe = row.related_committe;
        var index = $scope.allErrors.indexOf(row);
        $scope.id_Error = row._id;
        $scope.send_to_committes_modal = $scope.open_modal('lg', 'send_to_committess.html', null, null, 'blue_modal', $scope, true);
        $scope.send_to_committes_modal.result.then(function (r) {
            if (r) {
                $scope.allErrors[index].related_committe = r;
            }
        })
    };
    $scope.submitFinal = function () {
        delete $scope.showFinalInfoReport.submitted_by;
        $scope.showFinalInfoReport.seen = true;
        factory1.putUserApi('/v1/user/hospital/error_control', JSON.stringify($scope.showFinalInfoReport)).then(function (data) {
            $scope.success_alert('اطلاعات خطای گزارش شده با موفقیت به روزرسانی شد.', 'ثبت اطلاعات خطا');
            $scope.closeDetail();
            data.seen = true;

            $scope.reportWardList.map(function (itm) {
                itm.errors.map(function (e) {
                    if (e._id === data._id && itm.notify) {
                        itm.notify--;
                    }

                })
            });
            $scope.allErrors[$scope.allErrors_index] = data;
            filterList.map(function (itm) {
                if (itm.lastList && itm.lastList.length) {
                    itm.lastList = itm.lastList.map(function (l) {
                        if (l._id = data._id) {
                            l = data;
                        }
                        return l;
                    })
                }

            });
        });
    };
    $scope.showFinalInfoReportBtn = function (row) {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
        $scope.allErrors_index = $scope.allErrors.indexOf(row);

        $scope.showFinalInfoReport = angular.copy(row);
        $scope.setEtogoly();

    };
    $scope.closeDetail = function () {
        $scope.showFinalInfoReport = null;
    };
    $scope.send_to_selected_committe = function () {
        if ($scope.related_committe.subject.length) {
            if ($scope.related_committe.committees.length || $scope.related_committe.users.length) {
                var params = angular.copy($scope.related_committe);
                params.error_id = $scope.id_Error;
                params.error_type = "error_controls";
                factory1.putUserApi('/v1/user/hospital/error_control/send_to_committee', JSON.stringify(params)).then(function (data) {
                    $scope.success_alert('خطای گزارش شده با موفقیت به کمیته های انتخابی ارسال شد.', 'ارسال به کمیته');
                    $scope.send_to_committes_modal.close(angular.copy(data));
                });
            } else {
                $scope.warning('لطفاً کمیته های(افراد) مورد نظر را انتخاب کنید.');
            }
        } else {
            $scope.warning('لطفاً موضوع را وارد کنید.');
        }

    };
    $scope.StartRCA = function (row) {
        $scope.reset_params($scope.rca);
        // $scope.indexOfinvites = $scope.rca.invites.indexOf(row);
        if (row.rca_object && row.rca_object.invites.length) {
            var invites = row.rca_object.invites[0];
            $scope.active_users = invites.members.map(function (m) {
                var u = angular.copy($scope.get_user(m, $scope.users));
                u.is_peresent = invites.presenters && invites.presenters.indexOf(m) !== -1;
                return u;
            });
        }

        $scope.CurrentStep = 0;
        $scope.RCAStarted = true;


        setRCA(angular.copy(row));
        if($scope.rca){
            if(!row.error_type && !$scope.rca.event_type){
                $scope.rca.event_type=row.event_title;
            }
        }
        $scope.indexOfSelectedError = $scope.allErrors.indexOf(row);


    };
    $scope.nextStep = function () {
        $scope.headOfFish = false;
        var step = angular.copy($scope.CurrentStep);
        $scope.CurrentStep++;
        $scope.rca.view = '';
        if (!$scope.rca.fish_head) {
            $scope.rca.fish_head = angular.copy($scope.rca.define_problem);
        }
        setDir(step);
    };
    $scope.previousStep = function () {
        $scope.rca.view = '';
        $scope.headOfFish = false;
        if ($scope.CurrentStep) {
            var step = angular.copy($scope.CurrentStep);
            $scope.CurrentStep--;
            setDir(step);
        } else {
            $scope.RCAStarted = false;
        }

    };
    $scope.addQuestion = function () {
        $scope.rca.questions.push({jdate: '', time: '', jdate2: '', time2: '', question: $scope.new_Array(4, '')});
    };
    $scope.deleteQuestion = function (row) {
        $scope.question('آیا از حذف جواب های مورد نظر مطمئن هستید؟', 'حذف جواب ها');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.questions.splice($scope.rca.questions.indexOf(row), 1);
            }
        });
    };
    $scope.deleteStaffDate = function (row) {
        $scope.question('آیا از حذف ستون مورد نظر مطمئن هستید؟', 'حذف ستون');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var i = $scope.rca.staffs[0].jdate.indexOf(row);
                $scope.rca.staffs.map(function (staff) {
                    staff.jdate.splice(i, 1);
                    staff.date.splice(i, 1);
                    staff.value.splice(i, 1);
                })

            }
        });
    };
    $scope.deleteStaff = function (row) {
        $scope.question('آیا از حذف شخص مورد نظر مطمئن هستید؟', 'حذف کارکنان');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.staffs.splice($scope.rca.staffs.indexOf(row), 1);
            }
        });
    };
    $scope.deleteFishBones = function (row) {
        $scope.question('آیا از حذف استخوان مورد نظر مطمئن هستید؟', 'حذف استخوان اصلی');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.fish_bones.splice($scope.rca.fish_bones.indexOf(row), 1);
            }
        });
    };
    $scope.deleteRazors = function (row, razor) {
        $scope.question('آیا از حذف استخوان مورد نظر مطمئن هستید؟', 'حذف استخوان اصلی');
        $scope.q_result.result.then(function (r) {
            if (r) {
                var i = $scope.rca.fish_bones.indexOf(row);
                $scope.rca.fish_bones[i].razors.splice($scope.rca.fish_bones[i].razors.indexOf(razor), 1);
            }
        });
    };
    $scope.deleteCausess = function (row) {
        $scope.question('آیا از حذف علت ریشه ای مورد نظر مطمئن هستید؟', 'حذف علل ریشه ای');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.causes.splice($scope.rca.causes.indexOf(row), 1);
            }
        });
    };
    $scope.deleteAnalyses = function (row) {
        $scope.question('آیا از حذف تحلیل مورد نظر مطمئن هستید؟', 'حذف تحلیل تغییر');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.charts.splice($scope.rca.charts.indexOf(row), 1);
            }
        });
    };
    $scope.addCausess = function () {
        $scope.rca.causes.push({value: '', description: ''})
    };
    $scope.addStaff = function () {
        var len = $scope.rca.staffs.length ? $scope.rca.staffs[0].jdate.length : 1;

        $scope.rca.staffs.push({
            jdate: $scope.new_Array(len, {text: '', date: ''}),
            staff: '',
            value: $scope.new_Array(len, {text: ''}),
            date: $scope.new_Array(len, {text: ''})
        });

    };
    $scope.addStaffDate = function () {
        $scope.rca.staffs.map(function (staf) {
            staf.jdate.push({text: ''});
            staf.value.push({text: ''});
            staf.date.push({text: ''});
        });
    };
    $scope.addCDP = function () {
        $scope.rca.cdp.push({text: ''});
    };
    $scope.addAnalyses = function () {
        $scope.rca.charts.push({
            normal_procedure: '',
            do_procedure: '',
            is_changed: false,
            description: '',
        });
    };
    $scope.addSDP = function () {
        $scope.rca.sdp.push({text: ''});
    };
    $scope.deleteStorySteps = function (row, index) {
        $scope.question('آیا از حذف توصیف داستان مورد نظر مطمئن هستید؟', 'حذف توصیف داستان');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.story_steps.splice(index, 1);
            }
        });
    };
    $scope.addStorySteps = function () {
        $scope.rca.story_steps.push({jdate: '', description: '', time: ''})
    };
    $scope.addBones = function () {
        var l = $scope.rca.fish_bones.length ? $scope.rca.fish_bones[0].razors.length : 1;
        var arr = $scope.new_Array(l, {text: ''});
        $scope.rca.fish_bones.push({value: '', razors: arr})
    };
    $scope.addRazor = function (index) {
        $scope.rca.fish_bones.map(function (itm, i) {
            if (index === i)
                itm.razors.push({text: ''});
        })
    };
    $scope.delete_rca_obstacles = function (row) {
        $scope.question('آیا از حذف تحلیل مانع مورد نظر مطمئن هستید؟', 'حذف تحلیل مانع');
        $scope.q_result.result.then(function (r) {
            if (r) {
                $scope.rca.obstacles.splice($scope.rca.obstacles.indexOf(row), 1);
            }
        });
    };
    $scope.addObstacles = function (is_past) {
        $scope.rca.obstacles.push({
            is_past: is_past,
            available_problems: '',
            is_worked: false,
            why_worked: '',
            dangers: '',
            control_available_problems: '',
            current_effectiveness: '',
            suggest_effectiveness: '',
            current_important_safe: '',
            suggest_important_safe: '',
            other_controls: '',
            cost: '',
            responsible_person: ''
        })
    };
    $scope.saveRCA = function (save) {
        saveRollcall(function () {
            var param = {
                senario: $scope.rca.senario,
                story_steps: $scope.rca.story_steps.map(function (itm) {
                    if (itm.jdate) {
                        itm.date = itm.jdate ? $scope.get_miladi_date(itm.jdate, itm.time ? itm.time.getHours() + ':' + itm.time.getMinutes() + ':00' : null) : "";
                    }
                    return itm;
                }),
                questions: $scope.rca.questions.map(function (q) {
                    return {
                        date: q.jdate ? $scope.get_miladi_date(q.jdate, q.time ? q.time.getHours() + ':' + q.time.getMinutes() + ':00' : null) : "",
                        date2: q.jdate2 ? $scope.get_miladi_date(q.jdate2, q.time2 ? q.time2.getHours() + ':' + q.time2.getMinutes() + ':00' : null) : "",
                        question: q.question
                    }
                }),
                staffs: $scope.rca.staffs.map(function (s) {
                    return {
                        date: $scope.rca.staffs[0].jdate.map(function (d) {
                            return d.date ? $scope.get_miladi_date(d.date, d.text ? d.text.getHours() + ':' + d.text.getMinutes() + ':00' : null) : "";
                        }),
                        staff: s.staff,
                        value: s.value.map(function (v) {
                            return v.text || '';
                        })
                    }
                }),
                cdp: $scope.rca.cdp ? $scope.rca.cdp.map(function (itm) {
                    return itm.text;
                }) : [],
                sdp: $scope.rca.sdp ? $scope.rca.sdp.map(function (itm) {
                    return itm.text;
                }) : [],
                title: $scope.rca.title,
                obstacles: $scope.rca.obstacles.filter(function (itm) {
                    return itm.is_past ? itm.available_problems.length : itm.dangers.length;
                }),
                error_id: $scope.selected_Erorr._id,
                wherefore: $scope.rca.wherefore?(angular.isArray($scope.rca.wherefore) ? $scope.rca.wherefore : Object.keys($scope.rca.wherefore).map(function (w) {
                    return $scope.rca.wherefore[w];
                })):[],
                fish_bones: $scope.rca.fish_bones.map(function (f) {
                    return {
                        value: f.value, razors: f.razors ? f.razors.map(function (r) {
                            return r.text;
                        }) : []
                    }
                }),
                define_problem: $scope.rca.define_problem,
                causes: $scope.rca.causes,
                charts: $scope.rca.charts,
                save: save
            }
            if ($scope.rca.id) {
                param.id = $scope.rca.id;
            }
            factory1.postUserApi('/v1/user/hospital/error/rca', JSON.stringify(param)).then(function (data) {
                $scope.success_alert('RCA برای خطای مورد نظر ثبت شد.', 'ثبت RCA');
                $scope.RCAStarted = false;
                $scope.allErrors[$scope.indexOfSelectedError].rca_object = data;
                if ($scope.rca.id) {
                    delete $scope.rca.id;
                }

            })
            console.log(param);
        })

    };
    $scope.limitEx = function () {
        $scope.excel_outPut = [];
        if ($scope.filter.Ex_from && $scope.filter.Ex_to) {
            $scope.reportWardList.map(function (itm) {
                $scope.excel_outPut = [].concat($scope.excel_outPut, $filter('datefilter')(itm.errors, 'date_event', $scope.filter.Ex_from, $scope.filter.Ex_to));
            });
        } else {
            $scope.reportWardList.map(function (itm) {
                itm.errors.map(function (e) {
                    $scope.excel_outPut.push(e);
                })
            })
        }
        $scope.excel_outPut = $filter('orderObjectBy')($scope.excel_outPut, 'date_event');
        $scope.excel_outPut_2 = getExcel_outPut($scope.excel_outPut);

    };
    $scope.limitReport = function (chartName, ward) {
        var c = chartName.replace(/\./g, '_');
        var from = $scope.filter[c + "_from"];
        var to = $scope.filter[c + "_to"];
        if (from && to) {
            if (chartName.indexOf('pie_chart') >= 0) {
                if (chartName.indexOf('data_chart1') !== -1) {
                    setPiechart($scope.onlyThisWard || ward, 'rca', from, to);
                } else if (chartName.indexOf('data_chart2') !== -1) {
                    setPiechart($scope.onlyThisWard || ward, 'eval', from, to);
                } else {
                    setPiechart($scope.onlyThisWard || ward, 'shift', from, to);
                }
            } else {

                if (chartName.indexOf('category') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'category', $scope.allErrorCat, from, to);
                } else if (chartName.indexOf('cause') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'cause', $scope.report.report_type ? $scope.allCauses : $scope.allCauses2, from, to);
                } else if (chartName.indexOf('job') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'job', $scope.jobs, from, to);
                }  else if (chartName.indexOf('source') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'source', [], from, to);
                } else if (chartName.indexOf('complications') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'complications', $scope.allComplications, from, to);
                } else if (chartName.indexOf('event_title') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'event_title', [], from, to);
                } else if (chartName.indexOf('event_title2') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'event_title2', $scope.bar_chart.labels.month, from, to);
                } else if (chartName.indexOf('reporter_name') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'reporter_name', [], from, to);
                } else if (chartName.indexOf('ward3') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'ward3', [], from, to);
                    return false;
                } else if (chartName.indexOf('error_ward') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'error_ward', [], from, to);
                    return false;
                } else if (chartName.indexOf('ward') !== -1) {
                    setBarchart($scope.onlyThisWard || ward, 'ward', [], from, to);
                } else {
                    setBarchart($scope.onlyThisWard || ward, 'error_type', $scope.bar_chart.labels.error_type, from, to);
                }
            }


        } else if (!from && !to) {
            $scope.reportFn($scope.onlyThisWard || ward);
            $scope.showReport();
        }

    }
    $scope.inviteMember = function (row) {
        $scope.session.start_time = "";
        $scope.session.end_time = "";
        $scope.reset_params($scope.session);
        $scope.session.error_id = row._id;
        setRCA(angular.copy(row));
        $scope.indexOfSelectedError = $scope.allErrors.indexOf(row);
        $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal', $scope, true);
    };
    $scope.submit_sessions = function () {
        var params = angular.copy($scope.session);
        params.date = $scope.get_miladi_date(params.date);
        params.start_time = params.start_time.toString().substring(16, 21);
        params.end_time = params.end_time.toString().substring(16, 21);

        if (!$scope.rca.invites) {
            $scope.rca.invites = [];
        }
        $scope.rca.invites.push(params)
        var rca = {
            invites: $scope.rca.invites,
            error_id: $scope.selected_Erorr._id,
            save: true
        }
        if ($scope.rca.id) {
            rca.id = $scope.rca.id;
        }
        factory1.postUserApi('/v1/user/hospital/error/rca', JSON.stringify(rca)).then(function (data) {
            $scope.success_alert('دعوتنامه به اشخاص مورد نظر ارسال شد.', 'ارسال دعوتنامه');
            $scope.close_modal();
            $scope.rca.invites = data.invites;
            $scope.allErrors[$scope.indexOfSelectedError].rca_object = data;
        });
    }
    $scope.selectMembers = function () {
        var arr = [];
        arr = angular.copy($scope.users);
        var partners = angular.copy($scope.session.members);
        if (partners) {
            partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    partners.forEach(function (p) {
                        if (obj.id == p) {

                            itm.users[itm.users.indexOf(obj)].checked = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                $scope.session.members = r.map(function (itm) {
                    return itm.id;
                });
            }
        });
    };
    $scope.uploadDocs=function(data){
        $scope.file = {
            src: ''
        };
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);
    }
    $scope.uploadFiles = function () {
        factory1.upload_file($scope, $scope.file.src, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, '/v1/user/hospital/error_control/file?file_name=' + $scope.file.src.filename + '&id=' + $scope.showFinalInfoReport._id, null).then(function (data) {

            if (!$scope.showFinalInfoReport.files) {
                $scope.showFinalInfoReport.files = []
            }
            $scope.showFinalInfoReport.files.push(data);
            $scope.allErrors[$scope.allErrors_index] = angular.copy($scope.showFinalInfoReport);
            filterList.map(function (itm) {
                if (itm.lastList && itm.lastList.length) {
                    itm.lastList = itm.lastList.map(function (l) {
                        if (l._id = $scope.showFinalInfoReport._id) {
                            l = angular.copy($scope.showFinalInfoReport);
                        }
                        return l;
                    })
                }

            });
        });
    };
    $scope.deleteFile = function (row) {
        $scope.question('آیا از حذف پیوست مورد نظر مطمئن هستید؟', 'حذف پیوست').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/error_control/file/' + row.id).then(function (data) {
                    $scope.showFinalInfoReport.files.splice($scope.showFinalInfoReport.files.indexOf(row), 1);
                    $scope.success_alert('فایل با موفقیت حذف شد!', 'حذف پیوست');
                    $scope.allErrors[$scope.allErrors_index] = angular.copy($scope.showFinalInfoReport);
                    filterList.map(function (itm) {
                        if (itm.lastList && itm.lastList.length) {
                            itm.lastList = itm.lastList.map(function (l) {
                                if (l._id = $scope.showFinalInfoReport._id) {
                                    l = angular.copy($scope.showFinalInfoReport);
                                }
                                return l;
                            })
                        }

                    });
                })

            }
        });
    }
    var url = '';
    if ('/ControllingMedicalErrors/RCA' === $location.path()) {
        url = '/v1/user/hospital/errors_with_rca';
    } else if ('/ControllingMedicalErrors/Learn_and_Share' === $location.path()) {
        url = '/v1/user/hospital/errors_shared';
    } else {
        url = '/v1/user/hospital/error_controls';
    }
    factory1.getUserApi(url).then(function (response, status) {
        $scope.excel_outPut = [];
        $scope.reportWardList = response;
        $scope.reportWardList.map(function (itm) {
            itm.notify = 0;
            if (itm.errors) {
                itm.errors.map(function (e) {
                    if (!e.seen) {
                        itm.notify++;
                    }
                    // e.seen = true;
                    // if (moment(e.created_at).isSame(moment(e.updated_at), 'minute')) {
                    //     itm.notify++;
                    //     e.seen = false;
                    // }
                    e.shift = e.shift.replace(/\s/g, '');
                    e.eval = e.eval === null ? false : e.eval;
                    e.rca = e.rca === null ? false : e.rca;
                    e.Jdate_event = $scope.get_date(e.date_event);
                    $scope.excel_outPut.push(e);
                })
            } else {
                // itm.seen = true;
                // if (moment(itm.created_at).isSame(moment(itm.updated_at), 'minute')) {

                //     itm.seen = false;
                // }
                itm.shift = itm.shift.replace(/\s/g, '');
                itm.eval = itm.eval === null ? false : itm.eval;
                itm.rca = itm.rca === null ? false : itm.rca;
                itm.Jdate_event = $scope.get_date(itm.date_event);
                $scope.excel_outPut.push(itm);
            }

        })
        $scope.excel_outPut_2 = getExcel_outPut($scope.excel_outPut);
        if ('/ControllingMedicalErrors/RCA' === $location.path()) {
            $scope.allErrors = response;
            setSummer(response);
        }
    });
    factory1.get_event_location().then(function (data) {

        $scope.locations = data;
    });

});

app.controller('RCA_Report_Ctrl', function ($scope, $rootScope, factory1, $filter) {

    var options = {
        maintainAspectRatio: false,
        events: false,
        hover: {
            animationDuration: 0
        },
        tooltips: {
            enabled: false,
            titleFontSize: 14,
            bodyFontSize: 15
        },
        animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = dataset.data[index];
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    });
                });
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 50,
                bottom: 10
            }
        },
        scaleShowGridLines: false,
        elements: {line: {tension: 0, fill: false}}
        , scales: {
            xAxes: [{
                ticks: {
                    fontSize: 10,
                    beginAtZero: false,
                    autoSkip: false
                }
            }],
            yAxes: [{
                ticks: {
                    fontSize: 9,
                    suggestedMin: 31,
                    min: 0,
                    beginAtZero: false
                },
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontSize: 11
                }
            }]

        }
    };
    $scope.charts = {
        data_set: [],
        options1: angular.copy(options),
        options2: angular.copy(options)
        ,
        series: [],
        data_chart1: [],
        data_chart2: [],
        labels_chart1: [],
        labels_chart2: [],
        filter: {},
        colors: [],
        wards: {},
        start_date1: '',
        end_date1: '',
        selectedWard: '',
        summer: {
            done: 0,
            in_proccess: 0,
            not_done: 0,
            realization_steps: 0
        },
        clickHandler: function (e, data) {

            if (e && e[0]) {
                $scope.charts.selectedWard = e[0]._model.label;
                var summer = {
                    done: 0,
                    in_proccess: 0,
                    not_done: 0,
                    realization_steps: 0
                };
                var sum = 0;
                $scope.charts.wards[$scope.charts.selectedWard].map(function (s) {
                    if (s.complete_percent === 100) {
                        summer.done++;
                    } else if (s.complete_percent === 0) {
                        summer.not_done++;
                    } else {
                        summer.in_proccess++;
                    }
                    sum += s.complete_percent;
                })
                summer.realization_steps = (sum / $scope.charts.wards[$scope.charts.selectedWard].length).toFixed(2);
                $scope.charts.summer = summer;
                $scope.open_modal('lg', 'detail_chart1.html', null, null, 'blue_modal full_width', $scope);
            }

        },
        setChart1: function (data) {
            var g = $filter('groupBy')(data, 'error_ward');
            this.wards = {};
            var self = this;
            Object.keys(g).map(function (key) {
                if (Array.isArray(g[key])) {
                    g[key].map(function (e) {
                        if (!self.wards[key]) {
                            self.wards[key] = [];
                        }
                        if (e.rca_object && e.rca_object.has_eop) {
                            if (e.rca_object.eop.steps.length) {

                                self.wards[key] = self.wards[key].concat(e.rca_object.eop.steps);
                            }
                        }
                    })
                }
            });

            this.labels_chart1 = [];
            this.data_chart1 = [];
            this.data_chart1 = Object.keys(self.wards).map(function (w) {
                self.labels_chart1.push(w);
                return self.wards[w].length;
            })
        },
        setChart2: function (data) {
            var self = this;
            var users = {};
            data.map(function (e) {
                if (e.rca_object && e.rca_object.invites && e.rca_object.invites[0]) {
                    e.rca_object.invites[0].members.map(function (m) {

                        if (!users[m]) {
                            users[m] = {invite: 0, present: 0};
                        }
                        users[m]['invite']++;
                        if (e.rca_object.invites[0].presenters && e.rca_object.invites[0].presenters.indexOf(m) >= 0) {
                            users[m]['present']++;
                        }


                    })
                }
            })
            self.data_chart2 = [];
            this.labels_chart2 = Object.keys(users).map(function (u) {
                var d = users[u]['present'] / users[u]['invite'];
                d *= 100;
                self.data_chart2.push(d.toFixed(2))
                return $scope.get_person(u, $scope.all_users);
            })
        }

    }
    $scope.charts.options1.scales.yAxes[0].scaleLabel.labelString = 'تعداد مصوبات';
    $scope.charts.options2.scales.yAxes[0].scaleLabel.labelString = 'درصد حضور';
    $scope.show_this_actions = function (row) {

        if (row.actions && row.actions.length) {
            var msg = '';
            $scope.actions_for_this = row.actions.filter(function (itm) {
                if (itm.action_description.length) {
                    /*    msg= msg+'-'+itm.action_description+' ('+ $scope.get_date(itm.updated_at,'full_date') +') '+'<button data-ng-if="itm.files"  class="btn btn-link" data-ng-click="openFiles(itm)"> <i class="icon-font icon-peyvast"></i></button><br>';*/
                    return true;
                }
            });
            if ($scope.actions_for_this.length) {
                $scope.open_modal('md', 'actions.html', null, null, 'blue_modal', $scope);
            } else {
                $scope.warning('برای این برنامه اقداماتی ثبت نشده است.');
            }

        } else {
            $scope.warning('برای این برنامه اقداماتی ثبت نشده است.');
        }

    };
    factory1.getUserApi('/v1/user/hospital/errors_with_rca').then(function (data) {
        $scope.rca_data = data;
        $scope.charts.setChart1(data);
        $scope.charts.setChart2(data);
    });
})

app.controller('FMEA_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $filter, $rootScope) {
    $scope.bar_chart = {
        options: {
            maintainAspectRatio: false,
            events: false,
            hover: {
                animationDuration: 0
            },
            tooltips: {
                enabled: false,
                titleFontSize: 14,
                bodyFontSize: 15
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 50,
                    bottom: 10
                }
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    }
                }]

            },

        },
        series: ['فرآیندی', 'زیرساختی'],
        data_chart1: [],
        data_set: [{
            borderWidth: 0,
            backgroundColor: '#0fa707'
        }, {
            borderWidth: 0,
            backgroundColor: '#9a59b5'
        }]
    };
    $scope.pie_chart = {
        labels_chart: ['عوامل فرآیندی', 'عوامل زیرساختی'],
        colors_chart: ['#0fa707', '#9a59b5'],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        },
        data_chart: []
    };
    $scope.allThreadTypes = ['زیرساختی - کمبود منابع انسانی',
        'زیرساختی - ضعف عملکردی منابع انسانی',
        'زیرساختی - کمبود تجهیزات',
        'زیرساختی - نقص فنی تجهیزات',
        'فرآیندی - عدم رعایت دستورالعمل‌های روش‌های مراقبت و درمان',
        'فرآیندی - الزامات کیفی و فنی روش‌های مراقبت و درمان'];
    $scope.template = {url: ''};
    $scope.filter = {
        ThreadType: '',
        user: '', DateFrom: '', DateTo: '',
        keyword: '',
        source: '',
        committe: '',
        for_who: ''
    };
    $scope.related_committe = {
        subject: '',
        body: '',
        committees: [],
        users: []
    };
    $scope.sources = [
        'گزارش کارکنان',
        'بازدیدهای میدانی ایمنی بیمار',
        'بازدیدهای مدیریتی ایمنی بیمار',
        'شکایات بیمار',
        'لیست کمیته ها',
        'سایر موارد'
    ];
    $scope.is_parent = true;
    $scope.active_view = -1;
    $scope.reset_steps();
    $scope.is_parent = true;
    $scope.FMEAs = [];
    $scope.className = ['violet-bg', 'orange_bg', 'blue_light_list_bg', 'red_bg', 'green_bg', 'pink_shadow_bg'];
    $scope.className2 = ['light_violet-bg', 'light_orange2_bg', 'blue-light_bg', 'light_red_bg', 'light_green2_rgb_bg', 'light_pink_bg'];
    $scope.excel_filename = 'ارزیابی پیشگیرانه خطاهای پزشکی ' + $rootScope.year;
    var excelStyleInstans = {
        sheetid: 'FMEA',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {
                columnid: 'ward', title: 'نام بخش', width: 300, cell: {
                    value: function (value) {
                        return value ? $scope.get_ward_name(value, $scope.wards) : '';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {columnid: 'threat_factor', title: 'شرح موضوع', width: 300},
            {
                columnid: 'created_at', title: 'تاریخ پیشنهاد', width: 300, cell: {
                    value: function (value) {
                        return value ? $scope.get_date(value) : '';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'occurrence_probability', title: 'احتمال وقوع', width: 300, cell: {
                    value: function (value) {
                        return value != null ? value : '-';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'discovery_chance', title: 'احتمال کشف', width: 300, cell: {
                    value: function (value) {
                        return value != null ? value : '-';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'intensity', title: 'شدت', width: 300, cell: {
                    value: function (value) {
                        return value != null ? value : '-';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            },
            {
                columnid: 'rpn', title: 'RPN', width: 300, cell: {
                    value: function (value) {
                        return value != null ? value : '-';
                    },
                    style: 'font-size:10px;text-align:center'
                }
            }

        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }
    $scope.excel_style = excelStyleInstans;
    $scope.excel_outPut = [];
    $scope.view_status = function (row) {
        var fmea = row.errors.filter(function (itm) {
            return itm.save_rpn;
        });
        $scope.selected_error = null;
        $scope.selected_FMEA = $filter('groupBy')(fmea.map(function (itm) {
            var a = angular.copy(itm);
            a.updated_at = $scope.get_date(itm.updated_at);
            return a;
        }), 'updated_at');
        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA/view_status.htm';
        $scope.is_parent = false;
    };
    $scope.set_rpn = function (index) {
        var error = $scope.selected_FMEA[index];
        console.log(error)
        error.rpn = error.occurrence_probability * error.discovery_chance * error.intensity;

    };
    $scope.show_detail = function (row, noNeedIndex) {
        $scope.selected_error = angular.copy(row);
        if (!noNeedIndex)
            $scope.selected_error_index = $scope.selected_FMEA.indexOf(row);

    };
    $scope.cancel_selected_error = function () {
        $scope.selected_error = null;
    };
    $scope.update_selected_error = function () {

        var params = angular.copy({errors: [$scope.selected_error]});
        factory1.putUserApi('/v1/user/hospital/error_prevention', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('عامل تهدید کننده با موفقیت به روزرسانی شد.', 'به روزرسانی پیشنهاد عامل تهدید کننده');
            $scope.selected_FMEA[$scope.selected_error_index] = data[0];
            $scope.FMEAs[$scope.indexOfError] = angular.copy($scope.selected_FMEA);
            $scope.selected_error = null;
        });
    };
    $scope.send_to_committes = function (row, values) {
        $scope.hideSends();
        $scope.selected_FMEA_ = angular.copy(row);
        console.log(row);
        $scope.reset_params($scope.related_committe);
        if (row.related_committe)
            $scope.related_committe = row.related_committees;
        var index = angular.isArray($scope.selected_FMEA) ? $scope.selected_FMEA.indexOf(row) : -1;
        $scope.send_to_committes_modal = $scope.open_modal('lg', 'send_to_committess.html', null, null, 'blue_modal', $scope, true);
        $scope.send_to_committes_modal.result.then(function (r) {
            if (r) {
                if (index >= 0) {
                    $scope.selected_FMEA[index].related_committees = r;
                } else {
                    values[values.indexOf(row)].related_committees = r;
                }
            }
        })
    };
    $scope.showSends = function () {
        console.log('a')
        $scope.sends = angular.copy($scope.selected_FMEA_)
    };
    $scope.hideSends = function () {
        $scope.sends = null;
    };
    $scope.show_committes = function (arr) {

    }
    $scope.send_to_selected_committe = function () {
        if ($scope.related_committe.subject.length) {
            if ($scope.related_committe.committees.length || $scope.related_committe.users.length) {
                var params = angular.copy($scope.related_committe);
                params.error_type = "error_prevention";
                params.error_id = $scope.selected_FMEA_._id;
                factory1.putUserApi('/v1/user/hospital/error_prevention/send_to_committee', JSON.stringify(params)).then(function (data) {
                    $scope.success_alert('عامل تهدید کننده با موفقیت به کمیته های انتخابی ارسال شد.', 'ارسال به کمیته');
                    $scope.send_to_committes_modal.close(angular.copy($scope.related_committe));
                });
            } else {
                $scope.warning('لطفاً کمیته های مورد نظر را انتخاب کنید.');
            }
        } else {
            $scope.warning('لطفاً موضوع را وارد کنید.');
        }

    };

    function saveFMEA(r) {
        $scope.selected_FMEA = $filter('orderObjectBy')($scope.selected_FMEA, 'rpn', true, true);
        $scope.selected_FMEA.map(function (error, i) {
            if (error.rpn) {
                error.priority = i + 1;
            }
        });

        var params = {errors: $scope.selected_FMEA};
        params.errors.map(function (e) {
            e.save_rpn = r && e.rpn > 0;
        });
        if (r) {
            params.errors = params.errors.filter(function (itm) {
                return itm.rpn && itm.save_rpn
            });
        }

        factory1.putUserApi('/v1/user/hospital/error_prevention', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.', 'ثبت و تحلیل اریابی');
            $scope.FMEAs[$scope.indexOfError].errors.map(function (OrgError, i) {
                data.map(function (NewError) {
                    if (OrgError._id === NewError) {
                        $scope.FMEAs[$scope.indexOfError].errors[i] = angular.copy(NewError);
                    }
                })
            })
            $scope.selected_FMEA = $filter('orderObjectBy')(data, 'rpn', true, true);
            if (r)
                $scope.back_to_parent($scope);
        });
    }

    $scope.submitAnalysis = function (flag) {
        if (flag) {
            saveFMEA(false);
            return false;
        }
        $scope.question('آیا تحلیل و ارزیابی عوامل تهدید کننده این بخش نهایی می باشد؟', 'نهایی سازی تحلیل و ارزیابی');
        $scope.q_result.result.then(function (r) {
            saveFMEA(r);

        });

    };
    $scope.Analysis = function (row) {
        $scope.selected_FMEA = row.errors.filter(function (itm) {
            return !itm.save_rpn;
        });
        $scope.indexOfError = $scope.FMEAs.indexOf(row);
        $scope.selected_FMEA = $filter('orderObjectBy')($scope.selected_FMEA, 'rpn', true, true);
        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA/Analysis.htm';
        $scope.is_parent = false;
    };
    $scope.view_chart = function (thisWard) {
        $scope.summer = {
            total: 0,
            total_zirsakhti: 0,
            total_faraiani: 0,
            total_steps: 0,
            realization_steps: 0,
            high_risk: 0
        }
        var months = [];
        var errors = [];

        $scope.errorWards = [];
        $scope.bar_chart.data_chart1 = [[], []];
        $scope.bar_chart.data_chart3 = [[], []];
        $scope.pie_chart.data_chart = [];
        $scope.FMEAs.map(function (itm) {

            if (thisWard) {
                if (thisWard === itm.ward) {
                    errors = angular.copy(itm.errors);
                    $scope.pie_chart.data_chart = [itm.farayandi, itm.zirsakhti];
                }
            } else {

                $scope.bar_chart.data_chart1[0].push(itm.farayandi);
                $scope.bar_chart.data_chart1[1].push(itm.zirsakhti);

                $scope.errorWards.push(itm.ward ? $scope.get_ward_name(itm.ward, $scope.wards) : 'بخش ناشناس');
                errors = errors.concat.apply(errors, itm.errors);
            }

        });
        $scope.errorCommittees = [];
        $scope.errorSource = []
        //$scope.errorCommittees=$filter('groupBy')(errors,'')

        $scope.TotalZirsakhti = 0;
        $scope.TotalFaraiandi = 0;
        $scope.totalErrors = errors.length;
        var sum = 0;
        errors.forEach(function (itm) {
            $scope.summer.total++;
            if (itm.source) {
                if ($scope.errorSource.indexOf(itm.source) === -1) {
                    $scope.errorSource.push(itm.source);
                }
                if ($scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)] === undefined) {
                    $scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)] = 0;
                    $scope.bar_chart.data_chart3[1][$scope.errorSource.indexOf(itm.source)] = 0;
                }

                if (itm.threat_factor_type.indexOf('زیرساختی') === -1) {

                    $scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)]++;

                } else {

                    $scope.bar_chart.data_chart3[1][$scope.errorSource.indexOf(itm.source)]++;

                }
            }
            if (itm.threat_factor_type.indexOf('زیرساختی') === -1) {
                $scope.TotalFaraiandi++;
            } else {

                $scope.TotalZirsakhti++;
            }
            if (itm.has_eop && itm.eop) {
                $scope.summer.total_steps = $scope.operator['+'](itm.eop.steps.length, $scope.summer.total_steps);
                sum = $scope.operator['+'](itm.eop.complete_percent, sum);
            }
            if (itm.rpn >= 125) {
                $scope.summer.high_risk++;
            }
        });
        $scope.summer.total_faraiani = angular.copy($scope.TotalFaraiandi);
        $scope.summer.total_zirsakhti = angular.copy($scope.TotalZirsakhti);
        $scope.summer.realization_steps = $scope.summer.total_steps ? ((sum / $scope.summer.total_steps) * 100).toFixed(2) : 0;
        for (var i = 0; i < 12; i++) {
            months.push({
                errors: errors.filter(function (itm) {


                    return moment(itm.created_at).jMonth() === i;
                }),
                name: $scope.months_name[i]
            })
        }
        $scope.bar_chart.data_chart4 = [[], []];
        $scope.bar_chart.months = months.map(function (m) {
            $scope.bar_chart.data_chart4[0].push(m.errors.filter(function (e) {
                return e.threat_factor_type.indexOf('زیرساختی') === -1;
            }).length);
            $scope.bar_chart.data_chart4[1].push(m.errors.filter(function (e) {
                return e.threat_factor_type.indexOf('زیرساختی') !== -1;
            }).length);
            return m.name;
        })
        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA/chart.htm';
        $scope.is_parent = false;
    };
    $scope.next = function (step) {
        $scope.steps.push(step);
    };
    $scope.cancel = function () {
        $scope.reset_steps();
    };
    $scope.last = function (step) {
        $scope.steps.splice($scope.steps.indexOf(step), 1);
    };
    factory1.getUserApi('/v1/user/hospital/error_preventions').then(function (data) {
        $scope.FMEAs = data;
        console.log(data);
        $scope.excel_outPut = [];
        data.map(function (d) {
            d.errors.map(function (e) {
                $scope.excel_outPut.push(e)
            })
        })
    });


});

app.controller('FMEA_process_Ctrl', function ($scope, BASE, factory1, localStorageService, $http, Server_URL, $filter) {
    $scope.bar_chart = {
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}},
            scales: {
                xAxes: [{
                    maxBarThickness: 20,
                    ticks: {
                        fontSize: 10,
                        beginAtZero: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 12,
                        suggestedMin: 100,
                        min: 0,
                        beginAtZero: false,
                        maxTicksLimit: 15
                    }
                }]

            },
            series: ['فرآیندی', 'زیرساختی']
        },
        data_chart1: [],
        data_set: [{
            borderWidth: 0,
            backgroundColor: '#0fa707'
        }, {
            borderWidth: 0,
            backgroundColor: '#9a59b5'
        }]
    };
    $scope.pie_chart = {
        labels_chart: ['عوامل فرآیندی', 'عوامل زیرساختی'],
        colors_chart: ['#0fa707', '#9a59b5'],
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 15
            },
            scaleShowGridLines: false
        },
        data_chart: []
    };
    $scope.allThreadTypes = ['زیرساختی - منابع انسانی - کمبود', 'زیرساختی منابع انسانی ضعف عملکردی',
        'زیرساختی - تجهیزات کمبود', 'زیرساختی تجهیزات نقص فنی',
        'فرآیندی - روش‌های مراقبت و درمان - عدم رعایت دستورعمل‌ها',
        'فرایندی روش‌های مراقبت و درمان - الزامات کیفی و فنی'];
    $scope.template = {url: ''};
    $scope.filter = {
        ThreadType: '',
        user: '', DateFrom: '', DateTo: '',
        keyword: '',
        source: '',
        committe: '',
        for_who: ''
    };
    $scope.related_committe = {
        subject: '',
        body: '',
        committees: [],
        users: []
    };
    $scope.sources = [
        'گزارش کارکنان',
        'بازدیدهای میدانی ایمنی بیمار',
        'بازدیدهای مدیریتی ایمنی بیمار',
        'شکایات بیمار',
        'لیست کمیته ها',
        'سایر موارد'
    ];
    $scope.is_parent = true;
    $scope.active_view = -1;
    $scope.reset_steps();
    $scope.is_parent = true;
    $scope.FMEAs = [];
    $scope.session = {
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        current_rule: '',
        members: []

    }
    $scope.className = ['violet-bg', 'orange_bg', 'blue_light_list_bg', 'red_bg', 'green_bg', 'pink_shadow_bg'];
    $scope.className2 = ['light_violet-bg', 'light_orange2_bg', 'blue-light_bg', 'light_red_bg', 'light_green2_rgb_bg', 'light_pink_bg'];
    $scope.view_status = function (row) {
        var fmea = row.errors.filter(function (itm) {
            return itm.save_rpn;
        });
        $scope.selected_error = null;
        $scope.selected_FMEA = $filter('groupBy')(fmea.map(function (itm) {
            var a = angular.copy(itm);
            a.updated_at = $scope.get_date(itm.updated_at);
            return a;
        }), 'updated_at');
        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA/view_status.htm';
        $scope.is_parent = false;
    };
    $scope.set_rpn = function (index) {
        var error = $scope.selected_FMEA[index];
        error.rpn = error.occurrence_probability * error.discovery_chance * error.intensity;

    };
    $scope.show_detail = function (row, noNeedIndex) {
        $scope.selected_error = angular.copy(row);
        if (!noNeedIndex)
            $scope.selected_error_index = $scope.selected_FMEA.indexOf(row);

    };
    $scope.cancel_selected_error = function () {
        $scope.selected_error = null;
    };
    $scope.update_selected_error = function () {

        var params = angular.copy({errors: [$scope.selected_error]});
        factory1.putUserApi('/v1/user/hospital/error_prevention', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('عامل تهدید کننده با موفقیت به روزرسانی شد.', 'به روزرسانی پیشنهاد عامل تهدید کننده');
            $scope.selected_FMEA[$scope.selected_error_index] = data[0];
            $scope.selected_error = null;
        });
    };
    $scope.send_to_committes = function (row, values) {
        $scope.hideSends();
        $scope.selected_FMEA_ = angular.copy(row);
        console.log(row);
        $scope.reset_params($scope.related_committe);
        if (row.related_committe)
            $scope.related_committe = row.related_committees;
        var index = angular.isArray($scope.selected_FMEA) ? $scope.selected_FMEA.indexOf(row) : -1;
        $scope.send_to_committes_modal = $scope.open_modal('lg', 'send_to_committess.html', null, null, 'blue_modal', $scope, true);
        $scope.send_to_committes_modal.result.then(function (r) {
            if (r) {
                if (index >= 0) {
                    $scope.selected_FMEA[index].related_committees = r;
                } else {
                    values[values.indexOf(row)].related_committees = r;
                }
            }
        })
    };
    $scope.showSends = function () {
        console.log('a')
        $scope.sends = angular.copy($scope.selected_FMEA_)
    };
    $scope.hideSends = function () {
        $scope.sends = null;
    };
    $scope.show_committes = function (arr) {

    }
    $scope.send_to_selected_committe = function () {
        if ($scope.related_committe.subject.length) {
            if ($scope.related_committe.committees.length || $scope.related_committe.users.length) {
                var params = angular.copy($scope.related_committe);
                params.error_type = "error_prevention";
                params.error_id = $scope.selected_FMEA_._id;
                factory1.putUserApi('/v1/user/hospital/error_prevention/send_to_committee', JSON.stringify(params)).then(function (data) {
                    $scope.success_alert('عامل تهدید کننده با موفقیت به کمیته های انتخابی ارسال شد.', 'ارسال به کمیته');
                    $scope.send_to_committes_modal.close(angular.copy($scope.related_committe));
                });
            } else {
                $scope.warning('لطفاً کمیته های مورد نظر را انتخاب کنید.');
            }
        } else {
            $scope.warning('لطفاً موضوع را وارد کنید.');
        }

    };

    function saveFMEA(r) {
        $scope.selected_FMEA = $filter('orderObjectBy')($scope.selected_FMEA, 'rpn', true, true);
        $scope.selected_FMEA.map(function (error, i) {
            if (error.rpn) {
                error.priority = i + 1;
            }
        });

        var params = {errors: $scope.selected_FMEA};
        params.errors.map(function (e) {
            e.save_rpn = r && e.rpn > 0;
        });
        if (r) {
            params.errors = params.errors.filter(function (itm) {
                return itm.rpn && itm.save_rpn
            });
        }

        factory1.putUserApi('/v1/user/hospital/error_prevention', JSON.stringify(params)).then(function (data) {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.', 'ثبت و تحلیل اریابی');
            $scope.FMEAs[$scope.indexOfError].errors.map(function (OrgError, i) {
                data.map(function (NewError) {
                    if (OrgError._id === NewError) {
                        $scope.FMEAs[$scope.indexOfError].errors[i] = angular.copy(NewError);
                    }
                })
            })
            $scope.selected_FMEA = $filter('orderObjectBy')(data, 'rpn', true, true);
            if (r)
                $scope.back_to_parent($scope);
        });
    }

    $scope.submitAnalysis = function (flag) {
        if (flag) {
            saveFMEA(false);
            return false;
        }
        $scope.question('آیا تحلیل و ارزیابی عوامل تهدید کننده این بخش نهایی می باشد؟', 'نهایی سازی تحلیل و ارزیابی');
        $scope.q_result.result.then(function (r) {
            saveFMEA(r);

        });

    };
    $scope.Analysis = function (row) {
        $scope.selected_FMEA = angular.copy(row);
        $scope.indexOfError = $scope.FMEAs.indexOf(row);

        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA_process/Analysis.htm';
        $scope.is_parent = false;
    };
    $scope.view_chart = function (thisWard) {
        $scope.months = [];
        var errors = [];

        $scope.errorWards = [];
        $scope.bar_chart.data_chart1 = [[], []];
        $scope.bar_chart.data_chart3 = [[], []]
        $scope.pie_chart.data_chart = [];
        $scope.FMEAs.map(function (itm) {

            if (thisWard) {
                if (thisWard === itm.ward) {
                    errors = angular.copy(itm.errors);
                    $scope.pie_chart.data_chart = [itm.farayandi, itm.zirsakhti];
                }
            } else {
                $scope.bar_chart.data_chart1[0].push(itm.farayandi);
                $scope.bar_chart.data_chart1[1].push(itm.zirsakhti);

                $scope.errorWards.push($scope.get_ward_name(itm.ward, $scope.wards));
                errors = errors.concat.apply(errors, itm.errors);
            }

        });
        $scope.errorCommittees = [];
        $scope.errorSource = []
        //$scope.errorCommittees=$filter('groupBy')(errors,'')

        $scope.TotalZirsakhti = 0;
        $scope.TotalFaraiandi = 0;
        $scope.totalErrors = errors.length;
        errors.forEach(function (itm) {
            if (itm.source) {
                if ($scope.errorSource.indexOf(itm.source) === -1) {
                    $scope.errorSource.push(itm.source);
                }
                if ($scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)] === undefined) {
                    $scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)] = 0;
                    $scope.bar_chart.data_chart3[1][$scope.errorSource.indexOf(itm.source)] = 0;
                }

                if (itm.threat_factor_type.indexOf('زیرساختی') === -1) {

                    $scope.bar_chart.data_chart3[0][$scope.errorSource.indexOf(itm.source)]++;

                } else {

                    $scope.bar_chart.data_chart3[1][$scope.errorSource.indexOf(itm.source)]++;

                }
            }
            if (itm.threat_factor_type.indexOf('زیرساختی') === -1) {
                $scope.TotalFaraiandi++;
            } else {

                $scope.TotalZirsakhti++;
            }
        })
        for (var i = 0; i < 12; i++) {
            $scope.months.push({
                errors: errors.filter(function (itm) {


                    return moment(itm.created_at).jMonth() === i;
                }),
                name: $scope.months_name[i]
            })
        }

        $scope.template.url = 'views/fault_management/PreventingMedicalErrors/FMEA/chart.htm';
        $scope.is_parent = false;
    };
    $scope.submit_sessions = function () {
        var params = angular.copy($scope.session);
        params.date = $scope.get_miladi_date(params.date);
        // params.start_time=params.start_time.toString().substring(16,21);
        // params.end_time=params.end_time.toString().substring(16,21);
        console.log(params);
        $scope.FMEAs.push(params);
        $scope.close_modal();
    };
    $scope.addRPN = function () {
        $scope.selected_FMEA.push({});
    }
    $scope.selectMembers = function () {
        var arr = [];
        arr = angular.copy($scope.users);
        var partners = angular.copy($scope.session.members);
        if (partners) {
            partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    partners.forEach(function (p) {
                        if (obj.id == p) {

                            itm.users[itm.users.indexOf(obj)].checked = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                $scope.session.members = r.map(function (itm) {
                    return itm.id;
                });
            }
        });
    };
    $scope.invite = function () {
        $scope.open_modal('lg', 'set_schadule.html', null, null, 'blue_modal', $scope, true);
    }
    /*   factory1.getUserApi('/v1/user/hospital/error_preventions').then(function (data) {
        $scope.FMEAs=data;
        console.log(data);
    });
*/
    factory1.get_event_location().then(function (data) {

        $scope.locations = data;
    });
});

app.controller('checkList_ctrl', function ($stateParams, $state, $scope, $rootScope, factory1, $filter, BASE, $timeout, $location,$q) {

    $scope.compilation_checklist = false;
    $scope.check_list = {
        title: "",
        number: "",
        goal: "",
        rating_type: "",
        rate_guide: "",
        status: "",
        wards: [],
        questions: [],
        guides: [],
        components: [],
        has_component: false,
        has_info: false,
        delivery_type: '',
        is_public: false
    };
    $scope.currentComponent = {
        selected: ''
    };
    $scope.checkLists = [];
    $scope.filter = {
        status: "",
        keyword: ""
    };
    $scope.direction = 1;
    $scope.CurrentStep = 0;
    $scope.question_points = [];
    $scope.point_type = {
        selected: '', guides: []
    };
    $scope.indexOfChecklist = -1;
    $scope.total = {
        value: 0,
        count: 0,
        wards: [],
        counter: 0
    };
    $scope.filter = {};
    var question_groupted = null;
    var is_self_assessment = '/improve_quality/self_assessment' === $location.path();
    var is_proccess = '/improve_quality/continuous_management_of_hospital_processes' === $location.path();
    var step_name = is_proccess?'ارزیابی فرآیند':(is_self_assessment ? 'خود ارزیابی' : 'پایش فرهنگ ایمنی');
    var printed = false;
    var certificate = is_self_assessment || is_proccess ? 'رهبری و مدیریت کیفیت' + '|' + step_name : 'ارزیابی عملکرد در مدیریت خطاها' + '|' + step_name;
    var mehvar = is_self_assessment || is_proccess ? 'رهبری و مدیریت کیفیت' : 'مدیریت خطا';
    var mehvar_icon = is_proccess?'icon-font icon-farayand':(is_self_assessment ? 'icon-font icon-khod_arzyabi' : 'icon-font icon-modiriyate_khata');
    $scope.excel_filename = step_name;
    var excelStyleInstans = {
        sheetid: '',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {columnid: 'component', title: 'حیطه', width: 300},
            {columnid: 'question', title: 'سؤال', width: 300},
            {columnid: 'middel_value', title: 'میانگین نظرات', width: 300},
            {columnid: 'total_middel_value', title: 'کل بیمارستان', width: 300}

        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }
    var excelStyleInstans2 = {
        sheetid: 'دوره تناوب',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {columnid: 'component', title: 'حیطه', width: 300},
            {columnid: 'question', title: 'سؤال', width: 300},
            /*{columnid: 'نوع مقادیر', title: 'سؤال', width: 300},*/


        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }
    var excelStyleInstans3 = {
        sheetid: 'گزارش های آماری',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {columnid: 'ward', title: 'بخش', width: 300},


        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }
    $scope.excel_style = [];
    $scope.excel_outPut = [];
    $scope.progress={
        value:0
    }
    $scope.checklistExcel={

    }
    function get_AVG_by_question(q) {
        if (q.point_type !== 'سوال باز') {
            var max = 1;
            var sum = 0;
            var all_guide = $scope.checklist.checklist_page_guides.filter(function (g) {
                return g.key === q.point_type;
            });

            if (q.point_type === 'کیفی') {
                max = all_guide.length;
            } else if (q.point_type === 'عددی' || q.point_type === 'درصدی') {
                max = all_guide[all_guide.length - 1].value;
            }
            var questions = [];
            $scope.detail_recordes.map(function (dr) {
                if (dr.checklist_page_answer_detail_records)
                    dr.checklist_page_answer_detail_records.map(function (r) {
                        if (r.question === q.key) {
                            questions.push(r);
                        }
                    })
            })
            sum = questions && questions.length ? questions.reduce(function (a, b) {
                return {v: $scope.operator['+'](a.v, b.v)};
            }, 0)['v'] : 0;
            if (!printed) {
                printed = true;
            }
            return ((sum / (max * questions.length)) * 100).toFixed(2);
        } else {
            return '-'
        }
    }

    function setDir(step) {
        $scope.direction = step > $scope.CurrentStep ? 1 : 0;

    }

    function serilizeCheckLists(data) {
        $scope.checkLists = [];
        data.map(function (itm) {
            itm.status = '1';
            itm.operators = [];
            itm.checklist_page_answers = [];
            if (itm.checklist_page_wards && itm.checklist_page_wards.length) {
                itm.checklist_page_wards.map(function (ward) {
                    itm.operators.push(ward.operator);
                    if (ward.checklist_page_answers) {
                        itm.checklist_page_answers.push({
                            checklist_page_answers: ward.checklist_page_answers,
                            operator: ward.operator
                        });
                    }
                    if (ward.send_kartabl) {
                        itm.send_kartabl = true;
                    }
                    itm.delivery_type = ward.delivery_type;
                });
            }
            if(itm.checklist_page_answers){
                itm.notComplate=itm.checklist_page_answers.find(function (c) {
                    return c.checklist_page_answers.find(function (cc) {
                        return cc.checklist_page_answer_details.find(function (d) {
                            return d.save_temp
                        })
                    })
                })
            }
            itm.status = itm.send_kartabl ? (itm.checklist_page_answers.length ? '5' : '3') : '1'
            $scope.checkLists.push(angular.copy(itm));
            /* if (itm.checklist_page_wards && itm.checklist_page_wards.length) {
                 itm.checklist_page_wards.map(function (ward) {
                     var w = {
                         check_list: itm,
                         title: itm.title,
                         ward_name: $scope.get_ward_name(ward.ward_id, $scope.wards),
                     status: ward.send_kartabl == true ? (ward.checklist_page_answers ? '5' : '3') : '1'

                     };
                     w = angular.merge(w, ward);
                     $scope.checkLists.push(w);
                 })

             } else {
                 itm.status = '1';
                 $scope.checkLists.push(itm);
             }*/

        });

    }

    function getCheckList() {
        factory1.getUserApi('/v1/user/hospital/checklists', '&certificate=' + certificate).then(function (data) {

            $scope.excel_outPut = [];
            $scope.excel_style = [];
            serilizeCheckLists(data)
            //console.log(data)
            data.filter(function (d) {
                return d.send_kartabl && d.checklist_page_answers && d.checklist_page_answers.length
            }).map(function (d) {
                $scope.checklistExcel[d._id]={
                    data:[],
                    style:[]
                }
                var inst = angular.copy(excelStyleInstans);
                inst.sheetid = d.title;
                var questions = {};
                if (d.checklist_page_answers)
                    d.checklist_page_answers.map(function (checklist_page_answers) {
                        if (checklist_page_answers.checklist_page_answers)
                            checklist_page_answers.checklist_page_answers.map(function (checklist_page_answer) {
                                if (checklist_page_answer.checklist_page_answer_details)
                                    checklist_page_answer.checklist_page_answer_details.map(function (detail) {
                                        if (!detail.save_temp && detail.checklist_page_answer_detail_records) {
                                            detail.checklist_page_answer_detail_records.map(function (record) {
                                                if (!questions[record.question]) {
                                                    questions[record.question] = [];
                                                }
                                                questions[record.question].push({
                                                    value: record.value,
                                                    v: record.v
                                                });
                                            });
                                        }
                                    });
                            });
                    });
                var excel_objects = [];
                Object.keys(questions).map(function (q) {
                    var excel_object = {
                        'سؤال': q,
                        'میانگین نظرات': 0
                    };
                    excel_object['میانگین نظرات'] = 0;
                    var question = d.checklist_page_questions.find(function (cpq) {
                        return cpq.key === q;
                    })
                    if (question) {
                        d.checklist_page_guides.map(function (g) {
                            var filtered_questions = questions[q].filter(function (qq) {
                                return qq.value === g.value
                            });
                            excel_object[' تعداد ' + g.value] = filtered_questions.length;
                            excel_object[' درصد ' + g.value] = ((filtered_questions.length / questions[q].length) * 100).toFixed(2);
                        })
                        var component = question.component;
                        if (component) {
                            excel_object['حیطه'] = component;
                        }
                        if (question.point_type != 'سوال باز') {
                            var guide = d.checklist_page_guides.filter(function (cpg) {
                                return cpg.key === question.point_type;
                            })
                            var max = 1;
                            if (question.point_type === 'عددی' || question.point_type === 'درصدی') {
                                max = guide.reverse()[0].value;
                            } else if (question.point_type === 'کیفی') {
                                max = guide.length;
                            }
                            var sum = questions[q].reduce(function (a, b) {
                                return {'v': operator['+'](a['v'], b['v'])};
                            }, 0)['v'];
                            var middel = ((sum / (questions[q].length * max)) * 100).toFixed(2);
                            excel_object['میانگین نظرات'] = middel;


                        }
                    }
                    excel_objects.push(excel_object)
                })
                if (excel_objects && excel_objects.length) {
                    // console.log(inst)
                    $scope.excel_outPut.push(excel_objects);
                    $scope.excel_style.push(inst);
                }

            });
            // console.log($scope.excel_outPut)
        });
    }

    function setGuides() {
        var max = 0;
        if ($scope.point_type.guides) {
            var guides = $filter('groupBy')($scope.point_type.guides, 'point_type');
            for (var key in guides) {
                if (guides.hasOwnProperty(key)) {
                    if (guides[key].length > max) {
                        max = guides[key].length;
                    }
                }
            }
            $scope.maxPoints = $scope.new_Array(max, '');
            if ($scope.question_points) {
                for (var key in $scope.question_points) {
                    if ($scope.question_points.hasOwnProperty(key)) {
                        $scope.question_points[key].map(function (q) {
                            q.guides = guides[q.point_type];
                        })
                    }
                }
            }
        }


    }

    function set_calender(calender_type, ward) {
        var answers = [];
        var answers_ = angular.copy($scope.checklist.checklist_page_answers ? $scope.checklist.checklist_page_answers : []);
        if (answers_.length) {
            answers_.map(function (ans) {
                ans.checklist_page_answers.map(function (cpa) {
                    var itm = angular.copy(cpa);
                    if (itm.checklist_page_answer_details) {
                        var checklist_page_answer_details_length = 0;

                        itm.value = 0;
                        var checklist_page_answer_details = ward ? $filter('filter_by')(itm.checklist_page_answer_details, 'ward_id', ward) : itm.checklist_page_answer_details;
                        if (checklist_page_answer_details.length) {
                            var cp = checklist_page_answer_details.filter(function (ad) {
                                return !ad.save_temp;
                            });
                            itm.checklist_page_answer_details = checklist_page_answer_details.map(function (d) {
                                d.user_id = angular.copy(ans.operator);
                                if (!$scope.calenders.length) {
                                    if ($scope.total.wards.indexOf(d.ward_id) === -1) {
                                        $scope.total.wards.push(d.ward_id)
                                    }
                                }

                                return d;
                            });
                            cp.map(function (d) {
                                itm.value = $scope.operator["+"](itm.value, d.value || 0);

                            });
                            checklist_page_answer_details_length = cp.length;
                            itm.value = checklist_page_answer_details_length ? (itm.value / checklist_page_answer_details_length).toFixed(2) : null;
                        } else {
                            itm.checklist_page_answer_details = [];
                        }

                        itm.checklist_page_answer_details_length = checklist_page_answer_details_length;
                    } else {
                        itm.checklist_page_answer_details = [];
                    }

                    answers.push(itm);
                });
            })
        }

        calender_type = calender_type || angular.copy($scope.checklist.delivery_type);

        var repeat_count = $scope.getPeriodCount(calender_type);

        if (calender_type === 'روزانه') {
            repeat_count = 12;
        }
        var c = $scope.new_Array(repeat_count, {});
        c = c.map(function (itm, i) {
            itm.answer = null;
            if (calender_type === 'روزانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at_month = i + 1;
                itm.header_type = 'ماه';
                itm.days = $scope.get_day_of_month(i + 1, $rootScope.year);

            } else if (calender_type === 'هفتگی') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'هفته';
            } else if (calender_type === 'ماهانه') {
                itm.header = $filter('persianMonth')(i + 1);
                itm.submitted_at = i + 1;
                itm.header_type = 'ماه';

            } else if (calender_type === 'سه ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'سه ماهه';
            } else if (calender_type === 'شش ماه یکبار') {
                itm.header = $filter('persianNum')(i + 1, true);
                itm.submitted_at = i + 1;
                itm.header_type = 'شش ماهه';
            } else if (calender_type === 'سالانه') {
                itm.header = $rootScope.year;
                itm.submitted_at = $rootScope.year;
                itm.header_type = 'سال';
            }

            if (calender_type !== 'روزانه') {
                itm.counter = 1;
                itm.counter2 = 0;
                itm.total_value = 0;
                answers.map(function (a) {

                    var n = angular.copy(a.submitted_at)
                    if (calender_type !== $scope.checklist.delivery_type) {
                        n = $scope.getEqualSubmitedAt(a.submitted_at, $scope.checklist.delivery_type, calender_type);

                    }

                    if (n == i + 1 || n == itm.submitted_at) {

                        if (a.checklist_page_answer_details.length) {
                            if (itm.answer !== null) {

                                itm.counter++;
                            }
                            itm.answer = angular.copy(a);

                            if (!itm.answers_data) {
                                if (!$scope.calenders.length)
                                    $scope.total.count++;
                                itm.answers_data = [];
                            }
                            if (itm.answer.value !== null) {

                                itm.answer.value = parseFloat(itm.answer.value * 100).toFixed(2);
                                var d_len = itm.answer.checklist_page_answer_details_length;

                                itm.total_value = $scope.operator['+']((itm.answer.value * d_len), itm.total_value);
                                itm.counter2 += (d_len);
                                if (d_len && !$scope.calenders.length) {
                                    $scope.total.counter += d_len;
                                }
                                a.value = angular.copy(itm.answer.value);
                            }

                            var details = itm.answer.checklist_page_answer_details;


                            itm.answers_data = [].concat(itm.answers_data, angular.copy(itm.answer.checklist_page_answer_details));


                            itm.status_class = i && c[i - 1].answer ? (a.value < c[i - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes') : '';
                        }


                    }
                });
                if (itm.counter > 1) {
                    itm.answer.value = itm.counter2 ? (itm.total_value / itm.counter2).toFixed(2) : null;
                }
                if (itm.answer && !$scope.calenders.length) {
                    var l = itm.counter2 ? itm.counter2 : 1;
                    $scope.total.value = $scope.operator['+']($scope.total.value, (itm.answer.value * l))
                }
            } else {
                itm.days_object = [];
                for (var d = 0; d < itm.days.length; d++) {
                    itm.days_object.push({
                        answer: null,
                        submitted_at: moment($rootScope.year + '/' + itm.submitted_at_month + '/' + itm.days[d], 'jYYYY/jM/jD').jDayOfYear()
                    });

                }

                answers.map(function (a) {
                    itm.days_object.map(function (day, d) {

                        if (a.submitted_at == day.submitted_at) {
                            day.answer = a;

                            if (!day.answers_data) {
                                if (!$scope.calenders.length)
                                    $scope.total.count++;
                                day.answers_data = [];
                            }

                            day.answer.value = ($scope.checklist.darsadi ? day.answer.value : day.answer.value * 100).toFixed(2);
                            var d_len = day.answer.checklist_page_answer_details_length;
                            a.value = angular.copy(day.answer.value);
                            day.answers_data = [].concat(day.answers_data, angular.copy(day.answer.checklist_page_answer_details));
                            if (d_len && !$scope.calenders.length) {
                                $scope.total.counter += d_len;
                            }
                            if (!itm.answer && day.answer != null) {
                                itm.answer = {value: 0};
                            }
                            /*day.answer = a;
                            a.value = parseFloat(a.value);
*/
                            if (d && itm.days_object[d - 1].answer) {
                                day.status_class = a.value < itm.days_object[d - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                            } else {
                                if (day.submitted_at > 1 && i) {
                                    var last_month = c[i - 1].days_object;
                                    if (last_month[last_month.length - 1].answer)
                                        day.status_class = a.value < last_month[last_month.length - 1].answer.value ? 'icon-kahesh_shakhes' : 'icon-afzayesh_shakhes';
                                }

                            }

                        }
                    });

                });

                if (itm.answer && !$scope.calenders.length) {
                    itm.answer.value = 0;
                    itm.days_object.map(function (day) {

                        if (day.answer != null) {
                            var l = day.answer.checklist_page_answer_details ? day.answer.checklist_page_answer_details.length : 1;
                            itm.answer.value = $scope.operator['+'](itm.answer.value, (day.answer.value * l));
                        }
                    })
                    $scope.total.value = $scope.operator['+']($scope.total.value, itm.answer.value)
                }
            }
            return itm;
        });
        return c;
    }

    function setAnswers(calenders) {
        var answers = [];
        if (calenders)
            calenders.map(function (interval) {
                if (interval) {
                    var r = {};
                    if (interval.days_object) {
                        interval.days_object.map(function (day, i) {
                            r = {}
                            r.interval_name = interval.days[i] + ' ' + interval.header;
                            r.interval_perfix = interval.header_type;
                            if (day.answer !== null) {
                                r.users = Object.keys($filter('groupBy')(day.answers_data, 'user_id'))
                                r.answers_data = interval.answers_data.filter(function (a) {
                                    return !a.save_temp
                                });
                                r.temp_answers_data = interval.answers_data.filter(function (a) {
                                    return a.save_temp
                                });
                                r.point = (day.answer.value || 0) + '%';
                                r.wards = Object.keys($filter('groupBy')(day.answers_data, 'ward_id')).map(function (ward) {
                                    return $scope.get_ward_object(ward, $scope.wards);
                                }).filter(function (value) {
                                    return value
                                });


                            } else {
                                r.users = [];
                                r.answers_data = [];
                                r.wards = [];
                                r.point = null;
                            }
                            answers.push(angular.copy(r));
                        })
                    } else {
                        r.interval_name = interval.header;
                        r.interval_perfix = interval.header_type;
                        if (interval.answer) {
                            r.users = Object.keys($filter('groupBy')(interval.answers_data, 'user_id'))
                            r.answers_data = interval.answers_data.filter(function (a) {
                                return !a.save_temp;
                            });
                            r.temp_answers_data = interval.answers_data.filter(function (a) {
                                return a.save_temp;
                            });

                            r.point = (interval.answer.value || 0) + '%';
                            r.wards = Object.keys($filter('groupBy')(interval.answers_data, 'ward_id')).map(function (ward) {
                                return $scope.get_ward_object(ward, $scope.wards);
                            }).filter(function (value) {
                                return value
                            });
                        } else {
                            r.users = [];
                            r.answers_data = [];
                            r.wards = [];
                            r.point = null;
                        }


                        answers.push(angular.copy(r));
                    }
                }
            });

        return answers;
    }

    function resetAnswers() {
        $scope.menuItems.map(function (itm) {
            itm.checked = false;
            itm.is_req=true;
        })
    }

    function deleteAPI(id, type, callBack) {
        factory1.deleteUserApi('/v1/user/hospital/checklists/' + $scope.check_list.id + '/' + type + '/' + id).then(callBack)
    }

    function deleteQuestion(q) {
        if (q._id)
            deleteAPI(q._id, 'question', function (data) {
                console.log(data)
            })
    }

    $scope.checklistOnBeforePrinting=function(row){
        var defer = $q.defer();
        if($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data.length){
            defer.resolve({data:$scope.checklistExcel[row._id].data,style:$scope.checklistExcel[row._id].style})
        }else{

            $scope.checklistExcel[row._id]={
                data:[],
                style:[]
            }
            console.log(row);
            var menu_items=angular.copy(row.menu_items);
            var max = 1;
            var guides=$filter('groupBy')(row.checklist_page_guides,'key');
            var questions=angular.copy(row.checklist_page_questions);
            var answers={};
            row.checklist_page_answers.map(function (c) {
                c.checklist_page_answers.map(function (checklist_page_answer) {
                    if(checklist_page_answer.checklist_page_answer_details){
                        if(!answers[checklist_page_answer.submitted_at]){
                            answers[checklist_page_answer.submitted_at]=[]
                        }
                        answers[checklist_page_answer.submitted_at]=answers[checklist_page_answer.submitted_at].concat(checklist_page_answer.checklist_page_answer_details)
                    }

                })
            });
            var all2level=questions.every(function (q) {
            return q.point_type==='سوال باز' || q.point_type==='دوسطحی'
            });

            function get_question_type(q){
                var question =questions.find(function (qq) {
                    return qq.key===q
                });
                return question ?question.point_type:'';
            }
            var style=angular.copy(excelStyleInstans2);
            var style2=angular.copy(excelStyleInstans3);
            Object.keys(guides).map(function (guide) {
                guides[guide].map(function (g) {
                    style.columns.push({columnid: g.value, title: g.value, width: 300})
                })
            });
            style.columns.push({columnid: 'middel_value', title: 'امتیاز کل', width: 300});
            console.log(answers)
            var infos=[];
            Object.keys(answers).map(function (submitted_at) {
                var s=angular.copy(style);
                var data=[];
                if(answers[submitted_at]){
                    questions.map(function (q) {
                        var data_={
                            'حیطه':q.component,
                            'سؤال':q.key,
                            'امتیاز کل':'-'
                        };
                        if (q.point_type !== 'سوال باز') {
                            Object.keys(guides).map(function (guide) {
                                guides[guide].map(function (g) {
                                    data_[g.value] = 0;
                                })
                            });

                            if (q.point_type === 'کیفی') {
                                max = guides[q.point_type].length;
                            } else if (q.point_type === 'عددی' || q.point_type === 'درصدی') {
                                max = guides[q.point_type][guides[q.point_type].length - 1].value;
                            }
                            var counter = 0;
                            var value = 0;
                            answers[submitted_at].map(function (ans) {

                                if (ans.checklist_page_answer_detail_records) {



                                    ans.checklist_page_answer_detail_records.map(function (answer_record) {
                                        if (answer_record.question === q.key) {
                                            counter++;
                                            data_[answer_record.value]++;
                                            value = operator['+'](answer_record.v, value);
                                        }
                                    });

                                }
                            })
                            data_['امتیاز کل'] = counter ? ((value / (counter * max)) * 100).toFixed(2) : 0;
                            data.push(angular.copy(data_));
                        }

                    });
                    answers[submitted_at].map(function (ans) {
                        var info={
                            'بخش':ans.ward_id?$scope.get_ward_name(ans.ward_id,$scope.wards):'-',
                            'امتیاز':0,
                            'وضعیت':'-'
                        }
                        if (ans.checklist_page_answer_detail_records) {
                            var counter=0;
                            var value=0;
                            ans.checklist_page_answer_detail_records.map(function (answer_record) {
                                var question_type=get_question_type(answer_record.question);
                                if(question_type==='کیفی' || question_type=== 'عددی' || question_type==='درصدی' || all2level){
                                    if (question_type === 'کیفی') {
                                        max = guides[question_type].length;
                                    } else if (question_type === 'عددی' || question_type === 'درصدی') {
                                        max = guides[question_type][guides[question_type].length - 1].value;
                                    }
                                    counter++;
                                    value = operator['+'](answer_record.v, value);
                                }


                            });
                            info['امتیاز'] = counter ? parseFloat(((value / (counter * max)) * 100).toFixed(2)) : 0;
                        }
                            menu_items.map(function (menu_item) {
                                var mi=ans.checklist_page_answer_detail_infos?ans.checklist_page_answer_detail_infos.find(function (info_) {
                                    return info_.answerer_info_menu_item_id==menu_item.id;
                                }):[];
                                info[menu_item.item]=mi && mi.value!==null?mi.value:'-';
                            })

                        info['وضعیت']=info['امتیاز']<=50?
                            'ضعیف'
                            :
                            (info['امتیاز']>50 && info['امتیاز']<=75?
                                'متوسط'
                                :(
                                    info['امتیاز']>75 && info['امتیاز']<=90?
                                        'خوب'
                                        :'عالی'
                                ));
                        infos.push(angular.copy(info));
                    })
                }
                $scope.checklistExcel[row._id].data.push(angular.copy(data));
                s.sheetid=$scope.getIntervalTitle(row.delivery_type,submitted_at).toString();
                $scope.checklistExcel[row._id].style.push(angular.copy(s));
            });
            menu_items.map(function (menu_item) {
                style2.columns.push({columnid: menu_item.item, title: menu_item.item, width: 300})
            });
            style2.columns.push({columnid: 'امتیاز', title: 'امتیاز', width: 300});
            style2.columns.push({columnid: 'وضعیت', title: 'وضعیت', width: 300});
            $scope.checklistExcel[row._id].style.push(angular.copy(style2));
            $scope.checklistExcel[row._id].data.push(angular.copy(infos));

            $timeout(function () {
                defer.resolve({data:$scope.checklistExcel[row._id].data,style:$scope.checklistExcel[row._id].style});
            },1000)


        }

        return defer.promise;
    }
    $scope.show_checklist_form = function (row) {
        $scope.detail_answer = {
            questions: row.checklist_page_questions.map(function (q) {

                var qq = angular.copy(q);
                qq.answer = '';
                return qq;
            })
        };
        $scope.detail_answer.checklist_info = angular.copy(row);
        $scope.checklist = angular.copy(row);

        $scope.open_modal('lg', 'detail_answers.html', null, null, 'only_content full_width', $scope);
    }
    $scope.show_reports = function (calenders) {
        $scope.reports = setAnswers(calenders);

        $scope.hasComponent = $scope.checklist.has_component;

        $scope.open_modal('lg', 'completed_checklists.html', null, null, 'only_content full_width', $scope);
        // $scope.detail_of_proccess_copy
    }
    $scope.get_AVG_by_type = function (record, point_type) {
        if (record) {
            if (point_type && point_type !== 'سوال باز') {
                var max = 1;
                var sum = 0;
                var questions = record.filter(function (itm) {
                    return question_groupted[point_type].find(function (q) {
                        return q.key === itm.question;
                    })
                })
                var all_guide = $scope.checklist.checklist_page_guides.filter(function (g) {
                    return g.key === point_type;
                });
                if (point_type === 'کیفی') {
                    max = all_guide.length;
                } else if (point_type === 'عددی' || point_type === 'درصدی') {
                    max = all_guide[all_guide.length - 1].value;
                }
                sum = questions.reduce(function (a, b) {
                    return {v: $scope.operator['+'](a.v, b.v)};
                })['v'];
                return questions.length ? ((sum / (max * questions.length)) * 100).toFixed(2) : 0;
            }
            return '-';
        } else {
            var total_sum = 0;
            var total_count = 0;
            $scope.detail_recordes.map(function (dr) {

                total_count++;
                if (dr.checklist_page_answer_detail_records)
                    total_sum = $scope.operator['+']($scope.get_AVG_by_type(dr.checklist_page_answer_detail_records, point_type), total_sum);

            })
            return total_count ? (total_sum / total_count).toFixed(2) : 0;
        }

    };
    $scope.show_charts = function () {
        $scope.charts = {
            show: false,
            chart_type: '',
            data_set: [],
            options: {
                maintainAspectRatio: false,
                events: false,
                hover: {
                    animationDuration: 0
                },
                tooltips: {
                    enabled: false,
                    titleFontSize: 14,
                    bodyFontSize: 15
                },
                animation: {
                    duration: 1,
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.font = Chart.helpers.fontString(9, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 50,
                        bottom: 10
                    }
                },
                scaleShowGridLines: false,
                elements: {line: {tension: 0, fill: false}}, scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 10,
                            beginAtZero: false,
                            autoSkip: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: 9,
                            suggestedMin: 31,
                            min: 0,
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '',
                            fontSize: 11
                        }
                    }]

                }
            },
            series: [],
            data_chart: [],
            labels_chart: [],
            report_types: [
                'روند ارزیابی "' + step_name + '" در دوره تناوب اندازه گیری شده',
                'میانگین نظرات بخش ها برای سؤالات مختلف',
                'میانگین نظرات روی حیطه مختلف سؤالات',
                'مقایسه میانگین بخش ها با کل بیمارستان',
                'تعداد چک لیست های تکمیل شده در بخش ها'
            ],
            report_type: '',
            filter: {
                selected_interval:'',
                interval: '',
                ward_name: '',
                date: false,
                selected_date: '',
                selected_wards: [],
                selected_monthes: [],
                selected_components: [],
                component: false
            },
            show_chart: false,
            calender_type: '',
            dates: [],
            colors: [],
            chart_table: null,
            index: 0,
            wards: [],
            components: [],
            months: [],
            total: 0,
            middel_total: 0,
            lastInterval:{
                label:[],data:[],color:[]
            },
            click:function(d){
                $scope.progress.value=1;
                if(d.length){
                    if(!$scope.charts.lastInterval.label.length){
                        $scope.charts.filter.selected_interval=d[0]._model.label;
                        $scope.charts.lastInterval.label=angular.copy($scope.charts.labels_chart);
                        $scope.charts.lastInterval.data=angular.copy($scope.charts.data_chart);
                        //$scope.charts.lastInterval.color=angular.copy(this.chart.options.colors);
                        $scope.charts.labels_chart=$scope.charts.labels_chart.filter(function (value,i) {
                            if(value===d[0]._model.label){
                                if(typeof $scope.charts.data_chart[i]==="number"){
                                    $scope.charts.data_chart=[$scope.charts.data_chart[i]];

                                }else{
                                    $scope.charts.data_chart=$scope.charts.data_chart.map(function (value1) {
                                        return [value1[i]];
                                    });
                                }


                                //$scope.charts.data_chart=[$scope.charts.data_chart[i]];
                                return true;
                            }
                        })
                    }else{
                        $scope.charts.toggle_interval();
                    }

                }else{
                    $scope.charts.toggle_interval();
                }
                $timeout(function () {
                    $scope.progress.value=0;
                },1000)
            },
            toggle_interval:function(){

                if(this.lastInterval.label && this.lastInterval.label.length){
                    this.filter.selected_interval='';
                    this.labels_chart=angular.copy(this.lastInterval.label);
                    this.data_chart=angular.copy(this.lastInterval.data);
                    this.lastInterval.label=[];

                }

            },
            getDatesOptions: function () {
                var timelines = [
                    'روزانه',
                    'هفتگی',
                    'ماهانه',
                    'سه ماه یکبار',
                    'شش ماه یکبار',
                    'سالانه',
                ];
                return timelines.splice(timelines.indexOf($scope.checklist.delivery_type) + 1, 5);
            },
            toggle_ward: function (ward) {
                var i = this.filter.selected_wards.indexOf(ward._id);
                if (ward.checked) {

                    this.filter.selected_wards.push(ward._id);
                } else {
                    if (i !== -1) {
                        this.filter.selected_wards.splice(i, 1);
                    }
                }


                this.setChart();
            },
            toggle_component: function (component) {
                var i = this.filter.selected_components.indexOf(component.name);
                if (component.checked) {

                    this.filter.selected_components.push(component.name);
                } else {
                    if (i !== -1) {
                        this.filter.selected_components.splice(i, 1);
                    }
                }


                this.setChart();
            },
            toggle_month: function (month) {
                var i = this.filter.selected_monthes.indexOf(month.name);
                if (month.checked) {

                    this.filter.selected_monthes.push(month.name);
                } else {
                    if (i !== -1) {
                        this.filter.selected_monthes.splice(i, 1);
                    }
                }


                this.setChart();
            },
            select_date: function (date) {
                this.filter.selected_date = this.filter.selected_date !== date ? angular.copy(date) : '';
                this.filter.date = false;
                this.setChart();
            },
            getIntervalLabels: function (calender_type) {
                calender_type = calender_type || this.calender_type;
                if (calender_type === 'روزانه') {
                    var day = moment().jYear($rootScope.year);
                }
                return $scope.new_Array($scope.getPeriodCount(calender_type), {}).map(function (itm, i) {


                    switch (calender_type) {
                        case 'روزانه':
                            return day.jDayOfYear(i + 1).format('jD jMMMM');
                        case 'هفتگی':
                            return ' هفته ' + $filter('persianNum')(i + 1, true);
                        case 'ماهانه':
                            return $filter('persianMonth')(i + 1);
                        case 'سه ماه یکبار':
                            return ' سه ماهه ' + $filter('persianNum')(i + 1, true);
                        case 'شش ماه یکبار':
                            return ' شش ماهه ' + $filter('persianNum')(i + 1, true);
                        case 'سالانه':
                            return $rootScope.year;

                    }

                });
            },
            getQuestions: function () {
                var q = [];
                var self = this;
                $scope.checklist.checklist_page_answers.map(function (answer) {
                    answer.checklist_page_answers.map(function (ans) {
                        ans.checklist_page_answer_details.map(function (detail) {
                            if (detail.checklist_page_answer_detail_records)
                                detail.checklist_page_answer_detail_records.map(function (r) {
                                    var rr = angular.copy(r);
                                    rr.detail = angular.copy(detail);
                                    rr.detail.submitted_at = angular.copy(ans.submitted_at);
                                    delete rr.detail.checklist_page_answer_detail_records;
                                    rr.point_type = self.getQuestionType(r.question);
                                    q.push(rr);
                                })
                        })
                    })
                });
                return q;
            },
            getMaxValue: function () {
                var g = $filter('groupBy')($scope.checklist.checklist_page_guides, 'key');
                var r = {
                    '': 1
                };
                Object.keys(g).filter(function (key) {
                    return key.toString() !== 'سوال باز';
                }).map(function (key) {
                    r[key] = key.toString() === 'کیفی' ? g[key].length : (key.toString() === 'دوسطحی' ? 1 : g[key][g[key].length - 1]['value']);
                });

                return r;
            },
            getQuestionType: function (q) {
                var resualt = $scope.checklist.checklist_page_questions.find(function (qq) {
                    return qq.key == q;
                })
                return resualt ? resualt.point_type : '';
            },
            getQuestionByAnswer: function (ward_id) {

                var questions = angular.copy(this.getQuestions());
                var isAll2Level = questions.every(function (q) {
                    var t = q.point_type;

                    return t === 'سوال باز' || t === 'دوسطحی';
                });
                if (!isAll2Level) {
                    questions = questions.filter(function (q) {
                        var t = q.point_type;
                        return t !== 'سوال باز' && t !== 'دوسطحی';
                    })
                } else {
                    questions = questions.filter(function (q) {
                        var t = q.point_type;
                        return t !== 'سوال باز';
                    })
                }


                return questions;
            },
            setAnswers: function (ward_id) {
                var self = this;
                var resualt = [];
                var questions = [];
                var max = 0;
                switch (this.index) {
                    case 1:
                        questions = self.getQuestionByAnswer(ward_id);
                        max = this.getMaxValue();
                        $scope.checklist.checklist_page_questions.map(function (q, i) {
                            var qq = $filter('filter_by')(questions, 'question', q.key);
                            //console.log(qq)
                            if (self.filter.selected_monthes.length) {
                                qq = qq.filter(function (ans) {
                                    return self.filter.selected_monthes.find(function (m) {

                                        switch ($scope.checklist.delivery_type) {
                                            case 'روزانه':
                                                return m === ans.detail.submitted_at;
                                            case 'ماهانه':
                                                return m === $filter('persianMonth')(ans.detail.submitted_at);
                                            case 'هفتگی':
                                                return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                            case 'سه ماه یکبار':
                                                return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                            case 'شش ماه یکبار':
                                                return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                            case 'سالانه':
                                                return m == $rootScope.year;
                                            default :
                                                return false;

                                        }
                                    });
                                });
                            }
                            if (ward_id) {
                                qq = $filter('filter_by')(qq, 'detail.ward_id', ward_id);
                            }
                            /*  if(self.calender_type !== $scope.checklist.delivery_type){

                                console.log(qq)
                                qq=qq.filter(function (a) {
                                    var n=$scope.getEqualSubmitedAt(a.detail.submitted_at,$scope.checklist.delivery_type,self.calender_type);
                                    console.log(n)
                                })
                               /!* qq=$filter('filter_by')(qq,'detail.ward_id',ward_id);*!/
                            }*/
                            if (qq && qq.length) {
                                var sum = qq.reduce(function (a, b) {
                                    return {'v': $scope.operator['+'](a['v'], b['v'])};
                                }, 0)['v'];
                                var m = (sum / (qq.length * max[q.point_type])) * 100;
                                var res = {label: 'سوال ' + (i + 1), tooltip: q.key, point: angular.copy(m.toFixed(2))};

                                resualt.push(res);
                            } else {
                                resualt.push({label: 'سوال ' + (i + 1), tooltip: q.key, point: '-'});
                            }

                        });
                        break;
                    case 2:
                        questions = self.getQuestionByAnswer(ward_id);
                        max = this.getMaxValue();
                        var components = $filter('groupBy')($scope.checklist.checklist_page_questions, 'component');
                        Object.keys(components).map(function (c) {
                            var point = [];
                            components[c].map(function (q) {
                                var qq = $filter('filter_by')(questions, 'question', q.key);
                                if (self.filter.selected_monthes.length) {
                                    qq = qq.filter(function (ans) {
                                        return self.filter.selected_monthes.find(function (m) {

                                            switch ($scope.checklist.delivery_type) {
                                                case 'روزانه':
                                                    return m === ans.detail.submitted_at;
                                                case 'ماهانه':
                                                    return m === $filter('persianMonth')(ans.detail.submitted_at);
                                                case 'هفتگی':
                                                    return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                                case 'سه ماه یکبار':
                                                    return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                                case 'شش ماه یکبار':
                                                    return m === $filter('persianNum')(ans.detail.submitted_at, true);
                                                case 'سالانه':
                                                    return m == $rootScope.year;
                                                default :
                                                    return false;

                                            }
                                        });
                                    });
                                }
                                if (ward_id) {
                                    qq = $filter('filter_by')(qq, 'detail.ward_id', ward_id);
                                }
                                if (qq && qq.length) {
                                    var sum = qq.reduce(function (a, b) {
                                        return {'v': $scope.operator['+'](a['v'], b['v'])};
                                    }, 0)['v'];
                                    var m = (sum / (qq.length * max[q.point_type])) * 100;
                                    point.push(angular.copy(m.toFixed(2)));
                                }
                            });
                            var middel = point.reduce(function (a, b) {
                                return $scope.operator['+'](a, b);
                            }, 0) / point.length;
                            resualt.push({label: c, point: angular.copy(middel.toFixed(2))})
                        })
                        break;
                    case 3:
                        questions = self.getQuestionByAnswer(ward_id);
                        max = this.getMaxValue();
                        var qq = angular.copy(questions);

                        var total = 0;
                        /*if(ward_id){
                            qq=$filter('filter_by')(qq,'detail.ward_id',ward_id);
                        }*/
                        if (qq && qq.length) {
                            var ggq = $filter('groupBy')(qq, 'question');

                            Object.keys(ggq).map(function (key) {
                                var c = ggq[key];
                                var sum = c.reduce(function (a, b) {
                                    return {'v': $scope.operator['+'](a['v'], b['v'])};
                                }, 0)['v'];
                                var m = (sum / (c.length * max[c[0]['point_type']])) * 100;

                                total = $scope.operator['+'](m.toFixed(2), total);
                            })
                            total = (total / Object.keys(ggq).length).toFixed(2);

                            /* var sum=qq.reduce(function (a, b) {
                                return {'v': $scope.operator['+'](a['v'], b['v'])};
                            },0)['v'];
                            var m=(sum/(qq.length*max[qq[0]['point_type']]))*100;
                            total=m.toFixed(2);*/
                        }
                        var g = $filter('groupBy')(questions, 'detail.ward_id');


                        Object.keys(g).map(function (w) {
                            var w_name = $scope.get_ward_name(w, $scope.wards);
                            var t = 0;
                            qq = $filter('filter_by')(questions, 'detail.ward_id', w);


                            if (qq && qq.length) {
                                var ggq = $filter('groupBy')(qq, 'question');

                                Object.keys(ggq).map(function (key) {
                                    var c = ggq[key];
                                    var sum = c.reduce(function (a, b) {
                                        return {'v': $scope.operator['+'](a['v'], b['v'])};
                                    }, 0)['v'];
                                    var m = (sum / (c.length * max[c[0]['point_type']])) * 100;

                                    t = $scope.operator['+'](m.toFixed(2), t);
                                })
                                t = (t / Object.keys(ggq).length).toFixed(2);

                                /*var sum=qq.reduce(function (a, b) {
                                    return {'v': $scope.operator['+'](a['v'], b['v'])};
                                },0)['v'];
                                var m=(sum/(qq.length*max[qq[0]['point_type']]))*100;
                                t=m.toFixed(2);*/

                            }
                            resualt.push({label: w_name, point: t, total: total})
                        })
                        break;
                    case 4:
                        // var qq = angular.copy(questions);
                        questions = [];
                        $scope.checklist.checklist_page_answers.map(function (answer) {
                            answer.checklist_page_answers.map(function (ans) {
                                ans.checklist_page_answer_details.map(function (detail) {
                                    questions.push(detail)
                                });
                            });
                        });
                        var g = $filter('groupBy')(questions, 'ward_id');

                        Object.keys(g).map(function (w) {
                            var w_name = $scope.get_ward_name(w, $scope.wards);
                            resualt.push({label: w_name || 'ناشناس', point: g[w].length.toString()})

                        });
                        break;

                }

                return resualt;
            },
            setChart: function (_answers) {
                var answers = angular.copy(_answers);
                var self = this;
                var multi_answers = [];
                self.message_chart = '';
                self.series = ['کل بیمارستان'];
                self.colors = ['#0fa707'];
                self.data_set = [{
                    borderWidth: 0,
                    backgroundColor: '#0fa707',
                    borderColor: '#0fa707',
                }];
                self.chart_type = '';
                self.data_chart = [];
                self.labels_chart = [];
                self.chart_table = null;
                if (self.filter.selected_date) {
                    this.calender_type = self.filter.selected_date;
                } else {
                    this.calender_type = angular.copy($scope.checklist.delivery_type);
                }
                answers = answers ? answers : (this.index ? this.setAnswers() : setAnswers(set_calender(this.calender_type)));

                if (this.filter.selected_wards.length) {
                    self.data_chart = $scope.new_Array(this.filter.selected_wards.length + 1, []);
                    multi_answers[0] = angular.copy(answers);

                    self.chart_table = {};
                    self.filter.selected_wards.map(function (ward, i) {
                        var color = angular.copy($scope.set_color(i, self.colors));
                        self.colors.push(color);
                        self.data_set[i + 1] = {
                            borderWidth: 0,
                            backgroundColor: color,
                            borderColor: color
                        }
                        var w = angular.copy($scope.get_ward_name(ward, $scope.wards));
                        self.series.push(w);
                    });
                }
                if (multi_answers.length) {

                    //multi_answers[1]=setAnswers(this.calender_type,this.filter.selected_wards);
                    self.filter.selected_wards.map(function (ward, i) {
                        var w = self.series[i + 1];
                        var d = self.index ? self.setAnswers(ward) : setAnswers(set_calender(self.calender_type, ward));

                        multi_answers.push(angular.copy(d));
                        if (!d.length) {
                            d = multi_answers[0].map(function (dd) {
                                return {value: '-'}
                            });
                        }
                        self.chart_table[w] = d.map(function (dd) {

                            return {value: dd.point ? dd.point.replace('%', '') : '-'}
                        })
                    });
                    self.chart_table['کل بیمارستان'] = angular.copy(multi_answers[0].map(function (dd) {
                        return {value: dd.point ? dd.point.replace('%', '') : '-'}
                    }));
                    self.series.map(function (w, s) {
                        if (s) {
                            var key = 'اختلاف ' + w + ' با کل بیمارستان';
                            self.chart_table[key] = self.chart_table[w].map(function (v, i) {
                                return {value: v.value != '-' && self.chart_table['کل بیمارستان'][i]['value'] != '-' ? (v.value - self.chart_table['کل بیمارستان'][i]['value']).toFixed(2) : '-'};
                            })
                        }


                    });

                }

                if (this.index) {

                    if (self.index === 3) {
                        self.data_chart = [[], []]
                        self.data_chart[0] = []
                        self.data_chart[1] = []
                    }
                    if (self.index === 1) {
                        if (multi_answers.length) {
                            answers = angular.copy($scope.checklist.checklist_page_questions);
                        }
                    }
                    if (self.index === 2 && answers.length === 1) {
                        self.message_chart = 'برای این چک لیست حیطه / اجزا تعریف نشده است';
                        return false;
                    }
                    self.labels_chart = answers.map(function (ans, index) {
                        if (multi_answers.length) {
                            multi_answers.map(function (multi_answer, i) {
                                var data001 = null;
                                data001 = multi_answer.find(function (a) {
                                    if (a.tooltip) {
                                        return a.tooltip === ans.key
                                    } else {
                                        return a.label === ans.label;
                                    }

                                });
                                self.data_chart[i].push(angular.copy(data001 && data001.point ? parseFloat(data001.point.replace('-', '')) : ''))

                            });
                        } else {
                            if (self.index === 3) {
                                self.data_chart[0].push($scope.total.counter ? ($scope.total.value / $scope.total.counter).toFixed(2) : '-');
                                self.data_chart[1].push(ans.point);


                            } else {

                                self.data_chart.push(ans.point ? parseFloat(ans.point.replace('-', '')) : ans.point)
                            }
                        }
                        return self.index === 1 ? 'سوال ' + (index + 1) : ans.label
                    })
                    self.chart_type = 'chart-bar';
                    if (self.index === 3) {
                        self.chart_table = null;
                    }
                } else {

                    self.chart_type = 'chart-bar';
                    self.labels_chart = self.getIntervalLabels();

                    self.labels_chart.map(function (interval) {
                        if (multi_answers.length) {
                            multi_answers.map(function (value, i) {
                                var data = value.find(function (a) {
                                    return a.interval_name.toString() === interval.toString().replace(' ' + a.interval_perfix + ' ', '');
                                });
                                self.data_chart[i].push(data && data.point ? parseFloat(data.point.replace('%', '')) : '');
                            })

                        } else {
                            var data = answers.find(function (a) {
                                return a && interval && a.interval_name.toString() === interval.toString().replace(' ' + a.interval_perfix + ' ', '');
                            });

                            self.data_chart.push(data && data.point ? parseFloat(data.point.replace('%', '')) : '');
                        }

                    })

                    if (self.labels_chart.length > 52) {
                        var data = angular.copy(self.data_chart);
                        self.labels_chart = self.labels_chart.filter(function (interval, i) {

                            if (self.data_chart[i] !== '') {
                                return true;
                            } else {
                                if (Array.isArray(self.data_chart[i])) {
                                    if (self.data_chart[i].every(function (itm) {
                                        return itm === '-';
                                    })) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        });
                        self.data_chart = angular.copy(data.filter(function (itm) {
                            return itm !== "";
                        }));
                    }
                }


            },
            changeChart: function () {
                var self = this;
                this.index = this.report_types.indexOf(this.report_type);
                this.dates = this.getDatesOptions();
                this.components = angular.copy(Object.keys($filter('groupBy')($scope.checklist.checklist_page_questions, 'component')).filter(function (key) {
                    return key && key != '' && key != 'default'
                }).map(function (c) {
                    return {checked: false, name: c}
                }));
                this.months = angular.copy(this.getIntervalLabels($scope.checklist.delivery_type)).map(function (m) {
                    return {name: m, checked: false}
                });
                this.wards = angular.copy($scope.wards);
                this.calender_type = angular.copy($scope.checklist.delivery_type);
                $scope.reset_params($scope.charts.filter);

                this.setChart(this.index ? null : setAnswers(set_calender(this.calender_type)));

                this.show_chart = false;
                $timeout(function () {
                    self.show_chart = true;
                }, 100)
            }

        }
        $scope.reset_params($scope.charts.filter);
        $scope.charts.report_type = '';
        $scope.charts.show_chart = false;
        $scope.open_modal('lg', 'charts.html', null, null, 'only_content full_width', $scope);
    }
    $scope.getValueOfQuestion = function (details, q) {
        var res = details.find(function (d) {
            return d.question === q.key;
        });
        return res ? res.value : '-';
    }
    $scope.detail_report = function (row) {

        var all_answers=[].concat(angular.copy(row.temp_answers_data),angular.copy(row.answers_data));
        $scope.detail_recordes = $filter('orderObjectBy')(angular.copy(all_answers), 'created_at');
        $scope.isMultiWards = row.wards.length > 1;
        $scope._wards = row.wards;
        var _users =  row.users.map(function (ans) {
            return $scope.get_user(ans, $scope.all_users);
        });
        $scope.report_users = $filter('unique')(_users, 'id');

        $scope.questions = $scope.checklist.checklist_page_questions;

        $scope.questions.map(function (q) {
            q.middel = get_AVG_by_question(q);
        })
        question_groupted = $filter('groupBy')($scope.questions, 'point_type');
        $scope.types = Object.keys(question_groupted);

        $scope.filter.ward_id = '';
        $scope.filter.user_id = '';
        $scope.filter._from = '';
        $scope.filter._to = '';

        $scope.open_modal('lg', 'detail_recordes.html', null, null, 'blue_modal full_width', $scope);
    }
    $scope.chooseUsers = function () {
        var arr = [];
        var obj = $scope.check_list.wards ? $scope.check_list.wards.map(function (itm) {
            return itm.operator;
        }) : []
        arr = angular.copy($scope.all_users);
        var partners = angular.copy(obj);
        if (partners) {
            partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    partners.forEach(function (p) {
                        if (obj.id == p) {

                            itm.users[itm.users.indexOf(obj)].checked = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                obj = r.map(function (itm) {
                    return itm.id;
                });
                if (!$scope.check_list.wards) {
                    $scope.check_list.wards = []
                }
                if ($scope.check_list.wards.length > 0) {
                    $scope.check_list.wards = $scope.check_list.wards.filter(function (itm) {
                        return obj.indexOf(itm.operator) >= 0;
                    });

                }
                obj.map(function (u) {
                    if (!$scope.check_list.wards.find(function (w) {
                        return w.operator == u;
                    })) {
                        $scope.check_list.wards.push({
                            operator: u,
                            delivery_type: angular.copy($scope.check_list.delivery_type)
                        })
                    }
                })
            }
        });
    }
    $scope.addComponet = function () {
        $scope.check_list.components.push({title: ""});
    };
    $scope.getStyleThis = function (id) {

        var element = angular.element("#" + id);
        var parent = element.parent();
        var h = parent.css('height');
        var hh = h.replace("px", '');
        element.css({'width': h, 'right': -((hh / 2) - 32.5) + "px"});
    };
    $scope.show_amar = function (row, day) {
        var row_copy = angular.copy(row);
        var answers = [];
        if ($scope.checklist_page_form_ward.delivery_type === 'روزانه') {

            row_copy.submitted_at = row.days_object[day].submitted_at;
            row_copy.day = $filter('persianNum')(day + 1, true);
            row_copy.answer = row.days_object[day].answer;
            row_copy.status_class = row.days_object[day].status_class;
            row_copy.className = row.days_object[day].className;
        }

        $scope.indicator_answer_details.map(function (itm, i) {

            if (itm.submitted_at == row_copy.submitted_at) {
                $scope.index_of_submitted = i;
                answers = itm.checklist_page_answer_details;
            }
        });

        $scope.answer_chart.data_chart = [];
        $scope.answer_chart.labels_chart = [];
        var all_questions = [];
        var questions = [];
        answers.map(function (itm) {
            if (itm.checklist_page_answer_detail_records)
                itm.checklist_page_answer_detail_records.map(function (record) {
                    record.user_name = itm.name;

                    all_questions.push(record);


                    record.user_type = itm.user_type;
                });
        });
        var uniqued = $filter('unique')(all_questions, 'question');

        $scope.answer_chart.labels_chart = uniqued.map(function (itm, i) {
            var j = i + 1;
            $scope.answer_chart.data_chart[i] = 0;
            var count = 0;
            questions[i] = [];
            all_questions.map(function (answer) {
                if (answer.question === itm.question) {
                    count++;
                    questions[i].push(answer);
                    $scope.answer_chart.data_chart[i] = $scope.operator['+']($scope.answer_chart.data_chart[i], answer.value.replace(/[^-0-9\.]/g, '') == answer.value && parseFloat(answer.value) != undefined ? answer.value : answer.v);

                }
            });
            $scope.answer_chart.data_chart[i] = ($scope.answer_chart.data_chart[i] / count).toFixed(2);
            return 'سوال' + j;
        });
        $scope.answer_chart.options.tooltips.custom = function (tooltipModel) {
            var title = [];
            if (tooltipModel.dataPoints && tooltipModel.dataPoints.length) {
                var q = questions[tooltipModel.dataPoints[0].index];
                if (q && q.length) {
                    title = q.map(function (itm) {
                        return itm.user_name + (itm.user_type ? '(' + itm.user_type + ')' : '') + ': ' + itm.value;
                    });
                }

            }
            tooltipModel.title = title.length ? title : ['پاسخی برای این سوال ثبت نشده است.'];

            if (tooltipModel.xAlign === 'right') {
                tooltipModel.x = title[0] === 'پاسخی برای این سوال ثبت نشده است.' ? tooltipModel.x - ((480 - tooltipModel.width) / 2) : tooltipModel.x - ((260 - tooltipModel.width) / 2);
            }

            tooltipModel.width = title[0] === 'پاسخی برای این سوال ثبت نشده است.' ? 260 : 150;
            if (tooltipModel.yAlign === 'center' && title.length > 1) {
                tooltipModel.y = tooltipModel.y - ((title.length - 1) * 5);
            }
            tooltipModel.height = tooltipModel.height + ((title.length - 1) * 15);

        }
        $scope.amar_view = true;
    };
    $scope.back_amar_view = function () {
        $scope.amar_view = false;
    };
    $scope.show_detail_checklist = function (row) {

        $scope.checklist = angular.copy(row);
        var darsadi = false;
        if ($scope.checklist.checklist_page_questions) {
            $scope.checklist.checklist_page_questions.find(function (q) {
                if (q.point_type === 'درصدی') {
                    darsadi = true;
                }
            })
        }
        $scope.checklist.darsadi = darsadi;
        $scope.calenders = [];
        $scope.total = {
            value: 0,
            wards: [],
            count: 0,
            counter: 0
        };
        var _users = row.checklist_page_answers.map(function (ans) {
            return $scope.get_user(ans.operator, $scope.all_users);
        });
        $scope._users = $filter('unique')(_users, 'id');
        $scope.calenders = angular.copy(set_calender());
        /*$scope.answer_chart = {
            labels_chart: [],
            colors_chart: [
                {
                    fill: true,
                    fillColor: '#b2f1e4',
                    pointBackgroundColor: '#97d1c5',
                    pointHoverBackgroundColor: '#5f857b',
                    pointBorderColor: '#a9e6d9',
                    backgroundColor: "#fff",
                    pointHoverBorderColor: "#fff",
                    borderColor: '#7cb8a2'
                }],
            data_chart: [],
            data_set: {
                borderColor: '#1c94e0',
                pointRadius: 6,
                pointHoverRadius: 11
            },
            options: {
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50
                    }
                },
                tooltips: {
                    titleFontSize: 14,
                    bodyFontSize: 15,
                    /!*  custom: function(tooltipModel) {
                     var title=[];
                     if(tooltipModel.dataPoints && tooltipModel.dataPoints.length){
                     if($scope.all_held_sessions.length && tooltipModel.dataPoints[0].yLabel){
                     $scope.all_held_sessions.forEach(function (itm) {
                     if(moment(itm.date).jMonth()===tooltipModel.dataPoints[0].index)
                     title.push($scope.get_day(itm.date)+' '+$scope.get_date(itm.date,'full_date').replace($rootScope.year,''));

                     });
                     }else{
                     title=['در این ماه هیچ جلسه‌ای برگذار نشده است.'];
                     }
                     }
                     tooltipModel.title=title.length?title:['در این ماه هیچ جلسه‌ای برگذار نشده است.'];

                     if(tooltipModel.xAlign==='right'){
                     tooltipModel.x=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?tooltipModel.x-((480-tooltipModel.width)/2):tooltipModel.x-((260-tooltipModel.width)/2);
                     }

                     tooltipModel.width=title[0]==='در این ماه هیچ جلسه‌ای برگذار نشده است.'?260:150;
                     if(tooltipModel.yAlign==='center' && title.length>1){
                     tooltipModel.y=tooltipModel.y - ((title.length-1)*5);
                     }
                     tooltipModel.height=tooltipModel.height+((title.length-1)*15);

                     }*!/
                },
                scaleShowGridLines: false,
                elements: {line: {tension: 0, fill: false}}, scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 10,
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'سوالات',
                            fontSize: 11
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: 9,
                            suggestedMin: 31,
                            min: 0,
                            stepSize: 1,
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'میانگین نظرات',
                            fontSize: 11
                        }
                    }]

                }
            }
        };
        $scope.amar_view = false;
        console.log(row)
        $scope.indicator_answer_details = angular.copy(row.checklist_page_answers);
        $scope.checklist_page_form_ward = angular.copy(row);
        set_calender();
        $scope.gozaresh_amari_ = $scope.open_modal('lg', 'gozaresh.html', null, null, 'blue_modal full_width', $scope);*/
        $scope.open_modal('lg', 'calenderView.html', null, null, 'only_content full_width', $scope);
    };
    $scope.show_detail_of_answer = function (row) {
        $scope.indicator_answer_detail_records = row.checklist_page_answer_detail_records;
        $scope.indicator_answer_details_ = $scope.open_modal('lg', 'indicator_answer_details.html', null, null, 'full_width only_content', $scope);
    };
    $scope.close_gozaresh = function () {
        $scope.gozaresh_amari_.dismiss();
    };
    $scope.add_ch_q = function (currentComponent) {

        $scope.check_list.questions.push({key: '', point_type: '', checked: true, component: currentComponent})
    };
    $scope.add_guid = function () {
        if ($scope.point_type.selected) {
            $scope.point_type.guides.push({key: '', value: '', point_type: angular.copy($scope.point_type.selected)})
        }
    };
    $scope.add_ward = function () {
        $scope.check_list.wards.push({
            ward_id: "",
            operator: "",
            delivery_type: ""
        })
    };
    $scope.toggle_compilation_checklist = function () {
        if ($scope.compilation_checklist) {
            $scope.compilation_checklist = false;
            $scope.check_list.id = null;

        } else {

            $scope.compilation_checklist = true;
            $scope.reset_params($scope.check_list);
            $scope.reset_params($scope.point_type);
            resetAnswers();
            $scope.add_ward();
            $scope.direction = 1;
            $scope.CurrentStep = 0;
        }
    };
    $scope.pointTypeChanged = function () {
        if ($scope.point_type.selected == 'دوسطحی') {
            var dosathi = $scope.point_type.guides.filter(function (itm) {
                return itm.point_type == 'دوسطحی';
            })
            if (dosathi.length !== 2) {
                $scope.add_guid();
                $scope.add_guid();
            }
        }
    };
    $scope.next = function () {

        if ($scope.check_list.questions && $scope.check_list.questions.length) {
            $scope.check_list.questions = $scope.check_list.questions.filter(function (itm) {
                if ($scope.check_list.has_component) {

                    if (itm.checked && itm.key && itm.key.length && itm.component.length) {
                        return true
                    } else {
                        deleteQuestion(itm);
                        return false
                    }

                }
                if (itm.checked && itm.key && itm.key.length) {
                    return true
                } else {
                    deleteQuestion(itm);
                    return false
                }
            });
        }
        if ($scope.CurrentStep === 0) {
            if (!$scope.check_list.components.length) {
                $scope.addComponet();
                $scope.add_ch_q('');
            } else {
                if ($scope.check_list.has_component && $scope.check_list.components.length === 1) {
                    $scope.warning('درصورتی که چک لیست شما تنها "از یک حیطه" تشکیل شده است، شما مجاز به وارد کردن تنها یک حیطه "نمی باشد". لطفاً درصورت تک حیطه بودن به سؤال اول به صورت "خیر" پاسخ دهید.')
                    return false;
                }
            }
            if ($scope.check_list.title && $scope.check_list.title.length) {
                if ($scope.check_list.number && $scope.check_list.number.length) {
                    if ($scope.check_list.goal && $scope.check_list.goal.length) {
                        if ($scope.check_list.has_component) {
                            $scope.check_list.components = $scope.check_list.components.filter(function (itm) {
                                return itm.title && itm.title.length;
                            });
                            if (!$scope.check_list.components.length) {
                                $scope.warning('لطفاً اجزا چک لیست را وارد کنید.');
                                return false;
                            }

                        }

                    } else {
                        $scope.warning('لطفاً هدف چک لیست را وارد کنید.');
                        return false;
                    }
                } else {
                    $scope.warning('لطفاً شماره چک لیست را وارد کنید.');
                    return false;
                }
            } else {
                $scope.warning('لطفاً عنوان چک لیست را وارد کنید.');
                return false;
            }
        } else if ($scope.CurrentStep == 1) {
            if (!$scope.check_list.questions.length) {
                $scope.warning('لطفاً سوالات چک لیست را تعریف نمایید.');
                return false;
            }
            var q = $scope.check_list.questions.filter(function (itm) {
                return itm.point_type && itm.point_type.length;
            });
            if (q.length != $scope.check_list.questions.length) {
                $scope.warning('لطفاً نوع امتیاز دهی را برای تمامی سوالات مشخص کنید.');
                return false;
            }
            $scope.question_points = $filter('groupBy')($filter('filter_by')($scope.check_list.questions, 'point_type', 'سوال باز', true), 'point_type');
            console.log($scope.question_points)
        } else if ($scope.CurrentStep == 2) {
            var isAll = $scope.point_type.guides.length && $scope.point_type.guides.every(function (itm) {
                return itm.key != null && itm.key.toString().length;
            });
            if (isAll) {

            } else {
                $scope.warning('لطفاً مقادیر امتیازات را تعیین نمایید.');
                return false;
            }
        } else if ($scope.CurrentStep == 3) {

            var isAll = $scope.check_list.wards.every(function (itm) {
                return itm.operator && itm.delivery_type;
            });
            if (isAll) {

            } else {
                $scope.warning('لطفاً بخش های مورد استفاده، مسئول تکمیل چک لیست در هر بخش و تاریخ تحویل آن را مشخص فرمایید.');
                return false;
            }
            setGuides();
        }

        var step = angular.copy($scope.CurrentStep);
        $scope.CurrentStep++;
        setDir(step);

    };
    $scope.last = function () {
        if ($scope.CurrentStep) {
            var step = angular.copy($scope.CurrentStep);
            $scope.CurrentStep--;
            setDir(step);
        }
    };
    $scope.getDetail = function (row) {
        var res = '';
        if (row) {
            res = $scope.detail_answer.menuItems.find(function (m) {
                return m.answerer_info_menu_item_id == row.id
            })
        }
        return res ?(res.value==='' || res.value === null ?'-':(row.item_type==='SelectUser'?$scope.get_person(res.value,$scope.all_users,true):(row.item_type==='TimePicker'?$scope.get_time(res.value):res.value))):'-';
    }
    $scope.showAnswerDetail = function (row) {
        $scope.menuItem2 = $scope.checklist.menu_items && $scope.checklist.menu_items.length ? angular.copy($scope.checklist.menu_items) : [];
        $scope.detail_answer = {
            ward: $scope.get_ward_name(row.ward_id, $scope.wards),
            questions: $scope.checklist.checklist_page_questions.map(function (q) {
                var answer = row.checklist_page_answer_detail_records.find(function (r) {
                    return r.question === q.key;
                });
                var qq = angular.copy(q);
                qq.answer = answer ? answer.value : '';
                return qq;
            }),
            menuItems: row.checklist_page_answer_detail_infos || []
        };
        var max = 1;
        var guides=$filter('groupBy')($scope.checklist.checklist_page_guides,'key');
        var questions=angular.copy($scope.checklist.checklist_page_questions);
        var answers={};
        $scope.checklist.checklist_page_answers.map(function (c) {
            c.checklist_page_answers.map(function (checklist_page_answer) {
                if(checklist_page_answer.checklist_page_answer_details){
                    if(!answers[checklist_page_answer.submitted_at]){
                        answers[checklist_page_answer.submitted_at]=[]
                    }
                    answers[checklist_page_answer.submitted_at]=answers[checklist_page_answer.submitted_at].concat(checklist_page_answer.checklist_page_answer_details)
                }

            })
        });
        var all2level=questions.every(function (q) {
            return q.point_type==='سوال باز' || q.point_type==='دوسطحی'
        });

        function get_question_type(q){
            var question =questions.find(function (qq) {
                return qq.key===q
            });
            return question ?question.point_type:'';
        }
        $scope.current_checklist_value=0;
        if(row.checklist_page_answer_detail_records){
            var value=0;
            var counter=0;
            row.checklist_page_answer_detail_records.map(function (record) {
                var question_type=get_question_type(record.question);
                if(question_type==='کیفی' || question_type=== 'عددی' || question_type==='درصدی' || all2level){
                    if (question_type === 'کیفی') {
                        max = guides[question_type].length;
                    } else if (question_type === 'عددی' || question_type === 'درصدی') {
                        max = guides[question_type][guides[question_type].length - 1].value;
                    }
                    counter++;
                    value = operator['+'](record.v, value);
                }
            });
            $scope.current_checklist_value=counter ? ((value / (counter * max)) * 100).toFixed(2) : 0;
        }
        $scope.open_modal('lg', 'detail_answers.html', null, null, 'only_content full_width', $scope);
    }
    $scope.changeComponentTitle = function (component) {
        $scope.check_list.questions.map(function (itm) {
            if (itm.component_id === component._id) {
                itm.component = component.title;
            }
        })
    }
    $scope.getMiddle = function (data, index) {
        /*questions[parentIndex]?questions[parentIndex].middel:'-'*/

        var res = $scope.questions.find(function (q) {
            return q.key === data.key;
        })

        return res ? res.middel : '-'
    }
    $scope.user_checklist = function (row) {
        console.log(row);
        var arr = [];
        var selected_users = [];
        var delivery_type = '';
        var obj = row.checklist_page_wards.map(function (w) {
            if (!delivery_type) {
                delivery_type = w.delivery_type;
            }
            return w.operator;
        });
        arr = angular.copy($scope.all_users);
        var partners = angular.copy(obj);
        if (partners) {
            partners = angular.isArray(partners) ? partners : partners.substring(0, partners.length - 1).split('-');
            arr.forEach(function (itm) {
                itm.users.forEach(function (obj) {
                    partners.forEach(function (p) {
                        if (obj.id == p) {
                            selected_users.push(p);
                            itm.users[itm.users.indexOf(obj)].checked = true;

                            itm.users[itm.users.indexOf(obj)].readonly = true;
                        }
                    });

                });
            });
        }
        var result = $scope.open_modal('lg', BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
            users: function () {
                return arr;
            }
        }, 'blue_modal', $scope, true);
        result.result.then(function (r) {
            if (r) {
                var wards = r.map(function (itm) {
                    return {operator: itm.id, ward_id: null, delivery_type: delivery_type};
                });

                wards = wards.filter(function (u) {
                    return selected_users.indexOf(u.operator.toString()) === -1;
                })
                console.log(wards, selected_users)
                if (wards.length) {
                    factory1.postUserApi('/v1/user/hospital/checklist/ward', JSON.stringify({
                        id: row._id,
                        wards: wards,
                        year: $rootScope.year
                    })).then(function () {
                        $scope.success_alert('افراد انتخاب شده به مسئولین جمع آوری افزوده شد.');
                        getCheckList();
                    })
                }


            }
        });
    }

    function saveCheckList(save) {
        setGuides();
        var guides = [];
        var wards = [];
        var questions = $scope.check_list.questions.filter(function (itm) {
            return itm.checked && itm.key !== '';
        });
        if (!$scope.question_points || !Object.keys($scope.question_points).length) {
            if ($scope.check_list.has_component) {
                $scope.check_list.components.map(function (com) {
                    $scope.add_ch_q(com.title);
                });
                $scope.question_points = $filter('groupBy')($filter('filter_by')($scope.check_list.questions, 'point_type', 'سوال باز', true), 'point_type');
                questions = angular.copy($scope.check_list.questions);
            }
        }
        for (var key in $scope.question_points) {
            if ($scope.question_points.hasOwnProperty(key)) {
                guides = guides.concat.apply(guides, $scope.question_points[key][0].guides ? $scope.question_points[key][0].guides.map(function (data) {
                    return {
                        key: data.point_type,
                        value: data.key,
                        guide: data.value
                    }

                }) : []);
            }
        }
        if ($scope.check_list.is_public) {
            var ward = $scope.wards.find(function (w) {
                return w.name === 'بخش ناشناس';
            })
            wards = [{ward_id: ward._id, operator: null, delivery_type: $scope.check_list.delivery_type}]
        } else {
            wards = $scope.check_list.wards.filter(function (itm) {
                return itm.operator !== '';
            });
        }

        if (!save) {
            console.log($scope.check_list);
            if (!wards.length) {
                $scope.warning('لطفاً مسئولین را بدرست انتخاب کنید.');
                return false;
            } else if (!questions.length) {
                $scope.warning('لطفاً سوالات مورد نظر را طراحی کنید.');
                return false;
            }
        }
        var menu_items=$scope.menuItems.filter(function (itm) {
            return itm.checked;
        }).map(function (itm) {
            return itm.id;
        });
        var required_answer_items=$scope.menuItems.filter(function (itm) {
            return itm.checked && itm.req;
        }).map(function (itm) {
            return itm.id;
        });
        var params = {
            required_answer_items:required_answer_items,
            title: $scope.check_list.title,
            number: $scope.check_list.number,
            goal: $scope.check_list.goal,
            is_public: $scope.check_list.is_public,
            questions: questions,
            guides: guides,
            wards: wards,
            save: save,
            has_component: $scope.check_list.has_component,
            components: $scope.check_list.components,
            year: $rootScope.year,
            certificate: certificate,
            mehvar: mehvar,
            mehvar_icon: mehvar_icon,
            has_info: $scope.check_list.has_info,
            menu_items: menu_items
        };
        if ($scope.check_list.id) {
            params.id = $scope.check_list.id;
        }
        factory1.postUserApi('/v1/user/hospital/checklist', JSON.stringify(params)).then(function (data) {
            resetAnswers();
            if ($scope.check_list.id) {
                $scope.checkLists[$scope.indexOfChecklist] = data;
                $scope.check_list.id = null;
            } else {
                $scope.checkLists.push(data);
            }

            serilizeCheckLists($scope.checkLists);
            $scope.toggle_compilation_checklist();
        });
    }

    $scope.save_check_list = function (save) {
        if (!save) {
            $scope.question('آیا از ثبت و ارسال چک لیست مورد نظر به مسئولین جمع آوری مطمئن هستید؟', 'ارسال چک لیست').result.then(function (r) {
                if (r) {
                    saveCheckList(save);
                }
            });
        } else {
            saveCheckList(save);
        }


    };
    $scope.delete_checklist = function (row) {
        $scope.question('آیا از حذف چک لیست مورد نظر مطمئن هستید؟', 'حذف چک لیست').result.then(function (r) {
            if (r) {
                var indexOfChecklist = $scope.checkLists.indexOf(row);
                var id = row._id;
                factory1.deleteUserApi('/v1/user/hospital/checklist/' + id).then(function (data) {
                    $scope.checkLists.splice(indexOfChecklist, 1);
                    indexOfChecklist = -1;
                });
            }
        })
    };
    $scope.edit_checklist = function (row) {
        $scope.toggle_compilation_checklist();
        $scope.indexOfChecklist = $scope.checkLists.indexOf(row);
        var copy_row = row.check_list ? angular.copy(row.check_list) : angular.copy(row);
        for (var key in $scope.check_list) {
            if ($scope.check_list.hasOwnProperty(key)) {
                if (copy_row[key]) {
                    $scope.check_list[key] = copy_row[key];
                } else if (copy_row['checklist_page_' + key]) {
                    $scope.check_list[key] = copy_row['checklist_page_' + key];
                }
            }
        }
        console.log($scope.check_list.components)
        $scope.check_list.questions.map(function (itm) {
            itm.checked = true;
            if (itm.component) {
                var itm_component = angular.copy(itm.component);
                itm.component = itm.component
                    .replace(new RegExp('ي'), 'ی')
                    .replace(new RegExp('لیاظ'), 'لحاظ')
                    .replace(new RegExp('تیت'), 'تحت')
                    .replace(new RegExp('میوری'), 'محوری')
                    .replace(new RegExp('تیقق'), 'تحقق')
                    .replace(new RegExp('مییط'), 'محیط')
                    .replace(new RegExp('ِ'), '')
                    .replace(new RegExp('ُ'), '')
                    .replace(new RegExp('َ'), '')
                    .replace(/\s/g, '')
                    .replace(new RegExp("‌"), '')
                    .replace(new RegExp("‌"), '')
                    .replace(new RegExp("‌"), '')
                    .replace('‌', '')
                    .replace(/\n/g, '');
                var comp = $scope.check_list.components.find(function (c) {
                    return c.title
                        .replace(new RegExp('ي'), 'ی')
                        .replace(new RegExp("‌"), '')
                        .replace(new RegExp("‌"), '')
                        .replace(new RegExp('ِ'), '')
                        .replace(new RegExp('ُ'), '')
                        .replace(new RegExp('َ'), '')
                        .replace('‌', '')
                        .replace(new RegExp("‌"), '')
                        .replace(/\s/g, '')
                        .replace(/\n/g, '')
                        .replace('‌', '')
                        .indexOf(itm.component) >= 0;
                });

                itm.component = comp ? angular.copy(comp.title) : itm_component;
                itm.component_id = comp ? angular.copy(comp._id) : itm_component;
                if (!comp) {
                    console.error(itm.component, comp)
                }
            }
        });
        //var comp = $filter('groupBy')($scope.check_list.questions, 'component');
        //$scope.check_list.components = $scope.check_list.has_component ? $scope.check_list : [];
        $scope.check_list.id = copy_row._id;
        if ($scope.check_list.guides) {
            $scope.point_type.guides = $scope.check_list.guides.map(function (itm) {
                return {key: itm.value, value: itm.guide, point_type: itm.key}
            });
        }
        if (row.menu_items)
            row.menu_items.map(function (itm) {
                if (itm.id) {
                    $scope.menuItems.map(function (mi) {
                        if (mi.id === itm.id) {
                            mi.checked = true;
                            var isReq=row.required_answer_items.find(function (x) {
                                return x==mi.id;
                            })
                            if(!isReq){
                                mi.is_req=false;
                            }
                        }
                    })
                }
                if (itm) {
                    $scope.menuItems.map(function (mi) {
                        if (mi.id === itm) {
                            mi.checked = true;
                            var isReq=row.required_answer_items.find(function (x) {
                                return x==mi.id;
                            })
                            if(!isReq){
                                mi.is_req=false;
                            }

                        }
                    })
                }
            })

        setGuides();

    };
    $scope.deleteComponent = function (c) {
        $scope.question('آیا از حذف اجزاء مورد نظر به همراه سوالات مطمئن هستید؟', 'حذف اجزاء').result.then(function (r) {
            if (r) {
                if (c._id) {
                    deleteAPI(c._id, 'component', function () {
                        $scope.check_list.questions = $scope.check_list.questions.filter(function (q) {
                            if (q.component !== c.title) {
                                return true
                            } else {
                                console.log(q);
                                deleteQuestion(q)
                            }
                            return false;
                        })
                        $scope.check_list.components.splice($scope.check_list.components.indexOf(c), 1);
                    })
                } else {
                    $scope.check_list.questions = $scope.check_list.questions.filter(function (q) {
                        return q.component !== c.title
                    })
                    $scope.check_list.components.splice($scope.check_list.components.indexOf(c), 1);
                }

            }
        });
    }
    $scope.deleteGuide = function (c) {
        console.log(c)
        $scope.question('آیا از حذف مقدار مورد نظر مطمئن هستید؟', 'حذف مقادیر').result.then(function (r) {
            if (r) {
                var index = $scope.point_type.guides.indexOf(c);
                if (c._id) {
                    deleteAPI(c._id, 'guide', function () {

                        $scope.point_type.guides.splice(index, 1);
                    })
                } else {
                    $scope.point_type.guides.splice(index, 1);
                }

            }
        });
    }

    function getAllAnswerInfo() {
        factory1.getUserApi('/v2/get_all_answerer_info_menu_items').then(function (data) {
            $scope.menuItems = data.items;
            resetAnswers();
        })
    }

    getCheckList();
    getAllAnswerInfo();
});

app.controller('Hospital_Readiness_Program_Ctrl', function ($scope, factory1, $rootScope) {

    $scope.config = false;
    $scope.model = null;
    var model_instanc = {
        upload_file: '',
        file: '',
        title: '',
        year: $rootScope.year
    };
    $scope.data_recordes = [];

    function getData() {
        factory1.getUserApi('/v1/user/hospital/readiness_programs').then(function (data) {
            $scope.data_recordes = data;
        })
    }

    function resetModel(data) {
        $scope.index_of_recorde = -1;
        $scope.model = angular.copy(data || model_instanc);
    }

    $scope.toggleConfig = function (row) {
        $scope.config = !$scope.config;
        resetModel(row);
    }
    $scope.uploadFile = function () {
        factory1.upload_file($scope, $scope.model.upload_file, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, null, null).then(function (data) {
            console.log(data);
            $scope.model.file = data;

        });
    };
    $scope.save = function (e) {
        e.preventDefault();
        var model = angular.copy($scope.model);
        delete model.upload_file;
        if (model.title) {
            if (model.file) {
                if (model.file.url) {
                    delete model.file;
                }
                factory1.postUserApi('/v1/user/hospital/readiness_program', JSON.stringify(model)).then(function (data) {
                    if (model.id) {
                        $scope.data_recordes[$scope.index_of_recorde] = data;
                    } else {
                        $scope.data_recordes.push(data);
                    }
                    $scope.toggleConfig();
                })
            } else {
                $scope.warning('لطغاً فایل سند را بارگذاری کنید.')
            }
        } else {
            $scope.warning('لطغاً عنــوان سند را وارد کنید.')
        }

    }
    $scope.edit = function (row, index) {
        $scope.index_of_recorde = index;
        $scope.toggleConfig(row);
    }
    $scope.deleteData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/readiness_program/' + row.id).then(function () {
                    $scope.data_recordes.splice(index, 1);
                })
            }
        });
    }
    getData();

});

app.controller('instructions_of_electrical_and_mechanical_systems_ctrl', function ($scope, factory1, $rootScope) {

    $scope.config = false;
    $scope.model = null;
    var model_instanc = {
        upload_file: '',
        file: '',
        title: '',
        year: $rootScope.year
    };
    $scope.data_recordes = [];

    function getData() {
        factory1.getUserApi('/v1/user/hospital/electrical_and_mechanicals').then(function (data) {
            $scope.data_recordes = data;
        })
    }

    function resetModel(data) {
        $scope.index_of_recorde = -1;
        $scope.model = angular.copy(data || model_instanc);
    }

    $scope.toggleConfig = function (row) {
        $scope.config = !$scope.config;
        resetModel(row);
    }
    $scope.uploadFile = function () {
        factory1.upload_file($scope, $scope.model.upload_file, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, null, null).then(function (data) {
            console.log(data);
            $scope.model.file = data;

        });
    };
    $scope.save = function (e) {
        e.preventDefault();
        var model = angular.copy($scope.model);
        delete model.upload_file;
        if (model.title) {
            if (model.file) {
                if (model.file.url) {
                    delete model.file;
                }
                factory1.postUserApi('/v1/user/hospital/electrical_and_mechanical', JSON.stringify(model)).then(function (data) {
                    if (model.id) {
                        $scope.data_recordes[$scope.index_of_recorde] = data;
                    } else {
                        $scope.data_recordes.push(data);
                    }
                    $scope.toggleConfig();
                })
            } else {
                $scope.warning('لطغاً فایل سند را بارگذاری کنید.')
            }
        } else {
            $scope.warning('لطغاً عنــوان سند را وارد کنید.')
        }

    }
    $scope.edit = function (row, index) {
        $scope.index_of_recorde = index;
        $scope.toggleConfig(row);
    }
    $scope.deleteData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/electrical_and_mechanical/' + row.id).then(function () {
                    $scope.data_recordes.splice(index, 1);
                })
            }
        });
    }
    getData();

});

app.controller('inspection_of_fire_alarm_equipment_ctrl', function ($scope, factory1, $rootScope) {

    $scope.config = false;
    $scope.model = null;
    var model_instanc = {
        upload_file: '',
        file: '',
        title: '',
        year: $rootScope.year
    };
    $scope.data_recordes = [];

    function getData() {
        factory1.getUserApi('/v1/user/hospital/fire_alarms').then(function (data) {
            $scope.data_recordes = data;
        })
    }

    function resetModel(data) {
        $scope.index_of_recorde = -1;
        $scope.model = angular.copy(data || model_instanc);
    }

    $scope.toggleConfig = function (row) {
        $scope.config = !$scope.config;
        resetModel(row);
    }
    $scope.uploadFile = function () {
        factory1.upload_file($scope, $scope.model.upload_file, 20000000,
            ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            , false, null, null).then(function (data) {
            console.log(data);
            $scope.model.file = data;

        });
    };
    $scope.save = function (e) {
        e.preventDefault();
        var model = angular.copy($scope.model);
        delete model.upload_file;
        if (model.title) {
            if (model.file) {
                if (model.file.url) {
                    delete model.file;
                }
                factory1.postUserApi('/v1/user/hospital/fire_alarm', JSON.stringify(model)).then(function (data) {
                    if (model.id) {
                        $scope.data_recordes[$scope.index_of_recorde] = data;
                    } else {
                        $scope.data_recordes.push(data);
                    }
                    $scope.toggleConfig();
                })
            } else {
                $scope.warning('لطغاً فایل سند را بارگذاری کنید.')
            }
        } else {
            $scope.warning('لطغاً عنــوان سند را وارد کنید.')
        }

    }
    $scope.edit = function (row, index) {
        $scope.index_of_recorde = index;
        $scope.toggleConfig(row);
    }
    $scope.deleteData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/fire_alarm/' + row.id).then(function () {
                    $scope.data_recordes.splice(index, 1);
                })
            }
        });
    }
    getData();

});

app.controller('fire_extinguishing_equipment_inspection_Ctrl', function ($scope, factory1, $rootScope) {
    var model_1_instance = {
        location: '',
        capsule_number: '',
        property_number: '',
        capsule_type: '',
        capacity: '',
        gage: false,
        hose: false,
        connect_to_wall: false,
        bearning: false,
        availability: false,
        charging_date: false,
        recharge_date: false,
        guade: false,
        description: '',
        year: $rootScope.year
    }
    $scope.data_recordes = [];

    function getData() {
        factory1.getUserApi('/v1/user/hospital/fire_extinguisher_boxes').then(function (data) {
            $scope.data_recordes = data;
        })
    }

    $scope.save = function (row, index) {

        factory1.postUserApi('/v1/user/hospital/fire_extinguisher_box', JSON.stringify(row)).then(function (data) {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.');
            $scope.data_recordes[index] = data;

        })

    }
    $scope.add_to_data_recordes = function () {
        $scope.data_recordes.push(angular.copy(model_1_instance));
    }
    $scope.deleteData = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if (row.id) {
                    factory1.deleteUserApi('/v1/user/hospital/fire_extinguisher_box/' + row.id).then(function () {
                        $scope.data_recordes.splice(index, 1);
                    })
                } else {
                    $scope.data_recordes.splice(index, 1);
                }

            }
        });
    }
    getData();
    var model_2_instance = {
        location: '',
        nozzle: false,
        nozzle_holder: false,
        valve: false,
        door_lock: false,
        hose: false,
        hose_holder: false,
        order: false,
        description: '',
        incpection_date: '',
        year: $rootScope.year
    }
    $scope.data_recordes2 = [];

    function getData2() {
        factory1.getUserApi('/v1/user/hospital/fire_extinguisher_capsules').then(function (data) {
            $scope.data_recordes2 = data;
        })
    }

    $scope.save2 = function (row, index) {

        factory1.postUserApi('/v1/user/hospital/fire_extinguisher_capsule', JSON.stringify(row)).then(function (data) {
            $scope.success_alert('اطلاعات با موفقیت ثبت شد.');
            $scope.data_recordes2[index] = data;

        })

    }
    $scope.add_to_data_recordes2 = function () {
        $scope.data_recordes2.push(angular.copy(model_2_instance));
    }
    $scope.deleteData2 = function (row, index) {
        $scope.question('آیا از حذف اطلاعات مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if (row.id) {
                    factory1.deleteUserApi('/v1/user/hospital/fire_extinguisher_capsule/' + row.id).then(function () {
                        $scope.data_recordes2.splice(index, 1);
                    })
                } else {
                    $scope.data_recordes2.splice(index, 1);
                }

            }
        });
    }
    getData2();

});

app.controller('mashiWrapperCtrl', function ($rootScope,$state,$scope) {
    $rootScope.is_parent = true;
    $scope.$watch(function () {
        return $state.$current.name
    }, function (newVal, oldVal) {

        $rootScope.is_parent = $state.$current.self.name === "Continuing_to_Provide_Vital_Hospital_Care_in_Crisis";

    });
});

app.controller('mashi', function ($scope, factory1, $rootScope, $stateParams, $state) {



    $scope.title = 'تداوم ارائه خدمات درمانی حیاتی بیمارستان در شرایط بحران';
    $scope.instructions = [{description: '', responsible_person: ''}];
    $scope.mashi = {users: [], steps: [], file_b64: ''};
    $scope.jobs = [];

    function getPolicy() {
        factory1.getUserApi('/v1/user/hospital/policy', '&title=' + $scope.title).then(function (data) {
            $scope.mashi = data;
        });
    }

    $scope.add_member = function () {
        if ($scope.mashi.users.length) {
            if (!$scope.mashi.users[$scope.mashi.users.length - 1].user_id) {
                $scope.warning('لطفاً مشخصات افراد مسئول در تدوین روش اجرایی را به درستی وارد کنید.');
                return false;
            }
        }
        $scope.mashi.users.push({director: false, verifier: false, commenicator: false});
    };
    $scope.send_to = function () {
        if ($scope.mashi.id) {
            var arr = [];
            arr = angular.copy($scope.all_users);
            if ($scope.mashi.sent_to) {
                $scope.mashi.sent_to = angular.isArray($scope.mashi.sent_to) ? $scope.mashi.sent_to : $scope.to_array([], $scope.mashi.sent_to, '-');
                arr.forEach(function (itm) {
                    itm.users.forEach(function (obj) {
                        $scope.mashi.sent_to.forEach(function (p) {
                            if (obj.id === p) {

                                itm.users[itm.users.indexOf(obj)].checked = true;
                            }
                        });

                    });
                });
            }
            var result = $scope.open_modal('lg', $scope.BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
                users: function () {
                    return arr;
                }
            }, 'blue_modal');
            result.result.then(function (r) {
                if (r) {


                    $scope.mashi.sent_to = r.map(function (itm) {
                        return itm.id
                    })
                    var parameter = JSON.stringify({
                        send_to: $scope.mashi.sent_to,
                        id: $scope.mashi.id,
                        year: $rootScope.year
                    });
                    factory1.putUserApi('/v1/user/hospital/policy/send_to', parameter).then(function (data) {

                        $scope.success_alert(
                            "خط مشی و روش " + '' + $scope.title + '' +
                            ' با موفقیت به اشخاص مورد نظر ارسال شد.', 'ثبت اطلاعات');
                    });
                }
            });
        } else {
            $scope.warning('لطفاً اطلاعات را ثبت و سپس اقدام به ارسال آنها نمایید.');
        }
    };
    $scope.add_instruction = function () {
        $scope.mashi.steps.push({description: '', job_group_id: ''})
    };
    $scope.instruction_file_upload = function () {
        factory1.upload_file($scope, $scope.mashi.file_b64, 2000000, ['audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], false, false).then(function (data) {

            // $scope.mashi.file= data;
            var parameter = angular.merge($scope.mashi, {
                has_file: true,
                file: data,
                title: $scope.title,
                year: $rootScope.year

            });
            factory1.postUserApi('/v1/user/hospital/policy', JSON.stringify(parameter)).then(function (data) {
                $scope.mashi = data;
                $scope.send_to();
            });


        });
    };
    $scope.delete_instruction = function (row) {
        $scope.mashi.steps.splice($scope.mashi.steps.indexOf(row), 1);
    };
    $scope.submitPolicy = function () {
        var parameter = angular.merge($scope.mashi, {
            has_file: false,
            year: $rootScope.year,
            title: $scope.title,
            mehvar: $scope.state__title,
            mehvar_icon: $scope.state__icon
        });
        factory1.postUserApi('/v1/user/hospital/policy', JSON.stringify(parameter)).then(function (data) {

            $scope.mashi = data;
        });
    };

    $scope.history = function () {

        $state.go('.policy_history');
    }
    factory1.getUserApi('/v1/hospital/job_groups').then(function (data) {
        $scope.jobs = data;
    });
    getPolicy();
});

app.controller('policy_history_Ctrl', function ($scope, factory1, localStorageService, $rootScope, $http, Server_URL, BASE, $state, $stateParams) {

    $scope.edits_chart = {
        labels_chart: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        colors_chart: [
            {
                fill: true,
                fillColor: '#b2f1e4',
                pointBackgroundColor: '#97d1c5',
                pointHoverBackgroundColor: '#5f857b',
                pointBorderColor: '#a9e6d9',
                backgroundColor: "#fff",
                pointHoverBorderColor: "#fff",
                borderColor: '#7cb8a2'
            }],
        data_chart: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        data_set: {
            pointBackgroundColor: ['#189C2C', '#0FA707', '#92C020', '#C93253', '#FB0202', '#FF5100', '#EA8B47', '#FFB67B', '#F1B530', '#9A59B5', '#A12FDE', '#C62BFC'],
            borderColor: '#1c94e0'
        },
        options: {
            tooltips: {
                titleFontSize: 10,
                bodyFontSize: 10
            },
            scaleShowGridLines: false,
            elements: {line: {tension: 0, fill: false}}, scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'زمـــــان',
                        fontSize: 11
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 9,
                        min: 0,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'تعــــداد دفعات مراجعات',
                        fontSize: 11
                    }
                }]

            }
        }
    };
    $scope.is_parent = true;
    $scope.ihistory = [];
    $scope.title = 'تداوم ارائه خدمات درمانی حیاتی بیمارستان در شرایط بحران';
    $scope.get_edited_records = function (row) {
        if (!row.old_object) {
            return row.new_object.sent_to_at ? 'اطلاع رسانی خط مشی و روش ' + $scope.title
                : 'ثبت خط مشی و روش ' + $scope.title;
        } else {

            return row.new_object.files ? 'بارگذاری خط مشی و روش ' + $scope.title : 'ویرایش خط مشی و روش ' + $scope.title;
        }

    };
    $scope.show_last_version = function (row) {
        console.log(row);
        var data = row.new_object;
        var data_old = row.old_object;
        $scope.mashi_old={}
        $scope.mashi=angular.copy(data);
        Object.keys(data).map(function (key) {
            if(data_old[key]!=data[key]){
                $scope.mashi_old[key]=angular.copy(data_old[key]);
            }
        })

        $scope.template.url = BASE + '/asset/directives/mashi.html';
        $scope.is_parent = false;
    };
    factory1.getUserApi('/v1/user/hospital/history', '&title=' + $scope.title + '&object_type=' + 'policy').then(function (data) {
        $scope.ihistory = data;
        data.forEach(function (itm) {
            var month = moment(itm.created_at).jMonth();
            $scope.edits_chart.data_chart[month]++;
        });

    });
});
app.config(['$urlRouterProvider', '$stateProvider', '$breadcrumbProvider', 'BASE',
    function ($urlRouterProvider, $stateProvider, $breadcrumbProvider, BASE) {

        $breadcrumbProvider.setOptions({
            template: '<ol class="breadcrumb">' +
            '<li data-ng-repeat="step in steps" data-ng-class="{active: $last}" data-ng-switch="$last || !!step.abstract">' +
            '<a data-ng-switch-when="false" href="#" data-ng-href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}<i class="icon" data-ng-class="step.ncyBreadcrumb.icon" ></i></a>' +
            '<span data-ng-switch-when="true">{{step.ncyBreadcrumbLabel}}<i class="icon" data-ng-class="step.ncyBreadcrumb.icon" ></i></span>' +
            '</li>' +
            '</ol>'
        });
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('/', {
            url: '/',
            templateUrl: 'views/choose_management.htm',
            ncyBreadcrumb: {
                label: ' رهبری و مدیریت',
                icon: 'icon-font icon-modiriat_rahbari'
            }
        })
            .state('human_resources_management', {
                url: '/management/human_resources_management',
                templateUrl: 'views/human_resources_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت منابع انسانی',
                    parent: '/',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('employing_human_resources_of_ward', {
                url: '/human_resources_management/employing_human_resources_of_ward',
                templateUrl: 'views/human_resources_management/employing_human_resources_of_ward.htm',
                ncyBreadcrumb: {
                    label: 'به کارگیری نیروی انسانی بخش‌ها/واحدها',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Applying_staff_based_on_qualifications', {
                url: '/human_resources_management/Applying_staff_based_on_qualifications',
                templateUrl: 'views/human_resources_management/Applying_staff_based_on_qualifications.htm',
                ncyBreadcrumb: {
                    label: 'به کارگیری کارکنان براساس شرایط احراز',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Internal_administrative_hospital', {
                url: '/human_resources_management/Internal_administrative_hospital',
                templateUrl: 'views/human_resources_management/Internal_administrative_hospital.htm',
                ncyBreadcrumb: {
                    label: 'مقررات اداری مالی داخلی بیمارستان',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Staffing_records', {
                url: '/human_resources_management/Staffing_records',
                templateUrl: 'views/human_resources_management/Staffing_records.htm',
                ncyBreadcrumb: {
                    label: 'پرونده پرسنلی کارکنان',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('List_of_staff_at_work_routines', {
                url: '/human_resources_management/List_of_staff_at_work_routines',
                templateUrl: 'views/human_resources_management/List_of_staff_at_work_routines.htm',
                ncyBreadcrumb: {
                    label: 'فهرست کارکنان در نوبت‌های کاری',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Staff_assessment', {
                url: '/human_resources_management/Staff_assessment',
                templateUrl: 'views/human_resources_management/Staff_assessment.htm',
                ncyBreadcrumb: {
                    label: 'ارزشیابی کارکنان',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Staff_comments_and_suggestions', {
                url: '/human_resources_management/Staff_comments_and_suggestions',
                templateUrl: 'views/human_resources_management/Staff_comments_and_suggestions.htm',
                ncyBreadcrumb: {
                    label: 'نظرات و پیشنهادات کارکنان',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Motivational_Plans', {
                url: '/human_resources_management/Motivational_Plans',
                templateUrl: 'views/human_resources_management/Motivational_Plans.htm',
                ncyBreadcrumb: {
                    label: 'برنامه‌های انگیزشی',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Improve_physical_health_and_events', {
                url: '/human_resources_management/Improve_physical_health_and_events',
                templateUrl: 'views/human_resources_management/Improve_physical_health_and_events.htm',
                ncyBreadcrumb: {
                    label: 'ارتقاء سلامت جسمی و اتفاقات',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Empowering_employees', {
                url: '/human_resources_management/Empowering_employees',
                templateUrl: 'views/human_resources_management/Empowering_employees.htm',
                ncyBreadcrumb: {
                    label: 'توانمندسازی کارکنان',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Savior_skills_and_safety', {
                url: '/human_resources_management/Savior_skills_and_safety',
                templateUrl: 'views/human_resources_management/Savior_skills_and_safety.htm',
                ncyBreadcrumb: {
                    label: 'مهارت‌های نجات دهنده و حفظ ایمنی',
                    parent: 'human_resources_management',
                    icon: 'icon-human_resources_management'
                }

            })
            .state('Patient_Safety', {
                url: '/management/Patient_Safety',
                templateUrl: 'views/Patient_Safety.htm',
                ncyBreadcrumb: {
                    label: 'ایمنی بیمار',
                    parent: '/',
                    icon: 'icon-font icon-Patient_Safety'
                }

            })
            .state('risk_management', {
                url: '/management/risk_management',
                templateUrl: 'views/risk_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت خطرِ حوادث و بلایا',
                    parent: '/',
                    icon: 'icon-font icon-mehvar'
                }

            })
            .state('evaluation_of_the_risk', {
                url: '/evaluation_of_the_risk',
                templateUrl: 'views/risk_management/evaluation_of_the_risk.htm',
                controller: 'evaluation_of_the_risk_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی و اولویت‌بندی خطربلایا و حوادث ',
                    parent: 'risk_management',
                    icon: 'icon-font icon-arzyabi-khatar-balaya'
                }

            })
            .state('instruction_history', {
                url: '/history/:instruction_type/:instruction_title/:parent',
                templateUrl: BASE + '/asset/directives/history_procedure.htm',
                controller: 'instruction_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه',
                    parent: 'Evaluation_and_control_of_surfaces_and_walls',
                    icon: 'icon-font icon-tarikhche_virayeshha'
                }

            })
            .state('fire_control', {
                url: '/fire_control',
                templateUrl: 'views/risk_management/fire_control.htm',
                ncyBreadcrumb: {
                    label: 'اقدامات پیشگیری و کنترل آتش سوزی ',
                    parent: 'risk_management',
                    icon: 'icon-font icon-control-atash-sozi'
                }

            })
            .state('safety_against_fire', {
                url: '/safety_against_fire',
                templateUrl: 'views/risk_management/fire_control/safety_against_fire.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی “ایمنی در مقابل آتش سوزی”',
                    parent: 'fire_control',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('identify_hazardous_places', {
                url: '/identify_hazardous_places',
                templateUrl: 'views/risk_management/fire_control/identify_hazardous_places.htm',
                controller: 'identify_hazardous_places_Ctrl',
                ncyBreadcrumb: {
                    label: 'شناسایی مکان‌های خطر آفرین',
                    parent: 'fire_control',
                    icon: 'icon-identify_hazardous_places_white'
                }

            })
            .state('fire_extinguishing_equipment_inspection', {
                url: '/fire_extinguishing_equipment_inspection',
                templateUrl: 'views/risk_management/fire_control/fire_extinguishing_equipment_inspection.htm',
                controller: 'fire_extinguishing_equipment_inspection_Ctrl',
                ncyBreadcrumb: {
                    label: 'بازرسی تجهیزات اطفای حریق',
                    parent: 'fire_control',
                    icon: 'icon-font icon-bazdidha'
                }

            })
            .state('inspection_of_fire_alarm_equipment', {
                url: '/inspection_of_fire_alarm_equipment',
                templateUrl: 'views/risk_management/fire_control/inspection_of_fire_alarm_equipment.htm',
                controller: 'inspection_of_fire_alarm_equipment_ctrl',
                ncyBreadcrumb: {
                    label: 'بازرسی تجهیزات اعلام حریق',
                    parent: 'fire_control',
                    icon: 'icon-font icon-bazdidha'
                }

            })
            .state('safety_of_the_engine_room', {
                url: '/safety_of_the_engine_room',
                templateUrl: 'views/risk_management/fire_control/safety_of_the_engine_room.htm',
                controller: 'safety_of_the_engine_room_Ctrl',
                ncyBreadcrumb: {
                    label: 'ایمنی موتورخانه ',
                    parent: 'fire_control',
                    icon: 'icon-safety_of_the_engine_room_white'
                }

            })
            .state('interface_team_of_fire_stations', {
                url: '/interface_team_of_fire_stations',
                templateUrl: 'views/risk_management/fire_control/interface_team_of_fire_stations.htm',
                controller: 'interface_team_of_fire_stations_Ctrl',
                ncyBreadcrumb: {
                    label: 'تیم رابط آتش نشانی ',
                    parent: 'fire_control',
                    icon: 'icon-interface_team_of_fire_stations_white'
                }

            })
            .state('building_maintenance', {
                url: '/building_maintenance',
                templateUrl: 'views/risk_management/building_maintenance.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی، نگهداری و امنیت تاسیسات و ساختمان',
                    parent: 'risk_management',
                    icon: 'icon-font icon-arzyabi-tasisat'
                }

            })
            .state('Periodic_visits_to_the_building', {
                url: '/Periodic_visits_to_the_building',
                templateUrl: 'views/risk_management/building_maintenance/Periodic_visits_to_the_building.htm',
                controller: 'Periodic_visits_to_the_building_Ctrl',
                ncyBreadcrumb: {
                    label: 'بازدیدهای دوره ای از ساختمان، تاسیسات و تجهیزات بیمارستان',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-bazdidha'
                }

            })
            .state('medical_gases', {
                url: '/medical_gases',
                templateUrl: 'views/risk_management/building_maintenance/medical_gases.htm',
                controller: 'medical_gases_Ctrl',
                ncyBreadcrumb: {
                    label: 'کنترل و مصرف گازهای طبی',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-medical_gases'
                }

            })
            .state('Periodic_visits_to_the_building.completing_daily', {
                url: '/completing_daily',
                templateUrl: 'views/risk_management/building_maintenance/Periodic_visits_to_the_building/completing_daily.htm',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت روزانه',
                    parent: 'Periodic_visits_to_the_building',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }

            })
            .state('Periodic_visits_to_the_building.completing_weekly', {
                url: '/completing_weekly',
                templateUrl: 'views/risk_management/building_maintenance/Periodic_visits_to_the_building/completing_weekly.htm',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت هفتگی',
                    parent: 'Periodic_visits_to_the_building',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }

            })
            .state('Periodic_visits_to_the_building.completing_monthly', {
                url: '/completing_monthly',
                templateUrl: 'views/risk_management/building_maintenance/Periodic_visits_to_the_building/completing_monthly.htm',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت ماهانه',
                    parent: 'Periodic_visits_to_the_building',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }

            })
            .state('Monitoring_and_control_of_central_oxygen_in_hospitals', {
                url: '/Monitoring_and_control_of_central_oxygen_in_hospitals',
                templateUrl: 'views/risk_management/building_maintenance/Monitoring_and_control_of_central_oxygen_in_hospitals.htm',
                controller: 'Monitoring_and_control_of_central_oxygen_in_hospitals_Ctrl',
                ncyBreadcrumb: {
                    label: 'پایش و کنترل اکسیژن سانترال بیمارستان',
                    parent: 'building_maintenance',
                    icon: 'icon icon-Monitoring_and_control_of_central_oxygen_in_hospitals'
                }

            })
            .state('retaining_c_h_v', {
                url: '/retaining_c_h_v',
                templateUrl: 'views/risk_management/building_maintenance/retaining_c_h_v.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی"نگهداشت سرمایش، گرمایش و تهویه بیمارستان"',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('Safe_operation_of_electrical_and_mechanical_systems', {
                url: '/Safe_operation_of_electrical_and_mechanical_systems',
                templateUrl: 'views/risk_management/building_maintenance/Safe_operation_of_electrical_and_mechanical_systems.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "راهبری ایمن سیستم های الکتریکی و مکانیکی"',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Evaluation_and_control_of_surfaces_and_walls', {
                url: '/Evaluation_and_control_of_surfaces_and_walls',
                templateUrl: 'views/risk_management/building_maintenance/Evaluation_and_control_of_surfaces_and_walls.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "ارزیابی و کنترل سطوح و دیوارها"',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('instructions_of_electrical_and_mechanical_systems', {
                url: '/instructions_of_electrical_and_mechanical_systems',
                templateUrl: 'views/risk_management/building_maintenance/instructions_of_electrical_and_mechanical_systems.htm',
                controller: 'instructions_of_electrical_and_mechanical_systems_ctrl',
                ncyBreadcrumb: {
                    label: 'دستورالعمل های سیستم های الکتریکی و مکانیکی',
                    parent: 'building_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('supplies_maintenance', {
                url: '/supplies_maintenance',
                templateUrl: 'views/risk_management/supplies_maintenance.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی نگهداری و امنیت سیستم‌های الکتریکی',
                    parent: 'risk_management',
                    icon: 'icon-font icon-arzyabi_system_electronici'
                }

            })
            .state('meter_and_enerators_and_UPS', {
                url: '/meter_and_enerators_and_UPS',
                templateUrl: 'views/risk_management/supplies_maintenance/meter_and_enerators_and_UPS.htm',
                controller: 'meter_and_enerators_and_UPS_Ctrl',
                ncyBreadcrumb: {
                    label: 'شبکه انتقال(کنتورها)،ژنراتور‌ها و برق اضطراری(UPS)',
                    parent: 'supplies_maintenance',
                    icon: 'icon-font icon-shabake_enteghal2'
                }

            })
            .state('Electric_power_distribution_system_control', {
                url: '/Electric_power_distribution_system_control',
                templateUrl: 'views/risk_management/supplies_maintenance/Electric_power_distribution_system_control.htm',
                controller: 'meter_and_enerators_and_UPS_Ctrl',
                ncyBreadcrumb: {
                    label: 'کنترل سیستم توزیع انرژی الکتریکی',
                    parent: 'supplies_maintenance',
                    icon: 'icon-font icon-tozie_energy_electronic'
                }

            })
            .state('Control_of_generators_and_emergency_power_supply_systems', {
                url: '/Control_of_generators_and_emergency_power_supply_systems',
                templateUrl: 'views/risk_management/supplies_maintenance/Control_of_generators_and_emergency_power_supply_systems.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "کنترل عملکرد ژنراتورها و سیستم های تامین کننده برق اضطراری"',
                    parent: 'supplies_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Use_of_elevators_during_fire_or_emergency_evacuation', {
                url: '/Use_of_elevators_during_fire_or_emergency_evacuation',
                templateUrl: 'views/risk_management/supplies_maintenance/Use_of_elevators_during_fire_or_emergency_evacuation.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "استفاده از آسانسورها در زمان حریق و یا تخلیه اضطراری"',
                    parent: 'supplies_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Secure_storage_with_the_least_expected', {
                url: '/Secure_storage_with_the_least_expected',
                templateUrl: 'views/risk_management/supplies_maintenance/Secure_storage_with_the_least_expected.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "انبارش ایمن با حداقل‌های مورد انتظار"',
                    parent: 'supplies_maintenance',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('report_accidents', {
                url: '/report_accidents',
                templateUrl: 'views/risk_management/report_accidents.htm',
                ncyBreadcrumb: {
                    label: 'موقعیت‌های خطر آفرین برای کارکنان',
                    parent: 'risk_management',
                    icon: 'icon-font icon-gozaresh-havades'
                }

            })
            .state('Reporting_incidents_and_hazardous_situations', {
                url: '/Reporting_incidents_and_hazardous_situations',
                templateUrl: 'views/risk_management/report_accidents/Reporting_incidents_and_hazardous_situations.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی "گزارش حوادث بیمارستان و اطلاع‌رسانی آن به تمامی کارکنان"',
                    parent: 'report_accidents',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('report_accident', {
                url: '/report_accident',
                templateUrl: 'views/risk_management/report_accidents/report_accident.htm',
                controller: 'report_accident_Ctrl',
                ncyBreadcrumb: {
                    label: 'بررسی و تحلیل حوادث گزارش شده در بیمارستان',
                    parent: 'report_accidents',
                    icon: 'icon-font icon-barresi_havades'
                }

            })
            .state('report_accident.details_accident_report', {
                url: '/details_accident_report',
                templateUrl: 'views/risk_management/report_accidents/details_accident_report.htm',
                ncyBreadcrumb: {
                    label: 'جزئیات حادثه گزارش شده',
                    parent: 'report_accident',
                    icon: 'icon-font icon-barresi_havades'
                }

            })
            .state('call_urgently', {
                url: '/call_urgently',
                templateUrl: 'views/risk_management/call_urgently.htm',
                ncyBreadcrumb: {
                    label: 'پاسخ به فوریت‌ها و عوامل خطر آفرین',
                    parent: 'risk_management',
                    icon: 'icon-font icon-pasokh-be-foriat-ha'
                }

            })
            .state('Increasing_hospital_capacity', {
                url: '/Increasing_hospital_capacity',
                templateUrl: 'views/risk_management/call_urgently/Increasing_hospital_capacity.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی "افزایش ظرفیت بیمارستان در حوز‌ه تجهیزات، ملزومات و مواد مصرفی"',
                    parent: 'call_urgently',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('Compilation_of_early_warning_system_before_incident', {
                url: '/Compilation_of_early_warning_system_before_incident',
                templateUrl: 'views/risk_management/call_urgently/Compilation_of_early_warning_system_before_incident.htm',
                controller: 'Compilation_of_early_warning_system_before_incident_Ctrl',
                ncyBreadcrumb: {
                    label: 'تدوین سامانه هشدار اولیه قبل از بروز حادثه',
                    parent: 'call_urgently',
                    icon: 'icon-font icon-samaneh_hoshdar'
                }

            })
            .state('Discharging_hospital_in_incident', {
                url: '/Discharging_hospital_in_incident',
                templateUrl: 'views/risk_management/call_urgently/Discharging_hospital_in_incident.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "تخلیه بیمارستان در زمان وقوع حادثه"',
                    parent: 'call_urgently',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Activate_response_schedule_when_events_occur', {
                url: '/Activate_response_schedule_when_events_occur',
                templateUrl: 'views/risk_management/call_urgently/Activate_response_schedule_when_events_occur.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "فعال سازی برنامه پاسخ در زمان بروز حوادث"',
                    parent: 'call_urgently',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('enabling_disaster_management_systems', {
                url: '/enabling_disaster_management_systems',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems.htm',
                ncyBreadcrumb: {
                    label: 'فعالسازی سامانه‌های مدیریت حوادث و بلایا',
                    parent: 'risk_management',
                    icon: 'icon-font icon-samanr-modiriat'
                }

            })
            .state('Activate_response_program_when_incidents_occur', {
                url: '/Activate_response_program_when_incidents_occur',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/Activate_response_program_when_incidents_occur.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "فعالسازی برنامه پاسخ در زمان بروز حوادث"',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Continuing_to_Provide_Vital_Hospital_Care_in_Crisis', {
                url: '/Continuing_to_Provide_Vital_Hospital_Care_in_Crisis',
                controller: 'mashiWrapperCtrl',
                templateUrl: '../app/views/sanje/khatemashi.htm',
                ncyBreadcrumb: {
                    label: 'خط مشی "تداوم ارائه خدمات درمانی حیاتی بیمارستان در شرایط بحران"',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('Continuing_to_Provide_Vital_Hospital_Care_in_Crisis.policy_history', {
                url: '/history',
                templateUrl: BASE + '/asset/directives/history_policy.htm',
                controller: 'policy_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه',
                    parent: 'Continuing_to_Provide_Vital_Hospital_Care_in_Crisis',
                    icon: 'icon-font icon-tarikhche_virayeshha'
                }

            })
            .state('Formation_of_Hospital_Accident_Command_System', {
                url: '/Formation_of_Hospital_Accident_Command_System',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/Formation_of_Hospital_Accident_Command_System.htm',
                controller: 'Formation_of_Hospital_Accident_Command_System_Ctrl',
                ncyBreadcrumb: {
                    label: 'تدوین سامانه فرماندهی حادثه بیمارستانی',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-farmandehi_hadese'
                }

            })
            .state('Hospital_Readiness_Program', {
                url: '/Hospital_Readiness_Program',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/Hospital_Readiness_Program.htm',
                controller: 'Hospital_Readiness_Program_Ctrl',
                ncyBreadcrumb: {
                    label: 'برنامه آمادگی بیمارستان',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-sanje_asasi'
                }
            })
            .state('change_positions_of_the_incident_command_system', {
                url: '/change_positions_of_the_incident_command_system',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/change_positions_of_the_incident_command_system.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "نحوه فعالسازی و غیر فعالسازی جایگاه‌های سامانه فرماندهی حادثه"',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('Enable_alternative_communication_methods_during_an_incident', {
                url: '/Enable_alternative_communication_methods_during_an_incident',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/Enable_alternative_communication_methods_during_an_incident.htm',
                ncyBreadcrumb: {
                    label: 'دستورالعمل "فعالسازی روش‌های ارتباطی جایگزین در هنگام وقوع حادثه"',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-dastoorl_amal'
                }

            })
            .state('continuity_of_vital_health_care_services_in_incident', {
                url: '/continuity_of_vital_health_care_services_in_incident',
                templateUrl: 'views/risk_management/enabling_disaster_management_systems/continuity_of_vital_health_care_services_in_incident.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی "تداوم ارائه خدمات درمانی حیاتی در زمان وقوع حادثه"',
                    parent: 'enabling_disaster_management_systems',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }

            })
            .state('evaluation_team_profile', {
                url: '/evaluation_team_profile',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/evaluation_team_profile.htm',
                controller: 'evaluation_team_profile_Ctrl',
                ncyBreadcrumb: {
                    label: 'کمیته های بیمارستان',
                    parent: '/',
                    icon: 'icon-evaluation_team_profile'
                }

            })
            .state('general_information_hospital', {
                url: '/general_information_hospital',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/general_information_hospital.htm',
                controller: 'general_information_hospital_Ctrl',
                ncyBreadcrumb: {
                    label: 'اطلاعات کلی بیمارستان',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-general_information_hospital'
                }

            })
            .state('evaluation', {
                url: '/evaluation/:type/:category',
                templateUrl: function (stateParams) {
                    return 'views/risk_management/evaluation_of_the_risk/' + stateParams.type + '_new.htm';
                },
                controller: 'evaluation_Ctrl',
                ncyBreadcrumb: {
                    label: '{{state_title}}',
                    parent: 'evaluation_of_the_risk',
                    icon: '{{state_icon}}'
                }

            })
            .state('evaluation.category', {
                url: '/category/:subcategory',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/category.htm',
                ncyBreadcrumb: {
                    label: '{{state_category}}',
                    parent: 'evaluation',
                    icon: '{{state_category_icon}}'
                }

            })
            .state('evaluation.charts', {
                url: '/charts',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/charts.htm',
                ncyBreadcrumb: {
                    label: 'مشاهده نمودارها',
                    parent: 'evaluation',
                    icon: 'icon icon-viewing_charts'
                }

            })
            .state('evaluation.history', {
                url: '/history',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/history.htm',
                ncyBreadcrumb: {
                    label: 'تاریخچه {{state_title}}',
                    parent: 'evaluation',
                    icon: 'icon icon-evaluations_history'
                }

            })
            .state('evaluation.result', {
                url: '/result',
                templateUrl: function (stateParams) {
                    return stateParams.type === 'understanding_the_risks' ? 'views/risk_management/evaluation_of_the_risk/risk_result.htm' : 'views/risk_management/evaluation_of_the_risk/safty_result.htm';
                },
                ncyBreadcrumb: {
                    label: 'نتایج ' +
                    '{{state_title}}',
                    parent: 'evaluation',
                    icon: 'icon-assessment_information'
                }

            })
            .state('evaluation.re_result', {
                url: '/re_result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/re_result.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی مجدد ' +
                    '{{state_title}}',
                    parent: 'evaluation',
                    icon: 'icon-assessment_information'
                }

            })
            .state('understanding_the_risks', {
                url: '/understanding_the_risks',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/understanding_the_risks.htm',
                controller: 'understanding_the_risks_Ctrl',

                ncyBreadcrumb: {
                    label: 'شناخت مخاطرات',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-understanding_the_risks'
                }

            })
            .state('understanding_the_risks.understanding_the_risks_result', {
                url: '/result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/understanding_the_risks/result.htm',
                ncyBreadcrumb: {
                    label: 'نتایج ارزیابی مخاطرات',
                    parent: 'understanding_the_risks',
                    icon: 'icon-assessment_information'
                }

            })
            .state('understanding_the_risks.charts', {
                url: '/charts',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/charts.htm',
                ncyBreadcrumb: {
                    label: 'مشاهده نمودارها',
                    parent: 'understanding_the_risks',
                    icon: 'icon icon-viewing_charts'
                }

            })
            .state('understanding_the_risks.history', {
                url: '/history/:type',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/history.htm',
                controller: 'evaluation_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه ارزیابی مخاطرات',
                    parent: 'understanding_the_risks',
                    icon: 'icon icon-evaluations_history'
                }

            })
            .state('functional_safety_assessment', {

                url: '/functional_safety_assessment',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment.htm',
                controller: 'functional_safety_assessment_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی ایمنی عملکردی',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-functional_safety_assessment'
                }

            })
            .state('functional_safety_assessment.organizing_committee_of_the_hospital_crisis', {
                url: '/organizing_committee_of_the_hospital_crisis',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/organizing_committee_of_the_hospital_crisis.htm',
                ncyBreadcrumb: {
                    label: 'سازماندهی کمیته بحران بیمارستان',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-committee_white'
                }

            })
            .state('functional_safety_assessment.charts', {
                url: '/charts',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/charts.htm',
                ncyBreadcrumb: {
                    label: 'مشاهده نمودارها',
                    parent: 'functional_safety_assessment',
                    icon: 'icon icon-viewing_charts'
                }

            })
            .state('functional_safety_assessment.history', {
                url: '/history/:type',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/history.htm',
                controller: 'evaluation_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه ارزیابی عملکردی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon icon-evaluations_history'
                }

            })
            .state('functional_safety_assessment.result', {
                url: '/result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/result.htm',
                ncyBreadcrumb: {
                    label: 'نتایج ارزیابی ایمنی عملکردی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-assessment_information'
                }

            })
            .state('functional_safety_assessment.re_result', {
                url: '/re_result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/re_result.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی مجدد ایمنی عملکردی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-assessment_information'
                }

            })
            .state('functional_safety_assessment.action_plan_to_respond', {
                url: '/action_plan_to_respond',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/action_plan_to_respond.htm',
                /*views : {
                    '@' : {
                        templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/action_plan_to_respond.htm'
                    }
                },*/
                ncyBreadcrumb: {
                    label: 'برنامه عملیاتی پاسخ به مخاطرات داخلی و خارجی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-action_plan_to_respond_white'
                }

            })
            .state('functional_safety_assessment.contingency_operations_programs_medicine', {
                url: '/contingency_operations_programs_medicine',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/contingency_operations_programs_medicine.htm',
                /*views : {
                    '@' : {
                        templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/contingency_operations_programs_medicine.htm'
                    }
                },*/
                ncyBreadcrumb: {
                    label: 'برنامه‌های محتمل الوقوع عملیات پزشکی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-contingency_operations_programs_medicine_white'
                }

            })
            .state('functional_safety_assessment.action_plan_to_maintain_availability', {
                url: '/action_plan_to_maintain_availability',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/action_plan_to_maintain_availability.htm',
                ncyBreadcrumb: {
                    label: 'در دسترس بودن برنامه عملیاتی حفظ و بازسازی سرویس های  حیاتی',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-restoration_services_white'
                }

            })
            .state('functional_safety_assessment.access_to_medicines', {
                url: '/access_to_medicines',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/access_to_medicines.htm',
                /*views : {
                    '@' : {
                        templateUrl: 'views/risk_management/evaluation_of_the_risk/functional_safety_assessment/access_to_medicines.htm'
                    }
                },*/
                ncyBreadcrumb: {
                    label: 'دسترسی به دارو، تجهیزات و ذخایر مورد نیاز',
                    parent: 'functional_safety_assessment',
                    icon: 'icon-access_to_medicines_white'
                }

            })
            .state('biological_safety_assessment', {
                url: '/biological_safety_assessment',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment.htm',
                controller: 'biological_safety_assessment_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی ایمنی غیرسازه‌ای',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-biological_safety_assessmentt'
                }

            })
            .state('biological_safety_assessment.result', {
                url: '/result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/result.htm',
                ncyBreadcrumb: {
                    label: 'نتایج ارزیابی ایمنی غیرسازه‌ای',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-assessment_information'
                }

            })
            .state('biological_safety_assessment.charts', {
                url: '/charts',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/charts.htm',
                ncyBreadcrumb: {
                    label: 'مشاهده نمودارها',
                    parent: 'biological_safety_assessment',
                    icon: 'icon icon-viewing_charts'
                }

            })
            .state('biological_safety_assessment.history', {
                url: '/history/:type',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/history.htm',
                controller: 'evaluation_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه ارزیابی ایمنی غیرسازه‌ای',
                    parent: 'biological_safety_assessment',
                    icon: 'icon icon-evaluations_history'
                }

            })
            .state('biological_safety_assessment.re_result', {
                url: '/re_result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/re_result.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی مجدد ایمنی غیرسازه‌ای',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-assessment_information'
                }

            })
            .state('biological_safety_assessment.critical_systems', {
                url: '/critical_systems',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/critical_systems.htm',
                ncyBreadcrumb: {
                    label: 'سیستم‌های حیاتی',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-font icon-system-hayati'
                }

            })
            .state('biological_safety_assessment.HVAC', {
                url: '/HVAC',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/HVAC.htm',
                ncyBreadcrumb: {
                    label: 'سیستم‎های سرمایش، گرمایش و تهویه هوا (HVAC)',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-font icon-system-garmayeshi-sarmayeshi'
                }

            })
            .state('biological_safety_assessment.office_equipment', {
                url: '/office_equipment',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/office_equipment.htm',
                ncyBreadcrumb: {
                    label: 'وسایل و تجهیزات اداری (ثابت و متحرک)',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-font icon-tajhizat-edari'
                }

            })
            .state('biological_safety_assessment.medical_and_laboratory_equipment', {
                url: '/medical_and_laboratory_equipment',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/medical_and_laboratory_equipment.htm',
                ncyBreadcrumb: {
                    label: 'تجهیزات پزشکی و آزمایشگاهی و ملزومات تشخیصی و درمانی',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-font icon-tajhizat-azmayeshghai'
                }

            })
            .state('biological_safety_assessment.architectural_components', {
                url: '/architectural_components',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/biological_safety_assessment/architectural_components.htm',
                ncyBreadcrumb: {
                    label: 'اجزای معماری',
                    parent: 'biological_safety_assessment',
                    icon: 'icon-font icon-ajzaye-memari'
                }

            })
            .state('safety_assessment_instruments', {
                url: '/safety_assessment_instruments',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/safety_assessment_instruments.htm',
                controller: 'safety_assessment_instruments_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی ایمنی سازه‌ای',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-safety_assessment_instruments'
                }

            })
            .state('safety_assessment_instruments.result', {
                url: '/result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/safety_assessment_instruments/result.htm',
                ncyBreadcrumb: {
                    label: 'نتایج ارزیابی ایمنی سازه‌ای',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon-assessment_information'
                }

            })
            .state('safety_assessment_instruments.charts', {
                url: '/charts',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/charts.htm',
                ncyBreadcrumb: {
                    label: 'مشاهده نمودارها',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon icon-viewing_charts'
                }

            })
            .state('safety_assessment_instruments.history', {
                url: '/history/:type',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/history.htm',
                controller: 'evaluation_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه ارزیابی ایمنی سازه‌ای',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon icon-evaluations_history'
                }

            })
            .state('safety_assessment_instruments.re_result', {
                url: '/re_result',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/safety_assessment_instruments/re_result.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی مجدد ایمنی سازه‌ای',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon-assessment_information'
                }

            })
            .state('safety_assessment_instruments.previous_events_affecting', {
                url: '/previous_events_affecting',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/safety_assessment_instruments/previous_events_affecting.htm',
                ncyBreadcrumb: {
                    label: 'حوادث قبلی موثر بر ایمنی سازه‏ای بیمارستان',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon-font icon-imeny_sazey_1'
                }

            })
            .state('safety_assessment_instruments.structural_system_and_type_of_materials', {
                url: '/structural_system_and_type_of_materials',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/safety_assessment_instruments/structural_system_and_type_of_materials.htm',
                ncyBreadcrumb: {
                    label: 'ایمنی سامانه سازه‏ای و نوع مصالح به کار رفته در ساختمان',
                    parent: 'safety_assessment_instruments',
                    icon: 'icon-font icon-imeny_sazey'
                }

            })
            .state('simulated_exercises', {
                url: '/simulated_exercises',
                templateUrl: 'views/risk_management/evaluation_of_the_risk/simulated_exercises.htm',
                controller: 'simulated_exercises_ctrl',
                ncyBreadcrumb: {
                    label: 'تمرین‌های شبیه‌سازی شده',
                    parent: 'evaluation_of_the_risk',
                    icon: 'icon-font icon-tamrinhaie_shabihsazi'
                }

            })
            .state('improve_quality', {
                url: '/management/improve_quality',
                templateUrl: 'views/improve_quality.htm',
                ncyBreadcrumb: {
                    label: 'رهبری و مدیریت کیفیت',
                    parent: '/',
                    icon: 'icon-improve_quality'
                }

            })
            .state('continuous_management_of_hospital_processes', {
                url: '/improve_quality/continuous_management_of_hospital_processes',
                templateUrl: 'views/improve_quality/continuous_management_of_hospital_processes.htm',
                controller: 'continuous_management_of_hospital_processes_Ctrl',
                ncyBreadcrumb: {
                    label: 'مدیریت مستمر فرآیندهای بیمارستان',
                    parent: 'improve_quality',
                    icon: 'icon-font icon-farayand'
                }

            })
            .state('indicators', {
                url: '/improve_quality/indicators',
                templateUrl: 'views/improve_quality/indicators.htm',
                ncyBreadcrumb: {
                    label: 'شاخص‌ها',
                    parent: 'improve_quality',
                    icon: 'icon-font icon-shakhes_komitte'
                }


            })
            .state('programs', {
                url: '/improve_quality/programs',
                templateUrl: 'views/improve_quality/programs.htm',
                controller: 'programs_Ctrl',
                ncyBreadcrumb: {
                    label: 'برنامه ها',
                    parent: 'improve_quality',
                    icon: 'icon-font icon-barnameha'
                }


            })
            .state('self_assessment', {
                url: '/improve_quality/self_assessment',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/checklist.htm',
                controller: 'checkList_ctrl',
                ncyBreadcrumb: {
                    label: 'خود ارزیابی',
                    parent: 'improve_quality',
                    icon: 'icon-font icon-khod_arzyabi'
                }
            })
            .state('indicator-identity-card', {
                url: '/indicators/indicator-identity-card',
                templateUrl: 'views/improve_quality/indicators/indicator-identity-card.htm',
                controller: 'indicator-identity-card_Ctrl',
                ncyBreadcrumb: {
                    label: 'شناسنامه شاخص‌ها',
                    parent: 'indicators',
                    icon: 'icon-font icon-shakhes_komitte'
                }


            })
            .state('IndicatorProcessing', {
                url: '/indicators/IndicatorProcessing',
                controller: 'indicator-identity-card_Ctrl',
                templateUrl: 'views/improve_quality/indicators/IndicatorProcessing.htm',
                ncyBreadcrumb: {
                    label: 'پردازش شاخص‌ها',
                    parent: 'indicators',
                    icon: 'icon-font icon-snjab-d2'
                }


            })
            .state('sovereignty', {
                url: '/management/sovereignty',
                templateUrl: 'views/sovereignty.htm',
                ncyBreadcrumb: {
                    label: 'تیم حاکمیتی',
                    parent: '/',
                    icon: 'icon-sovereignty'
                }
            })
            .state('Supervise_doctors_and_hospital_activities', {
                url: '/sovereignty/Supervise_doctors_and_hospital_activities',
                templateUrl: 'views/sovereignty/Supervise_doctors_and_hospital_activities.htm',
                ncyBreadcrumb: {
                    label: 'نظارت بر پزشکان و فعالیت بیمارستان',
                    parent: 'sovereignty',
                    icon: 'icon-sovereignty'
                }
            })
            .state('Policies_missions_plans', {
                url: '/sovereignty/Policies_missions_plans',
                templateUrl: 'views/sovereignty/Policies_missions_plans.htm',
                ncyBreadcrumb: {
                    label: 'تدوین سیاست، مأموریت و برنامه‌ها',
                    parent: 'sovereignty',
                    icon: 'icon-sovereignty'
                }
            })
            .state('Supply_resources_of_programs', {
                url: '/sovereignty/Supply_resources_of_programs',
                templateUrl: 'views/sovereignty/Supply_resources_of_programs.htm',
                ncyBreadcrumb: {
                    label: 'تأمین و تخصیص منابع اجرای برنامه‌ها',
                    parent: 'sovereignty',
                    icon: 'icon-sovereignty'
                }
            })
            .state('Prevention_and_promotion_of_health', {
                url: '/sovereignty/Prevention_and_promotion_of_health',
                templateUrl: 'views/sovereignty/Prevention_and_promotion_of_health.htm',
                ncyBreadcrumb: {
                    label: 'پیشگیری و ارتقاء سلامت',
                    parent: 'sovereignty',
                    icon: 'icon-sovereignty'
                }
            })
            .state('Organizational_communication', {
                url: '/sovereignty/Organizational_communication',
                templateUrl: 'views/sovereignty/Organizational_communication.htm',
                ncyBreadcrumb: {
                    label: 'ارتباط سازمانی و پاسخ گویی مدیران',
                    parent: 'sovereignty',
                    icon: 'icon-sovereignty'
                }
            })
            .state('executive_management', {
                url: '/management/executive_management',
                templateUrl: 'views/executive_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت اجرایی',
                    parent: '/',
                    icon: 'icon-executive_management'
                }
            })
            .state('Hospital_Strategic_Document', {
                url: '/executive_management/Hospital_Strategic_Document',
                templateUrl: 'views/executive_management/Hospital_Strategic_Document.htm',
                ncyBreadcrumb: {
                    label: 'سند استراتژیک بیمارستان',
                    parent: 'executive_management',
                    icon: 'icon-executive_management'
                }
            })
            .state('Supervision_over_financial_and_trading_contracts', {
                url: '/executive_management/Supervision_over_financial_and_trading_contracts',
                templateUrl: 'views/executive_management/Supervision_over_financial_and_trading_contracts.htm',
                ncyBreadcrumb: {
                    label: 'نظارت بر قراردادهای مالی و معاملاتی',
                    parent: 'executive_management',
                    icon: 'icon-executive_management'
                }
            })
            .state('Monitor_patient_payments', {
                url: '/executive_management/Monitor_patient_payments',
                templateUrl: 'views/executive_management/Monitor_patient_payments.htm',
                ncyBreadcrumb: {
                    label: 'نظارت بر میزان پرداختی بیماران',
                    parent: 'executive_management',
                    icon: 'icon-executive_management'
                }
            })
            .state('Assess_the_cost_of_drugs_and_medical_equipment', {
                url: '/executive_management/Assess_the_cost_of_drugs_and_medical_equipment',
                templateUrl: 'views/executive_management/Assess_the_cost_of_drugs_and_medical_equipment.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی هزینه دارو و تجهیزات پزشکی',
                    parent: 'executive_management',
                    icon: 'icon-executive_management'
                }
            })
            .state('Supervising_the_provision_of_services_to_patients', {
                url: '/executive_management/Supervising_the_provision_of_services_to_patients',
                templateUrl: 'views/executive_management/Supervising_the_provision_of_services_to_patients.htm',
                ncyBreadcrumb: {
                    label: 'نظارت بر ارائه خدمات به بیماران',
                    parent: 'executive_management',
                    icon: 'icon-executive_management'
                }
            })
            .state('fault_management', {
                url: '/management/fault_management',
                templateUrl: 'views/fault_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت خطا',
                    parent: '/',
                    icon: 'icon-fault_management'
                }
            })
            .state('accommodation_facilities_management', {
                url: '/management/accommodation_facilities_management',
                templateUrl: 'views/accommodation_facilities_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت تسهیلات اقامتی',
                    parent: '/',
                    icon: 'icon-accommodation_facilities_management'
                }
            })
            .state('food_management', {
                url: '/management/food_management',
                templateUrl: 'views/food_management.htm',
                ncyBreadcrumb: {
                    label: 'مدیریت غذایی',
                    parent: '/',
                    icon: 'icon-food_management'
                }
            })
            .state('PreventingMedicalErrors', {
                url: '/fault_management/PreventingMedicalErrors',
                templateUrl: 'views/fault_management/PreventingMedicalErrors.htm',
                ncyBreadcrumb: {
                    label: 'پیشگیری از خطاهای پزشکی',
                    parent: 'fault_management',
                    icon: 'icon-font icon-pishgiri_az_khataha'
                }
            })
            .state('Preventive_Assessment_of_Medical_Errors', {
                url: '/PreventingMedicalErrors/Preventive_Assessment_of_Medical_Errors',
                templateUrl: 'views/fault_management/PreventingMedicalErrors/Preventive_Assessment_of_Medical_Errors.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی”ارزیابی پیشگیرانه خطاهای پزشکی”',
                    parent: 'PreventingMedicalErrors',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }
            })
            .state('FMEA', {
                url: '/PreventingMedicalErrors/FMEA',
                templateUrl: 'views/fault_management/PreventingMedicalErrors/FMEA.htm',
                controller: 'FMEA_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی پیشگیرانه خطاهای پزشکی (FMEA)',
                    parent: 'PreventingMedicalErrors',
                    icon: 'icon-font icon-snjab-b1'
                }
            })
            .state('FMEA_process', {
                url: '/PreventingMedicalErrors/FMEA_process',
                templateUrl: 'views/fault_management/PreventingMedicalErrors/FMEA_process.htm',
                controller: 'FMEA_process_Ctrl',
                ncyBreadcrumb: {
                    label: 'ارزیابی تحلیل حالات و اثرات فرآیندهای بیمارستان',
                    parent: 'PreventingMedicalErrors',
                    icon: 'icon-font icon-snjab-b1'
                }
            })
            .state('ControllingMedicalErrors', {
                url: '/fault_management/ControllingMedicalErrors',
                templateUrl: 'views/fault_management/ControllingMedicalErrors.htm',
                ncyBreadcrumb: {
                    label: 'پایش و کنترل خطاهای پزشکی',
                    parent: 'fault_management',
                    icon: 'icon-font icon-payesh_va_control_khata'
                }
            })
            .state('How_to_report_medical_errors_without_fear_of_blame', {
                url: '/ControllingMedicalErrors/How_to_report_medical_errors_without_fear_of_blame',
                templateUrl: 'views/fault_management/ControllingMedicalErrors/How_to_report_medical_errors_without_fear_of_blame.htm',
                ncyBreadcrumb: {
                    label: 'روش اجرایی”نحوه گزارش‌دهی همگانی خطاهای پزشکی بدون ترس از سرزنش”',
                    parent: 'ControllingMedicalErrors',
                    icon: 'icon-font icon-ravesh_ejraeey'
                }
            })
            .state('Analysis_reported_errors', {
                url: '/ControllingMedicalErrors/Analysis_reported_errors',
                controller: 'Analysis_reported_errors_Ctrl',
                templateUrl: 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors.htm',
                ncyBreadcrumb: {
                    label: 'بررسی و تحلیل خطاهای گزارش شده',
                    parent: 'ControllingMedicalErrors',
                    icon: 'icon-font icon-modiriyate_khata'
                }
            })
            .state('RCA', {
                url: '/ControllingMedicalErrors/RCA',
                templateUrl: 'views/fault_management/ControllingMedicalErrors/RCA.htm',
                controller: 'Analysis_reported_errors_Ctrl',
                ncyBreadcrumb: {
                    label: 'تحلیل ریشه ای خطاها (RCA)',
                    parent: 'ControllingMedicalErrors',
                    icon: 'icon-font icon-snjab-b2'
                }
            })
            .state('RCA_report', {
                url: '/ControllingMedicalErrors/RCA/report',
                templateUrl: 'views/fault_management/ControllingMedicalErrors/RCA_Report.htm',
                controller: 'RCA_Report_Ctrl',
                ncyBreadcrumb: {
                    label: 'گزارش آماری تحلیل ریشه ای خطاها (RCA)',
                    parent: 'RCA',
                    icon: 'icon-font icon-snjab-b2'
                }
            })
            .state('Learn_and_Share', {
                url: '/ControllingMedicalErrors/Learn_and_Share',
                templateUrl: 'views/fault_management/ControllingMedicalErrors/Analysis_reported_errors.htm',
                controller: 'Analysis_reported_errors_Ctrl',
                ncyBreadcrumb: {
                    label: 'اشتراک گذاری خطا(Learn & Share)',
                    parent: 'ControllingMedicalErrors',
                    icon: 'icon-font icon-snjab-b2'
                }
            })
            .state('EvaluationErrorManagement', {
                url: '/fault_management/EvaluationErrorManagement',
                templateUrl: 'views/fault_management/EvaluationErrorManagement.htm',
                ncyBreadcrumb: {
                    label: 'ارزیابی عملکرد در مدیریت خطاها',
                    parent: 'fault_management',
                    icon: 'icon-font icon-arzyabi_amalkard_khata'
                }
            })
            .state('PatientSafetyIndicators', {
                url: '/EvaluationErrorManagement/PatientSafetyIndicators',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSafetyIndicators.htm',
                ncyBreadcrumb: {
                    label: 'شاخص های ایمنی بیمار',
                    parent: 'EvaluationErrorManagement',
                    icon: 'icon-font icon-shakhes_emeni'
                }
            })
            .state('indicator-identity-card_p', {
                url: '/EvaluationErrorManagement/PatientSafetyIndicators/indicator-identity-card',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSaftyIndicators/indicator-identity-card.htm',
                controller: 'indicator-identity-card_Ctrl',
                ncyBreadcrumb: {
                    label: 'شناسنامه شاخص‌ها',
                    parent: 'PatientSafetyIndicators',
                    icon: 'icon-font icon-shakhes_komitte'
                }


            }).state('IndicatorProcessing_p', {
            url: '/EvaluationErrorManagement/PatientSafetyIndicators/IndicatorProcessing',
            controller: 'indicator-identity-card_Ctrl',
            templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSaftyIndicators/IndicatorProcessing.htm',
            ncyBreadcrumb: {
                label: 'پردازش شاخص‌ها',
                parent: 'PatientSafetyIndicators',
                icon: 'icon-font icon-snjab-d2'
            }


        })
            .state('PatientSafetyVisits_manager', {
                url: '/EvaluationErrorManagement/PatientSafetyVisits_manager',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSafetyVisits.htm',
                controller: 'PatientSafetyVisitsCtrl',
                ncyBreadcrumb: {
                    label: 'بازدیدهای مدیریتی ایمنی بیمار',
                    parent: 'EvaluationErrorManagement',
                    icon: 'icon-font icon-bazdid_emeni'
                }
            })
            .state('PatientSafetyVisits_team', {
                url: '/EvaluationErrorManagement/PatientSafetyVisits_team',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSafetyVisits.htm',
                controller: 'PatientSafetyVisitsCtrl',
                ncyBreadcrumb: {
                    label: 'بازدیدهای تیم ایمنی بیمار',
                    parent: 'EvaluationErrorManagement',
                    icon: 'icon-font icon-bazdid_emeni'
                }
            })
            .state('MonitoringTheSafetyCulture', {
                url: '/EvaluationErrorManagement/MonitoringTheSafetyCulture',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/checklist.htm',
                controller: 'checkList_ctrl',
                ncyBreadcrumb: {
                    label: 'پایش فرهنگ ایمنی',
                    parent: 'EvaluationErrorManagement',
                    icon: 'icon-font icon-bazdid_emeni'
                }
            })
            .state('PatientSafetyRelatedOperationalPlans', {
                url: '/EvaluationErrorManagement/PatientSafetyRelatedOperationalPlans',
                templateUrl: 'views/fault_management/EvaluationErrorManagement/PatientSafetyRelatedOperationalPlans.htm',
                ncyBreadcrumb: {
                    label: 'برنامه های عملیاتی مربوط به ایمنی بیمار',
                    parent: 'EvaluationErrorManagement',
                    icon: ''
                }
            })
            .state('IntroducingPatientSafetyUnit', {
                url: '/fault_management/IntroducingPatientSafetyUnit',
                templateUrl: 'views/fault_management/IntroducingPatientSafetyUnit.htm',
                controller: 'IntroducingPatientSafetyUnitCtrl',
                ncyBreadcrumb: {
                    label: 'معرفی واحد ایمنی بیمار',
                    parent: 'fault_management',
                    icon: 'icon-font icon-masule_emeni'
                }
            });
        /*$routeProvider.when('/',{
			templateUrl:'views/choose_management.htm'

		}).when('/login',{
			templateUrl:'views/login.htm',
			controller:'login'

		});*/

    }]);
app.config(function ($provide) {
    $provide.decorator('ColorPickerOptions', function ($delegate) {
        var options = angular.copy($delegate);
        options.alpha = false;
        options.format = 'hex';
        return options;
    });
});
app.config(function ($sceProvider) {
    $sceProvider.enabled(false);
});
app.run(function ($rootScope, $state, $breadcrumb) {
    $rootScope.isActive = function (stateName) {
        return $state.includes(stateName);
    };

    $rootScope.getLastStepLabel = function () {
        return 'Angular-Breadcrumb';
    };
});
app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    ;
}]);

