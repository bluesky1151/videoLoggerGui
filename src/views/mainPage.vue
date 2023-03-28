<template>
    <div class="menuTabs">
        <div v-for="m in menuList" :key="m" class="menuTab" :class="{selected: menuId == m.id}" @click="changeMenu(m.id)">
            {{ m.label }}
        </div>
    </div>
    <div class="videoArea">
        <p class="w100"><button class="w100" @click="reAuth">認証解除</button></p>
        <component :is="menuList[menuId].component"></component>
    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import currentVideos from "@/components/currentVideos.vue";
import registedVideos from '@/components/registedVideos.vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const menuList = {
            1: { label: "履歴", id: 1, component: currentVideos },
            2: { label: "登録済", id: 2, component: registedVideos }
        }

        const load = async () => {
            let token = await store.getters['Api/token'];
            if(!token) router.push('/');
        }
        load();

        const changeMenu = async (id) => {
            await store.dispatch('Common/setMenuId', id)
        }

        const menuId = computed(() => {
            return store.getters["Common/menuId"];
        })

        const token = computed(() => {
            return store.getters['Api/token'];
        });
        watch(token, (v) => {
            if(!v) router.push('/');
        })

        const reAuth = async () => {
            if(confirm('認証を解除しますか？')){
                await store.dispatch('Api/logout');
            }
        }

        return {
            menuId,
            menuList,
            changeMenu,
            reAuth
        }
    },
    components: { currentVideos, registedVideos }
}
</script>

<style scoped>
.menuTabs{
    width: calc(100% - 2px); height: 48px;
    display: flex;
    border: 1px solid white;
}
.menuTab {
    width: calc(50% - 0.5px); height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(139, 139, 139);
    font-weight: bold;
    transition: 0.5s;
    cursor: pointer;
}
.menuTab:hover,
.menuTab.selected {
    color: white;
}
.menuTab:first-child {
    border-right: 1px solid white;
}
.videoArea{
    width: calc(100% - 2px); height: calc(100% - 50px - 2px);
    border: 1px solid white;
}
.videosArea{
    width: 100%;
}
</style>