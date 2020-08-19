import React, { Component } from "react";
import { Badge, Container, Row, Col } from "reactstrap";

class GalleryBody extends Component {


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

    return (
      <>
        <div className="section section-sections" data-background-color="white">
          <Container>
            <div className="section-cols">
              <Row>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="primary">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/3/395300_-_photo_1_1572368229_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="primary">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="primary">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    <Badge className="price-info" color="info">CASH: 35000$</Badge>
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    <Badge className="price-info" color="info">CASH: 35000$</Badge>
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    <Badge className="price-info" color="info">CASH: 35000$</Badge>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
                <Col md="4">
                  <div className="overlay-info">
                    <img
                      alt="..."
                      src={require("assets/img/boats/1/332937_-_photo_0_1553618453_1553618454_img.jpg")}
                    ></img>
                    <Badge className="category-info" color="info">Trader - 575 Sunliner</Badge>
                    <Badge className="ticket-price-info" color="warning">3.5$</Badge>
                    {/* <Badge className="price-info" color="info">CASH: 35000$</Badge> */}
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default GalleryBody;

