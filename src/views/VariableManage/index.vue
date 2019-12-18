<template>
  <el-container class="container">
    <el-header class="header" height="180">
      <el-form :inline="true" size="mini">
        <el-form-item label="变量名称：" style="width:30%">
          <el-input v-model="input_varName" type="text" placeholder="请输入变量名" />
        </el-form-item>
        <el-form-item label="业务名称：" style="width:30%">
          <el-select v-model="input_business">
            <!-- <el-option value="">全部</el-option> -->
            <el-option v-for="biz in bizList" :key="biz.key" :value="biz.value">{{ biz.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量类型：" style="width:30%">
          <el-select v-model="input_varType">
            <!-- <el-option value="">全部</el-option> -->
            <el-option v-for="varT in varTypeList" :key="varT.key" :value="varT.value">{{ varT.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型：" style="width:30%">
          <el-select v-model="input_dataType">
            <!-- <el-option value="">全部</el-option> -->
            <el-option v-for="dataT in dataTypeList" :key="dataT.key" :value="dataT.value">{{ dataT.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量描述：" style="width:30%">
          <el-input v-model="input_description" type="text" />
        </el-form-item>
        <el-form-item style="width:30%">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main" style="height: 420px">
      <div v-show="isShowTable" class="tips">
        共搜到{{ pagination.records }}条数据
      </div>
      <div class="btn-msgbxVariable">
        <el-button type="primary" @click="handleAdd">添加变量</el-button>
      </div>
      <el-table v-loading="isLoading" :data="variableManageList" style="width: 180;">
        <el-table-column label="变量ID">
          <template slot-scope="scope">
            <span>{{ scope.row.variableId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务">
          <template slot-scope="scope">
            <span>{{ scope.row.businessName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变量名称">
          <template slot-scope="scope">
            <span>{{ scope.row.variableName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变量描述">
          <template slot-scope="scope">
            <span>{{ scope.row.variableDescribe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变量类型">
          <template slot-scope="scope">
            <span>{{ scope.row.variableType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据类型">
          <template slot-scope="scope">
            <span>{{ scope.row.dataType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="允许NULL">
          <template slot-scope="scope">
            <span>{{ scope.row.ifCanNull }}</span>
          </template>
        </el-table-column>
        <el-table-column label="默认值">
          <template slot-scope="scope">
            <span>{{ scope.row.defaultData }}</span>
          </template>
        </el-table-column>
        <el-table-column label="脚本类型">
          <template slot-scope="scope">
            <span>{{ scope.row.scriptType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShow(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer v-show="isShowTable" style="margin-bottom: 20px;">
      <el-pagination class="pagination" background layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.records" :current-page="pagination.pageNumber" @current-change="handlePageChange" />
    </el-footer>
    <!--空格对齐法？-->
    <el-dialog v-show="isShowEdit" :visible.sync="isShowEdit" :title="title" width="40%" top="8vh">
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务:
        <el-select v-model="msgbxVariable.businessName" :disabled="isDisabled">
          <el-option v-for="bus in bizList" :key="bus.key" :value="bus.value">{{ bus.value }}</el-option>
        </el-select>
      </p>
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;变量名称: <el-input v-model="msgbxVariable.variableName" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;变量描述: <el-input v-model="msgbxVariable.variableDescribe" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;变量类型:
        <el-select v-model="msgbxVariable.variableType" :disabled="isDisabled">
          <el-option v-for="varT in varTypeList" :key="varT.key" :value="varT.value">{{ varT.value }}</el-option>
        </el-select>
      </p>
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数据类型:
        <el-select v-model="msgbxVariable.dataType" :disabled="isDisabled">
          <el-option v-for="dataT in dataTypeList" :key="dataT.key" :value="dataT.key">{{ dataT.value }}</el-option>
        </el-select>
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默&nbsp;认&nbsp;值&nbsp;: <el-input v-model="msgbxVariable.defaultData" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        <span class="required" />允许NULL值:
        <el-radio v-model="msgbxVariable.ifCanNull" :disabled="isDisabled" label="yes">是</el-radio>
        <el-radio v-model="msgbxVariable.ifCanNull" :disabled="isDisabled" label="no">否</el-radio>
      </p>
      <p>
        <span class="required" />对应系统变量: <el-input v-model="msgbxVariable.systemVariable" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;脚本类型:
        <el-select v-model="msgbxVariable.scriptType" :disabled="isDisabled">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
        </el-select>
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Schema: <el-input v-model="msgbxVariable.schematic" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Table: <el-input v-model="msgbxVariable.title" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Column: <el-input v-model="msgbxVariable.description" :disabled="isDisabled" style="width: 70%" />
      </p>
      <p v-show="msgbxVariable.variableType.toLowerCase() === 'derivation'">
        <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;脚&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本: <el-input v-model="msgbxVariable.scriptContent" type="textarea" :disabled="isDisabled" style="width: 70%" />
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isShowSubmit && isAdd" :disabled="isDisabled" type="primary" @click="addVariable">
          提交
        </el-button>
        <el-button v-show="isShowSubmit && !isAdd" :disabled="isDisabled" type="primary" @click="editVariable">
          提交
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import api from '../../api/index.js'
const {
  getType,
  postSerchVariableList,
  postVariableAdd,
  getVariableInfoQuery,
  postVariableEdit
} = api
export default {
  data() {
    return {
      title: 'add',
      isDisabled: false,
      false: false,
      isShowSubmit: true,
      isAdd: true,
      // 与弹出框显示相关
      msgbxVariable: {
        businessName: '', // 必填
        variableName: '', // 必填
        variableDescribe: '', // 必填
        variableType: '', // 必填
        dataType: '', // 必填
        defaultData: '',
        ifCanNull: '', // 必填
        systemVariable: '', // 必填
        title: '', // 必填
        description: '',
        schematic: '',
        scriptType: '',
        scriptContent: ''
      },
      isLoading: false,
      input_varName: '',
      input_business: '',
      input_dataType: '',
      input_varType: '',
      input_description: '',
      varName: '',
      business: '',
      dataType: '',
      varType: '',
      description: '',
      isShowEdit: false,
      isShowTable: false,
      // 分页配置
      pagination: {
        pageSize: 3,
        pageNumber: 1,
        total: 0
      },
      variableManageList: [],
      // 没网的时候显示
      varTypeList: [
        { key: '1', value: 'basis' },
        { key: '2', value: 'derive' }
      ],
      dataTypeList: [
        { key: '1', value: 'string' },
        { key: '2', value: 'integer' },
        { key: '3', value: 'list' },
        { key: '4', value: 'double' }
      ],
      bizList: [
        { key: '1', value: 'pp' },
        { key: '2', value: 'test' },
        { key: '3', value: 'biz' }
      ]
    }
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    handleShow(index, row) {
      const option = {
        variableId: row.variableId
      }
      getVariableInfoQuery(option).then(({ data }) => {
        this.initMsgbxVariable()
        if (data.status === 'success') {
          const { content } = data
          const option = {}
          for (const key of Object.keys(content)) {
            if (key !== 'systemName') {
              option[key] = content[key]
            }
          }
          option['systemVariable'] = content['systemName']
          this.open({ title: '查看', isDisabled: true, isShowSubmit: false, data: option })
        } else {
          this.$message.error('出错了')
        }
      })
    },
    handleEdit(index, row) {
      this.isAdd = false
      const option = {
        variableId: row.variableId
      }
      getVariableInfoQuery(option).then(({ data }) => {
        if (data.status === 'success') {
          const { content } = data
          const option = {}
          for (const key of Object.keys(content)) {
            if (key !== 'systemName') {
              option[key] = content[key]
            }
          }
          // 解决后台返回变量中系统变量名为systemName,而此处入参是systemVariable的问题
          option['systemVariable'] = content['systemName']
          this.open({ title: '编辑', isDisabled: false, isShowSubmit: true, data: option })
        } else {
          this.$message.error('出错了')
        }
      })
      this.open({ title: '编辑', isDisabled: false, isShowSubmit: true, data: this.variableManageList[index] })
    },
    /**
     * 获取变量类型，数据类型，业务类型
     */
    getInitData() {
      getType().then(({ data }) => {
        this.bizList = data.content.bizList
        this.dataTypeList = data.content.dataTypeList
        this.varTypeList = data.content.varTypeList
      })
    },
    /**
     * 显示添加变量页面
     */
    handleAdd() {
      this.isAdd = true
      this.initMsgbxVariable()
      this.open({ title: '新增', isDisabled: false, isShowSubmit: true })
    },
    // 根据传入的配置数据，打开对话框
    open(option) {
      option = Object.assign({ title: '', isDisabled: false, isShowSubmit: true }, option)
      this.isDisabled = option.isDisabled
      this.isShowSubmit = option.isShowSubmit
      this.title = option.title
      this.isShowEdit = true
      if (option.data) {
        this.msgbxVariable = option.data
      }
    },
    reqVariableList() {
      if (this.validateSearchParam()) {
        this.isLoading = true
        postSerchVariableList(this.getSearchOption())
          .then(({ data }) => {
            // 获取列表后dosomething
            this.isLoading = false
            if (data.status === 'success') {
              this.variableManageList = data.content.rows
              this.pagination.pageSize = data.content.pageSize
              this.pagination.records = data.content.records
              this.isShowTable = true
            } else {
              this.$message.error('出错了')
            }
          })
          .catch((err) => {
            this.isLoading = false
            console.log(err.response)
          })
      }
    },
    // 搜索查询变量列表
    search() {
      this.pagination.pageNumber = 1
      this.varName = this.input_varName
      this.varType = this.input_varType
      this.business = this.input_business
      this.dataType = this.input_dataType
      this.description = this.input_description
      this.reqVariableList()
      this.input_varName = ''
      this.input_varType = ''
      this.input_business = ''
      this.input_dataType = ''
      this.input_description = ''
    },
    // 处理分页跳转
    handlePageChange(index) {
      this.pagination.pageNumber = index
      this.reqVariableList()
    },
    addVariable() {
      if (this.msgbxVariable.businessName) {
        this.msgbxVariable['businessCode'] = this.findBusinessCodeByName(this.msgbxVariable.businessName)
      }
      if (this.validateAddParam()) {
        postVariableAdd(this.getAddOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.$message({ type: 'success', message: '成功' })
              this.isShowEdit = false
              return
            }
            this.$message.error(`失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    editVariable() {
      if (this.validateEditParam()) {
        postVariableEdit(this.getUpdateOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({ message: '成功', type: 'success' })
              this.handlePageChange(1)
              this.isShowEdit = false
            } else {
              if (data.code === 'default is null') {
                this.$message.error('失败-默认值不能为空')
                return
              }
              this.$message.error('修改失败')
            }
          })
          .catch(err => console.log(err))
      }
    },
    //  工具函数
    validateSearchParam() {
      if (!this.varName && !this.business && !this.varType && !this.dataType && !this.description) {
        this.$message.error('缺少参数')
        return false
      }
      return true
    },
    validateAddParam() {
      if (!this.msgbxVariable.businessCode ||
          !this.msgbxVariable.dataType ||
          !this.msgbxVariable.ifCanNull ||
          !this.msgbxVariable.systemVariable ||
          !this.msgbxVariable.title ||
          !this.msgbxVariable.variableDescribe ||
          !this.msgbxVariable.variableName ||
          !this.msgbxVariable.variableType ||
          !(this.msgbxVariable.variableType.toLowerCase() === 'basis' || this.msgbxVariable.scriptContent)) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    validateEditParam() {
      if (!(this.msgbxVariable.variableType.toLowerCase() === 'basis' || this.msgbxVariable.scriptContent)) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    /**
     * 获取数据配置
     */
    getSearchOption() {
      const option = {}
      if (this.varName) {
        option['variableName'] = this.varName
      }
      if (this.business) {
        option['businessCode'] = this.findBusinessCodeByName(this.business)
      }
      if (this.dataType) {
        option['dataType'] = this.dataType
      }
      if (this.varType) {
        option['variableType'] = this.varType
      }
      if (this.description) {
        option['variableDescribe'] = this.description
      }
      option['pageNumber'] = this.pagination.pageNumber
      option['pageSize'] = this.pagination.pageSize
      return option
    },
    getAddOption() {
      const { msgbxVariable } = this
      const option = {}
      // option['businessCode'] = this.findBusinessCodeByName(this.msgbxVariable.businessName)
      for (const key of Object.keys(msgbxVariable)) {
        if (key !== 'businessName' && key !== 'systemVariableId' && msgbxVariable[key]) {
          option[key] = msgbxVariable[key]
        }
      }
      // 当变量类型为basis时，将scriptContent置空
      if (this.msgbxVariable.variableType.toLowerCase() === 'basis') {
        option['scriptContent'] = ''
      }
      return option
    },
    getUpdateOption() {
      const option = this.getAddOption()
      option['businessCode'] = this.findBusinessCodeByName(this.msgbxVariable.businessName)
      option['variableId'] = this.msgbxVariable.variableId
      return option
    },
    findBusinessCodeByName(businessName) {
      return this.bizList.find(business => business.value === businessName).key
    },
    initMsgbxVariable() {
      const msgbxVariable = this.msgbxVariable
      for (const key of Object.keys(msgbxVariable)) {
        msgbxVariable[key] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 10px;
    box-sizing: border-box;
    .header {
      background:rgb(247, 247, 247);
      padding: 20px;
      // box-sizing:border-box;
      .label {
        width: 30%;
        height: 30px;
        margin-right: 3%;
        box-sizing: border-box;
        float: left;
        .select {
          width: 180px;
        }
      }
    }
    .main {
      .btn-msgbxVariable {
        margin-top: 10px;
      }
    }
    .pagination {
      position: absolute;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  input, select {
    width: 180px;
  }
  .label {
    font-weight: 500;
  }
  .required::before {
    content: "*";
    color: red;
  }
  // .msgbx-hide {
  //   position: absolute;
  //   width: 0;
  //   height: 0;
  //   left: 50%;
  //   top: 40%;
  //   // transform: translate(-50%, -50%);
  //   overflow: hidden;
  //   background: red;
  //   transition: all 1s ease-in-out;
  // }
  // .msgbx-show {
  //   width: 400px;
  //   height: 600px;
  // }
</style>
