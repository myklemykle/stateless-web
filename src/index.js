import React from 'react';

import { createRoot } from 'react-dom/client';

import { Selector, Ident } from './components/Nav';

const selectorTop = document.getElementById('selector-top');
const selectorTopRoot = createRoot(selectorTop);
selectorTopRoot.render(<Selector />);

const selectorBottom = document.getElementById('selector-bottom');
const selectorBottomRoot = createRoot(selectorBottom);
selectorBottomRoot.render(<Selector />);

const ident = document.getElementById('ident');
const identRoot = createRoot(ident);
identRoot.render(<Ident />);

