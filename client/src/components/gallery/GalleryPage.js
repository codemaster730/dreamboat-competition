import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import GalleryHeader from "components/gallery/GalleryHeader.js";
import GalleryBody from "components/gallery/GalleryBody.js";

class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartOpen: false,
      cartStatus: '',
    }
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidMount() {
    document.body.classList.add("gallery-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  componentWillUnmount() {
    document.body.classList.remove("gallery-page");
    document.body.classList.remove("sidebar-collapse");
  }

  redirectToLogin = () => {
    this.props.history.push({
      pathname: '/login'
    });
  }

  updateCartStatus = (status = '', cartOpen) => {
    this.setState({cartStatus: status, cartOpen: cartOpen});
  } 

  render() {
    return (
      <>
        <DropdownScrollNavbar cartStatus={this.state.cartStatus} cartOpen={this.state.cartOpen} updateCartStatus={this.updateCartStatus}/>
        <div className="wrapper">
          <GalleryHeader />
          <GalleryBody redirectToLogin={this.redirectToLogin} getTotalTicketCount={this.getTotalTicketCount} updateCartStatus={this.updateCartStatus}/>
          <FooterDefault />
        </div>
      </>
    );
  }
}

GalleryPage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(GalleryPage);