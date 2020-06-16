<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEdit('create')"
        v-if="isAuth('sys:user:save')"
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

      <!--<el-table-column width="80" align="center" fixed :label="$t('common.userId')" prop="userId" sortable/>-->
      <el-table-column width="120px" align="center" :label="$t('common.email')" prop="username"/>
      <el-table-column width="120px" align="center" :label="$t('admin.nickname')" prop="nickname"/>
      <!--<el-table-column width="120px" align="center" :label="$t('admin.createUserId')" prop="createUserId"/>-->
      <!--<el-table-column width="160px" align="center" :label="$t('common.email')" prop="email"/>-->
      <el-table-column min-width="120px" align="center" :label="$t('admin.remark')" prop="remark"/>
      <el-table-column width="160px" align="center" :label="$t('common.mobile')" prop="mobile">
        <template slot-scope="{row}">
          <span>{{ row.areaCode +'  '+ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('common.createTime')" prop="createTime"/>
      <el-table-column width="120px" align="center" :label="$t('common.status')" prop="status">
        <template slot-scope="{row}">
          <el-tag :type="row.status | userStatusFilter">
            {{ row.status | userStatusFilter('label') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleCreateEdit('edit',row)" v-if="isAuth('sys:user:update')">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" v-if="isAuth('sys:user:delete')">
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

          <el-col :span="14" :offset="1">
            <el-form-item :label="$t('common.email')" prop="username">
              <el-input v-model="temp.username" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('login.password')" :prop="'password'| isValidate">

              <el-input v-model="temp.password" :placeholder="$t('common.pleaseEnter')" clearable show-password/>
              <span v-if="dialogFormStatus=='edit'" style="color: red;">{{ $t('admin.tip2') }}</span>
            </el-form-item>

            <el-form-item :label="$t('admin.nickname')" prop="nickname">
              <el-input v-model="temp.nickname" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('common.mobile')" prop="mobile">
              <el-input v-model="temp.mobile" :placeholder="$t('common.pleaseEnter')" clearable>
                <MobileAreaCode slot="prepend" v-model="temp.areaCode" style="width: 120px;"/>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('admin.remark')" prop="remark">
              <el-input v-model="temp.remark" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('common.status')" prop="status">
              <el-radio-group v-model="temp.status">
                <el-radio v-for="vo in userStatus" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('admin.roleIdList')" prop="roleIdList">
              <el-checkbox-group v-model="temp.roleIdList">
                <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item :label="$t('admin.showBidPrice')" prop="showBidPrice">
              <el-radio-group v-model="temp.showBidPrice">
                <el-radio v-for="vo in booleanType" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
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
  import MobileAreaCode from '@/components/Select/MobileAreaCode'

  import {Admin, Role} from '@/api'
  import {userStatus, booleanType} from '@/config/base'
  import {validEmail, validateRequire} from '@/utils/validate'
  import {modelConfirmClose} from "@/mixins";

  let page

  export default {
    name: '',
    mixins: [modelConfirmClose],
    components: {Pagination, Search, MobileAreaCode},
    filters: {
      isValidate(v) {
        return page.dialogFormStatus == 'create' ? v : ''
      }
    },
    data() {
      return {
        userStatus,
        booleanType,
        select: '',
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        searchFields: [
          {type: 0, label: this.$t('common.email'), value: '', options: '', field: 'username'}
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          areaCode: '',
          nickname: '',
          mobile: '',
          username: '',
          password: '',
          remark: '',
          status: 1,
          roleIdList: [],
          showBidPrice: false,  //默认为不展示
        },
        rules: {
          username: [
            {required: true, trigger: 'blur', validator: validateRequire, text: this.$t('common.email')},
            // {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
          ],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('login.password')
          }, {pattern: /^[a-zA-Z0-9_-]{6,18}$/, message: this.$t('common.pwdTntensityTip')}],
          nickname: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('admin.nickname')}]
        },
        roleList: []
      }
    },
    beforeCreate: function () {
      page = this
    },
    created() {
      this.getList()
      this.getRoleList()
    },
    methods: {
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      },
      // 获取数据
      getList(type) {
        this.listLoading = true

        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        Admin.fetchList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      getRoleList() {
        Role.select().then(res => {
          this.roleList = res.data
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          areaCode: '',
          nickname: '',
          mobile: '',
          username: '',
          password: '',
          remark: '',
          status: 1,
          roleIdList: [],
          showBidPrice: false,
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          const {user} = await Admin.info({userId: row.userId})
          this.temp = user
          this.temp.password = ''
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
              Admin.create(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Admin.edit(this.temp).then((res) => {
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
          Admin.delete([row.userId]).then(res => {
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

