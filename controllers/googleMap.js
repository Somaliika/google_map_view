import {MapMode} from "../constants";
import {getLocation, initMarker, isAddressExists, placeMarker} from "./googleMapPlace";
import {circleCreate, initCircles, removeLast} from "./googleMapDrawing";

/*
*		Start tunning a map
*/
function initMap(mapContainer = this.state.mapContainer) {
	if (!mapContainer)
		return;
	let google = window.google;
	let mapView = new google.maps.Map(mapContainer, {
		center: this.state.center,
		zoom: this.chooseZoom(),
		mapTypeControl: false,
		streetViewControl: false,
	});
	this.setState({mapView});
	if (this.state.mapMode === MapMode.DRAWING)
		setDrawing.call(this, mapView);
	else if (this.state.mapMode === MapMode.CIRCLES)
		setCircles.call(this, mapView);
	else if (this.state.mapMode === MapMode.ONE_PLACE)
		setMarker.call(this, mapView);
}

/*
*		Setting up of map for drawing circles on map
*/
function setDrawing(mapView) {
	let google = window.google;
	let drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.CIRCLE,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: ['circle'],
		},
		circleOptions: {
			fillColor: '#aaff73',
			strokeWidth: 0.5,
			strokeColor: '#009688',
			fillOpacity: 0.5,
			strokeWeight: 2,
			clickable: true,
			editable: true,
			zIndex: 1
		}
	});
	drawingManager.setMap(mapView);
	google.maps.event.addListener(drawingManager, 'circlecomplete', this.circleCreate);
	setCircles.call(this, mapView);
}

/*
*		Setting up of map for displaying circles on map
*/
function setCircles(mapView) {
	let google = window.google;
	this.setState({google: google, circles: []});
	this.initCircles(mapView, google);
}

/*
*		Setting up of map for displaying one place with a marker on map
*/
function setMarker(mapView) {
	if (this.props.center) {
		this.placeMarker(this.props.center, mapView);
		mapView.setCenter(this.props.center);
		mapView.setZoom(this.chooseZoom(true));
	} else if (isAddressExists.call(this))
		this.initMarker();
	window.google.maps.event.addListener(mapView, 'click', this.props.markerListener);
}

function chooseZoom(closeToHouse) {
	if (this.state.mapMode === MapMode.ONE_PLACE && closeToHouse)
		return 17;
	if (this.state.mapMode === MapMode.ONE_PLACE)
		return 6;
	if (this.state.mapMode === MapMode.DRAWING)
		return 10;
	if (this.state.mapMode === MapMode.CIRCLES)
		return 11;
	return 12;
}

function bindingFunctions() {
	this.initMap = initMap.bind(this);
	this.initCircles = initCircles.bind(this);
	this.circleCreate = circleCreate.bind(this);
	this.removeLast = removeLast.bind(this);
	this.initMarker = initMarker.bind(this);
	this.placeMarker = placeMarker.bind(this);
	this.getLocation = getLocation.bind(this);
	this.chooseZoom = chooseZoom.bind(this);
}

export {initMap, chooseZoom, bindingFunctions}