import { Link, useLoaderData } from "react-router-dom";
import { Header, Footer} from '../components/HeaderFooter'
import { ArtistHeading } from '../components/PageHeadings'
import NFTSingle from '../components/NFTSingle'

export default function ArtistSinglePage(props){
	const loader = useLoaderData();
	const page = loader?.page || 0;

  const nft = loader.nftGallery[page];







	return(

		<div className="single-page artist-single-page">

			<Header viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} 
				walletSelector={props.walletSelector} walletClick={props.walletClick} 
			/>

			<div id="maincontent" className="maincontent text-center mt-5">

				<ArtistHeading artist={loader.artist} />

				<NFTSingle nftRecord={nft} />

			</div>

			<Footer viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery}  />

		</div>

	)
}
