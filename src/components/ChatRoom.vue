<template>
  <div>
    <Modal v-model="modal" :fullscreen="true" width="800px" class="m">
      <p slot="header">
        <span>{{sshopname}}</span>
      </p>

      <Chatbox
        v-for="chatbox in chats"
        :Name="chatbox.name"
        :Time="chatbox.fmtime"
        :Content="chatbox.message"
        :key="chatbox.id"
        v-bind:class="select(chatbox)"
      ></Chatbox>

      <div slot="footer">
        <Input v-model="content" placeholder="Please Input">
          <Button type="primary" slot="append" @click="handleClick">Send</Button>
        </Input>
      </div>
    </Modal>
  </div>
</template>

<script>
import Chatbox from "@/components/Chatbox";
import axios from "@/axios";
// import { setInterval } from "timers";
export default {
  name: "ChatRoom",
  components: {
    Chatbox
  },
  props: {
    modal: Boolean,
    Id: String
  },
  data() {
    return {
      sshopname: "",
      content: "",
      chats: [],
      status: true
    };
  },
  methods: {
    sortByTime: function(a, b) {
      if (a.fmtime < b.fmtime) {
        return -1;
      }
      if (a.fmtime == b.fmtime) {
        return 0;
      } else {
        return 1;
      }
    },
    select: function(chatbox) {
      if (chatbox.type == 0) {
        return {
          onleft: false,
          onright: true
        };
      } else {
        return {
          onleft: false,
          onright: true
        };
      }
    },
    handleClick: function() {
      axios
        .post("/api/chat", {
          to: this.Id,
          message:this.content
        })
        .then(resposne => {
          console.log(resposne.body.success)
          // if (resposne.body.success) {
          //   this.$Notice.open({
          //     title: "Notification",
          //     desc: "Send Success"
          //   });
          // } else {
          //   this.$Notice.open({
          //     title: "Notification",
          //     desc: "Send Faild"
          //   });
          // }
        });
    }
  },
  computed: {},
  updated() {
    if (this.status == 1) {
      this.status++;
      setInterval(getChats, 1000);
    }
    let that = this;
    function getChats() {
      axios
        .get("/api/chat", {
          params: {
            to: that.Id
          }
        })
        .then(response => {
          let fromuser = response.data.fromUser;
          let touser = response.data.toUser;
          for (let f in fromuser) {
            fromuser[f].type = 0;
            fromuser[f].name = "我";
            fromuser[f].fmtime = new Date(fromuser[f].time);
          }
          for (let t in touser) {
            touser[t].type = 1;
            touser[t].name = this.sshopname;
            touser[t].fmtime = new Date(touser[t].time);
          }
          let content = fromuser.concat(touser);
          content.sort(that.sortByTime);
          for (let i = 0; i < content.length; i++) {
            content[i].id = i;
          }
          that.chats = content;
          console.log(that.chats)
        });
    }
    
    // getChats();
  },
  created () {
    axios
      .get("/store", {
        params: {
          id: this.Id
        }
      })
      .then(response => {
        console.log(response.data.name)
        this.sshopname = response.data.name;
      });
  }
};
</script>


<style scoped>
.onleft {
  position: relative;
  left: 5px;
}

.onright {
  position: relative;
  left: 70%;
}


</style>
