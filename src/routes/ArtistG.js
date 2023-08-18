import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { Header, Footer } from '../components/HeaderFooter'
import { ArtistHeading } from '../components/PageHeadings'
import GridOfNFTs from '../components/GridOfNFTs'

export default function ArtistGridPage(props){
	const loader = useLoaderData();
	const page = loader?.page || 0;

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

				<ArtistHeading artist={loader?.artist} />

				<GridOfNFTs gridItems={gridItems} />

      </div>

      <Footer viewMode="grid" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} />

    </div>

	)
}
