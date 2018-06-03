
import * as React from 'react'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination
} from 'material-ui/Table'
import {MouseEvent} from 'react'
import * as _ from 'lodash'

const styles = require('./sortable-table.css')

type OrderBy = [boolean, string]
type TableData = TableEntry[]
type TableEntry = any

export interface TableColumn {
  key: string
  label: string
  numeric: boolean
}

export class TableHeader extends React.Component<{ orderBy: OrderBy, columns: TableColumn[],
  onChangeOrderBy: (orderBy: OrderBy) => void}, {}> {

  onClickSort = (column: TableColumn) => (event: MouseEvent<HTMLElement>) => {
    const {orderBy: [orderDirection, orderKey]} = this.props
    this.props.onChangeOrderBy([orderKey === column.key ? !orderDirection : false, column.key])
  }

  renderCell(column: TableColumn) {
    const {orderBy: [orderDirection, orderKey]} = this.props
    return (
      <TableCell key={column.key} numeric={column.numeric}>
        <TableSortLabel active={orderKey === column.key} direction={orderDirection ? 'asc' : 'desc'}
                        onClick={this.onClickSort(column)}>
          {column.label}
        </TableSortLabel>
      </TableCell>
    )
  }

  render() {
    const {columns} = this.props
    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => this.renderCell(column))}
        </TableRow>
      </TableHead>
    )
  }
}

export class SortableTableRow extends React.Component<{ entry: TableEntry, columns: TableColumn[],
  rowRenderer: (entry: TableEntry, column: TableColumn) => any }> {

  render() {
    const {entry, columns, rowRenderer} = this.props
    return (
      <TableRow>
        {
          columns.map((column) => (
            <TableCell numeric={column.numeric}>
              {rowRenderer ? rowRenderer(entry, column) : entry[column.label]}
            </TableCell>
          ))
        }
      </TableRow>
    )
  }
}

export class SortableTable extends React.Component<{ defaultOrderBy: OrderBy, data: TableData,
  columns: TableColumn[], rowRenderer: (entry: TableEntry, column: TableColumn) => any,
  className: string, rowsPerPage?: number },
  { orderBy: OrderBy, page: number }> {

  constructor(props: any) {
    super(props)

    this.state = {
      orderBy: this.props.defaultOrderBy,
      page: 0,
    }
  }

  onChangeOrderBy = (orderBy: OrderBy) => {
    this.setState({ orderBy })
  }

  onPageChange = (event: any, page: number) => {
    this.setState({ page });
  };

  render() {
    const {data, columns, rowRenderer, className} = this.props
    const {orderBy, page} = this.state
    const rowsPerPage = this.props.rowsPerPage || 8
    const rows = _.orderBy(data, [orderBy[1]], [orderBy[0] ? 'desc' : 'asc'])
      .slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage)
    return (
      <Table className={className}>
        <TableHeader orderBy={orderBy} onChangeOrderBy={this.onChangeOrderBy} columns={columns} />
        <TableBody>
          {rows.map((entry: TableEntry, index: number) =>
            <SortableTableRow key={index} rowRenderer={rowRenderer} entry={entry}
                              columns={columns} />)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={4}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              rowsPerPageOptions={[]}
              onChangePage={this.onPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}
