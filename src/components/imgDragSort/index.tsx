import {
    defineComponent,
    ref,
    onMounted,
    onUpdated,
    watch,
} from 'vue'
import './index.less';



export default defineComponent({
    props: {
        /**图片列表
         * @imgUrl 图片链接
         * @customImg 自定义图片
         */
        initImgList: {
            type: Array<{ [name: String]: any, imgUrl?: String, customImg?: JSX.Element | Comment, imgKey?: Number | String }>,
            default: [],
        },
        /**图片间距 */
        imgDistance: {
            type: Number,
            default: 0,
        },
        /**图片宽高 */
        imgWidth: {
            type: Number,
            default: 0,
        },
        imgHeigth: {
            type: Number,
            default: 0,
        },
        /**自定义图片 */
        isCustomImg: {
            type: Boolean,
            default: false,
        },
        vacancyStyle: {
            type: Object,
            default: {
                backgroundColor: "#4169E1",
                opacity: "0.2",
            }
        },
        onChange: {
            type: Function,
            default: null
        },
        isGetSortImgs: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const waitingSortImgList = ref(props.initImgList)
        const dragSortBox = ref<HTMLElement | undefined>(undefined)
        /**点击的图片下标 */
        const currImgIndex = ref(-1)
        /**图片纵坐标 */
        const currImgTop = ref(0)
        /**图片横坐标 */
        const currImgLeft = ref(0)
        const currMoveImgIndex = ref(-1)
        /**容器纵坐标 */
        let divOffSetTop = 0
        /**容器横坐标 */
        let divOffSetLeft = 0
        /** 点击后图片的最初坐标 */
        let imgChildrenLeft = '0'
        let imgChildrenTop = '0'
        /**每行图片最大个数 */
        let rowImgNum = 0
        /**动画延迟时间 */
        let transitionTime = ref(0)
        /**鼠标松开后不执行 */
        let isClick = false
        /**准备移动 */
        let prepareMove = false
        let prepareMoveThread: number | null = null
        /**是否正在排序中 */
        let isSorting = false

        onMounted(() => {
            /**计算一行几个图片 */
            rowImgNum = Math.floor((dragSortBox.value?.clientWidth || 0) / (props.imgWidth + props.imgDistance))
        })

        watch(
            () => [props.initImgList, props.isGetSortImgs],
            ([nextInitImgList, nextIsGetSortImgs], [beforeInitImgList, beforeIsGetSortImgs]) => {
                if (nextInitImgList.valueOf.length !== beforeInitImgList.valueOf.length) {
                    waitingSortImgList.value = nextInitImgList as Array<{ [name: string]: string }>
                }
                if (!beforeIsGetSortImgs && nextIsGetSortImgs) {
                    if (props.onChange) {
                        props.onChange(onChange(waitingSortImgList.value))
                    }
                }
            }
        )

        /**监听鼠标移动 */
        const onMousemoveImg = (e: any) => {
            if (currImgIndex.value !== -1) {
                setOnMousemoverImgPostion(e)
            }
        }
        const grabImg = (e: any, num: number) => {
            isClick = true
            divOffSetTop = dragSortBox?.value?.offsetTop || 0
            divOffSetLeft = dragSortBox?.value?.offsetLeft || 0
            /**鼠标按下的位置 */
            const imgX = e.pageX - divOffSetLeft
            const imgY = e.pageY - divOffSetTop
            /**鼠标点击的图片当前的位置 */
            imgChildrenLeft = String(imgX / (props.imgWidth + props.imgDistance)).split(".")[1]
            imgChildrenTop = String(imgY / (props.imgHeigth + props.imgDistance)).split(".")[1]
            const element: HTMLElement[] = e.path
            const eFloor = element.length
            for (let i = 0; i < eFloor; i++) {
                if (typeof element[i].className == 'string' && element[i].className?.indexOf('imgBox')) {
                    setOnMousemoverImgPostion(e)
                    break
                }
            }
            prepareMoveThread = setTimeout(() => {
                if (!prepareMove) {
                    prepareMove = true
                }
            }, 150);
            currImgIndex.value = num
        }

        /**鼠标松开 */
        const putDownImg = (e: Event, num: number) => {
            /**停止点击 */
            isClick = false
            /**停止移动 */
            prepareMove = false

            if (prepareMoveThread) {
                clearTimeout(prepareMoveThread)
                prepareMoveThread = null
            }

            if (!isSorting) {
                /**正在排序中 */
                isSorting = true
            } else {
                return
            }
            transitionTime.value = 0.3
            /**要替换的图片下标 */
            const replaceImgIndex = currMoveImgIndex.value
            const soonSortImgList = waitingSortImgList.value
            let nextTestImgList: { [name: string]: any }[] = []
            if (currImgIndex.value > replaceImgIndex) {
                const imgList1 = soonSortImgList.slice(0, replaceImgIndex)
                const imgList2 = soonSortImgList.slice(replaceImgIndex + 1, currImgIndex.value)
                const imgList3 = soonSortImgList.slice(currImgIndex.value + 1, soonSortImgList.length)
                nextTestImgList = imgList1.concat(soonSortImgList[currImgIndex.value]).concat(soonSortImgList[replaceImgIndex]).concat(imgList2).concat(imgList3)
            } else if (currImgIndex.value < replaceImgIndex) {
                const imgList1 = soonSortImgList.slice(0, currImgIndex.value)
                const imgList2 = soonSortImgList.slice(currImgIndex.value + 1, replaceImgIndex - 1)
                const imgList3 = soonSortImgList.slice(replaceImgIndex, soonSortImgList.length)
                nextTestImgList = imgList1.concat(imgList2).concat(soonSortImgList[replaceImgIndex - 1]).concat(soonSortImgList[currImgIndex.value]).concat(imgList3)
            }
            /**鼠标移动到第几行 */
            let moveLine = Math.floor(replaceImgIndex / rowImgNum)
            /**鼠标移动到第几列 */
            let moveColumn = (replaceImgIndex - (moveLine) * rowImgNum)

            if (currImgIndex.value > replaceImgIndex) {
                moveColumn += 1
            } else {
                if (!moveColumn) {
                    moveColumn = rowImgNum
                    moveLine -= 1
                }
            }
            if (currImgIndex.value === replaceImgIndex) {
                if (currImgIndex.value % rowImgNum === 0) {
                    moveLine += 1
                    moveColumn -= 2
                } else {
                    moveColumn += 1
                }

            }

            currImgTop.value = moveLine * (props.imgHeigth + props.imgDistance)
            currImgLeft.value = (moveColumn - 1) * (props.imgWidth + props.imgDistance)

            setTimeout(() => {
                currMoveImgIndex.value = -1
                if (replaceImgIndex !== currImgIndex.value && nextTestImgList.length) {
                    waitingSortImgList.value = nextTestImgList
                }
                transitionTime.value = 0
                currImgIndex.value = -1
                if (props.onChange && props.isGetSortImgs) {
                    props.onChange(onChange(nextTestImgList))
                }
            }, 300);

        }

        const onChange = (nextTestImgList: Array<any>) => {
            const initImgList = props.initImgList
            const initImgListLength = initImgList.length
            const sortImgList = nextTestImgList.map((item, index) => {
                for (let i = 0; i < initImgListLength; i++) {
                    if (item.imgKey === initImgList[i].imgKey) {
                        return initImgList[i]
                    }
                }
            })
            return sortImgList
        }

        onUpdated(() => {
            isSorting = false
        })


        /**拖拽移动 */
        const setOnMousemoverImgPostion = (e: any) => {
            if (!isClick) return
            const imgX = e.pageX - divOffSetLeft
            const imgY = e.pageY - divOffSetTop
            /**拖拽的位置 */
            const x = imgX - Number(`0.${imgChildrenLeft}`) * (props.imgWidth + props.imgDistance) + 5
            const y = imgY - Number(`0.${imgChildrenTop}`) * (props.imgHeigth + props.imgDistance) + 5
            /**修改图片坐标 */
            currImgTop.value = y
            currImgLeft.value = x
            /**其他腾出空间 */
            const currImgColumn = Math.round(x / ((props.imgWidth + props.imgDistance) + props.imgDistance))
            const currImgRow = Math.round(y / ((props.imgHeigth + props.imgDistance) + props.imgDistance))
            /**当前行所有图片的总数 */
            const currRowAllImgTotal = rowImgNum * currImgRow
            /**需要腾出空间的图片下标 */
            if (prepareMove && currImgIndex.value - (currRowAllImgTotal) < currImgColumn) {
                currMoveImgIndex.value = rowImgNum * currImgRow + currImgColumn + 1

            } else {
                currMoveImgIndex.value = rowImgNum * currImgRow + currImgColumn
            }
        }
        const CustomImgCom = (propsCom: any) => {
            return (propsCom.content ? propsCom.content() : null)
        }

        return () => {
            const imgNum = waitingSortImgList.value.length
            return (
                <div class="imgDragSort-root" onMousemove={onMousemoveImg} ref={dragSortBox}>
                    {
                        waitingSortImgList.value.map((item, index) => {
                            let triggerSty: any = {
                                transition: '0.3s',
                            }
                            const vacancy = currMoveImgIndex.value === index
                            if (currImgIndex.value === index) {
                                triggerSty = {
                                    position: 'absolute',
                                    top: `${currImgTop.value}px`,
                                    left: `${currImgLeft.value}px`,
                                    transition: `${transitionTime.value}s`,
                                    zIndex: 1,
                                }
                            }
                            return (
                                <>
                                    <div key={index + 'copy'} style={{
                                        width: vacancy ? `${props.imgWidth}px` : "0px",
                                        height: `${props.imgHeigth}px`,
                                        marginLeft: vacancy ? `${props.imgDistance}px` : "0px",
                                        marginTop: `${props.imgDistance}px`,
                                    }}>
                                        <div
                                            style={{
                                                width: vacancy ? `${props.imgWidth}px` : "0px",
                                                height: `${props.imgHeigth}px`,
                                                transition: prepareMove && vacancy ? "0.5s" : '0s',
                                                backgroundColor: props.vacancyStyle.backgroundColor,
                                                opacity: props.vacancyStyle.opacity
                                            }}

                                        />
                                    </div>

                                    <div
                                        class="sort-img-box"
                                        key={index}
                                        onMousedown={(e) => grabImg(e, index)}
                                        onMouseup={(e) => putDownImg(e, index)}
                                        style={{
                                            width: `${props.imgWidth}px`,
                                            height: `${props.imgHeigth}px`,
                                            marginLeft: `${props.imgDistance}px`,
                                            marginTop: `${props.imgDistance}px`,
                                            ...triggerSty,
                                        }}
                                    >
                                        {
                                            props.isCustomImg ?
                                                <CustomImgCom content={item.customImg || null}></CustomImgCom>
                                                :
                                                <img class="content-img" src={item.imgUrl as string} />
                                        }
                                    </div>
                                    {
                                        index + 1 === imgNum &&
                                        <div key={index + 1 + 'copy'} style={{
                                            width: currMoveImgIndex.value === index + 1 ? `${props.imgWidth}px` : "0px",
                                            height: `${props.imgHeigth}px`,
                                            marginLeft: currMoveImgIndex.value === index + 1 ? `${props.imgDistance}px` : "0px",
                                            marginTop: `${props.imgDistance}px`,
                                        }}>
                                            <div
                                                style={{
                                                    width: currMoveImgIndex.value === index + 1 ? `${props.imgWidth - props.imgDistance}px` : "0px",
                                                    height: `${props.imgHeigth}px`,
                                                    transition: prepareMove && currMoveImgIndex.value === index + 1 ? "0.5s" : '0s',
                                                    backgroundColor: props.vacancyStyle.backgroundColor,
                                                    opacity: props.vacancyStyle.opacity
                                                }}

                                            />
                                        </div>
                                    }
                                </>
                            )
                        })
                    }
                </div>
            )
        }
    }
})