<template>
    <div class="videosArea">
        <table class="normal w100">
            <tr>
                <th colspan="2">&nbsp;</th>
            </tr>
            <tr>
                <th>バージョン</th>
                <td style="{text-align: center;}">v{{ serverVersion }}</td>
            </tr>
            <tr>
                <th>再起動</th>
                <td><button class="w100" @click="restart">再起動</button></td>
            </tr>
            <tr>
                <th>動画情報更新</th>
                <th><button class="w100" @click="checkVideo">更新</button></th>
            </tr>
            <tr>
                <th>ログ監査</th>
                <td><select class="w100 textCenter" v-model="logName">
                    <option hidden value="">選択してください</option>
                    <template v-for="(files, key) in logList" :key="key">
                        <option disabled>{{ key }}</option>
                        <option v-for="file in files" :key="file" :value="`${key}/${file}`">{{ file }}</option>
                    </template>
                </select></td>
            </tr>
            <tr>
                <td colspan="2"><textarea class="w100" :style="{backgroundColor: '#181818', color: 'white'}" readonly rows="10" v-model="logContent"></textarea></td>
            </tr>
        </table>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';


export default {
    setup() {
        const store = useStore();
        const serverVersion = ref();
        const logName = ref("");
        const logList = ref({});
        const logContent = ref("");

        watch(logName, (v) => {
            if(!v) return logContent.value = "";

            return store.dispatch('Api/callApi', {url: "videos/logContents", data: {fname: v}}).then(data => {
                // console.log(data);
                logContent.value = data;
            });
        })

        const load = async () => {
            serverVersion.value = await store.dispatch('Api/callApi', {url: "videos/getVersion"});
            logList.value = await store.dispatch('Api/callApi', {url: "videos/logfiles"});
        }
        load();

        const restart = async () => {
            await store.dispatch('Api/callApi', {url: "videos/restart"});
        };

        const checkVideo = async () => {
            logName.value = "video/video.log";
            let resp = await store.dispatch('Api/callApi', {url: "videos/updatevideos"});

            if(resp) alert(resp);

            
            logContent.value = await store.dispatch('Api/callApi', {url: "videos/logContents", data: {fname: logName.value}})
        }

        return {
            restart,
            serverVersion,
            logName,
            logList,
            logContent,
            checkVideo
        }
    }
}
</script>

<style scoped></style>