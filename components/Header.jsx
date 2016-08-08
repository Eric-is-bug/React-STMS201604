import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';
import mui, {AppBar} from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyRawTheme from '../src/material_ui_raw_theme_file';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  static get childContextTypes() {
    return { muiTheme: React.PropTypes.object };
  }

  getChildContext(){
    return {  muiTheme: getMuiTheme(MyRawTheme)};
  }

  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
       <header className="header">
          <AppBar title="Admin Desk" />
          <h1 style={defaultStyle} >My plans</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave.bind(this)}
                         placeholder="What needs to be done?" />
      </header>
    );
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
