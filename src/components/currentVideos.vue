<template>
    <div class="videosArea">
        <p class="w100"><button class="w100" @click="reset">リセット</button></p>
        <template v-if="videos.length">
        <table class="w100 normal fix">
            <tr>
                <th>サムネイル</th>
                <th>タイトル</th>
                <th></th>
            </tr>
            <tr v-for="v in videos" :key="v">
                <td class="thumb"><a :href="v.url" :title="v.title" target="_blank"><img :src="v.images" /></a></td>
                <td class="title"><a :href="v.url" :title="v.title" target="_blank">{{ v.title }}</a></td>
                <td><button class="tableBtn" @click="regist_(v)">登録</button></td>
            </tr>
        </table>
        </template>
        <template v-else>
            <p>登録されている動画がありません。以下から検索してください。</p>
            <ul>
                <li v-for="(l, index) in list" :key="index">
                    <a target="_blank" :href="l[0]" :title="l[1]">動画サイト{{ index+1 }}</a>
                </li>
            </ul>
        </template>
    </div>

    <template v-if="registModal">
        <Teleport to="body">
            <div class="bg-modal" @click="registModal = null"></div>
            <div class="modalContent">
                <div class="thumbnail" :title="registModal.title">
                    <img :src="registModal.images" />
                </div>
                <div class="titleModal" :title="registModal.title">
                    {{ registModal.title }}
                </div>
                <p class="tags">タグを追加する: <select v-model="tag"  @change="putTags">
                    <option v-for="(t, index) in tags" :key="index" :value="index">{{ t }}</option>
                </select></p>
                <div class="selectedTags">
                    <span class="tag" v-for="(t, index) of selectedTags" :key="index">{{ t }}&nbsp;<span class="deleteBtn" @click="delTag(index)">×</span></span>
                </div>
                <button class="w100" @click="regist(registModal.url)">登録</button>
            </div>
        </Teleport>
    </template>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';


export default {
    setup() {
        const store = useStore();
        const videos = ref([]);
        const tags = ref({});
        const registModal = ref(null);
        const tag = ref("");
        const selectedTags = ref({});
        let list = [
            // ["https://erodaioh.com/", "無修正が見たい"], サービス終了
            ["https://www.xnxx.com/", "XNXX"],
            ["https://nukeruerodouga.com/", "ヌケル動画"],
            ["http://xvideoflash.blog.fc2.com/", "ポルノコム - 無修正まとめ"],
            ["https://jp.musyuusei.club/", "無修正クラブ"],
            ["https://jp.xero.porn/", "Xero Porn"],
            // ["https://channel.heydouga.com/monthly/channel/", "Hey動画(有料)"],
            ["https://jp.spankbang.com/", "spancBang"],
            ["https://shiroino.com/", "シロイノ"],
            ["https://jp.pornhub.com/", "Pornhub"],
            ["https://www.xvideos.com/", "xvideos"]
        ];

        const load = async () => {
            videos.value = await store.dispatch('Api/callApi', {url: "videos/currentVideo"});
            tags.value = await store.dispatch('Api/callApi', {url: "videos/getTags"});
        }
        load();

        const reset = async () => {
            if(confirm("履歴をリセットしますか？")){
                await store.dispatch('Api/callApi', {url: "videos/resetCurrent"});
                load();
            }
        }

        const regist_ = async (v) => {
            selectedTags.value = await store.dispatch('Api/callApi', {url: "videos/getVideosTags", data: {url: v.url}});
            registModal.value = v;
        }

        const putTags = () => {
            selectedTags.value[tag.value] = tags.value[tag.value];
            // console.log(selectedTags.value);
            tag.value = "";
        }

        const delTag = (name) => {
            delete selectedTags.value[name];
        }

        const regist = async (url) => {
            await store.dispatch('Api/callApi', {url: "videos/registCurrent", data: {url, tags: selectedTags.value}});
            registModal.value = null;
            load();
        }

        return {
            reset,
            videos,
            list,
            regist,
            regist_,
            registModal,
            tags,
            tag,
            selectedTags,
            delTag,
            putTags
        }
    }
}
</script>

<style scoped>
.thumb img{
    width: 100%;
}
.title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.thumbnail{
    width: 100%;
}
.thumbnail img{
    width: 100%;
    cursor: pointer;
}
.titleModal{
    width: 100%;
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
}
.selectedTags{
    width: calc(100% - 20px);
    padding: 10px;
    background-color: black;
}

.selectedTags {
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
}
</style>