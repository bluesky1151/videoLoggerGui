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
                <td><button class="tableBtn" @click="regist(v.url)">登録</button></td>
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
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';


export default {
    setup() {
        const store = useStore();
        const videos = ref([]);
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
        }
        load();

        const reset = async () => {
            if(confirm("履歴をリセットしますか？")){
                await store.dispatch('Api/callApi', {url: "videos/resetCurrent"});
                load();
            }
        }
        const regist = async (url) => {
            await store.dispatch('Api/callApi', {url: "videos/registCurrent", data: {url}});
            load();
        }

        return {
            reset,
            videos,
            list,
            regist
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
</style>