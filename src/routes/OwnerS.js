import { Link, useLoaderData } from "react-router-dom";
import { Header, Footer} from '../components/HeaderFooter'
import { OwnerHeading } from '../components/PageHeadings'
import NFTSingle from '../components/NFTSingle'

export default function OwnerSinglePage(props){
	const loader = useLoaderData();
	const page = loader?.page || 0;

  const nft = loader.nftGallery[page];







	return(

		<div className="single-page owner-single-page">

			<Header viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} 
				walletSelector={props.walletSelector} walletClick={props.walletClick} 
			/>

			<div id="maincontent" className="maincontent text-center mt-5">

				<OwnerHeading owner={loader.owner} />

				<NFTSingle nftRecord={nft} />

			</div>

			<Footer viewMode="single" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery}  />

		</div>

	)
}
