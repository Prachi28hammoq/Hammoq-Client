import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import socket  from "../../services/socket";
import Axios from "../../services/Axios";
import { useLocation } from 'react-router-dom';

const $ = window.$;

const EbayAccounts = () => {

    const location = useLocation();
    const [ebayAccounts, setEbayAccounts] = useState([]);
    const [areAccountsLoading, setAreAccountsLoading] = useState(false);
    const [accountToBeRemoved, setAccountToBeRemoved] = useState("");

    useEffect(async () => {

        registerListenerForNewlyCreatedEbayAccounts();

        setAreAccountsLoading(true);

        await refreshUserTokenForAllEbayAccounts();
        setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());

        setAreAccountsLoading(false);

    }, []);

    useEffect(async () => {

        await sendAuthorizationToken(location);

    }, [location]);

    const registerListenerForNewlyCreatedEbayAccounts = () => {

        socket.on("newebayaccount", data => {

            setEbayAccounts(ebayAccounts => {

                if (!ebayAccounts.filter(ebayAccount => ebayAccount.ebayUserName == data.ebayUserName).length > 0) {
                    return [...ebayAccounts, { ebayUserName: data.ebayUserName, ebayUserTokenStatus: data.ebayUserTokenStatus }];
                } else {
                    return ebayAccounts.map(ebayAccount => {

                        if (ebayAccount.ebayUserName == data.ebayUserName)
                            return { ...ebayAccount, ebayUserName: data.ebayUserName, ebayUserTokenStatus: data.ebayUserTokenStatus };

                        return ebayAccount;

                    });
                }
            });

        });

    }

    const getAllEbayAccountsLinkedToThisHammoqUser = async () => {

        let res = await Axios.get('/ebayAuth/ebayaccounts');

        return res?.data;
    }

    const openEbayUserAuthorizationWindow = async () => {

        let res = await Axios.get('/ebayAuth/authorizationUrl');

        if (res?.data?.authorizationUrl?.length > 0) {
            window.open(res?.data?.authorizationUrl, 'ebayAuthorizationAndContentWindow', 'width=600, height: 400');
        }
    }

    const sendAuthorizationToken = async (location) => {

        if (location.pathname == '/ebayaccounts' && location.search && location.search?.length > 0) {
            let res = await Axios.post('/ebayAuth/ebayaccounts' + location.search);

            if (res.data)
                setTimeout(() => { window.close() }, 100);
        }
    }

    const refreshEbayUserToken = async (ebayUserName) => {

        let res = await Axios.post('/ebayAuth/refreshtokens/' + ebayUserName);

    }

    const removeEbayAccountFromHammoqAccount = async (ebayUserName) => {

        let res = await Axios.delete('/ebayAuth/ebayaccounts/' + ebayUserName);

        setEbayAccounts(ebayAccounts.filter(ebayAccount => ebayAccount.ebayUserName != ebayUserName));

    }

    const refreshUserTokenForAllEbayAccounts = async () => {

        let res = await Axios.post('/ebayAuth/refreshtokens/');

    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-10"></div>
                    <div className="col-2 d-flex justify-content-end">
                        <button type="button" class="btn btn-primary" onClick={openEbayUserAuthorizationWindow} ><AddIcon />&nbsp;Add Account</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <table className="table">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">Ebay Username</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ebayAccounts.map(ebayAccount => {
                                    return (
                                        <tr>
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
                    </div>
                    <div className="col-2"></div>
                </div>

                <div class="modal fade" id="removeEbayAccountModal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Remove Ebay Account?</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                Do you wish to remove the Ebay account : <span style={{ color: '#FF5A5F' }}>{accountToBeRemoved}</span> ?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger"
                                    onClick={() => { removeEbayAccountFromHammoqAccount(accountToBeRemoved); $("#removeEbayAccountModal").modal("hide"); }}>
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

export default EbayAccounts;