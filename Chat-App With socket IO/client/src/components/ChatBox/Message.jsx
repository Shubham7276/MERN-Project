import "./message.css";
import { format } from "timeago.js";


export default function Message({ message, own }) {

  
  return (
    <>
    
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
         {message.text !=="" ?(<p className="messageText">{message.text}</p>):null}
         {message.media ?(<p className="messageMedia"><img src={message.media} alt="" width="200px" height="200px" /></p>):null}
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
      
    </div>
    </>
  );
}