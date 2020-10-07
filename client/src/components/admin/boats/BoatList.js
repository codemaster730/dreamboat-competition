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
import defaultImage from "../../../assets/img/Upload-PNG-Image-File.png";

const constant = require("../../shared/constants");

class BoatList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      boats: [],
      modalView: false,
      selectedBoat: {},
      acceptedFiles: [],
      errors: [],
      total: 0
    }
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    document.body.classList.add("boat-admin-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    this.getBoatList();
  }

  getBoatList() {
    axios
      .post('/api/boatadmin/boatlist', {})
    .then((res) => {
      this.setState({boats: res.data.boats});
    }).catch((err) => {
      console.log(err);
    });
  }

  editBoat(boat) {
    this.setState({modalView: true, selectedBoat: boat, imagePreviewUrl: (boat.images.length>0?boat.images[0]:defaultImage)});
  }

  removeBoat(boat) {
    axios
    .delete(`/api/boatadmin/boat/${boat._id}`)
    .then((res) => {
      toast.info(res.data.message);
      this.getBoatList();
    }).catch((err) => {
      console.log(err);
    });
  }

  onSaveEdit = () =>{
    var boat = {...this.state.selectedBoat};
    var inputs = document.getElementsByClassName("boat-input");
    if(inputs.length>0){
      for(var i=0; i<inputs.length; i++){
        boat[inputs[i].name] = inputs[i].value;
      }
    }
    if(boat._id){                                           //update
      axios
      .put(`/api/boatadmin/boat/${boat._id}`, {boat: boat})
      .then((res) => {
        //toast.info(res.data.message);
        this.setState({modalView: false, selectedBoat: {}});
        this.getBoatList();
      }).catch((err) => {
        console.log(err);
      });
    }else{                                                  //create
      axios
      .post(`/api/boatadmin/boat/create`,{boat:boat})
      .then((res) => {
        toast.info(res.data.message);
        this.setState({modalView: false, selectedBoat: {}});
        this.getBoatList();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  imageRemove=(e) =>{
    console.log("ssssss",e);
    var selBoat = {...this.state.selectedBoat};
    selBoat.images.splice(e,1);
    this.setState({selectedBoat: selBoat});
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
      
      console.log("1111",files);
      const formData = new FormData();
      for(var i=0; i<files.length; i++)
        formData.append('file', files[i].file);
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
        .post('/api/boatadmin/boat/upload_img', formData, config)
        .then(res => {
          console.log(res.data);   
            var selBoat = {...this.state.selectedBoat};
            if(!selBoat.images)
              selBoat.images = [];
            selBoat.images.push(...res.data.paths);
            console.log(selBoat.images);
            this.setState({selectedBoat: selBoat});
            toast.info('You have successfully uploaded your Logo');
        }).catch((err) => {
          console.log(err);
        });
    } 
  }









  componentWillUnmount() {
    document.body.classList.remove("boat-admin-page");
    document.body.classList.remove("sidebar-collapse");
  }

  renderBoatListTableData() {
    let number = 0;
    return this.state.boats.map((boat) => {
      number += 1;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left">
            <img src={boat.images[0]} style={{ aspectRatio: '4/3'}} alt={boat.model} ></img>
          </td>
          <td className="text-left">{boat.model}</td>
          <td className="text-left">{boat.category}</td>
          <td className="text-left">{boat.manufacturer}</td>
          <td className="text-left">{boat.prizePrice}</td>
          <td className="text-left">{boat.currency}</td>
          <td className="text-left">{boat.length}</td>
          <td className="text-left">{boat.width}</td>
          <td className="text-left">{boat.description}</td>
          <td className="text-left">{boat.ticketPrice}</td>
          <td className="text-right">
            <>
              <Button
                id="edit-boat"
                className="btn-icon mr-1"
                color="success"
                size="sm"
                type="button"
                onClick={() => this.editBoat(boat)}
              >
                <i className="now-ui-icons ui-2_settings-90"></i>
              </Button>
            </>
            <>
              <Button
                id="delete-boat"
                className="btn-icon"
                color="danger"
                size="sm"
                type="button"
                onClick={() => this.removeBoat(boat)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </Button>
            </>
          </td>
        </tr>
      );
    });
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
                  <h3 className="title">Boat Management</h3>
                  <Label> Add, Edit or Delete Boats</Label>
                </div>
              </Row>
              <Row>
                <div className="mr-auto ml-auto col-md-8">                  
                  <Card className="card-plain mt-2 table-card">
                    <CardBody>
                      <Button className="btn-cpp" type="button" onClick={()=>{
                        this.setState({modalView: true, selectedBoat: {}});
                      }}>
                        Add new Boat
                      </Button>
                      {this.state.boats.length > 0 ?
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left">Images</th>
                              <th className="text-left">Model</th>
                              <th className="text-left">Category</th>
                              <th className="text-left">Manufacturer</th>
                              <th className="text-left">Prize Price</th>
                              <th className="text-left">Currency</th>
                              <th className="text-left">Length</th>
                              <th className="text-left">Width</th>
                              <th className="text-left">Description</th>
                              <th className="text-left">Ticket Price</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.renderBoatListTableData()
                            }
                          </tbody>
                        </Table>
                        :
                        <h4>No BoatList Found</h4>
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
                  <h4 className="title title-up">{this.state.selectedBoat._id?"Edit Boat":"Add New Boat"}</h4>
                </div>
                <div className="modal-body">
                    <Row >
                      <Col md="4">
                        <Row className="justify-content-md-center">
                        {
                            this.state.selectedBoat.images?(
                              this.state.selectedBoat.images.map((img,i) =>
                              <Col xs="4" sm="4" md="3">
                                <img src={img} alt="boat"></img>
                                <div className="img-remover" onClick={()=>this.imageRemove(i)}>
                                  <i class="now-ui-icons ui-1_simple-remove"></i>
                                </div>
                              </Col>
                          )
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
                                  Model:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "model"
                                  placeholder="Model"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.model}
                                ></Input>
                              </FormGroup>
                            </Col>

                            <Col lg="4" sm="6">
                              <FormGroup>
                                <Label>
                                  Category:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "category"
                                  placeholder="Category"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.category}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <Col lg="4" sm="6">
                              <FormGroup>
                                <Label>
                                  Manufacturer:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "manufacturer"
                                  placeholder="Manufacturer"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.manufacturer}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <hr style={{width:'100%', align:'left'}}/>
                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Prize Price:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "prizePrice"
                                  defaultValue={this.state.selectedBoat.prizePrice}
                                  placeholder="Prize Price"
                                  type="text"
                                ></Input>
                              </FormGroup>
                            </Col>

                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Currency:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "currency"
                                  placeholder="Currency"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.currency}
                                ></Input>
                              </FormGroup>
                            </Col>

                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Length:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "length"
                                  placeholder="Length"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.length}
                                ></Input>
                              </FormGroup>
                            </Col>

                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Width:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "width"
                                  placeholder="Width"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.width}
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
                                  className = "boat-input"
                                  rows="4"
                                  cols="80"
                                  name="description"
                                  type="textarea"
                                  placeholder="You can write your description here..."
                                  defaultValue={this.state.selectedBoat.description}
                                ></Input>
                              </FormGroup>
                            </Col>
                            <hr style={{width:'100%', align:'left'}}/>
                            <Col lg="2" sm="6">
                              <FormGroup>
                                <Label>
                                  Ticket Price:
                                </Label>
                                <Input
                                  className = "boat-input"
                                  name = "ticketPrice"
                                  placeholder="Ticket Price"
                                  type="text"
                                  defaultValue={this.state.selectedBoat.ticketPrice}
                                ></Input>
                              </FormGroup>
                            </Col>


                          </Row>
                          
                      </Col>
                    </Row>
                  
                </div>
                <ModalFooter>
                  <Button color="default" type="button" onClick={this.onSaveEdit}>
                    {this.state.selectedBoat._id?"Save boat":"Add new Boat"}
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

BoatList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(BoatList);