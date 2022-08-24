import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import { Button,TextField, Dialog, DialogActions, DialogContent , DialogTitle, Box, Select,MenuItem} from '@mui/material';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateTicket, deletTicket} from '../store/actions/ticketAction'
import AuthenticationService from '../services/AuthenticationService';
import ReactPaginate from 'react-paginate';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete'
import SearchIcon from '@mui/icons-material/Search';


const useStyles = makeStyles({
  
});

const TableHeaderCell = withStyles((theme) => ({
  root: { 
    fontWeight:"bold"
  }
}))(TableCell);

export default function BasicTable(props) {

  const dispatch = useDispatch();
  const tickets = useSelector((tickets)=> tickets.ticket);
  

  const {firstname,lastname,email}=props.user;
  const [open, setOpen] = useState(false); //dialogbox state
  const [newDesc,setNewdesc]=useState(""); // update
  const [newUpdateTicket,setNewupdateTicket] = useState("");  // update ticket state
  const [serchField,setSerchField]=useState("Uname"); //search field state
  const {_id,desc} = newUpdateTicket;
  const isDelete=true;

  //state for pagnation
   const [currentItems,setCurrentItems]=useState();
  const [pageCount,setPageCount]=useState(0);
  const [iteamOffset,setIteamOffset]=useState(0);
  
  // Searching Filter
  const[searchItem, setSearchItem]=useState("");
  

  //for current date
  const date=new Date();
  const D=date.getDate();
  const M=1+date.getMonth();
  const Y=date.getFullYear();
  const time=date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const Day=D.toString()+"/"+M.toString()+"/"+Y.toString()+"  "+time.toString();


  //Use Effect

  useEffect(() => {
    
      //pagination
      const endOffset = iteamOffset + 10;

      //Search
      setCurrentItems(tickets.slice(iteamOffset, endOffset));
        setPageCount(Math.ceil(tickets.length / 10));
      if(searchItem===""){
        
      }
      else{
          const data= tickets.filter((ticket)=>{
            if(searchItem===""){
               return ticket
              }else if(ticket[serchField].toLowerCase().includes(searchItem.toLowerCase())){
                  return ticket
              }
            
           
          })
          setCurrentItems(data.slice(iteamOffset, endOffset));
          setPageCount(Math.ceil(data.length / 10));
      }
  },[ iteamOffset, tickets, searchItem]);
  

  //ticket fatch by id
  const handleClickOpen = async(_id) => {
    const {data} = await AuthenticationService.getTicketbyId(_id)
    setNewupdateTicket(data)
    setOpen(true);
  };


  //update ticket

  const updateticket=(_id)=>{
    if(newDesc===desc || newDesc===""){alert("Ticket Not update")}
    else{dispatch(updateTicket(_id,Day,newDesc))}
    setNewdesc("")
    setOpen(false);
  }

  //delete ticket

  const daleteticket=(_id)=>{
    const confirmBox = window.confirm(
      "Are You Sure to Delete this ticket?"
    )
    if (confirmBox === true) {
      
      dispatch(deletTicket(_id,Day,isDelete))
    }
  }

  //for pagnation code

  const handlePageClick=(event)=>{
    const newOffset =(event.selected*10)%tickets.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setIteamOffset(newOffset);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const classes = useStyles();

  return (
    <>
    <hr/>
    <div>
    {/* serach dropdown */}

    <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={serchField}
    
    label="Search"
    sx={{ width: 300, marginLeft: "150px" }}
    onChange={(e)=>{setSerchField(e.target.value);setSearchItem('')}}
  >
            <MenuItem value="Uname">Name</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
            <MenuItem value="CreatedDate">Create Date</MenuItem>
            <MenuItem value="UpdateDate">Update Date</MenuItem>
            <MenuItem value="DeleteDate">Delete Date</MenuItem>
        </Select>

    <TextField label="Search by field" 
    id="outlined-basic" 
    sx={{ width: 550 ,marginLeft: "100px"}}  
    variant="outlined" 
    value={searchItem} 
    
    onChange={(e)=>{setSearchItem(e.target.value)}}
    />
    <SearchIcon sx={{marginLeft:"10px"}}/>
    
    </div>
    <hr/>
    
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, backgroundColor:"#C8E3D4" }} className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          
            <TableHeaderCell align="center">Ticket No</TableHeaderCell>
            <TableHeaderCell align="center">Name</TableHeaderCell>
            <TableHeaderCell align="center">Desc</TableHeaderCell>
            <TableHeaderCell align="center">Create At</TableHeaderCell>
            <TableHeaderCell align="center">Update At</TableHeaderCell>
            <TableHeaderCell align="center">Delete At</TableHeaderCell>
            <TableHeaderCell align="center">Update</TableHeaderCell>
            <TableHeaderCell align="center">Delete</TableHeaderCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {currentItems?.map((ticket, index) => (
            <TableRow key={ticket._id} style={{backgroundColor: ticket.isDelete ? '#79B4B7' : '#fff'}}>
              
              <TableCell align="center">{index+1}</TableCell>
              <TableCell align="center">{ticket.Uname}</TableCell>
              <TableCell align="center">{ticket.desc}</TableCell>
              <TableCell align="center">{ticket.CreatedDate}</TableCell>
              <TableCell align="center">{ticket.UpdateDate}</TableCell>
              <TableCell align="center">{ticket.DeleteDate}</TableCell>
              <TableCell align="center"><Button disabled={ticket.isDelete}  variant="contained" color="primary" onClick={()=>{handleClickOpen(ticket._id)}} style={{display:ticket.Email===email?"block":"none" }}> <EditIcon/></Button></TableCell>
              
             
              <TableCell align="center"><Button disabled={ticket.isDelete}  variant="contained" color="error" onClick={()=>{daleteticket(ticket._id)}} style={{display:ticket.Email===email?"block":"none" }}> <DeleteIcon/></Button></TableCell>
            </TableRow>
            
          ))}
          
        </TableBody>
      </Table>
    </TableContainer>


          {/* update Popup  */}
      <div>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        <div style={{ display: 'flex' , justifyContent:'space-between'}}>
                    
                    <h4>Update Ticket</h4>
                    <Button
                      variant="contained" color="error"
                        
                        onClick={()=>{setOpen(false)}}>
                        X
                    </Button>
                </div>
        </DialogTitle>
        <DialogContent dividers>
          <Box
          
            sx={{
              width: 500,
              maxWidth: '100%',
              marginBottom: '10px'
            }}
      >
        <TextField
           hidden
          defaultValue={_id}
          
      />
      
      <TextField sx={{marginBottom:'10px'}}
          disabled
          fullWidth={true}
          id="outlined-disabled"
          label="Creator Name"
          defaultValue={firstname+""+lastname}
        />

      
        <TextField
          disabled
          fullWidth={true}
          id="outlined-disabled"
          label="Data"
          defaultValue={Day}
        /> 
        </Box>
        <TextField
          id="decs"
          label="Discription"
          fullWidth={true}
          multiline
          helperText="50/100"
          rows={4} 
          defaultValue={desc}
          onChange={(e)=>setNewdesc(e.target.value)}    
        /> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>{updateticket(_id)}}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
    <ReactPaginate 
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={3}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
        renderOnZeroPageCount={null}
      />
    </>
  );
}

