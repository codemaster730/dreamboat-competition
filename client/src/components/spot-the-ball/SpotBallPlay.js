import React, { Component }  from 'react';
import * as d3 from 'd3';
import '../spot-the-ball/SpotBall.css';

class SpotBallPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      down_chk: false,
      show_chk: false, 
      move_x: -100, 
      move_y: -100,
      pen_chk: true,
      cur_color: "yellow",
      backImg: "",
    }
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
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

  _onMouseMove_Z(e) {
    var cur_x = (e.nativeEvent.offsetX - 32)/4 + this.state.move_x;
    var cur_y = (e.nativeEvent.offsetY - 32)/4 + this.state.move_y;
    var offsX = e.nativeEvent.offsetX - 32;
    var offsY = e.nativeEvent.offsetY - 32;
    var lengs = Math.sqrt(offsX*offsX + offsY*offsY);
    //const boundOutChk = (cur_x<0) || (cur_y<0) || (cur_x>d3.select("#botbSpotLens").attr("width")) || (cur_y>d3.select("#botbSpotLens").attr("height"));
    const boundOutChk = (cur_x<0) || (cur_y<0) || (cur_x>736) || (cur_y>556);
    //moving zoom
    if(lengs >= 20 && !boundOutChk){
      var movex = Math.round(this.state.move_x + offsX * (lengs - 20) / lengs);
      var movey = Math.round(this.state.move_y + offsY * (lengs - 20) / lengs);
      this.setState({ move_x: movex, move_y: movey});
      d3.select(".lensComponent")
            .attr("style","top:"+(movey-12)+"px;left:"+(movex-12)+"px;");
      d3.select(".live_coordinates")
            .attr("style","top:"+(movey-40)+"px;left:"+(movex-20)+"px;");
      // document.getElementsById("dreamboatSpotZoomWrapper").style.left = (-movex*4+32)+"px";
      // document.getElementsById("dreamboatSpotZoomWrapper").style.top = (-movey*4+32)+"px";
      d3.select("#dreamboatSpotZoomWrapper").attr("style","top:"+(-movey*4+32)+"px;left:"+(-movex*4+32)+"px; background-image:url(" +this.props.backImg+"); ");
      
    }

    const pos = this._getRayPositions(this.state.x, this.state.y, cur_x, cur_y)
    if(this.state.down_chk && (this.state.pen_chk)){
      if (pos.isline) {
        d3.select("#ltest")
              .attr("d","M" + pos.x1 + "," + pos.y1 + "L" + pos.x2 + "," + pos.y2)
              .attr("stroke-width", 1)
              .attr("fill", "none");
        d3.select("#ltestz")
              .attr("d","M" +pos.x1 * 4 +"," +pos.y1 * 4 +"L" +pos.x2 * 4 +"," +pos.y2 * 4)
              .attr("stroke-width", 1)
              .attr("fill", "none");
      }      
    }
    d3.select(".live_coordinates")
            .html("X:"+(cur_x*4)+"&nbsp;&nbsp;Y:"+(cur_y*4));
            
  }

  _onMouseMove(e) {
    var cur_x = e.nativeEvent.offsetX;
    var cur_y = e.nativeEvent.offsetY;
    //moving zoom
      var mdelt_x = cur_x - this.state.move_x;
      var mdelt_y = cur_y - this.state.move_y;
      var lengs = Math.sqrt(mdelt_x*mdelt_x + mdelt_y*mdelt_y);
      cur_x = Math.round(this.state.move_x + mdelt_x*(lengs - 20)/lengs );
      cur_y = Math.round(this.state.move_y + mdelt_y*(lengs - 20)/lengs );
      d3.select(".live_coordinates")
            .attr("style","top:"+(cur_y-40)+"px;left:"+(cur_x-20)+"px;");
      d3.select(".lensComponent")
            .attr("style","top:"+(cur_y-12)+"px;left:"+(cur_x-12)+"px;");
    // to move drawing line
    const pos = this._getRayPositions(this.state.x, this.state.y, cur_x, cur_y)
    if (this.state.down_chk && this.state.pen_chk) {
      if (pos.isline) {
        d3.select("#ltest").attr("d","M" + pos.x1 + "," + pos.y1 + "L" + pos.x2 + "," + pos.y2)
        d3.select("#ltestz").attr("d","M" +pos.x1 * 4 +"," +pos.y1 * 4 +"L" +pos.x2 * 4 +"," +pos.y2 * 4)
      }
    }
    this.setState({ move_x: cur_x, move_y:cur_y});
    // const ele = document.getElementsById("dreamboatSpotZoomWrapper");
    // ele.style.left = (-cur_x*4+32)+"px";
    // document.getElementsById("dreamboatSpotZoomWrapper").style.top = (-cur_y*4+32)+"px";
    d3.select("#dreamboatSpotZoomWrapper").attr("style","top:"+(-cur_y*4+32)+"px;left:"+(-cur_x*4+32)+"px; background-image:url(" +this.props.backImg+"); ");
  }

  _onMouseDown(e) {
    var cur_x = (e.nativeEvent.offsetX-32)/4 + this.state.move_x;
    var cur_y = (e.nativeEvent.offsetY-32)/4 + this.state.move_y;

    this.setState({ x: cur_x, y: cur_y, down_chk:true});
        
    if(this.state.pen_chk){
      d3.select("#drawSVG").append("path")
                        .attr("d", "M"+this.state.x+","+this.state.y+"L"+this.state.x+","+this.state.y)
                        .attr("stroke", this.state.cur_color)
                        .attr("stroke-width", 1)
                        .attr("fill", "none")
                        .attr("id","ltest");
      d3.select("#zoomSVG").append("path")
                        .attr("d", "M"+(this.state.x*4)+","+(this.state.y*4)+"L"+(this.state.x*4)+","+(this.state.y*4))
                        .attr("stroke", this.state.cur_color)
                        .attr("stroke-width", 1)
                        .attr("fill", "none")
                        .attr("id","ltestz");
    }
    d3.select("#dreamboatSpotImage")
                .attr("class","drawing_lines");
  }

  _onMouseUp(e) {
    d3.select("#ltest").remove();
    d3.select("#ltestz").remove(); 
    d3.select("#dreamboatSpotImage")
                .attr("class","has_lines");
    this.setState({down_chk:false});

    var cur_x = (e.nativeEvent.offsetX-32)/4 + this.state.move_x;
    var cur_y = (e.nativeEvent.offsetY-32)/4 + this.state.move_y;
    
    if(this.state.pen_chk){// create line
      const pos = this._getRayPositions(this.state.x, this.state.y, cur_x, cur_y)
        if (pos.isline) {
          d3.select("#drawSVG").append("path")
                            .attr("d","M" + pos.x1 + "," + pos.y1 + "L" + pos.x2 + "," + pos.y2)
                            .attr("stroke", this.state.cur_color)
                            .attr("stroke-width", 1)
                            .attr("class","straight_line")
                            .attr("fill", "none");
          d3.select("#zoomSVG").append("path")
                            .attr("d","M" +pos.x1 * 4 +"," +pos.y1 * 4 +"L" +pos.x2 * 4 +"," +pos.y2 * 4)
                            .attr("stroke", this.state.cur_color)
                            .attr("stroke-width", 1)
                            .attr("class","straight_line")
                            .attr("fill", "none");
        }      
    }else{//create plus mark
  /*    var plus_size = 10;
      d3.select("#drawSVG").append("path")
                          .attr("d", "M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size))
                          .attr("id","spotMarkX"+(cur_x*4)+"Y"+(cur_y*4)) //note: identify marks
                          .attr("stroke", "white")
                          .attr("stroke-width", 2)
                          .attr("class","plus_mark")
                          .attr("fill", "none");
      cur_x *= 4;
      cur_y *= 4;
      d3.select("#zoomSVG").append("path")
                          .attr("d", "M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size))
                          .attr("id","spotMarkX"+cur_x+"Y"+cur_y) //note: identify marks
                          .attr("stroke", "white")
                          .attr("stroke-width", 2)
                          .attr("class","plus_mark")
                          .attr("fill", "none");
*/                          
      //call SpotBallMain
      let param={type:"setPos",posX:cur_x*4,posY:cur_y*4};
      this.props.updateCartItems(param);
    }
    
  }
  

  handlePenToggle = () => {
    this.setState({pen_chk:false});
  }

  handleLineToggle = () => {
    this.setState({pen_chk:true});
  }

  handleUndoEvent = () => {
    d3.selectAll("#drawSVG path.straight_line").filter(":last-child").remove();
    d3.selectAll("#zoomSVG path.straight_line").filter(":last-child").remove();
    //d3.select("path.straight_line").remove();
  }

  handleClearEvent = () => {
    d3.select("#drawSVG").selectAll(".straight_line").remove();
    d3.select("#zoomSVG").selectAll(".straight_line").remove();
  }

  handleShowHideToggle = () => {
    this.setState({show_chk:!this.state.show_chk});
    if(this.state.show_chk){
      d3.select("#drawSVG").selectAll(".straight_line").attr("display","block");
      d3.select("#zoomSVG").selectAll(".straight_line").attr("display","block");
    }else{
      d3.select("#drawSVG").selectAll(".straight_line").attr("display","none");
      d3.select("#zoomSVG").selectAll(".straight_line").attr("display","none");
    }
  } 

  render() {
    return (
      <>
        <div id="dreamboatSpotImage" class="has_lines" style={{backgroundImage: "url("+this.props.backImg+")"}}>
          <svg id = "drawSVG" height="556" version="1.1" width="736"  onMouseMove={this._onMouseMove.bind(this)}>
            {this.props.cartItems.map(item => {
              return item.tickets.map(tItem => {
                if (tItem.coordX === null || tItem.coordY === null) {
                  return null;
                }
                let plus_size = 10;
                let cur_x = tItem.coordX/4;
                let cur_y = tItem.coordY/4;
                return (
                  <path
                    d={"M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)}
                    id={"spotMarkX"+cur_x+"Y"+cur_y}
                    stroke="white"
                    strokeWidth={2}
                    className="plus_mark"
                    fill="none"
                  />
                );
              });
            })}
          </svg>
          <div id="dreamboatSpotLens" class="lensComponent" onMouseDown={this._onMouseDown.bind(this)} onMouseUp={this._onMouseUp.bind(this)} onMouseMove={this._onMouseMove_Z.bind(this)}>
            <div id="markdiv">
              <svg id="markSVG" height="64" version="1.1" width="64">
                <path d="M22,32L42,32L32,32L32,22L32,42" id="spotMarkee" stroke="grey" stroke-width="1" fill="none"></path>
              </svg>
            </div>
            <div id="dreamboatSpotZoomWrapper" style={{backgroundImage: "url("+this.props.backImg+")"}} >
              <svg id="zoomSVG" version="1.1">
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
                          id={"spotMarkX"+cur_x+"Y"+cur_y}
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
          <div class="live_coordinates">
            X:{this.state.move_x*4}&nbsp;&nbsp;Y:{this.state.move_y*4}
          </div>
        </div>
      </>
    );
  }
}

export default SpotBallPlay;
