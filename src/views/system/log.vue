<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch" />

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--<el-table-column width="80" align="center" fixed :label="$t('common.id')" prop="id" sortable/>-->

      <el-table-column width="120px" align="center" :label="$t('log.username')" prop="username" />
      <el-table-column width="120px" align="center" :label="$t('log.ip')" prop="ip" />
      <el-table-column min-width="120px" align="center" :label="$t('log.method')" prop="method" />
      <el-table-column width="120px" align="center" :label="$t('log.operation')" prop="operation" />
      <!--<el-table-column width="120px" align="center" label="参数" prop="params"/>-->
      <el-table-column width="120px" align="center" :label="$t('log.time')" prop="time" />
      <el-table-column width="160px" align="center" :label="$t('common.createDate')" prop="createDate"  />

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleParams(row)">
            {{ $t('log.title') }}
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

    <el-dialog :title="$t('log.title')" :visible.sync="dialogFormVisible">
      <json-editor ref="jsonEditor" v-model="temp.parmsJson" />
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="dialogFormVisible = false">
          {{ $t('common.close') }}
        </el-button>

      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Search from '@/components/Search'
import JsonEditor from '@/components/JsonEditor'
import { Log } from '@/api'

export default {
  name: 'Log',
  components: { Pagination, JsonEditor, Search },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      temp: {},
      searchFields: []
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
    getList() {
      this.listLoading = true

      const tempSearch = this.searchFields.reduce((acc, cur) => {
        acc[cur.field] = cur.value
        return acc
      }, { ...this.listQuery })

      Log.fetchList(tempSearch).then(response => {
        this.list = response.data.list
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleParams(row) {
      this.temp = row
      this.temp.parmsJson = JSON.parse(this.temp.params)
      this.dialogFormVisible = true
    }
  }
}
</script>
