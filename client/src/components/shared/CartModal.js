import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

import { 
  Row,
  Modal,
  ModalFooter,
  Button,
  Table
} from "reactstrap";

class CartModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cartItems: [],

    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cartStatus !== this.props.cartStatus || nextProps.cartOpen !== this.props.cartOpen) {
      if (nextProps.cartStatus !== '' || nextProps.cartOpen === true) {
        this.props.getTotalTicketCount();
        this.getCartTickets();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getTotalTicketCount();
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

  updateTicketsInCart(cartItemId, isRemove, ticketCount) {
    if (isRemove) {
      if (ticketCount <= 1) return;
      axios
      .post("/api/carts/removeCartTicket", {cartItemId: cartItemId})
      .then(res => {
        toast.info(res.data.message);
        this.getCartTickets();
        this.props.getTotalTicketCount();
      }).catch(err => {
        console.log(err);
      });
    } else {
      const ticketData = {answer: '', answerImageUrl: '', coordX: null, coordY: null}
      axios
      .post("/api/carts/addCartTicket", {cartItemId: cartItemId, ticket: ticketData})
      .then(res => {
        toast.info(res.data.message);
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
              <button className="btn btn-info btn-sm" onClick={() => this.updateTicketsInCart(_id, true, ticketCount)}>
                <i className="now-ui-icons ui-1_simple-delete"></i>
              </button>
              <button className="btn btn-info btn-sm">
                <i className="now-ui-icons ui-1_simple-add" onClick={() => this.updateTicketsInCart(_id, false, ticketCount)}></i>
              </button>
            </div>
          </td>
          <td className="td-number">
            <small>£</small>
            {_.floor(ticketCount * ticketPrice, 2)}
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

  onClickToPlay = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/spot-the-ball");
    } else {
      this.props.history.push({
        pathname: '/login',
        search: 'redirectUrl=spot-the-ball'
      });
    }
  }

  render() {
    return (
      <>
        <ToastContainer />
        <Modal        
          id="modal-cart"
          isOpen={this.props.cartOpen}
          toggle={() => {this.props.closeCart();}}
        >
          <div className="modal-header justify-content-center">
            <div className="title">CART</div>
            <button
              aria-hidden={true}
              className="close"
              onClick={() => {this.props.closeCart();}}
              type="button"
            >
              <i className="now-ui-icons ui-1_simple-remove"></i>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Table id="table-cart" responsive>
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
              onClick={this.onClickToPlay}
              className="btn-add-cart" 
              color="primary">
              Proceed To Play
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

CartModal.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps
)(withRouter(CartModal));