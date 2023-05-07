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
            <p>動画: {{ videoCount }}件登録中</p>
        </div>
        <div class="sorting">
            <p>タイトル検索: <input v-model="videoTitle" @change="searchTitle" /></p>
            <p>サイト検索: <select v-model="site" @change="searchTitle">
                <option value="">すべて</option>
                <!-- <option value="-1">未分類</option> -->
                <option v-for="sl in siteLists" :key="sl" :value="sl.value">{{ sl.description }}</option>
            </select></p>
            <p>タグ検索: <select v-model="tag" @change="putTags">
                <option v-for="(t, index) in tags" :key="index" :value="index" :hidden="selectedTags[index] != undefined">{{ t }}</option>
            </select></p>
        </div>
        <div class="sorting tags">
            <span class="tag" v-for="(t, index) of selectedTags" :key="index">{{ t }}&nbsp;<span class="deleteBtn" @click="delTag(index)">×</span></span>
        </div>
        <pageNation v-model="current" :maxPage="maxPage"></pageNation>
        <template v-if="viewList.length">
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
                    <td>
                        <button class="w100" @click="registTag = v">タグ登録</button>
                        <button class="w100" @click="deleteVideo(v.url)">解除</button>
                    </td>
                </tr>
            </table>
        </template>
        <template v-else>
            <p>登録されている動画がありません</p>
        </template>
    </div>
    <registTagModal v-if="registTag" :video="registTag" @close="registTag = null"></registTagModal>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import pageNation from './items/pageNation.vue';
import { formatDate } from "@/utils/utils";
import registTagModal from "./items/registTagModal.vue"

export default {
    setup() {
        const store = useStore();

        const sort = ref();
        const sortType = ref();

        const videoTitle = ref("");
        const siteLists = ref([]);
        const site = ref("");
        const tags = ref([]);
        const tag = ref("");
        const registTag = ref();

        const selectedTags = ref({});

        const videoCount = ref();

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

        const getValues = () => {
            selectedTags.value = store.getters["Common/tags"];
            site.value = store.getters["Common/site"];
            videoTitle.value = store.getters["Common/title"];
        }
        getValues();

        const searchTitle = async () => {
            // console.log('searchTitle');
            await store.dispatch('Common/setTags', selectedTags.value);
            await store.dispatch('Common/setSite', site.value)
            await store.dispatch('Common/setTitle', videoTitle.value)
            load();
        }

        const load = async () => {
            if(!sort.value) sort.value = store.getters["Common/sort"];
            else await store.dispatch('Common/sort', sort.value);
            if(!sortType.value) sortType.value = store.getters["Common/sortType"]
            else await store.dispatch('Common/sortType', sortType.value);

            let tags = [];

            for(let st in selectedTags.value) {
                tags.push(st);
            }

            let videoInfo = await store.dispatch('Api/callApi', {url: "videos/videolists", data: {
                sortType: sortType.value,
                sort: sort.value,
                title: videoTitle.value,
                site: site.value,
                tags
            }})

            videos.value = videoInfo.video;
            videoCount.value = videoInfo.count;
            
            current.value = store.getters["Common/currentPage"];
        }
        load();

        const getSiteLists = async () => {
            siteLists.value = await store.dispatch('Api/callApi', {url: "videos/getSiteLists"});
            tags.value = await store.dispatch('Api/callApi', {url: "videos/getTags"});
        }
        getSiteLists();

        const putTags = () => {
            // console.log(selectedTags.value);
            selectedTags.value[tag.value] = tags.value[tag.value];
            tag.value = "";
            searchTitle()
        }

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

        const delTag = (name) => {
            delete selectedTags.value[name];
            searchTitle()
        }
        return {
            sortType,
            sort,
            load,
            maxPage,
            current,
            viewList,
            deleteVideo,
            formatDate,
            videoCount,
            videoTitle,
            siteLists,
            site,
            tags,
            tag,
            putTags,
            selectedTags,
            delTag,
            registTag,
            searchTitle
        }
    },
    components: {pageNation,registTagModal}
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

.sorting{
    display: flex;
    flex-wrap: wrap;
}

.sorting.tags {
    width: calc(100% - 20px);
    padding: 10px;
    background-color: black;
}
.deleteBtn{
    cursor: pointer;
}
.tag{
    /* border: 1px solid ; */
    background-color: gray;
    padding: 0.3em;
    border-radius: 1.6em;
    display: inline-block;
}
</style>