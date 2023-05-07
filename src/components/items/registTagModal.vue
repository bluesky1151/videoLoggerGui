<template>
    <Teleport to="body" v-if="video">
        <div class="bg-modal" @click="close"></div>
        <div class="modalContent">
            <div class="thumbnail" :title="video.title">
                <img :src="video.images" />
            </div>
            <div class="title" :title="video.title">
                {{ video.title }}
            </div>
            <p class="tags">タグを追加する: <select v-model="tag" @change="putTags">
                <option v-for="(t, index) in tags" :key="index" :value="index" :hidden="selectedTags[index] != undefined">{{ t }}</option>
            </select></p>
            <div class="selectedTags">
                <span class="tag" v-for="(t, index) of selectedTags" :key="index">{{ t }}&nbsp;<span class="deleteBtn" @click="delTag(index)">×</span></span>
            </div>
        </div>
    </Teleport>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';


export default {
    props: {
        video: Object
    },
    setup(props, context) {
        const store = useStore();
        const tags = ref({});
        const tag = ref("");
        const selectedTags = ref({});
        const load = async () => {
            tags.value = await store.dispatch('Api/callApi', {url: "videos/getTags"});
            selectedTags.value = await store.dispatch('Api/callApi', {url: "videos/getVideosTags", data: {url: props.video.url}});
        }

        load();

        const registPost = async () => {
            await store.dispatch('Api/callApi', {url: "videos/setTags", data: {tags: selectedTags.value, url: props.video.url}});
        }

        const putTags = () => {
            selectedTags.value[tag.value] = tags.value[tag.value];
            // console.log(selectedTags.value);
            tag.value = "";
            registPost();
        }

        const delTag = (name) => {
            delete selectedTags.value[name];
            registPost();
        }

        const close = () => {
            context.emit('close');
        }

        return {
            tag,
            tags,
            selectedTags,
            putTags,
            delTag,
            close
        }
    }
}
</script>

<style scoped>
.thumbnail{
    width: 100%;
}
.thumbnail img{
    width: 100%;
    cursor: pointer;
}
.title{
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
    display: inline-block;
}
</style>