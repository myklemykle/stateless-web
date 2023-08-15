import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
	// useLoaderData,
	Outlet,
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

import Rnd4 from './routes/Rnd4'
import Rnd1 from './routes/Rnd1'
import Id from './routes/Id'

import { storeLoader } from './fetch.js'

function App(){

	const [walletSelector, setWalletSelector] = useState(null);
	const walletModal = useRef(null); 

	// calling useEffect at top level, to run this setup once at startup.
	// (Does React have a clearer way to do that?)
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
		// TODO: report setup failures?

  });

	// click handlers that effect global state are defined here & handed down 
  function walletClick(e){
    walletModal.current.show();
  }

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Root walletSelector={walletSelector} walletClick={walletClick}/>,
			children: [
				{ index: true,
					element: <Rnd4 viewMode="4x" walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/rnd4",
					loader: storeLoader,
					element: <Rnd4 viewMode="4x" walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/rnd4/:page",
					loader: storeLoader,
					element: <Rnd4 viewMode="4x" walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/rnd",
					loader: storeLoader,
					element: <Rnd1 viewMode="1x" walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/rnd/:page",
					loader: storeLoader,
					element: <Rnd1 viewMode="1x" walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/id/:nftid",
					// loader: nftLoader
					element: <Id walletSelector={walletSelector} walletClick={walletClick} />,
					loader: function({params}){ return params }
				},
			]
		},
	]);

	return(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	)
}

// Root: The outer page structure.  
// (the wallet-modal and the main route Outlet need to be peer nodes for the modal overlay to work visually.)
function Root(props){ 
	return(
		<div>
			<div id="near-wallet-selector-modal" />
			<Outlet />
		</div>
		) 
}


const root = createRoot(document.getElementById('app'));
root.render(<App />);


