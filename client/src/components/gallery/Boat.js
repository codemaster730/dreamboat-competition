import React, { Component } from "react";
import { Badge, Col } from "reactstrap";

class Boat extends Component {
  constructor (props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { boat, handleClickBoat } = this.props;

    return (
      <>
        <Col md="4">
          <div className="overlay-info" onClick={() => handleClickBoat(boat)}>
            <img
              alt="..."
              src={boat.images[0]}
            />
            <Badge className="category-info" color="info">{boat.manufacturer}-{boat.model}</Badge>
            <Badge className="ticket-price-info" color="primary">${boat.ticketPrice}</Badge>
            <Badge className="price-info" color="info">CASH:${boat.price}</Badge>
          </div>
        </Col>
      </>
    );
  }
}

export default Boat;

