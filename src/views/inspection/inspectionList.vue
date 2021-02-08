<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="巡检编号" prop="patrolNo"/>
      <el-table-column width="200px" align="center" label="巡检标题" prop="wayTitle"/>
      <el-table-column width="120px" align="center" label="巡检人名称" prop="userName"/>
      <el-table-column width="120px" align="center" label="巡检人电话" prop="phone"/>
      <el-table-column width="200px" align="center" label="巡检开始时间" prop="startTime"/>
      <el-table-column width="80px" align="center" label="巡检时限" prop="duringTime"/>
      <el-table-column width="80px" align="center" label="巡检状态" prop="patrolStatus">
        <template slot-scope="{row}">
          <el-tag v-if="row.patrolStatus" type="success">已结束</el-tag>
          <el-tag v-else type="danger">进行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="是否超时" prop="beTimeout">
        <template slot-scope="{row}">
          <el-tag v-if="row.beTimeout" type="danger">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="文字总结" prop="resultDescribe">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <p>{{row.resultDescribe}}</p>
            <div slot="reference" class="name-wrapper">
              {{row.resultDescribe}}
            </div>
          </el-popover>
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
          <el-button type="primary" size="small" @click="getInspectionLine(row)" >
            巡检路线
          </el-button>
          <el-button v-if="row.patrolImage" type="info" size="small" @click="getInspectionPic(row)">
            巡检照片
          </el-button>
          <el-button v-if="!row.patrolStatus" type="danger" size="small" @click="getInspectionTask(row)">
            终止巡检
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

    <el-dialog title="巡检照片" :visible.sync="picVisible" width="1000px" :close-on-click-modal="false">
       <div  class="patrolImage" v-for="(item,index) in inspectionOne.patrolImageArray" :key="index">
          <img :src="item"/>
       </div>
    </el-dialog>
    <el-dialog title="巡检路线" :visible.sync="lineVisible" width="1000px" :close-on-click-modal="false">
      <div class="taskTime" v-if="inspectionOne.startTime">起止时间：{{inspectionOne.startTime}}-{{inspectionOne.endTime}}</div>
      <div class="taskTime" v-else>总时长：{{inspectionOne.duringTime}}</div>
      <Map v-if="lineVisible" ref="map" type="view" :latitude="latitude" :longitude="longitude" :nodeList="nodeList"/>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {Inspection} from '@/api'
  import {getPointsCenter} from '@/utils'
  import {isOkOrNo,patrolStatus} from '@/config/base'
  import Map from '@/views/map'
  import {parseTime} from '@/utils'
  export default {
    name: '',
    components: {Pagination, Search,Map},
    data() {
      return {
        isOkOrNo,patrolStatus,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '巡检编号', value: '', options: '', field: 'patrolNo'},
          {type: 1, label: '巡检状态', value: '', options: patrolStatus, field: 'patrolStatus'},
          {type: 1, label: '是否超时', value: '', options: isOkOrNo, field: 'beTimeout'},
          {type: 2, label: '时间筛选', value: '', options: '', field: 'timeRanger'}
        ],
        latitude:null,
        longitude:null,
        nodeList:[],
        picVisible: false,
        lineVisible:false,
        inspectionOne:{
          patrolImageArray:[]
        }
      }
    },
    created() {
      this.getFilter()
      this.getList()
    },

    methods: {
      getFilter(){
        let query = Object.keys(this.$route.query)
        if(query.length){
          if(this.$route.query.time==='today'){
            this.searchFields[3].value=[parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()),
              parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime())
            ]
          }else {
            var monthBefore = new Date();
            var monthAfter  = new Date();
            var fullYear = monthAfter.getFullYear();
            var month = monthAfter.getMonth() + 1;
            var endOfMonth = new Date(fullYear, month, 0).getDate();
            monthBefore.setDate(1);
            monthBefore.setHours(0);
            monthBefore.setSeconds(0);
            monthBefore.setMinutes(0);
            monthAfter.setDate(endOfMonth)
            monthAfter.setHours(23);
            monthAfter.setSeconds(59);
            monthAfter.setMinutes(59);
            this.searchFields[3].value=[parseTime(monthBefore),
              parseTime(monthAfter)
            ]
          }
        }
      },
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
        tempSearch.startTime=tempSearch.timeRanger?tempSearch.timeRanger[0]:undefined
        tempSearch.endTime=tempSearch.timeRanger?tempSearch.timeRanger[1]:undefined
        Inspection.list(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      getInspectionPic(row){
        Inspection.patrolInfo({id:row.id}).then(res => {
             this.inspectionOne=res.data
             this.picVisible=true
        })
      },
      getInspectionLine(row){
        Inspection.patrolInfo({id:row.id}).then(res => {
          const {latitude, longitude} =getPointsCenter(res.data.nodeList)
          this.lineVisible=true
          this.inspectionOne=res.data
          this.latitude=latitude
          this.longitude=longitude
          this.nodeList=res.data.nodeList
          this.$nextTick(()=>{
            this.$refs.map.init()
          })
        })
      },
      getInspectionTask(row){
        this.$confirm('是否终止当前任务？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          Inspection.endPatrol({id:row.id}).then(res => {
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
<style lang="scss" scoped type="text/scss" >
  .patrolImage {
    width: 300px;
    display: inline-block;
    margin-right: 20px;
    img {
      width: 100%;
    }
  }
  .taskTime {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>
