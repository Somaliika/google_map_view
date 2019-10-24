import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {initMap, bindingFunctions} from "../controllers/googleMap";

const styles = () => ({
	root: {
		height: '50vh',
		width: '100%',
	},
});

class GoogleMap extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.places)
			this.state.places = this.props.places;
		bindingFunctions.call(this);
	}
	state = {
		mapMode: this.props.mapMode,
		mapContainer: null,
		mapView: null,
		google: null,
		circles: [],
		places: [],
		marker: null,
		center: {
			lat: 50.45,
			lng: 30.53
		},
	};
	componentDidMount() {
		if (this.props.setRef)
			this.props.setRef(this);
	}
	componentDidUpdate() {
		if (this.props.places && this.props.places.length !== this.state.places.length)
			this.setState({places: this.props.places});
		if (this.props.center && (this.props.center.lat != this.state.center.lat ||
			this.props.center.lng != this.state.center.lng))
			this.setState({center: this.props.center});
	}
	render() {
		const { classes, rootStyles } = this.props;
		return (
			<div className={classes.root} style={rootStyles}
					 ref={(mapContainer) => {
							 if (!this.state.mapContainer) {
								 this.setState({mapContainer});
								 initMap.call(this, mapContainer);
							 }
						 }
					 }
			/>
		);
	}
}

GoogleMap.propTypes = {
	classes: PropTypes.object.isRequired,
	rootStyles: PropTypes.object,
	mapMode: PropTypes.number.isRequired,
	center: PropTypes.object,
	markerListener: PropTypes.func,
	places: PropTypes.array,
	getAddress: PropTypes.func,
	changeCoordinates: PropTypes.func,
	setRef: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(GoogleMap);