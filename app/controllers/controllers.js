// JavaScript Document
var app = angular.module('app', ["template", "app_config", 'naif.base64', 'ngProgress', 'ngImgCrop', 'ncy-angular-breadcrumb', 'ngJalaaliFlatDatepicker', 'angular-carousel-3d', 'color.picker', 'chart.js', 'ngJsonExportExcel', 'ui.bootstrap.progresscircle', 'pascalprecht.translate']);

app.controller('main', function (waiting, $timeout, AllSanjes, $filter, $scope, $location, localStorageService, $http, Server_URL, BASE, factory1, $uibModal, $window, $rootScope, $routeParams, $interval, $q, $sce, ngProgressFactory, shared_scopes, ActionCableChannel, ActionCableSocketWrangler, ActionCableConfig, $state, $route, queryHeaders, $stateParams) {
    $scope = shared_scopes.reset($scope);
    /*    $rootScope.mainScope=$scope;*/
    var MyToken = localStorageService.get('user_token');
    $scope.queryHeaders = queryHeaders;
    $scope.queryHeaders.Authorization = MyToken;
    $scope.BASE = BASE;
    $scope.realtime = [];
    $scope.MyToken = localStorageService.get('user_token');
    hospital_id = localStorageService.get('hospital_id');
    $scope.template = {
        url: ''
    };
    $rootScope.$watch('Menus', function (newVal, oldVal) {
        if (newVal && newVal.length) {
            $rootScope.$on('$stateChangeStart', function () {
                if ($stateParams.menu) {
                    if (!$stateParams.submenu) {
                        if ($stateParams.menu == "مدیریت و رهبری") {
                            $window.location.href = $scope.BASE + "/management";
                        }
                    }
                }
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;

                $rootScope.CurrentSanje = null;
                if ($stateParams.menu) {
                    $rootScope.Menus.forEach(function (itm) {
                        if (itm.name == $stateParams.menu) {
                            $rootScope.CurrentMenu = angular.copy(itm);
                        }
                    });

                    if ($rootScope.CurrentMenu) {
                        $scope.state_icon = $rootScope.CurrentMenu.icon;
                        $scope.state_title = $rootScope.CurrentMenu.name;
                    }

                    /*$state.current.ncyBreadcrumb.icon= $scope.state_icon;*/

                }
                if ($stateParams.submenu) {

                    $rootScope.CurrentMenu.assissment_submenus.map(function (itm) {
                        if (itm.name === $stateParams.submenu) {
                            $rootScope.CurrentSubmenu = angular.copy(itm);
                        }
                    });

                    $scope.state__title = $rootScope.CurrentSubmenu.name;
                    $scope.state__icon = $rootScope.CurrentSubmenu.icon;

                } else {

                    if ($rootScope.CurrentMenu && $rootScope.CurrentMenu.name == "مدیریت و رهبری") {
                        $window.location.href = $scope.BASE + "/management";
                    }
                }
                if ($stateParams.standard) {
                    console.log($stateParams.standard, $rootScope.CurrentSubmenu)
                    $rootScope.CurrentSubmenu.assissment_standards.map(function (itm) {
                        if (itm.name === $stateParams.standard) {
                            $rootScope.CurrentStandard = angular.copy(itm);
                        }
                    });

                    $scope.state___title = $rootScope.CurrentStandard.name;
                    $scope.state___icon = $rootScope.CurrentStandard.icon;
                    $scope.state____title = '';
                    $scope.state____icon = '';
                    $scope.active_view = -1;
                    $scope.template = {url: ''};
                    $rootScope.CurrentSanje = null;
                }
                if ($stateParams.sanje) {
                    $rootScope.CurrentStandard.assissment_sanjes.map(function (itm) {
                        if (itm.name === $stateParams.sanje) {
                            $rootScope.CurrentSanje = angular.copy(itm);
                        }
                    });

                    $scope.state____title = $rootScope.CurrentSanje.name;
                    $scope.state____icon = $rootScope.CurrentSanje.icon;
                    $scope.active_view = -1;
                    $scope.template = {url: ''};
                }
                $rootScope.is_parent = $stateParams.visit == undefined || $stateParams.visit == null;

            });
            $rootScope.get_step_icon = function (step) {
                var icon = {
                    '/': function () {
                        return $scope.state_icon
                    },
                    'submenu': function () {
                        return $scope.state__icon
                    },
                    'standard': function () {
                        return $scope.state___icon
                    },
                    'standard.sanje': function () {
                        return $scope.state____icon
                    }
                };
                return icon[step.name]();
            };
            $rootScope.get_step_title = function (step) {

                var icon = {
                    '/': function () {
                        return $scope.state_title
                    },
                    'submenu': function () {
                        return $scope.state__title
                    },
                    'standard': function () {
                        return $scope.state___title
                    },
                    'standard.sanje': function () {
                        return $scope.state____title
                    }
                };
                return icon[step.name]();
            };

            $rootScope.isPageFullyLoaded = true;
            $timeout(function () {
                try {
                    $state.reload();
                } catch (e) {

                }

            }, 100);

        }

    });
    $rootScope.is_parent = true;
    $scope.resetActiveView = function () {
        $scope.active_view = -1;
        $scope.template.url = '';
        $rootScope.is_parent = true;
        $rootScope.CurrentStep = null;
    };
    $scope.resetActiveView();
    /*    $scope.$watch('MyToken', function (oldVal, newVal) {
            if (oldVal !== newVal && $scope.MyToken === null) {
                queryHeaders.Authorization = "";
                $scope.queryHeaders.Authorization = '';
                window.location.href = BASE;
            }
        });*/


    $scope.set_active_view = function (i, row) {
        $scope.template.url = 'views/sanje/';
        $timeout(function () {
            $scope.active_view = i;
            if (row) {

                $rootScope.CurrentStep = row;
                $scope.template.url = 'views/sanje/' + AllSanjes[row.step_type];
            }


        }, 100)

    };
    var callback = function (message) {
        var notify = angular.isString(message.notification) ? JSON.parse(message.notification) : message.notification;

        console.log(notify);
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

                consumer.subscribe(callback).then(function () {

                    $scope.$on("$destroy", function () {
                        consumer.unsubscribe().then(function () {


                        });

                    });

                });
                consumer.onConfirmSubscription(function () {

                });

            }

        }

    };
    if ($scope.MyToken) {
        $scope.access = localStorageService.get('access');
        $scope.me = localStorageService.get('me');
        ActionCableConfig.wsUri = $scope.wss + Server_URL.replace('https:', '').replace('http:', '') + "/cable?id=" + $scope.me.id;
        $timeout(function () {
            ActionCableSocketWrangler.start();
        }, 5000);
    } else {
        $rootScope.$broadcast("unauthorized");
    }
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
    $scope.users = [];
    $scope.wards = [];
    $scope.main_ward_name = [];
    $scope.job_groups = [];
    $scope.posts = [];
    $scope.job_location = [];
    factory1.get_ward_list().then(function (data) {
        $scope.wards = data;
    });
    factory1.get_users().then(function (data) {

        data.map(function (itm) {
            itm.committee_name = itm.committee_name === 'ندارد' ? 'سایر اعضا' : itm.committee_name;
        });
        $scope.all_users = angular.copy(data);
        $rootScope.all_users = angular.copy(data);
        var uniq_usr = [];
        var users = [];
        data.map(function (itm) {
            if (itm.users.length) {
                itm.users = itm.users.filter(function (usr) {
                    if (uniq_usr.indexOf(usr.id) === -1) {
                        uniq_usr.push(usr.id);
                        return true;
                    }
                });
            }
            if (itm.users.length) {
                users.push(itm);
            }
        });
        $scope.users = users;
    });

    factory1.getUserApi('/v1/hospital/job_groups', null, 'job_groups_' + $rootScope.year, 7).then(function (data) {
        $scope.job_groups = data;
    });
    factory1.getUserApi('/v1/user/hospital/post_units', null, 'posts_' + $rootScope.year, 7).then(function (data) {
        $scope.posts = data;
    });
    factory1.getUserApi('/v1/user/hospital/job_location_units', null, 'job_location_' + $rootScope.year, 7).then(function (data) {
        $scope.job_location = data;
    });
    $scope.optionsList = {
        job_groups: $scope.job_groups,
        posts: $scope.posts,
        job_location: $scope.job_location
    }
    $scope.$watch('realtime', function (newVal, oldVal) {
        if (newVal !== oldVal && $rootScope.onprinting) {
            console.log(newVal)
            var i = newVal.findIndex(function (itm) {
                return itm.record_type === 'configuration_excel'
            });
            if (i >= 0) {
                $scope.download_file($scope.Server_URL + newVal[i].url);
                $rootScope.onprinting = false;
                newVal.splice(i, 1);
            }
        }
    }, true)
});
app.controller('configurationCtrl', function ($stateParams, $state, $scope, $rootScope, factory1, $filter, BASE, $q, $translate) {
    $scope.send_to = function (url, users, selected_users, msg, id, callBack) {
        if (users) {
            var arr = [];
            arr = angular.copy(users);
            if (selected_users) {
                selected_users = angular.isArray(selected_users) ? selected_users : $scope.to_array([], selected_users, '-');
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
            var result = $scope.open_modal('lg', $scope.BASE + '/asset/directives/user.htm', 'User_modal_Ctrl', {
                users: function () {
                    return arr;
                }
            }, 'blue_modal');
            result.result.then(function (r) {
                if (r) {

                    selected_users = r;
                    if (selected_users.length) {
                        var parameter = JSON.stringify({
                            id: id,
                            users: selected_users.map(function (itm) {
                                return itm.id
                            }),
                            year: $rootScope.year,
                            committee_name: $scope.state__title,
                            committee_icon: $scope.state__icon,
                        });
                        factory1.putUserApi(url, parameter).then(function (data) {
                            $scope.success_alert(msg, 'اطلاع رسانی');
                            if (callBack) {
                                callBack(data);
                            }
                        });
                    } else {
                        return false;
                    }


                }
            });
        }
    };
    $scope.config_set = false;
    $scope.radio = {};
    $scope.radio_id = {};
    $scope.selected_config = null;
    $scope.dataRecords = [];
    $scope.indexOfData = null;
    $scope.config_attributes_copy = [];
    $scope.configuration_page = $rootScope.CurrentSanje.assissment_steps.length > 1 && $rootScope.CurrentStep ? $rootScope.CurrentStep.configuration_page : angular.copy($rootScope.CurrentSanje.assissment_steps[0].configuration_page);
    $scope.has_detail = false;
    $scope.has_detail_multiFile = false;
    $scope.page = 1;
    $scope.per_page = 10;
    $scope.total_page = 1;
    var reg = new RegExp(/\(|\)|\*|\/|\%|\+|\-|AND|OR|and|or|XOR|&&|<=|>=|<|>|!=|==|&|OR*|!|\|{1,2}/g);
    var reg_condition = new RegExp(/AND|OR|and|or|XOR|&&|<=|>=|<|>|!=|==|&|OR*|!|\|{1,2}/g);

    function persianToEnglish(string) {

        return string.toString().replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c) {
            return c.charCodeAt(0) & 0xf;
        });
    }

    function calc(a, op, b, OtherType, type) {
        try {

            /* if (typeof a !== 'number' || typeof b !== 'number' || typeof op !== 'string')
                 return null;*/

            if (OtherType) {
                var momentOpt = {
                    '<': 'isBefore',
                    '>': 'isAfter',
                    '==': 'isSame',
                    '<=': 'isSameOrBefore',
                    '>=': 'isSameOrAfter',
                    '-': 'diff'
                }
                if (OtherType === 'date') {
                    type = type || 'day';
                    return moment(a, 'jYYYY/jMM/jDD')[momentOpt[op]](moment(b, 'jYYYY/jMM/jDD'), type);
                } else if (OtherType === 'time') {

                    type = type || 'minute';

                    return moment(a).second(0)[momentOpt[op]](moment(b).second(0), type);
                }
            } else {
                a = parseFloat(a);
                b = parseFloat(b);
                a = persianToEnglish(a);
                b = persianToEnglish(b);
            }
            /* if (['<', '>', '<=', '>=', '==', '!='].indexOf(op) == -1)
                 return null;*/

            return eval(a + op + b)
        } catch (e) {
            console.error(e);
            return '-'
        }


    }

    function getValueInCondition(itm, attributes) {
        var condition = itm.condition;
        var operations = $scope.to_array([], condition, reg);
        var operator = condition.match(reg);
        var condition_ = condition.match(reg_condition);
        var otherType = null;
        var type = null;
        if (operator && operator.length && operations.length) {
            var operations_value = [];
            operations.map(function (opt) {
                var obj = attributes.find(function (atr) {
                    return atr.key === opt;
                });
                if (obj) {
                    if (obj.type === 'time' || obj.type === 'date') {

                        type = itm.max_char;
                        /*day or minute reasult*/
                        otherType = obj.type;
                    }
                    operations_value.push(obj.value);
                }
            })
            var res = calc(operations_value[0], operator[0], operations_value[1], otherType, type);

            return condition_ && condition_.length ? (res ? '<i class="fa fa-check-circle-o text-green2 fa-2x"></i>' : '<i class="fa fa-times-circle-o text-red fa-2x"></i>') : Math.round(res);
        }
        return '?';
    }

    function getObjectID(attributes, data_type_options) {
        var res = '';
        if (attributes) {
            var obj = attributes.find(function (attr) {
                return attr.data_type_options == data_type_options;
            });
            if (obj) {
                res = obj.orginalValue
            }
        }
        return res;
    }

    function setDataAttr(attr, itm, data, record) {

        if (itm.hidden_in_table) {
            $scope.has_detail = true;
            attr.hidden_in_table = true;
            if (itm.data_type === 'multiFile') {
                $scope.has_detail_multiFile = true;
            }
        }
        attr.type = angular.copy(itm.data_type);
        attr.orginValue = angular.copy(itm.value);
        attr.key = angular.copy(itm.key);
        if (itm.data_type === 'table' || itm.data_type === 'checkbox' || itm.data_type === 'textbox' || itm.data_type === 'textarea' || itm.data_type === 'date' || itm.data_type === 'multiFile' || itm.data_type === 'time') {
            //attr.value = itm.value;
            if (itm.data_type === 'checkbox') {
                console.log(attr, itm, data, record)
                attr.value = attr.value === '0' || attr.value === '' ? false : attr.value;
            }
            if (itm.data_type === 'table') {
                attr.value = angular.copy(attr.value ? (angular.isString(attr.value) ? JSON.parse(attr.value) : attr.value) : '');
                if (attr.value) {
                    var attr_value = attr.value.map(function (v) {
                        /*[ "user:جـانان ویداخانـی (02555) پرستار-ward:بخش 1-مشخصات:132-تاریخ ثبت:1398/10/16" ]
                        *
                        * get all column of current record of table by split v
                        * */
                        var vv = {}
                        v.split('-').map(function (obj) {
                            /*detect key and value of column */
                            var sub_obj = obj.split(':');
                            vv[sub_obj[0]] = sub_obj[1];
                        });
                        return vv;

                    });
                    attr.value = angular.copy(attr_value);
                }

            }
        } else if (itm.data_type === 'text') {

            if (itm.key === 'ردیف' || itm.value && itm.value.indexOf('$index') >= 0) {
                attr.value = '$index+1';
            } else if (itm.value && itm.value === 'Created-at') {
                attr.value = $scope.get_date(attr.created_at);
            } else if (itm.value && itm.value === 'send_to_at') {
                attr.value = $scope.get_date(record.sent_to_at);
            } else if (itm.value && itm.value === 'fullName') {
                attr.value = $scope.get_person(record.value, $scope.all_users);
            } else if (itm.value) {
                var v = $scope.get_user(getObjectID(record.arrtibutes || record.attributes, 'user'), $scope.all_users);

                itm.value = itm.value && itm.value === 'post_name' ? 'posts_name' : itm.value;
                /*if( itm.value==='جنسیت' || itm.value==='cell_phone'|| itm.value==='شماره شناسنامه'|| itm.value==='کد ملی' || itm.value==='national_id' || itm.value==='post_name'){

                    if(v){


                        attr.value=itm.value==='personal_code'?v['personal_code']:(itm.value==='جنسیت'?v['gender']:(itm.value==='cell_phone'?v['cell_phone']:(itm.value==='شماره شناسنامه' || itm.value==='کد ملی'|| itm.value==='national_id'?v['national_id']:(itm.value==='post_name'?v['posts_name']:'-'))))
                    console.log(itm.value,attr.value)
                    }
                }else{*/

                attr.value = v ? (angular.isArray(v[itm.value]) ? v[itm.value][0] : v[itm.value]) : '-'
                //}
            } else {
                var vv = '-';
                if (itm.condition) {
                    vv = getValueInCondition(itm, record.arrtibutes || record.attributes);
                    vv = isNaN(vv) ? '-' : vv;
                }
                attr.value = vv;
            }


        } else if (itm.data_type === 'file') {
            // console.log(attr, itm, data, record)
            attr.value = attr.file.url ? $scope.Server_URL + attr.file.url : null;
            attr.file_name = itm.file_title || attr.file_name;
            attr.has_file = true;
        } else if (itm.data_type === 'radio') {
            attr.relation_with = itm.relation_with;
        } else if (itm.data_type === 'select' || itm.data_type === 'multiSelect') {

            if (itm.data_type_options) {
                attr.orginalValue = angular.copy(attr.value);
                attr.data_type_options = angular.copy(itm.data_type_options[0]);
                if (itm.data_type === 'multiSelect') {

                    if (itm.data_type_options[0] !== 'user') {
                        var arr = angular.copy(attr.value ? (angular.isString(attr.value) ? JSON.parse(attr.value) : attr.value) : '');

                        attr.value = '';
                        // console.log(arr)
                        if (arr && angular.isArray(arr))
                            arr.map(function (x) {
                                if (itm.data_type_options[0] === 'ward') {
                                    attr.value += $scope.get_ward_name(x, $scope.wards);

                                } else if (itm.data_type_options[0] === 'committees') {
                                    attr.value += $scope.get_committe(x);
                                } else if (itm.data_type_options[0] === 'job_groups') {
                                    var j = $scope.job_groups.find(function (y) {
                                        return y._id == x;
                                    });
                                    if (j) {
                                        attr.value += j.name;
                                    }
                                } else {
                                    attr.value += x;
                                }
                                attr.value += '<br/>';
                            })
                    }

                } else {
                    if (itm.data_type_options[0] === 'ward') {
                        attr.value = attr.value && attr.value.length >= 24 ? $scope.get_ward_name(attr.value, $scope.wards) : attr.value;

                        if (attr.value && attr.value.length < 24) {
                            var __ward__ = angular.copy(attr.value).replace(new RegExp('ي'), 'ی')
                                .replace(new RegExp('ك'), 'ک')
                                .replace(/\s/g, '')
                                .replace(new RegExp("‌"), '')
                                .replace(new RegExp("‌"), '')
                                .replace(new RegExp("‌"), '')
                                .replace('‌', '')
                                .replace(/\n/g, '');
                            var ward = $scope.wards.find(function (w) {
                                return angular.copy(w.name).replace(new RegExp('ي'), 'ی')
                                        .replace(new RegExp('ك'), 'ک')
                                        .replace(/\s/g, '')
                                        .replace(new RegExp("‌"), '')
                                        .replace(new RegExp("‌"), '')
                                        .replace(new RegExp("‌"), '')
                                        .replace('‌', '')
                                        .replace(/\n/g, '')
                                    === __ward__
                                    ;
                            })
                            if (ward) {
                                attr.orginalValue = angular.copy(ward._id);
                            }

                        }
                    } else if (itm.data_type_options[0] === 'user') {
                        attr.value = $scope.get_person(attr.value, $scope.all_users);
                    } else if (itm.data_type_options[0] === 'committees') {
                        attr.value = $scope.get_committe(attr.value);
                    } else if (itm.data_type_options[0] === 'job_groups') {
                        var j = $scope.job_groups.find(function (x) {
                            return x._id == attr.value;
                        });
                        if (j) {
                            attr.value = j.name;
                        }
                    }
                }
            }
        } else {

            attr.value = '-';
        }

        attr.data = data;

        attr.record = angular.copy(record);
        if (attr.value === '' || attr.value === null) {
            attr.value = '-';
        }
        attr.style = $scope.getStyle(attr, itm);

        return attr;
    }

    function setFileNameByColumn(file, column, itm, file_name, config_id) {
        /*console.log(file, column, itm,file_name,config_id)*/
        return itm.map(function (c) {
            if (c && (c.config_id === config_id || c.key === column) && !c.has_file) {
                console.log(c, file_name, file, column)
                c.has_file = true;
                c.file_name = angular.copy(c.value) || file_name;
                c.value = file ? $scope.Server_URL + file : null;
            }
            return c;
        })


    }

    function SetData(data, config_attributes, dataRecords_, sort_field_) {

        var dataRecords = dataRecords_ || [];
        var sort_field = sort_field_ && sort_field_.length ? angular.copy(sort_field_) : config_attributes.map(function (c) {
            return c.key
        });
        // $scope.configs=$scope.setBySortedList(angular.copy(itm.configuration_page.configuration_page_attributes),itm.configuration_page.sort_field,'key');
        var config_attributes_copy = $scope.setBySortedList(angular.copy(config_attributes), sort_field, 'key');
        // var grouped = $filter('groupBy')(config_attributes.filter(function (itm) {
        //     return itm.relationship_in && !itm.relationship_out;
        // }), 'relationship_in');

        if (data.records) {
            data.records.map(function (r, j) {
                //var attributes___=[];
                $scope.setBySortedList(angular.copy(r.attributes), sort_field, 'key').map(function (attr) {

                    config_attributes_copy.find(function (itm, i) {
                        if (attr.config_id === itm._id) {
                            /*if (itm.data_type === 'file' && itm.file_title && itm.file_title.length ) {

                                if (config_attributes_copy[i] && config_attributes_copy[i].data_type === 'file') {

                                    config_attributes_copy.splice(i, 1);
                                }
                             /!*  console.log(itm)*!/
                                dataRecords[j] = setFileNameByColumn(attr.file.url, itm.file_title, dataRecords[j],attr.file.name,itm._id);

                                return false;
                            }*/
                            if (!dataRecords[j]) {
                                dataRecords[j] = [];
                            }
                            var x = angular.copy(setDataAttr(attr, itm, data, r));
                            if (x.data_type_options === 'user') {
                                var attributes___copy = angular.copy(x);
                                delete attributes___copy.data;
                                var index = r.attributes.findIndex(function (attr_) {
                                    return attr_.id === attributes___copy.id
                                });
                                r.attributes[index] = angular.copy(attributes___copy);
                            }

                            // attributes___.push(attributes___copy);
                            dataRecords[j][i] = x;
                            //data.records[j]=angular.copy(x);
                            return true;
                        }
                    });

                    dataRecords[j] = dataRecords[j] ? dataRecords[j].filter(function (d) {
                        return d !== undefined && d !== null
                    }) : [];
                });
                //console.log(attributes___,r.attributes)
                //r.attributes=angular.copy(attributes___);
            });
        } else if (data.record) {
            var d = [];
            data.record.arrtibutes.map(function (attr) {
                config_attributes_copy.find(function (itm, i) {
                    if (attr.key === itm.key) {
                        /*if (itm.data_type === 'file' && itm.file_title && itm.file_title.length) {

                            if (config_attributes_copy[i] && config_attributes_copy[i].data_type === 'file') {

                                config_attributes_copy.splice(i, 1);
                            }
                            d = setFileNameByColumn(attr.file.url, itm.file_title, d,attr.file.name,itm.config_id);
                            return false;
                        }*/
                        /*if (!d[i]) {
                            d[i] = [];
                        }*/
                        if (data.record.arrtibutes) {
                            data.record.attributes = angular.copy(data.record.arrtibutes)
                            delete data.record.arrtibutes;
                        }
                        d[i] = angular.copy(setDataAttr(attr, itm, data, data.record));
                        return true;
                    }

                });

            });
            d = d.filter(function (d) {
                return d
            });
            if ($scope.indexOfData !== null) {
                dataRecords[$scope.indexOfData] = d;
            } else {
                dataRecords.push(d);
            }
        }

        return dataRecords.map(function (dataRecord) {

            if (dataRecord && dataRecord.length) {
                config_attributes_copy.find(function (config_attributes_copy_, i) {
                    var c = angular.copy(config_attributes_copy_)
                    var has_config = dataRecord.find(function (dc, j) {

                        return dc.config_id === c._id
                    });
                    if (!has_config) {

                        var dataR = dataRecord.find(function (d) {

                            return d.data
                        });
                        if (c.value === 'personal_code' || c.value === 'جنسیت' || c.value === 'cell_phone' || c.value === 'شماره شناسنامه' || c.value === 'کد ملی' || c.value === 'national_id' || c.value === 'post_name') {

                            var user = dataRecord.find(function (d) {
                                return d.data_type_options === 'user' && d.orginalValue
                            });
                            if (user && user.orginalValue) {
                                var v = $scope.get_user(user.orginalValue, $scope.all_users);

                                c.value = c.value === 'personal_code' ? v['personal_code'] : (c.value === 'جنسیت' ? v['gender'] : (c.value === 'cell_phone' ? v['cell_phone'] : (c.value === 'شماره شناسنامه' || c.value === 'کد ملی' || c.value === 'national_id' ? v['national_id'] : (c.value === 'post_name' ? v['posts_name'] : c.value))))
                            }
                        }
                        dataRecord.push({
                            value: angular.copy(c.value || '-'),
                            id: 'new#' + c._id,
                            files: [],
                            type: c.data_type,
                            key: c.key,
                            configuration_page_answer_record_id: dataR ? dataR.configuration_page_answer_record_id : null,
                            valueModel: c.data_type === 'table' || c.data_type.indexOf('multi') >= 0 ? [] : ''
                        })

                    }


                });

                dataRecord = angular.copy($scope.setBySortedList(dataRecord, sort_field, 'key'));

            }
            return dataRecord

        });


    }

    function getData(certificate, config_attributes, query, sort_field, page) {
        page = page || 1;
        var defer = $q.defer();
        var queryString = '';
        if (query) {
            for (var k in query) {
                if (query.hasOwnProperty(k)) {
                    queryString += '&' + k + "=" + query[k];
                }
            }
        }
        $rootScope.loading_in_app = true;
        factory1.getUserApi('/v1/user/hospital/configuration_page/records', '&page=' + page + '&per=' + $scope.per_page + '&certificate=' + certificate + queryString).then(function (data) {
            try {
                if (data) {
                    defer.resolve(SetData(data, config_attributes, [], sort_field));
                    $scope.total_page = Math.ceil(data.all_records_count / $scope.per_page);
                }
            } catch (e) {
                console.error(e);
                defer.reject(e);
            }
            $rootScope.loading_in_app = false;
        })

        return defer.promise;
    }

    function getOutSourceData(source, connector) {

        var orginalValue = source.orginalValue;
        var configuration_page = null;
        $rootScope.Menus.map(function (menu) {
            menu.assissment_submenus.map(function (submenu) {
                if (submenu._id === connector.assissment_submenu) {
                    submenu.assissment_standards.map(function (standard) {
                        standard.assissment_sanjes.map(function (sanje) {
                            if (sanje._id === connector.assissment_sanje) {
                                sanje.assissment_steps.map(function (step) {
                                    if (step._id === connector.assissment_step) {
                                        configuration_page = step.configuration_page;
                                    }
                                })
                            }
                        })
                    })
                }
            })
        });
        if (configuration_page) {
            getData(configuration_page.certificate, configuration_page.configuration_page_attributes, {
                key: [source.key],
                value: orginalValue
            }, configuration_page.sort_field).then(function (res) {

                $scope.action('detail', res[0], configuration_page.configuration_page_attributes);
            })
        }

    }

    function openMultiFile() {
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);
    }

    var actionFN = {
        detail: function (data, index, detail_config_attributes_copy) {
            $scope.detail_config_attributes_copy = angular.copy(detail_config_attributes_copy);
            $scope.detail_recordes = data;
            $scope.open_modal('lg', 'detail.html', null, null, 'blue_modal', $scope, true);
        },
        detailMultiFile: function (data, index) {
            $scope.detail_recordes = data;
            $scope.open_modal('lg', 'detail_multiFile.html', null, null, 'blue_modal', $scope, true);
        },
        delete: function (data, index) {
            $scope.question('آیا از حذف سطر مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
                if (r) {
                    var id = data[0].configuration_page_answer_record_id;
                    factory1.deleteUserApi('/v1/user/hospital/configuration_page/answer/' + id).then(function (data) {
                        $scope.dataRecords.splice(index, 1);
                        $scope.indexOfData = null;
                    });
                }
            })
        },
        edit: function (data, index) {
            $scope.config_set_toggle();
            $scope.indexOfData = index;
            $scope.edit_config = true;
            $scope.edit_id = data[0].configuration_page_answer_record_id;
            angular.copy($scope.config_attributes).map(function (itm) {

                data.map(function (d) {
                    if (itm.key === d.key) {

                        if (d.type === 'radio') {
                            if (d.value === '1') {
                                $scope.radio[d.relation_with] = angular.copy(d.key);
                                $scope.radio_id[d.relation_with] = angular.copy(d.id);
                            }

                        } else if (d.type === 'select') {
                            itm.valueModel = d.orginalValue;
                        } else if (d.type === 'multiSelect') {
                            itm.valueModel = d.orginalValue ? (typeof d.orginalValue === 'string' ? JSON.parse(d.orginalValue) : d.orginalValue) : {};
                        } else {
                            if (d.file_name) {
                                itm.valueModel = angular.copy(d.file_name);
                            } else {
                                itm.valueModel = angular.copy(d.value);
                            }
                        }

                        itm.id = angular.copy(d.id);
                    }
                });
                $scope.config_attributes_editable[$scope.config_attributes_editable.findIndex(function (c) {
                    return c._id === itm._id;
                })] = angular.copy(itm);
            })

        },
        send_to: function (data, index) {
            var sent_to = data && data[0] && data[0].record && data[0].record.sent_to ? $scope.to_array([], data[0].record.sent_to ? data[0].record.sent_to.substring(1, data[0].record.sent_to.length - 1) : [], '-') : [];
            $scope.send_to('/v1/user/hospital/configuration_page/answer/send_to', $scope.all_users, sent_to, 'سند با موفقیت اطلاع رسانی شد.', data[0].configuration_page_answer_record_id, function (result) {
                if (result) {

                    $scope.dataRecords[index].map(function (r) {
                        if (r.type === 'text' && r.orginValue === 'send_to_at') {
                            r.record.sent_to = result.sent_to;
                            r.record.sent_to_at = result.sent_to_at;
                            r.value = $scope.get_date(result.sent_to_at);
                        }

                    });
                    $scope.indexOfData = -1;
                }
            });
        }

    }

    $scope.exportExcel = function () {

        factory1.postUserApi('/v1/user/hospital/configuration_page/excel', JSON.stringify({
            certificate: $scope.configuration_page.certificate,
            year: $rootScope.year
        })).then(function (data) {
            $rootScope.onprinting = true;
            $scope.success_alert('درخواست شما برای دریافت خروجی اکسل ثبت شد لطفاً تا آماده شدن فایل صفحه را تغییر ندهید و از به روزرسانی صفحه خودداری کنید.', 'دریافت خروجی');

        })
    }
    $scope.getStyle = function (attr, item) {

        var condition1 = null;
        var condition2 = null;
        var condition3 = null;
        if (item.positive_value) {
            var condition_ = item.positive_value.match(reg_condition);
            condition1 = calc(attr.value, condition_[0], item.positive_value.replace(reg_condition, ''))
        } else {
            condition1 = calc(attr.value, '>', 0);
        }
        if (item.negative_value) {
            var condition_ = item.negative_value.match(reg_condition);
            condition2 = calc(attr.value, condition_[0], item.negative_value.replace(reg_condition, ''))
        } else {
            condition2 = calc(attr.value, '<', 0);
        }
        if (item.zero_value) {
            var condition_ = item.zero_value.match(reg_condition);
            condition3 = calc(attr.value, condition_[0], item.zero_value.replace(reg_condition, ''))
        } else {
            condition3 = calc(attr.value, '==', 0);
        }
        return item.positive_color != null || item.negative_color != null || item.zero_color != null ? {
            'color': '#fff',
            'background-color': condition1 ? item.positive_color : (condition2 ? item.negative_color : (condition3 ? item.zero_color : ''))
        } : {}
    }
    $scope.onClickButton = function (row, data, $index) {
        console.log(row, data, $index);
        var source = data.find(function (s) {
            return s.key === row.relationship_in;
        })
        if (source) {
            var obj = getOutSourceData(source, JSON.parse(row.relationship_out));
        }
    }
    $scope.showFiles = function (id, files, row, data, event) {
        console.log(id, files, row, data)
        $scope.selectedRecorde = {src: ''};
        $scope.selectedRecordeID = id;
        $scope.files = files || [];

        if (data && !$scope.files.length) {

            var user = data.find(function (itm) {
                return itm.data_type_options === 'user';
            });
            if (user) {
                var userObject = $scope.get_user(user.orginalValue);
                if (userObject && userObject.personal_code && userObject.personal_code) {
                    var cache = true;

                    if (event && event.ctrlKey) {
                        cache = false;
                    }
                    factory1.getUserApi('/v1/his/' + userObject.personal_code, '&rcache=' + cache).then(function (res) {
                        if (res) {
                            files = [];
                            res.map(function (file) {
                                files.push({
                                    file_name: file[1],
                                    file: {
                                        url: file[0]
                                    }
                                })
                            });
                            $scope.files = files;
                            openMultiFile();
                        } else {
                            openMultiFile();
                        }

                    })
                } else {
                    openMultiFile()
                }

            } else {
                openMultiFile();
            }
        } else {
            openMultiFile()
        }


    };
    $scope.uploadFile = function (filename, b64) {
        $scope.selectedRecorde = {src: ''};
        factory1.postUserApi('/v1/user/hospital/configuration_page/answer_with_files', JSON.stringify({
            id: $scope.selectedRecordeID,
            files: [{file_name: filename, file: b64}]
        })).then(function (data) {
            $scope.files = data.files;
            getData($scope.configuration_page.certificate, $scope.config_attributes, null, $scope.sort_field, $scope.page).then(function (res) {
                $scope.dataRecords = res;
            });
        })
    }
    $scope.deleteFile = function (row) {
        $scope.question('آیا از حذف چک لیست مورد نظر مطمئن هستید؟', 'حذف چک لیست').result.then(function (r) {
            if (r) {
                factory1.deleteUserApi('/v1/user/hospital/configuration_page/answer_with_files/' + row.id).then(function (data) {
                    $scope.files.splice($scope.files.indexOf(row), 1);
                    $scope.success_alert('فایل با موفقیت حذف شد!', 'حذف پیوست');
                })

            }
        });
    }
    $scope.action = function (itm, data, res) {
        $scope.indexOfData = angular.copy($scope.dataRecords.indexOf(data));
        actionFN[itm](data, $scope.indexOfData, res);

    };
    $scope.changeRadio = function (row, values, key, $index, radio) {
        console.log(row, values, key, $index, radio)
    }
    $scope.update_config = function () {
        $scope.save_config($scope.edit_id);
    };
    $scope.cancel_config = function () {
        $scope.edit_id = null;
        $scope.config_set_toggle();

    };
    $scope.file_uploaded = function (file, row, callback) {
        // console.log(file, row, callback)
        factory1.upload_file($scope, file, 20000000, row.content_type || [], row.cropper == true, false, 'rectangle').then(function (data) {
            row.b64_file = data;
            row.file_name = file.filename;
            if (callback) {
                callback(file.filename, data)
            }
        });
    };
    $scope.getFor = function ($index, perFix, row) {
        if (perFix === 'select') {
            return 'select_' + $index + row.data_type_options.length > 1 ? '' : (row.data_type_options[0] === 'ward' ? '_ward' : '_users')
        }
    };
    $scope.config_set_toggle = function () {
        $scope.indexOfData = null;
        if ($scope.config_set) {

            $scope.edit_config = false;
            $scope.reset_params($scope.radio);
            $scope.config_attributes_editable = $scope.config_attributes_editable.map(function (itm) {
                itm.valueModel = '';
                delete itm.id;
                if (itm.data_type === 'file') {
                    itm.b64_file = null;
                }
                return itm;
            })
            // $scope.config_attributes.map(function (itm) {
            //     if (itm.data_type !== 'text') {
            //         if (itm.data_type !== 'radio') {
            //             itm.valueModel = '';
            //             if (itm.data_type === 'file') {
            //                 itm.b64_file = null;
            //             }
            //         }

            //     }
            // })

        }
        $scope.config_set = !$scope.config_set;
    };
    $scope.selectMembers = function (obj, row) {
        var arr = [];
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
                $scope.config_attributes.map(function (itm) {
                    if (itm === row) {
                        itm.valueModel = obj;
                    }
                })
            }
        });
    };
    $scope.save_config = function (id) {

        var radio = [], configs = [];
        if ($scope.config_attributes_radio.length) {
            var radioGroups = $filter('groupBy')($scope.config_attributes_radio, 'relation_with');
            for (var keys in radioGroups) {
                if (radioGroups.hasOwnProperty(keys)) {

                    radioGroups[keys].map(function (r) {
                        var _obj = {key: r.key, value: $scope.radio[keys] === r.key ? 1 : 0};
                        if ($scope.radio_id[keys]) {
                            _obj.id = $scope.radio_id[keys];
                        }
                        radio.push(_obj);
                    })


                }
            }
        }
        var user = null;
        configs = angular.copy($scope.config_attributes_editable).map(function (r) {

            if (r.data_type === 'select') {
                if (r.data_type_options) {
                    if (r.data_type_options[0] === 'user') {
                        user = r.value;
                    }
                }
            }
            var p = {key: r.key};
            if (r.id) {
                p.id = r.id.toString().indexOf('new#') >= 0 ? null : r.id;
            }
            p.defValue = angular.copy(r.value);
            if (r.file) {
                if (r.b64_file) {
                    p.file = r.b64_file;
                    p.file_name = r.file_name;
                    if (id) {
                        $scope.dataRecords[$scope.indexOfData].map(function (d) {

                            if (d.type === 'file' && d.key === r.key) {

                                p.id = d.id;
                            }
                        })
                    }
                } else {
                    delete p.id;
                }
            } else if (r.type === 'multiSelect') {
                p.value = $scope.to_string([], r.valueModel, '-');
            } else if (r.data_type === 'table') {
                p.value = r.valueModel && angular.isArray(r.valueModel) ? r.valueModel.map(function (value) {
                    return Object.keys(value).map(function (key) {
                        return key + ':' + value[key];
                    }).join('-')
                }) : '';
            } else if (r.data_type === 'time') {
                console.log(r, p)
                p.value = moment(r.valueModel).format('YYYY-MM-DDTHH:mm:ss');
            } else if (r.data_type !== 'file') {
                p.value = r.valueModel || '';
            }
            p.config_id = r._id;

            return p;
        });
        if (!id) {
            $scope.config_attributes.map(function (ca) {
                var conf = configs.find(function (c) {
                    return ca._id && c.config_id === ca._id;
                });
                if (!conf) {
                    var p = {key: ca.key};
                    p.config_id = ca._id;
                    p.defValue = angular.copy(ca.value);
                    if (ca.data_type === 'multiFile') {
                        p.value2 = angular.copy(ca.value);
                    } else if (ca.data_type === 'text') {
                        if (ca.key === 'ردیف' || ca.value && ca.value.indexOf('$index') >= 0) {
                            p.value2 = '$index+1';
                        } else if (ca.value && ca.value === 'Created-at') {
                            p.value2 = '';
                        } else if (ca.value && ca.value === 'send_to_at') {
                            p.value2 = '';
                        } else if (ca.value && ca.value === 'fullName') {
                            p.value2 = $scope.get_person(user, $scope.all_users);
                        } else if (ca.value) {
                            var v = $scope.get_user(user, $scope.all_users);
                            p.value2 = ca.value && ca.value === 'post_name' ? 'posts_name' : ca.value;
                            p.value2 = v ? (angular.isArray(v[p.value2]) ? v[p.value2][0] : v[p.value2]) : '-';
                        } else {
                            var vv = '-';
                            if (ca.condition) {
                                vv = getValueInCondition(ca, $scope.config_attributes);
                                vv = isNaN(vv) ? '-' : vv;
                            }
                            p.value2 = vv;
                        }

                    } else if (ca.data_type === 'file') {
                        p.value2 = p.file_name;
                    }
                    configs.push(angular.copy(p));

                }

            })
        }


        if (radio.length) {
            configs.map(function (itm) {
                radio.map(function (radio_) {
                    console.log(itm)
                    if (itm.key === radio_.key && !itm.value) {
                        itm.value = radio_.value;
                        if (itm.defValue && itm.defValue.indexOf(',') >= 0 && itm.value) {
                            configs.map(function (itm_0) {
                                if (itm.defValue.indexOf(itm_0.key) >= 0) {
                                    itm_0.value = radio_.value;
                                }
                            });

                        }
                    }

                })

            })
            configs = $filter('unique')(configs, 'key')
        }
        var params = {
            year: $rootScope.year,
            certificate: $scope.configuration_page.certificate,
            records: configs

        };
        if (id) {
            params.id = id;
        }

        factory1.postUserApi('/v1/user/hospital/configuration_page/answer', JSON.stringify(params)).then(function (data) {
            $scope.dataRecords = SetData(data, $scope.config_attributes, $scope.dataRecords, $scope.sort_field);
            $scope.config_set_toggle();

            /*$scope.dataRecords.push(data.record);*/
        });
    };
    $scope.onClickTable = function (row, index) {
        $scope.currentAttribute = angular.copy(row);
        $scope.currentAttributeIndex = angular.copy(index);
        if (!$scope.currentAttribute.valueModel) {
            $scope.currentAttribute.valueModel = [];
        }
        $scope.open_modal('lg', 'tableModal.html', null, null, 'blue_modal full_width', $scope, true)
    }
    $scope.saveTable = function () {
        $scope.config_attributes_editable[$scope.currentAttributeIndex] = angular.copy($scope.currentAttribute);
        $scope.close_modal();
    }
    $scope.addTableRecord = function () {

        var obj = {}
        $scope.currentAttribute.data_type_options.map(function (column) {
            obj[column] = '';
        });

        if (!$scope.currentAttribute.valueModel || !Array.isArray($scope.currentAttribute.valueModel)) {
            $scope.currentAttribute.valueModel = []
        }
        $scope.currentAttribute.valueModel.push(obj)
    }
    $scope.deleteTableRecord = function (row) {
        $scope.question('آیا از حذف سطر مورد نظر مطمئن هستید؟', 'حذف اطلاعات').result.then(function (r) {
            if (r) {
                if ($scope.currentAttribute.valueModel && Array.isArray($scope.currentAttribute.valueModel)) {
                    $scope.currentAttribute.valueModel.splice($scope.currentAttribute.valueModel.indexOf(row), 1)
                } else {
                    $scope.currentAttribute.valueModel = [];
                }
            }
        });
    }
    $scope.showTable = function (row, data, $index) {
        $scope.currentAttribute = angular.copy(row);
        $scope.currentAttribute.readonly = true;
        $scope.currentAttribute.valueModel = [];
        if (data[$index] && angular.isArray(data[$index].value)) {
            $scope.currentAttribute.valueModel = data[$index].value;
        }
        $scope.open_modal('lg', 'tableModal.html', null, null, 'blue_modal full_width', $scope, true)
    }
    if ($scope.configuration_page) {
        $scope.sort_field = angular.copy($scope.configuration_page.sort_field) || [];
        $scope.config_attributes = angular.copy($scope.setBySortedList(angular.copy($scope.configuration_page.configuration_page_attributes), $scope.sort_field, 'key'));

        $scope.config_attributes_editable = $scope.config_attributes.filter(function (ca) {
            return ca.data_type !== 'text' && ca.data_type !== 'radio' && ca.data_type !== 'multiFile' && ca.data_type !== 'button';
        });
        $scope.searchables = $filter('filter_by')($scope.config_attributes_editable, 'searchable', true);
        $scope.config_attributes_copy = angular.copy($scope.config_attributes);

        $scope.action_buttons = angular.copy($scope.configuration_page.action_buttons);
        $scope.config_attributes_radio = $filter('filter_by')($scope.config_attributes, 'data_type', 'radio');
        //console.log($scope.configuration_page)
        getData($scope.configuration_page.certificate, $scope.config_attributes, null, $scope.sort_field, $scope.page).then(function (res) {
            $scope.dataRecords = res;
            // console.log(res)
        });
    }
    $scope.timer = null;
    var searched = false;
    var last_serch = null;

    function searchFn(value, key) {
        $scope.timer = null;
        if (!key) {
            return false;
        }
        if (key === 'ALL') {
            key = $scope.searchables.map(function (itm) {
                return itm.key
            })
        } else {

        }
        var query = key ? {
            key: key,
            value: value
        } : null;
        getData($scope.configuration_page.certificate, $scope.config_attributes, query, $scope.sort_field, $scope.page).then(function (res) {
            $scope.dataRecords = res;
            searched = true;
            last_serch = {value: value, key: key};
            // console.log(res)
        });
    }

    $scope.search = function (value, key) {
        searched = false;
        last_serch = null;
        $scope.page = 1;
        value = value === 'all' ? '' : value;
        if (key.indexOf('time') == 0) {
            value = moment(value).format('YYYY-MM-DDTHH:mm:ss')
        }
        // console.log( $scope.searchables);
        delay.call($scope, function () {
            searchFn(value, key)
        }, 500);
    }
    $scope.next = function () {
        if ($scope.total_page > $scope.page) {
            $scope.page++;
            var value = last_serch ? last_serch.value : '';
            var key = last_serch ? last_serch.key : 'ALL';
            searchFn(value, key);
        }

    }
    $scope.previous = function () {
        if ($scope.page) {
            $scope.page--;
            var value = last_serch ? last_serch.value : '';
            var key = last_serch ? last_serch.key : 'ALL';
            searchFn(value, key);
        }

    }

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
    $scope.files = []
    $scope.get_user = function (id) {
        var usrer = {};

        if (id) {

            $scope.users.map(function (itm) {
                itm.users.find(function (usr) {
                    if (usr.id == id) {
                        usrer = usr;
                        return true;
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
                how_to_monitor: '',
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
                            }
                        });


                }
            });
        }

    };
    $scope.deleteMember = function (row) {
        $scope.members.splice($scope.members.indexOf(row), 1)
    }
    $scope.$watch('instruction_title', function (newVal, oldVal) {

        $scope.get_instruction();

    });
    $scope.$watch('instruction_type', function (newVal, oldVal) {
        $scope.sa.type = $scope.instruction_type && ($scope.instruction_type == 0 || $scope.instruction_type == 2) ? 'روش اجرایی' : 'دستورالعمل'

    });

    $scope.$watch(function () {
        return $state.$current.name
    }, function (newVal, oldVal) {

        $scope.is_parent = $state.$current.self.name === "standard.sanje";
    });

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
    $scope.showFiles = function () {
        $scope.open_modal('lg', 'multiFile.html', null, null, 'blue_modal', $scope, true);

    };
    $scope.send_to = function () {
        if ($scope.sa.id) {
            var arr = [];
            arr = angular.copy($scope.all_users);
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

                            $scope.success_alert(
                                $scope.sa.type + '\“' + $scope.instruction_title + '\”' +
                                ' با موفقیت به اشخاص مورد نظر ارسال شد.', 'ثبت اطلاعات');
                        }).error(function (data, status, headers) {

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

        var parameter = JSON.stringify({
            committee_name: $scope.state__title,
            committee_icon: $scope.state__icon,
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
            how_to_monitor: $scope.sa.how_to_monitor,
            responsible: $scope.sa.responsible,
            resource: $scope.sa.resource,
            personnel: $scope.sa.personnel,
            approach: $scope.sa.approach,
            related_documents: $scope.sa.related_documents,
            Notification_notic: $scope.sa.Notification_notic,
            id: $scope.sa.id,
            year: $rootScope.year

        });
        $http.post(Server_URL + '/v1/user/hospital/instruction/create', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {

                $scope.sa.id = data.id;
                $scope.sa.file_url = data.file.file.url;
                $scope.success_alert(
                    $scope.sa.type + '\“' + $scope.instruction_title + '\”' +
                    ' با موفقیت ثبت شد. چنانچه قصد ارسال آن را دارید، برروی دکمه ارسال به کلیک کنید. ', 'ثبت اطلاعات');
            }).error(function (data, status, headers) {

            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    /*   $scope.Notification_notice_upload=function () {
     factory1.upload_file($scope,$scope.sa.Notification_notice,2000000,['image/jpeg','image/jpg','image/png','application/pdf','application/msword','application/docx'],false,false).then(function (data) {

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
        factory1.upload_file($scope, $scope.sa.file, 2000000, ['application/x-7z-compressed', 'application/zip', 'application/x-rar-compressed', 'audio/mp4', 'audio/mp3', 'audio/3gpp', 'audio/aac', 'audio/x-wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'video/webm', 'video/mp4', 'video/x-m4v', 'video/mpeg', 'video/3gp', 'application/pdf', 'application/msword', 'application/docx', 'application/vnd.ms-powerpoint', 'application/powerpoint', 'application/mspowerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-powerpoint', 'application/x-mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.sealed-xls', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], false, false).then(function (data) {

            $scope.sa.file_b64 = data;


        });
    };
    $scope.history = function () {
        console.log($rootScope.CurrentSanje, $rootScope.CurrentStep);

        $state.go('.instruction_history', {
            instruction_type: $scope.instruction_type,
            instruction_title: $scope.instruction_title,
            parent: $state.current.name
        });
        if ($rootScope.CurrentSanje.assissment_steps.length >= 1) {
            $scope.set_active_view($rootScope.CurrentSanje.assissment_steps.indexOf($rootScope.CurrentStep), $rootScope.CurrentStep)
        }
    };
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
        /*if(row.new_object.files && row.new_object.files.length){
            $scope.download_file(Server_URL+row.new_object.files[row.new_object.files.length-1].file.url);
            return false;
        }*/
        var data = row.new_object;
        var data_old = row.old_object;
        $scope.sa = {};
        $scope.sa_old = {};
        $scope.members = [];
        $scope.members_old = [];
        $scope.guidances = [];
        $scope.guidances_old = [];
        $scope.selected_users = [];
        $scope.sa.type = $stateParams.instruction_type == '1' ? 'دستورالعمل' : 'روش اجرایی';
        $scope.sa.id = data.id;
        if (data.files && data.files.length) {
            $scope.sa.file_url = data.files[data.files.length - 1].file.url;

        }
        /* if(data.file && data.file.url){

             $scope.sa.file_url=data.file.url;
         }*/
        if (data.instruction_documention) {
            if (data.instruction_documention) {
                $scope.sa.goal = data.instruction_documention.goal;
                $scope.sa.domain = data.instruction_documention.domain;
                $scope.sa.requirement_law = data.instruction_documention.requirement_law;
                $scope.sa.defination = data.instruction_documention.defination;
                $scope.sa.resource = data.instruction_documention.resource;
                $scope.sa.personnel = data.instruction_documention.personnel;
                $scope.sa.approach = data.instruction_documention.approach;
                $scope.sa.related_documents = data.instruction_documention.related_documents;
            }

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
    /*  $state.current.ncyBreadcrumb.parent=$stateParams.parent;*/
    $scope.ihistory = [];
    $scope.title = $stateParams.sanje;
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
        var data_old = row.old_object || {};
        $scope.mashi_old = {}
        $scope.mashi = angular.copy(data);
        Object.keys(data).map(function (key) {
            if (data_old[key] != data[key]) {
                $scope.mashi_old[key] = angular.copy(data_old[key]);
            }
        })

        $scope.template.url = BASE + '/asset/directives/mashi.html';
        $scope.is_parent = false;
    };
    factory1.getUserApi('/v1/user/hospital/history', '&title=' + $stateParams.sanje + '&object_type=' + 'policy').then(function (data) {
        $scope.ihistory = data;
        data.forEach(function (itm) {
            var month = moment(itm.created_at).jMonth();
            $scope.edits_chart.data_chart[month]++;
        });

    });
});
app.controller('mashi', function ($scope, factory1, $rootScope, $stateParams, $state) {

    $scope.$watch(function () {
        return $state.$current.name
    }, function (newVal, oldVal) {

        $rootScope.is_parent = $state.$current.self.name === "standard.sanje";

    });

    $scope.title = $stateParams.sanje;
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
                year: $rootScope.year,
                mehvar: $scope.state__title,
                mehvar_icon: $scope.state__icon

            });
            delete parameter.file_b64;
            factory1.postUserApi('/v1/user/hospital/policy', JSON.stringify(parameter)).then(function (data) {
                $scope.mashi = data;
                // $scope.send_to();
            });

        });
    };
    $scope.delete_instruction = function (row) {
        $scope.mashi.steps.splice($scope.mashi.steps.indexOf(row), 1);
    };
    $scope.submitPolicy = function () {
        var parameter = angular.merge($scope.mashi, {
            // has_file: false,
            year: $rootScope.year,
            title: $scope.title,
            mehvar: $scope.state__title,
            mehvar_icon: $scope.state__icon
        });
        delete parameter.has_file;
        if (typeof parameter.file === 'object') {
            delete parameter.file;
        }
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
app.controller('checkList', function ($stateParams, $state, $scope, $rootScope, factory1, $filter, BASE, $timeout, $q) {

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
        is_public: false,
        has_info: false,
        delivery_type: ''
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
    $scope.menuItem2 = [];
    $scope.progress = {
        value: 0
    }
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
    $scope.excel_style = [];
    $scope.excel_outPut = [];
    var question_groupted = null;
    var step_name = $rootScope.CurrentStep ? $rootScope.CurrentStep.description : '';
    var printed = false;
    $scope.excel_filename = step_name;
    $scope.checklistExcel = {}

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
        factory1.getUserApi('/v1/user/hospital/checklists', '&certificate=' + $scope.state____title + '|' + step_name).then(function (data) {
            $scope.excel_outPut = [];
            $scope.excel_style = [];
            serilizeCheckLists(data)
            //console.log(data)
            data.filter(function (d) {
                return d.send_kartabl && d.checklist_page_answers && d.checklist_page_answers.length
            }).map(function (d) {
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

    function set_calender(calender_type, ward, filterByMenuItems) {
        var answers = [];
        var answers_ = angular.copy($scope.checklist.checklist_page_answers ? $scope.checklist.checklist_page_answers : []);
        if (answers_.length) {
            answers_.map(function (ans) {
                ans.checklist_page_answers.map(function (cpa) {
                    var itm = angular.copy(cpa);
                    if (itm.checklist_page_answer_details) {
                        var checklist_page_answer_details_length = 0;

                        itm.value = 0;
                        if (filterByMenuItems && filterByMenuItems.length) {

                            itm.checklist_page_answer_details = itm.checklist_page_answer_details.filter(function (detail) {
                                /*return c.checklist_page_answer_detail_infos.find(function (info) {
                                    return filterByMenuItems.indexOf(info.value.toString())>=0;
                                })*/
                                var hasInfo = filterByMenuItems.every(function (menu) {

                                    return detail.checklist_page_answer_detail_infos.find(function (info) {
                                        console.log(menu, info.value, detail)
                                        return info.value != null && info.value.toString()
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ك'), 'ک')
                                            ===
                                            menu.toString()
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ك'), 'ک');
                                    })
                                })
                                return hasInfo;
                            })
                        }
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
                                r.answers_data = day.answers_data ? day.answers_data.filter(function (a) {
                                    return !a.save_temp
                                }) : [];
                                r.temp_answers_data = day.answers_data ? day.answers_data.filter(function (a) {
                                    return a.save_temp
                                }) : [];
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
            itm.is_req = true;
        })
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
        var menu_items = $scope.menuItems.filter(function (itm) {
            return itm.checked;
        }).map(function (itm) {
            return itm.id;
        });
        var required_answer_items = $scope.menuItems.filter(function (itm) {
            return itm.checked && itm.is_req;
        }).map(function (itm) {
            return itm.id;
        });
        var params = {
            required_answer_items: required_answer_items,
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
            certificate: $scope.state____title + '|' + step_name,
            mehvar: $scope.state__title,
            mehvar_icon: $scope.state__icon,
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
            console.log(data)
            serilizeCheckLists($scope.checkLists);
            console.log($scope.checkLists)
            $scope.toggle_compilation_checklist();
        });
    }

    function getAllAnswerInfo() {
        factory1.getUserApi('/v2/get_all_answerer_info_menu_items').then(function (data) {
            $scope.menuItems = data.items;
            resetAnswers();
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

    $scope.checklistOnBeforePrinting = function (row) {
        var defer = $q.defer();
        if ($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data.length) {
            defer.resolve({data: $scope.checklistExcel[row._id].data, style: $scope.checklistExcel[row._id].style})
        } else {

            $scope.checklistExcel[row._id] = {
                data: [],
                style: []
            }
            console.log(row);
            var menu_items = angular.copy(row.menu_items);
            var max = 1;
            var guides = $filter('groupBy')(row.checklist_page_guides, 'key');
            var questions = angular.copy(row.checklist_page_questions);
            var answers = {};
            row.checklist_page_answers.map(function (c) {
                c.checklist_page_answers.map(function (checklist_page_answer) {
                    if (checklist_page_answer.checklist_page_answer_details) {
                        if (!answers[checklist_page_answer.submitted_at]) {
                            answers[checklist_page_answer.submitted_at] = []
                        }
                        answers[checklist_page_answer.submitted_at] = answers[checklist_page_answer.submitted_at].concat(checklist_page_answer.checklist_page_answer_details)
                    }

                })
            });
            var all2level = questions.every(function (q) {
                return q.point_type === 'سوال باز' || q.point_type === 'دوسطحی'
            });

            function get_question_type(q) {
                var question = questions.find(function (qq) {
                    return qq.key === q
                });
                return question ? question.point_type : '';
            }

            var style = angular.copy(excelStyleInstans2);
            var style2 = angular.copy(excelStyleInstans3);
            Object.keys(guides).map(function (guide) {
                guides[guide].map(function (g) {
                    style.columns.push({columnid: g.value, title: g.value, width: 300})
                })
            });
            style.columns.push({columnid: 'middel_value', title: 'امتیاز کل', width: 300});
            console.log(answers)
            var infos = [];
            Object.keys(answers).map(function (submitted_at) {
                var s = angular.copy(style);
                var data = [];
                if (answers[submitted_at]) {
                    questions.map(function (q) {
                        var data_ = {
                            'حیطه': q.component,
                            'سؤال': q.key,
                            'امتیاز کل': '-'
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
                        var info = {
                            'بخش': ans.ward_id ? $scope.get_ward_name(ans.ward_id, $scope.wards) : '-',
                            'امتیاز': 0,
                            'وضعیت': '-'
                        }
                        if (ans.checklist_page_answer_detail_records) {
                            var counter = 0;
                            var value = 0;
                            ans.checklist_page_answer_detail_records.map(function (answer_record) {
                                var question_type = get_question_type(answer_record.question);
                                if (question_type === 'کیفی' || question_type === 'عددی' || question_type === 'درصدی' || all2level) {
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
                            var mi = ans.checklist_page_answer_detail_infos ? ans.checklist_page_answer_detail_infos.find(function (info_) {
                                return info_.answerer_info_menu_item_id == menu_item.id;
                            }) : [];
                            info[menu_item.item] = mi && mi.value !== null ? mi.value : '-';
                        })

                        info['وضعیت'] = info['امتیاز'] <= 50 ?
                            'ضعیف'
                            :
                            (info['امتیاز'] > 50 && info['امتیاز'] <= 75 ?
                                'متوسط'
                                : (
                                    info['امتیاز'] > 75 && info['امتیاز'] <= 90 ?
                                        'خوب'
                                        : 'عالی'
                                ));
                        infos.push(angular.copy(info));
                    })
                }
                $scope.checklistExcel[row._id].data.push(angular.copy(data));
                s.sheetid = $scope.getIntervalTitle(row.delivery_type, submitted_at).toString();
                $scope.checklistExcel[row._id].style.push(angular.copy(s));
            });
            menu_items.map(function (menu_item) {
                style2.columns.push({columnid: menu_item.item, title: menu_item.item, width: 300})
            });
            style2.columns.push({columnid: 'امتیاز', title: 'امتیاز', width: 300});
            style2.columns.push({columnid: 'وضعیت', title: 'وضعیت', width: 300});
            $scope.checklistExcel[row._id].style.push(angular.copy(style2));
            $scope.checklistExcel[row._id].data.push(angular.copy(infos));
            console.log($scope.checklistExcel)
            $timeout(function () {
                defer.resolve({data: $scope.checklistExcel[row._id].data, style: $scope.checklistExcel[row._id].style});
            }, 1000)


        }

        return defer.promise;
    }
    $scope.checklistOnBeforePrinting2 = function (row) {
        var defer = $q.defer();
        if ($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data2.length) {
            defer.resolve({data: $scope.checklistExcel[row._id].data2, style: $scope.checklistExcel[row._id].style2})
        } else {

            $scope.checklistExcel[row._id] = {
                data2: [],
                style2: []
            }
            console.log(row);
            var menu_items = angular.copy(row.menu_items);
            var max = 1;
            var guides = $filter('groupBy')(row.checklist_page_guides, 'key');
            var questions = angular.copy(row.checklist_page_questions);

            var data = {};
            row.checklist_page_answers.map(function (cpa) {
                cpa.checklist_page_answers.map(function (checklist_page_answer) {
                    checklist_page_answer.checklist_page_answer_details.map(function (detail) {
                        const post = (detail.checklist_page_answer_detail_infos?detail.checklist_page_answer_detail_infos.find(function (itm) {
                            return (itm.answerer_info_menu_item_id === '167' && itm.value)

                                || (itm.answerer_info_menu_item_id === '158' && itm.value)
                                || (itm.answerer_info_menu_item_id === '159' && itm.value);
                        }):null)
                        || {value:'نامشخص'}
                        post.value=post.value?post.value+'_'+detail._id:'نامشخص'
                        if (!data[detail.ward_id]) {
                            data[detail.ward_id] = {}
                        }
                        if(!data[detail.ward_id][post.value ])
                        {
                            data[detail.ward_id][post.value]=[]
                        }
                        data[detail.ward_id][post.value  ].push(detail)
                    })
                })
            });

            Object.keys(data).map(function (ward) {
                var inst = angular.copy(excelStyleInstans);
                inst.sheetid = $scope.get_ward_name(ward, $scope.wards);

                var excel_objects = [];

                row.checklist_page_components.map(function (c) {
                    var excel_object = {};
                    excel_object['حیطه ها'] = c.title;
                    Object.keys(data[ward]).map(function (post_, i) {
                        data[ward][post_].map(function (d) {


                            var value=0;
                            var counter=0;
                            row.checklist_page_questions.map(function (q) {
                                if (q.component === c.title && d.checklist_page_answer_detail_records) {
                                    d.checklist_page_answer_detail_records.map(function (record) {
                                        if (record.question == q.key) {

                                            if (q.point_type === 'کیفی') {
                                                max = guides[q.point_type].length;

                                            } else if (q.point_type === 'عددی' || q.point_type === 'درصدی') {
                                                max = guides[q.point_type][guides[q.point_type].length - 1].value;
                                            }else{
                                                max=1;
                                            }
                                            value=operator['+'](record.v,value);
                                            counter++;
                                        }
                                    })
                                }
                            })
                            excel_object[post_] = counter?value/(counter*max):0;

                        })

                    });
                    excel_objects.push(angular.copy(excel_object));
                })


                $scope.checklistExcel[row._id].style2.push(angular.copy(inst));
                $scope.checklistExcel[row._id].data2.push(angular.copy(excel_objects));
            });
            /* style2.columns.push({columnid: 'امتیاز', title: 'امتیاز', width: 300});
             style2.columns.push({columnid: 'وضعیت', title: 'وضعیت', width: 300});
             $scope.checklistExcel[row._id].style.push(angular.copy(style2));
             $scope.checklistExcel[row._id].data.push(angular.copy(infos));*/
            console.log($scope.checklistExcel)
            $timeout(function () {
                defer.resolve({data: $scope.checklistExcel[row._id].data2, style: $scope.checklistExcel[row._id].style2});
            }, 1000)


        }

        return defer.promise;
    }
    $scope.checklistOnBeforePrinting4 = function (row) {
        var defer = $q.defer();
        if ($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data4 && $scope.checklistExcel[row._id].data4.length) {
            defer.resolve({data: $scope.checklistExcel[row._id].data4, style: $scope.checklistExcel[row._id].style4})
        } else {

            $scope.checklistExcel[row._id] = {
                data4: [],
                style4: []
            }
            console.log(row);
            var menu_items = angular.copy(row.menu_items);
            var max = 1;
            var guides = $filter('groupBy')(row.checklist_page_guides, 'key');
            var questions = angular.copy(row.checklist_page_questions);

            var data = {};
            row.checklist_page_answers.map(function (cpa) {
                cpa.checklist_page_answers.map(function (checklist_page_answer) {
                    checklist_page_answer.checklist_page_answer_details.map(function (detail) {
                        const post = (detail.checklist_page_answer_detail_infos?detail.checklist_page_answer_detail_infos.find(function (itm) {
                            return (itm.answerer_info_menu_item_id === '167' && itm.value)

                                || (itm.answerer_info_menu_item_id === '158' && itm.value)
                                || (itm.answerer_info_menu_item_id === '159' && itm.value);
                        }):null)
                        || {value:'نامشخص'}
                        post.value=post.value?post.value+'_'+detail._id:'نامشخص'
                        if (!data[detail.ward_id]) {
                            data[detail.ward_id] = {}
                        }
                        if(!data[detail.ward_id][post.value ])
                        {
                            data[detail.ward_id][post.value]=[]
                        }
                        data[detail.ward_id][post.value  ].push(detail)
                    })
                })
            });

            Object.keys(data).map(function (ward) {
                var inst = angular.copy(excelStyleInstans);
                inst.sheetid = $scope.get_ward_name(ward, $scope.wards);

                var excel_objects = [];


                    var excel_object = {};
                row.checklist_page_questions.map(function (q) {
                    excel_object['سوال'] = q.key;

                    Object.keys(data[ward]).map(function (post_, i) {
                        excel_object[post_]='';
                        data[ward][post_].map(function (d) {

                            if (d.checklist_page_answer_detail_records) {
                                d.checklist_page_answer_detail_records.map(function (record) {
                                    if (record.question == q.key) {

                                        excel_object[post_] = record.v!=null?record.v:record.value ;
                                    }
                                })
                            }


                        })


                    });
                    excel_objects.push(angular.copy(excel_object));
                });



                $scope.checklistExcel[row._id].style4.push(angular.copy(inst));
                $scope.checklistExcel[row._id].data4.push(angular.copy(excel_objects));
            });
            /* style2.columns.push({columnid: 'امتیاز', title: 'امتیاز', width: 300});
             style2.columns.push({columnid: 'وضعیت', title: 'وضعیت', width: 300});
             $scope.checklistExcel[row._id].style.push(angular.copy(style2));
             $scope.checklistExcel[row._id].data.push(angular.copy(infos));*/
            console.log($scope.checklistExcel)
            $timeout(function () {
                defer.resolve({data: $scope.checklistExcel[row._id].data4, style: $scope.checklistExcel[row._id].style4});
            }, 1000)


        }

        return defer.promise;
    }
    $scope.checklistOnBeforePrinting3 = function (row) {
        var defer = $q.defer();
        if ($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data3 && $scope.checklistExcel[row._id].data3.length) {
            defer.resolve({data: $scope.checklistExcel[row._id].data3, style: $scope.checklistExcel[row._id].style3})
        } else {

            $scope.checklistExcel[row._id] = {
                data3: [],
                style3: []
            }
            console.log(row);
            var menu_items = angular.copy(row.menu_items);
            var max = 1;
            var guides = $filter('groupBy')(row.checklist_page_guides, 'key');
            var questions = angular.copy(row.checklist_page_questions);

            var data = {};
            row.checklist_page_answers.map(function (cpa) {
                cpa.checklist_page_answers.map(function (checklist_page_answer) {
                    checklist_page_answer.checklist_page_answer_details.map(function (detail) {


                        if(!data[detail.ward_id])
                        {
                            data[detail.ward_id]=[]
                        }
                        data[detail.ward_id]=[].concat(data[detail.ward_id],detail.checklist_page_answer_detail_records)
                    })
                })
            });

            Object.keys(data).map(function (ward) {
                var inst = angular.copy(excelStyleInstans);
                inst.sheetid = $scope.get_ward_name(ward, $scope.wards);

                var excel_objects = [];

                row.checklist_page_components.map(function (c) {
                    var excel_object = {};
                    excel_object['حیطه '] = c.title;



                            row.checklist_page_questions.map(function (q) {
                                if(guides[q.point_type])
                                guides[q.point_type].map(function (g) {

                                        excel_object[g.value]=0;

                                })
                                if (q.component === c.title) {
                                    var value=0;
                                    var counter=0;
                                    data[ward].map(function (record) {
                                        if (record && record.question == q.key) {
                                            excel_object['سوال']=angular.copy(record.question);

                                            excel_object[record.value]++;
                                            if (q.point_type === 'کیفی') {
                                                max = guides[q.point_type].length;

                                            } else if (q.point_type === 'عددی' || q.point_type === 'درصدی') {
                                                max = guides[q.point_type][guides[q.point_type].length - 1].value;
                                            }else{
                                                max=1;
                                            }
                                            value=operator['+'](record.v,value);
                                            counter++;
                                        }
                                    });
                                    excel_object['امتیاز کل']=((counter?value/(counter*max):0)*100).toFixed(2);
                                    excel_objects.push(angular.copy(excel_object));
                                }
                            })
                           // excel_object[post_] = counter?value/(counter*max):0;



                })


                $scope.checklistExcel[row._id].style3.push(angular.copy(inst));
                $scope.checklistExcel[row._id].data3.push(angular.copy(excel_objects));
            });
            /* style2.columns.push({columnid: 'امتیاز', title: 'امتیاز', width: 300});
             style2.columns.push({columnid: 'وضعیت', title: 'وضعیت', width: 300});
             $scope.checklistExcel[row._id].style.push(angular.copy(style2));
             $scope.checklistExcel[row._id].data.push(angular.copy(infos));*/
            console.log($scope.checklistExcel)
            $timeout(function () {
                defer.resolve({data: $scope.checklistExcel[row._id].data3, style: $scope.checklistExcel[row._id].style3});
            }, 1000)


        }

        return defer.promise;
    }
    $scope.checklistOnBeforePrinting5 = function (row) {
        var defer = $q.defer();
        if ($scope.checklistExcel[row._id] && $scope.checklistExcel[row._id].data5 && $scope.checklistExcel[row._id].data5.length) {
            defer.resolve({data: $scope.checklistExcel[row._id].data5, style: $scope.checklistExcel[row._id].style5})
        } else {

            $scope.checklistExcel[row._id] = {
                data5: [],
                style5: []
            }
            console.log(row);
            var menu_items = angular.copy(row.menu_items);
            var max = 1;
            var guides = $filter('groupBy')(row.checklist_page_guides, 'key');
            var questions = angular.copy(row.checklist_page_questions);

            var data = {
               'سوال باز':''
            };




            Object.keys(data).map(function (type) {
                var inst = angular.copy(excelStyleInstans);
                inst.sheetid = type;

                var excel_objects = [];


                var excel_object = {};
                row.checklist_page_answers.map(function (cpa) {
                    cpa.checklist_page_answers.map(function (checklist_page_answer) {
                        checklist_page_answer.checklist_page_answer_details.map(function (detail) {

                            excel_object['بخش']=$scope.get_ward_name(detail.ward_id, $scope.wards);

                            row.checklist_page_questions.map(function (q) {

                              if(q.point_type==='سوال باز'){
                                  excel_object[q.key]='-';
                                  if(detail.checklist_page_answer_detail_records){
                                      var qq=detail.checklist_page_answer_detail_records.find(function (d) {
                                          return d.question===q.key;
                                      });
                                      if(qq){
                                          excel_object[qq.question]=qq.value;

                                      }
                                  }

                              }
                            })
                            excel_objects.push(angular.copy(excel_object));
                        })
                    })
                });




                $scope.checklistExcel[row._id].style5.push(angular.copy(inst));
                $scope.checklistExcel[row._id].data5.push(angular.copy(excel_objects));
            });


            $timeout(function () {
                defer.resolve({data: $scope.checklistExcel[row._id].data5, style: $scope.checklistExcel[row._id].style5});
            }, 1000)


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
                'روند ارزیابی "' + $scope.checklist.title + '" در دوره تناوب اندازه گیری شده',
                'میانگین نظرات بخش ها برای سؤالات مختلف',
                'میانگین نظرات روی حیطه مختلف سؤالات',
                'مقایسه میانگین بخش ها با کل بیمارستان',
                'تعداد چک لیست های تکمیل شده در بخش ها'
            ],
            report_type: '',
            filter: {
                selected_interval: '',
                interval: '',
                ward_name: '',
                date: false,
                selected_date: '',
                selected_wards: [],
                selected_monthes: [],
                selected_components: [],
                component: false,
                filterableMenuItems: [],
                showfilterableMenuItems: false
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
            filterableMenuItems: $scope.checklist.menu_items ? angular.copy($scope.checklist.menu_items).filter(function (menu) {
                return menu.item_type === 'Select';
            }).map(function (menu) {
                menu.options = menu.options.map(function (opt) {
                    return {
                        checked: false,
                        title: opt
                    }
                });
                return menu;
            }) : [],
            lastInterval: {
                label: [], data: [], color: []
            },
            click: function (d) {
                $scope.progress.value = 1;
                if (d.length) {
                    if (!$scope.charts.lastInterval.label.length) {
                        $scope.charts.filter.selected_interval = d[0]._model.label;
                        $scope.charts.lastInterval.label = angular.copy($scope.charts.labels_chart);
                        $scope.charts.lastInterval.data = angular.copy($scope.charts.data_chart);
                        //$scope.charts.lastInterval.color=angular.copy(this.chart.options.colors);
                        $scope.charts.labels_chart = $scope.charts.labels_chart.filter(function (value, i) {
                            if (value === d[0]._model.label) {
                                if (typeof $scope.charts.data_chart[i] === "number") {
                                    $scope.charts.data_chart = [$scope.charts.data_chart[i]];

                                } else {
                                    $scope.charts.data_chart = $scope.charts.data_chart.map(function (value1) {
                                        return [value1[i]];
                                    });
                                }


                                //$scope.charts.data_chart=[$scope.charts.data_chart[i]];
                                return true;
                            }
                        })
                    } else {
                        $scope.charts.toggle_interval();
                    }

                } else {
                    $scope.charts.toggle_interval();
                }
                $timeout(function () {
                    $scope.progress.value = 0;
                }, 1000)
            },
            toggle_interval: function () {

                if (this.lastInterval.label && this.lastInterval.label.length) {
                    this.filter.selected_interval = '';
                    this.labels_chart = angular.copy(this.lastInterval.label);
                    this.data_chart = angular.copy(this.lastInterval.data);
                    this.lastInterval.label = [];

                }

            },
            toggle_filterableMenuItemsOption: function (opt, item) {
                var self = this;
                item.options.map(function (opt2) {
                    var j = self.filter.filterableMenuItems.indexOf(opt2.title);
                    if (j >= 0) {
                        opt2.checked = false;
                        self.filter.filterableMenuItems.splice(j, 1);
                    }
                });

                var i = self.filter.filterableMenuItems.indexOf(opt.title);
                if (opt.checked) {

                    self.filter.filterableMenuItems.push(opt.title);
                } else {
                    if (i !== -1) {
                        self.filter.filterableMenuItems.splice(i, 1);
                    }
                }
                console.log(self.filter.filterableMenuItems)

                self.setChart();


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
                            if (self.filter.filterableMenuItems.length) {
                                var hasInfo = self.filter.filterableMenuItems.every(function (menu) {
                                    return detail.checklist_page_answer_detail_infos ? detail.checklist_page_answer_detail_infos.find(function (info) {
                                        return info.value != null && info.value.toString()
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ك'), 'ک')
                                            ===
                                            menu.toString()
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ي'), 'ی')
                                                .replace(new RegExp('ك'), 'ک')
                                    }) : []
                                })

                                /*var hasInfo= detail.checklist_page_answer_detail_infos.find(function (info) {
                                    return self.filter.filterableMenuItems.indexOf(info.value.toString())>=0;
                                })*/
                                if (!hasInfo) {
                                    return false;
                                }


                            }
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
                                    detail.submitted_at = ans.submitted_at;
                                    questions.push(detail)
                                });
                            });
                        });
                        var qq = angular.copy(questions);
                        console.log(qq);
                        if (self.filter.selected_monthes.length) {
                            qq = qq.filter(function (ans) {
                                return self.filter.selected_monthes.find(function (m) {

                                    switch ($scope.checklist.delivery_type) {
                                        case 'روزانه':
                                            return m === ans.submitted_at;
                                        case 'ماهانه':
                                            return m === $filter('persianMonth')(ans.submitted_at);
                                        case 'هفتگی':
                                            return m === $filter('persianNum')(ans.submitted_at, true);
                                        case 'سه ماه یکبار':
                                            return m === $filter('persianNum')(ans.submitted_at, true);
                                        case 'شش ماه یکبار':
                                            return m === $filter('persianNum')(ans.submitted_at, true);
                                        case 'سالانه':
                                            return m == $rootScope.year;
                                        default :
                                            return false;

                                    }
                                });
                            });
                        }
                        var g = $filter('groupBy')(qq, 'ward_id');

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
                answers = answers ? answers : (this.index ? this.setAnswers() : setAnswers(set_calender(this.calender_type, null, this.filter.filterableMenuItems)));

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
                        var d = self.index ? self.setAnswers(ward) : setAnswers(set_calender(self.calender_type, ward, self.filter.filterableMenuItems));

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

                this.setChart(this.index ? null : setAnswers(set_calender(this.calender_type, null, this.filter.filterableMenuItems)));

                this.show_chart = false;
                $timeout(function () {
                    self.show_chart = true;
                }, 100)
            }

        }
        $scope.reset_params($scope.charts.filter);
        $scope.charts.report_type = '';
        $scope.charts.show_chart = false;
        $scope.open_modal('lg', 'charts.html', null, null, 'only_content full_width', $scope, true);
    }
    $scope.getValueOfQuestion = function (details, q) {
        var res = details.find(function (d) {
            return d.question === q.key;
        });
        return res ? res.value : '-';
    }
    $scope.detail_report = function (row) {

        var all_answers = [].concat(angular.copy(row.temp_answers_data), angular.copy(row.answers_data));
        $scope.detail_recordes = $filter('orderObjectBy')(angular.copy(all_answers), 'created_at');
        $scope.isMultiWards = row.wards.length > 1;
        $scope._wards = row.wards;
        var _users = row.users.filter(function (ans) {
            return eval(ans);
        }).map(function (ans) {
            console.log(ans)
            return $scope.get_user(ans, $scope.all_users);
        });
        $scope.report_users = _users ? $filter('unique')(_users, 'id') : [];

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
        console.log(row)
        $scope.checklist = angular.copy(row);
        var darsadi = false;
        if ($scope.checklist.checklist_page_questions) {
            $scope.checklist.checklist_page_questions.find(function (q) {
                if (q.point_type === 'درصدی') {
                    darsadi = true;
                    return true;
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
        var _users = row.checklist_page_answers.filter(function (ans) {
            return ans.operator
        }).map(function (ans) {
            console.log(ans)
            return $scope.get_user(ans.operator, $scope.all_users);
        });
        console.log(_users)
        $scope._users = _users ? $filter('unique')(_users, 'id') : [];
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
    $scope.getDetail = function (row) {
        var res = '';
        if (row) {
            res = $scope.detail_answer.menuItems.find(function (m) {
                return m.answerer_info_menu_item_id == row.id
            })
        }
        return res ? (res.value === '' || res.value === null ? '-' : (row.item_type === 'SelectUser' ? $scope.get_person(res.value, $scope.all_users, true) : (row.item_type === 'TimePicker' ? $scope.get_time(res.value) : res.value))) : '-';
    }
    $scope.showAnswerDetail = function (row) {
        $scope.menuItem2 = $scope.checklist.menu_items && $scope.checklist.menu_items.length ? angular.copy($scope.checklist.menu_items) : [];
        $scope.detail_answer = {
            ward: $scope.get_ward_name(row.ward_id, $scope.wards),
            questions: $scope.checklist.checklist_page_questions.map(function (q) {
                var answer = row.checklist_page_answer_detail_records ? row.checklist_page_answer_detail_records.find(function (r) {
                    return r.question === q.key;
                }) : [];
                var qq = angular.copy(q);
                qq.answer = answer ? answer.value : '';
                return qq;
            }),
            menuItems: row.checklist_page_answer_detail_infos || []
        };
        var max = 1;
        var guides = $filter('groupBy')($scope.checklist.checklist_page_guides, 'key');
        var questions = angular.copy($scope.checklist.checklist_page_questions);
        var answers = {};
        $scope.checklist.checklist_page_answers.map(function (c) {
            c.checklist_page_answers.map(function (checklist_page_answer) {
                if (checklist_page_answer.checklist_page_answer_details) {
                    if (!answers[checklist_page_answer.submitted_at]) {
                        answers[checklist_page_answer.submitted_at] = []
                    }
                    answers[checklist_page_answer.submitted_at] = answers[checklist_page_answer.submitted_at].concat(checklist_page_answer.checklist_page_answer_details)
                }

            })
        });
        var all2level = questions.every(function (q) {
            return q.point_type === 'سوال باز' || q.point_type === 'دوسطحی'
        });

        function get_question_type(q) {
            var question = questions.find(function (qq) {
                return qq.key === q
            });
            return question ? question.point_type : '';
        }

        $scope.current_checklist_value = 0;
        console.log(row)
        if (row.checklist_page_answer_detail_records) {
            var value = 0;
            var counter = 0;
            row.checklist_page_answer_detail_records.map(function (record) {
                var question_type = get_question_type(record.question);
                if (question_type === 'کیفی' || question_type === 'عددی' || question_type === 'درصدی' || all2level) {
                    if (question_type === 'کیفی') {
                        max = guides[question_type].length;
                    } else if (question_type === 'عددی' || question_type === 'درصدی') {
                        max = guides[question_type][guides[question_type].length - 1].value;
                    }
                    counter++;
                    value = $scope.operator['+'](record.v, value);
                }
            });
            console.log(counter, max, value)
            $scope.current_checklist_value = counter ? ((value / (counter * max)) * 100).toFixed(2) : 0;
        }
        $scope.open_modal('lg', 'detail_answers.html', null, null, 'only_content full_width', $scope);
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
    $scope.edit_checklist = function (row) {
        console.log(row)

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
        $scope.check_list.questions.map(function (itm) {
            itm.checked = true;
            if (itm.component) {
                var itm_component = angular.copy(itm.component);
                itm.component = itm.component
                    .replace(new RegExp('ي'), 'ی')
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
        /* var comp = $filter('groupBy')($scope.check_list.questions, 'component');
        $scope.check_list.components = $scope.check_list.has_component ? Object.keys(comp).map(function (itm) {
             return {
                 title: itm
             }
         }) : [];*/
        $scope.check_list.id = copy_row._id;
        if ($scope.check_list.guides) {
            $scope.point_type.guides = $scope.check_list.guides.map(function (itm) {
                return {key: itm.value, value: itm.guide, point_type: itm.key, _id: itm._id}
            });
        }
        if (row.menu_items)
            row.menu_items.map(function (itm) {
                if (itm.id) {
                    $scope.menuItems.map(function (mi) {
                        if (mi.id === itm.id) {
                            mi.checked = true;
                            var isReq = row.required_answer_items.find(function (x) {
                                return x == mi.id;
                            })
                            if (!isReq) {
                                mi.is_req = false;
                            }
                        }
                    })
                }
                if (itm) {
                    $scope.menuItems.map(function (mi) {
                        if (mi.id === itm) {
                            mi.checked = true;
                            var isReq = row.required_answer_items.find(function (x) {
                                return x == mi.id;
                            })
                            if (!isReq) {
                                mi.is_req = false;
                            }

                        }
                    })
                }
            })


        setGuides();

    };
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


    getCheckList();
    getAllAnswerInfo();


});
app.controller('Periodic_visits_to_the_building_Ctrl', function ($scope, $state, factory1, localStorageService, $http, Server_URL, $rootScope, $filter, $stateParams) {

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

    $scope.active_month = '';
    $scope.search = {
        keyword: '',
        type: '',
        periods1: '',
        periods2: ''
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
    var set_days_of_month = function () {
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
                const filteredWards = props.wards.filter(opt => opt.name !== "بخش ناشناس");
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
            year: $rootScope.year,
            certificate: ($rootScope.CurrentStep ? $rootScope.CurrentStep.description : $rootScope.CurrentSanje.name)
        });
        $http.post(Server_URL + '/v1/user/hospital/visit', parameter, {headers: $scope.queryHeaders})
            .success(function (data, status, headers) {

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

            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    /*function triggerMouseEvent (eventType) {
     var clickEvent = document.createEvent ('MouseEvents');

     clickEvent.initEvent (eventType, true, true);

     /!*node.dispatchEvent (clickEvent);*!/
     return clickEvent;

     }*/
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
        factory1.upload_file($scope, chk, 2000000, ['application/pdf', 'application/msword', 'application/docx'], false, false, null).then(function (data) {
            $scope.visit.b64_file = data;
            $scope.visit.created_at_file = $scope.get_miladi_date();
            $scope.visit.file_name = chk.filename;
        });
    };
    $scope.slideChanged = function (index) {


        $scope.visit.selected_slide = $scope.visit.carousel_slides[index];
    };
    $scope.edit_system_visit = function (row) {

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
        var visit_ = ($rootScope.CurrentStep ? $rootScope.CurrentStep.description : $rootScope.CurrentSanje.name);
        //$rootScope.CurrentSanje=$rootScope.CurrentSanje || true;
        $rootScope.is_parent = false;

        switch (row.period) {
            case 'روزانه':
                $state.go('standard.sanje.completing_daily', {visit: visit_});
                break;
            case 'هفتگی':
                $state.go('standard.sanje.completing_weekly', {visit: visit_});
                break;
            case 'ماهانه':
                $state.go('standard.sanje.completing_monthly', {visit: visit_});
                break;
        }

    };
    $scope.open_compliting_visit_modal = function (data) {
        var l = $scope.current_visit_model.visit_forms.length;
        $scope.current_visit_model.visit_forms.map(function (itm, i) {
            itm.values_array = $scope.new_Array($scope.current_visit_model.recurring, {value: '', id: null});
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
                    return data[j * l + i] ? data[j * l + i] : {value: '', id: null};
                });
            }
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

        $scope.dates_array = $scope.new_Array($scope.current_visit_model.recurring, angular.copy({
            date: angular.copy(current_day_),
            time: '',
            passed: false
        }));
        if (data[date.day] && data[date.day].length) {
            data[date.day] = $filter('orderObjectBy')(data[date.day], 'date');
            var j = 0;
            for (var i = 0; i < data[date.day].length; i += parseInt($scope.current_visit_model.visit_forms.length)) {
                $scope.dates_array[j].time = data[date.day][i] ? data[date.day][i].date : '';
                $scope.dates_array[j].passed = data[date.day][i] !== null;
                $scope.dates_array[j].operator = data[date.day][i] ? data[date.day][i].operator : '';
                j++;
            }
        }

        $scope.open_compliting_visit_modal(data[date.day]);

    };
    $scope.complate_monthly = function (date, data) {
        var date_ = $scope.get_miladi_date(date.year + '/' + date.month + '/' + date.day);
        $scope.current_day = $scope.get_date(date_, 'full_date');
        var current_day_ = $scope.get_date(date_);

        $scope.dates_array = $scope.new_Array($scope.current_visit_model.recurring, angular.copy({
            date: '',
            time: '00:00',
            passed: false
        }));
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
        $scope.dates_array = $scope.new_Array($scope.current_visit_model.recurring, angular.copy({
            date: '',
            time: '00:00',
            passed: false
        }));
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
        $scope.get_system_visits().then(function (row) {
            $scope.open_modal('lg', 'chart_visit_modal.html', 'system_visit_modal_Ctrl', {
                detail: function () {
                    return data;
                }
            }, 'blue_modal', $scope, false);
        })


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

    $scope.get_system_visits = function (priod) {

        var q = priod ? '&period=' + priod : '';
        q += '&certificate=' + ($rootScope.CurrentStep ? $rootScope.CurrentStep.description : $rootScope.CurrentSanje.name);
        return factory1.getUserApi('/v1/user/hospital/visits', q).then(function (data) {
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
    var CurrentStep_type = $rootScope.CurrentStep ? $rootScope.CurrentStep.step_type : $rootScope.CurrentSanje.page_type;
    $scope.is_parent = $state.$current.self.name === "standard.sanje";
    // console.log($state.$current);
    if ($rootScope.is_parent) {

        $scope.get_system_visits();
    } else {
        $scope.current_visit_model = $scope.getCookie('current_visit_model');
        $scope.current_visit_ = $scope.getCookie('current_visit_');

        if (!$scope.current_visit_model) {
            window.history.back();
        }

        $scope.get_form_valus();
    }

});
app.controller('infectionCtrl', function ($stateParams, $state, $scope, $rootScope, factory1, $filter, BASE, $timeout) {
    $scope.infection = {
        users: [],
        title: '',
        period: '',
        certificate: '',
        information_type: '',
        informations: [],
        year: $rootScope.year,
        answers: []
    }
    $scope.filter = {
        ward_id: '',
        _to: '',
        _from: ''
    }
    $scope.progress = {
        value: 0
    }
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
                duration: 500,
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
                    $scope.progress.value = 0;
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
        evaluators: [],
        report_types: [
            'میزان رعایت بهداشت دست به تفکیک دوره ارزیابی در کل بیمارستان',
            'میزان رعایت بهداشت دست براساس ارزیابی شونده ها',
            'میزان رعایت بهداشت دست براساس اندیکاسیون',
            'میزان رعایت بهداشت دست براساس عمل ها'
        ],
        report_type: '',
        filter: {
            interval: '',
            ward_name: '',
            date: false,
            selected_date: '',
            selected_wards: [],
            selected_monthes: [],
            selected_assessors: [],
            assessor: false,
            andicasion: false,
            evaluator: false,
            selected_evaluators: [],
            selected_andicasions: [],
            selected_interval: '',
        },
        show_chart: false,
        calender_type: '',
        dates: [],
        colors: [],
        chart_table: null,
        index: 0,
        wards: [],
        months: [],
        HR_count: 0,
        HW_count: 0,
        MISSED_count: 0,
        GLOVES_count: 0,
        andicasions: [],
        lastInterval: {
            label: [], data: [], color: []
        },
        toggle_all_ward: function () {
            this.filter.selected_wards = [];
            this.wards.map(function (value) {
                value.checked = false;
            })
            this.setChart($scope.reports.answers);
        },
        click: function (d) {
            $scope.progress.value = 1;
            if (d.length) {
                if (!$scope.charts.lastInterval.label.length) {
                    $scope.charts.filter.selected_interval = d[0]._model.label;
                    $scope.charts.lastInterval.label = angular.copy($scope.charts.labels_chart);
                    $scope.charts.lastInterval.data = angular.copy($scope.charts.data_chart);
                    //$scope.charts.lastInterval.color=angular.copy(this.chart.options.colors);
                    $scope.charts.labels_chart = $scope.charts.labels_chart.filter(function (value, i) {
                        if (value === d[0]._model.label) {
                            if (typeof $scope.charts.data_chart[i] === "number") {
                                $scope.charts.data_chart = [$scope.charts.data_chart[i]];

                            } else {
                                $scope.charts.data_chart = $scope.charts.data_chart.map(function (value1) {
                                    return [value1[i]];
                                });
                            }


                            //$scope.charts.data_chart=[$scope.charts.data_chart[i]];
                            return true;
                        }
                    })
                } else {
                    $scope.charts.toggle_interval();
                }

            } else {
                $scope.charts.toggle_interval();
            }
            $timeout(function () {
                $scope.progress.value = 0;
            }, 1000)
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
            return timelines.splice(timelines.indexOf($scope.infection.period) + 1, 5);
        },
        toggle_interval: function () {

            if (this.lastInterval.label && this.lastInterval.label.length) {
                this.filter.selected_interval = '';
                this.labels_chart = angular.copy(this.lastInterval.label);
                this.data_chart = angular.copy(this.lastInterval.data);
                this.lastInterval.label = [];

            }

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
            var self = this;

            this.setChart(setAnswers(self.calender_type, []));
        },
        toggle_month: function (ward) {
            var self = this;
            var i = this.filter.selected_monthes.indexOf(ward.name);
            if (ward.checked) {

                this.filter.selected_monthes.push(ward.name);
            } else {
                if (i !== -1) {
                    this.filter.selected_monthes.splice(i, 1);
                }
            }


            this.setChart(setAnswers(self.calender_type, []));
        },
        toggle_assessor: function (assessor) {
            var self = this;
            var i = this.filter.selected_assessors.indexOf(assessor.description);
            if (assessor.checked) {

                this.filter.selected_assessors.push(assessor.description);
            } else {
                if (i !== -1) {
                    this.filter.selected_assessors.splice(i, 1);
                }
            }


            this.setChart(setAnswers(self.calender_type, []));
        },
        toggle_evaluator: function (evaluator) {
            var i = this.filter.selected_evaluators.indexOf(evaluator);
            if (evaluator.checked) {
                this.filter.selected_evaluators.push(evaluator);
            } else {
                if (i !== -1) {
                    this.filter.selected_evaluators.splice(i, 1);
                }
            }
            var self = this;
            $timeout(function () {
                self.setChart(setAnswers(self.calender_type, []));
            }, 300)

        },
        toggle_andicasion: function (andicasion) {
            var self = this;
            var i = this.filter.selected_andicasions.indexOf(andicasion.description);
            if (andicasion.checked) {
                this.filter.selected_andicasions.push(andicasion.description);
            } else {
                if (i !== -1) {
                    this.filter.selected_andicasions.splice(i, 1);
                }
            }
            this.setChart(setAnswers(self.calender_type, []));


        },
        select_date: function (date) {
            var self = this;
            this.filter.selected_date = this.filter.selected_date !== date ? angular.copy(date) : '';
            this.filter.date = false;
            this.setChart(setAnswers(self.calender_type, []));
        },
        getIntervalLabels: function (calender_type) {
            calender_type = calender_type || this.calender_type;
            return $scope.new_Array($scope.getPeriodCount(calender_type), {}).map(function (itm, i) {
                switch (calender_type) {
                    /* case 'روزانه':
                         return '';*/
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
        getOtherChartData: function (answers, a) {
            if (a.information_type === 'عمل ها') {
                this.HR_count = 0;
                this.HW_count = 0;
                this.MISSED_count = 0;
                this.GLOVES_count = 0;
            }
            var self = this;
            var x = '-';
            var HR = 0;
            var HW = 0;
            var Total = 0;
            var Total_ans = 0;
            angular.copy(answers).map(function (ans) {
                if ($scope.charts.filter.selected_evaluators.length) {
                    ans.answers_data = $filter('filter_by_array')(ans.answers_data, 'user_id', $scope.charts.filter.selected_evaluators.map(function (selected_evaluator) {
                        return selected_evaluator.user_id;
                    }), [])
                }
                ans.answers_data.map(function (ad) {
                    Total_ans++;
                    var ad_ans = ad.answers.find(function (inf) {
                        if (inf) {
                            return inf.information_type === a.information_type && inf.description === a.description;
                        }
                    });
                    if (ad_ans) {
                        Total++;
                        var action = $scope.getAnswerInfection(ad.answers, 'عمل ها');
                        if (a.information_type === 'عمل ها') {
                            if (action.indexOf('HR') >= 0) {
                                self.HR_count++;
                            } else if (action.indexOf('HW') >= 0) {
                                self.HW_count++;
                            } else if (action.indexOf('GLOVES') >= 0) {
                                self.GLOVES_count++;
                            } else {
                                self.MISSED_count++;
                            }


                            if (action === a.description) {
                                HR++;
                            }

                        } else {
                            if (action.indexOf('HR') >= 0) {
                                HR++;
                            } else if (action.indexOf('HW') >= 0) {
                                HW++;
                            }
                        }

                    }
                });
            });
            if (a.information_type === 'عمل ها') {
                Total = Total_ans;
            }
            if (Total) {
                var HR_HW = $scope.operator['+'](HR, HW);
                x = ((HR_HW / Total) * 100).toFixed(2);
            }
            return x;
        },
        setChart: function (_answers) {
            var answers = angular.copy(_answers);
            var self = this;
            var multi_answers = [];
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
                answers = setAnswers(this.calender_type, []);
            } else {
                this.calender_type = $scope.infection.period;
            }
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


            if (this.index) {
                if (this.filter.selected_monthes.length) {
                    answers = answers.filter(function (ans) {
                        return self.filter.selected_monthes.indexOf(ans.interval_name) >= 0;
                    })
                }
                if (this.filter.selected_assessors.length) {
                    answers = answers.map(function (ans) {
                        ans.answers_data = ans.answers_data.filter(function (ad) {
                            var has_obj = $filter('filter_by_array')(ad.answers, 'description', self.filter.selected_assessors, []);
                            return has_obj.length
                        });
                        return ans;
                    })
                }
                if (this.filter.selected_andicasions.length) {
                    answers = answers.map(function (ans) {
                        ans.answers_data = ans.answers_data.filter(function (ad) {
                            var has_obj = $filter('filter_by_array')(ad.answers, 'description', self.filter.selected_andicasions, []);
                            return has_obj.length
                        });
                        return ans;
                    })
                }
                self.chart_type = 'chart-bar';

                self.labels_chart = $scope.infection.informations.filter(function (a) {
                    return self.report_type.indexOf(a.information_type) >= 0;
                }).map(function (a, j) {
                    if (self.filter.selected_wards.length) {
                        //var data=$scope.new_Array(self.filter.selected_wards.length + 1, []);

                        var data = angular.copy(self.getOtherChartData(answers, a));
                        var counter = {
                            HR: self.HR_count,
                            HW: self.HW_count,
                            MISSED: self.MISSED_count,
                            GLOVES: self.GLOVES_count,
                        }

                        self.data_chart[0].push(data);
                        self.filter.selected_wards.map(function (ward, i) {
                            var w = self.series[i + 1];
                            var d = angular.copy(self.getOtherChartData(answers.map(function (ans) {
                                var ans_copy = angular.copy(ans);
                                ans_copy.answers_data = $filter('filter_by')(ans_copy.answers_data, 'ward_id', ward);
                                return ans_copy;
                            }), a));
                            var c = {
                                HR: self.HR_count,
                                HW: self.HW_count,
                                MISSED: self.MISSED_count,
                                GLOVES: self.GLOVES_count,
                            }
                            self.data_chart[i + 1].push(d);
                            if (!self.chart_table[w]) {
                                self.chart_table[w] = [];
                            }
                            self.chart_table[w].push({value: d, counter: c})
                        });
                        if (!self.chart_table['کل بیمارستان']) {
                            self.chart_table['کل بیمارستان'] = [];
                        }
                        self.chart_table['کل بیمارستان'].push({value: data, counter: counter});
                        self.series.map(function (w, s) {
                            if (s) {
                                var value = self.chart_table[w][j]['value'] !== '-' && self.chart_table['کل بیمارستان'][j]['value'] != '-' ?
                                    (self.chart_table[w][j]['value'] - self.chart_table['کل بیمارستان'][j]['value']).toFixed(2) :
                                    '-';
                                /*var counter={
                                    HR:0,
                                    HW:0,
                                    MISSED:0,
                                    GLOVES:0,
                                }
                                if(value!=='-'){
                                    counter['HR']=(self.chart_table[w][j]['counter']['HR']-self.chart_table['کل بیمارستان'][j]['counter']['HR']).toFixed(2)
                                    counter['HW']=(self.chart_table[w][j]['counter']['HW']-self.chart_table['کل بیمارستان'][j]['counter']['HW']).toFixed(2)
                                    counter['MISSED']=(self.chart_table[w][j]['counter']['MISSED']-self.chart_table['کل بیمارستان'][j]['counter']['MISSED']).toFixed(2)
                                    counter['GLOVES']=(self.chart_table[w][j]['counter']['GLOVES']-self.chart_table['کل بیمارستان'][j]['counter']['GLOVES']).toFixed(2)
                                }*/
                                var key = 'اختلاف ' + w + ' با کل بیمارستان';
                                if (!self.chart_table[key]) {
                                    self.chart_table[key] = [];
                                }
                                self.chart_table[key].push({value: value/*,counter:counter*/});
                            }


                        });


                    } else {
                        self.data_chart.push(self.getOtherChartData(answers, a));
                    }


                    return a.description;
                });
            } else {
                if (multi_answers.length) {

                    //multi_answers[1]=setAnswers(this.calender_type,this.filter.selected_wards);
                    self.filter.selected_wards.map(function (ward, i) {
                        var w = self.series[i + 1];
                        var d = angular.copy(setAnswers(self.calender_type, [ward]));

                        multi_answers.push(d);
                        self.chart_table[w] = d.map(function (dd) {
                            return angular.copy({value: dd.point ? dd.point.replace('%', '') : '-'})
                        })
                    });
                    self.chart_table['کل بیمارستان'] = angular.copy(multi_answers[0].map(function (dd) {
                        return angular.copy({value: dd.point ? dd.point.replace('%', '') : '-'})
                    }));
                    self.series.map(function (w, s) {
                        if (s) {
                            var key = 'اختلاف ' + w + ' با کل بیمارستان';
                            self.chart_table[key] = self.chart_table[w].map(function (v, i) {
                                return angular.copy({value: v.value != '-' && self.chart_table['کل بیمارستان'][i]['value'] != '-' ? (v.value - self.chart_table['کل بیمارستان'][i]['value']).toFixed(2) : '-'});
                            })
                        }


                    });

                }
                self.chart_type = 'chart-bar';
                self.labels_chart = self.getIntervalLabels();
                self.labels_chart.map(function (interval) {
                    if (multi_answers.length) {
                        multi_answers.map(function (value, i) {
                            var data = value.find(function (a) {
                                return a.interval_name.toString() === interval.toString().replace(' ' + a.interval_perfix + ' ', '');
                            });
                            self.data_chart[i].push(angular.copy(data && data.point ? parseFloat(data.point.replace('%', '')) : ''));
                        })

                    } else {
                        var data = answers.find(function (a) {
                            return a.interval_name.toString() === interval.toString().replace(' ' + a.interval_perfix + ' ', '');
                        });
                        self.data_chart.push(data && data.point ? parseFloat(data.point.replace('%', '')) : '');
                    }

                })
            }


        },
        changeChart: function () {
            var self = this;
            this.index = this.report_types.indexOf(this.report_type);
            this.dates = this.getDatesOptions();
            this.months = angular.copy(this.getIntervalLabels($scope.infection.period)).map(function (m) {
                return {name: m, checked: false}
            });
            this.assessors = angular.copy($scope.infection.informations.filter(function (inf) {
                return inf.information_type === 'ارزیابی شونده';
            }))
            this.andicasions = angular.copy($scope.infection.informations.filter(function (inf) {
                return inf.information_type === 'اندیکاسیون';
            }))
            this.wards = angular.copy($scope.wards);
            if ($scope.infection.answers) {
                if (this.evaluators.length) {
                    this.evaluators.map(function (value) {
                        value.checked = false
                    })
                } else {
                    this.evaluators = [];
                    var evaluators = [];
                    $scope.infection.answers.map(function (answers) {


                        if (evaluators.indexOf(answers.user_id) === -1) {
                            var evaluator = {
                                name: $scope.get_person(answers.user_id, $scope.all_users),
                                user_id: answers.user_id,
                                checked: false
                            }
                            self.evaluators.push(evaluator);
                            evaluators.push(answers.user_id);
                        }

                    });
                }
            }


            this.calender_type = $scope.infection.period;
            $scope.reset_params($scope.charts.filter);
            this.setChart(setAnswers($scope.infection.period, []));

            this.show_chart = false;
            $timeout(function () {
                self.show_chart = true;
            }, 100)
        }

    }
    $scope.getTooltip = function (data, type) {
        var res = '';
        console.log(type)
        if (typeof data == 'object') {
            Object.keys(data).map(function (key) {
                if (key === type) {
                    res += key + ': ' + data[key] + '<br/>';
                }

            });
        }

        return res;
    }
    $scope.reports = {
        show: false,
        answers: [],
        total: {
            value: 0,
            count: 0
        }
    }

    var excelStyleInstans = {
        sheetid: '',
        headers: true,
        style: 'background:#FFF;font-family:Tahoma;',
        column: {
            style: 'font-size:16px;background:#ccc;text-align:center'
        },
        columns: [
            {columnid: 'date', title: 'تاریخ ارزیابی', width: 300},
            {columnid: 'ward_id', title: 'بخش ارزیابی', width: 300},
            {columnid: 'user_id', title: 'مسئول ارزیابی', width: 300},
            {columnid: 'answers["ارزیابی شونده"]', title: 'ارزیابی شونده', width: 300},
            {columnid: 'answers["اندیکاسیون"]', title: 'اندیکاسیون', width: 300},
            {columnid: 'answers[ "عمل ها"]', title: 'عمل ها', width: 300},

        ],
        row: {
            style: function (sheet, row, rowidx) {
                return 'background:' + (rowidx % 2 ? '#fff' : '#d6edff') + ';text-align:center';
            }
        },
        alignment: {readingOrder: 2}
    }

    function allInformationIsValid() {
        var isValid = true;
        for (var i = 0; i <= $scope.infection.informations.length; i++) {
            if ($scope.infection.informations[i] && !$scope.infection.informations[i].description.length) {
                isValid = false;
                $scope.warning('لطفاً شرح ' + $scope.infection.informations[i].information_type + ' را برای ردیف ' + $filter('persianNum')(i, true) + ' وارد کنید.');
                break;
            }
        }
        return isValid
    }

    function setData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                $scope.infection[key.toString().replace('infection_control_', '')] = data[key];

            }
        }
    }

    function setAnswers(period, wards) {
        var answers = [];
        set_calender(period, wards).map(function (interval) {
            if (interval) {
                var r = {};
                if (interval.days_object) {
                    interval.days_object.map(function (day, i) {
                        r.interval_name = interval.days[i] + ' ' + interval.header;
                        r.interval_perfix = interval.header_type;
                        if (day.answer !== null) {
                            r.users = Object.keys($filter('groupBy')(day.answers_data, 'user_id'))
                            r.answers_data = day.answers_data;
                            r.point = day.answer.value + '%';
                            r.wards = Object.keys($filter('groupBy')(day.answers_data, 'ward_id')).map(function (ward) {
                                return $scope.get_ward_object(ward, $scope.wards);
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
                        r.answers_data = interval.answers_data;
                        r.point = interval.answer.value + '%';
                        r.wards = Object.keys($filter('groupBy')(interval.answers_data, 'ward_id')).map(function (ward) {
                            return $scope.get_ward_object(ward, $scope.wards);
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

    function getInfection() {
        factory1.getUserApi('/v1/user/hospital/infection_controls').then(function (data) {
            setData(data);
            $scope.excel_filename = angular.copy($scope.infection.title);
        })
    }

    function hideAllView() {
        $scope.charts.show = false;
        $scope.reports.show = false;
    }

    function set_calender(calender_type, wards) {

        $scope.reports.total.value = 0;
        $scope.reports.total.count = 0;
        var answers = angular.copy($scope.infection.answers) || [];

        if (wards && wards.length) {
            answers = $filter('filter_by_array')(answers, 'ward_id', wards, [])
        }
        console.log($scope.charts.filter.selected_evaluators)
        if ($scope.charts.filter.selected_evaluators.length) {

            answers = $filter('filter_by_array')(answers, 'user_id', $scope.charts.filter.selected_evaluators.map(function (selected_evaluator) {
                return selected_evaluator.user_id;
            }), [])
        }

        $scope.calenders = [];
        var repeat_count = $scope.getPeriodCount(calender_type);

        if (calender_type === 'روزانه') {
            repeat_count = 12;
        }


        return $scope.new_Array(repeat_count, {}).map(function (itm, i) {
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
                answers.map(function (a) {
                    var n = angular.copy(a.submitted_at);
                    if (calender_type !== $scope.infection.period) {
                        n = $scope.getEqualSubmitedAt(a.submitted_at, $scope.infection.period, calender_type);

                    }
                    if (n == i + 1 || n == itm.submitted_at) {

                        itm.answer = {};
                        if (!itm.answers_data) {
                            $scope.reports.total.count++;
                            itm.answers_data = [];
                        }

                        itm.answers_data.push(a);
                        var HRHW = 0;
                        itm.answers_data.map(function (ad) {
                            ad.answers.map(function (value) {
                                if (value && (value.description.indexOf("HR") >= 0 || value.description.indexOf("HW") >= 0)) {
                                    HRHW++;
                                }
                            })
                        });
                        var value = ((HRHW / itm.answers_data.length) * 100).toFixed(2);
                        itm.answer.value = angular.copy(value);
                        // console.log(value)

                    }
                });
                if (itm.answer) {
                    $scope.reports.total.value = $scope.operator['+']($scope.reports.total.value, itm.answer.value)
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
                            day.answer = {};
                            if (!day.answers_data) {
                                $scope.reports.total.count++;
                                day.answers_data = [];
                            }
                            day.answers_data.push(a);
                            var HRHW = 0;
                            day.answers_data.map(function (ad) {
                                ad.answers.map(function (value) {
                                    if (value.description.indexOf("HR") >= 0 || value.description.indexOf("HW") >= 0) {
                                        HRHW++;
                                    }
                                })
                            });
                            day.answer.value = ((HRHW / day.answers_data.length) * 100).toFixed(2);
                            if (!itm.answer && day.answer != null) {
                                itm.answer = {value: 0};
                            }
                        }
                    });
                });

                if (itm.answer) {
                    itm.answer.value = 0;
                    itm.days_object.map(function (day) {

                        if (day.answer != null) {
                            itm.answer.value = $scope.operator['+'](itm.answer.value, day.answer.value);
                        }
                    })
                    $scope.reports.total.value = $scope.operator['+']($scope.reports.total.value, itm.answer.value)
                }
            }
            return angular.copy(itm);
        });
    }

    $scope.showForm = function () {
        $scope.open_modal('lg', 'form_infection.html', null, null, 'only_content full_width', $scope, true);
    }
    $scope.addInformation = function () {
        $scope.infection.informations.push({
            information_type: angular.copy($scope.infection.information_type),
            description: ''
        })
    }
    $scope.deleteInformation = function (row, index) {
        $scope.question('آیا از حذف شرح مورد نظر مطمئن هستید؟', 'حذف شرح').result.then(function (r) {
            if (r) {
                $scope.infection.informations.splice($scope.infection.informations.indexOf(row), 1);
            }
        })
    }
    $scope.saveInfection = function (save) {
        if ($scope.infection.title || save) {
            if ($scope.infection.certificate || save) {
                if ($scope.infection.period || save) {
                    if ($scope.infection.users.length || save) {

                        if ($scope.infection.informations.length || save) {
                            if (save) {
                                if (!allInformationIsValid()) {
                                    return false;
                                }
                            }
                            factory1.postUserApi('/v1/user/hospital/infection_control', JSON.stringify(angular.merge({
                                save: save, mehvar: $scope.state__title,
                                mehvar_icon: $scope.state__icon
                            }, $scope.infection))).then(function (data) {
                                setData(data);
                                $scope.close_modal();
                            })
                        } else {
                            $scope.warning('لطفاً مشخصات فرم را وارد کنید')
                        }
                    } else {
                        $scope.warning('لطفاً ارزیابی کننده های فرم را انتخاب کنید')
                    }
                } else {
                    $scope.warning('لطفاً دوره تناوب را انتخاب کنید.')
                }
            } else {
                $scope.warning('لطفاً شماره فرم گزارش عفونت را وارد کنید.')
            }
        } else {
            $scope.warning('لطفاً عنوان فرم گزارش عفونت را وارد کنید.')
        }
    }
    $scope.chooseUsers = function () {
        var arr = [];
        var selected_users = [];
        var obj = $scope.infection.users;
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
                            if ($scope.infection.in_kartabl)
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
                obj = r.map(function (itm) {
                    return itm.id;
                });
                $scope.infection.users = angular.copy(obj);
                if ($scope.infection.in_kartabl && $scope.infection._id) {
                    factory1.postUserApi('/v1/user/hospital/infection_control/user', JSON.stringify({
                        id: $scope.infection._id,
                        users: obj.filter(function (u) {
                            return selected_users.indexOf(u) === -1;
                        }),
                        year: $rootScope.year
                    }))
                }
            }
        });
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
                console.log(wards)
                wards = wards.filter(function (u) {
                    return selected_users.indexOf(u) === -1;
                })
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
    $scope.show_chart = function () {
        hideAllView();
        $scope.charts.show = true;
        $scope.reports.answers = [];
        // $scope.reports.answers=setAnswers( $scope.infection.period)
    }
    $scope.getAnswerInfection = function (arr, information_type) {
        var res = arr.find(function (itm) {
            return itm && itm.information_type == information_type;
        })
        return res ? res.description : '-';
    }
    $scope.show_report = function () {
        hideAllView();
        $scope.reports.answers = setAnswers($scope.infection.period)
        $scope.reports.show = true;
        console.log($scope.reports.answers)
        $scope.excel_style = [];
        $scope.excel_outPut = [];

        $scope.reports.answers.map(function (answer) {
            if (answer.answers_data.length) {
                var excel_outPuts = [];
                answer.answers_data.map(function (row) {
                    var excel_outPut = {
                        'تاریخ ارزیابی': $scope.get_date(row.date || row.created_at),
                        'بخش ارزیابی': $scope.get_ward_name(row.ward_id, $scope.wards),
                        'مسئول ارزیابی': $scope.get_person(row.user_id, $scope.all_users),
                        'ارزیابی شونده': $scope.getAnswerInfection(row.answers,
                            'ارزیابی شونده'
                        ),
                        'اندیکاسیون': $scope.getAnswerInfection(row.answers, 'اندیکاسیون'),
                        'عمل ها': $scope.getAnswerInfection(row.answers,
                            'عمل ها'
                        )
                    }
                    excel_outPuts.push(excel_outPut);
                })
                var excel_style = angular.copy(excelStyleInstans);
                excel_style.sheetid = answer.interval_name;
                $scope.excel_style.push(excel_style);
                $scope.excel_outPut.push(excel_outPuts);

            }
        })
    }
    $scope.detail_report = function (row) {
        console.log(row)
        $scope.detail_recordes = $filter('orderObjectBy')(angular.copy(row.answers_data), 'created_at');
        $scope.isMultiWards = row.wards.length > 1;
        $scope._users = row.users;
        $scope._wards = row.wards;
        $scope.filter.user_id = '';
        $scope.filter.ward_id = '';
        $scope.filter._from = '';
        $scope.filter._to = '';

        $scope.open_modal('lg', 'detail_recordes.html', null, null, 'blue_modal', $scope);
    }
    getInfection()
});
app.controller('system_visit_modal_Ctrl', function ($scope, $rootScope, factory1, localStorageService, $http, Server_URL, BASE, $uibModalInstance, detail, queryHeaders) {

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
        var vf = $scope.current_visit_model.visit_forms.map(function (form) {
            return {
                id: form.id,
                description: form.description,
                form_value: form.values_array.filter(function (itm, index) {

                    if ($scope.dates_array[index].date && $scope.dates_array[index].time.toString().length) {
                        if (itm.value !== null && itm.value !== undefined) {
                            var time = $scope.dates_array[index].time !== '00:00' ? moment($scope.dates_array[index].time).format('HH:mm') : '00:00';
                            itm.date = angular.copy($scope.get_miladi_date($scope.dates_array[index].date, time));
                            itm.operator = angular.copy($scope.dates_array[index].operator);
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

            $scope.warning('ثبت اطلاعات با مشکل مواجه است. لطفاً اندکی بعد دوباره تلاش کنید.');
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
});
app.controller('submenuCtrl', function ($scope, $window, $stateParams) {

    if ($stateParams.submenu === 'رهبری و مدیریت کیفیت') {
        $window.location.href = $scope.BASE + "/management/#/management/improve_quality";
    } else if ($stateParams.submenu === 'مدیریت خطا') {
        $window.location.href = $scope.BASE + "/management/#/management/fault_management";
    }

});
app.config(['$urlRouterProvider', '$stateProvider', '$breadcrumbProvider', 'BASE', 'AllSanjes',
    function ($urlRouterProvider, $stateProvider, $breadcrumbProvider, BASE, AllSanjes) {


        $breadcrumbProvider.setOptions({
            template: '<ol class="breadcrumb">' +
                '<li data-ng-repeat="step in steps" data-ng-class="{active: $last}" data-ng-switch="$last || !!step.abstract">' +
                '<a data-ng-switch-when="false" href="#" data-ng-href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel && step.ncyBreadcrumbLabel.length>2?step.ncyBreadcrumbLabel : $root.get_step_title(step)}}<i class="icon " data-ng-class="step.ncyBreadcrumb.icon?step.ncyBreadcrumb.icon:$root.get_step_icon(step)"  ></i></a>' +
                '<span data-ng-switch-when="true">{{step.ncyBreadcrumbLabel && step.ncyBreadcrumbLabel.length>2?step.ncyBreadcrumbLabel : $root.get_step_title(step) }}<i class="icon " data-ng-class="step.ncyBreadcrumb.icon?step.ncyBreadcrumb.icon:$root.get_step_icon(step)" ></i></span>' +
                '</li>' +
                '</ol>'
        });
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('/', {
            url: '/:menu',
            templateUrl: 'views/submenu.htm',
            ncyBreadcrumb: {
                label: '{{state_title}}'
            }
        })
            .state('submenu', {
                url: '/:menu/:submenu',
                templateUrl: 'views/standard.htm',
                ncyBreadcrumb: {
                    label: '{{state__title}}',
                    parent: '/'
                }
            })
            .state('standard', {
                url: '/:menu/:submenu/:standard',
                templateUrl: 'views/sanje.htm',
                ncyBreadcrumb: {
                    label: '{{state___title}}',
                    parent: 'submenu'
                }
            })
            .state('standard.sanje', {
                url: '/:type/:sanje',
                templateUrl: function (stateParams) {

                    return 'views/sanje/' + AllSanjes[stateParams.type] + '?v=' + Math.random();
                },
                ncyBreadcrumb: {
                    label: '{{$stateParams.type=="روش اجرایی" || $stateParams.type=="دستورالعمل"?$stateParams.type:""+" "+state____title}}',
                    parent: 'standard'
                }
            })
            .state('standard.sanje.completing_daily', {
                url: '/visit/daily/:visit',
                templateUrl: 'views/sanje/Periodic_visits_to_the_building/completing_daily.htm',
                controller: 'Periodic_visits_to_the_building_Ctrl',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت روزانه',
                    parent: 'standard.sanje',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }
            })
            .state('standard.sanje.completing_monthly', {
                url: '/visit/monthly/:visit',
                templateUrl: 'views/sanje/Periodic_visits_to_the_building/completing_monthly.htm',
                controller: 'Periodic_visits_to_the_building_Ctrl',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت ماهانه',
                    parent: 'standard.sanje',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }
            })
            .state('standard.sanje.completing_weekly', {
                url: '/visit/weekly/:visit',
                templateUrl: 'views/sanje/Periodic_visits_to_the_building/completing_weekly.htm',
                controller: 'Periodic_visits_to_the_building_Ctrl',
                ncyBreadcrumb: {
                    label: 'تکمیل چک لسیت هفتگی',
                    parent: 'standard.sanje',
                    icon: 'icon-font icon-tadvin_check_list2 '
                }
            })
            .state('standard.sanje.instruction_history', {
                url: '/history/:instruction_type/:instruction_title/:parent',
                templateUrl: BASE + '/asset/directives/history_procedure.htm',
                controller: 'instruction_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه',
                    parent: 'standard.sanje',
                    icon: 'icon-font icon-tarikhche_virayeshha'
                }

            })
            .state('standard.sanje.policy_history', {
                url: '/history',
                templateUrl: BASE + '/asset/directives/history_policy.htm',
                controller: 'policy_history_Ctrl',
                ncyBreadcrumb: {
                    label: 'تاریخچه',
                    parent: 'standard.sanje',
                    icon: 'icon-font icon-tarikhche_virayeshha'
                }

            });

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
app.config(['$translateProvider', function ($translateProvider) {
    var translations = {
        user: 'کاربر',
        ward: 'بخش'
    };
    $translateProvider.translations('fa', translations);
    $translateProvider.preferredLanguage('fa');
}]);
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
}]);

