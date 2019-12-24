<template>
  <el-container class="container">
    <el-header class="header" height="180">
      <el-form :inline="true" size="mini">
        <el-form-item label="代  码：" style="width: 25%">
          <el-input v-model="input_packageCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="名  称：" style="width: 25%">
          <el-input v-model="input_packageName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="业  务：" style="width: 25%">
          <el-select v-model="input_business">
            <el-option v-for="biz in bizList" :key="biz.key" :value="biz.value">{{ biz.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="main" style="height: 420px">
      <div v-show="isShowTable" class="tips">
        共搜到{{ pagination.records }}条数据
      </div>
      <div class="btn-msg">
        <el-button type="primary" @click="handleAdd">添加规则包</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table v-loading="isLoading" class="table" :data="packageList" style="width: 180;">
        <el-table-column label="规则包ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.businessName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageDescribe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前版本" align="ecnter">
          <template slot-scope="scope">
            <span>{{ scope.row.packageVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.publishStatus === 'unpublished' ? '未发布' : '已发布' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6"><div class="grid-content"><el-button class="mini-btn bg-red" size="mini" @click="handleDelete(scope.$index)">删除</el-button></div></el-col>
              <el-col :span="6"><div class="grid-content"><el-button class="mini-btn bg-blue" size="mini" @click="handleEdit(scope.$index)">编辑</el-button></div></el-col>
              <el-col :span="6"><div v-show="scope.row.publishStatus === 'unpublished'" class="grid-content"><el-button class="mini-btn bg-yellow" size="mini" @click="handleRelease(scope.$index)">发布</el-button></div></el-col>
              <el-col :span="6"><div v-show="scope.row.publishStatus === 'published'" class="grid-content"><el-button class="mini-btn bg-green" size="mini" @click="handlePackageOffLine(scope.$index)">下线</el-button></div></el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer v-show="isShowTable" style="margin-bottom: 20px;">
      <el-pagination class="pagination" background layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.records" :current-page="pagination.pageNumber" @current-change="handlePageChange" />
    </el-footer>
    <!--空格对齐法？-->
    <!-- 添加规则包，发布规则包对话框 -->
    <el-dialog v-show="isShowAddReleaseDialog" class="dialog" :modal-append-to-body="false" :visible.sync="isShowAddReleaseDialog" :title="title" width="40%" top="8vh">
      <el-row v-show="isShowAdd">
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业务:
          <el-select v-model="packageAdd.businessName" :disabled="isDisabled">
            <el-option v-for="bus in bizList" :key="bus.key" :value="bus.value">{{ bus.value }}</el-option>
          </el-select>
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称: <el-input v-model="packageAdd.packageName" :disabled="isDisabled" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代码: <el-input v-model="packageAdd.packageCode" :disabled="isDisabled" placeholder="请输入" style="width: 70%" />
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述: <el-input v-model="packageAdd.description" type="textarea" :disabled="isDisabled" placeholder="请输入" style="width: 70%" />
        </p>
      </el-row>
      <el-row v-show="isShowRelease">
        <div class="row">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;规则包名称: <span>{{ packageRelease.packageName }}</span>
        </div>
        <div class="row">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;规则包代码: <span>{{ packageRelease.packageCode }}</span>
        </div>
        <div class="row">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前版本: <span>{{ packageRelease.currentVersion }}</span>
        </div>
        <div class="row">
          <span class="required" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;版本:
          <el-select v-model="packageRelease.choosedVersion">
            <el-option v-for="version in packageRelease.versionList" :key="version.packageId" :value="version.packageVersion">{{ version.packageVersion }}</el-option>
          </el-select>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isShowAdd" type="primary" @click="addPackage">提交</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isShowRelease" type="primary" @click="releasePackage">发布</el-button>
      </div>
    </el-dialog>
    <!-- 编辑规则包对话框 -->
    <el-dialog v-show="isShowEditDialog" class="dialog" :modal-append-to-bofy="false" :visible.sync="isShowEditDialog" width="80%" top="8vh">
      <el-row style="min-height:400px;">
        <el-col v-show="editVersionList.length === 0" :span="4">
          未查询到版本号
        </el-col>
        <!--左侧版本栏-->
        <el-col :span="4">
          <el-menu :default-active="editCurrentVersion" class="el-menu-vertical-demo">
            <el-menu-item v-for="(version, index) in editVersionList" :key="`version-${index}`" :index="version.packageVersion" :value="version" @click="requestPackage(version.packageVersion)">
              <div slot="title">{{ version.packageVersion }}</div>
              <el-tag v-show="version.publishStatus === 'published'" effect="dark" style="position:absolute;margin-top:18px;width:60px;height:20px;line-height:20px;text-align:center;margin-left:60px;color:#fff" color="rgb(240, 65, 52)">Release</el-tag>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="20" style="padding:10px;box-sizing:border-box;">
          <el-row style="font-size:12px;">
            <el-col :span="7">
              规则包名称：{{ editPackage.packageName }}
            </el-col>
            <el-col :span="7">
              规则包代码： {{ editPackage.packageCode }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 3vh;">
            <el-button type="primary" size="mini" @click="updatePackage">保存</el-button>
          </el-row>
          <el-row style="margin-top:3vh">
            <el-collapse v-for="(rule, ruleIndex) in editPackage" :key="`rule-${ruleIndex}`" v-model="activeNames[ruleIndex]">
              <div class="edit-container" style="position:relative;">
                <!-- 显示规则包信息 -->
                <el-collapse-item v-show="!rule.isEdit">
                  <template slot="title">
                    <el-row style="width:100%;">
                      <el-col :span="4">{{ rule.ruleName }}</el-col>
                      <el-col :span="4">{{ rule.ruleDescribe }}</el-col>
                      <el-col :span="6" :offset="10" style="postition:relative;">
                        <el-col :span="8" style="height:50px;" @click.stop="handleSwitchChange">
                          <switcher :status="rule.status" :rule-id="rule.ruleId" style="margin-top:15px;"/>
                        </el-col>
                        <el-col :span="8">
                          <span class="text-link" @click="handleRuleEdit(ruleIndex)">编辑</span>
                          <!-- <el-button @click="handleRuleEdit(ruleIndex)" type="primary" size="mini">编辑</el-button> -->
                        </el-col>
                        <el-col :span="8">
                          <el-dropdown size="mini" @command="handleCommand">
                            <span class="el-dropdown-link">
                              更多<i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item :command="`delete${ruleIndex}`" @click="handleDeleteRule(ruleIndex)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-col>
                    </el-row>
                  </template>
                  <span class="text-label">规则提示：</span><span>{{ rule.ruleTips }}</span>
                  <div class="text-label">规则条件：</div>
                  <div v-for="(condition, index) in rule.variableNames" :key="`condition-${ index }`">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ `${rule.variableNames[index]} ${rule.conditionCompare[index]} ${rule.conditionCompareValue[index]}` }}
                  </div>
                  <div class="text-label">变量处理：</div>
                  <div v-for="(resultProcess, index) in rule.resultVariableNames" :key="`resultprocess-${index}`">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ `RESULT ${rule.resultCompare[index]} ${rule.resultCompareValue[index]}` }}
                  </div>
                </el-collapse-item>
                <!-- 编辑规则包详情 -->
                <el-row v-show="rule.isEdit">
                  <el-form ref="form" label-width="80px" style="margin-top:20px;background:rgb(247, 247, 247);padding:10px;box-sizing:border-box">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="规则名">
                          <el-input v-model="editPackageTemp[ruleIndex].ruleName" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :offset="3">
                        <el-form-item label="规则描述">
                          <el-input v-model="editPackageTemp[ruleIndex].ruleDescribe" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :offset="3">
                        <el-form-item label="规则提示">
                          <el-input v-model="editPackageTemp[ruleIndex].ruleTips" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="执行条件">
                      <el-radio-group v-model="editPackageTemp[ruleIndex].executeCondition">
                        <el-radio label="allrule">满足以下所有条件</el-radio>
                        <el-radio label="onerule">满足以下任意条件</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="规则条件" />
                    <el-row v-for="(condition, conditionIndex) in editPackageTemp[ruleIndex].variableNames" :key="`c-${conditionIndex}`">
                      <el-col :span="6">
                        <el-form-item>
                          <el-select v-model="editPackageTemp[ruleIndex].variableNames[conditionIndex]">
                            <el-option v-for="variable in editVariableEnum" :key="`variable-${variable.key}`" :value="variable.key">
                              {{ variable.key }}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-select v-model="editPackageTemp[ruleIndex].conditionCompare[conditionIndex]" size="mini">
                            <el-option value="<">&lt;</el-option>
                            <el-option value="==">==</el-option>
                            <el-option value=">">&gt;</el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input v-model="editPackageTemp[ruleIndex].conditionCompareValue[conditionIndex]" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="line-height: 40px">
                        <i class="el-icon-error" style="color:rgb(252, 102, 33);margin-left: 20px;" @click="handleDeleteRuleCondition(ruleIndex, conditionIndex)" />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button style="width:100%" @click="handleAddRuleCondition(ruleIndex)">+添加</el-button>
                      </el-col>
                    </el-row>
                    <!-- 变量处理 -->
                    <el-form-item label="变量处理" />
                    <el-row v-for="(resultProcess, resultIndex) in editPackageTemp[ruleIndex].resultVariableNames" :key="`result-${resultIndex}`">
                      <el-col :span="6">
                        <el-form-item>
                          <el-select v-model="editPackageTemp[ruleIndex].resultVariableNames[resultIndex]">
                            <el-option key="1" value="RESULT">RESULT</el-option>
                          </el-select>
                          <!-- <el-input v-model="editPackageTemp[ruleIndex].resultVariableNames[resultIndex]" /> -->
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-select v-model="editPackageTemp[ruleIndex].resultCompare[resultIndex]" size="mini">
                            <!-- <el-option value="<">&lt;</el-option> -->
                            <el-option value="==">==</el-option>
                            <!-- <el-option value=">">&gt;</el-option> -->
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <!-- 处理结果 -->
                          <el-select v-model="editPackageTemp[ruleIndex].resultCompareValue[resultIndex]" size="mini">
                            <el-option v-for="resultType in editResultTypeEnum" :key="`result-${resultType.key}`" :value="resultType.value">
                              {{ resultType.value }}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" style="line-height: 40px;">
                        <!-- <div style="width:16px;height:16px;border-radius:8px;background:rgb(252, 102, 33);margin-top:8px;text-align:center;line-height:16px;">
                          <span style="font-size:5px;color:#fff;">x</span>
                        </div> -->
                        <i class="el-icon-error" style="color:rgb(252, 102, 33);" @click="handleDeleteResultProcess(ruleIndex, resultIndex)" />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-button style="width:100%" @click="handleAddResultProcess(ruleIndex)">+添加</el-button>
                      </el-col>
                    </el-row>
                    <el-form-item style="margin-top:3vh">
                      <el-button type="primary" @click="handleSaveRule(ruleIndex)">保存</el-button>
                      <el-button @click="handleRuleEditCancel(ruleIndex)">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
              </div>
            </el-collapse>
            <div class="edit-container" style="position:relative;">
              <!-- 添加规则 -->
              <el-row v-show="isAddRule">
                <el-form ref="form" label-width="80px" style="margin-top:20px;background:rgb(247, 247, 247);padding:10px;box-sizing:border-box">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="规则名">
                        <el-input v-model="ruleAdd.ruleName" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="3">
                      <el-form-item label="规则描述">
                        <el-input v-model="ruleAdd.ruleDescribe" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="3">
                      <el-form-item label="规则提示">
                        <el-input v-model="ruleAdd.ruleTips" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="执行条件">
                    <el-radio-group v-model="ruleAdd.executeCondition">
                      <el-radio label="allrule">满足以下所有条件</el-radio>
                      <el-radio label="onerule">满足以下任意条件</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="规则条件" />
                  <el-row v-for="(condition, conditionIndex) in ruleAdd.variableNames" :key="`c-${conditionIndex}`">
                    <el-col :span="6">
                      <el-form-item>
                        <el-select v-model="ruleAdd.variableNames[conditionIndex]">
                          <el-option v-for="variable in editVariableEnum" :key="`variable-${variable.key}`" :value="variable.key">
                            {{ variable.key }}
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-select v-model="ruleAdd.conditionCompare[conditionIndex]" size="mini">
                          <el-option value="<">&lt;</el-option>
                          <el-option value="==">==</el-option>
                          <el-option value=">">&gt;</el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-model="ruleAdd.conditionCompareValue[conditionIndex]" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" style="line-height: 40px">
                      <i class="el-icon-error" style="color:rgb(252, 102, 33);margin-left: 20px;" @click="handleAddRuleDeleteCondition(conditionIndex)" />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button style="width:100%" @click="handleAddAddCondition()">+添加</el-button>
                    </el-col>
                  </el-row>
                  <!-- 变量处理 -->
                  <el-form-item label="变量处理" />
                  <el-row v-for="(resultProcess, resultIndex) in ruleAdd.resultVariableNames" :key="`result-${resultIndex}`">
                    <el-col :span="6">
                      <el-form-item>
                        <el-select v-model="ruleAdd.resultVariableNames[resultIndex]">
                          <el-option key="1" value="RESULT">RESULT</el-option>
                        </el-select>
                        <!-- <el-input v-model="ruleAdd.resultVariableNames[resultIndex]" /> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-select v-model="ruleAdd.resultCompare[resultIndex]" size="mini">
                          <!-- <el-option value="<">&lt;</el-option> -->
                          <el-option value="==">==</el-option>
                          <!-- <el-option value=">">&gt;</el-option> -->
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <!-- 处理结果 -->
                        <el-select v-model="ruleAdd.resultCompareValue[resultIndex]" size="mini">
                          <el-option v-for="resultType in editResultTypeEnum" :key="`result-${resultType.key}`" :value="resultType.value">
                            {{ resultType.value }}
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" style="line-height: 40px;">
                      <i class="el-icon-error" style="color:rgb(252, 102, 33);" @click="handleAddRuleDeleteResultProcess(resultIndex)" />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button style="width:100%" @click="handleAddAddResult()">+添加</el-button>
                    </el-col>
                  </el-row>
                  <el-form-item style="margin-top:3vh">
                    <el-button type="primary" @click="handleAddSave()">保存</el-button>
                    <el-button @click="handleAddCancel()">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-row>
            </div>
            <el-row>
              <el-col :span="24">
                <el-button v-show="!isAddRule" style="width:100%;margin-top:20px;border: 1px dashed rgb(37, 146, 252);" @click="handleAddRule">+添加</el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
import api from '../../api/index.js'
import Switcher from '../../components/Switcher'
// import { breakStatement } from '@babel/types'
const {
  getType,
  getPackageList,
  postPackageAdd,
  postPackageDelete,
  getAllPackageVersion,
  postPackageRelease,
  getPackageEditData,
  getPackageEditVariables,
  postPackageUpdate,
  postDeleteRule,
  postPackageOff
} = api

export default {
  components: {
    Switcher
  },
  data() {
    return {
      input_business: '',
      input_packageCode: '',
      input_packageNmae: '',
      business: '',
      packageCode: '',
      packageName: '',
      isShowAdd: false,
      isShowRelease: false,
      isShowEdit: false,
      title: '添加规则包',
      isDisabled: false,
      clickFlag: false, // 标记搜索按钮是否点击过，若点击过，添加规则包后调用search方法
      // 与弹出框显示相关
      packageRelease: {
        pacakgeId: '',
        packageName: '',
        packageCode: '',
        currentVersion: '',
        versionList: [],
        choosedVersion: ''
      },
      packageAdd: {
        businessName: '', // 必填
        packageName: '', // 必填
        packageCode: '', // 必填
        description: ''
      },
      isLoading: false,
      isShowAddReleaseDialog: false,
      // isShowTestDialog: false,
      isShowEditDialog: false,
      isShowTable: false,
      isRuleOn: false, // 规则状态
      // 分页配置
      pagination: {
        pageSize: 5,
        pageNumber: 1,
        records: 0
      },
      packageList: [
        {
          packageId: '1',
          businessName: 'pp',
          packageCode: 'AGE',
          packageName: '年龄规则包',
          packageDescribe: '这是一个年龄规则包',
          packageVersion: '1.0.0',
          publishStatus: 'published',
          updateTime: '2019.07.14'
        },
        {
          packageId: '2',
          businessName: 'biz',
          packageCode: 'REFUSE',
          packageName: '拒绝规则包',
          packageDescribe: '拒绝规则包',
          packageVersion: '1.0.0',
          publishStatus: 'unpublished',
          updateTime: '2019.07.12'
        },
        {
          packageId: '3',
          businessName: 'pp',
          packageCode: 'REVIEW',
          packageName: '复议规则包',
          packageDescribe: '这是一个复议规则包',
          packageVersion: '1.0.0',
          publishStatus: 'published',
          updateTime: '2019.07.14'
        },
        {
          packageId: '4',
          businessName: 'pp',
          packageCode: 'AGE',
          packageName: '年龄规则包',
          packageDescribe: '这是一个年龄规则包',
          packageVersion: '1.0.1',
          publishStatus: 'unpublished',
          updateTime: '2019.07.15'
        },
        {
          packageId: '5',
          businessName: 'biz',
          packageCode: 'REVIEW',
          packageName: '复议规则包',
          packageDescribe: '复议规则包',
          packageVersion: '1.0.1',
          publishStatus: 'published',
          updateTime: '2019.07.16'
        }
      ],
      bizList: [
        { key: '1', value: 'pp' },
        { key: '2', value: 'test' },
        { key: '3', value: 'biz' }
      ],
      radioData: '',
      deleteCurrentPackageVersion: '',
      activeNames: [],
      editPackage: {},
      editResultValueList: [],
      isAddRule: false, // 添加规则界面是否显示。判断当前是否处于添加规则状态
      ruleAdd: {
        conditionCompare: [],
        conditionCompareValue: [],
        resultVariableNames: [],
        isEdit: true,
        resultCompare: [],
        resultCompareValue: [],
        ruleId: -1,
        ruleName: '',
        ruleDescribe: '',
        ruleTips: '',
        status: 'unpublished',
        variableNames: []
      },
      // 当前编辑的package的所有版本列表
      activePackageIndex: -1, // 当前正在编辑的规则包下标
      editVersionList: [],
      editCurrentVersion: '',
      editResultTypeEnum: [],
      editVariableEnum: [],
      editPackageTemp: {} // 保存规则包编辑状态的临时变量，取消编辑后不改变editPackage，保存成功后替换editPackage
    }
  },
  mounted() {
    // 请求获取业务列表
    getType({ type: 1 }).then(({ data }) => {
      this.bizList = data.content.bizList
    }).catch(err => {
      console.log(err)
    })
    // const switcher = document.querySelector('#switch')
    // const body = document.querySelector('body')
  },
  methods: {
    reqPackageList() {
      if (this.validateSearchOption()) {
        this.isLoading = true
        getPackageList(this.getSearchOption()).then(({ data }) => {
          if (data.content.rows.length === 0 && this.pagination.pageNumber > 1) {
            this.pagination.pageNumber--
            return this.reqPackageList()
          }
          this.packageList = data.content.rows
          this.isShowTable = true
          this.pagination.records = data.content.records
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      }
    },
    requestPackage(version) {
      this.deleteCurrentPackageVersion = version
      this.isAddRule = false
      this.ruleAdd = {
        conditionCompare: [],
        conditionCompareValue: [],
        resultVariableNames: [],
        isEdit: true,
        resultCompare: [],
        resultCompareValue: [],
        ruleId: -1,
        ruleName: '',
        ruleDescribe: '',
        ruleTips: '',
        status: 'unpublished',
        variableNames: []
      }
      this.editCurrentVersion = version
      const packageName = this.editPackage.packageName
      const packageCode = this.editPackage.packageCode
      // 方法参数设计不太好，重复代码
      getPackageEditData({ packageCode, version })
        .then(({ data }) => {
          console.log('reqPacakge', data)
          const rules = data.content.map(p => p.status)
          console.log(rules)
          if (data.status === 'success') {
            const editData = data.content
            const temp = []
            editData.forEach(ruleItem => {
              const item = temp.find(o => o.ruleId === ruleItem.ruleId)
              if (item) {
                item['variableNames'].push(ruleItem.variableName)
                item['conditionCompare'].push(ruleItem.conditionCompare)
                item['conditionCompareValue'].push(ruleItem.conditionCompareValue)

                item['resultVariableNames'].push(ruleItem.resultCompareValue)
                item['resultCompare'].push(ruleItem.resultCompare)
                item['resultCompareValue'].push(ruleItem.resultCompareValue)
              } else {
                const obj = {}
                obj['isEdit'] = false
                obj['variableNames'] = []
                obj['conditionCompare'] = []
                obj['conditionCompareValue'] = []
                obj['resultVariableNames'] = []
                obj['resultCompare'] = []
                obj['resultCompareValue'] = []
                obj['ruleName'] = ruleItem.ruleName
                obj['ruleId'] = ruleItem.ruleId
                obj['ruleTips'] = ruleItem.ruleTips
                obj['executeCondition'] = ruleItem.executeCondition
                obj['ruleDescribe'] = ruleItem.ruleDescribe
                obj['status'] = ruleItem.status
                obj['variableNames'].push(ruleItem.variableName)
                obj['conditionCompare'].push(ruleItem.conditionCompare)
                obj['conditionCompareValue'].push(ruleItem.conditionCompareValue)
                obj['resultVariableNames'].push(ruleItem.resultCompareValue)
                obj['resultCompare'].push(ruleItem.resultCompare)
                obj['resultCompareValue'].push(ruleItem.resultCompareValue)
                temp.push(obj)
              }
            })
            temp['packageName'] = packageName
            temp['packageCode'] = packageCode
            const arr = ['', '通过', '复议', '拒绝']
            temp.forEach(rule => {
              let index = ''
              const resValue = rule.resultCompareValue
              index = Math.max(...resValue.map(temp => arr.findIndex(key => key === temp)))
              rule.resultCompareValue = [arr[index]]
              rule.resultCompare = ['==']
              rule.resultVariableNames = ['RESULT']
            })
            this.editPackage = temp
            this.editPackageTemp = this.deepClone(temp)
          } else {
            this.$message.error(data.message)
          }
        })
        .catch((err) => {
          console.log(err.message)
          this.$message.error('请求发送失败')
        })
    },
    // 更新规则包信息 todo 把前面显示的新增编辑--直接把现有的列表保存起来
    updatePackage() {
      console.log('updatePackage()', this.getPackageUpdateOption())
      postPackageUpdate(this.getPackageUpdateOption())
        .then(({ data }) => {
          if (data.status === 'success') {
            this.$message({ type: 'success', message: '修改成功' })
            getAllPackageVersion({ businessCode: this.findBusinessCodeByName(this.packageList[this.activePackageIndex].businessName), packageCode: this.packageList[this.activePackageIndex].packageCode })
              .then(({ data }) => {
                if (data.status === 'success') {
                  this.editVersionList = data.content
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$message.error(`修改失败-${data.message}`)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求发送失败')
        })
    },
    // 根据配置数据查询结果，并返回第一页
    handleSearch() {
      this.clickFlag = true
      this.packageCode = this.input_packageCode
      this.packageName = this.input_packageNmae
      this.business = this.input_business
      this.pagination.pageNumber = 1
      this.reqPackageList()
      this.input_packageNmae = ''
      this.input_packageCode = ''
      this.input_business = ''
    },
    /**
     * 打开对话框
     * option:{
     *  title:string, // 标题
     * }
     */
    open(option) {
      option = Object.assign({ title: '', isDisabled: false }, option)
      // this.isDisabled = option.isDisabled
      // this.isShowSubmit = option.isShowSubmit
      this.title = option.title
      this.isShowAddReleaseDialog = true
      if (option.data) {
        this.packageAdd = option.data
      }
    },
    handleAdd() {
      this.isShowAdd = true
      this.isShowRelease = false
      this.open({ title: '添加规则包', isDisabled: false })
      this.clearObj(this.packageAdd)
    },
    handlePageChange(current) {
      this.pagination.pageNumber = current
      this.reqPackageList()
    },
    handleRelease(index) {
      this.packageRelease.versionList = []
      this.packageRelease.packageId = this.packageList[index].packageId
      this.packageRelease.packageName = this.packageList[index].packageName
      this.packageRelease.packageCode = this.packageList[index].packageCode
      this.packageRelease.currentVersion = this.packageList[index].packageVersion
      this.isShowAdd = false
      this.isShowRelease = true
      this.open({ title: '发布规则包' })

      this.packageRelease.choosedVersion = ''
      getAllPackageVersion(this.getVersionQueryOption(index))
        .then(({ data }) => {
          if (data.status === 'success') {
            this.packageRelease.versionList = data.content
            this.packageRelease.packageId = this.packageList[index].packageId
            this.packageRelease.packageName = this.packageList[index].packageName
            this.packageRelease.packageCode = this.packageList[index].packageCode
            this.packageRelease.currentVersion = this.packageList[index].packageVersion
            this.isShowAdd = false
            this.isShowRelease = true
            this.open({ title: '发布规则包' })
            return
          }
          this.$message.error(`error-${data.message}`)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请求出错')
        })
    },
    addPackage() {
      if (this.validateAddOption()) {
        postPackageAdd(this.getAddOption())
          .then(({ data }) => {
            if (data.status === 'success') {
              this.$message({ type: 'success', message: '添加成功' })
              if (this.clickFlag) {
                this.reqPackageList()
              }
              this.isShowAddReleaseDialog = false
              return
            }
            this.$message.error(`添加失败-${data.message}`)
          })
          .catch(err => console.log(err))
      }
    },
    handleDelete(index) {
      this.$confirm('你确定要删除吗?')
        .then(() => {
          // this.packageList.splice(index, 1)
          // this.$message({ type: 'success', message: '删除成功' })
          postPackageDelete(this.getDeleteOption(this.packageList[index].packageId)).then(({ data }) => {
            if (data.status === 'success') {
              this.$message({ type: 'success', message: '删除成功' })
              this.reqPackageList()
              return
            }
            this.$message.error(`删除失败-${data.message}`)
          })
        })
        .catch(() => {
          this.$message('已取消删除')
        })
    },
    handleEdit(index) {
      this.isAddRule = false;
      this.activePackageIndex = index
      this.editCurrentVersion = this.packageList[index].packageVersion

      this.isShowEditDialog = true
      //  处理了数据请求以后返回先后顺序不一致问题
      Promise.all([getAllPackageVersion(this.getVersionQueryOption(index)), getPackageEditData(this.getEditOption(index)), getPackageEditVariables()])
        .then(resArr => {
          console.log('line 617', resArr[1])
          const [versions, editData, variables] = resArr.map(res => res.data.content)
          this.editResultTypeEnum = variables.resultType
          this.editVariableEnum = variables.variables
          this.isShowEditDialog = true
          this.editVersionList = versions
          const temp = []
          // 后台接口返回单一规则记录，需要将相同id的规则中的规则条件以及变量处理进行合并
          editData.forEach(ruleItem => {
            const item = temp.find(o => o.ruleId === ruleItem.ruleId)
            if (item) {
              item['variableNames'].push(ruleItem.variableName)
              item['conditionCompare'].push(ruleItem.conditionCompare)
              item['conditionCompareValue'].push(ruleItem.conditionCompareValue)
              item['resultVariableNames'].push(ruleItem.resultCompareValue)
              item['resultCompare'].push(ruleItem.resultCompare)
              item['resultCompareValue'].push(ruleItem.resultCompareValue)
            } else {
              const obj = {}
              obj['isEdit'] = false
              obj['variableNames'] = []
              obj['conditionCompare'] = []
              obj['conditionCompareValue'] = []
              obj['resultVariableNames'] = []
              obj['resultCompare'] = []
              obj['resultCompareValue'] = []
              obj['ruleName'] = ruleItem.ruleName
              obj['ruleId'] = ruleItem.ruleId
              obj['ruleTips'] = ruleItem.ruleTips
              obj['executeCondition'] = ruleItem.executeCondition
              obj['ruleDescribe'] = ruleItem.ruleDescribe
              obj['status'] = ruleItem.status
              obj['variableNames'].push(ruleItem.variableName)
              obj['conditionCompare'].push(ruleItem.conditionCompare)
              obj['conditionCompareValue'].push(ruleItem.conditionCompareValue)
              if (!obj['variableNames'].find(name => name === ruleItem.variableName)) {
                obj['resultVariableNames'].push(ruleItem.resultCompareValue)
                obj['resultCompare'].push(ruleItem.resultCompare)
                obj['resultCompareValue'].push(ruleItem.resultCompareValue)
              }
              temp.push(obj)
            }
          })
          temp['packageName'] = this.packageList[index].packageName
          temp['packageCode'] = this.packageList[index].packageCode
          this.editPackage = temp
          this.editPackageTemp = this.deepClone(temp)
          this.editPackageTemp['packageName'] = this.packageList[index].packageName
          this.editPackageTemp['packageCode'] = this.packageList[index].packageCode
        })
        .catch(() => this.$message.error('请求发送失败'))
    },
    // 规则编辑界面切换
    handleEditChange(data) {
      this.isShowEdit = data
    },
    // 规则包下线
    handlePackageOffLine(index) {
      this.$confirm('确认下线规则包吗')
        .then(() => {
          postPackageOff({ packageId: this.packageList[index].packageId })
            .then(({ data }) => {
              if (data.status === 'success') {
                this.$message({ type: 'success', message: '规则包已下线' })
                this.reqPackageList()
              } else if (data.code === 'PACKAGE_BEING_USED') {
                this.$message.error('失败-规则包已在规则流程中使用')
              } else {
                this.$message.error(`失败-${data.message}`)
              }
            })
        })
        .catch(err => {
          console.log(err)
          this.$message('操作已取消')
        })
    },
    /* 规则包编辑部分逻辑********** */
    handleRuleEdit(index) {
      this.editPackage[index].isEdit = true
      this.editPackageTemp = this.deepClone(this.editPackage)
      this.editPackageTemp['packageCode'] = this.editPackage['packageCode']
      this.editPackageTemp['packageName'] = this.editPackage['packageName']
      console.log(this.editPackageTemp)
    },
    // 取消编辑规则包
    handleRuleEditCancel(index) {
      this.$confirm('确定取消编辑规则包吗？')
        .then(() => {
          // this.editPackage[index].isEdit = false
          this.editPackage[index].isEdit = false
        })
        .catch(err => console.log(err))
    },
    handleAddRuleCondition(index) {
      this.editPackageTemp[index].variableNames.push('')
      this.editPackageTemp[index].conditionCompare.push('')
      this.editPackageTemp[index].conditionCompareValue.push('')
    },
    // 删除规则条件
    handleDeleteRuleCondition(ruleIndex, conditionIndex) {
      this.editPackageTemp[ruleIndex].variableNames.splice(conditionIndex, 1)
      this.editPackageTemp[ruleIndex].conditionCompare.splice(conditionIndex, 1)
      this.editPackageTemp[ruleIndex].conditionCompareValue.splice(conditionIndex, 1)
    },
    // 添加变量处理
    handleAddResultProcess(index) {
      this.editPackageTemp[index].resultVariableNames.push('')
      this.editPackageTemp[index].resultCompare.push('')
      this.editPackageTemp[index].resultCompareValue.push('')
    },
    handleDeleteResultProcess(ruleIndex, resultIndex) {
      this.editPackageTemp[ruleIndex].resultVariableNames.splice(resultIndex, 1)
      this.editPackageTemp[ruleIndex].resultCompare.splice(resultIndex, 1)
      this.editPackageTemp[ruleIndex].resultCompareValue.splice(resultIndex, 1)
    },
    handleSaveRule(index) {
      console.log(index)
      this.$confirm('确定保存该规则吗')
        .then(() => {
          this.editPackage = this.editPackageTemp
          console.log('temp', this.editPackageTemp)
          this.editPackage[index].isEdit = false
          this.editPackage['packageCode'] = this.editPackageTemp['packageCode']
          this.editPackage['packageName'] = this.editPackageTemp['packageName']
          console.log(this.editPackage)
        })
        .catch(() => {
          this.$message('取消保存')
        })
    },
    /** * 添加规则部分逻辑 */
    handleAddRule() {
      this.isAddRule = true
      // this.editPackage.push({
      //   conditionCompare: [],
      //   conditionCompareValue: [],
      //   resultVariableNames: [],
      //   isEdit: true,
      //   resultCompare: [],
      //   resultCompareValue: [],
      //   ruleId: -1,
      //   ruleName: '',
      //   ruleTips: '',
      //   status: 'unpublished',
      //   variableNames: []
      // })
      // this.editPackageTemp = this.deepClone(this.editPackage)
      // this.editPackageTemp['packageCode'] = this.editPackage.packageCode
      // this.editPackageTemp['packageName'] = this.editPackage.packageName
      // console.log(this.editPackageTemp)
    },
    handleAddCancel() {
      this.$confirm('确认取消添加规则吗，您的编辑将不会被保存')
        .then(() => {
          this.isAddRule = false
          this.ruleAdd = {
            conditionCompare: [],
            conditionCompareValue: [],
            resultVariableNames: [],
            isEdit: true,
            resultCompare: [],
            resultCompareValue: [],
            ruleId: -1,
            ruleName: '',
            ruleTips: '',
            status: 'unpublished',
            variableNames: []
          }
        })
        .catch(err => { console.log(err) })
    },
    handleAddSave() {
      if (this.validateRuleAddOption()) {
        this.editPackage.push(this.ruleAdd)
        this.editPackage[this.editPackage.length - 1].isEdit = false
        this.ruleAdd = {
          conditionCompare: [],
          conditionCompareValue: [],
          resultVariableNames: [],
          isEdit: true,
          resultCompare: [],
          resultCompareValue: [],
          // ruleId: -1,
          ruleName: '',
          ruleTips: '',
          status: 'unpublished',
          variableNames: []
        }
        this.isAddRule = false
        this.editPackageTemp = this.deepClone(this.editPackage)
        console.log('save add', this.editPackageTemp)
        this.$message({ type: 'success', message: '规则添加成功' })
      }
    },
    handleAddAddCondition() {
      this.ruleAdd.variableNames.push('')
      this.ruleAdd.conditionCompare.push('')
      this.ruleAdd.conditionCompareValue.push('')
    },
    handleAddAddResult() {
      this.ruleAdd.resultVariableNames.push('')
      this.ruleAdd.resultCompare.push('')
      this.ruleAdd.resultCompareValue.push('')
    },
    handleAddRuleDeleteCondition(conditionIndex) {
      this.ruleAdd.variableNames.splice(conditionIndex, 1)
      this.ruleAdd.conditionCompare.splice(conditionIndex, 1)
      this.ruleAdd.conditionCompareValue.splice(conditionIndex, 1)
    },
    handleAddRuleDeleteResultProcess(resultIndex) {
      this.ruleAdd.resultVariableNames.splice(resultIndex, 1)
      this.ruleAdd.resultCompare.splice(resultIndex, 1)
      this.ruleAdd.resultCompareValue.splice(resultIndex, 1)
    },
    // 验证规则添加参数
    validateRuleAddOption() {
      if (this.ruleAdd.ruleName === '') {
        this.$message.error('规则名不能为空')
        return false
      }
      if (this.ruleAdd.ruleDescribe === '') {
        this.$message.error('规则描述不能为空')
        return false
      }
      return true
    },
    handleCommand(command) {
      if (/delete/.test(command)) {
        this.handleDeleteRule(parseInt(command.replace(/delete/, '')))
      }
    },
    // 删除规则
    handleDeleteRule(ruleIndex) {
      if (Number.isNaN(ruleIndex)) {
        this.$message.error('内部错误-转化错误')
        return
      }
      this.$confirm('确定删除该规则吗？')
        .then(() => {
          console.log(this.editPackage[ruleIndex].ruleId)
          postDeleteRule({ ruleId: this.editPackage[ruleIndex].ruleId })
            .then(({ data }) => {
              this.requestPackage(this.deleteCurrentPackageVersion)
              console.log(data)
            })
            .catch(err => {
              console.log(err)
              this.$message.error('删除失败')
            })
        })
        .catch(err => {
          console.log(err.message)
          this.$message('取消删除')
        })
      console.log(this.editPackage[ruleIndex])
    },
    /**
     * 发布规则包
     */
    releasePackage() {
      this.isShowRelease = false
      this.isShowAddReleaseDialog = false
      postPackageRelease(this.getReleaseOption())
        .then(({ data }) => {
          if (data.status === 'success') {
            this.$message({ type: 'success', message: '发布成功' })
            this.reqPackageList()
            return
          } else if (data.code === 'RULE_PACKAGE_ONLINE') {
            this.$message.error('发布失败-已有发布版本，不可重新发布')
          }
        })
        .catch(() => this.$message.error('请求发送失败'))
    },
    /* 获取请求参数************************************** */
    getAddOption() {
      // const packageAdd = this.packageAdd
      const packageAdd = this.packageAdd
      const option = {}
      for (const key of Object.keys(packageAdd)) {
        if (key !== 'businessName') {
          option[key] = packageAdd[key]
        }
      }
      if (packageAdd.businessName) {
        option['businessCode'] = this.findBusinessCodeByName(packageAdd.businessName)
      }
      return option
    },
    // 规则包删除参数
    getDeleteOption(id) {
      const option = {}
      option['packageId'] = id
      return option
    },
    // 发布参数
    getReleaseOption() {
      const option = {}
      option['packageId'] = this.packageRelease.packageId
      option['packageVersion'] = this.packageRelease.choosedVersion
      return option
    },
    // 获取规则包所有版本接口参数
    getVersionQueryOption(index) {
      const option = {}
      option['businessCode'] = this.findBusinessCodeByName(this.packageList[index].businessName)
      option['packageCode'] = this.packageList[index].packageCode
      return option
    },
    validateSearchOption() {
      if (!this.business && !this.packageCode && !this.packageName) {
        this.$message.error('参数缺失')
        return false
      }
      return true
    },
    validateAddOption() {
      const packageAdd = this.packageAdd
      if (!packageAdd.businessName || !packageAdd.packageName || !packageAdd.packageCode || !packageAdd.description) {
        this.$message.error('必填参数不能为空')
        return false
      }
      return true
    },
    getSearchOption() {
      const option = {}
      if (this.business) {
        option['businessCode'] = this.findBusinessCodeByName(this.business)
      }
      if (this.packageCode) {
        option['packageCode'] = this.packageCode
      }
      if (this.packageName) {
        option['packageName'] = this.packageName
      }
      if (this.pagination.pageSize) {
        option['pageSize'] = this.pagination.pageSize
      }
      if (this.pagination.pageNumber) {
        option['pageNumber'] = this.pagination.pageNumber
      }

      return option
    },
    getEditOption(index) {
      const option = {}
      option['packageCode'] = this.packageList[index].packageCode
      option['version'] = this.packageList[index].packageVersion
      return option
    },
    // 更新规则包参数获取
    getPackageUpdateOption() {
      // console.log(this.editPackage)
      // console.log(this.editCurrentVersion)
      const option = {}
      option['packageCode'] = this.editPackage.packageCode
      option['packageVersion'] = this.editCurrentVersion
      option['packageUpdateRuleForms'] = []
      this.editPackage.forEach(rule => {
        // console.log(rule)
        const rObj = {}
        option['packageUpdateRuleForms'].push(rObj)
        rObj['executeCondition'] = rule.executeCondition
        rObj['ruleDescribe'] = rule.ruleDescribe
        rObj['ruleName'] = rule.ruleName
        rObj['ruleTips'] = rule.ruleTips
        rObj['status'] = rule.status
        rObj['packageUpdateRuleConditionForms'] = []
        rObj['packageUpdateRuleHandleForms'] = []
        rule.variableNames.forEach((condition, index) => {
          const temp = {}
          temp['variableId'] = this.findVariableIdbyName(rule.variableNames[index])
          temp['compare'] = rule.conditionCompare[index]
          temp['value'] = rule.conditionCompareValue[index]
          rObj['packageUpdateRuleConditionForms'].push(temp)
          // console.log('here')
        })
        rule.resultCompareValue.forEach((result, index) => {
          const temp = {}
          temp['handleVariableId'] = 1
          temp['handleCompare'] = rule.resultCompare[index]
          temp['handleValue'] = rule.resultCompareValue[index]
          rObj['packageUpdateRuleHandleForms'].push(temp)
        })
      })
      return option
    },
    findBusinessCodeByName(businessName) {
      return this.bizList.find(business => business.value === businessName).key
    },
    findVariableIdbyName(name) {
      return this.editVariableEnum.find(variable => variable.key === name).value
    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    clearObj(obj) {
      const o = obj
      for (const key of Object.keys(o)) {
        o[key] = ''
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
    }
    .main {
      .btn-packageAdd {
          margin-top: 10px;
      }
      .table {
        .grid-content {
          .bg-red {
            color: #fff;
            background: rgb(255, 0, 0);
          }
          .bg-blue {
            color: #fff;
            background: rgb(16, 142, 233);
          }
          .bg-yellow {
            color: #fff;
            background: rgb(220, 200, 100);
          }
          .bg-green {
            color: #fff;
            background: rgb(102, 204, 102);
          }
        }
      }
    }
    .test-head {
      height:40px;
      line-height:40px;
      overflow:hidden;
    }
    .test-radio {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
    }
    .test-result {
      margin-top: 3vh;
      .result-head {
        padding-left: 2vh;
        box-sizing: border-box;
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        background: rgb(244, 244, 244);
      }
    }
    .label {
      width: 30%;
      height: 30px;
      margin-right: 3%;
      font-weight: 500;
      box-sizing: border-box;
      float: left;
      .select {
        width: 180px;
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
  .required::before {
    content: "*";
    color: red;
  }
  .text-link {
    color: rgb(37, 146, 252);
  }

  .text-label {
    color: rgb(157, 157, 157);
  }

  .el-icon-error:hover {
    opacity: 0.8;
    cursor: pointer;
  }

  .dialog {
    .row {
      margin-top: 20px;
    }
  }
</style>
