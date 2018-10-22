import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Label, Icon, Dimmer, Loader, Segment, Button } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractForm from "../ContractForm";
import ProvContract from '../models/ProvContract';

export const DetailsView = ({selected, contract}) => {    
    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h1" dividing>
                        ProvContract
                        <Dimmer.Dimmable>
                        <Label as="a" tag size="tiny">
                            <Icon name="edit" fitted/>
                            
                            <Label.Detail><Dimmer active={true}>
                                <Loader size="tiny"/>
                            </Dimmer></Label.Detail>
                        </Label>
                        </Dimmer.Dimmable>
                        {/* <Dimmer.Dimmable as={() => <Label as="a" size="tiny"><Icon name="edit" fitted/></Label>} dimmed={true}>
                        
                            
                            <Dimmer active={true}>
                                <Loader size="tiny"/>
                            </Dimmer>
                            </Dimmer.Dimmable> */}
                        {/* <Button size="tiny">
                            <Icon name="edit" fitted/>
                            <Dimmer active={true}>
                                <Loader size="tiny"/>
                            </Dimmer>
                        </Button> */}
                        <Header.Subheader>
                            Contract Address: {selected}
                        </Header.Subheader>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column stretched>
                    <ContractForm.Component imageUrl={contract.details.logoUrl} description={contract.details.description}/>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                    <TagsView.Component 
                        tags={contract.getTags()}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

const selectedContract = (contracts, selected) => {
    if(selected === undefined) {
        return new ProvContract(selected);
    }
    return contracts[selected];
}

//container part
export const mapStateToProps = (state) => {
    let selected = state.contracts.selected[0];

    return {
        selected: selected,
        contract: selectedContract(state.contracts, selected),
    };
}

export default connect(mapStateToProps)(DetailsView);