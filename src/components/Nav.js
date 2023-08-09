import React from 'react'
import { Fragment, useEffect, useState, useRef } from 'react';

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";

import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";

import "@near-wallet-selector/modal-ui/styles.css";

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
      let s = await setupWalletSelector({
        network: "testnet",
				modules: [ 
					setupNearWallet(),
					setupHereWallet(),
					setupMyNearWallet(),
					setupSender(),
					setupMeteorWallet(),
					setupLedger()
				]

      });
      walletModal.current = setupModal(s, {
        contractId: "test.testnet",
      });
			setWalletSelector(s);
    }
		if (walletSelector == null) {
			_setup();
		}

	});

	function walletClick(e){
		walletModal.current.show();
	}

	function helpClick(e){
		alert("help!")
	}

	return (
		<Fragment>
			<div className="ident">
				{ 
					walletSelector?.isSignedIn() ? 
				<img src={require("../assets/wallet_connected.svg")} className="pe-2" onClick={walletClick}/> 
				 : 
				<img src={require("../assets/wallet_not_connected.svg")} className="pe-2" onClick={walletClick}/> 
				}

				<img src={require("../assets/help.svg")} onClick={helpClick} /> 
			</div>
		</Fragment>
	)
}
