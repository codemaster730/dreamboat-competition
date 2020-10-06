import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";

function DropdownScrollNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [navbarColor, setNavbarColor] = React.useState("");
  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 499 ||
        document.body.scrollTop > 499
      ) {
        setNavbarColor("");
        //setBuyButtonColor("info");
      } else if (
        document.documentElement.scrollTop < 500 ||
        document.body.scrollTop < 500
      ) {
        //setNavbarColor(" navbar-transparent");
        //setBuyButtonColor("neutral");
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
          <UncontrolledDropdown className="button-dropdown">
            <DropdownToggle
              caret
              tag="a"
              data-toggle="dropdown"
              href="#pablo"
              id="navbarDropdown"
              onClick={(e) => e.preventDefault()}
            >
              <span className="button-bar"></span>
              <span className="button-bar"></span>
              <span className="button-bar"></span>
            </DropdownToggle>
          </UncontrolledDropdown>
          <div className="navbar-translate">
            <NavbarBrand to="/" tag={Link} id="navbar-brand" className="navbar-brand">
                <img src="/img/logo.png" alt=""/>
                Dream Boat DashBoard
            </NavbarBrand>
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
            <NavItem>
                <NavLink
                  href="/admin/users"
                >
                  <i className="now-ui-icons users_single-02"></i>
                  <p>User Management</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/admin/boats"
                >
                  <i className="now-ui-icons ui-2_settings-90"></i>
                  <p>All Boats</p>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="/admin/spotballs"
                >
                  <i className="now-ui-icons education_paper"></i>
                  <p>SpotBall Setting</p>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="/admin/tickets"
                >
                  <i className="now-ui-icons education_paper"></i>
                  <p>All Tickets</p>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default DropdownScrollNavbar;
