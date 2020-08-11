import React, { Component } from 'react'
import {  Segment, Button, Label } from 'semantic-ui-react'


class ServerLogs extends Component {

    constructor(props) {
        super(props);
        this.state = { }
    }


    render() {
        return (
            <Segment.Group>
            <Segment>
              <Button
                compact
                size='small'
                floated='right'
              >
                Clear
              </Button>
              Event Log <Label circular>{2}</Label>
            </Segment>
            <Segment secondary>
              <pre>
                
              </pre>
            </Segment>
          </Segment.Group>
        );
    }
}

export default ServerLogs