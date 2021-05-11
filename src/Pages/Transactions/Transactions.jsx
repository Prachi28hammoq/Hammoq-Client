import React from "react";
import "./Transactions.css";
import Axios from "../../services/Axios";
import { nanoid } from "nanoid";
import LoadingSpinner from "../utils/loader";

class previoustransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      boxdata: [],
    };
  }

  componentDidMount(prevProps) {
    this.setState({isLoading: true});
    Axios.get("/clientdetails/trans")
      .then(({ data }) => {this.setState({ boxdata: data});
                           this.setState({ isLoading: false});
                         })
      .catch((err) => {console.log(err); 
                       this.setState({isLoading:true})});
  }

  render() {
    const { boxdata } = this.state;
    return (
      <div className="paymentIt">
        <div className="pay">
          <h3 id="fontIt">Payments & Actions</h3>
        </div>
        <h5 id="fontIt">Previous Transaction</h5>
        <div className="row">
        {!this.state.isLoading ?
          (
          <React.Fragment key={nanoid(4)}>
            <table className="table adjustIt">
              <thead>
                <tr>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Taken</th>
                  <th scope="col">Receipt URL</th>
                </tr>
              </thead>
              <tbody>
              {boxdata.length > 0 ? 
                (boxdata.map((data) => {
                  return(
                <tr key={nanoid(3)}>
                  <td>{data.amount.toFixed(2)}</td>
                  <td>{data.date.split("T")[0]}</td>
                  <td>{data.date.split("T")[1]}</td>
                  <td>
                    {data.receipt_url[0] === "h" ? (
                      <a href={data.receipt_url} target="_blank" rel="noreferrer">
                        Receipt
                      </a>
                    ) : (
                      data.receipt_url
                    )}
                  </td>
                </tr>
              );}
              ))
                :
                (<React.Fragment key={nanoid(4)}>
                 <tr><td style={{'display': 'block', 'fontSize': '1em', 'marginTop': '1.33em', 'marginBottom': '1.33em', 'marginLeft': '0', 'marginRight': '0', 'fontWeight': 'bold'}}>There is no transaction history found...</td></tr>
                 </React.Fragment>)}
              </tbody>
              </table>
              </React.Fragment>
              ) : 
              (<div className="center"><LoadingSpinner asOverlay /></div>)
              }
        </div>
      </div>
    );
  }
}
export default previoustransaction;
