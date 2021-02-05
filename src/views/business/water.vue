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

      <el-table-column min-width="300px" align="center" label="业务类型" prop="typeName"/>
      <el-table-column min-width="300px" align="center" label="设施名称" prop="waterName"/>
      <el-table-column width="300px" align="center" label="创建时间" prop="createTime"/>
      <el-table-column width="160px" align="center" label="是否禁用" prop="beForbid">
        <template slot-scope="{row}">
          <el-tag v-if="row.beForbid" type="danger">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="排序" prop="sort"/>

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
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

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item label="业务类型" prop="typeId">
              <el-select v-model="temp.typeId" placeholder="请选择">
                <el-option
                v-for="(item,index) in typeList"
                :key="index"
                :label="item.typeName"
                :value="item.id"
                ></el-option>
              </el-select>
          </el-form-item>
            <el-form-item label="设施名称" prop="waterName">
              <el-input v-model.trim="temp.waterName" placeholder="请输入设施名称" clearable/>
            </el-form-item>
            <el-form-item label="是否禁用" prop="beForbid">
              <el-radio-group v-model="temp.beForbid">
                <el-radio v-for="vo in isOkOrNo" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model.trim="temp.sort" placeholder="请输入排序" clearable/>
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
  import {Business} from '@/api'
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
          {type: 0, label: '业务类型', value: '', options: '', field: 'typeName'},
          {type: 0, label: '设施名称', value: '', options: '', field: 'waterName'}
        ],
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          typeId: '',
          waterName: '',
          beForbid: 0,
          sort: '',
        },
        typeList:[],
        rules: {
          typeId: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '业务类型'},
          ],
          waterName: [
            {required: true, trigger: 'blur', validator: validateRequire, text: '设施名称'},
          ]
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

        Business.waterList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          typeId: '',
          waterName: '',
          beForbid: 0,
          sort: '',
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          this.temp = JSON.parse(JSON.stringify(row))
        }
        const{data} = await Business.select()
        this.typeList=data
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
              Business.waterSave(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              Business.waterUpdate(this.temp).then((res) => {
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
          Business.waterDelete({id:row.id}).then(res => {
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
      }
    }
  }
</script>

