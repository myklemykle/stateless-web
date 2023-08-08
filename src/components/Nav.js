import React from 'react'


// Contains the NFT selection controls.
export class Selector extends React.Component {
  render() {
    return (
			<div className="selector nav">
				 <a className="nav-link mx-1" href="#"><img src={require("../assets/1x_idle.svg")} /></a>
				 <a className="nav-link mx-1" href="#"><img src={require("../assets/call_new_selection.svg")} /></a>
				 <a className="nav-link mx-1" href="#"><img src={require("../assets/4x_active.svg")} /></a>
			</div>
		)
	}
}

// Contains the user wallet control and the site help link.
export class Ident extends React.Component {
	walletClick(e){
		alert("wallet")
	}

	helpClick(e){
		alert("help!")
	}

  render() {
    return (
			<div className="ident">
				<img src={require("../assets/wallet_not_connected.svg")} className="pe-2" onClick={this.walletClick}/> 
				<img src={require("../assets/help.svg")} onClick={this.helpClick} /> 
			</div>
		)
	}
}
