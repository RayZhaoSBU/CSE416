import * as actionCreators from '../actions/actionCreators'

const initState = {
    projects: [],
    maps: [],
    tilesets: [],
};

const projectReducer = (state = initState, action) => {
    if (action.type === actionCreators.TEST_PROJECT_ADD) {
        let { projects } = state
        let toAdd = []
        for (let i in projects)
            toAdd.push(projects[i])
        for (let i in action.item)
            toAdd.push(action.item[i])
        return {
            ...state,
            projects: toAdd,
        }
    } else if (action.type === actionCreators.TEST_MAP_ADD) {
        let { maps } = state
        let toAdd = []
        for (let i in maps)
            toAdd.push(maps[i])
        for (let i in action.item)
            toAdd.push(action.item[i])
        return {
            ...state,
            maps: toAdd,
        }
    } else if (action.type === actionCreators.TEST_TILESET_ADD) {
        let { tilesets } = state
        let toAdd = []
        for (let i in tilesets)
            toAdd.push(tilesets[i])
        for (let i in action.item)
            toAdd.push(action.item[i])
        return {
            ...state,
            tilesets: toAdd,
        }
    } else if (action.type === actionCreators.TEST_CLEAR) {
        return {
            ...initState
        }
    }
    return state;
}

export default projectReducer;