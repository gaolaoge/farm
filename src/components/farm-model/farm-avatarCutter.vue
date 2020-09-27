<template>
  <section class="c-avatar-cutter farm-dialog" @dragstart="false">
    <!--弹窗主体-->
    <div class="container g-popup-box">
      <p class="title">
        <span>{{ title }}</span>
        <img src="@/icons/shutDialogIcon.png" alt="" class="shutImg" @click="onCancel">
      </p>
      <div class="content">
        <!--左侧-->
        <div class="c-left" :class="{'c-left--doing':imgURL}">
          <div class="container-box" :style="{
            width:`${containerBoxData.width}px`,
            height:`${containerBoxData.height}px`,
            }">
            <img ref="$img" :src="imgURL"/>
            <div class="img-mask"/>
            <div class="select-box"
                 v-if="imgURL"
                 @mousedown="onMouseDown($event, 'move')"
                 :style="{
                  top:`${selectData.top}px`,
                  left:`${selectData.left}px`,
                  width:`${selectData.width}px`,
                  height:`${selectData.width}px`,
                  backgroundImage:`url(${imgURL})`,
                  backgroundPosition:`${-selectData.left}px ${-selectData.top}px`,
                  backgroundSize:`${containerBoxData.width}px ${containerBoxData.height}px`,
                }">
              <ul class="x-line">
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'top')"/>
                <li/>
                <li/>
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'bottom')"/>
              </ul>
              <ul class="y-line">
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'left')"/>
                <li/>
                <li/>
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'right')"/>
              </ul>
              <ul class="point">
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'top-left')"/>
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'top-right')"/>
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'bottom-left')"/>
                <li @mousedown.stop="onMouseDown($event, 'stretch', 'bottom-right')"/>
              </ul>
              <div class="cross"/>
            </div>
          </div>
          <p class="downloadAgain" @click="fileImage">
            <span>{{ downloadAgain }}</span>
          </p>
        </div>
        <!--右侧-->
        <div class="c-right">
          <div class="preview">
            <canvas ref="$canvas" width="190" height="190" :class="{'canvas--doing':imgURL}">></canvas>
          </div>
          <div class="dir">{{ avatarPreviewText }}</div>
        </div>
      </div>
      <!--按钮-->
      <div class="c-btn-group">
        <div class="farm-btn cancel" @click="onCancel"><span>取消</span></div>
        <div class="farm-btn save" @click="onEnter"><span>确定</span></div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'avatarCutter',
    props: {
      returnType: {
        type: String,
        default: 'url'
      }
    },
    data() {
      return {
        title: '上传头像',
        avatarPreviewText: '头像预览',
        downloadAgain: '重新上传',
        imgURL: '',
        scaleRate: 1, // 图片缩放比
        minWidth: 20, // 选择框最小宽度
        containerBoxData: {
          width: 0,
          height: 0,
        },
        selectData: {
          top: 0,
          left: 0,
          width: 0,
          action: '', // 当前进行的操作
          originPoint: {}, // 点击时所在位置
          selectLine: '', // 选择那一条边进行拉伸，为空则不是在拉伸
        },
      }
    },
    created() {
      // 全局监听松开事件，放在在内容选择框外松开
      document.addEventListener('mouseup', this.onMouseUp)
      document.addEventListener('mousemove', this.onMouseMove)
    },
    beforeDestroy() {
      document.removeEventListener('mouseup', this.onMouseUp)
      document.removeEventListener('mousemove', this.onMouseMove)
    },
    methods: {
      // 获取图片宽高
      getImgSize(url) {
        return new Promise((resolve) => {
          let $img = document.createElement('img')
          $img.src = url
          $img.style.opacity = 0
          $img.addEventListener('error', () => {
            document.body.removeChild($img)
            resolve(false)
          })
          $img.addEventListener('load', () => {
            const data = {
              width: $img.naturalWidth,
              height: $img.naturalHeight,
            }
            document.body.removeChild($img)
            resolve(data)
          })
          document.body.appendChild($img)
        })
      },

      // 从base64转化为file文件
      base64ToFile(base64Str, fileName) {
        const params = base64Str.split(',')
        const mime = params[0].match(/:(.*?)/)[1]
        const fileData = atob(params[1]) // 解码Base64
        let {length} = fileData
        const uint8Array = new Uint8Array(length)
        while (length) {
          length -= 1
          uint8Array[length] = fileData.charCodeAt(length)
        }
        return new File([uint8Array], fileName, {type: mime})
      },

      // 获取驼峰写法
      getCamelCase(text) {
        return text.replace(/-[a-z]+?/g, matchStr => matchStr[1].toUpperCase())
      },

      // 获取首单词大写
      getWord(text) {
        return text[0].toUpperCase() + text.substr(1)
      },

      // 鼠标点击
      onMouseDown(event, action, direction) {
        const {selectData} = this
        selectData.action = action
        selectData.direction = direction || ''
        selectData.originPoint = {
          x: event.clientX > 0 ? event.clientX : 0,
          y: event.clientY > 0 ? event.clientY : 0,
        }
      },

      // 鼠标松开
      onMouseUp() {
        const {selectData} = this
        selectData.action = ''
        selectData.direction = ''
      },

      // 鼠标移动
      onMouseMove(event) {
        const {selectData, containerBoxData} = this
        const {x, y} = selectData.originPoint
        const moveX = event.clientX - x // X轴移动的距离
        const moveY = event.clientY - y // Y轴移动的距离
        if (selectData.action === 'move') { // 移动选择框
          this.doMove(selectData, containerBoxData, moveX, moveY)
        } else if (selectData.action === 'stretch') { // 拉伸选择框
          this.doStretch(selectData, containerBoxData, moveX, moveY)
        } else {
          return
        }

        selectData.originPoint = {
          x: event.clientX > 0 ? event.clientX : 0,
          y: event.clientY > 0 ? event.clientY : 0,
        }

        this.setPreview()
      },

      // 选择框移动
      doMove(selectData, containerBoxData, moveX, moveY) {
        selectData.top += moveY
        selectData.left += moveX
        if (selectData.top < 0) {
          selectData.top = 0
        }
        if (selectData.left < 0) {
          selectData.left = 0
        }
        if (selectData.top + selectData.width > containerBoxData.height) {
          selectData.top = containerBoxData.height - selectData.width
        }
        if (selectData.left + selectData.width > containerBoxData.width) {
          selectData.left = containerBoxData.width - selectData.width
        }
      },

      // 选择框拉伸
      doStretch(selectData, containerBoxData, moveX, moveY) {
        const {minWidth} = this

        // 获取溢出长度
        function getOverflowLength() {
          const overflowLeft = selectData.left < 0 ? -selectData.left : 0
          const overflowTop = selectData.top < 0 ? -selectData.top : 0
          const overflowRight = selectData.left + selectData.width > containerBoxData.width ? selectData.left + selectData.width - containerBoxData.width : 0
          const overflowBottom = selectData.top + selectData.width > containerBoxData.height ? selectData.top + selectData.width - containerBoxData.height : 0
          const overflowWidth = selectData.width < minWidth ? minWidth - selectData.width : 0
          return Math.max(overflowLeft, overflowTop, overflowRight, overflowBottom, overflowWidth)
        }

        // 向左拉伸
        function doStretchLeft(action) {
          let space = moveX
          space = action === 'preDo' ? space : -space
          selectData.top += space / 2
          selectData.left += space
          selectData.width -= space
        }

        function doStretchRight(action) {
          let space = moveX
          space = action === 'preDo' ? space : -space
          selectData.top -= space / 2
          selectData.width += space
        }

        function doStretchTop(action) {
          let space = moveY
          space = action === 'preDo' ? space : -space
          selectData.top += space
          selectData.left += space / 2
          selectData.width -= space
        }

        function doStretchBottom(action) {
          let space = moveY
          space = action === 'preDo' ? space : -space
          selectData.left -= space / 2
          selectData.width += space
        }

        function doStretchTopLeft(action) {
          let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : moveY
          space = action === 'preDo' ? space : -space
          selectData.top += space
          selectData.left += space
          selectData.width -= space
        }

        function doStretchTopRight(action) {
          let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : -moveY
          space = action === 'preDo' ? space : -space
          selectData.top -= space
          selectData.width += space
        }

        function doStretchBottomLeft(action) {
          let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : -moveY
          space = action === 'preDo' ? space : -space
          selectData.left += space
          selectData.width -= space
        }

        function doStretchBottomRight(action) {
          let space = Math.abs(moveX) > Math.abs(moveY) ? moveX : moveY
          space = action === 'preDo' ? space : -space
          selectData.width += space
        }

        const doStretchFun = {
          doStretchLeft,
          doStretchRight,
          doStretchTop,
          doStretchBottom,
          doStretchTopLeft,
          doStretchTopRight,
          doStretchBottomLeft,
          doStretchBottomRight,
        }[`doStretch${this.getWord(this.getCamelCase(selectData.direction))}`]

        doStretchFun('preDo')
        let overflowLength = getOverflowLength()
        if (overflowLength > 0) {
          doStretchFun('reset')
        }
      },

      // 设置预览图
      setPreview() {
        const {selectData, scaleRate} = this
        const $canvas = this.$refs.$canvas.getContext('2d')
        $canvas.clearRect(0, 0, 190, 190)
        $canvas.drawImage(
          this.$refs.$img,
          Math.floor(selectData.left / scaleRate),
          Math.floor(selectData.top / scaleRate),
          selectData.width / scaleRate,
          selectData.width / scaleRate,
          0,
          0,
          190,
          190,
        )
      },
      fileImage() {
        let input = document.createElement('INPUT')
        input.type = 'file'
        input.accept = '.jpg,.jpeg,.png'
        input.addEventListener('change', event => this.fileChange(event))
        input.click()
      },
      // 选择图片
      fileChange(event) {
        const fileObj = event.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
          const {selectData, containerBoxData} = this
          this.imgURL = reader.result
          this.getImgSize(this.imgURL).then((result) => {
            if (result.width > result.height) { // 350为外盒子宽高
              this.scaleRate = 242 / result.width
              containerBoxData.width = 242
              containerBoxData.height = Math.floor(result.height * this.scaleRate)
              selectData.top = 0
              selectData.left = (242 - containerBoxData.height) / 2
              selectData.width = containerBoxData.height
            } else {
              this.scaleRate = 242 / result.height
              containerBoxData.height = 242
              containerBoxData.width = Math.floor(result.width * this.scaleRate)
              selectData.left = 0
              selectData.top = (242 - containerBoxData.width) / 2
              selectData.width = containerBoxData.width
            }
            this.setPreview()
          })
        }
        reader.readAsDataURL(fileObj)
      },

      // 确认
      onEnter() {
        if (this.imgURL) {
          if (this.returnType === 'url') {
            this.$emit('enter', this.$refs.$canvas.toDataURL()) // 返回链接
          } else if (this.returnType === 'file') {
            this.$emit('enter', this.base64ToFile(this.$refs.$canvas.toDataURL(), 'avatar.png')) // 返回文件
          }
        } else {
          this.$message('请上传图片', 'error')
        }
      },

      // 取消
      onCancel() {
        this.$emit('cancel')
      },
    },
  }
</script>

<!--登录页面-->
<style lang="less" scoped>
  li, ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .c-avatar-cutter {
    .container {
      width: 574px;
      height: 507px;
    }

    .content {
      display: flex;
      height: 242px;
    }
  }

  .c-left {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 240px;
    height: 240px;
    margin-left: 59px;
    border: solid 1px #e8e8e8;
    background-repeat: round;
    background-image: url(../../icons/empty.png);

    .container-box {
      position: relative;
    }

    .img-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background-color: white;
    }

    img {
      width: 100%;
      height: 100%
    }

    .select-box {
      position: absolute;
      top: 0;
      left: 0;
      cursor: move;
    }

    .x-line,
    .y-line {
      display: flex;
      justify-content: space-between;
      position: absolute;
      width: 100%;
      height: 100%;

      li {
        position: relative;
        border: dashed 1px rgba(39, 95, 239, 1);
      }

      li:nth-child(1):before,
      li:nth-last-child(1):before {
        position: absolute;
        margin-left: -3px;
        margin-top: -3px;
        width: 6px;
        height: 6px;
        content: '';
        background-color: rgba(39, 95, 239, 1);
      }
    }

    .x-line {
      flex-direction: column;

      li:nth-child(1) {
        cursor: n-resize;

        &:before {
          left: 50%;
        }
      }

      li:nth-last-child(1) {
        cursor: s-resize;

        &:before {
          left: 50%;
        }
      }
    }

    .y-line {
      li:nth-child(1) {
        cursor: w-resize;

        &:before {
          top: 50%;
        }
      }

      li:nth-last-child(1) {
        cursor: e-resize;

        &:before {
          top: 50%;
        }
      }
    }

    .point {
      width: 100%;
      height: 100%;

      li {
        position: absolute;
        margin-left: -3px;
        margin-top: -3px;
        width: 6px;
        height: 6px;
        content: '';
        cursor: crosshair;
        background-color: rgba(39, 95, 239, 1);
      }

      li:nth-child(1) {
        top: 2px;
        left: 1px;
        cursor: nw-resize;
      }

      li:nth-child(2) {
        top: 2px;
        right: -2px;
        cursor: ne-resize;
      }

      li:nth-child(3) {
        bottom: -2px;
        left: 1px;
        cursor: sw-resize;
      }

      li:nth-child(4) {
        bottom: -2px;
        right: -2px;
        cursor: se-resize;
      }
    }

    .cross {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      min-width: unset;
      margin-top: -3px;
      margin-left: -3px;
      background-size: cover;
      background-image: url(../../icons/icon-cancel.png);
    }

    .downloadAgain {
      position: absolute;
      bottom: -31px;
      left: 0px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;

      span {
        color: rgba(22, 29, 37, 1);
      }

      .imgAgain {
        margin-top: 3px;
        float: right;
        width: 14px;
        cursor: pointer;
      }
    }
  }

  .c-left--doing {
    background-image: url(../../icons/empty--pure.png);
  }

  .c-right {
    flex: 1;
    position: relative;
    margin-left: 53px;
    font-size: 16px;
    color: #333333;
    text-align: center;

    .preview {
      width: 120px;

      canvas {
        display: block;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #fff;
        /*background-repeat: round;*/
        /*background-image: url(../../icons/empty.png);*/
      }

      .canvas--doing {
        background-image: url(../../icons/empty--pure.png);
      }
    }

    .dir {
      width: 120px;
      font-size: 14px;
      color: rgba(22, 29, 37, 0.5);
      margin-top: 15px;
    }

    input[type=file] {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 42px;
      opacity: 0;
      background-color: white;
    }
  }

  .c-btn-group {
    position: absolute;
    bottom: 30px;
    right: 30px;
    margin-top: 20px;

  }
</style>
