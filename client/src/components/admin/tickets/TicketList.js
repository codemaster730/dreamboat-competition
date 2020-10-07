import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// reactstrap components
import {
  Row,
  Card,
  CardBody,
  Table,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import DropdownScrollNavbar from "../shared/DropdownScrollNavbar.js";

class TicketList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      tickets: [],
      spotball: {},
      winner:{},
    }
  }

  componentWillMount(){
    

  }
  componentDidMount() {
    document.body.classList.add("ticket-pay-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    this.getTicketList();
  }


  getTicketList() {
    axios
      .post('/api/ticketadmin/ticketlist', {})
    .then((res) => {
      var maxPrize = 0;
      var winner= {};
      var tickets = res.data.tickets;
      this.setState({tickets: res.data.tickets, spotball:res.data.spotball[0]});
      tickets.map((ticket)=>{
        var goals =0;
        ticket.data.map((data)=>{
          var gCnt = 0;
          var posX = this.state.spotball.goalCoordX;
          var posY = this.state.spotball.goalCoordY;
          for (let i=0; i<data.tickets.length; i++){
              if((data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY) <10000){
                gCnt++;
              }
          }
          goals += gCnt* data.boat[0].prizePrice;
          return data;
        })
        if(goals>maxPrize){
          winner = ticket;
          maxPrize = goals;
          
        }
        return ticket;
      })
      this.setState({winner: winner});
      
    }).catch((err) => {
      console.log(err);
    });
  }

  editTicket(ticket) {
    ticket.active = (ticket.active+1) % 3;
    axios
      .put(`/api/ticketadmin/ticket/${ticket._id}`, {ticket: ticket})
      .then((res) => {
        this.getTicketList();
      }).catch((err) => {
        console.log(err);
      });
  }

  removeTicket(ticket) {
    axios
    .delete(`/api/ticketadmin/ticket/${ticket._id}`)
    .then((res) => {
      toast.info(res.data.message);
      this.getTicketList();
    }).catch((err) => {
      console.log(err);
    });
  }
  clearTickets=()=>{
    axios
    .post(`/api/ticketadmin/ticket/clear`)
    .then((res) => {
      toast.info(res.data.message);
      this.getTicketList();
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("ticket-pay-page");
    document.body.classList.remove("sidebar-collapse");
  }

  renderTicketListTableData() {
    let number = 0;
    return this.state.tickets.map((ticket) => {
      number += 1;
      var total = 0;
      var goals =0;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left mobile-collapse">{ticket.user[0].email} </td>
          <td className="text-left">
            {
              ticket.data.map((data,key)=>{
                total += data.tickets.length* data.boat[0].ticketPrice;
                return (
                  <div>
                    {/* <img src={data.boat[0].images[0]} style={{width:'100px', height:'80px' }} alt={"akt"} >
                    </img> */}
                     <button className="mr-1 badge badge-default">#{key+1}-tickets: {data.tickets.length} ticket price:{data.boat[0].ticketPrice}</button>
                  </div>
                )
              })
            }
            Total Price:{total}
          </td>
          <td className="text-left">
            {
              
              ticket.data.map((data,key)=>{
                
                var gCnt = 0;
                var posX = this.state.spotball.goalCoordX;
                var posY = this.state.spotball.goalCoordY;
                for (let i=0; i<data.tickets.length; i++){
                    if((data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY) <10000){
                      gCnt++;
                    }
                }
                goals += gCnt* data.boat[0].prizePrice;
                return (
                  <div>
                    {/* <img src={data.boat[0].images[0]} style={{width:'100px', height:'80px' }} alt={"akt"} >
                    </img> */}
                     <button className="mr-1 badge badge-default">#{key+1}-tickets: {gCnt} prize price:{data.boat[0].prizePrice}</button>
                  </div>
                )
              })
            }
            Total Prize Price:{goals}
          </td>
          
          <td className="text-right">
            <>
              <Button
                id="edit-ticket"
                className="mr-1"
                color="success"
                size="sm"
                type="button"
                onClick={() => this.editTicket(ticket)}
              >
                <i className="now-ui-icons ui-2_settings-90"></i>
              </Button>
              <UncontrolledTooltip
                  delay={100}
                  placement="top"
                  target="edit-ticket"
                >
                  View Detail
              </UncontrolledTooltip>
            </>
          </td>
          <td className="text-right">
            <>
              <Button
                id="delete-ticket"
                className="btn-icon"
                color="danger"
                size="sm"
                type="button"
                onClick={() => this.removeTicket(ticket)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </Button>
              <UncontrolledTooltip
                  delay={100}
                  placement="top"
                  target="delete-ticket"
                >
                  Delete Ticket
              </UncontrolledTooltip>
            </>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <>
        <DropdownScrollNavbar/>
        
        <div className="wrapper">
          <div className="home">
            <div className="panel">
              <Row>
                <div className="mr-auto ml-auto col-md-8" style={{textAlign: 'center'}}>
                  <p style={{ marginTop:'50px' }} />
                  <h3 className="title">Ticket Management</h3>           
                </div>
              </Row>
              <Row>
                  <div className="mr-auto ml-auto col-md-8" style={{textAlign: 'center'}}>
                  <h5 className="title">Potential Winner:</h5>
                    <span class="lr-1 badge badge-primary">{this.state.winner.user===undefined?"":this.state.winner.user[0].email}</span>
                  </div>
              </Row>
              <Row>
                <div className="mr-auto ml-auto col-md-8">
                  <Card className="card-plain mt-2 table-card">
                  <Button className="btn-cpp" type="button" onClick={()=>this.clearTickets()}>
                        Clear Tickets
                      </Button>
                    <CardBody>
                      {this.state.tickets.length > 0 ?
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left mobile-collapse">User</th>
                              <th className="text-left">Tickets</th>
                              <th className="text-left">Goals</th>
                              <th className="text-left mobile-collapse">Tickets</th>
                              {/* <th className="text-left">Active</th> */}
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.renderTicketListTableData()
                            }
                          </tbody>
                        </Table>
                        :
                        <h4>No TicketList Found</h4>
                      }
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </div>
          </div>
          <ToastContainer />

        </div>
      </>
    );
  }
}

TicketList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(TicketList);