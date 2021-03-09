import { Table } from 'semantic-ui-react';
import titleCase from '../../../utilities/utilities.js';
import './DataTable.css';

const DataTable = (props) => {


    return (
        <div className="data-table">
            <Table basic>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Referral Name</Table.HeaderCell>
                        <Table.HeaderCell>No of Products Listed</Table.HeaderCell>
                        <Table.HeaderCell>Payout Rate Per Listing</Table.HeaderCell>
                        <Table.HeaderCell>Payout Per Referral</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {props.listingData.map(listingDatum => {
                        return (
                            <Table.Row>
                                <Table.Cell>{titleCase(listingDatum.userFullName)}</Table.Cell>
                                <Table.Cell>{listingDatum.listingsCount}</Table.Cell>
                                <Table.Cell>$ 0.145</Table.Cell>
                                <Table.Cell>$&nbsp;{listingDatum.listingsCount * 0.145}</Table.Cell>
                            </Table.Row>);
                    })}
                </Table.Body>
            </Table>
        </div>
    );
}

export default DataTable;