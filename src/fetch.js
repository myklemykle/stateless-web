import { redirect} from 'react-router-dom'

// gallery cache, static to this scope:
let nftGallery = [];

// Tidy up & fix potential glitches in store data:
function sanitizeGallery(g){
	for (let i = 0; i < g.length; i++){
		// sometimes the media field is a URI, other times it's a fragment.
		if (g[i].media.match(/^http/)) {
			g[i].media_url = g[i].media;
		} else {
			g[i].media_url = g[i].base_uri + '/' + g[i].media;
		}
	}
}

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


export async function storeLoader({params, request}) {
	// Did we get a reload request after running off the end of the store?
	if (params.page == -1){
		// Clear cache and redirect
		params.nftGallery = nftGallery = [];
		return redirect(params.viewMode == "4x" ? "/rnd4" : "/rnd");
	}

	// Is store already loaded? Do we need to reload it?
	if (nftGallery.length > 0) {
		params.nftGallery = nftGallery;
		return params
	}

	result = await fetchAllNFTs(window.stateless_config.networkId,
		window.stateless_config.mintbaseContractId,
		window.stateless_config.mintbaseApiKey
	).then(r => r.json())
	// TODO handle failure?
	
	nftGallery = result.data.mb_views_nft_metadata_unburned

	// Cleanup some bad data issues:
	sanitizeGallery(nftGallery)
	
	// Shuffle!
	shuffle(nftGallery)
	params.nftGallery = nftGallery
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

export async function fetchAllNFTs(network, storeId, apikey){
	return queryStore(network, apikey, galleryQuery(storeId))
}

export function galleryQuery(storeId) {
	return 'query MyQuery {\
  mb_views_nft_metadata_unburned(\
    where: {nft_contract_id: {_eq: "' + storeId + '"}}\
  ) {\
		base_uri\
    media\
    metadata_id\
  }\
}'

