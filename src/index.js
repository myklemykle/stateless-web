import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// NEAR Wallet Selector: https://docs.near.org/tools/wallet-selector
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import "@near-wallet-selector/modal-ui/styles.css";

import { ViewSelector, Ident } from './components/Nav';
import { NFT1View, NFT4View, NFTDetailView } from './components/Views';

function Index(){

	const [walletSelector, setWalletSelector] = useState(null);
	const [viewMode, setViewMode] = useState("detail"); // 1x, 4x or "detail"
	let walletModal = useRef(null); // const?

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

	// click handlers that effect global state are defined here & handed down 
  function walletClick(e){
    walletModal.current.show();
  }

	function viewSelectorClick(e){
		switch (e.target.id) {
			case "view-1x-button":
				setViewMode("1x")
				break;
			case "view-4x-button":
				setViewMode("4x")
				break;
			case "view-reselect-button":
				// more complicated
				console.log("TODO: load new selection")
		}
	}


	function renderSelectedView(vm){
		switch(vm) {
			case "1x":
				return(
					<NFT1View walletSelector={walletSelector} />
				)
			case "4x":
				return(
					<NFT4View walletSelector={walletSelector} />
				)
			case "detail":
				return(
					<NFTDetailView walletSelector={walletSelector} />
				)
		}
	}

	return(

		<div id="app" className="app">
			<div id="near-wallet-selector-modal" />

			<div className="header">
				<nav className="row">

					<div className="logo col">
						<img src={require("./assets/logo.png")} className="float-start mt-1"/>
					</div>

					<div className="nav-top col-sm-auto mt-2 d-none d-sm-block">
						<ViewSelector id="selector-top" viewMode={viewMode} onClick={viewSelectorClick}/>
					</div>

					<div className="col">
						<div className="float-end mt-2">
							<Ident id="ident" walletSelector={walletSelector} walletClick={walletClick}/>
						</div>
					</div>

				</nav>
			</div>

			<div className="maincontent text-center mt-5">
				
				{ renderSelectedView(viewMode) }

			</div>

			<div className="footer">
				<nav className="row">

					<div className="col"></div>

					<div className="nav-btm col-auto mt-2 mb-4 d-block d-sm-none">
						<ViewSelector id="selector-bottom" className="nav" viewMode={viewMode} onClick={viewSelectorClick} />
					</div>

					<div className="col"></div>

				</nav>
			</div>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous"></script>
		</div>
		) 
}


const root = createRoot(document.getElementById('app'));
root.render(<Index />);


