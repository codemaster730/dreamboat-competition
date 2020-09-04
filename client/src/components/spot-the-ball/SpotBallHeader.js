import React from "react";

// reactstrap components
import {
  Container,
  Row,
  Col,

} from "reactstrap";

// core components

function SpotBallHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });
  return (
    <>
      <div className="spot-ball-page page-header page-header-small">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(/img/jacht03-back.jpg)"
          }}
          ref={pageHeader}
        ></div>
        <Container className="gallery-page-header">
          <Row>
            <Col className="text-center">
              <h2 className="title">SPOT THE BALL</h2>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <h3>YOU ARE ONE STEP AWAY FROM FROM WINNING YOUR BOATS</h3>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default SpotBallHeader;
