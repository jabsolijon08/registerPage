'use strict';

angular
    .module('registerApp')
    .controller('AppCtrl', [
        '$scope',
        '$http',
        function ($scope, $http) {
            // $http
            //     .get('/users')
            //     .then(function (response) {
            //         console.log("I got the data I requested: \n");
            //         $scope.users = response;
            //     }, function (error) {
            //         console.log("Error while getting the response.\n" + error);
            //     });

            $http.defaults.transformResponse = []; 
            // Impedir a serialização do JSON da resposta
 
            $scope.checkScreen = function () {
                // Em telas pequenas o campo celular fica oculto e não pode ser obrigatório
                if (window.innerWidth > 700) {
                    return true;
                }
                return false;
            };

            $scope.submitForm = function () {
                // console.log($scope.user);
                var postData = {},
                    u = $scope.user,
                    // import user as JSON
                    user = {
                        email: {
                            address: ''
                        },
                        person: {
                            name: '',
                            lastName: '',
                            taxDocument: {
                                number: '',
                                type: 'CPF'
                            },
                            birthDate: '',
                            phone: {
                                countryCode: '',
                                areaCode: '',
                                number: ''
                            }
                        },
                        type: ''
                    };
    
                user.email.address = u.email;
                user.person.name = u.name; // parse!
                user.person.lastName = u.name;
                user.person.taxDocument.number = u.cpf;
                user.person.phone.number = u.cellphone;
                //  handle area code

                $http({
                        method: 'POST',
                        url: 'https://private-anon-b26c3c7809-testemoip.apiary-mock.com/v2/accounts',
                        data: user,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                }).then(function successCallback(response) {
                    var msg = '';
                    switch (response.status) {
                        case 200:
                            msg = 'Conta criada com sucesso';
                            break;
                        case 201:
                            var str = '', json = '', data = {};
                            str = response.data;
                            json = JSON.stringify(eval("(" + str + ")"));
                            data = JSON.parse(json);
                            msg = 'Conta de ' +data.person.name + ' ' + data.person.lastName + ' criada com sucesso.' +
                                  '\nConfirme seu e-mail clicando no link que enviamos para ' + data.email.address;
                            break;
                        default: 
                            msg = 'Ocorreu um erro.'
                            break;
                    }
                    alert(msg);
                }, function errorCallback(response) {
                    console.error(response);
                    alert('Ocorreu um erro.');
                });
                // $http.post('/users', user);
                // $http.get('/users');
            };
        }])
    .directive('comparewith', [
        '$parse',
        function ($parse) {
            // Validar confirmação de senha
            return {
                require: 'ngModel',
                link: function (scope, elm, attr, ngModel) {
                    var getter = $parse(attr.comparewith);

                    ngModel.$validators.comparewith = function (val) {
                        return val === getter(scope);
                    }

                    scope.$watch(attr.comparewith, function (value, otherValue) {
                        if (value !== otherValue) {
                            ngModel.$validate();
                        }
                    });
                }
            }
        }]);