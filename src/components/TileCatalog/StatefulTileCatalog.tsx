"use client"

import {useState} from "react";
import {Search, TileCatalog, TileProp} from "@/components";

interface StatefulTileCatalogProps {
    id: string;
    title: string;
    isMultiSelect?: boolean;
    isLoading?: boolean;
    error?: string;
    tiles: TileProp[];
    pagination?: {pageSize: number};
    search?: Search;
    isSelectedByDefault?: boolean;
    onSelection: (selection: string[]) => void;
}

const caseInsensitiveSearch = (keys: string[], searchTerm: string): boolean => {
    return keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
}

const getTilesForPage = (tiles: TileProp[], page: number, pageSize: number) => {
    return tiles.slice((page - 1) * pageSize, page * pageSize)
}

export const StatefulTileCatalog = (props: StatefulTileCatalogProps) => {
    const [searchState, setSearchState] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(props.pagination?.pageSize ?? 10);

    const [tiles, setTiles] = useState(props.tiles || []);

    const handleSearch = (searchText?: string) => {
        if (searchText) {
            setTiles(props.tiles.filter(tile => {
                const foundIndex = Object.values(tile.value).findIndex(value => {
                    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                        return caseInsensitiveSearch([value.toString()], searchText);
                    }
                    return false;
                })

                return foundIndex !== -1;
            }));
        } else {
            setTiles(props.tiles);
        }
        setSearchState(searchText || '');
    }

    const handlePage = ({page, pageSize}: {page: number, pageSize: number}) => {
        setPage(page);
        setPageSize(pageSize);
    }

    return (
        <TileCatalog
            {...props}
            tiles={getTilesForPage(tiles, page, pageSize)}
            search={{ ...props.search, placeholderText: props.search?.placeholderText || 'Search', onSearch: handleSearch, value: searchState }}
            pagination={{
                pageSize,
                pageSizes: [10, 20, 50],
                page: page,
                onChange: handlePage,
                totalItems: tiles.length ?? 0,
            }}
        />
    );
}
