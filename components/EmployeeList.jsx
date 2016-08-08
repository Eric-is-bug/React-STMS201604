import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import CardMDL from './CardMDL'

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0'
  },
  propToggleHeader: {
    margin: '20px auto 10px'
  }
};

const tableData = [
  {
    name: 'Decorator',
    number: 10,
    status: 'Short-term'
  },
  {
    name: 'Cleaner',
    number: 5,
    status: 'Short-term'
  },
  {
    name: 'Electrician',
    number: 2,
    status: 'Short-term'
  },
  {
    name: 'Safety Guard',
    number: 5,
    status: 'Fixed-term'
  },
  {
    name: 'Driver',
    number: 2,
    status: 'Fixed-term'
  }

];

class EmployeeList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: '300px'
    };
  }


  render() {
    return (
      <div className="mdl-grid">
      <CardMDL 
          title = "Job List"
          width = "mdl-cell--10-col"
        >           
              <Table>
                <TableHeader       
                    adjustForCheckbox={false}      
                    displaySelectAll={false}
                  >
                  <TableRow>
                    <TableHeaderColumn tooltip="Job Name">Job Name</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Number">Number</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Status">Job Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                >
                  {tableData.map( (row, index) => (
                    <TableRow key={index} selected={row.selected}>
                      <TableRowColumn>{row.name}</TableRowColumn>
                      <TableRowColumn>{row.number}</TableRowColumn>
                      <TableRowColumn>{row.status}</TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
                <TableFooter/>
              </Table>
      </CardMDL>
      </div>
       );
  }
}


export default EmployeeList;