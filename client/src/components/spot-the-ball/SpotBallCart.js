import React, { Component }  from 'react';
import * as d3 from 'd3';
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
      cartItems:{}
    }
  }


  componentDidMount() {
    //
  }

  componentDidUpdate(){
    const _this = this;
    var set_val_chk=1;
    d3.selectAll(".cart-item").each(function(){
      if(d3.select(this).select(".row h6.position").html()==="X: Y:" && set_val_chk){
        d3.select(this).attr("style","background-color:grey");
        d3.select(this).select("button.play span").html("In Play");
        set_val_chk = 0;
      }
    });

    d3.selectAll(".cart-item button.play")
      .on("click", function(){
        d3.selectAll(".cart-item").each(function(){
          if(d3.select(this).select("button.play span").html()==="In Play"){
            d3.select(this).attr("style","background-color:white");
            d3.select(this).select("button.play span").html("To Play");
          }
        });
        if(d3.select(this).select("span").html()==="Reply"){
          d3.select(this).select("span").html("In Play");
          let param={type:"setPos", posX:null, posY:null};      //set position to NULL
          _this.props.updateCartItems(param);
        }
        d3.select(this).select("span").html("In Play");
        d3.selectAll(".cart-item").each(function(){
          if(d3.select(this).select("button.play span").html()==="In Play"){
            d3.select(this).attr("style","background-color:grey");
          }
        });
      })
  }
  componentWillUnmount() {

  }

  componentWillReceiveProps(nextprops) {
    this.setState({cartItems: nextprops.cartItems});
  }

  renderCartItems() {
    console.log("xxx"+this.state.cartItems.length);
    if (this.state.cartItems.length > 0) {
      let mtickets = [];
      this.state.cartItems.forEach((item) => {
        let i = 0;
        const ticketNum = item.ticketCount;
        while (i < ticketNum) {
          mtickets.push({...item, ticketNo: i + 1});
          i++;
        }
      });
      return mtickets.map((item) => {
        const {thumnailUri, manufacturer, model, ticketNo, tickets, _id} = item;
        return (
          <div className="cart-item" item_id={_id} ticket_id={tickets[ticketNo-1]._id}>
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
                onClick={(e) => e.preventDefault()}
              >
                <i className="now-ui-icons loader_refresh spin"></i>
                <span>{(tickets[ticketNo-1].coordX!=null) ? "Reply" : "To Play"}</span>
              </Button>
              <Button
                className="btn-round add"
                t_id={tickets[ticketNo-1]._id}
                onClick={(e) => e.preventDefault()}
              >
                <i className="now-ui-icons ui-1_simple-add"></i> Add
              </Button>
              <Button
                className="btn-round remove"
                t_id={tickets[ticketNo-1]._id}
                onClick={(e) => e.preventDefault()}
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