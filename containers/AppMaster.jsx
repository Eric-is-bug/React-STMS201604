import React, {PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { spacing, typography, zIndex} from 'material-ui/styles';
import {darkWhite, lightWhite, teal400, blueGrey600, grey600, grey900, cyan600, cyan400, grey300} from 'material-ui/styles/colors';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import { hashHistory, Link } from 'react-router';
import FullWidthSection from '../components/FullWidthSection';

class AppMaster extends React.Component{

  static propTypes = {
      children: PropTypes.node,
      location: PropTypes.object,
      width: PropTypes.number.isRequired
    };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  state = {
    navDrawerOpen: false
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  componentWillMount() {
    this.setState({
      muiTheme: getMuiTheme()
    });
  }

  getStyles() {
    const styles = {
      // logo: {
      //   cursor: 'pointer',
      //   fontSize: 24,
      //   color: typography.textFullWhite,
      //   lineHeight: `${spacing.desktopKeylineIncrement}px`,
      //   fontWeight: typography.fontWeightLight,
      //   backgroundColor: grey900,
      //   paddingLeft: spacing.desktopGutter,
      //   marginBottom: 8
      // },
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        backgroundColor: grey300,
        paddingBottom: spacing.desktopKeylineIncrement,
        minHeight: 500
      },
      content:{
        marginLeft: '3%',
        marginRight: '3%',
        marginTop: '5px'
         //margin: `${spacing.desktopGutter*2}px ${spacing.desktopGutter}px`
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
        minHeight: 250        
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356
      }
    };

    

    return styles;
  }

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  };

  handleChangeList = (event, value) => {
    hashHistory.push(value);
    this.setState({
      navDrawerOpen: false
    });
  };

  

  render() {
    const {
      children
    } = this.props;
    
    let {
      navDrawerOpen
    } = this.state;

    const {
      prepareStyles
    } = this.state.muiTheme;

    const router = this.context.router;
    const styles = this.getStyles();
    let docked = false;
    let showMenuIconButton = true;

    if (this.props.width === LARGE) {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = false;

      styles.navDrawer = {
        backgroundColor: teal400,
        zIndex: styles.appBar.zIndex - 1
      };
      styles.root.paddingLeft = 256;
      styles.footer.paddingLeft = 256;
    }else{
      styles.root.paddingLeft = 64;
      styles.footer.paddingLeft = 64;
    }
    

    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          zDepth={1}
          title={this.props.routes[this.props.routes.length-1].name}
          iconElementRight={
                        <IconMenu
                          iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
                          }
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        >
                          <MenuItem primaryText="HR Sign In" onClick={()=>{window.location='/login'}}/>
                          <MenuItem primaryText="Employee Sign In" onClick={()=>hashHistory.push("/tickethandle")}/>
                        </IconMenu>
                      }
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />
        
        <div style={prepareStyles(styles.root)}>
          <div className="page-content" style={prepareStyles(styles.content)}>
            {this.props.children}
          </div>
        </div> 
        
                
        <Drawer 
            style={styles.navDrawer}
            docked={docked}
            onChangeList={this.handleChangeList}
            open={navDrawerOpen}
            onRequestChange={(open) => this.setState({navDrawerOpen:open})}
            >
          <AppBar title='Navigation' 
            onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          />

          
          <div>
              <Divider />
              <MenuItem  onTouchTap={()=>{this.handleTouchTapLeftIconButton();hashHistory.push("/problemreport")}}>Problem & Ticket</MenuItem>
             
              <MenuItem  onTouchTap={()=>{this.handleTouchTapLeftIconButton();hashHistory.push("/employeelist")}}>Job Openings</MenuItem>
            
              <MenuItem  onTouchTap={()=>{this.handleTouchTapLeftIconButton();hashHistory.push("/step")}}> Apply for jobs </MenuItem>

              <Divider />
          </div>
        
        </Drawer>

        <FullWidthSection style={styles.footer} >
            <p style={styles.p}>If you want to apply for jobs as temporary workers, please click <Link to="/step">here</Link> to start.</p>
        </FullWidthSection>
          
      </div>
    );
  }


   
}
  
export default withWidth()(AppMaster);