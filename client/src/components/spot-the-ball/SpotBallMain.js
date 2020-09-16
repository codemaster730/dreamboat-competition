import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import * as d3 from 'd3';

// reactstrap components
import {
  Container,
  Row,
  NavItem,
  NavLink,
  Nav,
} from "reactstrap";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import FooterDefault from "components/shared/FooterDefault.js";
import SpotBallHeader from './SpotBallHeader';
import SpotBallCart from './SpotBallCart';
import SpotBallPlay from './SpotBallPlay';

class SpotBallMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpened: false,
      selectedTool: "1",
      cartItems: [],
      totalTicketCount: 0
    }
  }

  componentDidMount() {
    document.body.classList.add("spot-ball-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.getCartTickets();
    this.getTotalTicketCount();
  }

  componentWillUnmount() {
    document.body.classList.remove("spot-ball-page");
    document.body.classList.remove("sidebar-collapse");
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

  getCartTickets() {
    axios
    .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({cartItems: res.data});
    }).catch((err) => {
      console.log(err);
    });
  }

  updateCartItems = (params) =>{
    //set position to cart-item
    
    if(params.type==="setPos"){
      console.log("XXX"+params.posX);
    }
  }
  render() {
    return (
      <>
        <DropdownScrollNavbar/>
        <div className="wrapper">
          <SpotBallHeader />
          <Container className="game-container mt-4">
            <Row>
              <div className="tools-container">
                <Nav
                    className="nav-pills-info flex-column"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={this.state.selectedTool === "1" ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({selectedTool: "1"});
                          this.spotBallPlayRef.handleLineToggle();
                        }}
                      ><i className="now-ui-icons design-2_ruler-pencil"></i>
                        Draw Lines
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={this.state.selectedTool === "2" ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({selectedTool: "2"});
                          this.spotBallPlayRef.handlePenToggle();

                        }}
                      ><i class="now-ui-icons design-2_ruler-pencil"></i>
                        Points
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={this.state.selectedTool === "3" ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({selectedTool: "3"});
                          this.spotBallPlayRef.handleUndoEvent();
                        }}
                      ><i class="now-ui-icons arrows-1_refresh-69"></i>
                        Undo
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={this.state.selectedTool === "4" ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({selectedTool: "4"});
                          this.spotBallPlayRef.handleClearEvent();
                        }}
                      ><i class="now-ui-icons ui-1_simple-remove"></i>
                        Clear Lines
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={this.state.selectedTool === "5" ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({selectedTool: "5"});
                          this.spotBallPlayRef.handleShowHideToggle();
                        }}
                      ><i class="now-ui-icons design-2_ruler-pencil"></i>
                        Show/Hide Lines
                      </NavLink>
                    </NavItem>
                  </Nav>
              </div>
              <div id="spotImageWrapper">
                <div id="dreamboatSpotGameWrapper" >
                  <div id ='dreamboatSpotImageWrapper'  >
                    <SpotBallPlay onRef={ref => (this.spotBallPlayRef = ref)} updateCartItems={this.updateCartItems}/>    
                  </div>
                </div>   
              </div>
              <div id="spotSidebar"> 
                <SpotBallCart cartItems={this.state.cartItems} updateCartItems={this.updateCartItems} />
              </div>
            </Row>
          </Container>
        </div>
        <FooterDefault />
      </>
    );
  }
}

SpotBallMain.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(SpotBallMain);
