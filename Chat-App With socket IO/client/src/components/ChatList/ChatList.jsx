import styles from "./styles.module.css";

import { Avatar, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DefaultPic from "../../images/defaultpic.jpg"
import { GetUser } from "../../Services/Api";

const ChatList = ({conversation, currentUser, deleteMessage,deleteConversation,searchCoversationUser}) => {
	const [user, setUser] = useState("")
	const [veiw, setVeiw] = useState(true)

	const settings = ['Block User','Delete Chat','Delete Conversation'];
	const [anchorElUser, setAnchorElUser] = useState(null);
	


	useEffect(()=>{
		const friendId = conversation.members?.find(m=>m !== currentUser)	
		
		const getUser = async () => {
			try {
			  
			  const res = await GetUser( friendId);
			  console.log(res)
				if(searchCoversationUser && !res.data.userName.toLowerCase().includes(searchCoversationUser.toLowerCase())){
					setVeiw(false)
				}else{
					setVeiw(true)
				}
				setUser(res.data);
			
				
			} catch (err) {
			  console.log(err);
			}
		  };
		  getUser()
	},[conversation,currentUser,searchCoversationUser])
	 

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	  };

	  const handleCloseUserMenu = (e) => {
		setAnchorElUser(null);
		switch(e.target.id){

			case "Delete Chat" :
				const confirmBox = window.confirm(
					"Are You Sure to Delete Your Chat?"
				  )
				  if (confirmBox === true) {
					deleteMessage();
				  }
				
			break;

			case "Delete Conversation" :
				const confirmBox2 = window.confirm(
					"Are You Sure to Delete Your Conversation?"
				  )
				  if (confirmBox2 === true) {
					
					deleteConversation();
				  }
				

			break;
		}
	  };

	  const handleCloseMenu = () => {
		setAnchorElUser(null)
		
	  };
	 
	

	return (
		
			<>{veiw ?
			
				<div className={styles.chat_container}>
					<div style={{display:"flex"}}>
					<Avatar sx={{height:"50px", width:"50px"}} src={user.profile ? user.profile : DefaultPic} />
					<div className={styles.chatInfo}>
					<h2>{user.userName}</h2>
					</div>
					</div>
					<div className={styles.setting}>
									<Tooltip title="More">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<MoreVertIcon/>
							</IconButton>
							</Tooltip>
							<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseMenu}
							> 
							{settings.map((setting)=>(

								<MenuItem key={setting}  onClick={handleCloseUserMenu}>
								<Typography textAlign="center" id={setting}>{setting}</Typography>
								</MenuItem>
							))} 
							
							</Menu>
					</div>
				</div>:null}
				
			
				</>
			
			
	);
};

export default ChatList;
