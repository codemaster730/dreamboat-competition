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
  Modal,
  Col,
  ModalFooter,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import DropdownScrollNavbar from "../shared/DropdownScrollNavbar.js";
class TicketList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      tickets: [],
      spotball: null,
      winner:{},
      selectedItem: null,
      modalView: false,
      zoomRatio: 4,
    }
  }

  componentWillMount(){
    

  }
  componentDidMount() {
    this.getTicketList();
    document.body.classList.add("ticket-pay-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    
  }

  updateWindowDimensions = () =>{
    //alert("update");
    this.winWidth= window.innerWidth;
    this.winHeight= window.innerHeight;
    var eleBack = document.getElementsByClassName("spotBack1")[0];
    var eleCont = document.getElementsByClassName("spotContainer")[0];
    var eleMark = document.getElementsByClassName("markSVG")[0];
    var eleImg = document.getElementsByClassName("markImg")[0];
    if(eleBack){
      eleCont.style.height = (eleCont.clientWidth*3/4) + "px";
      eleBack.style.height = (eleBack.clientWidth*3/4) + "px";
      eleMark.style.width = (eleBack.clientWidth) + "px";
      eleMark.style.height = (eleBack.clientWidth*3/4) + "px";
      eleImg.style.width = (eleBack.clientWidth) + "px";
      eleImg.style.height = (eleBack.clientWidth*3/4) + "px";
      if(eleBack.clientWidth>0){
        this.setState({zoomRatio: this.state.spotball.width/eleBack.clientWidth});
      }
    }
  }


  getTicketList() {
    axios
      .post('/api/ticketadmin/ticketlist', {})
    .then((res) => {
      console.log("!!!!!!!!!",res.data);
      var maxPrize = 100000000;
      var winner= {};
      var tickets = res.data.tickets;
      this.setState({tickets: res.data.tickets, spotball:res.data.spotball[0]});
      var goals =100000000;
      tickets.map((ticket)=>{
        var marks =0;
        ticket.data.map((data)=>{
          var gCnt = 0;
          var posX = this.state.spotball.goalCoordX;
          var posY = this.state.spotball.goalCoordY;
          for (let i=0; i<data.tickets.length; i++){
              if((data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY) <this.state.spotball.goalRadius*this.state.spotball.goalRadius){
                gCnt++;
              }
              if((data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY) <goals){
                goals = (data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY);
              }
          }
          marks += gCnt* data.boat[0].prizePrice;
          return data;
        })
        if(marks>0){
          if(goals<maxPrize){
            winner = ticket;
            maxPrize = goals;
          }
        }
        return ticket;
      })
      this.setState({winner: winner});
      
    }).catch((err) => {
      console.log(err);
    });
  }

  editTicket(ticket) {
    this.setState({modalView: true, selectedItem: ticket},()=>{
      
    });
    var _this = this;
    setTimeout(
      function(){
        _this.updateWindowDimensions();
      }, 1000);
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
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  renderTicketListTableData() {
    let number = 0;
    return this.state.tickets.map((ticket) => {
      number += 1;
      var total = 0;
      // var goals =0;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left ">{ticket.user[0].email} </td>
          <td className="text-left mobile-collapse">
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
            Total Price:£{total}
          </td>
          {/* <td className="text-left">
            {
              
              ticket.data.map((data,key)=>{
                
                var gCnt = 0;
                var posX = this.state.spotball.goalCoordX;
                var posY = this.state.spotball.goalCoordY;
                for (let i=0; i<data.tickets.length; i++){
                    if((data.tickets[i].coordX - posX)*(data.tickets[i].coordX - posX)+ (data.tickets[i].coordY - posY)*(data.tickets[i].coordY - posY) <diameter){
                      gCnt++;
                    }
                }
                goals += gCnt* data.boat[0].prizePrice;
                return (
                  <div>
                     <button className="mr-1 badge badge-default">#{key+1}-tickets: {gCnt} prize price:{data.boat[0].prizePrice}</button>
                  </div>
                )
              })
            }
            Total Prize Price:{goals}
          </td> */}
          
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
    var eleBack = document.getElementsByClassName("markImg")[0];
    if(eleBack){
      //eleBack.style.width = this.winWidth+ + "px";
      //eleBack.style.height = this.winHeight + "px";
      console.log("dDDDD",eleBack);
      //alert(eleBack.offsetWidth);
    }
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
                    <span class="lr-1 badge badge-primary">{this.state.winner.user===undefined?"Not Found":this.state.winner.user[0].email}</span>
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
                              {/* <th className="text-left">Goals</th> */}
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

          <div>
              <Modal
                isOpen={this.state.modalView}
                toggle={() => {
                  this.setState({modalView: !this.state.modalView})
                }}
              >
                <div className="modal-header">
                  <button
                    aria-hidden={true}
                    className="close"
                    onClick={() => {
                      this.setState({modalView: false});
                    }}
                    type="button"
                  >
                    <i className="now-ui-icons ui-1_simple-remove"></i>
                  </button>
                  <h4 className="title title-up">Tickets Position View</h4>
                  
                </div>
                <div className="modal-body">
                <h6 >User: {(this.state.selectedItem!==null)?this.state.selectedItem.user[0].email:""}</h6>
                  <Row >
                    <Col className="spotContainer">
                      <div className="spotBack1">
                        <svg className="markSVG" version="1.1" style={{ position:'absolute'}}>                                    
                            {
                              (this.state.selectedItem!==null)?
                                this.state.selectedItem.data.map(item => {
                                    return item.tickets.map(tItem => {
                                        if (tItem.coordX === null || tItem.coordY === null) {
                                            return null;
                                        }
                                        let plus_size = 5;
                                        let cur_x = tItem.coordX/this.state.zoomRatio;
                                        let cur_y = tItem.coordY/this.state.zoomRatio;
                                        return (
                                            <path
                                                d={"M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)}
                                                id={"t"+tItem._id}
                                                stroke="white"
                                                strokeWidth={2}
                                                className="plus_mark"
                                                fill="none"
                                                style={{left: '50%'}}
                                            />
                                        );
                                    });
                                })
                              :""
                            }
                            {
                              (this.state.selectedItem!==null)?(
                                <circle cx={this.state.spotball.goalCoordX/this.state.zoomRatio} cy={this.state.spotball.goalCoordY/this.state.zoomRatio} r={this.state.spotball.goalRadius/this.state.zoomRatio} fill="yellow" opacity="0.3" />  
                              ):""
                            }
                        </svg>
                        <img className="markImg" src={((this.state.spotball!==null)?this.state.spotball.image:"")} alt={((this.state.spotball!==null)?this.state.spotball.title:"")}></img>
                      </div>
                    </Col>
                  </Row>
                </div>
                <ModalFooter>
                  <Button color="danger" onClick={() => {
                    this.setState({modalView: false});
                  }}>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
          </div>
          
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