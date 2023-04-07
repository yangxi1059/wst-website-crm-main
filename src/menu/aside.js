/*
 * @Author: 库建华
 * @Date: 2019-12-25 15:50:55
 * @LastEditors: 杨曦
 * @LastEditTime: 2021-10-13 13:57:15
 * @Version: 1
 * @Description:
 */
// 菜单 侧边栏
export default [
  // { path: '/Home', title: '首页', icon: 'iconfont home' },
  // {
  //   title: 'WST',
  //   icon: 'iconfont folder-o',
  //   children: [
  //     { path: '/Header', title: 'Header' },
  //     { path: '/Footer', title: 'Footer' }
  //   ]
  // },
  // Home侧边栏
  {
    title: 'Home',
    icon: 'iconfont iconHomeSetting',
    path: '/Home'
  },
  {
    title: 'Success Stories',
    icon: 'iconfont iconSuccessStories',
    path: '/SuccessStories'
  },
  // Video Stories侧边栏
  {
    title: 'Video Stories',
    icon: 'iconfont iconVideoStories',
    path: '/VideoStories'
  },
  // Live侧边栏
  {
    title: 'Live',
    icon: 'iconfont iconLive',
    path: '/Live',
    children: [
      { path: '/Live_all', title: '全部直播' ,role:'Live_all'},
      { path: '/Live_oneToone', title: '导师一对多直播',role:'Live_oneToone' },
    ]
  },
  // 课程侧边栏
  {
    title: 'Course',
    icon: 'iconfont iconCourse',
    path: '/Course'
  },
  {
    title: 'Templates',
    icon: 'iconfont iconTemplates',
    path: '/Templates'
  },
  {
    title: 'Code',
    icon: 'iconfont iconCode',
    path: '/Code'
  },
  {
    title: 'Dictionary',
    icon: 'iconfont iconDictionary',
    path: '/Dictionary'
  },
  {
    title: 'User',
    icon: 'iconfont iconUser',
    path: '/User'
  },
  {
    title: 'Role',
    icon: 'iconfont iconRole',
    path: '/Role'
  },
  {
    title: 'Statistics',
    icon: 'iconfont iconStatistics',
    path: '/Statistics',
    children: [
          { path: '/Statistics_Live', title: 'Live',role:'Statistics Live' },
          { path: '/Statistics_Course', title: 'Course' ,role:'Statistics Course'},
          { path: '/Statistics_Seminar', title: 'Seminar' ,role:'Statistics Seminar'},
        ]
  },
  {
    title: 'Setting',
    icon: 'iconfont iconshezhi-7',   
    path: '/Setting',
    children: [
      { path: '/SettingV', title: '应用版本设置',role:'SettingV' },
      { path: '/weChatModelCheck', title: '小程序消息模板设置',role:'weChatModelCheck' },
    ]
  },
  {
    title: 'Certificate',
    icon: 'iconfont iconCertificate',   
    path: '/Certificate'
  },
  // {
  //   title: 'Event',
  //   icon: 'iconfont iconDictionary',
  //   path: '/Event'
  // },
  {
    title: 'Mentee Book',
    icon: 'iconfont iconDictionary',
    path: '/Mentee Book',
    children: [
      { path: '/book_administration', title: '书本管理',role:'book_administration' },
      { path: '/bookshilf_administration', title: '书架管理',role:'bookshilf_administration' },
      { path: '/book_watch', title: '书架一览',role:'book_watch' },
    ]
  },
  {
    title: 'Mentor Book',
    icon: 'iconfont iconDictionary',
    path: '/Mentor Book',
    children: [
      { path: '/book_administration_mentor', title: '书本管理',role:'book_administration_mentor' },
      { path: '/bookshilf_administration_mentor', title: '书架管理',role:'bookshilf_administration_mentor' },
      { path: '/book_watch_mentor', title: '书架一览',role:'book_watch_mentor' },
    ]
  },
  {
    title: 'AuthorizationCode',
    icon: 'iconfont iconCode',
    path: '/AuthorizationCode'
  },
  {
    title: 'Order Management',
    icon: 'iconfont iconshezhi-7',
    path: '/Order Management'
  }
  // Offers 侧边栏
  // {
  //   title: 'Offers',
  //   icon: 'iconfont folder-o',
  //   path: '/Offers'
  // },
  // Success Stories侧边栏

  // // Services侧边栏
  // {
  //   title: 'Services',
  //   icon: 'iconfont folder-o',
  //   path: '/Services'
  // },
  // // About侧边栏
  // {
  //   title: 'About',
  //   icon: 'iconfont folder-o',
  //   path: '/About'
  // },
  // {
  //   title: 'Blog',
  //   icon: 'iconfont folder-o',
  //   path: '/Blog'
  // }
]
