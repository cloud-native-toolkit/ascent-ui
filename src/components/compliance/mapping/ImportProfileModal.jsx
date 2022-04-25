import React, { Component } from 'react';
import {
    Modal, FileUploader
} from 'carbon-components-react';

class ImportProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined
    };
    this.uploadProfile = this.uploadProfile.bind(this)
  }

  async uploadProfile() {
    const file = this.state.file;
    if (!file) return this.props.toast("error", "File Missing", "You must upload a file.");
    if (file.type !== "text/csv") return this.props.toast("error", "Wrong File Type", "Only .csv files are accepted.");
    if (file.size > 409600) return this.props.toast("error", "Too Large", "Max size exceeded: 400Kb.");
    let data = new FormData();
    data.append("file", file);
    this.props.mapping.addProfile(data).then((res) => {
      console.log(res)
      if (res && res.body && res.body.error) {
        this.props.toast("error", "Error", res.body.error.message);
      } else {
        if (res?.name) {
          this.props.toast("success", "Success", `Profile "${res.name}" successfully imported!`);
        }
        this.props.closeAndReload();
      }
    });
  }

  render() {
    return (
      <div className="bx--grid">
        <div className="bx--row">
          <Modal
            danger={this.props.danger || false}
            open={this.props.show}
            modalHeading={this.props.heading || "Import Profile"}
            primaryButtonText={this.props.submitText || "Yes"}
            secondaryButtonText="Cancel"
            onRequestClose={this.props.onClose}
            onRequestSubmit={this.uploadProfile}
            onSecondarySubmit={this.props.onSecondarySubmit}>
            <p style={{ marginBottom: '1rem' }}>
                Import a profile from <a href="https://cloud.ibm.com/security-compliance/profiles" target="_blank" rel="noopener noreferrer">IBM Security and Compliance</a>.
            </p>
            <FileUploader 
              accept={['.csv']}
              labelTitle={"Upload profile"}
              buttonLabel='Add file'
              labelDescription={"Max file size is 400Kb. Only .csv files are supported."}
              filenameStatus='edit'
              onChange={(event) => this.setState({file: event?.target?.files[0]})}
              onDelete={() => this.setState({file: undefined})}>
            </FileUploader>
          </Modal>
        </div>
      </div>
    );
  }

}
export default ImportProfileModal;