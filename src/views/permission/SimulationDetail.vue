<template>
  <div class="detail-container">
    规则模拟
    <el-table
      :data="ruleData"
      style="width: 100%"
    >
      <el-table-column label="业务" prop="businessName" />
      <el-table-column label="名称" prop="processName" />
      <el-table-column label="描述" prop="processDescribe" />
      <el-table-column label="当前版本" />
      <el-table-column label="修改时间" prop="updateTime" />
    </el-table>
    <el-row type="flex" align="middle" style="padding: 15px 0">
      <el-col :span="7">数据类型
        <el-select v-model="dataType" placeholder="全部" size="mini">
          <el-option
            v-for="item in dataTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="13">订单创建时间
        <el-date-picker
          v-model="orderTime"
          size="mini"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-col>
      <el-col :span="4">最多展示一周数据</el-col>
    </el-row>
    <div class="button"><el-button icon="el-icon-search" type="primary" size="small" @click="searchItem">查询</el-button></div>
    <el-table
      v-loading="lendTableLoading"
      :data="lendData"
      style="width:100%;"
      @select="selectTable"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="借款编号" prop="orderCode" />
      <el-table-column label="对应产品" />
      <el-table-column label="客户姓名" prop="fullName" />
      <el-table-column label="手机号码" prop="mobile" />
      <el-table-column label="借款金额" prop="applicationAmount" />
      <el-table-column label="借款期限" prop="termOfLoan" />
      <el-table-column label="创建时间" prop="createTime" />
    </el-table>
    <!--    分页-->
    <div class="footer">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="button"><el-button type="primary" size="small" @click="goRuleSimulation">规则模拟</el-button></div>

  </div>
</template>

<script>
import api from '../../api/decision'
const { getRuleProcess, getDataType, getOrderList } = api
export default {
  name: 'SimulationDetail',
  data() {
    return {
      lendTableLoading: false,
      // 规则，订单表格数据
      ruleData: [],
      lendData: [],
      // 数据类型
      dataType: 'PASS',
      dataTypeList: [],
      // 订单创建时间
      orderTime: [],
      // 分页
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableSelection: []
    }
  },
  watch: {
    '$route': {
      handler() {
        this.getInitData()
      },
      immediate: true
    }
  },
  created() {
    // this.getInitData()
  },
  methods: {
    searchItem() {
      let args = {}
      // 获取查询的订单信息
      if (!this.orderTime) {
        args = { startDate: '', endDate: '', dataType: this.dataType }
      } else {
        args = { startDate: this.orderTime[0] || '', endDate: this.orderTime[1] || '', dataType: this.dataType }
      }
      this.lendTableLoading = true
      getOrderList(args).then(({ data }) => {
        this.lendData = data.content
        this.total = data.content.records
        this.pageSize = data.content.pageSize
        this.lendTableLoading = false
      })
    },
    getInitData() {
      // 初始化数据
      this.dataType = 'PASS'
      this.dataTypeList = []
      this.lendData = []
      // 获取规则流程
      const processId = Number(this.$route.query.processId)
      if (processId) {
        getRuleProcess({ processId: processId }).then(({ data }) => {
          this.ruleData = []
          this.ruleData.push(data.content)
          console.log(data)
        })
      }
      // 获取数据类型
      getDataType().then(({ data }) => {
        const dataType = data.content.dataType
        dataType.forEach(item => {
          this.dataTypeList.push({ value: item.key, label: item.value })
        })
      })
    },
    goRuleSimulation() {
      console.log(this.ruleData)
      sessionStorage.setItem('ruleData', JSON.stringify(this.ruleData))
      sessionStorage.setItem('tableSelection', JSON.stringify(this.tableSelection))
      this.$router.push({ path: 'simulationresult' })
    },
    selectTable(selection) {
      this.tableSelection = selection
      console.log(this.tableSelection)
    },
    // 分页
    handleSizeChange() {
    },
    handleCurrentChange() {
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container{
    padding: 20px;
    font-size: 14px;
  }
  .button{
    padding: 15px;
    text-align: center;
  }
  .el-button.el-button--primary.el-button--small{
    width: 100px;
  }
</style>
