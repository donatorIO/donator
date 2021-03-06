import React from 'react'
import { withRouter } from 'react-router'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex                : 11
  }
}

class CheckIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      geolocation: ['Loading...'],
      locations: [],
      modalIsOpen: false,
      selectedLocation: null
    }
  }

  componentWillMount() {
    if (!this.props.isAuthenticated) {
      this.props.router.replace('/signin')
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition( (pos) => {
          this.setState({geolocation: [pos.coords.latitude, pos.coords.longitude]})
        })
      } else {
        this.setState({geolocation: ['foobarbaz']})
      }
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.channel.on('locations:near', payload => {
        this.setState({locations: payload.venues})
      })
      this.props.channel.on('check-in', payload => {
        console.log('Check-in result', payload)
      })
    }
  }

  componentWillUnmount() {
    if (this.props.channel) {
      this.props.channel.off('check-in')
      this.props.channel.off('locations:near')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.geolocation !== this.state.geolocation || nextState.locations !== this.state.locations || nextState.modalIsOpen !== this.state.modalIsOpen
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.geolocation !== this.state.geolocation) {
      this.props.channel.push('locations:near', {lat: nextState.geolocation[0], lng: nextState.geolocation[1]})
    }
   }

   openModal(loc) {
     this.setState({modalIsOpen: true, selectedLocation: loc})
   }

   closeModal = () => {
     this.setState({modalIsOpen: false})
   }

   handleCheckIn = () => {
     console.log('Checked in!', this.state.selectedLocation, this.state.geolocation)
     this.props.channel.push('check-in', { location: this.state.selectedLocation.venue, geolocation: this.state.geolocation })
     this.setState({modalIsOpen: false})
   }

  render() {
    let modal
    let content
    if (this.state.selectedLocation) {
      let location = this.state.selectedLocation
      modal = (<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
        <h3><img className="foursquare-icon" src={location.venue.categories[0].icon.prefix + '100' + location.venue.categories[0].icon.suffix} alt="" />{location.venue.name}</h3>
        <p>Address: {location.venue.location.formattedAddress.join(', ')}</p>
        <p>Phone: {location.venue.contact.formattedPhone}</p>
        <p>Category: {location.venue.categories[0].name}</p>
        <p>Donations:</p>
        <ul>
          <li>{location.donor.name[0].toUpperCase() + location.donor.name.substr(1)} - {location.donor.templates[0].sum_per_checkin / 100} € to {location.target.name[0].toUpperCase() + location.target.name.substr(1)} per Check-in</li>
        </ul>
        <button onClick={this.closeModal}>close</button>
        <button onClick={this.handleCheckIn}>Check In</button>
      </Modal>)
    }
    if (this.state.locations.length === 0) {
      content = (<div className="loading"><span className="icon-spinner2" /></div>)
    } else {
      content = (
        <div>
          <span style={{display: 'none'}}>{this.state.geolocation.join(',')}</span>
          <ul>
            {this.state.locations.map( (loc) => {
              return <li className="item checkin-item" key={loc.venue.id}><a onClick={this.openModal.bind(this, loc)}><img className="foursquare-icon" src={loc.venue.categories[0].icon.prefix + '88' + loc.venue.categories[0].icon.suffix} />{loc.venue.name}</a></li>
            })}
          </ul>
          {modal}
        </div>
      )
    }
    return content
  }
}

export default withRouter(CheckIn)
