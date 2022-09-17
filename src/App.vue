<script setup lang="tsx">
import { ref } from "vue"
import ImgDragSort from "./components/imgDragSort/index"
// import ImgDragSort from "../public/lib/img-drag-sort.es.js"
import imgs from "./static/index"
import { LazyloadImg } from 'vue3-lazyload-img';
const getImg = ref(false)

/**如果vue文件中需要这样写，记得第一行设置为 lang="tsx", 如果在tsx文件中使用，则可不需要这样做*/
function CustomLazyloadImg(url: string): void {
  this.url = url
  this.component = (): JSX.Element => {
    return (
      <LazyloadImg src={this.url} />
    )
  }
}

const onChange = (list: Array<any>) => {
  console.log(list)
}

const getSortImgs = () => {
  const next = getImg.value
  getImg.value = !getImg.value
}

</script>

<template>
  <div class="root">
    <button v-on:click="getSortImgs()">
      获取排序后的内容{{getImg}}
    </button>
    <div style="padding-top: 500px;width: 730px;height: 800px;">
      <ImgDragSort :img-width="230" :img-heigth="230" :img-distance="10" :is-custom-img="true" :vacancy-style="{
        backgroundColor:'#4169E1',
        opacity:'0.2'
      }" :init-img-list="imgs.map((item,index)=>{
              return {
                key:index,
                /**如果不需要自定义图片内容，可直接通过,imgUrl传入图片链接即可(切记 is-custom-img 设置为false)*/
                customImg:new CustomLazyloadImg(item).component,
                // imgUrl:item,
              }
      })" :on-change="onChange" :is-get-sort-imgs="getImg" />
    </div>
  </div>
</template>

<style scoped>
.root {
  width: 750px;
  height: 800px;
  margin-top: 800px;
}
</style>
