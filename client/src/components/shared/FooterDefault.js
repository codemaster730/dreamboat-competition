/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

// core components

function FooterDefault() {
  return (
    <>
      <footer className="footer footer-default">
        <Container>
          <nav>
            <ul>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  Creative Tim
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()}, Designed by{" "}
            <a
              href="#"
              target="_blank"
            >
              Invision
            </a>
            . Coded by{" "}
            <a
              href="#"
              target="_blank"
            >
              Creative Tim
            </a>
            .
          </div>
        </Container>
      </footer>
    </>
  );
}

export default FooterDefault;
