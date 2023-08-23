import { redirect} from 'react-router-dom'

// gallery cache, static to this scope:
let nftGallery = []
let nftGalleryCursor = 0;
let nftGalleryQueryMode = "store" // "store", "artist" or "owner"


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


// Tidy up & fix potential glitches in gallery data:
function sanitizeGallery(g){
	// Jettison any records with a null medial field.
	g = g.filter((nft)=> nft.media != null);

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

// Loader for NFT gallery browsing.  
// Fetches the thing-id (metadataId) and an image for every NFT in the gallery.
// Tries to clean up a few obvious data glitches -- hopefully not present in mainnet data?
// Shuffles the list randomly after fetching.
// Caches the list in nftGallery[].
//
export async function galleryLoader({params, request}) {
	if (! isNaN(parseInt(params.page)))
		params.page = parseInt(params.page)

	if (params.queryMode != nftGalleryQueryMode) {
		// Change query mode 
		nftGalleryQueryMode = params.queryMode
		// Clear cache
		params.nftGallery = nftGallery = []
	}

	if (params.page == -1) { 
		// Handle a reload request after running off the end of the gallery:
		// Clear cache 
		params.nftGallery = nftGallery = []

		// Redirect to the same route/path we're on, but with no page number (i.e. page number zero)
		let url = new URL(request.url)
		if (url.pathname.match(/\/-1$/)){
			return redirect(url.pathname.replace(/\/-1$/, '')
				+ url.search  // if any
			) 
		} else {
			throw new Error("cant grok path to rewrite it")
		}
	}

	if (nftGallery.length > 0) {
		// Gallery is already loaded
		params.nftGallery = nftGallery
		params.nftGalleryCursor = nftGalleryCursor
		return params
	}

	let result
	if (params.queryMode?.match(/^artist.*/)) {
		console.log("fetching minter nfts")
		// Symbol mismatch: we call the person who mints art "artist", but Mintbase calls them "minter"
		result = await fetchMinterNFTs(window.stateless_config.networkId,
			window.stateless_config.mintbaseApiKey,
			window.stateless_config.mintbaseContractId,
			params.artistId
		).then(r => r.json())

	} else if (params.queryMode?.match(/^owner.*/)) {
		console.log("fetching owner nfts")
		result = await fetchOwnerNFTs(window.stateless_config.networkId,
			window.stateless_config.mintbaseApiKey,
			window.stateless_config.mintbaseContractId,
			params.ownerId
		).then(r => r.json())

	} else { 
		console.log("fetching all store nfts")
		result = await fetchAllNFTs(window.stateless_config.networkId,
			window.stateless_config.mintbaseApiKey,
			window.stateless_config.mintbaseContractId,
		).then(r => r.json())
	}
	
	console.log("done fetching")
	nftGallery = result.data.nftList

	// Cleanup some bad data issues:
	sanitizeGallery(nftGallery)
	
	// Shuffle!
	shuffle(nftGallery)

	params.nftGallery = nftGallery
	params.nftGalleryCursor = nftGalleryCursor
	return params
}

// Wrappers around galleryLoader for 'artist' and 'owner' modes.
// Seems we have to do this sort of hacky-looking thing, or else uglier things,
// to get state from the route definition to the route loader.
export async function artistLoader(args){
	args.params.queryMode = "artist-" + args.params.artistId
	return galleryLoader(args)
}

export async function ownerLoader(args){
	args.params.queryMode = "owner" + args.params.ownerId
	return galleryLoader(args)
}

export async function nftLoader({params, request}){
	result = await fetchNFTMeta(window.stateless_config.networkId,
		window.stateless_config.mintbaseApiKey,
		params.nftid,
	).then(r => r.json())

	params.nft = result.data
	sanitizeNFT(params.nft)
	
	// if we have a gallery loaded, set the cursor to this particular NFT's index
	if (nftGallery.length) {
		let n = nftGallery.findIndex(o => o.metadata_id == params.nftid)
		if (n > -1)
			nftGalleryCursor = n
	}


	params.nftGallery = nftGallery
	params.nftGalleryCursor = nftGalleryCursor
	return params
}


export async function queryGallery(network, apikey, query){
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

export async function fetchAllNFTs(network, apikey, galleryId){
	return queryGallery(network, apikey, galleryQuery(galleryId))
}

export async function fetchMinterNFTs(network, apikey, galleryId, minterId){
	return queryGallery(network, apikey, minterQuery(galleryId, minterId))
}

export async function fetchOwnerNFTs(network, apikey, galleryId, ownerId){
	return queryGallery(network, apikey, ownerQuery(galleryId, ownerId))
}

export async function fetchNFTMeta(network, apikey, metadataId){
	return queryGallery(network, apikey, nftQuery(metadataId))
}

export function galleryQuery(galleryId) {
	return `query MyGalleryQuery {
		nftList: mb_views_nft_metadata_unburned(
			where: {nft_contract_id: {_eq: "` + galleryId + `"}}
		) {
			base_uri
			media
			metadata_id
			reference
		}
	}`
}

export function minterQuery(galleryId,minterId) {
	return `query MyMinterQuery {
		nftList: mb_views_nft_metadata_unburned(
			where: {
				nft_contract_id: {_eq: "` + galleryId + `"}
				minter: {_eq: "` + minterId + `"}
			}
		) {
			base_uri
			media
			metadata_id
			reference
		}
	}`
}

// Is it necessary to remove self-owned entries here?  To end up in this table,
// I think you'd have to actually purchase an NFT from yourself,
// or buy it back from someone who bought it from you,
// in which case you sort of did collect it ...
export function ownerQuery(galleryId,ownerId) {
	return `query MyOwnerQuery {
		nftList: mb_views_nft_owned_tokens(
			where: {
				nft_contract_id: {_eq: "` + galleryId + `"}
				owner: {_eq: "` + ownerId + `"}
			}
			distinct_on: metadata_id
		) {
			base_uri
			media
			metadata_id
			reference
			owner
			minter
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
				burned_timestamp: {_is_null: true},
			}
		) {
			aggregate {
				count
			}
		}

		collectors: mb_views_nft_tokens(
			where: {
				metadata_id: { _eq: "` + metadataId + `"}
				burned_timestamp: {_is_null: true},
			}
			distinct_on: owner
		) {
			token_id
			owner
		}

		minters: nft_tokens(
			distinct_on: minter
			where: {
				metadata_id: { _eq: "` + metadataId + `"}
				burned_timestamp: {_is_null: true},
			}
		) {
			minter
		}

		listings: mb_views_active_listings (
			where: {
				metadata_id: { _eq: "` + metadataId + `"}
				kind: { _eq: "simple" }
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
