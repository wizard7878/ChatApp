// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket,Presence} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()

let room_id = window.roomId
let presences = {}
const timeout = 1000
var typeingTimer
let userTyping = false

if(room_id){
    let channel = socket.channel(`room:${room_id}`, {})
    channel.join()
        .receive("ok", resp => { console.log("Joined successfully", resp) })
        .receive("error", resp => { console.log("Unable to join", resp) })

    channel.on(`room:${room_id}:new_message`, (message) => {
        displayMessage(message)
    })

    channel.on("presence_state" , state => {
        presences = Presence.syncState(presences , state)
        console.log(presences)
        displayUsers(presences)
    })

    channel.on("presence_diff" , diff => {
        presences = Presence.syncDiff(presences,diff)
        console.log(presences)
        displayUsers(presences)
    })


    document.querySelector('#message-form').addEventListener('submit',(e) =>{
        e.preventDefault()
        let input = e.target.querySelector('#message-body')

        channel.push('message:add', {message: input.value})
        input.value = ""
    })

    document.querySelector("#message-body").addEventListener('keydown',() => {
        userStartsTyping()
        clearTimeout(typeingTimer)
    })

    document.querySelector("#message-body").addEventListener('keyup',() => {
        clearTimeout(typeingTimer)
        typeingTimer = setTimeout(userStopTyping, timeout)
    })

    const userStartsTyping = () => {
        if(userTyping){
            return
        }
        userTyping = true
        channel.push('user:typing', {
            typing: true
        })
    }

    const userStopTyping = () => {
        clearTimeout(typeingTimer)
        userTyping = false

        channel.push('user:typing' , {
            typing: false
        })
    }
    const displayMessage = (msg) => {
        console.log(msg)
        let template = `
             <li class="list-group-item">
                <strong>${msg.user.username}</strong>: ${msg.body}
             </li>`

        document.querySelector("#display").innerHTML += template
    }

    const displayUsers = (presences) => {
        let usersOnline = Presence.list(presences , (_id, {
            metas:[
                user, ... rest
            ]
        }) => {
            var typingTemplate = ``
            if (user.typing){
                typingTemplate = `<i> Typing ... </i>`
            }
            return `
                 <div style="width:10px; height:10px;" class="badge bg-success">  </div> ${user.username} ${typingTemplate}
                 <br/>
            `
        }).join("")
        document.querySelector("#users-online").innerHTML = usersOnline
    }
}



// Now that you are connected, you can join channels with a topic:

export default socket
