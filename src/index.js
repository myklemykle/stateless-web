import { createRoot } from 'react-dom/client';

import Nav from './components/Nav';

const navTop = document.getElementById('nav-top');
const navTopRoot = createRoot(navTop);
navTop.render(<Nav />);

const navBottomRoot = createRoot(navBottom);
const navBottom = document.getElementById('nav-bottom');
navBottom.render(<Nav  />);

