<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEdit('create')"
        v-if="isAuth('appVersion:appVersion:save')"
      >
        {{ $t('common.create') }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!--<el-table-column width="80" align="center" fixed :label="$t('common.id')" prop="id" sortable/>-->
      <el-table-column width="160px" align="center" :label="$t('appVersion.version')" prop="version"/>
      <!--<el-table-column width="160px" align="center" :label="$t('appVersion.description')"-->
      <!--prop="langList[0].description"/>-->
      <el-table-column width="160px" align="center" :label="$t('appVersion.type')" prop="type">
        <template slot-scope="{row}">
          <el-tag :type="row.type | appVersionTypeFilter">
            {{ row.type | appVersionTypeFilter('label') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" :label="$t('appVersion.forceUpdate')" prop="forceUpdate">
        <template slot-scope="{row}">
          <el-tag :type="row.forceUpdate | booleanTypeFilter">
            {{ row.forceUpdate | booleanTypeFilter('label') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('appVersion.enable')" prop="enable">
        <template slot-scope="{row}">
          <el-tag :type="row.enable| booleanTypeFilter">
            {{ row.enable | booleanTypeFilter('label') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" :label="$t('appVersion.downloadUrl')" prop="downloadUrl"/>

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleCreateEdit('edit',row)"
                     v-if="isAuth('appVersion:appVersion:update')">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)"
                     v-if="isAuth('appVersion:appVersion:delete')">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">

          <el-col :span="14">
            <el-form-item :label="$t('appVersion.version')" prop="version">
              <el-input v-model="temp.version" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('appVersion.downloadUrl')" prop="downloadUrl">
              <el-input v-model="temp.downloadUrl" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('appVersion.type')" prop="type">
              <el-radio-group v-model="temp.type">
                <el-radio v-for="vo in appVersionType" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('appVersion.forceUpdate')" prop="forceUpdate">
              <el-radio-group v-model="temp.forceUpdate">
                <el-radio v-for="vo in booleanType" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('appVersion.enable')" prop="enable">
              <el-radio-group v-model="temp.enable">
                <el-radio v-for="vo in booleanType" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-for="(item,index) in temp.langList" :key="index" :span="12">
            <el-alert v-if="item.langType==1" :title="$t('common.zh')" :closable="false" type="warning"/>
            <el-alert v-if="item.langType==2" :title="$t('common.en')" :closable="false" type="success"/>

            <el-form-item :label="$t('appVersion.description')" :prop="'langList.' + index + '.description'">
              <el-input v-model="item.description" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="createEditData">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'

  import {AppVersion} from '@/api'
  import {booleanType, appVersionType} from '@/config/base'
  import {validateRequire} from '@/utils/validate'
  import {modelConfirmClose} from "@/mixins";

  export default {
    name: '',
    mixins: [modelConfirmClose],
    components: {Pagination, Search},
    data() {
      return {
        booleanType,
        appVersionType,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        searchFields: [
          {type: 0, label: this.$t('appVersion.version'), value: '', options: '', field: 'version'},
          {type: 1, label: this.$t('appVersion.type'), value: '', options: appVersionType, field: 'type'},
          {type: 1, label: this.$t('appVersion.forceUpdate'), value: '', options: booleanType, field: 'forceUpdate'},
          {type: 1, label: this.$t('appVersion.enable'), value: '', options: booleanType, field: 'enable'}
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          id: undefined,
          version: '',
          downloadUrl: '',
          type: '',
          forceUpdate: '',
          enable: '',
          langList: [
            {langType: 2, description: ''},
            {langType: 1, description: ''}
          ]
        },
        rules: {
          version: {required: true, trigger: 'blur', validator: validateRequire, text: this.$t('appVersion.version')},
          downloadUrl: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('appVersion.downloadUrl')
          },
          type: {required: true, trigger: 'change', validator: validateRequire, text: this.$t('appVersion.type')},
          forceUpdate: {
            required: true,
            trigger: 'change',
            validator: validateRequire,
            text: this.$t('appVersion.forceUpdate')
          },
          enable: {required: true, trigger: 'change', validator: validateRequire, text: this.$t('appVersion.enable')},
          langList: [
            {
              description: {
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: this.$t('appVersion.description')
              }
            },
            {
              description: {
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: this.$t('appVersion.description')
              }
            }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      },
      // 获取数据
      getList() {
        this.listLoading = true

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        AppVersion.fetchList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          id: undefined,
          version: '',
          downloadUrl: '',
          type: '',
          forceUpdate: '',
          enable: '',
          langList: [
            {langType: 2, description: ''},
            {langType: 1, description: ''}
          ]
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          const {data} = await AppVersion.info({id: row.id})
          this.temp = data
        }
        this.dialogFormStatus = type
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 确定创建或编辑
      createEditData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dialogFormStatus == 'create') {
              AppVersion.create(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              AppVersion.edit(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }
          }
        })
      },
      // 删除
      handleDelete(row) {
        this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          AppVersion.delete({id: row.id}).then(res => {
            const flag = --this.total % this.listQuery.limit
            if (!flag && this.total) this.listQuery.page--
            this.getList()
            this.$message({
              message: res.msg || this.$t('common.success'),
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      }
    }
  }
</script>

