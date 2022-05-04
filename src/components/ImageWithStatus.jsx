import React from "react";

class ImageWithStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageStatus: "loading" };
  }

  handleImageLoaded() {
    this.setState({ imageStatus: "loaded" });
  }

  handleImageErrored() {
    this.setState({ imageStatus: "failed to load" });
  }

  render() {
    return (
      <div>
        <img
            hidden={this.state.imageStatus!=='loaded'}
            src={this.props.imageUrl}
            onLoad={this.handleImageLoaded.bind(this)}
            onError={this.handleImageErrored.bind(this)}
            alt={this.props.alt}
        />
        {this.state.imageStatus!=='loaded' && this.props.replacement}
      </div>
    );
  }
}
export default ImageWithStatus;

