import React, { useState, useEffect } from 'react';
import CreateReferralCodeModal from './components/CreateReferralCodeModal.js';
import Axios from '../../../services/Axios.jsx';
import ReferralCodeCard from './components/ReferralCodeCard.js';

const ReferralCodeComponent = (props) => {

    const [referralCode, setReferralCode] = useState('');
    const [openCreateModal, setOpenCreateModal] = useState(false);

    useEffect(() => {

        setTimeout(async () => await openCreateModalIfReferralCodeDoesNotExist(), 500);

    }, [])

    const openCreateModalIfReferralCodeDoesNotExist = async () => {

        const storedData = JSON.parse(localStorage.getItem('userData'));

        let res;

        if (storedData) {
            try {
                res = await Axios.get('/referralcode', {
                    headers: {
                        'Authorization': 'Bearer ' + storedData.token
                    }
                });
            } catch (error) { }
        }

        if (res?.data?.httpStatus == 'NO_REFERRALCODE_ASSOCIATED_WITH_USER') {
            setOpenCreateModal(true);
        }

        if (res?.data?.httpStatus == 'Success') {
            setReferralCode(res?.data?.referralCode);
        }
    }

    return (
        <>
            <CreateReferralCodeModal open={openCreateModal} setModalVisibility={setOpenCreateModal} setReferralCode={setReferralCode} />
            <ReferralCodeCard referralCode={referralCode} />
        </>
    );

}

export default ReferralCodeComponent;