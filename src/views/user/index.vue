<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="姓名" prop="userName"/>
      <el-table-column width="160px" align="center" label="手机号码" prop="phone"/>
      <el-table-column width="120px" min-width="120px"  align="center" label="头像" prop="avatar">
        <template slot-scope="{row}">
          <img :src="row.avatar" class="avatarImg"/>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="微信昵称" prop="nickname"/>
      <el-table-column width="160px" align="center" label="身份" prop="identity">
        <template slot-scope="{row}">
          <el-tag v-if="row.identity===1" type="danger">巡检人员</el-tag>
          <el-tag v-else-if="row.identity===2" type="primary">领导</el-tag>
          <el-tag v-else type="success">市民</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="绑定小区" prop="streetName">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <p>{{row.streetList?row.streetList.map(item=>item.streetName).join(','):''}}</p>
            <div slot="reference" class="name-wrapper">
              {{row.streetList?row.streetList.map(item=>item.streetName).join(','):''}}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="报案数量" prop="totalReportCase"/>

      <el-table-column width="100px" align="center" label="所属管长" prop="belongAdminName"/>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        min-width="400px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="updateUser(row,0)">
            备注姓名
          </el-button>
          <el-button type="danger" size="small" @click="updateUser(row,1)">
            修改身份
          </el-button>
          <el-button v-if="row.identity===1" type="warning" size="small" @click="updateUser(row,2)">
            绑定小区
          </el-button>
          <el-button v-if="row.identity===1" type="info" size="small" @click="updateUser(row,3)">
            绑定所属管长
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
    <el-dialog title="修改姓名" :visible.sync="updateUserNameVisible" :close-on-click-modal="false">
      <el-form ref="updateUserNameForm" label-position="top" :rules="updateUserNameRules" :model="updateUserNameForm">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model.trim="updateUserNameForm.userName" placeholder="请输入姓名" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserNameVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="editData(0)">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改身份" :visible.sync="updateUserIdentityVisible" :close-on-click-modal="false">
      <el-form ref="updateUserIdentityForm" label-position="top" :rules="updateUserIdentityRules" :model="updateUserIdentityForm">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item label="身份" prop="identity">
              <el-select v-model="updateUserIdentityForm.identity" placeholder="请选择身份">
                <el-option v-for="(item,index) in identity"
                           :key="index"
                           :value="item.value"
                           :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserIdentityVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="editData(1)">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定小区" :visible.sync="updateUserStreetVisible" width="1000px" :close-on-click-modal="false">
      <el-form v-if="updateUserStreetVisible" ref="updateUserStreetForm" label-position="top" :model="updateUserStreetForm">
        <el-row>
          <el-col >
            <el-form-item label="" prop="">
              <search ref="search" :fields="streetSearchFields" @change="handleStreetSearch"/>

              <el-table v-loading="streetListLoading" :data="streetList" border fit highlight-current-row stripe style="width: 100%"
                        ref="streetTable" row-key="id" @selection-change="handleSelectRow">
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="55">
                </el-table-column>
                <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
                  <template slot-scope="scope">
                    {{ (streetListQuery.page - 1) * streetListQuery.pageSize + scope.$index + 1 }}
                  </template>
                </el-table-column>

                <!--<el-table-column width="80" align="center" fixed :label="$t('common.userId')" prop="userId" sortable/>-->
                <el-table-column min-width="120px" align="center" label="小区名称" prop="streetName"/>
              </el-table>

              <pagination
                v-show="streetTotal>0"
                :total="streetTotal"
                :page.sync="streetListQuery.page"
                :limit.sync="streetListQuery.pageSize"
                @pagination="getStreetList"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserStreetVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="editData(2)">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定所属管长" :visible.sync="updateUserAdminVisible" width="1000px" :close-on-click-modal="false">
      <el-form ref="updateUserAdminForm" label-position="top" :model="updateUserAdminForm">
        <el-row>
          <el-col >
            <el-form-item label="" prop="">
              <search ref="search" :fields="adminSearchFields" @change="handleAdminSearch"/>

              <el-table v-loading="adminListLoading" :data="adminList" border fit highlight-current-row stripe style="width: 100%"
                        ref="multipleTable">
                <el-table-column align="center" width="65">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.userId" v-model="updateUserAdminForm.userId" @change.native="handleSelectRowAdmin(scope.row)">&nbsp</el-radio>
                  </template>
                </el-table-column>
                <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
                  <template slot-scope="scope">
                    {{ (adminListQuery.page - 1) * adminListQuery.pageSize + scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column min-width="120px" align="center" label="管长名称" prop="username"/>
                <el-table-column min-width="120px" align="center" label="管长电话" prop="mobile"/>
              </el-table>

              <pagination
                v-show="adminTotal>0"
                :total="adminTotal"
                :page.sync="adminListQuery.page"
                :limit.sync="adminListQuery.pageSize"
                @pagination="getAdminList"
              />

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserAdminVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="editData(3)">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {User,Area} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import {identity} from '@/config/base'

  export default {
    name: '',
    components: {Pagination, Search},
    data() {
      return {
        identity,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '姓名', value: '', options: '', field: 'userName'},
          {type: 0, label: '微信昵称', value: '', options: '', field: 'nickname'},
          {type: 0, label: '手机号码', value: '', options: '', field: 'phone'},
          {type: 1, label: '身份', value: '', options: identity, field: 'identity'},
          {type: 0, label: '所属管长名称', value: '', options: '', field: 'belongAdminName'}
        ],
        //修改用户
        updateUserNameVisible: false,
        updateUserNameForm: {
          id:'',
          userName: '',
        },
        updateUserNameRules: {
          userName: [
            {required: true, trigger: 'blur', validator: validateRequire, text:"姓名"},
          ]
        },
        //修改身份
        updateUserIdentityVisible:false,
        updateUserIdentityForm: {
          id:'',
          identity: '',
        },
        updateUserIdentityRules: {
          identity: [
            {required: true, trigger: 'blur', validator: validateRequire, text:"身份"}
          ]
        },
        //修改绑定小区
        streetList: null,
        streetTotal: 0,
        streetListLoading: true,
        streetListQuery: {
          page: 1,
          pageSize: 10
        },
        streetSearchFields: [
          {type: 0, label: '小区名称', value: '', options: '', field: 'streetName'},
        ],
        updateUserStreetVisible:false,
        updateUserStreetForm: {
          userId:'',
          streetIdArray: [],
        },
        multipleSelection:[],
        multipleStatus:false,
        //修改所属管长
        //管长
        adminList: null,
        adminTotal: 0,
        adminListLoading: true,
        adminListQuery: {
          page: 1,
          pageSize: 10
        },
        adminSearchFields: [
          {type: 0, label: '管长名称', value: '', options: '', field: 'username'},
          {type: 0, label: '管长电话', value: '', options: '', field: 'mobile'},
        ],
        updateUserAdminVisible: false,
        updateUserAdminForm: {
          id:'',
          userId: '',
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
      getList(type) {
        this.listLoading = true

        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        User.list(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      //小区
      handleStreetSearch(){
        this.streetListQuery.page=1
        this.getStreetList()
      },
      getStreetList(type){
        this.streetListLoading = true
        if (type == 1) this.streetListQuery.page = 1
        const tempSearch = this.streetSearchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.streetListQuery})
        Area.list(tempSearch).then(res => {
          this.streetList = res.data.list
          this.streetTotal = res.data.totalCount
          this.streetListLoading = false
          this.selectTableByUserId()
        })
      },
      selectTableByUserId() {
        this.$nextTick(() => {
          // userid数组
          const userIdSelectList = this.multipleSelection
          // 数据列表数组
          const tableData = this.streetList
          for (var i = 0; i < userIdSelectList.length; i++) {
            for (var j = 0; j < tableData.length; j++) {
              if (userIdSelectList[i].streetName === tableData[j].streetName) {
                this.$refs.streetTable.toggleRowSelection(tableData[j], true)
              }
            }
          }
          this.multipleStatus=true
        })
      },
      //所属馆长
      handleAdminSearch(){
        this.adminListQuery.page=1
        this.getAdminList()
      },
      getAdminList(type){
        this.adminListLoading = true
        if (type == 1) this.adminListQuery.page = 1
        const tempSearch = this.adminSearchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.adminListQuery})

        User.selectAdmin(tempSearch).then(res => {
          this.adminList = res.data.list
          this.adminTotal = res.data.totalCount
          this.adminListLoading = false
        })
      },

      //修改用户操作0 姓名 1 身份 2绑定小区 3所属管长
      updateUser(row,type){
         if(type===0){
           this.updateUserNameVisible=true
           this.updateUserNameForm.id=row.id
           this.updateUserNameForm.userName=''
           this.$nextTick(()=>{
             this.$refs.updateUserNameForm.clearValidate()
           })
         }else if(type===1){
           this.updateUserIdentityVisible=true
           this.updateUserIdentityForm.id=row.id
           this.updateUserIdentityForm.identity=''
           this.$nextTick(()=>{
             this.$refs.updateUserIdentityForm.clearValidate()
           })
        }
         else if(type===2){
           this.updateUserStreetVisible=true
           this.updateUserStreetForm.userId=row.id
           this.streetListQuery.page=1
           this.multipleSelection=row.streetList||[]
           this.multipleStatus=false
           this.$nextTick(()=>{
             this.$refs.streetTable.clearSelection()
           })
           this.getStreetList()
         }else if(type===3){
           this.updateUserAdminVisible=true
           this.adminListQuery.page=1
           this.updateUserAdminForm.id=row.id
           this.updateUserAdminForm.userId=row.belongAdmin
           this.getAdminList()
         }
      },
      editData(type) {
        if(type===0){
          this.$refs['updateUserNameForm'].validate((valid) => {
            if (valid) {
                User.updateUserName(this.updateUserNameForm).then((res) => {
                  this.getList()
                  this.updateUserNameVisible = false
                  this.$message({
                    message: res.msg || this.$t('common.success'),
                    type: 'success'
                  })
                })
            }
          })
        }
        else if(type===1){
          this.$refs['updateUserIdentityForm'].validate((valid) => {
            if (valid) {
              User.updateIdentity(this.updateUserIdentityForm).then((res) => {
                this.getList()
                this.updateUserIdentityVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }
          })
        }
        else if(type===2){
              if(!this.multipleSelection.length){
               return this.$message({
                  message: '请选择要绑定的小区',
                  type: 'warning'
                })
              }
              this.updateUserStreetForm.streetIdArray = this.multipleSelection.map(item=>item.id)
              User.bindStreet(this.updateUserStreetForm).then((res) => {
                this.getList()
                this.updateUserStreetVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
        }
        else if(type===3){
          if(!this.updateUserAdminForm.userId){
            return this.$message({
              message: '请选择要绑定的所属管长',
              type: 'warning'
            })
          }
          User.updateBelongAdmin(this.updateUserAdminForm).then((res) => {
            this.getList()
            this.updateUserAdminVisible = false
            this.$message({
              message: res.msg || this.$t('common.success'),
              type: 'success'
            })
          })

        }
      },
      handleSelectRow(val) {
        if(this.multipleStatus){
          this.multipleSelection = val
        }
      },
      handleSelectRowAdmin(row){
        this.updateUserAdminForm.userId=row.userId
      }
    }
  }
</script>
<style lang="scss" scoped>
  .avatarImg {
    width: 100%;
    height: 100px;
  }
</style>
