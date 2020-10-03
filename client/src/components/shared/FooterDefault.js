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
                  href="https://www.dreamboatcompetitions.co.uk/terms/DreamboatTC.pdf"
                  target="_blank"
                >
                  TERMS OF PLAY
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  COOKIE POLICY
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                >
                  CONTACT US
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()}, Published by{" "}
            <a
              href="#"
              target="_blank"
            >
              MICHAEL D.
            </a>
            .
          </div>
        </Container>
      </footer>
    </>
  );
}

export default FooterDefault;
