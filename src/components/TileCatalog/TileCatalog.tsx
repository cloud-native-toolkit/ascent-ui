"use client"

import React, {Fragment, ReactNode, useState} from "react";
import {Pagination, SkeletonText, TableToolbarSearch, Tile, TileGroup} from "@carbon/react";
import {Bee} from "@carbon/icons-react";

import {DynamicTile} from "./DynamicTile";
import {classnames} from "@/util";

export interface Pagination {
    backwardText?: string;
    forwardText?: string;
    itemRangeText?: (min: number, max: number, total: number) => string;
    onChange: (data: {
        page: number;
        pageSize: number;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        ref?: React.RefObject<any>;
    }) => void;
    page: number;
    pageSize: number;
    pageSizes: number[] | Array<{text: string, value: number}>;
    pageText?: (page: number) => string;
    totalItems: number;
}

export interface Search {
    placeholder?: string;
    placeholderText?: string;
    noMatchesFoundText?: string;
    value?: string;
    onSearch: (searchText?: string) => void;
}

export interface TileProp {
    id: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    value: any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    renderContent: (props: {id: string, values: any}) => ReactNode;
    className?: string;
}

interface TileCatalogProps {
    id: string;
    tiles: TileProp[];
    onSelection: (selection: string[]) => void;
    title?: string;
    isLoading?: boolean;
    error?: string;
    pagination?: Pagination;
    search?: Search;
    isMultiSelect?: boolean;
    className?: string;
}

const iotPrefix = 'iot';

const updateSelection = (selection: string[], id: string, selected?: boolean, isMultiSelect?: boolean) => {
    if (!isMultiSelect) {
        if (selected) {
            return [id];
        } else {
            return [];
        }
    } else {
        if (selected) {
            return [...selection, id];
        } else {
            return selection.filter(val => val !== id);
        }
    }

}

export const TileCatalog = ({id, className, isLoading, error, isMultiSelect, pagination, search, tiles, onSelection}: TileCatalogProps) => {
    const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);

    const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
    const totalTiles = pagination && pagination.totalItems ? pagination.totalItems : 10;

    const onChange = (id: string, selected?: boolean): void => {
        const updatedSelection = updateSelection(selectedTileIds, id, selected, isMultiSelect);

        setSelectedTileIds(updatedSelection);
        onSelection(updatedSelection);
    }

    return (
        <div className={classnames(className, `${iotPrefix}--tile-catalog`)}>
            <div className={`${iotPrefix}--tile-catalog--header`}>
                {search && (search.placeholderText || search.placeholder) ? (
                    <TableToolbarSearch
                        size="sm"
                        value={search ? search.value : ''}
                        labelText={search.placeholderText ?? search.placeholder}
                        placeholder={search.placeholderText ?? search.placeholder}
                        onChange={(e, searchText) => search && search.onSearch(searchText)}
                        id={`${id}-searchbox`}
                    />
                ) : (<></>)}
            </div>
            {isLoading ? ( // generate empty tiles for first page
                <TileGroup
                    tiles={[...Array(pageSize)].map((val, index) => (
                        <Tile className={`${iotPrefix}--tile-catalog--empty-tile`} key={`emptytile-${index}`}>
                            <SkeletonText />
                        </Tile>
                    ))}
                    totalTiles={totalTiles}
                />
            ) : tiles.length > 0 ? (
                <>
                <TileGroup>
                    {tiles.map((tile) => {
                        return (
                            <DynamicTile
                                isMultiSelect={isMultiSelect}
                                className={tile.className}
                                key={tile.id}
                                id={tile.id}
                                value={tile.id}
                                name={id}
                                checked={selectedTileIds.includes(tile.id)}
                                onChange={onChange}
                            >
                                {tile.renderContent
                                    ? tile.renderContent({ values: tile.value, id: tile.id })
                                    : tile.value}
                            </DynamicTile>
                        )
                    })}
                </TileGroup>
                    </>
            ) : (
                <Tile className={`${iotPrefix}--tile-catalog--empty-tile`}>
                    {error || (
                        <Fragment>
                            <Bee />
                            <p>{(search && search.noMatchesFoundText) || 'No matches found'}</p>
                        </Fragment>
                    )}
                </Tile>
            )}
            {!isLoading && tiles.length > 0 && !error && pagination ? (
                <Pagination
                    {...pagination}
                />
            ) : <></>}
        </div>
    );
}
