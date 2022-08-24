import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import {  Container ,Row, Col } from 'reactstrap';

import seo from '../photos/seo.png'


class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div >
        <AppNavbar/>
        <Container fluid>
        <Row>
          <Col style={{marginTop:"100px"}} sm="6" md={{ size: 5, offset: 2 }}>
          <img className='home' src={seo} alt="seo" />
          </Col>

          <Col style={{marginTop:"250px", textAlign:'center'}} sm="6" md={{ size: 3, offset: 1 }}>
          <a href='/signin'><h1 style={{fontFamily:' serif'}}> Welcome To</h1>
          <h1 style={{fontFamily:' serif'}}> Ticket System</h1></a>
          </Col>
        </Row>
        </Container>
      </div>
    );
  }
}

export default Home;