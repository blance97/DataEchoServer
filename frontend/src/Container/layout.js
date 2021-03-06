import React, { Component } from 'react'
import {  Grid, Message } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar';
import Dashboard from '../Components/dashboard';
import ServerLogs from '../Components/server-logs'
import ExampleInputFile from '../static/data/ExampleInputFile'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

class LayoutContainer extends Component {

    constructor(props) {
        super(props);

        // const endpoint = ExampleInputFile

        this.state = { error:{} ,groups: {}}

    }

    componentDidMount() {
        toast.configure();
        this.getInitialSetup()
    }

    getInitialSetup = () => {
        axios.get('/getJSON').then((res) =>{
            this.setState({groups: res.data['groups']})
        })
    }

    editEndpoint = (endpointDetails) => {
        console.log("hey?")
        axios.post('/editEndpoint', endpointDetails).then((res) =>{
            toast.success(`Succesfully updated endpoint`)
        }).catch((err) =>{
            toast.error( err.response.data.Error)
        })
    }

    addGroup = (groupName) => {
        this.setState({loading: true})
        axios.put('/addGroup', {name: groupName}).then((response) =>{
            this.setState({loading:false, groups: {...this.state.groups, ...response.data } });
        }).catch((err) =>{
            this.setState({loading:false, error: err.response.data.data})
            toast.error(this.state.error, {position: 'top-center', draggable: false})
        })
    }

    addEndpoint = (endpointDetails, groupName) => {
        this.setState({loading: true})
        axios.post('/addEnpoiont', {name: groupName, endpointDetails}).then((response) =>{
            console.log(response)
            // this.setState({loading:false, groups: {...this.state.groups, ...response.data } });
        }).catch((err) =>{
            this.setState({loading:false, error: err.response.data.data})
            toast.error(this.state.error, {position: 'top-center', draggable: false})
        })
    }


    render() {
        console.log(this.state.groups)
        return (

            <Grid style={{marginLeft:'2px', marginTop:'2px'}} columns={3} divided>
            <Grid.Column width={2}>
              <Sidebar addGroup={this.addGroup} addEndpoint={this.addEndpoint}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Dashboard  addEndpoint={this.addEndpoint} editEndpoint={this.editEndpoint} endpoints={this.state.groups}/>
            </Grid.Column>
            <Grid.Column >
            <ServerLogs/>
          </Grid.Column>
          </Grid>
        );
    }
}

export default LayoutContainer