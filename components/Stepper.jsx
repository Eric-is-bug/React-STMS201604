import React from 'react';
import Update from 'react-addons-update';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import CircularProgress from 'material-ui/CircularProgress';
import CardMDL from './CardMDL'
/**
 * Horizontal steppers are ideal when the contents of one step depend on an earlier step.
 * Avoid using long step names in horizontal steppers.
 *
 * Linear steppers require users to complete one step in order to move on to the next.
 */

const hostPrefix = (process.env.NODE_ENV === "development")?"http://localhost:8080":""

class HorizontalLinearStepper extends React.Component {
  constructor(props){
    super(props)
    this.state =
          {
          employee:{
            name:"",
            age:"",
            phone:"",
            gender:"",
            diploma:""
          },
          submit:false,
          agreed:false,
          result:"",
          finished: false,
          stepIndex: 0,
          endIndex: 2,
          menulist:[],
          skillset:[]
        }
  }

  componentWillMount = () => {
  	  //console.log(this.props.route.path)
      let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = () =>{ 
        if (xhr.readyState === 4 && xhr.status === 200) {
          const menulist = JSON.parse(xhr.responseText)._embedded.skillconfig.map(
                (skill)=>new Object({text:skill.skilldetail,value:skill.skillId}));
          ;         
          this.setState({menulist:menulist})
        }
      };
      xhr.open("GET", hostPrefix+"/rest/skillconfig/");
      xhr.send();
  }

  updateNestedEmployee = (key,value) => {
      this.setState({
        employee: Update(this.state.employee, {[key]:{$set: value}})
      })
  }

  handleNext = () => {
    const {stepIndex, endIndex, skillset} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= endIndex
    });
    if (stepIndex>=endIndex){
      
      this.setState({submit:true})
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () =>{           
          if (xhr.status === 500)
            this.setState({result:"Submit Error"})
          //A status code 201 used by spring-data-rest meaning CREATED
          if (xhr.readyState === 4 && xhr.status === 201) {       
            const eid = JSON.parse(xhr.responseText).eid
            for (let i in skillset){
            	let xhr = new XMLHttpRequest()
            	xhr.open("POST", hostPrefix+"/skill?action=create&employeeId="+eid)
            	// xhr.onreadystatechange = () => {
            	// 	if (xhr.readyState === 4)
            	// 		console.log(xhr.responseText)
            	// }
            	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")
            	xhr.send("skillId="+skillset[i])
            }
            console.log(xhr.responseText)
            this.setState({submit:false})
            this.setState({result:"Your profile is successfully posted. Please wait for our reply."})          }
      };
      xhr.onerror = () =>{this.setState({result:"Submit Error"})}
      xhr.open("POST", hostPrefix+"/rest/employee",true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(JSON.stringify(this.state.employee))
    xhr.send(JSON.stringify(this.state.employee));

    }
  }

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  }

  getStepContent(stepIndex) {
    const diplomaOptions = [
        {text: 'Middle School',value:'Middle School'},
        {text: 'High School',value:'High School'},
        {text: 'College',value:'College'},
        {text: 'Other',value:'Other'}     ]
    const genderOptions = [
        {text:'Male',value:'Male',key:'m'},
        {text:'Female',value:'Female',key:'f'} ]
    switch (stepIndex) {
      case 0: //return 'step1';
        const {name,phone,age,diploma,gender} = this.state.employee
        return (
              <div className="mdl-grid">

                <div className="mdl-cell--1-offset mdl-cell--4-col">
                <TextField           
                  floatingLabelText="Name"
                  fullWidth={true}
                  ref="name"
                  value={name}
                  onChange={(e) => this.updateNestedEmployee('name',e.target.value) }
                  errorText={name!=="" && !/^[A-z\s]{4,}$/.test(name) && "Name must contain 4 characters at least."}
                />
                <br/>
                <TextField          
                  floatingLabelText="Phone"
                  fullWidth={true}
                  ref="phone"    
                  value={phone}
                  onChange={(e) => this.updateNestedEmployee('phone',e.target.value) }    
                  errorText={phone!=="" && !/^[0-9]{8,13}$/.test(phone) && "Phone must contain 8-13 numbers."}
                />
                <TextField           
                  floatingLabelText="Age"
                  fullWidth={true}
                  ref="age"
                  value={age}
                  onChange={(e) => this.updateNestedEmployee('age',e.target.value) }
                  errorText={age!=="" && !/^[1-9]{1}[0-9]{0,1}$/.test(age) && "Age invalid"}
                />
                </div>

                 
                <div className="mdl-cell--2-offset mdl-cell--4-col">

                <AutoComplete
                  floatingLabelText="Diploma"
                  filter={AutoComplete.noFilter}
                  openOnFocus={true}
                  fullWidth={true}
                  ref="diploma"
                  searchText={diploma}
                  onNewRequest={(e) => {
                    console.log(e.value)
                    this.updateNestedEmployee('diploma',e.value) 
                  }}
                  dataSource={diplomaOptions}
                />
                <AutoComplete           
                  floatingLabelText="Gender"
                  filter={AutoComplete.noFilter}
                  openOnFocus={true}
                  fullWidth={true}
                  ref="gender"
                  searchText={gender}
                  dataSource={genderOptions}
                  onNewRequest={(e) => this.updateNestedEmployee('gender',e.key) }
                />
                {/*<TextField           
                  floatingLabelText="Email"
                  fullWidth={true}
                  ref="email"
                  value={email}
                  onChange={(e) => this.updateNestedEmployee('email',e.target.value) }
                  errorText={email!=="" && !/^\w+([\.-]\w+)*@\w+([\.-]\w+)*\.\w{2,3}$/.test(email) && "Email invalid"}
                />*/}
                </div>
              </div>
            );
      case 1:
        return (
          <div >
             <h4>Choose the skill you have obtained. </h4>
               <div style={{paddingLeft: '10px'}}>
               {this.state.menulist.map((item,index)=>{                    
                    return <Checkbox 
                            key={item.value} 
                            label={item.text} 
                            checked={this.state.skillset.indexOf(item.value)!==-1}
                            onCheck={(e) =>{                                
                              if (!e.target.checked){
                                this.setState({skillset: this.state.skillset.filter((value)=>value!==item.value)})
                              }
                              else{
                                this.setState({skillset: Update(this.state.skillset, {$push: [item.value]})})
                              }
                            }}
                            />})}
               </div>
          </div>
        
          );
      case 2:
        const {employee,skillset} = this.state
        let info=[], skill, header
        for(let key in employee){
          if (employee[key]==="")
              info.push(<font key={key}> -- {key}; </font>)
        }

        if (info.length!==0)
          header = <h4>Please fill the following field:</h4>

        if (skillset.length===0)
          skill = <h4>You have to choose at least one skill!</h4>
        if (info.length===0 && skillset.length !==0){
          return (
          <div>
            <h4>Please make sure your information is authentic.</h4>
            <Checkbox
              style={{paddingLeft: '65%', width:150}}
              label="I Agree"
              labelPosition="left"
              checked={this.state.agreed}
              onCheck={(e)=>this.setState({agreed:e.target.checked})}
            />
          </div>
          )
        }
        return (<div>
        {header}
        {info}
        {skill}
        </div>
        );
      default:
        return 'Wrong Loading Data!';
    }
  }

  render() {
    const {finished, stepIndex, agreed} = this.state;
    const contentStyle = {margin: '16px 16px'};

    return (
    <div className="mdl-grid">
    <CardMDL 
        title = "Job Applying"
        width = "mdl-cell--10-col"
      >
      <div style={{paddingLeft: '10px'}}>
        <Stepper activeStep={stepIndex} linear={false} >
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>Basic Information</StepButton>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 1})}>Skill Matching</StepButton>
          </Step>
           <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}> Confirm Application </StepButton>
          </Step>
        </Stepper>

        <div style={contentStyle}>
          {finished ? (
            <div>
            {this.state.submit?
              (<div><CircularProgress /><h4> Submitting...</h4></div>):
              (<h4>{this.state.result}</h4>)}
            
            <RaisedButton
                  label="Reset"
                  secondary={true}
                  onTouchTap={(event) => {
                    event.preventDefault();
                    this.setState({
                            employee:{
	                              name:"",
	                              age:"",
	                              phone:"",
	                              gender:"",
	                              diploma:""
                            },
                            submit:false,
                            agreed:false,
                            result:"",
                            finished: false,
                            stepIndex: 0,
                            skillset:[]
                          });
                  }}
            />
            </div>
          ) : (
            <div>
              <br/>
              <div style={{minHeight: '300px'}}>
                {this.getStepContent(stepIndex)}
              </div>
              <footer className="mdl-card__actions mdl-card--border">
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  disabled={stepIndex >= this.state.endIndex && !agreed}
                  label={stepIndex >= this.state.endIndex ? 'Submit' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </footer>
            </div>
          )}
        </div>
      </div>
    </CardMDL>
    </div>
    );
  }
}

export default HorizontalLinearStepper;