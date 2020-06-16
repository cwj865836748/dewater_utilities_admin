<style scoped type="text/scss" lang="scss">
  .wxchat-container {
    left: 0;
    top: 0;
    overflow: hidden;
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: .2;
  }

  .window {
    min-width: 300px;
    background: #F5F5F5;
    margin: 0;
    overflow: hidden;
    padding: 0;
    height: 400px;
    position: relative;
    border: #E6EBF5 1px solid;
  }

  button {
    border: 0;
    background: none;
    border-radius: 0;
    text-align: center;
  }

  button {
    outline: none;
  }

  .w100 {
    width: 100%;
  }

  .mt5 {
    margin-top: 5px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .fs0 {
    font-size: 0
  }

  .title {
    width: 100%;
    height: 70px;

    line-height: 70px;
    font-size: 14px;
    border-bottom: #E6EBF5 1px solid;
  }

  .title-text {
    margin: 0;
    padding-left: 20px;
    display: inline-block;
  }

  .title-status {
    margin: 0;
    display: inline-block;
    padding-right: 20px;
    float: right;
  }

  .loading, .no-more {
    text-align: center;
    color: #b0b0b0;
    line-height: 100px;
  }

  .no-more {
    line-height: 60px;
  }

  .pull-right {
    float: right;
  }

  .link-line {
    text-decoration: underline;
  }

  .message {
    height: 320px;
    padding: 10px 15px;
    overflow-y: scroll;
    background-color: #F5F5F5;
  }

  .message-ul {
    padding: 0;
    margin: 0;
    overflow: auto;
  }

  .message li {
    margin-bottom: 15px;
    left: 0;
    position: relative;
    display: block;
  }

  .message .time {
    margin: 10px 0;
    text-align: center;
  }

  .message .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: calc(100% - 75px);
    min-height: 35px;
    line-height: 2.1;
    font-size: 15px;
    padding: 6px 10px;
    text-align: left;
    word-break: break-all;
    background-color: #fff;
    color: #000;
    border-radius: 4px;
    box-shadow: 0px 1px 7px -5px #000;
  }

  .message .avatar {
    float: left;
    width: 45px;
    height: 45px;
    margin: 0 10px 0 0;
    border-radius: 3px;
    /*background: #fff;*/
  }

  .message .time > span {
    display: inline-block;
    padding: 0 5px;
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    background-color: #DADADA;
  }

  .message .system > span {
    padding: 4px 9px;
    text-align: left;
  }

  .message .text:before {
    content: " ";
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fff;
  }

  .message .self {
    text-align: right;
  }

  .message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
  }

  .message .self .text {
    background-color: #9EEA6A;
  }

  .message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #9EEA6A;
  }

  .message .image {
    max-width: 200px;
  }

  img.static-emotion-gif, img.static-emotion {
    vertical-align: middle !important;
  }

  .an-move-left {
    left: 0;
    animation: moveLeft .7s ease;
    -webkit-animation: moveLeft .7s ease;
  }

  .an-move-right {
    left: 0;
    animation: moveRight .7s ease;
    -webkit-animation: moveRight .7s ease;
  }

  .bgnone {
    background: none;
  }

  @keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0
    }

    100% {
      left: 0;
      opacity: 1
    }

  }

  @-webkit-keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0
    }

    100% {
      left: 0px;
      opacity: 1
    }

  }

  @keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0
    }

    100% {
      left: 0px;
      opacity: 1
    }

  }

  @-webkit-keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0
    }

    100% {
      left: 0px;
      opacity: 1
    }

  }

  @media (max-width: 367px) {
    .fzDInfo {
      width: 82%;
    }
  }

</style>

<template>
  <div id="window-view-container" class="window">
    <!-- data is empty -->
    <div v-if="dataArray && dataArray.length==0" class="loading">
      <div style="margin-top: 300px;text-align:center; font-size: 16px;">
        <span>{{$t('wxchat.noChat')}}</span>
      </div>
    </div>

    <!-- loading -->
    <div v-if="dataArray.length==0" class="loading">
      <div style="margin-top: 300px;">
        <div>{{$t('wxchat.loading')}}...</div>
      </div>
    </div>

    <div v-if="dataArray && dataArray.length>0" class="title">
      <div v-if="dataArray && dataArray.length>0" class="title-text">
        <p style="margin:0" v-text="contactNickname"/>
      </div>
      <div v-if="dataArray && dataArray.length>0" class="title-status">
        <el-tag :type="contactStatus | solveStatusFilter">
          {{ contactStatus | solveStatusFilter('label') }}
        </el-tag>
      </div>
    </div>
    <!-- main -->
    <ScrollLoader
      v-if="dataArray && dataArray.length>0"
      :min-height="minHeight"
      class="container-main"
      @scroll-to-top="refresh"
      @scroll-to-botton="infinite"
    >
      <div id="chatBox-content-demo" class="message">
        <ul class="message-ul">
          <li
            v-for="(message, index) in dataArray"
            :key="message.id"
            :class="message.direction==2?'an-move-right':'an-move-left'"
          >
            <p class="time"><span v-text="message.createTime"/></p>
            <p v-if="message.contentType==10000" class="time system"><span v-html="message.content"/></p>
            <div v-else :class="'main' + (message.direction==2?' self':'')">
              <img
                class="avatar"
                width="45"
                height="45"
                :src="message.direction==2? ownerAvatarUrl: contactAvatarUrl"
              >
              <!-- 文本 -->
              <div v-if="message.contentType==0" v-emotion="message.content" class="text"/>

              <!-- 图片 -->
              <div v-else-if="message.contentType==1" class="text">
                <img :src="message.content" class="image" :alt="$t('wxchat.chatImg')">
              </div>

              <!-- 音频 -->
              <div v-else-if="message.contentType==3" class="text">
                <audio controls>
                  <source :src="message.content" type="audio/mpeg">
                  Your browser does not support this audio format.
                </audio>
              </div>
              <!-- 其他 -->
              <div
                v-else-if="message.contentType!=10000"
                class="text"
                v-text="'[暂未支持的消息类型:'+ message.contentType +']\n\r' + message.content"
              />
            </div>
          </li>

        </ul>
      </div>

    </ScrollLoader>

  </div>
</template>

<script>
  import ScrollLoader from './scrollLoader.vue'

  export default {
    name: 'WxChat',

    components: {
      ScrollLoader
    },

    props: {
      contactNickname: {
        type: String,
        default: '聊天对话'
      },
      contactStatus: {
        type: Boolean,
        default: true
      },

      data: {
        type: Array,
        required: true
      },

      width: {
        type: Number,
        default: 450
      },

      wrapBg: {
        type: String,
        default: '#efefef'
      },

      contactAvatarUrl: {
        type: String
      },

      ownerAvatarUrl: {
        type: String
      },

      getUpperData: {
        type: Function,
        required: true
      },

      getUnderData: {
        type: Function,
        required: true
      }
    },

    data() {
      return {
        isUpperLaoding: false,
        isUnderLaoding: false,

        isRefreshedAll: false,
        isLoadedAll: false,

        minHeight: 700,
        dataArray: []
      }
    },

    created() {

    },
    mounted() {
      this.initData()
      // document.getElementsByTagName('body')[0].scrollTop=0;
      this.minHeight = document.getElementById('window-view-container').offsetHeight
    },


    methods: {
      initData() {
        this.dataArray = this.dataArray.concat(this.data).reverse()
        this.scrollToBottom()
      },

      // 向上拉刷新
      refresh(done) {
        var me = this
        if (me.isUpperLaoding) {
          return
        }

        if (me.isRefreshedAll) {
          done(true)
          me.isUpperLaoding = false
          return
        }

        try {
          this.getUpperData().then(function (data) {
            if (data.length == 0) {
              me.isRefreshedAll = true
              done(true)
            } else {
              me.dataArray = data.reverse().concat(me.dataArray) // 倒序合并
              done()
            }
          })
        } catch (error) {
          console.error('wxChat: props "getUpperData" must return a promise object!')
        }
        me.isUpperLaoding = false
      },

      scrollToBottom: function () {
        this.$nextTick(() => {
          var container = this.$el.querySelector('#chatBox-content-demo')
          if (container && container.scrollHeight) {
            container.scrollTop = container.scrollHeight
          }
        })
      },

      // 向下拉加载
      infinite(done) {
        var me = this
        if (me.isUnderLaoding) {
          return
        }
        if (me.isLoadedAll) {
          done(true)
          me.isUnderLaoding = false
          return
        }

        try {
          this.getUnderData().then(function (data) {
            if (data == 0) {
              me.isLoadedAll = true
              done(true)
            } else {
              done()
              me.dataArray = me.dataArray.concat(data) // 直接合并
            }
          })
        } catch (error) {
          console.error('wxChat: props "getUnderData" must return a promise object!')
        }
        me.isUnderLaoding = false
      }

    }
  }
</script>
