import React, { Component } from "react";
import {
    UnorderedList, ListItem, BreadcrumbSkeleton, SearchSkeleton, Tag,
    CodeSnippet 
} from 'carbon-components-react';
import {
    Launch16,
} from '@carbon/icons-react';
import {
    Link
} from "react-router-dom";


class ServiceDetails extends Component {

    render () {
        return (
            this.props.data ?
                <div>
                    <p>
                        <strong>Description: </strong>
                        {
                            this.props.data?.catalog?.overview_ui?.en ?
                                this.props.data.catalog.overview_ui.en.long_description || this.props.data.catalog.overview_ui.en.description
                            : this.props.data.service ?
                                this.props.data.service.description
                            :
                                this.props.data.description
                        }
                    </p>
                    <br />
                    {this.props.data?.catalog?.provider &&
                        <>
                            <div >
                                <p>
                                    <strong>Provider: </strong>
                                    <Tag type="blue">{this.props.data.catalog.provider.name}</Tag>
                                </p>
                            </div>
                            <br />
                        </>
                    }
                    {this.props.data.service &&
                        <>
                            {this.props.data.service.provider ? <div><p><strong>Group: </strong> <Tag type="blue">{this.props.data.service.provider}</Tag></p><br /></div> : <></>}
                            {this.props.data.service.tags?.length > 0 ? <div><p><strong>Tags: </strong> {this.props.data.service.tags.map((tag) => ( <Tag type="blue">{tag}</Tag> ))}</p><br /></div> : <></>}
                            {this.props.data.service.versions[0]?.platforms?.length > 0 ? <div><p><strong>Platforms: </strong> {this.props.data.service.versions[0]?.platforms.map((plat) => ( <Tag type="blue">{plat}</Tag> ))}</p><br /></div> : <></>}
                        </>
                    }
                    {this.props.data?.catalog?.geo_tags?.length > 0 &&
                        <>
                            <div>
                                <p>
                                    <strong>Geos: </strong>
                                    {this.props.data.catalog.geo_tags.map((geo) => (
                                        <Tag type="blue">{geo}</Tag>
                                    ))}
                                </p>
                                <br />
                            </div>
                        </>
                    }
                    {this.props.data?.service?.controls?.length > 0 &&
                        <>
                            <div>
                                <p>
                                    <strong>Impacting controls: </strong>
                                    {this.props.data.service.controls.map((control) => (
                                        <Tag type="blue">
                                            <Link to={"/controls/" + control.id.toLowerCase().replace(' ', '_')} >
                                                {control.id}
                                            </Link>
                                        </Tag>
                                    ))}
                                </p>
                                <br />
                            </div>
                        </>
                    }
                    {this.props.data?.catalog?.metadata?.ui?.urls &&
                        <>
                            <div>
                                <p>
                                    <strong>Links: </strong>
                                    <UnorderedList nested>
                                        {this.props.data.catalog.metadata.ui.urls.catalog_details_url && 
                                            <ListItem href={this.props.data.catalog.metadata.ui.urls.catalog_details_url}>
                                                <a href={this.props.data.catalog.metadata.ui.urls.catalog_details_url} target="_blank" rel="noopener noreferrer">
                                                    Catalog
                                                    <Launch16 style={{"marginLeft": "3px", "paddingTop": "1px"}}/>
                                                </a>
                                            </ListItem>
                                        }
                                        {this.props.data.catalog.metadata.ui.urls.apidocs_url && 
                                            <ListItem href={this.props.data.catalog.metadata.ui.urls.apidocs_url}>
                                                <a href={this.props.data.catalog.metadata.ui.urls.apidocs_url} target="_blank" rel="noopener noreferrer">
                                                    API Docs
                                                    <Launch16 style={{"marginLeft": "3px", "paddingTop": "1px"}}/>
                                                </a>
                                            </ListItem>
                                        }
                                        {this.props.data.catalog.metadata.ui.urls.doc_url && 
                                            <ListItem href={this.props.data.catalog.metadata.ui.urls.doc_url}>
                                                <a href={this.props.data.catalog.metadata.ui.urls.doc_url} target="_blank" rel="noopener noreferrer">
                                                    Documentation
                                                    <Launch16 style={{"marginLeft": "3px", "paddingTop": "1px"}}/>
                                                </a>
                                            </ListItem>
                                        }
                                        {this.props.data.catalog.metadata.ui.urls.instructions_url && 
                                            <ListItem >
                                                <a href={this.props.data.catalog.metadata.ui.urls.instructions_url} target="_blank" rel="noopener noreferrer">
                                                    Instructions
                                                    <Launch16 style={{"marginLeft": "3px", "paddingTop": "1px"}}/>
                                                </a>
                                            </ListItem>
                                        }
                                        {this.props.data.catalog.metadata.ui.urls.terms_url && 
                                            <ListItem href={this.props.data.catalog.metadata.ui.urls.terms_url}>
                                                <a href={this.props.data.catalog.metadata.ui.urls.terms_url} target="_blank" rel="noopener noreferrer">
                                                    Terms
                                                    <Launch16 style={{"marginLeft": "3px", "paddingTop": "1px"}}/>
                                                </a>
                                            </ListItem>
                                        }
                                    </UnorderedList>
                                </p>
                            </div>
                        </>
                    }
                    {this.props.data?.yaml &&
                        <div>
                            <br />
                            <strong>YAML Configuration: </strong>
                            <CodeSnippet type='multi'>
                                {this.props.data?.yaml}
                            </CodeSnippet>
                        </div>
                    }
                </div>
            :
                <div>
                    <BreadcrumbSkeleton />
                    <SearchSkeleton />
                </div>
        )
    }
}
export default ServiceDetails;