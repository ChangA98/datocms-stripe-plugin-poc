import React from 'react';
import { render } from 'react-dom';

import StripePlugin from './StripePlugin';

window.DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  const container = document.createElement('div');
  document.body.appendChild(container);

  render(<StripePlugin plugin={plugin} />, container);
});
