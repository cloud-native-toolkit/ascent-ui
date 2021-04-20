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
  Tag
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";

const NistTable = ({ rows, headers, filter }) => (
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
            <TableToolbarSearch onChange={(event) => filter(event.target.value)} />
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
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} {...getRowProps({ row })}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>
                    {
                      cell.info && (cell.info.header === "id" || cell.info.header === "parent_control" && cell.value) ?
                        <Tag type="blue">
                          <Link to={"/nists/" + cell.value.toLowerCase().replace(' ', '_')} >
                            {cell.value}
                          </Link>
                        </Tag>
                      : cell.info && (cell.info.header === "parent_control") ?
                      <Tag>
                        Base Control
                      </Tag>
                      : cell.value
                    }
                  </TableCell>
                ))}
                <TableCell>
                  <OverflowMenu light flipped>
                    <Link class="bx--overflow-menu-options__option" to={"/nists/" + row.id.toLowerCase().replace(' ', '_')}>
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

export default NistTable;
