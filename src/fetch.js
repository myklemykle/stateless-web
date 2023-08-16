import { redirect} from 'react-router-dom'

// gallery cache, static to this scope:
let nftGallery = []

// Shuffle an array 
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
  let currentIndex = array.length,  randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}


// Tidy up & fix potential glitches in store data:
function sanitizeGallery(g){
	for (let i = 0; i < g.length; i++){
		// sometimes the media field is a URI, other times it's a fragment.
		if (g[i].media.match(/^http/)) {
			g[i].media_url = g[i].media
		} else {
			g[i].media_url = g[i].base_uri + '/' + g[i].media
		}
	}
}

// Tidy up & fix potential glitches in NFT data:
function sanitizeNFT(n){
	if (n.metadata.length == 1) {
		n.metadata = n.metadata[0]
	} else {
		throw new Error("weird query result")
	}

	if (n.minters.length == 1) {
		n.minter = n.minters[0].minter
	} else {
		throw new Error("weird number of minters")
	}

	// query limits this to one listing (the cheapest) but it can still be zero.
	if (n.listings.length == 1) {
		n.listing = n.listings[0]
	} else if (n.listings.length > 1){
		throw new Error("weird number of listings")
	}


	if (n.tokenCount?.aggregate?.count){
		n.count = n.tokenCount.aggregate.count
	}

	if (n.minters.length == 1) {
		n.metadata.minter = n.minters[0]
	} else {
		throw new Error("weird number of minters!")
	}

	// "collectors" don't include the minter.
	n.collectors = n.collectors.filter(c => {
		return (c.owner != n.minter)
	}); // interestingly, JS requires a semicolon here because the next line starts with an array bracket

	['media','description','title','tags','media_type'].forEach((field)=>{
		// These are the fields I sometimes see as duplicates, which is lame schematics.
		// If they are blank in the parent & present in the reference_blob, promote them.
		if (! n.metadata[field]){
			if (n.metadata.reference_blob && n.metadata.reference_blob[field])
				n.metadata[field] = n.metadata.reference_blob[field]
			else
				// just blank i guess?
				n.metadata[field] = null
		}
	})

	if (n.metadata.media.match(/^http/)) {
		n.metadata.media_url = n.metadata.media
	} else {
		n.metadata.media_url = n.metadata.base_uri + '/' + n.metadata.media
	}
}

// Loader for NFT store browsing.  
// Fetches the thing-id (metadataId) and an image for every NFT in the store.
// Tries to clean up a few obvious data glitches -- hopefully not present in mainnet data?
// Shuffles the list randomly after fetching.
// Caches the list in nftGallery[].
//
export async function storeLoader({params, request}) {
	// Did we get a reload request after running off the end of the store?
	if (params.page == -1){
		// Clear cache and redirect
		params.nftGallery = nftGallery = []
		return redirect(params.viewMode == "4x" ? "/rnd4" : "/rnd")
	}

	// Is store already loaded? Do we need to reload it?
	if (nftGallery.length > 0) {
		params.nftGallery = nftGallery
		return params
	}

	result = await fetchAllNFTs(window.stateless_config.networkId,
		window.stateless_config.mintbaseApiKey,
		window.stateless_config.mintbaseContractId,
	).then(r => r.json())
	
	nftGallery = result.data.mb_views_nft_metadata_unburned

	// Cleanup some bad data issues:
	sanitizeGallery(nftGallery)
	
	// Shuffle!
	shuffle(nftGallery)
	params.nftGallery = nftGallery
	return params
}

export async function nftLoader({params, request}){
	// TODO: cache?
	result = await fetchNFTMeta(window.stateless_config.networkId,
		window.stateless_config.mintbaseApiKey,
		params.nftid,
	).then(r => r.json())

	params.nft = result.data
	sanitizeNFT(params.nft)
	return params
}


export async function queryStore(network, apikey, query){
	// network should be "mainnet" or "testnet"
	return fetch("https://graph.mintbase.xyz/" + network, { 
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			  "Accept": "application/json",
				"mb-api-key": apikey,  
			},
			body: JSON.stringify({query: query})
		}
	)
}

export async function fetchAllNFTs(network, apikey, storeId){
	return queryStore(network, apikey, galleryQuery(storeId))
}

export async function fetchNFTMeta(network, apikey, metadataId){
	return queryStore(network, apikey, nftQuery(metadataId))
}

export function galleryQuery(storeId) {
	return `query MyGalleryQuery {
		mb_views_nft_metadata_unburned(
			where: {nft_contract_id: {_eq: "` + storeId + `"}}
		) {
			base_uri
			media
			metadata_id
			reference
		}
	}`
}

// This is a copy of the big metadata query in the broken/beta mintbasejs-data, which seems broken ATM ...
// as far as I can tell, 'metadataId' is the "thing id" for NFTs that mint multiple. ("id" is for each unique mint.)
// "burned" are destroyed records that still exist in the chain so we manually ignore them (hmmmmm)
export function nftQuery(metadataId) {
	return `query MyQuery {
		metadata: nft_metadata(
			where: {
				id: { _eq: "` + metadataId + `"}
			}
		) {
			title
			description
			media
			reference_blob
			base_uri
		}

		tokenCount: nft_tokens_aggregate(
			where: {
				metadata_id: { _eq: "` + metadataId + `"}
			}
		) {
			aggregate {
				count
			}
		}

		collectors: mb_views_nft_tokens(
			where: {
				burned_timestamp: {_is_null: true},
				metadata_id: { _eq: "` + metadataId + `"}
			}
			distinct_on: owner
		) {
			token_id
			owner
		}

		minters: nft_tokens(
			distinct_on: minter
			where: {
				burned_timestamp: {_is_null: true},
				metadata_id: { _eq: "` + metadataId + `"}
			}
		) {
			minter
		}

		simpleSaleCount: mb_views_active_listings_aggregate (
			where: {
				kind: { _eq: "simple" }
				metadata_id: { _eq: "` + metadataId + `"}
			}
		) {
			aggregate {
			count
			}
		}

		listings: mb_views_active_listings (
			where: {
				metadata_id: { _eq: "` + metadataId + `"}
			}
			limit: 1,
			order_by: { price: desc }
		) {
			kind
			price
			market_id
			token {
				token_id
				minter
				nft_contract_id
				owner
				splits
				royalties
			}
		}
	}`
}
