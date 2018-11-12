import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Table } from 'semantic-ui-react';

import LinkNav from './LinkNav';
import LinksTable from './LinksTable';

export const LinksView = ({tags, links}) => {

    return (
        <Fragment>
            <LinkNav/>
            <LinksTable.Component/>
        </Fragment>
    );
}


export default LinksView;