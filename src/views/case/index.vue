import fileDownload from "js-file-download";
<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
      <UploadXls :temOut="false" :inExcel="false" :btnShow="true" @upOut="upOut"/>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="案件编码" prop="caseNo"/>
      <el-table-column width="150px" align="center" label="上报人昵称" prop="nickname"/>
      <el-table-column width="150px" align="center" label="上报人电话" prop="phone"/>
      <el-table-column width="200px" align="center" label="小区名称" prop="streetName"/>
      <el-table-column width="200px" align="center" label="详细地址" prop="detailAddress">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top">
            <p>{{row.detailAddress}}</p>
            <div slot="reference" class="name-wrapper">
              {{row.detailAddress}}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="业务类型" prop="businessType"/>
      <el-table-column width="150px" align="center" label="设施类型" prop="waterType"/>
      <el-table-column width="200px" align="center" label="上报时间	" prop="createTime"/>
      <el-table-column width="80px" align="center" label="案件状态" prop="caseStatus">
        <template slot-scope="{row}">
          <el-tag v-if="row.caseStatus===0" type="danger">待处理</el-tag>
          <el-tag v-else-if="row.caseStatus===1" type="warning">待评价</el-tag>
          <el-tag v-else type="success">已评价</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="是否超时" prop="beTimeout">
        <template slot-scope="{row}">
          <el-tag v-if="row.beTimeout" type="danger">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="是否满意" prop="beSatisfied">
        <template slot-scope="{row}">
          <el-tag v-if="row.beSatisfied===1" type="success">是</el-tag>
          <el-tag v-else-if="row.beSatisfied===0" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        min-width="400px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleView(row,0)">
            查看上报信息
          </el-button>
          <el-button v-if="row.caseStatus" type="danger" size="small" @click="handleView(row,1)">
            查看处理结果
          </el-button>
          <el-button type="info" size="small" @click="handleView(row,2)">
            定位信息
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

    <el-dialog :title="caseStatusTitle" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal="false">
      <div v-if="dialogType!==2">
        <div class="desc">文字描述：{{caseMsg}}</div>
        <div>
        <img class="descImg" v-for="(item,index) in caseImgList" :key="index" :src="item" @click="seeBigPic(item)"/>
      </div>
      </div>
      <div v-else>
        <Map v-if="dialogFormVisible" ref="map" :latitude="latitude" :longitude="longitude"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看大图" width="600px" :visible.sync="bigPicVisible" :close-on-click-modal="false" :append-to-body="true">
      <img :src="bigPic" style="width: 100%;height: 100%">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bigPicVisible = false">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {Case} from '@/api'
  import {caseStatus,isOkOrNo} from '@/config/base'
  import UploadXls from "@/components/UploadFile/UploadXls";
  import Map from "@/views/map"
  import fileDownload from "js-file-download"
  import {parseTime} from '@/utils'
  export default {
    name: '',
    components: {Pagination, Search,UploadXls,Map},
    data() {
      return {
        caseStatus,isOkOrNo,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '案件编码', value: '', options: '', field: 'caseNo'},
          {type: 0, label: '上报人昵称', value: '', options: '', field: 'nickname'},
          {type: 0, label: '上报人电话', value: '', options: '', field: 'phone'},
          {type: 0, label: '小区名称', value: '', options: '', field: 'streetName'},
          {type: 1, label: '案件状态', value: '', options: caseStatus, field: 'caseStatus'},
          {type: 1, label: '是否超时', value: '', options: isOkOrNo, field: 'beTimeout'},
          {type: 1, label: '是否满意', value: '', options: isOkOrNo, field: 'beSatisfied'},
          {type: 2, label: '时间筛选', value: '', options: '', field: 'timeRanger'}
        ],
        dialogFormVisible: false,
        caseStatusTitle:'查看上报信息',
        caseMsg:'',
        caseImgList:[],
        dialogType:0,
        latitude:null,
        longitude:null,
        bigPicVisible:false,
        bigPic:null
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
            this.searchFields[7].value=[parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()),
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
            this.searchFields[7].value=[parseTime(monthBefore),
              parseTime(monthAfter)
            ]
          }
          this.searchFields[4].value = parseInt(this.$route.query.status)===4?'':parseInt(this.$route.query.status)
        }
      },

      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      },
      // 获取数据endOfMonth
      getList(type) {
        this.listLoading = true
        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        tempSearch.startCreateTime=tempSearch.timeRanger?tempSearch.timeRanger[0]:undefined
        tempSearch.endCreateTime=tempSearch.timeRanger?tempSearch.timeRanger[1]:undefined
        Case.list(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      //0 上报信息 1处理信息 2定位信息
      handleView(row,type){
        Case.info({id:row.id}).then(res=>{
          this.dialogFormVisible=true
          this.dialogType=type
          this.caseImgList=type?res.data.handleImageArray:res.data.questionImageArray
          this.caseMsg=type?res.data.handleDescribe:res.data.questionDescribe
          this.caseStatusTitle=type===0?'查看上报信息':(type===1?'查看处理结果':'定位信息')
          if(type===2){
            this.latitude=res.data.latitude
            this.longitude=res.data.longitude
            this.$nextTick(()=>{
              this.$refs.map.init()
            })
          }
        })
      },
      async upOut(){
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        const data = await Case.export(tempSearch)
        fileDownload(data, `案件报表.xlsx`);
      },
      seeBigPic(pic){
         this.bigPic=pic
         this.bigPicVisible=true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .desc {
    font-size: 18px;
    font-weight: bold;
    color:#333333;
    margin-bottom: 20px;
  }
  .descImg {
    width: 200px;
    height: 200px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>

