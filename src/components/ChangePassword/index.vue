<template>
  <el-dialog :title="$t(`login.changePassword`)" :visible.sync="dialogVisible">
    <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
      <el-row :gutter="60">

        <el-col :span="12" :offset="1">
          <el-form-item :label="$t('login.oldPassword')" prop="password">
            <el-input v-model="temp.password" :placeholder="$t('common.pleaseEnter')" clearable show-password />
          </el-form-item>
          <el-form-item :label="$t('login.newPassword')" prop="newPassword">
            <el-input v-model="temp.newPassword" :placeholder="$t('common.pleaseEnter')" clearable show-password />
          </el-form-item>
          <el-form-item :label="$t('login.reNewPassword')" prop="reNewPassword">
            <el-input v-model="temp.reNewPassword" :placeholder="$t('common.pleaseEnter')" clearable show-password />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="handleChangePassword">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Admin } from '@/api'
import { validateRequire } from '@/utils/validate'

export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRePass = (rule, value, callback) => {
      if (value !== this.temp.newPassword) {
        callback(new Error(rule.text))
      } else {
        callback()
      }
    }

    return {
      temp: {
        password: '',
        newPassword: '',
        reNewPassword: ''
      },
      rules: {
        password: [{ required: true, trigger: 'blur', validator: validateRequire, text: this.$t('login.oldPassword') }],
        newPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateRequire,
          text: this.$t('login.newPassword')
        },
        { pattern: /^[a-zA-Z0-9_-]{6,18}$/, message: this.$t('common.pwdTntensityTip') }
        ],
        reNewPassword: [{
          required: true,
          trigger: 'blur',
          validator: validateRequire,
          text: this.$t('login.reNewPassword')
        }, {
          trigger: 'blur',
          validator: validateRePass,
          text: this.$t('login.tip2')
        }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.resetTemp()
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 重置
    resetTemp() {
      this.temp = {
        password: '',
        newPassword: '',
        reNewPassword: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleChangePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          Admin.modifyPwd(this.temp).then((res) => {
            this.$message({
              message: this.$t('login.tip3'),
              type: 'success'
            })
            this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
