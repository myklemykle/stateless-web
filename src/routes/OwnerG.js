import { useState, useEffect } from 'react'
import { Link, useLoaderData } from "react-router-dom";
import { Header, Footer } from '../components/HeaderFooter'
import { OwnerHeading } from '../components/PageHeadings'
import GridOfNFTs from '../components/GridOfNFTs'
import { loadProfile, sanitizeProfile } from '../util.js'

export default function OwnerGridPage(props){
	const loader = useLoaderData();
	const page = loader?.page || 0;

	const [ownerProfile, setOwnerProfile] = useState(null)

  useEffect(()=>{
    async function _get(){
      ap = await props.socialContract.get({keys:[
        loader?.ownerId + "/profile/**"
      ]})
      ap = sanitizeProfile(ap, loader?.ownerId)
      setOwnerProfile(ap)
    }
    if (props.socialContract && (ownerProfile == null) )
      _get()
	},[ownerProfile])

	// 4-item array of NFT gallery data blobs
	const gridItems = [
		loader?.nftGallery[page * 4],
		loader?.nftGallery[page * 4 + 1],
		loader?.nftGallery[page * 4 + 2],
		loader?.nftGallery[page * 4 + 3],
	];

	return(

		<div className="grid-page owner-grid-page">

			<Header viewMode="grid" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} 
				walletSelector={props.walletSelector} walletClick={props.walletClick} 
			/>

      <div id="maincontent" className="maincontent text-center mt-5">

				<OwnerHeading ownerId={loader?.ownerId} profile={ownerProfile} />

				<GridOfNFTs gridItems={gridItems} />

      </div>

      <Footer viewMode="grid" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} />

    </div>

	)
}
