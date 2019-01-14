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
            <ChatRoom
              @cancel="handleCancel(row)"
              :modal="row.modal"
              :Id="row.id"
              v-on:on-modal-change="Change(row)"
            ></ChatRoom>
          </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>

<script>
import ChatRoom from "@/components/ChatRoom";
import axios from "@/axios"
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
      status: 1
    };
  },
  methods: {
    handleChat: function(row, index) {
      this.$Notice.open({
        title: "chating",
        desc: "Chating"
      });
      ChangeUnread(row)
      row.modal = true;
    },
    Change: function(row,val) {
      row.modal = val;
    },
    ChangeUnread:function(row){
        axios.post('/api/changeunread',{
            fromid:row.id
        }).then((response)=>{
            if(response.success)
            {
                console.log('ook')
            }
            else
            {
                console.log('err')
            }
        })
    }
  },
  created() {
    if (this.status === 1) {
      this.status++;
      setInterval(getallchats, 1000);
    }
    let that = this;
    function getallchats() {
        console.log('hi')
      axios.get("/api/chatbymerchant").then(response => {
        let allchats = response.body.chats;
        allchats = allchats.map(current => {
          let unread = 0;
          for (let now of current.contents) {
            if (now.unread) {
              unread++;
            }
          }
          return {
            id: current.from,
            createdAt: current.createdAt,
            updatedAt: current.updatedAt,
            unread:unread,
            modal:false
          };
        });
        that.data=allchats
      });
    }
  }
};
</script>

<style scoped>
</style>
