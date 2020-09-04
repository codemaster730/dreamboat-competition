import React from "react";
import Select from "react-select";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";

// core components

function GalleryHeader() {
  let pageHeader = React.createRef();
  const [searchFocus, setSearchFocus] = React.useState(false);
  const [categorySelect, setCategorySelect] = React.useState(null);
  const [modelSelect, setModelSelect] = React.useState(null);

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
      <div className="gallery-page page-header page-header-small">
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
              <h2 className="title">CHOOSE YOUR DREAM BOAT TICKETS</h2>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <h3>NEXT WEEKLY WINNER AT 2020.8.25</h3>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="filter"> 
        <Row>
          <Col md="3">
            <Select
              className="react-select react-select-info mt-2"
              onChange={(value) => setCategorySelect(value)}
              classNamePrefix="react-select"
              placeholder="Category"
              value={categorySelect}
              name=""
              options={[
                {
                  value: "",
                  label: "Find Category",
                  isDisabled: true,
                },
                { value: "2", label: "Trawlers" },
                { value: "3", label: "Work Boats" },
              ]}
            ></Select>
          </Col>
          <Col md="3">
            <Select
              className="react-select react-select-info mt-2"
              onChange={(value) => setModelSelect(value)}
              classNamePrefix="react-select"
              placeholder="Model"
              value={modelSelect}
              name=""
              options={[
                {
                  value: "",
                  label: "Find Model",
                  isDisabled: true,
                },
                { value: "2", label: "575 Sunliner" },
                { value: "3", label: "Harbour Master / Pilot (MCA Cat. 3)" },
              ]}
            ></Select>
          </Col>
          <Col md="6">
            <Form action="" method="">
                  <Row>
                    <Col sm="8">
                      <InputGroup className={searchFocus ? "input-group-focus" : ""}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_zoom-bold"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Enter Boat Model or Boat Category"
                          type="text"
                          onFocus={() => setSearchFocus(true)}
                          onBlur={() => setSearchFocus(false)}
                        ></Input>
                      </InputGroup>
                    </Col>
                    <Col sm="4">
                      <Button
                        block
                        className="btn-round"
                        color="info"
                        type="button"
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default GalleryHeader;
