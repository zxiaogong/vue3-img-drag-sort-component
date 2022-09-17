# vue3-img-drag-sort
基于vue3的图片拖拽排序组件

### 效果图
![image](https://raw.githubusercontent.com/zxiaogong/vue3-img-drag-sort-component/master/demonstration.gif)
## 安装


```bash
  npm install vue3-img-drag-sort
  yarn add vue3-img-drag-sort
```
    
## 使用方法/示例

```html
<script setup lang="tsx">
import { ref } from "vue"
// import ImgDragSort from "./components/imgDragSort/index"
import ImgDragSort from "vue3-img-drag-sort"
// 图片列表
import imgs from "./static/index"
import { LazyloadImg } from 'vue3-lazyload-img';
const getImg = ref(false)

/**如果vue文件中需要这样写，记得第一行设置为 lang="tsx", 如果在tsx文件中使用，则可不需要这样做*/
function CustomLazyloadImg(url: string,key:number): void {
  this.url = url
  this.key = key
  this.component = (): JSX.Element => {
    return (
      <LazyloadImg src={this.url}/>
    )
  }
}

const onChange = (list: Array<any>) => {
  console.log(list)
}

const getSortImgs = () => {
  getImg.value = !getImg.value
}

</script>

<template>
  <div class="root">
    <button v-on:click="getSortImgs()">
      获取排序后的内容{{getImg}}
    </button>
    <div style="padding-top: 100px;width: 340px;height: 500px;">
      <ImgDragSort 
      :img-width="100" 
      :img-heigth="100" 
      :img-distance="10" 
      :is-custom-img="true" 
      :vacancy-style="{
        backgroundColor:'#4169E1',
        opacity:'0.2'
      }" 
      :init-img-list="imgs.map((item,index)=>{
              return {
                key:index,
                /**如果不需要自定义图片内容，可直接通过,imgUrl传入图片链接即可(切记 is-custom-img 设置为false)*/
                customImg:new CustomLazyloadImg(item,index).component,
                // imgUrl:item,
              }
      })" 
      :on-change="onChange" 
      :is-get-sort-imgs="getImg" />
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

```


## API 参考

#### 获取所有项目

```
ImgDragSort
```

| 参数 | 类型     | 描述                |
| :-------- | :------- | :------------------------- |
| `init-img-ist` | 请看表 initImgList | **必填**. 需要排序的数组 |
| `img-distance`      | `Number` | **非必填**. 图片间距，默认为0 |
| `img-width`      | `Number` | **必填**. 图片宽 |
| `img-heigth`      | `Number` | **必填**. 图片高 |
| `is-customImg`      | `Boolean` | **非必填**. 是否使用自定义图片组件，需要配合customImg使用（示例以懒加载组件作为自定义图） |
| `vacancy-style`      | 请看表 vacancyStyle | **非必填**. 空位的阴影样式 |
| `on-change`      | `(imgList)=>{}` | **非必填**. 排序后返回的结果，有300毫秒的延迟 |
| `is-get-sort-imgs`      | `Boolean` | **非必填**. 是否获取排序后的结果，默认ture。当由false更改为true时，会调用on-chang函数。（排序可能会耗费性能，如果不是每次修改顺序后都需要获取排序结果，可以使用isGetSortImgs进行控制，可以参考示例） |

#### 注意：如果使用jsx语法，那么上表api必须用驼峰命名法


```
initImgList
```

| 参数 | 类型     | 描述                       |
| :-------- | :------- | :-------------------------------- |
| `imgUrl`      | `String ` | **非必填**. 图片链接，imgUrl、customImg必传其一 |
| `customImg`      | `JSX.Element / Comment` | **非必选**. 自定义的图片组件，imgUrl、customImg必传其一（当传customImg时， isCustomImg必须传true） |
| `imgKey`      | `String / Number` | **必填**. 图片标识，必须唯一 |
| `其他`      |  | **备注**. 可添加其他属性，排序后一并返回 |


```
vacancyStyle
```

| 参数 | 类型     | 描述                       |
| :-------- | :------- | :-------------------------------- |
| `backgroundColor`      | `String` | **非必填**. 空位背景色 |
| `opacity`      | `String` | **非必填**. 背景色透明度 |