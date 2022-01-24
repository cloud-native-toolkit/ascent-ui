import React, { Component } from 'react';
import {
  Button, Column, Grid, Row, Select, SelectItem, TextInput
} from 'carbon-components-react';
import { Search16 } from '@carbon/icons-react';

import './CatalogFilter.scss';

import { catalogFilters } from '../data/data';

class CatalogFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.catalogFilters?.searchText || '',
    };
  }

  render() {
    return (
      <div className="CatalogFilter">
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.category || ''}
            helperText="Filter by module category"
            id="categories"
            labelText="Category"
            onChange={(e) => this.props.filterCatalog('category', e.target.value)}
          >
            {this.selectItems(catalogFilters.categoryValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.cloudProvider || ''}
            helperText="Filter by a cloud provider"
            id="cloudProviders"
            labelText="Cloud provider"
            onChange={(e) => this.props.filterCatalog('cloudProvider', e.target.value)}
          >
            {this.selectItems(catalogFilters.cloudProviderValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.softwareProvider || ''}
            helperText="Filter by a software provider"
            id="softwareProviders"
            labelText="Software provider"
            onChange={(e) => this.props.filterCatalog('softwareProvider', e.target.value)}
          >
            {this.selectItems(catalogFilters.softwareProviderValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.moduleType || ''}
            helperText="Filter by module type"
            id="moduleType"
            labelText="Module type"
            onChange={(e) => this.props.filterCatalog('moduleType', e.target.value)}
          >
            {this.selectItems(catalogFilters.moduleTypeValues)}
          </Select>
        </div>
        <div className="FormElement">
          <Select
            defaultValue={this.props.catalogFilters?.status || ''}
            helperText="Filter by status"
            id="status"
            labelText="Status"
            onChange={(e) => this.props.filterCatalog('status', e.target.value)}
          >
            {this.selectItems(catalogFilters.statusValues)}
          </Select>
        </div>
        {!this.props.hideSearch && <div className="FormElement">
          <Grid style={{ paddingRight: '0', paddingLeft: '0' }}>
            <Row>
              <Column lg={{ span: 9 }} style={{ paddingRight: '.5rem' }}>
                <TextInput
                  id="searchText"
                  labelText="Module search"
                  defaultValue={this.state.searchText}
                  onChange={(e) => this.setState({ searchText: e.target.value })}
                />
              </Column>
              <Column lg={{ span: 3 }} style={{ display: 'flex', paddingLeft: '.5rem' }}>
                <Button
                  className="SearchButton"
                  style={{ display: 'inline-block', alignSelf: 'flex-end' }}
                  size={"field"}
                  onClick={(e) => this.props.filterCatalog('searchText', this.state.searchText)}
                  iconDescription="Search Modules"
                  renderIcon={Search16}
                  hasIconOnly
                />
              </Column>
            </Row>
          </Grid>
        </div>}
      </div>
    )
  }

  selectItems(selectItemData) {
    return selectItemData.map(p => <SelectItem key={p.value} text={p.text} value={p.value} />)
  }

  componentDidMount() {
  }
}

export default CatalogFilter;
