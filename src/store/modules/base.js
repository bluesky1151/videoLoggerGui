import createPersitstedState from 'vuex-persistedstate';
const state = ()=> ({
});
const mutations = {
};
const actions = {
};
const getters = {
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