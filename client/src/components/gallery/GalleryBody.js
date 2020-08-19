import React, { Component } from "react";
import { Container, Row } from "reactstrap";
import axios from "axios";

import Boat from 'components/gallery/Boat.js';

class GalleryBody extends Component {
  constructor (props) {
    super(props);
    this.state = {
      boats: []
    }
  }

  loadBoatsData() {
    axios
      .get('/api/boats/boats')
      .then((res) => {
        if (res.data.success === true) {
          this.setState({
            boats: res.data.boats
          });
        } else {
          console.log(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.loadBoatsData();
  }

  componentWillUnmount() {

  }

  onClickBoat = (boat) => {
    console.log(boat);
  }

  render() {
    return (
      <>
        <div className="section section-sections" data-background-color="white">
          <Container>
            { this.state.boats.length > 0 ?
                <div className="section-cols">
                  <Row>
                    {this.state.boats.map(boat => (
                      <Boat boat={boat} handleClickBoat={this.onClickBoat} />
                    ))}
                  </Row>
                </div>
              : 
                <p className="text-primary">No Boats Found</p>
            }
          </Container>
        </div>
      </>
    );
  }
}

export default GalleryBody;

