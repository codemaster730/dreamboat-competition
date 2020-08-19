import React from "react";
import { Link } from "react-router-dom";
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
  UncontrolledTooltip,
} from "reactstrap";

function DropdownScrollNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [navbarColor, setNavbarColor] = React.useState(" navbar-transparent");
  const [buyButtonColor, setBuyButtonColor] = React.useState("neutral");
  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 199 ||
        document.body.scrollTop > 199
      ) {
        setNavbarColor("");
        setBuyButtonColor("info");
      } else if (
        document.documentElement.scrollTop < 200 ||
        document.body.scrollTop < 200
      ) {
        setNavbarColor(" navbar-transparent");
        setBuyButtonColor("neutral");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });
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
            <NavbarBrand to="/" tag={Link} id="navbar-brand" className="navbar-brand">
              DREAMBOAT
            </NavbarBrand>
            <UncontrolledTooltip target="navbar-brand">
              Designed by Invision. Coded by Creative Tim
            </UncontrolledTooltip>
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
                  <DropdownItem to="/" tag={Link} target="_self">
                    <i className="now-ui-icons business_chart-pie-36"></i>
                    Weekly Lifestyle
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
              <NavItem>
                <Button
                  className="nav-link btn-default"
                  color={buyButtonColor}
                  href="/login"
                  target="_self"
                >
                  <p className="shopping_cart">LOGIN</p>
                </Button>
              </NavItem>
              <NavItem>
                <Button
                  className="nav-link btn-default"
                  color={buyButtonColor}
                  href="/register"
                  target="_self"
                >
                  <p className="shopping_cart">SIGNUP</p>
                </Button>
              </NavItem>
              <NavItem>
                <Button
                  className="nav-link btn-default"
                  color={buyButtonColor}
                  href="#"
                  target="_blank"
                >
                  <i className="now-ui-icons shopping_box"></i>
                  <p className="shopping_cart">CART</p>
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default DropdownScrollNavbar;
