<template>
  <div class="animated fadeIn">
    <Row>
      <Col span="24">
        <h3 style="text-align:center">聊天列表</h3>
      </Col>
    </Row>
    <Row>
      <Col :md="24">
        <Table :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="name">
            <span>{{ row.id }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="start">
            <span>{{ row.startTime }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="update">
            <span>{{ row.updateTime }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="unread">
            <span>{{ row.unread }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="action">
            <div>
              <Button @click="handleChat(row ,index)">聊天</Button>
            </div>
          </template>
        </Table>
      </Col>
    </Row>
    <ChatRoom :modal="modal"  :Id="id" v-on:on-modal-change="Change"></ChatRoom>
  </div>
</template>

<script>
import ChatRoom from "@/components/ChatRoom";
import axios from "@/axios";
export default {
  name: "Chat",
  components: { ChatRoom },
  data() {
    return {
      columns: [
        {
          title: "User Name",
          slot: "name"
        },
        {
          title: "Start Time",
          slot: "start"
        },
        {
          title: "Last Chat",
          slot: "update"
        },
        {
          title: "Unread",
          slot: "unread"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      data: [],
      status: 1,
      modal:false,
      id:''
    };
  },
  methods: {
    handleChat: function(row, index) {
      // this.$Notice.open({
      //   title: "chating",
      //   desc: "Chating"
      // });
      this.ChangeUnread(row);
      this.id=this.data[index].id
      this.modal=true;
    },
    Change: function(val) {
      this.modal=val
    },
    ChangeUnread: function(row) {
      axios
        .post("/api/changeunread", {
          fromid: row.id
        })
        .then(response => {
          if (response.success) {
            console.log("ook");
          } else {
            console.log("err");
          }
        });
    }
  },
  updated() {
    if (this.status === 1) {
      this.status++;
      setInterval(getallchats, 1000);
    }
    let that = this;
    function getallchats() {
      axios.get("/api/chatbymerchant").then(response => {
        let allchats = response.data.chats;
        allchats = allchats.map(current => {
          let unread = 0;
          for (let now of current.contents) {
            if (now.unread) {
              unread++;
            }
          }
          return {
            id: current.from,
            startTime: current.createdAt,
            updateTime: current.updatedAt,
            unread: unread,
            modal: false
          };
        });
        that.data = allchats;
      });
    }
  }
};
</script>

<style scoped>
</style>
