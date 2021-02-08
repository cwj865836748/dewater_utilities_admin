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

      <el-table-column min-width="200px" align="center" label="巡检人员姓名" prop="userName"/>
      <el-table-column width="300px" align="center" label="电话" prop="phone"/>
      <el-table-column width="200px" align="center" label="微信昵称" prop="nickname"/>
      <el-table-column width="100px" align="center" label="已报案数量" prop="totalReportCase"/>
      <el-table-column width="100px" align="center" label="待处理数量" prop="waitHandle"/>
      <el-table-column width="100px" align="center" label="待评价数量" prop="waitComment"/>
      <el-table-column width="100px" align="center" label="已评价数量" prop="alreadyComment"/>
      <el-table-column width="100px" align="center" label="已巡检数量" prop="alreadyPatrol"/>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {User} from '@/api'
  import UploadXls from "@/components/UploadFile/UploadXls";
  import fileDownload from "js-file-download"
  export default {
    name: '',
    components: {Pagination, Search,UploadXls},
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '巡检人员姓名', value: '', options: '', field: 'userName'},
          {type: 0, label: '电话', value: '', options: '', field: 'phone'},
          {type: 0, label: '微信昵称', value: '', options: '', field: 'nickname'},
          {type: 2, label: '时间筛选', value: '', options: '', field: 'timeRanger'}
        ]
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
        tempSearch.startTime=tempSearch.timeRanger?tempSearch.timeRanger[0]:undefined
        tempSearch.endTime=tempSearch.timeRanger?tempSearch.timeRanger[1]:undefined
        User.selectWorkerDataList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      async upOut(){
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        tempSearch.startTime=tempSearch.timeRanger?tempSearch.timeRanger[0]:undefined
        tempSearch.endTime=tempSearch.timeRanger?tempSearch.timeRanger[1]:undefined
        const data = await User.exportWorkerData(tempSearch)
        fileDownload(data, `巡检报表.xlsx`);
      }
    }
  }
</script>

