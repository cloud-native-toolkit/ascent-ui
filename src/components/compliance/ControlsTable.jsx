import React from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableToolbar,
  TableHeader,
  TableBody,
  TableToolbarContent,
  TableCell,
  TableToolbarSearch,
  OverflowMenu,
  OverflowMenuItem,
  Tag,
  TableToolbarMenu
} from 'carbon-components-react';
import {
  Filter32
} from '@carbon/icons-react';
import {
  Link
} from "react-router-dom";

const ControlsTable = ({ rows, headers, onClickFilter, filter, filterItems }) => (
  <DataTable rows={rows} headers={headers}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getToolbarProps,
      getTableContainerProps,
    }) => (
      <TableContainer
        {...getTableContainerProps()}>
        <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
          <TableToolbarContent>
            <TableToolbarSearch onChange={(event) => filter(event)} />
            <TableToolbarMenu
              light
              renderIcon={Filter32}
              onClick={() => onClickFilter()}
              children={<></>}
              />
          </TableToolbarContent>
        </TableToolbar>
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader key={header.key} {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
              <TableHeader>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} {...getRowProps({ row })}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>
                    {
                      (cell.info?.header === "id" || cell.info?.header === "parent_control") && cell.value ?
                        <Tag type="blue">
                          <Link to={"/controls/" + cell.value.toLowerCase().replace(' ', '_')} >
                            {cell.value}
                          </Link>
                        </Tag>
                      : cell.info?.header === "parent_control" ?
                        <Tag>
                          Base Control
                        </Tag>
                      :
                        cell.value
                    }
                  </TableCell>
                ))}
                <TableCell>
                  
                  <OverflowMenu light flipped style={{flex:1, marginLeft: 'auto'}}>
                    <Link className="bx--overflow-menu-options__option" to={"/controls/" + row.id.toLowerCase().replace(' ', '_')}>
                      <OverflowMenuItem itemText="Details" />
                    </Link>
                  </OverflowMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </DataTable>
);

export default ControlsTable;
