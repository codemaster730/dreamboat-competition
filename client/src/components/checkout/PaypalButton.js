import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";

 const CLIENT = {
   sandbox:
     "AWKAnqygV04yf-AorjMSdR5HGiwUKqkXnW8zurl78aZ5wMi4AEaGYdx6VjjjvyAS0Hc4VTVqpK9gCe3H",
   production:
     'AWKAnqygV04yf-AorjMSdR5HGiwUKqkXnW8zurl78aZ5wMi4AEaGYdx6VjjjvyAS0Hc4VTVqpK9gCe3H',
 };

 const CLIENT_ID =
   process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;
//create button here
let PayPalButton = null;

// next create the class and Bind React and ReactDom to window
//as we will be needing them later

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ showButtons: true });
      }
    }
  }

  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Tickets Buy For DreamBoat Competition",
          amount: {
            currency_code: "GBP",
            value: this.props.totalPrice
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      this.props.acceptedPayment(paymentData);
    });
  };

  render() {
    const { showButtons } = this.state;

    return (
      <div className="main">
        {showButtons && (
          <div>
            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
            />
          </div>
        )}
      </div>
    );
  }
 }

 export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=GBP`)(PaypalButton);