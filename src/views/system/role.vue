<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>

    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEdit('create')"
        v-if="isAuth('sys:role:save')"
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

      <!--<el-table-column width="80" align="center" fixed :label="$t('common.id')" prop="roleId" sortable/>-->

      <el-table-column width="120px" align="center" :label="$t('role.roleName')" prop="roleName"/>
      <el-table-column min-width="120px" align="center" :label="$t('role.remark')" prop="remark"/>

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleCreateEdit('edit',row)" v-if="isAuth('sys:role:update')">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" v-if="isAuth('sys:role:delete')">
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

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item :label="$t('role.roleName')" prop="roleName">
              <el-input v-model="temp.roleName" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('role.remark')" prop="remark">
              <el-input v-model="temp.remark" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('role.permissions')" prop="menuIdList">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                :check-strictly="checkStrictly"
                :default-expanded-keys="temp.menuIdList"
                node-key="menuId"
                :props="defaultProps"
              />
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
  import {validateRequire} from '@/utils/validate'

  import {Role, Rule} from '@/api'

  export default {
    name: '',
    components: {Pagination, Search},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        searchFields: [
          {type: 0, label: this.$t('role.roleName'), value: '', options: '', field: 'roleName'}
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          roleId: '',
          roleName: '',
          remark: '',
          menuIdList: []
        },
        rules: {
          roleName: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('role.roleName')}],
          remark: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('role.remark')}]
        },
        treeData: [],
        checkStrictly: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      this.getList()
      this.getPermsTree()
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

        Role.fetchList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      /**
       * 获取权限树
       */
      getPermsTree() {
        Rule.fetchList().then(res => {
          this.treeData = this.filterArray(res.data, 0)
        })
      },
      filterArray(data, parent) {
        var tree = []
        var temp
        for (var i = 0; i < data.length; i++) {
          if (data[i].parentId == parent) {
            var obj = data[i]
            temp = this.filterArray(data, data[i].menuId)
            if (temp.length > 0) {
              obj.children = temp
            }
            tree.push(obj)
          }
        }
        return tree
      },
      // 重置
      resetTemp() {
        this.temp = {
          roleId: '',
          roleName: '',
          remark: '',
          menuIdList: []
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        this.dialogFormStatus = type
        this.dialogFormVisible = true
        if (type == 'create') {
          this.resetTemp()
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedKeys([])
          }
        }
        if (type == 'edit') {
          this.checkStrictly = true
          const {data} = await Role.info({roleId: row.roleId})
          this.$refs.tree.setCheckedKeys(data.menuIdList)
          this.temp = data
          this.checkStrictly = false
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      // 确定创建或编辑
      createEditData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.menuIdList = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())

            if (this.dialogFormStatus == 'create') {
              Role.create(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Role.edit(this.temp).then((res) => {
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
      handleDelete(row) {
        this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          Role.delete([row.roleId]).then(res => {
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
