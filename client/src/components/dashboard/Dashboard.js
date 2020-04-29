import React from 'react';
import TopNavbar from '../tools/TopNavbar'
import Searchbar from './Searchbar'
import ItemList from './ItemList'
import './dashboard.css'
import Pagination from '../tools/Pagination'
import { connect } from 'react-redux';
import Sidebar from "./Sidebar";
import Dialogs from './Dialogs'
import ProjectDialog from "./ProjectDialog";

class Dashboard extends React.Component {
    state = {
        showSidebar: true,
        project: false,
        team: false,
        invite: false,
        selected: 'all',
    };

    handleSelectSide = (type) => {
        this.setState({ selected: type })
    }

    handleDialogsOpen = (type) => {
        this.setState({ [type]: true })
    }

    handleDialogsClose = (type) => {
        this.setState({ [type]: false })
    }

    handleSidebarOpen = () => {
        let { showSidebar } = this.state;
        showSidebar = !showSidebar;
        this.setState({ showSidebar: showSidebar });
    };



    render() {
        const { showSidebar, selected } = this.state;
        const { history } = this.props;
        const left = showSidebar ? 19 : 0;
        const width = showSidebar ? 81 : 100;
        return (
            <div>
                <TopNavbar handleSidebarOpen={this.handleSidebarOpen} site='dashboard' history={history} />
                <Sidebar
                    showSidebar={showSidebar}
                    handleOpen={this.handleDialogsOpen}
                    handleClose={this.handleDialogsClose}
                    handleSelect={this.handleSelectSide}
                    selected={selected}
                />
                <div className="dashboard-display" style={
                    {
                        marginLeft: left + "%",
                        width: width + "%",
                    }
                }>
                    <Searchbar />
                    <ItemList
                        history={this.props.history}
                        handleOpen={this.handleDialogsOpen}
                        handleClose={this.handleDialogsClose}
                        selected={selected}
                    />
                    <Pagination className="dashboard-pagination center" size="large" color="secondary" />
                </div>
                <ProjectDialog project={this.state.project} handleClose={this.handleDialogsClose}/>
                <Dialogs
                    {...this.state}
                    handleOpen={this.handleDialogsOpen}
                    handleClose={this.handleDialogsClose}
                />
            </div >
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    const { history } = ownProps;
    return { history };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

