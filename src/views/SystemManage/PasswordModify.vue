<template>
  <el-container class="container">
    <el-header height="160px" />
    <!--主题数据展示-->
    <el-main class="main" style="height: 420px">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model.number="ruleForm.oldPass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer />
  </el-container>
</template>

<script>
import api from '../../api/SystemManage.js'
const {
  postUserPasswordEdit
} = api
export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      account: '',
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPass: [
          { validator: validatePass1, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          postUserPasswordEdit(this.getPasswordOption())
            .then(({ data }) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.resetForm(formName)
              return
            })
            .catch(err => console.log(err))
        } else {
          this.$message('请正确填写信息')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getPasswordOption() {
      const option = {}
      option['account'] = this.account
      option['olePassword'] = this.ruleForm.oldPass
      option['newPassword'] = this.ruleForm.pass
      return option
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
      .btn-addRole {
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
</style>
