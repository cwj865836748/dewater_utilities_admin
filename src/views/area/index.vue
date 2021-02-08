<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEdit('create')"
      >
        {{ $t('common.create') }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column min-width="500px" align="center" label="小区名称" prop="streetName"/>
      <el-table-column min-width="500px"align="center" label="巡检人员名称" prop="workerName">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <p>{{row.userList?row.userList.map(item=>item.userName).join(','):''}}</p>
            <div slot="reference" class="name-wrapper">
              {{row.userList?row.userList.map(item=>item.userName).join(','):''}}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="是否显示" prop="beDisplay">
        <template slot-scope="{row}">
          <el-tag v-if="row.beDisplay" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleCreateEdit('edit',row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal="false">
    <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
      <el-row :gutter="60">
        <el-col :span="18" :offset="1">
          <el-form-item label="小区名称" prop="streetName">
            <el-input v-model.trim="temp.streetName" placeholder="请输入小区名称" clearable/>
          </el-form-item>
          <el-form-item label="绑定人员" prop="workerIdArray">
            <search ref="search" :fields="userSearchFields" @change="handleUserSearch"/>
            <el-table ref="multipleTable" row-key="id" @selection-change="handleSelectRow" v-loading="userListLoading" :data="userList" border fit highlight-current-row stripe style="width: 100%">
              <el-table-column
                type="selection"
                :reserve-selection="true"
                width="55">
              </el-table-column>
              <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
                <template slot-scope="scope">
                  {{ (userListQuery.page - 1) * userListQuery.pageSize + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column  align="center" label="巡检人员姓名" prop="userName"/>
              <el-table-column align="center" label="巡检人员电话" prop="phone"/>
            </el-table>

            <pagination
              v-show="userTotal>0"
              :total="userTotal"
              :page.sync="userListQuery.page"
              :limit.sync="userListQuery.pageSize"
              @pagination="getUserList"
            />
          </el-form-item>
          <el-form-item label="是否展示" prop="beDisplay">
            <el-radio-group v-model="temp.beDisplay">
              <el-radio v-for="vo in isOkOrNo" :key="vo.value" :label="vo.value">
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
  import {Area,User} from '@/api'
  import {isOkOrNo} from '@/config/base'
  import {validateRequire} from '@/utils/validate'

  export default {
    name: '',
    components: {Pagination, Search},
    data() {
      return {
        isOkOrNo,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '小区名称', value: '', options: '', field: 'streetName'}
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          streetName: '',
          workerIdArray: [],
          beDisplay: 1,
        },
        rules: {
          streetName: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '小区名称'}
          ]
        },
        //巡检人员列表
        userList: null,
        userTotal: 0,
        userListLoading: true,
        userListQuery: {
          page: 1,
          pageSize: 10,
          identity:1
        },
        userSearchFields: [
          {type: 0, label: '巡检人员名称', value: '', options: '', field: 'userName'},
          {type: 0, label: '巡检人员电话', value: '', options: '', field: 'phone'}
        ],
        multipleSelection:[],
        multipleStatus:false
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
      handleUserSearch() {
        this.userListQuery.page = 1
        this.getUserList()
      },
      // 获取数据
      getList(type) {
        this.listLoading = true

        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        Area.list(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      getUserList(type) {
        this.userListLoading = true
        if (type == 1) this.userListQuery.page = 1
        const tempSearch = this.userSearchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.userListQuery})

        User.list(tempSearch).then(res => {
          this.userList = res.data.list
          this.userTotal = res.data.totalCount
          this.userListLoading = false
          this.selectTableByUserId()
        })
      },
      selectTableByUserId() {
        this.$nextTick(() => {
          // userid数组
          const userIdSelectList = this.multipleSelection
          // 数据列表数组
          const tableData = this.userList
          for (var i = 0; i < userIdSelectList.length; i++) {
            for (var j = 0; j < tableData.length; j++) {
              if (userIdSelectList[i].userName === tableData[j].userName) {
                // 执行选中方法
                this.$refs.multipleTable.toggleRowSelection(tableData[j], true)
                // userIdSelectList.splice(i, 1)
              }
            }
          }
          this.multipleStatus=true
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          streetName: '',
          workerIdArray: [],
          beDisplay: 1,
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          this.temp = JSON.parse(JSON.stringify(row))
          this.multipleSelection=this.temp.userList||[]
          this.multipleStatus=false
        }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs.multipleTable.clearSelection()
        })
        this.userListQuery.page=1
        this.getUserList()
        this.dialogFormStatus = type
      },
      // 确定创建或编辑
      createEditData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.multipleSelection.length){
              return this.$message.error(
                 '绑定人员不能为空')
            }
            this.temp.workerIdArray=this.multipleSelection.map(item=>item.id)
            if (this.dialogFormStatus == 'create') {
              Area.save(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Area.update(this.temp).then((res) => {
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
          Area.beDelete({id:row.id}).then(res => {
            const flag = --this.total % this.listQuery.pageSize
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
      },
      handleSelectRow(val) {
        if(this.multipleStatus){
          this.temp.multipleSelection = val
        }

      }
    }
  }
</script>

