import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Modal, ModalFooter} from 'reactstrap';
import Dropzone from 'react-dropzone-uploader';

import 'react-toastify/dist/ReactToastify.css';
import 'react-dropzone-uploader/dist/styles.css'
// reactstrap components
import {
  Row,
  Col,
  FormGroup,
  Input,
  Card,
  CardBody,
  Table,
  Button,
  Label
} from "reactstrap";

// core components
import DropdownScrollNavbar from "../shared/DropdownScrollNavbar.js";

const constant = require("../../shared/constants");

class SpotBallList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      spotballs: [],
      modalView: false,
      selectedSpotBall: {},
      acceptedFiles: [],
      errors: [],
      total: 0,
      zoomRatio: 4,
    }
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    document.body.classList.add("spotball-admin-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    this.getSpotBallList();
  }

  updateWindowDimensions = () =>{
    var eleBack = document.getElementsByClassName("spotBack")[0];
    var eleImg = document.getElementsByClassName("spotImg")[0];
    var eleSvg = document.getElementsByClassName("markSVG")[0];
    if(eleBack){
      eleBack.style.height = (eleBack.clientWidth*3/4) + "px";
      eleImg.style.width = eleBack.clientWidth+ "px";
      eleImg.style.height = eleBack.clientHeight+ "px";
      eleSvg.style.width = eleBack.clientWidth+ "px";
      eleSvg.style.height = eleBack.clientHeight+ "px";
      if(eleBack.clientWidth>0){
        console.log(this.state.selectedSpotBall);
        this.setState({zoomRatio: this.state.selectedSpotBall.width/eleBack.clientWidth});
      }
    }
  }

  getSpotBallList() {
    axios
      .post('/api/spotballadmin/spotballlist', {})
    .then((res) => {
      this.setState({spotballs: res.data.spotballs});
    }).catch((err) => {
      console.log(err);
    });
  }

  editSpotBall(spotball) {
    this.setState({modalView: true, selectedSpotBall: spotball},()=>{
    });
    var _this = this;
    setTimeout(
      function(){
        _this.updateWindowDimensions();
      }, 1000);
  }

  removeSpotBall(spotball) {
    axios
    .delete(`/api/spotballadmin/spotball/${spotball._id}`)
    .then((res) => {
      toast.info(res.data.message);
      this.getSpotBallList();
    }).catch((err) => {
      console.log(err);
    });
  }

  onSaveEdit = () =>{
    var spotball = {...this.state.selectedSpotBall};
    var inputs = document.getElementsByClassName("spotball-input");
    if(inputs.length>0){
      for(var i=0; i<inputs.length; i++){
        spotball[inputs[i].name] = inputs[i].value;
        if(inputs[i].name==="active"){
          spotball[inputs[i].name] = inputs[i].checked;
        }
      }
    }
    if(spotball._id){                                           //update
      axios
      .put(`/api/spotballadmin/spotball/${spotball._id}`, {spotball: spotball})
      .then((res) => {
        toast.info(res.data.message);
        this.setState({modalView: false});
        this.getSpotBallList();
      }).catch((err) => {
        console.log(err);
      });
    }else{                                                  //create
      axios
      .post(`/api/spotballadmin/spotball/create`,{spotball:spotball})
      .then((res) => {
        toast.info(res.data.message);
        this.setState({modalView: false});
        this.getSpotBallList();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  imageRemove=(e) =>{
    var selSpotBall = {...this.state.selectedSpotBall};
    selSpotBall.images.splice(e,1);
    this.setState({selectedSpotBall: selSpotBall});
  }

  modalImageClick = (e) =>{
    let eleCircle = document.getElementsByClassName("circleMark")[0];
    eleCircle.setAttribute("cx", e.nativeEvent.offsetX);
    eleCircle.setAttribute("cy", e.nativeEvent.offsetY);
    document.getElementsByName("goalCoordX")[0].value = Math.floor(e.nativeEvent.offsetX * this.state.zoomRatio);
    document.getElementsByName("goalCoordY")[0].value = Math.floor(e.nativeEvent.offsetY * this.state.zoomRatio);
    let plus_size = 5;
    let cur_x = e.nativeEvent.offsetX;
    let cur_y = e.nativeEvent.offsetY;
    let elePlus = document.getElementsByClassName("plusMark")[0];
    elePlus.setAttribute("d", ("M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)));
  }

//-------------------------------upload---------------------------------------------

// specify upload params and url for your files
getUploadParams = ({ meta }) => { 
  return { url: 'https://httpbin.org/post' } 
}  
handleChangeStatus = ({ meta, file }, status) => { 
}
handleSubmit = (files, allFiles) => {
  this.handleUploadEvent(files);
  allFiles.forEach(f => f.remove())
}
uploadValidate = imageList =>{
  let selectedImage = imageList.file;
  if (!selectedImage.type.match('image.*')) {
    return "Only image files are allowed";
  } else if (selectedImage.size > constant['MAX_UPLOAD_FILE_SIZE']) {
    return "Maximum file size exceeded";
  }
}

  handleUploadEvent=(files) =>{
    if (files) {      
      var width=0, height=0;
      console.log("1111",files);
      width = files[0].meta.width;
      height = files[0].meta.height;
      const formData = new FormData();
      formData.append('file', files[0].file);
      const config = {    
        mode: 'no-cors',
        method: "POST", 
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "type": "formData"
        }
      }
      axios
        .post('/api/spotballadmin/spotball/upload_img', formData, config)
        .then(res => {
          console.log(res.data);   
            var selSpotBall = {...this.state.selectedSpotBall};
            selSpotBall.image = res.data.path;
            selSpotBall.width = width;
            selSpotBall.height = height;
            this.setState({selectedSpotBall: selSpotBall});
            toast.info('You have successfully uploaded your Logo');
        }).catch((err) => {
          console.log(err);
        });
    } 
  }

  componentWillUnmount() {
    document.body.classList.remove("spotball-admin-page");
    document.body.classList.remove("sidebar-collapse");
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  handleInputChange = (e) =>{
    let eleCircle = document.getElementsByClassName("circleMark")[0];
    eleCircle.setAttribute("r", e.currentTarget.value/this.state.zoomRatio);
  }

  renderSpotBallListTableData() {
    let number = 0;
    return this.state.spotballs.map((spotball) => {
      number += 1;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left">
            <img src={spotball.image} style={{width:'100px', height:'80px' }} alt={spotball.title} ></img>
          </td>
          <td className="text-left">{spotball.title}</td>
          <td className="text-left">{spotball.width}*{spotball.height}</td>
          <td className="text-left">{spotball.description}</td>
          <td className="text-right">
            <>
              <Button
                id="edit-spotball"
                className="btn-icon mr-1"
                color={spotball.active?"success":"secondary"}
                size="sm"
                type="button"
                onClick={() => this.editSpotBall(spotball)}
              >
                <i className="now-ui-icons ui-2_settings-90"></i>
              </Button>
            </>
            <>
              <Button
                id="delete-spotball"
                className="btn-icon"
                color="danger"
                size="sm"
                type="button"
                onClick={() => this.removeSpotBall(spotball)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </Button>
            </>
          </td>
        </tr>
      );
    });
  }
  renderSvg(){
      let plus_size = 5;
      let cur_x = this.state.selectedSpotBall.goalCoordX/this.state.zoomRatio;
      let cur_y = this.state.selectedSpotBall.goalCoordY/this.state.zoomRatio;
      let radius = this.state.selectedSpotBall.goalRadius/this.state.zoomRatio;
      return (
        <>
          <path
              d={"M"+(cur_x-plus_size)+","+(cur_y)+"L"+(cur_x+plus_size)+","+(cur_y)+"L"+(cur_x)+","+(cur_y)+"L"+(cur_x)+","+(cur_y+plus_size)+"L"+(cur_x)+","+(cur_y-plus_size)}
              stroke="white"
              strokeWidth={2}
              className="plusMark"
              fill="none"
              style={{left: '50%'}}
          />
          <circle className="circleMark" cx={cur_x} cy={cur_y} r={radius} fill="yellow" opacity="0.3" />
          </>
      );

  }
  render() {
    return (
      <>
        <DropdownScrollNavbar/>
        
        <div className="wrapper">
          <div className="home">
            <div className="panel">
              <Row>
                <div className="mr-auto ml-auto col-md-8" style={{textAlign: 'center'}}>
                  <p style={{ marginTop:'50px' }} />
                  <h3 className="title">SpotBall Setting</h3>
                  <Label> Add, Edit or Delete SpotBalls</Label>
                </div>
              </Row>
              <Row>
                <div className="mr-auto ml-auto col-md-8">
                  <Card className="card-plain mt-2 table-card">
                    <CardBody>
                      <Button className="btn-cpp" type="button" onClick={()=>{
                        this.setState({modalView: true, selectedSpotBall: {}});
                      }}>
                        Add new SpotBall
                      </Button>
                      {this.state.spotballs.length > 0 ?
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left">Image</th>
                              <th className="text-left">Title</th>
                              <th className="text-left">Dimension</th>
                              <th className="text-left">Description</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.renderSpotBallListTableData()
                            }
                          </tbody>
                        </Table>
                        :
                        <h4>No SpotBallList Found</h4>
                      }
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </div>
          </div>

          <div>
              <Modal
                isOpen={this.state.modalView}
                toggle={() => {
                  this.setState({modalView: !this.state.modalView})
                }}
              >
                <div className="modal-header">
                  <button
                    aria-hidden={true}
                    className="close"
                    onClick={() => {
                      this.setState({modalView: false});
                    }}
                    type="button"
                  >
                    <i className="now-ui-icons ui-1_simple-remove"></i>
                  </button>
                  <h4 className="title title-up">{this.state.selectedSpotBall._id?"Edit SpotBall":"Add New SpotBall"}</h4>
                </div>
                <div className="modal-body">
                    <Row >
                      <Col md="4">
                        <Row className="justify-content-md-center">
                        {
                          this.state.selectedSpotBall.image?(
                            <Col xs="12" >
                              <div className="spotBack"  onMouseDown={this.modalImageClick}>
                                <svg className="markSVG" version="1.1" style={{ position:'absolute' }} >
                                {
                                  this.renderSvg()
                                }
                                </svg>
                                <img className="spotImg" src={this.state.selectedSpotBall.image} alt={this.state.selectedSpotBall.title}></img>
                              </div>
                            </Col>
                          ):"Image file not exists."
                        }
                        </Row>
                        <Dropzone
                          getUploadParams={this.getUploadParams}
                          onChangeStatus={this.handleChangeStatus}
                          onSubmit={this.handleSubmit}
                          validate={this.uploadValidate}
                          accept="image/*"
                        />
                      </Col>
                      <Col md="8">
                          <Row>
                            <Col lg="3" sm="6">
                              <FormGroup>
                                <Label>
                                  Title:
                                </Label>
                                <Input
                                  className = "spotball-input"
                                  name = "title"
                                  placeholder="Title"
                                  type="text"
                                  defaultValue={this.state.selectedSpotBall.title}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <hr style={{width:'100%', align:'left'}}/>
                            <Col lg="11" sm="6">
                              <FormGroup>
                                <Label>
                                  Description:
                                </Label>
                                <Input
                                  className = "spotball-input"
                                  rows="4"
                                  cols="80"
                                  name="description"
                                  type="textarea"
                                  placeholder="You can write your description here..."
                                  defaultValue={this.state.selectedSpotBall.description}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Goal Position X:
                                </Label>
                                <Input
                                  className = "spotball-input"
                                  name = "goalCoordX"
                                  type="text"
                                  defaultValue={this.state.selectedSpotBall.goalCoordX}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Goal Position Y:
                                </Label>
                                <Input
                                  className = "spotball-input"
                                  name = "goalCoordY"
                                  type="text"
                                  defaultValue={this.state.selectedSpotBall.goalCoordY}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Goal Area Radius:
                                </Label>
                                <input
                                  onInput={this.handleInputChange}
                                  className = "spotball-input"
                                  name = "goalRadius"
                                  type="range"
                                  min="1"
                                  max={this.state.selectedSpotBall.width}
                                  defaultValue={this.state.selectedSpotBall._id?this.state.selectedSpotBall.goalRadius:200}
                                  step="1"/>
                              </FormGroup>
                            </Col>
                            <hr style={{width:'100%', align:'left'}}/>
                            <Col lg="2" sm="2">                             

                              <FormGroup check>
                              <Label check>
                                <Input 
                                  className = "spotball-input"
                                  name = "active"
                                  disabled = {this.state.selectedSpotBall.active}
                                  defaultChecked={this.state.selectedSpotBall.active}
                                  type="checkbox" >
                                </Input>
                                <span className="form-check-sign"></span>
                                Active
                              </Label>
                            </FormGroup>
                            </Col>
                          </Row>
                          
                      </Col>
                    </Row>
                  
                </div>
                <ModalFooter>
                  <Button color="default" type="button" onClick={this.onSaveEdit}>
                    {this.state.selectedSpotBall._id?"Save SpotBall":"Add new SpotBall"}
                  </Button>
                  <Button color="danger" onClick={() => {
                    this.setState({modalView: false});
                  }}>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
          </div>
          
          <ToastContainer />
        </div>
      </>
    );
  }
}

SpotBallList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(SpotBallList);