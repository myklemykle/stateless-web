import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";

export function ViewSelector(props){

	return (
		<div className="selector nav">

			<Link className="nav-link mx-1" to={ props.singlePath }>
				<img id="view-1x-button" src={
					// showing this as active for both single and detail views
					props.viewMode != "grid" ?  require("../assets/1x_active.svg") : require("../assets/1x_idle.svg")
				} />
			</Link>

			<Link className="nav-link mx-1" to={ props.reloadPath }>
				<img id="view-reselect-button" src={
					require("../assets/call_new_selection.svg")
				} />
			</Link>

			<Link className="nav-link mx-1" to={ props.gridPath }>
				<img id="view-4x-button" src={
					props.viewMode == "grid" ? require("../assets/4x_active.svg") : require("../assets/4x_idle.svg")
				}/>
			</Link>
		</div>
	)
}

// The user wallet control and the site help link
export function Ident(props){

	let walletConnectedIcon = require("../assets/wallet_connected.svg");
	let walletNotConnectedIcon = require("../assets/wallet_not_connected.svg");

	function helpClick(e){
		alert("help!")
	}

	return (
		<div className="ident">
			<img src={ props.walletSelector?.isSignedIn() ? walletConnectedIcon : walletNotConnectedIcon } className="pe-2" onClick={props.walletClick}/> 
			<img src={require("../assets/help.svg")} onClick={helpClick} /> 
		</div>
	)
}
