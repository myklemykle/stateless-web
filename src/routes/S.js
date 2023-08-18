import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'
import { singleSelectorPath, reloadSelectorPath, gridSelectorPath } from '../util'

export default function Single(props){
	const nav = useNavigation()
	const loader = useLoaderData();
	const page = loader?.page || 0;

  const item = loader.nftGallery[page];

	let singlePath = singleSelectorPath(loader.nftGallery, loader.nftGalleryCursor, "single", page)
	let reloadPath = reloadSelectorPath(loader.nftGallery, loader.nftGalleryCursor, "single", page)
	let gridPath = gridSelectorPath(loader.nftGallery, loader.nftGalleryCursor, "single", page)


  if (nav.state === "loading") {
    return(

			<div className="nft-loading" />

    )
	} else if (!item) {
		// this should not normally happen unless someone types in a bad URL by hand?
		return(

			<div className="no-nft" />

		)
	} else { 
		return (

			<div className="rnd1">

				<Header viewMode="1x" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery} walletSelector={props.walletSelector} walletClick={props.walletClick} 
					singlePath={singlePath}
					reloadPath={reloadPath}
					gridPath={gridPath}
				/>

				<div id="maincontent" className="maincontent text-center mt-5">
					<div className="nft-single nft-1-view">
						<Link to={'/id/' + item.metadata_id}>

							{/* duplicated from routes/Id */}
							<div className="nft-1up">
								<div className="row align-items-center">
									<div className="nft-col col-sm-12">
										<img src={item.media_url} className="nft-img img-fluid"/>
									</div>
								</div>
							</div>

						</Link>
					</div>

				</div>

				<Footer viewMode="1x" page={page} nftGalleryCursor={loader?.nftGalleryCursor} nftGallery={loader?.nftGallery}  
					singlePath={singlePath}
					reloadPath={reloadPath}
					gridPath={gridPath}
				/>

			</div>

		)
	}
}
