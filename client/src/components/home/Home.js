import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import HomePageHeader from "components/home/HomePageHeader.js";
import FooterDefault from "components/shared/FooterDefault.js";
import HomePageFeature from "components/home/HomePageFeature.js";
import HomePageWinner from "components/home/HomePageWinner.js";

class Home extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidMount() {

    document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

  }

  componentWillUnmount() {
    document.body.classList.remove("landing-page");
    document.body.classList.remove("sidebar-collapse");
  }

  render() {

    return (
      <>
        <DropdownScrollNavbar />
        <div className="wrapper">
          <HomePageHeader />
          <HomePageFeature />
          <HomePageWinner />
          <FooterDefault />
        </div>
      </>
    );
  }
}

Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Home);