<template>
    <div class="pageNationButtons">
        <div class="pageButtton prevButton" :class="{disabled: modelValue == 1}" @click="up(1)">&lt;&lt;</div>
        <div class="pageButtton prevButton" :class="{disabled: modelValue == 1}" @click="prev">&lt;</div>
        <div class="pageButtton numberButton" :class="{current: modelValue == i}" v-for="i in pageLeng" :key="i" @click="up(i)">{{i}}</div>
        <div class="pageButtton prevButton" :class="{disabled: modelValue == maxPage}" @click="next">&gt;</div>
        <div class="pageButtton prevButton" :class="{disabled: modelValue == maxPage}" @click="up(maxPage)">&gt;&gt;</div>
    </div>
</template>
<script>
import { computed } from '@vue/reactivity';
import { watch } from 'vue';

export default {
    props: {
        maxPage: Number,
        modelValue: Number
    },
    setup(props, context){
        const up = (num)=>{
            if(isNaN(num)) return;
            if(num < 1) num = 1;
            if(props.maxPage < num) num = props.maxPage
            context.emit('update:modelValue', num);
        }
        const current = computed(() => props.modelValue);
        const maxPage = computed(() => props.maxPage);

        watch(maxPage, (v) => {
            // console.log(`${v}: `, current.value, (v < current.value));
            if(v < current.value) context.emit('update:modelValue', v);
        })

        const prev = () => {
            let num = props.modelValue - 1;
            up(num);
        }
        const next = () => {
            let num = props.modelValue + 1;
            up(num);
        }

        const pageLeng = computed(() => {
            let max = props.maxPage;
            let current = props.modelValue;
            let array = null;

            if(15 < max){
                if(5 <= current){
                    array = [];
                    for(let i = 1; i <= 9 && current - 4 + i <= max; i++){
                        let base = current - 5 + i;
                        array.push(base);
                    }
                    array.push(max);
                }else{
                    array = [1, 2, 3, 4, 5, 6, 7, 8, 9, max]
                }
            }
            return array || max;
        })

        return {
            up,
            prev,
            next,
            pageLeng
        };
    }
}
</script>
<style scoped>
.pageNationButtons{
    display: flex;
}
.pageButtton{
    padding: 0.5em 0;
    width: 3em;
    text-align: center;
    margin: 1em 0.1em;
    background-color: white;
    color: black;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
}
.pageButtton.current{
    background: linear-gradient(rgb(116, 116, 214), rgb(78, 78, 218));
    color: white;
}

.pageButtton.disabled{
    background-color: gray;
    cursor: not-allowed;
    /* pointer-events: none; */
}
</style>