import { useState, useEffect } from 'react'
import { Link, useLoaderData, useNavigation } from "react-router-dom"
import { Header, Footer } from '../components/HeaderFooter'
import { ArtistHeading } from '../components/PageHeadings'
import GridOfNFTs from '../components/GridOfNFTs'
import { loadProfile, sanitizeProfile } from '../util.js'

export default function ArtistGridPage(props){
	const loader = useLoaderData()
	const page = loader?.page || 0

	const [artistProfile, setArtistProfile] = useState(null)

	useEffect(()=>{
		async function _get(){
			ap = await props.socialContract.get({keys:[
				loader?.artistId + "/profile/**"
			]})
			ap = sanitizeProfile(ap, loader?.artistId)
			setArtistProfile(ap)
		}
		if (props.socialContract && (artistProfile == null) )
			_get()
	},[artistProfile])

	// 4-item array of NFT gallery data blobs
	const gridItems = [
		loader?.nftGallery[page * 4],
		loader?.nftGallery[page * 4 + 1],
		loader?.nftGallery[page * 4 + 2],
		loader?.nftGallery[page * 4 + 3],
	];

	return(

		<div className="grid-page artist-grid-page">

			<Header viewMode="grid" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} 
				walletSelector={props.walletSelector} walletClick={props.walletClick} 
			/>

      <div id="maincontent" className="maincontent text-center mt-5">

				<ArtistHeading artistId={loader?.artistId} profile={artistProfile} />

				<GridOfNFTs gridItems={gridItems} />

      </div>

      <Footer viewMode="grid" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} />

    </div>

	)
}
