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
      isCartOpened: false
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

  onClickCart = () => {
    this.setState({isCartOpened: true});    
  }

  onClickToPlay = (cartItems) => {
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
    // const { user } = this.props.auth;
    return (
      <>
        <DropdownScrollNavbar onClickCart={this.onClickCart}/>
        <div className="wrapper">
          <GalleryHeader />
          <GalleryBody isCartOpened={this.state.isCartOpened} onClickToPlay={this.onClickToPlay}/>
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