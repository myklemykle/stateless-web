
// convert yoctonear to near as accurately as we can
export function yn2n(t) {
	return t * Math.pow(10, -24)
}

// convert yoctonear to near, rounded to (max) 2 decimal places
export function yn2price(t) {
	return (Math.round(yn2n(t)* 100) / 100)
}
