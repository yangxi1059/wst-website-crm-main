<!--
 * @Author: 杨曦
 * @Date: 2022-07-19 10:45:58
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-07-20 15:16:38
 * @Version:
 * @Description:
-->
<template>
    <el-dialog :visible.sync="holidayReminderVisible" width="1280px" :append-to-body="true" :before-close="close">
        <div class="yx_block_holidayReminder">
            <pre class="yx_text_holidayReminder">{{eventStr}}</pre>
        </div>
        <div class="yx_block_holidayReminder2 mt10" v-if="calendarId">
            <el-popover
                placement="bottom"
                title="标题"
                width="500"
                height="700"
                trigger="click"
                v-model="emojiShow"
              >
                <el-button slot="reference">😀</el-button>
                <div class="browBox">
                  <ul>
                    <li
                      v-for="(item, index) in faceList"
                      :key="index"
                      @click="getBrow(index)"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
      </el-popover>
      <el-select class="ml10" style="width:80px" size="mini" v-model="ruleForm.isAnonymous" >
        <el-option label="匿名" :value="'1'"></el-option>
        <el-option label="不匿名" :value="'0'"></el-option>
      </el-select>
      <el-button
        class="submit-btn"
        type="primary"
        @click="submit"
        :disabled="ruleForm.messageContent == ''"
        >发送
      </el-button>
      <el-input
        class="mb20"
        maxlength="250"
        :rows="5"
        type="textarea"
        show-word-limit
        placeholder="请输入内容"
        v-model="ruleForm.messageContent"
      >
        </el-input>
            <!-- <div class="yx_displayFlex mb10" >
                <el-button type="text" @click="upMsg" size="medium" icon="el-icon-edit" >写留言/祝福</el-button>
                <el-button type="text" class="" @click="initPage" size="medium" icon="el-icon-refresh" >刷新</el-button>
            </div>
            <div  v-show="detailVisible" class="yx_respect mb10">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="留言内容" prop="messageContent">
                  <el-input style="width:300px" type="textarea" maxlength="250" v-model="ruleForm.messageContent"></el-input>
                </el-form-item>
                <el-form-item label="是否匿名" prop="isAnonymous">
                  <el-select style="width:300px" v-model="ruleForm.isAnonymous" >
                    <el-option label="匿名" :value="'1'"></el-option>
                    <el-option label="不匿名" :value="'0'"></el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <el-button style="margin-left:100px" @click="handleClose">取 消</el-button>
                  <el-button @click="submit">提 交</el-button>
                </div>
              </el-form>
            </div> -->
            <div class="mb10 message_detail" v-for="(item,i) in messageList" :key="i+'gr'">
                <el-avatar class="mr10" :size="24" :src="circleUrl"></el-avatar>
                <div class="message_detail_text">{{item.userName}} ({{item.createTime}}) : {{item.messageContent}}</div>
                <div>
                    <el-button type="text" @click="zan(item)" style="line-height:24px;padding:0px !important" icon="el-icon-thumb" title="点赞" size="meduim">（{{item.thumbsUpCount}}）</el-button>
                    <el-button type="text" @click="toTop(item)" v-if="roleInfo.includes(`home_toTop`) && item.isTop == '0'"  title="置顶"  style="line-height:24px;padding:0px !important" icon="el-icon-upload2" size="meduim"></el-button>
                    <el-button type="text" @click="toDown(item)" v-if="roleInfo.includes(`home_toTop`) && item.isTop == '1'" title="取消置顶"  style="line-height:24px;padding:0px !important" icon="el-icon-download" size="meduim"></el-button>
                    <el-button type="text" @click="deleteMsg(item)" v-if="roleInfo.includes(`home_toDelete`)" style="line-height:24px;padding:0px !important" title="删除" icon="el-icon-delete-solid" size="meduim"></el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api/sales_assistant'
const appData = require('@/assets/img/emojis.json')
export default {
  name: 'holidayReminder',
  props: {
    holidayReminderVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  watch: {
    holidayReminderVisible: function (val) {
      if (val) {
        this.initPage()
      }
    }
  },
  data () {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      messageList: [],
      eventStr: '',
      detailVisible: false,
      content: '',
      emojiShow: false,
      faceList: [],
      getBrowString: '',
      ruleForm: {
        isAnonymous: '0',
        messageContent: ''
      },
      rules: {
        isAnonymous: [{ required: true, message: '必填', trigger: 'blur' }],
        messageContent: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      calendarId: ''
    }
  },
  created () {
    this.loadEmojis()
  },
  methods: {
    close () {
      this.messageList = []
      this.calendarId = ''
      this.eventStr = ''
      this.$emit('close')
    },
    initPage () {
      api.getHomedata().then(res => {
        this.eventStr = ''
        this.calendarId = res.data.calendarId
        this.messageList = res.data.messageList
        res.data && res.data.eventList.forEach(item => {
          this.eventStr += `${item.eventName}
`
        })
      })
    },
    zan (item) {
      api.putThumbsUpCount(item.messageId).then(res => {
        this.$message({ type: 'success', message: '点赞成功' })
        this.initPage()
      })
    },
    loadEmojis () {
      for (const i in appData) {
        this.faceList.push(appData[i].char)
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow (index) {
      for (const i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index]
          this.ruleForm.messageContent += this.getBrowString
        }
      }
      this.emojiShow = false
    },
    toTop (item) {
      const data = {
        messageId: item.messageId,
        isTop: '1'
      }
      api.putUpTop(data).then(res => {
        this.$message({ type: 'success', message: '置顶成功' })
        this.initPage()
      })
    },
    handleClose () {
      this.ruleForm = {
        isAnonymous: '0',
        messageContent: ''
      }
      this.detailVisible = false
    },
    submit () {
      // this.$refs.ruleForm.validate((valid) => {
      //   if (valid) {
      const data = {
        calendarId: this.calendarId,
        isAnonymous: this.ruleForm.isAnonymous,
        messageContent: this.ruleForm.messageContent
      }
      console.log(data)
      api.postMessage(data).then(res => {
        this.$message({ type: 'success', message: '提交成功' })
        this.initPage()
        this.ruleForm = {
          isAnonymous: '0',
          messageContent: ''
        }
        this.detailVisible = false
      })
      //   }
      // })
    },
    toDown (item) {
      const data = {
        messageId: item.messageId,
        isTop: '0'
      }
      api.putUpTop(data).then(res => {
        this.$message({ type: 'success', message: '取消置顶成功' })
        this.initPage()
      })
    },
    deleteMsg (item) {
      api.delMessageList(item.messageId).then(res => {
        this.$message({ type: 'success', message: '删除成功' })
        this.initPage()
      })
    },
    upMsg () {
      this.detailVisible = true
      // this.$prompt('请输入留言', {
      //   confirmButtonText: '实名留言',
      //   cancelButtonText: '匿名留言',
      //   inputType: 'textarea',
      //   beforeClose: (action, instance, done) => { // 取消回车确认事件
      //     if (action === 'confirm') {
      //       instance.$refs.confirm.$el.onclick = (function (e) {
      //         e = e || window.event
      //         if (e.detail !== 0) {
      //           done()
      //         }
      //       }())
      //     } else {
      //       done()
      //     }
      //   }
      // }).then(({ value }) => {
      //   console.log(value)
      //   if (value) {
      //     console.log(value)
      //     this.$message({
      //       type: 'success',
      //       message: '留言成功'
      //     })
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: '留言必填'
      //     })
      //     return false
      //   }
      // }).catch(({ value }) => {
      // 	console.log(value)
      // })
    }
  }
}
</script>
<style  scoped>
  .yx_displayFlex{
    display: flex;
    justify-content: space-between;
  }
    .yx_block_holidayReminder{
        background: url("../../../../../../assets/img/bg.gif");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        margin: 0 auto;
        border-radius: 4px;
        /* border: 1px solid #d7dae2; */
        box-sizing: border-box;
        padding: 20px;
        min-height: 500px;
        height: 500px;
        width: 960px;
        text-align: center;
        position: relative;
    }
    @keyframes stream {
        0%  {
            background-position: 0 0;
        }
        100% {
            background-position: -100% 0;
        }
    }
    .yx_text_holidayReminder{
       overflow: hidden;
        background-image: -webkit-linear-gradient(left,black,yellow,green, blue, red 25%,black 35%,
        blue 50%,yellow 60%, red 75%, green 85%,blue 100%);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        animation: stream 15s infinite linear;
        background-size: 200% 100%;
        font-weight: 900;
        background-color: rgba(255, 255, 255, 0);
        display: block;
        white-space: pre-wrap;
        font-size: 40px;
        position: absolute;
        text-align: center;
        left: 50%;
        width: 100%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .yx_block_holidayReminder2{
        margin: 0 auto;
        width: 960px;
    }
    .message_detail{
        font-size: 14px;
        line-height: 26px;
        display: flex;
    }
    .yx_respect{
      box-sizing: border-box;
      padding: 10px 0;
      border: 1px solid #d7dae2;
      border-radius: 4px;
    }
    .message_detail_text{
        margin-right: 20px;
        flex: 1;
        min-width: 760px;
    }
    .browBox {
      width: 100%;
      height: 200px;
      background: #e6e6e6;
      position: absolute;
      z-index: 100;
      bottom: 0px;
      overflow: scroll;
    }
    .browBox ul {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;

      }
    .browBox ul li {
      cursor: pointer;
      width: 10%;
      font-size: 26px;
      list-style: none;
      text-align: center;
    }
    .submit-btn {
      margin: 0 0px 10px 0;
      float: right;
    }
</style>
