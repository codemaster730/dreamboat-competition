import React, { Component }  from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import {
  isMobile,
  isTablet
} from "react-device-detect";

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
import SpotBallMobilePlay from './SpotBallMobilePlay';
import { toast } from 'react-toastify';

class SpotBallMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: "1",
      cartItems: [],
      cartOpen: false,
      cartStatus: '',
      backImg: {src:"", width:100, height:100},
    }
    //this.navBarRef = React.createRef();
    this.selectedTickObj = {}; //ticket object
    this.selectedCartId = ''; //cartitem id
    this.selectedBatchChk = false;
    
  }

  componentDidMount() {
    document.body.classList.add("spot-ball-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    this.getCartTickets();
    axios.get('/api/spotballs/get_active_image', {})
      .then((res) => {
        this.setState({backImg: {src:res.data.spotball[0].image, width:res.data.spotball[0].width, height:res.data.spotball[0].height}});
      }).catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    document.body.classList.remove("spot-ball-page");
    document.body.classList.remove("sidebar-collapse");
  }


  getCartTickets() {
    this.selectedTickObj = {};
    this.selectedCartId = '';
    axios
    .post('/api/carts/getCartTickets', {userId: this.props.auth.user.id})
    .then((res) => {
      this.setState({cartItems: res.data});
    }).catch((err) => {
      console.log(err);
    });
  }

  updateCartItems = (params) =>{    
    if(params.type==="setPos"){ //handle event from SpotBallPlay
      if(this.selectedBatchChk){
        axios
          .post('/api/carts/setBatchTickets', {userId: this.props.auth.user.id, coordX: params.posX, coordY: params.posY})
          .then((res) => {
            this.selectedBatchChk = false;
            this.setState({cartItems: res.data});
            this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
          }).catch((err) => {
            console.log(err);
          });
      }else{
        if(this.selectedCartId===''){ //add new tickets when ticket is not selected 
          this.state.cartItems.forEach((item)=>{
              if(item.ticketCount>0){
                this.selectedCartId = item._id;
                this.selectedTickObj = item.tickets[0];
              }
            });
          this.selectedTickObj.coordX = params.posX;
          this.selectedTickObj.coordY = params.posY;
          delete this.selectedTickObj._id;
          axios
            .post('/api/carts/addCartTicket', {cartItemId: this.selectedCartId, ticket: this.selectedTickObj})
            .then((res) => {
              this.getCartTickets();
              this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
            }).catch((err) => {
              console.log(err);
            });
        }else{
          this.selectedTickObj.coordX = params.posX;
          this.selectedTickObj.coordY = params.posY;
          axios
            .post('/api/carts/updateCartTicket', {cartItemId: this.selectedCartId, ticket: this.selectedTickObj})
            .then((res) => {
              this.getCartTickets();
              this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
            }).catch((err) => {
              console.log(err);
            });
        }
      }
    }else if(params.type==="addTicket"){
      this.selectedTickObj = params.selected_tobj;
      this.selectedCartId = params.selected_cid;
      delete this.selectedTickObj._id;
      this.selectedTickObj.coordX = null;
      this.selectedTickObj.coordY = null;
      axios
        .post('/api/carts/addCartTicket', {cartItemId: this.selectedCartId, ticket: this.selectedTickObj})
        .then((res) => {
          this.getCartTickets();
          this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
        }).catch((err) => {
          console.log(err);
        });
    }else if(params.type==="removeTicket"){
      axios
        .post('/api/carts/removeCartTicket', {cartItemId: params.selected_cid, ticketId: params.selected_tobj._id})
        .then((res) => {
          this.getCartTickets();
          this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
        }).catch((err) => {
          console.log(err);
        });      
    }else if(params.type==="selectTicket"){
      this.selectedTickObj = params.selected_tobj;
      this.selectedCartId = params.selected_cid;
      if(this.selectedTickObj.coordX){
        this.selectedTickObj.coordX = null;
        this.selectedTickObj.coordY = null;
        axios
          .post('/api/carts/updateCartTicket', {cartItemId: this.selectedCartId, ticket: this.selectedTickObj})
          .then((res) => {
            this.getCartTickets();
            this.setState({cartStatus: 'NeedUpdate', cartOpen: false});
          }).catch((err) => {
            console.log(err);
          });
      }
    }else if(params.type==="batchSelect"){
      this.selectedBatchChk = !this.selectedBatchChk;
    }
  }

  updateCartStatus = (status = '', cartOpen) => {
    console.log(status, cartOpen);
    this.setState({cartStatus: status, cartOpen: cartOpen});
  } 

  handleCheckoutEvent = () => {
    let notCompleted = false;
    this.state.cartItems.forEach((cartItem) => {
      cartItem.tickets.forEach((ticket) => {
        if (!ticket.coordX) {
          notCompleted = true;
        }
      })
    });
    if (notCompleted) {
       toast.info("Please play all your tickets before proceeding to Checkout.");
    } else {
      this.props.history.push("/checkout");
    }
  }


  render() {
    if(isMobile || isTablet)
      return(
        <div>
          {
            this.state.backImg.src!=="" ?(
              <SpotBallMobilePlay cartItems={this.state.cartItems} updateCartItems={this.updateCartItems} imgSrc={this.state.backImg.src} />
              ):""
          }
        </div>
      );
    else
      return (
      <>
        <DropdownScrollNavbar cartStatus={this.state.cartStatus} cartOpen={this.state.cartOpen} updateCartStatus={this.updateCartStatus}/>
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
                    <SpotBallPlay backImg={this.state.backImg.src} onRef={ref => (this.spotBallPlayRef = ref)} cartItems={this.state.cartItems} updateCartItems={this.updateCartItems}  />    
                  </div>
                </div>   
              </div>
              <div id="spotSidebar"> 
                <SpotBallCart  cartItems={this.state.cartItems} updateCartItems={this.updateCartItems} handleCheckoutEvent={this.handleCheckoutEvent} backImg={this.state.backImg.src} />
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
