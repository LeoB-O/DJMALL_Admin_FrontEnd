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
                        <span>{{ row.name }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="start">
                        <span>{{ row.startTime }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="update">
                        <span>{{ row.updateTime }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="content">
                        <span>{{ row.content }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <div>
                            <Button @click="handleChat(row ,index)">聊天</Button>
                        </div>
                        <ChatRoom @cancel="handleCancel(row)" :modal="row.modal" :Id="row.id" v-on:on-modal-change="Change"></ChatRoom>
                    </template>
                </Table>
            </Col>

        </Row>
    </div>
</template>

<script>
    import ChatRoom from '@/components/ChatRoom'

    export default {
        name: "Chat",
        components: {ChatRoom},
        data() {
            return {
                columns: [
                    {
                        title: 'User Name',
                        slot: 'name'
                    },
                    {
                        title: 'Start Time',
                        slot: 'start'
                    },
                    {
                        title: 'Last Chat',
                        slot: 'update'
                    },
                    {
                        title: 'Content',
                        slot: 'content'
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                data: [
                    {
                        id: '123456',
                        name: '王小明',
                        startTime: new Date(),
                        updateTime: new Date(),
                        content: 'Hello world',
                        modal: false
                    },
                    {
                        id: '123456',
                        name: '张小刚',
                        startTime: new Date(),
                        updateTime: new Date(),
                        content: 'Hello world',
                        modal: false
                    },
                    {
                        id: '123456',
                        name: '李小红',
                        startTime: new Date(),
                        updateTime: new Date(),
                        content: 'Hello world',
                        modal:false
                    },
                    {
                        id: '123456',
                        name: '周小伟',
                        startTime: new Date(),
                        updateTime: new Date(),
                        content: 'Hello world',
                        modal: false
                    }
                ]
            }
        },
        methods: {
            handleCancel: function (row) {
                this.data[row._index].modal = false
                console.log('wtdfdddd')
            },
            handleChat: function (row, index) {
                this.$Notice.open({
                    title: 'chating',
                    desc: 'Chating'
                })
                this.data[row._index].modal = true
                row.modal = true
            },
            Change:function(val){
                this.modal=val
            }
        }
    }
</script>

<style scoped>

</style>
