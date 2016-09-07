var urlapi = "http://localhost:3000/api/";

angular.module('workApp', ['chart.js'])
  .controller('workController', function(
        $scope,
        $interval,
        $http
    ) {
        $scope.users={};
        $scope.projects={};
        $scope.currentInclude='login.html';
        /* DASHBOARD initialization */
        $scope.dashboardInit = function(){
            if(localStorage.getItem('owt_token')){// adding token to the headers
                $http.defaults.headers.post['X-Access-Token'] = localStorage.getItem('owt_token');
                $http.defaults.headers.common['X-Access-Token'] = localStorage.getItem('owt_token');
            }

            //getting users
            $http.get(urlapi + 'users')
            .success(function(data, status, headers,config){
                if(data.success==false){
                    localStorage.removeItem("owt_token");
                    localStorage.removeItem("owt_user");
                    $scope.currentInclude="login.html";
                    console.log("token ended");
                }else{
                    console.log(data);
                    $scope.users=data;
                }
            })
            .error(function(data, status, headers,config){
                console.log("server not responding, data error");
                toastr.error("server not responding");
                $scope.$broadcast('scroll.refreshComplete');//refresher stop
            })
            .then(function(result){
                users = result.data;
            });

            //getting projects
            $http.get(urlapi + 'projects')
            .success(function(data, status, headers,config){
                console.log(data);
                $scope.projects=data;
            })
            .error(function(data, status, headers,config){
                console.log("server not responding, data error");
                toastr.error("server not responding");
                $scope.$broadcast('scroll.refreshComplete');//refresher stop
            })
            .then(function(result){
                users = result.data;
            });

        };
        /* </DASHBOARD initialization */


        $scope.user={};
        if(localStorage.getItem("owt_user")){
            $scope.user=JSON.parse(localStorage.getItem("owt_user"));
            $scope.currentInclude="dashboard.html";
            $scope.dashboardInit();
            intervalGetData = $interval(function(){
                $scope.dashboardInit();
            }, 2000);
        }else{
            $scope.currentInclude="login.html";
        }

        /* LOGIN SIGNUP */
        $scope.showSignup = function(){
            $scope.currentInclude="signup.html";
        };
        $scope.hideSignup = function(){
            $scope.currentInclude="login.html";
        };
        $scope.onBtnSignup = function(){
            $scope.user.projects=[];
            $http({
                url: urlapi + 'users',
                method: "POST",
                data: $scope.user
            }).then(function(response) {
                $scope.currentInclude="login.html";
            },
            function(response) {// failed
            });

        };
        var intervalGetData;//out of internal scope
        $scope.onBtnLogin = function(){
            $http({
                url: urlapi + 'auth',
                method: "POST",
                data: $scope.user
            }).then(function(response) {
                    if(response.data.success)
                    {
                        localStorage.setItem("owt_token", response.data.token);
                        localStorage.setItem("owt_user", angular.toJson(response.data.user));
                        $scope.user=JSON.parse(localStorage.getItem("owt_user"));

                        $scope.currentInclude="dashboard.html";
                        $scope.dashboardInit();

                        intervalGetData = $interval(function(){
                            $scope.dashboardInit();
                        }, 2000);
                    }else{
                        toastr.error(response.data.message);
                    }
            },
            function(response) {// failed
            });
        };
        $scope.onBtnLogout = function(){
            $http({
                url: urlapi + 'logout',
                method: "POST",
                data: $scope.user
            }).then(function(response) {
                    localStorage.removeItem("owt_token");
                    localStorage.removeItem("owt_user");
                    $interval.cancel(intervalGetData);
                    $scope.currentInclude="login.html";
            },
            function(response) {// failed
            });
        };
        /* </ LOGIN SIGNUP */




        //localStorage.clear();
        $scope.working=false;
    $scope.currentproject={};

    $scope.newproject={};
    //$scope.newproject.id=$scope.projects[$scope.projects.length-1].id+1;
    $scope.addNewProject = function(){
        /*$scope.newproject.totaltime="0";
        $scope.projects.push($scope.newproject);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.newproject={
            id: $scope.projects[$scope.projects.length-1].id+1,
            chart: {
                labels: [],
                series: ['Working time'],
                data: []
            }
        };*/
        $http({
            url: urlapi + 'projects',
            method: "POST",
            data: $scope.newproject
        }).then(function(response) {
            console.log("project posted");
            console.log(response);
            toastr.success("project created at server");
            $scope.newproject={};
        },
        function(response) {// failed
        });
    };
    $scope.editingIndex="";
    $scope.editProject = function(index){
        $scope.editingIndex=index;
        $scope.editingProject=angular.copy($scope.projects[index]);
    };
    $scope.cancelEditProject = function(){
        $scope.editingProject=false;
    };
    $scope.updateProject = function(){
        $scope.projects[$scope.editingIndex]=angular.copy($scope.editingProject);
        $scope.currentproject=angular.copy($scope.editingProject);
        $scope.editingProject=false;
    };
    $scope.removeProject = function(index){
        $scope.projects.splice(index, 1);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        $scope.projectSelect(0);
    };
    $scope.projectSelect = function(index){
        $scope.btnStop();
        $scope.currentproject=$scope.projects[index];
    };
    var interval;
    $scope.currentStrike=0;
    $scope.btnWork = function(){
        $scope.editingProject=false;
        $scope.working=true;
        $scope.currentStrike=0;
        interval = $interval(function(){
            $scope.currentStrike++;
            $scope.currentproject.totaltime++;
        }, 1000);
    };
    $scope.btnStop = function(){
        $interval.cancel(interval);
        if($scope.working==true)
        {
            $scope.working=false;
            $scope.currentproject.chart.labels.push("work strike " + $scope.currentproject.chart.labels.length);
            $scope.currentproject.chart.data.push($scope.currentStrike);

            localStorage.setItem("w_l_projects", angular.toJson($scope.projects));
        }


    }

    $scope.openCode = function(){
        toastr.info("Visiting code");
        var urlCode="https://github.com/idoctnef/openworktime";
        if(typeof process !== 'undefined'){
            console.log(process.versions['electron']);
            const {shell} = require('electron');

            shell.openExternal(urlCode);
        }else{
            window.open(urlCode);
        }
    };

    //chart
    /*$scope.chart={
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        series: ['Working time', 'Series B'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ]
    };*/

  })


  .filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(2016, 0, 1).setSeconds(seconds);
    };
}]);
