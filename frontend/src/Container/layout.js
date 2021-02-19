import React, { Component } from 'react'
import {  FormInput, Grid, Message } from 'semantic-ui-react'
import Sidebar from './Sidebar';
import Dashboard from '../Components/dashboard';
import ServerLogs from '../Components/server-logs';

import axios from 'axios';
import { addHTTPEndpoint } from '../store/side-bar/actions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

class LayoutContainer extends Component {

    constructor(props) {
        super(props);
        this.state = { error:{} ,groups: {}}
    }




    editEndpoint = (endpointDetails) => {
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

    removeGroup = (groupName, HTTPMethod, endpointString) => {
        axios.delete('/removeGroup', {name: groupName, HTTPMethod, endpointString}).then((res) =>{
            console.log(res)
            // this.setState({loading:false, groups: {...this.state.groups, ...response.data } });
        }).catch((err) =>{
            this.setState({loading:false, error: err.response.data.data})
            toast.error(this.state.error, {position: 'top-center', draggable: false})
        })
    }



    render() {
        return (
           <div>
                 <ToastContainer/>
            <Grid style={{marginLeft:'2px', marginTop:'2px'}} columns={3} divided>
            <Grid.Column width={2}>
              <Sidebar fetchTemplateFromApp={this.props.fetchTemplateFromApp} addGroup={this.addGroup} addEndpoint={this.props.addHTTPEndpoint}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Dashboard  addEndpoint={this.props.addEndpoint} editEndpoint={this.editEndpoint} removeEndpoint={this.removeEndpoint} endpoints={this.props.jsonData.groups}/>
            </Grid.Column>
            <Grid.Column >
            <ServerLogs/>
          </Grid.Column>
          </Grid>
         
           </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        jsonData: state.sideBar.jsonData
    }
}

function mapDispatchToProps(dispatch){
    return ({
        fetchTemplateFromApp: () => {dispatch(fetchTemplateFromApp())},
        addEndpoint: (HTTPEndpointDetails) => {dispatch(addHTTPEndpoint(HTTPEndpointDetails))}
    })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (LayoutContainer)