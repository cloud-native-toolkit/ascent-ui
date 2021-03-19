import React, { Component } from "react";
import {
  DataTableSkeleton,
  Pagination
} from 'carbon-components-react';
import MappingTable from './MappingTable';
import { mappingHeaders } from '../data/data';


class MappingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      headerData: mappingHeaders,
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 10
    };
  }

  async componentDidMount() {
    const mappingDetails = await this.props.mapping.getMappings();
    //const mappingDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"control_id\":/g, "\"id\":"));
    this.setState({
      data: mappingDetails,
      totalItems: mappingDetails.length
    });
  }
  render() {
    const data = this.state.data;
    const headers = this.state.headerData;
    return (
      <div className="bx--grid">
        <div className="bx--row">
          <div className="bx--col-lg-16">
            <br></br>
            <h2 className="landing-page__subheading">
              Control Mapping
                        </h2>
            <br></br>
            <p>
              Mapping list showing the relationship between FS controls, IMB Cloud services and reference architectures for the FS Cloud.
            </p>
            <br></br>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-16">
            {data.length === 0 ?
              <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={10}
                headers={headers}
              />
              :
              <>
                <MappingTable
                  headers={headers}
                  rows={data.slice(
                    this.state.firstRowIndex,
                    this.state.firstRowIndex + this.state.currentPageSize
                  )}
                  mapping={this.props.mapping}
                  controls={this.props.controls}
                  services={this.props.services}
                  arch={this.props.arch}
                />
                <Pagination
                  totalItems={this.state.totalItems}
                  backwardText="Previous page"
                  forwardText="Next page"
                  pageSize={this.state.currentPageSize}
                  pageSizes={[5, 10, 15, 25]}
                  itemsPerPageText="Items per page"
                  onChange={({ page, pageSize }) => {
                    if (pageSize !== this.state.currentPageSize) {
                      this.setState({
                        currentPageSize: pageSize
                      });
                    }
                    this.setState({
                      firstRowIndex: pageSize * (page - 1)
                    });
                  }}
                />
              </>
            }
          </div>
        </div>
      </div >
    );

  }
}
export default MappingView;
