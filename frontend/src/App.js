import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import 'react-json-pretty/themes/monikai.css';
import Dashboard from './Components/dashboard'
import './App.css';
import Sidebar from './Components/Sidebar';
import { Grid, Segment,Button, Label } from 'semantic-ui-react';
function App() {
  return (
    <Grid columns={3} divided>
        <Grid.Column width={3}>
          <Sidebar style={{float:'left'}}/>
        </Grid.Column>
        <Grid.Column width={8}>
          <Dashboard/>
        </Grid.Column>
        <Grid.Column width={3}>
        <Segment.Group>
          <Segment fluid>
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
      </Grid.Column>
      </Grid>
  );
}

export default App;
