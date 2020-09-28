import React from "react";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

// core components

function HomePageHeader() {
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
      <div className="page-header page-header-small">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(/img/jacht03-back.jpg)"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <Row className="home-page-header">
            <Col className="ml-auto home-title" md="9">
              <h1 className="title">WIN YOUR DREAM BOAT</h1>
            </Col>
            <Col className="ml-auto home-description" md="7">
              <h4 className="description">
              The winner of our free-to-enter prize draw will be offered
              a six-berth three-cabin yacht for a week’s charter
              in one of over 60 destinations worldwide.
              Events close on Every Thursday.
              </h4>
              <br></br>
              <div className="buttons">
                <Button
                  className="btn-icon btn-neutral"
                  color="link"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  size="lg"
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-icon btn-neutral"
                  color="link"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  size="lg"
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-icon btn-neutral"
                  color="link"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  size="lg"
                >
                  <i className="fab fa-get-pocket"></i>
                </Button>
                <Button
                  className="mr-3"
                  color="info"
                  href="/boats"
                  size="lg"
                >
                  Enter Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default HomePageHeader;
