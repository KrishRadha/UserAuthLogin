var loginapp=angular.module('login_app',[]);

loginapp.controller('LoginCont',['$scope','$http', '$compile','$sce',
                            
                           
    function LoginCont($scope,$http,$compile,$sce){
    
  $scope.LoginNow=function(){  
    
      $scope.user._csrf=$("#csrf_token").value;
    $http.post('/login',$scope.user).success(function(response){
            
            
        if(response=='403error')
        {
            window.location ='/fourothree';
        }
        console.log(response);
        
             $(document).ready(function(){
             if(response.error)
             {
             var string='';
                 string = '<div class="alert alert-danger">'+response['error']+'</div>';
             $("#error_log_box").html(string);
             }
                 else if(response.done)
                 {
                     window.location ='/dashboard';
                 }
             
             });
            });
  }
  
    
    }]);
              