import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

class Dashboard extends Component {
  componentDidMount() {
    axios.get("https://google.com").then((data) => console.log(data));
  }

  createData(
    date,
    marketplace,
    details,
    amt,
    price,
    cost,
    net,
    profitPercent,
    roi
  ) {
    return {
      date,
      marketplace,
      details,
      amt,
      price,
      cost,
      net,
      profitPercent,
      roi,
    };
  }

  render() {
    const data = [
      {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];

    const rows = [
      this.createData(
        "20 Sep, 2020",
        "Ebay",
        "T shirt",
        1,
        13.96,
        65.0,
        105.5,
        63.86,
        24.43
      ),
    ];
    return (
      <div>
        <h3>Dashboard</h3>
        <nav>
          <a href="/dashboard">Dashboard</a>&nbsp;
          <a href="/accounting/listing">Listing</a>&nbsp;
          <a href="/accounting/accounting">Accounting</a>&nbsp;
          <a href="/accounting/templates">Templates</a>&nbsp;
          <a href="/accounting/inventory">Inventory</a>&nbsp;
          <a href="/accounting/sop">SOP</a>
        </nav>
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography>Profit Margin Chart</Typography>
                  <AreaChart
                    width={400}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography>Items Sold</Typography>
                  <AreaChart
                    width={400}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#d78884"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#d78884"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stroke="#d78884"
                      fillOpacity={1}
                      fill="url(#colorPv)"
                    />
                  </AreaChart>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography>Cost</Typography>
                  <AreaChart
                    width={400}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorGv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#84d688"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#84d688"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#84d688"
                      fillOpacity={1}
                      fill="url(#colorGv)"
                    />
                  </AreaChart>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <br></br>
        <Grid container item xs={12}>
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Typography>Chart here</Typography>
                <LineChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography>Sales overview</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br></br>
        <div>All sales</div>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Marketplace</TableCell>
                <TableCell align="left">Item Details</TableCell>
                <TableCell align="left">Amount&nbsp;(Qty)</TableCell>
                <TableCell align="left">Item Price</TableCell>
                <TableCell align="left">Buy Cost</TableCell>
                <TableCell align="left">Net Profit</TableCell>
                <TableCell align="left">Profit&nbsp;%</TableCell>
                <TableCell align="left">ROI&nbsp;%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="left">{row.marketplace}</TableCell>
                  <TableCell align="left">{row.details}</TableCell>
                  <TableCell align="left">{row.amt}</TableCell>
                  <TableCell align="left">{row.price}</TableCell>
                  <TableCell align="left">{row.cost}</TableCell>
                  <TableCell align="left">{row.net}</TableCell>
                  <TableCell align="left">{row.profitPercent}</TableCell>
                  <TableCell align="left">{row.roi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(Dashboard);
