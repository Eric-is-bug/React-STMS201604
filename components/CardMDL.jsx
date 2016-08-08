import React from 'react';


export default class CardMDL extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
        <div className={"mdl-shadow--4dp mdl-color--white mdl-cell " + this.props.width}
             style={{minWidth: '450px', minHeight: '550px', margin: '20px 15px'}}>
          <div className={"mdl-shadow--2dp mdl-card__title mdl-color--cyan-500"}>
            <h3 className="mdl-card__title-text mdl-color-text--white"> 
              {this.props.title}
            </h3>
          </div>          
          <div style={{width: '80%', margin: 'auto'}}> 
            <br/>
              {this.props.children}
            <br/>
          </div>
        </div>
    );
  }
}