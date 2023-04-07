<!--
 * @Author: 库建华
 * @Date: 2019-04-17 13:46:17
 * @LastEditors: 杨曦
 * @LastEditTime: 2023-02-02 15:37:51
 * @Version:
 * @Description:
 -->
<template>
  <el-dialog :close-on-click-modal="false" title="功能授权" :visible.sync="visible" width="800px" @open="open" @close="close">
    <div class="purviewtree2">
      <ul class="modules">
        <li class="module_title">系统模块</li>
        <li
          class="module_li"
          :class="Index==index&&'active'"
          v-for="(item,index) in privilege"
          :key="index"
        >
          <el-checkbox
            v-model="item.select"
            :indeterminate="item.active"
            @change="moduleschange(item,index)"
          />
          <span class="text" @click.stop="Index=index">{{ item.name }}</span>
        </li>
      </ul>
      <ul class="menus">
        <li class="menus_title">资源项</li>
        <li class="menus_li" v-for="(Item,idx) in privilege[Index].children" :key="idx">
          <el-checkbox
            v-model="Item.select"
            :indeterminate="Item.active"
            @change="menuchange(Item)"
          >{{ Item.name }}</el-checkbox>
          <ul v-if="Item.children.length" class="clearfix">
            <li v-for="(item,index) in Item.children" :key="index" class="resources_li">
              <el-checkbox v-model="item.select" @change="itemchange(Item)">{{ item.name }}</el-checkbox>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/api/role'
import mixins from '@/plugin/mixins'

export default {
  props: {
    display: {
      type: Boolean
    },
    infoRole: {
      type: Array
    },
    roleId: {
      type: String
    }
  },
  mixins: [mixins],
  watch: {
    display: function (val) {
      return (this.visible = val)
    }
  },
  data () {
    return {
      visible: false,
      resource: [],
      Index: 0,
      apply_type: [],
      privilege: [
        {
          name: '首页',
          code: 'index',
          active: false,
          select: false,
          children: [
            {
              name: '首页权限管理',
              code: 'index',
              select: false,
              children: [
                {
                  name: '访问首页',
                  code: 'index',
                  select: false
                },
                {
                  name: '首页无效咨询管理',
                  code: 'home_change_effectStatus',
                  select: false
                },
                {
                  name: '首页SPY和删除学员核验',
                  code: 'home_SPY_effectStatus',
                  select: false
                },
                {
                  name: '首页网申日历',
                  code: 'home_showCalendar',
                  select: false
                },
                {
                  name: 'VIP年度KPI的全数据权限',
                  code: 'home_vip_allData',
                  select: false
                }
              ]
            },
            {
              name: '首页节日提醒',
              code: 'index',
              select: false,
              children: [
                {
                  name: '置顶提醒',
                  code: 'home_toTop',
                  select: false
                },
                {
                  name: '置删除提醒',
                  code: 'home_toDelete',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '待办',
          code: 'backlog',
          active: false,
          select: false,
          children: [
            // {
            //   name: "仅自己",
            //   code: "backlog",
            //   select: false
            // },
            // {
            //   name: "选择用户(本人及下属)",
            //   code: "backlog_user",
            //   select: false
            // },
            // {
            //   name: "选择用户(全数据)",
            //   code: "backlog_all_user",
            //   select: false
            // },
          ]
        },
        {
          name: 'VIP',
          code: 'VIP',
          active: false,
          select: false,
          children: [
            {
              name: '导师管理',
              code: 'mentor',
              select: false,
              children: [
                {
                  name: '导师管理',
                  code: 'mentor',
                  select: false
                },
                {
                  name: '字典-升学',
                  code: 'mentor_major',
                  select: false
                },
                {
                  name: '字典-课业辅导',
                  code: 'mentor_subject',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'mentor_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'mentor_select',
                  select: false
                },
                {
                  name: '导出导师筛选列表',
                  code: 'mentor_exportExcel',
                  select: false
                },
                {
                  name: '录入',
                  code: 'mentor_entry',
                  select: false
                },
                {
                  name: '导师推荐情况',
                  code: 'mentor_recommend',
                  select: false
                },
                {
                  name: 'Bonus导师内推面试情况',
                  code: 'mentor_recommend_interview',
                  select: false
                },
                {
                  name: '导出',
                  code: 'mentor_outFile',
                  select: false
                },
                // {
                //   name: "保存",
                //   code: "mentor_save",
                //   select: false
                // },
                {
                  name: '分页',
                  code: 'mentor_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'mentor_edit',
                  select: false
                },
                {
                  name: '账户',
                  code: 'mentor_pay_way',
                  select: false
                },
                {
                  name: '学生',
                  code: 'mentor_mentee',
                  select: false
                },
                {
                  name: '佣金',
                  code: 'mentor_reward',
                  select: false
                },
                {
                  name: '课时',
                  code: 'mentor_lesson_hour',
                  select: false
                },
                {
                  name: '文档',
                  code: 'mentor_file',
                  select: false
                },
                {
                  name: '导师小程序绑定',
                  code: 'mentor_wxConnect',
                  select: false
                },
                // {
                //   name: "绑定",
                //   code: "mentor_bind",
                //   select: false
                // },
                {
                  name: 'VIP导师编辑中WST公司修改',
                  code: 'mentor_edit_wstComapny',
                  select: false
                }
              ]
            },
            {
              name: '导师申请',
              code: 'mentor_website_apply',
              select: false,
              children: [
                {
                  name: '查看导师申请',
                  code: 'mentor_website_apply',
                  select: false
                },
                {
                  name: '预览简历',
                  code: 'mentor_apply_preview',
                  select: false
                },
                {
                  name: '下载简历',
                  code: 'mentor_apply_download',
                  select: false
                }
              ]
            },
            {
              name: '转介绍学生',
              code: 'vipRecommenderList',
              select: false,
              children: [
                {
                  name: '查看转介绍学生',
                  code: 'vipRecommenderList',
                  select: false
                },
                {
                  name: '查看转介绍学生全数据',
                  code: 'vipRecommenderList_allData',
                  select: false
                }
              ]
            },
            {
              name: 'Requesting System',
              code: 'requesting_system',
              select: false,
              children: [
                {
                  name: '查看Requesting System',
                  code: 'requesting_system',
                  select: false
                }
              ]
            },
            // {
            //   name: "导师管理-文档",
            //   code: "mentor",
            //   select: false,
            //   children: [
            //     {
            //       name: "简历",
            //       code: "mentor_mentorFile_resume",
            //       select: false
            //     },
            //     {
            //       name: "合同",
            //       code: "mentor_mentorFile_contract",
            //       select: false
            //     },
            //     {
            //       name: "测试卡",
            //       code: "mentor_mentorFile_test_card",
            //       select: false
            //     }
            //   ]
            // },
            {
              name: '导师管理->学生->学生列表导出',
              code: 'vip_mentor_export_mentee',
              active: false,
              select: false,
              children: []
            },
            {
              name: '导师管理->佣金->导出',
              code: 'vip_mentor_reward_export',
              active: false,
              select: false,
              children: []
            },
            {
              name: '导师管理->课时->课表导出',
              code: 'vip_mentor_export_lesson',
              active: false,
              select: false,
              children: []
            },
            {
              name: '导师管理->文档->ALL',
              code: 'vip_mentor_mentorFile_ALL',
              active: false,
              select: false,
              children: [
                {
                  name: '类型更新',
                  code: 'vip_mentor_mentorFile_ALL_select',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '导师管理->文档->简历',
              code: 'vip_mentor_mentorFile_resume',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'vip_mentor_mentorFile_resume_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'vip_mentor_mentorFile_resume_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_mentor_mentorFile_resume_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'vip_mentor_mentorFile_resume_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '导师管理->文档->合同',
              code: 'vip_mentor_mentorFile_contract',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'vip_mentor_mentorFile_contract_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'vip_mentor_mentorFile_contract_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_mentor_mentorFile_contract_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'vip_mentor_mentorFile_contract_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '导师管理->文档->测试卡',
              code: 'vip_mentor_mentorFile_card',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'vip_mentor_mentorFile_card_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'vip_mentor_mentorFile_card_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_mentor_mentorFile_card_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'vip_mentor_mentorFile_card_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '导师编辑',
              code: 'mentor_edit_list',
              select: false,
              children: [
                // {
                //   name: "搜索",
                //   code: "mentor_search",
                //   select: false
                // }
              ]
            },
            {
              name: '学员管理',
              code: 'mentee',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'mentee_search',
                  select: false
                },
                {
                  name: '所有学员（数据）',
                  code: 'vip_mentee_all_mentee_data',
                  select: false
                },
                {
                  name: '学员筛选',
                  code: 'mentee_new_search',
                  select: false
                },
                {
                  name: '选择',
                  code: 'mentee_select',
                  select: false
                },
                {
                  name: 'VIP各项统计',
                  code: 'mentee_check_information',
                  select: false
                },
                {
                  name: 'VIP学员项目到期统计',
                  code: 'mentee_check_deadline_information',
                  select: false
                },
                {
                  name: '申请季未设置',
                  code: 'mentee_apply_season_no_set',
                  select: false
                },
                {
                  name: '申请季进度',
                  code: 'mentee_apply_season_process',
                  select: false
                },
                {
                  name: 'VIP预排课入口',
                  code: 'mentee_check_lessons',
                  select: false
                },
                {
                  name: 'VIP预排课全数据',
                  code: 'home_vip_checklessons_allData',
                  select: false
                },
                {
                  name: '导师对接任务核验',
                  code: 'vip_docking_check',
                  select: false
                },
                {
                  name: '新增导师对接任务',
                  code: 'vip_docking_add',
                  select: false
                },
                {
                  name: 'VIP拉群一览入口',
                  code: 'vip_to_create',
                  select: false
                },
                {
                  name: 'VIP签约拉群公示栏入口',
                  code: 'vip_to_vipShow',
                  select: false
                },
                {
                  name: 'VIP转介绍入口',
                  code: 'vip_to_vipRecommender',
                  select: false
                },
                {
                  name: 'VIP学生订单入口',
                  code: 'vip_tomentee_order',
                  select: false
                },
                {
                  name: 'VIP拉群一览设置',
                  code: 'vip_create_set',
                  select: false
                },
                {
                  name: '签约',
                  code: 'mentee_sign',
                  select: false
                },
                {
                  name: '课程列表',
                  code: 'mentee_lesson',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'lesson_all_data',
                  select: false
                },
                {
                  name: '追踪',
                  code: 'mentee_follow',
                  select: false
                },
                {
                  name: '分页',
                  code: 'mentee_page',
                  select: false
                },
                {
                  name: '项目价格(展示)',
                  code: 'mentee_program_price',
                  select: false
                },
                {
                  name: 'Sales上传的合同预览',
                  code: 'mentee_program_contract_view_original',
                  select: false
                },
                {
                  name: 'Sales上传的合同下载',
                  code: 'mentee_program_contract_download_original',
                  select: false
                },
                {
                  name: 'VIP合同预览',
                  code: 'mentee_program_contract_view_accessory',
                  select: false
                },
                {
                  name: 'VIP合同下载',
                  code: 'mentee_program_contract_download_accessory',
                  select: false
                },
                {
                  name: '合同上传',
                  code: 'mentee_program_contract_upload',
                  select: false
                },
                {
                  name: '学员账户管理',
                  code: 'sales_assistant_user',
                  select: false
                },
                {
                  name: '查看学员事件',
                  code: 'vip_event',
                  select: false
                },
                {
                  name: '申请季新增',
                  code: 'vip_sign_apply_add',
                  select: false
                },
                {
                  name: '申请季编辑',
                  code: 'vip_sign_apply_edit',
                  select: false
                },
                {
                  name: '申请季删除',
                  code: 'vip_sign_apply_delete',
                  select: false
                },
                {
                  name: '申请季查看',
                  code: 'vip_apply_season_file_check',
                  select: false
                },
                {
                  name: '申请季下载',
                  code: 'vip_apply_season_file_download',
                  select: false
                }
              ]
            },
            {
              name: '学员管理Mini',
              code: 'mentee_new',
              active: false,
              select: false,
              children: []
            },
            {
              name: '学员分配',
              code: 'mentee_change',
              active: false,
              select: false,
              children: [
                {
                  name: '学员分配',
                  code: 'mentee_change',
                  select: false
                },
                // {
                //   name: "搜索",
                //   code: "mentee_change_search",
                //   select: false
                // },
                {
                  name: '客服全数据',
                  code: 'mentee_change_all_services_data',
                  select: false
                },
                {
                  name: '导师全数据',
                  code: 'mentee_change_all_strategist_data',
                  select: false
                },
                {
                  name: '更换客服',
                  code: 'mentee_change_services',
                  select: false
                },
                {
                  name: '更换导师',
                  code: 'mentee_change_strategist',
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->ALL',
              code: 'vip_mentee_menteeFile_ALL',
              active: false,
              select: false,
              children: [
                {
                  name: '类型更新',
                  code: 'vip_mentee_menteeFile_ALL_select',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->简历',
              code: 'vip_mentee_menteeFile_resume',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'vip_mentee_menteeFile_resume_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'vip_mentee_menteeFile_resume_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_mentee_menteeFile_resume_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'vip_mentee_menteeFile_resume_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->其他',
              code: 'vip_mentee_menteeFile_other',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'vip_mentee_menteeFile_other_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'vip_mentee_menteeFile_other_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_mentee_menteeFile_other_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'vip_mentee_menteeFile_other_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学员信息',
              code: 'mentee_information',
              select: false,
              action: false,
              children: [
                {
                  name: '编辑',
                  code: 'mentee_information_edit',
                  select: false
                },
                {
                  name: '文件',
                  code: 'mentee_information_file',
                  select: false
                },
                {
                  name: '内推',
                  code: 'mentee_information_recommand',
                  select: false
                },
                {
                  name: 'follow规则',
                  code: 'mentee_information_follow',
                  select: false
                }
              ]
            },

            {
              name: '学员管理->学员信息->官网设置',
              code: 'mentee_website_setting',
              select: false,
              action: false,
              children: [
                {
                  name: '创建账户',
                  code: 'mentee_website_setting_createAccount',
                  select: false
                },
                {
                  name: '重置密码',
                  code: 'mentee_website_setting_setPassword',
                  select: false
                },
                {
                  name: '设置课程',
                  code: 'mentee_website_setting_setCourse',
                  select: false
                }
              ]
            },
            {
              name: '学员管理->基础项目',
              code: 'base_program_information',
              select: false,
              action: false,
              children: [
                {
                  name: '总览',
                  code: 'mentee_base_program_total',
                  select: false
                },
                {
                  name: '设置目标',
                  code: 'mentee_base_program_set_target',
                  select: false
                },
                {
                  name: '设置VIP',
                  code: 'mentee_base_program_set_VIP',
                  select: false
                },
                {
                  name: '设置升学导师',
                  code: 'mentee_base_program_set_edu_mentor',
                  select: false
                },
                {
                  name: '设置求职导师',
                  code: 'mentee_base_program_set_mentor',
                  select: false
                },
                {
                  name: '排课',
                  code: 'mentee_base_program_set_lesson',
                  select: false
                },
                {
                  name: '修改学员评分',
                  code: 'mentee_base_program_set_feedback_star',
                  select: false
                },
                {
                  name: '导出学员Report课表',
                  code: 'mentee_detail_lesson_downLoad',
                  select: false
                },
                {
                  name: '面试登记',
                  code: 'mentee_base_program_add_interview',
                  select: false
                },
                {
                  name: 'offer登记',
                  code: 'mentee_base_program_add_offer',
                  select: false
                },
                {
                  name: '发起退款',
                  code: 'mentee_base_program_refund',
                  select: false
                },
                {
                  name: '更新签约信息',
                  code: 'mentee_base_program_update',
                  select: false
                },
                {
                  name: '更新进度',
                  code: 'mentee_base_program_done',
                  select: false
                },
                {
                  name: '项目完成',
                  code: 'mentee_base_program_finish',
                  select: false
                }
              ]
            },
            {
              name: '学员管理->实习项目',
              code: 'internship_program_information',
              select: false,
              action: false,
              children: [
                {
                  name: '总览',
                  code: 'mentee_internship_program_total',
                  select: false
                },
                {
                  name: '实习',
                  code: 'mentee_internship_program_set_internship',
                  select: false
                },
                {
                  name: '发起退款',
                  code: 'mentee_internship_program_refund',
                  select: false
                },
                {
                  name: '项目完成',
                  code: 'mentee_internship_program_finish',
                  select: false
                }
              ]
            },
            {
              name: '实习管理',
              code: 'internship',
              active: false,
              select: false,
              children: [
                {
                  name: '实习管理',
                  code: 'internship',
                  select: false
                },
                {
                  name: '实习单位筛选',
                  code: 'internship_unit_select',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'internship_search',
                  select: false
                },
                // {
                //   name: "GO",
                //   code: "internship_search",
                //   select: false
                // },
                {
                  name: '分页',
                  code: 'internship_page',
                  select: false
                },
                {
                  name: '查看实习单位下的学员',
                  code: 'internship_see_mentee',
                  select: false
                },
                {
                  name: '更新学员offer凭证',
                  code: 'internship_voucher_update',
                  select: false
                }
              ]
            },
            {
              name: '规划导师文书修改',
              code: 'mentee_file',
              active: false,
              select: false,
              children: [
                {
                  name: '规划导师文书修改',
                  code: 'mentee_file',
                  select: false
                },
                {
                  name: '文书修改(新)',
                  code: 'mentee_file_mentor',
                  select: false
                },
                {
                  name: '文书修改全数据',
                  code: 'mentee_file_all_data',
                  select: false
                },
                {
                  name: '文书筛选',
                  code: 'mentee_file_select',
                  select: false
                },
                {
                  name: 'GO',
                  code: 'mentee_file_search',
                  select: false
                },
                {
                  name: '文书修改统计',
                  code: 'mentee_file_statistics',
                  select: false
                },
                {
                  name: '分页',
                  code: 'mentee_file_page',
                  select: false
                },
                {
                  name: '文书修改申请',
                  code: 'mentee_file_add',
                  select: false
                },
                {
                  name: '文书修改详情',
                  code: 'mentee_file_detail',
                  select: false
                },
                {
                  name: '文书修改文件下载',
                  code: 'mentee_file_detail_file_download',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '行业导师文书修改',
              code: 'mentee_file_mentor',
              active: false,
              select: false,
              children: [
                {
                  name: '查看',
                  code: 'mentee_file_mentor',
                  select: false
                },
                {
                  name: '查看（全数据）',
                  code: 'mentee_file_mentor_all_data',
                  select: false
                },
                {
                  name: '编辑文书任务',
                  code: 'mentee_file_mentor_edit',
                  select: false
                },
                {
                  name: '取消文书任务',
                  code: 'mentee_file_mentor_delete',
                  select: false
                },
                {
                  name: '预览文书文件',
                  code: 'mentee_file_mentor_preview',
                  select: false
                },
                {
                  name: '下载文书文件',
                  code: 'mentee_file_mentor_down',
                  select: false
                },
                {
                  name: '文书修改申请',
                  code: 'mentee_file_resume_apply',
                  select: false
                },
                {
                  name: '文书修改佣金申请',
                  code: 'mentee_file_rebate_apply',
                  select: false
                }
              ]
            },
            // {
            //   name: "导师佣金到账确认",
            //   code: `mentor_pay`,
            //   active: false,
            //   select: false,
            //   children: [
            //     {
            //       name: "导师佣金到账确认",
            //       code: "mentor_pay",
            //       select: false
            //     },
            //     {
            //       name: "VIP筛选",
            //       code: "mentor_pay_mentee_select",
            //       select: false
            //     },
            //     {
            //       name: "导师筛选",
            //       code: "mentor_pay_mentor_select",
            //       select: false
            //     },
            //     // {
            //     //   name: "是否确认到账筛选",
            //     //   code: "mentor_pay_confirmStatus_select",
            //     //   select: false
            //     // },
            //     {
            //       name: "GO",
            //       code: "mentor_pay_mentee_search",
            //       select: false
            //     },
            //     {
            //       name: "分页",
            //       code: "mentor_pay_page",
            //       select: false
            //     },
            //     // {
            //     //   name: "佣金申请提交",
            //     //   code: "mentor_pay_submit",
            //     //   select: false
            //     // }
            //   ]
            // },
            {
              name: '导师到账确认',
              code: 'mentor_payment_extra',
              active: false,
              select: false,
              children: [
                {
                  name: '导师课时佣金',
                  code: 'mentor_payment_extra_0_tab',
                  select: false
                },
                {
                  name: '导师课时佣金-全数据',
                  code: 'mentor_payment_extra_0_allData',
                  select: false
                },
                {
                  name: '行业导师薪资',
                  code: 'mentor_payment_extra_1_tab',
                  select: false
                },
                {
                  name: '行业导师薪资-全数据',
                  code: 'mentor_payment_extra_1_allData',
                  select: false
                },
                {
                  name: '升学导师薪资',
                  code: 'mentor_payment_extra_2_tab',
                  select: false
                },
                {
                  name: '升学导师薪资-全数据',
                  code: 'mentor_payment_extra_2_allData',
                  select: false
                },
                {
                  name: '导师年度Bonus Offer',
                  code: 'mentor_payment_extra_3_tab',
                  select: false
                },
                {
                  name: '导师年度Bonus Offer-全数据',
                  code: 'mentor_payment_extra_3_allData',
                  select: false
                },
                {
                  name: '导师年度Bonus 面试',
                  code: 'mentor_payment_extra_6_tab',
                  select: false
                },
                {
                  name: '导师年度Bonus 面试-全数据',
                  code: 'mentor_payment_extra_6_allData',
                  select: false
                },
                {
                  name: '导师推荐费',
                  code: 'mentor_payment_extra_4_tab',
                  select: false
                },
                {
                  name: '导师推荐费-全数据',
                  code: 'mentor_payment_extra_4_allData',
                  select: false
                },
                {
                  name: '导师自助提现',
                  code: 'mentor_payment_extra_5_tab',
                  select: false
                },
                {
                  name: '导师自助提现-全数据',
                  code: 'mentor_payment_extra_5_allData',
                  select: false
                }
                // {
                //   name: "VIP筛选",
                //   code: "mentor_payment_extra_mentee_select",
                //   select: false
                // },
                // {
                //   name: "导师筛选",
                //   code: "mentor_payment_extra_mentor_select",
                //   select: false
                // },
                // {
                //   name: "是否确认到账筛选",
                //   code: "mentor_payment_extra_confirmStatus_select",
                //   select: false
                // },
                // {
                //   name: "GO",
                //   code: "mentor_payment_extra_mentee_search",
                //   select: false
                // },
                // {
                //   name: "分页",
                //   code: "mentor_payment_extra_page",
                //   select: false
                // },
                // {
                //   name: "佣金申请提交",
                //   code: "mentor_payment_extra_submit",
                //   select: false
                // }
              ]
            },
            {
              name: '导师佣金规则',
              code: 'mentor_price_rule',
              active: false,
              select: false,
              children: [
                {
                  name: '导师佣金规则',
                  code: 'mentor_price_rule',
                  select: false
                },
                {
                  name: '新增',
                  code: 'mentor_price_rule_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'mentor_price_rule_edit',
                  select: false
                }
              ]
            },
            {
              name: '导师佣金付款',
              code: 'mentor_pay_cashier',
              active: false,
              select: false,
              children: [
                {
                  name: '导师佣金查看模块权限',
                  code: 'mentor_pay_cashier_check',
                  select: false
                },
                {
                  name: '导师佣金支付模块权限',
                  code: 'mentor_pay_cashier_pay',
                  select: false
                }
              ]
            },

            {
              name: '实习单位付款',
              code: 'internship_cashier',
              active: false,
              select: false,
              children: []
            },
            {
              name: '行业课程反馈',
              code: 'feedback',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'feedback_search',
                  select: false
                },
                {
                  name: '分页',
                  code: 'feedback_page',
                  select: false
                }
              ]
            },
            {
              name: 'VIP课程反馈',
              code: 'VIP_feedback',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'VIP_feedback_search',
                  select: false
                },
                {
                  name: '分页',
                  code: 'VIP_feedback_page',
                  select: false
                }
              ]
            },
            {
              name: 'VIP课程记录',
              code: 'vip_lesson',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'vip_lesson_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'vip_lesson_select',
                  select: false
                },
                {
                  name: '数量统计',
                  code: 'vip_lesson_statistics',
                  select: false
                },
                {
                  name: '分页',
                  code: 'vip_lesson_page',
                  select: false
                }
              ]
            },
            {
              name: '学员问卷调查',
              code: 'mentee_question',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'mentee_question_search',
                  select: false
                },
                {
                  name: '导师筛选',
                  code: 'mentee_question_select',
                  select: false
                },
                {
                  name: '分页',
                  code: 'mentee_question_page',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'mentee_question_all_data',
                  select: false
                },
                {
                  name: '设置问卷',
                  code: 'mentee_question_setQuestion',
                  select: false
                }
              ]
            },
            {
              name: 'newsletter',
              code: 'news_letter',
              active: false,
              select: false,
              children: [
                {
                  name: '分页',
                  code: 'news_letter_page',
                  select: false
                },
                {
                  name: '新增',
                  code: 'news_letter_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'news_letter_edit',
                  select: false
                },
                {
                  name: '邮件测试',
                  code: 'news_letter_test_send',
                  select: false
                },
                {
                  name: '删除',
                  code: 'news_letter_delete',
                  select: false
                },
                {
                  name: '邮件',
                  code: 'news_letter_receipt',
                  select: false
                }
              ]
            },
            {
              name: 'NewsLetter 2.0',
              code: 'news_letter_new',
              active: false,
              select: false,
              children: [
                {
                  name: '新增',
                  code: 'news_letter_new_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'news_letter_new_edit',
                  select: false
                },

                {
                  name: '删除',
                  code: 'news_letter_new_delete',
                  select: false
                }
              ]
            },
            {
              name: '线下课',
              code: 'seminar',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'seminar_search',
                  select: false
                },
                // {
                //   name: "筛选",
                //   code: "seminar_select",
                //   select: false
                // },
                {
                  name: '分页',
                  code: 'seminar_page',
                  select: false
                },
                {
                  name: '新增',
                  code: 'seminar_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'seminar_edit',
                  select: false
                },
                {
                  name: '课程',
                  code: 'seminar_session',
                  select: false
                },
                {
                  name: '邀请码',
                  code: 'seminar_invitation_code',
                  select: false
                },
                {
                  name: '删除',
                  code: 'seminar_delete',
                  select: false
                },
                {
                  name: '学员列表',
                  code: 'seminar_students',
                  select: false
                }
              ]
            },
            {
              name: 'follow up',
              code: 'VIP_follow_up',
              active: false,
              select: false,
              children: [
                {
                  name: 'follow up',
                  code: 'VIP_follow_up',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'VIP_follow_up_ALL_Data',
                  select: false
                }
              ]
            },
            {
              name: '已follow',
              code: 'VIP_followed_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'VIP_followed_list',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'vip_doed_follow_up_all_data',
                  select: false
                }
              ]
            },
            {
              name: '未follow',
              code: 'VIP_no_follow_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'VIP_no_follow_list',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'vip_no_follow_up_all_data',
                  select: false
                }
              ]
            },
            {
              name: 'VIP求职Offer核验',
              code: 'vip_offer_hm_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'vip_offer_hm_list',
                  select: false
                },
                {
                  name: '核验按钮权限',
                  code: 'vip_offer_hm_list_setting',
                  select: false
                },
                {
                  name: '查看凭证权限',
                  code: 'vip_offer_hm_list_view_hm',
                  select: false
                },
                {
                  name: '查看好评图权限',
                  code: 'vip_offer_hm_list_down_hm',
                  select: false
                },
                {
                  name: '下载凭证权限',
                  code: 'vip_offer_hm_list_img_view_hm',
                  select: false
                },
                {
                  name: '下载好评图权限',
                  code: 'vip_offer_hm_list_img_down_hm',
                  select: false
                },
                {
                  name: '修改官网展示权限',
                  code: 'vip_offer_hm_list_settingPcWatch',
                  select: false
                }
              ]
            },
            {
              name: 'VIP升学Offer核验',
              code: 'vip_offer_edu_hm_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'vip_offer_edu_hm_list',
                  select: false
                },
                {
                  name: '核验按钮权限',
                  code: 'vip_offer_edu_hm_list_setting',
                  select: false
                },
                {
                  name: '查看凭证权限',
                  code: 'vip_offer_edu_hm_list_view_hm',
                  select: false
                },
                {
                  name: '查看好评图权限',
                  code: 'vip_offer_edu_hm_list_down_hm',
                  select: false
                },
                {
                  name: '下载凭证权限',
                  code: 'vip_offer_edu_hm_list_img_view_hm',
                  select: false
                },
                {
                  name: '下载好评图权限',
                  code: 'vip_offer_edu_hm_list_img_down_hm',
                  select: false
                },
                {
                  name: '修改官网展示权限',
                  code: 'vip_offer_hm_edu_list_settingPcWatch',
                  select: false
                }
              ]
            },
            {
              name: 'VIP面试核验',
              code: 'vip_InterviewHM',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'vip_InterviewHM',
                  select: false
                },
                {
                  name: '核验按钮权限',
                  code: 'vip_interview_hm_list_setting',
                  select: false
                },
                {
                  name: '面试凭证查看权限',
                  code: 'vip_interview_hm_list_view_hm',
                  select: false
                },
                {
                  name: '面试凭证下载权限',
                  code: 'vip_interview_hm_list_down_hm',
                  select: false
                },
                {
                  name: '修改官网展示权限',
                  code: 'vip_interView_hm_list_settingPcWatch',
                  select: false
                },
                {
                  name: '核验凭证上传权限',
                  code: 'vip_offer_list_img_up',
                  select: false
                },
                {
                  name: '核验面经显示修改权限',
                  code: 'vip_interview_hm_list_changeStoryStatus',
                  select: false
                }
              ]
            },
            {
              name: '申请季进度',
              code: 'vip_apply_season',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'vip_apply_season',
                  select: false
                },
                {
                  name: '新增',
                  code: 'vip_apply_season_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'vip_apply_season_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'vip_apply_season_delete',
                  select: false
                }

              ]
            },
            {
              name: '导师佣金申请',
              code: 'apply_for_batch',
              active: false,
              select: false,
              children: [
                {
                  name: '查看页面',
                  code: 'apply_for_batch',
                  select: false
                }
              ]
            },
            {
              name: '书架',
              code: 'bookshelf',
              active: false,
              select: false,
              children: [
                {
                  name: '查看书架',
                  code: 'bookshelf',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '销售助理管理',
          code: 'sales_assistant',
          active: false,
          select: false,
          children: [
            {
              name: '学生录入',
              code: 'sales_assistant',
              active: false,
              select: false,
              children: [
                {
                  name: '全数据',
                  code: 'sales_assistant_ALL_Data',
                  select: false
                },
                {
                  name: '销售助理无效咨询数权限',
                  code: 'sales_assistant_ineffectiveNum',
                  select: false
                },
                {
                  name: '销售助理拉给顾问总数权限',
                  code: 'sales_assistant_totalNum',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'sales_assistant_search',
                  select: false
                },
                {
                  name: '录入',
                  code: 'sales_assistant_entry',
                  select: false
                },
                {
                  name: '导出',
                  code: 'sales_assistant_outFile',
                  select: false
                },
                {
                  name: '销售助理查看本月累计值班',
                  code: 'sales_assistant_currentMonth',
                  select: false
                },
                {
                  name: '销售助理修改学员有效咨询状态',
                  code: 'sales_assistant_changeConsulting',
                  select: false
                },
                {
                  name: '销售助理修改渠道和来源权限',
                  code: 'edit_channel_asisstent',
                  select: false
                },
                {
                  name: '分页',
                  code: 'sales_assistant_page',
                  select: false
                },
                {
                  name: '删除',
                  code: 'sales_assistant_del',
                  select: false
                }

              ]
            },
            {
              name: '分配顾问历史',
              code: 'allocateHis',
              active: false,
              select: false,
              children: [
                {
                  name: '查看列表',
                  code: 'allocateHis',
                  active: false,
                  select: false
                },
                {
                  name: '列表分页（未分配此权限时仅看到50条）',
                  code: 'allocateHis_pagination',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->ALL',
              code: 'assistant_mentee_menteeFile_ALL',
              active: false,
              select: false,
              children: [
                {
                  name: '类型更新',
                  code: 'assistant_mentee_menteeFile_ALL_select',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->简历',
              code: 'assistant_mentee_menteeFile_resume',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'assistant_mentee_menteeFile_resume_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'assistant_mentee_menteeFile_resume_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'assistant_mentee_menteeFile_resume_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'assistant_mentee_menteeFile_resume_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->其他',
              code: 'assistant_mentee_menteeFile_other',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'assistant_mentee_menteeFile_other_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'assistant_mentee_menteeFile_other_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'assistant_mentee_menteeFile_other_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'assistant_mentee_menteeFile_other_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: 'follow up',
              code: 'assistant_follow_up',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'assistant_follow_up_search',
                  select: false
                },
                {
                  name: '导出',
                  code: 'assistant_follow_up_outFile',
                  select: false
                },
                {
                  name: '分页',
                  code: 'assistant_follow_up_page',
                  select: false
                },
                {
                  name: 'follow up全数据',
                  code: 'follow_up_ALL_Data',
                  select: false
                }
              ]
            },

            {
              name: '渠道来源',
              code: 'channel',
              active: false,
              select: false,
              children: [
                {
                  name: '新增',
                  code: 'channel_add',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'channel_edit',
                  select: false
                },
                {
                  name: '来源列表',
                  code: 'channel_subChannel',
                  select: false
                },
                {
                  name: '删除',
                  code: 'channel_delete',
                  select: false
                },
                {
                  name: '查看学生列表',
                  code: 'channel_mentee_list',
                  select: false
                },
                {
                  name: '新增固定返佣来源规则',
                  code: 'channel_rule_add',
                  select: false
                },
                {
                  name: '编辑固定返佣来源规则',
                  code: 'channel_rule_edit',
                  select: false
                },
                {
                  name: '删除固定返佣来源规则',
                  code: 'channel_rule_delete',
                  select: false
                }
              ]
            },
            {
              name: '未follow列表',
              code: 'assistant_no_follow_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看',
                  code: 'assistant_no_follow_list',
                  select: false
                },
                {
                  name: '未follow up全数据',
                  code: 'no_follow_up_ALL_Data',
                  select: false
                }
              ]
            },
            {
              name: '已follow列表',
              code: 'assistant_followed_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看',
                  code: 'assistant_followed_list',
                  select: false
                },
                {
                  name: '已follow up全数据',
                  code: 'doed_follow_up_ALL_Data',
                  select: false
                }
              ]
            }
          ]
        },

        {
          name: '销售管理',
          code: 'sales',
          active: false,
          select: false,
          children: [
            {
              name: '学生管理',
              code: 'client_tracking',
              active: false,
              select: false,
              children: [
                {
                  name: '全数据',
                  code: 'client_tracking_ALL_Data',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'client_tracking_search',
                  select: false
                },
                {
                  name: '录入按钮',
                  code: 'client_tracking_entry',
                  select: false
                },
                {
                  name: '签约',
                  code: 'client_tracking_signing',
                  select: false
                },
                {
                  name: '跟进',
                  code: 'client_tracking_follow',
                  select: false
                },
                {
                  name: '查看学员事件',
                  code: 'client_tracking_event',
                  select: false
                },
                {
                  name: '销售修改咨询状态',
                  code: 'client_tracking_changeStatus',
                  select: false
                },
                {
                  name: '导出',
                  code: 'client_tracking_outFile',
                  select: false
                },
                {
                  name: '筛选Pretalk',
                  code: 'client_tracking_pretalkShow',
                  select: false
                },
                {
                  name: 'Pretalk评价全数据',
                  code: 'client_tracking_pretalk_feedback',
                  select: false
                },
                {
                  name: '分页',
                  code: 'client_tracking_page',
                  select: false
                },
                {
                  name: '删除',
                  code: 'client_tracking_del',
                  select: false
                },
                {
                  name: '创建学员',
                  code: 'client_tracking_addMentee',
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->ALL',
              code: 'sales_mentee_menteeFile_ALL',
              active: false,
              select: false,
              children: [
                {
                  name: '类型更新',
                  code: 'sales_mentee_menteeFile_ALL_select',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->简历',
              code: 'sales_mentee_menteeFile_resume',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'sales_mentee_menteeFile_resume_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'sales_mentee_menteeFile_resume_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'sales_mentee_menteeFile_resume_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'sales_mentee_menteeFile_resume_upload',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '学员管理->学生文档->其他',
              code: 'sales_mentee_menteeFile_other',
              active: false,
              select: false,
              children: [
                {
                  name: '预览',
                  code: 'sales_mentee_menteeFile_other_view',
                  active: false,
                  select: false
                },
                {
                  name: '下载',
                  code: 'sales_mentee_menteeFile_other_download',
                  active: false,
                  select: false
                },
                {
                  name: '删除',
                  code: 'sales_mentee_menteeFile_other_delete',
                  active: false,
                  select: false
                },
                {
                  name: '上传',
                  code: 'sales_mentee_menteeFile_other_upload',
                  active: false,
                  select: false
                }
              ]
            },

            {
              name: '销售工作日',
              code: 'sales_list',
              active: false,
              select: false,
              children: []
            },
            {
              name: 'follow up',
              code: 'follow_up',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'follow_up_search',
                  select: false
                },
                {
                  name: 'follow up全数据',
                  code: 'follow_up_all_data',
                  select: false
                },
                {
                  name: '录入',
                  code: 'follow_up_entry',
                  select: false
                },
                {
                  name: '跟进',
                  code: 'follow_up_follow',
                  select: false
                },
                {
                  name: '导出',
                  code: 'follow_up_outFile',
                  select: false
                },
                {
                  name: '分页',
                  code: 'follow_up_page',
                  select: false
                }
              ]
            },
            {
              name: '订单管理',
              code: 'order',
              active: false,
              select: false,
              children: [
                {
                  name: '全数据',
                  code: 'order_all_mentee_data',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'order_search',
                  select: false
                },
                {
                  name: '保存',
                  code: 'order_save',
                  select: false
                },
                {
                  name: '导出',
                  code: 'order_outFile',
                  select: false
                },
                {
                  name: '分页',
                  code: 'order_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'order_edit',
                  select: false
                },
                {
                  name: '渠道编码设置',
                  code: 'order_setSourceChannel',
                  select: false
                },
                {
                  name: 'pretalk设置',
                  code: 'order_setPretalk',
                  select: false
                },
                {
                  name: '入账',
                  code: 'order_account',
                  select: false
                },
                {
                  name: '删除',
                  code: 'order_del',
                  select: false
                },
                {
                  name: '创建线上支付',
                  code: 'order_entry',
                  select: false
                },
                {
                  name: 'Sales上传的合同预览',
                  code: 'order_contract_view_original',
                  select: false
                },
                {
                  name: 'Sales上传的合同下载',
                  code: 'order_contract_download_original',
                  select: false
                },
                {
                  name: 'VIP合同预览',
                  code: 'order_contract_view_accessory',
                  select: false
                },
                {
                  name: 'VIP合同下载',
                  code: 'order_contract_download_accessory',
                  select: false
                },
                {
                  name: '合同上传',
                  code: 'order_contract_upload',
                  select: false
                },
                {
                  name: '订单详情-编辑发票',
                  code: 'edit_order_invoice',
                  select: false
                },
                {
                  name: '订单页面顶部销售及其下属kpi详情',
                  code: 'sales_order_kpi',
                  select: false
                }
              ]
            },
            {
              name: '礼品管理',
              code: 'gift',
              active: false,
              select: false,
              children: [
                {
                  name: '礼品管理',
                  code: 'gift',
                  select: false
                },
                {
                  name: '新增',
                  code: 'gift_add',
                  select: false
                }
              ]
            },
            {
              name: '发票管理',
              code: 'invoice',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'invoice_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'invoice_select',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'invoice_All_Data',
                  select: false
                },
                {
                  name: '分页',
                  code: 'invoice_page',
                  select: false
                },
                {
                  name: '下载',
                  code: 'invoice_download',
                  select: false
                }
              ]
            },
            {
              name: '试听码',
              code: 'accessCode',
              active: false,
              select: false,
              children: [
                {
                  name: '查看试听码列表',
                  code: 'accessCode',
                  select: false
                },
                {
                  name: '试听码新增',
                  code: 'accessCode_add',
                  select: false
                },
                {
                  name: '试听码编辑',
                  code: 'accessCode_edit',
                  select: false
                }
              ]
            },
            {
              name: '送出礼品列表',
              code: 'gift_send_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看礼品列表',
                  code: 'gift_send_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '礼品编辑(订单管理-详情也可使用此权限)',
                  code: 'modify_gift',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '未follow列表',
              code: 'sales_no_follow_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看',
                  code: 'sales_no_follow_list',
                  select: false
                },
                {
                  name: '未follow up全数据',
                  code: 'sales_no_follow_up_all_data',
                  select: false
                }
              ]
            },
            {
              name: '已follow列表',
              code: 'sales_followed_list',
              active: false,
              select: false,
              children: [
                {
                  name: '查看',
                  code: 'sales_followed_list',
                  select: false
                },
                {
                  name: '已follow up全数据',
                  code: 'sales_doed_follow_up_all_data',
                  select: false
                }
              ]
            },
            {
              name: '实习一览',
              code: 'internship_sales',
              active: false,
              select: false,
              children: [
                {
                  name: '访问实习一览',
                  code: 'internship_sales',
                  select: false
                },
                {
                  name: '实习一览导出',
                  code: 'internship_down_out',
                  select: false
                },
                {
                  name: '公告设置',
                  code: 'internship_setting',
                  select: false
                },
                {
                  name: '实习一览Non-VIP金额权限',
                  code: 'sales_noVip_check',
                  select: false
                }
              ]
            },
            {
              name: '补充协议管理',
              code: 'sales_agreement_model',
              active: false,
              select: false,
              children: [
                {
                  name: '访问补充协议管理',
                  code: 'sales_agreement_model',
                  select: false
                },
                {
                  name: '新增补充协议',
                  code: 'sales_agreement_model_add',
                  select: false
                },
                {
                  name: '编辑补充协议',
                  code: 'sales_agreement_model_edit',
                  select: false
                },
                {
                  name: '删除补充协议',
                  code: 'sales_agreement_model_delete',
                  select: false
                }
              ]
            },
            {
              name: '数据分析',
              code: 'sales_data_analysis',
              active: false,
              select: false,
              children: [
                {
                  name: '导出销售数据',
                  code: 'sales_data_analysis_export',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '项目管理',
          code: 'program',
          active: false,
          select: false,
          children: [
            {
              name: '基础项目',
              code: 'program',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'program_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'program_new',
                  select: false
                },
                {
                  name: '公共模板设置',
                  code: 'program_common_set',
                  select: false
                },
                {
                  name: '项目拷贝',
                  code: 'program_copy',
                  select: false
                },
                {
                  name: '分页',
                  code: 'program_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'program_edit',
                  select: false
                },
                {
                  name: '课程设置',
                  code: 'program_set_course',
                  select: false
                },
                {
                  name: '删除',
                  code: 'program_del',
                  select: false
                }
              ]
            },
            {
              name: '续课项目',
              code: 'continual',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'continual_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'continual_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'continual_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'continual_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'continual_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'continual_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'continual_del',
                  select: false
                }
              ]
            },
            {
              name: '延长项目',
              code: 'extension',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'extension_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'extension_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'extension_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'extension_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'extension_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'extension_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'extension_del',
                  select: false
                }
              ]
            },
            {
              name: '财商项目',
              code: 'finance',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'finance_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'finance_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'finance_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'finance_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'finance_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'finance_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'finance_del',
                  select: false
                }
              ]
            },
            {
              name: '杰创项目',
              code: 'jc_pro',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'jc_pro_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'jc_pro_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'jc_pro_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'jc_pro_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'jc_pro_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'jc_pro_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'jc_pro_del',
                  select: false
                }
              ]
            },
            {
              name: '实习项目',
              code: 'internship_program',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'internship_program_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'internship_program_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'internship_program_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'internship_program_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'internship_program_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'internship_program_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'internship_program_del',
                  select: false
                }
              ]
            },
            {
              name: '暂停项目',
              code: 'suspend',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'suspend_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'suspend_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'suspend_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'suspend_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'suspend_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'suspend_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'suspend_del',
                  select: false
                }
              ]
            },
            {
              name: 'CFA项目',
              code: 'cfa',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'cfa_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'cfa_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'cfa_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'cfa_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'cfa_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'cfa_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'cfa_del',
                  select: false
                }
              ]
            },
            {
              name: '口语项目',
              code: 'oral',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'oral_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'oral_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'oral_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'oral_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'oral_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'oral_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'oral_del',
                  select: false
                }
              ]
            },
            {
              name: '申研项目',
              code: 'graduate',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'graduate_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'graduate_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'graduate_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'graduate_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'graduate_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'graduate_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'graduate_del',
                  select: false
                }
              ]
            },
            {
              name: '辅导项目',
              code: 'tutoring',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'tutoring_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'tutoring_new',
                  select: false
                },
                {
                  name: '排序',
                  code: 'tutoring_sort',
                  select: false
                },
                {
                  name: '分页',
                  code: 'tutoring_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'tutoring_edit',
                  select: false
                },
                {
                  name: '图片',
                  code: 'tutoring_pic',
                  select: false
                },
                {
                  name: '删除',
                  code: 'tutoring_del',
                  select: false
                }
              ]
            },
            {
              name: '补充协议模板',
              code: 'supplementary',
              active: false,
              select: false,
              children: [
                {
                  name: '查看模板列表',
                  code: 'supplementary',
                  select: false
                },
                {
                  name: '新增模板',
                  code: 'supplementary_new',
                  select: false
                },
                {
                  name: '编辑模板',
                  code: 'supplementary_edit',
                  select: false
                },
                {
                  name: '删除模板',
                  code: 'supplementary_del',
                  select: false
                },
                {
                  name: '获取模板抄送人列表',
                  code: 'supplementary_copyTo',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: 'BD',
          code: 'BD',
          active: false,
          select: false,
          children: [
            {
              name: '合作商',
              code: 'cooperator',
              active: false,
              select: false,
              children: [
                {
                  name: '合作商',
                  code: 'cooperator',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'BD_cooperator_search',
                  select: false
                },

                {
                  name: '筛选',
                  code: 'BD_cooperator_select',
                  select: false
                },
                {
                  name: '筛选-全VIP部门数据',
                  code: 'ALL_VIP_Data',
                  select: false
                },
                {
                  name: '筛选-全数据',
                  code: 'BD_cooperator_all_user',
                  select: false
                },
                {
                  name: '新增',
                  code: 'BD_cooperator_add',
                  select: false
                },
                {
                  name: '分页',
                  code: 'BD_cooperator_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'BD_cooperator_edit',
                  select: false
                },
                {
                  name: '合作商来源Code修改',
                  code: 'cooperator_changeCode',
                  select: false
                },
                // {
                //   name: "合同状态",
                //   code: "BD_cooperator_status",
                //   select: false
                // },
                // {
                //   name: "合同内容",
                //   code: "BD_cooperator_cooperation",
                //   select: false
                // },
                {
                  name: '支付账号',
                  code: 'BD_cooperator_pay',
                  select: false
                },
                {
                  name: '活动记录',
                  code: 'BD_cooperator_activity',
                  select: false
                },
                {
                  name: '合同/续约',
                  code: 'BD_cooperator_contract',
                  select: false
                },
                {
                  name: '推文',
                  code: 'BD_cooperator_Tweet',
                  select: false
                },
                {
                  name: '里程碑',
                  code: 'BD_cooperator_milestone',
                  select: false
                },
                {
                  name: '删除',
                  code: 'BD_cooperator_delete',
                  select: false
                },
                {
                  name: 'Follow Up',
                  code: 'BD_cooperator_follow_up',
                  select: false
                },
                {
                  name: '合作商详情草拟合同下载',
                  code: 'contractVoucher_down',
                  select: false
                },
                {
                  name: '合作商详情正式合同下载',
                  code: 'formalContractVoucher_down',
                  select: false
                },
                {
                  name: '每日统计',
                  code: 'BD_cooperator_dayList',
                  select: false
                },
              ]
            },
            {
              name: '转介绍学生（合作商）',
              code: 'cooperatorRecommenderList',
              active: false,
              select: false,
              children: []
            },
            {
              name: '合作商活动',
              code: 'BD_cooperator_activity_list',
              active: false,
              select: false,
              children: [
                {
                  name: '合作商活动',
                  code: 'BD_cooperator_activity_list',
                  active: false,
                  select: false
                },
                {
                  name: '筛选-全数据',
                  code: 'BD_cooperator_activity_all_user',
                  active: false,
                  select: false
                },
                {
                  name: '日历表',
                  code: 'BD_cooperator_calendar',
                  select: false
                },
                {
                  name: 'BD活动凭证（查看）',
                  code: 'BD_cooperator_activity_voucher_view',
                  select: false
                },
                {
                  name: 'BD活动凭证（下载）',
                  code: 'BD_cooperator_activity_voucher_download',
                  select: false
                }
              ]
            },
            {
              name: '校园大使',
              code: 'ambassador',
              active: false,
              select: false,
              children: [
                {
                  name: '校园大使',
                  code: 'ambassador',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'ambassador_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'ambassador_select',
                  select: false
                },
                {
                  name: '筛选-全数据',
                  code: 'ambassador_all_user',
                  select: false
                },
                {
                  name: '新增',
                  code: 'ambassador_add',
                  select: false
                },
                {
                  name: '分页',
                  code: 'ambassador_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'ambassador_edit',
                  select: false
                },
                {
                  name: '支付账号',
                  code: 'ambassador_pay',
                  select: false
                },
                {
                  name: '合同/续约',
                  code: 'ambassador_contract',
                  select: false
                },
                {
                  name: '薪资申请',
                  code: 'ambassador_applyList',
                  select: false
                },
                {
                  name: 'Follow Up',
                  code: 'ambassador_follow_up',
                  select: false
                },
                {
                  name: '获取校园大使学员名单',
                  code: 'ambassador_mentee_list',
                  select: false
                },
                {
                  name: '校园大使Code修改',
                  code: 'ambassador_changeCode',
                  select: false
                }
              ]
            },
            {
              name: '校园大使出纳',
              code: 'ambassador_cashier',
              active: false,
              select: false,
              children: [
                {
                  name: '查看校园大使出纳列表',
                  code: 'ambassador_cashier',
                  select: false
                },
                {
                  name: '筛选-全数据',
                  code: 'ambassador_cashier_ALL_Data',
                  select: false
                }
              ]
            },
            {
              name: 'KOL',
              code: 'kol',
              active: false,
              select: false,
              children: [
                {
                  name: 'kol查看',
                  code: 'kol',
                  select: false
                },
                {
                  name: 'kol全数据',
                  code: 'kol_cashier_ALL_Data',
                  select: false
                }
              ]
            },
            {
              name: 'Pretalk',
              code: 'pretalk',
              active: false,
              select: false,
              children: [
                {
                  name: 'pretalk查看',
                  code: 'pretalk',
                  select: false
                },
                {
                  name: 'pretalk全数据',
                  code: 'pretalk_cashier_ALL_Data',
                  select: false
                },
                {
                  name: 'pretalk编辑',
                  code: 'pretalk_edit',
                  select: false
                }
              ]
            },
            {
              name: '待follow',
              code: 'BD_follow_up',
              active: false,
              select: false,
              children: [
                {
                  name: '全数据',
                  code: 'BD_follow_up_ALL_Data',
                  select: false
                }
              ]
            },
            {
              name: '已follow',
              code: 'BD_followed_list',
              active: false,
              select: false,
              children: []
            },
            {
              name: '过期未follow',
              code: 'BD_no_follow_list',
              active: false,
              select: false,
              children: []
            }
          ]
        },
        {
          name: 'HR',
          code: 'HR',
          active: false,
          select: false,
          children: [
            {
              name: '面试人员',
              code: 'interview_user',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'interview_user_search',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'interview_user_all_user',
                  select: false
                },
                {
                  name: '分类',
                  code: 'interview_user_select',
                  select: false
                },
                {
                  name: '新增',
                  code: 'interview_user_new',
                  select: false
                },
                {
                  name: '导出',
                  code: 'interview_user_export',
                  select: false
                },
                {
                  name: '分页',
                  code: 'interview_user_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'interview_user_edit',
                  select: false
                },
                {
                  name: '入职',
                  code: 'interview_user_entry',
                  select: false
                }
              ]
            },
            {
              name: '员工',
              code: 'hr_user',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'hr_user_search',
                  select: false
                },
                {
                  name: '年龄统计',
                  code: 'hr_user_summary',
                  select: false
                },
                {
                  name: '新增',
                  code: 'hr_user_new',
                  select: false
                },
                {
                  name: '分配员工Token课时',
                  code: 'hr_user_editCourse',
                  select: false
                },
                {
                  name: '分页',
                  code: 'hr_user_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'hr_user_edit',
                  select: false
                },
                {
                  name: '支付账号',
                  code: 'hr_user_pay',
                  select: false
                },
                {
                  name: '里程碑',
                  code: 'hr_user_landmark',
                  select: false
                },
                {
                  name: '职位',
                  code: 'hr_user_position',
                  select: false
                },
                {
                  name: '(不)通过培训期',
                  code: 'hr_user_training',
                  select: false
                },
                {
                  name: '账户编辑',
                  code: 'hr_user_reset',
                  select: false
                },
                {
                  name: '基本薪资展示',
                  code: 'hr_user_wage',
                  select: false
                },
                {
                  name: '删除',
                  code: 'hr_user_del',
                  select: false
                },
                {
                  name: '档案',
                  code: 'hr_user_file',
                  select: false
                }
              ]
            },
            {
              name: '薪资记录',
              code: 'salary',
              active: false,
              select: false,
              children: [
                {
                  name: '薪资列表',
                  code: 'salary',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'salary_search',
                  select: false
                },
                {
                  name: '用户选择',
                  code: 'salary_user_select',
                  select: false
                },
                {
                  name: '周期选择',
                  code: 'salary_monthly_select',
                  select: false
                },
                {
                  name: '分页',
                  code: 'salary_page',
                  select: false
                },
                {
                  name: '保存',
                  code: 'salary_save',
                  select: false
                },
                {
                  name: '导入',
                  code: 'salary_import',
                  select: false
                },
                {
                  name: '导出',
                  code: 'salary_download',
                  select: false
                }
              ]
            },
            {
              name: '运营开支',
              code: 'operate_cost_list',
              active: false,
              select: false,
              children: [
                {
                  name: '运营开支',
                  code: 'operate_cost_list',
                  select: false
                },
                {
                  name: '周期筛选',
                  code: 'operate_search',
                  select: false
                },
                {
                  name: '用户选择',
                  code: 'operate_user_select',
                  select: false
                },
                {
                  name: '类型选择',
                  code: 'operate_type_select',
                  select: false
                },
                {
                  name: '导入',
                  code: 'operate_import',
                  select: false
                },
                {
                  name: '导出',
                  code: 'operate_download',
                  select: false
                }
              ]
            },
            {
              name: '微信管理',
              code: 'stream_WX',
              active: false,
              select: false,
              children: [
                {
                  name: '筛选',
                  code: 'wx_select',
                  select: false
                },
                {
                  name: '筛选-全数据',
                  code: 'wx_ALL_Data',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'wx_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'wx_entry',
                  select: false
                },
                {
                  name: '导出',
                  code: 'wx_outFile',
                  select: false
                },
                {
                  name: '分页',
                  code: 'wx_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'wx_edit',
                  select: false
                },
                {
                  name: '分配',
                  code: 'wx_allot',
                  select: false
                },
                {
                  name: '查看分配历史',
                  code: 'wx_view',
                  select: false
                }
              ]
            },
            {
              name: '五险一金比例',
              code: 'five_one_rate',
              active: false,
              select: false,
              children: []
            },

            {
              name: '员工评估',
              code: 'evaluate',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'evaluate_search',
                  select: false
                },
                {
                  name: '员工选择',
                  code: 'evaluate_user_select',
                  select: false
                },
                {
                  name: '周期选择',
                  code: 'evaluate_period_select',
                  select: false
                },
                {
                  name: '评估类型选择',
                  code: 'evaluate_type_select',
                  select: false
                },
                {
                  name: '评估状态选择',
                  code: 'evaluate_status_select',
                  select: false
                },
                {
                  name: '分页',
                  code: 'evaluate_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'evaluate_edit',
                  select: false
                },
                {
                  name: '新增',
                  code: 'evaluate_add',
                  select: false
                }
              ]
            },
            {
              name: '组织架构',
              code: 'organization',
              active: false,
              select: false,
              children: [
                {
                  name: '新增根部门',
                  code: 'organization_root',
                  select: false
                },
                {
                  name: '新增子部门',
                  code: 'organization_new',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'organization_edit',
                  select: false
                },
                {
                  name: '设置成员',
                  code: 'organization_member',
                  select: false
                },
                {
                  name: '删除',
                  code: 'organization_del',
                  select: false
                }
              ]
            },
            {
              name: '等级管理',
              code: 'level',
              active: false,
              select: false,
              children: []
            },
            {
              name: '角色管理',
              code: 'role',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'role_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'role_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'role_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'role_edit',
                  select: false
                },
                {
                  name: '分配权限',
                  code: 'role_ablot',
                  select: false
                },
                {
                  name: '设置用户',
                  code: 'role_set',
                  select: false
                },
                {
                  name: '删除',
                  code: 'role_del',
                  select: false
                }
              ]
            },
            {
              name: '假期列表',
              code: 'vacation',
              active: false,
              select: false,
              children: [
                {
                  name: '假期列表',
                  code: 'vacation',
                  select: false
                },
                // {
                //   name: "搜索",
                //   code: "vacation_search",
                //   select: false
                // },
                {
                  name: '用户下拉选择',
                  code: 'vacation_user_select',
                  select: false
                },
                {
                  name: '周期下拉选择',
                  code: 'vacation_record_select',
                  select: false
                },
                {
                  name: '分页',
                  code: 'vacation_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'vacation_edit',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '申请/审核',
          code: 'apply_audit',
          active: false,
          select: false,
          children: [
            {
              name: '申请列表',
              code: 'apply',
              active: false,
              select: false,
              children: [
                {
                  name: '申请列表',
                  code: 'apply',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有申请列表(数据)',
                  code: 'ALL_apply',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '审核列表',
              code: 'audit',
              active: false,
              select: false,
              children: [
                {
                  name: '审核列表',
                  code: 'audit',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '补充协议审核通过后更新签约权限',
                  code: 'aduit_update_orderInfo',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'BD合作商合同下载',
                  code: 'bd_audit_contract_download',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'BD合作商经费文件下载',
                  code: 'bd_audit_bd_expenditure_download',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'BD合作商合同金额文件下载',
                  code: 'bd_audit_bd_contractAmount_download',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '学员文书申请文件下载',
                  code: 'mentee_file_audit_file_download',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '校园大使薪资审核文件下载',
                  code: 'school_audit_contract_download',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '出纳列表',
              code: 'cashier',
              active: false,
              select: false,
              children: [
                {
                  name: '其他运营成本（手动录入）',
                  code: 'cashier_other_cost_pay',
                  select: false
                }
              ]
            },

            {
              name: '抄送列表',
              code: 'copy_to',
              active: false,
              select: false,
              children: []
            },
            {
              name: '全部申请',
              code: 'all_apply_data',
              active: false,
              select: false,
              children: [
                {
                  name: '全部申请',
                  code: 'all_apply_data',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有offer(数据)',
                  code: 'all_audit_offer_apply',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有退款(数据)',
                  code: 'all_audit_sign_refund',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有补充协议(数据)',
                  code: 'all_audit_order_supplementary_contract',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有导师佣金(数据)',
                  code: 'all_audit_mentor_payment',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有返佣(数据)',
                  code: 'all_audit_brokerage',
                  active: false,
                  select: false,
                  children: []
                },

                {
                  name: '所有报销(数据)',
                  code: 'all_audit_reimbursement',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有请假(数据)',
                  code: 'all_audit_vacate',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有加班(数据)',
                  code: 'all_audit_overtime_working',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有推荐奖励(数据)',
                  code: 'all_audit_recommend_bonus',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有订单入账(数据)',
                  code: 'all_audit_order_entry',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有出纳列表新增记录(数据)',
                  code: 'all_audit_pay_record',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有全职导师课程(数据)',
                  code: 'all_audit_vip_lesson',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有导师薪资申请(数据)',
                  code: 'all_audit_mentor_payment_extra',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有采购申请(数据)',
                  code: 'all_audit_purchase',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有采购申请(数据)',
                  code: 'all_audit_purchase',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有实习单位付款(数据)',
                  code: 'all_audit_internship_offer_payment',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有文书修改(数据)',
                  code: 'all_audit_application_letter',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有校园大使薪资(数据)',
                  code: 'all_audit_ambassador_salary',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有合作商合同(数据)',
                  code: 'all_audit_cooperator_contract_info',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有合作商合同金额(数据)',
                  code: 'all_audit_cooperator_contract_fund',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有合作商活动经费(数据)',
                  code: 'all_audit_bd_expenditure',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有合作商活动状态更改(数据)',
                  code: 'all_audit_cooperator_activity_status_change',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有升学offer(数据)',
                  code: 'all_audit_entrance_offer_apply',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有学员好评图(数据)',
                  code: 'all_audit_sign_praise',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有面试人员录入(数据)',
                  code: 'all_audit_interviewee_info',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有一对多课程申请(数据)',
                  code: 'all_audit_vip_office_hour_lesson',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '所有面试申请(数据)',
                  code: 'all_audit_mentee_interview',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '入账审核',
              code: 'accounting_audit',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'accounting_audit_search',
                  select: false
                },
                {
                  name: '分页',
                  code: 'accounting_audit_page',
                  select: false
                },
                {
                  name: '确认',
                  code: 'accounting_audit_confirm',
                  select: false
                }
              ]
            },
            {
              name: '审核人管理',
              code: 'auditor',
              active: false,
              select: false,
              children: []
            }
          ]
        },
        {
          name: '成本一览',
          code: 'cost',
          active: false,
          select: false,
          children: [
            {
              name: '实习',
              code: 'cost_internship_list',
              active: false,
              select: false,
              children: []
            },
            {
              name: '行业导师',
              code: 'cost_mentor_list',
              active: false,
              select: false,
              children: [
                {
                  name: 'Excel下载',
                  code: 'cost_mentor_downExecl',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: '成果展示',
          code: 'achievement',
          active: false,
          select: false,
          children: [
            {
              name: '面试列表(无码)',
              code: 'interview_list',
              active: false,
              select: false,
              children: [
                {
                  name: '面试列表(无码)',
                  code: 'interview_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（无码）',
                  code: 'interview_list_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'interview_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（无码）',
                  code: 'interview_list_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'interview_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传凭证（有码）',
                  code: 'interview_list_up',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '面试列表(有码)',
              code: 'interview_hm_list',
              active: false,
              select: false,
              children: [
                {
                  name: '面试列表(有码)',
                  code: 'interview_hm_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'interview_hm_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'interview_hm_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码修改sales已用',
                  code: 'interview_hm_list_set_salesUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码修改mkt已用副贴',
                  code: 'interview_hm_list_set_mktUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码修改mkt已用文章',
                  code: 'interview_hm_list_set_mktUsedArticle',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码核验权限',
                  code: 'interview_hm_list_setting',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码面经官网展示修改权限',
                  code: 'interview_hm_list_changeStoryStatus',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '面试有码核验修改官网显示状态权限',
                  code: 'interView_hm_list_settingPcWatch',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '求职Offer列表(无码)',
              code: 'offer_list',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表(无码)',
                  code: 'offer_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '一键下载offerZIP包(无码)',
                  code: 'offer_list_downloadZip',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（无码）',
                  code: 'offer_list_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'offer_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（无码）',
                  code: 'offer_list_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'offer_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传凭证（有码）',
                  code: 'offer_list_up',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（无码）',
                  code: 'offer_list_img_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'offer_list_img_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（无码）',
                  code: 'offer_list_img_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'offer_list_img_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传好评图（有码）',
                  code: 'offer_list_img_up',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '求职Offer列表(有码)',
              code: 'offer_hm_list',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表(有码)',
                  code: 'offer_hm_list',
                  active: false,
                  select: false
                },
                {
                  name: '一键下载offerZIP包(有码)',
                  code: 'offer_hm_list_downloadZip',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '导出casebook',
                  code: 'offer_hm_list_casebook',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '导出所有offer',
                  code: 'offer_hm_list_downloadAllOffer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '更新sales已用（有码）',
                  code: 'offer_hm_list_set_salesUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '更新mkt已用（有码）',
                  code: 'offer_hm_list_set_mktUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'offer_hm_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'offer_hm_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'offer_hm_list_img_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'offer_hm_list_img_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证及好评图下载记录',
                  code: 'offer_job_hm_download_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '设置',
                  code: 'offer_hm_list_setting',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '求职offer音频申请',
                  code: 'offer_hm_list_audio',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '设置是否官网展示',
                  code: 'offer_hm_list_settingPcWatch',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '升学Offer列表(无码)',
              code: 'offer_edu_list',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表(无码)',
                  code: 'offer_edu_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（无码）',
                  code: 'offer_edu_list_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'offer_edu_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（无码）',
                  code: 'offer_edu_list_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'offer_edu_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传凭证（有码）',
                  code: 'offer_edu_list_up',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（无码）',
                  code: 'offer_edu_list_img_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'offer_edu_list_img_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（无码）',
                  code: 'offer_edu_list_img_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'offer_edu_list_img_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传好评图（有码）',
                  code: 'offer_edu_list_img_up',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '升学Offer列表(有码)',
              code: 'offer_edu_hm_list',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表(有码)',
                  code: 'offer_edu_hm_list',
                  active: false,
                  select: false
                },
                {
                  name: '更新sales已用（有码）',
                  code: 'offer_edu_hm_list_set_salesUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '更新mkt已用（有码）',
                  code: 'offer_edu_hm_list_set_mktUsed',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证（有码）',
                  code: 'offer_edu_hm_list_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载凭证（有码）',
                  code: 'offer_edu_hm_list_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'offer_edu_hm_list_img_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'offer_edu_hm_list_img_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看凭证及好评图下载记录',
                  code: 'offer_edu_hm_download_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '设置',
                  code: 'offer_edu_hm_list_setting',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '升学Offer音频申请',
                  code: 'offer_edu_hm_list_audio',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '一键下载offerZIP包(有码)',
                  code: 'offer_edu_hm_list_downloadZip',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '求职Offer历史',
              code: 'offer_history',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表',
                  code: 'offer_history',
                  active: false,
                  select: false
                },

                {
                  name: '新增offer',
                  code: 'offer_history_add',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '编辑offer',
                  code: 'offer_history_edit',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '删除offer',
                  code: 'offer_history_delete',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看review',
                  code: 'offer_history_view_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载review',
                  code: 'offer_history_down_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传review',
                  code: 'offer_history_upload_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看offer',
                  code: 'offer_history_view_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载offer',
                  code: 'offer_history_down_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传offer',
                  code: 'offer_history_upload_offer',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '求职Offer（全部）',
              code: 'offer_all',
              active: false,
              select: false,
              children: [
                {
                  name: '查看review',
                  code: 'offer_all_view_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'Offer列表导出全部',
                  code: 'offer_all_list_downloadAllOffer',
                  active: false,
                  select: false
                },
                {
                  name: '下载review',
                  code: 'offer_all_down_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看offer',
                  code: 'offer_all_view_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载offer',
                  code: 'offer_all_down_offer',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '升学Offer历史',
              code: 'offer_edu_history',
              active: false,
              select: false,
              children: [
                {
                  name: 'Offer列表',
                  code: 'offer_edu_history',
                  active: false,
                  select: false
                },

                {
                  name: '新增offer',
                  code: 'offer_edu_history_add',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '编辑offer',
                  code: 'offer_edu_history_edit',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '删除offer',
                  code: 'offer_edu_history_delete',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看review',
                  code: 'offer_edu_history_view_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载review',
                  code: 'offer_edu_history_down_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传review',
                  code: 'offer_edu_history_upload_review',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看offer',
                  code: 'offer_edu_history_view_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载offer',
                  code: 'offer_edu_history_down_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '上传offer',
                  code: 'offer_edu_history_upload_offer',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '历史面经',
              code: 'interview_history',
              active: false,
              select: false,
              children: [
                {
                  name: '历史面经列表查看',
                  code: 'interview_history',
                  active: false,
                  select: false
                },
                {
                  name: '历史面经列表编辑',
                  code: 'interview_history_edit',
                  active: false,
                  select: false
                },
                {
                  name: '历史面经列表新增',
                  code: 'interview_history_add',
                  active: false,
                  select: false
                }
              ]
            },
            {
              name: '求职offer学校分布',
              code: 'offer_school',
              active: false,
              select: false,
              children: [
                {
                  name: '求职offer学校分布',
                  code: 'offer_school',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'offer数量',
                  code: 'offer_school_offer',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看Offer战绩下载记录',
                  code: 'offer_job_school_download_list',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '求职offer公司分布',
              code: 'offer_company',
              active: false,
              select: false,
              children: [
                {
                  name: '求职offer学校分布',
                  code: 'offer_company',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: 'offer数量',
                  code: 'offer_company_offer',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },

            {
              name: '导师展示',
              code: 'mentor_list',
              active: false,
              select: false,
              children: [
                {
                  name: '导师信息详情',
                  code: 'mentor_list_detail',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '导师信息翻页功能',
                  code: 'mentor_list_page',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '学生好评图（无码）',
              code: 'mentee_praise',
              active: false,
              select: false,
              children: [
                {
                  name: '查看好评图（无码）',
                  code: 'mentee_praise_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'mentee_praise_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（无码）',
                  code: 'mentee_praise_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'mentee_praise_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '设置好评图（有码）',
                  code: 'mentee_praise_up',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '学生好评图（有码）',
              code: 'mentee_hm_praise',
              active: false,
              select: false,
              children: [
                {
                  name: '查看好评图（无码）',
                  code: 'mentee_hm_praise_view_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）',
                  code: 'mentee_hm_praise_view_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（无码）',
                  code: 'mentee_hm_praise_down_nm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '下载好评图（有码）',
                  code: 'mentee_hm_praise_down_hm',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '查看好评图（有码）下载记录',
                  code: 'mentee_hm_download_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '核验好评图',
                  code: 'mentee_hm_praise_up',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: '系统报表',
          code: 'statement',
          active: false,
          select: false,
          children: [
            {
              name: '销售报表',
              code: 'statement_sale',
              active: false,
              select: false,
              children: []
            },
            {
              name: '销售转化率报表',
              code: 'sales_conversion',
              active: false,
              select: false,
              children: [
                {
                  name: '查看报表',
                  code: 'sales_conversion',
                  select: false
                },
                {
                  name: '转化率报表全数据权限',
                  code: 'sales_conversion_all_user',
                  select: false
                },
                {
                  name: '查看小组转化率按钮权限',
                  code: 'sales_conversion_changeBtn',
                  select: false
                },
                {
                  name: '导出按钮权限',
                  code: 'sales_conversion_downExecl',
                  select: false
                },
                {
                  name: '分配学员数数据权限',
                  code: 'sales_conversion_assignStudents',
                  select: false
                },
                {
                  name: '签约学员数数据权限',
                  code: 'sales_conversion_signStudent',
                  select: false
                },
                {
                  name: '入账签约学生比数据权限',
                  code: 'sales_conversion_signStudentRate',
                  select: false
                },
                {
                  name: 'KPI总数数据权限',
                  code: 'sales_conversion_kpiAll',
                  select: false
                },
                {
                  name: 'KPI签约学生比数据权限',
                  code: 'sales_conversion_kpiRate',
                  select: false
                },
                {
                  name: '入账金额数据权限',
                  code: 'sales_conversion_entry',
                  select: false
                },
                {
                  name: '平均转换天数',
                  code: 'sales_conversion_days',
                  select: false
                },
                {
                  name: '￥平均每位客户入账金额数据权限',
                  code: 'sales_conversion_entryRate',
                  select: false
                },

                {
                  name: '小组分配学员数数据权限',
                  code: 'sales_conversion_assignStudentsGroup',
                  select: false
                },

                {
                  name: '小组签约学员数数据权限',
                  code: 'sales_conversion_signStudentGroup',
                  select: false
                },

                {
                  name: '小组签约转化率数据权限',
                  code: 'sales_conversion_signStudentRateGroup',
                  select: false
                },
                {
                  name: '小组KPI总数数据权限',
                  code: 'sales_conversion_kpiAllGroup',
                  select: false
                },

                {
                  name: '小组KPI签约学生比数据权限',
                  code: 'sales_conversion_kpiRateGroup',
                  select: false
                },
                {
                  name: '小组入账金额数据权限',
                  code: 'sales_conversion_entryGroup',
                  select: false
                },
                {
                  name: '￥平均每位客户入账金额数据权限（包含组长）',
                  code: 'sales_conversion_entryRateGroup',
                  select: false
                }
              ]
            },
            {
              name: '销售VIP复购',
              code: 'sales_repurchase',
              active: false,
              select: false,
              children: [
                {
                  name: '查看复购',
                  code: 'sales_repurchase',
                  select: false
                },
                {
                  name: '切换VIP复购',
                  code: 'sales_repurchase_changeBtn',
                  select: false
                },
                {
                  name: '导出复购报表',
                  code: 'sales_repurchase_downExecl',
                  select: false
                }
              ]
            },
            {
              name: '学校统计报表',
              code: 'school_statement',
              active: false,
              select: false,
              children: [
                {
                  name: '查看学校统计报表',
                  code: 'school_statement',
                  select: false
                },
                {
                  name: '查看学校统计报表往年对比详情',
                  code: 'school_statement_viewTables',
                  select: false
                },
                {
                  name: '下载学校统计的table',
                  code: 'school_statement_download',
                  select: false
                }
              ]
            },
            {
              name: 'HR统计报表',
              code: 'hr_statement',
              active: false,
              select: false,
              children: [
                {
                  name: '查看HR统计报表',
                  code: 'hr_statement',
                  select: false
                }
              ]
            },
            {
              name: '项目统计报表',
              code: 'programm_statement',
              active: false,
              select: false,
              children: [
                {
                  name: '查看项目统计报表',
                  code: 'programm_statement',
                  select: false
                },
                {
                  name: '项目统计报表导出',
                  code: 'programm_statement_out',
                  select: false
                }
              ]
            },
            {
              name: 'BD咨询报表',
              code: 'bd_consulting',
              active: false,
              select: false,
              children: [
                {
                  name: '查看BD咨询报表',
                  code: 'bd_consulting',
                  select: false
                }
              ]
            },
            {
              name: 'BD咨询报表2.0',
              code: 'bd_consulting2',
              active: false,
              select: false,
              children: [
                {
                  name: '查看BD咨询报表',
                  code: 'bd_consulting2',
                  select: false
                }
              ]
            },
            {
              name: '确收统计',
              code: 'confirm_statement',
              active: false,
              select: false,
              children: [

              ]
            },
            {
              name: '销售助理报表',
              code: 'statement_sale_assistant',
              active: false,
              select: false,
              children: []
            },
            {
              name: '行业导师报表',
              code: 'statement_mentor',
              active: false,
              select: false,
              children: []
            },
            {
              name: '时间线',
              code: 'time_line',
              active: false,
              select: false,
              children: []
            },
            {
              name: '销售月报',
              code: 'monthly_report',
              active: false,
              select: false,
              children: []
            },
            {
              name: 'BD月报',
              code: 'bd_monthReport',
              active: false,
              select: false,
              children: []
            },
            {
              name: '出账报表',
              code: 'money_out',
              active: false,
              select: false,
              children: []
            },
            {
              name: '订单退款',
              code: 'order_refund',
              active: false,
              select: false,
              children: []
            }
          ]
        },
        {
          name: '文件系统',
          code: 'file_system',
          active: false,
          select: false,
          children: [
            {
              name: '文件夹',
              code: 'file_list',
              active: false,
              select: false,
              children: [
                {
                  name: '文件夹',
                  code: 'file_list',
                  active: false,
                  select: false,
                  children: []
                },
                {
                  name: '缩略图',
                  code: 'file_list_reduce',
                  active: false,
                  select: false,
                  children: []
                }
              ]
            },
            {
              name: '收藏夹',
              code: 'favorite_file_list',
              active: false,
              select: false,
              children: []
            }
          ]
        },
        {
          name: '合规部门',
          code: 'compliance_department',
          active: false,
          select: false,
          children: [
            {
              name: '奖惩事件',
              code: 'reward_punishment',
              active: false,
              select: false,
              children: [
                {
                  name: '记录事件',
                  code: 'reward_punishment_add',
                  select: false
                },
                {
                  name: '奖励 - 其他奖励',
                  code: 'reward_punishment_award',
                  select: false
                },
                {
                  name: '惩罚 - 其他扣款',
                  code: 'reward_punishment_punish',
                  select: false
                },
                {
                  name: '惩罚 - 迟到扣款',
                  code: 'reward_punishment_late_deduct',
                  select: false
                },
                {
                  name: '奖励 - 月度奖',
                  code: 'reward_punishment_month_award',
                  select: false
                },
                {
                  name: '奖励 - 季度奖',
                  code: 'reward_punishment_quarter_award',
                  select: false
                },
                {
                  name: '奖励 - 半年奖',
                  code: 'reward_punishment_half_year_award',
                  select: false
                },
                {
                  name: '奖励 - 加班',
                  code: 'reward_punishment_overtime_pay',
                  select: false
                },
                {
                  name: '假期 - 病假',
                  code: 'reward_punishment_sick_vacation',
                  select: false
                },
                {
                  name: '假期 - 事假',
                  code: 'reward_punishment_absence_vacation',
                  select: false
                },
                {
                  name: '奖励 - 年终奖',
                  code: 'reward_punishment_year_award',
                  select: false
                },
                {
                  name: '假期 - 调休假',
                  code: 'reward_punishment_compensatory_vacation',
                  select: false
                },
                {
                  name: '假期 - 婚假',
                  code: 'reward_punishment_marry_vacation',
                  select: false
                },
                {
                  name: '假期 - 产假',
                  code: 'reward_punishment_birth_vacation',
                  select: false
                },
                {
                  name: '假期 - 陪产假',
                  code: 'reward_punishment_paternity_vacation',
                  select: false
                },
                {
                  name: '假期 - 丧假',
                  code: 'reward_punishment_funeral_vacation',
                  select: false
                },
                {
                  name: '假期 - 年假',
                  code: 'reward_punishment_year_vacation',
                  select: false
                },
                {
                  name: '假期 - 带薪病假',
                  code: 'reward_punishment_sick_salary_vacation',
                  select: false
                },
                {
                  name: '假期 - 其他假期',
                  code: 'reward_punishment_other_vacation',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '岗位资源',
          code: 'job',
          active: false,
          select: false,
          children: [
            {
              name: '内推机会',
              code: 'internal_job',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'internal_job_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'internal_job_select',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'internal_job_all_data',
                  select: false
                },
                {
                  name: '新增',
                  code: 'internal_job_new',
                  select: false
                },
                {
                  name: '岗位提供人管理',
                  code: 'internal_job_provider',
                  select: false
                },
                {
                  name: '分页',
                  code: 'internal_job_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'internal_job_edit',
                  select: false
                },
                {
                  name: '学员',
                  code: 'internal_job_student',
                  select: false
                },
                {
                  name: '一键下载学员简历',
                  code: 'internal_job_download_all',
                  select: false
                },
                {
                  name: '删除',
                  code: 'internal_job_del',
                  select: false
                }
              ]
            },
            {
              name: '网申提醒',
              code: 'net_application',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'net_application_search',
                  select: false
                },
                {
                  name: '筛选',
                  code: 'net_application_select',
                  select: false
                },
                {
                  name: '全数据',
                  code: 'net_application_all_data',
                  select: false
                },
                {
                  name: '新增',
                  code: 'net_application_new',
                  select: false
                },
                {
                  name: '导出',
                  code: 'net_application_download',
                  select: false
                },
                {
                  name: '分页',
                  code: 'net_application_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'net_application_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'net_application_del',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '系统管理',
          code: 'system',
          active: false,
          select: false,
          children: [
            {
              name: '通知中心',
              code: 'notice',
              active: false,
              select: false,
              children: [
                {
                  name: '通知中心',
                  code: 'notice',
                  select: false
                },
                {
                  name: '搜索',
                  code: 'notice_search',
                  select: false
                },
                {
                  name: '过滤',
                  code: 'notice_select',
                  select: false
                },
                {
                  name: '新增',
                  code: 'notice_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'notice_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'notice_edit',
                  select: false
                }
              ]
            },
            {
              name: '学校管理',
              code: 'school',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'school_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'school_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'school_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'school_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'school_del',
                  select: false
                }
              ]
            },
            {
              name: '下拉选项管理',
              code: 'select_data',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'select_data_search',
                  select: false
                },
                // {
                //   name: "新增",
                //   code: "select_data_new",
                //   select: false
                // },
                {
                  name: '分页',
                  code: 'select_data_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'select_data_edit',
                  select: false
                },
                {
                  name: '设置用户',
                  code: 'select_data_set',
                  select: false
                }
              ]
            },
            {
              name: '实习单位管理',
              code: 'internship_unit',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'internship_unit_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'internship_unit_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'internship_unit_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'internship_unit_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'internship_unit_del',
                  select: false
                }
              ]
            },
            {
              name: 'WST Company',
              code: 'wst_company',
              active: false,
              select: false,
              children: []
            },
            {
              name: '公司管理',
              code: 'company',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'company_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'company_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'company_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'company_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'company_del',
                  select: false
                }
              ]
            },
            {
              name: '入账账户管理',
              code: 'account_list',
              active: false,
              select: false,
              children: [
                {
                  name: '搜索',
                  code: 'account_list_search',
                  select: false
                },
                {
                  name: '新增',
                  code: 'account_list_new',
                  select: false
                },
                {
                  name: '分页',
                  code: 'account_list_page',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'account_list_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'account_list_del',
                  select: false
                }
              ]
            },
            {
              name: 'Refcode管理',
              code: 'refCodeList',
              active: false,
              select: false,
              children: [
                {
                  name: '新增',
                  code: 'refCodeList_new',
                  select: false
                },
                {
                  name: '编辑',
                  code: 'refCodeList_edit',
                  select: false
                },
                {
                  name: '删除',
                  code: 'refCodeList_del',
                  select: false
                }
              ]
            },
            {
              name: '秘钥',
              code: 'keys',
              active: false,
              select: false,
              children: []
            },
            {
              name: '汇率',
              code: 'rate',
              active: false,
              select: false,
              children: []
            },
            {
              name: '出纳人设置',
              code: 'mentor_pay_cashier_set',
              active: false,
              select: false,
              children: []
            },
            {
              name: '授权码管理',
              code: 'crm_authorizationCode',
              active: false,
              select: false,
              children: [
                {
                  name: '查看授权码管理',
                  code: 'crm_authorizationCode',
                  select: false
                },
                {
                  name: '新增授权码权限',
                  code: 'authorizationCode_add',
                  select: false
                },
                {
                  name: '授权码用户筛选权限',
                  code: 'authorizationCode_user_select',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '数据字典',
          code: 'dictionary_system',
          active: false,
          select: false,
          children: [
            {
              name: '数据字典查看',
              code: 'dictionary',
              active: false,
              select: false,
              children: []
            },
            {
              name: '数据字典管理',
              code: 'dictionary_edit',
              active: false,
              select: false,
              children: [
                { name: '升学导师薪资申请类型', code: 'dic_academic_mentor_bonus_edit', active: false, select: false },
                { name: '合作商活动线上方式', code: 'dic_activity_online_type_edit', active: false, select: false },
                { name: '校园大使类型', code: 'dic_ambassador_type_edit', active: false, select: false },
                { name: '申请季节', code: 'dic_apply_season_edit', active: false, select: false },
                { name: '申请状态', code: 'dic_apply_status_edit', active: false, select: false },
                { name: '申请类型', code: 'dic_apply_type_edit', active: false, select: false },
                { name: '审核状态', code: 'dic_approve_status_edit', active: false, select: false },
                { name: '审核状态', code: 'dic_audit_status_edit', active: false, select: false },
                { name: '待办类型', code: 'dic_backlog_type_edit', active: false, select: false },
                { name: '一级部门', code: 'dic_basic_division_edit', active: false, select: false },
                { name: 'follow状态（BD）', code: 'dic_bd_follow_status_edit', active: false, select: false },
                { name: '入账审核状态', code: 'dic_bill_confirm_status_edit', active: false, select: false },
                { name: '入账货币类型', code: 'dic_bill_currency_type_edit', active: false, select: false },
                { name: '渠道返佣状态', code: 'dic_brokerage_status_edit', active: false, select: false },
                { name: '订单业务类型', code: 'dic_business_type_edit', active: false, select: false },
                { name: 'channels', code: 'dic_channels_edit', active: false, select: false },
                { name: '城市', code: 'dic_city_edit', active: false, select: false },
                { name: '通用补充协议', code: 'dic_common_order_supplementary_type_edit', active: false, select: false },
                { name: '是/否', code: 'dic_common_yes_or_no_edit', active: false, select: false },
                { name: '是否可用（通用）', code: 'dic_comm_available_edit', active: false, select: false },
                { name: '合同类型', code: 'dic_contract_kind_edit', active: false, select: false },
                { name: '合同类型', code: 'dic_contract_type_edit', active: false, select: false },
                { name: '合作商活动评分状态', code: 'dic_cooperator_activity_score_status_edit', active: false, select: false },
                { name: '合作商活动状态', code: 'dic_cooperator_activity_status_edit', active: false, select: false },
                { name: '合作商合同状态', code: 'dic_cooperator_contract_status_edit', active: false, select: false },
                { name: '合作商里程碑事件类型', code: 'dic_cooperator_event_type_edit', active: false, select: false },
                { name: '合作商合作状态', code: 'dic_cooperator_status_edit', active: false, select: false },
                { name: '合作商类型', code: 'dic_cooperator_type_edit', active: false, select: false },
                { name: '国家/地区', code: 'dic_country_edit', active: false, select: false },
                { name: '国家-中文', code: 'dic_country_chi_edit', active: false, select: false },
                { name: '学历', code: 'dic_degree_edit', active: false, select: false },
                { name: '优惠活动优惠类型', code: 'dic_discount_type_edit', active: false, select: false },
                { name: '学员求职部门/岗位', code: 'dic_division_edit', active: false, select: false },
                { name: '升学offer基本项目', code: 'dic_entrance_offer_program_edit', active: false, select: false },
                { name: '升学类型', code: 'dic_entrance_type_edit', active: false, select: false },
                { name: '升学类型(英文)', code: 'dic_entrance_type_eng_edit', active: false, select: false },
                { name: '员工在职状态', code: 'dic_entry_status_edit', active: false, select: false },
                { name: '用户考评等级', code: 'dic_evaluate_level_edit', active: false, select: false },
                { name: '员工绩效考核类型', code: 'dic_evaluate_type_edit', active: false, select: false },
                { name: 'BD经费种类', code: 'dic_expenditure_reason_edit', active: false, select: false },
                { name: '文件类型', code: 'dic_file_type_edit', active: false, select: false },
                { name: '全职类型', code: 'dic_full_time_type_edit', active: false, select: false },
                { name: 'gp订单补充协议类型', code: 'dic_gporder_supplementary_type_edit', active: false, select: false },
                { name: '升学--专业', code: 'dic_gp_major_edit', active: false, select: false },
                { name: '到岗时间', code: 'dic_internal_arrive_days_edit', active: false, select: false },
                { name: '学员内推岗位投递状态', code: 'dic_internal_job_deliver_status_edit', active: false, select: false },
                { name: '投递状态', code: 'dic_internal_job_mentee_record_status_edit', active: false, select: false },
                { name: '内推岗位状态', code: 'dic_internal_job_status_edit', active: false, select: false },
                { name: '实习时长', code: 'dic_internship_duration_edit', active: false, select: false },
                { name: '远程or实地', code: 'dic_internship_location_type_edit', active: false, select: false },
                { name: '实习/全职', code: 'dic_internship_or_full_time_edit', active: false, select: false },
                { name: '实习类型', code: 'dic_internship_type_edit', active: false, select: false },
                { name: '求职者录用状态', code: 'dic_interviewee_hire_status_edit', active: false, select: false },
                { name: '面试者来源', code: 'dic_interviewee_resource_edit', active: false, select: false },
                { name: '面试轮次', code: 'dic_interview_round_no_edit', active: false, select: false },
                { name: '求职者到面状态', code: 'dic_interview_status_edit', active: false, select: false },
                { name: '发票类型', code: 'dic_invoice_type_edit', active: false, select: false },
                { name: '升学考试类型', code: 'dic_iv_examination_edit', active: false, select: false },
                { name: '地区', code: 'dic_location_edit', active: false, select: false },
                { name: '学员文件类型', code: 'dic_mentee_file_type_edit', active: false, select: false },
                { name: '学员意向', code: 'dic_mentee_intention_edit', active: false, select: false },
                { name: 'Requesting System 导师邀请状态', code: 'dic_mentee_request_invite_status_edit', active: false, select: false },
                { name: '学员Request约课类型', code: 'dic_mentee_request_lesson_type_edit', active: false, select: false },
                { name: 'Requesting System记录状态', code: 'dic_mentee_request_status_edit', active: false, select: false },
                { name: '签约状态(学员)', code: 'dic_mentee_sign_status_edit', active: false, select: false },
                { name: '学生来源字典项', code: 'dic_mentee_source_from_edit', active: false, select: false },
                { name: '学员类型（身份）', code: 'dic_mentee_type_edit', active: false, select: false },
                { name: '导师自助入职申请审核状态', code: 'dic_mentor_entry_audit_status_edit', active: false, select: false },
                { name: '导师支付账户类型', code: 'dic_mentor_pay_type_edit', active: false, select: false },
                { name: '公告状态', code: 'dic_notice_status_edit', active: false, select: false },
                { name: 'newsletter任务状态', code: 'dic_nsl_task_status_edit', active: false, select: false },
                { name: '学生offer来源', code: 'dic_offer_from_edit', active: false, select: false },
                { name: '运营成本类型', code: 'dic_operate_cost_type_edit', active: false, select: false },
                { name: '订单支付状态', code: 'dic_order_pay_status_edit', active: false, select: false },
                { name: '订单签约状态', code: 'dic_order_sign_status_edit', active: false, select: false },
                { name: '订单补充协议类型', code: 'dic_order_supplementary_type_edit', active: false, select: false },
                { name: '出账账户', code: 'dic_payment_account_edit', active: false, select: false },
                { name: '账户类型-对公/私人', code: 'dic_payment_public_or_private_edit', active: false, select: false },
                { name: '支付方式', code: 'dic_payment_type_edit', active: false, select: false },
                { name: '好评类型', code: 'dic_praise_type_edit', active: false, select: false },
                { name: 'Program', code: 'dic_program_edit', active: false, select: false },
                { name: '项目Group', code: 'dic_program_group_edit', active: false, select: false },
                { name: '项目级别', code: 'dic_program_level_edit', active: false, select: false },
                { name: '项目细分', code: 'dic_program_subdivision_edit', active: false, select: false },
                { name: '项目类别', code: 'dic_program_type_edit', active: false, select: false },
                { name: '采购类型', code: 'dic_purchase_type_edit', active: false, select: false },
                { name: '报销费用明细类型', code: 'dic_reimbursement_fund_type_edit', active: false, select: false },
                { name: '报销类型', code: 'dic_reimbursement_type_edit', active: false, select: false },
                { name: '学校类型', code: 'dic_school_type_edit', active: false, select: false },
                { name: '线下课报名状态', code: 'dic_session_apply_status_edit', active: false, select: false },
                { name: '线下课课程类型', code: 'dic_session_type_edit', active: false, select: false },
                { name: '定制课支付状态', code: 'dic_settle_lesson_payment_status_edit', active: false, select: false },
                { name: '性别', code: 'dic_sex_edit', active: false, select: false },
                { name: '签约补充协议--延长（赠时长）月数', code: 'dic_sign_excess_month_edit', active: false, select: false },
                { name: 'follow状态（VIP）', code: 'dic_sign_follow_status_edit', active: false, select: false },
                { name: '签约年级', code: 'dic_sign_grade_edit', active: false, select: false },
                { name: '实习单位', code: 'dic_sign_internship_company_edit', active: false, select: false },
                { name: '签约实习状态', code: 'dic_sign_internship_status_edit', active: false, select: false },
                { name: '签约项目课程状态', code: 'dic_sign_lesson_status_edit', active: false, select: false },
                { name: '签约项目课程类型', code: 'dic_sign_lesson_type_edit', active: false, select: false },
                { name: '签约订单类型', code: 'dic_sign_order_type_edit', active: false, select: false },
                { name: '签约项目课程支付状态', code: 'dic_sign_payment_status_edit', active: false, select: false },
                { name: '线上/线下签约', code: 'dic_sign_way_type_edit', active: false, select: false },
                { name: 'source_wx', code: 'dic_source_wx_edit', active: false, select: false },
                { name: '组织架构类型:公司/部门/小组', code: 'dic_sys_group_kind_edit', active: false, select: false },
                { name: '用户类型', code: 'dic_sys_user_type_edit', active: false, select: false },
                { name: '任务状态', code: 'dic_task_status_edit', active: false, select: false },
                { name: '任务类型', code: 'dic_task_type_edit', active: false, select: false },
                { name: '行业（细分）', code: 'dic_track_edit', active: false, select: false },
                { name: '行业（大类）', code: 'dic_track_type_edit', active: false, select: false },
                { name: '课业辅导--学科', code: 'dic_tutoring_subject_edit', active: false, select: false },
                { name: '课业辅导-学科难度', code: 'dic_tutoring_subject_difficulty_edit', active: false, select: false },
                { name: '大学类型', code: 'dic_university_type_edit', active: false, select: false },
                { name: '用户里程碑类型', code: 'dic_user_event_type_edit', active: false, select: false },
                { name: '员工档案类型', code: 'dic_user_material_type_edit', active: false, select: false },
                { name: '用户账户状态', code: 'dic_user_status_edit', active: false, select: false },
                { name: '请假类型', code: 'dic_vacate_type_edit', active: false, select: false },
                { name: 'WST公司', code: 'dic_wst_company_edit', active: false, select: false },
                { name: '行业导师文书修改任务状态', code: 'dic_application_letter_task_status_edit', active: false, select: false },
                { name: '行业导师文书修改任务事件', code: 'dic_application_letter_task_event_edit', active: false, select: false },
                { name: '行业导师文书修改简历类型', code: 'dic_application_letter_task_resume_type_edit', active: false, select: false },
                { name: '申研国家', code: 'dic_gp_country_edit', active: false, select: false }

                // {
                //   name: "删除",
                //   code: "dictionary_del",
                //   select: false
                // }
              ]
            },
            {
              name: '岗位字典',
              code: 'dictionary_division',
              active: false,
              select: false,
              children: []
            },
            {
              name: '项目字典',
              code: 'dictionary_project',
              active: false,
              select: false,
              children: [

              ]
            },
            {
              name: '学生课程方向标签',
              code: 'mentee_bd_track',
              active: false,
              select: false,
              children: [

              ]
            }
          ]
        },
        {
          name: '推广码',
          code: 'Promo',
          active: false,
          select: false,
          children: [
            {
              name: '推广码管理',
              code: 'Promo',
              active: false,
              select: false,
              children: [
                {
                  name: '查看推广码',
                  code: 'Promo',
                  select: false
                },
                {
                  name: '新增推广码',
                  code: 'Promo_add',
                  select: false
                }
              ]
            }
          ]
        },
        {
          name: '活动管理',
          code: 'activity_manage',
          active: false,
          select: false,
          children: [
            {
              name: '活动列表',
              code: 'activity_list',
              active: false,
              select: false,
              children: [
                {
                  name: '编辑',
                  code: 'activity_list_edit',
                  select: false
                }, {
                  name: '领取',
                  code: 'activity_list_receive',
                  select: false
                }, {
                  name: '删除',
                  code: 'activity_list_delete',
                  select: false
                }
              ]
            },
            {
              name: '卡券列表',
              code: 'coupon_list',
              active: false,
              select: false,
              children: [{
                name: '筛选-全数据',
                code: 'coupon_list_all_user',
                select: false
              }, {
                name: '复制券码',
                code: 'coupon_list_copy',
                select: false
              }]
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    async pageInit () {
      this.apply_type = await this.getDictionary('apply_type')
      this.privilege[8].children[4].children = [
        {
          active: false,
          children: [],
          code: 'all_apply_data',
          name: '全部申请',
          select: false
        }
      ]
      this.apply_type.forEach(item => {
        this.privilege[8].children[4].children.push({
          active: false,
          select: false,
          children: [],
          code: `all_audit_${item.itemValue}`,
          name: `${item.itemName}数据`
        })
      })
      console.log(this.privilege[8].children[4], this.apply_type)
    },
    open () {
      this.resource = this.infoRole
      this.render(this.resource)
    },
    render (resource) {
      this.privilege.forEach(e => {
        if (e.children.length) {
          e.children.forEach(el => {
            if (el.children.length) {
              el.children.forEach(em => {
                em.select = resource.includes(em.code)
              })
              if (el.children.every(e => e.select)) {
                el.select = true
                el.active = false
              } else {
                el.select = false
                el.active = resource.includes(el.code)
              }
            } else {
              el.select = resource.includes(el.code)
              el.active = false
            }
          })
          if (e.children.every(e => e.select)) {
            e.select = true
            e.active = false
          } else {
            e.select = false
            e.active = resource.includes(e.code)
          }
        } else {
          e.select = resource.includes(e.code)
          e.active = false
        }
      })
    },
    moduleschange (item) {
      item.active = false
      item.children.length &&
        item.children.forEach(e => {
          e.select = item.select
          e.active = false
          e.children.length &&
            e.children.forEach(em => {
              em.select = item.select
            })
        })
    },
    menuchange (item) {
      if (item.select) item.active = false
      item.children.length &&
        item.children.forEach(e => {
          e.select = item.select
        })
      if (this.privilege[this.Index].children.every(e => e.select)) {
        this.privilege[this.Index].active = false
        this.privilege[this.Index].select = true
      } else {
        this.privilege[this.Index].select = false
        this.privilege[this.Index].active = this.privilege[
          this.Index
        ].children.some(e => e.select || e.active)
      }
    },
    itemchange (item) {
      this.privilege[this.Index].children.forEach(e => {
        if (e.id === item.id && e.children.length) {
          if (e.children.every(el => el.select)) {
            e.select = true
            e.active = false
          } else {
            e.select = false
            e.active = e.children.some(el => el.select)
          }
          if (this.privilege[this.Index].children.every(e => e.select)) {
            this.privilege[this.Index].active = false
            this.privilege[this.Index].select = true
          } else {
            this.privilege[this.Index].select = false
            this.privilege[this.Index].active = this.privilege[
              this.Index
            ].children.some(e => e.select || e.active)
          }
        }
      })
    },
    recursion (children, roleInfo) {
      if (children.length) {
        children.forEach(e => {
          if ((e.select || e.active) && !roleInfo.includes(e.code)) {
            roleInfo.push(e.code)
          }
          e.children &&
            e.children.length &&
            this.recursion(e.children, roleInfo)
        })
      } else {
        return roleInfo
      }
    },
    submit () {
      const roleInfo = []
      this.recursion(this.privilege, roleInfo)
      if (!roleInfo.length) {
        this.$message({
          type: 'warning',
          message: '请选择权限'
        })
        return
      }
      const data = {
        roleId: this.roleId,
        roleInfo: roleInfo.join()
      }
      this.$loading()
      api
        .saveRoler(data)
        .then(({ data }) => {
          this.$message({
            type: 'success',
            message: '授权成功'
          })
          this.Index = 0
          this.$loading().close()
          this.$emit('callbackFun', true)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '授权失败'
          })
          this.$loading().close()
        })
    },
    close () {
      this.$emit('callbackFun', false)
    }
  }
}
</script>

<style lang='scss'>
.purviewtree2 {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex !important;
    background: #fff;
  background: #fff;
  .modules {
    min-width: 150px;
    height: 500px;
    overflow-y: auto;
    color: #606266;
    margin-right: 10px;
    box-shadow: 0px 0px 4px 0px #d8dce6;
    border-radius: 2px;
    .module_title {
      font-size: 14px;
      text-align: center;
      padding: 15px 0 20px;
      font-weight: 600;
    }
    .module_li {
      line-height: 24px;
      padding-left: 22px;
      margin: 16px 0;
      font-size: 14px;
      position: relative;
      .el-checkbox {
        margin-right: 0;
      }
      &.active {
        color: #409eff;
      }
      &.active::before {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        height: 24px;
        width: 4px;
        background: #409eff;
      }
      .text {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .menus {
    flex: 1;
    height: 500px;
    overflow-y: auto;
    .menus_title {
      font-size: 14px;
      color: #606266;
      text-align: center;
      padding: 15px 0 20px;
      font-weight: 600;
    }
    .menus_li {
      font-size: 14px;
      color: #606266;
      background: #fafbfc;
      padding-left: 10px;
      line-height: 44px;
      margin-bottom: 10px;
      .resources_li {
        float: left;
        margin-right: 24px;
      }
    }
  }
}
</style>
