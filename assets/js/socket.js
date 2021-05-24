// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()

let room_id = window.roomId
if(room_id){
    let channel = socket.channel(`room:${room_id}`, {})
    channel.join()
        .receive("ok", resp => { console.log("Joined successfully", resp) })
        .receive("error", resp => { console.log("Unable to join", resp) })

    channel.on(`room:${room_id}:new_message`, (message) => {
        displayMessage(message)
    })


    document.querySelector('#message-form').addEventListener('submit',(e) =>{
        e.preventDefault()
        let input = e.target.querySelector('#message-body')

        channel.push('message:add', {message: input.value})
        input.value = ""
    })

    const displayMessage = (msg) => {
        console.log(msg)
        let template = `
             <li class="list-group-item">
                <strong>${msg.user.username}</strong>: ${msg.body}
             </li>`

        document.querySelector("#display").innerHTML += template
    }
}



// Now that you are connected, you can join channels with a topic:

export default socket
