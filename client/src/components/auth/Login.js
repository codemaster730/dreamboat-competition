import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";

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
} from "reactstrap";

// core components
import DropdownScrollNavbar from "components/shared/DropdownScrollNavbar.js";
import Footer from "components/shared/Footer.js";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      firstFocus: false,
      lastFocus: false,
      redirectUrl: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.auth.user.role === "Administrator"){
      this.props.history.push("/admin/users");
    }else if (nextProps.auth.isAuthenticated) {
      if (this.state.redirectUrl && this.state.redirectUrl !== '') {
        this.props.history.push("/" + this.state.redirectUrl);
      } else {
        this.props.history.push("/boats"); // push user to home page when they login
      }
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);
    this.setState({redirectUrl: parsed.redirectUrl});
    
    // If logged in and user navigates to Login page, should redirect them to home
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/boats");
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

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData); // since we handle the redirect within our component, 
                                    // we don't need to pass in this.props.history as a parameter
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
                <Col className="ml-auto mr-auto" md="5">
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
                          value={this.state.email}
                          error={errors.email}
                          placeholder="Email"
                          id="email"
                          type="email"
                          onFocus={() => this.setState({firstFocus: true})}
                          onBlur={() => this.setState({firstFocus: false})}
                        ></Input>
                      </InputGroup>
                      <span className="red-text">
                        {errors.email}
                        {errors.emailnotfound}
                      </span>
                      <InputGroup
                        className={
                          "no-border input-lg" +
                          (this.state.lastFocus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons text_caps-small"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={this.onChange}
                          value={this.state.password}
                          error={errors.password}
                          id="password"
                          type="password"
                          placeholder="Password"
                          onFocus={() => this.setState({lastFocus: true})}
                          onBlur={() => this.setState({lastFocus: false})}
                        ></Input>
                      </InputGroup>
                      <span className="red-text">
                        {errors.password}
                        {errors.passwordincorrect}
                      </span>
                    </CardBody>
                      <CardFooter className="text-center">
                      <Button
                        block
                        className="btn-round"
                        color="info"
                        type="submit"
                        size="lg"
                      >
                        LOGIN
                      </Button>
                    </CardFooter>
                      <div className="pull-left">
                        <h6>
                        <Link className="link footer-link" to="/register">CREATE ACCOUNT</Link>
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);