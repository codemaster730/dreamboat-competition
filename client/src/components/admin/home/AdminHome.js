import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/authActions";

import DropdownScrollNavbar from "../shared/DropdownScrollNavbar";
import Footer from "../shared/Footer";
import HomePageFeature from "../../home/HomePageFeature";
import HomePageHeader from "../../home/HomePageHeader.js";

class AdminHome extends Component {
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
                <Footer />
            </div>
            </>
        );
    }
}

AdminHome.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(AdminHome);