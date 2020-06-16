<template>
  <div>
    <el-dialog :title="$t(`unit.emailSend`)" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">

        <el-row :gutter="60">
          <el-col :span="22" :offset="1">
            <el-form-item :label="$t('emailSend.title')" prop="title">
              <el-input v-model="temp.title" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('emailSend.recipient')" prop="recipient">

              <el-tag
                :key="tag"
                v-for="tag in temp.recipientList"
                closable
                :disable-transitions="false"
                @close="handleCloseRecipient(tag)">
                {{tag}}
              </el-tag>

              <el-button class="button-new-tag" size="small" @click="addRecipient">
                {{$t('emailSend.addRecipient')}}
              </el-button>
            </el-form-item>

            <el-form-item :label="$t('emailSend.cc')" prop="cc">
              <div>
                <el-button type="primary" class="button-new-tag" size="small" @click="selectCcGroup">
                  {{$t('emailSend.selectCcGroup')}}
                </el-button>
              </div>
              <el-tag
                :key="tag"
                v-for="tag in temp.ccList"
                closable
                :disable-transitions="false"
                @close="handleCloseCc(tag)">
                {{tag}}
              </el-tag>

              <el-button class="button-new-tag" size="small" @click="addCc">
                {{$t('emailSend.addCc')}}
              </el-button>
            </el-form-item>

            <el-form-item :label="$t('emailSend.content')" prop="content">
              <tinymce v-model="temp.content" :height="300" :key="tinymceKey"/>
            </el-form-item>
            <el-form-item :label="$t('emailSend.annexList')" prop="annexList">
              <upload-file-more-email v-model="temp.annexList" accept="*.*"
                                      :key="uploadFileMoreEmailKey"/>
              <!--<el-input v-model="item.annexList" :placeholder="$t('common.pleaseEnter')" clearable/>-->
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="onComfirm">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t(`emailSend.selectCcGroup`)" :visible.sync="dialogSelectVisible">
      <cc-group v-model="groupId"/>
      <cc v-model="ccList" :group-id="groupId"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleConfirmSelectCc">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import UploadFileMoreEmail from '@/components/UploadFile/MoreEmail'
  import CcGroup from '@/components/Select/CcGroup'
  import Cc from '@/components/Select/Cc'


  import {validateRequire} from '@/utils/validate'
  import {UnitsSold} from '@/api'
  import {modelConfirmClose} from "@/mixins";

  export default {
    name: "",
    mixins: [modelConfirmClose],
    components: {Tinymce, UploadFileMoreEmail, CcGroup, Cc},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      unitBookLogId: {
        type: Number,
        default: undefined
      },
    },
    data() {
      return {
        isChange: false,
        temp: {
          unitBookLogId: undefined,
          title: '',
          recipientList: [],
          recipient: '',
          ccList: [],
          cc: '',
          content: '',
          annexList: [],
        },
        rules: {
          title: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('emailSend.title')
          },
          recipient: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('emailSend.recipient')
          },
          cc: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('emailSend.cc')
          },
          content: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('emailSend.content')
          },
        },
        recipientValue: '',
        uploadFileMoreEmailKey: 0,
        tinymceKey: 0,
        dialogSelectVisible: false,
        groupId: undefined,
        ccList: [],
      }
    },
    computed: {
      dialogVisible: {
        get() {
          return this.value
        },
        set(val) {
          //创建刷新列表
          if (!val && this.isChange) this.$emit('change-list')
          if (!val) this.resetTemp()
          this.$emit('input', val)
        }
      }
    },
    methods: {
      // 重置
      resetTemp() {
        this.isChange = false
        this.uploadFileMoreEmailKey = this.uploadFileMoreEmailKey + 1
        this.tinymceKey = this.tinymceKey + 1
        this.temp = {
          unitBookLogId: undefined,
          title: '',
          recipientList: [],
          recipient: '',
          ccList: [],
          cc: '',
          content: '',
          annexList: [],
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleCloseRecipient(tag) {
        this.temp.recipientList.splice(this.temp.recipientList.indexOf(tag), 1);
      },
      addRecipient() {
        this.$prompt(this.$t('emailSend.plsAddRecipient'), this.$t('emailSend.addRecipient'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          inputType: 'text',
          inputPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          inputErrorMessage: this.$t('emailSend.addRecipientTip')
        }).then(({value}) => {
          if (this.temp.recipientList.includes(value)) {
            this.$message({
              type: 'error',
              message: this.$t('emailSend.existEmailTip')
            })
          } else {
            this.temp.recipientList.push(value)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      },
      handleCloseCc(tag) {
        this.temp.ccList.splice(this.temp.ccList.indexOf(tag), 1);
      },
      addCc() {
        this.$prompt(this.$t('emailSend.plsAddCc'), this.$t('emailSend.addCc'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          inputType: 'text',
          inputPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          inputErrorMessage: this.$t('emailSend.addRecipientTip')
        }).then(({value}) => {
          if (this.temp.ccList.includes(value)) {
            this.$message({
              type: 'error',
              message: this.$t('emailSend.existEmailTip')
            })
          } else {
            this.temp.ccList.push(value)
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      },
      onComfirm() {
        this.temp.unitBookLogId = this.unitBookLogId
        this.temp.recipient = this.temp.recipientList.join(',')
        this.temp.cc = this.temp.ccList.join(',')
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            UnitsSold.emailSend(this.temp).then((res) => {
              this.isChange = true
              this.dialogVisible = false
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            })
          }
        })
      },
      //从抄送组中选择
      selectCcGroup() {
        this.dialogSelectVisible = true
      },
      //确定选择
      handleConfirmSelectCc() {
        if (this.ccList.length == 0) {
          this.$message({
            message: this.$t('emailSend.selectCcTip'),
            type: 'error'
          })
          return
        }
        let arr = [...this.temp.ccList, ...this.ccList]
        this.temp.ccList = [...new Set(arr)]
        this.groupId = null
        this.dialogSelectVisible = false
        this.$message({
          message: this.$t('common.success'),
          type: 'success'
        })
      }
    }
  }
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
