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

      <!--<el-table-column width="80" align="center" fixed :label="$t('common.userId')" prop="userId" sortable/>-->
      <el-table-column width="300px" align="center" label="路线标题	" prop="wayTitle"/>
      <el-table-column width="160px" align="center" label="起始时间" prop="startTimeStr"/>
      <el-table-column width="160px" align="center" label="结束时间" prop="endTimeStr"/>
      <el-table-column width="120px" align="center" label="总巡检时长(小时)" prop="totalHour"/>
      <el-table-column width="120px" align="center" label="巡检人员数量" prop="workerNum">
        <template slot-scope="{row}">
          <div @click="showWorkerNum(row)">{{ row.workerNum}}</div>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="每周次数	" prop="frequency"/>
      <el-table-column width="120px" align="center" label="本周已巡检次数	" prop="thisWeekPatrolNum"/>
      <el-table-column width="120px" align="center" label="是否显示" prop="beDisplay">
        <template slot-scope="{row}">
          <el-tag v-if="row.beDisplay" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        min-width="300px"
      >
        <template slot-scope="{row}">
          <el-button type="warning" size="small" @click="handleCreateEdit('edit',row)" >
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="primary" size="small" @click="getInspectionLine(row)" >
            巡检路线
          </el-button>
          <el-button type="primary" size="small" @click="getInspectionDown(row)" >
            下载巡检路线二维码
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
    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" width="1000px" class="dialog" :close-on-click-modal="false">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col>
            <el-form-item label="路线标题" prop="wayTitle">
              <el-input v-model="temp.wayTitle" placeholder="请输入路线标题" clearable/>
            </el-form-item>
            <el-form-item label="打卡点标记" prop="nodeList">
             <Map v-if="dialogFormVisible" ref="map" :latitude="latitude" :longitude="longitude" :nodeList="temp.nodeList" :isSetNode="true" @getNode="getNode" @closeNodeList="closeNodeList"/>
            </el-form-item>
            <el-form-item label="绑定巡检人员">
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

              <!--<el-table-column width="80" align="center" fixed :label="$t('common.userId')" prop="userId" sortable/>-->
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
            <el-form-item label="巡检周期" prop="week">
              <el-checkbox-group v-model="temp.week">
                <el-checkbox v-for="vo in weekList" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="巡检时间设置(2选1)">
              <el-form-item label="开始时间-结束时间">
                <el-time-picker
                  v-model="temp.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间">
                </el-time-picker>
                至
                <el-time-picker
                  v-model="temp.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="固定总巡检时间(小时)">
                <el-input v-model="temp.totalHour" placeholder="请输入固定总巡检时间" clearable @keyup.native="proving"/>
              </el-form-item>
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
    <!--巡检路线-->
    <el-dialog title="巡检路线" :visible.sync="lineVisible" width="1000px" :close-on-click-modal="false">
      <div class="taskTime" v-if="inspectionOne.startTime">起止时间：{{inspectionOne.startTime}}-{{inspectionOne.endTime}}</div>
      <div class="taskTime" v-else>总巡检时长(小时)：{{inspectionOne.totalHour}}</div>
      <Map v-if="lineVisible" ref="mapLine" :latitude="latitude" :longitude="longitude" :nodeList="nodeList"/>
    </el-dialog>
    <!--巡检人员列表-->
    <el-dialog title="巡检人员列表" :visible.sync="inspectionPeopleVisible" width="500px" :close-on-click-modal="false">
      <el-table :data="inspectionPeopleList" border fit highlight-current-row stripe style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column align="center" label="姓名	" prop="userName"/>
        <el-table-column align="center" label="电话	" prop="phone"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import Map from '@/views/map'
  import {User,Inspection} from '@/api'
  import {validWeekList,validNodeList,validateRequire,validWorkerList} from '@/utils/validate'
  import {getPointsCenter} from '@/utils'
  import {isOkOrNo,weekList} from '@/config/base'
  export default {
    name: '',
    components: {Pagination, Search,Map},
    data() {
      return {
        weekList,
        isOkOrNo,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '路线标题', value: '', options: '', field: 'wayTitle'},
        ],
        dialogFormStatus: 'create',
        dialogFormVisible:false,
        temp: {
          wayTitle: '',
          beDisplay:1,
          frequency:'',
          startTime:null,
          endTime:null,
          totalHour:'',
          week:[],
          workerIdArray:[],
          nodeList:[]
        },
        rules: {
          wayTitle: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '路线标题'},
          ],
          nodeList: [
            { validator: validNodeList, trigger: 'blur' }
          ],
        week:[
          { validator: validWeekList, trigger: 'blur' }
        ]
        },
        //巡检路线详情
        lineVisible:false,
        inspectionOne:{},
        latitude:24.48405,
        longitude:118.03394,
        nodeList:[],
        //绑定人员详情
        inspectionPeopleVisible:false,
        inspectionPeopleList:[],
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
      // 获取数据
      getList(type) {
        this.listLoading = true

        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        Inspection.lineList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          wayTitle: '',
          beDisplay:1,
          frequency:'',
          startTime:null,
          endTime:null,
          totalHour:'',
          week:[],
          workerIdArray:[],
          nodeList:[]
        }
      },
      proving() {
        this.temp.totalHour = this.temp.totalHour.replace(/[^\.\d]/g,'');
        this.temp.totalHour = this.temp.totalHour.replace('.','');
        this.temp.totalHour = this.temp.totalHour>0?this.temp.totalHour:''
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        this.dialogFormVisible = true
        if (type == 'create') {
          this.latitude=24.48405
          this.longitude=118.03394
          this.resetTemp()
        }
        if (type == 'edit') {
          const {data} = await Inspection.lineInfo({id: row.id})
          this.temp = data
          this.temp.week=data.week.split(',').map(Number)
          this.multipleSelection=data.userList
          this.multipleStatus=false
          const {latitude, longitude} =getPointsCenter(data.nodeList)
          this.latitude=latitude
          this.longitude=longitude
        }
        this.dialogFormStatus = type
        this.userListQuery.page=1
        this.getUserList()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs.multipleTable.clearSelection()
          this.$refs.map.init()
        })
      },
      // 确定创建或编辑
      createEditData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if((this.temp.startTime||this.temp.endTime)&&this.temp.totalHour){
              return this.$message.error('巡检时间只能二选一')
            }
            if((!this.temp.startTime||!this.temp.endTime)&&!this.temp.totalHour){
              return this.$message.error('请设置规范的开始时间和结束时间')
            }
            if(!this.multipleSelection.length){
              return this.$message.error('请选择绑定人员')
            }
            this.temp.week=this.temp.week.join(',')
            this.temp.workerIdArray=this.multipleSelection.map(item=>item.id)
            if (this.dialogFormStatus == 'create') {
              Inspection.save(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Inspection.update(this.temp).then((res) => {
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
          Inspection.beDelete({id:row.id}).then(res => {
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
      //巡检路线
      getInspectionLine(row){
        Inspection.lineInfo({id:row.id}).then(res => {
          const {latitude, longitude} =getPointsCenter(res.data.nodeList)
          this.lineVisible=true
          this.inspectionOne=res.data
          this.latitude=latitude
          this.longitude=longitude
          this.nodeList=res.data.nodeList
          this.$nextTick(()=>{
            this.$refs.mapLine.init()
          })
        })
      },
      //展示该路线巡检人员数量
      showWorkerNum(row){
        this.inspectionPeopleVisible=true
        Inspection.workerList({id:row.id}).then(res => {
          this.inspectionPeopleList=res.data
        })
      },
      //获取添加地图节点
      getNode(node,isAdd,index){
        isAdd?this.temp.nodeList.push(node):this.temp.nodeList[index]=node
        const {latitude, longitude} =getPointsCenter(this.temp.nodeList)
        this.latitude=latitude
        this.longitude=longitude
      },
      //删除地图节点
      closeNodeList(index){
        this.temp.nodeList.splice(index,1)
      },
      //巡检人员列表
      handleUserSearch() {
        this.userListQuery.page = 1
        this.getUserList()
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
          //数组
          const userIdSelectList = this.multipleSelection
          // 数据列表数组
          const tableData = this.userList||[]
          for (var i = 0; i < userIdSelectList.length; i++) {
            for (var j = 0; j < tableData.length; j++) {
              if (userIdSelectList[i].userName=== tableData[j].userName) {
                // 执行选中方法
                this.$refs.multipleTable.toggleRowSelection(tableData[j], true)
              }
            }
          }
          this.multipleStatus=true
        })
      },
      handleSelectRow(val) {
        if(this.multipleStatus){
          this.multipleSelection = val
        }
      },
      getInspectionDown(row){
        Inspection.lineInfo({id:row.id}).then(res => {
          const nodeList = res.data.nodeList
          for(let i = 0;i<nodeList.length;i++) {
            this.downloadFile(nodeList[i].qrImage)
          }
        })
      },
      downloadFile (url)  {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none"; // 防止影响页面
      iframe.style.height = 0; // 防止影响页面
      iframe.src = url;
      document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
      setTimeout(()=>{
        iframe.remove();
       }, 5 * 60 * 1000);
     }
    }
  }
</script>
<style lang="scss" scoped type="text/scss" >
  .taskTime {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

</style>
