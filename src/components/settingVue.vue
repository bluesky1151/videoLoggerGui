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
        </table>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';


export default {
    setup() {
        const store = useStore();
        const serverVersion = ref();

        const load = async () => {
            serverVersion.value = await store.dispatch('Api/callApi', {url: "videos/getVersion"});
        }
        load();

        const restart = async () => {
            await store.dispatch('Api/callApi', {url: "videos/restart"});
        };

        return {
            restart,
            serverVersion
        }
    }
}
</script>

<style scoped></style>