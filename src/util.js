
// convert yoctonear to near as accurately as we can
export function yn2n(t) {
	return t * Math.pow(10, -24)
}

// convert yoctonear to near, rounded to (max) 2 decimal places
export function yn2price(t) {
	return (Math.round(yn2n(t)* 100) / 100)
}

// HACK:
// These patterns match some path components from the Router in index.js
// they should really only be defined in one place!
// We are stripping them off the end of the pathname because they could be alone or after artist/ or owner/

let singlePagePat = /\/s(?:\/\d+)?$/ // match /s (single) paths, with or without /page
let gridPagePat = /\/g(?:\/\d+)?$/   // match /g (grid) paths, with or without /page
let detailPagePat = /\/id\/.*$/  // match /id (detail) paths

// The paths we want to navigate to when people click these view selectors in different contexts ... it's complicated.
export function reloadSelectorPath(nftGallery, nftGalleryCursor, viewMode, currentPage){
	let u = new URL(location.href)
	let reloadPath, reloadPage
	currentPage == currentPage || 0

  switch(viewMode) {
    case "single":
      // We are in single mode.
      reloadPage = currentPage + 1           // reload links to the next single page.
			if (reloadPage >= nftGallery.length)
				reloadPage = -1
			reloadPath = '/s/' + reloadPage
			if (u.pathname != '/') {
				reloadPath = u.pathname.replace(singlePagePat,'') + reloadPath
			}
      break;

    case "grid":
      reloadPage = currentPage + 1           // reload links to the next grid page
			if (reloadPage * 4 >= nftGallery.length)
				reloadPage = -1;
			reloadPath = (reloadPage != 0 ? '/g/' + reloadPage : '/g') // rewrite /g/0 to /g
			if (u.pathname != '/') {
				reloadPath = u.pathname.replace(gridPagePat,'') + reloadPath
			}
      break;

    case "detail":
			// sometimes nftGallery is not loaded
			if (nftGallery.length) {
				let cursor = (nftGalleryCursor + 1) % nftGallery.length // the next one in the gallery
				let reloadId = nftGallery[cursor].metadata_id 
				reloadPath = '/id/' + reloadId
			} else { 
				reloadPath = '/' // just go load the gallery.
			}
  }

	return reloadPath
}

export function singleSelectorPath(nftGallery, nftGalleryCursor, viewMode, currentPage){
	let u = new URL(location.href)
	let singlePath, singlePage
	currentPage == currentPage || 0

  switch(viewMode) {
    case "single":
			// We are in single mode, this is a link to the current path.
			return u.pathname;

    case "grid":
			// we are in grid mode, single switches to single mode with the first NFT of our grid
      singlePage = currentPage * 4
			singlePath = (singlePage > 0 ? '/s/' + singlePage : '/s')  // rewrite /s/0 to /s

			if (u.pathname != '/') {
				singlePath = u.pathname.replace(gridPagePat,'') + singlePath
			}
			return singlePath

    case "detail":
			if (nftGallery) {
				singlePage = nftGalleryCursor
				singlePath = (singlePage > 0 ? '/s/' + singlePage : '/s')  // rewrite /s/0 to /s
				if (u.pathname != '/') {
					singlePath = u.pathname.replace(detailPagePat,'') + singlePath
					return singlePath
				}
			}
			// TODO: how to trigger a load if there's a partial gallery? Need a special route?
			return '/' // otherwise just go load the gallery.
	}
}


export function gridSelectorPath(nftGallery, nftGalleryCursor, viewMode, currentPage){
	let u = new URL(location.href)
	let gridPath, gridPage
	currentPage == currentPage || 0

  switch(viewMode) {
    case "grid":
			// we are in grid mode, this is a link to the current path
			return u.pathname;

    case "single":
			// We are in single mode, grid links to the grid with this NFT on it.
			gridPage = Math.floor(currentPage / 4)
			gridPath = (gridPage > 0 ? '/g/' + gridPage : '/g') 
			if (u.pathname != '/') {
				gridPath = u.pathname.replace(singlePagePat,'') + gridPath
			}
			return gridPath

    case "detail":
			// grid links to the page with this page's NFT on it.
			if (nftGallery) {
				gridPage = Math.floor(nftGalleryCursor / 4)
				gridPath = (gridPage > 0 ? '/g/' + gridPage : '/g') 
				if (u.pathname != '/') {
					gridPath = u.pathname.replace(detailPagePat,'') + gridPath
				}
				return gridPath
			}
			return '/' // otherwise just go load the gallery.
	}
}

// clean up the profile data we get back from near.social 
export function sanitizeProfile(profile, id) {
	if (profile && profile[id]) { // if we loaded something
		profile = profile[id].profile
		if (profile.image) {
			// this is a HACK until I figure out how near.social really wants this done:
			profile.image.src = "https://i.near.social/magic/large/https://near.social/magic/img/account/" + id
		}
	}
	return profile
}


