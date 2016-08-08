import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Router, Route, Redirect, IndexRedirect, hashHistory, browserHistory  } from 'react-router';
import AppMaster from '../containers/AppMaster';
import HorizontalLinearStepper from '../components/Stepper';
import EmployeeList from '../components/EmployeeList';
import ProblemReport from '../components/ProblemReport';
import TicketHandle from '../components/TicketHandle';

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


ReactDOM.render(
    <Router history={hashHistory}>
    	<Route path="/" component={AppMaster}>
    		<IndexRedirect to="/problemreport" />
    		<Route name="Problem & Ticket" path="problemreport" component={ProblemReport} />
    		<Route name="Job Register" path="step" component={HorizontalLinearStepper} />
    		<Route name="Job Openings" path="employeelist" component={EmployeeList} /> 
    		<Route name="Employee Backend" path="tickethandle" component={TicketHandle} />   		
    		<Redirect from="*" to="/" />
    	</Route>
    </Router>
    , document.getElementById("root")
);
