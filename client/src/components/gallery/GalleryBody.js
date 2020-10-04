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
  ButtonGroup
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
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {
    this.loadData();
    console.log("XXXXX",this.props.auth);
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
        toast.info(res.data.message);
        this.setState({boatInfoModal: false, ticketsAdded:1});
        this.props.updateCartStatus('NeedUpdate', true);
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      this.props.redirectToLogin();
    }
  }

  render() {
    const isMobile = window.innerWidth < 768 ? true : false;
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
              <div className="title">{this.state.selectedBoat.manufacturer}-{this.state.selectedBoat.model}</div>
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
                <Col xl="6">
                  <Carousel boat={this.state.selectedBoat}/>
                </Col>
                <Col xl="6">
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
                          {!isMobile ?
                            <Col className="details">
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Category </Badge></div><div>{this.state.selectedBoat.category}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Manufacturer</Badge></div><div>{this.state.selectedBoat.manufacturer}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Model</Badge></div><div>{this.state.selectedBoat.model}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Ticket</Badge></div><div>£{this.state.selectedBoat.ticketPrice}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Price</Badge></div><div>£{this.state.selectedBoat.prizePrice}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Length</Badge></div><div>{this.state.selectedBoat.length}</div></Row>
                              <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Width</Badge></div><div>{this.state.selectedBoat.width}</div></Row>
                            </Col>
                            :
                            <Col>
                              <Col><Badge color="info">Category </Badge><div>{this.state.selectedBoat.category}</div></Col>
                              <Col><Badge color="info">Manufacturer</Badge><div>{this.state.selectedBoat.manufacturer}</div></Col>
                              <Col><Badge color="info">Model</Badge><div>{this.state.selectedBoat.model}</div></Col>
                              <Col><Badge color="info">Ticket</Badge><div>£{this.state.selectedBoat.ticketPrice}</div></Col>
                              <Col><Badge color="info">Price</Badge><div>£{this.state.selectedBoat.prizePrice}</div></Col>
                              <Col><Badge color="info">Length</Badge><div>{this.state.selectedBoat.length}</div></Col>
                              <Col><Badge color="info">Width</Badge><div>{this.state.selectedBoat.width}</div></Col>
                            </Col>
                          }
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
