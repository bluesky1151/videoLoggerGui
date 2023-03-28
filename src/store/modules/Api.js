import axios from 'axios';
import createPersitstedState from 'vuex-persistedstate';
const targetURL = (process.env.NODE_ENV == 'development') ? 'http://localhost:3007/' : "https://asogi.f5.si:3007/";
// const targetURL = "http://localhost:3007/";
const state = ()=> ({
    token: null
});
const mutations = {
    setToken(state, token){
        state.token = token
    }
};
const actions = {
    async callApi(context, obj){
        // let token = context.commit('Common/addLoadingContent', null, {root: true});
        const data = (obj.data) ? obj.data : undefined;
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: targetURL + obj.url,
                data,
                headers: {
                    'Authorization': `bearer ${context.state.token}`
                }
            }).then(data => {
                resolve(data.data);
            }).catch(e => {
                console.error(e);
                if(e.response.status == 401){
                    context.commit('setToken', null);
                    alert('セッションが切れました。\n再度ログインをしてください。')
                    // context.commit('Common/showModal', {text: 'セッションが切れました。\n再度ログインをしてください。', move: true}, {root: true});
                }else if(e.response.data){
                    //console.log(e.response.statusText);
                    alert(e.response.data.error || e.response.statusText);
                    // context.commit('Common/showModal', {text: e.response.data.error || e.response.statusText, move: false}, {root: true});
                }
                reject(e);
            }).finally(() => {
                // context.dispatch('Common/removeLoadingContent', token,  {root: true});
            })
        });
    },
    async Login(context, obj){
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: targetURL + obj.url,
                data: obj.data
            }).then(data => {
                context.commit("setToken", data.data.token);
                resolve(data.data);
            }).catch(e => {
                // console.log(e.response);
                if(e.response.status == 401){
                    // context.dispatch('Common/showModal', {text: "認証に失敗しました", move: true},  {root: true});
                    alert('認証に失敗しました');

                }else{
                    alert(e.response.data.error || e.response.statusText);
                    // context.dispatch('Common/showModal', {text: e.response.data.error || e.response.statusText, move: true},  {root: true});
                }
                
                reject(e);
            })
            .finally(() => {
                // context.dispatch('Common/removeLoadingContent', token,  {root: true});
            })
        })
    },
    logout(context){
        context.commit('setToken', null);
    },
};
const getters = {
    token: state => { return state.token }
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