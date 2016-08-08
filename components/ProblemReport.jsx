import React from 'react';
import CardMDL from './CardMDL'
import Update from 'react-addons-update';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField  from 'material-ui/SelectField';
import CircularProgress from 'material-ui/CircularProgress';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const hostPrefix = (process.env.NODE_ENV === "development")?"http://localhost:8080":""

class ProblemReport extends React.Component{
	constructor(props) {
		super(props)
		this.state = 
		{
		    name: "",
		    location:"",
		    phone: "",
		    problemtype:"",
		    details:"",    
		    default:{
		    	problemtypeList : [],
		    	post:"",
		    	searchResult: "",
		    	init:true,
		    	loading: false,
		    	searching:false,
		    	save:false,
		    	ticket:""
		    }

	    };

		//problemtypeList = [{text:"Not loaded",value:"Not loaded"}]
       
	}
	
	updateDefaultNested = (key,value) => {
    	this.setState({
			default: Update(this.state.default, {[key]:{$set: value}})
	    })

    }

	componentWillMount = () => {
         // this.refs.name.getDOMNode().focus(); 
        
        let xhr = new XMLHttpRequest(); 
 		xhr.onreadystatechange = () =>{ 
 			if (xhr.readyState === 4)
 				if (xhr.status === 200) {
	 				const menulist = JSON.parse(xhr.responseText)._embedded.skillconfig.map(
				        (skill)=>new Object({text:skill.skillname,value:skill.skillId}));
	 				;   			
	 				//console.log(this.state.problemtypeList)
	 				this.updateDefaultNested("problemtypeList",menulist)
	 				//console.log(this.state.default.searchResult.length)
	 			}else
	 				alert('Cannot connect to server!')
 			
  		}
  		xhr.open("GET", hostPrefix+"/rest/skillconfig/");
		xhr.send();
    }

	handleClick = (event) => {
  	  	event.preventDefault()
  	  	//deep copy using JSON trick
  	    let data = JSON.stringify(this.state)
  		data = JSON.parse(data); 		
  		this.updateDefaultNested('init',false)
  	  	for (let key in data)
  	  		if (key !== "default" && data[key]==='') {
  	  			if (this.refs[key] && this.refs[key].focus) 
  	  				this.refs[key].focus()
  	  			return false;
  	  	}

  	  	//localStorage
  	  	if (this.state.default.save){
  	  		let nameList=[], locList=[], phoneList=[]
  	  		if(typeof localStorage.name !== 'undefined'){
  	  			nameList = JSON.parse(localStorage.name)
  	  			locList = JSON.parse(localStorage.location)
  	  			phoneList = JSON.parse(localStorage.phone)
  	  		}
  	  		nameList.push(this.state.name)
  			locList.push(this.state.location)
  			phoneList.push(this.state.phone)
  	  		localStorage.setItem("name",JSON.stringify(nameList))
  	  		localStorage.setItem("location",JSON.stringify(locList))
  	  		localStorage.setItem("phone",JSON.stringify(phoneList))
  	  	}
  	  	// ajax post here 
  	  	let xhr = new XMLHttpRequest(); 
  		let date = new Date();
		data["createdTime"]=date.toLocaleString();
		data["tid"]=data["name"]+date.getTime();
		data["consumerName"] = data["name"]
		data["consumerPhone"] = data["phone"]

		xhr.onreadystatechange = () =>{ 
			//A status code 201 used by spring-data-rest meaning CREATED
 			if (xhr.readyState === 4 ){
 				this.updateDefaultNested("loading",false);
 				if( xhr.status === 201) {
 				//console.log(JSON.stringify(data))	 				
	 				this.updateDefaultNested("post","Successfully submitted at "+
	 												data.createdTime)
	 				this.updateDefaultNested("ticket",data.tid)
	 				this.searchticket()
 				}else
	 				this.updateDefaultNested("post","Submit error")
	 			}
  		};

  		xhr.onerror = ()=>{ this.updateDefaultNested("post","Submit error")}
  	  	
  	  	xhr.open("POST", hostPrefix+"/rest/tickets");
  	  	this.updateDefaultNested("loading",true)
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(data));

  	  	
  	  	
  	}
    
    handleReset = () =>{
		this.setState({
		    name: "",
		    location:"",
		    phone: "",
		    problemtype:"",
		    details:"",    
		    default: Update(this.state.default, {save:{$set: false},
												 post:{$set: ""},
												 init:{$set: true},
												 loading:{$set: false}
			})												    
	    })
    	//console.log(this.state.default)
    }

    clearSearch = () =>{
    	this.setState({
    		default: Update(this.state.default, {searching:{$set: false},
												 searchResult:{$set: ""},
												 ticket:{$set: ""}		    

    		})
    	})
    }

  	handleChange = (event) => {
  		event.preventDefault();
  		this.setState({details:event.target.value});
  	}

  	searchticket = () => {
  		if(this.state.default.ticket===""){
  			this.refs.ticket.focus()
  			this.updateDefaultNested("searchResult","")
  		}
  		else{
  			let xhr = new XMLHttpRequest(); 
	 		xhr.onreadystatechange = () =>{ 
	 			if (xhr.readyState === 4){
	 				this.updateDefaultNested("searching",false)
	 				if (xhr.status === 200) {
		 				let ticket = JSON.parse(xhr.responseText)
		 				if (localStorage.getItem("search")===null){
		 					localStorage.setItem("search",JSON.stringify([ticket.tid]))
		 				}else if (localStorage.search.indexOf(ticket.tid)===-1){
		 					let searchHistory = JSON.parse(localStorage.search)
		 					searchHistory.push(ticket.tid)
		 					localStorage.search = JSON.stringify(searchHistory)
		 				}
		 				
		 				//console.log(ticket)
		 				this.updateDefaultNested("searchResult",ticket.statusId)
		 			}else
		 				alert('Cannot connec to server!')
		 			}
	 			
	  		}
	  		xhr.open("GET", hostPrefix+"/rest/tickets/"+ this.state.default.ticket);
	  		this.updateDefaultNested("searching",true)
			xhr.send();
  		}
  	}

  	autoFillByName = (text,index) =>{
  		this.setState({
  			name:text,
  			location:JSON.parse(localStorage.location)[index],
  			phone:JSON.parse(localStorage.phone)[index]})
    	this.updateDefaultNested("save",false)

  	}

  	dataSourceConfig = () => {
  		if (typeof localStorage.search ==='undefined')
  			return []
  		else{
  			let searchList = JSON.parse(localStorage.search)
  			let result  = searchList.map((item,index)=>{
			  							return {text:item,
			  									value:(<MenuItem
						        						primaryText={item.substr(0,20)}							        						
						        						/>)
			  									}
			        					})
  			//console.log(result)
  			return result
  		}
  	}

  	deleteSearchResult = () =>{
  		let resultList = JSON.parse(localStorage.search)
  		const index = resultList.indexOf(this.state.default.ticket)
  		if (index!==-1){
  			resultList.splice(index,1)
  			localStorage.setItem('search',JSON.stringify(resultList))
  			this.clearSearch()
  		}
  	}

	render(){
		const {init,post,searchResult} = this.state.default
		const statusList = ["Unchecked",
		 						"Assigning Worker","Worker Accepted",
		 						"Problem Handling","Ticket Finished"]
		
		return (			
			<div className="mdl-grid ">
				<CardMDL 
		          title = "Basic Information"
		          width = "mdl-cell--3-col"
		        >
					<h5>Please input your basic information</h5>
					
					{/*<TextField	     
				      floatingLabelText="Reporter Name"	   
				      fullWidth={true}   
				      ref="name"
				      onChange={(e)=>this.setState({name:e.target.value})}
				      value={this.state.name}
				      errorText={!(/^[A-z]{4,}$/.test(this.state.name)) && "This field is invalid, must be more than 4 characters"}
				    />*/}
				    <AutoComplete
	                  floatingLabelText="Name"
	                  fullWidth={true}
	                  filter={AutoComplete.noFilter}
	                  openOnFocus={true}
	                  ref="name"
	                  searchText={this.state.name}
	                  onNewRequest={this.autoFillByName}
	                  onKeyUp={(e) => this.setState({name:e.target.value})}
	                  errorText={!init && !(/^[A-z\s]{4,}$/.test(this.state.name)) && "Name must contain 4 characters at least."}
	                  dataSource={(typeof localStorage.name ==='undefined')?[]:JSON.parse(localStorage.name)}
	                />
				   				   
				    <TextField			      
				      floatingLabelText="Location"
				      fullWidth={true}
				      ref="location"
				      onChange={(e)=>this.setState({location:e.target.value})}
				      value={this.state.location}
				      errorText={!init && this.state.location==="" && "This field is required"}
				    />

				    <TextField			    
				      floatingLabelText="Phone number"
				      fullWidth={true}	
					  ref="phone"
					  onChange={(e)=>this.setState({phone:e.target.value})}
				      value={this.state.phone}
				      errorText={!init && !(/^[0-9]{8,13}$/.test(this.state.phone)) && "Phone must contain 8-13 numbers."}		     
				    />		
				    <br/>
				    <Checkbox
				      style={{minWidth:380}}
				      ref='localSave'
				      checked={this.state.default.save}
				      label="Save my information on this computer"
				      labelPosition="left"
				      onCheck={(e) => this.updateDefaultNested("save",e.target.checked)}
					/>

				</CardMDL>

				<CardMDL 
		          title = "Problem Details"
		          width = "mdl-cell--3-col"
		        >
		        	<h5>Please describe your problem</h5>
		        	<br/>
		        	<SelectField
				    	hintText="Choose problem type"
				    	ref="problemtype"
				    	fullWidth={true}	
				        value={this.state.problemtype}
				        errorText={!init && this.state.problemtype==="" && "This field is required"}
				        onChange={(event, index, value) => this.setState({problemtype:value})}
					        >
				        {this.state.default.problemtypeList.map((item)=>{
				          	return <MenuItem key={item.text} value={item.value} primaryText={item.text}/>})}
				    </SelectField>

		        	<TextField
						hintText="Please describe your problem"
						floatingLabelText="Please describe your problem"
						fullWidth={true}
						value = {this.state.details}
						onChange = {this.handleChange}
						multiLine={true}
						rows={2}
						ref="details"
						onChange={(event, value) => this.setState({details:value})}
						errorText={!init && this.state.details==="" && "This field is required"}
					/>	

					{this.state.default.loading?
							(<div><CircularProgress /><h4> Submitting...</h4></div>):
							(<h4>{this.state.default.post}</h4>)
						}
						    
				  {/*  <DatePicker 
						hintText="Available Date" 
						ref="expectedDate"
						fullWidth={true}	
						value={this.state.expectedDate}
						onChange={(event, value) => this.setState({expectedDate:value})}
						autoOk={true}
				    />
					<p>Our worker will contact you for the exact time available.</p>
					<br/>*/}

			    	<RaisedButton 
			    	 	className="mdl-cell--6-col"
			    	 	//fullWidth={true}
			    	 	disabled={post!==''}
			    		label="Submit" 
			    		style={{ margin: 8}}
			    		secondary={true} 
			    		onClick={this.handleClick} 
			    	 />
			    	 <RaisedButton 
			    	 	className="mdl-cell--6-col"
			    		label="Clear" 
			    		style={{ margin: 8}}
			    		onClick={this.handleReset} 
			    	 />
			    				    	
				</CardMDL>
					
			    <CardMDL 
		          title = "Ticket Searching"
		          width = "mdl-cell--3-col"
		        >
						<h5>Input your Ticket ID to check its status</h5>
						
						<AutoComplete			      
					      floatingLabelText="Please Input Your Ticket ID"
					      ref="ticket"
					      filter={AutoComplete.noFilter}
					      openOnFocus={true}
					      onNewRequest={(item)=>{
					      					this.setState({
    										default: 
    											Update(this.state.default, {searching:{$set: false},
															 searchResult:{$set: ""},
												 			ticket:{$set: item.text}})})
					  					}}
					      onKeyUp={(e)=>{
					      					this.updateDefaultNested("ticket",e.target.value)
					      					if (e.target.value==='') this.clearSearch()
					  					}}
					  	  
					      searchText={this.state.default.ticket}	
					      dataSource={this.dataSourceConfig()}
					    />

					    <FlatButton 
					    	style={{marginLeft: 12}}
					    	primary={true}
					    	label="Search" 
					    	onClick={this.searchticket}
			    	 	/>

			    	 	{this.state.default.searching?
							(<div><CircularProgress /><h4> Searching...</h4></div>):
							(<div>
								{searchResult !=='' &&
								<Card>
							    	<Stepper activeStep={parseInt(searchResult)} orientation="vertical">
							    		
							    		{statusList.map((statusName)=>{
							    			return (<Step key={statusName}>
							            				<StepLabel>{statusName}</StepLabel>
							          			    </Step>)
							    		})}
							        </Stepper>
							        <CardActions>
								    <FlatButton 
								    	fullWidth={true}
								    	style={{marginLeft:'50px'}}
								    	primary={true}
								    	label="Clear this search result" 
								    	onTouchTap={this.deleteSearchResult}
						    	 	/>
						    	 	</CardActions>
								</Card>}
							</div>)
						}
						
				</CardMDL>
			</div>
			
		)
	}
}

export default ProblemReport;