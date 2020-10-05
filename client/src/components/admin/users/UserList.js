import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// reactstrap components
import {
  Row,
  Card,
  CardBody,
  Table,
  Button,
  UncontrolledTooltip, Label
} from "reactstrap";

// core components
import DropdownScrollNavbar from "../shared/DropdownScrollNavbar.js";

class UserList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      users: [],
    }
  }

  componentDidMount() {
    document.body.classList.add("user-pay-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    this.getUserList();
  }

  getUserList() {
    axios
      .post('/api/useradmin/userlist', {})
    .then((res) => {
      this.setState({users: res.data.users});
    }).catch((err) => {
      console.log(err);
    });
  }

  editUser(user) {
    user.active = (user.active+1) % 3;
    axios
      .put(`/api/useradmin/user/${user._id}`, {user: user})
      .then((res) => {
        this.getUserList();
      }).catch((err) => {
        console.log(err);
      });
  }

  removeUser(user) {
    axios
    .delete(`/api/useradmin/user/${user._id}`)
    .then((res) => {
      toast.info(res.data.message);
      this.getUserList();
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("user-pay-page");
    document.body.classList.remove("sidebar-collapse");
  }

  renderUserListTableData() {
    const moment = require('moment');
    let number = 0;
    console.log(this.state.users);
    return this.state.users.map((user) => {
      number += 1;
      return (
        <tr key="#">
          <td className="text-left">{number}</td>
          <td className="text-left mobile-collapse">{user.firstName+" "+user.lastName}</td>
          <td className="text-left">{user.email}</td>
          <td className="text-left mobile-collapse">{user.phone}, {user.phone2}</td>
          <td className="text-left mobile-collapse">{user.country}</td>
          <td className="text-left mobile-collapse">{moment(user.date).format('MM/DD/YYYY')}</td>
          <td className="text-right">
            <>
              <span style={{ display: 'none' }}>{user.active?"actived":"deactived"}</span>
              <Button
                id="edit-user"
                className="mr-1"
                color={user.active===0?"secondary":
                          user.active===1?"success":
                            "danger"}
                size="sm"
                style={{ width:'130px' }}
                type="button"
                onClick={() => this.editUser(user)}
              >
                <i className="now-ui-icons ui-2_settings-90"></i>
                {user.active===0?"deactive":
                          user.active===1?"active":
                            "deleted"}
              </Button>
              <UncontrolledTooltip
                  delay={100}
                  placement="top"
                  target="edit-user"
                >
                  Toggle User Active
              </UncontrolledTooltip>
            </>
          </td>
          <td className="text-right">
            <>
              <Button
                id="delete-user"
                className="btn-icon"
                color="danger"
                size="sm"
                type="button"
                onClick={() => this.removeUser(user)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </Button>
              <UncontrolledTooltip
                  delay={100}
                  placement="top"
                  target="delete-user"
                >
                  Delete User
              </UncontrolledTooltip>
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
                  <h3 className="title">User Management</h3>
                  <Label> Active or Delete User</Label>
                </div>
              </Row>
              <Row>
                <div className="mr-auto ml-auto col-md-8">

                  <Card className="card-plain mt-2 table-card">
                    <CardBody>
                      {this.state.users.length > 0 ?
                        <Table responsive>
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left mobile-collapse">Name</th>
                              <th className="text-left">eMail</th>
                              <th className="text-left mobile-collapse">Phone#</th>
                              <th className="text-left mobile-collapse">Country</th>
                              <th className="text-left mobile-collapse">Date</th>
                              <th className="text-left">Active</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.renderUserListTableData()
                            }
                          </tbody>
                        </Table>
                        :
                        <h4>No UserList Found</h4>
                      }
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </div>
          </div>
          <ToastContainer />

        </div>
      </>
    );
  }
}

UserList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(UserList);