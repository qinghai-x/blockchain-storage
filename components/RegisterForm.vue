<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名（用于登录）" />
      <div class="form-tip">用户名用于登录，注册后不可修改</div>
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="form.nickname" placeholder="请输入昵称（可选，默认使用用户名）" />
      <div class="form-tip">昵称是在系统中显示的名字，可以随时修改</div>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
    </el-form-item>
    <div class="form-actions">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleRegister">注 册</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register } from '@/api/auth'

const emit = defineEmits<{
  (e: 'success', username: string, password: string): void
  (e: 'cancel'): void
}>()

interface RegisterFormState {
  username: string
  nickname: string
  password: string
  confirmPassword: string
}

const form = reactive<RegisterFormState>({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const rules = reactive<FormRules<RegisterFormState>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  nickname: [
    { max: 20, message: '昵称最多20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const resetForm = () => {
  form.username = ''
  form.nickname = ''
  form.password = ''
  form.confirmPassword = ''
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleRegister = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true
    const response = await register({
      username: form.username,
      nickname: form.nickname || form.username,
      password: form.password,
      publicKey: '' // 公钥改为可选，注册时可以为空
    })

    if (response.success) {
      ElMessage.success('注册成功')
      const username = form.username
      const password = form.password
      resetForm()
      emit('success', username, password)
      window.dispatchEvent(new Event('auth-change'))
    } else {
      ElMessage.error(response.message || '注册失败，请稍后重试')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '注册失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.form-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
  line-height: 1.4;
  font-weight: 500;
}
</style>
