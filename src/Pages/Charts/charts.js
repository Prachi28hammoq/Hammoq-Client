import React, { Component } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import Axios from "../../services/Axios";

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      chartData2: {},
      chartData3: {},
      chartData4: {},
      chartData5: {},
      chartData6: {},
      chartData7: {},
      chartData8: {},
      date: "",
      avgprofit: 0,
      avgprod: 0,
      avgdayprofit: 0,
    };
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: "right",
    location: "City",
  };

  //Select date of product creation
  handleChange = (e) => {
    const { name, value } = e.target;
    const { date } = this.state;
    this.setState({date:value});
  };

  // componentWillMount(){
  //   this.getchartData();
  // }

  dateSelect = () => {
    //products created on particular date
      Axios.post("/clientdetails/prod/time/charts",{date:this.state.date})
      .then(({ data }) => {
        console.log(data);
        var cnt = [];
        var amt = [];
        var dates = [this.state.date,'+1','+2','+3','+4'];
        var misc = [];
        var misc1 = [];
        

        if (data[0][0] == 0) {
          return alert("No products fount on the selected date");
        }

        
          for(let i=0 ; i<5 ;i++){
            cnt.push(data[0][i]);
          }

          for(let i=0 ; i<5 ;i++){
            amt.push(data[1][i]);
          }

          misc.push(cnt[0]/data[2]);//particular_day_prod_cnt/total_no_of_prod
          misc.push(100-(cnt[0]/data[2]));//remaining(% of prod)
          misc1.push(amt[0]/data[3]);//particular_day_prod_profit/total_profit
          misc1.push(100-(amt[0]/data[3]));//remaining(% of profit)

        this.setState({
          chartData7: {
            labels: dates,
            datasets: [
              {
                label: "No of Products created",
                data: cnt,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
              {
                label: "Price sum of created products",
                data: amt,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              }
            ],
          },
        });

        this.setState({
          chartData8: {
            labels: ['Products(no.)/Profits(% of total)','Remaining(%)'],
            datasets: [
              {
                label: "Cycle avg(%) of products",
                data: misc,//products
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
              {
                label: "Cycle avg(%) of profits",
                data: misc1,//profit
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                ],
              }
            ],
          },
        });

        


      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  

  componentWillMount() {
    // fetching data

    //rate_card
    Axios.get("/payment/rates")
      .then(({ data }) => {
        var datas = [];
        datas.push(data[data.length - 1].basic);
        datas.push(data[data.length - 1].advance);
        datas.push(data[data.length - 1].list);
        this.setState({
          chartData: {
            labels: ["Basic", "Advanced", "Listing"],
            datasets: [
              {
                label: "Rates",
                data: datas,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    //transactions of the customer
    Axios.get("/clientdetails/trans/charts")
      .then(({ data }) => {
        //console.log(data);
        var datas2 = [];
        var datas3 = [];
        datas2.push(data.initial);
        datas2.push(data.basic);
        datas2.push(data.advance);
        datas2.push(data.list);
        datas2.push(data.receipted);

        datas3.push(data.initialamt);
        datas3.push(data.basicamt);
        datas3.push(data.advanceamt);
        datas3.push(data.listamt);
        datas3.push(data.receiptedamt);

        this.setState({
          chartData2: {
            labels: ["Inicial", "Basic", "Advanced", "Listing", "Receipted"],
            datasets: [
              {
                label: "Rates",
                data: datas2,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });

        this.setState({
          chartData3: {
            labels: ["Inicial", "Basic", "Advanced", "Listing", "Receipted"],
            datasets: [
              {
                label: "Rates amount",
                data: datas3,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    //monthly transactions from both wallet & card
    Axios.get("/clientdetails/trans/monthly/charts")
      .then(({ data }) => {
        //console.log(data);
        var monthlyamt = [];
        var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = 0; i < 12; i++) {
          monthlyamt.push(data[i]);
        }
        this.setState({
          chartData6: {
            labels: months,
            datasets: [
              {
                label: "Monthly Transactions",
                data: monthlyamt,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    //average profit of the particular customer
    Axios.get("/clientdetails/prod/charts")
      .then(({ data }) => {
        //console.log(data);
        var datas4 = [];
        var label = [];

        if (data.profits[0] == undefined) {
          return alert("Less data some analysis unable to be displayed");
        }

        data.profits.map((d) => {
          datas4.push(d.profit);
          label.push(d.id);
        });

        this.setState({
          chartData4: {
            labels: label,
            datasets: [
              {
                label: "Profits :: " + "Average product profit: " + data.avg,
                data: datas4,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    //time difference between created and sold
    Axios.get("/clientdetails/prod/selltime/charts")
      .then(({ data }) => {
        //console.log(data);
        var created = [];
        var sold = [];
        var ids = [];

        if (data[0] == undefined) {
          return alert("Less data some analysis unable to be displayed");
        }

        data.map((d) => {
          created.push(d.created);
          sold.push(d.sold);
          ids.push(d.id);
        });

        this.setState({
          chartData5: {
            labels: ids,
            datasets: [
              {
                label: "Created",
                data: created,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
              {
                label: "Sold",
                data: sold,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 900, 192, 0.6)",
                  "rgba(153, 10, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 100)",
                ],
              },
            ],
          },
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

      //avg setting of profit & prod
      Axios.get("/clientdetails/prod/avg/charts")
      .then(({ data }) => {
        //console.log(data.avgprofit);

        if (data == undefined) {
          return alert("Less data some analysis unable to be displayed");
        }
        
        this.setState({avgprofit:data.avgprofit});
        this.setState({avgprod:data.avgprod});
        this.setState({avgdayprofit:data.avgdayprofit});
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

      
  }

  render() {
    const {date} = this.state;

    return (
      <div className="container">
        <Bar
          data={this.state.chartData}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Rates(rate_card)",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />

        <Pie
          data={this.state.chartData2}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Transactions(quantity)",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
          }}
        />

        <Line
          data={this.state.chartData3}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Rates(amount)",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />

        <Bar
          data={this.state.chartData4}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Profits",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />

        <Bar
          data={this.state.chartData5}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Sold Time",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />

        <Bar
          data={this.state.chartData6}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Monthly Transactions(All)",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
          <div className="col-8">
              Select date of product creation
              <input
                type="date"
                name="date"
                className="mt-3 ml-2"
                value={date || ""}
                onChange={this.handleChange}
              />
              <button className="btn btn-dark ml-2" onClick={this.dateSelect}>Select</button>
        <h4>Avg Profit per product : $ {this.state.avgprofit}</h4>
        <h4>Avg Profit per day : $ {Math.round(this.state.avgdayprofit)}</h4>
        <h4>Avg No. products per day : {Math.round(this.state.avgprod)}</h4>
        
          </div>
          <div className="container col-10">
          <Bar
          data={this.state.chartData7}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Products/Profit(price)",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
        <Doughnut
          data={this.state.chartData8}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Percentage(average) of Products & Profits",
              fontSize: 20,
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
          }}
        />
        </div>
      </div>
    );
  }
}

export default Chart;
