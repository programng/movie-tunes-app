import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import AudioItem from './AudioItem';


class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      genres: [],
    };
    this.handleFiles = this.handleFiles.bind(this);
  }
  handleFiles(e) {
    this.setState({
      files: e.target.files,
    });
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      data.append('files', files[i]);
    }
    axios.post('/helloworld', data)
    .then((response) => {
      console.log('response', response);
      this.setState({
        genres: response.data,
      });
    })
    .catch((error) => {
      console.log('error', error);
    });
  }
  render() {
    return (
      <div className="landing">
        <Link to="/about">About {d3.version}</Link>
        <h1 className="landing-name">ENSONGBLE</h1>
        <h2 className="landing-sub-name">by Jonathan Ng</h2>
        <input onChange={this.handleFiles} type="file" id="input" multiple />
        {Array.prototype.map.call(this.state.files,
          (file, i) => <AudioItem
            key={file.name}
            predictedGenre={this.state.genres[i]}
            src={URL.createObjectURL(file)}
          />)}
      </div>
    );
  }
}

Landing.propTypes = {

};
Landing.defaultProps = {

};

export default Landing;
