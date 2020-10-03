import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
  Label,
  FormGroup
} from "reactstrap";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import Footer from "components/shared/Footer.js";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      email2: "",
      password: "",
      password2: "",
      country: "",
      termcheck: false,
      errors: {},
      firstFocus: false,
      lastFocus: false,
      emailFocus: false,
      email2Focus: false,
      passwordFocus: false,
      password2Focus: false,
      phoneFocus: false,
      phone2Focus: false,
      countryFocus: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to home
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }
  
  componentWillUnmount() {
    document.body.classList.remove("login-page");
    document.body.classList.remove("sidebar-collapse");
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onChangeTermCheck = e =>{
    if(e.target.checked){
      window.open('https://www.dreamboatcompetitions.co.uk/terms/DreamboatTC.pdf',"_blank");
    }
    this.setState({ termcheck: e.target.checked });
  }

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
        firstName: this.state.lastName,
        lastName: this.state.lastName,
        email: this.state.email,
        email2: this.state.email2,
        phone: this.state.phone,
        phone2: this.state.phone2,
        password: this.state.password,
        password2: this.state.password2,
        country: this.state.country,
        termcheck: this.state.termcheck ? "on":"",
      };
      this.props.registerUser(newUser, this.props.history); 
  };

  render() {
    const { errors } = this.state;
    return (
      <>
        <DropdownScrollNavbar />
        <div className="page-header header-filter" filter-color="blue">
          <div
            className="page-header-image"
            style={{
              backgroundImage: "url(/img/login.jpg)"
            }}
          ></div>
          <div className="content">
            <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="8">
                <Card className="card-login card-plain">
                  <Form noValidate action="" className="form" method="" onSubmit={this.onSubmit}>
                    <CardHeader className="text-center">
                      <div className="logo-container">
                        {/* <img
                          alt="..."
                          src="/img/now-logo.png"
                        ></img> */}
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col className="pr-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.firstFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.firstName}
                                error={errors.firstName}
                                placeholder="First Name"
                                id="firstName"
                                type="text"
                                onFocus={() => this.setState({firstFocus: true})}
                                onBlur={() => this.setState({firstFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.firstName}</span>
                          </Row>
                        </Col>
                        <Col className="pl-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.lastFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.lastName}
                                error={errors.lastName}
                                placeholder="Last Name"
                                id="lastName"
                                type="text"
                                onFocus={() => this.setState({lastFocus: true})}
                                onBlur={() => this.setState({lastFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.lastName}</span>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.emailFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons ui-1_email-85"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.email}
                                error={errors.email}
                                placeholder="Email"
                                id="email"
                                type="email"
                                onFocus={() => this.setState({emailFocus: true})}
                                onBlur={() => this.setState({emailFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.email}</span>
                          </Row>
                        </Col>
                        <Col className="pl-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.email2Focus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons ui-1_email-85"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.email2}
                                error={errors.email2}
                                placeholder="Confirm Email"
                                id="email2"
                                type="email"
                                onFocus={() => this.setState({email2Focus: true})}
                                onBlur={() => this.setState({email2Focus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.email2}</span>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.passwordFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={errors.password}
                                placeholder="Password"
                                id="password"
                                type="password"
                                onFocus={() => this.setState({passwordFocus: true})}
                                onBlur={() => this.setState({passwordFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.password}</span>
                          </Row>
                        </Col>
                        <Col className="pl-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.password2Focus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.password2}
                                error={errors.password2}
                                placeholder="Confirm Password"
                                id="password2"
                                type="password"
                                onFocus={() => this.setState({password2Focus: true})}
                                onBlur={() => this.setState({password2Focus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.password2}</span>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.phoneFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.phone}
                                error={errors.phone}
                                placeholder="Phone 1"
                                id="phone"
                                type="number"
                                onFocus={() => this.setState({phoneFocus: true})}
                                onBlur={() => this.setState({phoneFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.phone}</span>
                          </Row>
                        </Col>
                        <Col className="pl-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" + 
                                (this.state.phone2Focus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons users_circle-08"></i>
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                onChange={this.onChange}
                                value={this.state.phone2}
                                error={errors.phone2}
                                placeholder="Phone 2"
                                id="phone2"
                                type="number"
                                onFocus={() => this.setState({phone2Focus: true})}
                                onBlur={() => this.setState({phone2Focus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.phone2}</span>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-4" md="6">
                          <Row>
                            <InputGroup
                              className={
                                "no-border input-lg" +
                                (this.state.countryFocus ? " input-group-focus" : "")
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons business_globe"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                onChange={this.onChange}
                                value={this.state.country}
                                error={errors.country}
                                id="country"
                                type="text"
                                placeholder="Country"
                                onFocus={() => this.setState({countryFocus: true})}
                                onBlur={() => this.setState({countryFocus: false})}
                              ></Input>
                            </InputGroup>
                            <span className="red-text">{errors.country}</span>
                          </Row>
                        </Col>
                        <Col className="pl-4" md="6">
                          <Row>
                            <FormGroup check>
                              <Label check>
                                <Input 
                                  type="checkbox" 
                                  onChange={this.onChangeTermCheck}
                                  error={errors.termcheck}
                                  id="termcheck"
                                ></Input>
                                <span className="form-check-sign"></span>
                                I agree to the terms and conditions.
                              </Label>
                            </FormGroup>
                            <span className="red-text">{errors.termcheck}</span>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        block
                        className="btn-round"
                        color="info"
                        type="submit"
                        size="lg"
                      >
                        SIGNUP
                      </Button>
                    </CardFooter>
                    <div className="pull-left">
                        <h6>
                        <Link className="link footer-link" to="/login">HAVE AN ACCOUNT?</Link>
                        </h6>
                      </div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link footer-link"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          Need Help?
                        </a>
                      </h6>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Container>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));