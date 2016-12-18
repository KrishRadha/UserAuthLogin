var newinkapp=angular.module('newinkapp',[]);

newinkapp.controller('Newpostcont',['$scope','$http', '$compile','$sce',
                            
                           
    function Newpostcont($scope,$http,$compile,$sce){
    
        
        
    
        
    
 // var  person={};
     //   $(function(){person.inkurl=$("#person_url").val();person.review=$("#buffer_store_person").val();});
     $scope.Submit_Item=function(){ 
        // console.log('fired');
         console.log($scope.item);
        
      //   $scope.review.type='person';
         $http.post('/newpacket',$scope.item).success(function(response){
             
             $(document).ready(function(){
                 
                 if(response.succ=='go')
                 {
                     window.location ='/packets?username='+$scope.item.cpid;
                 }
                 else
                 {
                     if(response.error=='')
                       response.error='An error occured in delivering your packet.';
                     $("#person_error").html(response.error);
                 }
                 /*
             if(response.error)
             {
             var string='';
                 string = '<div class="alert alert-danger">'+response['error']+'</div>';
             $("#error_person").html(string);
             }
                 else if(response.done)
                 {
                     var string='';
                     string='<div class="jumbotron">Please verify your mail now, by visiting your email and click on the Verification link we just mailed to you. We can not wait to see you at Indian Panther. You will be redirected shortly</div>';
                     $("#error_reg_box").html(string);
                     setTimeout(function() { window.location ='/'; }, 5000);
                     
                 }
                 */
             
         });
            
   
    
    });
    
    };
                                      
                                      
    }
                                      
                                       
                                      
    ]);