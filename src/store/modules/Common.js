import createPersitstedState from 'vuex-persistedstate';
const state = ()=> ({
    menuId: 1,
    sortType: "1",
    sort: "1",
    currentPage: 1,
    tags: {},
    site: "",
    title: ""
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
    },
    setCurrentPage(state, num) {
        state.currentPage = num;
    },
    setTags(state, obj) {
        state.tags = obj
    },
    setSite(state, text) {
        state.site = text;
    },
    setTitle(state, text) {
        state.title = text;
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
    },
    setCurrentPage(context, num) {
        context.commit('setCurrentPage', num);
    },
    setTags(context, obj) {
        context.commit("setTags", obj);
    },
    setSite(context, text) {
        context.commit("setSite", text);
    },
    setTitle(context, text) {
        context.commit("setTitle", text);
    }
};
const getters = {
    menuId: state => { return state.menuId },
    sort: state => { return state.sort },
    sortType: state => { return state.sortType },
    currentPage: state => { return state.currentPage },
    tags: state => { return state.tags },
    site: state => { return state.site },
    title: state => { return state.title }
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