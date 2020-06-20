document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
    var storage = window.localStorage;
    //set all buttons to disabled
    document.querySelector('.submit_message').disabled = true;
    document.querySelector('.submit_channel').disabled = true;

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
          return false
          
                       };

                            };
      
                                        };
                                      
  




//All socket io are here
socket.on('load_channel', data => {
  console.log(data)
  for(info in data){
    console.log(data[info])
    for (key in data[info]){
      console.log(data[info][key])
      console.log(key)
      if(key == storage.getItem('username')){
        const div = document.createElement('div')
        sent_message = `<div class="message-box private">${data[info][key]}</div>`
        div.innerHTML =sent_message
        document.querySelector('.message-div').append(div)
      }
      else{
        div = document.createElement('div')
        received_message = `<div class="message-box public">${data[info][key]}</div>`
        div.innerHTML = received_message
        document.querySelector('.message-div').append(div)
      }
    }
  }
});


//Creating a new channel
document.querySelector('.channel_form').onkeyup = () => {
  if (document.querySelector('.channel_form').value.length > 0)
      document.querySelector('.submit_channel').disabled = false;
  else
      document.querySelector('.submit_channel').disabled = true;
};
document.querySelector('.new_channel').onsubmit = () =>{
  const channel_name = document.querySelector('.channel_form').value
  console.log(channel_name)
  socket.emit('create_channel', channel_name )
  document.querySelector('.channel_form').value = ""
  return false
}

//SOCKET IO FOR NEW CHANNEL
socket.on('create_channel', data =>{
  console.log(data)
  const div =  document.createElement('div')
  div.innerHTML =  `<a class="channels" href = "#" >${data.channel_name}</a>`
  alert(data.alert)
  document.querySelector('.user_channel').append(div)
  div.innerHTML.onclick = load_channel
})

function load_channel() {
  const channel_name =  this.innerHTML 
  document.querySelector('.channel_name').innerHTML = channel_name
  document.querySelector('.message-div').innerHTML = ""
  socket.emit('load_channel', channel_name)
  
};

 //When a channel is clicked upon
 document.querySelectorAll('.channels').forEach(channel => {
  channel.onclick = load_channel
});

 //When a message is sent
 document.querySelector('.message_form').onkeyup = () => {
  if (document.querySelector('.message_form').value.length > 0)
      document.querySelector('.submit_message').disabled = false;
  else
      document.querySelector('.submit_message').disabled = true;
};


  document.querySelector('.new_message').onsubmit = () =>{
  const user_message = document.querySelector('.message_form').value
  console.log(user_message)
  const channel_name = document.querySelector('.channel_name').innerHTML
  const div = document.createElement('div')
        sent_message = `<div class="message-box private">${user_message}</div>`
        div.innerHTML =sent_message
        document.querySelector('.message-div').append(div)
  socket.emit('new_message', {'user_message':user_message,'channel_name': channel_name, 'user':storage.getItem('username')} )
  document.querySelector('.message_form').value = ""   
  return false 
  }
  
  socket.on('new_message', data =>{
    const div = document.createElement('div')
    received_message = `<div class="message-box public">${data}</div>`
    div.innerHTML = received_message
    document.querySelector('.message-div').append(div)
  })

  });

