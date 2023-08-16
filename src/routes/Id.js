import { Link, useLoaderData } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'
import { yn2price } from '../util'

import { execute, buy } from '@mintbase-js/sdk';
import { mbjs } from '@mintbase-js/sdk';

mbjs.config({
		network: window.stateless_config.networkId,
		contractAddress: window.stateless_config.mintbaseContractId,
	//callbackUrl: 'https://mintbase.xyz/success',
})

// Display 1 NFT image with a bunch of metadata & deets
export default function Id(props){
	const loader = useLoaderData();

	const tagsList = loader.nft.metadata.tags?.map(tag => <span className="nft-tag">{tag}</span>)


	function NFTCollectors(){
		if (loader.nft.collectors.length == 0) {
			return(
				<div className="nft-no-collectors" />
			)
		} else {
			const collectorList = loader.nft.collectors?.map(l => <p key={l.owner} className="collector">{l.owner}</p>)
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


	function BuyButton(props){
		const handleBuy = async () => {

			const wallet = await props.walletSelector.wallet();
			const buyArgs = {
				contractAddress: window.stateless_config.mintbaseContractId,
				tokenId: props.listing.token.token_id, 
				//affiliateAccount: null,
				//marketId: window.stateless_config.mintbaseContractId,
				price: BigInt(props.listing.price) }

			await execute(
				{wallet},
				buy(buyArgs, 'testnet')
			);

		}

		return(
			<button onClick={handleBuy} type="button" className="nft-price nft-buy-button btn btn-outline-dark">{ yn2price(props.listing.price) } NEAR</button>
		)
	}


  return (
		<div className="id">

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
						{ (loader.nft.listing) ?
						<div className="nft-buy">
							<div className="row">
								<div className="col-sm"></div>
								<div className="col-sm-8">
									<BuyButton walletSelector={props.walletSelector} listing={loader.nft.listing} />
								</div>
								<div className="col-sm"></div>
							</div>
						</div>
								:
						<div className="row no-listing mb-5" />
						}

						<NFTCollectors />

						<div className="row mb-5" />
					</div>
				</div>

			</div>

		<Footer viewMode="detail" page={props.page} />

	</div>

	)
}

