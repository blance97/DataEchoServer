import React, { Component } from 'react'
import {  Grid } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar';
import Dashboard from '../Components/dashboard';
import ServerLogs from '../Components/server-logs'
import ExampleInputFile from '../static/data/ExampleInputFile'

class LayoutContainer extends Component {

    constructor(props) {
        super(props);

        const endpoint = ExampleInputFile
        this.state = {groups: endpoint.groups}
    } 


    render() {
        return (
            <Grid style={{marginLeft:'2px', marginTop:'2px'}} columns={3} divided>
            <Grid.Column width={2}>
              <Sidebar/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Dashboard endpoints={this.state.groups}/>
            </Grid.Column>
            <Grid.Column >
            <ServerLogs/>
          </Grid.Column>
          </Grid>
        );
    }
}

export default LayoutContainer