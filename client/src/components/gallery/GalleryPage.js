import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import GalleryHeader from "components/gallery/GalleryHeader.js";
import GalleryBody from "components/gallery/GalleryBody.js";

class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpened: false,
      totalTicketCount: 0
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
    this.getTotalTicketCount();
  }

  componentWillUnmount() {
    document.body.classList.remove("gallery-page");
    document.body.classList.remove("sidebar-collapse");
  }

  updateCartOpenStatus = (status) => {
    this.setState({isCartOpened: status});    
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

  redirectToLogin = () => {
    this.props.history.push({
      pathname: '/login'
    });
  }

  getTotalTicketCount = () => {
    axios
    .post('/api/carts/getCartTotal', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({totalTicketCount: res.data.totalTicketCount});
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <>
        <DropdownScrollNavbar onClickCart={this.updateCartOpenStatus} totalTicketCount={this.state.totalTicketCount}/>
        <div className="wrapper">
          <GalleryHeader />
          <GalleryBody isCartOpened={this.state.isCartOpened} onClickToPlay={this.onClickToPlay} redirectToLogin={this.redirectToLogin} getTotalTicketCount={this.getTotalTicketCount} updateCartOpenStatus={this.updateCartOpenStatus}/>
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