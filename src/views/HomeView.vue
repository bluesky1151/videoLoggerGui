<template>
    <div class="topView">
        <p>現在未認証のため、機能を使用することができません</p>
        <p>パスワード: <input type="password" v-model="password" @keydown.Enter="auth" /><button @click="auth">認証</button></p>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const token = computed(() => {
            return store.getters["Api/token"];
        })
        const password = ref('');
        const load = async () => {
            if(token.value) router.push('u');
        };
        load();

        const auth = async () => {
            if(password.value == "") {
                alert('パスワードを入力してください');
                return;
            }
            await store.dispatch('Api/Login', {url: "auth", data: {password: password.value, username: "hoge"}});
            // alert(resp);
            router.push('/u');
        }

        return {
            password,
            auth
        }
    }
}

</script>
<style scoped>
.topView {
    width: 100%; height: 100%;
    text-align: center;
}
</style>