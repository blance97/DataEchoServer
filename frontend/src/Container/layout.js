import React, { Component } from 'react'
import {  Grid, Dimmer,Loader } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar';
import Dashboard from '../Components/dashboard';
import ServerLogs from '../Components/server-logs'
import ExampleInputFile from '../static/data/ExampleInputFile'
import axios from 'axios';
class LayoutContainer extends Component {

    constructor(props) {
        super(props);

        const endpoint = ExampleInputFile
        this.state = {loading: false, groups: endpoint.groups}
    } 

    addGroup = (groupName) => {
        this.setState({loading: true})
        axios.put('/addGroup', {groupName: groupName}).then((response) =>{
            this.setState({loading:false, groups: {...this.state.groups, [response.data.groupName]: []} });
        }).catch((err) =>{
            console.log(err);
        })
    }

    addEndpoint = (endpoint, HTTPMethod, desc, groupName) => {

    }


    render() {
        return (
            <Grid style={{marginLeft:'2px', marginTop:'2px'}} columns={3} divided>
                 <Dimmer active={this.state.loading}>
      <Loader />
    </Dimmer>
            <Grid.Column width={2}>
              <Sidebar addGroup={this.addGroup} addEndpoint={this.addEndpoint}/>
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