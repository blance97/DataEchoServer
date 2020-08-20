import React, { Component } from 'react'
import {  Accordion, Icon, Segment, Header, Button, Divider } from 'semantic-ui-react'
import ApiSection from '../api-section';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { activeIndexs: [], endpoints: {} }

        this.onSave = this.onSave.bind(this);
    }

    changeActiveSegment(e, data) {
        let newIndex = data.index === this.state.activeSegment ? -1 : data.index
    }

    addEndpoint(groupName) {
        let addedEndpoint = this.state.endpoints
        addedEndpoint[groupName] = [...addedEndpoint[groupName],{groupName, HTTPMethod: "", description: "", endpoint: "", responseBody: "{}", responseBodyType:"",responseHeaders: []}]
        this.setState({endpoints: addedEndpoint});
        // this.props.addEndpoint(groupName)
    }
    
    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndexs } = this.state;
        const newIndex = activeIndexs;

        const currentIndexPosition = activeIndexs.indexOf(index);
        if (currentIndexPosition > -1) {
        newIndex.splice(currentIndexPosition, 1);
        } else {
        newIndex.push(index);
        }

    this.setState({ activeIndexs: newIndex });
  };

  componentDidUpdate(prevProps){
    if(this.props.endpoints !== prevProps.endpoints){
        this.setState({endpoints: {...this.state.endpoints, ...this.props.endpoints}})
    }
  }

  onSave(data) {
    const {groupName, index} = data;
    let newEndpointDetails = data;
    newEndpointDetails['groupName']
    delete newEndpointDetails['accordionOpen']
    delete newEndpointDetails['index']
    console.log(groupName)
    this.props.editEndpoint(newEndpointDetails);
    // this.props.endpoints[groupName][index] = newEndpointDetails;
    console.log(newEndpointDetails)
  }

    render() { 
        const endpointsKeys = Object.keys(this.state.endpoints)
        return (
            <div>
                {(endpointsKeys.length > 0) 
                ? (endpointsKeys.map((group,i) =>{
                   return  (
                   <Accordion style={{marginBottom:'20px'}} key={i} fluid styled>
                    <Accordion.Title active={this.state.activeIndexs.includes(i)} index={i} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        {group}
                    </Accordion.Title>
                     <Accordion.Content active={this.state.activeIndexs.includes(i)}>
                            <Button primary fluid onClick={() => this.addEndpoint(group)} > <Icon name="add"></Icon>Add HTTP Request</Button>
                            <Divider/>
                        {this.state.endpoints[group].map((endpointDetails, i) => {
                            return <ApiSection key={i} onSave={this.onSave} endpointDetails={{...endpointDetails, groupName: group, index: i} }/>
                        })}
                    </Accordion.Content> 
                </Accordion>)
                }))
                :  <Segment placeholder>
                <Header icon>
                  <Icon name='warning circle' />
                 No groups created. Create one to get started.
                </Header>
              </Segment>}
            </div>
        );
    }
}

export default Dashboard