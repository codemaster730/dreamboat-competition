import React, { Component }  from 'react';

// reactstrap components
import {
  Button,
  CardBody,
  Row,
  Col
} from "reactstrap";

// core components

class SpotBallCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems:{},
      selected_tid: 0
    }
  }

  selectFirstTicket(){
    var set_chk = 1;
    this.state.cartItems.forEach((item) => {
      item.tickets.forEach((tItem)=>{
        if((set_chk) && (tItem.coordX==null || tItem.coordY==null)){
          set_chk = 0;
          this.setState({selected_tid:tItem._id},()=>{
            this.props.updateCartItems({type:"selectTicket", selected_tobj:tItem, selected_cid: item._id});
          });
        }
      });
    });
  }

  componentDidMount() {
    
  }

  componentDidUpdate(){
    
  }
  componentWillUnmount() {

  }

  componentWillReceiveProps(nextprops) {
    console.log("receive_props");
    this.setState({cartItems: nextprops.cartItems}, () => {
      this.selectFirstTicket();
    });
  }

  renderCartItems() {
    if (this.state.cartItems.length > 0) {
      let mtickets = [];
      this.state.cartItems.forEach((item) => {
        let i = 0;
        const ticketNum = item.ticketCount;
        while (i < ticketNum) {
          const sel_chk = this.state.selected_tid===item.tickets[i]._id ? 1 : 0 ;
          mtickets.push({...item, ticketNo: i + 1, sel_chk: sel_chk });
          i++;
        }
      });
      return mtickets.map((item) => {
        const {thumnailUri, manufacturer, model, ticketNo, tickets, _id, sel_chk} = item;
        return (
          <div className={(sel_chk)?"cart-item selected":"cart-item" } >
            <Row>
              <Col xs="5">
                <div className="card-image">
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img
                      alt="..."
                      className="img"
                      src={thumnailUri}
                    ></img>
                  </a>
                </div>
              </Col>
              <Col xs="7" style={{padding: 0}}>
                <CardBody style={{padding: '2px 15px 0 0'}}>
                  <h6 className="play-count-label">{ticketNo + ' of ' + item.ticketCount}</h6>
                  <h6 className="card-title">{manufacturer}</h6>
                  <h6 className="category text-info">{model}</h6>
                  <h6 className="position">X:{tickets[ticketNo-1].coordX} Y:{tickets[ticketNo-1].coordY}</h6>
                </CardBody>
              </Col>  
            </Row>
            <Row className="cart-actions">
              <Button
                className="btn-round play"
                onClick={(e)=>{
                    this.props.updateCartItems({type:"selectTicket",selected_cid: _id, selected_tobj:tickets[ticketNo-1]});
                    this.setState({selected_tid : tickets[ticketNo-1]._id});
                  }}
              >
                <i className="now-ui-icons loader_refresh spin"></i>
                <span>{(tickets[ticketNo-1].coordX!==null) ? "Reply" : (sel_chk ? "In Play":"To Play")}</span>
              </Button>
              <Button
                className="btn-round add"
                onClick={(e)=>{
                      this.props.updateCartItems({type:"addTicket",selected_cid: _id,selected_tobj:tickets[ticketNo-1]});
                  }}
              >
                <i className="now-ui-icons ui-1_simple-add"></i> Add
              </Button>
              <Button
                className="btn-round remove"
                onClick={(e)=>{
                      this.props.updateCartItems({type:"removeTicket",selected_cid: _id,selected_tobj:tickets[ticketNo-1]});
                  }}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i> Remove
              </Button>
            </Row>
          </div>
        )
      });
    } else return []; 
  }

  render() {
    return (
      <>
        <div className="cart-container">
          {
            this.renderCartItems()
          }
        </div>
      </>
    );
  }
}

export default SpotBallCart