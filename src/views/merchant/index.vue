import fileDownload from "js-file-download";
<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch" />
    <div class="filter-container flex">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        size="small"
        @click="handleCreateEdit('create')"
      >
        {{ $t('common.create') }}
      </el-button>
      <UploadXls @upOut="upOut" :temOut="true" @uploadFile="uploadFile" @downMo="downMo"/>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.page - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="商户门牌号" prop="houseNo"/>
      <el-table-column width="300px" align="center" label="商户名称" prop="merchantName"/>
      <el-table-column width="150px" align="center" label="商户类型" prop="merchantType"/>
      <el-table-column width="150px" align="center" label="商户联系人	" prop="principal"/>
      <el-table-column width="150px" align="center" label="商户联系人电话	" prop="phone"/>
      <el-table-column width="150px" align="center" label="是否办理排水许可证" prop="beAllow">
        <template slot-scope="{row}">
          <el-tag v-if="row.beAllow" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="是否有安装预处理设施" prop="beInstall">
        <template slot-scope="{row}">
          <el-tag v-if="row.beInstall" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleHistory(row)">
            查看历史记录
          </el-button>
          <el-button type="warning" size="small" @click="handleCreateEdit('edit',row)">
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

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item label="商户门牌号" prop="houseNo">
              <el-input v-model.trim="temp.houseNo" placeholder="请输入商户门牌号" :disabled="dialogFormStatus==='edit'" clearable/>
            </el-form-item>
            <el-form-item label="商户名称" prop="merchantName">
              <el-input v-model.trim="temp.merchantName" placeholder="请输入商户名称" clearable/>
            </el-form-item>
            <el-form-item label="是否办理排水许可证" prop="beAllow">
              <el-radio-group v-model="temp.beAllow">
                <el-radio v-for="vo in isOkOrNo" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有安装预处理设施" prop="beInstall">
              <el-radio-group v-model="temp.beInstall">
                <el-radio v-for="vo in isOkOrNo" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商户类型" prop="merchantTypeId">
              <el-select v-model="temp.merchantTypeId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in mechantTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户联系人" prop="principal">
              <el-input v-model.trim="temp.principal" placeholder="请输入商户联系人" clearable/>
            </el-form-item>
            <el-form-item label="商户联系人电话" prop="phone">
              <el-input v-model.trim="temp.phone" placeholder="请输入商户联系人电话" clearable/>
            </el-form-item>
            <el-form-item label="是否显示" prop="beDisplay">
              <el-radio-group v-model="temp.beDisplay">
                <el-radio v-for="(item,index) in isOkOrNo" :key="item.value" :label="item.value">
                  {{ item.label }}
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

    <el-dialog title="商户历史记录" :visible.sync="historyVisible" width="1200px" :close-on-click-modal="false">
      <el-table  max-height="500" v-loading="historyListLoading" :data="historyList" border fit highlight-current-row stripe style="width: 100%">
        <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
          <template slot-scope="scope">
            {{ (historyListQuery.page - 1) * historyListQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="商户门牌号" prop="houseNo"/>
        <el-table-column width="300px" align="center" label="商户名称" prop="merchantName"/>
        <el-table-column width="150px" align="center" label="商户类型" prop="merchantType"/>
        <el-table-column width="150px" align="center" label="商户联系人	" prop="principal"/>
        <el-table-column width="150px" align="center" label="商户联系人电话	" prop="phone"/>
        <el-table-column width="150px" align="center" label="是否办理排水许可证" prop="beAllow">
          <template slot-scope="{row}">
            <el-tag v-if="row.beAllow" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="是否有安装预处理设施" prop="beInstall">
          <template slot-scope="{row}">
            <el-tag v-if="row.beInstall" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="修改时间	" prop="updateTime"/>
      </el-table>

      <pagination
        v-show="historyTotal>0"
        :total="historyTotal"
        :page.sync="historyListQuery.page"
        :limit.sync="historyListQuery.pageSize"
        @pagination="getHistoryList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="historyVisible = false">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {Merchant} from '@/api'
  import {isOkOrNo} from '@/config/base'
  import {validPhone,validateRequire} from '@/utils/validate'
  import UploadXls from "@/components/UploadFile/UploadXls";
  import fileDownload from "js-file-download"
  export default {
    name: '',
    components: {Pagination, Search,UploadXls},
    data() {
      return {
        isOkOrNo,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        searchFields: [
          {type: 0, label: '商户门牌号', value: '', options: '', field: 'houseNo'},
          {type: 0, label: '商户名称', value: '', options: '', field: 'merchantName'},
          {type: 1, label: '商户类型', value: '', options: '', field: 'merchantType'},
          {type: 0, label: '商户联系人', value: '', options: '', field: 'principal'},
          {type: 0, label: '商户联系人电话', value: '', options: '', field: 'phone'},
          {type: 1, label: '是否办理排水许可证', value: '', options: isOkOrNo, field: 'beAllow'},
          {type: 1, label: '是否安装预处理设施', value: '', options: isOkOrNo, field: 'beInstall'},
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          houseNo: '',
          merchantName: '',
          beAllow: 1,
          beInstall: 1,
          merchantTypeId: '',
          principal: '',
          phone: '',
          beDisplay: 1,
        },
        rules: {
          houseNo: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '商户门牌号'},
          ],
          merchantName: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '商户名称'},
          ],
          merchantTypeId: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '商户类型'},
          ],
          principal: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '商户联系人'},
          ],
          phone: [
            { validator: validPhone, trigger: 'blur' }
          ]
        },
        //查看历史
        historyList: [],
        historyTotal: 0,
        historyListLoading: true,
        historyListQuery: {
          page: 1,
          pageSize: 10,
          id:''
        },
        historyVisible:false,
        mechantTypeList:[]
      }

    },
    created() {
      this.getList()
      this.getMechantTypeList()
    },
    methods: {
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      },
      getMechantTypeList(){
        Merchant.merchantSelect().then(res=>{
          this.mechantTypeList=res.data.map(item=>{return{label:item.title,value:item.id}})
          this.searchFields[2].options=res.data.map(item=>{return{label:item.title,value:item.title}})
        })
      },
      // 获取数据
      getList(type) {
        this.listLoading = true
        if (type == 1) this.listQuery.page = 1

        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        Merchant.list(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          houseNo: '',
          merchantName: '',
          beAllow: 1,
          beInstall: 1,
          merchantType: '',
          principal: '',
          phone: '',
          beDisplay: 1
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          const {data} = await Merchant.info({id: row.id})
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
              Merchant.save(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Merchant.update(this.temp).then((res) => {
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
          Merchant.beDelete({id:row.id}).then(res => {
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
      handleHistory(row){
         this.historyListQuery.id=row.id
         this.historyListQuery.page=1
         this.historyVisible=true
         this.getHistoryList()
      },
      getHistoryList(type){
        this.historyListLoading = true
        if (type == 1) this.historyListQuery.page = 1
        Merchant.historyList(this.historyListQuery).then(res => {
          this.historyList = res.data.list
          this.historyTotal = res.data.totalCount
          this.historyListLoading = false
        })
      },
      uploadFile(file){
        // return new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('file', file.file)
          Merchant.import(formData).then((res) => {
            if(res.code===200){
              this.$message({
                message: '导入成功',
                type: 'success'
            })
              this.handleSearch()
            }else {
              // fileDownload(res, `模板导入失败.xls`);
              this.$message({
                message: '导入失败',
                type: 'error'
              })
            }
          //   resolve(true)
          // }).catch(err => {
          //   reject(false)
          // })
        })
      },
      async upOut(){
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        const data = await Merchant.export(tempSearch)
        fileDownload(data, `商户报表.xlsx`);
      },
      async downMo(){
        const data = await Merchant.downloadMo()
        fileDownload(data, `商户导入模板.xls`);
      }
    }
  }
</script>

