var packetapp=angular.module('packetapp',[]);
packetapp.controller('packetcont',['$scope','$http', '$compile','$sce','$interval',
                            
                           
    function packetcont($scope,$http,$compile,$sce,$interval){
    
        var latest_update_id ='N';
        
function Refresh_Chat_Packets()
    {
        // send latest msg id
        console.log('fired');
        $(function(){
            //request server for last ten messages if update id is empty.
            
            var message_request={};
            message_request.otheruser=$("#otherusername").val();
            message_request.latest_update_id=latest_update_id;
            console.log(latest_update_id);
            
            $http.post('/packets',message_request).success(function(response){
            if(response.nothing=='')
                 {
                     
                 }
            else if(!response.error){
            $("#chat_panel").html(response.new_messages+$("#chat_panel").html());
                latest_update_id=response.latest_update_id;
                
            }
                else{
                $("#chat_panel").html(response.error+$("#chat_panel").html());
                    
                }
            });
            
            
            
        });
        
        
        // server will check and send if it has any more latest messages.
        
       // console.log(latest_update_id);
        
    };
       
    $interval(function(){Refresh_Chat_Packets()}, 3000) ;
 // var  person={};
     //   $(function(){person.inkurl=$("#person_url").val();person.review=$("#buffer_store_person").val();});
     $scope.Submit_Item=function(){ 
        // console.log('fired');
         
         $scope.item.cpid=$("#otherusername").val();
         console.log($scope.item);
      //   $scope.review.type='person';
         $http.post('/newpacket',$scope.item).success(function(response){
             
             $(document).ready(function(){
                 
                if(response.succ=='go')
                 {
                     $("#chat_packet").html('');
                     
                     // add the message to chat div.
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