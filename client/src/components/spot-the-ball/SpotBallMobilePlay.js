import React, { Component }  from 'react';
import * as d3 from 'd3';
//import Swiper from 'react-id-swiper';
import Swiper from 'swiper/js/swiper.js';
import {
    Button,
    Col,
    CardBody,
    Row,
  } from "reactstrap";

import '../spot-the-ball/SpotBallMobile.css';

//import 'swiper/css/swiper.css';
import 'swiper/swiper.scss';
import './SpotBallMobileSwiper.css';
import { $CombinedState } from 'redux';

class SpotBallMobilePlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
          cartItems:[],
          sightLines: [],
          selected_tid: 0,
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        
        this.chkPenLine = true;
        this.chkLineShow = true;
        this.markPos = {x:0, y:0};
        this.currentPos = {x:0, y:0};
    }
    componentDidMount() {      
        console.log("mount start");
        var _this = this;
        var img = new Image();
        img.src = this.props.imgSrc;
        img.onload = function() {
            _this.backImageHeight = this.height;
            _this.backImageWidth = this.width;
            _this.imgAspectRatio = this.width / this.height;

            _this.updateWindowDimensions();
            window.addEventListener('resize', _this.updateWindowDimensions);
            _this.swiper = new Swiper('.swiper-container', {
                init: true,
                updateOnWindowResize: true,
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                  rotate: 40,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                },
                pagination: {
                  el: '.swiper-pagination',
                },
            });
            _this.updateSwiper();
            console.log("load image and set swiper");

        }
        console.log("mount end");
    }
    updateSwiper =()=>{
        if(this.swiper){
            if(this.winWidth>this.winHeight-this.backHeight-100){
                this.swiper.changeDirection('horizontal');
            }else{
                this.swiper.changeDirection('vertical');
            }
            var set_chk = 1;
            var cart_index = 0;
            this.props.cartItems.forEach((item) => {
                item.tickets.forEach((tItem)=>{
                    if((set_chk) && (tItem.coordX==null || tItem.coordY==null)){
                        set_chk = 0;
                        this.swiper.slideTo(cart_index);
                    }
                    cart_index++;
                });
            });
            this.swiper.on('transitionEnd', function () {
                const eleActiveSliders = document.getElementsByClassName("swiper-slide-active");
                if(eleActiveSliders.length>0) {
                    var eleSelectedTickets = document.getElementsByClassName("selectedTicket");
                    while(eleSelectedTickets.length>0) {
                        eleSelectedTickets[0].classList.remove("selectedTicket");
                    }
                    document.getElementById("t"+eleActiveSliders[0].id).classList.add("selectedTicket");
                    document.getElementById("z"+eleActiveSliders[0].id).classList.add("selectedTicket");
                }
            });
        }
    }
    componentDidUpdate(){
        console.log("com update");
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {  //get resized window size & get back image size & max margin\
        console.log("window-dimension_resize");
        this.winWidth= window.innerWidth;
        this.winHeight= window.innerHeight-15;
        this.backWidth = 0;
        this.backHeight = 0;
        if(this.winWidth > this.winHeight){//landscape
            //this.setState({maxMarginLeft: wid-w+200, maxMarginTop: hei - h});
        }else{//Portrait
            if(this.winWidth > this.winHeight-300){//backImage-landscape
                this.backHeight = this.winHeight - 300;
                this.backWidth = this.backHeight * this.backImageWidth / this.backImageHeight;
                document.getElementsByClassName("botPlay")[0].style.width = this.winWidth +"px";
                document.getElementsByClassName("botPlay")[0].style.height = (this.winHeight-300) +"px";
            }else{//backImage-squre
                this.backHeight = this.winWidth;
                this.backWidth = this.backHeight * this.backImageWidth / this.backImageHeight;
                document.getElementsByClassName("botPlay")[0].style.width = this.winWidth +"px";
                document.getElementsByClassName("botPlay")[0].style.height = this.winWidth +"px";
            }
        }   

        document.getElementsByClassName("botBack")[0].style.backgroundSize= " "+ (this.backWidth+"px ") + (this.backHeight+"px") ;
        document.getElementsByClassName("botBack")[0].style.width = this.backWidth +"px";
        document.getElementsByClassName("botBack")[0].style.height = this.backHeight +"px";
        document.getElementsByClassName("botBack")[0].style.left = (this.winWidth-this.backWidth)/2 +"px";
        document.getElementsByClassName("sidebar")[0].style.top = this.backHeight +"px";
        this.currentPos.x = this.backWidth /2;
        this.currentPos.y = this.backHeight /2;
        this.markPos.x = 0;
        this.markPos.y = 0;
        this.setState({zoomRatio: this.backImageHeight / this.backHeight},()=>{
            this.setDOMStyle();
            this.updateSwiper();
        });
    }
    
    //Get Ray's Positions from Segment's Positions  return - obj{x1,y1,x2,y2,isline}
    _getRayPositions(pos1X, pos1Y, pos2X, pos2Y) {
        const delt_x = pos2X - pos1X
        const delt_y = pos2Y - pos1Y
        var ret_val = {}
        ret_val.x1 = pos1X
        ret_val.y1 = pos1Y
        if (!(delt_x === 0 && delt_y === 0)) {
        const delt_normal = delt_y / delt_x
        ret_val.x2 =
            pos1X + Math.cos(Math.atan(delt_normal)) * 1000 * Math.sign(delt_x)
        ret_val.y2 =
            pos1Y + Math.sin(Math.atan(delt_normal)) * 1000 * Math.sign(delt_x)
        ret_val.isline = true
        } else {
        ret_val.isline = false
        }
        return ret_val
    }

    _onTouchStart(e) {
        const touch = e.touches[0]
        this.clickCheckPos = {x: touch.clientX, y: touch.clientY}
        this.touchMove = {x: touch.clientX, y: touch.clientY}
    }
    
    _onTouchMove(e) {
        //e.preventDefault();
        
        if(e.changedTouches && e.changedTouches.length) {
            const touch = e.changedTouches[0];
            console.log("move",this.chkPenLine);
            if(!this.chkPenLine){
                this.lineX2 = touch.clientX;
                this.lineY2 = touch.clientY;
                const pos = this._getRayPositions(this.lineX1, this.lineY1, touch.clientX , touch.clientY);
                d3.select("#ltest").attr("d","M" + pos.x1 + "," + pos.y1 + "L" + pos.x2 + "," + pos.y2)
                d3.select("#ltestz").attr("d","M" +pos.x1 * 4 +"," +pos.y1 * 4 +"L" +pos.x2 * 4 +"," +pos.y2 * 4)
            }else{
                const deltX =  touch.clientX - this.touchMove.x;
                const deltY =  touch.clientY - this.touchMove.y;
                this.markPos.x += deltX/2;
                this.markPos.y += deltY/2;
                if(this.markPos.x * this.markPos.x + this.markPos.y * this.markPos.y > 900){
                    this.markPos.x -= deltX/2;
                    this.markPos.y -= deltY/2;
                    this.currentPos.x += deltX/2;
                    this.currentPos.y += deltY/2;
                }
                this.setDOMStyle();
                this.touchMove = {x:touch.clientX, y:touch.clientY};
            }
        }
    }

    
    _onTouchEnd(e) {
        const touch = e.changedTouches[0];
        if(!this.chkPenLine){
            this.setState({lineX2: touch.clientX, lineY2: touch.clientY});
        }
        if(this.clickCheckPos.x===touch.clientX && this.clickCheckPos.y===touch.clientY){
            alert("click");
            this.clickCheckPos = {x:-1, y:-1};
        }
    }
    setDOMStyle = () => {
        const eleLens = document.getElementsByClassName("lensComponent")[0];
        const eleCoord = document.getElementsByClassName("live_coordinates")[0];
        const eleZoom = document.getElementsByClassName("dreamboatSpotZoomWrapper")[0];
        const eleMarkee = document.getElementById("botbSpotCursor");
        const eleBack = document.getElementsByClassName("botBack")[0];
        if(this.winWidth<this.winHeight && this.winWidth<this.backWidth){
            
            eleBack.style.left = (-(this.backWidth-this.winWidth)/this.winWidth*this.currentPos.x) + "px";
        }
        //eleBack.style.top = -this.maxMarginTop * this.currentPos.y / this.backHeight + "px";
        eleLens.style.left = (this.currentPos.x - 32) + "px";
        eleLens.style.top = (this.currentPos.y - 32) + "px";
        eleCoord.style.left = (this.currentPos.x - 42) + "px";
        eleCoord.style.top = (this.currentPos.y - 52) + "px";
        eleCoord.innerHTML = "X:"+Math.floor(this.currentPos.x * this.state.zoomRatio+this.markPos.x) + "&nbsp;&nbsp;Y:"+Math.floor(this.currentPos.y * this.state.zoomRatio+this.markPos.y);
        eleZoom.style.left = (-this.currentPos.x * this.state.zoomRatio + 32) + "px";
        eleZoom.style.top = (-this.currentPos.y * this.state.zoomRatio + 32) + "px";
        eleMarkee.style.left = (this.markPos.x + 16) + "px";
        eleMarkee.style.top = (this.markPos.y + 16) + "px";
    }
    _onPenLineBtn(){
        if(this.chkPenLine){//state line
            document.body.classList.add("drawing");
            document.getElementsByClassName("penline_btn")[0].classList.remove("design-2_ruler-pencil");
            document.getElementsByClassName("penline_btn")[0].classList.add("ui-1_check");
            this.lineX1 = this.currentPos.x + this.markPos.x / this.state.zoomRatio;
            this.lineY1 = this.currentPos.y + this.markPos.y / this.state.zoomRatio;
            d3.select("#drawSVG").append("path")
                                .attr("d", "M"+this.lineX1+","+this.lineY1+"L"+0+","+0)
                                .attr("stroke", "#f0801f")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .attr("id","ltest");
            d3.select("#zoomSVG").append("path")
                                .attr("d", "M"+this.lineX1*this.state.zoomRatio+","+this.lineY1*this.state.zoomRatio+"L"+0+","+0)
                                .attr("stroke", "#f0801f")
                                .attr("stroke-width", 1)
                                .attr("fill", "none")
                                .attr("id","ltestz");
            d3.select("#dreamboatSpotImage")
                        .attr("class","drawing_lines");
        }else{
            document.getElementsByClassName("penline_btn")[0].classList.add("design-2_ruler-pencil");
            document.getElementsByClassName("penline_btn")[0].classList.remove("ui-1_check");
            d3.select("#ltest").remove();
            d3.select("#ltestz").remove();
            document.body.classList.remove("drawing");
            const pos = this._getRayPositions(this.lineX1, this.lineY1, this.lineX2, this.lineY2);
            const zoomPos = {x1: pos.x1*this.state.zoomRatio, y1: pos.y1*this.state.zoomRatio, x2: pos.x2*this.state.zoomRatio, y2: pos.y2*this.state.zoomRatio,}
            var copyLines = [...this.state.sightLines];
            copyLines.push(zoomPos);
            this.setState({sightLines: copyLines});
        }
        this.chkPenLine = !this.chkPenLine;
    }
    _onLineShowBtn(){
        if(!this.chkLineShow){
            document.getElementsByClassName("lineshow_btn")[0].classList.add("btn-info");
            document.getElementsByClassName("lineshow_btn")[0].classList.remove("btn-outline-default");
            d3.select("#drawSVG").selectAll(".straight_line").attr("display","block");
            d3.select("#zoomSVG").selectAll(".straight_line").attr("display","block");
        }else{
            document.getElementsByClassName("lineshow_btn")[0].classList.remove("btn-info");
            document.getElementsByClassName("lineshow_btn")[0].classList.add("btn-outline-default");
            d3.select("#drawSVG").selectAll(".straight_line").attr("display","none");
            d3.select("#zoomSVG").selectAll(".straight_line").attr("display","none");
        }
        this.chkLineShow = !this.chkLineShow;
    }
    _onRemoveLineBtn(){
        d3.select("#drawSVG").selectAll(".straight_line").remove();
        d3.select("#zoomSVG").selectAll(".straight_line").remove();
    }
    _onUndoBtn(){
        d3.selectAll("#drawSVG path.straight_line").filter(":last-child").remove();
        d3.selectAll("#zoomSVG path.straight_line").filter(":last-child").remove();
    }
    _onLineCancelBtn(){
        d3.select("#ltest").remove();
        d3.select("#ltestz").remove();
        document.body.classList.remove("drawing");
        this.chkPenLine = !this.chkPenLine;
    }

    renderCartItems() {
        if (this.props.cartItems.length > 0) {
          let mtickets = [];
          this.props.cartItems.forEach((item) => {
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
                <div className="swiper-slide" id = {tickets[ticketNo-1]._id}>
                    <div 
                    className={(sel_chk)?"cart-item selected":"cart-item" } 
                    >
                        <CardBody style={{padding: '0 0 0 0'}}>
                            <h6 className="card-title">{manufacturer}</h6>
                            <h6 className="category text-info">{model}</h6>
                            <h6 className="position">X:{tickets[ticketNo-1].coordX} Y:{tickets[ticketNo-1].coordY}</h6>
                        </CardBody>
                    
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
                        <div className="cart-action">
                            <Button
                                className= {"btn-icon btn-round play " + ((tickets[ticketNo-1].coordX!==null)?"btn-info":"btn-secondary") } 
                                onClick={(e)=>{
                                    this.props.updateCartItems({type:"selectTicket",selected_cid: _id, selected_tobj:tickets[ticketNo-1]});
                                }}
                            >
                                <i className="now-ui-icons loader_refresh "></i>
                            </Button>
                            <Button
                                className=" btn-icon btn-round btn-warning add"
                                onClick={(e)=>{
                                    this.props.updateCartItems({type:"addTicket",selected_cid: _id, selected_tobj:tickets[ticketNo-1]});
                                }}
                            >
                                <i className="now-ui-icons ui-1_simple-add"></i> 
                            </Button>
                            <Button
                                className=" btn-icon btn-round btn-secondary remove"
                                onClick={(e)=>{
                                    alert(123);
                                    console.log(_id,tickets[ticketNo-1])
                                    this.props.updateCartItems({type:"removeTicket",selected_cid: _id,selected_tobj:tickets[ticketNo-1]});
                                }}
                            >
                                <i className="now-ui-icons ui-1_simple-remove"></i> 
                            </Button>
                        </div>
                    </div>
              </div>
            )
          });
        } else return []; 
      }














    render() { 
        console.log("render");
        return (
          <div className="mobilePlay">
            <div className="playContainer">
                <div className="botPlay">
                    <div 
                        onTouchStart={this._onTouchStart.bind(this)}
                        onTouchMove={this._onTouchMove.bind(this)}
                        onTouchEnd={this._onTouchEnd.bind(this)}
                        className="botBack has_lines"   
                        style={{
                            backgroundImage: "url(/img/spot-the-ball/game/2.jfif)",
                        }}
                    >
                        <svg id="drawSVG" version="1.1">
                                    {
                                        this.state.sightLines.map(pos =>{
                                            return(<path
                                                d={"M" + pos.x1/this.state.zoomRatio + "," + pos.y1/this.state.zoomRatio + "L" + pos.x2/this.state.zoomRatio + "," + pos.y2/this.state.zoomRatio}
                                                stroke="#f0801f"
                                                strokeWidth={1}
                                                className="straight_line"
                                                fill="none"
                                            />);
                                        })
                                    }
                                    {
                                        this.props.cartItems.map(item => {
                                            return item.tickets.map(tItem => {
                                                if (tItem.coordX === null || tItem.coordY === null) {
                                                    return null;
                                                }
                                                let plus_size = 5;
                                                let cur_x = tItem.coordX/this.state.zoomRatio;
                                                let cur_y = tItem.coordY/this.state.zoomRatio;
                                                return (
                                                    <path
                                                        d={"M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)}
                                                        id={"t"+tItem._id}
                                                        stroke="white"
                                                        strokeWidth={2}
                                                        className="plus_mark"
                                                        fill="none"
                                                    />
                                                );
                                            });
                                        })
                                    }
                        </svg>
                        <div id="dreamboatSpotLens" className="lensComponent">
                            <div id="botbSpotCursor"></div>
                            <div className="dreamboatSpotZoomWrapper" style={{backgroundImage:"url(/img/spot-the-ball/game/2(zoom).jfif)",}}>
                                <svg id="zoomSVG" version="1.1">
                                        {
                                            this.state.sightLines.map(pos =>{
                                                return(<path
                                                    d={"M" + pos.x1 + "," + pos.y1 + "L" + pos.x2 + "," + pos.y2}
                                                    stroke="#f0801f"
                                                    strokeWidth={1}
                                                    className="straight_line"
                                                    fill="none"
                                                />);
                                            })
                                        }
                                        {this.props.cartItems.map(item => {
                                            return item.tickets.map(tItem => {
                                                if (tItem.coordX === null || tItem.coordY === null) {
                                                return null;
                                                }
                                                let plus_size = 10;
                                                let cur_x = tItem.coordX;
                                                let cur_y = tItem.coordY;
                                                return (
                                                <path
                                                    d={"M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)}
                                                    id={"z"+tItem._id}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                    className="plus_mark"
                                                    fill="none"
                                                />
                                                );
                                            });
                                        })}
                                </svg>
                            </div>
                        </div>
                        <div className="live_coordinates">
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
              
              <div className="sidebar">
                <div className="cartItemBar">
                        
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {
                                    this.renderCartItems()
                                }
                            </div>
                        </div>

                </div>


                <div className="toolBar">
                    <Button className="btn-icon btn-round btn-info btn_linepen" onClick={this._onPenLineBtn.bind(this)} >
                        <i className= " penline_btn now-ui-icons design-2_ruler-pencil"></i>
                    </Button>
                    <Button className="calcel_btn btn-icon btn-round btn-danger btn_cancel" onClick={this._onLineCancelBtn.bind(this)}>
                        <i className="now-ui-icons ui-1_simple-remove"></i>
                    </Button>

                    <Button className="undo_btn btn-icon btn-round btn-info " onClick={this._onUndoBtn.bind(this)} >
                        <i className="now-ui-icons arrows-1_refresh-69"></i>
                    </Button>

                    <Button className="removelines_btn btn-icon btn-round btn-info " onClick={this._onRemoveLineBtn.bind(this)}  >
                        <i className="now-ui-icons ui-1_simple-remove"></i>
                    </Button>
                    <Button className="lineshow_btn btn-icon btn-round btn-info"  onClick={this._onLineShowBtn.bind(this)} >
                        <i className="now-ui-icons education_glasses" ></i>
                    </Button>
                    <Button className="goback_btn btn-icon btn-round btn-info " href="/" target="_self" >
                        <i className="now-ui-icons media-1_button-power"></i>
                    </Button>
                </div>
                <div className="procBar">
                    <Button className="btn-info" style={{width: "100%"}} onClick ={(e)=>{
                        this.props.updateCartItems({type: "setPos", posX: Math.floor(this.currentPos.x * this.state.zoomRatio+this.markPos.x), posY: Math.floor(this.currentPos.y * this.state.zoomRatio+this.markPos.y)});
                        this.swiper.slideNext();
                    }}>
                    Place
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default SpotBallMobilePlay;
