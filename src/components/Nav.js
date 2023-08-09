import React from 'react'
import { Fragment, useEffect, useState, useRef } from 'react';

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";

// Contains the NFT selection controls.
export function ViewSelector(){
    return (
				<div className="selector nav">
					 <a className="nav-link mx-1" href="#"><img src={require("../assets/1x_idle.svg")} /></a>
					 <a className="nav-link mx-1" href="#"><img src={require("../assets/call_new_selection.svg")} /></a>
					 <a className="nav-link mx-1" href="#"><img src={require("../assets/4x_active.svg")} /></a>
				</div>
		)
}

// Contains the user wallet control and the site help link.
export function Ident(){
	const [walletSelector, setWalletSelector] = useState(null);
	let walletModal = useRef(null);

  useEffect(() => {
    async function _setup(){
      setWalletSelector(await setupWalletSelector({
        network: "testnet",
        modules: [setupNearWallet()],
      }));
      walletModal = setupModal(walletSelector, {
        contractId: "test.testnet",
      });
    }
    _setup();

	});

	function walletClick(e){
		//alert("wallet")
		walletModal.show();
	}

	function helpClick(e){
		alert("help!")
	}

    return (
			<Fragment>
				<div id="near-wallet-selector-modal" />
				<div className="ident">
					<img src={require("../assets/wallet_not_connected.svg")} className="pe-2" onClick={walletClick}/> 
					<img src={require("../assets/help.svg")} onClick={helpClick} /> 
				</div>
			</Fragment>
		)
}
