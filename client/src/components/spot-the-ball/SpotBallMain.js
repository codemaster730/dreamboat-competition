import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addItems } from "../../actions/cartActions";

// reactstrap components
import {
  Container,
  Row
} from "reactstrap";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import SpotBallHeader from './SpotBallHeader';

class SpotBallMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempItems: [],
      isCartOpened: false
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("WILL_RECEIVE_Cart Items : ", nextProps.cartItems);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      console.log("DID_MOUNT_Cart Items : ", this.props.cart.cartItems);
      if (this.props.cart.cartItems.length > 0)
        this.props.addItems(this.props.cart.cartItems);
    } else {
      this.props.history.push({
        pathname: '/login',
        search: 'returnUrl=spot-ball-play'
      });
    }
  }

  componentWillUnmount() {

  }

  onClickCart = () => {
    this.setState({isCartOpened: true});    
  }

  render() {
    return (
      <>
        <DropdownScrollNavbar onClickCart={this.onClickCart}/>
        <div className="wrapper">
        <SpotBallHeader />
        <Container className="game-container">
          
        </Container>
        <FooterDefault />
        </div>
      </>
    );
  }

}

SpotBallMain.propTypes = {
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  cart: state.cart
});
export default connect(
  mapStateToProps,
  {addItems}
)(SpotBallMain);
