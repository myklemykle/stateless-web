
// gallery cache, static to this scope:
let nftGallery = [];

export async function storeLoader({params}) {

	// Is store already loaded? Do we need to reload it?
	if (nftGallery.length > 0) {
		params.nftGallery = nftGallery;
		console.log('loaded')
		return params
	}

	result = await fetchAllNFTs(window.stateless_config.networkId,
		window.stateless_config.mintbaseContractId,
		window.stateless_config.mintbaseApiKey
	).then(r => r.json())
	// TODO handle failure
	nftGallery = params.nftGallery = result.data.mb_views_nft_metadata_unburned

	// TODO: shuffle!
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
    media\
    metadata_id\
  }\
}'

