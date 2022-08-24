import styles from "./styles.module.css";
import ChatList from "../ChatList/ChatList"

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import Message from "../ChatBox/Message";
import { useEffect, useState,useRef } from "react";
import EmptyChat from "../../images/emptyChat.jpg"

import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from "emoji-picker-react";

import { Button, TextField, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import { blue } from '@mui/material/colors';
import { io } from "socket.io-client";
import "./emoji.css"

import { ToastContainer, toast } from 'react-toastify';
import ProfileUpdateDaialog from '../Update_Profile/ProfileUpdate'
import { AddNewConversation, AddNewMessage, DeleteConversation, DeleteMessage, GetAllConversation, GetAllMessage, GetAllUsers } from "../../Services/Api";



const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("profile")
		localStorage.removeItem("userId")
		window.location.reload();
	};
	const Profile=localStorage.getItem("profile")
	const userId=localStorage.getItem("userId")

	
	const [conversations, setConversations] = useState([])
	const [users,setAllUsers] = useState([])
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newconversations, setNewConversations] = useState("")
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [currentChatUser, setcurrentChatUser] = useState();
	const [media, setMedia] = useState("");
	const [typing, setTyping] = useState(null);
	const [showtyping, setShowTyping] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [open, setOpen] = useState(false);
	
	const [searchCoversationUser,setCoversationUser]=useState(null)

	const [searchUser,setSearchUser]=useState("")
	
	

	const socket = useRef();
	const scrollRef = useRef();
	
	

	

	const handleEmojiPickerhideShow = () => {
		setShowEmojiPicker(!showEmojiPicker);
	  };
	  const handleEmojiClick = (event,emojiObject) => {
		 
		let message = newMessage;
		message += emojiObject.emoji;
		setNewMessage(message);
	  };

	//   Socket io connect to server

	useEffect(()=>{
		socket.current =io("ws://localhost:8080")
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
			  sender: data.senderId,
			  text: data.text,
			  media:data.media,
			  createdAt: Date.now(),
			});
		  });
	},[]);

	useEffect(() => {
		arrivalMessage &&
		  currentChat?.members.includes(arrivalMessage.sender) &&
		  setMessages((prev) => [...prev, arrivalMessage]);
	  }, [arrivalMessage, currentChat]);

	useEffect(()=>{
		socket.current.emit("addUser",userId);
		socket.current.on("getUsers",users=>{
			
		})
	},[])

	// Typing status

	useEffect(()=>{
		let typingTime = new Date().getTime()
		setTimeout(()=>{
			var currentTime = new Date().getTime();
			var timeDifference = currentTime - typingTime;
			if(timeDifference >=2500 && typing){
				setTyping(null);
			}
		}, 2500)
	},[typing])

	const onChage = (frdId,chatId) =>{
		const data={frdId,chatId}
		socket.current?.emit("typing",data);
	}

	
	// Get coversation

		useEffect(()=>{
			const getConversations = async () => {
				try {
				  const {data:res} = await GetAllConversation(userId);
				  setConversations(res);
			  
				  
				} catch (error) {
				  console.log(error);
				}
			  };
			  getConversations();
		},[])
		
			
			
	
	  useEffect(()=>{
		const allUser = async()=>{
			
			try {
				const {data : res} = await GetAllUsers();
				
				const user=res;

				const data=user.filter((u)=>(
					u.userName.toLowerCase().includes(searchUser.toLowerCase())
				))
				setAllUsers(data)
				
			} catch (error) {
				console.log(error);
			}
		};
		allUser()
	  },[searchUser])
	  
	  
	  const getMessages = async () => {
		try {
		  const {data : res} = await GetAllMessage(currentChat?._id);
		  setMessages(res);
		} catch (error) {
		  console.log(error);
		}
	  };
		 
	  
	  
	 

	  useEffect(() => {
		
		socket.current?.on("sendstatus", status=>{
			
			if(currentChat && status.chatId === currentChat?._id)
			{
				setShowTyping(status.frdId)
				setTyping("Typing...")	
			}
			
		})
		  getMessages();
			
	  }, [currentChat]);

	  //Delete Messages

	  const deleteMessage = async () => {
		try {
		  const {data : res} = await DeleteMessage(currentChat?._id);	
		  getMessages();
		} catch (error) {
		  console.log(error);
		}
	  };

	  //Delete Conversations
	  const deleteConversation = async () => {
		try {
		  const {data : res} = await DeleteConversation(currentChat?._id);
			window.location="/";
			deleteMessage()
		} catch (error) {
		  console.log(error);
		}
	  };

	  //Current user Id

	  const CurrentID = (c)=>{
		  setCurrentChat(c)
		const friendId = c?.members.find(m=>m !== userId)
		 users.map((user)=>{
			
			if(user._id === friendId ){
				setcurrentChatUser(user)	
			}

		})
	  }
	  
	  // Send Messages

	  const handleSubmit = async (e) => {
		e.preventDefault();
		setShowEmojiPicker(false);
		if(newMessage === '' && media === ''){
			toast.error("Please type a message to continue")
		}else{
		const file = document.querySelector('.file');
        file.value = '';
		const message = {
		  sender: userId,
		  text: newMessage,
		  media:media,
		  conversationId: currentChat._id,
		};
		

		const receiverId = currentChat.members.find(
			(member) => member !== userId
		  );

		  socket.current.emit("sendMessage", {
			senderId: userId,
			receiverId,
			media:media,
			text: newMessage,
		  });
		  
		try {
			const {data : res} = await AddNewMessage(message);
			setMessages([...messages, res]);
			setNewMessage("");
			setMedia("")
		  } catch (error) {
			console.log(error);
		  }
		}
		};

		
			
		
		// Add New conversation
		
		const addNewConversation = async(e)=>{	
			const members = {
				senderId: userId,
				receiverId: e._id
		};
		
		try {
			const {data: res} = await AddNewConversation(members)
			setNewConversations(...newconversations,res)
			handleClose();
			window.location="/"
		} catch (error) {
			toast.error(error.response.data.message);
		}
		}
		
		
		//Dialog Box function

		const handleClickOpen = () => {
			setOpen(true);
		  };
		
		  const handleClose = () => {
			setOpen(false);
			setSearchUser("");
		  };
		

		useEffect(() => {
			scrollRef.current?.scrollIntoView({ behavior: "smooth" });
		  }, [messages]);


	return (
		<>
		<div className={styles.main_container}>
			<div className={styles.main_body}>
				
			<div className={styles.message_container}>
				<div className={styles.list_header}>
					<ProfileUpdateDaialog profile={Profile} userId={userId}/>
					
					
					<div className={styles.right_header}>
						<IconButton >
						<DonutLargeIcon/>
						</IconButton>

						<IconButton>
						<ChatIcon/>
						</IconButton>

						<IconButton title="Logout" onClick={handleLogout}>
						<ExitToAppIcon/>
						</IconButton>
					</div>
				</div>
			
		
			<div className={styles.contact_search}>
				<div className={styles.search_container}>
					<SearchIcon/>
					<input type="text" placeholder="Search or start a new chat" onChange={e=>setCoversationUser(e.target.value)}/>
				</div>
			</div>
			
		{/*--------- Open dialogBox --------------------*/}

	<div className={styles.chats_container}>

		<div>
			<Button fullWidth sx={{fontSize:"20px", color:"black"}} onClick={handleClickOpen}>
				Add New Chat
			</Button>
					<Dialog open={open} onClose={handleClose}>
						<DialogTitle>Add New Conversation</DialogTitle>
						<DialogContent> 
						<TextField
							sx={{width:"350px"}}
							autoFocus
							margin="dense"
							id="name"
							label="Search User"
							type="email"
							onChange={e=>setSearchUser(e.target.value)}
							autoComplete="off"
							variant="standard"
						/>
						<List sx={{ pt: 0 }}>
						
						{users?.map((user) => (
							
							<div onClick={()=>{addNewConversation(user)}} key={user._id}>
									{userId !== user._id ? 
								<ListItem button onClick={handleClose}  >
								
									<ListItemAvatar>
									<Avatar  src={user.profile} sx={{ bgcolor: blue[100], color: blue[600]}}>
										
									</Avatar>
									</ListItemAvatar>
									<ListItemText primary={user.userName} />
									
								</ListItem>
									:null}
							</div>
						
						))}
						</List>
						</DialogContent>
						</Dialog>
		</div>
			
				{conversations?.map((c)=>(
					<div  onClick={()=>{CurrentID(c)}} key={c._id}>
						
					<ChatList 
						conversation={c} 
						currentUser={userId} 
						deleteMessage={deleteMessage} 
						deleteConversation={deleteConversation}
						searchCoversationUser={searchCoversationUser}
						/>
					</div>
				))}			
		</div>
		</div>
					<div className={styles.chatBoxWrapper}>
						{currentChat? (
						<>
						<div className={styles.chatBox_header}>
							<div className={styles.user_profile}>
							<Avatar src={currentChatUser.profile} sx={{height:"50px", width:"50px"}}/>
							{currentChatUser.userName}
							{typing && showtyping === currentChatUser._id ?<span>{typing}</span>:null}
							</div>
							
						</div>
						<div className={styles.chatBoxTop}>
							{messages?.map((m)=>(
									<div ref={scrollRef}  key={m._id}>
									<Message message={m} own={m.sender === userId}/>
									</div>
								))}	
							{showEmojiPicker && <Picker className={styles.emoji} onEmojiClick={handleEmojiClick}/>}
						</div>
						<div className={styles.chatBoxBottom}>
						<IconButton onClick={handleEmojiPickerhideShow}>
							<EmojiEmotionsIcon />
						</IconButton>
						<IconButton>
						<div className={styles.round}>
							<input
							type="file"
							className="file"
							onChange={(e) => {
								const file = e.target.files[0];
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = function () {	
								setMedia(reader.result);  
								};
								reader.onerror = function (error) {
								console.log(error);
								};
								}}    
							/>
                			<AttachFileIcon/> 
						</div>
            			</IconButton>
			
                  <input
                    className={styles.chatMessageInput}
                    placeholder="write something..."
                    onChange={(e) => {setNewMessage(e.target.value); onChage(userId,currentChat._id)}}
					onKeyDown={(e)=>{if(e.key === 'Enter'){
						handleSubmit(e);
					}}}
                    value={newMessage}
					/>
				
                  <button onClick={handleSubmit}  className={styles.chatSubmitButton} >
                    Send
                  </button>
				
                </div>
						</>	):(<img className={styles.emaptyimg} src={EmptyChat}></img>)
							} 
					
			</div>
		</div>
		
	</div>
	<div>
         
	<ToastContainer
		autoClose={4000}
		
	/>
      </div>
			</>
			
	);
};

export default Main;
