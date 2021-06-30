import { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

class DataMonitorTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      nanoid,
      isDataLoading,
      isEbayCategoryDropDownItemsLoading,
      isShippingDropDownItemsLoading,
      isShippingDomesticDropDownItemsLoading,
      isShippingInternationalDropDownItemsLoading,
      isClientEbayShippingDropDownItemsLoading,
      isClientEbayShippingDomesticDropDownItemsLoading,
      isClientEbayShippingInternationalDropDownItemsLoading,
      isClientEbayADCampaignDropDownItemsLoading,
      isClientListingSettingsLoading,
      doesDataExist,
      doesEbayCategoryDropDownItemsExist,
      doesShippingDropDownItemsExist,
      doesShippingDomesticDropDownItemsExist,
      doesShippingInternationalDropDownItemsExist,
      doesClientEbayShippingDropDownItemsExist,
      doesClientEbayShippingDomesticDropDownItemsExist,
      doesClientEbayShippingInternationalDropDownItemsExist,
      doesClientEbayADCampaignDropDownItemsExist,
      doesClientListingSettingsExist
    } = this.props;

    return(
      <>
        <Paper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Retrieval Status
                </TableCell>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Data Name
                </TableCell>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Data Exists?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {isDataLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>: "Done"}
                </TableCell>
                <TableCell>
                  Product Data
                </TableCell>
                <TableCell>
                  {doesDataExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i> : <i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isClientListingSettingsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Client Listing Settings
                </TableCell>
                <TableCell>
                  {doesClientListingSettingsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isClientEbayShippingDomesticDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Client Pre-Set Ebay Domestic Shipping Options
                </TableCell>
                <TableCell>
                  {doesClientEbayShippingDomesticDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isClientEbayShippingInternationalDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Client Pre-Set Ebay International Shipping Options
                </TableCell>
                <TableCell>
                  {doesClientEbayShippingInternationalDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isClientEbayADCampaignDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Client Pre-Set Ebay AD Campaigns Options
                </TableCell>
                <TableCell>
                  {doesClientEbayADCampaignDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isEbayCategoryDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Ebay Category Information
                </TableCell>
                <TableCell>
                  {doesEbayCategoryDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isShippingDomesticDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Ebay Domestic Shipping Information
                </TableCell>
                <TableCell>
                  {doesShippingDomesticDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {isShippingInternationalDropDownItemsLoading ? <i className="fa fa-cog fa-spin fa-2x fa-fw"></i> : "Done"}
                </TableCell>
                <TableCell>
                  Ebay International Shipping Information
                </TableCell>
                <TableCell>
                  {doesShippingInternationalDropDownItemsExist ? <i className="fa fa-check-circle-o fa-2x text-success" ></i>:<i className="fa fa-times-circle-o fa-2x text-danger" aria-hidden="true"></i>}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </>
      );
  }
}
export default DataMonitorTable;