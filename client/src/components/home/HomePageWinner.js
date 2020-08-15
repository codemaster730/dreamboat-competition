/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Row, Col, Card, CardBody, CardTitle, CardFooter, Button } from "reactstrap";

// core components

function HomePageWinner() {
  return (
    <>
      <div className="section features">
        <div className="about-description text-center">
          <div className="features-3">
            <div
              className="team-5 section-image"
              style={{
                backgroundImage: "url(" + require("assets/img/jacht02-back.jpg") + ")",
              }}
            >
              <Container>
                <Row>
                  <Col className="ml-auto mr-auto text-center" md="8">
                    <h2 className="title">What Our Winners Say</h2>
                    <h4 className="description">
                      This is the where you can win your dream boats. 
                      Let's give it a try by picking up a nice and beautiful boats.
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <Card className="card-profile">
                      <div className="card-avatar">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="img img-raised"
                            src={require("assets/img/winner-profile3.jpg")}
                          ></img>
                        </a>
                      </div>
                      <CardBody>
                        <CardTitle tag="h3">Natalie Paisley</CardTitle>
                        <h6 className="category text-info">Credit Analyst</h6>
                        <p className="card-description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Nunc in nisi vitae velit dapibus feugiat a eget mauris. 
                        </p>
                        <CardFooter>
                        </CardFooter>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card className="card-profile">
                      <div className="card-avatar">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="img img-raised"
                            src={require("assets/img/winner-profile1.jpg")}
                          ></img>
                        </a>
                      </div>
                      <CardBody>
                        <CardTitle tag="h4">Anthony Jackson</CardTitle>
                        <h6 className="category text-info">Desktop Publisher</h6>
                        <p className="card-description">
                          Fusce quis mollis mauris. Morbi malesuada magna faucibus auctor lobortis. 
                          Donec rutrum mollis molestie. Nullam faucibus tincidunt tempus.
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card className="card-profile">
                      <div className="card-avatar">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="img img-raised"
                            src={require("assets/img/winner-profile4.jpg")}
                          ></img>
                        </a>
                      </div>
                      <CardBody>
                        <CardTitle tag="h4">Bella Audrey</CardTitle>
                        <h6 className="category text-info">Economist</h6>
                        <p className="card-description">
                          Aliquam efficitur, enim eget gravida auctor, nisl odio mattis 
                          sapien, eu semper lacus sapien in ante. 
                        </p>
                        <CardFooter>
                        </CardFooter>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>    
      </div>
    </>
  );
}

export default HomePageWinner;
