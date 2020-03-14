import React from 'react';
import { Rnd } from 'react-rnd';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import PropertyList from './PropertyList'

const rect = document.body.getBoundingClientRect();

class PropertyWindow extends React.Component {

    render() {
        const { width, height } = rect;
        return (
            <Rnd
                className="workscreen-window"
                default={{
                    x: 0,
                    y: 0,
                    width: width * 0.2,
                    height: height * 0.7
                }}
            >
                <Collapsible accordion>
                    <CollapsibleItem
                        expanded={false}
                        header="Map Property"
                        icon={<Icon>filter_drama</Icon>}
                        node="div"
                    >
                        <PropertyList />
                    </CollapsibleItem>
                    <CollapsibleItem
                        expanded
                        header="Tileset Property"
                        icon={<Icon>place</Icon>}
                        node="div"
                    >
                        <PropertyList />
                    </CollapsibleItem>

                </Collapsible>
            </Rnd>

        )
    }

}

export default PropertyWindow;
