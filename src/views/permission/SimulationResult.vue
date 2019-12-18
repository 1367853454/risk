<template>
  <div class="result-container">
    规则模拟结果
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
    <el-row :span="24" type="flex" align="middle" style="padding: 20px 0">
      <el-col :span="12">图表显示位置</el-col>
      <el-col :span="12">
        <div class="test-result">
          <div class="test-result__item"><div>测试用户数：</div><div>{{ testUserNumber }}</div></div>
          <div class="test-result__item"><div>授信失败数：</div><div>{{ failNumber }}</div></div>
          <div class="test-result__item"><div>授信成功数：</div><div>{{ successNumber }}</div></div>
          <div class="test-result__item"><div>授信成功率：</div><div>{{ successRate }}</div></div>
          <div class="test-result__item"><div>最大授信额度：</div><div>{{ maxCreditAmount }}</div></div>
          <div class="test-result__item"><div>平均授信额度：</div><div>{{ averageCreditAmount }}</div></div>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="lendData"
      style="width:100%;"
    >
      <el-table-column label="借款编号" prop="orderCode" />
      <el-table-column label="对应产品" />
      <el-table-column label="客户姓名" prop="fullName" />
      <el-table-column label="手机号码" prop="mobile" />
      <el-table-column label="借款金额" prop="applicationAmount" />
      <el-table-column label="借款期限" prop="termOfLoan" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="模拟结果" prop="simulationResult" />
    </el-table>
  </div>
</template>

<script>
import api from '../../api/decision'
const { postRuleSimulation } = api
export default {
  name: 'SimulationResult',
  data() {
    return {
      ruleData: [],
      testUserNumber: 0,
      failNumber: 0,
      successNumber: 0,
      successRate: '0',
      maxCreditAmount: '0',
      averageCreditAmount: '0',
      lendData: []
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
  },
  methods: {
    getInitData() {
      this.ruleData = JSON.parse(sessionStorage.getItem('ruleData'))
      const tableSelection = JSON.parse(sessionStorage.getItem('tableSelection'))
      const businessCode = JSON.parse(sessionStorage.getItem('businessCode'))
      const processCode = JSON.parse(sessionStorage.getItem('processCode'))
      const args = { businessCode: businessCode, processCode: processCode }
      postRuleSimulation(args).then(() => {

      })
      console.log(tableSelection)
    }
  }

}
</script>

<style lang="scss" scoped>
  .result-container{
    padding: 20px;
    font-size: 14px;
  }
  .test-result__item{
    display: flex;
    line-height: 30px;
  }
  .test-result__item>div:first-child{
    width: 100px;
  }
</style>
