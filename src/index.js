import React from 'react';

import { createRoot } from 'react-dom/client';

import Nav from './components/Nav';

const navTop = document.getElementById('nav-top');
const navTopRoot = createRoot(navTop);
navTopRoot.render(<Nav />);

const navBottom = document.getElementById('nav-bottom');
const navBottomRoot = createRoot(navBottom);
navBottomRoot.render(<Nav  />);

