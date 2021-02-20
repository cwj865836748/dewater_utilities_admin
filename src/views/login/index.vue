<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          排水管理进小区
        </h3>
<!--        <lang-select class="set-language"/>-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="email"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

<!--      <el-button type="text" class="fr" @click="handleForgotPassword">-->
<!--        {{ $t('login.forgotPassword') }}-->
<!--      </el-button>-->

    </el-form>

    <el-dialog :title="$t('login.retrievePassword')" :visible.sync="showDialog" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="16" :offset="1">
            <el-form-item :label="$t('common.email')" prop="email">
              <!--<el-input :placeholder="$t('common.pleaseEnter')" v-model="temp.email" clearable/>-->
              <el-input v-model="temp.email" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('common.captcha')" prop="code">
              <el-input v-model="temp.code" :placeholder="$t('common.pleaseEnter')" clearable>
                <el-button v-if="isSend" slot="append" type="danger" @click="sendEmailCode">{{ $t('common.get') }}{{
                  $t('common.captcha') }}
                </el-button>
                <el-button v-else slot="append" type="danger">{{ time }}s</el-button>
              </el-input>
            </el-form-item>

            <el-form-item :label="$t('login.newPassword')" prop="password">
              <el-input v-model="temp.password" :placeholder="$t('common.pleaseEnter')" clearable show-password/>
            </el-form-item>
            <el-form-item :label="$t('login.reNewPassword')" prop="rePassword">
              <el-input v-model="temp.rePassword" :placeholder="$t('common.pleaseEnter')" clearable show-password/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="resetPassword">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import LangSelect from '@/components/LangSelect'
  import {validateRequire, validEmail} from '@/utils/validate'
  import {Admin} from '../../api'

  export default {
    name: 'Login',
    components: {LangSelect},
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.toString().length < 6 || value.toString().length > 18) {
          callback(new Error(rule.text))
        } else {
          callback()
        }
      }

      const validateRePass = (rule, value, callback) => {
        if (value !== this.temp.password) {
          callback(new Error(rule.text))
        } else {
          callback()
        }
      }

      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error(this.$t('login.tip1')))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('login.username')}],
          password: [{required: true, trigger: 'blur', validator: validatePassword, text: this.$t('login.password')}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        redirect: undefined,
        otherQuery: {},
        showDialog: false,
        temp: {
          email: '',
          code: '',
          password: '',
          rePassword: ''
        },
        rules: {
          email: [
            {required: true, trigger: 'blur', validator: validateRequire, text: this.$t('common.email')},
            {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
          ],
          code: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('common.captcha')}],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('login.newPassword')
          },
            {pattern: /^[a-zA-Z0-9_-]{6,18}$/, message: this.$t('common.pwdTntensityTip')}],
          rePassword: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('login.reNewPassword')
          }, {
            trigger: 'blur',
            validator: validateRePass,
            text: this.$t('login.tip2')
          }]

        },
        time: 60,
        isSend: true
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    },
    created() {
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
    },
    methods: {
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      resetTemp() {
        this.temp = {
          email: '',
          code: '',
          password: '',
          rePassword: ''
        }
      },
      handleForgotPassword() {
        this.resetTemp()
        this.time = 60
        this.isSend = true
        this.showDialog = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      sendEmailCode() {
        if (validEmail(this.temp.email)) {
          Admin.sendEmailCode({email: this.temp.email}).then((res) => {
            this.isSend = false

            const interval = window.setInterval(() => {
              if ((this.time--) <= 0) {
                this.time = 60
                this.isSend = true
                window.clearInterval(interval) // 停止
              }
            }, 1000)

            this.$message({
              message: res.msg || this.$t('common.success'),
              type: 'success'
            })
          })
        } else {
          this.$message({
            message: this.$t('login.tip4'),
            type: 'error'
          })
        }
      },
      resetPassword() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Admin.resetPassword(this.temp).then((res) => {
              this.showDialog = false
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            })
          }
        })
      }

    }
  }
</script>

<style lang="scss" type="text/scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #BCC9D0;

  $cursor: #fff;

  /* reset element-ui css */
  .login-container {
    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
      .login-container .el-input input {
        color: $cursor;
      }
    }
    .login-form {
      .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 15px;
          color: $light_gray;
          height: 47px;
          caret-color: $cursor;

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
          }
        }
      }

      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }
    }

  }
</style>

<style lang="scss" scoped type="text/scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    //background-color: $bg;
    background: url("~@/assets/images/login_bg.jpg") no-repeat center center;
    background-size: cover;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }

  .el-button--primary {
    background: #004FBF;
    border-color: #004FBF;
  }

  .el-button--text {
    color: $light_gray;
  }
</style>
