import React from 'react';
import { TextInput, Button } from 'react-materialize'


class Searchbar extends React.Component {

    render() {
        const left = this.props.open ? 350 : 0;
        const width = this.props.open ? 55 : 100;
        return (
            <div>
                <div className="dashboard-search" style={
                    {
                        marginLeft: left + "px",
                        width: width + "%",
                    }}>
                    <TextInput label="Enter search" />
                </div>
                <Button type="submit" waves='orange' className="dashboard-searchbutton blue">Search</Button>
            </div >

        )
    }

}

export default Searchbar;
