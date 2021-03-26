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
  Config,
  AcceptUrl,
  Accounting,
  Messages
} from "./Pages";
import Header from "./Components/header/header";
import BasicForm from "./Pages/Basic/BasicForm";
import EditForm from "./Pages/EditForm/EditForm";
import ListingSettings from "./Pages/ListingSettings/ListingSettings";
import Accounts from "./Pages/Accounts/Accounts";
import ClientMessagesProvider from '../src/ContextProviders/ClientMessagesProvider';

const Routes = withRouter((props) => {
  const { pathname } = props.history.location;
  return (
    <div>
      {!["/signup", "/signin"].includes(pathname) && <div className="fixed-top"> <ClientMessagesProvider>
          <Header />
        </ClientMessagesProvider></div>}
      <div className = "container-fluid px-5 py-5 admin my-5">
      {localStorage.getItem("token") ? (
        localStorage.getItem("paymentadded") === "true" ? (
          <Switch>
            <Route exact path="/passwords" component={Passwords} />
            <Route exact path="/charts" component={Charts} />
            <Route exact path="/config" component={Config} />
            <Route exact path="/resetpassword" component={ResetPassword} />
            <Route
              exact
              path="/editpasswords/:website"
              component={Editdomain}
            />
            <Route exact path="/addpayment" component={AddPayment} />
            <Route exact path="/templates" component={Templates} />
            <Route
              exact
              path="/template/:templateid"
              component={TemplateForm}
            />

            <Route exact path="/basic" component={BasicForm} />
            <Route exact path="/edit/:id" component={EditForm} />
            <Route exact path="/listingsettings" component={ListingSettings} />
            <Route exact path="/products" component={Searchcart} />
            <Route exact path="/products/:prodStatus" component={Searchcart} />
            <Route exact path="/transactions" component={Transactions} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/accounting" component={Accounting} />
            <Route exact path="/setting" component={Settings} />
            <Route exact path="/client/ebay/:id" component={AcceptUrl} />
            <Route exact path="/messages" component ={Messages} />
            <Route path="/" component={() => <Redirect to="/products/submitted" />} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/addpayment" component={AddPayment} />
            <Route exact path="/messages" component={Messages} />
            <Route path="/" component={() => <Redirect to="/addpayment" />} />
          </Switch>
        )
      ) : (
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Login} />
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


