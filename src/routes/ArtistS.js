import { useState, useEffect } from 'react'
import { Link, useLoaderData } from "react-router-dom";
import { Header, Footer} from '../components/HeaderFooter'
import { ArtistHeading } from '../components/PageHeadings'
import NFTSingle from '../components/NFTSingle'
import { sanitizeProfile } from '../util.js'

export default function ArtistSinglePage(props){
	const loader = useLoaderData();
	const page = loader?.page || 0;

  const nft = loader.nftGallery[page];

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






	return(

		<div className="single-page artist-single-page">

			<Header viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} 
				walletSelector={props.walletSelector} walletClick={props.walletClick} 
			/>

			<div id="maincontent" className="maincontent text-center mt-5">

				<ArtistHeading artist={loader?.artistId} profile={artistProfile} />

				<NFTSingle nftRecord={nft} />

			</div>

			<Footer viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery}  />

		</div>

	)
}
