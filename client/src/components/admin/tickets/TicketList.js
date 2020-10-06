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
  UncontrolledTooltip, Label
} from "reactstrap";

// core components
import DropdownScrollNavbar from "../shared/DropdownScrollNavbar.js";

class TicketList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      tickets: [],
    }
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
      this.setState({tickets: res.data.tickets});
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

  componentWillUnmount() {
    document.body.classList.remove("ticket-pay-page");
    document.body.classList.remove("sidebar-collapse");
  }

  renderTicketListTableData() {
    let number = 0;
    return this.state.tickets.map((ticket) => {
      number += 1;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left mobile-collapse">{ticket.userId[0].email}</td>
          <td className="text-left">
            <img src={ticket.thumnailUri} style={{width:'100px', height:'80px' }} alt={ticket.model} ></img>
          </td>
          <td className="text-left mobile-collapse">{ticket.ticketCount}</td>
          <td className="text-left mobile-collapse">{ticket.ticketPrice}</td>
          <td className="text-left mobile-collapse">
            {/* {ticket.tickets.map((ticket)=>{
              return "("+ticket.coordX+","+ticket.coordY+") ";
            })
            } */}
          </td>
          {/* <td className="text-right">
            <>
              <span style={{ display: 'none' }}>{ticket.active?"actived":"deactived"}</span>
              <Button
                id="edit-ticket"
                className="mr-1"
                color={ticket.active===0?"secondary":
                          ticket.active===1?"success":
                            "danger"}
                size="sm"
                style={{ width:'130px' }}
                type="button"
                onClick={() => this.editTicket(ticket)}
              >
                <i className="now-ui-icons ui-2_settings-90"></i>
                {ticket.active===0?"deactive":
                          ticket.active===1?"active":
                            "deleted"}
              </Button>
              <UncontrolledTooltip
                  delay={100}
                  placement="top"
                  target="edit-ticket"
                >
                  Toggle Ticket Active
              </UncontrolledTooltip>
            </>
          </td> */}
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
                  <Label> Active or Delete Ticket</Label>
                </div>
              </Row>
              <Row>
                <div className="mr-auto ml-auto col-md-8">

                  <Card className="card-plain mt-2 table-card">
                    <CardBody>
                      {this.state.tickets.length > 0 ?
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left mobile-collapse">User eMail</th>
                              <th className="text-left">Boat Image</th>
                              <th className="text-left mobile-collapse">Ticket Count</th>
                              <th className="text-left mobile-collapse">Ticket Price</th>
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