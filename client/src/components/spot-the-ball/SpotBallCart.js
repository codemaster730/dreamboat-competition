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
      cartItems:[],
      selected_tid: 0
    }
  }

  selectFirstTicket(){
    var set_chk = 1;
    this.state.cartItems.forEach((item) => {
      item.tickets.forEach((tItem)=>{
        if((set_chk) && (tItem.coordX==null || tItem.coordY==null)){
          set_chk = 0;
          this.props.updateCartItems({type:"selectTicket", selected_tobj:tItem, selected_cid: item._id});
          this.setState({selected_tid:tItem._id},()=>{
            var el=document.getElementById('tick'+this.state.selected_tid);
            if(el)
              el.scrollIntoView({behavior: "smooth", block: "center"});
          });
        }
      });
    });
    if(set_chk){
      this.setState({selected_tid:0});
    }
  }

  componentDidMount() {
    
  }

  componentDidUpdate(){
    
    
  }
  
  componentWillUnmount() {

  }

  componentWillReceiveProps(nextprops) {
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
          let sel_chk =  0;
          if(this.state.selected_tid===item.tickets[i]._id){
            sel_chk = 1;
          }else{
            sel_chk = 0;
          }
          mtickets.push({...item, ticketNo: i + 1, sel_chk: sel_chk });
          i++;
        }
      });
      return mtickets.map((item) => {
        const {thumnailUri, manufacturer, model, ticketNo, tickets, _id, sel_chk} = item;
        return (
          <div 
            className={(sel_chk)?"cart-item selected":"cart-item" } 
            id = {"tick"+tickets[ticketNo-1]._id}
          >
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
                style={{ backgroundColor: (sel_chk ? "grey": (tickets[ticketNo-1].coordX!==null) ? "CornflowerBlue " : "Darkgrey") }}
                onClick={(e)=>{
                    this.props.updateCartItems({type:"selectTicket",selected_cid: _id, selected_tobj:tickets[ticketNo-1]});
                    document.getElementById('tick'+tickets[ticketNo-1]._id).scrollIntoView({behavior: "smooth", block: "center"});
                    this.setState({selected_tid : tickets[ticketNo-1]._id});
                  }}
              >
                <i className="now-ui-icons loader_refresh spin"></i>
                <span>{(sel_chk ? "In Play": (tickets[ticketNo-1].coordX!==null) ? "Reply" : "To Play")}</span>
              </Button>
              <Button
                className="btn-round add"
                onClick={(e)=>{
                      document.getElementById('tick'+tickets[ticketNo-1]._id).scrollIntoView({behavior: "smooth", block: "center"});
                      this.props.updateCartItems({type:"addTicket",selected_cid: _id, selected_tobj:tickets[ticketNo-1]});
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
        <div className="cart-container" id='cart-container'>
          {
            this.renderCartItems()
          }
          <div className="proc-container">
              <Button
                className="btn-info"
                target="_self"
                onClick={(e)=>{
                      this.props.updateCartItems({type:"batchSelect"});
                  }}
              >
                Batch Select
              </Button>
              
              <Button
                className="btn-info"
                href="/boats"
                target="_self"
              >
                Add More Tickets
              </Button>

              <Button
                className="btn-info"
                href="/"
                target="_self"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.handleCheckoutEvent();
                }}
              >
                Check Out
              </Button>
          </div>
        </div>
      </>
    );
  }
}

export default SpotBallCart