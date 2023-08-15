import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";

// The NFT selection controls
export function ViewSelector(props){
	// the page in our path:
	let page = parseInt(props.page) || 0;
	// are we showing one or four NFTs?
	let mode = props.viewMode == "4x" ? "4x" : "1x"; // basically, viewMode "detail" = mode "1x"

	// The next routes for the 1x and 4x buttons:
	let next1page, next4page
	if (mode == "1x"){
		next1page = page + 1
		next4page = Math.floor(page / 4)
	} else {
		next1page = page * 4
		next4page = page + 1
	}

	// reload if we're at the end of the list:
	if (next1page >= props.count)
		next1page = -1;
	if (next4page * 4 >= props.count)
		next4page = -1;

	return (
		<div className="selector nav">

			<Link className="nav-link mx-1" to={
				next1page ? '/rnd/' + next1page : '/rnd'
			}>
				<img id="view-1x-button" src={
					mode == "1x" ?  require("../assets/1x_active.svg") : require("../assets/1x_idle.svg")
				} />
			</Link>

			<Link className="nav-link mx-1" to={
				mode == "1x" ?  '/rnd/' + next1page : '/rnd4/' + next4page 
			}>
				<img id="view-reselect-button" src={
					require("../assets/call_new_selection.svg")
				} />
			</Link>

			<Link className="nav-link mx-1" to={
				next4page ? '/rnd4/' + next4page : '/rnd4'
			}>
				<img id="view-4x-button" src={
					mode == "4x" ? require("../assets/4x_active.svg") : require("../assets/4x_idle.svg")
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
