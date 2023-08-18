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

import Grid from './routes/G'
import OwnerGrid from './routes/OwnerG'
import ArtistGrid from './routes/ArtistG'
import Single from './routes/S'
import ArtistSingle from './routes/ArtistS'
import OwnerSingle from './routes/OwnerS'
import Id from './routes/Id'

import { galleryLoader, artistLoader, ownerLoader, nftLoader } from './fetch'

function App(){

	const [walletSelector, setWalletSelector] = useState(null)
	const walletModal = useRef(null) 

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

      })
      walletModal.current = setupModal(s, {
        contractId: "test.testnet",
      })
      setWalletSelector(s)
    }
    if (walletSelector == null) {
      _setup()
    }
		// TODO: report setup failures?

  })

	// click handlers that effect global state are defined here & handed down 
  function walletClick(e){
    walletModal.current.show()
  }

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Root walletSelector={walletSelector} walletClick={walletClick}/>,
			children: [
				{ index: true,
					loader: galleryLoader,
					element: <Grid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/g",
					loader: galleryLoader,
					element: <Grid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/g/:page",
					loader: galleryLoader,
					element: <Grid walletSelector={walletSelector} walletClick={walletClick} />
				},

				{
					path: "/s",
					loader: galleryLoader,
					element: <Single walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/s/:page",
					loader: galleryLoader,
					element: <Single walletSelector={walletSelector} walletClick={walletClick} />
				},

				{
					path: "/artist/:artistId",
					loader: artistLoader,
					element: <ArtistGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/artist/:artistId/g",
					loader: artistLoader,
					element: <ArtistGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/artist/:artistId/g/:page",
					loader: artistLoader,
					element: <ArtistGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/artist/:artistId/s",
					loader: artistLoader,
					element: <ArtistSingle walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/artist/:artistId/s/:page",
					loader: artistLoader,
					element: <ArtistSingle walletSelector={walletSelector} walletClick={walletClick} />
				},

				{
					path: "/owner/:ownerId",
					loader: ownerLoader,
					element: <OwnerGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/owner/:ownerId/g",
					loader: ownerLoader,
					element: <OwnerGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/owner/:ownerId/g/:page",
					loader: ownerLoader,
					element: <OwnerGrid walletSelector={walletSelector} walletClick={walletClick} />
				},
				{
					path: "/owner/:ownerId/s",
					loader: ownerLoader,
					element: <OwnerSingle walletSelector={walletSelector} walletClick={walletClick} />,
				},
				{
					path: "/owner/:ownerId/s/:page",
					loader: ownerLoader,
					element: <OwnerSingle walletSelector={walletSelector} walletClick={walletClick} />,
				},

				{
					path: "/id/:nftid",
					loader: nftLoader,
					element: <Id walletSelector={walletSelector} walletClick={walletClick} />,
				},
			]
		},
	])

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


const root = createRoot(document.getElementById('app'))
root.render(<App />)


