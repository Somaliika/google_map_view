import {MapMode} from "../constants";

/*
*		Setting up of displaying circles on map
*/
function initCircles(mapView = this.state.mapView, google = this.state.google) {
	if (!mapView)
		return;
	for (let item of this.state.places){
		let circle = new google.maps.Circle({
			fillColor: '#aaff73',
			strokeColor:'#009688',
			strokeWidth: 0.5,
			fillOpacity: 0.5,
			strokeWeight: 2,
			clickable: true,
			editable: (this.state.mapMode === MapMode.DRAWING),
			zIndex: 1,
			map: mapView,
			center: item.center,
			radius: item.radius,
			id:item.id
		});
		this.circleCreate(circle);
	}
}

/*
*		Display one circle
*/
function circleCreate(circle) {
	let radius = circle.getRadius();
	let center = circle.getCenter();
	if (radius < 50) {
		circle.setMap(null);
		return ;
	}
	let places = this.state.places;
	let circles = this.state.circles;
	if (!circle.id){
		circle.id = getNewCircleId(circles);
		places.push({id: circle.id, radius:radius, center: {lat:center.lat(), lng:center.lng()}, serverId: null});
	}
	circle.addListener('click', clickCircle.bind(this, circle, circles));
	circle.addListener('rightclick', right_click_circle.bind(this, circle, circles, places));
	circle.addListener('radius_changed', radius_changed_circle.bind(this, circle, places));
	circle.addListener('center_changed', center_changed_circle.bind(this, circle, places));
	circles.push(circle);
	this.setState({circles, places});
	if (this.state.mapMode === MapMode.DRAWING)
		this.props.getPrefPlaces(places);
}

/*
*		Handler of removing last circle
*/
function removeLast() {
	let circles = this.state.circles;
	let places = this.state.places;
	if (!circles.length)
		return ;
	circles[circles.length - 1].setMap(null);
	circles.splice(circles.length - 1, 1);
	places.splice(places.length - 1, 1);
}

/*
*		Determining new id
*/
function getNewCircleId(circles) {
	let id = 1;
	for (let circle of circles) {
		if (circle.id >= id) id = circle.id + 1;
	}
	return id;
}

/*
*		Handlers of event listeners
*/
function right_click_circle(circle, circles, places) {
	for (let i = 0; i<places.length; i++) {
		if (places[i].id === circle.id){
			places.splice(i, 1);
			break;
		}
	}
	for (let i = 0; i<circles.length; i++) {
		if (circles[i].id === circle.id){
			circles.splice(i, 1);
			break;
		}
	}
	circle.setMap(null);
}

function clickCircle(circle, circles) {
	circle.set('editable',true);
	for (let i = 0; i<circles.length; i++) {
		if (circles[i].id !== circle.id && circle.editable === true)
			circles[i].set('editable',false);
	}
}

function radius_changed_circle(circle, places) {
	for (let i = 0; i<places.length; i++) {
		if (places[i].id === circle.id){
			places[i].radius = circle.getRadius();
			break;
		}
	}
}

function center_changed_circle(circle, places) {
	for (let i = 0; i<places.length; i++) {
		if (places[i].id === circle.id){
			places[i].center = circle.getCenter();
			break;
		}
	}
}

export {initCircles, circleCreate, removeLast}