<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--bg">
      <div class="page-login--container">
        <div class="page-login--content1">
          <img class="login--logo"  src="@/assets/img/login-logo.png" alt="logo" />
          <p class="login-welcome">Welcome!</p>
          <p class="login-msg">Starting a new journey.</p>
        </div>
        <div class="page-login--content2">
          <div class="page-login--box">
            <div v-if="login_type === 4">
              <div class="login-title">Login to your account</div>
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                class="account-ruleForm"
              >
                <el-form-item style="margin-bottom:10px" label="Account" prop="userAcc" class="login-form-item">
                  <el-input class="account" v-model="ruleForm.userAcc"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:10px" label="Password" prop="password" class="login-form-item">
                  <el-input
                    @keyup.enter.native="submit"
                    type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-button class="login-btn" type="primary" round @click="submit">Login</el-button>
              </el-form>
            </div>
            <div v-show="login_type === 1 || login_type === 2" class="wx-login-box">
              <div class="wx-login">
                <div class="wx-login--mark">使用微信扫码登录</div>
                <div id="login_container" class="login_container" ></div>
                <div class="reload_login_container" v-if="login_type === 2" @click="setWxLogin">
                  <div class="reload">
                    <i class="el-icon-refresh-right reload_icon"></i>
                    <p>点击刷新二维码</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="login_type === 3" class="bind-login-box">
              <div class="bind-login">
                <div class="bind-login--mark">绑定账户</div>
                <!-- <el-avatar :size="80" :src="userData.headimgurl"></el-avatar> -->
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="bindForm"
                  label-width="60px"
                  class="account-ruleForm"
                  label-position="left"
                >
                  <el-form-item label="Account" label-position="left" prop="userAcc" class="login-form-item">
                    <el-input class="account" v-model="ruleForm.userAcc"></el-input>
                  </el-form-item>
                  <el-form-item label="Password" label-position="left" prop="password" class="login-form-item">
                    <el-input
                      type="password"
                      v-model="ruleForm.password"
                      autocomplete="off"
                      @keyup.enter.native="submit"
                    ></el-input>
                  </el-form-item>
                  <el-button class="login-btn" type="primary" round  @click="bindWx">绑  定</el-button>
                </el-form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { URL } from '@/plugin/axios/index.js'
import { mapActions, mapMutations, mapState } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import api from '@/api/login.js'
import { menuAside, menuHeader } from '@/menu/index'
import util from '@/libs/util'

let _t
export default {
  mixins: [
    localeMixin
  ],
  data () {
    _t = this
    return {
      // 快速选择用户
      dialogVisible: false,
      ruleForm: {
        userAcc: '',
        password: ''
      },
      verificationVisible: true,
      imgVisible: true,
      rules: {
        userAcc: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      // 用户信息
      userData: {},
      // 轮询计时器
      timer: null,
      // 登录页状态判断 1：扫码页；2：二维码过期；3：微信绑定账号；4：账号密码登陆；
      login_type: 4,
      imgMessage: '',
      imgSrc: ''
    }
  },
  mounted () {
    console.log(this.$apiUrl, window.a)
    if (window.a) {
      clearInterval(window.a)
    }
    if (localStorage.getItem('AccInfo')) {
      const data = JSON.parse(localStorage.getItem('AccInfo'))
      this.ruleForm.userAcc = data.account
      this.ruleForm.password = data.password
    }
  },
  computed: {
    ...mapState('d2admin/page', [
      'opened'
    ])
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    ...mapActions('d2admin/page', [
      'opened2db'
    ]),
    ...mapActions('d2admin/account', [
      'roleFilter'
    ]),
    ...mapActions('d2admin/account', [
      'loginWx'
    ]),
    ...mapActions('d2admin/user', [
      'set'
    ]),
    ...mapMutations('d2admin/page', [
      'keepAliveRemove'
    ]),
    /**
     * @description 提交表单
     */

    GetQueryString (name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    // 提交登录信息
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const INFO = JSON.stringify({
            account: this.ruleForm.userAcc,
            password: this.ruleForm.password
          })
          localStorage.setItem('AccInfo', INFO)
          this.$loading()
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            userAcc: this.ruleForm.userAcc,
            password: this.ruleForm.password,
            // machineCode: this.GetQueryString('mac') || '',
            machineName: this.GetQueryString('hostname') || '',
            machineOs: this.GetQueryString('platform') || ''
          })
            .then((res) => {
              console.log('登陆返回', res)
              if (res.show) {
                this.$message.error(res.message)
              }
              if (res.code === 200 && res.Fnc === 'setWxLogin') {
                this.getWxCode(res.qrKey)
              }
              if (res.code === 200 && res.data.token) {
                this.loginSuccess(res)
                // this.$router.push('/index')
              }
              if (res.code === 30007) {
                this.$prompt('请输入授权码', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  if (value) {
                    const dataCode = {
                      userAcc: this.ruleForm.userAcc,
                      password: this.ruleForm.password,
                      // machineCode: this.GetQueryString('mac') || '',
                      authCode: value,
                      machineName: this.GetQueryString('hostname') || '',
                      machineOs: this.GetQueryString('platform') || ''
                    }
                    console.log(dataCode)
                    api.login(dataCode).then((res) => {
                      if (res.code === 30008) {
                        this.$message.error('授权码已失效')
                      } else if (res.code === 200) {
                        this.loginSuccess(res)
                      }
                    })
                  }
                })
              }
              this.$loading().close()
              // 重定向对象不存在则返回顶层路径
              // this.$router.replace(this.$route.query.redirect || '/')
            }).catch(err => {
              this.$message.error(err.message)
              this.$loading().close()
            })
        }
      })
    },
    /**
     * @description: 获取微信二维码
     * @param {*}
     * @return {*}
     */
    getWxCode (qrKey) {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
      const wxElement = document.body.appendChild(s)
      wxElement.onload = function () {
        _t.setWxLogin(qrKey)
      }
    },
    /**
     * @description: 二维码登录
     * @param {*}
     * @return {*}
     */
    setWxLogin (qrKey) {
      this.login_type = 1
      console.log(qrKey)
      let appId = ''
      if (this.$apiUrl == 'https://www.pageguo.com/api-test/') {
        appId = 'wx013e04d7c463d886' // 测试
      } else {
        appId = 'wx3682b2f437cca126' // 线上
      }
      const wxData = {
        qrKey: qrKey,
        // machineCode: this.getQueryString('mac') || '',
        authCode: '',
        machineName: this.getQueryString('hostname') || '',
        machineOs: this.getQueryString('platform') || ''
      }
      const wxObj = new WxLogin({
        self_redirect: true,
        id: 'login_container', // 需要显示的容器id
        appid: appId, // 公众号appid wx*******
        scope: 'snsapi_login', // 网页默认即可
        redirect_uri: decodeURIComponent(
          URL + 'open-api/wxAccessCallbackV2?qrKey=' + qrKey
        ),
        style: 'black', // 提供"black"、"white"可选。二维码的样式
        href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIyMHB4O30NCi5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9DQouaW1wb3dlckJveCAuc3RhdHVzIHtkaXNwbGF5OiBub25lO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDoyNjBweDt9'
      })
      this.$message.success('请使用绑定的微信扫描二维码！！')
      const a = 0
      this.timer = setInterval(() => {
        api.loginWx(wxData).then(res => {
          this.userData = res.data
          console.log('loginWx', res)
          if (res.code == '200' && !res.data) {
            // 未扫码登陆成功，持续轮询

          } else if (res.code == '200' && (res.data && res.data.token)) {
            clearInterval(this.timer)
            _t.clearWxLogin()
            let roleInfo = ''
            const arr = []
            res.data.roleInfo && res.data.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
            roleInfo = [...new Set(arr)].join(',')
            this.roleFilter(roleInfo)
            _t.loginSuccess(res)
          } else if (res.code == '30007' || res.code == '30008') {
            _t.clearWxLogin()
            _t.login_type = 1
            this.$message.warning(res.message)
            this.$prompt('请输入授权码', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              if (value) {
                wxData.authCode = value
                api.loginWx(wxData).then(r => {
                  let roleInfo = ''
                  const arr = []
                  res.data.roleInfo && res.data.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
                  roleInfo = [...new Set(arr)].join(',')
                  this.roleFilter(roleInfo)
                  _t.loginSuccess(res)
                })
              }
            }).catch(() => {})
          } else if (res.code == '20001') {
            _t.clearWxLogin()
            this.$confirm('二维码已失效！！', '提示', {
              confirmButtonText: '刷新',
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning'
            }).then(() => {
              location.reload()
            }).catch(() => {
              location.reload()
            })
          }
        }).catch(err => {
          console.log(err)
          _t.$message.error(err.message)
          _t.clearWxLogin()
        })
        // a++
        // if (a === 10) {
        //   console.log('此微信扫码已失效，请重新二维码')
        //   _t.clearWxLogin()
        //   _t.login_type = 2
        // }
      }, 1000)
    },
    /**
     * @description: 清空定时器
     * @param {*}
     * @return {*}
     */
    clearWxLogin () {
      clearInterval(this.timer)
      this.timer = null
    },
    /**
     * @description: 获取url参数
     * @param {*} name
     * @return {*}
     */
    getQueryString (name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    /**
     * @description: 生成随机码
     * @param {*}
     * @return {*}
     */
    guid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    tabLogin () {},
    /**
     * @description: 微信绑定账号
     * @param {*}
     * @return {*}
     */
    bindWx () {
      this.$refs.bindForm.validate((valid) => {
        if (valid) {
          const params = {
            unionId: this.userData.unionid,
            userAcc: this.ruleForm.userAcc,
            password: this.ruleForm.password,
            // machineCode: this.getQueryString('mac') || '',
            authCode: '',
            machineName: this.getQueryString('hostname') || '',
            machineOs: this.getQueryString('platform') || ''
          }
          api.bindWx(params).then(res => {
            console.log(res)
            if (res.code === '200') {
              console.log('bind success')
              this.$message.success(`账号 ${this.ruleForm.userAcc} 绑定成功`)
            } else if (res.code === '30007' || res.code === '30008') {
              this.$message.warning(res.message)
              this.$prompt('请输入授权码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(({ value }) => {
                if (value) {
                  params.authCode = value
                  api.bindWx(params).then(r => {
                    console.log(r)
                    this.$router.replace(this.$route.query.redirect || '/')
                  })
                }
              }).catch(() => {})
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          // 登录表单校验失败
          // this.$message.error('校验失败，请检查')
        }
      })
    },
    loginSuccess (res) {
      console.log(321321321312312)
      sessionStorage.clear()
      const allDic = {}
      util.sessions.set('allDic', allDic)
      this.$store.commit('role/token', res.data.token)
      this.$store.commit('role/userInfo', res.data.userInfo)
      let roleInfo = ''
      const arr = []
      res.data.roleInfo && res.data.roleInfo.forEach(v => { arr.push(v.roleInfo.split(',')) })
      roleInfo = [...new Set(arr)].join(',')
      const menuAsideNew = JSON.parse(JSON.stringify(menuAside))
      const arrNew1 = []
      const arrNew2 = []
      menuAsideNew.forEach((v, index) => {
        if (roleInfo.includes(v.role)) {
          arrNew1.push(v)
        }
      })
      arrNew1.filter((v) => {
        if (v.children && v.children.length > 0) {
          for (let i = 0; i < v.children.length; i++) {
            if (!roleInfo.includes(v.children[i].role)) {
              v.children.splice(i, 1)
            }
          }
        }
      })
      const menuHeaderNew = JSON.parse(JSON.stringify(menuHeader))
      menuHeaderNew.forEach((v, index) => {
        console.log(index)
        if (roleInfo.includes(v.role)) {
          arrNew2.push(v)
        }
      })
      arrNew2.filter((v) => {
        if (v.children && v.children.length > 0) {
          for (let i = 0; i < v.children.length; i++) {
            if (!roleInfo.includes(v.children[i].role)) {
              v.children.splice(i, 1)
            }
          }
        }
      })
      console.log(this.opened, 2222)
      for (let i = this.opened.length - 1; i >= 0; i--) {
        if (this.opened[i].name === 'index') {
          continue
        }
        this.keepAliveRemove(this.opened[i].name)
        this.opened.splice(i, 1)
      }
      // 持久化
      this.opened2db()
      // 关闭所有的标签页后需要判断一次现在是不是在首页
      this.$store.commit('role/roleInfo', roleInfo)
      util.sessions.set('times', 'first')
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  .login_title {
    font-size: 26px;
    padding: 50px 30px 20px;
  }
}
.wx-login-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.wx-login {
  width: 370px;
  height: 474px;
  background-color: #fff;
  box-shadow: 0px 10px 20px 0px rgba(165, 181, 196, 0.1);
  text-align: center;
  border-radius: 10px;
}
.login_login {
  font-size: 24px;
  margin-bottom: 40px;
  color: #363b3e;
}
.page-login {
  font-family: PingFangSC-Regular, PingFang SC;
  $backgroundColor: #F0F2F5;
  $themeColor:#FF725E;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  .page-login--bg{
    background:$themeColor;
  }
  // 登陆层
  .page-login--container{
    position: relative;
    width:900px;
    height:600px;
    background: #FFF;
    border-radius: 10px;
    z-index: 2;
    overflow: hidden;
  }
  // 区间1
  .page-login--content1{
    width: 50%;
    height:100%;
    float: left;
    position: relative;
    background: url("~@/assets/img/login-bgimg.png") ;
    background-size: cover;
    color:#FFF;
    .login--logo {
      width: 200px;
      position: absolute;
      left: 28.8%;
      top: 120px;
    }
    .login-welcome {
      height: 33px;
      line-height: 33px;
      position: absolute;
      left: 28.8%;
      top: 240px;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }

    .login-msg {
      height: 28px;
      line-height: 28px;
      position: absolute;
      left: 28.8%;
      top: 300px;
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  // 区间2
  .page-login--content2{
    width: 50%;
    height:100%;
    font-weight: 400;
    position: relative;
    float: left;
    .page-login--box{
      width:100%;
      height:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .wx-login{
      .wx-login--mark{
        margin-top:110px;
        font-size:18px;
        font-weight: 800;
      }
      .login_container{
        padding-top:30px;
      }
      .reload_login_container{
        position:absolute;
        top: 396px;
        left: 50%;
        transform: translate(-50%,0%);
        width: 240px;
        background-color:#FFF;
        .reload{
          width: 240px;
          height: 240px;
          background:rgba(0,0,0,0.7);
        }
        .reload_icon{
          margin-top:70px;
          font-size:40px;
          color: $themeColor;
        }
        p{
          color:$themeColor
        }
      }
    }
    .bind-login{
      .bind-login--mark{
        font-size:18px;
        font-weight: 800;
        margin-bottom:30px;
      }
      .account-ruleForm{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        text-align: left;
      }
    }
    .login-title {
        font-size: 24px;
        font-weight: 600;
        height: 40px;
        line-height: 40px;
      }

      .login-form-item {
        width: 100%;

        label {
          font-size: 16px;
          line-height: 16px;
          opacity: .5;
          color: #000;
          width: 200px !important;
          float: none;
        }
        ::v-deep .el-form-item__label:before{content: ""!important;}

        ::v-deep .el-form-item__content {
          margin: 0 !important;

          input {
            background-color: rgba(0,0,0,0) !important;
            border-radius: 8px;
            color: #000;
            padding-left: 10px;
            font-size: 16px;
            line-height: 36px;
            height: 36px
          }
          input:focus{
            border: 1px solid $themeColor;
          }
        }
      }

      .login-btn:hover {
        background-color: rgb(250, 92, 71);
      }
      .login-btn {
        background-color: $themeColor;
        color: #FFF;
        border: 1px solid $themeColor;
        border-radius: 8px;
        width: 360px;
        height: 40px;
        padding: 0;
        margin-top: 36px;
        // transition: background-color 0.5s ease-in-out 0s;
      }
  }
  // 区间3
  .page-login--content3{
    width: 50%;
    height: 100%;
  }
  .v-code{
    position: absolute;
    right: 0;
    top: 40px;
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: bisque;
      animation: animate 25s linear infinite;
      bottom: -200px;
      z-index: 1;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 100px;
        height: 100px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
