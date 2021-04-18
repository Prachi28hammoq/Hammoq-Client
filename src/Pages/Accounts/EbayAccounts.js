import React, { useState, useEffect } from "react";
import AddIcon from '@material-ui/icons/Add';
import socket from "../../../src/services/socket.jsx";
import Axios from "../../services/Axios";
import { useLocation } from 'react-router-dom';
import './EbayAccounts.css';
import { nanoid } from "nanoid";

const $ = window.$;

const EbayAccounts = (props) => {

  const location = useLocation();
  const [ebayAccounts, setEbayAccounts] = useState([]);
  const [areAccountsLoading, setAreAccountsLoading] = useState(false);
  const [accountToBeRemoved, setAccountToBeRemoved] = useState("");
  const [showNoAccountsFoundMessage, setShowNoAccountsFoundMessage] = useState(false);

  useEffect(() => {

    const init = async () => {
      registerListenerForNewlyCreatedEbayAccounts();

      setAreAccountsLoading(true);

      await refreshUserTokenForAllEbayAccounts();
      setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());

      setAreAccountsLoading(false);

    }

    init();

  }, []);

  useEffect(() => {

    if (areAccountsLoading === true)
      setShowNoAccountsFoundMessage(false);

    if (areAccountsLoading === false) {
      if (ebayAccounts.length === 0)
        setShowNoAccountsFoundMessage(true);
      else
        setShowNoAccountsFoundMessage(false);
    }

  }, [ebayAccounts, areAccountsLoading])

  useEffect(() => {

    const sendAuthToken = async () => {
      await sendAuthorizationToken(location);
    }

    sendAuthToken();

  }, [location]);

  const registerListenerForNewlyCreatedEbayAccounts = () => {

    socket.on("newebayaccount", data => {

      setEbayAccounts(ebayAccounts => {

        if (!ebayAccounts.filter(ebayAccount => ebayAccount.ebayUserName === data.ebayUserName).length > 0) {
          return [...ebayAccounts, { ebayUserName: data.ebayUserName, ebayUserTokenStatus: data.ebayUserTokenStatus }];
        } else {
          return ebayAccounts.map(ebayAccount => {

            if (ebayAccount.ebayUserName === data.ebayUserName)
              return { ...ebayAccount, ebayUserName: data.ebayUserName, ebayUserTokenStatus: data.ebayUserTokenStatus };

            return ebayAccount;

          });
        }
      });

    });

  }

  const getAllEbayAccountsLinkedToThisHammoqUser = async () => {

    let res = await Axios.get('/ebayAuth/ebayaccounts');

    return res?.data || [];
  }

  const openEbayUserAuthorizationWindow = async () => {

    Axios.get("/ebay/consent")
      .then((response) => {
        window.open(response.data.authURL, "_blank");
      })

      .catch((err) => {
        console.log(err) || alert(JSON.stringify({ err: err }));
      });
  }

  const sendAuthorizationToken = async (location) => {

    if (location.pathname === '/accounts/ebayAccounts' && location.search && location.search?.length > 0) {
      let res = await Axios.post('/ebayAuth/ebayaccounts' + location.search);
      if (res.data)
        setTimeout(() => { window.close() }, 100);
    }
  }

  const refreshEbayUserToken = async (ebayUserName) => {

    await Axios.post('/ebayAuth/refreshtokens/' + ebayUserName);

  }

  const removeEbayAccountFromHammoqAccount = async (ebayUserName) => {

    await Axios.delete('/ebayAuth/ebayaccounts/' + ebayUserName);

    setEbayAccounts(ebayAccounts.filter(ebayAccount => ebayAccount.ebayUserName !== ebayUserName));

  }

  const refreshUserTokenForAllEbayAccounts = async () => {

    await Axios.post('/ebayAuth/refreshtokens/');

  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 d-flex justify-content-end">
            <button type="button" className="btn btn-success" disabled={ebayAccounts.length >= 1} onClick={openEbayUserAuthorizationWindow}><AddIcon />&nbsp;Add Ebay Account</button>
          </div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Ebay Username</th>
                  <th scope="col">Status</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {ebayAccounts.map(ebayAccount => {
                  return (
                    <tr key={nanoid(3)}>
                      <th scope="col">{ebayAccount?.ebayUserName}</th>
                      <th scope="col">
                        {ebayAccount?.ebayUserTokenStatus ?
                          <span className="badge badge-pill badge-success">Active</span>
                          : <span className="badge badge-pill badge-danger">Inactive</span>}
                      </th>
                      <th scope="col">
                        <button className="btn btn-sm btn-light" onClick={() => refreshEbayUserToken(ebayAccount?.ebayUserName)} >
                          <i className="fas fa-sync" style={{ color: '#7EE081' }}></i>
                        </button>
                        <button className="btn btn-sm btn-light"
                          style={{ marginLeft: '5px' }}
                          onClick={() => {
                            setAccountToBeRemoved(ebayAccount?.ebayUserName);
                            $("#removeEbayAccountModal").modal("show");
                          }}
                        >
                          <i className="far fa-trash-alt" style={{ color: '#FF5A5F' }}></i>
                        </button>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ width: '100%' }} className="d-flex justify-content-center">
              {areAccountsLoading ?
                (<div className="spinner-border text-secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>) : null}
            </div>
            {showNoAccountsFoundMessage ? <div className="zero-accounts-found-message d-flex justify-content-center">{"0 account(s) found"}</div> : null}
          </div>
          <div className="col-2"></div>
        </div>

        <div className="modal fade" id="removeEbayAccountModal" data-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Remove Ebay Account?</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Do you wish to remove the Ebay account : <span style={{ color: '#FF5A5F' }}>{accountToBeRemoved}</span> ?
                            </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger"
                  onClick={() => { removeEbayAccountFromHammoqAccount(accountToBeRemoved); $("#removeEbayAccountModal").modal("hide"); }}>
                  Yes, please delete
                                </button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EbayAccounts;