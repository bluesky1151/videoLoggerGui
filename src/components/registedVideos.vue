<template>
    <div class="videosArea">
        <div class="sorting">
            <p>ソートタイプ: <select v-model="sortType" @change="load">
                <option value="0">登録順</option>
                <option value="1">優先度順</option>
                <option value="2">再生順</option>
            </select></p>
            <p>ソート順: <select v-model="sort" @change="load">
                <option value="0">昇順</option>
                <option value="1">降順</option>
            </select></p>
        </div>
        <template v-if="viewList.length">
            <pageNation v-model="current" :maxPage="maxPage"></pageNation>
            <table class="normal w100 fix">
                <tr>
                    <th>サムネイル</th>
                    <th>タイトル</th>
                    <th>優先度</th>
                    <th></th>
                </tr>
                <tr v-for="v in viewList" :key="v">
                    <td class="thumb"><a :href="v.url" :title="v.title" target="_blank"><img :src="v.images" /></a></td>
                    <td class="text"><a :href="v.url" :title="v.title" target="_blank">{{ v.title }}</a></td>
                    <td>
                        {{ v.priority }}
                        <hr />
                        {{ formatDate(v.lastPlayed) }}
                    </td>
                    <td><button class="w100" @click="deleteVideo(v.url)">解除</button></td>
                </tr>
            </table>
        </template>
        <template v-else>
            <p>登録されている動画がありません</p>
        </template>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import pageNation from './items/pageNation.vue';
import { formatDate } from "@/utils/utils";

export default {
    setup() {
        const store = useStore();

        const sort = ref();
        const sortType = ref();

        const videos = ref([]);
        const current = ref(null);

        const viewCount = 5;

        const maxPage = computed(() => {
            return Math.ceil(videos.value.length / viewCount);
        })

        const viewList = computed(() => {
            let end = current.value * viewCount;
            let start = end - viewCount;
            if(end < current.value) changeCurrent(end);
            if(current.value < 1 || !current.value) changeCurrent(1);
            return videos.value.slice(start, end)
        })

        const changeCurrent = (num) => {
            current.value = num;
        }

        const load = async () => {
            if(!sort.value) sort.value = store.getters["Common/sort"];
            else await store.dispatch('Common/sort', sort.value);
            if(!sortType.value) sortType.value = store.getters["Common/sortType"]
            else await store.dispatch('Common/sortType', sortType.value);
            videos.value = await store.dispatch('Api/callApi', {url: "videos/videolists", data: {
                sortType: sortType.value,
                sort: sort.value
            }})
            
            current.value = store.getters["Common/currentPage"];
        }
        load();

        const deleteVideo = async (url) => {
            if(confirm("削除するともとには戻せません。よろしいですか？")) {
                await store.dispatch('Api/callApi', {url: "videos/deleteVideo", data: {url}});
                load();
            }
        }

        watch(current, async (n, o) => {
            if(o == null) return;

            await store.dispatch('Common/setCurrentPage', n);
        })

        return {
            sortType,
            sort,
            load,
            maxPage,
            current,
            viewList,
            deleteVideo,
            formatDate
        }
    },
    components: {pageNation}
}
</script>

<style scoped>
.thumb img{
    width: 100%;
}
.text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

}
</style>