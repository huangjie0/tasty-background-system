<template>
  <el-container>
    <el-aside width="200px">
      <div class="logo_title">
        <div class="logo_title_1">
          <img src="@/assets/image/logo.png" alt="" />
        </div>
        <!-- 头部左侧菜单布局start -->
        <el-menu
          default-active="/common/restaurant"
          class="el-menu-vertical-demo"
          text-color="#303030"
          active-text-color="#3c8984"
          :default-active="activePath"
          router
        >
          <el-menu-item :index="breadList[0].url">
            <i class="el-icon-fork-spoon"></i>
            <span slot="title">餐馆</span>
          </el-menu-item>
          <el-menu-item :index="breadList[1].url">
            <i class="el-icon-food"></i>
            <span slot="title">菜单</span>
          </el-menu-item>
          <el-menu-item :index="breadList[2].url">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单</span>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 头部左侧菜单布局end -->
      <el-button> 登出 </el-button>
    </el-aside>
    <el-container>
      <!-- 头部模块 -->
      <el-header>
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadList"
            :key="index"
            :to="{ path: item.url }"
            >{{ item.name }}</el-breadcrumb-item
          >
        </el-breadcrumb>
        <!-- 面包屑组件 -->
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Common",
  data() {
    return {
      //初始化模块以及名字
      breadList: [
        {
          url: "/common/restaurant",
          name: "restaurant",
        },
        {
          url: "/common/menus",
          name: "menus",
        },
        {
          url: "/common/order",
          name: "order",
        },
      ],
      //被激活的链接储存起来
      activePath: "",
    };
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-top: 30px;
  margin-left: 30px;
}
.el-button {
  width: 100px;
  margin: 0 auto 50px auto;
}
.el-aside {
  height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
}
.logo_title {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo_title_1 {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo_title_1 > img {
  height: 60px;
}
</style>