import React, { Component } from 'react'
import {  Accordion, Icon } from 'semantic-ui-react'
import ApiSection from '../api-section';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { activeSegment: 0, apiSections: [] }
    }

    changeActiveSegment(e, data) {
        let newIndex = data.index === this.state.activeSegment ? -1 : data.index
        this.setState({ activeSegment: newIndex });
    }

    addApi(e) {
        e.stopPropagation();
        this.setState({ showNewAPIModal: true });
    }

    render() {
        return (
            <Accordion fluid styled>
                <Accordion.Title active={this.state.activeSegment === 0} index={0} onClick={this.changeActiveSegment}>
                    <Icon name='dropdown' />
                    General
                </Accordion.Title>
                { <Accordion.Content active={this.state.activeSegment === 0} >
                    
                    {this.state.apiSections.map((api, i) => {
                        return <ApiSection key={i} desc={api.description} httpMethod={api.httpMethod}/>
                    })}
                 
                </Accordion.Content>}  
            </Accordion>
        );
    }
}

export default Dashboard