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
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.name }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="start">
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.startTime }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="update">
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.updateTime }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="content">
                        <Input type="text" v-model="editName" v-if="editIndex === index"/>
                        <span v-else>{{ row.content }}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <div v-if="editIndex === index">
                            <Button @click="handleSave(index)">保存</Button>
                            <Button @click="editIndex = -1">取消</Button>
                        </div>
                        <div v-else>
                            <Button @click="handleChat(row ,index)">聊天</Button>
                        </div>
                        <ChatRoom :modal="row.modal" :Id="row.id"></ChatRoom>
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
            handleChat: function (row, index) {
                this.$Notice.open({
                    title: 'chating',
                    desc: 'Chating'
                })
                row.modal = true
            }
        }
    }
</script>

<style scoped>

</style>
