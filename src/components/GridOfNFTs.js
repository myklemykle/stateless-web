import { Link, useLoaderData, useNavigation } from "react-router-dom";

function NFTInGrid(props){
	const nav = useNavigation()

	if (nav.state === "loading") {
		return(
						<div className="nft-loading" />
		)
	} else if (! props.nft_record) {
		// Here is how we handle missing records, when the total set isn't an even multiple of 4
		return(

						<div className="no-nft" />

		)
	} else{ 
		let nft = props.nft_record
		return(

						<div className="nft-col col-sm-5">
							<Link to={'/id/' + nft.metadata_id}>
								<img src={nft.media_url} className="nft-img img-fluid"/>
							</Link>
						</div>

		)
	}
}


export default function GridOfNFTs(props){
	let gridItems = props.gridItems
	return(

				<div className="nft-4up">
          <div className="row align-items-center">
            <div className="col-sm-1"></div>
            <NFTInGrid nft_record={gridItems[0]}  />
            <NFTInGrid nft_record={gridItems[1]}  />
            <div className="col-sm-1"></div>
          </div>
          <div className="row align-items-center">
            <div className="col-sm"></div>
            <NFTInGrid nft_record={gridItems[2]}  />
            <NFTInGrid nft_record={gridItems[3]}  />
            <div className="col-sm"></div>
          </div>
        </div>

	)
}
