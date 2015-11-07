import React from 'react';
import {GoogleMap, Marker} from "react-google-maps";

export default class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      geolocation: [60.192932, 24.946743800000004], // default center Ultrahack
      locations: [],
      markers: [{
     		position: {
    		lat: 25.0112183,
    		lng: 121.52067570000001,
    	},
    	key: "Taiwan",
    	defaultAnimation: 2
    	}],
    }
  }

  componentWillMount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition( (pos) => {
        
        this.setState({geolocation: [pos.coords.latitude, pos.coords.longitude]})

        //console.log(this.state.geolocation[0])
      })
    } else {
      this.setState({geolocation: [25.0112183, 121.52067570000001]})
    }

  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.geolocation !== this.state.geolocation
  }

  componentWillUpdate(nextProps, nextState) {
  	console.log("will update", this.state.geolocation)
  }


  render() {
  	console.log("rend", this.state.geolocation)
    return (
   <div>
      <GoogleMap containerProps={{
          ...this.props,
          style: {
            height: "300px",
            width: "300px"
          },
        }}
        ref="map"
        defaultZoom={14}
        center={{lat: this.state.geolocation[0], lng: this.state.geolocation[1]}}
        >
        {this.state.markers.map((marker, index) => {
          return (
            <Marker
              {...marker} />
          );
        })}
      </GoogleMap></div>
    );

  }
}
