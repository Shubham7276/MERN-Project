import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Container } from 'reactstrap';
import AddTicket from "../components/AddTicket"
import Ticketrecord from './TicketRecord';
import { getTicket } from '../store/actions/ticketAction';
 
import AuthenticationService from '../services/AuthenticationService';
import { connect } from 'react-redux';


class Profile extends Component {
 
  constructor(props) {
    super(props);
    this.state = {user: undefined};
    this.state = {tickets: undefined};
  }
  componentDidMount() {
    const user = AuthenticationService.getCurrentUser();
    this.setState({user: user});
    this.props.getTicket();
    if(!user)
    {
      this.props.history.push('/signin');
       
    }
    
  }
  

  render() {
    let userInfo = "";
    const user = this.state.user;
    // login
    if (this.state.user) {

      userInfo = (
        <>
        <h1>Ticket Dashboard</h1>
       
                <div style={{marginTop:"20px"}}>      
                      <AddTicket user={user}/>
                      <Ticketrecord user={user}/>
                </div>
                </>
              );
            } else { 
             
    }

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
        {userInfo}
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state){
  return{
    tickets:state.tickets,
  };
}

export default connect(mapStateToProps,{getTicket}) (Profile);
