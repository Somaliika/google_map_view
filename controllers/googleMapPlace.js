import {getStreetType} from "./serviceUtils";

/*
*		Setting up of map for displaying one place with a marker on map
*/
function initMarker() {
	if (!this.props.getAddress) return;
	let {city, address, streetNum} = this.props.getAddress();
	if (!address) return;
	if (this.state.marker)
		this.state.marker.setMap(null);
	let geocoder = new window.google.maps.Geocoder();
	let strType = getStreetType(this.state.streetType);
	geocoder.geocode( { 'address' : city +' '+strType+' '+address + ' ' + streetNum }, this.getLocation);
}

/*
*		Display a marker on map
*/
function placeMarker(location, mapView = this.state.mapView) {
	if (!location) return;
	let ad;
	if (this.props.getAddress)
		ad = this.props.getAddress();
	if (this.state.marker)
		this.state.marker.setMap(null);
	let marker = new window.google.maps.Marker({
		animation: window.google.maps.Animation.DROP,
		position: location,
		map: mapView,
		icon: "/static/images/map-markertf.png",
		title: (ad) ? (ad.city +' '+ad.address + ' ' + ad.streetNum) : ''
	});
	this.setState({marker});
}

/*
*		Callback from Google Maps API
*/
function getLocation(results, status) {
	if (status === window.google.maps.GeocoderStatus.OK ) {
		let lat = results[0].geometry.location.lat();
		let lng = results[0].geometry.location.lng();
		this.setState({center: {lat: lat, lng: lng}});
		if (this.props.changeCoordinates) this.props.changeCoordinates(lat, lng);
		this.placeMarker(results[0].geometry.location);
		this.state.mapView.setCenter(results[0].geometry.location);
		this.state.mapView.setZoom(this.chooseZoom(true));
	} else {
		console.log( 'Geocode was not successful for the following reason: ' + status );
	}
}

function isAddressExists() {
	if (!this.props.getAddress) return false;
	let {city, address, streetNum} = this.props.getAddress();
	let length = city.length + address.length + streetNum.length;
	return (length !== 0);
}

export {initMarker, placeMarker, getLocation, isAddressExists}