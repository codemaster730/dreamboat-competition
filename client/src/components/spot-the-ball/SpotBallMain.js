import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addItems } from "../../actions/cartActions";

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
      cartItems: []
    }
  }

  componentDidMount() {
    document.body.classList.add("spot-ball-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    if (this.props.auth.isAuthenticated) {
      const cartItems = this.props.cart.cartItems;
      if (cartItems.length > 0) { 
        this.props.addItems(cartItems);
        this.setState({cartItems: cartItems}, () => {
          console.log("DID_MOUNT_Cart Items : ", this.state.cartItems);
        });
      } else {
        this.props.history.push("/boats");
      }
    } else {
      this.props.history.push({
        pathname: '/login',
        search: 'returnUrl=spot-ball-play'
      });
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("spot-ball-page");
    document.body.classList.remove("sidebar-collapse");
  }

  onClickCart = () => {
    this.setState({isCartOpened: true});    
  }

  render() {
    return (
      <>
        <DropdownScrollNavbar onClickCart={this.onClickCart}/>
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
                <div id="botbSpotGameWrapper" >
                  <div id ='botbSpotImageWrapper'  >
                    <SpotBallPlay onRef={ref => (this.spotBallPlayRef = ref)}/>    
                  </div>
                </div>   
              </div>
              <div id="spotSidebar"> 
                <SpotBallCart cartItems={this.state.cartItems}/>
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
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  cart: state.cart
});
export default connect(
  mapStateToProps,
  {addItems}
)(SpotBallMain);
