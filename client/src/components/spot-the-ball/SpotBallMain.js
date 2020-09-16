import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

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
      totalTicketCount: 0,
      
    }
    this.selected_tobj = {}; //ticket object
    this.selected_cid = ''; //cartitem id
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
    this.selected_tobj = {};
    this.selected_cid = '';
    axios
    .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({cartItems: res.data});
    }).catch((err) => {
      console.log(err);
    });
  }

  updateCartItems = (params) =>{    
    if(params.type==="setPos"){
      
      this.selected_tobj.coordX = params.posX;
      this.selected_tobj.coordY = params.posY;
      console.log("XXX"+this.selected_tobj.coordX+":"+this.selected_tobj._id+":"+this.selected_cid);
      axios
        .post('/api/carts/updateCartTicket', {cartItemId: this.selected_cid, ticket: this.selected_tobj})
        .then((res) => {
          this.getCartTickets();
        }).catch((err) => {
          console.log(err);
        });
    }else if(params.type==="selectTicket"){
      this.selected_tobj = params.selected_tobj;
      this.selected_cid = params.selected_cid;
      console.log("sel"+this.selected_tobj._id+":"+this.selected_cid);
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
