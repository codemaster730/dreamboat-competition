import React, { Component }  from 'react';

// reactstrap components
import {
  Button,
  CardBody,
  Row,
  Col
} from "reactstrap";

// core components

class SpotBallCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
    }
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({cartItems: nextProps.cartItems})
  }

  renderCartItems() {
    if (this.props.cartItems.length > 0) {
      let tickets = [];
      this.state.cartItems.forEach((item) => {
        let i = 0;
        const ticketNum = item.ticketCount;
        while (i < ticketNum) {
          tickets.push({...item, ticketNo: i + 1});
  
          i++;
        }
      });
      return tickets.map((item) => {
        const {thumnailUri, manufacturer, model, ticketNo} = item;
        return (
          <div className="cart-item">
            <Row>
              <Col xs="5">
                <div className="card-image">
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img
                      alt="..."
                      className="img"
                      src={thumnailUri}
                    ></img>
                  </a>
                </div>
              </Col>
              <Col xs="7" style={{padding: 0}}>
                <CardBody style={{padding: '2px 15px 0 0'}}>
                  <h6 className="play-count-label">{ticketNo + ' of ' + item.ticketCount}</h6>
                  <h6 className="card-title">{manufacturer}</h6>
                  <h6 className="category text-info">{model}</h6>
                </CardBody>
              </Col>  
            </Row>
            <Row className="cart-actions">
              <Button
                className="btn-round play"
                onClick={(e) => e.preventDefault()}
              >
                <i className="now-ui-icons loader_refresh spin"></i> In Play
              </Button>
              <Button
                className="btn-round add"
                onClick={(e) => e.preventDefault()}
              >
                <i className="now-ui-icons ui-1_simple-add"></i> Add
              </Button>
              <Button
                className="btn-round remove"
                onClick={(e) => e.preventDefault()}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i> Remove
              </Button>
            </Row>
          </div>
        )
      });
    } else return []; 
  }

  render() {
    return (
      <>
        <div className="cart-container">
          {
            this.renderCartItems()
          }
        </div>
      </>
    );
  }
}

export default SpotBallCart