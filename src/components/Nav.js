import React from 'react'


export default class Nav extends React.Component {
  render() {
    return (
			<nav className="nav">
				<a className="nav-link mx-1" href="#"><img src={require("../assets/1x_idle.svg")} /></a>
				<a className="nav-link mx-1" href="#"><img src={require("../assets/call_new_selection.svg")} /></a>
				<a className="nav-link mx-1" href="#"><img src={require("../assets/4x_active.svg")} /></a>
			</nav>
		)
	}
}
