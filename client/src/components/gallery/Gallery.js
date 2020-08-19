import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import GalleryHeader from "components/gallery/GalleryHeader.js";
import GalleryBody from "components/gallery/GalleryBody.js";

class Gallery extends Component {
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

  render() {
    // const { user } = this.props.auth;
    return (
      <>
        <DropdownScrollNavbar />
        <div className="wrapper">
          <GalleryHeader />
          <GalleryBody />
          <FooterDefault />
        </div>
      </>
    );
  }
}

Gallery.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Gallery);