import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import CheckoutHeader from './CheckoutHeader';

import PaypalButton from "./PaypalButton";

// reactstrap components
import {
  Container,
  Row,
  Col, 
  CardBody,
  Card, CardFooter, Button, Table
} from "reactstrap";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      cartOpen: false,
      cartStatus: '',
      collapses: [-1],
      paid: false,
    }
  }

  componentDidMount() {
    document.body.classList.add("checkout-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.getCartTickets();
  }

  componentWillUnmount() {
    document.body.classList.remove("checkout-page");
    document.body.classList.remove("sidebar-collapse");
  }

  changeCollapse = (collapse) => {
    if (this.state.collapses.includes(collapse)) {
      this.setState({collapses: this.state.collapses.filter((prop) => prop !== collapse)});
    } else {
      this.setState({collapses: [...this.state.collapses, collapse]})
    }
  };

  getCartTickets() {
    axios
    .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({cartItems: res.data});
    }).catch((err) => {
      console.log(err);
    });
  }

  removeCartItems() {
    let requests = [];
    this.state.cartItems.forEach((cartItem) => {
      requests.push(
        axios
        .post("/api/carts/removeCartItem", {cartItemId: cartItem._id})
      )
    });
    axios.all(requests).then(axios.spread((...responses) => {
      this.props.getTotalTicketCount();
    })).catch((errors) => {
      console.log(errors);
    });
  }
  
  removeCartItem(cartItemId) {
    axios
    .post("/api/carts/removeCartItem", {cartItemId: cartItemId})
    .then(res => {
      axios
        .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
        .then((res) => {
          toast.info(res.data.message);
          this.setState({cartItems: res.data});
          this.props.getTotalTicketCount();
        }).catch((err) => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
  }

  removeTicket(cartItemId, ticketId) {
    axios
      .post('/api/carts/removeCartTicket', {cartItemId: cartItemId, ticketId: ticketId})
      .then((res) => {
        this.getCartTickets();
        this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
      }).catch((err) => {
        console.log(err);
      });   
  }

  updateCartStatus = (status = '', cartOpen) => {
    console.log(status, cartOpen);
    this.setState({cartStatus: status, cartOpen: cartOpen});
  } 

  calculateTotalTickets() {
    const total = _.sumBy(this.state.cartItems, (item) => { return item.ticketCount * item.ticketPrice;});
    return _.floor(total, 2);
  }

  acceptedPayment = (paymentData) => {
    console.log("Payment Approved: ", paymentData);
    this.setState({paid: true});
    const candidate = {
      userId: this.props.auth.user.id,
      paypalPayerId: paymentData.payerID,
      paypalOrderId: paymentData.orderID,
      total: this.calculateTotalTickets(),
      items: []
    }
    this.state.cartItems.forEach((cartItem) => {
      const data = {};
      data.boatId = cartItem.boatId;
      data.tickets = cartItem.tickets;
      candidate.items.push(data); 
    });

    axios
    .post('/api/candidates', {candidate: candidate})
    .then((res) => {
      console.log(res);
      this.removeCartItems();
    }).catch((err) => {
      console.log(err);
    });
  }

  renderCartTableData() {
    return this.state.cartItems.map((item, index) => {
      const {_id, thumnailUri, manufacturer, model, ticketCount, ticketPrice} = item;
      return (
        <>
          <tr key={_id}>
            <td className="mobile">{' '}</td>
            <td className="mobile">
              <div className="img-container">
                <img
                  alt="..."
                  src={thumnailUri}
                ></img>
              </div>
            </td>
            <td className="td-name">
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                {manufacturer}
              </a>
              <br></br>
              <small>{model}</small>
            </td>
            <td className="td-number"><small>£</small>{ticketPrice}</td>
            <td className="td-number">
            {ticketCount}
            </td>
            <td className="td-number mobile">
              <small>£</small>
              {_.floor(ticketPrice * ticketCount, 2)}          
            </td>
            <td className="td-actions">
              <Button
                color="neutral"
                type="button"
                onClick={() => this.removeCartItem(_id)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </Button>
              <Button
                color="neutral"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  this.changeCollapse(index);
                }}
              >
                {this.state.collapses.includes(index) ?
                  <i className="now-ui-icons arrows-1_minimal-down"></i>
                  :
                  <i className="now-ui-icons arrows-1_minimal-up"></i>
                }
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan="7" style={{display: this.state.collapses.includes(index) ? "" : "none"}}>
              {item.tickets.map((ticket) => {
                return(
                  <Row className="ticket-row">
                    <Col xs="2">
                      <Button
                        color="neutral"
                        type="button"
                        onClick={() => this.removeTicket(item._id, ticket._id)}
                      >
                        <i className="now-ui-icons ui-1_simple-remove"></i>
                      </Button>
                    </Col>
                    <Col xs="5">{item.model}</Col>
                    <Col xs="4" className="text-right"><label>X:{ticket.coordX}_Y:{ticket.coordY}</label></Col>
                    <Col xs="1"></Col>
                  </Row>
                )
              })
              }
            </td>
          </tr>
        </>
      );
    });
  }

  render() {
      return (
      <>
        <DropdownScrollNavbar cartStatus={this.state.cartStatus} cartOpen={this.state.cartOpen} updateCartStatus={this.updateCartStatus}/>
        <ToastContainer />
        <div className="wrapper">
          <CheckoutHeader />
          <Container className="mt-4">
            <Row>
              <Col md="7">
                <Card className="card-raised form-card">
                  <CardBody>
                    <Table id="table-cart" responsive>
                      <thead>
                        <tr>
                          <th className="mobile"></th>
                          <th className="mobile text-left">Tickets</th>
                          <th>Model/Type</th>
                          <th className="text-left">Price</th>
                          <th className="text-left">Qty</th>
                          <th className="text-left mobile">Total</th>
                          <th className="text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.renderCartTableData()
                        }
                      </tbody>
                    </Table>
                  </CardBody>
                  <CardFooter>
                  </CardFooter>
                </Card>
              </Col>
              <Col md="1"></Col>
              <Col className="ml-auto mr-auto" md="4">
                <Card className="card-raised form-card">
                  <h4 className="card-summary">Summary</h4>
                  <Container className="mt-3">
                    <Row className="summary-info">
                      <p>All Tickets in Order:</p>
                      <p>1</p>
                    </Row>
                    <Row className="summary-info">
                      <p>Ticket Value:</p>
                      <p><small>£</small>{this.calculateTotalTickets()}</p>
                    </Row>
                    <Row className="summary-info">
                      <h5>Total:</h5>
                      <h5><small>£</small>{this.calculateTotalTickets()}</h5>
                   </Row>
                   {!this.state.paid &&
                    <div className="btn-row">
                      <hr />
                      <Button 
                        className="btn-info btn-checkout"
                        href="/boats"
                        target="_self"
                      >
                        Add More Tickets
                      </Button>
                      <PaypalButton totalPrice = {this.calculateTotalTickets()} acceptedPayment={this.acceptedPayment}/>
                    </div>
                   }
                  </Container>
                </Card>
              </Col>
            </Row>
            <Row>
              <div class="mr-auto ml-auto">
                {this.state.paid &&
                  (
                    <h4>
                      <p className="text-info">Congrats!</p> You just paid for tickets you played. {" "} We will contact you when eventual winner is chosen and
                      you can add more tickets to play{" "}
                      <a href="/boats" class="btn-round btn btn-info"> Add More Tickets</a>
                    </h4>
                  )
                }
              </div>
            </Row>
          </Container>
        </div>
        <FooterDefault />
      </>
    )
  }
}

Checkout.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(Checkout);
