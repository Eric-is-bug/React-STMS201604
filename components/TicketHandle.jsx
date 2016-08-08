import React from 'react';
import ReactDOM from "react-dom";
import Update from 'react-addons-update';
import ActionDone from 'material-ui/svg-icons/action/done';
import Processing from 'material-ui/svg-icons/AV/playlist-add-check';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import {ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CardMDL from './CardMDL'

const hostPrefix = (process.env.NODE_ENV === "development")?"http://localhost:8080":""

class TicketHandle extends React.Component {
  constructor(props){
    super(props)
    this.state =
          {
          employeeId:'',
          employeeInfo:{},
          ticketList:[],
          avaliable:false,
          notfound:false,
          expanded:false
        }
  }

  componentWillMount = () => {

  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  changeOnlineState = (value) => {
    let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = () =>{ 
        if (xhr.readyState === 4)
          if(xhr.status === 200) {
            //console.log(xhr.responseText)
        }
      };
      xhr.open("PATCH", hostPrefix+"/rest/employee/"+this.state.employeeId);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({online:value}));
  }

  findEmployee = () =>{
    this.setState({notfound:false})
    if(this.state.employeeId===""){
      this.refs.employeeId.focus()
    }else{
      let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = () =>{ 
        if (xhr.readyState === 4)
          if(xhr.status === 200) {
            //console.log(xhr.responseText)
            this.setState({employeeInfo:JSON.parse(xhr.responseText)})
            let _xhr = new XMLHttpRequest(); 
            _xhr.onreadystatechange = () =>{
               if(xhr.status === 200) {
                  this.setState({ticketList:JSON.parse(_xhr.responseText)})
                  //console.log(JSON.parse(_xhr.responseText))
               }
            }

            _xhr.open("GET", hostPrefix+"/findTicketByEid?eid="+this.state.employeeId)
            _xhr.send()
        }else{
            this.setState({notfound:true})
        }
      };
      xhr.open("GET", hostPrefix+"/findEmployeeByEid?eid="+this.state.employeeId);
      xhr.send();


    }

  }

  handleAccept = (rid,tid) => {
     let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = () =>{ 
        if (xhr.readyState === 4)
          if(xhr.status === 200) {
            let _xhr = new XMLHttpRequest(); 
            _xhr.onreadystatechange = () =>{
               if(_xhr.status === 200) {
                  this.findEmployee()
               }
            }
            _xhr.open("PATCH", hostPrefix+"/rest/tickets/"+tid)
            _xhr.setRequestHeader("Content-Type", "application/json");
            _xhr.send(JSON.stringify({statusId:2}))
            //console.log(xhr.responseText)
        }
      };
      xhr.open("PATCH", hostPrefix+"/rest/ticketrecord/"+rid);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({accepted:true}));
  }

  handleReject = (rid,tid) => {
     let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = () =>{ 
        if (xhr.readyState === 4)
          if(xhr.status === 204) {
            this.findEmployee()
        }
      };
      xhr.open("DELETE", hostPrefix+"/rest/ticketrecord/"+rid);
      xhr.send();
  }



  render() {
    const {employeeId,employeeInfo,ticketList,avaliable,notfound} = this.state
    const iconButton = (<IconButton
                            touch={true}
                            tooltip="more"
                            tooltipPosition="bottom-left"
                            >
                            <MoreVert />
                        </IconButton>)
    let acList = [], nacList=[], finList=[]
    for(let index in ticketList){
      const item = ticketList[index]
        if (item.accepted){
          if(item.status_id!==4){
              acList.push(<Divider />)
              acList.push(<ListItem key={item.tid}
                      primaryText={"Customer: "+item.consumer_name+" "+item.consumer_phone}
                      secondaryText="[Location],[TimeToFix], Ticket Details..."
                    >
                </ListItem>)
            }
          else
              finList.push(<MenuItem key={item.tid}
                      primaryText={item.tid}
                      rightIcon={<ActionDone />}
                    >
                </MenuItem>)
        }
        else{
          nacList.push(<Divider />)
          nacList.push(<ListItem key={item.tid}
                      primaryText={"Customer: "+item.consumer_name+" "+item.consumer_phone}
                      secondaryText="Ticket Details..."
                      rightIconButton={<IconMenu iconButtonElement={iconButton}>
                                          <MenuItem onClick={()=>this.handleAccept(item.rid,item.tid)}>Accept</MenuItem>
                                          <MenuItem onClick={()=>this.handleReject(item.rid,item.tid)}>Reject</MenuItem>
                                        </IconMenu>}
                    >
                </ListItem>)
        }
        }

    return (
    <div className="mdl-grid">
    <CardMDL 
        title = {"Employee"}
        width = "mdl-cell--4-col"
      >

      <TextField           
        floatingLabelText="Employee ID"
        value={employeeId}
        ref={employeeId}
        onChange={(e) => this.setState({employeeId:e.target.value}) }
      />

      <FlatButton 
        style={{marginLeft: 12}}
        primary={true}
        label="Login" 
        onClick={this.findEmployee}
      />

      { notfound && <h5>No such worker</h5>}

      {typeof employeeInfo.online_status !== 'undefined' && 
          <div>
          <h5><b>Name : </b>{employeeInfo.name}</h5>
          <Divider />
          <h6>You have <RaisedButton
                          label={nacList.length/2+" tickets "}
                          primary={true}
                          style={{margin: 10}}
                          onClick={()=>{
                            this.setState({expanded: true})
                            const node = ReactDOM.findDOMNode(this.refs.newticket)
                            node.scrollIntoView()
                            
                        }}
                        /> 
                         to check. </h6>
          <Divider />
          <h6>Processing Tickets Number : {employeeInfo.processing}</h6>
          <h6>Finished Tickets Number : {employeeInfo.count - employeeInfo.processing}</h6>
          <h6>Average Evaluation Score(0-5): {employeeInfo.avgeval}</h6>
          <Divider />
          <br/>
          <Toggle
            label="Currently Available"
            onToggle={(e,value)=>this.changeOnlineState(value)}
            defaultToggled = {employeeInfo.online_status}
            />
        </div>
      }
      
     
    </CardMDL>
    <CardMDL 
        title = "Ticket Detail"
        width = "mdl-cell--6-col"        
      >
      {typeof employeeInfo.online_status !== 'undefined' && 
      <div>
           <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
              <CardHeader
                title="New tickets"
                subtitle="Show all unchecked tickets."
                actAsExpander={true}
                showExpandableButton={true}
                ref="newticket"
              />
              <CardText expandable={true}>
                {nacList}
              </CardText>
            </Card>
            <Card>
              <CardHeader
                title="Under Processing tickets"
                subtitle="Show all unfinished tickets."
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                {acList}
              </CardText>
            </Card>
            <Card>
              <CardHeader
                title="Finished tickets"
                subtitle="Show all closed tickets."
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                {finList}
              </CardText>
            </Card>
      </div>
      }
    </CardMDL>
    </div>
    );
  }
}

export default TicketHandle;