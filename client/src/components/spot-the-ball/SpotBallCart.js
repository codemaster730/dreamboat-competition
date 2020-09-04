import React, { Component }  from 'react';

// reactstrap components
import {
  Button,
  Table
} from "reactstrap";

// core components

class SpotBallCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: []
    }
  }


  componentDidMount() {
    
  }

  componentWillUnmount() {

  }

  renderCartTableData() {
    return this.state.cartItems.map((item) => {
      const {boatId, images, manufacturer, model, ticketNumber, ticketPrice} = item;
      return (
        <tr key={boatId}>
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
              <button className="btn btn-info btn-sm" onClick={() => this.updateTicketsInCart(boatId, ticketNumber, false)}>
                <i className="now-ui-icons ui-1_simple-delete"></i>
              </button>
              <button className="btn btn-info btn-sm">
                <i className="now-ui-icons ui-1_simple-add" onClick={() => this.updateTicketsInCart(boatId, ticketNumber, true)}></i>
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
              onClick={() => this.removeBoatFromCart(boatId)}
            >
              <i className="now-ui-icons ui-1_simple-delete"></i>
            </Button>
          </td>
        </tr>
      );
    });
  }

  render() {
    console.log("Cart Items ->", this.state.cartItems);
    return (
      <>
        <Table className="table-cart" responsive>
          <tbody>
            {
              this.renderCartTableData()
            }
          </tbody>
        </Table>
      </>
    );
  }

}

export default SpotBallCart