import React, { useState, useEffect } from "react";
import Axios from "../../services/Axios";
import {ListingSettings} from "@hammoq/hammoq-recycledcomponents";

const ListingSettingsPortal = (props) => {
  let clientid = localStorage.getItem("cid");
  
  return (
        <>
				<ListingSettings
				Axios={Axios}
				clientid={clientid}
				/>
        </>
    );
}

export default ListingSettingsPortal;
