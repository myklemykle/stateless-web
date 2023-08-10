import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
	useLoaderData,
} from "react-router-dom";

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

	const router = createBrowserRouter([
		{
			path: "/",
			element: <App viewMode="4x" walletSelector={walletSelector} walletClick={walletClick}/>
		},
		{
			path: "/rnd4",
			element: <App viewMode="4x" walletSelector={walletSelector} walletClick={walletClick}/>
		},
		{
			path: "/rnd4/:page",
			element: <App viewMode="4x" walletSelector={walletSelector} walletClick={walletClick} />,
			loader: function({params}){ return params }
		},
		{
			path: "/rnd",
			element: <App viewMode="1x" walletSelector={walletSelector} walletClick={walletClick}/>
		},
		{
			path: "/rnd/:page",
			element: <App viewMode="1x" walletSelector={walletSelector} walletClick={walletClick}/>,
			loader: function({params}){ return params }
		},
		{
			path: "/id/:nftid",
			element: <App viewMode="detail" walletSelector={walletSelector} walletClick={walletClick}/>,
			loader: function({params}){ return params }
		},
	]);

	return(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	)
}

function App(props){ 
	const loader = useLoaderData();

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
					<NFT1View walletSelector={props.walletSelector} />
				)
			case "4x":
				return(
					<NFT4View walletSelector={props.walletSelector} />
				)
			case "detail":
				return(
					<NFTDetailView nftid={loader.nftid} walletSelector={props.walletSelector} />
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
						<ViewSelector id="selector-top" viewMode={props.viewMode} onClick={viewSelectorClick} page={loader?.page}/>
					</div>

					<div className="col">
						<div className="float-end mt-2">
							<Ident id="ident" walletSelector={props.walletSelector} walletClick={props.walletClick}/>
						</div>
					</div>

				</nav>
			</div>

			<div className="maincontent text-center mt-5">
				
				{ renderSelectedView(props.viewMode) }

			</div>

			<div className="footer">
				<nav className="row">

					<div className="col"></div>

					<div className="nav-btm col-auto mt-2 mb-4 d-block d-sm-none">
						<ViewSelector id="selector-bottom" className="nav" viewMode={props.viewMode} onClick={viewSelectorClick} />
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


