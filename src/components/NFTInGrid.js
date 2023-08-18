import { Link, useLoaderData, useNavigation } from "react-router-dom";

export default function NFTInGrid(props){
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

