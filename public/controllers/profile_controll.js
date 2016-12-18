var profileapp=angular.module('profileapp',[]);

profileapp.controller('ProfileCont',['$scope','$http', '$compile','$sce',
                            
                           
    function ProfileCont($scope,$http,$compile,$sce){
        
         console.log('pressed');
        
        
        $scope.NewDescription= function(){
            
            
            
            
            
        if($scope.profile)
        {
        var description = $scope.profile.description;
            
            console.log(description);
            
            /* ESCAPE THE CONTENT EDITABLE TRUE TO FLASE */
          
            description=description.replace('contenteditable=\"true\"', '');
            
            
             $http.post('/profile',{description:description}).success(function(response){
             
             
             // CHECK IF DESCRIPTION IS OF SAME USER AS WHO IS POSTING THIS? FOR NW POSTING DIRECTLY IN LOGGED IN USER.
                 
                  $(document).ready(function(){
             if(response.error)
             {
                 $("#profile_dis_error").html(error);
                 
             }
             else{
                      
                     location.reload();
                      
                      }
                  });
                 
             
             });
        }
            else
            {
                $("#profile_dis_error").html("Write some description.");
            }
        };
        
    }
                                   
                                   
                                   
                                   
                                   
                                   ]);