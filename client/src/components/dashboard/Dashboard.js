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
import QueryList from '../../graphql/Query'
import { Query } from 'react-apollo'
import axios from 'axios'
import * as handler from '../../store/database/HomeScreenHandler';

class Dashboard extends React.Component {
    state = {
        showSidebar: true,
        project: false,
        team: false,
        invite: false,
        selected: 'all',
        page: 1,
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

    getQuery = () => {
        const { selected } = this.state
        if (selected === 'all')
            return QueryList.GET_MY_RELATED_PROJECTS
        if (selected === 'create')
            return QueryList.GET_MY_OWNED_PROJECTS
        if (selected === 'share')
            return QueryList.GET_MY_SHARED_PROJECTS

        return QueryList.EMPTY_QUERY
    }

    getProjects = (data) => {
        const { selected } = this.state
        if (selected === 'all')
            return {
                projects: data.user.projectsRelated,
                amount: data.user.projectsRelatedAmount
            }
        if (selected === 'create')
            return {
                projects: data.user.projectsOwned,
                amount: data.user.projectsOwnedAmount
            }
        if (selected === 'share')
            return {
                projects: data.user.projectsShared,
                amount: data.user.projectsSharedAmount
            }
        return null
    }

    handlePagination = (e, value) => {
        this.setState({ page: value })
    }


    componentDidMount() {
        axios.get('/auth/current').then(res => {
            if (!res.data)
                this.props.history.push('/');
            else {
                this.setState({ user: res.data });
                this.props.handleLoginSuccess(res.data);
            }
        })
    }

    render() {
        const { showSidebar, selected, user, page } = this.state;
        const { history } = this.props;
        const left = showSidebar ? 19 : 0;
        const width = showSidebar ? 81 : 100;
        if (!user) return 'loading'
        const query = this.getQuery();
        const displayStyle = {
            marginLeft: left + "%",
            width: width + "%",
        }

        const pageSkip = (page - 1) * 6

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

                <div className="dashboard-display" style={displayStyle}>
                    <Query query={query} variables={{ userId: user._id, pageSkip: pageSkip }}>
                        {({ loading, error, data }) => {
                            if (loading) return 'loading'
                            if (error) return 'error'
                            if (query === QueryList.EMPTY_QUERY)
                                return 'Wrong Sidebar Selection or needs to be developped'
                            if (!data) return 'error'

                            const { projects, amount } = this.getProjects(data)
                            const pageAmount = amount % 6 === 0 ? amount / 6 : Math.floor(amount / 6) + 1
                            return (
                                <>
                                    <Searchbar />
                                    <ItemList
                                        history={this.props.history}
                                        handleOpen={this.handleDialogsOpen}
                                        handleClose={this.handleDialogsClose}
                                        selected={selected}
                                        projects={projects}
                                        query={query}
                                        userId={user._id}
                                        pageSkip={pageSkip}

                                    />
                                    <Pagination
                                        className="dashboard-pagination center"
                                        size="large"
                                        color="secondary"
                                        count={pageAmount}
                                        handlePagination={this.handlePagination}
                                        defaultPage={page}
                                    />
                                </>
                            )
                        }}
                    </Query>
                </div>

                <ProjectDialog project={this.state.project} handleClose={this.handleDialogsClose} />
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
    const { user } = state.auth
    return { history, user };
};

const mapDispatchToProps = (dispatch) => ({
    handleLoginSuccess: (user) => dispatch(handler.loginSuccessHandler(user)),
    handleLoginError: (errmsg) => dispatch(handler.loginErrorHandler(errmsg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

