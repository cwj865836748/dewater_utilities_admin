<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEdit('create')"
        v-if="isAuth('sys:menu:save')"
      >
        {{ $t('common.create') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="treeList"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%"
      row-key="menuId"
    >
      <el-table-column min-width="250px" :label="$t('rule.name')" prop="name" fixed/>
      <!--<el-table-column width="120px" align="center" :label="$t('rule.title')" prop="menuId"/>-->
      <el-table-column width="120px" align="center" :label="$t('rule.title')" prop="title"/>
      <el-table-column width="120px" align="center" :label="$t('rule.icon')" prop="icon"/>
      <el-table-column width="120px" align="center" :label="$t('rule.component')" prop="component"/>
      <el-table-column width="140px" align="center" :label="$t('rule.path')" prop="path"/>
      <el-table-column width="140px" align="center" :label="$t('rule.url')" prop="url"/>
      <el-table-column width="200px" align="center" :label="$t('rule.perms')" prop="perms"/>
      <!--<el-table-column width="140px" align="center" :label="$t('rule.open')" prop="open"/>-->
      <!--<el-table-column width="120px" align="center" :label="$t('rule.breadcrumb')" prop="breadcrumb"/>-->
      <!--<el-table-column width="120px" align="center" :label="$t('rule.activeMenu')" prop="activeMenu"/>-->
      <el-table-column width="120px" align="center" :label="$t('rule.hidden')" prop="hidden">
        <template slot-scope="{row}">
          {{ row.hidden ?$t('common.yes'):$t("common.no") }}
        </template>
      </el-table-column>

      <!--<el-table-column width="120px" align="center" :label="$t('rule.alwaysShow')" prop="alwaysShow"/>-->
      <!--<el-table-column width="120px" align="center" :label="$t('rule.redirect')" prop="redirect"/>-->
      <!--<el-table-column width="120px" align="center" :label="$t('rule.noCache')" prop="noCache"/>-->
      <!--<el-table-column width="120px" align="center" :label="$t('rule.affix')" prop="affix"/>-->
      <el-table-column width="100px" align="center" :label="$t('rule.type')" prop="type">
        <template slot-scope="{row}">
          <el-tag :type="row.type | ruleTypeFilter">
            {{ row.type | ruleTypeFilter('label') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" :label="$t('rule.orderNum')" prop="orderNum"/>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">

          <el-button type="warning" size="small" @click="handleCreateEdit('edit',row)" v-if="isAuth('sys:menu:update')">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" v-if="isAuth('sys:menu:delete')">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t(`common.${dialogFormStatus}`)" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">

          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('rule.parentId')" prop="parentId">
              <el-cascader
                v-model="temp.arrPIds"
                :placeholder="$t('common.pleaseEnter')"
                :check-strictly="checkStrictly"
                :change-on-select="true"
                :options="selectTreeList"
                :props="{value:'menuId',label:'name'}"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('rule.name')" prop="name">
              <el-input v-model="temp.name" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.title')" prop="title">
              <el-input v-model="temp.title" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.icon')" prop="icon">
              <el-input v-model="temp.icon" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.component')" prop="component">
              <el-input v-model="temp.component" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.path')" prop="path">
              <el-input v-model="temp.path" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('rule.url')" prop="url">
              <el-input v-model="temp.url" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>

            <el-form-item :label="$t('rule.type')" prop="type">
              <el-radio-group v-model="temp.type">
                <el-radio v-for="vo in ruleType" :key="vo.value" :label="vo.value">
                  {{ vo.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('rule.orderNum')" prop="orderNum">
              <el-input-number
                v-model="temp.orderNum"
                :placeholder="$t('common.pleaseEnter')"
                :min="0"
                :precision="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('rule.breadcrumb')" prop="breadcrumb">
              <el-switch v-model="temp.breadcrumb"/>
            </el-form-item>
            <el-form-item :label="$t('rule.activeMenu')" prop="activeMenu">
              <el-input v-model="temp.activeMenu" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.hidden')" prop="hidden">
              <el-switch v-model="temp.hidden"/>
            </el-form-item>
            <el-form-item :label="$t('rule.alwaysShow')" prop="alwaysShow">
              <el-switch v-model="temp.alwaysShow"/>
            </el-form-item>
            <el-form-item :label="$t('rule.redirect')" prop="redirect">
              <el-input v-model="temp.redirect" :placeholder="$t('common.pleaseEnter')" clearable/>
            </el-form-item>
            <el-form-item :label="$t('rule.noCache')" prop="noCache">
              <el-switch v-model="temp.noCache"/>
            </el-form-item>
            <el-form-item :label="$t('rule.affix')" prop="affix">
              <el-switch v-model="temp.affix"/>
            </el-form-item>
            <el-form-item :label="$t('rule.perms')" prop="perms">
              <el-input
                v-model="temp.perms"
                :placeholder="$t('common.pleaseEnter')"
                type="textarea"
                clearable
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
  import {Rule} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import {ruleType} from '@/config/base'
  import {modelConfirmClose} from "@/mixins";

  export default {
    name: 'Rule',
    mixins: [modelConfirmClose],
    data() {
      return {
        ruleType,
        list: null,
        treeList: null,
        selectTreeList: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogFormStatus: 'create',
        temp: {
          activeMenu: '',
          affix: false,
          alwaysShow: false,
          breadcrumb: true,
          component: 'Layout',
          hidden: false,
          icon: '',
          name: '',
          noCache: false,
          orderNum: 0,
          parentId: '',
          path: '',
          url: '',
          redirect: '',
          title: '',
          type: '', // 0：目录   1：菜单   2：按钮
          menuId: undefined,
          parentIds: '',
          arrPIds: [],
          perms: '',
        },
        rules: {
          name: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('rule.name')}],
          // title: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('rule.title')}],
          // component: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('rule.component')}],
          // path: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('rule.path')}],
          // url: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('rule.url')}],
          type: [{required: true, trigger: 'change', validator: validateRequire, text: this.$t('rule.type')}]
        },
        checkStrictly: false,
      }
    },
    computed: {},
    created() {
      this.getList()
    },
    methods: {
      // 获取数据
      getList() {
        this.listLoading = true
        Rule.fetchList().then(res => {
          this.list = res.data
          this.treeList = this.filterArray(res.data, 0)
          this.listLoading = false
        })
      },
      // 数组=>树结构
      filterArray(data, parent) {
        var tree = []
        var temp
        for (var i = 0; i < data.length; i++) {
          if (data[i].parentId == parent) {
            var obj = data[i]
            temp = this.filterArray(data, data[i].menuId)
            if (temp.length > 0) {
              obj.children = temp
            }
            obj.disabled = obj.menuId == this.temp.menuId || false
            tree.push(obj)
          }
        }
        return tree
      },
      // 重置
      resetTemp() {
        this.temp = {
          activeMenu: '',
          affix: false,
          alwaysShow: false,
          breadcrumb: true,
          component: 'Layout',
          hidden: false,
          icon: '',
          name: '',
          noCache: false,
          orderNum: 0,
          parentId: '',
          path: '',
          url: '',
          redirect: '',
          title: '',
          type: '', // 0：目录   1：菜单   2：按钮
          menuId: undefined,
          parentIds: '',
          arrPIds: [],
          perms: '',
        }
      },
      // 创建或编辑 type create or edit
      handleCreateEdit(type, row) {
        if (type == 'create') {
          this.checkStrictly = false
          this.resetTemp()
        }
        if (type == 'edit') {
          this.temp = Object.assign({}, row) // copy obj
          this.temp.arrPIds = this.temp.parentIds.split(',').map(Number)
          this.checkStrictly = true
        }
        this.selectTreeList = this.filterArray(this.list, 0)
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
            this.temp.parentId = this.temp.arrPIds[this.temp.arrPIds.length - 1] || 0
            this.temp.parentIds = this.temp.arrPIds.join(',')
            if (this.dialogFormStatus == 'create') {
              Rule.create(this.temp).then((res) => {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dialogFormStatus == 'edit') {
              delete this.temp.children
              delete this.temp.arrPIds
              Rule.edit(this.temp).then((res) => {
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
          Rule.delete({menuId: row.menuId}).then(res => {
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

