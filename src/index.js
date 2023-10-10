import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
	// useLoaderData,
	Outlet,
} from "react-router-dom"

// NEAR Wallet Selector: https://docs.near.org/tools/wallet-selector
import { setupWalletSelector } from "@near-wallet-selector/core"
import { setupModal } from "@near-wallet-selector/modal-ui"
import { setupNearWallet } from "@near-wallet-selector/near-wallet"
import { setupHereWallet } from "@near-wallet-selector/here-wallet"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet"
import { setupSender } from "@near-wallet-selector/sender"
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import { setupLedger } from "@near-wallet-selector/ledger"
import "@near-wallet-selector/modal-ui/styles.css"

import GridPage from './routes/G'
import OwnerGridPage from './routes/OwnerG'
import ArtistGridPage from './routes/ArtistG'
import SinglePage from './routes/S'
import ArtistSinglePage from './routes/ArtistS'
import OwnerSinglePage from './routes/OwnerS'
import Id from './routes/Id'

import { galleryLoader, artistLoader, ownerLoader, nftLoader } from './fetch'

import { Contract, connect } from 'near-api-js'

async function initSocialContract(accountId){
	const nearConnection = await connect({
		networkId: window.stateless_config.networkId,
		  nodeUrl: "https://rpc.mainnet.near.org",
	})
	const account = await nearConnection.account(accountId)

	c = new Contract( account, "social.near", {
		viewMethods: [ "get", "keys" ]
	});

	return c
}

function App(props){

	const [walletSelector, setWalletSelector] = useState(null)
	const walletModal = useRef(null) 

	const [socialContract, setSocialContract] = useState(null)
	// calling useEffect at top level, to run this setup once at startup.
	// (Does React have a clearer way to do that?)
  useEffect(() => {
    async function _setup(){
      let s = await setupWalletSelector({
        network: window.stateless_config.networkId,
        modules: [
          setupNearWallet(),
          setupHereWallet(),
          setupMyNearWallet(),
          setupSender(),
          setupMeteorWallet(),
          setupLedger()
        ]

      })
      walletModal.current = setupModal(s, {
        contractId: window.stateless_config.mintbaseContractId,
      })
      setWalletSelector(s)
			// window.walletSelector = s //debug

			// connect to near.social for user deets
			let wallet = await s.wallet()
			let accounts = await wallet.getAccounts()
			let accountId = accounts[0].accountId
			let sc = await initSocialContract(accountId) 
			setSocialContract(sc)
    }

    if (walletSelector == null) {
      _setup()
    }
  }, [walletSelector, walletModal, socialContract])

	// click handlers that effect global state are defined here & handed down 
  function walletClick(e){
    walletModal.current.show()
  }

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Root walletSelector={walletSelector} walletClick={walletClick} />,
			children: [
				{ index: true,
					loader: galleryLoader,
					element: <GridPage walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/g",
					loader: galleryLoader,
					element: <GridPage walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/g/:page",
					loader: galleryLoader,
					element: <GridPage walletSelector={walletSelector} walletClick={walletClick} />
				},

				{
					path: "/s",
					loader: galleryLoader,
					element: <SinglePage walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/s/:page",
					loader: galleryLoader,
					element: <SinglePage walletSelector={walletSelector} walletClick={walletClick} />
				},

				{
					path: "/artist/:artistId",
					loader: artistLoader,
					element: <ArtistGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/artist/:artistId/g",
					loader: artistLoader,
					element: <ArtistGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/artist/:artistId/g/:page",
					loader: artistLoader,
					element: <ArtistGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/artist/:artistId/s",
					loader: artistLoader,
					element: <ArtistSinglePage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/artist/:artistId/s/:page",
					loader: artistLoader,
					element: <ArtistSinglePage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},

				{
					path: "/owner/:ownerId",
					loader: ownerLoader,
					element: <OwnerGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/owner/:ownerId/g",
					loader: ownerLoader,
					element: <OwnerGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/owner/:ownerId/g/:page",
					loader: ownerLoader,
					element: <OwnerGridPage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>
				},
				{
					path: "/owner/:ownerId/s",
					loader: ownerLoader,
					element: <OwnerSinglePage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>,
				},
				{
					path: "/owner/:ownerId/s/:page",
					loader: ownerLoader,
					element: <OwnerSinglePage walletSelector={walletSelector} walletClick={walletClick} socialContract={socialContract}/>,
				},

				{
					path: "/id/:nftid",
					loader: nftLoader,
					element: <Id walletSelector={walletSelector} walletClick={walletClick} />,
				},
			]
		},
	], {
		basename: props.basename // undefined defaults to /
	})

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

// Parcel says we can't iterate on process.env for security reasons ...
if (typeof process.env.NETWORKID !== 'undefined')
	window.stateless_config.networkId = process.env.NETWORKID;
if (typeof process.env.MINTBASECONTRACTID !== 'undefined')
	window.stateless_config.mintbaseContractId = process.env.MINTBASECONTRACTID;
if (typeof process.env.MINTBASEAPIKEY !== 'undefined')
	window.stateless_config.mintbaseApiKey = process.env.MINTBASEAPIKEY;
else
	window.stateless_config.mintbaseApiKey = "anon" // the sensible default
if (typeof process.env.BASENAME !== 'undefined')
	window.stateless_config.basename = process.env.BASENAME;
	// or else basename can be left undefined.

if (typeof process.env.SITENAME !== 'undefined')
	window.stateless_config.sitename= process.env.SITENAME
else 
	window.stateless_config.sitename = window.stateless_config.mintbaseContractId.split('.')[0]


const root = createRoot(document.getElementById('app'))
root.render(<App basename={window.stateless_config.basename} />)
