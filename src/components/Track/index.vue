<template>
  <div>
    <el-dialog :title="$t(`unit.unitTrack`)" :visible.sync="dialogVisible" width="60%">

      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreateEdit('create')"
          v-if="isAuth('unitTrack:unitTrack:save')"
        >
          {{ $t('common.create') }}
        </el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        stripe
        style="width: 100%"
      >
        <el-table-column width="80" align="center" fixed :label="$t('common.serial')">
          <template slot-scope="scope">
            {{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}
          </template>
        </el-table-column>

        <!--<el-table-column width="80" align="center" fixed :label="$t('common.id')" prop="id" sortable/>-->
        <el-table-column
          width="160px"
          align="center"
          :label="$t('unitTrack.username')"
          prop="username"
        />
        <el-table-column
          width="120px"
          align="center"
          :label="$t('unitTrack.staffId')"
          prop="staffId"
        />
        <el-table-column
          min-width="120px"
          align="center"
          :label="$t('unitTrack.remark')"
          prop="remark"
        />

      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
      </div>

    </el-dialog>
    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col :span="14" :offset="1">
            <el-form-item :label="$t('unitTrack.remark')" prop="remark">
              <el-input
                v-model="temp.remark"
                type="textarea"
                :placeholder="$t('common.pleaseEnter')"
                clearable
                :autosize="{ minRows: 2, maxRows: 6}"
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
  import Pagination from '@/components/Pagination'
  import {Unit} from '@/api'
  import {validateRequire} from '@/utils/validate'

  export default {
    name: 'Track',
    components: {Pagination},
    props: {
      value: {
        type: Boolean,
        default: false
      },
      unitId: {
        type: Number,
        default: undefined
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        searchFields: [],
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          id: undefined,
          remark: '',
        },
        rules: {
          remark: {
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: this.$t('unitTrack.remark')
          }
        }

      }
    },
    computed: {
      dialogVisible: {
        get() {
          if (this.value)
            this.getList()
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      unitId() {
      }
    },
    created() {

    },
    methods: {
      // 获取数据
      getList() {
        this.listLoading = true
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})
        tempSearch.unitId = this.unitId

        Unit.getTrackList(tempSearch).then(res => {
          this.list = res.data.list
          this.total = res.data.totalCount
          this.listLoading = false
        })
      },

      // 重置
      resetTemp() {
        this.temp = {
          id: undefined,
          remark: '',
        }
      },
      // 创建或编辑 type create or edit
      handleCreateEdit(type, row) {
        if (type == 'create') this.resetTemp()
        if (type == 'edit') {
          this.temp = Object.assign({}, row) // copy obj
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
            this.temp.unitId = this.unitId
            if (this.dialogFormStatus == 'create') {
              Unit.trackCreate(this.temp).then((res) => {
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

    }
  }
</script>

