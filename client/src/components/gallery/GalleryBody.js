import React, { Component } from "react";
import axios from "axios";

import { 
  Container, 
  Row,
  Modal,
  ModalFooter,
  Button,
  Badge,
  CardBody
} from "reactstrap";

import Boat from 'components/gallery/Boat.js';
import Carousel from 'components/gallery/Carousel.js';

class GalleryBody extends Component {
  constructor (props) {
    super(props);
    this.state = {
      boats: [],
      boatInfoModal: false,
      selectedBoat: {}
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

  componentDidMount() {
    this.loadBoatsData();
  }

  componentWillUnmount() {

  }

  onClickBoat = (boat) => {
    console.log(boat);
    this.setState({boatInfoModal: true, selectedBoat: boat});
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
            isOpen={this.state.boatInfoModal}
            toggle={() => this.setState({boatInfoModal: false})}
          >
            <div className="modal-header justify-content-center">
              <button
                aria-hidden={true}
                className="close"
                onClick={() => this.setState({boatInfoModal: false})}
                type="button"
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </button>
              <h4 className="title title-up">Detail Information</h4>
            </div>
            <div className="modal-body">
              <Carousel boat={this.state.selectedBoat}/>
              <Row className="details">
                <Badge className="mr-1" color="info">Cateogory: {this.state.selectedBoat.category}</Badge>
                <Badge className="mr-1" color="info">Manufacturer: {this.state.selectedBoat.manufacturer}</Badge>
                <Badge className="mr-1" color="info">Model: {this.state.selectedBoat.model}</Badge>
                <Badge className="mr-1" color="info">Ticket: {this.state.selectedBoat.ticketPrice}GBP</Badge>
                <Badge className="mr-1" color="info">Price: {this.state.selectedBoat.price}GBP</Badge>
                <Badge className="mr-1" color="info">Length: {this.state.selectedBoat.length}</Badge>
                <Badge color="info">Width: {this.state.selectedBoat.width}</Badge>
              </Row>
              {/* <h6 class="category text-info"><i class="now-ui-icons location_bookmark"></i> Manufacturer: {this.state.selectedBoat.manufacturer}</h6>
              <h6 class="category text-info"><i class="now-ui-icons design_bullet-list-67"></i> Model: {this.state.selectedBoat.model}</h6>
              <h6 class="category text-info"><i class="now-ui-icons business_money-coins"></i> Ticket: {this.state.selectedBoat.ticketPrice}GBP</h6>
              <h6 class="category text-info"><i class="now-ui-icons business_money-coins"></i> Price: {this.state.selectedBoat.price}GBP</h6>
              <h6 class="category text-info"><i class="now-ui-icons design-2_ruler-pencil"></i> Length: {this.state.selectedBoat.length}</h6>
              <h6 class="category text-info"><i class="now-ui-icons design-2_ruler-pencil"></i> Width: {this.state.selectedBoat.width}</h6> */}
            </div>
            <ModalFooter>
              <Button color="primary" type="button">
                Buy Ticket
              </Button>
              <Button color="primary" onClick={() => this.setState({boatInfoModal: false})}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </>
    );
  }
}

export default GalleryBody;

