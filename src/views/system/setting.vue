<!--类型 0 string,1 text,2 int,3 bool,4 array,5 datetime,6 date,7 file 8编辑器-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreateCate"
                 v-if="isAuth('sys:config:addCategory')"
      >
        {{ $t('setting.createCategory') }}
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit"
                 @click="handleCreate"
                 v-if="isAuth('sys:config:save')">
        {{ $t('setting.createSetting') }}
      </el-button>
    </div>

    <el-tabs v-loading="listLoading" type="border-card" @tab-click="changeTab">
      <el-tab-pane v-for="(item,idx) in categoryList" :key="idx" :label="item.categoryName">

        <el-form label-width="200px">

          <el-row v-for="(vo,ko) in list" :key="ko" :gutter="30">
            <el-col :span="14">
              <el-form-item :label="vo.title">

                <el-input
                  v-if="vo.type==0"
                  v-model="vo.value"
                  :placeholder="$t('common.pleaseEnter')"
                  clearable
                />
                <textarea rows="4" class="el-textarea__inner" v-if="vo.type==1" v-model="vo.value"
                          :placeholder="$t('common.pleaseEnter')"/>
                <!--<el-input-->
                <!--v-if="vo.type==1"-->
                <!--v-model="vo.value"-->
                <!--type="textarea"-->
                <!--:placeholder="$t('common.pleaseEnter')"-->
                <!--clearable-->
                <!--:autosize="{ minRows: 2, maxRows: 10}"-->
                <!--/>-->
                <el-input
                  v-if="vo.type==2"
                  v-model.number="vo.value"
                  :placeholder="$t('common.pleaseEnter')"
                  clearable
                />
                <el-radio-group v-if="vo.type==3" v-model="vo.value">
                  <el-radio v-for="vo in booleanType" :key="vo.value" :label="vo.value+''">
                    {{ vo.label }}
                  </el-radio>
                </el-radio-group>

                <el-upload
                  v-if="vo.type =='7'"
                  class="avatar-uploader"
                  :http-request="uploadImage"
                  action=""
                  :data="vo"
                  :show-file-list="false"
                  :before-upload="beforeUploadHandle"
                  :data-id="vo.id"
                >
                  <img v-if="vo.value" :src="vo.value" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"/>
                </el-upload>

                <tinymce v-if="vo.type==8" v-model="vo.value" :height="300"/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-alert :title="vo.name" type="success" :closable="false"/>
            </el-col>
            <el-col v-if="vo.type!=7" :span="4">
              <el-button type="primary" @click="editData(vo)" v-if="isAuth('sys:config:update')">
                {{ $t('common.save')}}
              </el-button>
            </el-col>
          </el-row>

        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="$t('setting.createCategory')" :visible.sync="dialogCateVisible">
      <el-form ref="cateForm" label-position="top" :rules="cateRules" :model="cateTemp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item :label="$t('setting.categoryName')" prop="categoryName">
              <el-input v-model="cateTemp.categoryName" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('setting.categoryCode')" prop="categoryCode">
              <el-input v-model="cateTemp.categoryCode" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCateVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="createCate">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('setting.createSetting')" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item :label="$t('setting.categoryId')" prop="categoryId">
              <el-select v-model="temp.categoryId" filterable :placeholder="$t('common.pleaseSelect')" clearable>
                <el-option
                  v-for="item in categoryList"
                  :key="item.categoryCode"
                  :label="item.categoryName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('setting.title')" prop="title">
              <el-input v-model="temp.title" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('setting.name')" prop="name">
              <el-input v-model="temp.name" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('setting.type')" prop="type">
              <el-select
                v-model="temp.type"
                :placeholder="$t('common.pleaseSelect')"
                clearable
                @change="temp.value = ''"
              >
                <el-option
                  v-for="item in settingType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--<el-form-item :label="$t('setting.value')" prop="value">-->
            <!--<el-input v-if="temp.type==0" :placeholder="$t('common.pleaseEnter')"-->
            <!--v-model="temp.value" clearable/>-->
            <!--<el-input v-if="temp.type==1" type="textarea" :placeholder="$t('common.pleaseEnter')"-->
            <!--v-model="temp.value" clearable/>-->
            <!--<el-input v-if="temp.type==2" :placeholder="$t('common.pleaseEnter')"-->
            <!--v-model.number="temp.value" clearable/>-->
            <!--<el-radio-group v-if="temp.type==3" v-model="temp.value">-->
            <!--<el-radio v-for="vo in booleanType" :label="vo.value" :key="vo.value">-->
            <!--{{vo.label}}-->
            <!--</el-radio>-->
            <!--</el-radio-group>-->

            <!--</el-form-item>-->

            <!--<el-form-item :label="$t('setting.expansion')" prop="expansion">-->
            <!--<el-input :placeholder="$t('common.pleaseEnter')" v-model="temp.expansion" clearable/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('setting.isShow')" prop="isShow">-->
            <!--<el-input :placeholder="$t('common.pleaseEnter')" v-model="temp.isShow" clearable/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('setting.sortNum')" prop="sortNum">-->
            <!--<el-input :placeholder="$t('common.pleaseEnter')" v-model="temp.sortNum" clearable/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('setting.tip')" prop="tip">-->
            <!--<el-input :placeholder="$t('common.pleaseEnter')" v-model="temp.tip" clearable/>-->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="createData">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {Config} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import {settingType, booleanType} from '@/config/base'

  import Tinymce from '@/components/Tinymce'

  export default {
    name: '',
    components: {Tinymce},
    data() {
      return {
        settingType,
        booleanType,
        categoryList: [],
        list: null,
        content: '',
        listLoading: true,
        tabIndex: undefined,
        dialogCateVisible: false,
        cateTemp: {
          categoryName: '',
          categoryCode: ''
        },
        cateRules: {
          categoryName: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('setting.categoryName')
          }],
          categoryCode: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('setting.categoryCode')
          }]
        },
        dialogFormVisible: false,
        temp: {
          categoryId: '',
          expansion: '',
          isShow: true,
          name: '',
          sortNum: '',
          tip: '',
          title: '',
          type: 0,
          value: '',
          id: undefined
        },
        rules: {
          categoryId: [{
            required: true,
            trigger: 'change',
            validator: validateRequire,
            text: this.$t('setting.categoryId')
          }],
          title: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('setting.title')}],
          name: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('setting.name')}],
          type: [{required: true, trigger: 'change', validator: validateRequire, text: this.$t('setting.type')}]
        },
      }
    },
    watch: {
      tabIndex() {
        this.getList()
      }
    },
    created() {
      this.getCategoryList()
    },
    methods: {
      // 获取数据分类
      getCategoryList() {
        Config.fetchCateList().then(res => {
          this.categoryList = res.data
          if (this.categoryList.length) this.tabIndex = 0
        })
      },
      getList() {
        this.listLoading = true
        const params = {
          categoryId: this.categoryList[this.tabIndex].id
        }
        Config.fetchList(params).then(res => {
          this.list = res.data
          this.listLoading = false
        })
      },
      // 切换分类tab
      changeTab(tab, event) {
        this.tabIndex = tab.index
      },

      resetCateTemp() {
        this.cateTemp = {
          categoryName: '',
          categoryCode: ''
        }
      },
      handleCreateCate() {
        this.resetCateTemp()
        this.dialogCateVisible = true
        this.$nextTick(() => {
          this.$refs['cateForm'].clearValidate()
        })
      },
      // 创建分类
      createCate() {
        this.$refs['cateForm'].validate((valid) => {
          if (valid) {
            Config.createCate(this.cateTemp).then((res) => {
              this.getCategoryList()
              this.dialogCateVisible = false
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            })
          }
        })
      },
      resetTemp() {
        this.temp = {
          categoryId: '',
          expansion: '',
          isShow: true,
          name: '',
          sortNum: '',
          tip: '',
          title: '',
          type: 0,
          value: '',
          id: undefined
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 创建配置项
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            Config.create(this.temp).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            })
          }
        })
      },
      editData(row) {
        Config.edit(row).then((res) => {
          // this.getList();
          this.dialogFormVisible = false
          this.$message({
            message: res.msg || this.$t('common.success'),
            type: 'success'
          })
        })
      },
      beforeUploadHandle(file) {
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error(this.$t('common.uploadImageTip'))
          return false
        }
      },
      uploadImage(file) {
        const formData = new FormData()
        formData.append('file', file.file)
        formData.append('configId', file.data.id)

        Config.uploadImage(formData).then((res) => {
          this.getList()
          this.$message({
            message: res.msg || this.$t('common.success'),
            type: 'success'
          })
        })
      },

    }

  }
</script>

