import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import {
  isMobile
} from "react-device-detect";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  UncontrolledTooltip
} from "reactstrap";

import CartModal from './CartModal.js';

function DropdownScrollNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [navbarColor, setNavbarColor] = React.useState(" navbar-transparent");
  const [buyButtonColor, setBuyButtonColor] = React.useState("neutral");
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartStatus, setCartStatus] = React.useState('');
  const [totalTicketCount, setTotalTicketCount] = React.useState(0);
  const [cartButtonColor, setCartButtonColor] = React.useState("color-blue");

  React.useEffect(() => {
    
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 99 ||
        document.body.scrollTop > 99
      ) {
        setNavbarColor("");
        setBuyButtonColor("info");
        setCartButtonColor("color-white");

      } else if (
        document.documentElement.scrollTop < 100 ||
        document.body.scrollTop < 100
      ) {
        setNavbarColor(" navbar-transparent");
        setBuyButtonColor("neutral");
        setCartButtonColor("color-blue");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    setCartOpen(props.cartOpen);
    setCartStatus(props.cartStatus);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  }, [props]);

  const onLogoutClick = (e) => {
    e.preventDefault();
    props.logoutUser();
  };

  const closeCart = () => {
    setCartOpen(false);
    if (props.updateCartStatus) props.updateCartStatus('', false);
  }

  const getTotalTicketCount = () => {
    axios
    .post('/api/carts/getCartTotal', {userId: props.auth.user.id})
    .then((res) => {
      setTotalTicketCount(res.data.totalTicketCount);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top" + navbarColor} color="white" expand="lg">
        <Container>
          <div className="navbar-translate">
            <div>
              <NavbarBrand to="/" tag={Link} id="navbar-brand" className="navbar-brand">
                <img src="/img/logo.png" alt=""/>
              </NavbarBrand>
              <label>DreamBoat</label>
            </div>
            <UncontrolledTooltip target="navbar-brand">
              Designed by Michael Dawson
            </UncontrolledTooltip>
            {isMobile && props.auth.isAuthenticated && totalTicketCount > 0?
              <Button
                className="nav-link btn-default"
                color={buyButtonColor}
                onClick={() => setCartOpen(true)}
              >
                {totalTicketCount > 0 && <p className={"ticket_count " + cartButtonColor}>({totalTicketCount})</p>}
                <i className={"now-ui-icons shopping_cart-simple " + cartButtonColor}></i> 
              </Button>
              :
              <></>
            }
            <button
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              className="navbar-toggler"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse isOpen={collapseOpen} navbar>
            <Nav className="ml-auto" id="ceva" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink1"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="now-ui-icons design_app"></i>
                  <p>Competitions</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink1" right>
                  <DropdownItem to="/boats" tag={Link} target="_self">
                    <i className="now-ui-icons design_image"></i>
                    Weekly Dream Boat
                  </DropdownItem>
                  <DropdownItem
                    href="#"
                    target="_self"
                  >
                    <i className="now-ui-icons design_bullet-list-67"></i>
                    Midweek Boat
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <i
                    aria-hidden={true}
                    className="now-ui-icons files_paper"
                  ></i>
                  <p>Winners</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink" right>
                  <DropdownItem to="#" tag={Link}>
                    <i className="now-ui-icons shopping_box"></i>
                    Previous Winners
                  </DropdownItem>
                  <DropdownItem to="#" tag={Link}>
                    <i className="now-ui-icons ui-2_settings-90"></i>
                    In the Press
                  </DropdownItem>
                  <DropdownItem to="#" tag={Link}>
                    <i className="now-ui-icons text_align-left"></i>
                    Prize Collections
                  </DropdownItem>
                  <DropdownItem to="#" tag={Link}>
                    <i className="now-ui-icons sport_user-run"></i>
                    Winners Map
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <i
                    aria-hidden={true}
                    className="now-ui-icons design_image"
                  ></i>
                  <p>About</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink" right>
                  <DropdownItem tag={Link} to="#">
                    <i className="now-ui-icons business_bulb-63"></i>
                    Customer Reviews
                  </DropdownItem>
                  <DropdownItem tag={Link} to="#">
                    <i className="now-ui-icons text_align-left"></i>
                    How To Play / FAQs
                  </DropdownItem>
                  <DropdownItem tag={Link} to="#">
                    <i className="now-ui-icons design_bullet-list-67"></i>
                    Contact Us
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {props.auth.isAuthenticated ?
                <NavItem>
                  <Button
                    color={buyButtonColor}
                    onClick={onLogoutClick}
                    className="nav-link btn-default nav-btn"
                  >
                    <p>LOGOUT</p>
                  </Button>
                </NavItem>
                :
                <NavItem>
                  <Button
                    className="nav-link btn-default nav-btn"
                    color={buyButtonColor}
                    href="/login"
                    target="_self"
                  >
                    <p>LOGIN</p>
                  </Button>
                </NavItem>
              }
              <NavItem>
                <Button
                  className="nav-link btn-default nav-btn"
                  color={buyButtonColor}
                  href="/register"
                  target="_self"
                >
                  <p>SIGNUP</p>
                </Button>
              </NavItem>
              {!isMobile && props.auth.isAuthenticated && totalTicketCount > 0?
                <NavItem>
                  <Button
                    className="nav-link btn-default"
                    color={buyButtonColor}
                    onClick={() => setCartOpen(true)}
                  >
                    {totalTicketCount > 0 && <p className={"ticket_count " + cartButtonColor}>({totalTicketCount})</p>}
                    <i className={"now-ui-icons shopping_cart-simple " + cartButtonColor}></i> 
                  </Button>
                </NavItem>
                :
                <></>
              }
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <CartModal cartStatus={cartStatus} cartOpen={cartOpen} closeCart={closeCart} getTotalTicketCount={getTotalTicketCount} />
    </>
  );
}

DropdownScrollNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(DropdownScrollNavbar);