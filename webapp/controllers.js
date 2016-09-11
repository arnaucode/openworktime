var urlapi = "http://192.168.1.41:3000/api/";
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
        var refreshTime=10000;//every 10 seconds

        var errorsGettingData=0;
        $scope.serverNotResponding = function(){
            console.log("server not responding, data error");
            toastr.error("server not responding");
            $scope.$broadcast('scroll.refreshComplete');//refresher stop
            errorsGettingData++;
            console.log("errorsGettingData: " + errorsGettingData);
            if(errorsGettingData>3)
            {
                $interval.cancel(intervalGetData);
                $scope.currentInclude="login.html";
            }
        };
        $scope.getLoggedUser = function(){
            //get logged user
            $http.get(urlapi + 'users/loggeduser/' + $scope.user.username)
                .success(function(data, status, headers,config){
                    console.log(data);
                    $scope.user=data;
                })
                .error(function(data, status, headers,config){
                    $scope.serverNotResponding();
                })
                .then(function(result){
                    users = result.data;
            });
        };
        $scope.countingTime;
        /* DASHBOARD initialization */
        $scope.dashboardInit = function(){
            if(localStorage.getItem('owt_token')){// adding token to the headers
                $http.defaults.headers.post['X-Access-Token'] = localStorage.getItem('owt_token');
                $http.defaults.headers.post['Content-Type'] = 'application/json';
                $http.defaults.headers.common['X-Access-Token'] = localStorage.getItem('owt_token');
            }
            if(localStorage.getItem("owt_user")){
                $scope.user=JSON.parse(localStorage.getItem("owt_user"));
            }else{

                $scope.serverNotResponding();
            }

            $scope.getLoggedUser();

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
                if(data.success==false){
                    localStorage.removeItem("owt_token");
                    localStorage.removeItem("owt_user");
                    $scope.currentInclude="login.html";
                    console.log("token ended");
                }else{
                    for(var i=0; i<data.length; i++)
                    {
                        data[i].chart=translateWorkStrikes2Chart(data[i].workStrikes);
                    }
                    console.log(data);
                    $scope.projects=data;
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
        };
        /* </DASHBOARD initialization */


        $scope.user={};

        $http.defaults.headers.post['Content-Type'] = 'application/json';
        if(localStorage.getItem("owt_user")){
            if(localStorage.getItem('owt_token')){// adding token to the headers
                $http.defaults.headers.post['X-Access-Token'] = localStorage.getItem('owt_token');
                $http.defaults.headers.post['Content-Type'] = 'application/json';
                $http.defaults.headers.common['X-Access-Token'] = localStorage.getItem('owt_token');
            }
            $scope.user=JSON.parse(localStorage.getItem("owt_user"));
            $scope.currentInclude="dashboard.html";
            $scope.getLoggedUser();
            $scope.dashboardInit();
            intervalGetData = $interval(function(){
                $scope.dashboardInit();
            }, refreshTime);
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
                        }, refreshTime);
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
        //$scope.working=false;
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
            $scope.projects=response.data;
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
        /*$scope.projects.splice(index, 1);
        localStorage.setItem("w_l_projects", angular.toJson($scope.projects));*/
        $http({
            url: urlapi + 'projects/' + $scope.projects[index]._id,
            method: "DELETE",
            data: $scope.user._id
        }).then(function(response) {
            console.log(response);
            $scope.projects=response.data;
            $scope.projectSelect(null);
        },
        function(response) {// failed
        });
    };
    $scope.currentprojectIndex;
    $scope.projectSelect = function(index){
        //$scope.btnStop();
        $scope.currentprojectIndex=index;
        $scope.currentproject=$scope.projects[index];
    };

    $scope.joinProject = function(){
        console.log($scope.user);
        $http({
            url: urlapi + 'projects/'+$scope.currentproject._id+'/adduser',
            method: "PUT",
            data: $scope.user
        }).then(function(response) {
            console.log("project joined");
            $scope.projects=response.data;
            //re select currentproject
            $scope.currentproject=$scope.projects[$scope.currentprojectIndex];
            toastr.success("project joined");
        },
        function(response) {// failed
        });
    };
    var interval;
    $scope.currentStrike=0;
    $scope.btnWork = function(){
        //$scope.editingProject=false;
        $scope.user.working=true;
        $http({
            url: urlapi + 'projects/' + $scope.currentproject._id + '/startworking',
            method: "PUT",
            data: $scope.user
        }).then(function(response) {
            console.log(response);
            $scope.projects=response.data;
            $scope.getLoggedUser();
        },
        function(response) {// failed
        });
    };
    $scope.btnStop = function(){
        if($scope.user.working==true)
        {
            //$scope.user.working=false;
            $http({
                url: urlapi + 'projects/' + $scope.currentproject._id + '/stopworking',
                method: "PUT",
                data: $scope.user
            }).then(function(response) {
                console.log(response);

                for(var i=0; i<response.data.length; i++)
                {
                    response.data[i].chart=translateWorkStrikes2Chart(response.data[i].workStrikes);
                }
                $scope.projects=response.data;
                $scope.getLoggedUser();
                $scope.currentproject=$scope.projects[$scope.currentprojectIndex];
            },
            function(response) {// failed
            });
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
    $scope.arrayObjectIndexOf = function(myArray, searchTerm, property) {
        if(myArray)
        {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm){
                    //console.log("i: " + i);
                    return i;
                }
            }
        }
        //console.log("i: -1");
        return -1;
    }

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



function translateWorkStrikes2Chart(workStrikes){
	var auxChart={
		labels: [],
		series: ['working'],
		data: []
	};
    if(workStrikes)
    {
    	for(var i=0; i<workStrikes.length; i++)
    	{
    		auxChart.labels.push(workStrikes[i].username);
    		auxChart.data.push(workStrikes[i].time);
    	}
    }
    	return(auxChart);
}
