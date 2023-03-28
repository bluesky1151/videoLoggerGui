import createPersitstedState from 'vuex-persistedstate';
const state = ()=> ({
    menuId: 1,
    sortType: "1",
    sort: "1"
});
const mutations = {
    setMenuId(state, num) {
        state.menuId = num;
    },
    sortType(state, num) {
        state.sortType = num;
    },
    sort(state, num) {
        state.sort = num;
    }
};
const actions = {
    setMenuId(context, num) {
        context.commit('setMenuId', num);
    },
    sortType(context, num) {
        context.commit('sortType', num);
    },
    sort(context, num) {
        context.commit('sort', num);
    }
};
const getters = {
    menuId: state => { return state.menuId },
    sort: state => { return state.sort },
    sortType: state => { return state.sortType }
};

export default{
    namespaced: true,
    state: state(),
    mutations,
    actions,
    getters,
    plugins: [createPersitstedState({
        strage: window.localStorage
    })]
}