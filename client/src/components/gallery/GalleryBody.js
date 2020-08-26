import React, { Component } from "react";
import axios from "axios";

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
      boatInfoModal: false,
      cartModal: false,
      selectedBoat: {},
      tabs: "1",
      selectedTicketNumber: 1,
      tempCartItems: [],
      isCartOpened: false
    }
  }

  loadBoatsData() {
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

    if (nextProps.isCartOpened) {
      this.setState({
        isCartOpened: nextProps.isCartOpened
      });
    }
  }

  componentDidMount() {
    this.loadBoatsData();
  }

  componentWillUnmount() {

  }

  onClickBoat = (boat) => {
    this.setState({boatInfoModal: true, selectedBoat: boat});
  }


  handleReduceTickets() {
    if (this.state.selectedTicketNumber > 1)
      this.setState({selectedTicketNumber: this.state.selectedTicketNumber -1});
  }

  updateTicketsInCart(cartItemId, ticketNum, add) {
    if (add) ticketNum = ticketNum + 1;
    else {
      if (ticketNum > 1) ticketNum = ticketNum - 1;
    }
    this.setState(state => {
      const list = state.tempCartItems.map(item => {
        if (item._id === cartItemId)
          item.ticketNumber = ticketNum;
        return item;
      });
      return {list}
    })
  }

  removeBoatFromCart(itemId) {
    this.setState(state => {
      const list = state.tempCartItems.filter((item) => itemId !== item.id);
      return {
        list
      };
    });
    console.log(this.state.tempCartItems);
  }

  addBoatToCart() {
    let cartItem = {
      ...this.state.selectedBoat,
      ticketNumber: this.state.selectedTicketNumber
    };
    this.setState({boatInfoModal: false, cartModal: true, selectedTicketNumber:1});

    if (this.state.tempCartItems.length > 0) {
      let isFound = false;
      this.state.tempCartItems.forEach(item => {
        if (item._id === cartItem._id) {
          item.ticketNumber += cartItem.ticketNumber;  
          isFound = true;        
        } 
      });
      if (!isFound) 
        this.state.tempCartItems.push(cartItem);
    } else {
      this.state.tempCartItems.push(cartItem);
    }
  }

  renderCartTableData() {
    return this.state.tempCartItems.map((item) => {
      const {_id, images, manufacturer, model, ticketNumber, ticketPrice} = item;
      return (
        <tr key={_id}>
          <td>
            <div className="img-container">
              <img
                alt="..."
                src={images[0]}
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
          <td className="td-number">{ticketNumber}
            <div role="group" className="btn-group">
              <button className="btn btn-info btn-sm" onClick={() => this.updateTicketsInCart(_id, ticketNumber, false)}>
                <i className="now-ui-icons ui-1_simple-delete"></i>
              </button>
              <button className="btn btn-info btn-sm">
                <i className="now-ui-icons ui-1_simple-add" onClick={() => this.updateTicketsInCart(_id, ticketNumber, true)}></i>
              </button>
            </div>
          </td>
          <td className="td-number">
            <small>£</small>
            {ticketNumber * ticketPrice}
          </td>
          <td className="td-actions">
            <Button
              color="neutral"
              type="button"
              onClick={() => this.removeBoatFromCart(_id)}
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
            toggle={() => this.setState({boatInfoModal: false, selectedTicketNumber: 1})}
          >
            <div className="modal-header justify-content-center">
              <div className="title-boat">{this.state.selectedBoat.manufacturer}-{this.state.selectedBoat.model}</div>
              <button
                aria-hidden={true}
                className="close"
                onClick={() => this.setState({boatInfoModal: false, selectedTicketNumber: 1})}
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
                            <Row><div className="mr-1 col-6 detail-item"><Badge color="info">Price</Badge></div><div>£{this.state.selectedBoat.price}</div></Row>
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
                  <Button id="add" color="info" size="sm" onClick={() => this.setState({selectedTicketNumber: this.state.selectedTicketNumber + 1})}>
                    <i className="now-ui-icons ui-1_simple-add"></i>
                  </Button>
                </ButtonGroup>
                <div className="ticket-number">{this.state.selectedTicketNumber}</div>
              </Row>
              <Button className="btn-add-cart" color="primary" onClick={() => this.addBoatToCart()}>
                Add to Cart
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            className="modal-cart"
            isOpen={this.state.cartModal || this.state.isCartOpened}
            toggle={() => this.setState({cartModal: false, isCartOpened: false})}
          >
            <div className="modal-header justify-content-center">
              <div className="title-boat">CART</div>
              <button
                aria-hidden={true}
                className="close"
                onClick={() => this.setState({cartModal: false, isCartOpened: false})}
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
              <Button className="btn-add-cart" color="primary">
                Proceed To Play
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </>
    );
  }
}

export default GalleryBody;

