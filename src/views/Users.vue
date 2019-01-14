<template>
  <div class="animated fadeIn">
    <Row>
      <Col span="24">
        <h3 style="text-align:center">用户列表</h3>
      </Col>
    </Row>
    <Row>
      <Col :md="24">
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="name">
            <span>{{ row.username }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="email">
            <span>{{ row.email }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="avatar">
            <span>{{ row.avatar }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="permission">
            <span>{{row.permission}}</span>
          </template>

          <template slot-scope="{ row, index }" slot="action">
            <div>
              <Button type="error" @click="handleEdit(row, index)">移除</Button>
            </div>
          </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "Goods",
  data() {
    return {
      columns: [
        {
          title: "Name",
          slot: "name"
        },
        {
          title: "Email",
          slot: "email"
        },
        {
          title: "Avatar",
          slot: "avatar"
        },
        {
          title: "Permission",
          slot: "permission"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      data: []
    };
  },
  methods: {
    handleEdit(row, index) {
      axios
        .delete("/api/user", {
          params: {
            username: row.username
          }
        })
        .then(response => {
          if (response.success) {
            this.$Notice.open({
              title: "Notification",
              desc: "delete ok"
            });
          } else {
            this.$Notice.open({
              title: "Notification",
              desc: "error"
            });
          }
        });

      this.$router.go(0)
    }
  },
  created() {
    axios.get("api/getuser").then(response => {
      this.data = response.data.users;
      console.log(this.data);
    });
  }
};
</script>

<style scoped>
</style>
