import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import  socket from "../../services/socket";
import Axios from "../../services/Axios";
import { useLocation } from 'react-router-dom';

const $ = window.$;

const GmailAccounts = () => {

    
    const location = useLocation();
    const [gmailAccounts, setGmailAccounts] = useState([]);
    const [areAccountsLoading, setAreAccountsLoading] = useState(false);
    const [accountToBeRemoved, setAccountToBeRemoved] = useState("");

    
    useEffect(async () => {

        registerListenerForNewlyCreatedGmailAccounts();

        setAreAccountsLoading(true);

        setGmailAccounts(await getAllGmailAccountsLinkedToThisHammoqUser());

        setAreAccountsLoading(false);

    }, []);

    useEffect(async () => {

        await sendAuthorizationToken(location);

    }, [location]);

    const openGoogleUserAuthorizationWindow = async () => {

        let res = await Axios.get('/gmailAuth/authorizationUrl');

        if (res?.data?.authorizationUrl?.length > 0) {
            window.open(res?.data?.authorizationUrl, 'googleAuthorizationAndContentWindow', 'width=600, height: 400');
        }
    }

    const sendAuthorizationToken = async (location) => {

        if (location.pathname == '/gmailaccounts' && location.search && location.search?.length > 0) {
            let res = await Axios.post('/gmailAuth/gmailaccounts' + location.search);

            if (res.data)
                setTimeout(() => { window.close() }, 100);
        }
    }

    const registerListenerForNewlyCreatedGmailAccounts = () => {

        socket.on("newgmailaccount", data => {

            setGmailAccounts(gmailAccounts => {

                if (!gmailAccounts.filter(gmailAccount => gmailAccount.gmailEmailId == data.gmailEmailId).length > 0) {
                    return [...gmailAccounts, { gmailEmailId: data.gmailEmailId, gmailAccessTokenStatus: data.gmailAccessTokenStatus }];
                } else {
                    return gmailAccounts.map(gmailAccount => {

                        if (gmailAccount.gmailEmailId == data.gmailEmailId)
                            return { ...gmailAccount, gmailEmailId: data.gmailEmailId, gmailAccessTokenStatus: data.gmailAccessTokenStatus };

                        return gmailAccount;

                    });
                }
            });

        });
    }

    const getAllGmailAccountsLinkedToThisHammoqUser = async () => {

        let res = await Axios.get('/gmailAuth/gmailaccounts');

        return res?.data;
    }

    const refreshGmailAccessToken = async (gmailEmailId) => {

        let res = await Axios.post('/gmailAuth/refreshtokens/' + gmailEmailId);

    }

    const removeGmailAccountFromHammoqAccount = async (gmailEmailId) => {

        let res = await Axios.delete('/gmailAuth/gmailaccounts/' + gmailEmailId);

        setGmailAccounts(gmailAccounts.filter(gmailAccount => gmailAccount.gmailEmailId != gmailEmailId));

    }



    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-10"></div>
                    <div className="col-2 d-flex justify-content-end">
                        <button type="button" class="btn btn-primary" onClick={openGoogleUserAuthorizationWindow}><AddIcon />&nbsp;Add Gmail Account</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <table className="table">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">Gmail ID</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {gmailAccounts.map(gmailAccount => {
                                    return (
                                        <tr>
                                            <th scope="col">{gmailAccount?.gmailEmailId}</th>
                                            <th scope="col">
                                                {gmailAccount?.gmailAccessTokenStatus ?
                                                    <span className="badge badge-pill badge-success">Active</span>
                                                    : <span className="badge badge-pill badge-danger">Inactive</span>}
                                            </th>
                                            <th scope="col">
                                                <button className="btn btn-sm btn-light" onClick={() => refreshGmailAccessToken(gmailAccount?.gmailEmailId)} >
                                                    <i className="fas fa-sync" style={{ color: '#7EE081' }}></i>
                                                </button>
                                                <button className="btn btn-sm btn-light"
                                                    style={{ marginLeft: '5px' }}
                                                    onClick={() => {
                                                        setAccountToBeRemoved(gmailAccount?.gmailEmailId);
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
                    </div>
                    <div className="col-2"></div>
                </div>

                <div class="modal fade" id="removeEbayAccountModal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Remove Gmail Account?</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                Do you wish to remove the Gmail account : <span style={{ color: '#FF5A5F' }}>{accountToBeRemoved}</span> ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger"
                                    onClick={() => { removeGmailAccountFromHammoqAccount(accountToBeRemoved); $("#removeEbayAccountModal").modal("hide"); }}>
                                    Yes, please delete
                                </button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GmailAccounts;