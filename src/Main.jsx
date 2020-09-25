import React, { Component } from "react";

import StripePlugin from "./stripePlugin";

import connectToDatoCms from "./connectToDatoCms";
import "./style.sass";

@connectToDatoCms((plugin) => ({
  developmentMode: plugin.parameters.global.developmentMode,
  stripeApiToken: plugin.parameters.global.stripeApiToken,
  fieldValue: plugin.getFieldValue(plugin.fieldPath),
}))
export default class Main extends Component {
  render() {
    return <StripePlugin token={this.props.stripeApiToken} />;
  }
}
