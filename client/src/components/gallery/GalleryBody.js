import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  Container, 
  Row,
  Modal,
  ModalFooter,
  Button,
  Badge,
  Col,
  Card,
  CardHeader,
  NavItem,
  NavLink,
  Nav,
  CardBody,
  TabContent,
  TabPane,
  ButtonGroup,
  Table
} from "reactstrap";

import Boat from 'components/gallery/Boat.js';
import Carousel from 'components/gallery/Carousel.js';

class GalleryBody extends Component {

  constructor (props) {
    super(props);
    this.state = {
      boats: [],
      selectedBoat: {},
      tabs: "1",
      ticketsAdded: 1,
      cartItems: [],
      cartModal: false,
      boatInfoModal: false
    }
  }

  loadData() {
    // Load Boats
    axios
      .get('/api/boats/boats')
      .then((res) => {
        if (res.data.success === true) {
          this.setState({
            boats: res.data.boats
          });
        } else {
          console.log(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });

    // Load Cart Items
    if (this.props.auth.isAuthenticated) {
      this.getCartTickets();
    } 
  }
  
  getCartTickets() {
    axios
    .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({cartItems: res.data});
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCartOpened) {
      this.setState({
        isCartOpened: nextProps.isCartOpened
      });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {

  }

  onClickBoat = (boat) => {
    this.setState({boatInfoModal: true, selectedBoat: boat});
  }

  handleReduceTickets() {
    if (this.state.ticketsAdded > 1)
      this.setState({ticketsAdded: this.state.ticketsAdded -1});
  }

  updateTicketsInCart(cartItemId, isRemove) {
    if (isRemove) {
      axios
      .post("/api/carts/removeCartTicket", {cartItemId: cartItemId})
      .then(res => {
        toast(res.data.message);
        this.getCartTickets();
        this.props.getTotalTicketCount();
      }).catch(err => {
        console.log(err);
      });
    } else {
      axios
      .post("/api/carts/addCartTicket", {cartItemId: cartItemId})
      .then(res => {
        toast(res.data.message);
        this.getCartTickets();
        this.props.getTotalTicketCount();
      }).catch(err => {
        console.log(err);
      });
    }
  }

  removeCartItem(cartItemId) {
    axios
    .post("/api/carts/removeCartItem", {cartItemId: cartItemId})
    .then(res => {
      axios
        .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
        .then((res) => {
          toast(res.data.message);
          this.setState({cartItems: res.data});
          this.props.getTotalTicketCount();
        }).catch((err) => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
  }

  addTicketsToCart() {
    let tempCartItem = {
      ticketsAdded: this.state.ticketsAdded,
      userId: this.props.auth.isAuthenticated ? this.props.auth.user.id : '',
      boatId: this.state.selectedBoat._id
    };    
    if (this.props.auth.isAuthenticated) { // If logged in, call api and add tickets
      axios
      .post("/api/carts/addCartTickets", tempCartItem)
      .then(res => {
        toast(res.data.message);
        this.setState({boatInfoModal: false, cartModal: true, ticketsAdded:1});
        this.setState({cartItems: res.data.items});
        this.props.getTotalTicketCount();
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      this.props.redirectToLogin();
    }
  }

  renderCartTableData() {
    return this.state.cartItems.map((item) => {
      const {_id, thumnailUri, manufacturer, model, ticketCount, ticketPrice} = item;
      return (
        <tr key={_id}>
          <td>
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
          <td className="td-number">{ticketCount}
            <div role="group" className="btn-group">
              <button className="btn btn-info btn-sm" onClick={() => this.updateTicketsInCart(_id, true)}>
                <i className="now-ui-icons ui-1_simple-delete"></i>
              </button>
              <button className="btn btn-info btn-sm">
                <i className="now-ui-icons ui-1_simple-add" onClick={() => this.updateTicketsInCart(_id, false)}></i>
              </button>
            </div>
          </td>
          <td className="td-number">
            <small>£</small>
            {ticketCount * ticketPrice}
          </td>
          <td className="td-actions">
            <Button
              color="neutral"
              type="button"
              onClick={() => this.removeCartItem(_id)}
            >
              <i className="now-ui-icons ui-1_simple-delete"></i>
            </Button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <>
        <ToastContainer />
        <div className="section section-sections" data-background-color="white">
          <Container>
            { this.state.boats.length > 0 ?
                <div className="section-cols">
                  <Row>
                    {this.state.boats.map(boat => (
                      <Boat boat={boat} handleClickBoat={this.onClickBoat} />
                    ))}
                  </Row>
                </div>
              : 
                <p className="text-primary">No Boats Found</p>
            }
          </Container>
          <Modal
            className="boatModal"
            isOpen={this.state.boatInfoModal}
            toggle={() => this.setState({boatInfoModal: false, ticketsAdded: 1})}
          >
            <div className="modal-header justify-content-center">
              <div className="title-boat">{this.state.selectedBoat.manufacturer}-{this.state.selectedBoat.model}</div>
              <button
                aria-hidden={true}
                className="close"
                onClick={() => this.setState({boatInfoModal: false, ticketsAdded: 1})}
                type="button"
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </button>
            </div>
            <div className="modal-body">
              <Row>
                <Col md="6" xs="12">
                  <Carousel boat={this.state.selectedBoat}/>
                </Col>
                <Col md="6" xs="12">
                  <Card>
                    <CardHeader>
                      <Nav className="justify-content-center" role="tablist" tabs>
                        <NavItem>
                          <NavLink
                            className={this.state.tabs === "1" ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({tabs: "1"});
                            }}
                          >
                            Details
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={this.state.tabs === "2" ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({tabs:"2"});
                            }}
                          >
                            Description
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </CardHeader>
                    <CardBody>
                      <TabContent className="text-center" activeTab={"tabs" + this.state.tabs}>
                        <TabPane tabId="tabs1">
                          <Col className="details">
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Category </Badge></div><div>{this.state.selectedBoat.category}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Manufacturer</Badge></div><div>{this.state.selectedBoat.manufacturer}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Model</Badge></div><div>{this.state.selectedBoat.model}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Ticket</Badge></div><div>£{this.state.selectedBoat.ticketPrice}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Price</Badge></div><div>£{this.state.selectedBoat.prizePrice}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Length</Badge></div><div>{this.state.selectedBoat.length}</div></Row>
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Width</Badge></div><div>{this.state.selectedBoat.width}</div></Row>
                          </Col>
                        </TabPane>
                        <TabPane tabId="tabs2">
                          <p>{this.state.selectedBoat.description}</p>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
            <ModalFooter>
              <Row>
                <ButtonGroup className="ml-2 mr-2">
                  <Button id="delete" color="info" size="sm" onClick={() => this.handleReduceTickets()}>
                    <i className="now-ui-icons ui-1_simple-delete"></i>
                  </Button>
                  <Button id="add" color="info" size="sm" onClick={() => this.setState({ticketsAdded: this.state.ticketsAdded + 1})}>
                    <i className="now-ui-icons ui-1_simple-add"></i>
                  </Button>
                </ButtonGroup>
                <div className="ticket-number">{this.state.ticketsAdded}</div>
              </Row>
              <Button className="btn-add-cart" color="primary" onClick={() => this.addTicketsToCart()}>
                Add to Cart
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            className="modal-cart"
            isOpen={this.state.cartModal || (this.props.isCartOpened && this.state.cartItems.length > 0)}
            toggle={() => {this.props.updateCartOpenStatus(false); this.setState({cartModal: false})}}
          >
            <div className="modal-header justify-content-center">
              <div className="title-boat">CART</div>
              <button
                aria-hidden={true}
                className="close"
                onClick={() => {this.props.updateCartOpenStatus(false); this.setState({cartModal: false})}}
                type="button"
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </button>
            </div>
            <div className="modal-body">
              <Row>
                <Table className="table-cart" responsive>
                  <tbody>
                    {
                      this.renderCartTableData()
                    }
                  </tbody>
                </Table>
              </Row>
            </div>
            <ModalFooter>
              <Button 
                onClick={() => this.props.onClickToPlay()}
                className="btn-add-cart" 
                color="primary">
                Proceed To Play
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </>
    );
  }
}

GalleryBody.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps
)(GalleryBody);
