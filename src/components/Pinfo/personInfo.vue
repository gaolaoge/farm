<template>
  <div class="infoTable-wrapper">
    <section class="f">
      <!--头像模块-->
      <div class="avatarBase">
        <!--头像编辑-->
        <div class="avatarEdit" @click="avatarEditFun"><span>{{ editAvatar }}</span></div>
        <!--头像-->
        <img :src="user.avatar" alt="" class="avatarImg">
      </div>
      <!--账号-->
      <div class="form-item">
        <span class="label">{{ info.accountLabel }}：</span>
        <span class="val">{{ user.account }}</span>
      </div>
      <!--昵称-->
      <div class="form-item">
        <span class="label">{{ info.nameLabel }}：</span>
        <span class="val">{{ user.name }}</span>
        <span class="editBtn" @click="editNameMoudle = true">{{ editBtn }}</span>
      </div>
      <!--密码-->
      <div class="form-item">
        <span class="label">{{ info.passwordLabel }}：</span>
        <span class="val">{{ info.passwordVal }}</span>
        <span class="editBtn" @click="editPasswordMoudle = true">{{ editBtn }}</span>
      </div>
      <!--手机-->
      <div class="form-item">
        <span class="label">{{ info.phoneNumLabel }}：</span>
        <span class="val">{{ String(user.phone).substr(0, 3) + '****' + String(user.phone).substr(7,11) }}</span>
        <span class="editBtn" @click="editPhoneMoudle = true">{{ editBtn }}</span>
      </div>
      <!--性别-->
      <div class="form-item">
        <span class="label">{{ info.sexLabel }}：</span>
        <el-radio-group v-model="info.sexVal" @change="changeSex">
          <el-radio :label=1>{{ info.sexRadio[0] }}</el-radio>
          <el-radio :label=0>{{ info.sexRadio[1] }}</el-radio>
        </el-radio-group>
        <span class="remarks" v-show="info.sexVal == null">{{ info.sexRemarks }}</span>
      </div>
      <!--生日-->
      <div class="form-item">
        <span class="label">{{ info.birthdayLabel }}：</span>
        <el-date-picker
          v-model="info.birthdayVal"
          type="date"
          @change="changeBirthdayDate"
          :picker-options="pickerOptions"
          placeholder="选择日期" />
        <span class="remarks">{{ info.birthdayRemarks }}</span>
      </div>
      <!--邮箱-->
      <div class="form-item">
        <span class="label">{{ info.emailLabel }}：</span>
        <span class="val">{{ user.email || '未绑定' }}</span>
        <span class="editBtn" @click="editEmailMoudle = true">{{ editBtn }}</span>
        <span class="remarks">{{ info.emailRemarks }}</span>
      </div>
    </section>
    <!--修改头像-->
    <avatar-cutter v-show="showCutter"
                   @cancel="showCutter = false"
                   return-type="url"
                   @enter="uploadAvatar"
                   ref="avatarEdit"/>
    <edit-email v-show="editEmailMoudle" @cancel="editEmailMoudle = false"/>
    <edit-password v-show="editPasswordMoudle" @cancel="editPasswordMoudle = false"/>
    <edit-phone v-show="editPhoneMoudle" @cancel="editPhoneMoudle = false"/>
    <edit-name v-show="editNameMoudle" @cancel="editNameMoudle = false"/>
  </div>
</template>

<script>
  import modelCalendar from '@/components/farm-model/farm-calendar-single'
  import AvatarCutter from '@/components/farm-model/farm-avatarCutter'
  import editEmail from '@/components/Pinfo/editInfo/editEmail'
  import editPassword from '@/components/Pinfo/editInfo/editPassword'
  import editPhone from '@/components/Pinfo/editInfo/editPhone'
  import editName from '@/components/Pinfo/editInfo/editName'
  import {
    mapState
  } from 'vuex'
  import {
    editBasicInfo
  } from '@/api/editInfo-api'
  import {
    getInfo
  } from '@/api/api'
  import {
    messageFun,
    setInfo
  } from '@/assets/common.js'

  export default {
    name: 'infoTable',
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > new Date();
          },
        },
        value1: new Date(),
        editBtn: '修改',
        editAvatar: '修改头像',
        info: {
          accountLabel: '账号',
          nameLabel: '昵称',
          passwordLabel: '密码',
          passwordVal: '**************',
          phoneNumLabel: '手机',
          // phoneNumVal: '185****7163',
          sexLabel: '性别',
          sexVal: null,
          sexRadio: ['男', '女'],
          birthdayLabel: '生日',
          birthdayVal: null,
          emailLabel: '邮箱',
          sexRemarks: '（*填写赠送5金币）',
          birthdayRemarks: '（*填写赠送5金币）',
          emailRemarks: '（用于更换手机～还有5金币赠送）'
        },
        showCutter: false, // 是否显示头像裁剪组件
        userInfo: {},
        editEmailMoudle: false,
        editPasswordMoudle: false,
        editPhoneMoudle: false,
        editNameMoudle: false,
      }
    },
    methods: {
      // 修改生日
      async changeBirthdayDate() {
        let data = await editBasicInfo({
          "nickname": null,
          "headImg": null,
          "sex": null,
          "birthday": this.info.birthdayVal.getTime(),
        })
        if (data.data.code == 200) {
          this.$store.commit('changeBirthday', this.info.birthdayVal.getTime())
          messageFun('success', this.$t('message.editSuc'))
        } else if (data.data.code == 999) messageFun('warning', this.$t('message.noTimes'))
      },
      // 修改性别
      async changeSex() {
        let data = await editBasicInfo({
          "nickname": null,
          "headImg": null,
          "sex": this.info.sexVal,
          "birthday": null,
        })
        if (data.data.code == 200) {
          this.$store.commit('changeSex', this.info.sexVal)
          messageFun('success', this.$t('message.editSuc'))
        } else if (data.data.code == 999) messageFun('warning', this.$t('message.noTimes'))
      },
      // 上传裁剪好的头像
      async uploadAvatar(src) {
        let data = await editBasicInfo({
          "nickname": null,
          "headImg": src,
          "sex": null,
          "birthday": null,
        })
        if (data.data.code == 200) {
          this.$store.commit('changeAvatar', src)
          messageFun('success', this.$t('message.editSuc'))
        } else if (data.data.code == 999) messageFun('warning', this.$t('message.noTimes'))
        this.showCutter = false
      },
      // 编辑头像
      avatarEditFun() {
        let input = document.createElement('INPUT')
        input.type = 'file'
        input.accept = '.jpg,.jpeg,.png'
        input.addEventListener('change', event => {
          this.showCutter = true
          this.$refs.avatarEdit.fileChange(event)
        })
        input.click()
      }
    },
    components: {
      AvatarCutter,
      modelCalendar,
      editEmail,
      editPassword,
      editPhone,
      editName
    },
    computed: {
      ...mapState(['user']),
    },
    mounted() {
      this.info.sexVal = this.user.sex
      console.log(this.user)
      this.info.birthdayVal = this.user.birthday ? new Date(this.user.birthday) : null
    }
  }
</script>

<style lang="less" scoped>
  .infoTable-wrapper {
    display: flex;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0px 0px 8px 8px;
    padding: 50px;
    box-sizing: border-box;
    height: calc(100vh - 144px);

    .f {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .avatarBase {
        position: relative;
        width: 140px;
        height: 140px;
        overflow: hidden;
        margin-bottom: 50px;
        background-color: RGBA(234, 239, 254, 1);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        .avatarEdit {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0);
          text-align: center;

          span {
            font-size: 14px;
            line-height: 120px;
            color: rgba(255, 255, 255, 0);
          }
        }

        .avatarImg {
          width: 120px;
          border-radius: 50%;
        }

        &:hover .avatarEdit {
          background-color: rgba(0, 0, 0, 0.7);

          span {
            color: rgba(255, 255, 255, 1);
          }
        }
      }

      .form-item {
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        width: 510px;
        margin-bottom: 20px;

        .label {
          color: rgba(22, 29, 37, 0.59);
        }

        .val {
          color: rgba(22, 29, 37, 1);
          text-shadow: 0px 0px 1px rgba(22, 29, 37, 0.6);
        }

        .editBtn {
          margin-left: 20px;
          font-size: 14px;
          color: rgba(39, 95, 239, 1);
          line-height: 20px;
          cursor: pointer;
          opacity: 0.68;

          &:hover {
            opacity: 0.9;
          }
        }

        .remarks {
          font-size: 12px;
          color: rgba(22, 29, 37, 0.4);
          line-height: 17px;
          margin-left: 20px;
        }

        /deep/ .el-radio__input {
          transform: scale(0.7);
        }

        /deep/ .el-radio__label {
          padding-left: 4px;
        }

        /deep/ .is-checked > .el-radio__label {
          color: rgba(22, 29, 37, 1);
        }
      }
    }
  }
</style>
