import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter,
  Switch,
} from "react-router-dom";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "./App.css";

import {
  AddPayment,
  Editdomain,
  Passwords,
  Settings,
  ResetPassword,
  Login,
  Signup,
  Searchcart,
  Templates,
  Transactions,
  TemplateForm,
  forgotpassword,
  Charts,
  AcceptUrl,
  Accounting,
  Subscription,
  Messages,
  ListingSettingsPortal
} from "./Pages";
import Header from "./Components/header/Header";
import BasicForm from "./Pages/Basic/BasicForm";
import EditForm from "./Pages/EditForm/EditForm";
import Accounts from "./Pages/Accounts/Accounts";
import ClientMessagesProvider from '../src/ContextProviders/ClientMessagesProvider';

const Routes = withRouter((props) => {
  const { pathname } = props.history.location;
  return (
    <div>
      {!["/signup", "/signin"].includes(pathname) && (
        <div className="fixed-top">
          <ClientMessagesProvider>
          <Header />
          </ClientMessagesProvider>
        </div>
      )}
      <div className="container-fluid px-5 py-5 admin my-5">
        {localStorage.getItem("token") ? (
            <Switch>
              <Route exact path="/passwords" component={Passwords} />
              <Route exact path="/charts" component={Charts} />
              <Route exact path="/resetpassword" component={ResetPassword} />
              <Route exact path="/editpasswords/:website" component={Editdomain}/>
              <Route exact path="/addpayment" component={AddPayment} />
              <Route exact path="/templates" component={Templates} />
              <Route exact path="/subscription" component={Subscription} />
              <Route exact path="/template/:templateid" component={TemplateForm}/>
              <Route exact path="/basic" component={BasicForm} />
              <Route exact path="/edit/:id" component={EditForm} />
              <Route exact path="/listingsettings" component={ListingSettingsPortal}/>
              <Route exact path="/products" component={Searchcart} />
              <Route exact path="/subscription" component={Subscription} />
              <Route exact path="/products/:prodStatus" component={Searchcart}/>
              <Route exact path="/transactions" component={Transactions} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/accounting" component={Accounting} />
              <Route exact path="/setting" component={Settings} />
              <Route exact path="/client/ebay/:id" component={AcceptUrl} />
              <Route exact path="/messages" component={Messages} />
              <Route path="/" component={() => <Redirect to="/products/submitted" />}/>
            </Switch>
        ) : (
          <Switch>
            <Route exact path="/signin" component={Login} />
            <Route exact path="/signup" component={Signup} /> 
            <Route exact path="/forgotpassword" component={forgotpassword} />
            <Route path="/" component={() => <Redirect to="/signin" />} />
          </Switch>
        )}
      </div>
    </div>
  );
});

function App() {
  return (
    <div>
      <Router>
        <Routes />
      </Router>
    </div>
  );
}

export default App;
