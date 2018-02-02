import React, { Component } from 'react';
import './App.css';

const FLICKR_KEY = '134dab09147fa182187be9c84116e62c';
const arrowUrl = 'https://n6-img-fp.akamaized.net/free-icon/right-arrow_318-131657.jpg?size=338c&ext=jpg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      pictures: [],
      indexVal: 0,
      searchTerm: 'earth shine',
      barPosition: 0
    };
  }
  componentDidMount() {
    this.RefreshImageSet();
  }

  setImagebyIndex = (e) => {
    const current = e.target.getAttribute('index');
    this.setState({ indexVal: current, barPosition: current * -178 });
  }

  Debounce = (function () {
    let counter = 0;
    return function (callback, ms) {
      clearTimeout(counter);
      counter = setTimeout(callback, ms);
    };
  })();

  termChanged = (e) => {
    this.setState({ searchTerm: e.target.value, indexVal: 0, barPosition: 0 });
  }
  nextHandler = () => {
    let current = this.state.indexVal;
    if (current === this.state.pictures.length - 1) {
      current = 0;
    } else {
      current++;
    }
    this.setState({ indexVal: current, barPosition: current * -178 });
  }

  prevHandler = () => {
    let current = this.state.indexVal;
    if (current === 0) {
      current = this.state.pictures.length - 1;
    } else {
      current--;
    }
    this.setState({ indexVal: current, barPosition: current * -178 });
  }

  RefreshImageSet = () => {
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_KEY}&tags=${this.state.searchTerm}&format=json&nojsoncallback=1`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const photoArray = data.photos.photo.map((photo, i) => {
        const imgUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        return (
          <img
            index={i}
            key={photo.id}
            alt={photo.title}
            src={imgUrl}
            onClick={this.setImagebyIndex}
          />
        );
      });
      this.setState({ pictures: photoArray });
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <header>flickr-carousel-react</header>
        <p>
          <input
            className="searchTerm"
            onChange={this.termChanged}
            onKeyUp={() => this.Debounce(function () {
              this.RefreshImageSet();
            }.bind(this), 1000)}
          />
        </p>
        <p className="App-intro">
          {this.state.searchTerm} #{this.state.indexVal}
        </p>
        <div className="wrapper">
          <div className="btnContainer">
          <img alt="Prev" src={arrowUrl} onClick={this.prevHandler} className="arrows prev" />
          </div>
          <div className="mainImg">
            {this.state.pictures[this.state.indexVal]}
          </div>
          <div className="btnContainer">
          <img alt="Next" src={arrowUrl} onClick={this.nextHandler} className="arrows next" />
          </div>
        </div>
        <div className="barWrapper">
          <div
            className="thumbNailBar"
            style={{
              width: `(${this.state.pictures.length} * 178)px`,
              left: `${this.state.barPosition}px` }}
          >
            {this.state.pictures}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
