/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components

function HomePageFeature() {
  return (
    <>
      <div className="section features">
        <div className="about-description text-center">
          <div className="features-3">
            <Container>
              <Row>
                <Col className="mr-auto ml-auto" md="8">
                  <h2 className="title">HOW DOES IT WORK?</h2>
                  <h4 className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. 
                  </h4>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="info info-hover">
                    <div className="icon icon-success icon-circle">
                      <i className="now-ui-icons shopping_credit-card"></i>
                    </div>
                    <h4 className="info-title">TICKETS FROM 15P</h4>
                    <p className="description">
                      150 Yachts & 200 Lifestyle prizes to win
                    </p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="info info-hover">
                    <div className="icon icon-info icon-circle">
                      <i className="now-ui-icons gestures_tap-01"></i>
                    </div>
                    <h4 className="info-title">PLAY SPOT THE BALL</h4>
                    <p className="description">
                      Choose where you think the missing ball is
                    </p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="info info-hover">
                    <div className="icon icon-primary icon-circle">
                      <i className="now-ui-icons business_money-coins"></i>
                    </div>
                    <h4 className="info-title">WEEKLY WINNER</h4>
                    <p className="description">
                      Established 1999 £32 million of prizes won
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>    
      </div>
    </>
  );
}

export default HomePageFeature;
