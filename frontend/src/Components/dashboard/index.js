import React, { Component } from 'react'
import { Modal, Accordion, Icon, Button } from 'semantic-ui-react'
import ApiSection from '../api-section';
import NewAPIModal from '../new-api-modal'
class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { activeSegment: 0, showNewAPIModal: false, apiSections: [] }
        this.changeActiveSegment = this.changeActiveSegment.bind(this);
        this.modalSubmit = this.modalSubmit.bind(this);
        this.addApi = this.addApi.bind(this);
    }

    changeActiveSegment(e, data) {
        let newIndex = data.index === this.state.activeSegment ? -1 : data.index
        console.log(newIndex)
        this.setState({ activeSegment: newIndex });
    }

    addApi(e) {
        e.stopPropagation();
        this.setState({ showNewAPIModal: true });
    }

    modalSubmit(data){
        this.setState({ showNewAPIModal: false });
        this.setState({apiSections: [...this.state.apiSections, data]})
    }

    render() {
        return (
            <Accordion fluid styled>
                <Accordion.Title active={this.state.activeSegment === 0} index={0} onClick={this.changeActiveSegment}>
                    <Icon name='dropdown' />
                    API
                    {this.state.activeSegment === 0 ? <Button onClick={this.addApi} style={{ float: 'right' }}>Add API</Button> : null}
                </Accordion.Title>
                { <Accordion.Content active={this.state.activeSegment === 0} >
                    
                    {this.state.apiSections.map((api, i) => {
                        return <ApiSection key={i} desc={api.description} httpMethod={api.httpMethod}/>
                    })}
                 
                </Accordion.Content>}

                <Modal open={this.state.showNewAPIModal}>
                    <Modal.Content>
                    <NewAPIModal onModalSubmit={this.modalSubmit}/>
                    </Modal.Content>
                </Modal>
            </Accordion>

        );
    }
}

export default Dashboard