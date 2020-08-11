import React, { Component } from 'react'
import {  Accordion, Icon, Divider } from 'semantic-ui-react'
import ApiSection from '../api-section';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { activeIndexs: [], apiSections: [] }
    }

    changeActiveSegment(e, data) {
        let newIndex = data.index === this.state.activeSegment ? -1 : data.index
    }

    addApi(e) {
        e.stopPropagation();
        this.setState({ showNewAPIModal: true });
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

    render() {
        const { endpoints } = this.props;
        const endpointsKeys = Object.keys(endpoints)

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
                        {endpoints[group].map((endpointDetails, i) => {
                            return <ApiSection key={i} endpointDetails={endpointDetails}/>
                        })}
                    </Accordion.Content> 
                </Accordion>

                )
                }))
                : <div>nothing</div>
            }
            </div>
        );
    }
}

export default Dashboard