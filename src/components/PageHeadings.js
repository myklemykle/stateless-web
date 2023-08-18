export function ArtistHeading(props){
  return(

        <div className="artist-info container text-center mt-5">
          <div className="row">
            <div className="col">
              ARTIST: {props.artistId}
            </div>
          </div>
        </div>

  )
}

export function OwnerHeading(props){
	return(

			<div className="owner-info container text-center mt-5">
        <div className="row">
          <div className="col">
            COLLECTOR: {props.ownerId}
          </div>
        </div>
			</div>

	)
}
