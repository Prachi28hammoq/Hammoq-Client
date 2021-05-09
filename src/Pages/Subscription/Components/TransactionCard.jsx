import React, { useEffect, useState } from "react";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs";
import { TiArrowUnsorted } from "react-icons/ti";
import Axios from "../../../services/Axios";
import Table from "react-bootstrap/Table";
export default function TransactionCard() {
  const [transactions, setTransactions] = useState([]);
  const [, reRender] = useState();
  const [compData, setCompData] = useState({
    showComp: false,
    loading: false,
    msg: "No transactions found",
    showMsg: false,
  });

  useEffect(() => {
    getTransactionData();
  }, []);

  const getTransactionData = async () => {
    try {
      const trans = await Axios.get("/clientdetails/trans");
      const sortedData = trans.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setTransactions(sortedData);
    } catch (err) {
      setCompData({
        ...compData,
        showMsg: true,
        msg: "Error in getting data client transaction data.",
      });
    }
  };

  const reverseTransactions = () => {
    setTransactions(transactions.reverse());
    reRender({});
  };

  const isURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };
  return (
    <div
      className="my-2 p-2 py-3"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.125)",
        borderRadius: "4px 4px 0 0",
        boxShadow:
          "0 3px 6px 0 rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        className="row col-12 m-0 my-1 d-flex justify-content-between"
        style={{ borderBottom: "1px #eff0f2 solid" }}
      >
        <h3>Previous Transaction</h3>
        <span style={{ fontSize: "1.8em", fontWeight: "bolder" }}>
          {compData.showComp ? (
            <BsChevronDoubleUp
              onClick={() => {
                setCompData({ ...compData, showComp: false });
              }}
            />
          ) : (
            <BsChevronDoubleDown
              onClick={() => {
                setCompData({ ...compData, showComp: true });
              }}
            />
          )}
        </span>
      </div>

      {compData.showComp && (
        <>
          {compData.showMsg && <p>{compData.msg}</p>}

          <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
            <Table striped bordered hover size="sm" responsive="sm" scrollY>
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    Date {<TiArrowUnsorted onClick={reverseTransactions} />}
                  </th>
                  <th>Amount</th>
                  <th>Reciept</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trans, idx) => {
                  return (
                    <tr>
                      <td>{idx + 1}</td>
                      <td>{new Date(trans.date).toDateString()}</td>
                      <td>{trans.amount.toFixed(2)}</td>
                      <td>
                        {isURL(trans.receipt_url) ? (
                          <a
                            href={trans.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Receipt
                          </a>
                        ) : (
                          trans.receipt_url
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
