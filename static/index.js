document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
    var storage = window.localStorage;
    //set all buttons to disabled
    document.querySelector('.submit_message').disabled = true;
    document.querySelector('.submit_channel').disabled = true

    if (storage.getItem('username'))
        {
          //Set Userame to name
        var user = storage.getItem('username')
        document.querySelector('#active').innerHTML = "Welcome " + user[0].toUpperCase() + user.slice(1)
        
    }
    else{
      //Setting up the modal
        var modal = document.querySelector('.modal');
        
        modal.style.display = "block";

        var username = document.querySelector('.register_form');

        document.querySelector('#register').onsubmit = () =>
        {

        if (username.value.length < 4)

          {
            alert("Display name must be at least 4 characters long!");
            username.focus();
            return false;
                      }

        else {
          storage.setItem("username", username.value);
          modal.style.display = 'none';
          document.querySelector()
                       };

                            };
      
                                        };
  // When a user creates a new channel
  document.querySelector('.submit_channel').onsubmit = () => {
    const channel = document.querySelector('.channel_form').value
    socket.emit('new_channel', channel)
  } 

 
  //When a message is sent 
  document.querySelector('.submit_message').onsubmit = () => {
  
    const message = document.querySelector('.message_form').value 
    const channel = document.querySelector('.channel_name').innerHTML
    if (message.length > 0){
    document.querySelector('.submit_message').disabled = false;
    socket.emit('sent_message', {'message' : message, 'channel' : channel} )
      }

  };

  //When a channel is clicked upon
  document.querySelectorAll('.channels').forEach(channel => {
    channel.onclick = () =>{
      const channel_name =  channel.innerHTML 
      document.querySelector('.channel_name').innerHTML = channel_name
      socket.emit('load_channel', channel_name)
    }
  });


//All socket io are here
socket.on('load_channel', data => {
 for(var key in data){
   for(var info in key ){
      if(info = storage.getItem('username')){
        console.log(info)
      }
   }
  }
});




  });

