import { Link, useLoaderData } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

// Display 1 NFT image with a bunch of metadata & deets
export default function Id(props){
	const loader = useLoaderData();

	const tagsList = loader.nft.metadata.tags?.map(tag => <span className="nft-tag">{tag}</span>)

	function NFTCollectors(){
		if (loader.nft.listings?.length == 0) {
			return(
				<div className="nft-no-collectors" />
			)
		} else {
			const collectorList = loader.nft.listings?.map(l => <p className="collector">{l.token.owner}</p>)
			return(
					<div className="nft-collectors">
						<div className="row">
							<div className="col-sm"></div>
							<div className="col-sm-8">
								<p className="label">COLLECTORS:</p>
								{ collectorList }
							</div>
							<div className="col-sm"></div>
						</div>
					</div>
			)
		}
	}


  return (
		<div className="rnd1">

      <Header viewMode="detail" page={props.page} walletSelector={props.walletSelector} walletClick={props.walletClick} />

      <div id="maincontent" className="maincontent text-center mt-5">

				<div className="nft-single nft-detail-view">

					{/* duplicated from routes/Rnd1 */}
					<div className="nft-1up">
						<div className="row align-items-center">
							<div className="nft-col col-sm-12">
								<img src={loader.nft.metadata.media_url} className="nft-img img-fluid"/>
							</div>
						</div>
					</div>

					<div className="nft-details">
						<div className="nft-metadata">
							<div className="row mt-5">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<p className="nft-title"><span className="label">TITLE:</span> {loader.nft.metadata.title}</p>
									<p className="nft-description"><span className="label">DESCRIPTION:</span> {loader.nft.metadata.description}</p>
									<p className="nft-artist"><span className="label">ARTIST:</span> {loader.nft.minter}</p>
									<p className="nft-tags">
										{ tagsList }
									</p>
									<p className="nft-mediatype"><span className="label">MEDIA TYPE:</span> {loader.nft.metadata.media_type}</p>
									<p className="nft-editions"><span className="label">EDITIONS: {loader.nft.count}</span>
									</p>
								</div>
								<div className="col-sm"></div>
							</div>
						</div>
						<div className="nft-buy">
							<div className="row">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<button type="button" className="nft-price nft-buy-button btn btn-outline-dark">100 NEAR</button>
								</div>
								<div className="col-sm"></div>
							</div>
						</div>

						<NFTCollectors />

						<div className="row mb-5" />
					</div>
				</div>

			</div>

		<Footer viewMode="detail" page={props.page} />

	</div>

	)
}

